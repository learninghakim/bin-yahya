// Scene 10 — 1:51.2 → 2:02.5 — presenter-led: framed source card + lower third + stats
// Scene 11 — 2:02.5 → end — cinematic band: «الاستثمار الحلال» → اشترك / تابعني → clean ending
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SCENES } from "../data/timing";
import { theme } from "../theme";
import { enterStyle, popScale, useHit, useLife } from "../components/anim";
import { Icon, IconName } from "../components/Icon";
import { Ar, Card, Counter, IconBadge, Rule } from "../components/UI";
import { BandEdges } from "./BiggerDecisions";

const Stat: React.FC<{ inSec: number; end: number; to: number; label: string; icon: IconName }> = ({ inSec, end, to, label, icon }) => {
  const { p, o, x } = useLife(inSec, end);
  const ic = useLife(inSec, end, { delay: 3, cfg: theme.spring.pop });
  const hit = useHit(inSec + 0.6, 1.06, 10);
  return (
    <div style={{ ...enterStyle(p, o, { x, dx: 0, dy: 24 }), flex: 1 }}>
      <Card pad={22} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
        <div style={{ opacity: ic.o, transform: `scale(${popScale(ic.p)})` }}>
          <Icon name={icon} size={40} color={theme.colors.pink} />
        </div>
        <div style={{ transform: `scale(${hit.s})`, transformOrigin: "right center" }}>
          <Counter to={to} startSec={inSec} durSec={0.8} size={58} prefix="+" />
        </div>
        <Ar size={28} weight={700} font="body" color={theme.colors.textDim}>
          {label}
        </Ar>
      </Card>
    </div>
  );
};

export const AliIntro: React.FC = () => {
  const { start, end } = SCENES.s10AliIntro;
  const name = useLife(start + 0.05, end);
  const role = useLife(111.65, end);
  const lic = useLife(113.3, end);
  const halal = useLife(121.25, end, { cfg: theme.spring.smooth });
  const ic = useLife(121.25, end, { delay: 3, cfg: theme.spring.pop });
  return (
    <AbsoluteFill>
      <div dir="rtl" style={{ position: "absolute", right: 110, top: 220, width: 560, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* lower third */}
        <div style={enterStyle(name.p, name.o, { x: name.x })}>
          <Ar size={84} weight={900}>
            علي الحامد
          </Ar>
        </div>
        <Rule inSec={start + 0.2} width={110} outSec={end} />
        <div style={enterStyle(role.p, role.o, { x: role.x })}>
          <Ar size={42} weight={800}>
            مؤثر مالي <span style={{ color: theme.colors.pink }}>مرخّص</span>
          </Ar>
        </div>
        <div style={{ ...enterStyle(lic.p, lic.o, { x: lic.x }), display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="shield" size={30} color={theme.colors.textDim} />
          <Ar size={27} weight={500} font="body" color={theme.colors.textDim}>
            من هيئة سوق المال في دبي — الإمارات
          </Ar>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 22 }}>
          <Stat inSec={116.5} end={end} to={40000} label="مستثمر" icon="growth" />
          <Stat inSec={117.8} end={end} to={5000} label="متدرّب" icon="users" />
        </div>
        <div style={{ ...enterStyle(halal.p, halal.o, { x: halal.x }), marginTop: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 24px 16px",
              borderRadius: 18,
              border: `1.5px solid ${theme.colors.pink}`,
              background: "rgba(12,12,16,0.92)",
              boxShadow: `0 0 30px -8px ${theme.colors.glow}`,
            }}
          >
            <div style={{ opacity: ic.o, transform: `scale(${popScale(ic.p)})` }}>
              <IconBadge size={56}>
                <Icon name="check" size={28} color={theme.colors.pink} stroke={2.6} />
              </IconBadge>
            </div>
            <Ar size={34} weight={800}>
              استثمار متوافق مع الشريعة
            </Ar>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Outro: React.FC = () => {
  const { start, end } = SCENES.s11Outro;
  const goal = useLife(123.67, 125.7);
  const halal = useLife(124.57, 125.7, { cfg: theme.spring.pop });
  const sub = useLife(127.7, 130.15, { cfg: theme.spring.pop });
  const follow = useLife(128.55, 130.15);
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <BandEdges inSec={start + 0.1} outSec={end + 1} />
      {/* bottom bar content (y 830–1080), RTL */}
      <div dir="rtl" style={{ position: "absolute", top: 880, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
        {frame < 125.75 * 30 && (
          <>
            <div style={enterStyle(goal.p, goal.o, { x: goal.x })}>
              <Ar size={44} weight={700} color={theme.colors.textDim}>
                هدفي: نشر فكر الاستثمار
              </Ar>
            </div>
            <div style={{ opacity: halal.o, transform: `scale(${popScale(halal.p)})` }}>
              <Ar size={56} weight={900} color={theme.colors.pink} glow={0.7}>
                بالطريقة الحلال
              </Ar>
            </div>
          </>
        )}
        {frame >= 127.5 * 30 && frame < 130.3 * 30 && (
          <>
            <div style={{ opacity: sub.o, transform: `scale(${popScale(sub.p)})` }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "10px 34px 14px 28px",
                  borderRadius: 999,
                  background: theme.colors.pink,
                  boxShadow: `0 0 34px -6px ${theme.colors.glow}`,
                }}
              >
                <svg width={26} height={26} viewBox="0 0 24 24">
                  <path d="M8 5.5v13l10.5-6.5z" fill="#fff" />
                </svg>
                <Ar size={44} weight={900}>
                  اشترك في القناة
                </Ar>
              </div>
            </div>
            <div style={enterStyle(follow.p, follow.o, { x: follow.x })}>
              <Ar size={38} weight={700} font="body" color={theme.colors.textDim}>
                وتابعني على باقي الحسابات
              </Ar>
            </div>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};
