// PaperSpec — rendered by <PaperReel>. All times ABSOLUTE seconds.
import type { Zoom } from "../../components/footage/TalkingHead";
import type { IconName } from "../../components/graphics/icons";
import type { Segment } from "../../system/types";
import type { Cue } from "../common/SfxTrack";

export type T = { text: string; at: number };
export type StickyColor = "yellow" | "pink" | "blue" | "green";
export type Doodle = "circle" | "underline" | "star" | "arrow";

export type PaperBeat = { from: number; to: number; sfx?: false } & (
  /** paper banner at the top (hook) */
  | { kind: "banner"; words: T[]; highlight?: string[] }
  /** taped paper card on the chest: hand-lettered title; a doodle draws on one word */
  | { kind: "note"; words: T[]; highlight?: string[]; doodle?: { type: Doodle; word: string; at: number }; sub?: T; tilt?: number }
  /** row of sticky notes dropping in */
  | { kind: "stickies"; items: { text: string; icon?: IconName; color: StickyColor; at: number }[] }
  /** notebook page with items; marks can flip (✗ → ✓) at flipAt */
  | { kind: "list"; title?: T; items: { text: string; at: number; mark?: "dot" | "x" | "check" }[]; flipAt?: number; flipLabel?: T }
  /** red rubber stamp slamming */
  | { kind: "stamp"; text: string; at: number; y?: number; tone?: "red" | "green" }
  /** research paper with heading, scribbled lines and a stamp */
  | { kind: "doc"; heading: T; stamp: T }
  /** a word struck by a red pen, the replacement written under it */
  | { kind: "strike"; word: T; strikeAt: number; into: T }
  /** thought bubble that writes itself */
  | { kind: "bubble"; text: string; at: number; dur: number; who?: string }
);

export type PaperSpec = {
  id: string;
  video?: string;
  segments?: Segment[];
  zooms?: Zoom[];
  captions?: { src: string };
  beats: PaperBeat[];
  /** footage desaturation 0..1 (default 0.85) */
  mono?: number;
  sfxExtra?: Cue[];
  sfx?: boolean;
  duration?: number;
};
