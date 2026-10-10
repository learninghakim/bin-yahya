import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP } from "../../../shared/components/motion";
import { colors, theme } from "../video31/kit";
import { Layout, SCENES, SPLIT_LINE } from "./plan";

type State = {
  scale: number;
  x: number;
  y: number;
  opacity: number;
  arch: number;
  split: number;
};

const STATES: Record<Layout, State> = {
  A: { scale: 1, x: 0, y: 0, opacity: 1, arch: 0, split: 0 },
  SPLIT: { scale: 1, x: 0, y: -170, opacity: 1, arch: 0, split: 1 },
  ARCH: { scale: 0.56, x: -170, y: -230, opacity: 1, arch: 1, split: 0 },
  C: { scale: 0.9, x: 0, y: -40, opacity: 0, arch: 0, split: 0 },
};

// Push-ins on A shots: [sceneId, from, to, zoom]. s4a is a punch-in with a short shake.
const ZOOMS: [string, number, number, number][] = [
  ["s1", 0, 5.5, 1.05],
  ["s4a", 11.73, 11.95, 1.14],
  ["s5", 16.7, 20.5, 1.06],
  ["s8", 27.78, 30.87, 1.04],
  ["s10", 34.0, 35.9, 1.09],
];

const mix = (a: State, b: State, t: number): State => {
  const o = {} as State;
  (Object.keys(a) as (keyof State)[]).forEach(
    (k) => (o[k] = a[k] + (b[k] - a[k]) * t),
  );
  return o;
};

/** Original recording as ONE continuous layer; only its framing (full / diagonal split / arch) changes. */
export const Footage2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const i = Math.max(
    0,
    SCENES.findIndex((s) => t >= s.from && t < s.to),
  );
  const cur = SCENES[i] ?? SCENES[SCENES.length - 1];
  const prev = SCENES[i - 1];
  const blend = prev
    ? interpolate(t, [cur.from, cur.from + 0.32], [0, 1], {
        ...CLAMP,
        easing: theme.ease.out,
      })
    : 1;
  const s = prev
    ? mix(STATES[prev.layout], STATES[cur.layout], blend)
    : STATES[cur.layout];

  const z = ZOOMS.find(([id]) => id === cur.id);
  const zoom = z
    ? interpolate(t, [z[1], z[2]], [1, z[3]], {
        ...CLAMP,
        easing: theme.ease.inOut,
      })
    : 1;
  const shake =
    cur.id === "s4a"
      ? Math.sin(frame * 2.3) * interpolate(t, [11.73, 12.1], [10, 0], CLAMP)
      : 0;

  // diagonal clip: bottom edge rises from 100% to the split line
  const l = 100 - (100 - ((SPLIT_LINE.left - s.y) / 1920) * 100) * s.split;
  const r = 100 - (100 - ((SPLIT_LINE.right - s.y) / 1920) * 100) * s.split;
  const archR = 540 * s.arch;

  return (
    <AbsoluteFill
      style={{
        opacity: s.opacity,
        transform: `translate(${s.x + shake}px, ${s.y}px) scale(${s.scale})`,
      }}
    >
      {/* paper border of the arch window */}
      <AbsoluteFill
        style={{
          inset: -30,
          background: colors.paper,
          borderRadius: `${archR + 30}px ${archR + 30}px 0 0`,
          opacity: s.arch,
          boxShadow: `0 40px 80px rgba(0,0,0,${0.5 * s.arch})`,
        }}
      />
      <AbsoluteFill
        style={{
          overflow: "hidden",
          borderRadius: `${archR}px ${archR}px 0 0`,
          clipPath: `polygon(0 0, 100% 0, 100% ${r}%, 0 ${l}%)`,
        }}
      >
        <OffthreadVideo
          src={staticFile("clients/abdullah-almashhor/31.mp4")}
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${zoom})`,
            transformOrigin: "50% 30%",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
