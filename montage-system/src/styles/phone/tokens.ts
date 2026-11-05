// PHONE — the viral "iPhone UI" explainer look: the story is told with phone interface pieces that slide
// onto the chest — notification banners, a bank balance draining, app icons, a Notes card that types,
// widgets, a payment sheet with a confirm tick, a chat. Frosted-glass surfaces, iOS colours, Tajawal.
// Captions: clean white words, the spoken word on a blue pill (like a selected word on iOS).
import { Easing } from "remotion";
import { FONT } from "../common/fonts";

export const PH = {
  blue: "#0A84FF",
  green: "#30D158",
  red: "#FF453A",
  orange: "#FF9F0A",
  yellow: "#FFD60A",
  purple: "#BF5AF2",
  glass: "rgba(28,28,32,0.72)",
  glassLight: "rgba(250,250,252,0.86)",
  ink: "#111114",
  white: "#FFFFFF",
  dim: "rgba(255,255,255,0.62)",
  dimInk: "rgba(17,17,20,0.55)",
  line: "rgba(255,255,255,0.14)",
  font: FONT.phone,
  ease: { out: Easing.bezier(0.2, 0.9, 0.25, 1), spring: Easing.bezier(0.34, 1.4, 0.64, 1), inOut: Easing.bezier(0.65, 0, 0.35, 1) },
  layout: { captionY: 1450, chestY: 1080 },
} as const;
