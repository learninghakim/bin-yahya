import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { ChalkLine, DashedArrow, Ring } from "../../../shared/components/Chalk";
import { Gear, QuestionIcon, RepeatIcon, TargetIcon } from "../../../shared/components/Icons";
import { useExit, useSeconds } from "../../../shared/components/motion";
import { Paper, Tape } from "../../../shared/components/Paper";

const { colors, fonts } = theme;

type Point = {
  text: string;
  color: string;
  ink: string;
  tile: string;
  icon: (size: number, color: string) => React.ReactNode;
  rotate: number;
};

const POINTS: Point[] = [
  {
    text: "التكرار المتباعد",
    color: colors.teal,
    ink: colors.chalk,
    tile: colors.tealDeep,
    icon: (size, c) => <RepeatIcon size={size} color={c} />,
    rotate: -1.6,
  },
  {
    text: "التركيز العميق",
    color: colors.yellow,
    ink: colors.ink,
    tile: "#C99F25",
    icon: (size, c) => <TargetIcon size={size} color={c} />,
    rotate: 1.2,
  },
  {
    text: "الأسئلة الصحيحة",
    color: colors.paper,
    ink: colors.ink,
    tile: colors.paperShade,
    icon: (size, c) => <QuestionIcon size={size} color={c} fontFamily={fonts.display} />,
    rotate: -0.8,
  },
];

const CARD = { w: 880, h: 200, gap: 54, top: 620 };

/** 12–18s: three study techniques, pasted on one by one, then ticked off. */
export const Scene3Points: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSeconds();
  const exit = useExit();
  const gearSpin = frame * 0.9;
  const gearsIn = spring({ frame: frame - s(0.05), fps, config: theme.spring.bouncy });

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        transform: `translateY(${-70 * exit}px) scale(${1 - 0.04 * exit})`,
        filter: `blur(${exit * 6}px)`,
      }}
    >
      {/* Gears turning — "how the mind works" */}
      <div
        style={{
          position: "absolute",
          left: 540 - 150,
          top: 330,
          width: 300,
          height: 220,
          opacity: Math.min(1, gearsIn * 1.5),
          transform: `scale(${interpolate(gearsIn, [0, 1], [0.6, 1])})`,
        }}
      >
        <div style={{ position: "absolute", left: 30, top: 20 }}>
          <Gear size={170} rotate={gearSpin} />
        </div>
        <div style={{ position: "absolute", left: 172, top: 92 }}>
          <Gear size={112} rotate={-gearSpin * 1.5 + 18} />
        </div>
      </div>

      {POINTS.map((pt, i) => {
        const delay = s(0.3) + i * s(0.95);
        const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
        const tape = spring({ frame: frame - delay - 6, fps, config: theme.spring.bouncy });
        const breathe = Math.sin(frame / 30 + i * 1.3) * 3;
        return (
          <div
            key={pt.text}
            style={{
              position: "absolute",
              left: 540 - CARD.w / 2,
              top: CARD.top + i * (CARD.h + CARD.gap) + breathe,
              opacity: Math.min(1, p * 1.6),
              transform: `translateX(${interpolate(p, [0, 1], [220, 0])}px) scale(${interpolate(p, [0, 1], [1.08, 1])}) rotate(${interpolate(p, [0, 1], [7, pt.rotate])}deg)`,
            }}
          >
            <Paper width={CARD.w} height={CARD.h} color={pt.color} seed={`point-${i}`}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  direction: "rtl",
                  alignItems: "center",
                  gap: 40,
                  padding: "0 34px",
                }}
              >
                <div
                  style={{
                    width: 132,
                    height: 132,
                    borderRadius: 18,
                    background: pt.tile,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "inset 0 -6px 0 rgba(0,0,0,0.12)",
                  }}
                >
                  {pt.icon(96, pt.ink)}
                </div>
                <span
                  style={{
                    fontFamily: fonts.display,
                    fontWeight: 800,
                    fontSize: 72,
                    color: pt.ink,
                    marginTop: -8,
                  }}
                >
                  {pt.text}
                </span>
              </div>
            </Paper>
            <Tape
              seed={`point-tape-${i}`}
              color={i === 0 ? colors.yellow : colors.teal}
              width={130}
              height={46}
              style={{
                top: -20,
                left: -34,
                opacity: Math.min(0.88, tape),
                transform: `rotate(-32deg) scale(${interpolate(tape, [0, 1], [1.5, 1])})`,
              }}
            />
          </div>
        );
      })}

      {/* Chalk ticks once all three are on the board */}
      {POINTS.map((pt, i) => (
        <ChalkLine
          key={i}
          x={150}
          y={CARD.top + i * (CARD.h + CARD.gap) + 40}
          width={120}
          height={120}
          delay={s(3.3) + i * s(0.2)}
          duration={s(0.3)}
          d="M18 62 L48 92 L104 22"
          strokeWidth={11}
          color={pt.ink}
          opacity={0.95}
        />
      ))}

      <DashedArrow
        id="s3-arrow"
        x={800}
        y={1360}
        width={200}
        height={240}
        delay={s(3.8)}
        d="M150 20 C190 110 140 180 40 200"
        head="M70 176 L36 200 L74 222"
      />
      <Ring x={160} y={1460} r={16} delay={s(2.6)} color={colors.yellow} />
      <Ring x={920} y={420} r={12} delay={s(0.6)} color={colors.teal} phase={2} />
    </AbsoluteFill>
  );
};
