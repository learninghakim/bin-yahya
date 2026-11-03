import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Segment } from "../../system/types";
import { ease } from "../../theme/theme";
import { PlaceholderSpeaker } from "./PlaceholderSpeaker";

export type Zoom = {
  /** Seconds (in the EDITED timeline) where this zoom takes effect. */
  at: number;
  /** 1 = full frame, 1.15 = punch-in. */
  scale: number;
  /** "cut" = instant punch-in (jump-cut feel), "smooth" = eased push over 0.6s. */
  style?: "cut" | "smooth";
  /** Vertical focus point, 0 = top, 0.5 = center. Default 0.35 (the face). */
  focusY?: number;
};

/**
 * The raw talking-head footage, full-bleed, with punch-in zooms.
 * If `src` is empty, renders an animated placeholder so templates can be previewed.
 *
 * @example
 * <TalkingHead src="raw/2026-11-03_lighting-tips.mp4"
 *   segments={[{ start: 0.4, end: 6.1 }, { start: 6.9, end: 14 }]}
 *   zooms={[{ at: 4.2, scale: 1.15 }, { at: 9, scale: 1 }]} />
 */
export const TalkingHead: React.FC<{
  src?: string; // path inside public/
  /** Parts of the raw file to keep, joined back-to-back (jump cuts). Omit = whole file. */
  segments?: Segment[];
  zooms?: Zoom[];
  volume?: number;
  mirror?: boolean;
}> = ({ src, segments, zooms = [], volume = 1, mirror = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const sorted = [...zooms].sort((a, b) => a.at - b.at);
  let scale = 1;
  let focusY = 0.35;
  sorted.forEach((z, i) => {
    if (t < z.at) return;
    const prev = i > 0 ? sorted[i - 1].scale : 1;
    focusY = z.focusY ?? 0.35;
    scale =
      z.style === "smooth"
        ? interpolate(t, [z.at, z.at + 0.6], [prev, z.scale], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.inOut })
        : z.scale;
  });
  // very slow drift so the shot never feels frozen
  const drift = 1 + Math.sin(frame / 90) * 0.004;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${scale * drift}) ${mirror ? "scaleX(-1)" : ""}`, transformOrigin: `50% ${focusY * 100}%` }}>
        {src ? (
          <Segments src={src} segments={segments} volume={volume} />
        ) : (
          <PlaceholderSpeaker />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const videoStyle: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };

const Segments: React.FC<{ src: string; segments?: Segment[]; volume: number }> = ({ src, segments, volume }) => {
  const { fps } = useVideoConfig();
  if (!segments || segments.length === 0) {
    return <OffthreadVideo src={staticFile(src)} volume={volume} style={videoStyle} />;
  }
  // Frame boundaries are accumulated in seconds then rounded, so cuts never leave a gap.
  let acc = 0;
  return (
    <>
      {segments.map((seg, i) => {
        const from = Math.round(acc * fps);
        acc += seg.end - seg.start;
        const to = Math.round(acc * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)} layout="none">
            <AbsoluteFill>
              <OffthreadVideo src={staticFile(src)} trimBefore={Math.round(seg.start * fps)} volume={volume} style={videoStyle} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </>
  );
};
