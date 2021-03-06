import React from "react";

import { useStyletron } from "baseui";

interface Props {
  size?: number;
  inverse?: boolean;
}

export const PencilIcon = ({ size = 16, inverse }: Props) => {
  const [, theme] = useStyletron();
  const color = (
    inverse ?
    theme.colors.backgroundPrimary :
    theme.colors.primary
  );
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      <g>
        <path
          fill={color}
          d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z"
        />
      </g>
    </svg>
  );
}