import React from "react";

import { useStyletron } from "baseui";

const ICON_SIZE = 16;

interface Props {
  inverse?: boolean;
}

export const SendIcon = ({ inverse }: Props) => {
  const [, theme] = useStyletron();
  const color = (
    inverse ?
    theme.colors.backgroundPrimary :
    theme.colors.primary
  );
  return (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 24 24"
    >
      <g>
        <path
          fill={color}
          d="M24 0l-6 22-8.129-7.239 7.802-8.234-10.458 7.227-7.215-1.754 24-12zm-15 16.668v7.332l3.258-4.431-3.258-2.901z"
        />
      </g>
    </svg>
  );
}