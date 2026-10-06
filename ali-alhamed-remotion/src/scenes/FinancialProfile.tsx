// Scene 01 — 0:00 → 0:08.4 — A: presenter + three data cards (staggered to audio)
import React from "react";
import { AbsoluteFill } from "remotion";
import { F, SCENES } from "../data/timing";
import { theme } from "../theme";
import { breathe, enterStyle, popScale, useHit, useLife } from "../components/anim";
import { Icon, IconName } from "../components/Icon";
import { Ar, Card, IconBadge, Num } from "../components/UI";

const END = SCENES.s01FinancialProfile.end - 0.05;

const DataRow: React.FC<{
  inSec: number;
  hitSec: number;
  icon: IconName;
  value: React.ReactNode;
  label: string;
  activeUntil: number;
}> = ({ inSec, hitSec, icon, value, label, activeUntil }) => {
  const { p, o, x, frame } = useLife(inSec, END);
  const ic = useLife(inSec, END, { delay: 3, cfg: theme.spring.pop });
  const hit = useHit(hitSec, 1.1, 12);
  return (
    <div style={{ ...enterStyle(p, o, { x }) }}>
      <Card active={hit.k > 0 && frame < F(activeUntil)} pad={22} style={{ display: "flex", alignItems: "center", gap: 22, flexDirection: "row-reverse" }}>
        <div style={{ transform: `scale(${popScale(ic.p) * breathe(frame, 0.015)})`, opacity: ic.o }}>
          <IconBadge size={86}>
            <Icon name={icon} size={42} color={theme.colors.pink} />
          </IconBadge>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <div style={{ transform: `scale(${hit.s})`, transformOrigin: "right center" }}>{value}</div>
          <Ar size={26} weight={500} font="body" color={theme.colors.textDim}>
            {label}
          </Ar>
        </div>
      </Card>
    </div>
  );
};

const GoodStatus: React.FC = () => {
  const { p, o, x } = useLife(6.85, END);
  const ic = useLife(6.85, END, { delay: 4, cfg: theme.spring.pop });
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", ...enterStyle(p, o, { x }) }}>
      <div
        dir="rtl"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "12px 26px 14px 20px",
          borderRadius: 999,
          border: `1.5px solid ${theme.colors.pink}`,
          background: "rgba(10,10,14,0.92)",
          boxShadow: `0 0 26px -6px ${theme.colors.glow}`,
        }}
      >
        <div style={{ transform: `scale(${popScale(ic.p)})`, opacity: ic.o }}>
          <IconBadge size={44}>
            <Icon name="check" size={24} color={theme.colors.pink} stroke={2.6} />
          </IconBadge>
        </div>
        <Ar size={34} weight={800}>
          وضع مالي جيد
        </Ar>
      </div>
    </div>
  );
};

export const FinancialProfile: React.FC = () => {
  const panel = useLife(0.15, END, { cfg: theme.spring.smooth });
  return (
    <AbsoluteFill>
      {/* backing panel: keeps the column solid (also hides the source's own badge) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 190,
          width: 630,
          height: 590,
          borderRadius: "0 26px 26px 0",
          background: "linear-gradient(180deg, #0A0A0E, #07070A)",
          borderRight: `1.5px solid ${theme.colors.border}`,
          borderTop: `1px solid ${theme.colors.border}`,
          borderBottom: `1px solid ${theme.colors.border}`,
          ...enterStyle(panel.p, panel.o, { dx: -60, x: panel.x, s0: 1 }),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 214,
          width: 500,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <DataRow
          inSec={0.3}
          hitSec={1.1}
          icon="wallet"
          value={
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexDirection: "row-reverse" }}>
              <Num size={62}>40,000</Num>
              <Ar size={32} weight={700} color={theme.colors.pink}>
                درهم
              </Ar>
            </div>
          }
          label="الدخل الشهري"
          activeUntil={2.6}
        />
        <DataRow
          inSec={2.6}
          hitSec={3.1}
          icon="coins"
          value={
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexDirection: "row-reverse" }}>
              <Num size={62}>$10,000</Num>
            </div>
          }
          label="تقريبًا شهريًا"
          activeUntil={4.7}
        />
        <DataRow
          inSec={4.7}
          hitSec={5.2}
          icon="bank"
          value={
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexDirection: "row-reverse" }}>
              <Num size={62}>200,000</Num>
              <Ar size={32} weight={700} color={theme.colors.pink}>
                درهم
              </Ar>
            </div>
          }
          label="في البنك"
          activeUntil={6.85}
        />
      </div>
      <div style={{ position: "absolute", left: 100, top: 806, width: 500 }}>
        <GoodStatus />
      </div>
    </AbsoluteFill>
  );
};
