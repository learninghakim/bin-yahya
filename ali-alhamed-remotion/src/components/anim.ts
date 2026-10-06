import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { F } from "../data/timing";
import { theme } from "../theme";

type SpringCfg = { damping: number; stiffness: number; mass: number };

/**
 * Entrance/exit progress for an element living between `inSec` and `outSec`
 * (absolute seconds on the main timeline).
 * - `p`   spring entrance progress (may overshoot slightly)
 * - `o`   visibility (entrance × exit), use for opacity
 * - `x`   exit progress 0→1 (fast, ease-in)
 */
export const useLife = (
  inSec: number,
  outSec?: number,
  opts: { delay?: number; cfg?: SpringCfg; exit?: number } = {},
) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = F(inSec) + (opts.delay ?? 0);
  const p = spring({ frame: frame - start, fps, config: opts.cfg ?? theme.spring.snappy });
  const ex = opts.exit ?? theme.motion.exit;
  const x =
    outSec === undefined
      ? 0
      : interpolate(frame, [F(outSec) - ex, F(outSec)], [0, 1], {
          easing: theme.ease.in,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  const o = Math.min(1, Math.max(0, p)) * (1 - x);
  return { p, o, x, frame, local: frame - start };
};

/** Clamped eased interpolation helper on absolute seconds. */
export const useTween = (
  fromSec: number,
  toSec: number,
  range: [number, number],
  easing = theme.ease.out,
) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [F(fromSec), F(toSec)], range, {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/** Standard RTL-friendly entrance transform: slide from the right + scale. */
export const enterStyle = (
  p: number,
  o: number,
  opts: { dx?: number; dy?: number; s0?: number; exitY?: number; x?: number } = {},
): React.CSSProperties => {
  const dx = opts.dx ?? 34;
  const dy = opts.dy ?? 0;
  const s0 = opts.s0 ?? 0.95;
  const exitShift = (opts.x ?? 0) * (opts.exitY ?? -14);
  return {
    opacity: o,
    transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy + exitShift}px) scale(${s0 + (1 - s0) * p})`,
  };
};

/** Icon pop: 0.75 → 1.05 → 1.00 via an underdamped spring. */
export const popScale = (p: number) => 0.75 + 0.25 * p;

/** Subtle idle breathing for elements on screen > 2s. */
export const breathe = (frame: number, amp = 0.012, period = 26) =>
  1 + Math.sin(frame / period) * amp;

/** Momentary emphasis 1 → peak → 1 around a cue (keyword hit). */
export const useHit = (atSec: number, peak = 1.1, len = 12) => {
  const frame = useCurrentFrame();
  const t = frame - F(atSec);
  if (t < 0 || t > len) return { s: 1, k: t > len ? 1 : 0 };
  const k = Math.sin((t / len) * Math.PI);
  return { s: 1 + (peak - 1) * k, k: 1 };
};
