import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP } from "../../../shared/components/motion";
import { colors, fonts, Keyword, theme } from "./kit";
import timing from "./timing.json";

export type Kw = {
  from: number;
  to: number;
  words: string[];
  y: number;
  size?: number;
  hl?: number[];
  hlColor?: string;
};

// On-screen motion keywords (global seconds). Everything else that is spoken goes to the caption.
export const KEYWORDS: Kw[] = [
  { from: 0.03, to: 2.95, words: ["أسرع", "طريقة", "تفشل"], y: 1030, hl: [2] },
  { from: 3.0, to: 5.45, words: ["نفس", "النمط"], y: 1030, size: 120 },
  { from: 5.6, to: 7.25, words: ["شكل", "واحد"], y: 250, size: 116 },
  {
    from: 7.3,
    to: 8.2,
    words: ["يخدعك"],
    y: 250,
    size: 130,
    hl: [0],
    hlColor: colors.teal,
  },
  { from: 8.3, to: 9.65, words: ["شعور", "مؤقت"], y: 1250 },
  { from: 9.7, to: 11.7, words: ["أتقنت؟"], y: 1250, size: 120 },
  {
    from: 11.75,
    to: 13.05,
    words: ["لكن", "الصدمة"],
    y: 1030,
    size: 116,
    hl: [1],
  },
  { from: 13.85, to: 16.65, words: ["يتبخر"], y: 250, size: 120 },
  { from: 16.8, to: 18.8, words: ["الحل", "المثبت"], y: 1030 },
  {
    from: 18.85,
    to: 20.45,
    words: ["التدريب", "المتداخل"],
    y: 1030,
    size: 112,
    hl: [1],
  },
  { from: 20.55, to: 22.5, words: ["لا", "تمرين", "واحد"], y: 1250 },
  { from: 22.6, to: 26.2, words: ["3", "أشكال"], y: 250, size: 116, hl: [0] },
  {
    from: 26.27,
    to: 27.75,
    words: ["ترتيب", "عشوائي"],
    y: 250,
    size: 116,
    hl: [1],
    hlColor: colors.teal,
  },
  { from: 29.7, to: 30.85, words: ["بيتعب", "عقلك"], y: 1030 },
  { from: 30.9, to: 32.8, words: ["المجهود", "يبني"], y: 250 },
  {
    from: 32.85,
    to: 33.98,
    words: ["روابط", "قوية"],
    y: 250,
    size: 116,
    hl: [1],
  },
  { from: 34.83, to: 36.0, words: ["الذاكرة"], y: 990, size: 118 },
  { from: 35.23, to: 36.0, words: ["طويلة", "المدى"], y: 1135, size: 118 },
];

export const Keywords: React.FC<{ list?: Kw[] }> = ({ list = KEYWORDS }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {list.map((k, i) => (
        <Sequence
          key={i}
          from={Math.round(k.from * fps)}
          durationInFrames={Math.round((k.to - k.from) * fps) + 1}
          layout="none"
          name={`kw-${k.words.join(" ")}`}
        >
          <Keyword
            words={k.words}
            at={0}
            out={Math.round((k.to - k.from) * fps) + (k.to >= 36 ? 99 : 0)}
            y={k.y}
            size={k.size}
            hl={k.hl}
            hlColor={k.hlColor}
          />
        </Sequence>
      ))}
    </>
  );
};

// A cue is captioned unless it repeats a keyword that is on screen at the same time.
const shownWith =
  (list: Kw[]) => (c: { from: number; to: number; text: string }) =>
    !list.some(
      (k) =>
        k.from < c.to &&
        k.to > c.from &&
        k.words.filter((w) => c.text.includes(w.replace("؟", ""))).length >=
          Math.min(2, k.words.length),
    );
const cuesFor = (list: Kw[]) => timing.cues.filter(shownWith(list));
const CUES = cuesFor(KEYWORDS);

/**
 * Caption for the spoken words that are not animated: IBM Plex Sans Arabic SemiBold, no box.
 * Readability comes from a soft bottom gradient + shadow; words appear as they are spoken.
 */
export const Captions: React.FC<{ list?: Kw[] }> = ({ list }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cues = list ? cuesFor(list) : CUES;
  const c = cues.find((q) => t >= q.from && t < q.to);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, transparent 62%, rgba(4,10,22,0.55) 78%, rgba(4,10,22,0.7) 100%)",
        }}
      />
      {c ? (
        <div
          style={{
            position: "absolute",
            top: 1410,
            left: 140,
            right: 140,
            display: "flex",
            direction: "rtl",
            flexWrap: "wrap",
            justifyContent: "center",
            columnGap: 14,
            fontFamily: fonts.caption,
            fontWeight: 500,
            fontSize: 56,
            lineHeight: 1.45,
            color: colors.chalk,
            textShadow: "0 2px 3px rgba(0,0,0,0.7), 0 6px 22px rgba(0,0,0,0.6)",
          }}
        >
          {c.text.split(" ").map((w, i, all) => {
            const start =
              Math.round(c.from * fps) +
              Math.round((((c.to - c.from) * fps) / all.length) * i * 0.8);
            const p = spring({
              frame: frame - start,
              fps,
              config: theme.spring.snappy,
            });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: interpolate(p, [0, 1], [0.0, 1], CLAMP),
                  transform: `translateY(${interpolate(p, [0, 1], [12, 0])}px)`,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
