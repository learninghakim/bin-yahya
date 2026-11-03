// ─────────────────────────────────────────────────────────────────────────────
// <NewsReel> — NEWSROOM style. Layers (bottom → top):
// footage (zooms, cinematic grade) → beats → chrome (live bug, ticker) → broadcast captions →
// flashes → grain/vignette → audio (voice + SFX).
// ─────────────────────────────────────────────────────────────────────────────
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { TalkingHead } from "../../components/footage/TalkingHead";
import { Grain, Vignette } from "../../components/fx/Finish";
import { retimeCaptions } from "../../system/timeline";
import { SceneClock } from "../signal/clock";
import "../signal/fonts";
import "../common/fonts";
import { chunkWords, isArabic, makeMetadata, Resolved, toWords } from "../common/metadata";
import { Cue, rotor, SfxTrack } from "../common/SfxTrack";
import { NewsBeatView } from "./beats";
import { N } from "./tokens";
import type { NewsBeat, NewsSpec } from "./types";

export type NewsProps = { spec: NewsSpec; resolved?: Resolved };

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Broadcast captions: white on black slab, the spoken word boxed in red. */
const NewsCaptions: React.FC<{ words: ReturnType<typeof toWords> }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks = useMemo(() => chunkWords(words, 4, { maxChars: 26 }), [words]);
  const c = chunks.find((k) => t >= k.show && t < k.hide);
  if (!c) return null;
  const a = interpolate(t, [c.show, c.show + 0.1, c.hide - 0.1, c.hide], [0, 1, 1, 0], cl);
  const y = interpolate(t, [c.show, c.show + 0.14], [10, 0], cl);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div dir="rtl" style={{ position: "absolute", top: N.layout.captionY, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: a, transform: `translateY(calc(-50% + ${y}px))` }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", background: "rgba(8,8,10,0.84)", padding: "10px 22px", borderRight: `8px solid ${N.red}`, fontFamily: N.font, fontWeight: 700, fontSize: 54, lineHeight: 1.3, whiteSpace: "nowrap" }}>
          {c.words.map((w, i) => {
            const next = c.words[i + 1];
            const said = t >= w.s - 0.03;
            const cur = said && (!next || t < next.s - 0.03);
            return (
              <span key={i} style={{ color: N.white, opacity: said ? 1 : 0.45, background: cur ? N.red : "transparent", padding: "0 10px", margin: "0 -10px", direction: isArabic(w.text) ? "rtl" : "ltr", unicodeBidi: "isolate" }}>
                {w.text}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Live bug (top) + thin ticker (under the captions). */
const Chrome: React.FC<{ bug: string; ticker: string[] }> = ({ bug, ticker }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const inn = interpolate(t, [0.2, 0.7], [0, 1], { ...cl, easing: N.ease.out });
  const one = ticker.join("   ◆   ") + "   ◆   ";
  const loop = one.repeat(6);
  // RTL ticker drifts to the right; wrap after exactly one copy so it never runs empty
  const copyW = one.length * 28 * 0.5;
  const x = (t * 90) % copyW;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div dir="rtl" style={{ position: "absolute", top: 262, right: 70, display: "flex", alignItems: "center", gap: 0, opacity: inn, transform: `translateX(${(1 - inn) * 40}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: N.red, padding: "6px 16px" }}>
          <span style={{ width: 12, height: 12, borderRadius: 12, background: N.white, opacity: Math.floor(t * 1.6) % 2 ? 0.35 : 1 }} />
          <span style={{ fontFamily: N.font, fontWeight: 700, fontSize: 28, color: N.white }}>مباشر</span>
        </div>
        <div style={{ background: "rgba(8,8,10,0.8)", padding: "6px 16px", fontFamily: N.font, fontWeight: 700, fontSize: 28, color: N.white }}>{bug}</div>
      </div>
      <div style={{ position: "absolute", top: N.layout.tickerY, left: 0, right: 0, height: 50, display: "flex", opacity: inn }}>
        <div style={{ flex: 1, background: "rgba(243,241,236,0.94)", overflow: "hidden", position: "relative" }}>
          <div dir="rtl" style={{ position: "absolute", top: 0, right: 0, whiteSpace: "nowrap", transform: `translateX(${x}px)`, fontFamily: N.font, fontWeight: 700, fontSize: 28, lineHeight: "50px", color: N.ink }}>{loop}</div>
        </div>
        <div style={{ background: N.red, padding: "0 18px", display: "flex", alignItems: "center", fontFamily: N.font, fontWeight: 700, fontSize: 26, color: N.white, order: -1 }}>دراسة</div>
      </div>
    </AbsoluteFill>
  );
};

/** White flash + RGB split + tiny shake at transition points. */
const Flashes: React.FC<{ at: number[]; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let flash = 0, split = 0, dx = 0;
  for (const a of at) {
    const k = t - a;
    if (k < -0.05 || k > 0.4) continue;
    flash = Math.max(flash, interpolate(k, [-0.02, 0.02, 0.16], [0, 0.55, 0], cl));
    split = Math.max(split, interpolate(k, [-0.04, 0.03, 0.22], [0, 14, 0], cl));
    dx += Math.sin(k * 120) * 10 * Math.exp(-k * 12) * (k > 0 ? 1 : 0);
  }
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${dx}px)` }}>{children}</AbsoluteFill>
      {split > 0.5 ? <AbsoluteFill style={{ background: N.red, opacity: split / 60, mixBlendMode: "screen", transform: `translateX(${split}px)` }} /> : null}
      {flash > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: flash }} /> : null}
    </AbsoluteFill>
  );
};

const newsSfx = (beats: NewsBeat[], flashes: number[]): Cue[] => {
  const r = rotor({ ui: ["tick", "click", "tick2", "pop"], move: ["whoosh", "whoosh2", "swoosh"] });
  const out: Cue[] = flashes.flatMap((a) => [{ name: "glitch" as const, at: a, gain: 0.8 }, { name: "whooshLow" as const, at: a, gain: 0.8 }]);
  for (const b of beats) {
    if (b.sfx === false) continue;
    switch (b.kind) {
      case "breaking": out.push({ name: "shutter", at: b.from }, { name: r("move"), at: b.from + 0.05 }); break;
      case "cite": out.push({ name: r("move"), at: b.from }); if (b.detail) out.push({ name: r("ui"), at: b.detail.at }); break;
      case "stat":
        if (b.stage) out.push({ name: "suck", at: b.from }, { name: "hit", at: b.from });
        out.push({ name: "riser", at: b.at + 0.9, gain: 0.7 }, { name: "punch", at: b.at + 0.9 }, { name: r("ui"), at: b.at + 0.5 });
        break;
      case "versus": b.bars.forEach((x) => out.push({ name: r("move"), at: x.at }, { name: "punch", at: x.at + 0.8, gain: 0.8 })); break;
      case "stage": out.push({ name: "suck", at: b.from }, { name: "hit", at: b.from }, { name: "boom", at: b.from + 0.05 }, { name: "whooshLow", at: b.to - 0.3 }); break;
      case "rule": out.push({ name: "shutter", at: b.from }, { name: r("move"), at: b.from }); if (b.sub) out.push({ name: r("ui"), at: b.sub.at }); break;
      case "prompt": out.push({ name: "notify", at: b.from + 0.1 }); for (let k = 0; k < 6; k++) out.push({ name: "tick2", at: b.at + (b.dur * k) / 6, gain: 0.55 }); break;
      case "verdict": b.items.forEach((x) => out.push({ name: x.good ? "chime" : "punch", at: x.at }, { name: "hit", at: x.at, gain: 0.6 })); break;
      case "cta": b.items.forEach((x) => out.push({ name: "click", at: x.at + 0.4 })); out.push({ name: "notify", at: b.items[b.items.length - 1].at + 0.7 }); break;
    }
  }
  return out;
};

export const NewsReel: React.FC<NewsProps> = ({ spec, resolved }) => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const segments = useMemo(() => spec.segments ?? resolved?.segments ?? [], [spec.segments, resolved]);
  const words = useMemo(() => toWords(resolved?.captions?.length ? retimeCaptions(resolved.captions, segments) : []), [resolved, segments]);
  const flashes = spec.flashes ?? [];
  const cues = [...(spec.sfx === false ? [] : newsSfx(spec.beats, flashes)), ...(spec.sfxExtra ?? [])];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Flashes at={flashes}>
        <AbsoluteFill style={{ filter: "contrast(1.1) saturate(0.82) brightness(0.97)" }}>
          <TalkingHead src={spec.video} segments={spec.segments ?? resolved?.segments} zooms={spec.zooms} />
        </AbsoluteFill>
        {/* teal shadows / warm highlights + top & bottom falloff */}
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,20,30,0.45), transparent 26%, transparent 62%, rgba(0,0,0,0.55))" }} />
        <AbsoluteFill style={{ background: "#0a2a3a", mixBlendMode: "soft-light", opacity: 0.35 }} />
        {spec.beats.map((b, i) => (
          <Sequence key={i} from={f(b.from)} durationInFrames={Math.max(1, f(b.to) - f(b.from))} name={`${b.kind} ${i + 1}`}>
            <SceneClock from={b.from} to={b.to}>
              <NewsBeatView b={b} />
            </SceneClock>
          </Sequence>
        ))}
        <Chrome bug={spec.bug} ticker={spec.ticker} />
        {words.length ? <NewsCaptions words={words} /> : null}
      </Flashes>
      <Grain opacity={0.09} />
      <Vignette strength={0.45} />
      <SfxTrack cues={cues} />
    </AbsoluteFill>
  );
};

export const calculateNewsMetadata = makeMetadata<NewsProps>();
