// ─────────────────────────────────────────────────────────────────────────────
// <Reel> — the one composition that edits every video.
// Layer stack (bottom → top):
//   1. footage (talking head, jump cuts, zooms)
//   2. color grade
//   3. overlay scenes (motion graphics)
//   4. captions
//   5. progress bar, flashes
//   6. grain + vignette
//   7. audio: SFX + music
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Caption } from "@remotion/captions";
import { ThemeProvider } from "../theme/ThemeContext";
import { TalkingHead, Zoom } from "../components/footage/TalkingHead";
import { Grade, Grain, Vignette } from "../components/fx/Finish";
import { FlashCut } from "../components/fx/FlashCut";
import { SafeZoneGuide } from "../components/fx/SafeZoneGuide";
import { ProgressBar } from "../components/graphics/ProgressBar";
import { Captions } from "../components/text/Captions";
import { HookScene, HookProps } from "../templates/HookScene";
import { ExplanationScene, ExplanationProps } from "../templates/ExplanationScene";
import { PointsScene, PointsProps } from "../templates/PointsScene";
import { CTAScene, CTAProps } from "../templates/CTAScene";
import { StatScene, StatProps } from "../templates/StatScene";
import { LowerThirdScene, LowerThirdProps } from "../templates/LowerThirdScene";
import { IconPopScene, IconPopProps } from "../templates/IconPopScene";
import { Sfx, SfxName } from "./sfx";
import { retimeCaptions, segmentOffsets } from "./timeline";
import type { ReelSpec, SceneSpec, Segment } from "./types";

export type ReelProps = {
  spec: ReelSpec;
  /** Filled by calculateReelMetadata — do not set by hand. */
  resolved?: { segments: Segment[]; captions: Caption[] };
};

const DEFAULT_SFX: Record<SceneSpec["type"], SfxName> = {
  hook: "whoosh",
  explanation: "whoosh",
  points: "whoosh",
  cta: "pop",
  stat: "thump",
  lowerThird: "click",
  iconPop: "pop",
};

/** Renders one scene spec with the matching template. */
export const SceneRenderer: React.FC<{ scene: SceneSpec }> = ({ scene }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, from, to, sfx, ...rest } = scene;
  // The discriminated union is checked in types.ts; here we just forward the props.
  const props = rest as unknown;
  switch (scene.type) {
    case "hook": return <HookScene {...(props as HookProps)} />;
    case "explanation": return <ExplanationScene {...(props as ExplanationProps)} />;
    case "points": return <PointsScene {...(props as PointsProps)} />;
    case "cta": return <CTAScene {...(props as CTAProps)} />;
    case "stat": return <StatScene {...(props as StatProps)} />;
    case "lowerThird": return <LowerThirdScene {...(props as LowerThirdProps)} />;
    case "iconPop": return <IconPopScene {...(props as IconPopProps)} />;
  }
};

const DEFAULT_PLACEMENT: Record<SceneSpec["type"], string> = {
  hook: "top", explanation: "bottom", points: "bottom", cta: "bottom", stat: "center", lowerThird: "bottom", iconPop: "top",
};

/** Captions sit at the bottom; hide them while a bottom/full-screen overlay is on screen. */
const captionClash = (s: SceneSpec) => {
  const placement = ("placement" in s && s.placement) || DEFAULT_PLACEMENT[s.type];
  return placement === "bottom" || ("backdrop" in s && s.backdrop === "full");
};

export const Reel: React.FC<ReelProps> = ({ spec, resolved }) => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const segments = spec.segments ?? resolved?.segments ?? [];

  const zooms: Zoom[] = [...(spec.zooms ?? [])];
  if (spec.autoPunchIn && segments.length > 1) {
    segmentOffsets(segments).forEach((at, i) => zooms.push({ at, scale: i % 2 ? 1.12 : 1, style: "cut" }));
  }

  const captions = resolved?.captions?.length ? retimeCaptions(resolved.captions, segments) : [];

  return (
    <ThemeProvider colors={spec.colors}>
      <AbsoluteFill style={{ background: "#000" }}>
        <TalkingHead src={spec.video} segments={spec.segments ?? resolved?.segments} zooms={zooms} volume={spec.videoVolume ?? 1} />
        <Grade />

        {spec.scenes.map((scene, i) => (
          <Sequence key={i} from={f(scene.from)} durationInFrames={Math.max(1, f(scene.to) - f(scene.from))} name={`${scene.type} ${i + 1}`}>
            <SceneRenderer scene={scene} />
          </Sequence>
        ))}

        {captions.length ? (
          <Captions captions={captions} y={spec.captions?.y} hideDuring={spec.scenes.filter(captionClash).map((s) => ({ from: s.from, to: s.to }))} />
        ) : null}

        {spec.progressBar ? <ProgressBar /> : null}
        {(spec.flashes ?? []).map((t, i) => (
          <Sequence key={`fl${i}`} from={Math.max(0, f(t) - 2)} durationInFrames={10}>
            <FlashCut />
          </Sequence>
        ))}

        <Grain />
        <Vignette />
        {spec.showSafeZone ? <SafeZoneGuide /> : null}

        {spec.sfx !== false
          ? spec.scenes.map((s, i) => (s.sfx === false ? null : <Sfx key={`sfx${i}`} name={s.sfx ?? DEFAULT_SFX[s.type]} at={f(s.from)} />))
          : null}
        {spec.music ? <Audio src={staticFile(spec.music.src)} volume={spec.music.volume ?? 0.12} loop /> : null}
      </AbsoluteFill>
    </ThemeProvider>
  );
};
