import React from "react";

import { useStyletron } from "baseui";

const ICON_SIZE = 16;

export const ImageIcon = () => {
  const [, theme] = useStyletron();
  return (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 512 512"
    >
      <g>
        <path
          fill={theme.colors.primary}
          d="M464,0H48C21.49,0,0,21.49,0,48v416c0,26.51,21.49,48,48,48h416c26.51,0,48-21.49,48-48V48C512,21.49,490.51,0,464,0z
          M480,313.44l-68.64-68.64c-6.241-6.204-16.319-6.204-22.56,0L304,329.44L203.36,228.8c-6.241-6.204-16.319-6.204-22.56,0
          L32,377.44V48c0-8.837,7.163-16,16-16h416c8.837,0,16,7.163,16,16V313.44z"/>
        <path
          fill={theme.colors.primary}
          d="M288,80c-35.346,0-64,28.654-64,64c0,35.346,28.654,64,64,64c35.346,0,64-28.654,64-64C352,108.654,323.346,80,288,80z
          M288,176c-17.673,0-32-14.327-32-32s14.327-32,32-32c17.673,0,32,14.327,32,32S305.673,176,288,176z"/>
      </g>
    </svg>
  );
}