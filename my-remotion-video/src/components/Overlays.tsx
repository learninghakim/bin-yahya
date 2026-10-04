import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { filmGrain } from "./textures";

/** Unifies every layer into one navy look. Sits above content, below grain. */
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        mixBlendMode: "soft-light",
        opacity: 0.22,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.18), transparent 22%, transparent 78%, rgba(0,0,0,0.28))",
      }}
    />
  </AbsoluteFill>
);

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: filmGrain,
        backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.07,
        mixBlendMode: "overlay",
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(ellipse 75% 60% at 50% 48%, transparent 52%, rgba(2,5,12,0.55) 100%)",
    }}
  />
);
