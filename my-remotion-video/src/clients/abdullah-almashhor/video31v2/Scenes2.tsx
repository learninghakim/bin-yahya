import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ChalkLine, Sparks } from "../../../shared/components/Chalk";
import { CLAMP } from "../../../shared/components/motion";
import { Paper } from "../../../shared/components/Paper";
import { TornBackdrop } from "../components/TornBackdrop";
import {
  colors,
  fonts,
  Glyph,
  theme,
  useAt,
  useOut,
  useSpr,
} from "../video31/kit";
import { SCENES, splitY } from "./plan";

const still = (name: string) =>
  staticFile(`clients/abdullah-almashhor/31-stills/${name}.jpg`);
const X_MARK = "M10 10 L110 110 M110 12 L14 108";

const Backdrop: React.FC<{ fadeOut?: number }> = ({ fadeOut }) => {
  const p = useSpr(0, theme.spring.smooth);
  const o = useOut(fadeOut ?? 1e9, 8);
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, p * 1.4) * (1 - o) }}>
      <TornBackdrop />
    </AbsoluteFill>
  );
};

/** Black-and-white instant photo cut from the footage, with a cream border. */
const Polaroid: React.FC<{
  src: string;
  w: number;
  label?: string;
  style?: React.CSSProperties;
}> = ({ src, w, label, style }) => {
  const h = (w * 450) / 380;
  return (
    <div
      style={{
        position: "absolute",
        width: w + 24,
        padding: "12px 12px 0",
        background: colors.chalk,
        boxShadow: "0 18px 26px rgba(0,0,0,0.42), 0 3px 5px rgba(0,0,0,0.3)",
        ...style,
      }}
    >
      <Img
        src={src}
        style={{ width: w, height: h, display: "block", objectFit: "cover" }}
      />
      <div
        style={{
          height: w * 0.2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.headline,
          fontWeight: 800,
          fontSize: w * 0.12,
          color: colors.ink,
          direction: "rtl",
        }}
      >
        {label}
      </div>
    </div>
  );
};

/* s1 — A: a falling line chart (fail), then identical photocopies of the same moment (same pattern). */
const S1: React.FC = () => {
  const at = useAt(0);
  const frame = useCurrentFrame();
  const chartIn = useSpr(at(0.15), theme.spring.snappy);
  const chartOut = useOut(at(3.0));
  const draw = interpolate(frame, [at(0.4), at(1.4)], [0, 1], {
    ...CLAMP,
    easing: theme.ease.inOut,
  });
  const out = useOut(at(5.5));
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 470,
          opacity: Math.min(1, chartIn * 1.5) * (1 - chartOut),
          transform: `translateX(${interpolate(chartIn, [0, 1], [-120, 0])}px) rotate(${interpolate(chartIn, [0, 1], [-12, -4])}deg)`,
        }}
      >
        <Paper width={270} height={230} color={colors.chalk} seed="fail-chart">
          <svg width={230} height={190} viewBox="0 0 230 190">
            <path
              d="M20 20 V170 H215"
              stroke={colors.ink}
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M28 40 L70 70 L100 58 L140 110 L170 100 L205 160"
              stroke={colors.teal}
              strokeWidth={9}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - draw}
            />
            <path
              d="M188 160 L205 160 L203 142"
              stroke={colors.teal}
              strokeWidth={9}
              fill="none"
              strokeLinecap="round"
              opacity={draw > 0.95 ? 1 : 0}
            />
          </svg>
        </Paper>
      </div>
      {[0, 1, 2].map((i) => {
        const p = spring({
          frame: frame - at(3.0) - i * 5,
          fps: 30,
          config: theme.spring.snappy,
        });
        return (
          <Polaroid
            key={i}
            src={still("s1")}
            w={150}
            style={{
              left: 830,
              top: 400 + i * 200,
              opacity: Math.min(1, p * 1.6) * (1 - out),
              transform: `translateX(${interpolate(p, [0, 1], [300, 0])}px) rotate(5deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* s2 — C: a photocopier slot keeps printing the same photo; an infinity loop locks them in. */
const S2: React.FC = () => {
  const at = useAt(5.5);
  const frame = useCurrentFrame();
  const slotIn = useSpr(at(5.55), theme.spring.smooth);
  const o = useOut(at(8.22));
  return (
    <AbsoluteFill>
      <Backdrop fadeOut={at(8.22)} />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const p = spring({
            frame: frame - at(5.7) - i * 7,
            fps: 30,
            config: theme.spring.smooth,
          });
          return (
            <Polaroid
              key={i}
              src={still("s9")}
              w={230}
              style={{
                left: 540 - 127 + (i - 2) * 70,
                top: 330,
                opacity: p > 0.02 ? 1 : 0,
                transform: `translateY(${interpolate(p, [0, 1], [-420, 120 + i * 34])}px) rotate(${(i - 2) * 6 * p}deg)`,
                clipPath: `inset(${interpolate(p, [0, 0.4], [100, 0], CLAMP)}% 0 0 0)`,
              }}
            />
          );
        })}
        {/* copier slot */}
        <div
          style={{
            position: "absolute",
            left: 170,
            top: 300,
            width: 740,
            height: 70,
            borderRadius: 14,
            background: `linear-gradient(180deg, ${colors.bgLift}, ${colors.bgDeep})`,
            borderBottom: `6px solid ${colors.yellow}`,
            boxShadow: "0 18px 30px rgba(0,0,0,0.5)",
            transform: `scaleX(${slotIn})`,
          }}
        />
        <ChalkLine
          x={150}
          y={720}
          width={780}
          height={420}
          d="M390 210 C300 60 60 60 60 210 C60 360 300 360 390 210 C480 60 720 60 720 210 C720 360 480 360 390 210"
          delay={at(7.25)}
          duration={22}
          strokeWidth={10}
        />
      </div>
    </AbsoluteFill>
  );
};

/* s3 — SPLIT: Abdullah top-left; bottom-right a mastery bar hits 100% then drains — the feeling fades. */
const Seam: React.FC = () => {
  const p = useSpr(0, theme.spring.smooth);
  const pts = (off: number, amp: number, seed: string) => {
    const a: string[] = [];
    for (let x = -40, k = 0; x <= 1120; x += 14, k++)
      a.push(
        `${x}px ${(splitY(x) + off + (random(`${seed}${k}`) - 0.5) * amp).toFixed(1)}px`,
      );
    return a;
  };
  const band = (top: number, bottom: number, bg: string, seed: string) => (
    <AbsoluteFill
      style={{
        background: bg,
        clipPath: `polygon(${[...pts(top, 14, seed + "a"), ...pts(bottom, 14, seed + "b").reverse()].join(",")})`,
      }}
    />
  );
  return (
    <AbsoluteFill
      style={{
        opacity: p,
        filter: "drop-shadow(0 -8px 18px rgba(0,0,0,0.45))",
      }}
    >
      {band(-6, 14, colors.paper, "cream")}
      {band(
        10,
        24,
        `linear-gradient(100deg, ${colors.yellow}, #E9CC7A 40%, #9C7A2E 70%, ${colors.yellow})`,
        "gold",
      )}
    </AbsoluteFill>
  );
};

const S3: React.FC = () => {
  const at = useAt(8.22);
  const frame = useCurrentFrame();
  const cardIn = useSpr(at(8.3), theme.spring.snappy);
  const fill = interpolate(frame, [at(8.4), at(9.5)], [0, 1], {
    ...CLAMP,
    easing: theme.ease.out,
  });
  const drain = interpolate(frame, [at(9.75), at(11.2)], [0, 1], {
    ...CLAMP,
    easing: theme.ease.inOut,
  });
  const level = fill * (1 - 0.82 * drain);
  const jitter = drain > 0 && drain < 1 ? Math.sin(frame * 1.9) * 4 : 0;
  const barColor = drain > 0.4 ? colors.greyLight : colors.yellow;
  return (
    <AbsoluteFill>
      <Backdrop fadeOut={at(11.73)} />
      <div
        style={{
          position: "absolute",
          left: 560,
          top: 1010,
          opacity: Math.min(1, cardIn * 1.5),
          transform: `translateY(${interpolate(cardIn, [0, 1], [120, 0])}px) rotate(${-3 + jitter * 0.3}deg)`,
        }}
      >
        <Paper width={440} height={190} color={colors.chalk} seed="bar">
          <div style={{ width: 380, direction: "rtl" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: fonts.headline,
                fontWeight: 900,
                fontSize: 40,
                color: colors.ink,
              }}
            >
              <span>الإتقان</span>
              <span style={{ direction: "ltr" }}>
                {Math.round(level * 100)}%
              </span>
            </div>
            <div
              style={{
                marginTop: 14,
                height: 34,
                borderRadius: 17,
                background: colors.paperShade,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${level * 100}%`,
                  height: "100%",
                  background: barColor,
                  borderRadius: 17,
                  marginRight: 0,
                  marginLeft: "auto",
                }}
              />
            </div>
          </div>
        </Paper>
      </div>
    </AbsoluteFill>
  );
};

/* s4a — A punch-in on "لكن الصدمة". */
const S4a: React.FC = () => {
  const at = useAt(11.73);
  return (
    <AbsoluteFill>
      <Sparks
        x={200}
        y={990}
        delay={at(11.76)}
        angle={-150}
        size={90}
        count={5}
      />
      <Sparks
        x={880}
        y={990}
        delay={at(11.8)}
        angle={-30}
        size={90}
        count={5}
      />
    </AbsoluteFill>
  );
};

/* s4b — C: the "mastery" photo dissolves into gold dust; the real test date arrives. */
const S4b: React.FC = () => {
  const at = useAt(13.07);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = useSpr(at(13.1), theme.spring.snappy);
  const W = 420;
  const H = 560;
  const PH = { x: 20, y: 20, w: 380, h: 450 };
  const CELL = 28;
  const cols = Math.ceil(W / CELL);
  const rows = Math.ceil(H / CELL);
  const t0 = at(13.85);
  const cal = useSpr(at(15.0), theme.spring.bouncy);
  const calOut = useOut(at(16.7));
  return (
    <AbsoluteFill>
      <Backdrop fadeOut={at(16.7)} />
      <div
        style={{
          position: "absolute",
          left: 540 - W / 2,
          top: 420,
          width: W,
          height: H,
          transform: `translateY(${interpolate(inP, [0, 1], [90, 0])}px) rotate(-3deg)`,
          opacity: Math.min(1, inP * 1.5),
        }}
      >
        {Array.from({ length: cols * rows }).map((_, k) => {
          const cx = (k % cols) * CELL;
          const cy = Math.floor(k / cols) * CELL;
          // dissolve sweeps from the top-right corner
          const delay =
            ((W - cx) / W) * 14 + (cy / H) * 10 + random(`d${k}`) * 8;
          const d = Math.max(0, (frame - t0 - delay) / fps);
          const inPhoto =
            cx + CELL > PH.x &&
            cx < PH.x + PH.w &&
            cy + CELL > PH.y &&
            cy < PH.y + PH.h;
          return (
            <div
              key={k}
              style={{
                position: "absolute",
                left: cx,
                top: cy,
                width: CELL,
                height: CELL,
                backgroundColor: inPhoto ? undefined : colors.chalk,
                backgroundImage: inPhoto ? `url(${still("s14")})` : undefined,
                backgroundSize: `${PH.w}px ${PH.h}px`,
                backgroundPosition: `${PH.x - cx}px ${PH.y - cy}px`,
                opacity: interpolate(d, [0, 0.9], [1, 0], CLAMP),
                transform: `translate(${(random(`x${k}`) - 0.3) * 160 * d}px, ${-260 * d * d - 60 * d}px) scale(${1 - d * 0.6}) rotate(${random(`r${k}`) * 180 * d}deg)`,
                boxShadow:
                  d > 0.05 ? `0 0 ${10 * d}px ${colors.yellow}` : undefined,
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: PH.y + PH.h,
            height: H - PH.y - PH.h,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.headline,
            fontWeight: 900,
            fontSize: 52,
            color: colors.ink,
            direction: "rtl",
            opacity: interpolate(frame, [t0 + 6, t0 + 16], [1, 0], CLAMP),
          }}
        >
          الإتقان
        </div>
      </div>
      {/* tear-off calendar: test day */}
      <div
        style={{
          position: "absolute",
          left: 540 - 170,
          top: 640,
          opacity: Math.min(1, cal * 1.5) * (1 - calOut),
          transform: `scale(${interpolate(cal, [0, 1], [0.4, 1])}) rotate(${interpolate(cal, [0, 1], [18, 3])}deg)`,
        }}
      >
        <div
          style={{
            width: 340,
            background: colors.chalk,
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 24px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              background: colors.teal,
              height: 90,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.headline,
              fontWeight: 900,
              fontSize: 46,
              color: colors.chalk,
              direction: "rtl",
            }}
          >
            يوم الاختبار
          </div>
          <div
            style={{
              height: 230,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.headline,
              fontWeight: 900,
              fontSize: 170,
              color: colors.ink,
            }}
          >
            !
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* s5 — A: three ribbons arrive apart, then weave into a braid as "التدريب المتداخل" lands on a torn band. */
const S5: React.FC = () => {
  const at = useAt(16.7);
  const frame = useCurrentFrame();
  const weave = interpolate(frame, [at(18.8), at(19.5)], [0, 1], {
    ...CLAMP,
    easing: theme.ease.inOut,
  });
  const band = useSpr(at(18.72), theme.spring.snappy);
  const bandOut = useOut(at(20.5));
  const ribbons = [
    { c: colors.paper, y: 1290, t: 16.9, phase: 0 },
    { c: colors.yellow, y: 1320, t: 17.3, phase: (Math.PI * 2) / 3 },
    { c: colors.teal, y: 1350, t: 17.7, phase: (Math.PI * 4) / 3 },
  ];
  const out = useOut(at(20.5));
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1000,
          height: 200,
          background: colors.chalk,
          clipPath: `polygon(0 8%, ${band * 100}% 0, ${band * 100}% 100%, 0 92%)`,
          opacity: 1 - bandOut,
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1000,
          height: 200,
          background: `linear-gradient(180deg, ${colors.bg}, ${colors.bgLift})`,
          clipPath: `polygon(0 14%, ${band * 100}% 7%, ${band * 100}% 93%, 0 86%)`,
          opacity: (1 - bandOut) * 0.92,
        }}
      />
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, opacity: 1 - out }}
      >
        {ribbons.map((r, i) => {
          const p = interpolate(frame, [at(r.t), at(r.t) + 14], [0, 1], {
            ...CLAMP,
            easing: theme.ease.out,
          });
          const pts: string[] = [];
          for (let x = 60; x <= 1020; x += 20) {
            const straight = r.y;
            const woven = 1320 + Math.sin(x / 70 + r.phase + frame / 12) * 34;
            pts.push(
              `${x},${(straight + (woven - straight) * weave).toFixed(1)}`,
            );
          }
          return (
            <polyline
              key={i}
              points={pts.join(" ")}
              fill="none"
              stroke={r.c}
              strokeWidth={14}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - p}
              style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.4))" }}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/* s6 — ARCH: one tall tile "تمرين ١" gets crossed; two different tiles fall in beside it. */
const Tile: React.FC<{
  x: number;
  y: number;
  at: number;
  color: string;
  kind: "pen" | "book" | "compass";
  label: string;
  seed: string;
  out: number;
}> = ({ x, y, at, color, kind, label, seed, out }) => {
  const p = useSpr(at, theme.spring.bouncy);
  const o = useOut(out);
  return (
    <div
      style={{
        position: "absolute",
        left: x - 100,
        top: y - 120,
        opacity: Math.min(1, p * 1.6) * (1 - o),
        transform: `translateY(${interpolate(p, [0, 1], [-260, 0])}px) rotate(${interpolate(p, [0, 1], [25, 3])}deg)`,
        transformOrigin: "50% 100%",
      }}
    >
      <Paper width={200} height={240} color={color} seed={seed}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Glyph kind={kind} size={96} />
          <span
            style={{
              fontFamily: fonts.headline,
              fontWeight: 900,
              fontSize: 34,
              color: colors.ink,
            }}
          >
            {label}
          </span>
        </div>
      </Paper>
    </div>
  );
};

const S6: React.FC = () => {
  const at = useAt(20.5);
  return (
    <AbsoluteFill>
      <Backdrop fadeOut={at(22.55)} />
      <Tile
        x={850}
        y={560}
        at={at(20.6)}
        color={colors.chalk}
        kind="pen"
        label="تمرين ١"
        seed="t1"
        out={at(22.55)}
      />
      <ChalkLine
        x={790}
        y={490}
        width={150}
        height={150}
        d={X_MARK}
        delay={at(21.35)}
        duration={8}
        strokeWidth={14}
      />
      <Tile
        x={850}
        y={830}
        at={at(21.95)}
        color={colors.yellow}
        kind="book"
        label="قراءة"
        seed="t2"
        out={at(22.55)}
      />
      <Tile
        x={850}
        y={1100}
        at={at(22.1)}
        color={colors.teal}
        kind="compass"
        label="رسم"
        seed="t3"
        out={at(22.55)}
      />
    </AbsoluteFill>
  );
};

/* s7 — C (hero): a one-hour timetable; blocked tiles get shuffled into an interleaved, random order. */
const KINDS = [
  { kind: "pen" as const, color: colors.chalk },
  { kind: "book" as const, color: colors.yellow },
  { kind: "compass" as const, color: colors.teal },
];
// slot index each tile occupies at each beat (tiles 0-2 pen, 3-5 book, 6-8 compass)
const ORDERS = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [4, 0, 8, 6, 2, 1, 3, 7, 5],
  [7, 3, 1, 0, 5, 8, 4, 2, 6],
];
const S7: React.FC = () => {
  const at = useAt(22.55);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const board = useSpr(at(22.6), theme.spring.smooth);
  const beats = [at(26.27), at(26.95)];
  const dice = useSpr(at(26.2), theme.spring.bouncy);
  const dieSpin = interpolate(frame, [at(26.2), at(26.9)], [0, 540], {
    ...CLAMP,
    easing: theme.ease.out,
  });
  const hand = interpolate(frame, [at(25.0), at(26.2)], [0, 360], {
    ...CLAMP,
    easing: theme.ease.inOut,
  });
  const BX = 540 - 400;
  const BY = 520;
  const slot = (n: number) => ({
    x: BX + 60 + (n % 3) * 240,
    y: BY + 150 + Math.floor(n / 3) * 200,
  });
  const o = useOut(at(27.78));
  return (
    <AbsoluteFill>
      <Backdrop fadeOut={at(27.78)} />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
        <div
          style={{
            position: "absolute",
            left: BX,
            top: BY,
            opacity: Math.min(1, board * 1.4),
            transform: `translateY(${interpolate(board, [0, 1], [100, 0])}px) scale(${interpolate(board, [0, 1], [0.85, 1])})`,
          }}
        >
          <Paper
            width={800}
            height={790}
            color={colors.bgLift}
            seed="board"
            rim={14}
          >
            <div />
          </Paper>
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 18,
              direction: "rtl",
              fontFamily: fonts.headline,
              fontWeight: 900,
              fontSize: 48,
              color: colors.chalk,
            }}
          >
            <span>ساعة واحدة</span>
            <svg width={56} height={56} viewBox="0 0 56 56">
              <circle
                cx={28}
                cy={28}
                r={23}
                fill="none"
                stroke={colors.yellow}
                strokeWidth={5}
              />
              <line
                x1={28}
                y1={28}
                x2={28 + Math.sin((hand * Math.PI) / 180) * 16}
                y2={28 - Math.cos((hand * Math.PI) / 180) * 16}
                stroke={colors.yellow}
                strokeWidth={5}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        {Array.from({ length: 9 }).map((_, i) => {
          const kind = KINDS[Math.floor(i / 3)];
          let pos = slot(ORDERS[0][i]);
          beats.forEach((b, k) => {
            const p = spring({
              frame: frame - b - (i % 3) * 2,
              fps,
              config: theme.spring.bouncy,
            });
            const a = slot(ORDERS[k][i]);
            const c = slot(ORDERS[k + 1][i]);
            pos = { x: pos.x + (c.x - a.x) * p, y: pos.y + (c.y - a.y) * p };
          });
          const pin = spring({
            frame: frame - at(22.75) - i * 3,
            fps,
            config: theme.spring.snappy,
          });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                opacity: Math.min(1, pin * 1.6),
                transform: `scale(${interpolate(pin, [0, 1], [0.4, 1])}) rotate(${(random(`tr${i}`) - 0.5) * 8}deg)`,
              }}
            >
              <Paper
                width={200}
                height={170}
                color={kind.color}
                seed={`slot${i}`}
                rim={10}
              >
                <Glyph kind={kind.kind} size={84} />
              </Paper>
            </div>
          );
        })}
        {/* paper die */}
        <div
          style={{
            position: "absolute",
            left: 830,
            top: 1360,
            opacity: Math.min(1, dice * 1.5),
            transform: `scale(${interpolate(dice, [0, 1], [0.3, 1])}) rotate(${dieSpin}deg)`,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 22,
              background: colors.chalk,
              boxShadow: "0 14px 24px rgba(0,0,0,0.45)",
              position: "relative",
            }}
          >
            {[
              [30, 30],
              [60, 60],
              [90, 90],
              [90, 30],
              [30, 90],
            ].map(([x, y], k) => (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: x - 10,
                  top: y - 10,
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  background: colors.ink,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* s8 — A: a halo of orbits above the head; three dots keep switching orbits (switching patterns). */
const S8: React.FC = () => {
  const at = useAt(27.78);
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [at(27.85), at(28.4)], [0, 1], {
    ...CLAMP,
    easing: theme.ease.out,
  });
  const out = useOut(at(30.87));
  const orbits = [52, 78, 104];
  const dots = [colors.chalk, colors.yellow, colors.teal];
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0, opacity: 1 - out }}
    >
      {orbits.map((ry, k) => (
        <ellipse
          key={k}
          cx={540}
          cy={250}
          rx={240 + k * 70}
          ry={ry}
          fill="none"
          stroke={colors.yellow}
          strokeWidth={3}
          opacity={0.75}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - draw}
          filter="url(#chalk)"
        />
      ))}
      {dots.map((c, i) => {
        const hop = Math.floor((frame - at(28.2)) / 22 + i) % 3;
        const k = frame < at(28.2) ? i : (hop + 3) % 3;
        const a = frame / (10 + i * 4) + i * 2;
        return (
          <circle
            key={i}
            cx={540 + Math.cos(a) * (240 + k * 70)}
            cy={250 + Math.sin(a) * orbits[k]}
            r={14}
            fill={c}
            opacity={draw}
            style={{ filter: `drop-shadow(0 0 10px ${c})` }}
          />
        );
      })}
    </svg>
  );
};

/* s9 — C: roots grow from a seed, branch by branch — strong connections being built. */
type Seg = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  depth: number;
  order: number;
};
const SEGS: Seg[] = (() => {
  const out: Seg[] = [];
  let order = 0;
  const grow = (
    x: number,
    y: number,
    ang: number,
    len: number,
    depth: number,
    seed: string,
  ) => {
    if (depth > 5) return;
    const x2 = x + Math.cos(ang) * len;
    const y2 = y + Math.sin(ang) * len;
    out.push({ x1: x, y1: y, x2, y2, depth, order: order++ });
    const n = depth < 2 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const spread =
        (i - (n - 1) / 2) * 0.62 + (random(`${seed}-${i}`) - 0.5) * 0.4;
      grow(
        x2,
        y2,
        ang + spread,
        len * (0.7 + random(`${seed}-l${i}`) * 0.12),
        depth + 1,
        `${seed}${i}`,
      );
    }
  };
  grow(540, 1150, -Math.PI / 2, 190, 0, "root");
  return out;
})();
const S9: React.FC = () => {
  const at = useAt(30.87);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seed = useSpr(at(30.9), theme.spring.bouncy);
  const span = [at(31.1), at(33.9)];
  const maxDepth = 6;
  return (
    <AbsoluteFill>
      <Backdrop fadeOut={at(34.0)} />
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        {SEGS.map((s, k) => {
          const start =
            span[0] +
            ((span[1] - span[0]) * s.depth) / maxDepth +
            (s.order % 5);
          const p = interpolate(frame, [start, start + 10], [0, 1], {
            ...CLAMP,
            easing: theme.ease.out,
          });
          if (p <= 0) return null;
          return (
            <g key={k}>
              <line
                x1={s.x1}
                y1={s.y1}
                x2={s.x1 + (s.x2 - s.x1) * p}
                y2={s.y1 + (s.y2 - s.y1) * p}
                stroke={colors.yellow}
                strokeWidth={Math.max(2, 12 - s.depth * 2)}
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 6px rgba(201,162,75,0.6))" }}
              />
              {s.depth === 5 ? (
                <circle
                  cx={s.x2}
                  cy={s.y2}
                  r={
                    9 *
                    spring({
                      frame: frame - start - 8,
                      fps,
                      config: theme.spring.bouncy,
                    })
                  }
                  fill={colors.teal}
                  style={{ filter: `drop-shadow(0 0 10px ${colors.tealGlow})` }}
                />
              ) : null}
            </g>
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 540 - 70,
          top: 1120,
          opacity: Math.min(1, seed * 1.5),
          transform: `scale(${interpolate(seed, [0, 1], [0.3, 1])})`,
        }}
      >
        <Paper width={140} height={110} color={colors.chalk} seed="seed">
          <span
            style={{
              fontFamily: fonts.headline,
              fontWeight: 900,
              fontSize: 34,
              color: colors.ink,
            }}
          >
            مجهود
          </span>
        </Paper>
      </div>
    </AbsoluteFill>
  );
};

/* s10 — A: calm close; hand underline under "طويلة المدى" stays to the end. */
const S10: React.FC = () => {
  const at = useAt(34.0);
  return (
    <AbsoluteFill>
      <ChalkLine
        x={260}
        y={1300}
        width={560}
        height={50}
        d="M540 20 C420 34 260 10 120 28 C80 32 40 26 20 34"
        delay={at(35.45)}
        duration={9}
        strokeWidth={10}
      />
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC> = {
  s1: S1,
  s2: S2,
  s3: S3,
  s4a: S4a,
  s4b: S4b,
  s5: S5,
  s6: S6,
  s7: S7,
  s8: S8,
  s9: S9,
  s10: S10,
};

/** "under" = behind the footage (collage scenes), "over" = on top (A shots + the split seam). */
export const SceneGraphics2: React.FC<{ layer: "under" | "over" }> = ({
  layer,
}) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {SCENES.map((s) => {
        const Comp = MAP[s.id];
        const isUnder = s.layout !== "A";
        const from = Math.round(s.from * fps);
        const dur = Math.round((s.to - s.from) * fps) + 2;
        if (layer === "over" && s.layout === "SPLIT") {
          return (
            <Sequence
              key={s.id + "-seam"}
              from={from}
              durationInFrames={dur - 2}
              layout="none"
              name={`${s.id}-seam`}
            >
              <Seam />
            </Sequence>
          );
        }
        if ((layer === "under") !== isUnder) return null;
        return (
          <Sequence
            key={s.id}
            name={s.id}
            from={from}
            durationInFrames={dur}
            layout="none"
          >
            <AbsoluteFill>
              <Comp />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </>
  );
};
