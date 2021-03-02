import React from "react";

import { styled, withStyle } from "baseui";

import { useScreenClass } from "../helpers/UseScreenClass";

interface RequiredProps {
  $width: number;
  $height: number;
}

const Padding = styled("div", (props: RequiredProps) => ({
  marginTop: `${2 * props.$height}px`,
  marginRight: `${8 * props.$width}px`,
  marginBottom: `${8 * props.$height}px`,
  marginLeft: `${8 * props.$width}px`
}));

interface OptionalProps {
  width?: number;
  height?: number;
  children?: any;
}

export const ContentWrapper = (props: OptionalProps) => {
  const screen = useScreenClass();

  const width = props.width ?? 12;
  const height = props.height ?? 4;

  // Adjust horizontal padding according to screen size
  // If screen size is xs, sm or md, then there is no
  // horizontal padding applied
  const is_mobile = ["xs", "sm", "md"].includes(screen);
  const content_width = (
    is_mobile ? 0 : (screen === "xxl" ? (width * 3) : width)
  );

  return (
    <Padding
      $width={content_width}
      $height={height}
    >
      {props.children}
    </Padding>
  );
};

export const CenterVertically = styled("div", {
  display: "flex",
  alignItems: "center"
});

export const CenterHorizontally = styled("div", {
  display: "flex",
  justifyContent: "center"
});

export const CenteredLayout = withStyle(CenterVertically, {
  flexDirection: "column",
  justifyContent: "space-around"
});