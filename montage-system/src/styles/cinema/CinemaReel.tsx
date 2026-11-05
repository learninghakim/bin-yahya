// ─────────────────────────────────────────────────────────────────────────────
// <CinemaReel> — CINEMA style. Layers: footage (film grade, gate weave, zooms) → beats → serif captions →
// letterbox bars → light leaks → grain/vignette → audio.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { TalkingHead } from "../../components/footage/TalkingHead";
import { Grain, Vignette } from "../../components/fx/Finish";
import { retimeCaptions } from "../../system/timeline";
import { SceneClock } from "../signal/clock";
import "../common/fonts";
import { chunkPhrases, isArabic, makeMetadata, Resolved, retimePauses, toWords, Word } from "../common/metadata";
import { Cue, rotor, SfxTrack } from "../common/SfxTrack";
import { CinemaBeatView } from "./beats";
import { CI } from "./tokens";
import type { CinemaSpec } from "./types";

export type CinemaProps = { spec: CinemaSpec; resolved?: Resolved };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return f / fps; };

const CinemaCaptions: React.FC<{ pauses: [number, number][]; words: Word[]; hide: { from: number; to: number }[] }> = ({ words, pauses, hide }) => {
  const t = useT();
  const chunks = useMemo(() => chunkPhrases(words, 5, { maxChars: 28, pauses }), [words, pauses]);
  if (hide.some((h) => t >= h.from && t < h.to)) return null;
  const c = chunks.find((k) => t >= k.show && t < k.hide);
  if (!c) return null;
  const a = interpolate(t, [c.show, c.show + 0.14, c.hide - 0.1, c.hide], [0, 1, 1, 0], cl);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div dir="rtl" style={{ position: "absolute", top: CI.layout.captionY, left: 60, right: 60, display: "flex", justifyContent: "center", gap: 18, opacity: a, transform: "translateY(-50%)" }}>
        {c.words.map((w, i) => {
          const next = c.words[i + 1];
          const cur = t >= w.s - 0.03 && (!next || t < next.s - 0.03);
          return (
            <span key={i} style={{ fontFamily: CI.font, fontWeight: 700, fontSize: 60, lineHeight: 1.5, color: cur ? CI.gold : CI.cream, whiteSpace: "nowrap", textShadow: "0 3px 3px rgba(0,0,0,0.9), 0 0 24px rgba(0,0,0,0.75)", direction: isArabic(w.text) ? "rtl" : "ltr", unicodeBidi: "isolate" }}>
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Warm light leak sweeping across the frame. */
const Leaks: React.FC<{ at: number[] }> = ({ at }) => {
  const t = useT();
  const k = at.map((a) => t - a).find((d) => d >= -0.2 && d < 0.9);
  if (k === undefined) return null;
  const o = interpolate(k, [-0.2, 0.15, 0.9], [0, 0.75, 0], cl);
  const x = interpolate(k, [-0.2, 0.9], [-20, 120], cl);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity: o, background: `radial-gradient(ellipse 60% 80% at ${x}% 40%, rgba(255,170,80,0.9), rgba(255,90,40,0.35) 45%, transparent 70%)` }} />
  );
};

const cinemaSfx = (spec: CinemaSpec): Cue[] => {
  const r = rotor({ soft: ["swoosh", "whoosh2", "whooshLow"], ui: ["tick", "tick2", "click"] });
  const out: Cue[] = (spec.leaks ?? []).map((a) => ({ name: "whooshLow" as const, at: a, gain: 0.7 }));
  for (const b of spec.beats) {
    if (b.sfx === false) continue;
    switch (b.kind) {
      case "chapter": out.push({ name: "suck", at: b.from, gain: 0.7 }, { name: "boom", at: b.from + 0.05, gain: 0.8 }, { name: "whooshLow", at: b.to - 0.3, gain: 0.6 }); break;
      case "quote": out.push({ name: r("soft"), at: b.words[0].at - 0.2, gain: 0.5 }); break;
      case "lower": out.push({ name: r("soft"), at: b.title.at - 0.2, gain: 0.5 }); break;
      case "triptych": b.items.forEach((x) => out.push({ name: r("ui"), at: x.at, gain: 0.6 })); if (b.glowAt !== undefined) out.push({ name: "reveal", at: b.glowAt, gain: 0.6 }); break;
      case "evidence": for (let k = 0; k < 6; k++) out.push({ name: "tick", at: b.at - 0.9 + k * 0.15, gain: 0.5 }); out.push({ name: "boom", at: b.at, gain: 0.9 }); break;
      case "strike": out.push({ name: "swoosh", at: b.strikeAt + 0.1, gain: 0.8 }, { name: "punch", at: b.strikeAt + 0.35, gain: 0.6 }); break;
      case "iris": out.push({ name: "suck", at: b.closeAt, gain: 0.7 }, { name: "hit", at: b.closeAt + 0.45, gain: 0.7 }, { name: "reveal", at: b.openAt, gain: 0.6 }); break;
      case "end": out.push({ name: "chime", at: b.words[b.words.length - 1].at, gain: 0.7 }); break;
    }
  }
  return out;
};

export const CinemaReel: React.FC<CinemaProps> = ({ spec, resolved }) => {
  const { fps } = useVideoConfig();
  const t = useT();
  const f = (s: number) => Math.round(s * fps);
  const segments = useMemo(() => spec.segments ?? resolved?.segments ?? [], [spec.segments, resolved]);
  const pauses = useMemo(() => retimePauses(resolved?.pauses, segments), [resolved, segments]);
  const words = useMemo(() => toWords(resolved?.captions?.length ? retimeCaptions(resolved.captions, segments) : []), [resolved, segments]);
  const cues = [...(spec.sfx === false ? [] : cinemaSfx(spec)), ...(spec.sfxExtra ?? [])];
  const bars = interpolate(t, [0, 0.8], [0, 1], { ...cl, easing: CI.ease.inOut });
  const weave = { x: Math.sin(t * 7.3) * 0.8 + Math.sin(t * 13.1) * 0.5, y: Math.cos(t * 5.7) * 0.7 };
  const hide = spec.beats.filter((b) => b.kind === "chapter").map((b) => ({ from: b.from, to: b.to }));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `translate(${weave.x}px, ${weave.y}px)`, filter: "contrast(1.12) saturate(0.82) brightness(0.95) sepia(0.12)" }}>
        <TalkingHead src={spec.video} segments={spec.segments ?? resolved?.segments} zooms={spec.zooms} />
      </AbsoluteFill>
      {/* teal shadows / amber highlights */}
      <AbsoluteFill style={{ background: "#0d3b44", mixBlendMode: "soft-light", opacity: 0.55 }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(255,170,90,0.18), transparent 60%)", mixBlendMode: "screen" }} />
      {spec.beats.map((b, i) => (
        <Sequence key={i} from={f(b.from)} durationInFrames={Math.max(1, f(b.to) - f(b.from))} name={`${b.kind} ${i + 1}`}>
          <SceneClock from={b.from} to={b.to}>
            <CinemaBeatView b={b} />
          </SceneClock>
        </Sequence>
      ))}
      {words.length ? <CinemaCaptions pauses={pauses} words={words} hide={hide} /> : null}
      {/* letterbox */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: CI.layout.bar * bars, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: CI.layout.bar * bars, background: "#000" }} />
      <Leaks at={spec.leaks ?? []} />
      <Grain opacity={0.1} />
      <Vignette strength={0.5} />
      <SfxTrack cues={cues} />
    </AbsoluteFill>
  );
};

export const calculateCinemaMetadata = makeMetadata<CinemaProps>();
