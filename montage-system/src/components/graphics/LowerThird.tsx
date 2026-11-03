import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, springs, type as T } from "../../theme/theme";
import { useColors } from "../../theme/ThemeContext";
import { isRTL } from "../../system/time";
import { useExit } from "../motion/motion";

/**
 * Name + role tag. An accent bar grows first, then the name wipes in, then the role.
 *
 * @example
 * <LowerThird name="عبدالله المشهور" role="خبير صناعة المحتوى" />
 */
export const LowerThird: React.FC<{ name: string; role?: string; delay?: number }> = ({ name, role, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useColors();
  const x = useExit();
  const rtl = isRTL(name + (role ?? ""));
  const bar = spring({ frame: frame - delay, fps, config: springs.snappy });
  const n = spring({ frame: frame - delay - 5, fps, config: springs.smooth });
  const r = spring({ frame: frame - delay - 10, fps, config: springs.smooth });
  const wipe = (p: number) => (rtl ? `inset(0 0 0 ${(1 - p) * 100}%)` : `inset(0 ${(1 - p) * 100}% 0 0)`);
  return (
    <div dir={rtl ? "rtl" : "ltr"} style={{ display: "flex", alignItems: "stretch", gap: 22, opacity: 1 - x, transform: `translateY(${-20 * x}px)` }}>
      <div style={{ width: 10, borderRadius: 10, background: c.hero, transform: `scaleY(${bar})`, transformOrigin: "bottom" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ clipPath: wipe(n), background: c.ink, color: c.paper, padding: "10px 26px", borderRadius: 16, fontFamily: fonts.display, fontWeight: 900, fontSize: 58, transform: `translateX(${interpolate(n, [0, 1], [rtl ? 30 : -30, 0])}px)` }}>
          {name}
        </div>
        {role ? (
          <div style={{ clipPath: wipe(r), alignSelf: "flex-start", background: c.paper, color: c.ink, padding: "6px 22px", borderRadius: 12, fontFamily: fonts.body, fontWeight: 700, fontSize: T.label }}>
            {role}
          </div>
        ) : null}
      </div>
    </div>
  );
};
