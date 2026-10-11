import { AbsoluteFill } from "remotion";
import { Grain } from "../../../shared/components/Overlays";
import { GoldInkDefs } from "../components/GoldInkDefs";
import { colors } from "../video31/kit";
import { Sfx } from "../video31/Sfx";
import { Keywords, Kw } from "../video31/Words";
import { Footage2 } from "../video31v2/Footage2";
import { SceneGraphics2 } from "../video31v2/Scenes2";
import { KEYWORDS as V2_KEYWORDS, SFX } from "../video31v2/Video31v2";
import { Sequence } from "remotion";
import { Captions3, ProgressLine } from "./Captions3";
import { STAMP_HITS, StampWord } from "./StampWord";

// Hook: the first headline is already fully on screen at frame 0 (it is the feed thumbnail),
// instead of animating in from nothing.
const KEYWORDS: Kw[] = V2_KEYWORDS.map((k, i) =>
  i === 0 ? { ...k, from: -0.6 } : k,
);

// "نفس النمط" is stamped (StampWord) instead of the regular headline; it stays in KEYWORDS so the
// caption still skips that line.
const HEADLINES = KEYWORDS.filter((k) => k.words.join(" ") !== "نفس النمط");
const STAMP_SFX = STAMP_HITS.map((at) => ({
  at: at - 0.03,
  src: "thump" as const,
}));
const SFX3 = [...SFX.filter((c) => !(c.at > 2.9 && c.at < 3.0)), ...STAMP_SFX];

/** Reel 31, version 3 — v2 edit + Segoe UI, karaoke captions, frame-0 hook, progress line. */
export const Video31v3: React.FC = () => (
  <AbsoluteFill style={{ direction: "rtl", backgroundColor: colors.bgDeep }}>
    <GoldInkDefs />
    <SceneGraphics2 layer="under" />
    <Footage2 />
    <SceneGraphics2 layer="over" />
    <Keywords list={HEADLINES} />
    <Sequence
      from={Math.round(2.8 * 30)}
      durationInFrames={Math.round(2.75 * 30)}
      layout="none"
      name="stamp-word"
    >
      <StampWord start={2.8} out={2.65} />
    </Sequence>
    <Captions3 list={KEYWORDS} />
    <ProgressLine />
    <Grain />
    <Sfx cues={SFX3} />
  </AbsoluteFill>
);
