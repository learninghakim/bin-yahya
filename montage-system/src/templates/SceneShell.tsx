import React from "react";
import { AbsoluteFill } from "remotion";
import { Placement, SafeArea } from "../components/layout/SafeArea";
import { Scrim } from "../components/layout/Scrim";
import { useExit, useSpringIn } from "../components/motion/motion";

export type Backdrop = "none" | "scrim" | "full";

/** Shared props every scene template accepts. */
export type SceneLayout = {
  /** Where the overlay sits inside the safe zone. */
  placement?: Placement;
  /**
   * none  = graphics straight over the speaker
   * scrim = soft gradient behind the graphics (default)
   * full  = blur + darken the whole frame (speaker steps back)
   */
  backdrop?: Backdrop;
};

export const SceneShell: React.FC<SceneLayout & { children: React.ReactNode; defaultPlacement: Placement }> = ({
  placement, backdrop = "scrim", defaultPlacement, children,
}) => {
  const where = placement ?? defaultPlacement;
  const p = useSpringIn(0, "gentle");
  const x = useExit();
  return (
    <AbsoluteFill>
      {backdrop === "full" ? (
        <AbsoluteFill style={{ backdropFilter: `blur(${18 * Math.min(p, 1) * (1 - x)}px)` }}>
          <Scrim side="full" strength={0.6} />
        </AbsoluteFill>
      ) : null}
      {backdrop === "scrim" ? <Scrim side={where === "top" ? "top" : "bottom"} strength={where === "center" ? 0.45 : 0.7} /> : null}
      <SafeArea placement={where}>{children}</SafeArea>
    </AbsoluteFill>
  );
};
