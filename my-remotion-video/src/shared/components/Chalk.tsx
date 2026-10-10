import { useCurrentFrame } from "remotion";
import { baseTheme as theme } from "../theme";
import { useProgress, useSpringAt } from "./motion";

/** Global SVG defs: a dusty, slightly wobbly chalk stroke filter. Mount once. */
export const ChalkDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter
        id="chalk"
        filterUnits="userSpaceOnUse"
        x={-2000}
        y={-2000}
        width={6000}
        height={6000}
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="1.1"
          numOctaves={2}
          seed={3}
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={4}
          xChannelSelector="R"
          yChannelSelector="G"
          result="wobble"
        />
        <feColorMatrix
          in="noise"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.75"
          result="holes"
        />
        <feComposite in="wobble" in2="holes" operator="in" />
      </filter>
    </defs>
  </svg>
);

type SvgBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  viewBox?: string;
  style?: React.CSSProperties;
};

const Svg: React.FC<SvgBox & { children: React.ReactNode }> = ({
  x,
  y,
  width,
  height,
  viewBox,
  style,
  children,
}) => (
  <svg
    width={width}
    height={height}
    viewBox={viewBox ?? `0 0 ${width} ${height}`}
    style={{ position: "absolute", left: x, top: y, overflow: "visible", ...style }}
  >
    {children}
  </svg>
);

/** A chalk stroke that draws itself on. */
export const ChalkLine: React.FC<
  SvgBox & {
    d: string;
    delay: number;
    duration?: number;
    color?: string;
    strokeWidth?: number;
    opacity?: number;
    easing?: (t: number) => number;
  }
> = ({
  d,
  delay,
  duration = 14,
  easing = theme.ease.out,
  color = theme.colors.chalk,
  strokeWidth = 7,
  opacity = 0.9,
  ...box
}) => {
  const p = useProgress(delay, duration, easing);
  return (
    <Svg {...box}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
        opacity={p > 0 ? opacity : 0}
        filter="url(#chalk)"
      />
    </Svg>
  );
};

/** Dashed chalk path (like the reference's motion arrows) revealed along its length. */
export const DashedArrow: React.FC<
  SvgBox & {
    id: string;
    d: string;
    head: string; // arrowhead path at the end of d
    delay: number;
    duration?: number;
    color?: string;
  }
> = ({ id, d, head, delay, duration = 18, color = theme.colors.chalk, ...box }) => {
  const frame = useCurrentFrame();
  const p = useProgress(delay, duration);
  const headP = useSpringAt(delay + duration - 4, theme.spring.snappy);
  return (
    <Svg {...box}>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={-500} y={-500} width={3000} height={3000}>
          <path
            d={d}
            fill="none"
            stroke="#fff"
            strokeWidth={20}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - p}
          />
        </mask>
      </defs>
      <g filter="url(#chalk)" opacity={0.85}>
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray="18 16"
          strokeDashoffset={-frame * 0.6}
          mask={`url(#${id})`}
        />
        <path
          d={head}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={headP}
        />
      </g>
    </Svg>
  );
};

/** Three short emphasis strokes radiating from a point. */
export const Sparks: React.FC<{
  x: number;
  y: number;
  delay: number;
  angle?: number; // direction the burst faces, degrees
  color?: string;
  size?: number;
  count?: number;
}> = ({ x, y, delay, angle = -90, color = theme.colors.chalk, size = 60, count = 3 }) => {
  const frame = useCurrentFrame();
  const spread = 70;
  return (
    <Svg x={x - size * 1.5} y={y - size * 1.5} width={size * 3} height={size * 3}>
      <g filter="url(#chalk)">
        {Array.from({ length: count }).map((_, i) => {
          const local = Math.max(0, frame - delay - i * 3);
          const p = Math.min(1, local / 8);
          const eased = theme.ease.out(p);
          const a = ((angle + (i - (count - 1) / 2) * (spread / Math.max(1, count - 1))) * Math.PI) / 180;
          const c = size * 1.5;
          const r0 = size * 0.35;
          const r1 = r0 + size * 0.75 * eased;
          return (
            <line
              key={i}
              x1={c + Math.cos(a) * r0}
              y1={c + Math.sin(a) * r0}
              x2={c + Math.cos(a) * r1}
              y2={c + Math.sin(a) * r1}
              stroke={color}
              strokeWidth={6}
              strokeLinecap="round"
              opacity={p > 0 ? 0.9 : 0}
            />
          );
        })}
      </g>
    </Svg>
  );
};

/** Small outlined circle doodle that pops in and floats. */
export const Ring: React.FC<{
  x: number;
  y: number;
  r?: number;
  delay: number;
  color?: string;
  phase?: number;
}> = ({ x, y, r = 16, delay, color = theme.colors.teal, phase = 0 }) => {
  const frame = useCurrentFrame();
  const p = useSpringAt(delay, theme.spring.bouncy);
  const float = Math.sin(frame / 28 + phase) * 6;
  return (
    <Svg x={x - r * 2} y={y - r * 2 + float} width={r * 4} height={r * 4}>
      <circle
        cx={r * 2}
        cy={r * 2}
        r={r * p}
        fill="none"
        stroke={color}
        strokeWidth={5}
        opacity={Math.min(1, p)}
      />
    </Svg>
  );
};
