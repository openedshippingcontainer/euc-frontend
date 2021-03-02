import React from "react";
import { StyleObject } from "styletron-react";

import { StyledLink } from "baseui/link";

function isModifiedEvent(event: React.MouseEvent<HTMLAnchorElement>) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

// Copy-pasted from https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/modules/Link.js
export const LinkAnchor = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ $style, innerRef, navigate, onClick, ...rest }: LinkProps, forwardedRef) => {
    const { target } = rest;

    const props = {
      ...rest,
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
        try {
          if (onClick) onClick(event);
        } catch (ex) {
          event.preventDefault();
          throw ex;
        }

        if (
          !event.defaultPrevented && // onClick prevented default
          (!target || target === "_self") && // let browser handle "target=_blank" etc.
          !isModifiedEvent(event) // ignore clicks with modifier keys
        ) {
          event.preventDefault();
          navigate();
        }
      },
      onAuxClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (event.button === 1) {
          event.preventDefault();
          window.open(props.href, "_blank");
        }
      }
    };

    props.ref = forwardedRef || innerRef;

    const word_break: StyleObject = { wordBreak: "break-all" };
    return (
      <StyledLink
        {...props}
        $style={$style ? { ...$style, ...word_break } : word_break}
      />
    );
  }
);

if (process.env.NODE_ENV !== "production") {
  LinkAnchor.displayName = "LinkAnchor";
}