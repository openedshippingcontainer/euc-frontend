/* eslint-disable no-plusplus,no-param-reassign */
import {
  OPEN_BRAKET,
  CLOSE_BRAKET,
  QUOTEMARK,
  BACKSLASH,
  SLASH,
  SPACE,
  TAB,
  EQ,
  N,
} from "../plugin-helper/char";

import {
  Token, TYPE_ATTR_NAME, TYPE_ATTR_VALUE, TYPE_NEW_LINE, TYPE_SPACE, TYPE_TAG, TYPE_WORD,
} from "./Token";
import { createCharGrabber, trimChar } from "./utils";
import { OptionsType } from "../core";

// for cases <!-- -->
const EM = "!";

/**
 * Creates a Token entity class
 * @param {String} type
 * @param {String} value
 * @param {Number} r line number
 * @param {Number} cl char number in line
 */
const createToken = (type: string, value: string | null, r = 0, cl = 0) => new Token(type, value, r, cl);

/**
 * @typedef {Object} Lexer
 * @property {Function} tokenize
 * @property {Function} isTokenNested
 */

/**
 * @param {String} buffer
 * @param {Object} options
 * @param {Function} options.onToken
 * @param {String} options.openTag
 * @param {String} options.closeTag
 * @param {Boolean} options.enableEscapeTags
 * @return {Lexer}
 */
function CreateLexer(buffer: string, options: OptionsType = {}) {
  let row = 0;
  let col = 0;

  let tokenIndex = -1;
  const tokens = new Array(Math.floor(buffer.length));
  const openTag = options.openTag || OPEN_BRAKET;
  const closeTag = options.closeTag || CLOSE_BRAKET;
  const escapeTags = options.enableEscapeTags;

  const RESERVED_CHARS = [closeTag, openTag, QUOTEMARK, BACKSLASH, SPACE, TAB, EQ, N, EM];
  const NOT_CHAR_TOKENS = [
    // ...(options.enableEscapeTags ? [BACKSLASH] : []),
    openTag, SPACE, TAB, N,
  ];
  const WHITESPACES = [SPACE, TAB];
  const SPECIAL_CHARS = [EQ, SPACE, TAB];

  const isCharReserved = (char: string) => (RESERVED_CHARS.indexOf(char) >= 0);
  const isWhiteSpace = (char: string) => (WHITESPACES.indexOf(char) >= 0);
  const isCharToken = (char: string) => (NOT_CHAR_TOKENS.indexOf(char) === -1);
  const isSpecialChar = (char: string) => (SPECIAL_CHARS.indexOf(char) >= 0);
  const isEscapableChar = (char: string) => (char === openTag || char === closeTag || char === BACKSLASH);
  const isEscapeChar = (char: string) => char === BACKSLASH;

  /**
   * Emits newly created token to subscriber
   * @param token
   */
  const emitToken = (token: Token) => {
    if (options.onToken)
      options.onToken(token);

    tokenIndex += 1;
    tokens[tokenIndex] = token;
  };

  /**
   * Parses params inside [myTag---params goes here---]content[/myTag]
   * @param str
   * @returns {{tag: *, attrs: Array}}
   */
  const parseAttrs = (str: string) => {
    let tagName: string | null = null;
    let skipSpecialChars = false;

    const attrTokens: Array<Token> = [];
    const attrCharGrabber = createCharGrabber(str, {});

    const validAttr = (char: string) => {
      const isEQ = char === EQ;
      const isWS = isWhiteSpace(char);
      const prevChar = attrCharGrabber.getPrev();
      const nextChar = attrCharGrabber.getNext();
      const isPrevSLASH = prevChar === BACKSLASH;
      const isTagNameEmpty = tagName === null;

      if (isTagNameEmpty)
        return (isEQ || isWS || attrCharGrabber.isLast()) === false;

      if (skipSpecialChars && isSpecialChar(char))
        return true;

      if (char === QUOTEMARK && !isPrevSLASH) {
        skipSpecialChars = !skipSpecialChars;

        if (
          !skipSpecialChars && !(nextChar === EQ || isWhiteSpace(nextChar!))
        ) {
          return false;
        }
      }

      // Hopefully this won't break anything too important.
      return ((isEQ && isTagNameEmpty) || isWS) === false;
    };

    const nextAttr = () => {
      const attrStr = attrCharGrabber.grabWhile(validAttr);
      const currChar = attrCharGrabber.getCurr();

      // first string before space is a tag name [tagName params...]
      if (tagName === null) {
        tagName = attrStr;
      } else if (isWhiteSpace(currChar) || currChar === QUOTEMARK || !attrCharGrabber.hasNext()) {
        // Yup. It sucks.
        const escaped = trimChar(attrStr, QUOTEMARK).replace(new RegExp("\\\\\"", "g"), "\"");
        attrTokens.push(createToken(TYPE_ATTR_VALUE, escaped, row, col));
      } else {
        attrTokens.push(createToken(TYPE_ATTR_NAME, attrStr, row, col));
      }

      attrCharGrabber.skip();
    };

    while (attrCharGrabber.hasNext()) {
      nextAttr();
    }

    return { tag: tagName, attrs: attrTokens };
  };

  const bufferGrabber = createCharGrabber(buffer, {
    onSkip: () => {
      col++;
    },
  });

  const next = () => {
    const currChar = bufferGrabber.getCurr();
    const nextChar = bufferGrabber.getNext();

    if (currChar === N) {
      bufferGrabber.skip();
      col = 0;
      row++;

      emitToken(createToken(TYPE_NEW_LINE, currChar, row, col));
    } else if (isWhiteSpace(currChar)) {
      const str = bufferGrabber.grabWhile(isWhiteSpace);
      emitToken(createToken(TYPE_SPACE, str, row, col));
    } else if (escapeTags && isEscapeChar(currChar) && isEscapableChar(nextChar!)) {
      bufferGrabber.skip(); // skip the \ without emitting anything
      bufferGrabber.skip(); // skip past the [, ] or \ as well
      emitToken(createToken(TYPE_WORD, nextChar, row, col));
    } else if (currChar === openTag) {
      bufferGrabber.skip(); // skip openTag

      // detect case where we have "[My word [tag][/tag]" or we have "[My last line word"
      const substr = bufferGrabber.substrUntilChar(closeTag);
      const hasInvalidChars = substr.length === 0 || substr.indexOf(openTag) >= 0;

      if (isCharReserved(nextChar!) || hasInvalidChars || bufferGrabber.isLast()) {
        emitToken(createToken(TYPE_WORD, currChar, row, col));
      } else {
        const str = bufferGrabber.grabWhile((val: string) => val !== closeTag);

        bufferGrabber.skip(); // skip closeTag
        // [myTag   ]
        const isNoAttrsInTag = str.indexOf(EQ) === -1;
        // [/myTag]
        const isClosingTag = str[0] === SLASH;

        if (isNoAttrsInTag || isClosingTag) {
          emitToken(createToken(TYPE_TAG, str, row, col));
        } else {
          const parsed = parseAttrs(str);

          emitToken(createToken(TYPE_TAG, parsed.tag, row, col));

          parsed.attrs.map(emitToken);
        }
      }
    } else if (currChar === closeTag) {
      bufferGrabber.skip(); // skip closeTag

      emitToken(createToken(TYPE_WORD, currChar, row, col));
    } else if (isCharToken(currChar)) {
      if (escapeTags && isEscapeChar(currChar) && !isEscapableChar(nextChar!)) {
        bufferGrabber.skip();
        emitToken(createToken(TYPE_WORD, currChar, row, col));
      } else {
        const str = bufferGrabber.grabWhile((char: string) => {
          if (escapeTags)
            return isCharToken(char) && !isEscapeChar(char);
          return isCharToken(char);
        });

        emitToken(createToken(TYPE_WORD, str, row, col));
      }
    }
  };

  const tokenize = () => {
    while (bufferGrabber.hasNext())
      next();

    tokens.length = tokenIndex + 1;
    return tokens;
  };

  const IsTokenNested = (token: Token) => {
    const value = openTag + SLASH + token.getValue();
    // potential bottleneck
    return buffer.indexOf(value) > -1;
  };

  return {
    tokenize,
    IsTokenNested,
  };
}

export const createTokenOfType = createToken;
export { CreateLexer };
