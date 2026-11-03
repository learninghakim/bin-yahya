import React from "react";
import { type as T } from "../theme/theme";
import { TextReveal } from "../components/text/TextReveal";
import { CTAButton } from "../components/graphics/CTAButton";
import { IconName } from "../components/graphics/icons";
import { useSec } from "../system/time";
import { SceneLayout, SceneShell } from "./SceneShell";

export type CTAProps = SceneLayout & {
  /** Line above the button, e.g. "تبي الجزء الثاني؟" */
  title?: string;
  /** Button text, e.g. "تابعني" / "احفظ الفيديو" / "اكتب (صوت) بالتعليقات". */
  label: string;
  icon?: IconName;
  subtitle?: string;
};

/**
 * CTA (last 3–5 s): one action, calm, the only glowing element.
 *
 * @example
 * { type: "cta", from: 27, to: 31, title: "تبي أفضل ميكروفون؟", label: "اكتب «ميك»", icon: "arrow" }
 */
export const CTAScene: React.FC<CTAProps> = ({ title, label, icon = "arrow", subtitle, ...layout }) => {
  const s = useSec();
  return (
    <SceneShell {...layout} defaultPlacement="bottom">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        {title ? <TextReveal text={title} size={T.title} weight={900} /> : null}
        <CTAButton label={label} icon={icon} delay={title ? 10 : 0} tapAt={(title ? 10 : 0) + s(1.1)} />
        {subtitle ? <TextReveal text={subtitle} size={T.label + 4} weight={600} delay={(title ? 10 : 0) + 12} style={{ opacity: 0.8 }} /> : null}
      </div>
    </SceneShell>
  );
};
