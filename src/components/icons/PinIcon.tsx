import React from "react";

import { colors } from "baseui/tokens";

export const PinIcon = () => {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
    >
      <g>
        <path
          fill={colors.red400}
          d="M11 17h2v5l-2 2v-7zm3.571-12c0-2.903 2.36-3.089 2.429-5h-10c.068 1.911 2.429 2.097 2.429 5 0 3.771-3.429 3.291-3.429 10h12c0-6.709-3.429-6.229-3.429-10z"
        />
      </g>
    </svg>
  );
}