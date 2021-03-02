import React from "react";

import { Tag, KIND } from "baseui/tag";

interface Props {
  kind: KIND[keyof KIND];
  text: string;
}

export const TorrentTag = (props: Props) => (
  <Tag
    closeable={false}
    kind={props.kind}
    variant="outlined"
    overrides={{
      Root: {
        style: ({ $theme }) => ({
          marginTop: $theme.sizing.scale0,
          marginRight: $theme.sizing.scale0,
          marginBottom: $theme.sizing.scale0,
          marginLeft: $theme.sizing.scale0,
        })
      },
      Text: { style: { fontWeight: "bold" } }
    }}
  >
    {props.text}
  </Tag>
);