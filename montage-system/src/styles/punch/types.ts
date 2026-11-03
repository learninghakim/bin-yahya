// PunchSpec — rendered by <PunchReel>. All times ABSOLUTE seconds.
import type { Zoom } from "../../components/footage/TalkingHead";
import type { Segment } from "../../system/types";
import type { Cue } from "../common/SfxTrack";

export type Tone = "yellow" | "green" | "red" | "white";
export type T = { text: string; at: number };

export type PunchBeat = { from: number; to: number; sfx?: false } & (
  /** yellow headline box at the top (hook / chapter) — optional number badge */
  | { kind: "title"; words: T[]; n?: number; tone?: Tone }
  /** emoji sticker popping beside the head */
  | { kind: "emoji"; emoji: string; at: number; side?: "left" | "right"; y?: number; size?: number }
  /** giant number slam above the captions */
  | { kind: "number"; value: number; prefix?: string; suffix?: string; at: number; tone?: Tone; label?: T }
  /** big word slam in the middle of the screen (full takeover, dark) */
  | { kind: "slam"; words: T[]; tone?: Tone; emoji?: string }
  /** CTA: button pressed by a hand cursor */
  | { kind: "cta"; text: string; at: number; emoji?: string; sub?: T }
);

export type PunchSpec = {
  id: string;
  video?: string;
  segments?: Segment[];
  /** explicit zooms; when omitted, zooms are generated: punch-in on every sentence, alternating */
  zooms?: Zoom[];
  /** auto-zoom strength (default 1.12); 0 disables auto zooms */
  autoZoom?: number;
  captions?: { src: string };
  /** words always coloured (matched without punctuation) */
  emphasis?: Record<string, Tone>;
  /** black & white emphasis windows */
  bw?: { from: number; to: number }[];
  /** white flash + zoom kick */
  flashes?: number[];
  /** hide the chest captions in these windows (e.g. under a slam) */
  hideCaptions?: { from: number; to: number }[];
  beats: PunchBeat[];
  sfxExtra?: Cue[];
  sfx?: boolean;
  duration?: number;
};
