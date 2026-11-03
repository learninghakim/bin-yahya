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

export type SignalSfx = "boom" | "tick" | "tick2" | "swish" | "tap";

export type Widget =
  | { type: "checklist"; rows: Row[] }
  | { type: "stepper"; steps: Step[]; note?: { text: string; at: number } }
  | { type: "bars"; bars: Bar[] }
  | { type: "reframe"; from: { text: string; at: number }; strikeAt: number; to: { text: string; at: number } }
  | { type: "links"; at: number; strongAt: number; label?: { text: string; at: number } }
  | { type: "follow"; title: string; tapAt: number; bell?: { text: string; at: number } }
  | { type: "chips"; chips: Chip[] }
  | { type: "iconTitle"; icon: IconName; title: string; at: number; sub?: { text: string; at: number }; tone?: "lime" | "danger" };

/**
 * A beat = one motion moment. `to` = last related word + 0.45 (the element lingers, then leaves in 0.4 s).
 */
export type Beat = { from: number; to: number; sfx?: false } & (
  | { kind: "hookCam"; words: TimedWord[]; highlight?: string[] }
  | { kind: "burst"; icon: IconName; at: number; words?: TimedWord[]; highlight?: string[] }
  | { kind: "stage"; icon?: IconName; label?: { text: string; at: number }; title: TimedWord[]; highlight?: string[]; chips?: Chip[] }
  | { kind: "slam"; words: TimedWord[]; label?: { text: string; at: number }; highlight?: string[] }
  | { kind: "panel"; label?: string; top?: number; widgets: Widget[] }
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
