import React from "react";
import { useColors } from "../../theme/ThemeContext";

/**
 * Translucent rounded card that keeps text readable over footage.
 *
 * @example
 * <GlassCard padding={40}><TextReveal text="..." /></GlassCard>
 */
export const GlassCard: React.FC<{
  padding?: number;
  radius?: number;
  solid?: boolean; // opaque ink instead of glass
  accentEdge?: boolean; // thin accent line on the leading edge
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ padding = 40, radius = 36, solid = false, accentEdge = false, style, children }) => {
  const c = useColors();
  return (
    <div
      style={{
        position: "relative",
        padding,
        borderRadius: radius,
        background: solid ? c.ink : c.glass,
        backdropFilter: "blur(18px)",
        border: `1.5px solid ${c.glassBorder}`,
        boxShadow: `0 30px 70px -20px ${c.shadow}`,
        overflow: "hidden",
        ...style,
      }}
    >
      {accentEdge ? (
        <div style={{ position: "absolute", insetInlineStart: 0, top: 0, bottom: 0, width: 8, background: c.accent }} />
      ) : null}
      {children}
    </div>
  );
};
