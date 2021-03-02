import React from "react";

import { TagNode } from "../parser";
import { ParserInstance, OptionsType } from "../core";
import { IsTagNode, IsStringNode } from "../plugin-helper";

import * as HTML from "../html";

const ToAST = (source: any, plugins: any, options: OptionsType) => (
  ParserInstance(plugins)
    .process(source, {
      ...options,
      render: (input: any) => HTML.RenderNodes(input, { stripTags: true }),
    }).tree
);

function TagToReactElement(
  node: TagNode,
  index: number
) {
  return React.createElement(
    node.tag,
    { ...node.attrs, key: index },
    node.content ? RenderToReactNodes(node.content) : null
  );
}

function RenderToReactNodes(nodes: Array<any>) {
  const els = ([] as Array<any>)
    .concat(nodes)
    .reduce((arr, node, index) => {
      if (IsTagNode(node)) {
        arr.push(TagToReactElement(node, index));
      } else if (IsStringNode(node)) {
        arr.push(node);
      }

      return arr;
    }, [] as Array<any>);

  return els;
}

export function RenderBBCode(source: string, plugins: any, options: { onlyAllowTags: string[]; }) {
  return RenderToReactNodes(ToAST(source, plugins, options));
}