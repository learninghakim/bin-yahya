// ─────────────────────────────────────────────────────────────────────────────
// <PunchReel> — PUNCH style. Layers: footage (auto punch-ins, B&W windows) → beats → kinetic chest
// captions → flashes → audio.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { TalkingHead, Zoom } from "../../components/footage/TalkingHead";
import { Vignette } from "../../components/fx/Finish";
import { Icon } from "../../components/graphics/Icon";
import { retimeCaptions } from "../../system/timeline";
import type { Segment } from "../../system/types";
import { prog, SceneClock, useSceneVis } from "../signal/clock";
import "../signal/fonts";
import "../common/fonts";
import { chunkWords, clean, isArabic, makeMetadata, Resolved, toWords, Word } from "../common/metadata";
import { Cue, rotor, SfxTrack } from "../common/SfxTrack";
import { P } from "./tokens";
import type { PunchBeat, PunchSpec, Tone } from "./types";

export type PunchProps = { spec: PunchSpec; resolved?: Resolved };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const toneColor = (t: Tone = "yellow") => P[t];

/** overshooting pop 0→1 (scale curve) */
const pop = (t: number, at: number, d = 0.22) => interpolate(t, [at, at + d * 0.6, at + d], [0.55, 1.08, 1], cl);

const stroke = (size: number): React.CSSProperties => ({
  WebkitTextStroke: `${Math.max(6, Math.round(size * 0.11))}px ${P.ink}`,
  paintOrder: "stroke fill",
  textShadow: `0 ${Math.round(size * 0.07)}px 0 ${P.ink}, 0 ${Math.round(size * 0.12)}px ${Math.round(size * 0.3)}px rgba(0,0,0,0.55)`,
});

// ── kinetic captions ──
const PunchCaptions: React.FC<{ words: Word[]; emphasis: Record<string, Tone>; hide: { from: number; to: number }[] }> = ({ words, emphasis, hide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks = useMemo(() => chunkWords(words, 3, { maxChars: 15, maxDur: 1.3, gap: 0.3, hold: 0.3 }), [words]);
  if (hide.some((h) => t >= h.from && t < h.to)) return null;
  const idx = chunks.findIndex((k) => t >= k.show && t < k.hide);
  if (idx < 0) return null;
  const c = chunks[idx];
  const chars = c.words.reduce((n, w) => n + w.text.length + 1, 0);
  const size = Math.min(118, Math.round(900 / (chars * 0.56)));
  const s = pop(t, c.show, 0.2);
  const rot = [-2.5, 1.5, -1, 2][idx % 4];
  const a = interpolate(t, [c.hide - 0.06, c.hide], [1, 0], cl);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div dir="rtl" style={{ position: "absolute", top: P.layout.captionY, left: 40, right: 40, display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: size * 0.24, transform: `translateY(-50%) scale(${s}) rotate(${rot}deg)`, opacity: a }}>
        {c.words.map((w, i) => {
          const next = c.words[i + 1];
          const said = t >= w.s - 0.03;
          const cur = said && (!next || t < next.s - 0.03);
          const em = emphasis[clean(w.text)];
          const color = em ? toneColor(em) : cur ? P.yellow : P.white;
          const ws = cur ? 1.1 : 1;
          return (
            <span key={i} style={{ fontFamily: P.font, fontWeight: 800, fontSize: size, lineHeight: 1.25, color, display: "inline-block", transform: `scale(${ws})`, direction: isArabic(w.text) ? "rtl" : "ltr", unicodeBidi: "isolate", ...stroke(size) }}>
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── beats ──
const Title: React.FC<{ b: Extract<PunchBeat, { kind: "title" }> }> = ({ b }) => {
  const { t, inn, out } = useSceneVis();
  const bg = toneColor(b.tone ?? "yellow");
  const box = pop(t, b.from, 0.26);
  return (
    <AbsoluteFill>
      <div dir="rtl" style={{ position: "absolute", top: P.layout.topY, left: 60, right: 60, display: "flex", justifyContent: "center", opacity: 1 - out, transform: `scale(${box}) rotate(-2deg)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, background: bg, padding: "14px 30px 20px", borderRadius: 18, boxShadow: `0 10px 0 ${P.ink}, 0 24px 40px rgba(0,0,0,.45)`, border: `5px solid ${P.ink}`, opacity: inn }}>
          {b.n !== undefined ? (
            <div style={{ width: 92, height: 92, borderRadius: 92, background: P.ink, color: bg, fontFamily: P.font, fontWeight: 800, fontSize: 64, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>{b.n}</div>
          ) : null}
          <div style={{ display: "flex", flexWrap: "wrap", columnGap: 18, justifyContent: "center", maxWidth: 800 }}>
            {b.words.filter((w) => t >= w.at - 0.06).map((w, i) => {
              const p = prog(t, w.at - 0.05, 0.2, P.ease.out);
              return <span key={i} style={{ fontFamily: P.font, fontWeight: 800, fontSize: 66, lineHeight: 1.25, color: P.ink, opacity: p, transform: `translateY(${(1 - p) * 20}px) scale(${0.8 + 0.2 * p})`, display: "inline-block" }}>{w.text}</span>;
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Emoji: React.FC<{ b: Extract<PunchBeat, { kind: "emoji" }> }> = ({ b }) => {
  const { t, out } = useSceneVis();
  const s = pop(t, b.at, 0.28);
  const p = prog(t, b.at - 0.02, 0.12);
  const wob = Math.sin((t - b.at) * 9) * 6 * Math.exp(-(t - b.at) * 2.5);
  const size = b.size ?? 190;
  const side = b.side ?? "left";
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: b.y ?? 470, [side]: side === "left" ? 70 : 170, fontSize: size, lineHeight: 1, opacity: p * (1 - out), transform: `scale(${s * (1 - out * 0.4)}) rotate(${(side === "left" ? -12 : 12) + wob}deg)`, filter: "drop-shadow(0 14px 18px rgba(0,0,0,.45))" }}>
        {b.emoji}
      </div>
    </AbsoluteFill>
  );
};

const NumberSlam: React.FC<{ b: Extract<PunchBeat, { kind: "number" }> }> = ({ b }) => {
  const { t, out } = useSceneVis();
  const p = prog(t, b.at, 0.7, P.ease.out);
  const s = pop(t, b.at, 0.24);
  const v = Math.round(b.value * p);
  const color = toneColor(b.tone ?? "yellow");
  const lp = b.label ? prog(t, b.label.at - 0.05, 0.2) : 0;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 860, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: (t >= b.at - 0.02 ? 1 : 0) * (1 - out), transform: `scale(${s}) rotate(-3deg)` }}>
        <div dir="ltr" style={{ fontFamily: P.font, fontWeight: 800, fontSize: 300, lineHeight: 1, color, ...stroke(300) }}>
          {b.prefix}{v}{b.suffix}
        </div>
        {b.label ? <div dir="rtl" style={{ fontFamily: P.font, fontWeight: 800, fontSize: 62, color: P.white, opacity: lp, marginTop: -6, ...stroke(62) }}>{b.label.text}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

const Slam: React.FC<{ b: Extract<PunchBeat, { kind: "slam" }> }> = ({ b }) => {
  const { t, inn, out } = useSceneVis();
  const color = toneColor(b.tone ?? "yellow");
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.72)", opacity: inn * (1 - out) }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - out }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 300 }}>
          {b.emoji ? <div style={{ fontSize: 170, transform: `scale(${pop(t, b.from, 0.3)})`, opacity: inn }}>{b.emoji}</div> : null}
          <div dir="rtl" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 26, maxWidth: 940 }}>
            {b.words.map((w, i) => (
              <span key={i} style={{ fontFamily: P.font, fontWeight: 800, fontSize: 150, lineHeight: 1.2, color: i === b.words.length - 1 ? color : P.white, opacity: t >= w.at - 0.03 ? 1 : 0, transform: `scale(${pop(t, w.at - 0.03, 0.22)})`, display: "inline-block", ...stroke(150) }}>{w.text}</span>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Cta: React.FC<{ b: Extract<PunchBeat, { kind: "cta" }> }> = ({ b }) => {
  const { t, out } = useSceneVis();
  const s = pop(t, b.at, 0.28);
  const tap = b.at + 0.75;
  const hand = interpolate(t, [b.at + 0.2, tap], [1, 0], { ...cl, easing: P.ease.inOut });
  const press = interpolate(t, [tap - 0.05, tap + 0.05, tap + 0.2], [1, 0.9, 1], cl);
  const on = t >= tap;
  const sp = b.sub ? prog(t, b.sub.at - 0.05, 0.2) : 0;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 820, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: (t >= b.at - 0.02 ? 1 : 0) * (1 - out) }}>
        <div dir="rtl" style={{ position: "relative", transform: `scale(${s * press}) rotate(-2deg)`, display: "flex", alignItems: "center", gap: 20, background: on ? P.green : P.yellow, border: `6px solid ${P.ink}`, borderRadius: 26, padding: "16px 44px 22px", boxShadow: `0 12px 0 ${P.ink}` }}>
          <Icon name="bookmark" size={74} color={P.ink} strokeWidth={2.8} />
          <span style={{ fontFamily: P.font, fontWeight: 800, fontSize: 86, color: P.ink, lineHeight: 1.2 }}>{b.text}</span>
          {b.emoji ? <span style={{ fontSize: 80 }}>{b.emoji}</span> : null}
          <div style={{ position: "absolute", left: 40, bottom: -90, fontSize: 120, transform: `translate(${hand * 140}px, ${hand * 160}px) rotate(-20deg)`, opacity: t > b.at + 0.15 ? 1 : 0 }}>👆</div>
        </div>
        {b.sub ? <div dir="rtl" style={{ fontFamily: P.font, fontWeight: 800, fontSize: 64, color: P.white, opacity: sp, transform: `translateY(${(1 - sp) * 20}px)`, marginTop: 70, ...stroke(64) }}>{b.sub.text}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

const BeatView: React.FC<{ b: PunchBeat }> = ({ b }) => {
  switch (b.kind) {
    case "title": return <Title b={b} />;
    case "emoji": return <Emoji b={b} />;
    case "number": return <NumberSlam b={b} />;
    case "slam": return <Slam b={b} />;
    case "cta": return <Cta b={b} />;
  }
};

/** Punch-in on every sentence start (a pause > 0.3 s or punctuation), alternating 1 ↔ k. */
export const autoZooms = (words: Word[], k: number): Zoom[] => {
  const out: Zoom[] = [];
  let zoomed = false;
  let last = -10;
  words.forEach((w, i) => {
    const prev = words[i - 1];
    const boundary = !prev || w.s - prev.e > 0.3 || /[.!?؟،,]$/.test(prev.text);
    if (boundary && w.s - last > 1.6) {
      zoomed = !zoomed;
      out.push({ at: Math.max(0, w.s - 0.04), scale: zoomed ? k : 1, focusY: 0.32 });
      last = w.s;
    }
  });
  return out;
};

const Footage: React.FC<{ spec: PunchSpec; zooms: Zoom[]; segments?: Segment[] }> = ({ spec, zooms, segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let gray = 0;
  for (const w of spec.bw ?? []) gray = Math.max(gray, interpolate(t, [w.from, w.from + 0.08, w.to - 0.08, w.to], [0, 1, 1, 0], cl));
  let kick = 1, flash = 0;
  for (const a of spec.flashes ?? []) {
    const k = t - a;
    if (k < -0.02 || k > 0.5) continue;
    kick *= 1 + 0.08 * Math.exp(-Math.max(0, k) * 9);
    flash = Math.max(flash, interpolate(k, [-0.02, 0.01, 0.14], [0, 0.85, 0], cl));
  }
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: `grayscale(${gray}) contrast(${1.06 + gray * 0.18}) saturate(1.08)`, transform: `scale(${kick})`, transformOrigin: "50% 32%" }}>
        <TalkingHead src={spec.video} segments={segments} zooms={zooms} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.35) 80%)" }} />
      {flash > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: flash }} /> : null}
    </AbsoluteFill>
  );
};

const punchSfx = (spec: PunchSpec, zooms: Zoom[]): Cue[] => {
  const r = rotor({ move: ["whoosh", "whoosh2", "swoosh"], pop: ["pop", "click", "tick"] });
  const out: Cue[] = [];
  // a soft whoosh on every other zoom keeps the rhythm without fatigue
  zooms.forEach((z, i) => { if (i % 2 === 0 && z.at > 0.5) out.push({ name: r("move"), at: z.at, gain: 0.55 }); });
  (spec.flashes ?? []).forEach((a) => out.push({ name: "hit", at: a }, { name: "shutter", at: a, gain: 0.8 }));
  (spec.bw ?? []).forEach((w) => out.push({ name: "whooshLow", at: w.from, gain: 0.8 }));
  for (const b of spec.beats) {
    if (b.sfx === false) continue;
    switch (b.kind) {
      case "title": out.push({ name: "punch", at: b.from }, ...b.words.slice(1).map((w) => ({ name: r("pop"), at: w.at, gain: 0.6 }))); break;
      case "emoji": out.push({ name: "pop", at: b.at }); break;
      case "number": out.push({ name: "riser", at: b.at, gain: 0.6 }, { name: "hit", at: b.at }, { name: "boom", at: b.at + 0.02, gain: 0.8 }); break;
      case "slam": out.push({ name: "suck", at: b.from }, ...b.words.map((w) => ({ name: "punch" as const, at: w.at })), { name: "boom", at: b.words[b.words.length - 1].at }); break;
      case "cta": out.push({ name: "pop", at: b.at }, { name: "click", at: b.at + 0.75 }, { name: "chime", at: b.at + 0.8 }); break;
    }
  }
  return out;
};

export const PunchReel: React.FC<PunchProps> = ({ spec, resolved }) => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const segments = useMemo(() => spec.segments ?? resolved?.segments ?? [], [spec.segments, resolved]);
  const words = useMemo(() => toWords(resolved?.captions?.length ? retimeCaptions(resolved.captions, segments) : []), [resolved, segments]);
  const zooms = useMemo(() => spec.zooms ?? (spec.autoZoom === 0 ? [] : autoZooms(words, spec.autoZoom ?? 1.12)), [spec, words]);
  const cues = [...(spec.sfx === false ? [] : punchSfx(spec, zooms)), ...(spec.sfxExtra ?? [])];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Footage spec={spec} zooms={zooms} segments={spec.segments ?? resolved?.segments} />
      {spec.beats.map((b, i) => (
        <Sequence key={i} from={f(b.from)} durationInFrames={Math.max(1, f(b.to) - f(b.from))} name={`${b.kind} ${i + 1}`}>
          <SceneClock from={b.from} to={b.to}>
            <BeatView b={b} />
          </SceneClock>
        </Sequence>
      ))}
      {words.length ? <PunchCaptions words={words} emphasis={spec.emphasis ?? {}} hide={[...(spec.hideCaptions ?? []), ...spec.beats.filter((b) => b.kind === "slam" || b.kind === "number").map((b) => ({ from: b.from, to: b.to }))]} /> : null}
      <Vignette strength={0.3} />
      <SfxTrack cues={cues} />
    </AbsoluteFill>
  );
};

export const calculatePunchMetadata = makeMetadata<PunchProps>();
