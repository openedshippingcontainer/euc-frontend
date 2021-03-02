import React from "react";

import { styled } from "baseui";
import { StatefulTreeView, TreeNode } from "baseui/tree-view";

import * as Helpers from "../../helpers";

const Label = styled("div", ({ $theme }) => ({
  display: "flex",
  flexGrow: 1,
  wordBreak: "break-all",
  paddingRight: $theme.sizing.scale200,
  color: $theme.colors.primaryA
}));

const FileSize = styled("span", {
  marginLeft: "auto"
});

const FileName = styled("span", ({ $theme }) => ({
  marginRight: $theme.sizing.scale400
}));

interface TreeInfoType {
  name: string;
  size: number;
}

type NodeType = TreeNode<TreeInfoType>;

const CustomTreeViewLabel = (node: NodeType) => (
  <Label>
    <FileName>{node.info ? node.info.name : null}</FileName>
    <FileSize>
      {node.info && node.children!.length === 0 ? (
        Helpers.GetSizeFromBytes(node.info.size)
      ) : null}
    </FileSize>
  </Label>
);

type TreeType = Array<NodeType>;

interface ContextState {
  result: TreeType;
  [key: string]: TreeType;
}

// Copy-pasted from https://stackoverflow.com/questions/57344694/create-a-tree-from-a-list-of-strings-containing-paths-of-files-javascript
const GenerateFilePathTree = (files: Array<TorrentFile>) => {
  const final_result: TreeType = [];
  const initial_state: ContextState = { result: final_result };

  let id = 1;
  files.forEach((file) => {
    file.filename.split("/").reduce<NodeType>(
      (accumulator: NodeType, name: string) => {
        if (!accumulator[name as any]) {
          accumulator[name as any] = { result: [] };
          accumulator.result.push({
            id: id++,
            label: CustomTreeViewLabel,
            info: { name: name, size: file.size },
            children: accumulator[name as any].result
          });
        }

       return accumulator[name as any];
    }, initial_state as any);
  });

  return final_result;
}

const SortByName = (a: NodeType, b: NodeType) => (
  a.info!.name.localeCompare(b.info!.name, "sr", { numeric: true })
);

const SortByChildren = (a: NodeType, b: NodeType) => (
  (a.children!.length !== 0 && b.children!.length === 0) ? -1 : 1
);

const SortChildren = (tree: Array<NodeType>) => {
  tree.sort((a, b) => SortByName(a, b))
      .sort((a, b) => SortByChildren(a, b));

  tree.forEach((obj) => {
    if (obj.children && obj.children.length !== 0)
      SortChildren(obj.children);
  });
}

interface Props {
  files: Array<TorrentFile>;
}

export const TorrentFileTreeView = ({ files }: Props) => {
  const tree = GenerateFilePathTree(files);
  SortChildren(tree);

  return (
    <StatefulTreeView
      indentGuides
      data={tree}
      overrides={{
        TreeLabel: {
          style: ({ $theme }) => ({
            ":hover": { backgroundColor: $theme.colors.buttonMinimalHover }
          })
        }
      }}
    />
  );
};