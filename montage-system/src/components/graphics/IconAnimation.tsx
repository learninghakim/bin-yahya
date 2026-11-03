import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useColors } from "../../theme/ThemeContext";
import { useBreathe, useExit, useSpringIn } from "../motion/motion";
import { Icon } from "./Icon";
import { IconName } from "./icons";

/**
 * Icon inside a badge: pops in (bouncy spring + rotation), draws its stroke,
 * emits one pulse ring, then breathes while on screen.
 *
 * @example
 * <IconAnimation name="bulb" size={180} tone="hero" delay={4} />
 */
export const IconAnimation: React.FC<{
  name: IconName;
  size?: number; // badge diameter in px
  delay?: number;
  tone?: "hero" | "accent" | "paper" | "danger" | "success";
  ring?: boolean;
  exit?: boolean;
}> = ({ name, size = 160, delay = 0, tone = "accent", ring = true, exit = true }) => {
  const frame = useCurrentFrame();
  const c = useColors();
  const p = useSpringIn(delay, "bouncy");
  const x = useExit();
  const b = useBreathe();
  const col = { hero: c.hero, accent: c.accent, paper: c.paper, danger: c.danger, success: c.success }[tone];
  const ringP = interpolate(frame, [delay + 4, delay + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ex = exit ? x : 0;
  return (
    <div
      style={{
        position: "relative", width: size, height: size,
        opacity: Math.min(p, 1) * (1 - ex),
        transform: `translateY(${b.y}px) scale(${p * b.scale * (1 - ex * 0.3)}) rotate(${interpolate(p, [0, 1], [-25, 0])}deg)`,
      }}
    >
      {ring ? (
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `4px solid ${col}`, opacity: 1 - ringP, transform: `scale(${1 + ringP * 0.6})` }} />
      ) : null}
      <div
        style={{
          position: "absolute", inset: 0, borderRadius: "50%", background: c.glass, border: `3px solid ${col}`,
          display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(14px)",
          boxShadow: `0 20px 50px -10px ${c.shadow}`,
        }}
      >
        <Icon name={name} size={size * 0.5} color={col} drawAt={delay + 3} />
      </div>
    </div>
  );
};
