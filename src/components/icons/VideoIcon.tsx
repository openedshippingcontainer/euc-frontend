import React from "react";

import { useStyletron } from "baseui";

const ICON_SIZE = 16;

export const VideoIcon = () => {
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
          d="M16 16c0 1.104-.896 2-2 2h-12c-1.104 0-2-.896-2-2v-8c0-1.104.896-2 2-2h12c1.104 0 2 .896 2 2v8zm8-10l-6 4.223v3.554l6 4.223v-12z"
        />
      </g>
    </svg>
  );
}