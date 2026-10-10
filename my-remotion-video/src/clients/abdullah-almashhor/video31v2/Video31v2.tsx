import { AbsoluteFill } from "remotion";
import { Grain } from "../../../shared/components/Overlays";
import { GoldInkDefs } from "../components/GoldInkDefs";
import { colors } from "../video31/kit";
import { Sfx, SfxCue } from "../video31/Sfx";
import { Captions, Keywords, Kw } from "../video31/Words";
import { Footage2 } from "./Footage2";
import { SceneGraphics2 } from "./Scenes2";

// Same approved type system as v1; new placements to suit the new layouts.
const KEYWORDS: Kw[] = [
  { from: 0.03, to: 2.95, words: ["أسرع", "طريقة", "تفشل"], y: 1040, hl: [2] },
  { from: 3.0, to: 5.45, words: ["نفس", "النمط"], y: 1040, size: 118 },
  { from: 5.6, to: 7.25, words: ["شكل", "واحد"], y: 1250, size: 116 },
  {
    from: 7.3,
    to: 8.2,
    words: ["يخدعك"],
    y: 1250,
    size: 128,
    hl: [0],
    hlColor: colors.teal,
  },
  { from: 8.3, to: 9.65, words: ["شعور", "مؤقت"], y: 1225 },
  { from: 9.7, to: 11.7, words: ["أتقنت؟"], y: 1225, size: 116 },
  {
    from: 11.75,
    to: 13.05,
    words: ["لكن", "الصدمة"],
    y: 1040,
    size: 118,
    hl: [1],
  },
  { from: 13.85, to: 14.95, words: ["يتبخر"], y: 1150, size: 120 },
  { from: 16.8, to: 18.7, words: ["الحل", "المثبت"], y: 1040 },
  {
    from: 18.78,
    to: 20.45,
    words: ["التدريب", "المتداخل"],
    y: 1020,
    size: 106,
    hl: [1],
  },
  { from: 20.55, to: 22.5, words: ["لا", "تمرين", "واحد"], y: 1290 },
  { from: 22.6, to: 26.2, words: ["3", "أشكال"], y: 230, size: 116, hl: [0] },
  {
    from: 26.27,
    to: 27.75,
    words: ["ترتيب", "عشوائي"],
    y: 230,
    size: 116,
    hl: [1],
    hlColor: colors.teal,
  },
  { from: 29.7, to: 30.85, words: ["بيتعب", "عقلك"], y: 1040 },
  { from: 30.9, to: 32.8, words: ["المجهود", "يبني"], y: 230 },
  {
    from: 32.85,
    to: 33.98,
    words: ["روابط", "قوية"],
    y: 230,
    size: 116,
    hl: [1],
  },
  { from: 34.83, to: 36.0, words: ["الذاكرة"], y: 990, size: 118 },
  { from: 35.23, to: 36.0, words: ["طويلة", "المدى"], y: 1135, size: 118 },
];

const SFX: SfxCue[] = [
  { at: 0.12, src: "paper" }, // chart card
  { at: 2.95, src: "paper", vol: 0.8 }, // photocopies slide in
  { at: 5.45, src: "whoosh" },
  { at: 5.65, src: "click", vol: 0.7 }, // copier starts
  { at: 5.9, src: "paper", vol: 0.6 },
  { at: 6.35, src: "paper", vol: 0.6 },
  { at: 7.22, src: "pop", vol: 0.8 }, // infinity loop
  { at: 8.17, src: "whoosh", vol: 0.8 }, // split
  { at: 8.35, src: "paper", vol: 0.8 },
  { at: 9.45, src: "pop", vol: 0.7 }, // 100%
  { at: 11.68, src: "whoosh" }, // punch-in
  { at: 13.02, src: "whoosh" },
  { at: 13.82, src: "paper" }, // dissolve
  { at: 14.95, src: "pop", vol: 0.8 }, // calendar
  { at: 16.65, src: "whoosh", vol: 0.8 },
  { at: 18.7, src: "paper" }, // torn band
  { at: 18.8, src: "pop", vol: 0.8 },
  { at: 20.45, src: "whoosh", vol: 0.8 }, // arch
  { at: 21.33, src: "click" }, // X
  { at: 21.95, src: "paper", vol: 0.7 },
  { at: 22.5, src: "whoosh" }, // board
  { at: 22.75, src: "paper", vol: 0.8 },
  { at: 24.98, src: "click", vol: 0.6 },
  { at: 26.2, src: "click", vol: 0.8 }, // die
  { at: 26.27, src: "paper", vol: 0.8 }, // shuffle
  { at: 26.95, src: "paper", vol: 0.7 },
  { at: 27.74, src: "whoosh", vol: 0.8 },
  { at: 30.83, src: "whoosh", vol: 0.8 },
  { at: 32.8, src: "pop", vol: 0.8 },
  { at: 33.95, src: "whoosh", vol: 0.6 },
  { at: 35.18, src: "chime" },
];

/** Reel 31, version 2 — new layouts and graphics, same style and type system. */
export const Video31v2: React.FC = () => (
  <AbsoluteFill style={{ direction: "rtl", backgroundColor: colors.bgDeep }}>
    <GoldInkDefs />
    <SceneGraphics2 layer="under" />
    <Footage2 />
    <SceneGraphics2 layer="over" />
    <Keywords list={KEYWORDS} />
    <Captions list={KEYWORDS} />
    <Grain />
    <Sfx cues={SFX} />
  </AbsoluteFill>
);
