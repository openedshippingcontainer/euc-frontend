import { styled } from "baseui";

interface Props {
  $subtle?: boolean;
}

export const ElevatedPanel = styled<Props, "div">("div", ({ $theme, $subtle }) => ({
  display: "flex",
  flexDirection: "column",
  paddingTop: $theme.sizing.scale600,
  paddingRight: $theme.sizing.scale700,
  paddingBottom: $theme.sizing.scale600,
  paddingLeft: $theme.sizing.scale700,
  listStyle: "none",
  wordWrap: "break-word",
  ...(
    $theme.name === "dark" ?
    { backgroundColor: $theme.colors.mono800 } :
    {}
  ),
  borderRadius: $theme.borders.radius200,
  boxShadow: $subtle ? $theme.lighting.shadow400 : $theme.lighting.shadow700
}));