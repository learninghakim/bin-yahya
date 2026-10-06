// Scene 09 — 1:46.7 → 1:51.2 — C promise visual: 7 أسئلة + 7 nodes + تملّك ↔ إيجار
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { F, SCENES } from "../data/timing";
import { glowText, theme } from "../theme";
import { breathe, enterStyle, popScale, useLife } from "../components/anim";
import { Icon } from "../components/Icon";
import { FullScreen } from "../components/Stage";
import { Ar, Kicker, Num } from "../components/UI";

export const SevenQuestions: React.FC = () => {
  const { start, end } = SCENES.s09SevenQuestions;
  const frame = useCurrentFrame();
  const seven = useLife(start + 0.05, end, { cfg: theme.spring.pop });
  const word = useLife(start + 0.3, end);
  const must = useLife(107.8, end);
  const vs = useLife(108.75, end);
  const arrow = interpolate(frame, [F(109.3), F(109.8)], [0, 1], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rent = useLife(110.13, end, { cfg: theme.spring.pop });
  // nodes light one by one (2–4f stagger feel, spread over the sentence)
  const nodeAt = (i: number) => F(107.0) + i * 4;
  const lineW = interpolate(frame, [nodeAt(0), nodeAt(6)], [0, 1], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <FullScreen start={start} end={end} glowX={0.72} glowY={0.4}>
      <AbsoluteFill>
        <div style={{ position: "absolute", top: 150, right: 160 }}>
          <Kicker inSec={start + 0.15} outSec={end} ghost>
            في آخر الفيديو
          </Kicker>
        </div>
        <div dir="rtl" style={{ position: "absolute", top: 200, right: 240, display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ opacity: seven.o, transform: `scale(${(0.8 + 0.2 * seven.p) * breathe(frame, 0.012, 28)})` }}>
            <Num size={340} color={theme.colors.pink} style={{ textShadow: glowText(1.3), lineHeight: 1 }}>
              7
            </Num>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={enterStyle(word.p, word.o, { x: word.x })}>
              <Ar size={130} weight={900}>
                أسئلة
              </Ar>
            </div>
            <div style={enterStyle(must.p, must.o, { x: must.x })}>
              <Ar size={38} weight={600} font="body" color={theme.colors.textDim}>
                مفروض تجاوبها
              </Ar>
            </div>
          </div>
        </div>
        {/* 7 nodes */}
        <div style={{ position: "absolute", top: 600, left: 360, right: 360 }}>
          <div style={{ position: "absolute", top: 37, right: 0, height: 3, width: `${lineW * 100}%`, background: "rgba(255,255,255,0.18)" }} />
          <div dir="rtl" style={{ position: "relative", display: "flex", justifyContent: "space-between" }}>
            {Array.from({ length: 7 }).map((_, i) => {
              const p = interpolate(frame, [nodeAt(i), nodeAt(i) + 8], [0, 1], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const lit = frame >= nodeAt(i) + 4;
              return (
                <div
                  key={i}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 38,
                    border: `3px solid ${lit ? theme.colors.pink : "#2A2A31"}`,
                    background: "#0A0A0E",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: p,
                    transform: `scale(${popScale(p)})`,
                    boxShadow: lit ? `0 0 22px -4px ${theme.colors.glow}` : undefined,
                  }}
                >
                  <Icon name="question" size={40} color={lit ? "#fff" : theme.colors.textMute} stroke={2.2} />
                </div>
              );
            })}
          </div>
        </div>
        {/* تشتري ↔ تستأجر */}
        <div dir="rtl" style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
          <div style={enterStyle(vs.p, vs.o, { x: vs.x })}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Icon name="house" size={50} color={theme.colors.pink} />
              <Ar size={64} weight={900}>
                تملّك
              </Ar>
            </div>
          </div>
          <svg width={150} height={40} viewBox="0 0 150 40" style={{ opacity: arrow }}>
            <path d="M14 20 H136 M126 10 L138 20 L126 30 M24 10 L12 20 L24 30" stroke={theme.colors.pink} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ opacity: rent.o, transform: `scale(${popScale(rent.p)})` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Icon name="key" size={50} color={theme.colors.pink} />
              <Ar size={64} weight={900}>
                إيجار
              </Ar>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </FullScreen>
  );
};
