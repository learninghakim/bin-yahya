import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { F, Layout, LAYOUT_TRACK } from "../data/timing";
import { theme } from "../theme";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const mix = (a: Layout, b: Layout, t: number): Layout => ({
  s: lerp(a.s, b.s, t),
  tx: lerp(a.tx, b.tx, t),
  ty: lerp(a.ty, b.ty, t),
  clip: {
    x: lerp(a.clip.x, b.clip.x, t),
    y: lerp(a.clip.y, b.clip.y, t),
    w: lerp(a.clip.w, b.clip.w, t),
    h: lerp(a.clip.h, b.clip.h, t),
    r: lerp(a.clip.r, b.clip.r, t),
  },
});

/** Resolve the presenter layout at a frame from LAYOUT_TRACK. */
export const layoutAt = (frame: number): Layout => {
  let idx = 0;
  for (let i = 0; i < LAYOUT_TRACK.length; i++) {
    if (F(LAYOUT_TRACK[i].at) <= frame) idx = i;
  }
  const cur = LAYOUT_TRACK[idx];
  if (idx === 0 || cur.cut) return cur.layout;
  const prev = LAYOUT_TRACK[idx - 1].layout;
  const t = interpolate(frame, [F(cur.at), F(cur.at) + theme.motion.reframe], [0, 1], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return mix(prev, cur.layout, t);
};

/**
 * Layer 2 — the ONE continuous source video (picture + original audio).
 * It is never cut, sped up or re-ordered: only re-framed / windowed.
 */
export const Presenter: React.FC = () => {
  const frame = useCurrentFrame();
  const L = layoutAt(frame);
  const { clip } = L;
  const framed = clip.r > 0.5;
  return (
    <AbsoluteFill>
      {framed && (
        <div
          style={{
            position: "absolute",
            left: clip.x - 1,
            top: clip.y - 1,
            width: clip.w + 2,
            height: clip.h + 2,
            borderRadius: clip.r + 1,
            boxShadow: `0 40px 90px -30px rgba(0,0,0,0.9), 0 0 0 1px ${theme.colors.borderStrong}`,
          }}
        />
      )}
      <AbsoluteFill
        style={{
          clipPath: `inset(${clip.y}px ${1920 - clip.x - clip.w}px ${1080 - clip.y - clip.h}px ${clip.x}px round ${clip.r}px)`,
        }}
      >
        <OffthreadVideo
          src={staticFile("source.mp4")}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
            transformOrigin: "0 0",
            transform: `translate(${L.tx}px, ${L.ty}px) scale(${L.s})`,
          }}
        />
      </AbsoluteFill>
      {framed && (
        <div
          style={{
            position: "absolute",
            left: clip.x,
            top: clip.y,
            width: clip.w,
            height: clip.h,
            borderRadius: clip.r,
            border: `1.5px solid ${theme.colors.borderStrong}`,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
