import React from "react";

import { styled } from "baseui";
import { ListItem } from "baseui/list";

export const ForumList = styled("ul", {
  display: "inline",
  paddingLeft: 0,
  paddingRight: 0
});


interface ForumListItemProps {
  artwork?: React.ReactNode;
  endEnhancer?: React.ReactNode;
  noPaddingRight?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onAuxClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  children: any;
}

const Wrapper = styled("div", {
  display: "flex",
  flex: 1,
  cursor: "pointer"
});

export const ForumListItem = ({
  artwork,
  endEnhancer,
  noPaddingRight,
  onClick,
  onAuxClick,
  children
}: ForumListItemProps) => (
  <ListItem
    artwork={artwork}
    endEnhancer={endEnhancer}
    overrides={{
      ArtworkContainer: {
        style: ({ $theme }) => ({
          width: "auto",
          paddingLeft: $theme.sizing.scale200,
          paddingRight: $theme.sizing.scale500
        })
      },
      Root: {
        style: ({ $theme }) => ({
          transitionProperty: "background-color",
          transitionDuration: "0.1s",
          transitionTimingFunction: $theme.animation.easeInOutCurve,
          ":hover": { backgroundColor: $theme.colors.backgroundSecondary }
        })
      },
      Content: {
        style: ({ $theme }) => ({
          paddingRight: noPaddingRight ? "unset" : $theme.sizing.scale200,
          height: "60px",
          borderBottomStyle: "none"
        })
      },
      EndEnhancerContainer: { style: { height: "100%" } }
    }}
  >
    <Wrapper
      onClick={onClick}
      onAuxClick={onAuxClick}
    >
      <div>{children}</div>
    </Wrapper>
  </ListItem>
);
