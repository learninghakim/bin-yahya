// ─────────────────────────────────────────────────────────────────────────────
// <SignalReel> — renders a SignalSpec.
// Layers (bottom → top): footage (cuts + zooms) → beats (panels / stage / hook / slam)
// → bottom captions (every word, always) → audio (voice + Signal SFX).
// No colour grade on the person (identity rule): the look lives in the graphics.
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { parseMedia } from "@remotion/media-parser";
import type { Caption } from "@remotion/captions";
import { TalkingHead } from "../../components/footage/TalkingHead";
import { retimeCaptions, segmentsDuration } from "../../system/timeline";
import type { Segment } from "../../system/types";
import { VIDEO } from "../../system/safeArea";
import { SceneClock } from "./clock";
import { Panel } from "./Panel";
import { Burst, DisplayWords, HookCam, Slam, Stage, StageBackdrop, Viewfinder } from "./moments";
import { HookShatter, Barbell, Bolt, Book, BrainNet, Float, FollowArt, ForgetCurve, Gauge, Habits, IllusionBar, Journey, Toggle } from "./art";
import { AbsoluteFill as AF } from "remotion";
import { SignalCaptions } from "./SignalCaptions";
import { autoSfx, SIGNAL_SFX } from "./sfx";
import type { Art, Beat, SignalSpec, Widget } from "./types";
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

const ArtView: React.FC<{ a: Art }> = ({ a }) => {
  switch (a.type) {
    case "hookShatter": return <HookShatter checks={a.checks} shatterAt={a.shatterAt} />;
    case "gauge": return <Gauge at={a.at} settleAt={a.settleAt} left={a.left} right={a.right} />;
    case "bolt": return <Bolt at={a.at} />;
    case "illusion": return <IllusionBar fillAt={a.fillAt} trickAt={a.trickAt} full={a.full} trick={a.trick} />;
    case "book": return <Book title={a.title} openAt={a.openAt} peopleAt={a.peopleAt} chips={a.chips} />;
    case "curve": return <ForgetCurve feelAt={a.feelAt} realAt={a.realAt} longAt={a.longAt} feel={a.feel} real={a.real} xLabel={a.xLabel} yLabel={a.yLabel} />;
    case "habits": return <Habits pageAt={a.pageAt} highlightAt={a.highlightAt} rereadAt={a.rereadAt} illusionAt={a.illusionAt} crackAt={a.crackAt} bubble={a.bubble} />;
    case "toggle": return <Toggle flipAt={a.flipAt} off={a.off} on={a.on} />;
    case "journey": return <Journey stops={a.stops} />;
    case "barbell": return <Barbell liftAt={a.liftAt} squeezeAt={a.squeezeAt} />;
    case "brain": return <BrainNet weakAt={a.weakAt} crossAt={a.crossAt} buildAt={a.buildAt} strongAt={a.strongAt} weak={a.weak} />;
    case "follow": return <FollowArt tapAt={a.tapAt} bellAt={a.bellAt} button={a.button} done={a.done} />;
  }
};

const BeatView: React.FC<{ b: Beat }> = ({ b }) => {
  switch (b.kind) {
    case "hookCam": return <HookCam words={b.words} highlight={b.highlight} />;
    case "burst": return <Burst icon={b.icon} at={b.at} words={b.words} highlight={b.highlight} />;
    case "stage": return <Stage icon={b.icon} label={b.label} title={b.title} highlight={b.highlight} chips={b.chips} />;
    case "slam": return <Slam words={b.words} label={b.label} highlight={b.highlight} />;
    case "art":
      if (b.stage) {
        return (
          <AF>
            <StageBackdrop />
            <Float y={b.y ?? 860} h={1100} halo={0}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
                {b.title ? <DisplayWords words={b.title} highlight={b.highlight} size={96} stroke={false} /> : null}
                <ArtView a={b.art} />
              </div>
            </Float>
          </AF>
        );
      }
      return (
        <AF>
          {b.viewfinder ? <Viewfinder /> : null}
          <Float y={b.y} halo={b.art.type === "brain" || b.art.type === "habits" ? 0.75 : 0.62}>
            <ArtView a={b.art} />
          </Float>
        </AF>
      );
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

/**
 * Camera FX on the footage, driven by hook beats: a punch-in from 1.28× at `punchAt` (+ white flash)
 * and a decaying shake at `shatterAt`.
 */
const CameraFX: React.FC<{ beats: Beat[]; children: React.ReactNode }> = ({ beats, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let scale = 1, dx = 0, dy = 0, flash = 0, red = 0;
  for (const b of beats) {
    if (b.kind !== "art" || b.art.type !== "hookShatter") continue;
    const { punchAt, shatterAt } = b.art;
    const p = interpolate(t, [punchAt, punchAt + 0.32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 0.8, 0.2, 1) });
    if (t >= punchAt) scale *= 1.28 - 0.28 * p;
    flash = Math.max(flash, interpolate(t, [punchAt, punchAt + 0.03, punchAt + 0.2], [0, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    const k = t - shatterAt;
    if (k >= 0 && k < 0.5) {
      const amp = 22 * Math.exp(-k * 7);
      dx += Math.sin(k * 90) * amp;
      dy += Math.cos(k * 77) * amp * 0.7;
      scale *= 1 + 0.06 * Math.exp(-k * 6);
      flash = Math.max(flash, interpolate(k, [0, 0.03, 0.15], [0, 0.45, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    }
    red = Math.max(red, interpolate(k, [0, 0.08, 0.55], [0, 0.32, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  }
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) scale(${scale})`, transformOrigin: "50% 35%" }}>{children}</AbsoluteFill>
      {red > 0 ? <AbsoluteFill style={{ background: "#FF3B2F", opacity: red, mixBlendMode: "multiply" }} /> : null}
      {flash > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: flash }} /> : null}
    </AbsoluteFill>
  );
};

export const SignalReel: React.FC<SignalProps> = ({ spec, resolved }) => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const segments = spec.segments ?? resolved?.segments ?? [];
  const captions = resolved?.captions?.length ? retimeCaptions(resolved.captions, segments) : [];
  const sounds = [...(spec.sfx === false ? [] : autoSfx(spec.beats)), ...(spec.sfxExtra ?? [])];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <CameraFX beats={spec.beats}>
        <TalkingHead src={spec.video} segments={spec.segments ?? resolved?.segments} zooms={spec.zooms} volume={spec.videoVolume ?? 1} />
      </CameraFX>
      {spec.beats.map((b, i) => (
        <Sequence key={i} from={f(b.from)} durationInFrames={Math.max(1, f(b.to) - f(b.from))} name={`${b.kind} ${i + 1}`}>
          <SceneClock from={b.from} to={b.to}>
            <BeatView b={b} />
          </SceneClock>
        </Sequence>
      ))}
      {captions.length ? <SignalCaptions captions={captions} /> : null}
      {sounds.map((s, i) => (
        <Sequence key={`s${i}`} from={Math.max(0, f(s.at - SIGNAL_SFX[s.name].lead))} durationInFrames={f(SIGNAL_SFX[s.name].lead + 2.7)} layout="none">
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
