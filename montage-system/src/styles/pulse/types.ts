// PulseSpec — rendered by <PulseReel>. All times ABSOLUTE seconds (edited timeline).
import type { Zoom } from "../../components/footage/TalkingHead";
import type { IconName } from "../../components/graphics/icons";
import type { Segment } from "../../system/types";
import type { Cue } from "../common/SfxTrack";

export type L = { text: string; at: number };

export type PulseBeat = { from: number; to: number; sfx?: false } & (
  /** line chart: the line draws point by point; a crash point turns magenta */
  | { kind: "chart"; points: { y: number; at: number; label?: string; bad?: boolean }[] }
  /** dot grid filling (a crowd / sample size) + count */
  | { kind: "crowd"; count: number; at: number; label: string }
  /** two bars from a zero baseline: up (cyan) / down (magenta), counters on top */
  | { kind: "bars"; bars: { label: string; value: number; at: number; down?: boolean }[] }
  /** giant glitching glyph (e.g. "؟") */
  | { kind: "glyph"; text: string; at: number }
  /** a key pressed → result chip */
  | { kind: "key"; key: string; pressAt: number; result: L }
  /** brain asleep vs AI chip working */
  | { kind: "sleep"; brainAt: number; chipAt: number; brain: string; chip: string }
  /** N step slots lighting up */
  | { kind: "steps"; n: number; at: number; label: string }
  /** countdown ring with a label */
  | { kind: "timer"; minutes: number; at: number; label?: L; lockAt?: number; lock?: string }
  /** chat window: a request bubble struck as blocked, or a prompt typing */
  | { kind: "chat"; mode: "blocked" | "typing"; text: string; at: number; dur?: number; tag?: string; strikeAt?: number }
  /** calendar flip today → tomorrow + chips */
  | { kind: "calendar"; flipAt: number; today: string; tomorrow: string; chips?: L[] }
  /** two outcomes */
  | { kind: "outcome"; items: { text: string; at: number; good: boolean; icon?: IconName }[] }
  /** save / apply buttons */
  | { kind: "cta"; items: { icon: IconName; text: string; at: number }[] }
);

export type PulseSpec = {
  id: string;
  video?: string;
  segments?: Segment[];
  zooms?: Zoom[];
  captions?: { src: string };
  /** glitch-slice transitions */
  glitches?: number[];
  /** short label inside the step HUD per rule window */
  chapters?: { from: number; to: number; n: number; text: string }[];
  beats: PulseBeat[];
  sfxExtra?: Cue[];
  sfx?: boolean;
  duration?: number;
};
