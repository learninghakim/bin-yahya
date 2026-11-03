import React from "react";
import { type as T } from "../theme/theme";
import { TextReveal } from "../components/text/TextReveal";
import { ListItem, StaggerList } from "../components/graphics/StaggerList";
import { SceneLayout, SceneShell } from "./SceneShell";

export type PointsProps = SceneLayout & {
  title?: string;
  /** Each item may have `at` (seconds from scene start) to appear exactly when it is said. */
  items: ListItem[];
  bullet?: "number" | "check" | "dot" | "icon";
};

/**
 * POINTS: numbered / checked list, items revealed one by one (synced to speech via `at`).
 *
 * @example
 * { type: "points", from: 8, to: 20, title: "الحل", bullet: "number",
 *   items: [{ text: "ميكروفون لاسلكي", at: 0.6 }, { text: "غرفة فيها أثاث", at: 4 }] }
 */
export const PointsScene: React.FC<PointsProps> = ({ title, items, bullet = "number", ...layout }) => (
  <SceneShell {...layout} defaultPlacement="bottom">
    <div style={{ display: "flex", flexDirection: "column", gap: 30, width: "100%" }}>
      {title ? <TextReveal text={title} size={T.title} weight={900} /> : null}
      <StaggerList items={items} bullet={bullet} delay={title ? 10 : 0} />
    </div>
  </SceneShell>
);
