import { random } from "remotion";
import { theme } from "../theme";
import { paperBlotch, paperNoise } from "./textures";

/** Deterministic torn-edge clip-path for a w×h rectangle. */
export const tornPolygon = (
  seed: string,
  w: number,
  h: number,
  amp = 7,
  step = 16,
) => {
  const pts: [number, number][] = [];
  let i = 0;
  const j = () => random(`${seed}-${i++}`) * amp;
  for (let x = 0; x <= w; x += step) pts.push([x, j()]);
  for (let y = step; y <= h; y += step) pts.push([w - j(), y]);
  for (let x = w - step; x >= 0; x -= step) pts.push([x, h - j()]);
  for (let y = h - step; y > 0; y -= step) pts.push([j(), y]);
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(", ")})`;
};

type PaperProps = {
  width: number;
  height: number;
  color: string;
  seed: string;
  rim?: number; // white torn border, like a cut-out sticker
  radius?: number;
  shadow?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** Torn paper cut-out with fibre texture, aged blotches and a soft cast shadow. */
export const Paper: React.FC<PaperProps> = ({
  width,
  height,
  color,
  seed,
  rim = 8,
  shadow = true,
  style,
  children,
}) => {
  const inner = { w: width - rim * 2, h: height - rim * 2 };
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        filter: shadow
          ? "drop-shadow(0 22px 26px rgba(0,0,0,0.5)) drop-shadow(0 4px 5px rgba(0,0,0,0.35))"
          : undefined,
        ...style,
      }}
    >
      {rim > 0 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: theme.colors.paper,
            clipPath: tornPolygon(`${seed}-rim`, width, height, 9, 14),
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: rim,
          top: rim,
          width: inner.w,
          height: inner.h,
          background: color,
          clipPath: tornPolygon(seed, inner.w, inner.h, rim > 0 ? 5 : 8),
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: paperNoise,
            backgroundSize: "260px",
            mixBlendMode: "multiply",
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: paperBlotch,
            backgroundSize: "600px",
            mixBlendMode: "multiply",
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.12), transparent 40%, rgba(0,0,0,0.12))",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Translucent strip of masking tape. */
export const Tape: React.FC<{
  width?: number;
  height?: number;
  color?: string;
  seed: string;
  style?: React.CSSProperties;
}> = ({ width = 170, height = 52, color = theme.colors.teal, seed, style }) => (
  <div
    style={{
      position: "absolute",
      width,
      height,
      background: color,
      opacity: 0.88,
      clipPath: tornPolygon(seed, width, height, 6, 9),
      boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: paperNoise,
        backgroundSize: "260px",
        mixBlendMode: "multiply",
        opacity: 0.5,
      }}
    />
  </div>
);
