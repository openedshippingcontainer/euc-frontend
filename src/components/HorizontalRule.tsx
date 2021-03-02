import { styled } from "baseui";

export const HorizontalRule = styled("hr", ({ $theme }) => ({
  borderStyle: "none",
  height: "1px",
  backgroundColor: $theme.colors.borderOpaque
}));