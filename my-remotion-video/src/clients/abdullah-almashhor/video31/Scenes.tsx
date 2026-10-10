import { AbsoluteFill, interpolate, random, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ChalkLine, DashedArrow, Sparks } from "../../../shared/components/Chalk";
import { CLAMP } from "../../../shared/components/motion";
import { Paper } from "../../../shared/components/Paper";
import { TornBackdrop } from "../components/TornBackdrop";
import { Card, colors, fonts, Glyph, theme, useAt, useOut, useSpr } from "./kit";
import timing from "./timing.json";

const X_MARK = "M10 10 L110 110 M110 12 L14 108";

/** Collage background that fades in under C/B shots. */
const Backdrop: React.FC<{ fadeOut?: number }> = ({ fadeOut }) => {
  const p = useSpr(0, theme.spring.smooth);
  const o = useOut(fadeOut ?? 1e9, 8);
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, p * 1.4) * (1 - o) }}>
      <TornBackdrop />
    </AbsoluteFill>
  );
};

/* s1 — A: identical cards repeat on both sides (same pattern, again and again). */
const S1: React.FC = () => {
  const at = useAt(0);
  const cards = [0, 1, 2].flatMap((i) => [
    { x: 175, y: 470 + i * 150, side: "l", i },
    { x: 905, y: 470 + i * 150, side: "r", i },
  ]);
  return (
    <AbsoluteFill>
      {cards.map((c, k) => (
        <Card key={k} x={c.x} y={c.y} w={190} h={150} seed={`s1-${k}`} at={at(0.2) + k * 4} out={at(5.5)} rot={c.side === "l" ? -4 : 4}>
          <Glyph kind="tri" size={92} />
        </Card>
      ))}
      <ChalkLine x={110} y={420} width={130} height={130} d={X_MARK} delay={at(0.75)} duration={8} strokeWidth={12} />
      <ChalkLine x={840} y={720} width={130} height={130} d={X_MARK} delay={at(1.0)} duration={8} strokeWidth={12} />
    </AbsoluteFill>
  );
};

/* s2 — C: the same card looping in a circle, an eye that "fools" you. */
const S2: React.FC = () => {
  const at = useAt(5.5);
  const frame = useCurrentFrame();
  const spin = frame * 0.5;
  const eyeIn = useSpr(at(7.3), theme.spring.bouncy);
  const blink = Math.abs(Math.sin((frame - at(7.6)) / 7)) > 0.97 ? 0.15 : 1;
  return (
    <AbsoluteFill>
      <Backdrop fadeOut={at(8.22)} />
      <div style={{ position: "absolute", inset: 0, transform: `rotate(${spin}deg)`, transformOrigin: "540px 900px" }}>
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
          return (
            <Card key={i} x={540 + Math.cos(a) * 300} y={900 + Math.sin(a) * 300} w={170} h={140} seed="same" at={i * 4} out={at(8.22)} rot={-spin}>
              <Glyph kind="tri" size={84} />
            </Card>
          );
        })}
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, transform: `rotate(${spin * 1.4}deg)`, transformOrigin: "540px 900px" }}>
        <circle cx={540} cy={900} r={300} fill="none" stroke={colors.yellow} strokeWidth={4} strokeDasharray="18 16" opacity={0.7} filter="url(#chalk)" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 540 - 130,
          top: 900 - 80,
          opacity: Math.min(1, eyeIn * 1.5),
          transform: `scale(${interpolate(eyeIn, [0, 1], [0.3, 1])}) rotate(${interpolate(eyeIn, [0, 1], [20, -4])}deg)`,
        }}
      >
        <Paper width={260} height={160} color={colors.paper} seed="eye">
          <svg width={200} height={110} viewBox="0 0 200 110">
            <path d="M10 55 C60 0 140 0 190 55 C140 110 60 110 10 55 Z" fill={colors.chalk} stroke={colors.ink} strokeWidth={6} />
            <g transform={`translate(100 55) scale(1 ${blink})`}>
              <circle r={30} fill={colors.teal} />
              <circle r={14} fill={colors.ink} />
              <circle r={5} cx={-8} cy={-8} fill="#fff" />
            </g>
          </svg>
        </Paper>
      </div>
    </AbsoluteFill>
  );
};

/* s3 — B: a "done" stamp that shakes and fades — the feeling is temporary. */
const S3: React.FC = () => {
  const at = useAt(8.22);
  const frame = useCurrentFrame();
  const p = useSpr(at(8.45), theme.spring.bouncy);
  const doubt = interpolate(frame, [at(9.7), at(11.5)], [0, 1], CLAMP);
  const shake = Math.sin(frame * 1.7) * 6 * doubt;
  return (
    <AbsoluteFill>
      <Backdrop fadeOut={at(11.73)} />
      <div
        style={{
          position: "absolute",
          left: 760,
          top: 640,
          width: 250,
          height: 250,
          borderRadius: "50%",
          border: `10px solid ${colors.teal}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: colors.teal,
          fontFamily: fonts.headline,
          fontWeight: 900,
          fontSize: 60,
          opacity: Math.min(1, p * 1.5) * (1 - doubt * 0.75),
          filter: `blur(${doubt * 3}px)`,
          transform: `scale(${interpolate(p, [0, 1], [1.8, 1])}) rotate(${-14 + shake}deg) translateX(${shake}px)`,
          boxShadow: `0 0 30px ${colors.tealGlow}`,
        }}
      >
        <svg width={110} height={80} viewBox="0 0 110 80">
          <path d="M10 42 L42 70 L100 10" fill="none" stroke={colors.teal} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>أتقنت</span>
      </div>
      <Sparks x={885} y={600} delay={at(8.5)} angle={-90} size={70} />
    </AbsoluteFill>
  );
};

/* s4a — A: the shock beat (zoom handled by Footage), a few sparks. */
const S4a: React.FC = () => {
  const at = useAt(11.73);
  return (
    <AbsoluteFill>
      <Sparks x={210} y={1000} delay={at(11.8)} angle={-140} size={80} count={4} />
      <Sparks x={870} y={1000} delay={at(11.85)} angle={-40} size={80} count={4} />
    </AbsoluteFill>
  );
};

/* s4b — C: "الإتقان" on torn paper evaporates; then the first real test arrives. */
const S4b: React.FC = () => {
  const at = useAt(13.07);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = useSpr(at(13.1), theme.spring.snappy);
  const evap = (frame - at(13.85)) / fps;
  const SLICES = 7;
  const W = 760;
  const H = 300;
  const test = useSpr(at(15.0), theme.spring.snappy);
  return (
    <AbsoluteFill>
      <Backdrop fadeOut={at(16.7)} />
      <div style={{ position: "absolute", left: 540 - W / 2, top: 560, width: W, height: H }}>
        {Array.from({ length: SLICES }).map((_, i) => {
          const d = Math.max(0, evap - i * 0.08);
          const rise = d * d * 260 + d * 40;
          const drift = (random(`ev-${i}`) - 0.5) * 180 * d;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                clipPath: `polygon(${(i / SLICES) * 100}% 0, ${((i + 1) / SLICES) * 100 + 0.5}% 0, ${((i + 1) / SLICES) * 100 + 0.5}% 100%, ${(i / SLICES) * 100}% 100%)`,
                opacity: Math.min(1, inP * 1.5) * interpolate(d, [0, 1.3], [1, 0], CLAMP),
                filter: `blur(${Math.min(10, d * 8)}px)`,
                transform: `translate(${drift}px, ${interpolate(inP, [0, 1], [80, 0]) - rise}px) rotate(${(random(`evr-${i}`) - 0.5) * 30 * d}deg) scale(${interpolate(inP, [0, 1], [0.7, 1])})`,
              }}
            >
              <Paper width={W} height={H} color={colors.paper} seed="mastery">
                <span style={{ fontFamily: fonts.headline, fontWeight: 900, fontSize: 150, color: colors.ink, direction: "rtl" }}>
                  الإتقان
                </span>
              </Paper>
            </div>
          );
        })}
      </div>
      {/* the first real test: an exam sheet slides up */}
      <div
        style={{
          position: "absolute",
          left: 540 - 220,
          top: 930,
          opacity: Math.min(1, test * 1.5),
          transform: `translateY(${interpolate(test, [0, 1], [500, 0])}px) rotate(${interpolate(test, [0, 1], [12, 3])}deg)`,
        }}
      >
        <Paper width={440} height={420} color={colors.chalk} seed="exam">
          <div style={{ width: 340, direction: "rtl" }}>
            <div style={{ fontFamily: fonts.headline, fontWeight: 900, fontSize: 44, color: colors.ink, marginBottom: 18, textAlign: "center" }}>اختبار حقيقي</div>
            {[0, 1, 2, 3].map((r) => (
              <div key={r} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
                <div style={{ width: 34, height: 34, border: `5px solid ${colors.ink}`, borderRadius: 6 }} />
                <div style={{ flex: 1, height: 8, background: colors.paperShade, borderRadius: 4 }} />
              </div>
            ))}
          </div>
        </Paper>
      </div>
      <ChalkLine x={600} y={960} width={140} height={140} d="M70 10 C120 10 130 70 70 80 L70 100 M70 125 L70 128" delay={at(15.5)} duration={12} strokeWidth={12} />
    </AbsoluteFill>
  );
};

/* s5 — A: three different cards arrive around him, then overlap into "interleaved". */
const S5: React.FC = () => {
  const at = useAt(16.7);
  const frame = useCurrentFrame();
  const merge = interpolate(frame, [at(18.8), at(19.3)], [0, 1], { ...CLAMP, easing: theme.ease.inOut });
  const cards = [
    { kind: "pen" as const, color: colors.paper, from: [170, 560], to: [400, 1290], t: 16.9, rot: -8 },
    { kind: "circle" as const, color: colors.yellow, from: [910, 560], to: [540, 1310], t: 17.3, rot: 6 },
    { kind: "grid" as const, color: colors.teal, from: [180, 860], to: [680, 1290], t: 17.7, rot: -3 },
  ];
  return (
    <AbsoluteFill>
      {cards.map((c, i) => (
        <Card
          key={i}
          x={c.from[0] + (c.to[0] - c.from[0]) * merge}
          y={c.from[1] + (c.to[1] - c.from[1]) * merge}
          w={180}
          h={150}
          seed={`mix-${i}`}
          at={at(c.t)}
          out={at(20.5)}
          color={c.color}
          rot={c.rot * (1 - merge * 0.5)}
        >
          <Glyph kind={c.kind} size={88} />
        </Card>
      ))}
    </AbsoluteFill>
  );
};

/* s6 — B: one exercise card gets crossed out; two different ones slide in. */
const S6: React.FC = () => {
  const at = useAt(20.5);
  return (
    <AbsoluteFill>
      <Backdrop fadeOut={at(22.55)} />
      <Card x={870} y={520} w={240} h={200} seed="one" at={at(20.6)} out={at(22.55)} rot={4}>
        <Glyph kind="tri" size={110} />
      </Card>
      <ChalkLine x={780} y={450} width={150} height={150} d={X_MARK} delay={at(21.4)} duration={8} strokeWidth={14} />
      <Card x={880} y={800} w={190} h={160} seed="two" at={at(22.0)} out={at(22.55)} color={colors.yellow} rot={-5}>
        <Glyph kind="circle" size={88} />
      </Card>
      <Card x={860} y={1030} w={190} h={160} seed="three" at={at(22.1)} out={at(22.55)} color={colors.teal} rot={6}>
        <Glyph kind="grid" size={88} />
      </Card>
    </AbsoluteFill>
  );
};

/* s7 — C (hero scene): three different practice types on a paper clock, shuffled at random. */
const S7: React.FC = () => {
  const at = useAt(22.55);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = { x: 540, y: 940 };
  const R = 300;
  const clockIn = useSpr(at(22.6), theme.spring.smooth);
  const hand = interpolate(frame, [at(22.6), at(27.7)], [-90, 630], { ...CLAMP, easing: theme.ease.inOut });
  // slot order changes at each shuffle beat
  const ORDERS = [
    [0, 1, 2],
    [2, 0, 1],
    [1, 2, 0],
    [0, 2, 1],
  ];
  const beats = [at(25.0), at(26.3), at(27.0)];
  const slotAngle = (slot: number) => -90 + slot * 120;
  const types = [
    { kind: "pen" as const, color: colors.paper, label: "كتابة" },
    { kind: "circle" as const, color: colors.yellow, label: "حل" },
    { kind: "grid" as const, color: colors.teal, label: "رسم" },
  ];
  const posOf = (i: number) => {
    let a = slotAngle(ORDERS[0][i]);
    beats.forEach((b, k) => {
      const p = spring({ frame: frame - b, fps, config: theme.spring.bouncy });
      a += (slotAngle(ORDERS[k + 1][i]) - slotAngle(ORDERS[k][i])) * p;
    });
    const r = (a * Math.PI) / 180;
    return { x: C.x + Math.cos(r) * R, y: C.y + Math.sin(r) * R };
  };
  return (
    <AbsoluteFill>
      <Backdrop fadeOut={at(27.78)} />
      {/* paper clock */}
      <div
        style={{
          position: "absolute",
          left: C.x - 230,
          top: C.y - 230,
          opacity: Math.min(1, clockIn * 1.4),
          transform: `scale(${interpolate(clockIn, [0, 1], [0.5, 1])}) rotate(${interpolate(clockIn, [0, 1], [-30, 0])}deg)`,
        }}
      >
        <div style={{ width: 460, height: 460, borderRadius: "50%", background: colors.bgLift, border: `14px solid ${colors.paper}`, boxSizing: "border-box", boxShadow: "0 24px 40px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={432} height={432} viewBox="0 0 460 460">
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return (
                <line key={i} x1={230 + Math.cos(a) * 170} y1={230 + Math.sin(a) * 170} x2={230 + Math.cos(a) * (i % 3 ? 185 : 200)} y2={230 + Math.sin(a) * (i % 3 ? 185 : 200)} stroke={colors.chalk} strokeWidth={i % 3 ? 4 : 8} strokeLinecap="round" />
              );
            })}
            <g transform={`rotate(${hand} 230 230)`}>
              <line x1={230} y1={230} x2={380} y2={230} stroke={colors.yellow} strokeWidth={10} strokeLinecap="round" />
            </g>
            <g transform={`rotate(${hand / 12} 230 230)`}>
              <line x1={230} y1={230} x2={320} y2={230} stroke={colors.chalk} strokeWidth={12} strokeLinecap="round" />
            </g>
            <circle cx={230} cy={230} r={14} fill={colors.yellow} />
          </svg>
        </div>
      </div>
      {/* arrows between the slots */}
      {[0, 1, 2].map((k) => {
        const a0 = ((slotAngle(k) + 25) * Math.PI) / 180;
        const a1 = ((slotAngle(k) + 95) * Math.PI) / 180;
        const rr = R + 150;
        const p0 = { x: C.x + Math.cos(a0) * rr, y: C.y + Math.sin(a0) * rr };
        const p1 = { x: C.x + Math.cos(a1) * rr, y: C.y + Math.sin(a1) * rr };
        const am = ((slotAngle(k) + 60) * Math.PI) / 180;
        const pm = { x: C.x + Math.cos(am) * (rr + 40), y: C.y + Math.sin(am) * (rr + 40) };
        const back = { x: p1.x - Math.cos(a1 - Math.PI / 2) * 30, y: p1.y - Math.sin(a1 - Math.PI / 2) * 30 };
        return (
          <DashedArrow
            key={k}
            id={`s7-arrow-${k}`}
            x={0}
            y={0}
            width={1080}
            height={1920}
            delay={at(23.2) + k * 5}
            d={`M${p0.x} ${p0.y} Q${pm.x} ${pm.y} ${p1.x} ${p1.y}`}
            head={`M${back.x + Math.cos(a1) * 22} ${back.y + Math.sin(a1) * 22} L${p1.x} ${p1.y} L${back.x - Math.cos(a1) * 22} ${back.y - Math.sin(a1) * 22}`}
          />
        );
      })}
      {types.map((t, i) => {
        const p = posOf(i);
        return (
          <Card key={i} x={p.x} y={p.y} w={210} h={200} seed={`type-${i}`} at={at(22.7) + i * 5} out={at(27.78)} color={t.color} rot={(i - 1) * 6}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Glyph kind={t.kind} size={96} />
              <span style={{ fontFamily: fonts.headline, fontWeight: 800, fontSize: 40, color: colors.ink, marginTop: -4 }}>{t.label}</span>
            </div>
          </Card>
        );
      })}
    </AbsoluteFill>
  );
};

/* s8 — A: scribbles switch between three patterns around the head (never over the face). */
const S8: React.FC = () => {
  const at = useAt(27.78);
  const paths = [
    { x: 150, y: 260, d: "M20 120 C60 20 160 20 200 100 C230 160 120 190 110 120 C100 60 220 40 260 90" },
    { x: 700, y: 240, d: "M20 40 L80 120 L140 40 L200 120 L260 40" },
    { x: 380, y: 140, d: "M20 80 C80 10 240 10 300 80" },
  ];
  return (
    <AbsoluteFill>
      {[0, 1, 2, 3, 4, 5].map((k) => {
        const p = paths[k % 3];
        return (
          <ChalkLine key={k} x={p.x} y={p.y} width={320} height={220} d={p.d} delay={at(27.9) + k * 12} duration={10} strokeWidth={8} opacity={k < 3 ? 0.5 : 0.95} />
        );
      })}
      <DashedArrow id="s8-a" x={60} y={380} width={300} height={300} delay={at(28.7)} d="M40 260 C10 160 60 60 200 40" head="M168 22 L204 40 L176 70" />
      <DashedArrow id="s8-b" x={740} y={380} width={300} height={300} delay={at(29.1)} d="M260 260 C290 160 240 60 100 40" head="M132 22 L96 40 L124 70" />
    </AbsoluteFill>
  );
};

/* s9 — C: an abstract head; the network of connections builds node by node with the words. */
const NODES = Array.from({ length: 22 }).map((_, i) => ({
  x: 330 + random(`nx-${i}`) * 420,
  y: 620 + random(`ny-${i}`) * 520,
}));
const EDGES = NODES.flatMap((a, i) =>
  NODES.map((b, j) => ({ i, j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
    .filter((e) => e.j < i)
    .sort((p, q) => p.d - q.d)
    .slice(0, 3),
);
const HEAD = "M300 1260 C290 1180 250 1150 250 1080 C250 1040 210 1020 230 980 C250 950 230 900 250 850 C270 700 380 560 560 560 C740 560 860 690 860 860 C860 980 800 1050 790 1120 C785 1170 800 1220 810 1260 Z";

const S9: React.FC = () => {
  const at = useAt(30.87);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headIn = useSpr(at(30.9), theme.spring.smooth);
  const span = [at(31.2), at(34.0)];
  const nodeAt = (i: number) => span[0] + ((span[1] - span[0]) * i) / NODES.length;
  return (
    <AbsoluteFill>
      <Backdrop fadeOut={at(34.0)} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: Math.min(1, headIn * 1.4), transform: `translateY(${interpolate(headIn, [0, 1], [60, 0])}px)` }}>
        <path d={HEAD} fill={colors.paper} stroke={colors.chalk} strokeWidth={14} style={{ filter: "drop-shadow(0 20px 20px rgba(0,0,0,0.3))" }} />
        <path d={HEAD} fill={colors.bgLift} opacity={0.9} transform="translate(540 910) scale(0.92) translate(-540 -910)" />
        {EDGES.map((e, k) => {
          const start = Math.max(nodeAt(e.i), nodeAt(e.j));
          const p = interpolate(frame, [start, start + 8], [0, 1], { ...CLAMP, easing: theme.ease.out });
          const a = NODES[e.j];
          const b = NODES[e.i];
          return p > 0 ? (
            <line key={k} x1={a.x} y1={a.y} x2={a.x + (b.x - a.x) * p} y2={a.y + (b.y - a.y) * p} stroke={colors.yellow} strokeWidth={3 + p} opacity={0.85} />
          ) : null;
        })}
        {NODES.map((n, i) => {
          const p = spring({ frame: frame - nodeAt(i), fps, config: theme.spring.bouncy });
          return (
            <circle key={i} cx={n.x} cy={n.y} r={11 * p} fill={colors.teal} style={{ filter: `drop-shadow(0 0 ${10 * p}px ${colors.tealGlow})` }} />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/* s10 — A: calm ending; a hand underline under "طويلة المدى" stays to the last frame. */
const S10: React.FC = () => {
  const at = useAt(34.0);
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, at(34.6)], [0.6, 0], CLAMP);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: fade }}>
        {EDGES.slice(0, 18).map((e, k) => (
          <line key={k} x1={NODES[e.i].x - 300} y1={NODES[e.i].y + 200} x2={NODES[e.j].x - 300} y2={NODES[e.j].y + 200} stroke={colors.yellow} strokeWidth={3} />
        ))}
      </svg>
      <ChalkLine x={260} y={1300} width={560} height={50} d="M540 20 C420 34 260 10 120 28 C80 32 40 26 20 34" delay={at(35.45)} duration={9} strokeWidth={10} />
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4a: S4a, s4b: S4b, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9, s10: S10 };

/** Backdrop + collage graphics for each scene, placed by timing.json. */
export const SceneGraphics: React.FC<{ layer: "under" | "over" }> = ({ layer }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {timing.scenes.map((s) => {
        const Comp = MAP[s.id];
        const isUnder = s.layout !== "A";
        if ((layer === "under") !== isUnder) return null;
        return (
          <Sequence key={s.id} name={s.id} from={Math.round(s.from * fps)} durationInFrames={Math.round((s.to - s.from) * fps) + 2} layout="none">
            <AbsoluteFill>
              <Comp />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </>
  );
};
