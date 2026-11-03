import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, type as T } from "../../theme/theme";
import { useColors } from "../../theme/ThemeContext";

/**
 * Animated number (tabular digits so it never jitters).
 *
 * @example
 * <Counter to={87} suffix="%" delay={5} />
 */
export const Counter: React.FC<{ to: number; from?: number; decimals?: number; prefix?: string; suffix?: string; delay?: number; size?: number; hero?: boolean }> = ({
  to, from = 0, decimals = 0, prefix = "", suffix = "", delay = 0, size = T.hero * 1.4, hero = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useColors();
  const p = spring({ frame: frame - delay, fps, config: { damping: 30, stiffness: 60 } });
  const v = interpolate(p, [0, 1], [from, to]);
  return (
    <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: size, lineHeight: 1, color: hero ? c.hero : c.paper, fontVariantNumeric: "tabular-nums", direction: "ltr", opacity: Math.min(1, p * 3), textShadow: hero ? `0 0 50px ${c.hero}55` : undefined }}>
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </div>
  );
};
