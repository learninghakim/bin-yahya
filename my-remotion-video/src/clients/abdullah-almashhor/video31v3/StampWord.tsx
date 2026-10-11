import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP } from "../../../shared/components/motion";
import { Paper } from "../../../shared/components/Paper";
import { colors, fonts, theme } from "../video31/kit";

// Global seconds of each stamp hit, spread across "نفس النمط لساعات".
export const STAMP_HITS = [3.0, 3.55, 4.1, 4.65];
const ROW = 100;
const TOP = 965;

/** Rubber-stamp ink: a little edge wobble plus speckled holes where the ink didn't take. */
const StampDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter id="stamp-ink" x="-10%" y="-20%" width="120%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves={2}
          seed={7}
          result="n"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="n"
          scale={3}
          xChannelSelector="R"
          yChannelSelector="G"
          result="w"
        />
        <feColorMatrix
          in="n"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.9"
          result="holes"
        />
        <feComposite in="w" in2="holes" operator="in" />
      </filter>
    </defs>
  </svg>
);

const Impression: React.FC<{ hit: number; latest: boolean; faded: number }> = ({
  hit,
  latest,
  faded,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - hit,
    fps,
    config: { damping: 9, stiffness: 320, mass: 0.5 },
  });
  const ink = latest ? colors.yellow : colors.chalk;
  return (
    <div
      style={{
        opacity: frame >= hit ? 1 - faded : 0,
        transform: `scale(${interpolate(p, [0, 1], [1.7, 1])}) rotate(-4deg)`,
        filter: "url(#stamp-ink)",
      }}
    >
      <div
        style={{
          padding: "0 34px",
          border: `7px solid ${ink}`,
          borderRadius: 14,
          fontFamily: fonts.headline,
          fontWeight: 700,
          fontSize: 70,
          lineHeight: 1.3,
          color: ink,
          direction: "rtl",
          textShadow: latest ? "0 0 24px rgba(201,162,75,0.45)" : "none",
          boxShadow: latest ? "0 0 24px rgba(201,162,75,0.25)" : "none",
        }}
      >
        نفس النمط
      </div>
    </div>
  );
};

/** "نفس النمط" stamped again and again, identical each time; older prints bleach out. */
/** Mounted in a Sequence starting at `start` (global s); `out` is local seconds. */
export const StampWord: React.FC<{ start: number; out: number }> = ({
  start,
  out,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const hits = STAMP_HITS.map((s) => Math.round((s - start) * fps));
  const last = hits.filter((h) => frame >= h).length - 1;
  const exit = interpolate(t, [out - 0.3, out], [0, 1], {
    ...CLAMP,
    easing: theme.ease.in,
  });

  // the stamp block (handle) drops to each row, presses, lifts
  const cur = Math.max(0, last);
  const local = frame - hits[cur];
  const press = interpolate(local, [-4, 0, 3, 9], [-90, 0, 0, -110], CLAMP);
  const next = hits[cur + 1];
  const travel = next ? interpolate(frame, [next - 6, next], [0, 1], CLAMP) : 0;
  const toolY =
    TOP +
    (cur + travel) * ROW -
    150 +
    (travel > 0 ? -110 * (1 - travel) : press);
  const sheet = spring({
    frame: frame - (hits[0] - 10),
    fps,
    config: theme.spring.snappy,
  });
  const toolIn = spring({
    frame: frame - (hits[0] - 8),
    fps,
    config: theme.spring.snappy,
  });

  return (
    <AbsoluteFill
      style={{ opacity: 1 - exit, transform: `translateY(${-30 * exit}px)` }}
    >
      <StampDefs />
      {/* the navy sheet being stamped */}
      <div
        style={{
          position: "absolute",
          left: 540 - 310,
          top: TOP - 40,
          opacity: Math.min(1, sheet * 1.5),
          transform: `translateY(${interpolate(sheet, [0, 1], [140, 0])}px) rotate(${interpolate(sheet, [0, 1], [6, -2])}deg)`,
        }}
      >
        <Paper
          width={620}
          height={ROW * 4 + 70}
          color={colors.bgLift}
          seed="stamp-sheet"
          rim={12}
        >
          <div />
        </Paper>
      </div>
      {hits.map((h, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: TOP + i * ROW,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Impression
            hit={h}
            latest={i === last}
            faded={i < last ? 0.55 + 0.1 * (last - i - 1) : 0}
          />
        </div>
      ))}
      {/* stamp tool: gold handle on a navy block */}
      <svg
        width={260}
        height={170}
        viewBox="0 0 260 170"
        style={{
          position: "absolute",
          left: 540 - 130,
          top: toolY + 30,
          opacity:
            Math.min(1, toolIn * 1.5) *
            (frame > hits[hits.length - 1] + 10 ? 0 : 1),
          transform: `scale(${interpolate(toolIn, [0, 1], [0.5, 0.78])})`,
          transformOrigin: "50% 100%",
          filter: "drop-shadow(0 16px 18px rgba(0,0,0,0.5))",
        }}
      >
        <ellipse cx={130} cy={30} rx={46} ry={26} fill={colors.yellow} />
        <rect x={112} y={34} width={36} height={70} rx={10} fill="#B08A3A" />
        <rect
          x={40}
          y={100}
          width={180}
          height={44}
          rx={10}
          fill={colors.bgLift}
          stroke={colors.yellow}
          strokeWidth={4}
        />
        <rect x={50} y={142} width={160} height={14} rx={4} fill={colors.ink} />
      </svg>
    </AbsoluteFill>
  );
};
