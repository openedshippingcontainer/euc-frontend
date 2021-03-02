import React from "react";
import { useUID } from "react-uid";

const NUM_POINT = 5;
const STROKE_WIDTH = 10;
const INNER_RADIUS = 25;
const OUTER_RADIUS = 50;

const ANGLE = Math.PI / NUM_POINT;
const CENTER = Math.max(INNER_RADIUS, OUTER_RADIUS);

interface Props {
  size: number;
  leftColor: string;
  rightColor: string;
}

export const Star = (
  { size, leftColor, rightColor }: Props
) => {
  const id = useUID();

  const points = [];
  for (let i = 0; i < NUM_POINT * 2; i++) {
    const radius = (i % 2 === 0) ? OUTER_RADIUS : INNER_RADIUS;
    points.push(CENTER + radius * Math.sin(i * ANGLE) + STROKE_WIDTH);
    points.push(CENTER - radius * Math.cos(i * ANGLE) + STROKE_WIDTH);
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 120 120"
    >
      <defs>
        <linearGradient id={id} x1="0" x2="100%" y1="0" y2="0">
          <stop offset="0%" stopColor={leftColor}/>
          <stop offset="50%" stopColor={leftColor}/>
          <stop offset="50%" stopColor={rightColor}/>
        </linearGradient>
      </defs>
      <path
        d={`M${points.toString()}Z`}
        fill={`url(#${id})`}
        stroke={`url(#${id})`}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};