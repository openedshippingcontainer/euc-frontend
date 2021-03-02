import React from "react";

import { useStyletron } from "baseui";

const ICON_SIZE = 16;

interface Props {
  inverse?: boolean;
}

export const SaveIcon = ({ inverse }: Props) => {
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
          d="M15.004 3h2.996v5h-2.996v-5zm8.996 1v20h-24v-24h20l4 4zm-19 5h14v-7h-14v7zm16 4h-18v9h18v-9zm-2 2h-14v1h14v-1zm0 2h-14v1h14v-1zm0 2h-14v1h14v-1z"
        />
      </g>
    </svg>
  );
}