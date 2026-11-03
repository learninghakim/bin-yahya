import React from "react";
import { fonts, type as T } from "../../theme/theme";
import { useColors } from "../../theme/ThemeContext";
import { useSpringIn, useExit } from "../motion/motion";

/**
 * Small pill label ("نصيحة #1", "خطأ شائع", "NEW").
 *
 * @example
 * <Tag text="خطأ شائع" tone="danger" />
 */
export const Tag: React.FC<{ text: string; tone?: "accent" | "danger" | "success" | "paper"; delay?: number }> = ({ text, tone = "accent", delay = 0 }) => {
  const c = useColors();
  const p = useSpringIn(delay, "bouncy");
  const x = useExit();
  const bg = { accent: c.accent, danger: c.danger, success: c.success, paper: c.paper }[tone];
  return (
    <div style={{ display: "inline-block", padding: "8px 26px", borderRadius: 999, background: bg, color: c.ink, fontFamily: fonts.display, fontWeight: 900, fontSize: T.label, opacity: Math.min(p, 1) * (1 - x), transform: `scale(${p * (1 - 0.2 * x)})` }}>
      {text}
    </div>
  );
};
