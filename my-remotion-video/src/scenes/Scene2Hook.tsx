import { AbsoluteFill, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { ChalkLine, Ring, Sparks } from "../components/Chalk";
import { ChartArt } from "../components/Icons";
import { useBreath, useExit, useProgress, useSeconds, useSpringAt } from "../components/motion";
import { Paper, Tape } from "../components/Paper";
import { WordReveal } from "../components/WordReveal";

const { colors, fonts } = theme;

const headline: React.CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 116,
  lineHeight: 1.35,
  color: colors.chalk,
  textShadow: "0 8px 30px rgba(0,0,0,0.45)",
};

/** 5–12s: the core promise, the supporting line, and a rising chart. */
export const Scene2Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSeconds();
  const exit = useExit();

  const highlight = useProgress(s(0.75), s(0.35));
  const strike = s(1.5);
  const cardIn = useSpringAt(s(2.0));
  const tapeIn = useSpringAt(s(2.35), theme.spring.bouncy);
  const chartIn = useSpringAt(s(3.0));
  const bars = [0, 1, 2, 3].map((i) =>
    spring({ frame: frame - s(3.35) - i * 4, fps, config: theme.spring.snappy }),
  );
  const arrow = useProgress(s(3.8), s(0.7), theme.ease.inOut);
  const float = useBreath(34, 5);

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        transform: `translateY(${-70 * exit}px) scale(${1 - 0.04 * exit})`,
        filter: `blur(${exit * 6}px)`,
      }}
    >
      <div style={{ position: "absolute", top: 410, left: 60, right: 60, transform: `translateY(${float * 0.5}px)` }}>
        <WordReveal
          delay={s(0.1)}
          per={s(0.14)}
          gap={30}
          words={[{ text: "الدراسة" }, { text: "بذكاء...", key: "smart" }]}
          style={headline}
          renderWord={(w) =>
            w.key === "smart" ? (
              <>
                <span
                  style={{
                    position: "absolute",
                    left: -18,
                    right: -18,
                    top: "22%",
                    bottom: "8%",
                    background: colors.yellow,
                    transform: `scaleX(${highlight}) rotate(-1.5deg)`,
                    transformOrigin: "100% 50%",
                    borderRadius: 6,
                    boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
                  }}
                />
                <span
                  style={{
                    position: "relative",
                    color: interpolateColors(highlight, [0, 0.6], [colors.chalk, colors.ink]),
                    textShadow: "none",
                  }}
                >
                  {w.text}
                </span>
              </>
            ) : (
              w.text
            )
          }
        />
        <WordReveal
          delay={s(0.45)}
          per={s(0.14)}
          gap={30}
          words={[
            { text: "مش", style: { color: colors.chalkDim } },
            { text: "بجهد" },
            { text: "مضاعف" },
          ]}
          style={{ ...headline, marginTop: 6 }}
        />
        {/* Chalk strike through "بجهد مضاعف" — the effort we're dropping */}
        <ChalkLine
          x={40}
          y={232}
          width={740}
          height={60}
          delay={strike}
          duration={s(0.35)}
          d="M720 34 C520 22 260 40 20 26"
          strokeWidth={9}
          color={colors.yellow}
          opacity={0.85}
        />
      </div>

      {/* Supporting line on torn paper */}
      <div
        style={{
          position: "absolute",
          left: 540 - 450,
          top: 870,
          opacity: Math.min(1, cardIn * 1.5),
          transform: `translateY(${interpolate(cardIn, [0, 1], [140, 0]) + float * 0.4}px) rotate(${interpolate(cardIn, [0, 1], [7, 1.5])}deg)`,
        }}
      >
        <Paper width={900} height={200} color={colors.paper} rim={0} seed="sub-card">
          <span
            style={{
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 58,
              color: colors.ink,
              direction: "rtl",
            }}
          >
            تعلم كيف تذاكر <span style={{ color: colors.grey }}>أقل</span> وتحفظ{" "}
            <span style={{ color: colors.tealDeep }}>أكثر</span>
          </span>
        </Paper>
        <Tape
          seed="sub-tape"
          width={190}
          height={56}
          style={{
            top: -26,
            left: 355,
            opacity: Math.min(0.88, tapeIn),
            transform: `rotate(-4deg) scale(${interpolate(tapeIn, [0, 1], [1.4, 1])})`,
          }}
        />
      </div>

      {/* Rising chart — "memorise more" made visible */}
      <div
        style={{
          position: "absolute",
          left: 540 - 300,
          top: 1180,
          opacity: Math.min(1, chartIn * 1.5),
          transform: `translateY(${interpolate(chartIn, [0, 1], [160, 0]) - float * 0.4}px) rotate(${interpolate(chartIn, [0, 1], [-9, -3])}deg)`,
        }}
      >
        <Paper width={600} height={380} color={colors.paperShade} seed="chart" rim={0}>
          <ChartArt width={580} height={360} bars={bars} arrow={arrow} />
        </Paper>
      </div>
      <Sparks x={860} y={1170} delay={s(4.4)} angle={-50} size={70} color={colors.yellow} />

      <Ring x={140} y={380} r={14} delay={s(0.3)} color={colors.teal} />
      <Ring x={950} y={1520} r={18} delay={s(3.2)} color={colors.chalk} phase={1} />
    </AbsoluteFill>
  );
};
