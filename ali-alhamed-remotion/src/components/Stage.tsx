import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { F, SFX } from "../data/timing";
import { theme } from "../theme";
import { DotGrid } from "./DotGrid";

/** Mounts children only inside [start, end] seconds (+ small margins). */
export const Window: React.FC<{ start: number; end: number; children: React.ReactNode }> = ({
  start,
  end,
  children,
}) => {
  const frame = useCurrentFrame();
  if (frame < F(start) - 1 || frame > F(end) + 1) return null;
  return <>{children}</>;
};

/**
 * Full-screen motion graphic (layout C). Enters with a fast right→left
 * line-wipe mask (RTL), exits quickly. The source audio keeps running underneath.
 */
export const FullScreen: React.FC<{
  start: number;
  end: number;
  glowX?: number;
  glowY?: number;
  enter?: "wipe" | "cut" | "zoom";
  exit?: "cut" | "fade";
  children: React.ReactNode;
}> = ({ start, end, glowX, glowY, enter = "wipe", exit = "cut", children }) => {
  const frame = useCurrentFrame();
  if (frame < F(start) || frame >= F(end)) return null;
  const t = frame - F(start);
  const wipe =
    enter === "wipe"
      ? interpolate(t, [0, 8], [100, 0], {
          easing: theme.ease.out,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const zoom =
    enter === "zoom"
      ? interpolate(t, [0, 9], [1.06, 1], {
          easing: theme.ease.out,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
  const exitO =
    exit === "fade"
      ? interpolate(frame, [F(end) - 5, F(end)], [1, 0], {
          easing: theme.ease.in,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
  // pink leading edge of the wipe
  const edgeX = 1920 * (wipe / 100);
  return (
    <AbsoluteFill style={{ opacity: exitO }}>
      <AbsoluteFill
        style={{
          clipPath: `inset(0 0 0 ${wipe}%)`,
          transform: `scale(${zoom})`,
        }}
      >
        <DotGrid glowX={glowX} glowY={glowY} />
        {children}
      </AbsoluteFill>
      {enter === "wipe" && wipe > 0.5 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: edgeX - 2,
            width: 4,
            background: theme.colors.pink,
            boxShadow: `0 0 24px 4px ${theme.colors.glow}`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/** 1–2 frame flash for major pattern interrupts. */
export const Flash: React.FC<{ at: number; color?: string; frames?: number; strength?: number }> = ({
  at,
  color = theme.colors.pink,
  frames = 2,
  strength = 0.55,
}) => {
  const frame = useCurrentFrame();
  const t = frame - F(at);
  if (t < 0 || t > frames + 2) return null;
  const o = interpolate(t, [0, frames, frames + 2], [strength, strength * 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ background: color, opacity: o, mixBlendMode: "screen" }} />;
};

/** Layer 4/5 — gentle grade + grain + vignette over everything. */
export const Finish: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.06), transparent 22%, transparent 80%, rgba(0,0,0,0.10))",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: noise,
          backgroundSize: "220px",
          backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
          opacity: 0.035,
          mixBlendMode: "overlay",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 62%, rgba(0,0,0,0.20) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** All SFX cues from timing.ts, mixed low under the dialogue. */
export const SfxTrack: React.FC = () => (
  <>
    {SFX.map((c, i) => (
      <Sequence key={i} from={Math.max(0, F(c.at))} durationInFrames={F(1.2)} layout="none">
        <Audio src={staticFile(`sfx/${c.name}.wav`)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
