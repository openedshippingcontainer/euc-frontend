import React from "react";

import { useStyletron } from "baseui";

const ICON_SIZE = 16;

export const OrderedListIcon = () => {
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
          d="M4 22h-4v-4h4v4zm0-12h-4v4h4v-4zm0-8h-4v4h4v-4zm3 0v4h17v-4h-17zm0 12h17v-4h-17v4zm0 8h17v-4h-17v4z"
        />
      </g>
    </svg>
  );
}