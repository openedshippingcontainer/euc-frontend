import { ParserInstance } from "../core";
import { AttributesToString } from "../plugin-helper";
import { TagNode } from "../parser";

const SELFCLOSE_END_TAG = "/>";
const CLOSE_START_TAG = "</";
const START_TAG = "<";
const END_TAG = ">";

interface NodeOptions {
  stripTags: boolean;
}

const RenderNode = (
  node: TagNode,
  { stripTags = false }: NodeOptions
): React.ReactNode => {
  if (!node)
    return "";

  const type = typeof node;
  if (type === "string" || type === "number")
    return node;

  if (type === "object") {
    if (stripTags === true)
      return RenderNodes(node.content, { stripTags });

    if (node.content === null) {
      return [
        START_TAG,
        node.tag,
        AttributesToString(node.attrs),
        SELFCLOSE_END_TAG
      ].join("");
    }

    return [
      START_TAG,
      node.tag,
      AttributesToString(node.attrs),
      END_TAG,
      RenderNodes(node.content),
      CLOSE_START_TAG,
      node.tag,
      END_TAG
    ].join("");
  }

  if (Array.isArray(node))
    return RenderNodes(node, { stripTags });

  return "";
};

export const RenderNodes = (
  nodes: Array<TagNode>,
  { stripTags = false } = {}
) => ([] as Array<TagNode>)
  .concat(nodes)
  .reduce((r, node) => r + RenderNode(node, { stripTags }), "");

export const ToHTML = (source: any, plugins: any, options: any) => (
  ParserInstance(plugins)
    .process(source, { ...options, render: RenderNodes }).html
);