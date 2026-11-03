import React from "react";
import { Icon } from "../../../components/graphics/Icon";
import { S } from "../tokens";
import { enter, prog, useNow } from "../clock";

/**
 * "Not X → actually Y": the old belief appears, gets struck through, an arrow, then the new idea in lime.
 *
 * @example
 * <Reframe from={{ text: "علامة ضعف", at: 59.4 }} strikeAt={60.9} to={{ text: "عقلك يبني", at: 62.1 }} />
 */
export const Reframe: React.FC<{ from: { text: string; at: number }; strikeAt: number; to: { text: string; at: number } }> = ({ from, strikeAt, to }) => {
  const { t } = useNow();
  const a = prog(t, from.at - 0.1, 0.32);
  const st = prog(t, strikeAt, 0.3);
  const b = prog(t, to.at - 0.1, 0.35);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28, padding: "10px 0 6px" }}>
      <div style={{ position: "relative", fontFamily: S.font.ui, fontWeight: 600, fontSize: 46, color: `rgba(244,246,241,${1 - 0.5 * st})`, ...enter(a, 0, 12) }}>
        {from.text}
        <div style={{ position: "absolute", right: 0, top: "55%", height: 5, borderRadius: 5, width: `${st * 100}%`, background: S.color.danger }} />
      </div>
      <div style={{ opacity: b, transform: `translateX(${(1 - b) * 14}px) scaleX(-1)` }}>
        <Icon name="arrow" size={46} color={S.color.dim} strokeWidth={2.4} />
      </div>
      <div style={{ padding: "8px 22px", borderRadius: 18, background: S.color.lime, color: S.color.ink, fontFamily: S.font.ui, fontWeight: 700, fontSize: 46, ...enter(b, 0, 12) }}>{to.text}</div>
    </div>
  );
};
