/* eslint-disable no-plusplus,no-lonely-if */
import { GetUniqueAttribute, IsStringNode, IsTagNode } from "../plugin-helper";
import { TagNode } from "../plugin-helper/TagNode";

const isStartsWith = (node: string, type: string) => (node[0] === type);

const AsListItems = (content: Array<any>) => {
  let listIdx = 0;
  const listItems: Array<any> = [];

  const createItemNode = () => TagNode.create("li");
  const ensureListItem = (val: TagNode) => {
    listItems[listIdx] = listItems[listIdx] || val;
  };
  const addItem = (val: TagNode) => {
    if (listItems[listIdx] && listItems[listIdx].content) {
      listItems[listIdx].content = listItems[listIdx].content.concat(val);
    } else {
      listItems[listIdx] = listItems[listIdx].concat(val);
    }
  };

  if (content.length !== 0) {
    const start_element = content[0];
    if (IsStringNode(start_element)) {
      const is_new_line = (
        isStartsWith(start_element, "\n") ||
        isStartsWith(start_element, "\r\n")
      );

      // Overwrite new line
      if (is_new_line)
        content[0] = content[0].substring(2);
    }
  }

  content.forEach((el) => {
    if (IsStringNode(el) && isStartsWith(el, "*")) {
      if (listItems[listIdx]) {
        listIdx++;
      }
      ensureListItem(createItemNode());
      addItem(el.substr(1));
    } else if (IsTagNode(el) && TagNode.isOf(el, "*")) {
      if (listItems[listIdx]) {
        listIdx++;
      }
      ensureListItem(createItemNode());
    } else if (!IsTagNode(listItems[listIdx])) {
      listIdx++;
      ensureListItem(el);
    } else if (listItems[listIdx]) {
      addItem(el);
    } else {
      ensureListItem(el);
    }
  });

  return ([] as Array<any>).concat(listItems);
};

export interface OptionalNodeType {
  tag: string | React.ReactNode;
  attrs?: Record<string, unknown>;
  content?: any;
}

export interface InterfaceType {
  [key: string]: (node: TagNode) => OptionalNodeType | undefined;
}

export const DefaultPreset: InterfaceType = {
  b: (node) => ({
    tag: "span",
    attrs: {
      style: { fontWeight: "bold" },
    },
    content: node.content,
  }),
  i: (node) => ({
    tag: "span",
    attrs: {
      style: { fontStyle: "italic" },
    },
    content: node.content,
  }),
  u: (node) => ({
    tag: "span",
    attrs: {
      style: { textDecoration: "underline" },
    },
    content: node.content,
  }),
  s: (node) => ({
    tag: "span",
    attrs: {
      style: { textDecoration: "line-through" },
    },
    content: node.content,
  }),
  r: (node) => ({
    tag: "span",
    attrs: {
      style: { textAlign: "right" },
    },
    content: node.content,
  }),
  right: (node) => ({
    tag: "span",
    attrs: {
      style: { textAlign: "right" },
    },
    content: node.content,
  }),
  j: (node) => ({
    tag: "div",
    attrs: {
      style: { textAlign: "justify" },
    },
    content: node.content,
  }),
  justify: (node) => ({
    tag: "div",
    attrs: {
      style: { textAlign: "justify" },
    },
    content: node.content,
  }),
  c: (node) => ({
    tag: "div",
    attrs: {
      style: { textAlign: "center" },
    },
    content: node.content,
  }),
  center: (node) => ({
    tag: "div",
    attrs: {
      style: { textAlign: "center" },
    },
    content: node.content,
  }),
  color: (node) => ({
    tag: "span",
    attrs: {
      style: { color: GetUniqueAttribute(node.attrs) }
    },
    content: node.content,
  }),
  font: (node) => ({
    tag: "span",
    attrs: {
      style: { fontFamily: GetUniqueAttribute(node.attrs) }
    },
    content: node.content,
  }),
  size: (node) => {
    const attribute = GetUniqueAttribute(node.attrs);
    if (!attribute)
      return undefined;

    let value = +attribute;
    if (isNaN(value))
      return undefined;

    // Imitate <font size=N> behavior
    // To maintain compatibility with old BBCode
    value = 10 + value * 2;

    // Clamp value in the [12, 24]px range
    if (value < 12) value = 12;
    if (value > 24) value = 24;

    return {
      tag: "span",
      attrs: {
        style: { fontSize: `${value}px` }
      },
      content: node.content
    }
  },
  ol: (node) => ({
    tag: "ol",
    attrs: {
      style: { marginBlockStart: 0, marginBlockEnd: 0 }
    },
    content: AsListItems(node.content),
  }),
  ul: (node) => ({
    tag: "ul",
    attrs: {
      style: { marginBlockStart: 0, marginBlockEnd: 0 }
    },
    content: AsListItems(node.content),
  })
};
