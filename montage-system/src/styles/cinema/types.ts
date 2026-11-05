// CinemaSpec — rendered by <CinemaReel>. All times ABSOLUTE seconds (edited timeline).
import type { Zoom } from "../../components/footage/TalkingHead";
import type { IconName } from "../../components/graphics/icons";
import type { Segment } from "../../system/types";
import type { Cue } from "../common/SfxTrack";

export type L = { text: string; at: number };

export type CinemaBeat = { from: number; to: number; sfx?: false } & (
  /** full-screen chapter card (black, gold kicker, serif title) */
  | { kind: "chapter"; kicker: string; title: L[] }
  /** serif quote over the footage, words land as spoken; gold marks */
  | { kind: "quote"; words: L[]; highlight?: string[]; label?: string; size?: number }
  /** documentary lower third: gold rule + title + sub */
  | { kind: "lower"; title: L; sub?: L }
  /** three line-art icons with captions; optional glow (all turn gold) */
  | { kind: "triptych"; items: { icon: IconName; label: string; at: number }[]; struck?: boolean; glowAt?: number; glowLabel?: L }
  /** evidence counter rolling down to a final number */
  | { kind: "evidence"; title: L; from0: number; value: number; at: number; label: string }
  /** a serif word struck through, replacement written under */
  | { kind: "strike"; word: L; strikeAt: number; into: L }
  /** iris closes the frame into a box, then opens */
  | { kind: "iris"; closeAt: number; openAt: number; label?: L }
  /** closing title with a light sweep */
  | { kind: "end"; words: L[]; highlight?: string[] }
);

export type CinemaSpec = {
  id: string;
  video?: string;
  segments?: Segment[];
  zooms?: Zoom[];
  captions?: { src: string };
  /** light-leak transitions */
  leaks?: number[];
  beats: CinemaBeat[];
  sfxExtra?: Cue[];
  sfx?: boolean;
  duration?: number;
};
