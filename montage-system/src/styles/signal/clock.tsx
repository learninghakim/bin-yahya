// Scene clock: every Signal element is timed in ABSOLUTE seconds of the edited video
// (copied straight from the transcript), not frames relative to its Sequence.
import React, { createContext, useContext } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { S } from "./tokens";

const Ctx = createContext({ from: 0, to: 1e9 });

export const SceneClock: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Ctx.Provider value={{ from, to }}>{children}</Ctx.Provider>
);

/** Absolute time (s) right now, plus the scene window. */
export const useNow = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { from, to } = useContext(Ctx);
  return { t: from + frame / fps, from, to };
};

const c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 eased progress between a and a+dur. */
export const prog = (t: number, a: number, dur: number = S.dur.in, ease: (x: number) => number = S.ease.out) =>
  interpolate(t, [a, a + dur], [0, 1], { ...c, easing: ease });

/** Scene-level visibility: in over S.dur.in from `from`, out over S.dur.out ending at `to`. */
export const useSceneVis = () => {
  const { t, from, to } = useNow();
  const inn = prog(t, from, S.dur.in);
  const out = interpolate(t, [to - S.dur.out, to], [0, 1], { ...c, easing: S.ease.inOut });
  return { t, inn, out, vis: inn * (1 - out) };
};

/** Standard Signal entrance: fade + rise + scale from .965 + de-blur. Never from zero, never bouncy. */
export const enter = (p: number, out = 0, rise = 22): React.CSSProperties => ({
  opacity: p * (1 - out),
  transform: `translateY(${(1 - p) * rise - out * 10}px) scale(${0.965 + 0.035 * p})`,
  filter: `blur(${(1 - p) * 10 + out * 8}px)`,
});

/**
 * Reserves no space until just before `at`, then grows to `h` px — so a panel grows row by row
 * instead of showing an empty box waiting for its content.
 */
export const Grow: React.FC<{ at: number; h: number; children: React.ReactNode }> = ({ at, h, children }) => {
  const { t } = useNow();
  const g = prog(t, at - 0.3, 0.3, S.ease.inOut);
  return <div style={{ height: h * g, overflow: g < 1 ? "hidden" : "visible" }}>{children}</div>;
};
