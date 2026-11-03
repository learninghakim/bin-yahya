// Finishing layers: grade (above content), grain + vignette (topmost).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useColors } from "../../theme/ThemeContext";

/** Subtle unified color grade over footage + graphics. */
export const Grade: React.FC<{ amount?: number }> = ({ amount = 0.1 }) => {
  const c = useColors();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ backgroundColor: c.hero, mixBlendMode: "soft-light", opacity: amount }} />
      <AbsoluteFill
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.18), transparent 22%, transparent 75%, rgba(0,0,0,0.25))" }}
      />
    </AbsoluteFill>
  );
};

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

/** Procedural film grain — no asset file. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: NOISE,
        backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity,
        mixBlendMode: "overlay",
      }}
    />
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.32 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);
