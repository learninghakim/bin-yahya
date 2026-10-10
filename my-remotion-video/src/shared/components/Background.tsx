import { AbsoluteFill, useCurrentFrame } from "remotion";
import { baseTheme as theme } from "../theme";
import { chalkDust } from "./textures";

/** Navy chalkboard: gradient base, drifting light pools, chalk dust and smudges. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 60) * 60;
  const d2 = Math.cos(frame / 75) * 50;
  const { colors } = theme;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 75% at 50% 42%, ${colors.bgLift} 0%, ${colors.bg} 52%, ${colors.bgDeep} 100%)`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          top: -420,
          left: -380 + d1,
          filter: "blur(60px)",
          background: `radial-gradient(circle, ${colors.teal}2a, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          bottom: -380,
          right: -420 - d2,
          filter: "blur(70px)",
          background: `radial-gradient(circle, ${colors.yellow}14, transparent 64%)`,
        }}
      />
      {/* Erased-chalk smudges */}
      {[
        { x: 120, y: 300, w: 620, h: 180, r: -14 },
        { x: 480, y: 1380, w: 700, h: 200, r: 9 },
        { x: -120, y: 1050, w: 520, h: 160, r: 4 },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.x,
            top: s.y + Math.sin(frame / 90 + i) * 8,
            width: s.w,
            height: s.h,
            borderRadius: "50%",
            background: "rgba(242,240,234,0.035)",
            filter: "blur(40px)",
            transform: `rotate(${s.r}deg)`,
          }}
        />
      ))}
      <AbsoluteFill
        style={{
          backgroundImage: chalkDust,
          backgroundSize: "300px",
          mixBlendMode: "screen",
          opacity: 0.09,
        }}
      />
    </AbsoluteFill>
  );
};
