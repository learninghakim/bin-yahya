// Scene 05 — 0:49.9 → 1:06.6 — PATTERN INTERRUPT «وقف!» → reality check → cost stack (B) → «وقف، وقف»
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { F, SCENES } from "../data/timing";
import { glowText, theme } from "../theme";
import { breathe, enterStyle, popScale, useHit, useLife } from "../components/anim";
import { Icon, IconName } from "../components/Icon";
import { Flash, FullScreen } from "../components/Stage";
import { Ar, Card, Counter, IconBadge, Kicker, Num } from "../components/UI";

/* ---------- 05a  وقف! ---------- */
export const StopInterrupt: React.FC = () => {
  const { start, end } = SCENES.s05Stop;
  const frame = useCurrentFrame();
  const t = frame - F(start);
  // slam: 1.35 → 0.97 → 1.0 within ~7 frames, then a second hit on the 2nd «وقف»
  const slam = interpolate(t, [0, 4, 7], [1.35, 0.97, 1], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hit2 = useHit(50.75, 1.06, 10);
  const sub = useLife(50.8, end);
  const lines = interpolate(t, [0, 10], [0, 1], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <FullScreen start={start} end={end} enter="cut" glowX={0.5} glowY={0.5}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          {/* hard frame rules */}
          {[-1, 1].map((d) => (
            <div
              key={d}
              style={{
                position: "absolute",
                top: 540 + d * 250,
                left: 960 - 560 * lines,
                width: 1120 * lines,
                height: 3,
                background: d < 0 ? theme.colors.pink : "rgba(255,255,255,0.3)",
                boxShadow: d < 0 ? `0 0 16px ${theme.colors.glow}` : undefined,
              }}
            />
          ))}
          <div style={{ transform: `scale(${slam * hit2.s})` }}>
            <Ar size={300} weight={900} color={theme.colors.pink} style={{ textShadow: glowText(1.4), lineHeight: 1.1 }}>
              وقف!
            </Ar>
          </div>
          <div style={{ position: "absolute", top: 820, ...enterStyle(sub.p, sub.o, { x: sub.x }) }}>
            <Ar size={40} weight={700} font="body" color={theme.colors.textDim}>
              وقف شوي…
            </Ar>
          </div>
        </AbsoluteFill>
      </FullScreen>
      <Flash at={start} frames={2} strength={0.5} />
    </>
  );
};

/* ---------- 05b  1.2 مليون؟ وين موجودة؟ → ≈ 2 مليون ---------- */
export const RealityCheck: React.FC = () => {
  const { start, end } = SCENES.s05Reality;
  const frame = useCurrentFrame();
  const q = useLife(start + 0.05, end);
  const where = useLife(52.55, end);
  const strike = interpolate(frame, [F(53.67), F(54.0)], [0, 1], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dim = interpolate(frame, [F(53.67), F(54.1)], [1, 0.38], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lbl = useLife(53.75, end);
  const two = useLife(55.0, end, { cfg: theme.spring.pop });
  const hit = useHit(55.05, 1.12, 12);
  return (
    <FullScreen start={start} end={end} enter="cut" glowX={0.5} glowY={0.66}>
      <AbsoluteFill>
        <div dir="rtl" style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: dim }}>
          <div style={{ position: "relative", ...enterStyle(q.p, q.o, { x: q.x }) }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
              <Ar size={70} weight={800}>
                شقة بـ
              </Ar>
              <Num size={120}>1,200,000</Num>
              <Ar size={90} weight={900} color={theme.colors.pink}>
                ؟
              </Ar>
            </div>
            {/* strike-through */}
            <div
              style={{
                position: "absolute",
                top: "54%",
                right: 0,
                height: 8,
                width: `${strike * 100}%`,
                borderRadius: 4,
                background: theme.colors.pink,
                boxShadow: `0 0 16px ${theme.colors.glow}`,
              }}
            />
          </div>
          <div style={enterStyle(where.p, where.o, { x: where.x })}>
            <Ar size={52} weight={800} color={theme.colors.textDim}>
              وين موجودة أصلًا؟
            </Ar>
          </div>
        </div>
        <div style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={enterStyle(lbl.p, lbl.o, { x: lbl.x })}>
            <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Icon name="building" size={36} color={theme.colors.pink} />
              <Ar size={38} weight={700} font="body">
                غالب العقار اللي يناسبك
              </Ar>
            </div>
          </div>
          <div style={{ opacity: two.o, transform: `scale(${popScale(two.p) * hit.s})` }}>
            <div dir="ltr" style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
              <Num size={110} weight={700} color={theme.colors.textDim}>
                ≈
              </Num>
              <Counter from={1200000} to={2000000} startSec={55.0} durSec={0.7} size={168} color={theme.colors.pink} glow={1} />
            </div>
          </div>
          <div style={{ opacity: two.o * 0.95 }}>
            <Ar size={40} weight={800}>
              <span style={{ color: theme.colors.pink }}>2</span> مليون درهم
            </Ar>
          </div>
        </div>
      </AbsoluteFill>
    </FullScreen>
  );
};

/* ---------- 05c  Cost stack (B: presenter panel left) ---------- */
const CostRow: React.FC<{
  inSec: number;
  end: number;
  icon: IconName;
  plus?: boolean;
  value?: string;
  title: string;
  sub?: string;
  activeTo: number;
}> = ({ inSec, end, icon, plus, value, title, sub, activeTo }) => {
  const frame = useCurrentFrame();
  const { p, o, x } = useLife(inSec, end);
  const ic = useLife(inSec, end, { delay: 3, cfg: theme.spring.pop });
  const active = frame >= F(inSec) && frame < F(activeTo);
  const hit = useHit(inSec + 0.12, 1.06, 10);
  return (
    <div style={{ ...enterStyle(p, o, { x, dx: 0, dy: -26, s0: 0.94 }), transform: `${enterStyle(p, o, { x, dx: 0, dy: -26, s0: 0.94 }).transform} scale(${hit.s})` }}>
      <Card active={active} pad={20} style={{ display: "flex", alignItems: "center", gap: 22, opacity: active ? 1 : 0.9 }}>
        <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 22, flex: 1 }}>
          {plus && (
            <Num size={52} weight={800} color={active ? theme.colors.pink : theme.colors.textDim}>
              +
            </Num>
          )}
          <div style={{ opacity: ic.o, transform: `scale(${popScale(ic.p)})` }}>
            <IconBadge size={78} active={active} dim={!active}>
              <Icon name={icon} size={38} color={active ? theme.colors.pink : theme.colors.textDim} />
            </IconBadge>
          </div>
          <div style={{ flex: 1 }}>
            <Ar size={40} weight={800}>
              {title}
            </Ar>
            {sub && (
              <Ar size={24} weight={500} font="body" color={theme.colors.textDim}>
                {sub}
              </Ar>
            )}
          </div>
          {value && (
            <Num size={value.length > 5 ? 54 : 66} color={active ? theme.colors.pink : theme.colors.text} glow={active ? 0.6 : 0}>
              {value}
            </Num>
          )}
        </div>
      </Card>
    </div>
  );
};

export const CostStack: React.FC = () => {
  const { start, end } = SCENES.s05CostStack;
  const head = useLife(start + 0.05, end);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 950, top: 200, width: 850, display: "flex", flexDirection: "column", gap: 18 }}>
        <div dir="rtl" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, ...enterStyle(head.p, head.o, { x: head.x }) }}>
          <Ar size={58} weight={900}>
            غير سعر الشقة…
          </Ar>
          <Kicker inSec={start + 0.15} outSec={end} ghost>
            تكاليف الشراء
          </Kicker>
        </div>
        <CostRow inSec={start} end={end} icon="building" value="2,000,000" title="سعر العقار" sub="درهم" activeTo={58.2} />
        <CostRow inSec={58.2} end={end} icon="percent" plus value="4%" title="دائرة الأراضي والأملاك" sub="في دبي" activeTo={60.9} />
        <CostRow inSec={60.9} end={end} icon="wrench" plus title="رسوم صيانة" activeTo={63.35} />
        <CostRow inSec={63.35} end={end} icon="handshake" plus value="2%" title="للبروكر" sub="عمولة الوسيط" activeTo={99} />
        <div style={{ height: 3, marginTop: 6, borderRadius: 2, background: theme.colors.border }} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 05d  «وقف، وقف» (A punch-in) ---------- */
export const StopAgain: React.FC = () => {
  const { start, end } = SCENES.s05Stop2;
  const { p, o, x } = useLife(start, end, { cfg: theme.spring.pop, exit: 4 });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", right: theme.safe.x + 20, top: 380, opacity: o, transform: `scale(${popScale(p)}) translateY(${x * -12}px)` }}>
        <Ar size={130} weight={900} color={theme.colors.pink} style={{ textShadow: glowText(1.1) }}>
          وقف
        </Ar>
      </div>
    </AbsoluteFill>
  );
};
