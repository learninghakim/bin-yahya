// Scene 04 — 0:28.7 → 0:49.9 — A → C (landlord quote) → A → C (120k × 10 = 1.2M) → A (اشتري؟)
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { F, SCENES } from "../data/timing";
import { theme } from "../theme";
import { breathe, enterStyle, popScale, useHit, useLife } from "../components/anim";
import { Icon } from "../components/Icon";
import { FullScreen } from "../components/Stage";
import { Ar, Card, Counter, IconBadge, Kicker, Num, Rule, SideKeyword } from "../components/UI";

/* ---------- 04b  «يا ريال حرام عليك» — 120,000 → المالك ---------- */
export const Landlord: React.FC = () => {
  const { start, end } = SCENES.s04Landlord;
  const frame = useCurrentFrame();
  const q = useLife(start + 0.1, end);
  const mark = useLife(start + 0.05, end, { cfg: theme.spring.pop });
  const flow = useLife(32.5, end, { cfg: theme.spring.smooth });
  const arrow = interpolate(frame, [F(33.6), F(34.2)], [0, 1], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const owner = useLife(34.13, end, { cfg: theme.spring.pop });
  const hit = useHit(34.2, 1.08, 12);
  return (
    <FullScreen start={start} end={end} glowX={0.5} glowY={0.68}>
      <AbsoluteFill>
        <div style={{ position: "absolute", top: 120, right: 200 }}>
          <Kicker inSec={start + 0.1} outSec={end}>
            النصيحة المعتادة
          </Kicker>
        </div>
        <div dir="rtl" style={{ position: "absolute", top: 200, right: 200, display: "flex", alignItems: "flex-start", gap: 26 }}>
          <div style={{ opacity: mark.o, transform: `scale(${popScale(mark.p)})` }}>
            <Ar size={170} weight={900} color={theme.colors.pink} glow={0.6} style={{ lineHeight: 0.9 }}>
              ”
            </Ar>
          </div>
          <div style={enterStyle(q.p, q.o, { x: q.x })}>
            <Ar size={104} weight={900}>
              يا ريال، <span style={{ color: theme.colors.pink }}>حرام عليك!</span>
            </Ar>
          </div>
        </div>
        {/* money flow: wallet 120,000 → landlord */}
        <div style={{ position: "absolute", top: 560, left: 0, right: 0, display: "flex", justifyContent: "center", ...enterStyle(flow.p, flow.o, { x: flow.x, dx: 0, dy: 30 }) }}>
          <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <Card pad={30} style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <IconBadge size={86}>
                <Icon name="wallet" size={42} color={theme.colors.pink} />
              </IconBadge>
              <div>
                <Num size={78}>120,000</Num>
                <Ar size={26} weight={500} font="body" color={theme.colors.textDim}>
                  درهم كل سنة
                </Ar>
              </div>
            </Card>
            {/* arrow (RTL: right → left) */}
            <svg width={200} height={40} viewBox="0 0 200 40" style={{ overflow: "visible" }}>
              <line x1={196} y1={20} x2={196 - 180 * arrow} y2={20} stroke={theme.colors.pink} strokeWidth={4} strokeLinecap="round" />
              <path d={`M${26 + 180 * (1 - arrow)} 6 L${10 + 180 * (1 - arrow)} 20 L${26 + 180 * (1 - arrow)} 34`} stroke={theme.colors.pink} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={arrow} />
            </svg>
            <div style={{ opacity: owner.o, transform: `scale(${popScale(owner.p) * hit.s})` }}>
              <Card active pad={30} style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <IconBadge size={86}>
                  <Icon name="key" size={42} color={theme.colors.pink} />
                </IconBadge>
                <Ar size={58} weight={900}>
                  للمالك
                </Ar>
              </Card>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </FullScreen>
  );
};

/* ---------- 04c  «خذ لك بيت عن طريق التمويل» (A + side keyword) ---------- */
export const FinanceAdvice: React.FC = () => {
  const ic = useLife(36.4, 39.3, { cfg: theme.spring.pop });
  return (
    <AbsoluteFill>
      <SideKeyword inSec={36.35} outSec={39.3} side="right" top={330} width={470}>
        <div style={{ opacity: ic.o, transform: `scale(${popScale(ic.p)})` }}>
          <IconBadge size={84}>
            <Icon name="bank" size={40} color={theme.colors.pink} />
          </IconBadge>
        </div>
        <Ar size={64} weight={900}>
          خذ لك بيت
        </Ar>
        <Ar size={64} weight={900} color={theme.colors.pink} glow={0.5}>
          بالتمويل
        </Ar>
        <Ar size={28} weight={500} font="body" color={theme.colors.textDim}>
          «وريّح نفسك»
        </Ar>
      </SideKeyword>
    </AbsoluteFill>
  );
};

/* ---------- 04d  120,000 × 10 سنوات = 1,200,000 ---------- */
const YearBlocks: React.FC<{ from: number; to: number; out: number }> = ({ from, to, out }) => {
  const frame = useCurrentFrame();
  const { o } = useLife(from - 0.1, out);
  return (
    <div dir="rtl" style={{ display: "flex", gap: 12, opacity: o }}>
      {Array.from({ length: 10 }).map((_, i) => {
        const at = F(from) + ((F(to) - F(from)) / 10) * i;
        const on = interpolate(frame, [at, at + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 74,
                height: 74,
                borderRadius: 12,
                border: `2px solid ${on > 0.5 ? theme.colors.pink : theme.colors.border}`,
                background: on > 0.5 ? "rgba(255,26,108,0.14)" : "rgba(255,255,255,0.03)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${0.85 + 0.15 * on})`,
                boxShadow: on > 0.5 ? `0 0 18px -4px ${theme.colors.glow}` : undefined,
              }}
            >
              <Num size={30} weight={800} color={on > 0.5 ? theme.colors.text : theme.colors.textMute}>
                {i + 1}
              </Num>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const TenYears: React.FC = () => {
  const { start, end } = SCENES.s04TenYears;
  const frame = useCurrentFrame();
  const t1 = useLife(start + 0.2, end);
  const x = useLife(41.0, end, { cfg: theme.spring.pop });
  const t2 = useLife(41.1, end);
  const eq = useLife(42.1, end, { cfg: theme.spring.pop });
  const res = useLife(42.2, end, { cfg: theme.spring.pop });
  const house = useLife(44.07, end, { cfg: theme.spring.pop });
  const hit = useHit(42.9, 1.08, 14);
  return (
    <FullScreen start={start} end={end} glowX={0.5} glowY={0.45}>
      <AbsoluteFill>
        <div dir="rtl" style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <Kicker inSec={start + 0.1} outSec={end} ghost>
            حسبة الإيجار
          </Kicker>
        </div>
        <div dir="ltr" style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", ...enterStyle(t1.p, t1.o, { x: t1.x, dx: 0, dy: 24 }) }}>
            <Num size={118}>120,000</Num>
            <Ar size={30} weight={700} font="body" color={theme.colors.textDim}>
              درهم سنويًا
            </Ar>
          </div>
          <div style={{ opacity: x.o, transform: `scale(${popScale(x.p)})` }}>
            <Num size={104} weight={700} color={theme.colors.textDim}>
              ×
            </Num>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", ...enterStyle(t2.p, t2.o, { x: t2.x, dx: 0, dy: 24 }) }}>
            <Num size={118}>10</Num>
            <Ar size={30} weight={700} font="body" color={theme.colors.textDim}>
              سنوات
            </Ar>
          </div>
          <div style={{ opacity: eq.o, transform: `scale(${popScale(eq.p)})` }}>
            <Num size={104} weight={700} color={theme.colors.textDim}>
              =
            </Num>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: res.o, transform: `scale(${popScale(res.p) * hit.s})` }}>
            <Counter from={120000} to={1200000} startSec={42.2} durSec={0.75} size={132} color={theme.colors.pink} glow={0.9} />
            <Ar size={30} weight={700} font="body" color={theme.colors.pink}>
              مليون ومئتين ألف درهم
            </Ar>
          </div>
        </div>
        <div style={{ position: "absolute", top: 560, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <YearBlocks from={39.6} to={41.9} out={44.0} />
        </div>
        {/* «كنت تقدر تاخذ فيها شقة» */}
        <div style={{ position: "absolute", top: 600, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: house.o, transform: `scale(${popScale(house.p)})` }}>
          <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ transform: `scale(${breathe(frame, 0.015)})` }}>
              <IconBadge size={150}>
                <Icon name="house" size={78} color={theme.colors.pink} glow />
              </IconBadge>
            </div>
            <div>
              <Ar size={60} weight={900}>
                = شقة؟
              </Ar>
              <Ar size={28} weight={500} font="body" color={theme.colors.textDim}>
                «كنت تقدر تاخذ فيها شقة»
              </Ar>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Rule inSec={start + 0.3} width={120} />
        </div>
      </AbsoluteFill>
    </FullScreen>
  );
};

/* ---------- 04e  «بتفكير منطقي كلامهم صح» → «روح على طول اشتري» ---------- */
export const BuyChip: React.FC = () => {
  const chip = useLife(48.6, 49.93, { cfg: theme.spring.pop, exit: 4 });
  return (
    <AbsoluteFill>
      <SideKeyword inSec={45.5} outSec={48.5} side="right" top={360} width={460}>
        <Ar size={32} weight={600} font="body" color={theme.colors.textDim}>
          بتفكير منطقي…
        </Ar>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexDirection: "row-reverse" }}>
          <Ar size={66} weight={900}>
            كلامهم صح
          </Ar>
          <Icon name="check" size={52} color={theme.colors.pink} stroke={2.6} />
        </div>
      </SideKeyword>
      {/* decision chip — pink, but framed as a question (the next line flips it) */}
      <div
        style={{
          position: "absolute",
          right: theme.safe.x + 10,
          top: 420,
          opacity: chip.o,
          transform: `scale(${popScale(chip.p)})`,
          transformOrigin: "right center",
        }}
      >
        <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              padding: "14px 40px 20px",
              borderRadius: 999,
              background: theme.colors.pink,
              boxShadow: `0 0 50px -6px ${theme.colors.glow}`,
            }}
          >
            <Ar size={70} weight={900}>
              اشتري؟
            </Ar>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
