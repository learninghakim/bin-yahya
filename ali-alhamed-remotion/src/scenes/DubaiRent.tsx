// Scene 03 — 0:14.5 → 0:28.7 — C (Dubai apartment) → B (rent range) → C (÷12 equation)
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { F, SCENES } from "../data/timing";
import { theme } from "../theme";
import { breathe, enterStyle, popScale, useHit, useLife } from "../components/anim";
import { Icon } from "../components/Icon";
import { FullScreen } from "../components/Stage";
import { Ar, Card, Counter, IconBadge, Kicker, Num, Rule } from "../components/UI";

/* ---------- 03a  شقة في دبي ---------- */
const Skyline: React.FC<{ inSec: number }> = ({ inSec }) => {
  const frame = useCurrentFrame();
  const d = interpolate(frame, [F(inSec), F(inSec + 1.6)], [1, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // simple geometric skyline (Burj-like spire in the middle), stroke-drawn
  const path =
    "M0 300 H120 V210 H180 V250 H240 V160 H300 V300 H360 V190 H400 V120 H440 V190 H480 V300 H540 V230 H600 V300 H650 V140 L672 60 L680 0 L688 60 L710 140 V300 H770 V200 H830 V250 H880 V170 H940 V300 H1000 V240 H1060 V300 H1120 V215 H1170 V300 H1300";
  return (
    <svg width={1300} height={310} viewBox="0 -5 1300 310" style={{ overflow: "visible" }}>
      <path
        d={path}
        fill="none"
        stroke={theme.colors.pink}
        strokeWidth={3}
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={d}
        style={{ filter: `drop-shadow(0 0 8px ${theme.colors.glow})` }}
      />
      <line x1={0} y1={300} x2={1300} y2={300} stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
    </svg>
  );
};

const RoomChip: React.FC<{ inSec: number; label: string; end: number }> = ({ inSec, label, end }) => {
  const { p, o, x } = useLife(inSec, end);
  return (
    <div style={enterStyle(p, o, { x })}>
      <div
        dir="rtl"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 24px 12px",
          borderRadius: 999,
          border: `1.5px solid ${theme.colors.borderStrong}`,
          background: "rgba(12,12,16,0.9)",
        }}
      >
        <Icon name="house" size={28} color={theme.colors.pink} />
        <Ar size={30} weight={700} font="body">
          {label}
        </Ar>
      </div>
    </div>
  );
};

export const DubaiApartment: React.FC = () => {
  const { start, end } = SCENES.s03DubaiApartment;
  return (
    <FullScreen start={start} end={end} glowX={0.5} glowY={0.75}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 310, top: 560 }}>
          <Skyline inSec={start + 0.1} />
        </div>
        <Title start={start} end={end} />
        <div dir="rtl" style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20 }}>
          <RoomChip inSec={17.63} label="غرفة وصالة" end={end} />
          <RoomChip inSec={18.2} label="غرفتين وصالة" end={end} />
        </div>
      </AbsoluteFill>
    </FullScreen>
  );
};

const Title: React.FC<{ start: number; end: number }> = ({ start, end }) => {
  const k = useLife(start + 0.12, end);
  const t1 = useLife(start + 0.2, end);
  const t2 = useLife(16.9, end, { cfg: theme.spring.pop });
  const hit = useHit(16.95, 1.12, 12);
  return (
    <div dir="rtl" style={{ position: "absolute", top: 170, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, ...enterStyle(k.p, k.o, { x: k.x }) }}>
        <Icon name="pin" size={30} color={theme.colors.pink} />
        <Ar size={30} weight={700} font="body" color={theme.colors.textDim}>
          قرار السكن
        </Ar>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
        <div style={enterStyle(t1.p, t1.o, { x: t1.x })}>
          <Ar size={128} weight={900}>
            شقة في
          </Ar>
        </div>
        <div style={{ ...enterStyle(t2.p, t2.o, { x: t2.x, s0: 0.85 }), transform: `${enterStyle(t2.p, t2.o).transform} scale(${hit.s})` }}>
          <Ar size={128} weight={900} color={theme.colors.pink} glow={0.8}>
            دبي
          </Ar>
        </div>
      </div>
    </div>
  );
};

/* ---------- 03b  إيجار سنوي 90,000 → 120,000 (B: presenter panel + data) ---------- */
export const RentRange: React.FC = () => {
  const { start, end } = SCENES.s03RentRange;
  const frame = useCurrentFrame();
  const card = useLife(start + 0.05, end, { cfg: theme.spring.smooth });
  const range = useLife(20.97, end);
  const fill = interpolate(frame, [F(20.97), F(22.2)], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hi = useHit(21.9, 1.1, 12);
  const note = useLife(22.4, end);
  const ic = useLife(start + 0.2, end, { cfg: theme.spring.pop });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 960, top: 190, width: 840, ...enterStyle(card.p, card.o, { x: card.x }) }}>
        <Card pad={44} style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ transform: `scale(${popScale(ic.p) * breathe(frame, 0.012)})` }}>
              <IconBadge size={92}>
                <Icon name="calendar" size={44} color={theme.colors.pink} />
              </IconBadge>
            </div>
            <div>
              <Ar size={58} weight={900}>
                إيجار سنوي
              </Ar>
              <Ar size={26} weight={500} font="body" color={theme.colors.textDim}>
                شقة في دبي
              </Ar>
            </div>
          </div>
          <div style={{ height: 1, background: theme.colors.border }} />
          <div style={{ ...enterStyle(range.p, range.o, { x: range.x }) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ transform: `scale(${hi.s})`, transformOrigin: "left bottom" }}>
                  <Num size={78} color={frame >= F(21.9) ? theme.colors.pink : theme.colors.text} glow={frame >= F(21.9) ? 0.7 : 0}>
                    120,000
                  </Num>
                </div>
                <Ar size={24} weight={500} font="body" color={theme.colors.textDim}>
                  الحد الأعلى
                </Ar>
              </div>
              <Ar size={34} weight={700} color={theme.colors.textDim} style={{ paddingBottom: 30 }}>
                درهم
              </Ar>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <Num size={78}>90,000</Num>
                <Ar size={24} weight={500} font="body" color={theme.colors.textDim}>
                  الحد الأدنى
                </Ar>
              </div>
            </div>
            {/* range track — fills right → left (RTL) */}
            <div style={{ position: "relative", height: 14, marginTop: 22, borderRadius: 7, background: "rgba(255,255,255,0.08)" }}>
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  height: 14,
                  width: `${fill * 100}%`,
                  borderRadius: 7,
                  background: `linear-gradient(270deg, rgba(255,255,255,0.75), ${theme.colors.pink})`,
                  boxShadow: `0 0 18px ${theme.colors.glow}`,
                }}
              />
              {[0, 1].map((i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: -7,
                    [i === 0 ? "right" : "left"]: -6,
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    background: theme.colors.bg,
                    border: `4px solid ${i === 0 ? "#fff" : theme.colors.pink}`,
                    opacity: i === 0 ? 1 : fill,
                  }}
                />
              ))}
            </div>
          </div>
          <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 12, ...enterStyle(note.p, note.o, { x: note.x }) }}>
            <Icon name="pin" size={28} color={theme.colors.textDim} />
            <Ar size={28} weight={500} font="body" color={theme.colors.textDim}>
              حسب المنطقة ونوع العقار
            </Ar>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 03c  120,000 ÷ 12 = 10,000 ---------- */
const Term: React.FC<{ inSec: number; end: number; children: React.ReactNode; label: string; hero?: boolean }> = ({
  inSec,
  end,
  children,
  label,
  hero,
}) => {
  const { p, o, x } = useLife(inSec, end, { cfg: hero ? theme.spring.pop : theme.spring.snappy });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, ...enterStyle(p, o, { x, dx: 0, dy: 26, s0: hero ? 0.8 : 0.92 }) }}>
      {children}
      <Ar size={32} weight={700} font="body" color={hero ? theme.colors.pink : theme.colors.textDim}>
        {label}
      </Ar>
    </div>
  );
};

const Op: React.FC<{ inSec: number; end: number; children: string }> = ({ inSec, end, children }) => {
  const { p, o, x } = useLife(inSec, end, { cfg: theme.spring.pop });
  return (
    <div style={{ opacity: o, transform: `scale(${popScale(p)}) translateY(${x * -10}px)`, paddingBottom: 54 }}>
      <Num size={96} weight={700} color={theme.colors.textDim}>
        {children}
      </Num>
    </div>
  );
};

export const MonthlyEquation: React.FC = () => {
  const { start, end } = SCENES.s03MonthlyEquation;
  const frame = useCurrentFrame();
  const k = useLife(start + 0.15, end);
  return (
    <FullScreen start={start} end={end} glowX={0.72} glowY={0.5}>
      <AbsoluteFill>
        <div dir="rtl" style={{ position: "absolute", top: 210, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={enterStyle(k.p, k.o, { x: k.x })}>
            <Ar size={64} weight={900}>
              كم تدفع شهريًا؟
            </Ar>
          </div>
          <Rule inSec={start + 0.3} />
        </div>
        <div dir="ltr" style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 46 }}>
          <Term inSec={start + 0.25} end={end} label="سنويًا">
            <Counter to={120000} startSec={start + 0.25} durSec={0.8} size={124} />
          </Term>
          <Op inSec={25.7} end={end}>÷</Op>
          <Term inSec={25.8} end={end} label="شهرًا">
            <Num size={124}>12</Num>
          </Term>
          <Op inSec={26.25} end={end}>=</Op>
          <Term inSec={26.35} end={end} label="درهم شهريًا" hero>
            <div style={{ transform: `scale(${breathe(frame, 0.01)})` }}>
              <Counter to={10000} startSec={26.35} durSec={0.6} size={150} color={theme.colors.pink} glow={0.9} />
            </div>
          </Term>
        </div>
      </AbsoluteFill>
    </FullScreen>
  );
};
