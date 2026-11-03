import React from "react";
import { S, SignalTone, toneColor } from "../tokens";
import { enter, Grow, prog, useNow } from "../clock";

export type Bar = { label: string; value: number; at: number; tone?: SignalTone };

/**
 * Labelled meters that fill when said (no fake numbers — just relative length).
 *
 * @example
 * <Bars bars={[{ label: "السهولة", value: 0.95, at: 18.7 }, { label: "التثبيت", value: 0.15, at: 21.5, tone: "danger" }]} />
 */
export const Bars: React.FC<{ bars: Bar[] }> = ({ bars }) => {
  const { t } = useNow();
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {bars.map((b, i) => {
        const p = prog(t, b.at - 0.1, 0.3);
        const fill = prog(t, b.at, 0.9, S.ease.inOut) * b.value;
        return (
          <Grow key={i} at={b.at} h={i === 0 ? 96 : 120}>
          <div style={{ marginTop: i === 0 ? 0 : 24, ...enter(p, 0, 12) }}>
            <div style={{ fontFamily: S.font.ui, fontWeight: 600, fontSize: 36, color: S.color.text, marginBottom: 12 }}>{b.label}</div>
            <div style={{ height: 26, borderRadius: 26, background: S.color.chip, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${fill * 100}%`, borderRadius: 26, background: toneColor(b.tone) }} />
            </div>
          </div>
          </Grow>
        );
      })}
    </div>
  );
};
