import React from "react";
import { type as T } from "../theme/theme";
import { Counter } from "../components/graphics/Counter";
import { TextReveal } from "../components/text/TextReveal";
import { SceneLayout, SceneShell } from "./SceneShell";

export type StatProps = SceneLayout & { value: number; prefix?: string; suffix?: string; decimals?: number; caption: string };

/**
 * STAT: one big animated number + a caption ("87% من المشاهدين…").
 *
 * @example
 * { type: "stat", from: 5, to: 8, value: 87, suffix: "%", caption: "يتركون الفيديو بسبب الصوت" }
 */
export const StatScene: React.FC<StatProps> = ({ value, prefix, suffix, decimals, caption, ...layout }) => (
  <SceneShell {...layout} defaultPlacement="center">
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <Counter to={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      <TextReveal text={caption} size={T.body + 4} weight={800} delay={12} />
    </div>
  </SceneShell>
);
