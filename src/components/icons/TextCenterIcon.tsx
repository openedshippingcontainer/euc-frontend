import React from "react";

import { useStyletron } from "baseui";

const ICON_SIZE = 16;

export const TextCenterIcon = () => {
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
          d="M24 3h-24v-2h24v2zm-6 3h-12v2h12v-2zm6 5h-24v2h24v-2zm-6 5h-12v2h12v-2zm6 5h-24v2h24v-2z"
        />
      </g>
    </svg>
  );
}