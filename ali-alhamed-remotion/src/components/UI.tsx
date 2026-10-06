import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { F } from "../data/timing";
import { glowText, theme } from "../theme";
import { enterStyle, useLife } from "./anim";

/* ---------------- Typography ---------------- */

/** Arabic text block — RTL, animated as ONE unit (letters never split). */
export const Ar: React.FC<{
  children: React.ReactNode;
  size?: number;
  weight?: number;
  color?: string;
  font?: "display" | "body";
  glow?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 48, weight = 800, color = theme.colors.text, font = "display", glow, style }) => (
  <div
    dir="rtl"
    style={{
      fontFamily: font === "display" ? theme.fonts.display : theme.fonts.body,
      fontSize: size,
      fontWeight: weight,
      color,
      lineHeight: 1.25,
      whiteSpace: "nowrap",
      textShadow: glow ? glowText(glow) : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Numbers / Latin — kept LTR in an isolated span so order never flips. */
export const Num: React.FC<{
  children: React.ReactNode;
  size?: number;
  weight?: number;
  color?: string;
  glow?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 64, weight = 900, color = theme.colors.text, glow, style }) => (
  <span
    dir="ltr"
    style={{
      unicodeBidi: "isolate",
      display: "inline-block",
      fontFamily: theme.fonts.display,
      fontSize: size,
      fontWeight: weight,
      color,
      lineHeight: 1.05,
      letterSpacing: "-0.01em",
      fontVariantNumeric: "tabular-nums",
      textShadow: glow ? glowText(glow) : undefined,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </span>
);

/** Animated counter (eased, clamped), formatted with thousands separators. */
export const Counter: React.FC<{
  from?: number;
  to: number;
  startSec: number;
  durSec?: number;
  size?: number;
  color?: string;
  glow?: number;
  prefix?: string;
  suffix?: string;
}> = ({ from = 0, to, startSec, durSec = 0.7, size = 64, color, glow, prefix = "", suffix = "" }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [F(startSec), F(startSec + durSec)], [from, to], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Num size={size} color={color} glow={glow}>
      {prefix}
      {Math.round(v).toLocaleString("en-US")}
      {suffix}
    </Num>
  );
};

/* ---------------- Surfaces ---------------- */

export const Card: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  style?: React.CSSProperties;
  pad?: number;
}> = ({ children, active, style, pad = 28 }) => (
  <div
    style={{
      background: theme.colors.card,
      border: `1.5px solid ${active ? "rgba(255,26,108,0.75)" : theme.colors.border}`,
      borderRadius: theme.radius.card,
      padding: pad,
      boxShadow: active
        ? `0 0 0 1px rgba(255,26,108,0.25), 0 0 40px -6px ${theme.colors.glow}, 0 30px 60px -30px rgba(0,0,0,0.9)`
        : "0 30px 60px -30px rgba(0,0,0,0.9)",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Small pink pill label — «فكرة أساسية», «قبل», «بعد» … */
export const Kicker: React.FC<{ children: React.ReactNode; inSec: number; outSec?: number; ghost?: boolean }> = ({
  children,
  inSec,
  outSec,
  ghost,
}) => {
  const { p, o, x } = useLife(inSec, outSec);
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", ...enterStyle(p, o, { x }) }} dir="rtl">
      <div
        style={{
          padding: "6px 22px 9px",
          borderRadius: 999,
          background: ghost ? "transparent" : theme.colors.pink,
          border: ghost ? `1.5px solid ${theme.colors.pink}` : "none",
          fontFamily: theme.fonts.body,
          fontWeight: 700,
          fontSize: 26,
          color: ghost ? theme.colors.pink : "#fff",
          boxShadow: ghost ? undefined : `0 0 26px -4px ${theme.colors.glow}`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Short pink rule under headlines (as in R2/R3/R10). */
export const Rule: React.FC<{ inSec: number; width?: number; outSec?: number }> = ({ inSec, width = 90, outSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - F(inSec), fps, config: theme.spring.smooth });
  const x = outSec
    ? interpolate(frame, [F(outSec) - 5, F(outSec)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  return (
    <div
      style={{
        width: width * Math.min(1, p),
        height: 8,
        borderRadius: 4,
        background: theme.colors.pink,
        boxShadow: `0 0 18px ${theme.colors.glow}`,
        opacity: x,
      }}
    />
  );
};

/** Circle badge with an icon (pink outline) — nodes / steps / icon badges. */
export const IconBadge: React.FC<{
  children: React.ReactNode;
  size?: number;
  active?: boolean;
  dim?: boolean;
  style?: React.CSSProperties;
}> = ({ children, size = 96, active = true, dim, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      border: `${Math.max(2, size * 0.035)}px solid ${dim ? theme.colors.textMute : active ? theme.colors.pink : theme.colors.borderStrong}`,
      background: "rgba(8,8,11,0.92)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: active && !dim ? `0 0 30px -4px ${theme.colors.glow}, inset 0 0 18px rgba(255,26,108,0.18)` : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * Keyword beside the presenter (layout A). Never over the face: callers place it
 * in the free side areas. Includes a soft dark scrim for legibility.
 */
export const SideKeyword: React.FC<{
  inSec: number;
  outSec: number;
  side: "left" | "right";
  top?: number;
  children: React.ReactNode;
  width?: number;
}> = ({ inSec, outSec, side, top = 300, children, width = 520 }) => {
  const { p, o, x } = useLife(inSec, outSec);
  const dir = side === "right" ? 1 : -1;
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          [side]: 0,
          width: width + 260,
          background: `linear-gradient(${side === "right" ? "270deg" : "90deg"}, rgba(4,4,6,0.78) 0%, rgba(4,4,6,0.55) 55%, transparent 100%)`,
          opacity: o,
        }}
      />
      <div
        style={{
          position: "absolute",
          top,
          [side]: theme.safe.x,
          width,
          display: "flex",
          flexDirection: "column",
          alignItems: side === "right" ? "flex-end" : "flex-start",
          gap: 14,
          ...enterStyle(p, o, { dx: 40 * dir, x }),
        }}
      >
        {children}
      </div>
    </>
  );
};
