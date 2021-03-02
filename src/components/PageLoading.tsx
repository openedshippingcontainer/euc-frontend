import React from "react";

import { withStyle } from "baseui";
import { StyledSpinnerNext } from "baseui/spinner";

import { CenteredLayout } from "./ContentWrapper";

const Container = withStyle(CenteredLayout, {
  height: "60vh",
  justifyContent: "space-around"
});

export const PageLoading = () => (
  <Container>
    <StyledSpinnerNext $size="medium" />
  </Container>
);