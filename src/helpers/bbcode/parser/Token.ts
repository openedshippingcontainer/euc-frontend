import {
  OPEN_BRAKET,
  CLOSE_BRAKET,
  SLASH,
} from "../plugin-helper/char";

// type, value, line, row,
const TOKEN_TYPE_ID = "type"; // 0;
const TOKEN_VALUE_ID = "value"; // 1;
const TOKEN_COLUMN_ID = "row"; // 2;
const TOKEN_LINE_ID = "line"; // 3;

const TOKEN_TYPE_WORD = "word";
const TOKEN_TYPE_TAG = "tag";
const TOKEN_TYPE_ATTR_NAME = "attr-name";
const TOKEN_TYPE_ATTR_VALUE = "attr-value";
const TOKEN_TYPE_SPACE = "space";
const TOKEN_TYPE_NEW_LINE = "new-line";

/**
 * @param {Token} token
 * @returns {string}
 */
const getTokenValue = (token: Token) => {
  if (token && typeof token[TOKEN_VALUE_ID] !== "undefined")
    return token[TOKEN_VALUE_ID];
  return "";
};
/**
 * @param {Token}token
 * @returns {number}
 */
const getTokenLine = (token: Token) => (token && token[TOKEN_LINE_ID]) || 0;
const getTokenColumn = (token: Token) => (token && token[TOKEN_COLUMN_ID]) || 0;

/**
 * @param {Token} token
 * @returns {boolean}
 */
const isTextToken = (token: Token) => {
  if (token && typeof token[TOKEN_TYPE_ID] !== "undefined") {
    return token[TOKEN_TYPE_ID] === TOKEN_TYPE_SPACE
        || token[TOKEN_TYPE_ID] === TOKEN_TYPE_NEW_LINE
        || token[TOKEN_TYPE_ID] === TOKEN_TYPE_WORD;
  }

  return false;
};

/**
 * @param {Token} token
 * @returns {boolean}
 */
const isTagToken = (token: Token) => {
  if (token && typeof token[TOKEN_TYPE_ID] !== "undefined")
    return token[TOKEN_TYPE_ID] === TOKEN_TYPE_TAG;
  return false;
};
const isTagEnd = (token: Token) => getTokenValue(token).charCodeAt(0) === SLASH.charCodeAt(0);
const isTagStart = (token: Token) => !isTagEnd(token);
const isAttrNameToken = (token: Token) => {
  if (token && typeof token[TOKEN_TYPE_ID] !== "undefined")
    return token[TOKEN_TYPE_ID] === TOKEN_TYPE_ATTR_NAME;
  return false;
};

/**
 * @param {Token} token
 * @returns {boolean}
 */
const isAttrValueToken = (token: Token) => {
  if (token && typeof token[TOKEN_TYPE_ID] !== "undefined")
    return token[TOKEN_TYPE_ID] === TOKEN_TYPE_ATTR_VALUE;
  return false;
};

const getTagName = (token: Token) => {
  const value = getTokenValue(token);
  return isTagEnd(token) ? value.slice(1) : value;
};

const convertTagToText = (token: Token) => {
  return OPEN_BRAKET + getTokenValue(token) + CLOSE_BRAKET;
};

export class Token {
  [key: string]: any;

  /**
   * @param {String} type
   * @param {String} value
   * @param line
   * @param row
   */
  constructor(
    type: string,
    value: string | null,
    line: number,
    row: number
  ) {
    this[TOKEN_TYPE_ID] = String(type);
    this[TOKEN_VALUE_ID] = String(value);
    this[TOKEN_LINE_ID] = Number(line);
    this[TOKEN_COLUMN_ID] = Number(row);
  }

  isEmpty() {
    return !!this[TOKEN_TYPE_ID];
  }

  isText() {
    return isTextToken(this);
  }

  isTag() {
    return isTagToken(this);
  }

  isAttrName() {
    return isAttrNameToken(this);
  }

  isAttrValue() {
    return isAttrValueToken(this);
  }

  isStart() {
    return isTagStart(this);
  }

  isEnd() {
    return isTagEnd(this);
  }

  getName() {
    return getTagName(this);
  }

  getValue() {
    return getTokenValue(this);
  }

  getLine() {
    return getTokenLine(this);
  }

  getColumn() {
    return getTokenColumn(this);
  }

  toString() {
    return convertTagToText(this);
  }
}

export const TYPE_ID = TOKEN_TYPE_ID;
export const VALUE_ID = TOKEN_VALUE_ID;
export const LINE_ID = TOKEN_LINE_ID;
export const COLUMN_ID = TOKEN_COLUMN_ID;
export const TYPE_WORD = TOKEN_TYPE_WORD;
export const TYPE_TAG = TOKEN_TYPE_TAG;
export const TYPE_ATTR_NAME = TOKEN_TYPE_ATTR_NAME;
export const TYPE_ATTR_VALUE = TOKEN_TYPE_ATTR_VALUE;
export const TYPE_SPACE = TOKEN_TYPE_SPACE;
export const TYPE_NEW_LINE = TOKEN_TYPE_NEW_LINE;
