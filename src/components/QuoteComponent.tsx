import React from "react";

import { withStyle } from "baseui";
import { expandBorderStyles } from "baseui/styles";

import { UserMention } from "./UserTag";
import { HorizontalRule } from "./HorizontalRule";
import { RawDescriptionContainer } from "./RawDescriptionContainer";

const Container = withStyle(RawDescriptionContainer, ({ $theme }) => ({
  ...expandBorderStyles({
    ...$theme.borders.border600,
    borderColor: $theme.colors.borderOpaque
  }),
  marginTop: $theme.sizing.scale200,
  marginBottom: $theme.sizing.scale300
}));

interface Props {
  username?: string;
  children?: any;
}

export const QuoteComponent = ({ username, children }: Props) => (
  <Container>
    {username ? (
      <>
        <UserMention username={username} /> je napisao:
        <HorizontalRule />
      </>
    ) : null}
    {children}
  </Container>
);