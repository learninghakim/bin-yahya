import React from "react";
import { Icon } from "../../../components/graphics/Icon";
import { IconName } from "../../../components/graphics/icons";
import { S } from "../tokens";
import { enter, prog, useNow } from "../clock";

export type Chip = { text: string; at: number; icon?: IconName };

/**
 * Tag chips that pop in when said (wraps to two rows if needed).
 *
 * @example
 * <Chips chips={[{ text: "علم التعلّم", at: 13.4, icon: "brain" }]} />
 */
export const Chips: React.FC<{ chips: Chip[]; size?: number }> = ({ chips, size = 32 }) => {
  const { t } = useNow();
  return (
    <div dir="rtl" style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
      {chips.map((c, i) => {
        const p = prog(t, c.at - 0.1, 0.3);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 16, background: S.color.chip, border: `1.5px solid ${S.color.line}`, fontFamily: S.font.ui, fontWeight: 600, fontSize: size, color: S.color.text, ...enter(p, 0, 12) }}>
            {c.icon ? <Icon name={c.icon} size={size * 0.95} color={S.color.lime} /> : null}
            {c.text}
          </div>
        );
      })}
    </div>
  );
};
