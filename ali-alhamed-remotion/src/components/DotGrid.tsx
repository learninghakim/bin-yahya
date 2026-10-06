import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";

/**
 * Layer 1 — near-black gradient + very faint dot matrix + local pink glow.
 * The grid only drifts ~1–2% (slow parallax), never competes with text.
 */
export const DotGrid: React.FC<{
  glowX?: number; // 0–1
  glowY?: number;
  glow?: number; // 0–1 strength
}> = ({ glowX = 0.5, glowY = 0.5, glow = 0.6 }) => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.12) % 34;
  return (
    <AbsoluteFill style={{ background: theme.colors.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 40%, #0E0E13 0%, #07070A 55%, #030304 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          inset: -40,
          backgroundImage: `radial-gradient(circle, ${theme.colors.dot} 1.3px, transparent 1.6px)`,
          backgroundSize: "34px 34px",
          backgroundPosition: `${drift}px ${drift * 0.4}px`,
          maskImage: "radial-gradient(ellipse 85% 80% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${glowX * 100}%`,
          top: `${glowY * 100}%`,
          width: 1100,
          height: 800,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse at center, rgba(255,26,108,${0.16 * glow}) 0%, rgba(255,26,108,${0.05 * glow}) 38%, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />
    </AbsoluteFill>
  );
};
