// Phone beats — iOS-like interface pieces. Each piece appears only when its first item is due.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Icon } from "../../components/graphics/Icon";
import { prog, useNow, useSceneVis } from "../signal/clock";
import { PH } from "./tokens";
import type { AppTint, PhoneBeat } from "./types";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const tint = (t: AppTint) => PH[t];

const glass: React.CSSProperties = { background: PH.glass, backdropFilter: "blur(30px) saturate(1.6)", border: `1px solid ${PH.line}`, boxShadow: "0 30px 60px -24px rgba(0,0,0,0.65)" };

const T: React.FC<{ size: number; color?: string; weight?: 500 | 800; style?: React.CSSProperties; children: React.ReactNode }> = ({ size, color = PH.white, weight = 800, style, children }) => (
  <span dir="rtl" style={{ fontFamily: PH.font, fontWeight: weight, fontSize: size, color, lineHeight: 1.3, ...style }}>{children}</span>
);

/** Spring-in from slightly above (like an iOS sheet/banner), exit up + fade. */
const Slot: React.FC<{ first: number; top?: number; children: React.ReactNode }> = ({ first, top = 860, children }) => {
  const { t, from } = useNow();
  const { out } = useSceneVis();
  const p = prog(t, Math.max(from, first - 0.25), 0.4, PH.ease.spring);
  const o = prog(t, Math.max(from, first - 0.25), 0.2);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", alignItems: "center" }}>
      <div style={{ position: "absolute", top, opacity: o * (1 - out), transform: `translateY(${(1 - p) * -60 - out * 30}px) scale(${0.94 + 0.06 * p - out * 0.04})`, filter: `blur(${out * 8}px)` }}>{children}</div>
    </AbsoluteFill>
  );
};

const AppIcon: React.FC<{ glyph: string; tint: AppTint; size: number }> = ({ glyph, tint: c, size }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.23, background: `linear-gradient(160deg, ${tint(c)}, ${tint(c)}cc)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.56, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)" }}>{glyph}</div>
);

// ── notifications ──
const Notif: React.FC<{ b: Extract<PhoneBeat, { kind: "notif" }> }> = ({ b }) => {
  const { t } = useNow();
  const shown = b.items.filter((x) => t >= x.at - 0.2);
  return (
    <Slot first={b.items[0].at}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 880 }}>
        {shown.slice().reverse().map((x, i) => {
          const p = prog(t, x.at - 0.2, 0.4, PH.ease.spring);
          return (
            <div key={x.at} dir="rtl" style={{ ...glass, borderRadius: 40, padding: "24px 28px", display: "flex", gap: 22, alignItems: "center", opacity: Math.min(1, p * 2) * (i > 1 ? 0.6 : 1), transform: `translateY(${(1 - p) * -50}px) scale(${i === 0 ? 1 : 0.97})` }}>
              <AppIcon glyph={x.glyph} tint={x.tint} size={96} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <T size={32} color={PH.dim} weight={500}>{x.app}</T>
                  <T size={30} color={PH.dim} weight={500}>الآن</T>
                </div>
                <T size={46}>{x.title}</T>
                {x.body ? <T size={38} color={PH.dim} weight={500}>{x.body}</T> : null}
              </div>
            </div>
          );
        })}
      </div>
    </Slot>
  );
};

// ── payment sheet ──
const Pay: React.FC<{ b: Extract<PhoneBeat, { kind: "pay" }> }> = ({ b }) => {
  const { t } = useNow();
  const conf = b.confirmAt !== undefined ? prog(t, b.confirmAt, 0.45, PH.ease.out) : 0;
  const stop = b.stopAt !== undefined ? interpolate(t, [b.stopAt - 0.1, b.stopAt + 0.06, b.stopAt + 0.2], [0, 1.08, 1], cl) : 0;
  const R = 70, C = 2 * Math.PI * R;
  return (
    <Slot first={b.at} top={800}>
      <div dir="rtl" style={{ width: 860, borderRadius: 48, background: PH.glassLight, backdropFilter: "blur(30px)", padding: "34px 44px 40px", boxShadow: "0 40px 80px -30px rgba(0,0,0,0.7)", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, position: "relative" }}>
        <div style={{ width: 120, height: 10, borderRadius: 10, background: "rgba(0,0,0,0.15)", marginTop: -14 }} />
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
          <T size={40} color={PH.ink}>{b.merchant}</T>
          <div style={{ padding: "6px 18px", borderRadius: 14, background: PH.ink }}><T size={30}>Pay</T></div>
        </div>
        <div style={{ height: 1, width: "100%", background: "rgba(0,0,0,0.1)" }} />
        <span dir="rtl" style={{ fontFamily: PH.font, fontWeight: 800, fontSize: 120, color: PH.ink, lineHeight: 1.1 }}>{b.amount}</span>
        <div style={{ position: "relative", width: 2 * R + 20, height: 2 * R + 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={2 * R + 20} height={2 * R + 20} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
            <circle cx={R + 10} cy={R + 10} r={R} fill="none" stroke={conf > 0 ? PH.green : "rgba(0,0,0,0.12)"} strokeWidth={10} strokeDasharray={C} strokeDashoffset={conf > 0 ? C * (1 - conf) : 0} strokeLinecap="round" />
          </svg>
          {conf >= 1 ? <Icon name="check" size={90} color={PH.green} strokeWidth={3} /> : <Icon name="user" size={80} color={PH.dimInk} strokeWidth={2} />}
        </div>
        <T size={40} color={conf >= 1 ? PH.green : PH.dimInk}>{conf >= 1 ? b.done ?? "تم" : "تأكيد بالوجه"}</T>
        {b.stopAt !== undefined ? (
          <div style={{ position: "absolute", inset: 0, borderRadius: 48, display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(255,69,58,${0.18 * Math.min(1, stop)})`, opacity: Math.min(1, stop) }}>
            <div style={{ transform: `rotate(-8deg) scale(${stop})`, border: `10px solid ${PH.red}`, borderRadius: 30, padding: "6px 40px 16px", background: "rgba(255,255,255,0.92)" }}>
              <T size={110} color={PH.red}>{b.stop ?? "انتظر!"}</T>
            </div>
          </div>
        ) : null}
      </div>
    </Slot>
  );
};

// ── balance draining ──
const Balance: React.FC<{ b: Extract<PhoneBeat, { kind: "balance" }> }> = ({ b }) => {
  const { t } = useNow();
  const p = prog(t, b.at, b.dur, PH.ease.inOut);
  const v = b.start + (b.end - b.start) * p;
  const low = p > 0.6;
  const shake = p > 0.95 && p < 1 ? Math.sin(t * 90) * 6 : 0;
  return (
    <Slot first={b.at - 0.2}>
      <div dir="rtl" style={{ ...glass, width: 820, borderRadius: 44, padding: "34px 44px", display: "flex", flexDirection: "column", gap: 14, transform: `translateX(${shake}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <AppIcon glyph="🏦" tint="green" size={74} />
          <T size={40} color={PH.dim} weight={500}>{b.label}</T>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <span dir="ltr" style={{ fontFamily: PH.font, fontWeight: 800, fontSize: 130, color: low ? PH.red : PH.white, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{Math.round(v).toLocaleString("en-US")}</span>
          <T size={54} color={PH.dim}>{b.currency}</T>
        </div>
        <div style={{ height: 16, borderRadius: 16, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(v / Math.max(1, b.start)) * 100}%`, background: low ? PH.red : PH.green, borderRadius: 16 }} />
        </div>
      </div>
    </Slot>
  );
};

// ── apps on a dock (optionally the whole dock flips upside down) ──
const Apps: React.FC<{ b: Extract<PhoneBeat, { kind: "apps" }> }> = ({ b }) => {
  const { t } = useNow();
  const flip = b.flipAt !== undefined ? prog(t, b.flipAt, 0.6, PH.ease.spring) : 0;
  const shown = b.items.filter((x) => t >= x.at - 0.15);
  return (
    <Slot first={b.items[0].at} top={900}>
      <div dir="rtl" style={{ ...glass, borderRadius: 60, padding: "30px 40px", display: "flex", gap: 40, transform: `rotate(${flip * 180}deg)` }}>
        {shown.map((x) => {
          const p = prog(t, x.at - 0.15, 0.4, PH.ease.spring);
          return (
            <div key={x.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: Math.min(1, p * 2), transform: `scale(${0.5 + 0.5 * p})` }}>
              <AppIcon glyph={x.glyph} tint={x.tint} size={170} />
              <T size={40}>{x.label}</T>
            </div>
          );
        })}
      </div>
    </Slot>
  );
};

// ── Notes card ──
const Notes: React.FC<{ b: Extract<PhoneBeat, { kind: "notes" }> }> = ({ b }) => {
  const { t } = useNow();
  const words = b.line.split(" ");
  const n = Math.ceil(interpolate(t, [b.at, b.at + b.dur], [0, words.length], cl));
  const blur = b.blurAt !== undefined ? prog(t, b.blurAt, 0.6, PH.ease.inOut) : 0;
  const bl = b.blurLabel ? prog(t, b.blurLabel.at - 0.05, 0.3, PH.ease.out) : 0;
  const caret = n < words.length && Math.floor(t * 2.6) % 2 === 0;
  return (
    <Slot first={b.at - 0.15}>
      <div dir="rtl" style={{ width: 860, borderRadius: 40, overflow: "hidden", background: "#FFFDF5", boxShadow: "0 40px 80px -30px rgba(0,0,0,0.7)", position: "relative" }}>
        <div style={{ background: "#F6E7A6", padding: "18px 34px", display: "flex", alignItems: "center", gap: 14 }}>
          <T size={38} color="#8A6D00">‹ ملاحظات</T>
        </div>
        <div style={{ padding: "26px 38px 36px", display: "flex", flexDirection: "column", gap: 14 }}>
          <T size={50} color={PH.ink}>{b.title}</T>
          <div style={{ fontFamily: PH.font, fontWeight: 500, fontSize: 52, lineHeight: 1.45, color: PH.ink, filter: `blur(${blur * 9}px)`, minHeight: 150 }}>
            {words.slice(0, n).join(" ")}{caret ? <span style={{ color: PH.orange }}>|</span> : null}
          </div>
        </div>
        {b.blurLabel ? (
          <div style={{ position: "absolute", bottom: 30, left: 30, padding: "10px 26px", borderRadius: 999, background: PH.red, opacity: bl, transform: `scale(${0.85 + 0.15 * bl}) rotate(-4deg)` }}>
            <T size={42}>{b.blurLabel.text}</T>
          </div>
        ) : null}
      </div>
    </Slot>
  );
};

// ── widget tiles ──
const Tiles: React.FC<{ b: Extract<PhoneBeat, { kind: "tiles" }> }> = ({ b }) => {
  const { t } = useNow();
  const shown = b.items.filter((x) => t >= x.at - 0.15);
  return (
    <Slot first={b.items[0].at} top={900}>
      <div dir="rtl" style={{ display: "flex", gap: 26 }}>
        {shown.map((x) => {
          const p = prog(t, x.at - 0.15, 0.4, PH.ease.spring);
          return (
            <div key={x.label} style={{ ...glass, width: 270, height: 270, borderRadius: 50, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between", padding: 30, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * -40}px) scale(${0.85 + 0.15 * p})` }}>
              <AppIcon glyph={x.glyph} tint={x.tint} size={110} />
              <T size={42} style={{ whiteSpace: "nowrap" }}>{x.label}</T>
            </div>
          );
        })}
      </div>
    </Slot>
  );
};

// ── activity widget ──
const Activity: React.FC<{ b: Extract<PhoneBeat, { kind: "activity" }> }> = ({ b }) => {
  const { t } = useNow();
  const vals = [0.25, 0.4, 0.35, 0.6, 0.55, 0.8, 0.95];
  const cp = b.chip ? prog(t, b.chip.at - 0.05, 0.35, PH.ease.spring) : 0;
  return (
    <Slot first={b.at - 0.1}>
      <div dir="rtl" style={{ ...glass, width: 820, borderRadius: 44, padding: "30px 40px 34px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <T size={42}>{b.title}</T>
          <span style={{ fontSize: 40 }}>📈</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 22, height: 240, direction: "ltr" }}>
          {vals.map((v, i) => {
            const p = prog(t, b.at + i * 0.12, 0.45, PH.ease.out);
            return <div key={i} style={{ flex: 1, height: `${v * 100 * p}%`, borderRadius: 14, background: i === vals.length - 1 ? PH.green : "rgba(48,209,88,0.45)" }} />;
          })}
        </div>
        {b.chip ? (
          <div style={{ alignSelf: "flex-start", padding: "10px 26px", borderRadius: 999, background: "rgba(48,209,88,0.18)", border: `2px solid ${PH.green}`, opacity: cp, transform: `scale(${0.85 + 0.15 * cp})` }}>
            <T size={40} color={PH.green}>{b.chip.text}</T>
          </div>
        ) : null}
      </div>
    </Slot>
  );
};

// ── chat bubbles ──
const Chat: React.FC<{ b: Extract<PhoneBeat, { kind: "chat" }> }> = ({ b }) => {
  const { t } = useNow();
  const tg = b.tag ? prog(t, b.tag.at - 0.05, 0.35, PH.ease.spring) : 0;
  return (
    <Slot first={b.items[0].at - 0.5}>
      <div dir="rtl" style={{ width: 860, display: "flex", flexDirection: "column", gap: 16, position: "relative" }}>
        {b.items.map((x, i) => {
          const typing = t >= x.at - 0.5 && t < x.at;
          const p = prog(t, x.at, 0.35, PH.ease.spring);
          if (t < x.at - 0.5) return null;
          return (
            <div key={i} style={{ alignSelf: x.out ? "flex-end" : "flex-start", maxWidth: 680, padding: "20px 32px", borderRadius: 40, background: x.out ? PH.blue : "rgba(58,58,62,0.92)", transform: `scale(${typing ? 1 : 0.9 + 0.1 * p})`, transformOrigin: x.out ? "left bottom" : "right bottom" }}>
              {typing ? (
                <div style={{ display: "flex", gap: 10, padding: "8px 4px" }}>
                  {[0, 1, 2].map((k) => <div key={k} style={{ width: 18, height: 18, borderRadius: 18, background: PH.dim, opacity: 0.4 + 0.6 * Math.abs(Math.sin(t * 6 + k)) }} />)}
                </div>
              ) : (
                <T size={50}>{x.text}</T>
              )}
            </div>
          );
        })}
        {b.tag ? (
          <div style={{ alignSelf: "center", marginTop: 10, padding: "12px 34px", borderRadius: 999, background: PH.red, opacity: tg, transform: `scale(${0.8 + 0.2 * tg}) rotate(-3deg)` }}>
            <T size={46}>{b.tag.text}</T>
          </div>
        ) : null}
      </div>
    </Slot>
  );
};

export const PhoneBeatView: React.FC<{ b: PhoneBeat }> = ({ b }) => {
  switch (b.kind) {
    case "notif": return <Notif b={b} />;
    case "pay": return <Pay b={b} />;
    case "balance": return <Balance b={b} />;
    case "apps": return <Apps b={b} />;
    case "notes": return <Notes b={b} />;
    case "tiles": return <Tiles b={b} />;
    case "activity": return <Activity b={b} />;
    case "chat": return <Chat b={b} />;
  }
};
