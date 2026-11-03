import React from "react";
import { type as T } from "../theme/theme";
import { HighlightStyle, TextReveal } from "../components/text/TextReveal";
import { GlassCard } from "../components/layout/GlassCard";
import { Entrance } from "../components/motion/Entrance";
import { IconAnimation } from "../components/graphics/IconAnimation";
import { IconName } from "../components/graphics/icons";
import { SceneLayout, SceneShell } from "./SceneShell";

export type ExplanationProps = SceneLayout & {
  title?: string;
  body: string;
  highlight?: string[];
  highlightStyle?: HighlightStyle;
  icon?: IconName;
};

/**
 * EXPLANATION: an idea in one card — optional icon + title + 1–2 lines of body.
 *
 * @example
 * { type: "explanation", from: 3, to: 8, icon: "bulb", title: "السبب؟", body: "الميكروفون بعيد عن فمك", highlight: ["بعيد"] }
 */
export const ExplanationScene: React.FC<ExplanationProps> = ({ title, body, highlight, highlightStyle = "color", icon, ...layout }) => (
  <SceneShell {...layout} defaultPlacement="bottom">
    <div style={{ position: "relative", width: "100%", paddingTop: icon ? 80 : 0 }}>
      {icon ? (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 2 }}>
          <IconAnimation name={icon} size={150} tone="accent" delay={6} />
        </div>
      ) : null}
      <Entrance from="bottom" spring="smooth">
        <GlassCard padding={icon ? 56 : 44} style={{ paddingTop: icon ? 100 : 44 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {title ? <TextReveal text={title} size={T.title} weight={900} delay={8} /> : null}
            <TextReveal text={body} size={T.body} weight={700} delay={title ? 16 : 8} highlight={highlight} highlightStyle={highlightStyle} lineHeight={1.35} />
          </div>
        </GlassCard>
      </Entrance>
    </div>
  </SceneShell>
);
