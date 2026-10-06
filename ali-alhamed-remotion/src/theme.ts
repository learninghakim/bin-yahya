// theme.ts — single source of truth: KINETIC CHAPTER FRAME — ARABIC
// Palette sampled from the Arabic references R1–R10 (near-black, white, neon pink).
import { Easing } from "remotion";

export const theme = {
  colors: {
    bg: "#050507",
    bgAlt: "#0B0B0F",
    card: "rgba(12,12,16,0.94)",
    cardSolid: "#0C0C10",
    border: "rgba(255,255,255,0.10)",
    borderStrong: "rgba(255,255,255,0.18)",
    pink: "#FF1A6C", // THE hero color — emphasis only
    pinkSoft: "rgba(255,26,108,0.16)",
    glow: "rgba(255,26,108,0.55)",
    text: "#FFFFFF",
    textDim: "#A6A6AE",
    textMute: "#5E5E66",
    dot: "rgba(255,255,255,0.075)",
  },
  fonts: {
    display: "Cairo", // 800/900 headlines, numbers
    body: "Tajawal", // 500/700 details
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1), // entrances
    inOut: Easing.bezier(0.83, 0, 0.17, 1), // moves / reframes
    in: Easing.bezier(0.7, 0, 0.84, 0), // exits only
    soft: Easing.bezier(0.33, 1, 0.68, 1),
  },
  spring: {
    snappy: { damping: 15, stiffness: 190, mass: 0.6 }, // text / chips (≈8–10f)
    smooth: { damping: 20, stiffness: 120, mass: 0.9 }, // big blocks
    pop: { damping: 10, stiffness: 210, mass: 0.6 }, // icons: 0.75 → 1.05 → 1
  },
  // Motion timing (frames @30fps) from the motion style guide
  motion: {
    exit: 6, // exits 4–8f
    stagger: 3, // 2–4f
    reframe: 9, // presenter layout morph
  },
  radius: { card: 18, chip: 999, panel: 26 },
  safe: { x: 120, top: 80, bottom: 100 },
} as const;

export const glowText = (strength = 1) =>
  `0 0 ${18 * strength}px rgba(255,26,108,${0.55 * strength}), 0 0 ${46 * strength}px rgba(255,26,108,${0.3 * strength})`;
