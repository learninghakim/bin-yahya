import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP } from "../../../shared/components/motion";
import { colors, fonts, theme } from "../video31/kit";
import timing from "../video31/timing.json";
import { Kw } from "../video31/Words";

type Cue = { from: number; to: number; text: string };

// Same de-dup rule as v1/v2: skip a cue when its words are already animated on screen.
const visibleCues = (list: Kw[]): Cue[] =>
  timing.cues.filter(
    (c) =>
      !list.some(
        (k) =>
          k.from < c.to &&
          k.to > c.from &&
          k.words.filter((w) => c.text.includes(w.replace("؟", ""))).length >=
            Math.min(2, k.words.length),
      ),
  );

/** Spread a cue's time over its words, weighted by word length (≈ how long it takes to say). */
const wordTimes = (c: Cue) => {
  const words = c.text.split(" ");
  const weights = words.map((w) => w.length + 2);
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = c.from;
  return words.map((w, i) => {
    const start = acc;
    acc += ((c.to - c.from) * weights[i]) / total;
    return { w, start, end: acc };
  });
};

/**
 * Karaoke caption: words pop in as they are spoken; the word being said glows gold, scales up and
 * gets a short gold underline; spoken words settle to cream. Lines tilt slightly, alternating.
 */
export const Captions3: React.FC<{ list: Kw[] }> = ({ list }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cues = visibleCues(list);
  const idx = cues.findIndex((q) => t >= q.from && t < q.to + 0.12);
  const c = cues[idx];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, transparent 64%, rgba(4,10,22,0.5) 80%, rgba(4,10,22,0.68) 100%)",
        }}
      />
      {c ? (
        <div
          style={{
            position: "absolute",
            top: 1400,
            left: 130,
            right: 130,
            display: "flex",
            direction: "rtl",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "flex-end",
            columnGap: 16,
            fontFamily: fonts.caption,
            fontWeight: 700,
            fontSize: 60,
            lineHeight: 1.35,
            transform: `rotate(${idx % 2 ? 1.2 : -1.2}deg)`,
          }}
        >
          {wordTimes(c).map(({ w, start, end }, i) => {
            const s = Math.round(start * fps);
            const p = spring({
              frame: frame - s,
              fps,
              config: theme.spring.bouncy,
            });
            const active = t >= start && t < end + 0.05;
            const glow = spring({
              frame: frame - s,
              fps,
              config: theme.spring.snappy,
              durationInFrames: 8,
            });
            const hot = active ? glow : 0;
            return (
              <span
                key={i}
                style={{
                  position: "relative",
                  display: "inline-block",
                  opacity: interpolate(p, [0, 0.4], [0, 1], CLAMP),
                  transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px) scale(${interpolate(p, [0, 1], [0.6, 1]) * (1 + 0.1 * hot)})`,
                  color: active ? "#F1CF7A" : colors.chalk,
                  textShadow: active
                    ? "0 0 22px rgba(226,188,94,0.55), 0 3px 4px rgba(0,0,0,0.75)"
                    : "0 3px 4px rgba(0,0,0,0.75), 0 8px 24px rgba(0,0,0,0.6)",
                }}
              >
                {w}
                <span
                  style={{
                    position: "absolute",
                    left: "6%",
                    right: "6%",
                    bottom: -8,
                    height: 6,
                    borderRadius: 3,
                    background: colors.yellow,
                    transform: `scaleX(${active ? glow : 0})`,
                    transformOrigin: "right",
                    boxShadow: "0 0 10px rgba(201,162,75,0.7)",
                  }}
                />
              </span>
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** Thin gold progress line at the very top — a light retention cue. */
export const ProgressLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        height: 7,
        width: `${(frame / (durationInFrames - 1)) * 100}%`,
        background: `linear-gradient(270deg, ${colors.yellow}, #F1CF7A)`,
        boxShadow: "0 0 12px rgba(201,162,75,0.6)",
      }}
    />
  );
};
