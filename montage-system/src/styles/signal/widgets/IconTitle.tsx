import React from "react";
import { Icon } from "../../../components/graphics/Icon";
import { IconName } from "../../../components/graphics/icons";
import { S } from "../tokens";
import { enter, prog, useNow } from "../clock";

/**
 * Icon tile + title (+ optional subtitle that arrives later).
 *
 * @example
 * <IconTitle icon="zap" title="أكبر خدعة" at={7.4} sub={{ text: "يخدعك فيها عقلك", at: 7.8 }} />
 */
export const IconTitle: React.FC<{ icon: IconName; title: string; at: number; sub?: { text: string; at: number }; tone?: "lime" | "danger" }> = ({ icon, title, at, sub, tone = "lime" }) => {
  const { t } = useNow();
  const p = prog(t, at - 0.1, 0.35);
  const col = tone === "danger" ? S.color.danger : S.color.lime;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <div style={{ flex: "0 0 auto", width: 104, height: 104, borderRadius: 28, background: tone === "danger" ? "rgba(255,107,87,0.12)" : S.color.limeSoft, border: `2px solid ${col}`, display: "flex", alignItems: "center", justifyContent: "center", ...enter(p, 0, 0) }}>
        <Icon name={icon} size={58} color={col} drawAt={undefined} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontFamily: S.font.ui, fontWeight: 700, fontSize: 52, color: S.color.text, ...enter(p, 0, 14) }}>{title}</div>
        {sub ? <div style={{ fontFamily: S.font.ui, fontWeight: 500, fontSize: 34, color: S.color.dim, ...enter(prog(t, sub.at - 0.1, 0.32), 0, 10) }}>{sub.text}</div> : null}
      </div>
    </div>
  );
};
