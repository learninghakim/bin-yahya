// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL ART — illustrative motion graphics. Each one SHOWS the idea instead of writing it
// (the captions already carry the words). All times are absolute seconds of the edited video.
// Drawn in SVG with the Signal tokens; no boxes — they float over the chest on a soft
// dark halo (<Float>) or sit on a full-screen <Stage>.
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Icon } from "../../components/graphics/Icon";
import { IconName } from "../../components/graphics/icons";
import { S } from "./tokens";
import { prog, useNow, useSceneVis } from "./clock";

const C = S.color;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/**
 * Small UI label used inside illustrations. `anchor` is visual (start = left edge at x, end = right edge at x);
 * it is flipped internally because SVG anchors follow the text direction and our labels are RTL.
 */
const Label: React.FC<{ x: number; y: number; text: string; o?: number; color?: string; size?: number; weight?: number; anchor?: "start" | "middle" | "end" }> = ({ x, y, text, o = 1, color = C.text, size = 30, weight = 600, anchor = "middle" }) => (
  <text x={x} y={y} textAnchor={anchor === "start" ? "end" : anchor === "end" ? "start" : "middle"} fontFamily="Readex" fontWeight={weight} fontSize={size} fill={color} opacity={o} direction="rtl">
    {text}
  </text>
);

/**
 * FLOAT — places an illustration over the chest (centre y≈1130) on a soft dark halo, no box.
 * Handles the scene entrance/exit (fade + rise + de-blur).
 */
export const Float: React.FC<{ y?: number; h?: number; halo?: number; children: React.ReactNode }> = ({ y = 1130, h = 520, halo = 0.62, children }) => {
  const { inn, out } = useSceneVis();
  const v = inn * (1 - out);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: -100, right: -100, top: y - h * 0.8, height: h * 1.6, opacity: v, background: `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(8,11,10,${halo}) 0%, rgba(8,11,10,${halo * 0.6}) 45%, transparent 75%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: y - h / 2, height: h, display: "flex", justifyContent: "center", alignItems: "center", opacity: v, transform: `translateY(${(1 - inn) * 26 - out * 12}px) scale(${0.96 + 0.04 * inn})`, filter: `blur(${(1 - inn) * 10 + out * 8}px)` }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

// ── 1. GAUGE — "سهلة ومريحة": the needle swings into the comfortable zone ──────────────
export const Gauge: React.FC<{ at: number; settleAt?: number; left: string; right: string }> = ({ at, settleAt, left, right }) => {
  const { t } = useNow();
  const sweep = prog(t, at - 0.5, 0.9, S.ease.inOut);
  const settle = settleAt ? prog(t, settleAt, 0.5, S.ease.inOut) : 0;
  const ang = lerp(-80, 62, sweep) + 10 * settle + Math.sin(t * 9) * 1.2 * sweep; // tiny tremble
  const cx = 300, cy = 300, r = 230;
  const arc = (a0: number, a1: number) => {
    const p = (a: number) => [cx + r * Math.cos(((a - 90) * Math.PI) / 180), cy + r * Math.sin(((a - 90) * Math.PI) / 180)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`;
  };
  const ticks = Array.from({ length: 13 }, (_, i) => -90 + i * 15);
  return (
    <svg width={600} height={380} viewBox="0 0 600 380" style={{ overflow: "visible" }}>
      <path d={arc(-90, -30)} stroke={C.danger} strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.85} />
      <path d={arc(-25, 25)} stroke={C.faint} strokeWidth={26} fill="none" strokeLinecap="round" />
      <path d={arc(30, 90)} stroke={C.lime} strokeWidth={26} fill="none" strokeLinecap="round" />
      {ticks.map((a, i) => {
        const p0 = [cx + (r - 40) * Math.cos(((a - 90) * Math.PI) / 180), cy + (r - 40) * Math.sin(((a - 90) * Math.PI) / 180)];
        const p1 = [cx + (r - 58) * Math.cos(((a - 90) * Math.PI) / 180), cy + (r - 58) * Math.sin(((a - 90) * Math.PI) / 180)];
        return <line key={i} x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke={C.dim} strokeWidth={3} strokeLinecap="round" />;
      })}
      <g transform={`rotate(${ang} ${cx} ${cy})`}>
        <path d={`M${cx - 10} ${cy} L${cx} ${cy - r + 52} L${cx + 10} ${cy} Z`} fill={C.text} />
      </g>
      <circle cx={cx} cy={cy} r={22} fill={C.panelSolid} stroke={C.text} strokeWidth={5} />
      <Label x={70} y={360} text={left} color={C.danger} />
      <Label x={530} y={360} text={right} color={C.lime} o={0.5 + 0.5 * sweep} size={34} weight={700} />
    </svg>
  );
};

// ── 2. ILLUSION BAR — fills to "فاهم ✓", then glitches and collapses: "خدعة" ─────────────
export const IllusionBar: React.FC<{ fillAt: number; trickAt: number; full: string; trick: string }> = ({ fillAt, trickAt, full, trick }) => {
  const { t } = useNow();
  const fill = prog(t, fillAt, 1.1, S.ease.inOut);
  const g = t >= trickAt && t < trickAt + 0.35; // glitch window
  const drop = prog(t, trickAt + 0.2, 0.6, S.ease.inOut);
  const w = 760 * lerp(fill, 0.16, drop);
  const tricked = drop > 0.3;
  const jitter = g ? Math.sin(t * 140) * 14 : 0;
  const bar = (dx: number, col: string, op: number) => (
    <rect x={20 + dx} y={150} width={Math.max(0, w)} height={64} rx={32} fill={col} opacity={op} />
  );
  return (
    <svg width={800} height={330} viewBox="0 0 800 330" style={{ overflow: "visible" }} direction="ltr">
      <g transform={`translate(${jitter} 0)`}>
        <rect x={20} y={150} width={760} height={64} rx={32} fill={C.chip} stroke={C.line} strokeWidth={2} />
        {g ? bar(-10, "#ff2a6d", 0.7) : null}
        {g ? bar(10, "#22d3ee", 0.7) : null}
        {bar(0, tricked ? C.danger : C.lime, 1)}
      </g>
      {/* status chip above the bar end */}
      <g transform={`translate(${Math.max(130, Math.min(670, 20 + w))} 92)`} opacity={fill}>
        <rect x={-120} y={-40} width={240} height={72} rx={22} fill={tricked ? "rgba(255,107,87,0.16)" : C.limeSoft} stroke={tricked ? C.danger : C.lime} strokeWidth={2} />
        <Label x={20} y={8} text={tricked ? trick : full} color={tricked ? C.danger : C.lime} size={36} weight={700} />
        <g transform="translate(-92 -18)">
          <foreignObject width={40} height={40}>
            <Icon name={tricked ? "x" : "check"} size={36} color={tricked ? C.danger : C.lime} strokeWidth={3} />
          </foreignObject>
        </g>
      </g>
      {/* glitch slices */}
      {g ? [0, 1, 2].map((i) => <rect key={i} x={0} y={140 + i * 30 + ((t * 300) % 20)} width={800} height={6} fill={C.text} opacity={0.25} />) : null}
    </svg>
  );
};

// ── 3. BOOK — the book opens, three researchers pop around it, topic chips orbit ──────────
export const Book: React.FC<{ title: string; openAt: number; peopleAt: number; chips?: { text: string; at: number; icon?: IconName }[] }> = ({ title, openAt, peopleAt, chips = [] }) => {
  const { t, from } = useNow();
  const appear = prog(t, from + 0.1, 0.5);
  const open = prog(t, openAt, 0.9, S.ease.inOut);
  const float = Math.sin(t * 1.6) * 6;
  const coverRot = -150 * open;
  return (
    <div style={{ position: "relative", width: 900, height: 900, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${float}px)` }}>
      {/* researchers */}
      {[-1, 0, 1].map((k, i) => {
        const p = prog(t, peopleAt + i * 0.12, 0.4);
        const x = 450 + k * 230 - 55, y = 70 + Math.abs(k) * 60;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 110, height: 110, borderRadius: 110, background: C.panelSolid, border: `3px solid ${C.lime}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${0.85 + 0.15 * p})` }}>
            <Icon name="user" size={60} color={C.lime} />
          </div>
        );
      })}
      {/* the book (perspective) */}
      <div style={{ position: "relative", width: 300, height: 400, perspective: 1600, opacity: appear, transform: `scale(${0.9 + 0.1 * appear}) translateX(${open * 140}px)` }}>
        {/* pages */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "6px 18px 18px 6px", background: "#ECEFE6", boxShadow: `0 40px 80px -20px ${C.shadow}`, padding: "50px 34px", display: "flex", flexDirection: "column", gap: 20 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ height: 12, borderRadius: 6, background: "#C9CFC2", width: `${[90, 75, 85, 60, 88, 70, 80, 50][i]}%`, opacity: prog(t, openAt + 0.4 + i * 0.05, 0.3) }} />
          ))}
        </div>
        {/* cover */}
        <div style={{ position: "absolute", inset: 0, transformOrigin: "left center", transform: `rotateY(${coverRot}deg)`, transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "6px 18px 18px 6px", background: C.panelSolid, border: `3px solid ${C.lime}`, backfaceVisibility: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "40px 30px", boxShadow: `0 40px 80px -20px ${C.shadow}` }}>
            <div style={{ fontFamily: S.font.display, fontSize: 70, lineHeight: 1, color: C.text, direction: "ltr", textAlign: "left" }}>{title.split(" ").map((w, i) => <div key={i}>{w}</div>)}</div>
            <div style={{ height: 10, width: 120, borderRadius: 10, background: C.lime }} />
          </div>
          <div style={{ position: "absolute", inset: 0, borderRadius: "18px 6px 6px 18px", background: "#1A221E", transform: "rotateY(180deg)", backfaceVisibility: "hidden" }} />
        </div>
      </div>
      {/* chips under the book */}
      <div style={{ position: "absolute", bottom: 90, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 18, direction: "rtl" }}>
        {chips.map((c, i) => {
          const p = prog(t, c.at - 0.1, 0.35);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 24px", borderRadius: 18, background: C.chip, border: `1.5px solid ${C.line}`, fontFamily: S.font.ui, fontWeight: 600, fontSize: 36, color: C.text, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
              {c.icon ? <Icon name={c.icon} size={34} color={C.lime} /> : null}
              {c.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── 4. FORGET CURVE — what it FEELS like (stays high) vs what REMAINS (collapses) ─────────
export const ForgetCurve: React.FC<{ feelAt: number; realAt: number; longAt: number; feel: string; real: string; xLabel: string; yLabel: string }> = ({ feelAt, realAt, longAt, feel, real, xLabel, yLabel }) => {
  const { t, from } = useNow();
  const axes = prog(t, from + 0.15, 0.6, S.ease.inOut);
  const pf = prog(t, feelAt, 1.0, S.ease.inOut);
  const pr = prog(t, realAt, 1.6, S.ease.inOut);
  const lg = prog(t, longAt, 0.4);
  const X0 = 90, Y0 = 330, W = 680, H = 270;
  const feelPath = `M${X0} ${Y0 - H * 0.92} C ${X0 + 200} ${Y0 - H * 0.95}, ${X0 + 450} ${Y0 - H * 0.9}, ${X0 + W} ${Y0 - H * 0.88}`;
  const realPath = `M${X0} ${Y0 - H * 0.92} C ${X0 + 80} ${Y0 - H * 0.2}, ${X0 + 260} ${Y0 - H * 0.08}, ${X0 + W} ${Y0 - H * 0.05}`;
  const end = { x: X0 + W, y: Y0 - H * 0.05 };
  const pulse = 1 + Math.sin(t * 8) * 0.25 * lg;
  return (
    <svg width={820} height={420} viewBox="0 0 820 420" style={{ overflow: "visible" }} direction="ltr">
      <line x1={X0} y1={Y0} x2={X0 + W * axes + 20} y2={Y0} stroke={C.dim} strokeWidth={4} strokeLinecap="round" />
      <line x1={X0} y1={Y0} x2={X0} y2={Y0 - (H + 30) * axes} stroke={C.dim} strokeWidth={4} strokeLinecap="round" />
      <Label x={X0 + W} y={Y0 + 50} text={xLabel} color={C.dim} anchor="end" o={axes} />
      <Label x={X0 - 18} y={Y0 - H - 44} text={yLabel} color={C.dim} anchor="start" o={axes} />
      <path d={feelPath} stroke={C.lime} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - pf} opacity={0.9} />
      <path d={feelPath} stroke={C.lime} strokeWidth={8} fill="none" strokeDasharray="14 18" opacity={0} />
      <Label x={X0 + W - 6} y={Y0 - H * 0.88 - 26} text={feel} color={C.lime} anchor="end" o={pf} size={32} weight={700} />
      <path d={realPath} stroke={C.danger} strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - pr} />
      <Label x={end.x + 20} y={end.y - 34} text={real} color={C.danger} anchor="end" o={prog(t, realAt + 1.2, 0.4)} size={32} weight={700} />
      <circle cx={end.x} cy={end.y} r={14 * pulse} fill={C.danger} opacity={lg} />
      <circle cx={end.x} cy={end.y} r={14 + 26 * ((t * 1.5) % 1)} fill="none" stroke={C.danger} strokeWidth={3} opacity={lg * (1 - ((t * 1.5) % 1))} />
    </svg>
  );
};

// ── 5. HABITS — a summary page: highlighter sweeps, re-read loop, then "فاهم" bubble cracks ──
export const Habits: React.FC<{ pageAt: number; highlightAt: number; rereadAt: number; illusionAt: number; crackAt: number; bubble: string }> = ({ pageAt, highlightAt, rereadAt, illusionAt, crackAt, bubble }) => {
  const { t } = useNow();
  const page = prog(t, pageAt - 0.2, 0.45);
  const loop = prog(t, rereadAt - 0.1, 0.4);
  const spin = (t - rereadAt) * 220;
  const bub = prog(t, illusionAt, 0.4);
  const crack = prog(t, crackAt, 0.35);
  const lines = [0, 1, 2, 3, 4, 5];
  return (
    <svg width={860} height={480} viewBox="0 0 860 480" style={{ overflow: "visible" }} direction="ltr">
      {/* re-read loop arrows around the page */}
      <g opacity={loop * (1 - crack * 0.6)} transform={`rotate(${t >= rereadAt ? spin : 0} 330 240)`}>
        <path d="M330 30 A210 210 0 0 1 540 240" stroke={C.lime} strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M540 240 l-18 -26 M540 240 l26 -14" stroke={C.lime} strokeWidth={8} strokeLinecap="round" />
        <path d="M330 450 A210 210 0 0 1 120 240" stroke={C.lime} strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M120 240 l18 26 M120 240 l-26 14" stroke={C.lime} strokeWidth={8} strokeLinecap="round" />
      </g>
      {/* the summary page */}
      <g opacity={page} transform={`translate(${230} ${100 + (1 - page) * 30})`}>
        <rect x={0} y={0} width={200} height={280} rx={16} fill="#ECEFE6" />
        <rect x={24} y={24} width={110} height={16} rx={8} fill="#9AA391" />
        {lines.map((i) => {
          const hl = prog(t, highlightAt + i * 0.16, 0.25, S.ease.inOut);
          return (
            <g key={i}>
              <rect x={24} y={64 + i * 34} width={[150, 130, 152, 110, 140, 96][i]} height={18} rx={6} fill={C.lime} opacity={0.75} transform={`scale(${hl} 1)`} style={{ transformOrigin: `${24}px 0` }} />
              <rect x={24} y={70 + i * 34} width={[150, 130, 152, 110, 140, 96][i]} height={8} rx={4} fill="#9AA391" />
            </g>
          );
        })}
      </g>
      {/* "I understand" thought bubble — then it cracks */}
      <g opacity={bub} transform={`translate(${640} ${150}) scale(${0.85 + 0.15 * bub})`}>
        <circle cx={-110} cy={120} r={10} fill={C.text} opacity={0.8} />
        <circle cx={-80} cy={92} r={16} fill={C.text} opacity={0.85} />
        <rect x={-60} y={-30} width={220} height={110} rx={55} fill={crack > 0.5 ? "rgba(255,107,87,0.16)" : C.text} stroke={crack > 0.5 ? C.danger : "none"} strokeWidth={3} />
        <text x={50} y={38} textAnchor="middle" fontFamily="Readex" fontWeight={700} fontSize={40} fill={crack > 0.5 ? C.danger : C.ink} direction="rtl">{bubble}</text>
        {crack > 0 ? <path d="M40 -30 L55 5 L35 25 L60 55 L45 80" stroke={C.danger} strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - crack} /> : null}
      </g>
    </svg>
  );
};

// ── 6. TOGGLE — "قبل" → "بعد": a big switch flips ─────────────────────────────────────
export const Toggle: React.FC<{ flipAt: number; off: string; on: string }> = ({ flipAt, off, on }) => {
  const { t } = useNow();
  const f = prog(t, flipAt, 0.35, S.ease.inOut);
  const col = f > 0.5 ? C.lime : C.danger;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 36, direction: "rtl" }}>
      <div style={{ fontFamily: S.font.ui, fontWeight: 700, fontSize: 52, color: C.danger, opacity: 1 - 0.65 * f }}>{off}</div>
      <div style={{ position: "relative", width: 300, height: 150, borderRadius: 150, background: f > 0.5 ? C.limeSoft : "rgba(255,107,87,0.14)", border: `4px solid ${col}` }}>
        <div style={{ position: "absolute", top: 15, right: 15 + 150 * f, width: 112, height: 112, borderRadius: 112, background: col, boxShadow: `0 10px 30px ${C.shadow}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={f > 0.5 ? "check" : "x"} size={56} color={C.ink} strokeWidth={3.2} />
        </div>
      </div>
      <div style={{ fontFamily: S.font.ui, fontWeight: 700, fontSize: 52, color: C.lime, opacity: 0.35 + 0.65 * f }}>{on}</div>
    </div>
  );
};

// ── 7. JOURNEY — a path draws through the method; each station lights up when said ──────
export const Journey: React.FC<{ stops: { label: string; icon: IconName; at: number }[] }> = ({ stops }) => {
  const { t } = useNow();
  const n = stops.length;
  // a gentle wave from right to left (RTL reading order)
  const pts = stops.map((_, i) => ({ x: 800 - (i * 720) / (n - 1), y: i % 2 ? 250 : 130 }));
  const seg = (i: number) => {
    const a = pts[i], b = pts[i + 1];
    const mx = (a.x + b.x) / 2;
    return `M${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
  };
  return (
    <svg width={880} height={420} viewBox="0 0 880 420" style={{ overflow: "visible" }} direction="ltr">
      {pts.slice(0, -1).map((_, i) => (
        <path key={`b${i}`} d={seg(i)} stroke={C.faint} strokeWidth={6} fill="none" strokeDasharray="2 16" strokeLinecap="round" />
      ))}
      {pts.slice(0, -1).map((_, i) => {
        const p = interpolate(t, [stops[i].at, stops[i + 1].at], [0, 1], { ...clamp, easing: S.ease.inOut });
        return <path key={`p${i}`} d={seg(i)} stroke={C.lime} strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - p} />;
      })}
      {stops.map((s, i) => {
        const p = prog(t, s.at - 0.1, 0.35);
        const appear = prog(t, s.at - 1.2, 0.4);
        const active = t >= s.at && (i === n - 1 || t < stops[i + 1].at);
        const { x, y } = pts[i];
        const R = 56 * (1 + (active ? 0.08 + Math.sin(t * 5) * 0.03 : 0));
        return (
          <g key={i} opacity={Math.max(0.35 * appear, p)}>
            {active ? <circle cx={x} cy={y} r={R + 18} fill="none" stroke={C.lime} strokeWidth={3} opacity={0.4} /> : null}
            <circle cx={x} cy={y} r={R} fill={p > 0.5 ? C.lime : C.panelSolid} stroke={p > 0.02 ? C.lime : C.faint} strokeWidth={4} />
            <foreignObject x={x - 30} y={y - 30} width={60} height={60}>
              <Icon name={s.icon} size={60} color={p > 0.5 ? C.ink : C.dim} strokeWidth={2.4} />
            </foreignObject>
            <Label x={x} y={y + 100} text={s.label} color={p > 0.5 ? C.text : C.dim} size={34} weight={active ? 700 : 500} />
          </g>
        );
      })}
    </svg>
  );
};

// ── 8. BARBELL — "الصعوبة المفيدة": reps go up, effort bar fills, the brain gets squeezed ──
export const Barbell: React.FC<{ liftAt: number; squeezeAt: number }> = ({ liftAt, squeezeAt }) => {
  const { t } = useNow();
  const on = prog(t, liftAt, 0.4);
  const rep = t > liftAt ? (1 - Math.cos((t - liftAt) * 3.2)) / 2 : 0; // smooth reps
  const lift = rep * 90 * on;
  const effort = prog(t, liftAt, 3.5, S.ease.inOut);
  const sq = prog(t, squeezeAt, 0.4);
  const squeeze = sq * (Math.sin((t - squeezeAt) * 7) * 0.5 + 0.5);
  return (
    <svg width={760} height={430} viewBox="0 0 760 430" style={{ overflow: "visible" }} direction="ltr">
      <g transform={`translate(0 ${-lift})`}>
        <rect x={110} y={196} width={540} height={18} rx={9} fill={C.text} />
        {[110, 150, 570, 610].map((x, i) => <rect key={i} x={x - (i % 2 ? 0 : 0)} y={i % 2 ? 150 : 130} width={40} height={i % 2 ? 110 : 150} rx={10} fill={i % 2 ? C.dim : C.lime} />)}
      </g>
      {/* effort meter */}
      <rect x={140} y={340} width={480} height={22} rx={11} fill={C.chip} />
      <rect x={140} y={340} width={480 * effort} height={22} rx={11} fill={C.lime} />
      <Label x={380} y={405} text="مجهود" color={C.dim} size={28} />
      {/* brain being squeezed */}
      <g transform={`translate(380 230) scale(${1 + squeeze * 0.12} ${1 - squeeze * 0.14}) translate(-36 -36)`} opacity={sq}>
        <foreignObject width={72} height={72}>
          <Icon name="brain" size={72} color={C.lime} strokeWidth={2.4} />
        </foreignObject>
      </g>
    </svg>
  );
};

// ── 9. BRAIN NET — a brain outline whose network lights up; signals run along strong links ─
const BN = [
  [210, 120], [300, 80], [400, 110], [480, 170], [160, 210], [260, 200], [360, 210], [460, 260],
  [200, 290], [300, 300], [400, 320], [250, 380],
] as const;
const BE = [[0, 1], [1, 2], [2, 3], [0, 4], [0, 5], [1, 5], [2, 6], [3, 7], [4, 5], [5, 6], [6, 7], [4, 8], [5, 9], [6, 10], [8, 9], [9, 10], [7, 10], [8, 11], [9, 11]] as const;

export const BrainNet: React.FC<{ weakAt: number; crossAt: number; buildAt: number; strongAt: number; weak: string }> = ({ weakAt, crossAt, buildAt, strongAt, weak }) => {
  const { t, from } = useNow();
  const outline = prog(t, from + 0.1, 1.0, S.ease.inOut);
  const wk = prog(t, weakAt, 0.35);
  const cross = prog(t, crossAt, 0.3);
  const strong = prog(t, strongAt, 0.6, S.ease.inOut);
  return (
    <svg width={760} height={500} viewBox="0 0 640 470" style={{ overflow: "visible" }} direction="ltr">
      {/* brain silhouette (two lobes) */}
      <path d="M320 40 C 250 0, 150 20, 120 90 C 60 110, 50 200, 90 250 C 60 320, 120 400, 200 400 C 240 450, 300 440, 320 410 C 340 440, 400 450, 440 400 C 520 400, 580 320, 550 250 C 590 200, 580 110, 520 90 C 490 20, 390 0, 320 40 Z"
        fill="rgba(8,11,10,0.55)" stroke={C.text} strokeOpacity={0.8} strokeWidth={5} strokeDasharray="1" pathLength={1} strokeDashoffset={1 - outline} />
      <path d="M320 40 L320 410" stroke={C.faint} strokeWidth={3} strokeDasharray="8 10" opacity={outline} />
      {BE.map(([a, b], i) => {
        const p = prog(t, buildAt + i * 0.08, 0.35, S.ease.inOut);
        const [x1, y1] = BN[a], [x2, y2] = BN[b];
        return <line key={i} x1={x1} y1={y1} x2={lerp(x1, x2, p)} y2={lerp(y1, y2, p)} stroke={strong > 0.5 ? C.lime : C.text} strokeOpacity={0.35 + 0.65 * strong} strokeWidth={3 + 4 * strong} strokeLinecap="round" />;
      })}
      {/* signals travelling along links once they are strong */}
      {strong > 0.5
        ? BE.map(([a, b], i) => {
            const k = ((t - strongAt) * 0.9 + i * 0.37) % 1;
            const [x1, y1] = BN[a], [x2, y2] = BN[b];
            return <circle key={`s${i}`} cx={lerp(x1, x2, k)} cy={lerp(y1, y2, k)} r={7} fill={C.text} opacity={0.9} />;
          })
        : null}
      {BN.map(([x, y], i) => {
        const p = prog(t, buildAt - 0.4 + i * 0.05, 0.3);
        return <circle key={i} cx={x} cy={y} r={(8 + 6 * strong) * (0.6 + 0.4 * p)} fill={strong > 0.5 ? C.lime : C.text} opacity={0.25 + 0.75 * p} />;
      })}
      {/* the "weakness?" misconception: a red badge that gets crossed out */}
      <g opacity={wk * (1 - prog(t, buildAt - 0.2, 0.4))} transform="translate(320 225)">
        <rect x={-150} y={-42} width={300} height={84} rx={42} fill="rgba(255,107,87,0.16)" stroke={C.danger} strokeWidth={3} />
        <text x={0} y={14} textAnchor="middle" fontFamily="Readex" fontWeight={700} fontSize={40} fill={C.danger} direction="rtl">{weak}</text>
        <line x1={-130} y1={0} x2={-130 + 260 * cross} y2={0} stroke={C.danger} strokeWidth={6} strokeLinecap="round" />
      </g>
    </svg>
  );
};

// ── 10. FOLLOW — avatar ring + follow button tapped + bell rings with notification dots ────
export const FollowArt: React.FC<{ tapAt: number; bellAt: number; button: string; done: string }> = ({ tapAt, bellAt, button, done }) => {
  const { t } = useNow();
  const tap = prog(t, tapAt, 0.25);
  const press = 1 - 0.07 * Math.sin(Math.min(1, prog(t, tapAt - 0.1, 0.25)) * Math.PI);
  const ripple = prog(t, tapAt, 0.7);
  const bell = prog(t, bellAt, 0.35);
  const swing = t > bellAt ? Math.sin((t - bellAt) * 14) * 18 * Math.exp(-(t - bellAt) * 1.2) : 0;
  const ring = (t * 0.6) % 1;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 40, direction: "rtl" }}>
      <div style={{ position: "relative", width: 170, height: 170 }}>
        <div style={{ position: "absolute", inset: -14, borderRadius: 200, border: `3px solid ${C.lime}`, opacity: 1 - ring, transform: `scale(${1 + ring * 0.25})` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 170, background: C.panelSolid, border: `5px solid ${C.lime}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="user" size={96} color={C.lime} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "flex-start" }}>
        <div style={{ position: "relative", padding: "22px 54px", borderRadius: 24, overflow: "hidden", transform: `scale(${press})`, background: tap > 0.5 ? C.chip : C.lime, border: `2px solid ${tap > 0.5 ? C.lime : "transparent"}`, display: "flex", alignItems: "center", gap: 14, fontFamily: S.font.ui, fontWeight: 700, fontSize: 50, color: tap > 0.5 ? C.lime : C.ink }}>
          {tap > 0.5 ? <Icon name="check" size={46} color={C.lime} strokeWidth={3} /> : null}
          {tap > 0.5 ? done : button}
          {ripple > 0 && ripple < 1 ? <div style={{ position: "absolute", left: "50%", top: "50%", width: 30, height: 30, margin: -15, borderRadius: 30, background: C.text, opacity: 0.4 * (1 - ripple), transform: `scale(${1 + ripple * 20})` }} /> : null}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: bell }}>
          <div style={{ position: "relative", transform: `rotate(${swing}deg)`, transformOrigin: "50% 10%" }}>
            <Icon name="bell" size={64} color={C.lime} />
            <div style={{ position: "absolute", top: -4, right: -6, width: 22, height: 22, borderRadius: 22, background: C.danger, transform: `scale(${bell})` }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ width: 70, height: 16, borderRadius: 8, background: C.faint, opacity: prog(t, bellAt + 0.3 + i * 0.25, 0.3) }} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── 11. BOLT — "خلّني أصدمك": a lightning bolt draws, strikes, the frame flashes ──────────
export const Bolt: React.FC<{ at: number }> = ({ at }) => {
  const { t } = useNow();
  const draw = prog(t, at, 0.35, S.ease.inOut);
  const fill = prog(t, at + 0.3, 0.15);
  const rays = 14;
  return (
    <div style={{ position: "relative", width: 520, height: 520 }}>
      {[0, 1, 2].map((k) => {
        const r = prog(t, at + 0.3 + k * 0.12, 1.0);
        return <div key={k} style={{ position: "absolute", left: 160, top: 160, width: 200, height: 200, borderRadius: 200, border: `4px solid ${C.lime}`, opacity: (1 - r) * 0.9 * (r > 0 ? 1 : 0), transform: `scale(${0.5 + r * 2})` }} />;
      })}
      <div style={{ position: "absolute", left: 260, top: 260, transform: `rotate(${interpolate(t - at, [0, 3], [-20, 25], clamp)}deg)` }}>
        {Array.from({ length: rays }).map((_, i) => {
          const rp = prog(t, at + 0.3 + i * 0.012, 0.35);
          return <div key={i} style={{ position: "absolute", left: -6, top: 0, width: 12, height: 90 * rp, borderRadius: 12, background: C.lime, opacity: 0.9, transformOrigin: "50% 0%", transform: `rotate(${(360 / rays) * i}deg) translateY(${150 * rp}px)` }} />;
        })}
      </div>
      <svg width={520} height={520} viewBox="0 0 24 24" style={{ position: "absolute", inset: 0, transform: "scale(0.62)" }}>
        <path d="M13 2L4 14h7l-1 8 9-12h-7z" fill={C.lime} fillOpacity={fill} stroke={C.lime} strokeWidth={0.9} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      </svg>
    </div>
  );
};

// ── 0. HOOK SHATTER — viral "you're doing it wrong" hook ─────────────────────────────────
// Frame 0: camera punch + flash (see CameraFX in SignalReel). Check-badges stamp on as the speaker
// names the comfortable belief; on the shock word they SHATTER into shards, a huge red ✗ slams in
// with RGB split, the frame shakes, and the shards fly off.
export const HookShatter: React.FC<{ checks: { text: string; at: number }[]; shatterAt: number }> = ({ checks, shatterAt }) => {
  const { t } = useNow();
  const sh = prog(t, shatterAt, 0.55, S.ease.out); // shard flight
  const xs = prog(t, shatterAt + 0.04, 0.22, S.ease.out); // ✗ slam
  const rgb = t >= shatterAt && t < shatterAt + 0.3 ? (1 - (t - shatterAt) / 0.3) * 14 : 0;
  const shards = [
    "polygon(0 0, 55% 0, 40% 60%, 0 45%)",
    "polygon(55% 0, 100% 0, 100% 50%, 40% 60%)",
    "polygon(0 45%, 40% 60%, 30% 100%, 0 100%)",
    "polygon(40% 60%, 100% 50%, 100% 100%, 30% 100%)",
  ];
  const fly = [[-260, -180, -40], [240, -220, 35], [-220, 200, 30], [260, 160, -45]];
  const badge = (c: { text: string; at: number }, i: number) => {
    const p = prog(t, c.at - 0.05, 0.22, S.ease.out);
    const stamp = 1.35 - 0.35 * p; // stamps down (no bounce)
    const body = (
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 34px", borderRadius: 28, background: C.lime, color: C.ink, fontFamily: S.font.ui, fontWeight: 700, fontSize: 86, boxShadow: `0 20px 50px -10px ${C.shadow}`, direction: "rtl", whiteSpace: "nowrap" }}>
        <Icon name="check" size={76} color={C.ink} strokeWidth={3.4} />
        {c.text}
      </div>
    );
    return (
      <div key={i} style={{ position: "relative", opacity: p, transform: `scale(${stamp}) rotate(${i % 2 ? 3 : -3}deg)` }}>
        {t < shatterAt ? body : shards.map((cp, k) => (
          <div key={k} style={{ position: k ? "absolute" : "relative", inset: 0, clipPath: cp, transform: `translate(${fly[k][0] * sh}px, ${fly[k][1] * sh + 300 * sh * sh}px) rotate(${fly[k][2] * sh}deg)`, opacity: 1 - sh, filter: `saturate(${1 - sh}) hue-rotate(${-80 * sh}deg)` }}>{body}</div>
        ))}
      </div>
    );
  };
  return (
    <div style={{ position: "relative", width: 1080, height: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>{checks.map(badge)}</div>
      {t >= shatterAt ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: xs, transform: `scale(${1.7 - 0.7 * xs})` }}>
          {[["#ff2a6d", -rgb], ["#22d3ee", rgb], [C.danger, 0]].map(([col, dx], k) => (
            <svg key={k} width={420} height={420} viewBox="0 0 24 24" style={{ position: "absolute", transform: `translateX(${dx}px)`, opacity: k < 2 ? 0.7 : 1, mixBlendMode: k < 2 ? "screen" : "normal", filter: k === 2 ? `drop-shadow(0 12px 40px ${C.shadow})` : undefined }}>
              <path d="M5 5L19 19M19 5L5 19" stroke={col as string} strokeWidth={3.6} strokeLinecap="round" />
            </svg>
          ))}
        </div>
      ) : null}
    </div>
  );
};
