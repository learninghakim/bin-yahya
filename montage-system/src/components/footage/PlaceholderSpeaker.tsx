import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fonts } from "../../theme/theme";
import { BgMesh } from "../fx/BgMesh";

/** Stand-in for footage: a breathing silhouette, so templates preview without a raw video. */
export const PlaceholderSpeaker: React.FC = () => {
  const frame = useCurrentFrame();
  const talk = Math.abs(Math.sin(frame / 4)) * 6;
  const sway = Math.sin(frame / 40) * 6;
  return (
    <AbsoluteFill>
      <BgMesh />
      <AbsoluteFill style={{ alignItems: "center", transform: `translateX(${sway}px)` }}>
        <div style={{ position: "absolute", top: 520, width: 360, height: 430, borderRadius: "50% 50% 46% 46%", background: "linear-gradient(180deg,#3a4458,#262d3b)" }} />
        <div style={{ position: "absolute", top: 830 + talk * 0.2, width: 70, height: 14 + talk, borderRadius: 20, background: "#141821" }} />
        <div style={{ position: "absolute", top: 990, width: 820, height: 1100, borderRadius: "48% 48% 0 0", background: "linear-gradient(180deg,#323b4f,#1c2230)" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily: fonts.body, fontSize: 30, color: "rgba(255,255,255,0.35)" }}>
        PREVIEW — no raw video yet
      </div>
    </AbsoluteFill>
  );
};
