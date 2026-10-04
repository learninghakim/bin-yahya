import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export type Word = { text: string; style?: React.CSSProperties; key?: string };

/**
 * Right-to-left, word-by-word reveal: each word rises, scales and un-blurs.
 * Words are split on spaces only, so Arabic letter shaping is preserved.
 */
export const WordReveal: React.FC<{
  words: Word[];
  delay: number;
  per?: number;
  gap?: number;
  style?: React.CSSProperties;
  renderWord?: (word: Word, progress: number, index: number) => React.ReactNode;
}> = ({ words, delay, per = 4, gap = 26, style, renderWord }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: "flex",
        direction: "rtl",
        flexWrap: "wrap",
        justifyContent: "center",
        gap,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const p = spring({ frame: frame - delay - i * per, fps, config: theme.spring.smooth });
        return (
          <span
            key={w.key ?? i}
            style={{
              display: "inline-block",
              position: "relative",
              opacity: Math.min(1, p * 1.4),
              transform: `translateY(${interpolate(p, [0, 1], [56, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
              filter: `blur(${interpolate(p, [0, 1], [8, 0])}px)`,
              ...w.style,
            }}
          >
            {renderWord ? renderWord(w, p, i) : w.text}
          </span>
        );
      })}
    </div>
  );
};
