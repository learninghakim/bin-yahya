import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { baseTheme as theme } from "../theme";

type SpringConfig = (typeof theme.spring)[keyof typeof theme.spring];

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** Seconds → frames for the current composition. */
export const useSeconds = () => {
  const { fps } = useVideoConfig();
  return (seconds: number) => Math.round(seconds * fps);
};

/** Spring progress 0→1 starting `delay` frames into the current Sequence. */
export const useSpringAt = (
  delay: number,
  config: SpringConfig = theme.spring.smooth,
) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

/** Eased 0→1 progress across a frame window. Never linear. */
export const useProgress = (
  start: number,
  length: number,
  easing = theme.ease.out,
) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + length], [0, 1], {
    ...CLAMP,
    easing,
  });
};

/** 0→1 over the last `theme.timing.exit` seconds of the current Sequence. */
export const useExit = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const len = Math.round(theme.timing.exit * fps);
  return interpolate(
    frame,
    [durationInFrames - len, durationInFrames],
    [0, 1],
    { ...CLAMP, easing: theme.ease.in },
  );
};

/** Sin-wave idle motion so anything on screen for >2s keeps breathing. */
export const useBreath = (period = 30, amount = 1, phase = 0) => {
  const frame = useCurrentFrame();
  return Math.sin(frame / period + phase) * amount;
};
