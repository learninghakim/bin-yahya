import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP } from "../../../shared/components/motion";
import { colors, theme } from "./kit";
import timing from "./timing.json";

type Layout = "A" | "B" | "C";
type State = { scale: number; x: number; y: number; rot: number; frame: number; opacity: number };

// B = Abdullah inside a tilted paper frame, upper-left, keywords below it.
const STATES: Record<Layout, State> = {
  A: { scale: 1, x: 0, y: 0, rot: 0, frame: 0, opacity: 1 },
  B: { scale: 0.52, x: -120, y: -260, rot: -3, frame: 1, opacity: 1 },
  C: { scale: 0.4, x: -120, y: -300, rot: -6, frame: 1, opacity: 0 },
};

// Gentle push-ins on A shots at emphasis moments: [sceneId, startSec, endSec, zoom].
const ZOOMS: [string, number, number, number][] = [
  ["s1", 0, 5.5, 1.05],
  ["s4a", 11.73, 12.3, 1.12],
  ["s5", 18.8, 19.6, 1.06],
  ["s8", 27.8, 30.8, 1.05],
  ["s10", 34.0, 35.9, 1.08],
];

const mix = (a: State, b: State, t: number): State => ({
  scale: a.scale + (b.scale - a.scale) * t,
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  rot: a.rot + (b.rot - a.rot) * t,
  frame: a.frame + (b.frame - a.frame) * t,
  opacity: a.opacity + (b.opacity - a.opacity) * t,
});

/** The original recording as ONE continuous layer (audio + lip sync never cut); only its framing changes. */
export const Footage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scenes = timing.scenes;
  const i = Math.max(0, scenes.findIndex((s) => t >= s.from && t < s.to));
  const cur = scenes[i] ?? scenes[scenes.length - 1];
  const prev = scenes[i - 1];
  const target = STATES[cur.layout as Layout];
  const blend = prev
    ? interpolate(t, [cur.from, cur.from + 0.3], [0, 1], { ...CLAMP, easing: theme.ease.out })
    : 1;
  const s = prev ? mix(STATES[prev.layout as Layout], target, blend) : target;

  const z = ZOOMS.find(([id]) => id === cur.id);
  const zoom = z ? interpolate(t, [z[1], z[2]], [1, z[3]], { ...CLAMP, easing: theme.ease.inOut }) : 1;
  const zoomA = 1 + (zoom - 1) * (1 - s.frame);

  return (
    <AbsoluteFill
      style={{
        opacity: s.opacity,
        transform: `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg) scale(${s.scale})`,
      }}
    >
      {/* paper border + shadow, only visible when framed (B) */}
      <AbsoluteFill
        style={{
          inset: -34,
          background: colors.paper,
          opacity: s.frame,
          boxShadow: `0 40px 80px rgba(0,0,0,${0.5 * s.frame})`,
          clipPath: "polygon(0.6% 0.4%, 99.2% 0%, 100% 99.3%, 0% 100%)",
        }}
      />
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile("clients/abdullah-almashhor/31.mp4")}
          style={{ width: "100%", height: "100%", transform: `scale(${zoomA})`, transformOrigin: "50% 30%" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
