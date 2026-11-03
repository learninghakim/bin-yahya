import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useColors } from "../../theme/ThemeContext";

/** Moving gradient background — used for full-screen cards and the demo placeholder. */
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const c = useColors();
  const d1 = Math.sin(frame / 55) * 60;
  const d2 = Math.cos(frame / 70) * 50;
  return (
    <AbsoluteFill style={{ background: c.ink, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute", width: 1400, height: 1400, borderRadius: "50%", top: -500, left: -400 + d1,
          filter: "blur(60px)", background: `radial-gradient(circle, ${c.accent}2e, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute", width: 1100, height: 1100, borderRadius: "50%", bottom: -420, right: -360 - d2,
          filter: "blur(70px)", background: `radial-gradient(circle, ${c.hero}24, transparent 65%)`,
        }}
      />
    </AbsoluteFill>
  );
};
