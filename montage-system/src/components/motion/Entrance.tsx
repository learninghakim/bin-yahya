import React from "react";
import { SpringName } from "../../theme/theme";
import { EnterFrom, motionStyle, useExit, useSpringIn } from "./motion";

/**
 * Generic entrance/exit wrapper.
 *
 * @example
 * <Entrance delay={10} from="left"><GlassCard>…</GlassCard></Entrance>
 */
export const Entrance: React.FC<{
  delay?: number; // frames
  from?: EnterFrom;
  spring?: SpringName;
  distance?: number;
  exit?: boolean; // animate out at the end of the parent Sequence (default true)
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, from = "bottom", spring = "smooth", distance, exit = true, style, children }) => {
  const p = useSpringIn(delay, spring);
  const x = useExit();
  return (
    <div style={{ ...motionStyle(p, exit ? x : 0, from, distance), willChange: "transform", ...style }}>
      {children}
    </div>
  );
};
