// ─────────────────────────────────────────────────────────────────────────────
// THEME — the single source of truth for colors, type, easings and springs.
// Components NEVER inline a hex color or an easing: they read from here.
// A video can override any color via `spec.theme` (see src/system/types.ts).
// ─────────────────────────────────────────────────────────────────────────────
import { Easing } from "remotion";

export const defaultColors = {
  ink: "#0B0F17", // dark card surface
  inkSoft: "#161C28",
  paper: "#FFFFFF", // main text on dark cards
  paperDim: "rgba(255,255,255,0.72)",
  hero: "#FFC93C", // THE hero color — max one element per frame (highlight word, CTA)
  heroInk: "#1A1300", // text drawn ON the hero color
  accent: "#3DD6F5", // secondary accent (icons, bullets, progress)
  danger: "#FF5A5F",
  success: "#3DDC97",
  glass: "rgba(11,15,23,0.66)", // translucent card over footage
  glassBorder: "rgba(255,255,255,0.12)",
  shadow: "rgba(0,0,0,0.45)",
};

export type ThemeColors = typeof defaultColors;

export const fonts = {
  // Arabic + Latin Cairo subsets (public/fonts). Browser falls back per glyph.
  display: "Cairo, CairoLatin, sans-serif",
  body: "Cairo, CairoLatin, sans-serif",
};

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // entrances (easeOutExpo)
  inOut: Easing.bezier(0.83, 0, 0.17, 1), // moves, zooms
  in: Easing.bezier(0.7, 0, 0.84, 0), // exits only
};

export const springs = {
  snappy: { damping: 14, stiffness: 160, mass: 0.6 }, // words, small UI
  smooth: { damping: 20, stiffness: 90, mass: 1 }, // cards, big blocks
  bouncy: { damping: 11, stiffness: 170, mass: 0.7 }, // icons, CTA
  gentle: { damping: 24, stiffness: 70, mass: 1 }, // slow drifts
} as const;

export type SpringName = keyof typeof springs;

// Type scale for 1080-wide vertical video. Captions/overlays must stay readable on a phone.
export const type = {
  hero: 104, // hook headline
  title: 76, // scene titles
  body: 52, // explanation lines, list items
  caption: 64, // subtitles
  label: 36, // small tags, lower-third role
};

// Stagger offsets in frames (rules: words 3, list items 4–5, big blocks 6).
export const stagger = { word: 3, char: 1, item: 5, block: 6 };

// Exit duration as a fraction of a second — exits are faster than entrances.
export const EXIT_SECONDS = 0.35;
