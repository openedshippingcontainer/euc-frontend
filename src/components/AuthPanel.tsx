import { styled } from "baseui";

export const AuthPanel = styled("div", ({ $theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginTop: $theme.sizing.scale300,
  marginRight: "auto",
  marginBottom: $theme.sizing.scale800,
  marginLeft: "auto",
  paddingTop: $theme.sizing.scale900,
  paddingRight: $theme.sizing.scale1000,
  paddingBottom: $theme.sizing.scale900,
  paddingLeft: $theme.sizing.scale1000,
  backgroundColor: $theme.colors.backgroundPrimary,
  boxShadow: $theme.lighting.shadow600
}));