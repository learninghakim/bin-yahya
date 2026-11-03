// NewsSpec — one data file per video, rendered by <NewsReel>. All times are ABSOLUTE seconds.
import type { Zoom } from "../../components/footage/TalkingHead";
import type { IconName } from "../../components/graphics/icons";
import type { Segment } from "../../system/types";
import type { Cue } from "../common/SfxTrack";

export type T = { text: string; at: number };

export type NewsBeat = { from: number; to: number; sfx?: false } & (
  /** red tag + headline bar under the face */
  | { kind: "breaking"; tag: string; headline: T[]; highlight?: string[] }
  /** lower-third citation: icon + title + detail */
  | { kind: "cite"; icon?: IconName; title: string; detail?: T }
  /** big counting number with arrow */
  | { kind: "stat"; value: number; prefix?: string; suffix?: string; at: number; dir: "up" | "down"; label: T; note?: T; stage?: boolean }
  /** two bars racing; each bar lands at its own time */
  | { kind: "versus"; title?: string; bars: { label: string; value: number; suffix?: string; at: number; tone: "up" | "down" | "neutral" }[] }
  /** full-screen title moment over a dark cinematic plate */
  | { kind: "stage"; kicker?: T; lines: T[]; highlight?: string[] }
  /** numbered rule card */
  | { kind: "rule"; n: number; title: T; sub?: T; icon?: IconName }
  /** chat-style prompt box that types itself */
  | { kind: "prompt"; label: string; text: string; at: number; dur: number }
  /** two outcomes stamped one after the other */
  | { kind: "verdict"; items: { text: string; at: number; good: boolean }[] }
  /** closing actions: save / share */
  | { kind: "cta"; items: { icon: IconName; text: string; at: number }[] }
);

export type NewsSpec = {
  id: string;
  video?: string;
  segments?: Segment[];
  zooms?: Zoom[];
  captions?: { src: string };
  /** persistent chrome */
  bug: string; // top live bug label
  ticker: string[]; // scrolling ticker items
  beats: NewsBeat[];
  sfxExtra?: Cue[];
  sfx?: boolean;
  /** "flash" transitions (white/red flash + glitch) at these times */
  flashes?: number[];
  duration?: number;
};
