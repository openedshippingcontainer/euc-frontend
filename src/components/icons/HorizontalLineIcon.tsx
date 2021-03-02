import React from "react";

import { useStyletron } from "baseui";

const ICON_SIZE = 16;

export const HorizontalLineIcon = () => {
  const [, theme] = useStyletron();
  return (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      fillRule="evenodd"
      clipRule="evenodd"
    >
      <g>
        <path
          fill={theme.colors.primary}
          d="M0 12v1h23v-1h-23z"
        />
      </g>
    </svg>
  );
}