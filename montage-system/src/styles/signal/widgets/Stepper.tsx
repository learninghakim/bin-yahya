import React from "react";
import { interpolate } from "remotion";
import { Icon } from "../../../components/graphics/Icon";
import { S } from "../tokens";
import { prog, useNow } from "../clock";

export type Step = { label: string; at: number };

/**
 * Horizontal progress stepper (right→left). Each step lights up lime with a check when it is said;
 * the connecting line fills toward the next step. Optional caption line under it.
 *
 * @example
 * <Stepper steps={[{ label: "اقرأ", at: 36 }, { label: "أغلق", at: 37.3 }]} />
 */
export const Stepper: React.FC<{ steps: Step[]; note?: { text: string; at: number } }> = ({ steps, note }) => {
  const { t } = useNow();
  const n = steps.length;
  return (
    <div>
      <div style={{ position: "relative", height: 150 }}>
        {/* track */}
        <div style={{ position: "absolute", top: 34, right: `${50 / n}%`, left: `${50 / n}%`, height: 4, background: S.color.faint, borderRadius: 4 }} />
        {steps.slice(0, -1).map((s, i) => {
          const fill = interpolate(t, [s.at, steps[i + 1].at], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: S.ease.inOut });
          return (
            <div key={i} style={{ position: "absolute", top: 34, right: `${((i + 0.5) / n) * 100}%`, width: `${(fill / n) * 100}%`, height: 4, background: S.color.lime, borderRadius: 4 }} />
          );
        })}
        {steps.map((s, i) => {
          const p = prog(t, s.at - 0.05, 0.3);
          const active = t >= s.at && (i === n - 1 || t < steps[i + 1].at);
          return (
            <div key={i} style={{ position: "absolute", top: 0, right: `${(i / n) * 100}%`, width: `${100 / n}%`, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 72, height: 72, borderRadius: 72, display: "flex", alignItems: "center", justifyContent: "center",
                  background: p > 0.5 ? S.color.lime : S.color.panelSolid, border: `3px solid ${p > 0.02 ? S.color.lime : S.color.faint}`,
                  transform: `scale(${0.9 + 0.1 * p + (active ? 0.06 : 0)})`,
                }}
              >
                {p > 0.5 ? <Icon name="check" size={38} color={S.color.ink} strokeWidth={3} /> : <span style={{ fontFamily: S.font.ui, fontWeight: 700, fontSize: 28, color: S.color.dim }}>{i + 1}</span>}
              </div>
              <div style={{ fontFamily: S.font.ui, fontWeight: active ? 700 : 500, fontSize: 28, color: p > 0.5 ? S.color.text : S.color.dim, whiteSpace: "nowrap" }}>{s.label}</div>
            </div>
          );
        })}
      </div>
      {note ? (
        <div style={{ marginTop: 18, textAlign: "center", fontFamily: S.font.ui, fontWeight: 700, fontSize: 40, color: S.color.text, opacity: prog(t, note.at, 0.35) }}>{note.text}</div>
      ) : null}
    </div>
  );
};
