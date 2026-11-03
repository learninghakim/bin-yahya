import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Caption } from "@remotion/captions";
import { S } from "./tokens";
import { chunkCaptions, chunkFontSize } from "./chunks";

/**
 * Bottom captions — EVERY spoken word, always on screen (also over panels and stages).
 * Words are grouped in short chunks (≤ 4 words, one line). A chunk breaks on:
 * 4 words · a pause > 0.45 s · chunk longer than 2 s · punctuation.
 * Dark glass capsule (readable over any clothing). The word being spoken is lime, words already
 * said are white, words not yet said are dimmed — the eye tracks the voice.
 * A chunk holds 0.45 s after its last word, or until the next one if it comes within 0.8 s.
 */
export const SignalCaptions: React.FC<{ captions: Caption[]; y?: number }> = ({ captions, y = S.layout.captionY }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks = useMemo(() => chunkCaptions(captions), [captions]);
  const c = chunks.find((k) => t >= k.show && t < k.hide);
  if (!c) return null;

  const a = interpolate(t, [c.show, c.show + 0.12, c.hide - 0.12, c.hide], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const size = chunkFontSize(c, S.layout.captionMaxW);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        dir="rtl"
        style={{
          position: "absolute", left: 0, right: 0, top: y, transform: "translateY(-50%)", display: "flex", justifyContent: "center",
          opacity: a,
        }}
      >
        <div
          style={{
            display: "flex", gap: Math.round(size * 0.28), padding: `${Math.round(size * 0.2)}px ${Math.round(size * 0.5)}px`, borderRadius: size * 0.45,
            background: "rgba(10,14,12,0.66)", backdropFilter: "blur(12px)", border: `1px solid ${S.color.line}`, boxShadow: `0 12px 30px -10px ${S.color.shadow}`,
            fontFamily: S.font.ui, fontWeight: 700, fontSize: size, lineHeight: 1.25, whiteSpace: "nowrap",
          }}
        >
        {c.words.map((w, i) => {
          const said = t >= w.s - 0.03;
          const next = c.words[i + 1];
          const current = said && (!next || t < next.s - 0.03);
          return (
            <span
              key={i}
              style={{
                color: current ? S.color.lime : S.color.text, opacity: said ? 1 : 0.42,
                direction: /[؀-ۿ]/.test(w.text) ? "rtl" : "ltr",
                unicodeBidi: "isolate",
              }}
            >
              {w.text}
            </span>
          );
        })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
