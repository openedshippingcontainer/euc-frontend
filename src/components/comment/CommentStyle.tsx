import { styled, withStyle } from "baseui";

import { CenterVertically } from "../ContentWrapper";

export const Comment = styled("div", {
  display: "flex",
  alignItems: "top"
});

export const CommentBody = styled("div", {
  flex: 1,
  maxWidth: "100%"
});

export const CommentHeader = withStyle(CenterVertically, {
  display: "flex",
  justifyContent: "space-between"
});

export const CommentAction = styled<{ $staff?: boolean }, "span">(
  "span", ({ $theme, $staff }) => ({
    display: "inline-block",
    cursor: "pointer",
    userSelect: "none",
    marginLeft: $theme.sizing.scale200,
    ...($staff ? { fontWeight: "bold" } : {}),
    ":hover": { textDecoration: "underline" }
  })
);

export const CommentAvatarWrapper = styled("div", ({ $theme }) => ({
  display: "inline-block",
  width: "96px",
  minWidth: "96px",
  marginRight: $theme.sizing.scale300,
  "@media screen and (max-width: 425px)": {
    width: "48px",
    minWidth: "48px"
  }
}));

export const CommentAvatar = styled("img", {
  height: "auto",
  maxWidth: "100%",
  overflow: "hidden"
});