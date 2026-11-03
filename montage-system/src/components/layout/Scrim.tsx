import React from "react";
import { AbsoluteFill } from "remotion";
import { useSpringIn, useExit } from "../motion/motion";

/**
 * Darkens the footage behind overlays so text reads cleanly.
 * `full` dims the whole frame (for "speaker steps back" moments).
 *
 * @example
 * <Scrim side="bottom" strength={0.7} />
 */
export const Scrim: React.FC<{ side?: "top" | "bottom" | "full"; strength?: number }> = ({
  side = "bottom",
  strength = 0.65,
}) => {
  const p = useSpringIn(0, "gentle");
  const x = useExit();
  const a = strength * Math.min(p, 1) * (1 - x);
  const bg =
    side === "full"
      ? `rgba(5,7,12,${a})`
      : `linear-gradient(${side === "bottom" ? "0deg" : "180deg"}, rgba(5,7,12,${a}) 0%, rgba(5,7,12,${a * 0.6}) 35%, transparent 70%)`;
  return <AbsoluteFill style={{ background: bg, pointerEvents: "none" }} />;
};
