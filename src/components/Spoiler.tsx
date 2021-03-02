import React, { useState } from "react";

import { styled } from "baseui";
import { TriangleRight, TriangleDown } from "baseui/icon";

const Container = styled("div", ({ $theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  backgroundColor: $theme.colors.backgroundSecondary,
  marginTop: $theme.sizing.scale500,
  marginRight: $theme.sizing.scale400,
  marginBottom: $theme.sizing.scale500,
  marginLeft: $theme.sizing.scale400,
  borderStyle: "solid",
  borderWidth: "1px",
  borderRadius: $theme.sizing.scale200,
  borderColor: $theme.colors.borderTransparent,
  overflow: "hidden"
}));

const RowWrapper = styled("div", ({ $theme }) => ({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  width: "100%",
  paddingTop: $theme.sizing.scale400,
  paddingRight: $theme.sizing.scale400,
  paddingBottom: $theme.sizing.scale400,
  paddingLeft: $theme.sizing.scale400,
  color: $theme.colors.contentPrimary,
  userSelect: "none"
}));

const TitleWrapper = styled("div", ({ $theme }) => ({
  color: $theme.colors.contentSecondary,
  marginLeft: $theme.sizing.scale200
}));

const ContentContainer = styled("div", ({ $theme }) => ({
  paddingTop: 0,
  paddingRight: $theme.sizing.scale400,
  paddingBottom: $theme.sizing.scale400,
  paddingLeft: $theme.sizing.scale400
}));

interface SpoilerProps {
  title: string;
  children?: any;
}

export const Spoiler = ({ title, children }: SpoilerProps) => {
  const [is_open, setOpen] = useState(false);
  return (
    <Container>
      <RowWrapper onClick={() => setOpen((state) => !state)}>
        {!is_open ? (<TriangleRight />) : (<TriangleDown />)}
        <TitleWrapper>{title}</TitleWrapper>
      </RowWrapper>
      {is_open ? (
        <ContentContainer>{children}</ContentContainer>
      ) : null}
    </Container>
  );
};