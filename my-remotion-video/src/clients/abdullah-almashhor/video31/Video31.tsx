import { AbsoluteFill } from "remotion";
import { Grain } from "../../../shared/components/Overlays";
import { GoldInkDefs } from "../components/GoldInkDefs";
import { colors } from "./kit";
import { Footage } from "./Footage";
import { SceneGraphics } from "./Scenes";
import { Captions, Keywords } from "./Words";

/** Reel 31 — interleaved practice. Original audio only; footage never colour-graded. */
export const Video31: React.FC = () => (
  <AbsoluteFill style={{ direction: "rtl", backgroundColor: colors.bgDeep }}>
    <GoldInkDefs />
    <SceneGraphics layer="under" />
    <Footage />
    <SceneGraphics layer="over" />
    <Keywords />
    <Captions />
    <Grain />
  </AbsoluteFill>
);
