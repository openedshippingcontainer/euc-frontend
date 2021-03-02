import React from "react";

import { useStyletron } from "baseui";

const ICON_SIZE = 16;

export const UnorderedListIcon = () => {
  const [, theme] = useStyletron();
  return (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 24 24"
    >
      <g>
        <path
          fill={theme.colors.primary}
          d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z"
        />
      </g>
    </svg>
  );
}