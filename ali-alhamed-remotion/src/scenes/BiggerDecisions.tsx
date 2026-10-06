// Scene 02 — 0:08.4 → 0:14.5 — A → BAND: decision growth  قرارات أكبر → عائلة → مكان محترم
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { F, SCENES } from "../data/timing";
import { theme } from "../theme";
import { breathe, enterStyle, popScale, useLife } from "../components/anim";
import { Icon, IconName } from "../components/Icon";
import { Ar, IconBadge } from "../components/UI";

const END = SCENES.s02BiggerDecisions.end;

/** Thin rules on the cinematic band edges (shared with the outro). */
export const BandEdges: React.FC<{ inSec: number; outSec: number }> = ({ inSec, outSec }) => {
  const { o } = useLife(inSec, outSec, { cfg: theme.spring.smooth });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {[189, 830].map((y) => (
        <div key={y} style={{ position: "absolute", left: 0, right: 0, top: y, height: 1.5, background: "rgba(255,255,255,0.14)" }} />
      ))}
    </AbsoluteFill>
  );
};

const Step: React.FC<{ inSec: number; icon: IconName; label: string; activeFrom: number; activeTo: number; size: number }> = ({
  inSec,
  icon,
  label,
  activeFrom,
  activeTo,
  size,
}) => {
  const frame = useCurrentFrame();
  const { p, o, x } = useLife(inSec, END);
  const ic = useLife(inSec, END, { cfg: theme.spring.pop });
  const active = frame >= F(activeFrom) && frame < F(activeTo);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, flexDirection: "row-reverse", ...enterStyle(p, o, { x }) }}>
      <div style={{ transform: `scale(${popScale(ic.p) * (active ? breathe(frame, 0.02) : 1)})` }}>
        <IconBadge size={size} active={active} dim={!active}>
          <Icon name={icon} size={size * 0.48} color={active ? theme.colors.pink : theme.colors.textDim} />
        </IconBadge>
      </div>
      <Ar size={42} weight={800} color={active ? theme.colors.text : theme.colors.textDim}>
        {label}
      </Ar>
    </div>
  );
};

const Connector: React.FC<{ inSec: number }> = ({ inSec }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [F(inSec) - 6, F(inSec) + 2], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const { x } = useLife(inSec, END);
  return (
    <div style={{ width: 120, height: 3, display: "flex", justifyContent: "flex-end", opacity: 1 - x }}>
      <div style={{ width: `${w * 100}%`, height: 3, borderRadius: 2, background: theme.colors.pink, boxShadow: `0 0 12px ${theme.colors.glow}` }} />
    </div>
  );
};

export const BiggerDecisions: React.FC = () => (
  <AbsoluteFill>
    <BandEdges inSec={9.95} outSec={END} />
    {/* top bar label */}
    <div style={{ position: "absolute", top: 70, right: theme.safe.x }}>
      <TopLabel />
    </div>
    <div
      dir="rtl"
      style={{
        position: "absolute",
        top: 862,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 34,
      }}
    >
      <Step inSec={10.1} icon="growth" label="قرارات أكبر" activeFrom={10.1} activeTo={11.73} size={92} />
      <Connector inSec={11.73} />
      <Step inSec={11.73} icon="family" label="عائلة" activeFrom={11.73} activeTo={13.03} size={92} />
      <Connector inSec={13.03} />
      <Step inSec={13.03} icon="house" label="مكان محترم" activeFrom={13.03} activeTo={99} size={92} />
    </div>
  </AbsoluteFill>
);

const TopLabel: React.FC = () => {
  const { p, o, x } = useLife(10.0, END);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, flexDirection: "row-reverse", ...enterStyle(p, o, { x }) }}>
      <div style={{ width: 10, height: 10, borderRadius: 5, background: theme.colors.pink, boxShadow: `0 0 12px ${theme.colors.glow}` }} />
      <Ar size={30} weight={700} font="body" color={theme.colors.textDim}>
        القرارات المالية تكبر
      </Ar>
    </div>
  );
};
