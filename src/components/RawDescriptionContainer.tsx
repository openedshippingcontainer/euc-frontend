import { styled } from "baseui";

export const RawDescriptionContainer = styled<{ $noSpace?: boolean }, "pre">(
  "pre", ({ $theme, $noSpace }) => ({
  width: "100%",
  wordBreak: "break-word",
  whiteSpace: "pre-wrap",
  borderRadius: $theme.borders.radius200,
  backgroundColor: $theme.colors.backgroundSecondary,
  ...(
    $noSpace ? {
      marginBottom: 0
    } : {
      paddingTop: $theme.sizing.scale300,
      paddingRight: $theme.sizing.scale500,
      paddingBottom: $theme.sizing.scale300,
      paddingLeft: $theme.sizing.scale500,
      boxShadow: "0 4px 16px hsla(0, 0%, 0%, 0.08)",
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: $theme.colors.borderTransparent
    }
  )
}));