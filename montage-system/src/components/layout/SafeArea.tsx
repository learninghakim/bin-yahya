import React from "react";
import { AbsoluteFill } from "remotion";
import { SAFE } from "../../system/safeArea";

export type Placement = "top" | "center" | "bottom";

/**
 * Positions content inside the Instagram safe zone.
 *
 * @example
 * <SafeArea placement="bottom"><GlassCard>…</GlassCard></SafeArea>
 */
export const SafeArea: React.FC<{
  placement?: Placement;
  align?: "start" | "center" | "end";
  children: React.ReactNode;
}> = ({ placement = "center", align = "center", children }) => (
  <AbsoluteFill
    style={{
      paddingTop: SAFE.top,
      paddingBottom: SAFE.bottom,
      paddingLeft: SAFE.left,
      paddingRight: SAFE.right,
      display: "flex",
      flexDirection: "column",
      justifyContent: placement === "top" ? "flex-start" : placement === "bottom" ? "flex-end" : "center",
      alignItems: align === "start" ? "flex-start" : align === "end" ? "flex-end" : "center",
    }}
  >
    {children}
  </AbsoluteFill>
);
