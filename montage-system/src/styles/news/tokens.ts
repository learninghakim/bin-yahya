// NEWSROOM — documentary / breaking-news data style.
// Inspired by the viral "study says…" explainer Shorts: cinematic grade + grain, a live bug and a thin
// ticker, broadcast captions (white on black, the spoken word boxed in red), big counting numbers,
// race bars, citation lower-thirds and typewriter prompts. Red + white + ink. IBM Plex Sans Arabic.
import { Easing } from "remotion";
import { FONT } from "../common/fonts";

export const N = {
  red: "#E5141B",
  redDeep: "#A80D12",
  ink: "#0B0C0F",
  panel: "rgba(11,12,15,0.86)",
  white: "#FFFFFF",
  paper: "#F3F1EC",
  dim: "rgba(255,255,255,0.62)",
  faint: "rgba(255,255,255,0.14)",
  up: "#2BD576",
  down: "#FF3B3B",
  gold: "#FFC531",
  font: FONT.news,
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
  },
  layout: { captionY: 1352, tickerY: 1452, chestY: 1040 },
} as const;
