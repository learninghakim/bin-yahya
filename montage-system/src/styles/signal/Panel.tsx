import React from "react";
import { AbsoluteFill } from "remotion";
import { S } from "./tokens";
import { enter, useSceneVis } from "./clock";

/**
 * UI PANEL — the workhorse of the Signal style: a dark glass card over the chest,
 * with a small status pill in the top-right ("الخطوة 2 · …"). Widgets go inside.
 *
 * @example
 * <Panel label="قبل الكتاب"><Checklist rows={[…]} /></Panel>
 */
export const Panel: React.FC<{ label?: string; top?: number; children: React.ReactNode }> = ({ label, top = S.layout.panelTop, children }) => {
  const { inn, out } = useSceneVis();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        dir="rtl"
        style={{
          position: "absolute", left: S.layout.sideX, right: S.layout.sideX, top,
          background: S.color.panel, border: `1.5px solid ${S.color.line}`, borderRadius: 34,
          boxShadow: `0 30px 80px -20px ${S.color.shadow}`, backdropFilter: "blur(20px)",
          padding: "26px 30px 30px", ...enter(inn, out),
        }}
      >
        {label ? (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 16px", borderRadius: 999, background: S.color.chip, border: `1px solid ${S.color.line}`, fontFamily: S.font.ui, fontWeight: 500, fontSize: 24, color: S.color.dim }}>
              <span style={{ width: 9, height: 9, borderRadius: 9, background: S.color.lime }} />
              {label}
            </div>
          </div>
        ) : null}
        {children}
      </div>
    </AbsoluteFill>
  );
};
