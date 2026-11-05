// Cinema beats — quiet, typographic, serif. Nothing appears before its first word.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Icon } from "../../components/graphics/Icon";
import { prog, useNow, useSceneVis } from "../signal/clock";
import { isArabic } from "../common/metadata";
import { CI } from "./tokens";
import type { CinemaBeat, L } from "./types";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Words that fade up (slow, elegant) at their spoken time. */
const Serif: React.FC<{ words: L[]; size: number; highlight?: string[]; color?: string; center?: boolean; maxWidth?: number }> = ({ words, size, highlight = [], color = CI.cream, center = true, maxWidth = 900 }) => {
  const { t } = useNow();
  return (
    <div dir="rtl" style={{ display: "flex", flexWrap: "wrap", justifyContent: center ? "center" : "flex-start", columnGap: size * 0.3, maxWidth, lineHeight: 1.45 }}>
      {words.map((w, i) => {
        const p = prog(t, w.at - 0.08, 0.55, CI.ease.out);
        const h = highlight.includes(w.text);
        return (
          <span key={i} style={{ fontFamily: CI.font, fontWeight: 700, fontSize: size, color: h ? CI.gold : color, opacity: p, transform: `translateY(${(1 - p) * 18}px)`, filter: `blur(${(1 - p) * 6}px)`, textShadow: "0 6px 30px rgba(0,0,0,0.7)", direction: isArabic(w.text) ? "rtl" : "ltr", unicodeBidi: "isolate", display: "inline-block" }}>
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

/** soft dark falloff behind floating type (no box) */
const Shade: React.FC<{ y: number; h: number; o: number }> = ({ y, h, o }) => (
  <div style={{ position: "absolute", left: -100, right: -100, top: y - h / 2, height: h, background: "radial-gradient(ellipse at center, rgba(5,4,3,0.78) 0%, rgba(5,4,3,0.45) 45%, transparent 72%)", opacity: o }} />
);

const useFade = (first: number) => {
  const { t, from } = useNow();
  const { out } = useSceneVis();
  const a = prog(t, Math.max(from, first - 0.3), 0.45, CI.ease.out);
  return { t, a: a * (1 - out), out };
};

// ── chapter card ──
const Chapter: React.FC<{ b: Extract<CinemaBeat, { kind: "chapter" }> }> = ({ b }) => {
  const { t, inn, out } = useSceneVis();
  const k = prog(t, b.from + 0.1, 0.5, CI.ease.out);
  const line = prog(t, b.from + 0.2, 0.9, CI.ease.inOut);
  return (
    <AbsoluteFill style={{ background: CI.ink, opacity: inn * (1 - out), alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, marginTop: -60 }}>
        <span dir="rtl" style={{ fontFamily: CI.font, fontWeight: 400, fontSize: 44, color: CI.gold, letterSpacing: 2, opacity: k }}>{b.kicker}</span>
        <div style={{ width: 340 * line, height: 2, background: CI.gold }} />
        <Serif words={b.title} size={104} />
      </div>
    </AbsoluteFill>
  );
};

// ── quote ──
const Quote: React.FC<{ b: Extract<CinemaBeat, { kind: "quote" }> }> = ({ b }) => {
  const { t, a } = useFade(b.words[0].at);
  const y = CI.layout.chestY;
  const size = b.size ?? 92;
  const mk = prog(t, b.words[0].at - 0.2, 0.5, CI.ease.out);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Shade y={y} h={620} o={a} />
      <div style={{ position: "absolute", top: y - 220, left: 70, right: 70, height: 440, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: a }}>
        {b.label ? <span dir="rtl" style={{ fontFamily: CI.font, fontSize: 38, color: CI.gold, opacity: mk }}>{b.label}</span> : null}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <span style={{ fontFamily: CI.font, fontSize: size * 1.5, color: CI.gold, opacity: mk * 0.9, lineHeight: 1, marginTop: -size * 0.2 }}>«</span>
          <Serif words={b.words} size={size} highlight={b.highlight} maxWidth={800} />
          <span style={{ fontFamily: CI.font, fontSize: size * 1.5, color: CI.gold, opacity: mk * 0.9, lineHeight: 1, marginTop: -size * 0.2 }}>»</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── lower third ──
const Lower: React.FC<{ b: Extract<CinemaBeat, { kind: "lower" }> }> = ({ b }) => {
  const { t, a } = useFade(b.title.at);
  const line = prog(t, b.title.at - 0.2, 0.7, CI.ease.inOut);
  const tp = prog(t, b.title.at - 0.05, 0.5, CI.ease.out);
  const sp = b.sub ? prog(t, b.sub.at - 0.05, 0.5, CI.ease.out) : 0;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Shade y={1110} h={420} o={a} />
      <div dir="rtl" style={{ position: "absolute", top: 1000, right: 90, display: "flex", flexDirection: "column", gap: 8, opacity: a }}>
        <span style={{ fontFamily: CI.font, fontWeight: 700, fontSize: 70, color: CI.cream, opacity: tp, transform: `translateX(${(1 - tp) * -20}px)`, textShadow: "0 4px 24px rgba(0,0,0,0.7)" }}>{b.title.text}</span>
        <div style={{ height: 3, width: 520 * line, background: CI.gold }} />
        {b.sub ? <span style={{ fontFamily: CI.font, fontWeight: 400, fontSize: 48, color: CI.gold, opacity: sp, textShadow: "0 4px 24px rgba(0,0,0,0.7)" }}>{b.sub.text}</span> : null}
      </div>
    </AbsoluteFill>
  );
};

// ── triptych ──
const Triptych: React.FC<{ b: Extract<CinemaBeat, { kind: "triptych" }> }> = ({ b }) => {
  const { t, a } = useFade(b.items[0].at);
  const glow = b.glowAt !== undefined ? prog(t, b.glowAt, 0.6, CI.ease.inOut) : 0;
  const gl = b.glowLabel ? prog(t, b.glowLabel.at - 0.05, 0.5, CI.ease.out) : 0;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Shade y={1120} h={700} o={a} />
      <div style={{ position: "absolute", top: 900, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30, opacity: a }}>
        <div dir="rtl" style={{ display: "flex", gap: 50 }}>
          {b.items.map((x, i) => {
            const p = prog(t, x.at - 0.1, 0.5, CI.ease.out);
            const strike = b.struck ? prog(t, x.at + 0.25, 0.35, CI.ease.inOut) * (1 - glow) : 0;
            const col = glow > 0.5 ? CI.gold : CI.cream;
            return (
              <div key={i} style={{ width: 250, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>
                <div style={{ position: "relative", width: 190, height: 190, borderRadius: 190, border: `3px solid ${col}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: glow > 0 ? `0 0 ${50 * glow}px rgba(233,199,123,${0.6 * glow})` : "none" }}>
                  <Icon name={x.icon} size={100} color={col} strokeWidth={1.4} />
                  {strike > 0 ? <div style={{ position: "absolute", width: 230 * strike, height: 4, background: CI.red, transform: "rotate(-35deg)" }} /> : null}
                </div>
                <span dir="rtl" style={{ fontFamily: CI.font, fontWeight: 700, fontSize: 50, color: col, whiteSpace: "nowrap", textShadow: "0 4px 20px rgba(0,0,0,0.7)" }}>{x.label}</span>
              </div>
            );
          })}
        </div>
        {b.glowLabel ? <span dir="rtl" style={{ fontFamily: CI.font, fontWeight: 700, fontSize: 56, color: CI.gold, opacity: gl, transform: `translateY(${(1 - gl) * 16}px)`, textShadow: "0 4px 24px rgba(0,0,0,0.8)" }}>{b.glowLabel.text}</span> : null}
      </div>
    </AbsoluteFill>
  );
};

// ── evidence counter ──
const Evidence: React.FC<{ b: Extract<CinemaBeat, { kind: "evidence" }> }> = ({ b }) => {
  const { t, a } = useFade(b.title.at);
  const p = prog(t, b.at - 0.9, 0.9, CI.ease.inOut);
  const v = Math.round(b.from0 + (b.value - b.from0) * p);
  const tp = prog(t, b.title.at - 0.05, 0.5, CI.ease.out);
  const landed = t >= b.at;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Shade y={1110} h={700} o={a} />
      <div style={{ position: "absolute", top: 880, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: a }}>
        <span dir="rtl" style={{ fontFamily: CI.font, fontWeight: 400, fontSize: 48, color: CI.gold, opacity: tp }}>{b.title.text}</span>
        <span dir="ltr" style={{ fontFamily: CI.font, fontWeight: 700, fontSize: 280, lineHeight: 1.1, color: landed ? CI.red : CI.cream, fontVariantNumeric: "tabular-nums", textShadow: "0 10px 40px rgba(0,0,0,0.7)", transform: `scale(${landed ? interpolate(t, [b.at, b.at + 0.12, b.at + 0.3], [1.12, 0.97, 1], cl) : 1})` }}>{v}</span>
        <span dir="rtl" style={{ fontFamily: CI.font, fontWeight: 700, fontSize: 56, color: CI.cream, opacity: prog(t, b.at, 0.4) }}>{b.label}</span>
      </div>
    </AbsoluteFill>
  );
};

// ── strike ──
const Strike: React.FC<{ b: Extract<CinemaBeat, { kind: "strike" }> }> = ({ b }) => {
  const { t, a } = useFade(b.word.at);
  const s = prog(t, b.strikeAt, 0.45, CI.ease.inOut);
  const r = prog(t, b.into.at - 0.05, 0.55, CI.ease.out);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Shade y={1100} h={620} o={a} />
      <div style={{ position: "absolute", top: 900, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: a }}>
        <div style={{ position: "relative" }}>
          <span dir="rtl" style={{ fontFamily: CI.font, fontWeight: 700, fontSize: 150, color: s > 0.5 ? CI.dim : CI.cream, textShadow: "0 8px 30px rgba(0,0,0,0.7)" }}>{b.word.text}</span>
          <div style={{ position: "absolute", top: "54%", right: -20, height: 6, width: `calc(${s * 100}% + 40px)`, background: CI.red, transform: "rotate(-3deg)" }} />
        </div>
        <span dir="rtl" style={{ fontFamily: CI.font, fontWeight: 700, fontSize: 70, color: CI.gold, opacity: r, transform: `translateY(${(1 - r) * 18}px)`, textShadow: "0 6px 26px rgba(0,0,0,0.8)" }}>{b.into.text}</span>
      </div>
    </AbsoluteFill>
  );
};

// ── iris: the frame closes into a box around the face, then opens ──
const Iris: React.FC<{ b: Extract<CinemaBeat, { kind: "iris" }> }> = ({ b }) => {
  const { t } = useNow();
  const c = prog(t, b.closeAt - 0.3, 0.8, CI.ease.slow) * (1 - prog(t, b.openAt, 0.7, CI.ease.inOut));
  const box = { x: 290, y: 260, w: 500, h: 640 };
  const L = box.x * c, T = (box.y) * c, R = (1080 - box.x - box.w) * c, B = (1920 - box.y - box.h) * c;
  const lp = b.label ? prog(t, b.label.at - 0.05, 0.5, CI.ease.out) * (1 - prog(t, b.openAt, 0.4)) : 0;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: L, top: T, right: R, bottom: B, boxShadow: `0 0 0 3000px rgba(6,5,4,${0.9 * Math.min(1, c * 1.2)})`, border: c > 0.05 ? `3px solid rgba(233,199,123,${c})` : undefined }} />
      {b.label ? (
        <div style={{ position: "absolute", top: box.y + box.h + 50, left: 0, right: 0, textAlign: "center", opacity: lp }}>
          <span dir="rtl" style={{ fontFamily: CI.font, fontWeight: 700, fontSize: 84, color: CI.gold }}>{b.label.text}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ── end title with light sweep ──
const End: React.FC<{ b: Extract<CinemaBeat, { kind: "end" }> }> = ({ b }) => {
  const { t, a } = useFade(b.words[0].at);
  const sweep = interpolate(t, [b.words[b.words.length - 1].at, b.words[b.words.length - 1].at + 1.0], [-30, 130], cl);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Shade y={1100} h={600} o={a} />
      <div style={{ position: "absolute", top: 930, left: 60, right: 60, display: "flex", justifyContent: "center", opacity: a, WebkitMaskImage: undefined }}>
        <div style={{ position: "relative" }}>
          <Serif words={b.words} size={96} highlight={b.highlight} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(100deg, transparent ${sweep - 12}%, rgba(255,240,200,0.55) ${sweep}%, transparent ${sweep + 12}%)`, mixBlendMode: "overlay" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CinemaBeatView: React.FC<{ b: CinemaBeat }> = ({ b }) => {
  switch (b.kind) {
    case "chapter": return <Chapter b={b} />;
    case "quote": return <Quote b={b} />;
    case "lower": return <Lower b={b} />;
    case "triptych": return <Triptych b={b} />;
    case "evidence": return <Evidence b={b} />;
    case "strike": return <Strike b={b} />;
    case "iris": return <Iris b={b} />;
    case "end": return <End b={b} />;
  }
};
