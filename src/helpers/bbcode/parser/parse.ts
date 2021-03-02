import { TagNode } from "../plugin-helper/TagNode";
import { IsTagNode } from "../plugin-helper";
import { CreateLexer } from "./lexer";
import { CreateList } from "./utils";
import { Token } from "./Token";
import { OptionsType } from "../core";

/**
 * @public
 * @param {String} input
 * @param {Object} opts
 * @param {Function} opts.createTokenizer
 * @param {Array<string>} opts.onlyAllowTags
 * @param {String} opts.openTag
 * @param {String} opts.closeTag
 * @param {Boolean} opts.enableEscapeTags
 * @return {Array}
 */
export const Parse = (input: string, opts: OptionsType = {}) => {
  const options = opts;

  let tokenizer: any = null;

  /**
   * Result AST of nodes
   * @private
   * @type {ItemList}
   */
  const nodes = CreateList();

  /**
   * Temp buffer of nodes that"s nested to another node
   * @private
   * @type {ItemList}
   */
  const nestedNodes = CreateList();

  /**
   * Temp buffer of nodes [tag..]...[/tag]
   * @private
   * @type {ItemList}
   */
  const tagNodes = CreateList();

  /**
   * Temp buffer of tag attributes
   * @private
   * @type {ItemList}
   */
  const tagNodesAttrName = CreateList();

  /**
   * Cache for nested tags checks
   * @type {{}}
   */
  const nestedTagsMap: Record<string, Token> = {};

  const IsTokenNested = (token: Token) => {
    if (typeof nestedTagsMap[token.getValue()] === "undefined")
      nestedTagsMap[token.getValue()] = tokenizer.IsTokenNested(token);
    return nestedTagsMap[token.getValue()];
  };

  /**
   * @param tagName
   * @returns {boolean}
   */
  const IsTagNested = (tagName: string) => !!nestedTagsMap[tagName];

  /**
   * @private
   * @param {String} value
   * @return {boolean}
   */
  const IsAllowedTag = (value: string) => {
    if (options.onlyAllowTags && options.onlyAllowTags.length)
      return options.onlyAllowTags.indexOf(value) >= 0;
    return true;
  };

  /**
   * Flushes temp tag nodes and its attributes buffers
   * @private
   * @return {Array}
   */
  const FlushTagNodes = () => {
    if (tagNodes.flushLast()) {
      tagNodesAttrName.flushLast();
    }
  };

  /**
   * @private
   * @return {Array}
   */
  const GetNodes = () => {
    const lastNestedNode = nestedNodes.getLast();
    if (lastNestedNode && Array.isArray(lastNestedNode.content))
      return lastNestedNode.content;

    return nodes.toArray();
  };

  /**
   * @private
   * @param {string|TagNode} node
   */
  const appendNodes = (node: any) => {
    const items = GetNodes();

    if (Array.isArray(items)) {
      if (IsTagNode(node)) {
        if (IsAllowedTag(node.tag)) {
          items.push(node.toTagNode());
        } else {
          items.push(node.toString());
        }
      } else {
        items.push(node);
      }
    }
  };

  /**
   * @private
   * @param {Token} token
   */
  const HandleTagStart = (token: Token) => {
    FlushTagNodes();

    const tagNode = TagNode.create(token.getValue());
    const isNested = IsTokenNested(token);

    tagNodes.push(tagNode);

    if (isNested) {
      nestedNodes.push(tagNode);
    } else {
      appendNodes(tagNode);
    }
  };

  /**
   * @private
   * @param {Token} token
   */
  const HandleTagEnd = (token: Token) => {
    FlushTagNodes();

    const lastNestedNode = nestedNodes.flushLast();

    if (lastNestedNode) {
      appendNodes(lastNestedNode);
    } else if (typeof options.onError === "function") {
      const tag = token.getValue();
      const line = token.getLine();
      const column = token.getColumn();

      options.onError({
        message: `Inconsistent tag "${tag}" on line ${line} and column ${column}`,
        tagName: tag,
        lineNumber: line,
        columnNumber: column,
      });
    }
  };

  /**
   * @private
   * @param {Token} token
   */
  const HandleTag = (token: Token) => {
    // [tag]
    if (token.isStart()) {
      HandleTagStart(token);
    }

    // [/tag]
    if (token.isEnd()) {
      HandleTagEnd(token);
    }
  };

  /**
   * @private
   * @param {Token} token
   */
  const HandleNode = (token: Token) => {
    /**
     * @type {TagNode}
     */
    const lastTagNode = tagNodes.getLast();
    const tokenValue = token.getValue();
    const isNested = IsTagNested(token.getName());

    if (lastTagNode) {
      if (token.isAttrName()) {
        tagNodesAttrName.push(tokenValue);
        lastTagNode.attr(tagNodesAttrName.getLast(), "");
      } else if (token.isAttrValue()) {
        const attrName = tagNodesAttrName.getLast();

        if (attrName) {
          lastTagNode.attr(attrName, tokenValue);
          tagNodesAttrName.flushLast();
        } else {
          lastTagNode.attr(tokenValue, tokenValue);
        }
      } else if (token.isText()) {
        if (isNested) {
          lastTagNode.append(tokenValue);
        } else {
          appendNodes(tokenValue);
        }
      } else if (token.isTag()) {
        // if tag is not allowed, just past it as is
        appendNodes(token.toString());
      }
    } else if (token.isText()) {
      appendNodes(tokenValue);
    } else if (token.isTag()) {
      // if tag is not allowed, just past it as is
      appendNodes(token.toString());
    }
  };

  /**
   * @private
   * @param {Token} token
   */
  const onToken = (token: Token) => {
    if (token.isTag()) {
      HandleTag(token);
    } else {
      HandleNode(token);
    }
  };

  tokenizer = (opts.createTokenizer ? opts.createTokenizer : CreateLexer)(input, {
    onToken,
    onlyAllowTags: options.onlyAllowTags,
    openTag: options.openTag,
    closeTag: options.closeTag,
    enableEscapeTags: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tokens = tokenizer.tokenize();

  return nodes.toArray();
};
