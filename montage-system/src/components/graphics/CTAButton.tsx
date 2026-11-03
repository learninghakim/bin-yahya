import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, springs } from "../../theme/theme";
import { useColors } from "../../theme/ThemeContext";
import { isRTL } from "../../system/time";
import { useBreathe, useExit } from "../motion/motion";
import { Icon } from "./Icon";
import { IconName } from "./icons";

/**
 * Hero-colored call-to-action pill: pops in, glows, gets "tapped" by a cursor
 * ripple at `tapAt`, then breathes. This is the ONE glowing element in its frame.
 *
 * @example
 * <CTAButton label="احفظ الفيديو" icon="bookmark" tapAt={30} />
 */
export const CTAButton: React.FC<{
  label: string;
  icon?: IconName;
  delay?: number;
  tapAt?: number; // frame of the tap animation (omit for none)
  size?: number;
}> = ({ label, icon = "arrow", delay = 0, tapAt, size = 60 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useColors();
  const p = spring({ frame: frame - delay, fps, config: springs.bouncy });
  const x = useExit();
  const b = useBreathe(0.8);
  const tap = tapAt === undefined ? 0 : spring({ frame: frame - tapAt, fps, config: springs.snappy });
  const press = tapAt === undefined ? 1 : 1 - 0.08 * Math.sin(Math.min(tap, 1) * Math.PI);
  const ripple = tapAt === undefined ? 0 : interpolate(frame, [tapAt, tapAt + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rtl = isRTL(label);
  return (
    <div style={{ position: "relative", opacity: Math.min(p, 1) * (1 - x), transform: `translateY(${b.y + 20 * x}px) scale(${p * press * b.scale})` }}>
      <div
        dir={rtl ? "rtl" : "ltr"}
        style={{
          position: "relative", display: "flex", alignItems: "center", gap: size * 0.35, padding: `${size * 0.42}px ${size * 0.9}px`,
          borderRadius: 999, background: c.hero, color: c.heroInk, fontFamily: fonts.display, fontWeight: 900, fontSize: size,
          boxShadow: `0 0 60px ${c.hero}66, 0 0 120px ${c.hero}33, 0 24px 40px -16px ${c.shadow}`, overflow: "hidden",
        }}
      >
        <span>{label}</span>
        <div style={{ transform: rtl ? "scaleX(-1)" : undefined }}>
          <Icon name={icon} size={size * 0.9} color={c.heroInk} strokeWidth={2.8} drawAt={delay + 8} />
        </div>
        {ripple > 0 && ripple < 1 ? (
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 40, height: 40, marginLeft: -20, marginTop: -20, borderRadius: "50%", background: c.paper, opacity: 0.5 * (1 - ripple), transform: `scale(${1 + ripple * 18})` }} />
        ) : null}
      </div>
    </div>
  );
};
