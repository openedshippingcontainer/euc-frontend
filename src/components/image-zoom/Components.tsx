import { styled } from "baseui";

export const ModalDialogWrapper = styled("div", {
  position: "fixed",
  top: "0",
  right: "0",
  bottom: "0",
  left: "0",
  width: "100%",
  height: "100%",
  transitionProperty: "background-color",
  cursor: "zoom-out"
});

export const ModalDialogContent = styled("div", {
  position: "absolute",
  transitionProperty: "transform",
  transformOrigin: "center center"
});

interface WrapElementProps {
  $isExpanded: boolean;
}

export const WrapElement = styled<
  WrapElementProps, "div"
>("div", ({ $isExpanded }) => ({
  display: "inline-flex",
  position: "relative",
  alignItems: "flex-start",
  cursor: "zoom-in",
  ...($isExpanded ? { visibility: "hidden" } : {})
}));
