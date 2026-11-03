import React from "react";
import { stagger, type as T } from "../theme/theme";
import { HighlightStyle, RevealMode, TextReveal } from "../components/text/TextReveal";
import { IconAnimation } from "../components/graphics/IconAnimation";
import { IconName } from "../components/graphics/icons";
import { Tag } from "../components/graphics/Tag";
import { SceneLayout, SceneShell } from "./SceneShell";

export type HookProps = SceneLayout & {
  /** The hook line. Short! 3–8 words. Use "\n" to break lines. */
  title: string;
  highlight?: string[];
  highlightStyle?: HighlightStyle;
  mode?: RevealMode;
  /** Small label above the title, e.g. "خطأ شائع". */
  tag?: string;
  icon?: IconName;
};

/**
 * HOOK (first 1–3 s): the boldest text of the video. Something moves in frame 0.
 *
 * @example
 * { type: "hook", from: 0, to: 2.8, title: "3 أخطاء تدمّر\nصوت فيديوهاتك", highlight: ["تدمّر"], tag: "انتبه" }
 */
export const HookScene: React.FC<HookProps> = ({ title, highlight, highlightStyle = "pill", mode = "word", tag, icon, ...layout }) => (
  <SceneShell {...layout} defaultPlacement="top">
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
      {icon ? <IconAnimation name={icon} size={150} tone="accent" /> : null}
      {tag ? <Tag text={tag} tone="danger" delay={icon ? 4 : 0} /> : null}
      <TextReveal text={title} size={T.hero} weight={900} mode={mode} highlight={highlight} highlightStyle={highlightStyle} delay={(tag ? 4 : 0) + (icon ? 4 : 0)} per={stagger.word} lineHeight={1.18} />
    </div>
  </SceneShell>
);
