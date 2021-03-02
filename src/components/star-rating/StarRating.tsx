import React from "react";

import { Star } from "./Star";
import { CenterVertically } from "../ContentWrapper";

const ACTIVE_COLOR = "#f3cf09";
const EMPTY_COLOR = "rgb(122, 134, 154)";

interface Props {
  value: number,
  count: number,
  size: number
}

// Copy-pasted from https://github.com/PRNDcompany/ReactSvgStarRating
export const StarRating = (
  { value = 0, count = 5, size = 30 }: Props
) => {
  const defaultIndex = (
    value % 1 === 0 ?
    value - 1 :
    Math.floor(value)
  );

  const getLeftColor = (index: number) => (
    index <= defaultIndex ? ACTIVE_COLOR : EMPTY_COLOR
  );

  const getRightColor = (index: number) => (
    defaultIndex === index ? getSelectedRightColor(index) : getLeftColor(index)
  );

  const getSelectedRightColor = (index: number) => (
    (value % 1 === 0.5) ? EMPTY_COLOR : getLeftColor(index)
  );

  return (
    <CenterVertically>
      {
        Array.from({ length: count }, (v, i) => (
          <Star
            key={i}
            size={size}
            leftColor={getLeftColor(i)}
            rightColor={getRightColor(i)}
          />
        )
      )}
    </CenterVertically>
  );
};