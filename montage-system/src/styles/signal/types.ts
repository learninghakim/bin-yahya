// SignalSpec — one data file per video, rendered by <SignalReel>. All times = ABSOLUTE seconds
// in the edited video (copy them from briefs/<slug>.transcript.txt / captions JSON).
import type { Zoom } from "../../components/footage/TalkingHead";
import type { IconName } from "../../components/graphics/icons";
import type { Segment } from "../../system/types";
import type { TimedWord } from "./moments";
import type { Row } from "./widgets/Checklist";
import type { Step } from "./widgets/Stepper";
import type { Bar } from "./widgets/Bars";
import type { Chip } from "./widgets/Chips";

export type SignalSfx =
  | "riser" | "boom" | "suck" | "hit" | "punch" | "whoosh" | "whoosh2" | "swoosh" | "whooshLow"
  | "glitch" | "reveal" | "zap" | "shutter" | "pop" | "click" | "tick" | "tick2" | "notify" | "chime";

export type Widget =
  | { type: "checklist"; rows: Row[] }
  | { type: "stepper"; steps: Step[]; note?: { text: string; at: number } }
  | { type: "bars"; bars: Bar[] }
  | { type: "reframe"; from: { text: string; at: number }; strikeAt: number; to: { text: string; at: number } }
  | { type: "links"; at: number; strongAt: number; label?: { text: string; at: number } }
  | { type: "follow"; title: string; tapAt: number; bell?: { text: string; at: number } }
  | { type: "chips"; chips: Chip[] }
  | { type: "iconTitle"; icon: IconName; title: string; at: number; sub?: { text: string; at: number }; tone?: "lime" | "danger" };

/** Illustrative motion graphics (see art.tsx). Times are absolute seconds. */
export type Art =
  | { type: "hookShatter"; punchAt: number; checks: { text: string; at: number }[]; shatterAt: number }
  | { type: "gauge"; at: number; settleAt?: number; left: string; right: string }
  | { type: "bolt"; at: number }
  | { type: "illusion"; fillAt: number; trickAt: number; full: string; trick: string }
  | { type: "book"; title: string; openAt: number; peopleAt: number; chips?: Chip[] }
  | { type: "curve"; feelAt: number; realAt: number; longAt: number; feel: string; real: string; xLabel: string; yLabel: string }
  | { type: "habits"; pageAt: number; highlightAt: number; rereadAt: number; illusionAt: number; crackAt: number; bubble: string }
  | { type: "toggle"; flipAt: number; off: string; on: string }
  | { type: "journey"; stops: { label: string; icon: IconName; at: number }[] }
  | { type: "barbell"; liftAt: number; squeezeAt: number }
  | { type: "brain"; weakAt: number; crossAt: number; buildAt: number; strongAt: number; weak: string }
  | { type: "follow"; tapAt: number; bellAt: number; button: string; done: string };

/**
 * A beat = one motion moment. `to` = last related word + 0.45 (the element lingers, then leaves in 0.4 s).
 */
export type Beat = { from: number; to: number; sfx?: false } & (
  | { kind: "hookCam"; words: TimedWord[]; highlight?: string[] }
  | { kind: "burst"; icon: IconName; at: number; words?: TimedWord[]; highlight?: string[] }
  | { kind: "stage"; icon?: IconName; label?: { text: string; at: number }; title: TimedWord[]; highlight?: string[]; chips?: Chip[] }
  | { kind: "slam"; words: TimedWord[]; label?: { text: string; at: number }; highlight?: string[] }
  | { kind: "panel"; label?: string; top?: number; widgets: Widget[] }
  /**
   * art: an illustration that SHOWS the idea. Floats over the chest (y = centre, default 1130),
   * or sits on a full-screen stage (`stage: true`, optional small `title`). `viewfinder` adds the REC camera frame.
   */
  | { kind: "art"; art: Art; stage?: boolean; y?: number; viewfinder?: boolean; title?: TimedWord[]; highlight?: string[] }
);

export type SignalSpec = {
  id: string;
  video?: string; // path inside public/
  segments?: Segment[];
  zooms?: Zoom[];
  captions?: { src: string };
  beats: Beat[];
  /** extra hand-placed sounds */
  sfxExtra?: { name: SignalSfx; at: number }[];
  /** automatic sounds from beats (default true) */
  sfx?: boolean;
  videoVolume?: number;
  duration?: number;
};
