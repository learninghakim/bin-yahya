// ─────────────────────────────────────────────────────────────────────────────
// <PaperReel> — PAPER style. Layers: footage (warm near-mono grade) → paper texture → beats →
// torn-paper captions (marker on the spoken word) → audio.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { TalkingHead } from "../../components/footage/TalkingHead";
import { Grain, Vignette } from "../../components/fx/Finish";
import { retimeCaptions } from "../../system/timeline";
import { SceneClock } from "../signal/clock";
import "../common/fonts";
import { chunkWords, isArabic, makeMetadata, Resolved, toWords, Word } from "../common/metadata";
import { Cue, rotor, SfxTrack } from "../common/SfxTrack";
import { PaperBeatView } from "./beats";
import { PA } from "./tokens";
import type { PaperBeat, PaperSpec } from "./types";

export type PaperProps = { spec: PaperSpec; resolved?: Resolved };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const PaperCaptions: React.FC<{ words: Word[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks = useMemo(() => chunkWords(words, 4, { maxChars: 24 }), [words]);
  const idx = chunks.findIndex((k) => t >= k.show && t < k.hide);
  if (idx < 0) return null;
  const c = chunks[idx];
  const a = interpolate(t, [c.show, c.show + 0.12, c.hide - 0.1, c.hide], [0, 1, 1, 0], cl);
  const rot = [-1.2, 0.8, -0.6, 1][idx % 4];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div dir="rtl" style={{ position: "absolute", top: PA.layout.captionY, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: a, transform: `translateY(calc(-50% + ${(1 - a) * 10}px)) rotate(${rot}deg)` }}>
        <div style={{ display: "flex", gap: 16, background: PA.paper, padding: "12px 34px 18px", boxShadow: "0 16px 30px -12px rgba(0,0,0,0.55)", clipPath: "polygon(0 8%, 6% 0, 22% 6%, 40% 1%, 62% 6%, 80% 0, 100% 7%, 98% 92%, 82% 100%, 60% 94%, 38% 100%, 16% 95%, 2% 100%)", fontFamily: PA.font, fontWeight: 700, fontSize: 56, lineHeight: 1.35, whiteSpace: "nowrap" }}>
          {c.words.map((w, i) => {
            const next = c.words[i + 1];
            const said = t >= w.s - 0.03;
            const cur = said && (!next || t < next.s - 0.03);
            const mk = cur ? interpolate(t, [w.s - 0.03, w.s + 0.12], [0, 1], cl) : said ? 0 : 0;
            return (
              <span key={i} style={{ position: "relative", color: PA.ink, opacity: said ? 1 : 0.38, direction: isArabic(w.text) ? "rtl" : "ltr", unicodeBidi: "isolate" }}>
                <span style={{ position: "absolute", left: -6, right: -6, top: "40%", bottom: "4%", background: PA.marker, transformOrigin: "right", transform: `scaleX(${mk}) skewX(-8deg)`, borderRadius: 4 }} />
                <span style={{ position: "relative" }}>{w.text}</span>
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const paperSfx = (beats: PaperBeat[]): Cue[] => {
  const r = rotor({ ui: ["pop", "tick", "click", "tick2"], move: ["swoosh", "whoosh2", "whoosh"] });
  const out: Cue[] = [];
  for (const b of beats) {
    if (b.sfx === false) continue;
    switch (b.kind) {
      case "banner": out.push({ name: r("move"), at: b.from, gain: 0.7 }); break;
      case "note": out.push({ name: r("move"), at: b.from, gain: 0.7 }); if (b.doodle) out.push({ name: "tick2", at: b.doodle.at, gain: 0.7 }); break;
      case "stickies": b.items.forEach((x) => out.push({ name: "pop", at: x.at, gain: 0.8 })); break;
      case "list":
        out.push({ name: r("move"), at: b.from, gain: 0.6 });
        b.items.forEach((x) => out.push({ name: r("ui"), at: x.at, gain: 0.7 }));
        if (b.flipAt !== undefined) out.push({ name: "chime", at: b.flipAt + 0.1 }, { name: "reveal", at: b.flipAt, gain: 0.6 });
        break;
      case "stamp": out.push({ name: "punch", at: b.at }, { name: "hit", at: b.at, gain: 0.7 }); break;
      case "doc": out.push({ name: r("move"), at: b.from, gain: 0.6 }, { name: "punch", at: b.stamp.at }, { name: "hit", at: b.stamp.at, gain: 0.7 }); break;
      case "strike": out.push({ name: r("move"), at: b.from, gain: 0.6 }, { name: "swoosh", at: b.strikeAt + 0.2, gain: 0.9 }, { name: r("ui"), at: b.into.at, gain: 0.7 }); break;
      case "bubble": out.push({ name: "notify", at: b.from + 0.1, gain: 0.7 }); break;
    }
  }
  return out;
};

export const PaperReel: React.FC<PaperProps> = ({ spec, resolved }) => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const segments = useMemo(() => spec.segments ?? resolved?.segments ?? [], [spec.segments, resolved]);
  const words = useMemo(() => toWords(resolved?.captions?.length ? retimeCaptions(resolved.captions, segments) : []), [resolved, segments]);
  const cues = [...(spec.sfx === false ? [] : paperSfx(spec.beats)), ...(spec.sfxExtra ?? [])];
  const mono = spec.mono ?? 0.85;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: `grayscale(${mono}) sepia(0.18) contrast(1.06) brightness(1.02)` }}>
        <TalkingHead src={spec.video} segments={spec.segments ?? resolved?.segments} zooms={spec.zooms} />
      </AbsoluteFill>
      {/* warm paper wash + soft edges */}
      <AbsoluteFill style={{ background: "#F4E6C8", mixBlendMode: "multiply", opacity: 0.16 }} />
      <Grain opacity={0.07} />
      {spec.beats.map((b, i) => (
        <Sequence key={i} from={f(b.from)} durationInFrames={Math.max(1, f(b.to) - f(b.from))} name={`${b.kind} ${i + 1}`}>
          <SceneClock from={b.from} to={b.to}>
            <PaperBeatView b={b} />
          </SceneClock>
        </Sequence>
      ))}
      {words.length ? <PaperCaptions words={words} /> : null}
      <Vignette strength={0.28} />
      <SfxTrack cues={cues} />
    </AbsoluteFill>
  );
};

export const calculatePaperMetadata = makeMetadata<PaperProps>();
