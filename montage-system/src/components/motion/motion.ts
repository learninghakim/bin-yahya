// Core motion hooks. Every animated component in the system is built from these.
import type React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ease, EXIT_SECONDS, SpringName, springs } from "../../theme/theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 spring progress starting `delay` frames into the current Sequence. */
export const useSpringIn = (delay = 0, preset: SpringName = "smooth") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: springs[preset] });
};

/**
 * 0 → 1 progress of the exit at the END of the current Sequence
 * (0 = fully visible, 1 = gone). Exits are faster than entrances.
 */
export const useExit = (seconds = EXIT_SECONDS) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const len = Math.max(1, Math.round(seconds * fps));
  return interpolate(frame, [durationInFrames - len, durationInFrames - 1], [0, 1], {
    ...clamp,
    easing: ease.in,
  });
};

/** Eased (never linear), clamped interpolate over frames. */
export const useTween = (
  from: number,
  to: number,
  range: [number, number],
  easing = ease.out,
) => {
  const frame = useCurrentFrame();
  return interpolate(frame, range, [from, to], { ...clamp, easing });
};

export type EnterFrom = "bottom" | "top" | "left" | "right" | "scale" | "none";

/**
 * Entrance + exit transform for progress values. Always animates 2–3 properties
 * together (opacity + translate + scale + a touch of blur) — never a lone fade.
 */
export const motionStyle = (
  enter: number,
  exit = 0,
  from: EnterFrom = "bottom",
  distance = 48,
): React.CSSProperties => {
  const d = interpolate(enter, [0, 1], [distance, 0]);
  const tx = from === "left" ? -d : from === "right" ? d : 0;
  const ty = from === "bottom" ? d : from === "top" ? -d : 0;
  const s =
    interpolate(enter, [0, 1], [from === "scale" ? 0.6 : 0.94, 1]) *
    interpolate(exit, [0, 1], [1, 0.96]);
  const exitY = interpolate(exit, [0, 1], [0, -28]);
  return {
    opacity: Math.min(enter, 1) * (1 - exit),
    transform: `translate(${tx}px, ${ty + exitY}px) scale(${s})`,
    filter: `blur(${interpolate(enter, [0, 1], [8, 0], clamp) + exit * 6}px)`,
  };
};

/** Idle micro-motion for anything on screen > 2s. */
export const useBreathe = (amount = 1) => {
  const frame = useCurrentFrame();
  return {
    scale: 1 + Math.sin(frame / 22) * 0.012 * amount,
    y: Math.sin(frame / 30) * 3 * amount,
  };
};
