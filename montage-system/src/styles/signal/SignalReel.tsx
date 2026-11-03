// ─────────────────────────────────────────────────────────────────────────────
// <SignalReel> — renders a SignalSpec.
// Layers (bottom → top): footage (cuts + zooms) → beats (panels / stage / hook / slam)
// → bottom captions (every word, always) → audio (voice + Signal SFX).
// No colour grade on the person (identity rule): the look lives in the graphics.
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, Sequence, staticFile, useVideoConfig } from "remotion";
import { parseMedia } from "@remotion/media-parser";
import type { Caption } from "@remotion/captions";
import { TalkingHead } from "../../components/footage/TalkingHead";
import { retimeCaptions, segmentsDuration } from "../../system/timeline";
import type { Segment } from "../../system/types";
import { VIDEO } from "../../system/safeArea";
import { SceneClock } from "./clock";
import { Panel } from "./Panel";
import { Burst, HookCam, Slam, Stage } from "./moments";
import { SignalCaptions } from "./SignalCaptions";
import { autoSfx, SIGNAL_SFX } from "./sfx";
import type { Beat, SignalSpec, Widget } from "./types";
import { Checklist } from "./widgets/Checklist";
import { Stepper } from "./widgets/Stepper";
import { Bars } from "./widgets/Bars";
import { Reframe } from "./widgets/Reframe";
import { Links } from "./widgets/Links";
import { Follow } from "./widgets/Follow";
import { Chips } from "./widgets/Chips";
import { IconTitle } from "./widgets/IconTitle";
import "./fonts";

export type SignalProps = { spec: SignalSpec; resolved?: { segments: Segment[]; captions: Caption[] } };

const WidgetView: React.FC<{ w: Widget }> = ({ w }) => {
  switch (w.type) {
    case "checklist": return <Checklist rows={w.rows} />;
    case "stepper": return <Stepper steps={w.steps} note={w.note} />;
    case "bars": return <Bars bars={w.bars} />;
    case "reframe": return <Reframe from={w.from} strikeAt={w.strikeAt} to={w.to} />;
    case "links": return <Links at={w.at} strongAt={w.strongAt} label={w.label} />;
    case "follow": return <Follow title={w.title} tapAt={w.tapAt} bell={w.bell} />;
    case "chips": return <Chips chips={w.chips} />;
    case "iconTitle": return <IconTitle icon={w.icon} title={w.title} at={w.at} sub={w.sub} tone={w.tone} />;
  }
};

const BeatView: React.FC<{ b: Beat }> = ({ b }) => {
  switch (b.kind) {
    case "hookCam": return <HookCam words={b.words} highlight={b.highlight} />;
    case "burst": return <Burst icon={b.icon} at={b.at} words={b.words} highlight={b.highlight} />;
    case "stage": return <Stage icon={b.icon} label={b.label} title={b.title} highlight={b.highlight} chips={b.chips} />;
    case "slam": return <Slam words={b.words} label={b.label} highlight={b.highlight} />;
    case "panel":
      return (
        <Panel label={b.label} top={b.top}>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {b.widgets.map((w, i) => <WidgetView key={i} w={w} />)}
          </div>
        </Panel>
      );
  }
};

export const SignalReel: React.FC<SignalProps> = ({ spec, resolved }) => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const segments = spec.segments ?? resolved?.segments ?? [];
  const captions = resolved?.captions?.length ? retimeCaptions(resolved.captions, segments) : [];
  const sounds = [...(spec.sfx === false ? [] : autoSfx(spec.beats)), ...(spec.sfxExtra ?? [])];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <TalkingHead src={spec.video} segments={spec.segments ?? resolved?.segments} zooms={spec.zooms} volume={spec.videoVolume ?? 1} />
      {spec.beats.map((b, i) => (
        <Sequence key={i} from={f(b.from)} durationInFrames={Math.max(1, f(b.to) - f(b.from))} name={`${b.kind} ${i + 1}`}>
          <SceneClock from={b.from} to={b.to}>
            <BeatView b={b} />
          </SceneClock>
        </Sequence>
      ))}
      {captions.length ? <SignalCaptions captions={captions} /> : null}
      {sounds.map((s, i) => (
        <Sequence key={`s${i}`} from={Math.max(0, f(s.at) - 1)} durationInFrames={f(0.8)} layout="none">
          <Audio src={staticFile(SIGNAL_SFX[s.name].file)} volume={SIGNAL_SFX[s.name].volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const calculateSignalMetadata: CalculateMetadataFunction<SignalProps> = async ({ props }) => {
  const { spec } = props;
  let segments = spec.segments;
  if (!segments && spec.video) {
    const { slowDurationInSeconds } = await parseMedia({ src: staticFile(spec.video), fields: { slowDurationInSeconds: true }, acknowledgeRemotionLicense: true });
    segments = [{ start: 0, end: slowDurationInSeconds }];
  }
  const seconds = spec.duration ?? (segments ? segmentsDuration(segments) : Math.max(10, ...spec.beats.map((b) => b.to)));
  let captions: Caption[] = [];
  if (spec.captions) {
    const res = await fetch(staticFile(spec.captions.src));
    if (res.ok) captions = (await res.json()) as Caption[];
  }
  return { durationInFrames: Math.max(1, Math.round(seconds * VIDEO.fps)), props: { ...props, resolved: { segments: segments ?? [], captions } } };
};
