import { getLength, getPointAtLength } from "@remotion/paths";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { ChalkLine, DashedArrow, Ring, Sparks } from "../../../shared/components/Chalk";
import { Bulb, Pencil } from "../../../shared/components/Icons";
import { CLAMP, useBreath, useExit, useProgress, useSeconds, useSpringAt } from "../../../shared/components/motion";
import { Paper, Tape } from "../../../shared/components/Paper";
import { WordReveal } from "../../../shared/components/WordReveal";

const { colors, fonts } = theme;

const SCRIBBLE = {
  x: 290,
  y: 1330,
  d: "M300 80 C230 60 140 40 120 90 C100 150 210 160 200 100 C190 40 80 60 20 120",
};
const SCRIBBLE_LEN = getLength(SCRIBBLE.d);
const PENCIL = { length: 430, tipX: 430 * 0.06, tipY: 430 * 0.1 };

/** 0–5s: name + tagline on the chalkboard. */
export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useSeconds();
  const exit = useExit();

  const bulbIn = useSpringAt(s(0.07), theme.spring.bouncy);
  const labelIn = useSpringAt(s(1.0), theme.spring.bouncy);
  const pencilIn = useProgress(s(2.3), s(0.6), theme.ease.out);
  const drawStart = s(2.9);
  const drawLen = s(0.9);
  const draw = useProgress(drawStart, drawLen, theme.ease.inOut);
  const pencilLift = useProgress(drawStart + drawLen, s(0.5), theme.ease.out);
  const glow = 0.6 + 0.4 * Math.sin(frame / 9);
  const float = useBreath(32, 6);
  const sway = useBreath(26, 3);

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        transform: `translateY(${-70 * exit}px) scale(${1 - 0.04 * exit})`,
        filter: `blur(${exit * 6}px)`,
      }}
    >
      {/* Light bulb idea mark */}
      <div
        style={{
          position: "absolute",
          left: 540 - 95,
          top: 380 + float,
          opacity: Math.min(1, bulbIn * 1.5),
          transform: `scale(${interpolate(bulbIn, [0, 1], [0.5, 1])}) rotate(${interpolate(bulbIn, [0, 1], [-18, 0]) + sway}deg)`,
          transformOrigin: "50% 80%",
        }}
      >
        <Bulb size={190} glow={bulbIn * glow} />
      </div>
      <Sparks x={540} y={420} delay={s(0.45)} angle={-90} size={150} count={5} color={colors.yellow} />

      {/* Name */}
      <WordReveal
        delay={s(0.25)}
        per={s(0.17)}
        gap={34}
        words={[{ text: "عبدالله" }, { text: "المشهور" }]}
        style={{
          position: "absolute",
          top: 720,
          left: 0,
          right: 0,
          fontFamily: fonts.display,
          fontWeight: 900,
          fontSize: 132,
          lineHeight: 1.3,
          color: colors.chalk,
          textShadow: "0 8px 30px rgba(0,0,0,0.45)",
          transform: `translateY(${float * 0.4}px)`,
        }}
      />
      <ChalkLine
        x={200}
        y={905}
        width={680}
        height={60}
        delay={s(0.8)}
        duration={s(0.5)}
        d="M660 22 C520 40 330 8 150 30 C90 36 40 30 18 40"
        strokeWidth={8}
      />

      {/* Tagline on a teal torn label */}
      <div
        style={{
          position: "absolute",
          left: 540 - 250,
          top: 1010,
          opacity: Math.min(1, labelIn * 1.6),
          transform: `scale(${interpolate(labelIn, [0, 1], [1.35, 1])}) rotate(${interpolate(labelIn, [0, 1], [-12, -3]) + sway * 0.3}deg)`,
        }}
      >
        <Paper width={500} height={130} color={colors.bgLift} seed="tagline">
          <span
            style={{
              fontFamily: fonts.label,
              fontWeight: 700,
              fontSize: 66,
              color: colors.chalk,
              direction: "rtl",
              marginTop: -6,
            }}
          >
            تعليم وريادة
          </span>
        </Paper>
        <Tape seed="tagline-tape" color={colors.yellow} width={120} height={44} style={{ top: -18, right: -30, transform: "rotate(28deg)" }} />
      </div>
      <Sparks x={830} y={1020} delay={s(1.3)} angle={-40} size={60} />

      {/* Ambient doodles */}
      <DashedArrow
        id="s1-arrow"
        x={90}
        y={560}
        width={220}
        height={360}
        delay={s(0.6)}
        d="M150 20 C40 60 30 200 120 300"
        head="M86 284 L122 304 L130 264"
      />
      <Ring x={150} y={1240} r={18} delay={s(0.5)} color={colors.teal} />
      <Ring x={930} y={640} r={14} delay={s(0.7)} color={colors.chalk} phase={1.4} />
      <Ring x={880} y={1330} r={12} delay={s(1.1)} color={colors.yellow} phase={2.1} />

      {/* Pencil slides in at 2.3s, then its tip traces the chalk scribble */}
      <ChalkLine
        x={SCRIBBLE.x}
        y={SCRIBBLE.y}
        width={320}
        height={200}
        delay={drawStart}
        duration={drawLen}
        easing={theme.ease.inOut}
        d={SCRIBBLE.d}
        strokeWidth={7}
      />
      {(() => {
        const pt = getPointAtLength(SCRIBBLE.d, SCRIBBLE_LEN * draw) ?? { x: 0, y: 0 };
        const tipX = SCRIBBLE.x + pt.x;
        const tipY = SCRIBBLE.y + pt.y;
        return (
          <div
            style={{
              position: "absolute",
              left: tipX - PENCIL.tipX + interpolate(pencilIn, [0, 1], [700, 0]) - pencilLift * 40,
              top: tipY - PENCIL.tipY - interpolate(pencilIn, [0, 1], [260, 0]) - pencilLift * 30,
              transformOrigin: `${PENCIL.tipX}px ${PENCIL.tipY}px`,
              transform: `rotate(${interpolate(pencilIn, [0, 1], [-10, -38]) + Math.sin(frame / 3) * draw * (1 - draw) * 6}deg)`,
              opacity: interpolate(pencilIn, [0, 0.25], [0, 1], CLAMP),
            }}
          >
            <Pencil length={PENCIL.length} />
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};
