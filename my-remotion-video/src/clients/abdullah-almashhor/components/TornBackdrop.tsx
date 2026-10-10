import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { paperBlotch, paperNoise } from "../../../shared/components/textures";
import { theme } from "../theme";

const { colors } = theme;
const W = 1080;
const H = 1920;

/** Jagged torn edge along a straight line from (x0,y0) to (x1,y1), closed toward the top or bottom. */
const tornSlab = (seed: string, y0: number, y1: number, side: "top" | "bottom", amp = 10, step = 12) => {
  const pts: string[] = [];
  const x0 = -60;
  const x1 = W + 60;
  let i = 0;
  for (let x = x0; x <= x1; x += step) {
    const t = (x - x0) / (x1 - x0);
    const y = y0 + (y1 - y0) * t + (random(`${seed}-${i++}`) - 0.5) * amp * 2;
    pts.push(`${x}px ${y.toFixed(1)}px`);
  }
  const edgeY = side === "top" ? -200 : H + 200;
  pts.push(`${x1}px ${edgeY}px`, `${x0}px ${edgeY}px`);
  return `polygon(${pts.join(", ")})`;
};

type SlabProps = {
  seed: string;
  y0: number;
  y1: number;
  side: "top" | "bottom";
  fill: string;
  drift: number;
  glow?: boolean;
};

/** One navy paper slab with a cream torn rim and a gold-leaf seam under it. */
const Slab: React.FC<SlabProps> = ({ seed, y0, y1, side, fill, drift, glow }) => {
  const dir = side === "top" ? 1 : -1;
  const layer = (off: number, background: string, amp: number, extra?: React.CSSProperties) => (
    <AbsoluteFill
      style={{
        background,
        clipPath: tornSlab(seed, y0 + off * dir, y1 + off * dir, side, amp),
        ...extra,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ transform: `translateY(${drift}px)` }}>
      {/* gold leaf seam, then cream rim, then the navy slab on top */}
      {layer(
        34,
        `linear-gradient(100deg, ${colors.yellow}, #E9CC7A 35%, #9C7A2E 60%, ${colors.yellow})`,
        14,
        { filter: "drop-shadow(0 0 14px rgba(201,162,75,0.35))" },
      )}
      {layer(18, colors.paper, 12)}
      <AbsoluteFill style={{ filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.55))" }}>
        {layer(0, `linear-gradient(${side === "top" ? 170 : 10}deg, ${fill}, ${colors.bg})`, 9)}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: tornSlab(seed, y0, y1, side, 9),
          backgroundImage: `${paperNoise}, ${paperBlotch}`,
          backgroundSize: "260px, 600px",
          mixBlendMode: "overlay",
          opacity: 0.5,
        }}
      />
      {glow ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <line
            x1={-60}
            y1={y0 + 2 * dir}
            x2={W * 0.45}
            y2={y0 + (y1 - y0) * 0.47 + 2 * dir}
            stroke={colors.teal}
            strokeWidth={5}
            style={{ filter: `drop-shadow(0 0 10px ${colors.tealGlow}) drop-shadow(0 0 24px ${colors.tealGlow})` }}
            opacity={0.8}
          />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

/** Thin gold sacred-geometry linework: orbit circles, an axis line with beads. */
const GoldGeometry: React.FC<{ frame: number }> = ({ frame }) => {
  const rot = frame * 0.06;
  const beads = [260, 520, 1500, 1720];
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.55 }}>
      <g stroke={colors.yellow} fill="none" strokeWidth={1.6}>
        <circle cx={540} cy={960} r={470} opacity={0.5} />
        <circle
          cx={540}
          cy={960}
          r={410}
          strokeDasharray="2 14"
          opacity={0.7}
          transform={`rotate(${rot} 540 960)`}
        />
        <circle cx={930} cy={260} r={300} opacity={0.35} />
        <line x1={540} y1={0} x2={540} y2={H} opacity={0.25} />
        <line x1={0} y1={960} x2={W} y2={960} opacity={0.12} />
      </g>
      {beads.map((y, i) => (
        <circle
          key={y}
          cx={540}
          cy={y + Math.sin(frame / 40 + i) * 6}
          r={i % 2 ? 6 : 9}
          fill={colors.yellow}
          style={{ filter: "drop-shadow(0 0 8px rgba(201,162,75,0.8))" }}
        />
      ))}
    </svg>
  );
};

/** Deep navy torn-paper collage with gold seams and a cyan edge glow (style-*.webp references). */
export const TornBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 70) * 10;
  const d2 = Math.cos(frame / 85) * 10;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(110% 70% at 50% 50%, ${colors.bgLift} 0%, ${colors.bg} 55%, ${colors.bgDeep} 100%)`,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: paperBlotch,
          backgroundSize: "600px",
          mixBlendMode: "overlay",
          opacity: 0.35,
        }}
      />
      <GoldGeometry frame={frame} />
      <Slab seed="top" y0={560} y1={150} side="top" fill={colors.bgLift} drift={d1} glow />
      <Slab seed="bottom" y0={1820} y1={1430} side="bottom" fill={colors.bgLift} drift={d2} />
    </AbsoluteFill>
  );
};
