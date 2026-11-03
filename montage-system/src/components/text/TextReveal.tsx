import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ease, fonts, springs, stagger, type as T } from "../../theme/theme";
import { useColors } from "../../theme/ThemeContext";
import { isRTL } from "../../system/time";
import { useExit } from "../motion/motion";

export type RevealMode = "word" | "char" | "line";
export type HighlightStyle = "color" | "pill" | "underline";

export type TextRevealProps = {
  text: string; // use "\n" for manual line breaks
  mode?: RevealMode;
  delay?: number; // frames
  per?: number; // frames between units (defaults: word 3, char 1, line 6)
  size?: number;
  weight?: number;
  color?: string;
  align?: "center" | "start";
  /** Words to emphasise (matched without punctuation). Max 1–2 per line. */
  highlight?: string[];
  highlightStyle?: HighlightStyle;
  lineHeight?: number;
  exit?: boolean;
  style?: React.CSSProperties;
};

const clean = (w: string) => w.replace(/[.,!?؟،:;"'«»()]/g, "");

/**
 * Animated headline/body text.
 * - mode="word": word-by-word rise (works for Arabic and English)
 * - mode="char": letter-by-letter. For Arabic, letters must stay joined, so each
 *   word is revealed with a right-to-left wipe instead of splitting letters.
 * - mode="line": each line slides up from behind a mask.
 *
 * @example
 * <TextReveal text="3 أخطاء تدمّر\nصوتك في الفيديو" highlight={["تدمّر"]} highlightStyle="pill" size={104} />
 * <TextReveal text="Stop doing this" mode="char" />
 */
export const TextReveal: React.FC<TextRevealProps> = ({
  text, mode = "word", delay = 0, per, size = T.title, weight = 800, color, align = "center",
  highlight = [], highlightStyle = "color", lineHeight = 1.2, exit = true, style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useColors();
  const x = useExit();
  const exitP = exit ? x : 0;
  const rtl = isRTL(text);
  const step = per ?? (mode === "char" ? stagger.char : mode === "line" ? stagger.block : stagger.word);
  const hl = new Set(highlight.map(clean));
  const lines = text.split("\n");
  const baseColor = color ?? c.paper;

  let unit = 0; // running index used for stagger across lines

  const renderWord = (word: string, key: string) => {
    const isHl = hl.has(clean(word));
    const start = delay + unit * step;
    let inner: React.ReactNode;

    if (mode === "char" && !rtl) {
      const chars = Array.from(word);
      inner = chars.map((ch, i) => {
        const p = spring({ frame: frame - start - i * step, fps, config: springs.snappy });
        return (
          <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${interpolate(p, [0, 1], [0.5 * size, 0])}px) scale(${interpolate(p, [0, 1], [0.7, 1])})` }}>
            {ch}
          </span>
        );
      });
      unit += chars.length;
    } else if (mode === "char" && rtl) {
      const p = interpolate(frame, [start, start + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.out });
      inner = <span style={{ display: "inline-block", clipPath: `inset(-20% 0 -20% ${(1 - p) * 100}%)`, transform: `translateX(${(1 - p) * -12}px)` }}>{word}</span>;
      unit += 3; // ~ a word's worth of letters
    } else {
      inner = word;
      unit += 1;
    }

    const p = mode === "word" ? spring({ frame: frame - start, fps, config: springs.snappy }) : 1;
    const landed = start + (mode === "word" ? 6 : 10);
    const hlP = spring({ frame: frame - landed, fps, config: springs.snappy });

    return (
      <span
        key={key}
        style={{
          position: "relative",
          display: "inline-block",
          opacity: mode === "word" ? p : 1,
          transform: mode === "word" ? `translateY(${interpolate(p, [0, 1], [0.45 * size, 0])}px)` : undefined,
          filter: mode === "word" ? `blur(${interpolate(p, [0, 1], [6, 0], { extrapolateRight: "clamp" })}px)` : undefined,
          color: isHl && highlightStyle === "color" ? c.hero : isHl && highlightStyle === "pill" ? c.heroInk : undefined,
          padding: isHl && highlightStyle === "pill" ? `0 ${size * 0.18}px` : undefined,
          zIndex: 1,
        }}
      >
        {isHl && highlightStyle === "pill" ? (
          <span style={{ position: "absolute", inset: `${size * 0.08}px 0`, background: c.hero, borderRadius: size * 0.22, transform: `scaleX(${hlP})`, transformOrigin: rtl ? "right" : "left", zIndex: -1 }} />
        ) : null}
        {isHl && highlightStyle === "underline" ? (
          <span style={{ position: "absolute", left: 0, right: 0, bottom: size * 0.02, height: size * 0.1, background: c.hero, borderRadius: 99, transform: `scaleX(${hlP})`, transformOrigin: rtl ? "right" : "left" }} />
        ) : null}
        {inner}
      </span>
    );
  };

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      style={{
        fontFamily: fonts.display, fontSize: size, fontWeight: weight, lineHeight, color: baseColor,
        textAlign: align === "center" ? "center" : "start", letterSpacing: rtl ? 0 : "-0.02em",
        opacity: 1 - exitP, transform: `translateY(${-24 * exitP}px)`,
        textShadow: "0 4px 24px rgba(0,0,0,0.35)",
        ...style,
      }}
    >
      {lines.map((line, li) => {
        if (mode === "line") {
          const start = delay + li * step;
          const p = spring({ frame: frame - start, fps, config: springs.smooth });
          unit += 1;
          return (
            <div key={li} style={{ overflow: "hidden", paddingBottom: size * 0.08 }}>
              <div style={{ transform: `translateY(${interpolate(p, [0, 1], [110, 0])}%)`, opacity: interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }) }}>
                {line}
              </div>
            </div>
          );
        }
        return (
          <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: Math.round(size * 0.26), rowGap: 0 }}>
            {line.split(" ").filter(Boolean).map((w, wi) => renderWord(w, `${li}-${wi}`))}
          </div>
        );
      })}
    </div>
  );
};
