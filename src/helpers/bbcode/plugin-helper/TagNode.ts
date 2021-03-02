import { OPEN_BRAKET, CLOSE_BRAKET, SLASH } from './char';
import {
  GetNodeLength,
  AppendToNode,
  AttributesToString,
  GetUniqueAttribute,
  GetAttributeValue
} from './index';

const getTagAttrs = (tag: string, params: Record<string, any>) => {
  const uniqAattr = GetUniqueAttribute(params);

  if (uniqAattr) {
    const tagAttr = GetAttributeValue(tag, uniqAattr);
    const attrs = { ...params };
    delete attrs[uniqAattr];

    return `${tagAttr}${AttributesToString(attrs)}`;
  }

  return `${tag}${AttributesToString(params)}`;
};

export class TagNode {
  tag: string;
  attrs: Record<string, unknown>;
  content: Array<any>;

  constructor(
    tag: string,
    attrs: Record<string, unknown>,
    content: unknown
  ) {
    this.tag = tag;
    this.attrs = attrs;
    this.content = [].concat(content as any);
  }

  attr(name: string, value?: string) {
    if (typeof value !== 'undefined') {
      this.attrs[name] = value;
    }

    return this.attrs[name];
  }

  append(value: string) {
    return AppendToNode(this, value);
  }

  get length() {
    return GetNodeLength(this);
  }

  toTagNode() {
    return new TagNode(this.tag.toLowerCase(), this.attrs, this.content);
  }

  toString(): string {
    const OB = OPEN_BRAKET;
    const CB = CLOSE_BRAKET;
    const isEmpty = this.content.length === 0;
    const content = this.content.reduce((r, node) => r + node.toString(), '');
    const tagAttrs = getTagAttrs(this.tag, this.attrs);

    if (isEmpty) {
      return `${OB}${tagAttrs}${CB}`;
    }

    return `${OB}${tagAttrs}${CB}${content}${OB}${SLASH}${this.tag}${CB}`;
  }

  static create = (
    tag: string,
    attrs = {},
    content = []
  ) => new TagNode(tag, attrs, content);

  static isOf = (node: TagNode, type: string) => (node.tag === type);
}