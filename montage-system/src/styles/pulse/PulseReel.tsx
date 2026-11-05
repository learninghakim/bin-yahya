// ─────────────────────────────────────────────────────────────────────────────
// <PulseReel> — PULSE style. Layers: footage (cool grade, zooms) → scanlines → HUD brackets → chapter chip
// → beats → captions → glitch slices → audio.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { TalkingHead } from "../../components/footage/TalkingHead";
import { Vignette } from "../../components/fx/Finish";
import { retimeCaptions } from "../../system/timeline";
import { SceneClock } from "../signal/clock";
import "../common/fonts";
import { chunkPhrases, isArabic, makeMetadata, Resolved, retimePauses, toWords, Word } from "../common/metadata";
import { Cue, rotor, SfxTrack } from "../common/SfxTrack";
import { PulseBeatView } from "./beats";
import { PU } from "./tokens";
import type { PulseBeat, PulseSpec } from "./types";

export type PulseProps = { spec: PulseSpec; resolved?: Resolved };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return f / fps; };

/** No box: white words with a soft shadow; the spoken word turns cyan with a glowing underline. */
const PulseCaptions: React.FC<{ pauses: [number, number][]; words: Word[] }> = ({ words, pauses }) => {
  const t = useT();
  const chunks = useMemo(() => chunkPhrases(words, 4, { maxChars: 24, pauses }), [words, pauses]);
  const c = chunks.find((k) => t >= k.show && t < k.hide);
  if (!c) return null;
  const fd = Math.min(0.1, (c.hide - c.show) / 3);
  const a = interpolate(t, [c.show, c.show + fd, c.hide - fd, c.hide], [0, 1, 1, 0], cl);
  const y = interpolate(t, [c.show, c.show + 0.16], [14, 0], { ...cl, easing: PU.ease.out });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div dir="rtl" style={{ position: "absolute", top: PU.layout.captionY, left: 50, right: 50, display: "flex", justifyContent: "center", gap: 20, opacity: a, transform: `translateY(calc(-50% + ${y}px))` }}>
        {c.words.map((w, i) => {
          const next = c.words[i + 1];
          const cur = t >= w.s - 0.03 && (!next || t < next.s - 0.03);
          const u = cur ? interpolate(t, [w.s - 0.03, w.s + 0.1], [0, 1], cl) : 0;
          return (
            <span key={i} style={{ position: "relative", fontFamily: PU.font, fontWeight: 800, fontSize: 64, lineHeight: 1.35, color: cur ? PU.cyan : PU.white, whiteSpace: "nowrap", WebkitTextStroke: "8px rgba(2,5,10,0.85)", paintOrder: "stroke fill", textShadow: cur ? `0 0 22px ${PU.cyan}` : "0 6px 18px rgba(0,0,0,0.6)", direction: isArabic(w.text) ? "rtl" : "ltr", unicodeBidi: "isolate" }}>
              {w.text}
              <span style={{ position: "absolute", left: 4, right: 4, bottom: -2, height: 7, borderRadius: 7, background: PU.cyan, boxShadow: `0 0 14px ${PU.cyan}`, transform: `scaleX(${u})`, transformOrigin: "right" }} />
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Thin HUD brackets around the face — lock on at the start, breathe slowly. */
const Hud: React.FC = () => {
  const t = useT();
  const lock = interpolate(t, [0.05, 0.5], [1, 0], { ...cl, easing: PU.ease.out });
  const inset = 30 + lock * 80 + Math.sin(t * 1.4) * 4;
  const box = { left: 250 - inset, top: 250 - inset, w: 580 + inset * 2, h: 620 + inset * 2 };
  const corner = (x: number, y: number, rx: number, ry: number) => (
    <div style={{ position: "absolute", left: x, top: y, width: 70, height: 70, borderTop: ry > 0 ? `4px solid ${PU.cyan}` : undefined, borderBottom: ry < 0 ? `4px solid ${PU.cyan}` : undefined, borderLeft: rx > 0 ? `4px solid ${PU.cyan}` : undefined, borderRight: rx < 0 ? `4px solid ${PU.cyan}` : undefined, opacity: 0.55 * (1 - lock * 0.5) }} />
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {corner(box.left, box.top, 1, 1)}
      {corner(box.left + box.w - 70, box.top, -1, 1)}
      {corner(box.left, box.top + box.h - 70, 1, -1)}
      {corner(box.left + box.w - 70, box.top + box.h - 70, -1, -1)}
    </AbsoluteFill>
  );
};

/** Small chapter chip above the head while a rule is being explained. */
const Chapter: React.FC<{ chapters: NonNullable<PulseSpec["chapters"]> }> = ({ chapters }) => {
  const t = useT();
  const c = chapters.find((k) => t >= k.from && t < k.to);
  if (!c) return null;
  const a = interpolate(t, [c.from, c.from + 0.3, c.to - 0.25, c.to], [0, 1, 1, 0], cl);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div dir="rtl" style={{ position: "absolute", top: 190, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: a, transform: `translateY(${(1 - a) * -14}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 26px 12px", borderRadius: 999, background: "rgba(4,7,13,0.78)", border: `2px solid ${PU.cyan}`, boxShadow: `0 0 24px ${PU.cyanSoft}` }}>
          <span dir="ltr" style={{ fontFamily: PU.font, fontWeight: 800, fontSize: 40, color: PU.bg, background: PU.cyan, borderRadius: 40, width: 54, height: 54, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.n}</span>
          <span style={{ fontFamily: PU.font, fontWeight: 800, fontSize: 42, color: PU.white }}>{c.text}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Glitch slices: horizontal bands shift + RGB split for ~0.25 s. Children = the whole picture. */
const Glitch: React.FC<{ at: number[]; render: (muted: boolean) => React.ReactNode }> = ({ at, render }) => {
  const t = useT();
  const k = at.map((a) => t - a).find((d) => d >= -0.04 && d < 0.26);
  if (k === undefined) return <AbsoluteFill>{render(false)}</AbsoluteFill>;
  const amp = interpolate(k, [-0.04, 0.02, 0.26], [0, 1, 0], cl);
  const bands = [0.08, 0.22, 0.31, 0.47, 0.58, 0.72, 0.86];
  return (
    <AbsoluteFill>
      <AbsoluteFill>{render(false)}</AbsoluteFill>
      {bands.map((b, i) => {
        const h = 40 + ((i * 53) % 90);
        const dx = Math.sin(i * 12.9 + k * 90) * 70 * amp;
        return (
          <AbsoluteFill key={i} style={{ clipPath: `inset(${b * 1920}px 0 ${1920 - b * 1920 - h}px 0)`, transform: `translateX(${dx}px)`, filter: `hue-rotate(${i % 2 ? 160 : -40}deg) saturate(2)` }}>
            {render(true)}
          </AbsoluteFill>
        );
      })}
      <AbsoluteFill style={{ background: PU.cyan, mixBlendMode: "screen", opacity: 0.12 * amp }} />
    </AbsoluteFill>
  );
};

const pulseSfx = (spec: PulseSpec): Cue[] => {
  const r = rotor({ ui: ["tick", "pop", "tick2", "click"], move: ["whoosh", "whoosh2", "swoosh"] });
  const out: Cue[] = (spec.glitches ?? []).map((a) => ({ name: "glitch" as const, at: a, gain: 0.8 }));
  (spec.chapters ?? []).forEach((c) => out.push({ name: "zap", at: c.from, gain: 0.8 }));
  for (const b of spec.beats) {
    if (b.sfx === false) continue;
    switch (b.kind) {
      case "chart": b.points.forEach((p, i) => out.push(i === 0 ? { name: r("move"), at: p.at - 0.2, gain: 0.7 } : p.bad ? { name: "hit", at: p.at } : { name: r("ui"), at: p.at, gain: 0.7 })); break;
      case "crowd": out.push({ name: "reveal", at: b.at - 0.5, gain: 0.6 }, { name: r("ui"), at: b.at }); break;
      case "bars": b.bars.forEach((x) => out.push({ name: r("move"), at: x.at, gain: 0.7 }, { name: x.down ? "punch" : "pop", at: x.at + 0.7 })); break;
      case "glyph": out.push({ name: "glitch", at: b.at }, { name: "boom", at: b.at, gain: 0.7 }); break;
      case "key": out.push({ name: "click", at: b.pressAt }, { name: "chime", at: b.result.at, gain: 0.7 }); break;
      case "sleep": out.push({ name: "whooshLow", at: b.brainAt, gain: 0.7 }, { name: "zap", at: b.chipAt }); break;
      case "steps": for (let i = 0; i < b.n; i++) out.push({ name: r("ui"), at: b.at + i * 0.18 }); break;
      case "timer": out.push({ name: r("move"), at: b.at, gain: 0.7 }); if (b.lockAt !== undefined) out.push({ name: "punch", at: b.lockAt }); break;
      case "chat":
        out.push({ name: "notify", at: b.at, gain: 0.6 });
        if (b.mode === "typing") for (let k = 0; k < 6; k++) out.push({ name: "tick2", at: b.at + ((b.dur ?? 0.6) * k) / 6, gain: 0.45 });
        if (b.strikeAt !== undefined) out.push({ name: "punch", at: b.strikeAt });
        break;
      case "calendar": out.push({ name: "shutter", at: b.flipAt }); (b.chips ?? []).forEach((c) => out.push({ name: r("ui"), at: c.at })); break;
      case "outcome": b.items.forEach((x) => out.push({ name: x.good ? "chime" : "punch", at: x.at }, { name: "hit", at: x.at, gain: 0.5 })); break;
      case "cta": b.items.forEach((x) => out.push({ name: "click", at: x.at + 0.38 })); break;
    }
  }
  return out;
};

export const PulseReel: React.FC<PulseProps> = ({ spec, resolved }) => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const segments = useMemo(() => spec.segments ?? resolved?.segments ?? [], [spec.segments, resolved]);
  const pauses = useMemo(() => retimePauses(resolved?.pauses, segments), [resolved, segments]);
  const words = useMemo(() => toWords(resolved?.captions?.length ? retimeCaptions(resolved.captions, segments) : []), [resolved, segments]);
  const cues = [...(spec.sfx === false ? [] : pulseSfx(spec)), ...(spec.sfxExtra ?? [])];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Glitch at={spec.glitches ?? []} render={(muted) => (<>
        <AbsoluteFill style={{ filter: "saturate(0.78) contrast(1.08) brightness(0.96)" }}>
          <TalkingHead src={spec.video} segments={spec.segments ?? resolved?.segments} zooms={spec.zooms} volume={muted ? 0 : 1} />
        </AbsoluteFill>
        <AbsoluteFill style={{ background: "#003a4a", mixBlendMode: "soft-light", opacity: 0.5 }} />
        <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.035) 0 2px, transparent 2px 5px)" }} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35), transparent 20%, transparent 60%, rgba(0,0,0,0.6))" }} />
        <Hud />
        <Chapter chapters={spec.chapters ?? []} />
        {spec.beats.map((b: PulseBeat, i) => (
          <Sequence key={i} from={f(b.from)} durationInFrames={Math.max(1, f(b.to) - f(b.from))} name={`${b.kind} ${i + 1}`}>
            <SceneClock from={b.from} to={b.to}>
              <PulseBeatView b={b} />
            </SceneClock>
          </Sequence>
        ))}
        {words.length ? <PulseCaptions pauses={pauses} words={words} /> : null}
      </>)} />
      <Vignette strength={0.42} />
      <SfxTrack cues={cues} />
    </AbsoluteFill>
  );
};

export const calculatePulseMetadata = makeMetadata<PulseProps>();
