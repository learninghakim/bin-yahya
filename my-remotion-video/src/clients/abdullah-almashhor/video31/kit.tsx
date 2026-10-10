import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP } from "../../../shared/components/motion";
import { Paper } from "../../../shared/components/Paper";
import { theme } from "../theme";

export const { colors, fonts } = theme;
export { theme };

/** Global seconds → frame inside a Sequence that starts at `t0` seconds. */
export const useAt = (t0: number) => {
  const { fps } = useVideoConfig();
  return (sec: number) => Math.round((sec - t0) * fps);
};

/** Spring 0→1 from a local frame. */
export const useSpr = (from: number, config: (typeof theme.spring)[keyof typeof theme.spring] = theme.spring.snappy) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - from, fps, config });
};

/** Fast eased exit 0→1 over ~9 frames ending at `end`. */
export const useOut = (end: number, len = 9) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [end - len, end], [0, 1], { ...CLAMP, easing: theme.ease.in });
};

/** Torn paper card that drops in (scale + rotate + rise) and breathes. */
export const Card: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  seed: string;
  at: number;
  out?: number;
  color?: string;
  rot?: number;
  rim?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ x, y, w, h, seed, at, out, color = colors.paper, rot = 0, rim = 12, children, style }) => {
  const frame = useCurrentFrame();
  const p = useSpr(at, theme.spring.snappy);
  const o = useOut(out ?? 1e9);
  const breathe = Math.sin(frame / 26 + seed.length) * 1.2;
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        opacity: Math.min(1, p * 1.6) * (1 - o),
        transform: `translateY(${interpolate(p, [0, 1], [70, 0]) - o * 40}px) scale(${interpolate(p, [0, 1], [0.6, 1]) * (1 - o * 0.15)}) rotate(${rot + interpolate(p, [0, 1], [-14, 0]) + breathe}deg)`,
        ...style,
      }}
    >
      <Paper width={w} height={h} color={color} seed={seed} rim={rim}>
        {children}
      </Paper>
    </div>
  );
};

/**
 * Headline keywords: Noto Kufi Black, cream with a soft cast shadow; the accent word is filled
 * with a gold-leaf gradient and gets a hand-drawn gold underline. A blurred navy pool behind the
 * line keeps it readable over the white thobe without a hard box. Words animate as whole units.
 */
export const Keyword: React.FC<{
  words: string[];
  at: number;
  out: number;
  y: number;
  size?: number;
  hl?: number[];
  hlColor?: string;
}> = ({ words, at, out, y, size = 104, hl = [], hlColor = colors.yellow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = useOut(out);
  const pool = spring({ frame: frame - at, fps, config: theme.spring.smooth });
  const gold = hlColor === colors.yellow;
  const fill = gold
    ? "linear-gradient(180deg, #F3DA94 0%, #D9B25A 45%, #A9822F 100%)"
    : `linear-gradient(180deg, #A9EEFF 0%, ${colors.teal} 60%, #1C8FB0 100%)`;
  return (
    <div style={{ position: "absolute", top: y, left: 120, right: 120, opacity: 1 - o, transform: `translateY(${-24 * o}px)` }}>
      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          top: "18%",
          bottom: "10%",
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(4,10,22,0.78), rgba(4,10,22,0.45) 55%, transparent)",
          filter: "blur(28px)",
          transform: `scale(${interpolate(pool, [0, 1], [0.6, 1.25])})`,
          opacity: pool,
        }}
      />
      <div style={{ position: "relative", display: "flex", direction: "rtl", flexWrap: "wrap", justifyContent: "center", columnGap: size * 0.28 }}>
        {words.map((w, i) => {
          const p = spring({ frame: frame - at - i * 5, fps, config: theme.spring.snappy });
          const line = interpolate(frame, [at + i * 5 + 8, at + i * 5 + 20], [0, 1], { ...CLAMP, easing: theme.ease.out });
          const isHl = hl.includes(i);
          return (
            <span
              key={i}
              style={{
                position: "relative",
                display: "inline-block",
                fontFamily: fonts.headline,
                fontWeight: 900,
                fontSize: size,
                lineHeight: 1.5,
                letterSpacing: 0,
                opacity: Math.min(1, p * 1.6),
                transform: `translateY(${interpolate(p, [0, 1], [size * 0.45, 0])}px) scale(${interpolate(p, [0, 1], [0.86, 1])})`,
                filter: `blur(${interpolate(p, [0, 1], [10, 0], CLAMP)}px) drop-shadow(0 8px 18px rgba(0,0,0,0.55))`,
              }}
            >
              <span
                style={
                  isHl
                    ? { background: fill, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }
                    : { color: colors.chalk }
                }
              >
                {w}
              </span>
              {isHl ? (
                <svg
                  width="100%"
                  height={size * 0.3}
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                  style={{ position: "absolute", left: "4%", width: "92%", bottom: -size * 0.2, overflow: "visible" }}
                >
                  <path
                    d="M98 8 C70 14 40 4 2 12"
                    fill="none"
                    stroke={gold ? colors.yellow : colors.teal}
                    strokeWidth={5}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1 1"
                    strokeDashoffset={1 - line}
                  />
                </svg>
              ) : null}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/** Simple geometric glyphs for "different kinds of practice". */
export const Glyph: React.FC<{ kind: "tri" | "circle" | "grid" | "pen" | "wave" | "book" | "compass"; size: number; color?: string }> = ({
  kind,
  size,
  color = colors.ink,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <g fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
      {kind === "tri" && <path d="M50 14 L88 84 L12 84 Z" />}
      {kind === "circle" && (
        <>
          <circle cx={50} cy={50} r={34} />
          <circle cx={50} cy={50} r={12} fill={color} />
        </>
      )}
      {kind === "grid" && <path d="M18 18 H82 V82 H18 Z M18 50 H82 M50 18 V82" />}
      {kind === "pen" && <path d="M22 80 L30 60 L70 20 L80 30 L40 70 Z M30 60 L40 70" />}
      {kind === "book" && (
        <path d="M50 26 C38 18 22 18 12 22 V80 C22 76 38 76 50 84 C62 76 78 76 88 80 V22 C78 18 62 18 50 26 Z M50 26 V84" />
      )}
      {kind === "compass" && (
        <>
          <circle cx={50} cy={18} r={7} />
          <path d="M46 24 L24 86 M54 24 L76 86 M33 60 C42 66 58 66 67 60" />
        </>
      )}
      {kind === "wave" && <path d="M10 60 C25 30 40 30 50 50 C60 70 75 70 90 40" />}
    </g>
  </svg>
);
