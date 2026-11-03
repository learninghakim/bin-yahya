// PAPER — calm notebook / "colour-pop" study style (the viral explainer look of study & productivity
// creators): footage graded almost black-and-white and warm, while every graphic is paper in full colour —
// taped cards, sticky notes, notebook lists, red-pen strikes, rubber stamps and hand-drawn doodles that
// draw themselves on the spoken word. Captions on a torn paper strip with a yellow marker on the
// spoken word. Marhey (hand-lettered Arabic).
import { Easing } from "remotion";
import { FONT } from "../common/fonts";

export const PA = {
  paper: "#FBF6EA",
  paperShade: "#EFE6D2",
  line: "rgba(47,107,255,0.18)", // notebook ruling
  margin: "rgba(229,72,59,0.45)",
  ink: "#1D1B18",
  inkSoft: "rgba(29,27,24,0.62)",
  marker: "#FFE45C",
  red: "#E5483B",
  blue: "#2F6BFF",
  green: "#21A366",
  tape: "rgba(255,240,180,0.78)",
  sticky: { yellow: "#FFE873", pink: "#FFB3C7", blue: "#A8D8FF", green: "#B8F0A8" },
  font: FONT.paper,
  ease: { out: Easing.bezier(0.22, 1, 0.36, 1), inOut: Easing.bezier(0.65, 0, 0.35, 1), back: Easing.bezier(0.34, 1.56, 0.64, 1) },
  layout: { captionY: 1440, chestTop: 880 },
} as const;
