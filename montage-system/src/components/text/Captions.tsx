import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption, createTikTokStyleCaptions } from "@remotion/captions";
import { fonts, springs, type as T } from "../../theme/theme";
import { useColors } from "../../theme/ThemeContext";
import { isRTL } from "../../system/time";
import { SAFE, VIDEO } from "../../system/safeArea";

export type CaptionWindow = { from: number; to: number }; // seconds where captions are hidden

/**
 * Word-synced subtitles (TikTok style): 2–4 words per page, active word in hero color.
 * Captions come from `npm run transcribe` (public/captions/<slug>.json).
 *
 * @example
 * <Captions captions={json} offsetSeconds={trimStart} hideDuring={[{ from: 0, to: 2.5 }]} />
 */
export const Captions: React.FC<{
  captions: Caption[];
  offsetSeconds?: number; // when the raw video is trimmed at the start
  hideDuring?: CaptionWindow[];
  y?: number; // vertical center in px
  size?: number;
  combineMs?: number;
}> = ({ captions, offsetSeconds = 0, hideDuring = [], y = VIDEO.height - SAFE.bottom - 130, size = T.caption, combineMs = 900 }) => {
  const { fps } = useVideoConfig();
  const pages = useMemo(
    () => createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: combineMs }).pages,
    [captions, combineMs],
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {pages.map((page, i) => {
        const startS = page.startMs / 1000 - offsetSeconds;
        const next = pages[i + 1];
        const endS = Math.min(next ? next.startMs / 1000 : Infinity, (page.startMs + page.durationMs) / 1000) - offsetSeconds;
        if (endS <= 0) return null;
        if (hideDuring.some((w) => startS < w.to && endS > w.from)) return null;
        const from = Math.max(0, Math.round(startS * fps));
        const dur = Math.max(1, Math.round(endS * fps) - from);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            <CaptionPage tokens={page.tokens} pageStartMs={page.startMs} y={y} size={size} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const CaptionPage: React.FC<{
  tokens: { text: string; fromMs: number; toMs: number }[];
  pageStartMs: number;
  y: number;
  size: number;
}> = ({ tokens, pageStartMs, y, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useColors();
  const nowMs = pageStartMs + (frame / fps) * 1000;
  const p = spring({ frame, fps, config: springs.snappy });
  const text = tokens.map((t) => t.text).join("");
  return (
    <div
      dir={isRTL(text) ? "rtl" : "ltr"}
      style={{
        position: "absolute", left: SAFE.left, right: SAFE.left, top: y, transform: `translateY(-50%) scale(${0.85 + 0.15 * p})`,
        opacity: p, textAlign: "center", fontFamily: fonts.display, fontWeight: 900, fontSize: size, lineHeight: 1.15,
        color: c.paper, WebkitTextStroke: `${size * 0.1}px ${c.ink}`, paintOrder: "stroke fill",
        textShadow: "0 6px 20px rgba(0,0,0,0.5)",
      }}
    >
      {tokens.map((t, i) => {
        const active = nowMs >= t.fromMs && nowMs < t.toMs;
        return (
          <span key={i} style={{ color: active ? c.hero : undefined, display: "inline-block", whiteSpace: "pre", transform: active ? "scale(1.08)" : undefined }}>
            {t.text}
          </span>
        );
      })}
    </div>
  );
};
