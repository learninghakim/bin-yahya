import React from "react";
import { AbsoluteFill } from "remotion";
import { SAFE } from "../../system/safeArea";

/** Debug overlay: shades the areas Instagram's UI covers. Toggle with spec.showSafeZone. */
export const SafeZoneGuide: React.FC = () => {
  const shade = "rgba(255,0,80,0.22)";
  const box = (s: React.CSSProperties) => <div style={{ position: "absolute", background: shade, ...s }} />;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {box({ top: 0, left: 0, right: 0, height: SAFE.top })}
      {box({ bottom: 0, left: 0, right: 0, height: SAFE.bottom })}
      {box({ top: SAFE.top, bottom: SAFE.bottom, right: 0, width: SAFE.right })}
      {box({ top: SAFE.top, bottom: SAFE.bottom, left: 0, width: SAFE.left })}
    </AbsoluteFill>
  );
};
