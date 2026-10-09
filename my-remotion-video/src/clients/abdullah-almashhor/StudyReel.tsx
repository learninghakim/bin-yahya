import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { Background } from "../../shared/components/Background";
import { ChalkDefs } from "../../shared/components/Chalk";
import { Grade, Grain, Vignette } from "../../shared/components/Overlays";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Hook } from "./scenes/Scene2Hook";
import { Scene3Points } from "./scenes/Scene3Points";
import { Scene4Cta } from "./scenes/Scene4Cta";

const SCENES = [
  { key: "scene1", Component: Scene1Intro },
  { key: "scene2", Component: Scene2Hook },
  { key: "scene3", Component: Scene3Points },
  { key: "scene4", Component: Scene4Cta },
] as const;

type Sfx = { at: number; src: string; volume: number };

// Cue times in seconds. SFX land 2–3 frames before the visual hit.
const SFX: Sfx[] = [
  { at: 0.0, src: "pop", volume: 0.45 },
  { at: 0.2, src: "whoosh", volume: 0.35 },
  { at: 0.95, src: "paper", volume: 0.6 },
  { at: 2.3, src: "whoosh", volume: 0.25 },
  { at: 4.8, src: "whoosh", volume: 0.3 },
  { at: 5.0, src: "thump", volume: 0.6 },
  { at: 5.65, src: "pop", volume: 0.35 },
  { at: 6.45, src: "whoosh", volume: 0.2 },
  { at: 6.95, src: "paper", volume: 0.6 },
  { at: 7.3, src: "paper", volume: 0.4 },
  { at: 8.0, src: "paper", volume: 0.5 },
  { at: 8.35, src: "pop", volume: 0.3 },
  { at: 11.8, src: "whoosh", volume: 0.3 },
  { at: 12.0, src: "thump", volume: 0.6 },
  { at: 12.25, src: "paper", volume: 0.6 },
  { at: 13.2, src: "paper", volume: 0.6 },
  { at: 14.15, src: "paper", volume: 0.6 },
  { at: 15.28, src: "pop", volume: 0.35 },
  { at: 15.48, src: "pop", volume: 0.35 },
  { at: 15.68, src: "pop", volume: 0.35 },
  { at: 17.8, src: "whoosh", volume: 0.3 },
  { at: 18.0, src: "thump", volume: 0.6 },
  { at: 18.85, src: "click", volume: 0.6 },
  { at: 18.92, src: "chime", volume: 0.55 },
];

export const StudyReel: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (seconds: number) => Math.round(seconds * fps);

  return (
    <AbsoluteFill style={{ direction: "rtl", backgroundColor: theme.colors.bgDeep }}>
      <ChalkDefs />
      {/* 1. background */}
      <Background />

      {/* 2–3. assets + graphics/type, one Sequence per scene */}
      {SCENES.map(({ key, Component }) => {
        const t = theme.timing[key];
        return (
          <Sequence key={key} name={key} from={f(t.from)} durationInFrames={f(t.duration)} layout="none">
            <AbsoluteFill>
              <Component />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* 4. grade, 5. grain + vignette */}
      <Grade />
      <Grain />
      <Vignette />

      {/* Sound */}
      <Audio src={staticFile("sfx/pad.wav")} volume={0.55} />
      {SFX.map((cue, i) => (
        <Sequence key={i} from={Math.max(0, f(cue.at))} durationInFrames={f(1.6)} layout="none" name={`sfx-${cue.src}`}>
          <Audio src={staticFile(`sfx/${cue.src}.wav`)} volume={cue.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
