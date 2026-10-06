// Scene 08 — 1:33.1 → 1:45.5 — C kinetic chapter frame → A «قرار كبير» → C «20 سنة» timeline
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { F, SCENES } from "../data/timing";
import { glowText, theme } from "../theme";
import { breathe, enterStyle, popScale, useHit, useLife } from "../components/anim";
import { Icon } from "../components/Icon";
import { FullScreen } from "../components/Stage";
import { Ar, IconBadge, Kicker, Num, SideKeyword } from "../components/UI";

/* ---------- 08a  Chapter frame: ؟ | القرار الصح → تشتري؟ أم تستأجر؟ ---------- */
export const ChapterFrame: React.FC = () => {
  const { start, end } = SCENES.s08Chapter;
  const frame = useCurrentFrame();
  const t = frame - F(start);
  // big mark: scale 0.8 → 1.05 → 1 with a pink glow, then breathing (≤2%)
  const big = useLife(start + 0.05, end, { cfg: theme.spring.pop });
  const divider = interpolate(t, [6, 13], [0, 1], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const label = useLife(start + 0.35, end);
  const title = useLife(start + 0.45, end);
  const sub = useLife(94.2, end);
  const buy = useLife(96.0, end, { cfg: theme.spring.pop });
  const or = useLife(96.6, end);
  const rent = useLife(97.15, end, { cfg: theme.spring.pop });
  return (
    <FullScreen start={start} end={end} glowX={0.7} glowY={0.45}>
      <AbsoluteFill>
        <div dir="rtl" style={{ position: "absolute", top: 210, right: 230, display: "flex", alignItems: "center", gap: 56 }}>
          {/* big mark (on the reading-start side) */}
          <div style={{ opacity: big.o, transform: `scale(${(0.8 + 0.2 * big.p) * breathe(frame, 0.012, 30)})` }}>
            <Num size={330} color={theme.colors.pink} style={{ textShadow: glowText(1.3), lineHeight: 0.9 }}>
              ؟
            </Num>
          </div>
          <div style={{ width: 4, height: 330 * divider, background: "rgba(255,255,255,0.85)", borderRadius: 2, alignSelf: "center" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={enterStyle(label.p, label.o, { x: label.x })}>
              <Ar size={34} weight={700} font="body" color={theme.colors.textDim} style={{ letterSpacing: "0.02em" }}>
                في هذا المقطع
              </Ar>
            </div>
            <div style={enterStyle(title.p, title.o, { x: title.x })}>
              <Ar size={124} weight={900}>
                القرار <span style={{ color: theme.colors.pink }}>الصح</span>
              </Ar>
            </div>
            <div style={enterStyle(sub.p, sub.o, { x: sub.x })}>
              <Ar size={36} weight={500} font="body" color={theme.colors.textDim}>
                الخطوات اللي تخليك تعرف…
              </Ar>
            </div>
          </div>
        </div>
        <div dir="rtl" style={{ position: "absolute", top: 690, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 36 }}>
          <div style={{ opacity: buy.o, transform: `scale(${popScale(buy.p)})` }}>
            <Choice icon="house" label="تشتري؟" />
          </div>
          <div style={enterStyle(or.p, or.o, { x: or.x })}>
            <Ar size={50} weight={800} color={theme.colors.textMute}>
              أم
            </Ar>
          </div>
          <div style={{ opacity: rent.o, transform: `scale(${popScale(rent.p)})` }}>
            <Choice icon="key" label="تستأجر؟" />
          </div>
        </div>
      </AbsoluteFill>
    </FullScreen>
  );
};

const Choice: React.FC<{ icon: "house" | "key"; label: string }> = ({ icon, label }) => (
  <div
    dir="rtl"
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
      padding: "18px 40px 22px 34px",
      borderRadius: 999,
      border: `2px solid ${theme.colors.pink}`,
      background: "rgba(12,12,16,0.92)",
      boxShadow: `0 0 34px -8px ${theme.colors.glow}`,
    }}
  >
    <Icon name={icon} size={50} color={theme.colors.pink} />
    <Ar size={66} weight={900}>
      {label}
    </Ar>
  </div>
);

/* ---------- 08b  «هذا القرار مو قرار بسيط» (A) ---------- */
export const BigDecision: React.FC = () => (
  <AbsoluteFill>
    <SideKeyword inSec={98.7} outSec={101.82} side="right" top={330} width={480}>
      <Kicker inSec={98.75} outSec={101.82} ghost>
        مقطع مهم جدًا
      </Kicker>
      <BigWord />
    </SideKeyword>
  </AbsoluteFill>
);

const BigWord: React.FC = () => {
  const { p, o, x } = useLife(99.75, 101.82, { cfg: theme.spring.pop });
  const hit = useHit(100.4, 1.1, 12);
  return (
    <div style={{ opacity: o, transform: `scale(${popScale(p) * hit.s}) translateY(${x * -10}px)`, transformOrigin: "right center", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      <Ar size={96} weight={900}>
        قرار
      </Ar>
      <Ar size={110} weight={900} color={theme.colors.pink} glow={0.8} style={{ marginTop: -24 }}>
        كبير
      </Ar>
      <Ar size={30} weight={500} font="body" color={theme.colors.textDim}>
        مو قرار بسيط
      </Ar>
    </div>
  );
};

/* ---------- 08c  تمويل عقاري — 20 سنة ---------- */
export const TwentyYears: React.FC = () => {
  const { start, end } = SCENES.s08TwentyYears;
  const frame = useCurrentFrame();
  const n = useLife(103.0, end, { cfg: theme.spring.pop });
  const hit = useHit(103.05, 1.1, 14);
  const bar = useLife(103.1, end);
  const fill = interpolate(frame, [F(103.1), F(104.5)], [0, 1], { easing: theme.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const warn = useLife(104.62, end);
  const ic = useLife(start + 0.15, end, { cfg: theme.spring.pop });
  return (
    <FullScreen start={start} end={end} glowX={0.5} glowY={0.42}>
      <AbsoluteFill>
        <div dir="rtl" style={{ position: "absolute", top: 130, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
          <div style={{ opacity: ic.o, transform: `scale(${popScale(ic.p)})` }}>
            <IconBadge size={70}>
              <Icon name="bank" size={34} color={theme.colors.pink} />
            </IconBadge>
          </div>
          <Kicker inSec={start + 0.1} outSec={end} ghost>
            تمويل عقاري
          </Kicker>
        </div>
        <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div dir="rtl" style={{ display: "flex", alignItems: "baseline", gap: 34, opacity: n.o, transform: `scale(${(0.8 + 0.2 * n.p) * hit.s})` }}>
            <Num size={300} color={theme.colors.pink} style={{ textShadow: glowText(1.2), lineHeight: 1 }}>
              20
            </Num>
            <Ar size={120} weight={900}>
              سنة
            </Ar>
          </div>
        </div>
        <div style={{ position: "absolute", top: 640, left: 300, right: 300, ...enterStyle(bar.p, bar.o, { x: bar.x, dx: 0, dy: 20 }) }}>
          <div style={{ position: "relative", height: 10, borderRadius: 5, background: "rgba(255,255,255,0.10)" }}>
            <div style={{ position: "absolute", right: 0, top: 0, height: 10, width: `${fill * 100}%`, borderRadius: 5, background: theme.colors.pink, boxShadow: `0 0 18px ${theme.colors.glow}` }} />
            {Array.from({ length: 21 }).map((_, i) => {
              const pos = i / 20;
              const on = fill >= pos - 0.001;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    right: `calc(${pos * 100}% - ${i % 5 === 0 ? 9 : 4}px)`,
                    top: i % 5 === 0 ? -4 : 1,
                    width: i % 5 === 0 ? 18 : 8,
                    height: i % 5 === 0 ? 18 : 8,
                    borderRadius: 9,
                    background: on ? (i % 5 === 0 ? "#fff" : theme.colors.pink) : "#2A2A31",
                  }}
                />
              );
            })}
          </div>
          <div dir="rtl" style={{ display: "flex", justifyContent: "space-between", marginTop: 26 }}>
            <Ar size={40} weight={800}>
              اليوم
            </Ar>
            <Ar size={40} weight={800} color={fill > 0.98 ? theme.colors.pink : theme.colors.textDim}>
              بعد 20 سنة
            </Ar>
          </div>
        </div>
        <div style={{ position: "absolute", top: 830, left: 0, right: 0, display: "flex", justifyContent: "center", ...enterStyle(warn.p, warn.o, { x: warn.x }) }}>
          <Ar size={46} weight={800} color={theme.colors.textDim}>
            من حياتك… <span style={{ color: theme.colors.text }}>قد تكون خطأ</span>
          </Ar>
        </div>
      </AbsoluteFill>
    </FullScreen>
  );
};
