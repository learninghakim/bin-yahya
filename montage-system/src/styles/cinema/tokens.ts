// CINEMA — documentary style (the viral "essay film" short): letterbox bars, teal-and-amber film grade,
// grain + gentle gate weave, slow push-ins, light-leak transitions, serif Arabic (Amiri) in warm gold,
// chapter cards, a documentary lower-third, a quote that writes itself word by word, an evidence counter,
// and an iris that closes the frame into a box ("a fake mould") then opens again.
import { Easing } from "remotion";
import { FONT } from "../common/fonts";

export const CI = {
  gold: "#E9C77B",
  goldDeep: "#B8914A",
  cream: "#F6EEDC",
  ink: "#0B0A08",
  dim: "rgba(246,238,220,0.66)",
  red: "#D9573B",
  font: FONT.cinema,
  ease: { out: Easing.bezier(0.22, 1, 0.36, 1), inOut: Easing.bezier(0.65, 0, 0.35, 1), slow: Easing.bezier(0.45, 0, 0.2, 1) },
  layout: { bar: 150, captionY: 1500, chestY: 1080 },
} as const;
