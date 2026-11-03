import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ease } from "../../theme/theme";

/**
 * Quick white flash (≈6 frames) to punctuate a cut or a scene change.
 * Place inside a <Sequence from={cutFrame - 2}>.
 */
export const FlashCut: React.FC<{ peak?: number }> = ({ peak = 0.55 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 2, 8], [0, peak, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.out,
  });
  return <AbsoluteFill style={{ background: "#fff", opacity: o, pointerEvents: "none" }} />;
};
