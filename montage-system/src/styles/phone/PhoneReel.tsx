// ─────────────────────────────────────────────────────────────────────────────
// <PhoneReel> — PHONE style. Layers: footage (clean, slightly warm) → Dynamic-Island step pill → beats →
// captions (spoken word on a blue pill) → audio.
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
import { PhoneBeatView } from "./beats";
import { PH } from "./tokens";
import type { PhoneSpec } from "./types";

export type PhoneProps = { spec: PhoneSpec; resolved?: Resolved };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return f / fps; };

const PhoneCaptions: React.FC<{ pauses: [number, number][]; words: Word[] }> = ({ words, pauses }) => {
  const t = useT();
  const chunks = useMemo(() => chunkPhrases(words, 4, { maxChars: 24, pauses }), [words, pauses]);
  const c = chunks.find((k) => t >= k.show && t < k.hide);
  if (!c) return null;
  const fd = Math.min(0.1, (c.hide - c.show) / 3);
  const a = interpolate(t, [c.show, c.show + fd, c.hide - fd, c.hide], [0, 1, 1, 0], cl);
  const s = interpolate(t, [c.show, c.show + 0.18], [0.92, 1], { ...cl, easing: PH.ease.spring });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div dir="rtl" style={{ position: "absolute", top: PH.layout.captionY, left: 40, right: 40, display: "flex", justifyContent: "center", gap: 8, opacity: a, transform: `translateY(-50%) scale(${s})` }}>
        {c.words.map((w, i) => {
          const next = c.words[i + 1];
          const cur = t >= w.s - 0.03 && (!next || t < next.s - 0.03);
          const p = cur ? interpolate(t, [w.s - 0.03, w.s + 0.08], [0, 1], cl) : 0;
          return (
            <span key={i} style={{ fontFamily: PH.font, fontWeight: 800, fontSize: 66, lineHeight: 1.3, padding: "2px 16px 8px", borderRadius: 18, color: PH.white, background: `rgba(10,132,255,${p})`, whiteSpace: "nowrap", textShadow: p > 0.5 ? "none" : "0 4px 16px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.9)", direction: isArabic(w.text) ? "rtl" : "ltr", unicodeBidi: "isolate" }}>
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Dynamic-Island pill: black capsule that expands to show the current step. */
const Island: React.FC<{ items: NonNullable<PhoneSpec["island"]> }> = ({ items }) => {
  const t = useT();
  const c = items.find((k) => t >= k.from && t < k.to);
  if (!c) return null;
  const e = interpolate(t, [c.from, c.from + 0.45], [0, 1], { ...cl, easing: PH.ease.spring });
  const o = interpolate(t, [c.from, c.from + 0.15, c.to - 0.3, c.to], [0, 1, 1, 0], cl);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: o }}>
        <div dir="rtl" style={{ height: 96, minWidth: 220, width: 220 + e * 420, borderRadius: 96, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", gap: 18, padding: "0 30px", boxShadow: "0 16px 40px rgba(0,0,0,0.5)", overflow: "hidden" }}>
          {c.n !== undefined ? <span style={{ width: 60, height: 60, borderRadius: 60, background: PH.blue, color: PH.white, fontFamily: PH.font, fontWeight: 800, fontSize: 38, display: "flex", alignItems: "center", justifyContent: "center", opacity: e }}>{c.n}</span> : null}
          <span style={{ fontFamily: PH.font, fontWeight: 800, fontSize: 42, color: PH.white, opacity: e, whiteSpace: "nowrap" }}>{c.text}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const phoneSfx = (spec: PhoneSpec): Cue[] => {
  const r = rotor({ ui: ["pop", "tick", "click", "tick2"], move: ["swoosh", "whoosh2", "whoosh"] });
  const out: Cue[] = (spec.island ?? []).map((c) => ({ name: "notify" as const, at: c.from, gain: 0.7 }));
  for (const b of spec.beats) {
    if (b.sfx === false) continue;
    switch (b.kind) {
      case "notif": b.items.forEach((x) => out.push({ name: "notify", at: x.at - 0.15, gain: 0.8 })); break;
      case "pay":
        out.push({ name: r("move"), at: b.at - 0.25, gain: 0.7 });
        if (b.confirmAt !== undefined) out.push({ name: "chime", at: b.confirmAt + 0.45 });
        if (b.stopAt !== undefined) out.push({ name: "punch", at: b.stopAt }, { name: "hit", at: b.stopAt, gain: 0.6 });
        break;
      case "balance": out.push({ name: r("move"), at: b.at - 0.2, gain: 0.7 }, { name: "whooshLow", at: b.at + b.dur * 0.6, gain: 0.8 }, { name: "punch", at: b.at + b.dur }); break;
      case "apps": b.items.forEach((x) => out.push({ name: "pop", at: x.at - 0.1 })); if (b.flipAt !== undefined) out.push({ name: "swoosh", at: b.flipAt + 0.1 }); break;
      case "notes": out.push({ name: r("move"), at: b.at - 0.15, gain: 0.6 }); for (let k = 0; k < 7; k++) out.push({ name: "tick2", at: b.at + (b.dur * k) / 7, gain: 0.4 }); if (b.blurLabel) out.push({ name: "glitch", at: b.blurLabel.at, gain: 0.7 }); break;
      case "tiles": b.items.forEach((x) => out.push({ name: r("ui"), at: x.at - 0.1 })); break;
      case "activity": out.push({ name: r("move"), at: b.at - 0.1, gain: 0.6 }); if (b.chip) out.push({ name: "pop", at: b.chip.at }); break;
      case "chat": b.items.forEach((x) => out.push({ name: x.out ? "whoosh2" : "notify", at: x.at, gain: 0.6 })); if (b.tag) out.push({ name: "punch", at: b.tag.at }); break;
    }
  }
  return out;
};

export const PhoneReel: React.FC<PhoneProps> = ({ spec, resolved }) => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const segments = useMemo(() => spec.segments ?? resolved?.segments ?? [], [spec.segments, resolved]);
  const pauses = useMemo(() => retimePauses(resolved?.pauses, segments), [resolved, segments]);
  const words = useMemo(() => toWords(resolved?.captions?.length ? retimeCaptions(resolved.captions, segments) : []), [resolved, segments]);
  const cues = [...(spec.sfx === false ? [] : phoneSfx(spec)), ...(spec.sfxExtra ?? [])];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "contrast(1.05) saturate(1.06) brightness(1.02)" }}>
        <TalkingHead src={spec.video} segments={spec.segments ?? resolved?.segments} zooms={spec.zooms} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25), transparent 18%, transparent 62%, rgba(0,0,0,0.5))" }} />
      <Island items={spec.island ?? []} />
      {spec.beats.map((b, i) => (
        <Sequence key={i} from={f(b.from)} durationInFrames={Math.max(1, f(b.to) - f(b.from))} name={`${b.kind} ${i + 1}`}>
          <SceneClock from={b.from} to={b.to}>
            <PhoneBeatView b={b} />
          </SceneClock>
        </Sequence>
      ))}
      {words.length ? <PhoneCaptions pauses={pauses} words={words} /> : null}
      <Vignette strength={0.25} />
      <SfxTrack cues={cues} />
    </AbsoluteFill>
  );
};

export const calculatePhoneMetadata = makeMetadata<PhoneProps>();
