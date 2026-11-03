// Paper beats — hand-made look: paper, tape, sticky notes, red pen, stamps, doodles that draw on.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Icon } from "../../components/graphics/Icon";
import { prog, useNow, useSceneVis } from "../signal/clock";
import { isArabic } from "../common/metadata";
import { PA } from "./tokens";
import type { Doodle, PaperBeat, T } from "./types";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** paper entrance: drop + settle rotation + fade; exit lifts away */
const drop = (p: number, out: number, tilt: number): React.CSSProperties => ({
  opacity: Math.min(1, p * 1.6) * (1 - out),
  transform: `translateY(${(1 - p) * 70 - out * 40}px) rotate(${tilt + (1 - p) * 6 * Math.sign(tilt || 1)}deg) scale(${0.94 + 0.06 * p})`,
});

const paperShadow = "0 2px 0 rgba(0,0,0,0.06), 0 22px 40px -14px rgba(0,0,0,0.55)";

const Tape: React.FC<{ rot?: number; style?: React.CSSProperties }> = ({ rot = -4, style }) => (
  <div style={{ position: "absolute", top: -26, left: "50%", width: 170, height: 52, marginLeft: -85, background: PA.tape, transform: `rotate(${rot}deg)`, boxShadow: "0 2px 6px rgba(0,0,0,0.12)", clipPath: "polygon(3% 0, 97% 4%, 100% 100%, 0 96%)", ...style }} />
);

/** Hand-drawn SVG path that draws itself between at and at+dur. */
const Draw: React.FC<{ d: string; at: number; dur?: number; color: string; w?: number; vb: string; style?: React.CSSProperties }> = ({ d, at, dur = 0.45, color, w = 6, vb, style }) => {
  const { t } = useNow();
  const p = prog(t, at, dur, PA.ease.inOut);
  return (
    <svg viewBox={vb} preserveAspectRatio="none" style={{ position: "absolute", overflow: "visible", pointerEvents: "none", ...style }}>
      <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - p} vectorEffect="non-scaling-stroke" opacity={p > 0 ? 1 : 0} />
    </svg>
  );
};

const DOODLE: Record<Doodle, { d: string; vb: string; style: React.CSSProperties; color: string }> = {
  circle: { d: "M88 8 C40 0 4 14 6 50 C8 86 60 96 120 90 C176 84 198 56 190 28 C182 4 130 2 84 12", vb: "0 0 200 100", style: { inset: "-22% -16%", width: "132%", height: "144%" }, color: PA.red },
  underline: { d: "M4 12 C60 4 140 18 196 6", vb: "0 0 200 20", style: { left: "-4%", right: "-4%", bottom: -14, width: "108%", height: 22 }, color: PA.red },
  star: { d: "M50 4 L62 38 L98 38 L68 60 L80 96 L50 74 L20 96 L32 60 L2 38 L38 38 Z", vb: "0 0 100 100", style: { top: -70, left: -64, width: 70, height: 70 }, color: PA.blue },
  arrow: { d: "M8 50 C40 46 70 40 92 18 M92 18 L70 20 M92 18 L88 40", vb: "0 0 100 60", style: { top: -40, right: "100%", width: 120, height: 72 }, color: PA.blue },
};

/** Hand-lettered words landing on time; one may carry a marker highlight + a doodle. */
const Letters: React.FC<{ words: T[]; size: number; highlight?: string[]; doodle?: { type: Doodle; word: string; at: number }; color?: string }> = ({ words, size, highlight = [], doodle, color = PA.ink }) => {
  const { t } = useNow();
  return (
    <div dir="rtl" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: size * 0.28, rowGap: size * 0.1, lineHeight: 1.3 }}>
      {words.map((w, i) => {
        const p = prog(t, w.at - 0.06, 0.3, PA.ease.out);
        const hl = highlight.includes(w.text);
        const mk = hl ? prog(t, w.at + 0.05, 0.35, PA.ease.inOut) : 0;
        const dd = doodle && doodle.word === w.text ? DOODLE[doodle.type] : null;
        return (
          <span key={i} style={{ position: "relative", display: "inline-block", fontFamily: PA.font, fontWeight: 700, fontSize: size, color: hl ? PA.red : color, opacity: p, transform: `translateY(${(1 - p) * 16}px) rotate(${(1 - p) * -4}deg)`, direction: isArabic(w.text) ? "rtl" : "ltr", unicodeBidi: "isolate" }}>
            {hl ? <span style={{ position: "absolute", left: -8, right: -8, top: "38%", bottom: "6%", background: PA.marker, transformOrigin: "right", transform: `scaleX(${mk}) skewX(-8deg)`, zIndex: 0, borderRadius: 6, opacity: 0.85 }} /> : null}
            <span style={{ position: "relative" }}>{w.text}</span>
            {dd ? <Draw d={dd.d} vb={dd.vb} at={doodle!.at} color={dd.color} style={dd.style} w={5} /> : null}
          </span>
        );
      })}
    </div>
  );
};

// ── banner: paper strip at the top ──
const Banner: React.FC<{ b: Extract<PaperBeat, { kind: "banner" }> }> = ({ b }) => {
  const { inn, out } = useSceneVis();
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 236, maxWidth: 860, background: PA.paper, padding: "22px 40px 26px", boxShadow: paperShadow, clipPath: "polygon(0 6%, 4% 0, 30% 5%, 60% 0, 96% 4%, 100% 0, 99% 94%, 70% 100%, 40% 95%, 8% 100%, 0 96%)", ...drop(inn, out, -1.5) }}>
        <Letters words={b.words} size={70} highlight={b.highlight} />
      </div>
    </AbsoluteFill>
  );
};

// ── note: taped card on the chest ──
const Note: React.FC<{ b: Extract<PaperBeat, { kind: "note" }> }> = ({ b }) => {
  const { t, inn, out } = useSceneVis();
  const s = b.sub ? prog(t, b.sub.at - 0.05, 0.3, PA.ease.out) : 0;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: PA.layout.chestTop + 40, width: 800, background: PA.paper, padding: "46px 46px 40px", boxShadow: paperShadow, backgroundImage: `repeating-linear-gradient(180deg, transparent 0 62px, ${PA.line} 62px 64px)`, ...drop(inn, out, b.tilt ?? -2) }}>
        <Tape />
        <Letters words={b.words} size={78} highlight={b.highlight} doodle={b.doodle} />
        {b.sub ? <div dir="rtl" style={{ marginTop: 18, textAlign: "center", fontFamily: PA.font, fontWeight: 500, fontSize: 44, color: PA.inkSoft, opacity: s, transform: `translateY(${(1 - s) * 10}px)` }}>{b.sub.text}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ── stickies: sticky notes dropping in a row ──
const Stickies: React.FC<{ b: Extract<PaperBeat, { kind: "stickies" }> }> = ({ b }) => {
  const { t, out } = useSceneVis();
  const tilts = [-6, 3, -3, 5];
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div dir="rtl" style={{ position: "absolute", top: PA.layout.chestTop + 60, display: "flex", gap: 30, opacity: 1 - out }}>
        {b.items.map((x, i) => {
          const p = prog(t, x.at - 0.08, 0.4, PA.ease.back);
          return (
            <div key={i} style={{ width: 250, height: 250, background: PA.sticky[x.color], boxShadow: "0 18px 30px -12px rgba(0,0,0,0.5), inset 0 -18px 30px -24px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * -120}px) rotate(${tilts[i % 4] * (0.6 + 0.4 * p)}deg) scale(${0.8 + 0.2 * p})` }}>
              {x.icon ? <Icon name={x.icon} size={86} color={PA.ink} strokeWidth={2} /> : null}
              <span style={{ fontFamily: PA.font, fontWeight: 700, fontSize: 54, color: PA.ink }}>{x.text}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Mark: React.FC<{ type: "dot" | "x" | "check"; at: number; size: number }> = ({ type, at, size }) => {
  const color = type === "check" ? PA.green : type === "x" ? PA.red : PA.blue;
  const box = <div style={{ position: "absolute", inset: 0, border: `3px solid ${PA.inkSoft}`, borderRadius: 8, transform: "rotate(-3deg)" }} />;
  if (type === "dot") return <div style={{ width: size * 0.4, height: size * 0.4, borderRadius: size, background: color, margin: size * 0.3 }} />;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {box}
      {type === "check" ? (
        <Draw d="M10 52 L38 80 L90 14" vb="0 0 100 100" at={at} dur={0.3} color={color} w={7} style={{ inset: -6, width: size + 12, height: size + 12 }} />
      ) : (
        <>
          <Draw d="M14 14 L86 86" vb="0 0 100 100" at={at} dur={0.18} color={color} w={7} style={{ inset: 2, width: size - 4, height: size - 4 }} />
          <Draw d="M86 14 L14 86" vb="0 0 100 100" at={at + 0.14} dur={0.18} color={color} w={7} style={{ inset: 2, width: size - 4, height: size - 4 }} />
        </>
      )}
    </div>
  );
};

// ── list: notebook page ──
const List: React.FC<{ b: Extract<PaperBeat, { kind: "list" }> }> = ({ b }) => {
  const { t, inn, out } = useSceneVis();
  const flipped = b.flipAt !== undefined && t >= b.flipAt;
  const fl = b.flipLabel ? prog(t, b.flipLabel.at - 0.05, 0.35, PA.ease.out) : 0;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div dir="rtl" style={{ position: "absolute", top: PA.layout.chestTop - 10, width: 780, background: PA.paper, padding: "34px 64px 34px 40px", boxShadow: paperShadow, backgroundImage: `linear-gradient(90deg, transparent calc(100% - 46px), ${PA.margin} calc(100% - 46px), ${PA.margin} calc(100% - 43px), transparent calc(100% - 43px)), repeating-linear-gradient(180deg, transparent 0 86px, ${PA.line} 86px 88px)`, ...drop(inn, out, 1.5) }}>
        <Tape rot={3} />
        {b.title ? <div style={{ fontFamily: PA.font, fontWeight: 700, fontSize: 52, color: PA.blue, marginBottom: 10, opacity: prog(t, b.title.at - 0.05, 0.3) }}>{b.title.text}</div> : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {b.items.map((x, i) => {
            const p = prog(t, x.at - 0.06, 0.3, PA.ease.out);
            const mark = flipped ? "check" : x.mark ?? "dot";
            const mAt = flipped ? b.flipAt! + i * 0.12 : x.at + 0.1;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, height: 64, opacity: p, transform: `translateX(${(1 - p) * -24}px)` }}>
                <Mark type={mark} at={mAt} size={58} />
                <span style={{ fontFamily: PA.font, fontWeight: 700, fontSize: 60, color: PA.ink }}>{x.text}</span>
              </div>
            );
          })}
        </div>
        {b.flipLabel ? (
          <div style={{ marginTop: 14, fontFamily: PA.font, fontWeight: 700, fontSize: 50, color: PA.green, opacity: fl, transform: `translateY(${(1 - fl) * 12}px) rotate(-2deg)` }}>{b.flipLabel.text}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ── stamp: rubber stamp slam ──
const StampMark: React.FC<{ text: string; at: number; size?: number; tone?: "red" | "green" }> = ({ text, at, size = 120, tone = "red" }) => {
  const { t } = useNow();
  const sc = interpolate(t, [at - 0.12, at, at + 0.08], [2.4, 0.94, 1], cl);
  const o = interpolate(t, [at - 0.12, at - 0.02], [0, 1], cl);
  const color = tone === "red" ? PA.red : PA.green;
  return (
    <div style={{ display: "inline-block", border: `${size * 0.07}px solid ${color}`, borderRadius: size * 0.16, padding: `${size * 0.02}px ${size * 0.3}px ${size * 0.1}px`, color, fontFamily: PA.font, fontWeight: 700, fontSize: size, lineHeight: 1.25, transform: `rotate(-9deg) scale(${sc})`, opacity: o * 0.92, mixBlendMode: "multiply", maskImage: "radial-gradient(circle at 30% 40%, #000 60%, rgba(0,0,0,0.75) 75%, #000 90%)", whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

const Stamp: React.FC<{ b: Extract<PaperBeat, { kind: "stamp" }> }> = ({ b }) => {
  const { out } = useSceneVis();
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div dir="rtl" style={{ position: "absolute", top: b.y ?? 935, opacity: 1 - out, background: "rgba(251,246,234,0.0)" }}>
        <div style={{ padding: 20, background: PA.paper, boxShadow: paperShadow, transform: "rotate(2deg)" }}>
          <StampMark text={b.text} at={b.at} size={150} tone={b.tone} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── doc: research paper + stamp ──
const Doc: React.FC<{ b: Extract<PaperBeat, { kind: "doc" }> }> = ({ b }) => {
  const { t, inn, out } = useSceneVis();
  const h = prog(t, b.heading.at - 0.05, 0.3, PA.ease.out);
  const widths = [92, 80, 96, 70, 88, 60];
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div dir="rtl" style={{ position: "absolute", top: PA.layout.chestTop - 20, width: 700, background: "#fff", padding: "40px 50px 50px", boxShadow: paperShadow, ...drop(inn, out, 2) }}>
        <Tape rot={-2} />
        <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: h }}>
          <Icon name="book" size={60} color={PA.blue} strokeWidth={2} />
          <span style={{ fontFamily: PA.font, fontWeight: 700, fontSize: 52, color: PA.ink }}>{b.heading.text}</span>
        </div>
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 20 }}>
          {widths.map((w, i) => (
            <div key={i} style={{ height: 14, borderRadius: 7, background: "rgba(29,27,24,0.16)", width: `${w * prog(t, b.heading.at + 0.15 + i * 0.12, 0.35, PA.ease.out)}%` }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 40, bottom: 40 }}>
          <StampMark text={b.stamp.text} at={b.stamp.at} size={96} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── strike: red pen through a word, replacement written below ──
const Strike: React.FC<{ b: Extract<PaperBeat, { kind: "strike" }> }> = ({ b }) => {
  const { t, inn, out } = useSceneVis();
  const w = prog(t, b.word.at - 0.05, 0.3, PA.ease.out);
  const r = prog(t, b.into.at - 0.05, 0.35, PA.ease.out);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div dir="rtl" style={{ position: "absolute", top: PA.layout.chestTop + 20, width: 780, background: PA.paper, padding: "44px 40px 40px", boxShadow: paperShadow, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, ...drop(inn, out, -1.5) }}>
        <Tape />
        <div style={{ position: "relative", opacity: w, transform: `translateY(${(1 - w) * 14}px)` }}>
          <span style={{ fontFamily: PA.font, fontWeight: 700, fontSize: 104, color: t >= b.strikeAt ? PA.inkSoft : PA.ink }}>{b.word.text}</span>
          <Draw d="M2 30 C60 18 120 34 198 14 M6 26 C70 30 140 12 196 24" vb="0 0 200 44" at={b.strikeAt} dur={0.35} color={PA.red} w={8} style={{ left: "-8%", top: "30%", width: "116%", height: "40%" }} />
        </div>
        <div style={{ fontFamily: PA.font, fontWeight: 700, fontSize: 70, color: PA.blue, opacity: r, transform: `translateY(${(1 - r) * 16}px) rotate(-2deg)` }}>{b.into.text}</div>
      </div>
    </AbsoluteFill>
  );
};

// ── bubble: thought bubble writing itself ──
const Bubble: React.FC<{ b: Extract<PaperBeat, { kind: "bubble" }> }> = ({ b }) => {
  const { t, inn, out } = useSceneVis();
  const words = b.text.split(" ");
  const n = Math.ceil(interpolate(t, [b.at, b.at + b.dur], [0, words.length], cl));
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div dir="rtl" style={{ position: "absolute", top: PA.layout.chestTop + 20, width: 820, ...drop(inn, out, 1) }}>
        <div style={{ background: "#fff", borderRadius: 60, padding: "40px 50px", boxShadow: paperShadow, minHeight: 200, border: `4px solid ${PA.ink}` }}>
          {b.who ? <div style={{ fontFamily: PA.font, fontWeight: 700, fontSize: 38, color: PA.blue, marginBottom: 6 }}>{b.who}</div> : null}
          <div style={{ fontFamily: PA.font, fontWeight: 700, fontSize: 62, color: PA.ink, lineHeight: 1.45 }}>
            {words.map((w, i) => <span key={i} style={{ opacity: i < n ? 1 : 0 }}>{w} </span>)}
          </div>
        </div>
        {/* thought dots rising toward the head */}
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", top: -40 - i * 52, left: 470 + i * 30, width: 40 - i * 10, height: 40 - i * 10, borderRadius: 40, background: "#fff", border: `4px solid ${PA.ink}`, opacity: prog(t, b.from + 0.1 + i * 0.1, 0.25) }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const PaperBeatView: React.FC<{ b: PaperBeat }> = ({ b }) => {
  switch (b.kind) {
    case "banner": return <Banner b={b} />;
    case "note": return <Note b={b} />;
    case "stickies": return <Stickies b={b} />;
    case "list": return <List b={b} />;
    case "stamp": return <Stamp b={b} />;
    case "doc": return <Doc b={b} />;
    case "strike": return <Strike b={b} />;
    case "bubble": return <Bubble b={b} />;
  }
};
