import React from "react";

import { useStyletron } from "baseui";

const ICON_SIZE = 16;

export const TextAlignRightIcon = () => {
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
          d="M0 1h24v2h-24v-2zm12 7h12v-2h-12v2zm-12 5h24v-2h-24v2zm12 5h12v-2h-12v2zm-12 5h24v-2h-24v2z"
        />
      </g>
    </svg>
  );
}