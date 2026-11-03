// Full-frame moments of the Signal style: Stage, HookCam, Burst, Slam.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Icon } from "../../components/graphics/Icon";
import { IconName } from "../../components/graphics/icons";
import { S } from "./tokens";
import { enter, prog, useNow, useSceneVis } from "./clock";
import { Chip, Chips } from "./widgets/Chips";

export type TimedWord = { text: string; at: number };

/** Display words that land one by one at their spoken time; highlighted ones in lime. */
const DisplayWords: React.FC<{ words: TimedWord[]; highlight?: string[]; size: number; stroke?: boolean; maxWidth?: number }> = ({ words, highlight = [], size, stroke = true, maxWidth = 900 }) => {
  const { t } = useNow();
  const latin = words.every((w) => !/[\u0600-\u06FF]/.test(w.text));
  return (
    <div dir={latin ? "ltr" : "rtl"} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: size * 0.22, rowGap: 0, maxWidth, lineHeight: 1.15 }}>
      {words.map((w, i) => {
        const p = prog(t, w.at - 0.06, 0.28);
        const hl = highlight.includes(w.text);
        return (
          <span
            key={i}
            style={{
              display: "inline-block", fontFamily: S.font.display, fontSize: size, color: hl ? S.color.lime : S.color.text,
              WebkitTextStroke: stroke ? `${Math.round(size * 0.06)}px ${S.color.ink}` : undefined, paintOrder: "stroke fill",
              textShadow: "0 8px 30px rgba(0,0,0,0.45)",
              opacity: p, transform: `translateY(${(1 - p) * size * 0.25}px) scale(${1.12 - 0.12 * p})`, filter: `blur(${(1 - p) * 8}px)`,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

/**
 * HOOK CAM — camera viewfinder (corner brackets + REC pill + running timecode) over the speaker,
 * with the hook words landing on the chest as they are said.
 *
 * @example
 * <HookCam words={[{ text: "مذاكرتك", at: 0.65 }, { text: "سهلة", at: 1.34 }]} highlight={["سهلة"]} />
 */
export const HookCam: React.FC<{ words: TimedWord[]; highlight?: string[]; y?: number }> = ({ words, highlight, y = 1010 }) => {
  const { t, from } = useNow();
  const { inn, out } = useSceneVis();
  const corner = (pos: React.CSSProperties, rot: number) => (
    <div style={{ position: "absolute", width: 90, height: 90, borderTop: `5px solid ${S.color.text}`, borderRight: `5px solid ${S.color.text}`, borderTopRightRadius: 18, transform: `rotate(${rot}deg)`, opacity: 0.9, ...pos }} />
  );
  const inset = 70 - 30 * (1 - inn);
  const secs = Math.max(0, t - from);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      {corner({ top: 170 + inset * 0, right: inset }, 0)}
      {corner({ top: 170, left: inset }, -90)}
      {corner({ bottom: 400, right: inset }, 90)}
      {corner({ bottom: 400, left: inset }, 180)}
      <div style={{ position: "absolute", top: 180, left: 0, right: 0, display: "flex", justifyContent: "center", ...enter(inn, 0, -10) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 26px", borderRadius: 999, background: S.color.panel, border: `1.5px solid ${S.color.line}`, fontFamily: S.font.ui, fontWeight: 700, fontSize: 28, color: S.color.text, direction: "ltr" }}>
          <span style={{ width: 14, height: 14, borderRadius: 14, background: S.color.danger, opacity: Math.floor(t * 2) % 2 ? 0.35 : 1 }} />
          REC
          <span style={{ fontVariantNumeric: "tabular-nums", color: S.color.dim, fontWeight: 500 }}>00:{secs.toFixed(0).padStart(2, "0")}</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: y, left: 60, right: 60, display: "flex", justifyContent: "center", transform: "translateY(-50%)" }}>
        <DisplayWords words={words} highlight={highlight} size={132} />
      </div>
    </AbsoluteFill>
  );
};

/**
 * BURST — an icon detonates on the chest: lime rays spin out, two rings expand, then a big word lands.
 *
 * @example
 * <Burst icon="zap" at={2.42} words={[{ text: "أصدمك", at: 3.28 }]} />
 */
export const Burst: React.FC<{ icon: IconName; at: number; words?: TimedWord[]; highlight?: string[]; y?: number }> = ({ icon, at, words = [], highlight, y = 1020 }) => {
  const { t } = useNow();
  const { out } = useSceneVis();
  const p = prog(t, at, 0.4);
  const rays = 12;
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: `blur(${out * 8}px)` }}>
      <div style={{ position: "absolute", left: 540, top: y - 90, width: 0, height: 0 }}>
        {[0, 1].map((k) => {
          const r = prog(t, at + k * 0.12, 0.9, S.ease.out);
          return <div key={k} style={{ position: "absolute", left: -110, top: -110, width: 220, height: 220, borderRadius: 220, border: `3px solid ${S.color.lime}`, opacity: (1 - r) * 0.9, transform: `scale(${0.6 + r * 1.6})` }} />;
        })}
        <div style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${interpolate(t - at, [0, 3], [-40, 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}deg)` }}>
          {Array.from({ length: rays }).map((_, i) => {
            const rp = prog(t, at + i * 0.015, 0.35);
            return <div key={i} style={{ position: "absolute", left: -7, top: 0, width: 14, height: 120 * rp, borderRadius: 14, background: S.color.lime, transformOrigin: "50% 0%", transform: `rotate(${(360 / rays) * i}deg) translateY(${70 * rp}px)` }} />;
          })}
        </div>
        <div style={{ position: "absolute", left: -66, top: -66, width: 132, height: 132, borderRadius: 40, background: S.color.panelSolid, border: `3px solid ${S.color.lime}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: p, transform: `scale(${0.85 + 0.15 * p})` }}>
          <Icon name={icon} size={72} color={S.color.lime} strokeWidth={2.4} />
        </div>
      </div>
      {words.length ? (
        <div style={{ position: "absolute", top: y + 170, left: 60, right: 60, display: "flex", justifyContent: "center" }}>
          <DisplayWords words={words} highlight={highlight} size={120} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/**
 * STAGE — the footage steps away: full-screen graphite with a soft lime glow, an icon tile,
 * a title whose words land when said, and chips. Captions stay at the bottom.
 *
 * @example
 * <Stage icon="book" title={[{ text: "Make", at: 10.3 }, …]} chips={[…]} />
 */
export const Stage: React.FC<{ icon?: IconName; label?: { text: string; at: number }; title: TimedWord[]; highlight?: string[]; chips?: Chip[] }> = ({ icon, label, title, highlight, chips }) => {
  const { t, from } = useNow();
  const { inn, out } = useSceneVis();
  const bgA = interpolate(t, [from, from + 0.22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - out);
  const ip = prog(t, from + 0.1, 0.4);
  const breathe = 1 + Math.sin(t * 2.2) * 0.012;
  return (
    <AbsoluteFill style={{ opacity: bgA }}>
      <AbsoluteFill style={{ background: S.color.bg }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 40% at 50% 46%, ${S.color.limeSoft}, transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(${S.color.faint} 1.5px, transparent 1.5px)`, backgroundSize: "48px 48px", opacity: 0.35, maskImage: "radial-gradient(ellipse at 50% 45%, black 20%, transparent 70%)" }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 34, paddingBottom: 260, ...enter(inn, out, 18) }}>
        {icon ? (
          <div style={{ width: 170, height: 170, borderRadius: 46, background: S.color.panelSolid, border: `3px solid ${S.color.lime}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 80px ${S.color.limeSoft}`, opacity: ip, transform: `scale(${(0.9 + 0.1 * ip) * breathe})` }}>
            <Icon name={icon} size={92} color={S.color.lime} strokeWidth={2.2} drawAt={undefined} />
          </div>
        ) : null}
        {label ? <div style={{ fontFamily: S.font.ui, fontWeight: 500, fontSize: 34, color: S.color.dim, opacity: prog(t, label.at, 0.3) }}>{label.text}</div> : null}
        <DisplayWords words={title} highlight={highlight} size={118} stroke={false} />
        {chips?.length ? <div style={{ maxWidth: 900 }}><Chips chips={chips} size={36} /></div> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * SLAM — big display words land above the head (scale-down + de-blur), small label above them.
 *
 * @example
 * <Slam label={{ text: "بعدما قرأت الكتاب", at: 32.8 }} words={[{ text: "تغيّر", at: 34.07 }, …]} highlight={["كل"]} />
 */
export const Slam: React.FC<{ words: TimedWord[]; label?: { text: string; at: number }; highlight?: string[]; y?: number }> = ({ words, label, highlight, y = S.layout.topTextY }) => {
  const { t } = useNow();
  const { out } = useSceneVis();
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: `blur(${out * 8}px)` }}>
      <div style={{ position: "absolute", top: y, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        {label ? <div style={{ fontFamily: S.font.ui, fontWeight: 600, fontSize: 34, color: S.color.text, textShadow: "0 2px 10px rgba(0,0,0,0.6)", opacity: prog(t, label.at, 0.3) }}>{label.text}</div> : null}
        <div dir="rtl" style={{ display: "flex", gap: 30 }}>
          {words.map((w, i) => {
            const p = prog(t, w.at - 0.04, 0.26);
            const hl = highlight?.includes(w.text);
            return (
              <span key={i} style={{ fontFamily: S.font.display, fontSize: 150, lineHeight: 1.05, color: hl ? S.color.lime : S.color.text, WebkitTextStroke: `9px ${S.color.ink}`, paintOrder: "stroke fill", textShadow: "0 10px 40px rgba(0,0,0,0.5)", opacity: p, transform: `scale(${1.35 - 0.35 * p})`, filter: `blur(${(1 - p) * 10}px)` }}>
                {w.text}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
