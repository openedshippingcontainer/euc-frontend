import { styled, withStyle } from "baseui";
import { StyledListItem } from "baseui/menu";

const StyledButton = styled<{ $isFocusVisible: boolean }, "button">(
  "button",
  ({ $theme, $isFocusVisible }) => ({
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    color: $theme.colors.contentPrimary,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    paddingTop: "0",
    paddingBottom: "0",
    paddingLeft: "0",
    paddingRight: "0",
    marginLeft: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    outline: $isFocusVisible ? `3px solid ${$theme.colors.accent}` : "none",
    outlineOffset: "-3px",
    WebkitAppearance: "none",
    cursor: "pointer",
  }),
);

export const StyledRoot = styled("div", ({ $theme }) => ({
  ...$theme.typography.ParagraphMedium,
  boxSizing: "border-box",
  ...(
    $theme.name === "dark" ?
    { backgroundColor: $theme.colors.mono800 } :
    {}
  ),
  boxShadow: "0px 1px 0px rgba(0, 0, 0, 0.08)",
  width: "100%",
}));

export const StyledSubnavContainer = styled("div", {
  boxSizing: "border-box",
  boxShadow: "0px -1px 0px rgba(0, 0, 0, 0.08)",
});

export const StyledSpacing = styled("div", ({ $theme }) => ({
  boxSizing: "border-box",
  height: "100%",
  display: "flex",
  alignItems: "center",
  paddingTop: $theme.sizing.scale400,
  paddingBottom: $theme.sizing.scale400
}));

export const StyledAppName = styled("div", ({ $theme }) => ({
  ...$theme.typography.HeadingXSmall,
  color: $theme.colors.primary,
  textDecoration: "none",
  [$theme.mediaQuery.medium]: {
    ...$theme.typography.HeadingSmall,
  },
}));

export const StyledSideMenuButton = withStyle(
  StyledButton,
  ({ $theme }) => ({
    ...($theme.direction === "rtl"
      ? {marginLeft: $theme.sizing.scale600}
      : {marginRight: $theme.sizing.scale600}),
    paddingTop: $theme.sizing.scale100,
    paddingBottom: $theme.sizing.scale100,
    paddingLeft: $theme.sizing.scale100,
    paddingRight: $theme.sizing.scale100,
  }),
);

export const StyledPrimaryMenuContainer = styled("div", {
  boxSizing: "border-box",
  height: "100%",
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  justifyContent: "flex-end",
  alignItems: "stretch",
});

export const StyledMainMenuItem = styled<{
  $active?: boolean,
  $isFocusVisible: boolean,
  $kind: NavItemKind,
}, "div">("div", (props) => {
  const {
    $active,
    $isFocusVisible,
    $kind,
    $theme: {colors, sizing, animation},
  } = props;
  return {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    color: $active ? colors.contentPrimary : colors.contentTertiary,
    paddingLeft: sizing.scale500,
    paddingRight: sizing.scale500,
    paddingTop: $kind === "secondary" ? sizing.scale500 : "0",
    paddingBottom: $kind === "secondary" ? sizing.scale500 : "0",
    outline: $isFocusVisible ? `3px solid ${colors.accent}` : "none",
    outlineOffset: "-3px",
    borderBottomWidth: sizing.scale0,
    borderBottomStyle: "solid",
    borderBottomColor:
      $active && !$isFocusVisible ? colors.primary : "transparent",
    cursor: $active ? "default" : "pointer",
    whiteSpace: $kind === "secondary" ? "nowrap" : "initial",
    transitionProperty: "all",
    transitionDuration: "0.3s",
    transitionTimingFunction: animation.easeInOutCurve,
    ":hover": {
      color: colors.primary,
      backgroundColor: colors.backgroundSecondary
    },
  };
});

export const StyledSecondaryMenuContainer = styled("div", {
  boxSizing: "border-box",
  height: "100%",
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  justifyContent: "flex-start",
  alignItems: "stretch",
  overflow: "auto",
});

export const StyledUserMenuButton = StyledButton;

export const StyledUserMenuProfileListItem = withStyle(
  StyledListItem,
  ({ $theme }) => ({
    paddingTop: "0",
    paddingBottom: "0",
    ...(
      $theme.direction === "rtl" ?
      { paddingLeft: "0" } :
      { paddingRight: "0" }
    ),
  })
);

export const StyledUserProfileTileContainer = styled(
  "div",
  ({ $theme }) => ({
    boxSizing: "border-box",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
    paddingTop: $theme.sizing.scale400,
    paddingBottom: $theme.sizing.scale400,
  })
);

export const StyledUserProfilePictureContainer = styled(
  "div",
  ({ $theme }) => ({
    ...($theme.direction === "rtl" ?
      { marginLeft: $theme.sizing.scale500 } :
      { marginRight: $theme.sizing.scale500 }
    ),
  })
);

export const StyledUserProfileInfoContainer = styled("div", ({
  boxSizing: "border-box",
  alignSelf: "center",
}));
