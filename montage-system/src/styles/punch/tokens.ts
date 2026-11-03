// PUNCH — bold kinetic captions (the viral "Hormozi-style" talking-head edit).
// Big 1–3 word captions on the chest that pop on every chunk, the spoken word in yellow, key words
// colour-coded (green = good, red = bad), punch-in zoom on every sentence, emoji stickers, number slams,
// black-and-white emphasis windows, flash cuts. Changa ExtraBold with a heavy black stroke.
import { Easing } from "remotion";
import { FONT } from "../common/fonts";

export const P = {
  yellow: "#FFE11A",
  green: "#3DFF7A",
  red: "#FF3D3D",
  white: "#FFFFFF",
  ink: "#000000",
  font: FONT.punch,
  ease: { out: Easing.bezier(0.16, 1, 0.3, 1), inOut: Easing.bezier(0.65, 0, 0.35, 1) },
  layout: { captionY: 1200, topY: 168 },
} as const;
