import { N } from "./char";
import { TagNode } from "./TagNode";

export const IsTagNode = (el: any) => typeof el === "object" && !!el.tag;
export const IsStringNode = (el: any) => typeof el === "string";
export const IsEOL = (el: any) => el === N;

export const GetNodeLength = (node: TagNode): number => {
  if (IsTagNode(node)) {
    return node.content.reduce(
      (count, contentNode) => count + GetNodeLength(contentNode),
      0
    );
  } else if (IsStringNode(node)) {
    return node.length;
  }

  return 0;
};

/**
 * Appends value to Tag Node
 * @param {TagNode} node
 * @param value
 */
export const AppendToNode = (node: TagNode, value: string) => {
  node.content.push(value);
};

/**
 * Replaces " to &qquot;
 * @param {String} value
 */
export const EscapeHTML = (value: string) => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/"/g, "&#039;")
  // eslint-disable-next-line no-script-url
  .replace(/(javascript):/gi, "$1%3A");

/**
 * Accept name and value and return valid html5 attribute string
 * @param {String} name
 * @param {String} value
 * @return {string}
 */
export const GetAttributeValue = (name: string, value: any): string => {
  const type = typeof value;

  const types: Record<string, () => string> = {
    boolean: () => (value ? `${name}` : ""),
    number: () => `${name}="${value}"`,
    string: () => `${name}="${EscapeHTML(value)}"`,
    object: () => `${name}="${EscapeHTML(JSON.stringify(value))}"`,
  };

  return types[type] ? types[type]() : "";
};

/**
 * Transforms attrs to html params string
 * @param values
 */
export const AttributesToString = (values: Record<string, unknown>) => {
  // To avoid some malformed attributes
  if (typeof values === "undefined") {
    return "";
  }

  return Object.keys(values)
    .reduce((arr, key) => [...arr, GetAttributeValue(key, values[key])], [""])
    .join(" ");
};

/**
 * Gets value from
 * @example
 * GetUniqueAttribute({ "foo": true, "bar": bar" }) => "bar"
 * @param attrs
 * @returns {string}
 */
export const GetUniqueAttribute = (attrs: Record<string, any>): any => Object
  .keys(attrs)
  .reduce((_, key) => (attrs[key] === key ? attrs[key] : null), null);