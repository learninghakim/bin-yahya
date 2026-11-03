import React from "react";
import { interpolate } from "remotion";
import { S } from "../tokens";
import { prog, useNow } from "../clock";

// Fixed node layout inside an 860×240 box.
const NODES = [
  [80, 140], [220, 60], [250, 200], [400, 120], [560, 50], [590, 190], [740, 110], [820, 200],
] as const;
const EDGES = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6], [6, 7], [1, 4], [2, 5]] as const;

/**
 * Neural links: nodes pop in, edges draw one by one from `at`; at `strongAt` the links thicken
 * and turn lime (connections get strong). Label under it.
 *
 * @example
 * <Links at={65.2} strongAt={65.9} label={{ text: "ما تنساها طول عمرك", at: 66.9 }} />
 */
export const Links: React.FC<{ at: number; strongAt: number; label?: { text: string; at: number } }> = ({ at, strongAt, label }) => {
  const { t } = useNow();
  const strong = prog(t, strongAt, 0.5, S.ease.inOut);
  return (
    <div>
      <svg width="100%" viewBox="0 0 900 250" style={{ display: "block", overflow: "visible" }}>
        {EDGES.map(([a, b], i) => {
          const p = prog(t, at + i * 0.07, 0.35, S.ease.inOut);
          const [x1, y1] = NODES[a];
          const [x2, y2] = NODES[b];
          return (
            <line key={i} x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p}
              stroke={strong > 0.5 ? S.color.lime : S.color.dim} strokeOpacity={0.5 + 0.5 * strong} strokeWidth={3 + 4 * strong} strokeLinecap="round" />
          );
        })}
        {NODES.map(([x, y], i) => {
          const p = prog(t, at - 0.2 + i * 0.05, 0.3);
          const pulse = 1 + Math.sin((t - strongAt) * 6 + i) * 0.08 * strong;
          return <circle key={i} cx={x} cy={y} r={interpolate(p, [0, 1], [6, 15]) * pulse} fill={strong > 0.5 ? S.color.lime : S.color.text} opacity={p} />;
        })}
      </svg>
      {label ? (
        <div style={{ marginTop: 10, textAlign: "center", fontFamily: S.font.ui, fontWeight: 700, fontSize: 42, color: S.color.text, opacity: prog(t, label.at, 0.35) }}>{label.text}</div>
      ) : null}
    </div>
  );
};
