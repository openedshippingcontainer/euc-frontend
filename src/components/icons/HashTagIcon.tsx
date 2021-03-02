import React from "react";

import { useStyletron } from "baseui";

const ICON_SIZE = 14;

export const HashTagIcon = () => {
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
          d="M22.548 9l.452-2h-5.364l1.364-6h-2l-1.364 6h-5l1.364-6h-2l-1.364 6h-6.184l-.452 2h6.182l-1.364 6h-5.36l-.458 2h5.364l-1.364 6h2l1.364-6h5l-1.364 6h2l1.364-6h6.185l.451-2h-6.182l1.364-6h5.366zm-8.73 6h-5l1.364-6h5l-1.364 6z"
        />
      </g>
    </svg>
  );
}