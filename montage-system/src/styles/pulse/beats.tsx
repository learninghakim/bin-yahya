// Pulse beats — neon HUD graphics that float on a soft dark halo. Nothing is shown before its first
// element is due: every container fades in WITH its content (no empty boxes, no "0%" placeholders).
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Icon } from "../../components/graphics/Icon";
import { prog, useNow, useSceneVis } from "../signal/clock";
import { PU } from "./tokens";
import type { PulseBeat } from "./types";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const glow = (c: string, r = 18) => `drop-shadow(0 0 ${r}px ${c})`;

/** Soft dark halo behind a floating graphic + scene in/out (fade, rise, de-blur). */
const Float: React.FC<{ y?: number; w?: number; h?: number; children: React.ReactNode; first?: number }> = ({ y = PU.layout.artY, w = 900, h = 560, children, first }) => {
  const { out } = useSceneVis();
  const { t, from } = useNow();
  const a = prog(t, Math.max(from, (first ?? from) - 0.3), 0.3, PU.ease.out);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: (1080 - w) / 2 - 90, top: y - h / 2 - 90, width: w + 180, height: h + 180, background: `radial-gradient(ellipse at center, ${PU.halo} 0%, rgba(3,6,12,0.5) 45%, transparent 72%)`, opacity: a * (1 - out) }} />
      <div style={{ position: "absolute", left: (1080 - w) / 2, top: y - h / 2, width: w, height: h, display: "flex", alignItems: "center", justifyContent: "center", opacity: a * (1 - out), transform: `translateY(${(1 - a) * 24 - out * 10}px) scale(${0.97 + 0.03 * a})`, filter: `blur(${(1 - a) * 8 + out * 6}px)` }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

const Txt: React.FC<{ size: number; color?: string; weight?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ size, color = PU.white, weight = 800, style, children }) => (
  <span dir="rtl" style={{ fontFamily: PU.font, fontWeight: weight, fontSize: size, color, lineHeight: 1.3, whiteSpace: "nowrap", ...style }}>{children}</span>
);

const Num: React.FC<{ v: number; size: number; color: string; prefix?: string; suffix?: string }> = ({ v, size, color, prefix = "", suffix = "" }) => (
  <span dir="ltr" style={{ fontFamily: PU.font, fontWeight: 800, fontSize: size, color, fontVariantNumeric: "tabular-nums", lineHeight: 1, filter: glow(color, 14) }}>{prefix}{Math.round(v)}{suffix}</span>
);

// ── chart: line draws to each point at its time ──
const Chart: React.FC<{ b: Extract<PulseBeat, { kind: "chart" }> }> = ({ b }) => {
  const { t } = useNow();
  const W = 820, H = 380, n = b.points.length;
  const xs = b.points.map((_, i) => 40 + (i * (W - 80)) / Math.max(1, n - 1));
  const ys = b.points.map((p) => H - 30 - p.y * (H - 80));
  // progress along the polyline: segment i draws between points[i].at and points[i+1].at
  const segs = b.points.slice(1).map((p, i) => prog(t, b.points[i].at, Math.max(0.25, Math.min(0.6, p.at - b.points[i].at)), PU.ease.inOut));
  let d = `M${xs[0]} ${ys[0]}`;
  segs.forEach((s, i) => {
    if (s <= 0) return;
    d += ` L${xs[i] + (xs[i + 1] - xs[i]) * s} ${ys[i] + (ys[i + 1] - ys[i]) * s}`;
  });
  const crashed = b.points.findIndex((p) => p.bad);
  const isBad = crashed >= 0 && t >= b.points[crashed].at;
  const col = isBad ? PU.magenta : PU.cyan;
  return (
    <Float first={b.points[0].at} h={H + 60}>
      <svg width={W} height={H} style={{ overflow: "visible" }}>
        {[0, 1, 2, 3].map((k) => <line key={k} x1={20} x2={W - 20} y1={30 + k * ((H - 60) / 3)} y2={30 + k * ((H - 60) / 3)} stroke={PU.faint} strokeWidth={1.5} strokeDasharray="6 10" />)}
        <path d={d} fill="none" stroke={col} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" style={{ filter: glow(col, 16) }} />
        {b.points.map((p, i) => {
          const s = prog(t, p.at, 0.25, PU.ease.out);
          const c = p.bad ? PU.magenta : PU.cyan;
          return (
            <g key={i} opacity={s}>
              <circle cx={xs[i]} cy={ys[i]} r={10 + 8 * s} fill={PU.bg} stroke={c} strokeWidth={6} />
              {p.label ? (
                <text x={xs[i]} y={ys[i] + (p.bad ? 80 : -36)} textAnchor="middle" fill={c} style={{ fontFamily: PU.font, fontWeight: 800, fontSize: 58, filter: glow(c, 10) }}>{p.label}</text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </Float>
  );
};

// ── crowd: dot grid fills from the centre ──
const Crowd: React.FC<{ b: Extract<PulseBeat, { kind: "crowd" }> }> = ({ b }) => {
  const { t } = useNow();
  const cols = 25, rows = 12;
  const p = prog(t, b.at - 0.5, 1.0, PU.ease.out);
  const lp = prog(t, b.at, 0.3, PU.ease.out);
  return (
    <Float first={b.at - 0.5} h={520}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <svg width={cols * 30} height={rows * 30}>
          {Array.from({ length: cols * rows }).map((_, i) => {
            const x = i % cols, y = Math.floor(i / cols);
            const dist = Math.hypot(x - cols / 2, (y - rows / 2) * 2) / Math.hypot(cols / 2, rows);
            const on = p > dist;
            return <circle key={i} cx={x * 30 + 15} cy={y * 30 + 15} r={on ? 8 : 0} fill={(i * 37) % 11 === 0 ? PU.magenta : PU.cyan} opacity={on ? 0.9 : 0} />;
          })}
        </svg>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, opacity: lp, transform: `translateY(${(1 - lp) * 14}px)` }}>
          <Num v={b.count * prog(t, b.at - 0.5, 1.0, PU.ease.out)} size={96} color={PU.cyan} prefix="≈" />
          <Txt size={52}>{b.label}</Txt>
        </div>
      </div>
    </Float>
  );
};

// ── bars from a zero baseline ──
const Bars: React.FC<{ b: Extract<PulseBeat, { kind: "bars" }> }> = ({ b }) => {
  const { t } = useNow();
  const max = Math.max(...b.bars.map((x) => x.value));
  const unit = 300 / max;
  return (
    <Float first={b.bars[0].at} h={700} y={1060}>
      <div style={{ position: "relative", width: 760, height: 700 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, height: 4, background: PU.dim, opacity: prog(t, b.bars[0].at - 0.3, 0.3) }} />
        {b.bars.map((x, i) => {
          const show = prog(t, x.at - 0.3, 0.3, PU.ease.out);
          const g = prog(t, x.at, 0.7, PU.ease.out);
          const h = x.value * unit * g;
          const col = x.down ? PU.magenta : PU.cyan;
          const left = b.bars.length === 1 ? 280 : 90 + i * 380;
          return (
            <div key={i} style={{ position: "absolute", left, width: 200, top: 0, height: 700, opacity: show }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: x.down ? 384 : 380 - h, height: h, background: `linear-gradient(${x.down ? 180 : 0}deg, ${col}, ${x.down ? PU.magentaSoft : PU.cyanSoft})`, boxShadow: `0 0 30px ${col}`, borderRadius: x.down ? "0 0 14px 14px" : "14px 14px 0 0" }} />
              <div style={{ position: "absolute", left: -60, right: -60, textAlign: "center", top: x.down ? 384 + h + 14 : 380 - h - 110 }}>
                <Num v={x.value * g} size={92} color={col} prefix={x.down ? "−" : "+"} suffix="%" />
              </div>
              <div style={{ position: "absolute", left: -80, right: -80, textAlign: "center", top: x.down ? 300 : 400 }}>
                <Txt size={46} color={PU.white}>{x.label}</Txt>
              </div>
            </div>
          );
        })}
      </div>
    </Float>
  );
};

// ── glyph: giant glitching character ──
const Glyph: React.FC<{ b: Extract<PulseBeat, { kind: "glyph" }> }> = ({ b }) => {
  const { t } = useNow();
  const k = t - b.at;
  const j = k >= 0 && k < 0.3 ? Math.sin(k * 140) * 14 : 0;
  const s = interpolate(t, [b.at - 0.05, b.at + 0.1, b.at + 0.25], [1.4, 0.95, 1], cl);
  return (
    <Float first={b.at} h={460}>
      <div style={{ position: "relative", transform: `scale(${s})` }}>
        <Txt size={360} color={PU.magenta} style={{ position: "absolute", left: j, top: 0, opacity: 0.7, mixBlendMode: "screen" }}>{b.text}</Txt>
        <Txt size={360} color={PU.cyan} style={{ position: "absolute", left: -j, top: 0, opacity: 0.7, mixBlendMode: "screen" }}>{b.text}</Txt>
        <Txt size={360} color={PU.white} style={{ position: "relative", filter: glow(PU.cyan, 24) }}>{b.text}</Txt>
      </div>
    </Float>
  );
};

// ── key: keyboard key pressed → result chip ──
const Key: React.FC<{ b: Extract<PulseBeat, { kind: "key" }> }> = ({ b }) => {
  const { t } = useNow();
  const down = interpolate(t, [b.pressAt - 0.06, b.pressAt, b.pressAt + 0.16], [0, 1, 0], cl);
  const r = prog(t, b.result.at - 0.05, 0.35, PU.ease.out);
  const lit = t >= b.pressAt;
  return (
    <Float first={b.pressAt - 0.9} h={500}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        <div style={{ position: "relative", width: 380, height: 210 }}>
          <div style={{ position: "absolute", inset: 0, top: 22, borderRadius: 36, background: "#0B1220" }} />
          <div style={{ position: "absolute", inset: 0, bottom: 22 - down * 18, top: down * 18, borderRadius: 36, background: lit ? PU.cyan : "#16233A", border: `3px solid ${lit ? PU.cyan : PU.faint}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: lit ? `0 0 50px ${PU.cyan}` : "none" }}>
            <Txt size={84} color={lit ? PU.bg : PU.white}>{b.key}</Txt>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 34px", borderRadius: 999, border: `2px solid ${PU.cyan}`, background: PU.cyanSoft, opacity: r, transform: `translateY(${(1 - r) * 20}px) scale(${0.9 + 0.1 * r})` }}>
          <Icon name="check" size={52} color={PU.cyan} strokeWidth={3} />
          <Txt size={54}>{b.result.text}</Txt>
        </div>
      </div>
    </Float>
  );
};

// ── sleep: brain dims (Zzz) while the AI chip lights up ──
const Sleep: React.FC<{ b: Extract<PulseBeat, { kind: "sleep" }> }> = ({ b }) => {
  const { t } = useNow();
  const bp = prog(t, b.brainAt - 0.2, 0.35, PU.ease.out);
  const dim = prog(t, b.brainAt + 0.2, 0.6, PU.ease.inOut);
  const cp = prog(t, b.chipAt - 0.2, 0.35, PU.ease.out);
  const pulse = 0.6 + 0.4 * Math.sin(t * 9);
  return (
    <Float first={b.brainAt - 0.2} h={460}>
      <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 90 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: bp, position: "relative" }}>
          <div style={{ opacity: 1 - dim * 0.65, filter: `grayscale(${dim})` }}><Icon name="brain" size={230} color={PU.cyan} strokeWidth={1.6} /></div>
          {[0, 1, 2].map((i) => {
            const z = ((t - b.brainAt) * 0.8 + i / 3) % 1;
            return <Txt key={i} size={44 + i * 10} color={PU.dim} style={{ position: "absolute", top: -20 - z * 120, left: 200 + i * 26, opacity: dim * (1 - z) }}>z</Txt>;
          })}
          <Txt size={50} color={PU.dim}>{b.brain}</Txt>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: cp, transform: `scale(${0.9 + 0.1 * cp})` }}>
          <div style={{ width: 210, height: 210, borderRadius: 34, border: `6px solid ${PU.magenta}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 ${40 * pulse}px ${PU.magenta}`, position: "relative" }}>
            {[0, 1, 2, 3].map((k) => (
              <React.Fragment key={k}>
                <div style={{ position: "absolute", top: 40 + k * 40, left: -34, width: 30, height: 6, background: PU.magenta }} />
                <div style={{ position: "absolute", top: 40 + k * 40, right: -34, width: 30, height: 6, background: PU.magenta }} />
              </React.Fragment>
            ))}
            <Txt size={88} color={PU.magenta} style={{ direction: "ltr" }}>AI</Txt>
          </div>
          <Txt size={50} color={PU.white}>{b.chip}</Txt>
        </div>
      </div>
    </Float>
  );
};

// ── steps: N slots lighting in turn ──
const Steps: React.FC<{ b: Extract<PulseBeat, { kind: "steps" }> }> = ({ b }) => {
  const { t } = useNow();
  const lp = prog(t, b.at, 0.3, PU.ease.out);
  return (
    <Float first={b.at - 0.1} h={380}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div dir="rtl" style={{ display: "flex", gap: 34 }}>
          {Array.from({ length: b.n }).map((_, i) => {
            const p = prog(t, b.at + i * 0.18, 0.3, PU.ease.out);
            return (
              <div key={i} style={{ width: 180, height: 180, borderRadius: 30, border: `5px solid ${PU.cyan}`, background: PU.cyanSoft, display: "flex", alignItems: "center", justifyContent: "center", opacity: p, transform: `translateY(${(1 - p) * 30}px)`, boxShadow: `0 0 34px ${PU.cyanSoft}` }}>
                <Num v={i + 1} size={110} color={PU.cyan} />
              </div>
            );
          })}
        </div>
        <Txt size={60} style={{ opacity: lp }}>{b.label}</Txt>
      </div>
    </Float>
  );
};

// ── timer: countdown ring ──
const Timer: React.FC<{ b: Extract<PulseBeat, { kind: "timer" }> }> = ({ b }) => {
  const { t, to } = useNow();
  const total = b.minutes * 60;
  const run = interpolate(t, [b.at, to], [0, 1], cl);
  const secs = Math.max(0, total - run * 75); // visibly ticks while he talks
  const mm = String(Math.floor(secs / 60)).padStart(2, "0"), ss = String(Math.floor(secs % 60)).padStart(2, "0");
  const R = 170, C = 2 * Math.PI * R;
  const lp = b.label ? prog(t, b.label.at - 0.05, 0.3, PU.ease.out) : 0;
  const lk = b.lockAt !== undefined ? prog(t, b.lockAt - 0.05, 0.3, PU.ease.out) : 0;
  return (
    <Float first={b.at} h={560}>
      <div style={{ display: "flex", alignItems: "center", gap: 60 }} dir="rtl">
        <div style={{ position: "relative", width: 2 * R + 40, height: 2 * R + 40 }}>
          <svg width={2 * R + 40} height={2 * R + 40} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
            <circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke={PU.faint} strokeWidth={14} />
            <circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke={PU.cyan} strokeWidth={14} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - secs / total)} style={{ filter: glow(PU.cyan, 12) }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span dir="ltr" style={{ fontFamily: PU.font, fontWeight: 800, fontSize: 110, color: PU.white, fontVariantNumeric: "tabular-nums" }}>{mm}:{ss}</span>
            {b.label ? <Txt size={44} color={PU.cyan} style={{ opacity: lp }}>{b.label.text}</Txt> : null}
          </div>
        </div>
        {b.lockAt !== undefined ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: lk, transform: `scale(${0.9 + 0.1 * lk})` }}>
            <div style={{ width: 150, height: 150, borderRadius: 40, border: `5px solid ${PU.magenta}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="lock" size={84} color={PU.magenta} strokeWidth={2.4} />
            </div>
            <Txt size={42} color={PU.magenta}>{b.lock}</Txt>
          </div>
        ) : null}
      </div>
    </Float>
  );
};

// ── chat window ──
const Chat: React.FC<{ b: Extract<PulseBeat, { kind: "chat" }> }> = ({ b }) => {
  const { t } = useNow();
  const words = b.text.split(" ");
  const dur = b.dur ?? 0.6;
  const n = b.mode === "typing" ? Math.ceil(interpolate(t, [b.at, b.at + dur], [0, words.length], cl)) : words.length;
  const st = b.strikeAt !== undefined ? prog(t, b.strikeAt, 0.3, PU.ease.inOut) : 0;
  const blocked = b.mode === "blocked" && t >= (b.strikeAt ?? 1e9);
  const caret = Math.floor(t * 2.6) % 2 === 0 && n < words.length;
  return (
    <Float first={b.at - 0.2} h={420} w={900}>
      <div dir="rtl" style={{ width: 860, borderRadius: 30, border: `2px solid ${blocked ? PU.magenta : PU.faint}`, background: "rgba(8,14,26,0.9)", padding: "26px 34px 30px", boxShadow: blocked ? `0 0 40px ${PU.magentaSoft}` : `0 0 40px ${PU.cyanSoft}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <div style={{ width: 16, height: 16, borderRadius: 16, background: PU.cyan, boxShadow: `0 0 12px ${PU.cyan}` }} />
          <Txt size={34} color={PU.dim} weight={500}>{b.tag ?? "رسالتك للذكاء الاصطناعي"}</Txt>
        </div>
        <div style={{ position: "relative", display: "inline-block", maxWidth: "100%" }}>
          <div style={{ fontFamily: PU.font, fontWeight: 800, fontSize: 54, lineHeight: 1.5, color: blocked ? PU.dim : PU.white, whiteSpace: "normal" }}>
            {words.slice(0, n).join(" ")}
            {caret ? <span style={{ color: PU.cyan }}>|</span> : null}
          </div>
          {b.mode === "blocked" ? <div style={{ position: "absolute", top: "50%", right: -10, height: 8, width: `${st * 104}%`, background: PU.magenta, borderRadius: 8, boxShadow: `0 0 16px ${PU.magenta}`, transform: "rotate(-2deg)" }} /> : null}
        </div>
        {blocked ? (
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12, opacity: st }}>
            <Icon name="x" size={44} color={PU.magenta} strokeWidth={3.2} />
            <Txt size={42} color={PU.magenta}>لا تطلب الحل كامل</Txt>
          </div>
        ) : null}
      </div>
    </Float>
  );
};

// ── calendar flip ──
const Calendar: React.FC<{ b: Extract<PulseBeat, { kind: "calendar" }> }> = ({ b }) => {
  const { t, from } = useNow();
  const f = prog(t, b.flipAt - 0.1, 0.5, PU.ease.inOut);
  const label = f < 0.5 ? b.today : b.tomorrow;
  return (
    <Float first={from} h={520}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ width: 330, borderRadius: 34, overflow: "hidden", border: `3px solid ${PU.cyan}`, boxShadow: `0 0 40px ${PU.cyanSoft}`, background: "rgba(8,14,26,0.92)" }}>
          <div style={{ height: 64, background: PU.cyan, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="calendar" size={42} color={PU.bg} strokeWidth={2.6} /></div>
          <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotateX(${Math.sin(f * Math.PI) * 80}deg)` }}>
            <Txt size={84} color={f >= 0.5 ? PU.cyan : PU.white}>{label}</Txt>
          </div>
        </div>
        <div dir="rtl" style={{ display: "flex", gap: 20 }}>
          {(b.chips ?? []).map((c, i) => {
            const p = prog(t, c.at - 0.05, 0.3, PU.ease.out);
            return <div key={i} style={{ padding: "10px 28px", borderRadius: 999, border: `2px solid ${PU.cyan}`, background: PU.cyanSoft, opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}><Txt size={46}>{c.text}</Txt></div>;
          })}
        </div>
      </div>
    </Float>
  );
};

// ── outcome ──
const Outcome: React.FC<{ b: Extract<PulseBeat, { kind: "outcome" }> }> = ({ b }) => {
  const { t } = useNow();
  return (
    <Float first={b.items[0].at - 0.1} h={420}>
      <div dir="rtl" style={{ display: "flex", gap: 60 }}>
        {b.items.map((x, i) => {
          const p = prog(t, x.at - 0.08, 0.3, PU.ease.out);
          const c = x.good ? PU.cyan : PU.magenta;
          const s = interpolate(t, [x.at - 0.08, x.at + 0.1, x.at + 0.28], [1.3, 0.96, 1], cl);
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, opacity: p, transform: `scale(${s})` }}>
              <div style={{ width: 200, height: 200, borderRadius: 200, border: `7px solid ${c}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 44px ${c}`, background: x.good ? PU.cyanSoft : PU.magentaSoft }}>
                <Icon name={x.icon ?? (x.good ? "check" : "x")} size={120} color={c} strokeWidth={3} />
              </div>
              <Txt size={58} color={c}>{x.text}</Txt>
            </div>
          );
        })}
      </div>
    </Float>
  );
};

// ── cta ──
const Cta: React.FC<{ b: Extract<PulseBeat, { kind: "cta" }> }> = ({ b }) => {
  const { t } = useNow();
  return (
    <Float first={b.items[0].at - 0.1} h={340}>
      <div dir="rtl" style={{ display: "flex", gap: 40 }}>
        {b.items.map((x, i) => {
          const p = prog(t, x.at - 0.08, 0.3, PU.ease.out);
          const press = interpolate(t, [x.at + 0.3, x.at + 0.4, x.at + 0.55], [1, 0.9, 1], cl);
          const on = t >= x.at + 0.38;
          return (
            <div key={i} style={{ width: 300, height: 260, borderRadius: 40, border: `4px solid ${PU.cyan}`, background: on ? PU.cyan : "rgba(8,14,26,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, opacity: p, transform: `translateY(${(1 - p) * 26}px) scale(${press})`, boxShadow: on ? `0 0 60px ${PU.cyan}` : "none" }}>
              <Icon name={x.icon} size={100} color={on ? PU.bg : PU.cyan} strokeWidth={2.4} />
              <Txt size={56} color={on ? PU.bg : PU.white}>{x.text}</Txt>
            </div>
          );
        })}
      </div>
    </Float>
  );
};

export const PulseBeatView: React.FC<{ b: PulseBeat }> = ({ b }) => {
  switch (b.kind) {
    case "chart": return <Chart b={b} />;
    case "crowd": return <Crowd b={b} />;
    case "bars": return <Bars b={b} />;
    case "glyph": return <Glyph b={b} />;
    case "key": return <Key b={b} />;
    case "sleep": return <Sleep b={b} />;
    case "steps": return <Steps b={b} />;
    case "timer": return <Timer b={b} />;
    case "chat": return <Chat b={b} />;
    case "calendar": return <Calendar b={b} />;
    case "outcome": return <Outcome b={b} />;
    case "cta": return <Cta b={b} />;
  }
};

/** First moment each beat shows content (used by the checker). */
export const pulseFirst = (b: PulseBeat): number => {
  switch (b.kind) {
    case "chart": return b.points[0].at;
    case "crowd": return b.at - 0.5;
    case "bars": return b.bars[0].at;
    case "glyph": return b.at;
    case "key": return b.pressAt - 0.9;
    case "sleep": return b.brainAt - 0.2;
    case "steps": return b.at;
    case "timer": return b.at;
    case "chat": return b.at;
    case "calendar": return b.from;
    case "outcome": return b.items[0].at;
    case "cta": return b.items[0].at;
  }
};
