import { theme } from "../theme";

const { colors } = theme;
// Sticker look from the reference: dark ink fill with a thick paper-white outline.
const sticker = {
  stroke: colors.paper,
  strokeWidth: 10,
  paintOrder: "stroke" as const,
  strokeLinejoin: "round" as const,
};

export const Bulb: React.FC<{ size: number; glow?: number }> = ({ size, glow = 0 }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 200 260" style={{ overflow: "visible" }}>
    <circle cx={100} cy={92} r={86} fill={colors.yellow} opacity={0.18 * glow} />
    <path
      d="M100 20 C55 20 28 52 28 92 C28 122 46 140 60 156 C68 166 72 176 72 188 L128 188 C128 176 132 166 140 156 C154 140 172 122 172 92 C172 52 145 20 100 20 Z"
      fill={colors.yellow}
      stroke={colors.ink}
      strokeWidth={9}
      strokeLinejoin="round"
    />
    <path d="M82 188 L82 140 Q100 118 118 140 L118 188" fill="none" stroke={colors.ink} strokeWidth={7} strokeLinecap="round" />
    <path d="M58 70 Q66 48 90 40" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.7} />
    <rect x={70} y={192} width={60} height={16} rx={5} fill={colors.paperShade} stroke={colors.ink} strokeWidth={7} />
    <rect x={72} y={212} width={56} height={16} rx={5} fill={colors.paperShade} stroke={colors.ink} strokeWidth={7} />
    <path d="M84 234 L116 234 L108 248 L92 248 Z" fill={colors.ink} />
  </svg>
);

/** Pencil with its tip on the left (at 6% of length, 50% of height). */
export const Pencil: React.FC<{ length: number }> = ({ length }) => (
  <svg width={length} height={length * 0.2} viewBox="0 0 500 100" style={{ overflow: "visible" }}>
    <g transform="translate(500 0) scale(-1 1)">
    <g {...sticker}>
      <path d="M40 30 L400 30 L470 50 L400 70 L40 70 Z" fill={colors.ink} />
    </g>
    <path d="M400 30 L470 50 L400 70 Z" fill={colors.paperShade} />
    <path d="M448 44 L470 50 L448 56 Z" fill={colors.ink} />
    <rect x={10} y={30} width={42} height={40} rx={6} fill={colors.yellow} />
    <rect x={52} y={30} width={16} height={40} fill={colors.greyLight} />
    <path d="M80 42 L390 42" stroke="#fff" strokeWidth={4} opacity={0.25} strokeLinecap="round" />
    </g>
  </svg>
);

const gearPath = (teeth: number, rOut: number, rIn: number) => {
  const pts: string[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const corners = [
      [rIn, a - step * 0.5],
      [rIn, a - step * 0.28],
      [rOut, a - step * 0.18],
      [rOut, a + step * 0.18],
      [rIn, a + step * 0.28],
    ];
    corners.forEach(([r, ang]) =>
      pts.push(`${(100 + Math.cos(ang) * r).toFixed(1)} ${(100 + Math.sin(ang) * r).toFixed(1)}`),
    );
  }
  return `M${pts.join(" L")} Z`;
};
const GEAR = gearPath(10, 92, 74);

export const Gear: React.FC<{ size: number; rotate: number }> = ({ size, rotate }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible", transform: `rotate(${rotate}deg)` }}>
    <path d={GEAR} fill={colors.ink} {...sticker} />
    <circle cx={100} cy={100} r={44} fill="none" stroke={colors.grey} strokeWidth={6} />
    <circle cx={100} cy={100} r={20} fill={colors.paper} />
  </svg>
);

export const Cursor: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 120 150" style={{ overflow: "visible" }}>
    <path
      d="M10 8 L10 118 L38 92 L58 138 L80 128 L60 84 L98 82 Z"
      fill={colors.ink}
      {...sticker}
      strokeWidth={9}
    />
  </svg>
);

/** Spaced repetition: circular arrows with growing gaps between review dots. */
export const RepeatIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M78 40 A30 30 0 0 0 24 34" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />
    <path d="M22 60 A30 30 0 0 0 76 66" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />
    <path d="M14 22 L24 36 L38 28" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M86 78 L76 64 L62 72" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={34} cy={50} r={4.5} fill={color} />
    <circle cx={46} cy={50} r={4.5} fill={color} />
    <circle cx={66} cy={50} r={4.5} fill={color} />
  </svg>
);

/** Deep focus: target with an arrow in the bullseye. */
export const TargetIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={46} cy={54} r={36} fill="none" stroke={color} strokeWidth={8} />
    <circle cx={46} cy={54} r={20} fill="none" stroke={color} strokeWidth={8} />
    <circle cx={46} cy={54} r={6} fill={color} />
    <path d="M46 54 L86 14" stroke={color} strokeWidth={8} strokeLinecap="round" />
    <path d="M72 12 L88 12 L88 28" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Right questions: speech bubble with an Arabic question mark. */
export const QuestionIcon: React.FC<{ size: number; color: string; fontFamily: string }> = ({
  size,
  color,
  fontFamily,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path
      d="M16 18 H84 Q92 18 92 26 V64 Q92 72 84 72 H44 L26 88 L28 72 H16 Q8 72 8 64 V26 Q8 18 16 18 Z"
      fill="none"
      stroke={color}
      strokeWidth={8}
      strokeLinejoin="round"
    />
    <text x={50} y={62} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={50} fill={color}>
      ؟
    </text>
  </svg>
);

/** Rising bar chart on grid paper, as in the reference collage. */
export const ChartArt: React.FC<{ width: number; height: number; bars: number[]; arrow: number }> = ({
  width,
  height,
  bars,
  arrow,
}) => {
  const base = height - 40;
  const bw = 58;
  const gap = 34;
  const left = 60;
  const heights = [0.32, 0.5, 0.66, 0.9];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`v${i}`} x1={30 + i * 56} y1={20} x2={30 + i * 56} y2={height - 20} stroke={colors.grey} strokeWidth={1.5} opacity={0.35} />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={`h${i}`} x1={20} y1={30 + i * 50} x2={width - 20} y2={30 + i * 50} stroke={colors.grey} strokeWidth={1.5} opacity={0.35} />
      ))}
      {heights.map((h, i) => {
        const bh = h * (base - 40) * bars[i];
        return (
          <rect
            key={i}
            x={left + i * (bw + gap)}
            y={base - bh}
            width={bw}
            height={bh}
            fill={i === heights.length - 1 ? colors.teal : colors.ink}
          />
        );
      })}
      <path
        d={`M${left - 10} ${base - 70} L${left + 120} ${base - 130} L${left + 200} ${base - 110} L${left + 330} ${base - 230}`}
        fill="none"
        stroke={colors.ink}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - arrow}
      />
      <path
        d={`M${left + 290} ${base - 236} L${left + 334} ${base - 234} L${left + 326} ${base - 192}`}
        fill="none"
        stroke={colors.ink}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={arrow > 0.95 ? 1 : 0}
      />
      <line x1={30} y1={base} x2={width - 30} y2={base} stroke={colors.ink} strokeWidth={5} />
    </svg>
  );
};
