import React, { useState, useEffect } from "react";

import { styled } from "baseui";
import { Theme } from "baseui/theme";
import { ArrowUp } from "baseui/icon";

// Show scroll to top button only when scrolled more than 150px.
const BREAKPOINT = 150;

const SIZE = 44;
const MAX_LENGTH = SIZE * 3;

const GetBackground = (theme: Theme) => {
  switch (theme.name) {
  case "dark":
    return `linear-gradient(0deg, rgba(25,25,25,1) 0%, rgba(40,40,40,1) 100%)`;
  default:
    return `linear-gradient(0deg, rgba(220,220,220,1) 0%, rgba(255,255,255,1) 100%)`;
  }
}

const Container = styled("div", ({ $theme }) => ({
  position: "fixed",
  bottom: $theme.sizing.scale900,
  right: $theme.sizing.scale900,
  width: `${SIZE}px`,
  height: `${SIZE}px`,
  cursor: "pointer",
  borderRadius: "50%",
  boxShadow: $theme.lighting.shadow400,
  background: GetBackground($theme),
  color: $theme.colors.primary,
  transitionProperty: "all",
  transitionDuration: "0.3s",
  transitionTimingFunction: $theme.animation.easeInOutCurve
}));

const Circle = styled("circle", ({ $theme }) => ({
  transform: "rotate(-90deg)",
  transformOrigin: "center",
  stroke: $theme.colors.primary,
  strokeDasharray: MAX_LENGTH,
  strokeWidth: "4px",
  transitionProperty: "stroke-dashoffset",
  transitionDuration: "0.05s",
  transitionTimingFunction: "ease"
}));

const ScrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export const ScrollToTopComponent = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState("0px");

  // Register scroll event and also update immediately current scroll value
  useEffect(
    () => {
      OnScroll();

      window.addEventListener("scroll", OnScroll);
      return () => window.removeEventListener("scroll", OnScroll);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Used to detect whether the component should be shown
  const OnScroll = () => {
    const doc = document.documentElement;

    // Calculate current scroll position
    const offset = (window.pageYOffset || doc.scrollTop);
    const delta = (doc.scrollHeight - doc.clientHeight);
    const position = (offset !== 0 && delta !== 0) ? (offset / delta) : 0;

    // Notify the window that an update is going to occur
    window.requestAnimationFrame(
      () => {
        setVisible(offset >= BREAKPOINT);
        setScrolled(`${MAX_LENGTH - (position * MAX_LENGTH)}px`);
      }
    );
  }

  return (
    <Container
      // Prevent styletron from generating countless new classes
      // because of prop changes.
      style={{
        opacity: visible ? 1 : 0,
        visibility: visible ? "visible" : "hidden",
      }}
      onClick={ScrollToTop}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
        >
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={(SIZE / 2) - 2}
            fill="none"
            style={{ strokeDashoffset: scrolled }}
          />
        </svg>
        <ArrowUp
          size={SIZE}
          title="Nazad na vrh"
        />
      </svg>
    </Container>
  );
};
