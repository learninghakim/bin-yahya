import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ease } from "../../theme/theme";
import { ICONS, IconName } from "./icons";

/**
 * Static or self-drawing SVG icon.
 * `drawAt` (frame) animates the stroke being drawn over `drawFrames`.
 *
 * @example
 * <Icon name="check" size={64} color={c.success} drawAt={5} />
 */
export const Icon: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  drawAt?: number;
  drawFrames?: number;
}> = ({ name, size = 64, color = "currentColor", strokeWidth = 2.2, drawAt, drawFrames = 16 }) => {
  const frame = useCurrentFrame();
  const draw =
    drawAt === undefined
      ? 1
      : interpolate(frame, [drawAt, drawAt + drawFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.out });
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: "block", overflow: "visible" }}>
      {ICONS[name].map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
      ))}
    </svg>
  );
};
