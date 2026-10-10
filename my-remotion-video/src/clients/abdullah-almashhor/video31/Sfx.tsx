import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile, useVideoConfig } from "remotion";

type Cue = {
  at: number;
  src: "whoosh" | "paper" | "pop" | "click" | "chime";
  vol?: number;
};

// Voice sits at about -16.6 LUFS. Base gains keep every effect roughly 18–20 dB under it,
// so they read as texture, never over the words. Cues land ~2 frames before the visual hit.
// Overall SFX trim requested by the client: −8%.
const SFX_TRIM = 0.92;
const GAIN: Record<Cue["src"], number> = {
  whoosh: 0.16,
  paper: 0.24,
  pop: 0.18,
  click: 0.2,
  chime: 0.3,
};

const CUES: Cue[] = [
  { at: 0.12, src: "paper" }, // tally sheet + clock
  { at: 0.75, src: "click" }, // X over the sheet
  { at: 5.45, src: "whoosh" }, // → collage
  { at: 5.68, src: "paper" }, // deck fans out
  { at: 7.25, src: "pop", vol: 0.8 }, // eye
  { at: 8.17, src: "whoosh", vol: 0.8 }, // → paper frame
  { at: 8.4, src: "click" }, // stamp
  { at: 11.68, src: "whoosh" }, // back to Abdullah + push-in
  { at: 13.02, src: "whoosh" }, // → collage
  { at: 13.8, src: "paper", vol: 0.9 }, // mastery tears away
  { at: 14.95, src: "paper" }, // exam sheet
  { at: 16.65, src: "whoosh", vol: 0.8 },
  { at: 16.85, src: "paper", vol: 0.7 },
  { at: 17.25, src: "paper", vol: 0.6 },
  { at: 17.65, src: "paper", vol: 0.6 },
  { at: 18.78, src: "pop" }, // "المتداخل"
  { at: 20.45, src: "whoosh", vol: 0.8 },
  { at: 21.35, src: "click" }, // X
  { at: 22.5, src: "whoosh" }, // → clock collage
  { at: 22.68, src: "paper" },
  { at: 24.98, src: "click", vol: 0.7 }, // shuffle beat 1
  { at: 26.25, src: "paper", vol: 0.8 }, // shuffle beat 2
  { at: 26.95, src: "paper", vol: 0.7 }, // shuffle beat 3
  { at: 27.74, src: "whoosh", vol: 0.8 },
  { at: 30.83, src: "whoosh", vol: 0.8 }, // → network head
  { at: 32.8, src: "pop", vol: 0.8 }, // "روابط قوية"
  { at: 33.95, src: "whoosh", vol: 0.6 },
  { at: 35.18, src: "chime" }, // "طويلة المدى"
];

/** Soft sound design on top of the original voice (no music). */
export const Sfx: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <>
      {CUES.map((c, i) => {
        const from = Math.round(c.at * fps);
        const len = Math.min(Math.round(1.6 * fps), durationInFrames - from);
        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={len}
            layout="none"
            name={`sfx-${c.src}`}
          >
            <Audio
              src={staticFile(`sfx/${c.src}.wav`)}
              // short fade at the tail so nothing clicks when cut by the end of the reel
              volume={(f) =>
                GAIN[c.src] *
                SFX_TRIM *
                (c.vol ?? 1) *
                interpolate(f, [len - 6, len], [1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              }
            />
          </Sequence>
        );
      })}
    </>
  );
};
