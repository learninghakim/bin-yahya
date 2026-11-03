// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL — a reusable identity for talking-head Reels.
// Same *method* as the reference reel (dark UI panels over the chest, full-screen
// stage moments, bottom captions for every word, sub-boom + soft pings), with its
// own look: graphite surfaces + electric lime, Readex Pro UI type, Lalezar display.
// Change the brand here; every Signal component reads these tokens.
// ─────────────────────────────────────────────────────────────────────────────
import { Easing } from "remotion";

export const S = {
  color: {
    bg: "#0A0E0C", // stage background
    panel: "rgba(14,19,17,0.88)", // UI panel surface over footage
    panelSolid: "#111815",
    line: "rgba(212,255,58,0.16)", // hairline borders
    lime: "#D4FF3A", // THE accent — progress, checks, highlight word
    limeSoft: "rgba(212,255,58,0.14)",
    ink: "#0A0E0C", // text on lime
    text: "#F4F6F1",
    dim: "rgba(244,246,241,0.55)",
    faint: "rgba(244,246,241,0.18)",
    chip: "rgba(255,255,255,0.06)",
    danger: "#FF6B57",
    shadow: "rgba(0,0,0,0.55)",
  },
  font: {
    ui: "Readex, sans-serif", // panels, captions, labels
    display: "Lalezar, Readex, sans-serif", // hook words, slams, stage titles
  },
  ease: {
    out: Easing.bezier(0.2, 0.8, 0.2, 1), // entrances (no overshoot)
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    in: Easing.bezier(0.5, 0, 0.75, 0),
  },
  /** seconds */
  dur: { in: 0.35, out: 0.4, hold: 0.45, stagger: 0.06 },
  /** layout in px (1080×1920) */
  layout: {
    sideX: 80, // panel left/right margin
    panelTop: 960, // panels sit over the chest, under the face
    captionY: 1440, // caption baseline centre — every word lives here
    captionMaxW: 860,
    topTextY: 190, // slams / labels above the head
  },
} as const;

export type SignalTone = "lime" | "danger" | "text";
export const toneColor = (t: SignalTone = "lime") => (t === "danger" ? S.color.danger : t === "text" ? S.color.text : S.color.lime);
