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

/** Keyword line: words spring in one by one (whole words — Arabic shaping intact). */
export const Keyword: React.FC<{
  words: string[];
  at: number;
  out: number;
  y: number;
  size?: number;
  hl?: number[]; // indexes of words shown on a gold/cyan paper strip
  hlColor?: string;
}> = ({ words, at, out, y, size = 104, hl = [], hlColor = colors.yellow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = useOut(out);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 140,
        right: 140,
        display: "flex",
        direction: "rtl",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 24,
        opacity: 1 - o,
        transform: `translateY(${-30 * o}px) scale(${1 - 0.05 * o})`,
      }}
    >
      {words.map((w, i) => {
        const p = spring({ frame: frame - at - i * 4, fps, config: theme.spring.bouncy });
        const isHl = hl.includes(i);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              position: "relative",
              padding: "0 24px",
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: size,
              lineHeight: 1.35,
              color: isHl ? colors.ink : colors.chalk,
              zIndex: 0,
              textShadow: "none",
              opacity: Math.min(1, p * 1.5),
              transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px) scale(${interpolate(p, [0, 1], [0.7, 1])}) rotate(${isHl ? -2 : 0}deg)`,
              filter: `blur(${interpolate(p, [0, 1], [8, 0], CLAMP)}px)`,
            }}
          >
            {(
              <span
                style={{
                  position: "absolute",
                  inset: "14px 0 6px",
                  zIndex: -1,
                  background: isHl ? hlColor : "rgba(10, 21, 38, 0.88)",
                  borderRadius: 6,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.35)",
                  transform: `scaleX(${p})`,
                  transformOrigin: "right",
                }}
              />
            )}
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Simple geometric glyphs for "different kinds of practice". */
export const Glyph: React.FC<{ kind: "tri" | "circle" | "grid" | "pen" | "wave"; size: number; color?: string }> = ({
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
      {kind === "wave" && <path d="M10 60 C25 30 40 30 50 50 C60 70 75 70 90 40" />}
    </g>
  </svg>
);
