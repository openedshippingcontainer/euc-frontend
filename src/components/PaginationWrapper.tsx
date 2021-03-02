import { styled } from "baseui";

export const PaginationWrapper = styled("div", ({ $theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: $theme.sizing.scale300
}));