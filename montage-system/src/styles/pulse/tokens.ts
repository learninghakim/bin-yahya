// PULSE — tech HUD style (the viral "AI / data explainer" look): cool cyan-graded footage, thin HUD
// brackets locking onto the face, neon line charts and bars that draw on the spoken number, glitch-slice
// transitions, a chat window that types. Graphics float on soft dark halos (no big boxes), so the face and
// hands stay visible. Captions: no box, the spoken word in cyan with a glowing underline.
import { Easing } from "remotion";
import { FONT } from "../common/fonts";

export const PU = {
  bg: "#04070D",
  cyan: "#22E6FF",
  cyanSoft: "rgba(34,230,255,0.16)",
  magenta: "#FF2E7E",
  magentaSoft: "rgba(255,46,126,0.16)",
  white: "#F2FBFF",
  dim: "rgba(242,251,255,0.6)",
  faint: "rgba(242,251,255,0.14)",
  halo: "rgba(3,6,12,0.72)",
  font: FONT.pulse,
  ease: { out: Easing.bezier(0.16, 1, 0.3, 1), inOut: Easing.bezier(0.65, 0, 0.35, 1) },
  layout: { captionY: 1440, artY: 1090 },
} as const;
