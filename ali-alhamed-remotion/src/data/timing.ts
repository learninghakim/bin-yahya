// timing.ts — the single timing source for the whole edit.
// All times are in SECONDS of the source MP4 (SRT starts at 00:00:00 and was
// verified against the audio: silence 66.05–66.70s ↔ SRT gap 66.13–66.73s).
// Convert with F() — never hard-code frame numbers in scenes.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
// Source: 4055 video frames @30fps (135.1667s). Audio 135.168s.
export const DURATION_FRAMES = 4055;

export const F = (sec: number) => Math.round(sec * FPS);

/* ------------------------------------------------------------------ */
/* Scenes (creative windows, start/end in seconds)                     */
/* ------------------------------------------------------------------ */
export const SCENES = {
  s01FinancialProfile: { start: 0, end: 8.37 },
  s02BiggerDecisions: { start: 8.37, end: 14.47 },
  s03DubaiApartment: { start: 14.47, end: 19.33 },
  s03RentRange: { start: 19.33, end: 24.1 },
  s03MonthlyEquation: { start: 24.1, end: 28.65 },
  s04Advice: { start: 28.65, end: 30.95 },
  s04Landlord: { start: 30.95, end: 36.3 },
  s04Finance: { start: 36.3, end: 39.4 },
  s04TenYears: { start: 39.4, end: 45.4 },
  s04BuyChip: { start: 45.4, end: 49.93 },
  s05Stop: { start: 49.93, end: 51.37 },
  s05Reality: { start: 51.37, end: 56.4 },
  s05CostStack: { start: 56.4, end: 65.4 },
  s05Stop2: { start: 65.4, end: 66.6 },
  s06NotOnlyPrice: { start: 66.6, end: 69.9 },
  s06BuyVsRent: { start: 69.9, end: 73.17 },
  s06KeyIdea: { start: 73.17, end: 79.75 },
  s07Calm: { start: 79.75, end: 82.4 },
  s07Journal: { start: 82.4, end: 86.9 },
  s07Feeling: { start: 86.9, end: 91.75 },
  s07Return: { start: 91.75, end: 92.9 },
  s08Chapter: { start: 92.9, end: 98.6 },
  s08BigDecision: { start: 98.6, end: 101.87 },
  s08TwentyYears: { start: 101.87, end: 105.45 },
  s09Lead: { start: 105.45, end: 106.67 },
  s09SevenQuestions: { start: 106.67, end: 111.45 },
  s10AliIntro: { start: 111.45, end: 122.5 },
  s11Outro: { start: 122.5, end: 135.17 },
} as const;

/* ------------------------------------------------------------------ */
/* Presenter layout track                                              */
/* The ONE continuous <OffthreadVideo> morphs between these layouts.   */
/* s = scale (origin top-left), tx/ty = translate (px), clip = window. */
/* ------------------------------------------------------------------ */
export type Clip = { x: number; y: number; w: number; h: number; r: number };
export type Layout = { s: number; tx: number; ty: number; clip: Clip; dim?: number };

const FULL: Clip = { x: 0, y: 0, w: WIDTH, h: HEIGHT, r: 0 };

/** A — presenter full screen, optional punch-in centred on the face. */
export const A = (s = 1, cx = 960, cy = 380): Layout => ({
  s,
  tx: cx * (1 - s),
  ty: cy * (1 - s),
  clip: FULL,
});

/** B — presenter in a clean side panel (left). Source x 560–1300 visible:
 *  this crops away the baked top-left badges of the source edit. */
export const B_PANEL: Layout = {
  s: 1,
  tx: -440,
  ty: 0,
  clip: { x: 120, y: 70, w: 740, h: 940, r: 26 },
};

/** CARD — the full source frame scaled into a framed card (left).
 *  Used where the source carries real B-roll of Ali (training / ADNOC). */
export const CARD: Layout = {
  s: 0.585,
  tx: 110,
  ty: 230,
  clip: { x: 110, y: 230, w: 1123, h: 632, r: 26 },
};

/** BAND — cinematic band: source rows 0–640 shown at y 190–830.
 *  Hides the baked lower-centre texts / social bars of the source edit. */
export const BAND: Layout = {
  s: 1,
  tx: 0,
  ty: 190,
  clip: { x: 0, y: 190, w: WIDTH, h: 640, r: 0 },
};

export type LayoutKey = { at: number; layout: Layout; cut?: boolean };

// `cut: true` = hard cut (used under full-screen graphics or on a strong beat);
// otherwise the layout morphs over theme.motion.reframe frames.
export const LAYOUT_TRACK: LayoutKey[] = [
  { at: 0, layout: A(1) },
  { at: 6.43, layout: A(1.04), cut: true }, // «وضع مالي جيد»
  { at: 8.37, layout: A(1), cut: true }, // «ولكن…»
  { at: 9.95, layout: BAND },
  { at: 14.6, layout: A(1), cut: true }, // under C
  { at: 19.33, layout: B_PANEL, cut: true },
  { at: 24.2, layout: A(1), cut: true }, // under C
  { at: 28.65, layout: A(1.04), cut: true },
  { at: 36.3, layout: A(1), cut: true },
  { at: 45.4, layout: A(1), cut: true },
  { at: 48.57, layout: A(1.07), cut: true }, // «روح على طول اشتري»
  { at: 51.0, layout: A(1), cut: true }, // under C
  { at: 56.4, layout: B_PANEL, cut: true },
  { at: 65.4, layout: A(1.12, 960, 360), cut: true }, // «وقف، وقف» punch
  { at: 66.7, layout: A(1), cut: true }, // under C
  { at: 69.9, layout: B_PANEL, cut: true },
  { at: 73.3, layout: A(1), cut: true }, // under C
  { at: 79.75, layout: A(1), cut: true },
  { at: 91.75, layout: A(1.04), cut: true },
  { at: 98.6, layout: A(1), cut: true },
  { at: 99.73, layout: A(1.05), cut: true }, // «قرار مو بسيط»
  { at: 102.0, layout: A(1), cut: true }, // under C
  { at: 111.45, layout: CARD, cut: true },
  { at: 122.5, layout: BAND },
];

/* ------------------------------------------------------------------ */
/* SFX cues (seconds). Placed 2–3 frames BEFORE the visual lands.     */
/* Volumes are kept well under the dialogue.                           */
/* ------------------------------------------------------------------ */
export type SfxName = "whoosh" | "click" | "tick" | "impact" | "pop" | "riser";
export const SFX: { at: number; name: SfxName; vol: number }[] = [
  { at: 0.25, name: "click", vol: 0.16 },
  { at: 2.55, name: "click", vol: 0.16 },
  { at: 4.75, name: "click", vol: 0.16 },
  { at: 6.9, name: "tick", vol: 0.14 },
  { at: 9.9, name: "whoosh", vol: 0.12 },
  { at: 14.4, name: "whoosh", vol: 0.14 },
  { at: 19.25, name: "whoosh", vol: 0.1 },
  { at: 21.0, name: "tick", vol: 0.14 },
  { at: 24.0, name: "whoosh", vol: 0.12 },
  { at: 26.4, name: "pop", vol: 0.16 },
  { at: 30.9, name: "whoosh", vol: 0.13 },
  { at: 39.3, name: "whoosh", vol: 0.13 },
  { at: 40.35, name: "tick", vol: 0.14 },
  { at: 41.3, name: "tick", vol: 0.14 },
  { at: 42.15, name: "impact", vol: 0.2 },
  { at: 44.1, name: "pop", vol: 0.14 },
  { at: 48.6, name: "click", vol: 0.14 },
  { at: 49.2, name: "riser", vol: 0.1 },
  { at: 49.9, name: "impact", vol: 0.34 }, // «وقف!» — the pattern interrupt
  { at: 51.3, name: "whoosh", vol: 0.12 },
  { at: 55.0, name: "impact", vol: 0.18 },
  { at: 56.35, name: "click", vol: 0.14 },
  { at: 58.2, name: "tick", vol: 0.16 },
  { at: 60.9, name: "tick", vol: 0.16 },
  { at: 63.3, name: "tick", vol: 0.16 },
  { at: 65.35, name: "impact", vol: 0.16 },
  { at: 66.55, name: "whoosh", vol: 0.12 },
  { at: 71.0, name: "click", vol: 0.13 },
  { at: 72.1, name: "click", vol: 0.13 },
  { at: 73.15, name: "impact", vol: 0.16 },
  { at: 77.15, name: "pop", vol: 0.15 },
  { at: 82.35, name: "whoosh", vol: 0.1 },
  { at: 86.85, name: "whoosh", vol: 0.1 },
  { at: 92.85, name: "whoosh", vol: 0.12 },
  { at: 93.25, name: "impact", vol: 0.14 },
  { at: 96.0, name: "click", vol: 0.13 },
  { at: 97.1, name: "click", vol: 0.13 },
  { at: 101.8, name: "whoosh", vol: 0.12 },
  { at: 103.0, name: "impact", vol: 0.2 },
  { at: 106.6, name: "whoosh", vol: 0.12 },
  { at: 106.9, name: "impact", vol: 0.16 },
  { at: 111.4, name: "whoosh", vol: 0.1 },
  { at: 116.5, name: "tick", vol: 0.13 },
  { at: 117.8, name: "tick", vol: 0.13 },
  { at: 121.2, name: "click", vol: 0.12 },
  { at: 127.7, name: "click", vol: 0.12 },
];
