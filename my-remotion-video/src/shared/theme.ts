// Single source of truth for colors, type, easings and spring presets.
// Palette from clients/abdullah-almashhor/references/style-*.webp:
// deep navy torn paper, cream paper, gold leaf seams, cyan glow accents.
import { Easing } from "remotion";

export const baseTheme = {
  colors: {
    bg: "#0A1526", // deep navy
    bgDeep: "#04080F",
    bgLift: "#1B2F55", // royal navy panels
    teal: "#3FB8D4", // cyan glow — hero color, one element per frame
    tealDeep: "#1F6F8B",
    yellow: "#C9A24B", // gold leaf accent
    paper: "#E8DCC4", // cream torn paper
    paperShade: "#C9BBA0",
    grey: "#4E5560",
    greyLight: "#8A9099",
    ink: "#0E1622",
    chalk: "#F3EEE3",
    chalkDim: "rgba(243, 238, 227, 0.72)",
    tealGlow: "rgba(63, 184, 212, 0.55)",
  },
  fonts: {
    // Arabic and Latin subsets are separate files; the browser falls back per glyph.
    display: "Cairo, CairoLatin, sans-serif",
    label: "ReemKufi, ReemKufiLatin, Cairo, sans-serif",
    headline: "NotoKufi, NotoKufiLatin, Cairo, sans-serif",
    caption: "PlexArabic, PlexArabicLatin, Cairo, sans-serif",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    gentle: { damping: 24, stiffness: 70, mass: 1 },
  },
  // Scene boundaries in seconds — converted with fps everywhere.
  timing: {
    scene1: { from: 0, duration: 5 },
    scene2: { from: 5, duration: 7 },
    scene3: { from: 12, duration: 6 },
    scene4: { from: 18, duration: 2 },
    exit: 0.34, // exits are faster than entrances
  },
} as const;

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInSeconds: 20,
} as const;
