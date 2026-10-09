import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { Ring, Sparks } from "../../../shared/components/Chalk";
import { Cursor } from "../../../shared/components/Icons";
import { CLAMP, useBreath, useProgress, useSeconds, useSpringAt } from "../../../shared/components/motion";
import { Paper } from "../../../shared/components/Paper";
import { paperNoise } from "../../../shared/components/textures";

const { colors, fonts } = theme;
const BTN = { w: 800, h: 180, y: 820 };

/** 18–20s: one clear call to action, a click, and the handle. */
export const Scene4Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useSeconds();

  const btnIn = useSpringAt(s(0.03), theme.spring.bouncy);
  const clickAt = s(0.9);
  const cursorMove = useProgress(s(0.25), s(0.6), theme.ease.out);
  const press = useSpringAt(clickAt, theme.spring.snappy);
  const pressDip = interpolate(frame, [clickAt - 2, clickAt + 1, clickAt + 6], [0, 1, 0], {
    ...CLAMP,
    easing: theme.ease.inOut,
  });
  const ripple = useProgress(clickAt, s(0.6));
  const handleIn = useSpringAt(s(0.45), theme.spring.bouncy);
  const glow = 0.75 + 0.25 * Math.sin(frame / 8);
  const float = useBreath(24, 4);

  return (
    <AbsoluteFill>
      {/* Ripple ring from the click */}
      <div
        style={{
          position: "absolute",
          left: 540 - BTN.w / 2,
          top: BTN.y,
          width: BTN.w,
          height: BTN.h,
          borderRadius: BTN.h / 2,
          border: `5px solid ${colors.teal}`,
          opacity: ripple > 0 ? (1 - ripple) * 0.9 : 0,
          transform: `scale(${1 + ripple * 0.22})`,
        }}
      />

      {/* CTA button */}
      <div
        style={{
          position: "absolute",
          left: 540 - BTN.w / 2,
          top: BTN.y + float,
          width: BTN.w,
          height: BTN.h,
          borderRadius: BTN.h / 2,
          background: `linear-gradient(180deg, ${colors.teal}, ${colors.tealDeep})`,
          boxShadow: `0 0 ${70 * glow}px ${colors.tealGlow}, 0 24px 40px rgba(0,0,0,0.45), inset 0 -8px 0 rgba(0,0,0,0.15)`,
          border: `6px solid ${colors.paper}`,
          display: "flex",
          direction: "rtl",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          overflow: "hidden",
          opacity: Math.min(1, btnIn * 1.6),
          transform: `translateY(${interpolate(btnIn, [0, 1], [90, 0])}px) scale(${interpolate(btnIn, [0, 1], [0.7, 1]) - pressDip * 0.05})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: paperNoise,
            backgroundSize: "260px",
            mixBlendMode: "multiply",
            opacity: 0.35,
          }}
        />
        <span
          style={{
            position: "relative",
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: 80,
            color: colors.chalk,
            marginTop: -10,
          }}
        >
          ابدأ رحلتك الآن
        </span>
        <svg width={64} height={64} viewBox="0 0 64 64" style={{ position: "relative" }}>
          <path
            d="M40 14 L22 32 L40 50"
            fill="none"
            stroke={colors.chalk}
            strokeWidth={9}
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`translate(${-6 * press} 0)`}
          />
        </svg>
      </div>

      <Sparks x={540 - BTN.w / 2 - 10} y={BTN.y + 20} delay={clickAt + 1} angle={-135} size={70} color={colors.yellow} />
      <Sparks x={540 + BTN.w / 2 + 10} y={BTN.y + 20} delay={clickAt + 3} angle={-45} size={70} color={colors.yellow} />

      {/* Cursor glides in from bottom-left and clicks */}
      <div
        style={{
          position: "absolute",
          left: interpolate(cursorMove, [0, 1], [-140, 277]),
          top: interpolate(cursorMove, [0, 1], [1500, BTN.y + 109]),
          transform: `scale(${1 - pressDip * 0.12}) rotate(${interpolate(cursorMove, [0, 1], [-14, 0])}deg)`,
          transformOrigin: "10% 5%",
          opacity: interpolate(cursorMove, [0, 0.15], [0, 1], CLAMP),
          filter: "drop-shadow(0 12px 16px rgba(0,0,0,0.5))",
        }}
      >
        <Cursor size={96} />
      </div>

      {/* Handle */}
      <div
        style={{
          position: "absolute",
          left: 540 - 270,
          top: 1110 - float * 0.6,
          opacity: Math.min(1, handleIn * 1.6),
          transform: `scale(${interpolate(handleIn, [0, 1], [1.3, 1])}) rotate(${interpolate(handleIn, [0, 1], [6, -2])}deg)`,
        }}
      >
        <Paper width={540} height={110} color={colors.yellow} seed="handle">
          <span
            style={{
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 52,
              color: colors.ink,
              direction: "ltr",
              marginTop: -6,
            }}
          >
            @almashhor_edu0
          </span>
        </Paper>
      </div>

      <Ring x={170} y={760} r={14} delay={s(0.2)} color={colors.chalk} />
      <Ring x={910} y={1240} r={16} delay={s(0.5)} color={colors.teal} phase={1.2} />
    </AbsoluteFill>
  );
};
