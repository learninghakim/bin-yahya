import React from "react";
import { LowerThird } from "../components/graphics/LowerThird";
import { SceneShell } from "./SceneShell";

export type LowerThirdProps = { name: string; role?: string };

/**
 * LOWER THIRD: introduces the speaker. No backdrop, bottom-start of the safe zone.
 *
 * @example
 * { type: "lowerThird", from: 1, to: 4.5, name: "عبدالله", role: "صانع محتوى" }
 */
export const LowerThirdScene: React.FC<LowerThirdProps> = ({ name, role }) => (
  <SceneShell backdrop="none" defaultPlacement="bottom">
    <div style={{ alignSelf: "stretch" }}>
      <LowerThird name={name} role={role} />
    </div>
  </SceneShell>
);
