// PhoneSpec — rendered by <PhoneReel>. All times ABSOLUTE seconds (edited timeline).
import type { Zoom } from "../../components/footage/TalkingHead";
import type { Segment } from "../../system/types";
import type { Cue } from "../common/SfxTrack";

export type L = { text: string; at: number };
export type AppTint = "blue" | "green" | "red" | "orange" | "yellow" | "purple";

export type PhoneBeat = { from: number; to: number; sfx?: false } & (
  /** iOS notification banners stacking (newest on top) */
  | { kind: "notif"; items: { app: string; glyph: string; tint: AppTint; title: string; body?: string; at: number }[] }
  /** payment sheet: amount, then confirm (Face ID tick) or a "wait" stop */
  | { kind: "pay"; merchant: string; amount: string; at: number; confirmAt?: number; stopAt?: number; stop?: string; done?: string }
  /** bank balance draining to zero */
  | { kind: "balance"; label: string; start: number; end: number; at: number; dur: number; currency: string }
  /** app icons popping onto a dock */
  | { kind: "apps"; items: { glyph: string; label: string; tint: AppTint; at: number }[]; flipAt?: number }
  /** Notes card: a line that types in, optional blur ("fuzzy idea") */
  | { kind: "notes"; title: string; line: string; at: number; dur: number; blurAt?: number; blurLabel?: L }
  /** widgets row (tiles with glyph + label) */
  | { kind: "tiles"; items: { glyph: string; label: string; tint: AppTint; at: number }[] }
  /** activity chart widget: bars rising + chip */
  | { kind: "activity"; title: string; at: number; chip?: L }
  /** chat bubbles (in = grey, out = blue) */
  | { kind: "chat"; items: { text: string; at: number; out?: boolean }[]; tag?: L }
);

export type PhoneSpec = {
  id: string;
  video?: string;
  segments?: Segment[];
  zooms?: Zoom[];
  captions?: { src: string };
  /** "Dynamic Island" step pill at the top: shown in each window */
  island?: { from: number; to: number; text: string; n?: number }[];
  beats: PhoneBeat[];
  sfxExtra?: Cue[];
  sfx?: boolean;
  duration?: number;
};
