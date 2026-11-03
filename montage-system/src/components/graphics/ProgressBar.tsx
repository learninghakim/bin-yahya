import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useColors } from "../../theme/ThemeContext";

/** Thin progress bar along the top of the video (retention cue). */
export const ProgressBar: React.FC<{ height?: number; top?: number }> = ({ height = 8, top = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const c = useColors();
  const w = interpolate(frame, [0, durationInFrames - 1], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, height, background: "rgba(255,255,255,0.15)" }}>
      <div style={{ width: `${w}%`, height: "100%", background: c.accent, borderRadius: 99 }} />
    </div>
  );
};
