import React from "react";
import { Icon } from "../../../components/graphics/Icon";
import { S } from "../tokens";
import { enter, prog, useNow } from "../clock";

/**
 * CTA card: a "follow" row whose button gets tapped at `tapAt` (turns into "متابَع ✓"),
 * then a bell notification row slides in at `bell.at`.
 *
 * @example
 * <Follow title="تابع الحساب" tapAt={68.5} bell={{ text: "أساليب تعلّم فعّالة كل فترة", at: 70 }} />
 */
export const Follow: React.FC<{ title: string; tapAt: number; bell?: { text: string; at: number } }> = ({ title, tapAt, bell }) => {
  const { t } = useNow();
  const tap = prog(t, tapAt, 0.25);
  const press = 1 - 0.06 * Math.sin(Math.min(1, prog(t, tapAt - 0.1, 0.25)) * Math.PI);
  const b = bell ? prog(t, bell.at - 0.1, 0.35) : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 18px", borderRadius: 22, background: S.color.chip }}>
        <div style={{ width: 64, height: 64, borderRadius: 64, background: S.color.limeSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="user" size={36} color={S.color.lime} />
        </div>
        <div style={{ flex: 1, fontFamily: S.font.ui, fontWeight: 700, fontSize: 40, color: S.color.text }}>{title}</div>
        <div
          style={{
            padding: "12px 28px", borderRadius: 16, fontFamily: S.font.ui, fontWeight: 700, fontSize: 32, transform: `scale(${press})`,
            background: tap > 0.5 ? S.color.chip : S.color.lime, color: tap > 0.5 ? S.color.text : S.color.ink, border: `1.5px solid ${tap > 0.5 ? S.color.line : "transparent"}`,
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          {tap > 0.5 ? <Icon name="check" size={28} color={S.color.lime} strokeWidth={3} /> : null}
          {tap > 0.5 ? "متابَع" : "متابعة"}
        </div>
      </div>
      {bell ? (
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "4px 8px", ...enter(b, 0, 10) }}>
          <Icon name="bell" size={34} color={S.color.lime} />
          <div style={{ fontFamily: S.font.ui, fontWeight: 600, fontSize: 34, color: S.color.text }}>{bell.text}</div>
        </div>
      ) : null}
    </div>
  );
};
