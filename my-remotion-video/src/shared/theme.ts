// Single source of truth for colors, type, easings and spring presets.
// Palette is taken from the reference collage (clients/abdullah-almashhor/references/r1.png):
// navy chalkboard, teal + mustard paper cut-outs, off-white paper, chalk white.
import { Easing } from "remotion";

export const baseTheme = {
  colors: {
    bg: "#0B1628",
    bgDeep: "#050A14",
    bgLift: "#16294A",
    teal: "#2A9D84", // hero color — one element per frame
    tealDeep: "#1E7A66",
    yellow: "#E9BF3E", // accent
    paper: "#E7E3DA",
    paperShade: "#CFCAC0",
    grey: "#5E636B",
    greyLight: "#8D9199",
    ink: "#141B26",
    chalk: "#F2F0EA",
    chalkDim: "rgba(242, 240, 234, 0.72)",
    tealGlow: "rgba(42, 157, 132, 0.55)",
  },
  fonts: {
    // Arabic and Latin subsets are separate files; the browser falls back per glyph.
    display: "Cairo, CairoLatin, sans-serif",
    label: "ReemKufi, ReemKufiLatin, Cairo, sans-serif",
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
