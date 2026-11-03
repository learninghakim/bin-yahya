import React from "react";
import { Icon } from "../../../components/graphics/Icon";
import { IconName } from "../../../components/graphics/icons";
import { S } from "../tokens";
import { enter, Grow, prog, useNow } from "../clock";

export type Row = { text: string; at: number; mark?: "check" | "x"; icon?: IconName };

/**
 * Rows that appear exactly when said. mark "x" = old habit: the row dims and a strike runs through it.
 *
 * @example
 * <Checklist rows={[{ text: "أفتح الملخصات", at: 26.8, mark: "x" }]} />
 */
export const Checklist: React.FC<{ rows: Row[] }> = ({ rows }) => {
  const { t } = useNow();
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {rows.map((r, i) => {
        const p = prog(t, r.at - 0.1, 0.32);
        const x = r.mark === "x";
        const strike = x ? prog(t, r.at + 0.45, 0.35) : 0;
        const col = x ? S.color.danger : S.color.lime;
        return (
          <Grow key={i} at={r.at} h={i === 0 ? 78 : 92}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 18px", borderRadius: 20, background: S.color.chip, marginTop: i === 0 ? 0 : 14, ...enter(p, 0, 14) }}>
            <div style={{ flex: "0 0 auto", width: 50, height: 50, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: x ? "rgba(255,107,87,0.12)" : S.color.limeSoft }}>
              <Icon name={r.icon ?? (x ? "x" : "check")} size={30} color={col} strokeWidth={2.6} drawAt={undefined} />
            </div>
            <div style={{ position: "relative", fontFamily: S.font.ui, fontWeight: 600, fontSize: 40, color: x ? `rgba(244,246,241,${1 - 0.45 * strike})` : S.color.text }}>
              {r.text}
              {x ? <div style={{ position: "absolute", right: 0, top: "54%", height: 4, borderRadius: 4, width: `${strike * 100}%`, background: S.color.danger }} /> : null}
            </div>
          </div>
          </Grow>
        );
      })}
    </div>
  );
};
