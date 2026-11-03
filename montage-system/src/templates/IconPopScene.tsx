import React from "react";
import { type as T } from "../theme/theme";
import { IconAnimation } from "../components/graphics/IconAnimation";
import { IconName } from "../components/graphics/icons";
import { TextReveal } from "../components/text/TextReveal";
import { SceneLayout, SceneShell } from "./SceneShell";

export type IconPopProps = SceneLayout & { icon: IconName; label?: string; tone?: "hero" | "accent" | "danger" | "success" | "paper" };

/**
 * ICON POP: a quick visual accent (✓ / ✗ / ⚠ / 💡) with an optional short word.
 *
 * @example
 * { type: "iconPop", from: 12, to: 13.5, icon: "x", tone: "danger", label: "غلط!", placement: "top", backdrop: "none" }
 */
export const IconPopScene: React.FC<IconPopProps> = ({ icon, label, tone = "accent", ...layout }) => (
  <SceneShell backdrop="none" {...layout} defaultPlacement="top">
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <IconAnimation name={icon} size={200} tone={tone} />
      {label ? <TextReveal text={label} size={T.title} weight={900} delay={6} /> : null}
    </div>
  </SceneShell>
);
