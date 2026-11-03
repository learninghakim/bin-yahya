// Newsroom beats. Every element lands on its spoken word (absolute seconds via SceneClock).
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Icon } from "../../components/graphics/Icon";
import { prog, useNow, useSceneVis } from "../signal/clock";
import { isArabic } from "../common/metadata";
import { N } from "./tokens";
import type { NewsBeat, T } from "./types";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** fade + slide + de-blur, exit faster */
const slideIn = (p: number, out: number, dx = 60): React.CSSProperties => ({
  opacity: p * (1 - out),
  transform: `translateX(${(1 - p) * dx + out * -30}px)`,
  filter: `blur(${(1 - p) * 8 + out * 6}px)`,
});

const Words: React.FC<{ words: T[]; highlight?: string[]; size: number; color?: string; hl?: string; weight?: number; center?: boolean }> = ({ words, highlight = [], size, color = N.white, hl = N.red, weight = 700, center }) => {
  const { t } = useNow();
  return (
    <div dir="rtl" style={{ display: "flex", flexWrap: "wrap", columnGap: size * 0.26, justifyContent: center ? "center" : "flex-start", lineHeight: 1.2 }}>
      {words.map((w, i) => {
        const p = prog(t, w.at - 0.05, 0.26, N.ease.out);
        const h = highlight.includes(w.text);
        return (
          <span key={i} style={{ fontFamily: N.font, fontWeight: weight, fontSize: size, color: h ? hl : color, opacity: p, transform: `translateY(${(1 - p) * size * 0.3}px)`, display: "inline-block", direction: isArabic(w.text) ? "rtl" : "ltr", unicodeBidi: "isolate" }}>
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

const Tag: React.FC<{ text: string; color?: string; size?: number }> = ({ text, color = N.red, size = 30 }) => (
  <div style={{ background: color, color: N.white, fontFamily: N.font, fontWeight: 700, fontSize: size, padding: `${size * 0.18}px ${size * 0.55}px`, lineHeight: 1.2, letterSpacing: 0.5 }}>{text}</div>
);

// ── breaking: red tag + white bar with headline, slides in from the right edge ──
const Breaking: React.FC<{ b: Extract<NewsBeat, { kind: "breaking" }> }> = ({ b }) => {
  const { t, inn, out } = useSceneVis();
  const bar = prog(t, b.from, 0.45, N.ease.out);
  return (
    <AbsoluteFill>
      <div dir="rtl" style={{ position: "absolute", top: 830, right: 70, left: 120, ...slideIn(inn, out, 80) }}>
        <div style={{ display: "flex" }}><Tag text={b.tag} /></div>
        <div style={{ background: N.paper, padding: "18px 28px 22px", clipPath: `inset(0 0 0 ${(1 - bar) * 100}%)`, boxShadow: "0 24px 50px -20px rgba(0,0,0,.6)" }}>
          <Words words={b.headline} highlight={b.highlight} size={64} color={N.ink} />
        </div>
        <div style={{ height: 8, background: N.red, width: `${bar * 100}%`, marginInlineStart: "auto" }} />
      </div>
    </AbsoluteFill>
  );
};

// ── cite: lower-third citation card ──
const Cite: React.FC<{ b: Extract<NewsBeat, { kind: "cite" }> }> = ({ b }) => {
  const { t, inn, out } = useSceneVis();
  const d = b.detail ? prog(t, b.detail.at - 0.05, 0.3, N.ease.out) : 0;
  return (
    <AbsoluteFill>
      <div dir="rtl" style={{ position: "absolute", top: 1010, right: 70, display: "flex", alignItems: "stretch", ...slideIn(inn, out, 70) }}>
        <div style={{ background: N.red, width: 104, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={b.icon ?? "book"} size={58} color={N.white} strokeWidth={2.2} />
        </div>
        <div style={{ background: N.panel, padding: "16px 30px", display: "flex", flexDirection: "column", gap: 4, borderBottom: `4px solid ${N.red}` }}>
          <div style={{ fontFamily: N.font, fontWeight: 700, fontSize: 46, color: N.white }}>{b.title}</div>
          {b.detail ? <div style={{ fontFamily: N.font, fontWeight: 400, fontSize: 34, color: N.dim, opacity: d, transform: `translateY(${(1 - d) * 10}px)` }}>{b.detail.text}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

/** Number that counts up with a slight ease, ticking digits. */
const Count: React.FC<{ value: number; at: number; dur?: number; prefix?: string; suffix?: string; size: number; color: string }> = ({ value, at, dur = 0.9, prefix = "", suffix = "", size, color }) => {
  const { t } = useNow();
  const p = prog(t, at, dur, N.ease.out);
  const v = Math.round(value * p);
  return (
    <span dir="ltr" style={{ fontFamily: N.font, fontWeight: 700, fontSize: size, color, fontVariantNumeric: "tabular-nums", lineHeight: 1, letterSpacing: -2 }}>
      {prefix}{fmt(v)}{suffix}
    </span>
  );
};

const Arrow: React.FC<{ dir: "up" | "down"; size: number; p: number }> = ({ dir, size, p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `translateY(${(1 - p) * (dir === "up" ? 30 : -30)}px) rotate(${dir === "up" ? 0 : 180}deg)`, opacity: p }}>
    <path d="M12 3l8 10h-5v8H9v-8H4z" fill={dir === "up" ? N.up : N.down} />
  </svg>
);

// ── stat: big counter card on the chest (or full stage) ──
const Stat: React.FC<{ b: Extract<NewsBeat, { kind: "stat" }> }> = ({ b }) => {
  const { t, inn, out } = useSceneVis();
  const ap = prog(t, b.at + 0.5, 0.35, N.ease.out);
  const col = b.dir === "up" ? N.up : N.down;
  const card = (
    <div dir="rtl" style={{ background: N.panel, border: `1px solid ${N.faint}`, padding: "30px 46px 34px", minWidth: 620, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, boxShadow: "0 30px 60px -20px rgba(0,0,0,.7)", position: "relative", overflow: "hidden" }}>
      <Grid />
      <div style={{ display: "flex", alignItems: "center", gap: 18, position: "relative" }}>
        <Count value={b.value} at={b.at} prefix={b.prefix} suffix={b.suffix} size={210} color={col} />
        <Arrow dir={b.dir} size={130} p={ap} />
      </div>
      <div style={{ position: "relative" }}><Words words={[b.label]} size={50} center /></div>
      {b.note ? <div style={{ position: "relative" }}><Words words={[b.note]} size={34} color={N.dim} weight={400} center /></div> : null}
      <div style={{ position: "absolute", bottom: 0, right: 0, height: 6, width: `${prog(t, b.at, 0.9, N.ease.out) * 100}%`, background: col }} />
    </div>
  );
  if (b.stage) {
    return (
      <AbsoluteFill style={{ opacity: inn * (1 - out) }}>
        <Plate />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${0.96 + 0.04 * inn})` }}>{card}</AbsoluteFill>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 830, ...slideIn(inn, out, 0), transform: `translateY(${(1 - inn) * 40}px) scale(${0.96 + 0.04 * inn})` }}>{card}</div>
    </AbsoluteFill>
  );
};

const Grid: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${N.faint} 1px, transparent 1px), linear-gradient(90deg, ${N.faint} 1px, transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.35 }} />
);

/** Dark cinematic plate for full-screen moments (lets a hint of the footage through). */
const Plate: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(30,10,12,0.9), rgba(5,5,7,0.97) 70%)" }}>
    <Grid />
  </AbsoluteFill>
);

// ── versus: race bars ──
const Versus: React.FC<{ b: Extract<NewsBeat, { kind: "versus" }> }> = ({ b }) => {
  const { t, inn, out } = useSceneVis();
  const max = Math.max(...b.bars.map((x) => Math.abs(x.value)));
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div dir="rtl" style={{ position: "absolute", top: 800, width: 860, background: N.panel, padding: "28px 40px 34px", border: `1px solid ${N.faint}`, ...slideIn(inn, out, 0), transform: `translateY(${(1 - inn) * 40}px)` }}>
        {b.title ? <div style={{ fontFamily: N.font, fontWeight: 700, fontSize: 36, color: N.dim, marginBottom: 18 }}>{b.title}</div> : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          {b.bars.map((x, i) => {
            const p = prog(t, x.at - 0.05, 0.8, N.ease.out);
            const col = x.tone === "up" ? N.up : x.tone === "down" ? N.down : N.white;
            const rowIn = prog(t, x.at - 0.25, 0.25, N.ease.out);
            return (
              <div key={i} style={{ opacity: rowIn }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontFamily: N.font, fontWeight: 700, fontSize: 40, color: N.white }}>{x.label}</span>
                  <Count value={x.value} at={x.at} dur={0.8} prefix={x.tone === "up" ? "+" : x.tone === "down" ? "−" : ""} suffix={x.suffix} size={64} color={col} />
                </div>
                <div style={{ height: 34, background: "rgba(255,255,255,0.08)" }}>
                  <div style={{ height: "100%", width: `${(Math.abs(x.value) / max) * 100 * p}%`, background: col }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── stage: full-screen headline (magazine cover feel) ──
const Stage: React.FC<{ b: Extract<NewsBeat, { kind: "stage" }> }> = ({ b }) => {
  const { t, inn, out } = useSceneVis();
  const k = b.kicker ? prog(t, b.kicker.at - 0.05, 0.3, N.ease.out) : 0;
  return (
    <AbsoluteFill style={{ opacity: inn * (1 - out) }}>
      <Plate />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 90px", transform: `scale(${0.97 + 0.03 * inn})` }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, marginTop: -160 }}>
          {b.kicker ? <div style={{ opacity: k, transform: `translateY(${(1 - k) * 14}px)` }}><Tag text={b.kicker.text} size={36} /></div> : null}
          <Words words={b.lines} highlight={b.highlight} size={118} center />
          <div style={{ height: 6, width: 260 * prog(t, b.from + 0.2, 0.6, N.ease.out), background: N.red }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── rule: numbered rule card ──
const Rule: React.FC<{ b: Extract<NewsBeat, { kind: "rule" }> }> = ({ b }) => {
  const { t, inn, out } = useSceneVis();
  const s = b.sub ? prog(t, b.sub.at - 0.05, 0.3, N.ease.out) : 0;
  const tp = prog(t, b.title.at - 0.05, 0.3, N.ease.out);
  return (
    <AbsoluteFill>
      <div dir="rtl" style={{ position: "absolute", top: 840, right: 70, left: 120, display: "flex", alignItems: "stretch", ...slideIn(inn, out, 80) }}>
        <div style={{ background: N.red, minWidth: 170, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 0" }}>
          <div style={{ fontFamily: N.font, fontWeight: 700, fontSize: 30, color: "rgba(255,255,255,.8)" }}>القاعدة</div>
          <div dir="ltr" style={{ fontFamily: N.font, fontWeight: 700, fontSize: 120, color: N.white, lineHeight: 1 }}>{String(b.n).padStart(2, "0")}</div>
        </div>
        <div style={{ background: N.panel, flex: 1, padding: "22px 32px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 10, borderBottom: `4px solid ${N.red}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: tp, transform: `translateY(${(1 - tp) * 14}px)` }}>
            {b.icon ? <Icon name={b.icon} size={56} color={N.gold} strokeWidth={2.2} /> : null}
            <span style={{ fontFamily: N.font, fontWeight: 700, fontSize: 58, color: N.white, lineHeight: 1.15 }}>{b.title.text}</span>
          </div>
          {b.sub ? <div style={{ fontFamily: N.font, fontWeight: 400, fontSize: 38, color: N.dim, opacity: s, transform: `translateY(${(1 - s) * 10}px)` }}>{b.sub.text}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── prompt: chat box that types the prompt ──
const Prompt: React.FC<{ b: Extract<NewsBeat, { kind: "prompt" }> }> = ({ b }) => {
  const { t, inn, out } = useSceneVis();
  const words = b.text.split(" ");
  const p = interpolate(t, [b.at, b.at + b.dur], [0, 1], cl);
  const n = Math.floor(p * words.length + 0.0001);
  const shown = words.slice(0, n).join(" ");
  const caret = Math.floor(t * 2.4) % 2 === 0;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div dir="rtl" style={{ position: "absolute", top: 790, width: 880, background: "#15171C", border: `1px solid ${N.faint}`, borderRadius: 26, padding: "24px 32px 30px", boxShadow: "0 30px 60px -20px rgba(0,0,0,.7)", ...slideIn(inn, out, 0), transform: `translateY(${(1 - inn) * 40}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ width: 14, height: 14, borderRadius: 14, background: N.red }} />
          <span style={{ fontFamily: N.font, fontWeight: 700, fontSize: 30, color: N.dim }}>{b.label}</span>
        </div>
        <div style={{ fontFamily: N.font, fontWeight: 700, fontSize: 48, color: N.white, lineHeight: 1.45, minHeight: 140 }}>
          «{shown}
          <span style={{ opacity: caret || p >= 1 ? 1 : 0, color: N.red }}>{p >= 1 ? "»" : "|"}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <div style={{ width: 70, height: 70, borderRadius: 70, background: p >= 1 ? N.red : "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="arrow" size={38} color={N.white} strokeWidth={2.6} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── verdict: two outcomes stamped ──
const Verdict: React.FC<{ b: Extract<NewsBeat, { kind: "verdict" }> }> = ({ b }) => {
  const { t, out } = useSceneVis();
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div dir="rtl" style={{ position: "absolute", top: 850, display: "flex", flexDirection: "column", gap: 26, opacity: 1 - out }}>
        {b.items.map((x, i) => {
          const p = prog(t, x.at - 0.05, 0.3, N.ease.out);
          const sc = interpolate(t, [x.at - 0.05, x.at + 0.12, x.at + 0.3], [1.5, 0.96, 1], cl);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, background: N.panel, padding: "18px 36px", borderRight: `10px solid ${x.good ? N.up : N.down}`, opacity: p, transform: `scale(${sc})` }}>
              <div style={{ width: 74, height: 74, borderRadius: 74, background: x.good ? N.up : N.down, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={x.good ? "check" : "x"} size={46} color={N.ink} strokeWidth={3.2} />
              </div>
              <span style={{ fontFamily: N.font, fontWeight: 700, fontSize: 60, color: N.white }}>{x.text}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── cta: save + share ──
const Cta: React.FC<{ b: Extract<NewsBeat, { kind: "cta" }> }> = ({ b }) => {
  const { t, out } = useSceneVis();
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div dir="rtl" style={{ position: "absolute", top: 880, display: "flex", gap: 30, opacity: 1 - out }}>
        {b.items.map((x, i) => {
          const p = prog(t, x.at - 0.05, 0.35, N.ease.out);
          const press = interpolate(t, [x.at + 0.35, x.at + 0.45, x.at + 0.6], [1, 0.92, 1], cl);
          const on = t > x.at + 0.42;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, background: on ? N.red : N.panel, padding: "26px 40px", minWidth: 300, border: `1px solid ${N.faint}`, opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${press})` }}>
              <Icon name={x.icon} size={84} color={N.white} strokeWidth={2.2} />
              <span style={{ fontFamily: N.font, fontWeight: 700, fontSize: 44, color: N.white }}>{x.text}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const NewsBeatView: React.FC<{ b: NewsBeat }> = ({ b }) => {
  switch (b.kind) {
    case "breaking": return <Breaking b={b} />;
    case "cite": return <Cite b={b} />;
    case "stat": return <Stat b={b} />;
    case "versus": return <Versus b={b} />;
    case "stage": return <Stage b={b} />;
    case "rule": return <Rule b={b} />;
    case "prompt": return <Prompt b={b} />;
    case "verdict": return <Verdict b={b} />;
    case "cta": return <Cta b={b} />;
  }
};

