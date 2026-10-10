// Reel 31 — version 2 edit plan. Same sentence boundaries as v1 (from timing.json), new layouts.
// A = full screen, SPLIT = diagonal torn split (Abdullah top-left, collage bottom-right),
// ARCH = Abdullah inside a paper arch window, C = full collage.
export type Layout = "A" | "SPLIT" | "ARCH" | "C";

export const SCENES: { id: string; from: number; to: number; layout: Layout }[] = [
  { id: "s1", from: 0, to: 5.5, layout: "A" },
  { id: "s2", from: 5.5, to: 8.22, layout: "C" },
  { id: "s3", from: 8.22, to: 11.73, layout: "SPLIT" },
  { id: "s4a", from: 11.73, to: 13.07, layout: "A" },
  { id: "s4b", from: 13.07, to: 16.7, layout: "C" },
  { id: "s5", from: 16.7, to: 20.5, layout: "A" },
  { id: "s6", from: 20.5, to: 22.55, layout: "ARCH" },
  { id: "s7", from: 22.55, to: 27.78, layout: "C" },
  { id: "s8", from: 27.78, to: 30.87, layout: "A" },
  { id: "s9", from: 30.87, to: 34.0, layout: "C" },
  { id: "s10", from: 34.0, to: 35.968, layout: "A" },
];

// Diagonal used by the SPLIT layout: y on the left edge and on the right edge (px).
export const SPLIT_LINE = { left: 1190, right: 730 };
export const splitY = (x: number) => SPLIT_LINE.left + ((SPLIT_LINE.right - SPLIT_LINE.left) * x) / 1080;
