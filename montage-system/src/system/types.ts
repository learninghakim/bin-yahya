// ─────────────────────────────────────────────────────────────────────────────
// ReelSpec — ONE file per video describes the whole edit as data.
// The <Reel> composition turns a spec into the finished video.
// All times are in SECONDS.
// ─────────────────────────────────────────────────────────────────────────────
import type { ThemeColors } from "../theme/theme";
import type { Zoom } from "../components/footage/TalkingHead";
import type { HookProps } from "../templates/HookScene";
import type { ExplanationProps } from "../templates/ExplanationScene";
import type { PointsProps } from "../templates/PointsScene";
import type { CTAProps } from "../templates/CTAScene";
import type { StatProps } from "../templates/StatScene";
import type { LowerThirdProps } from "../templates/LowerThirdScene";
import type { IconPopProps } from "../templates/IconPopScene";
import type { SfxName } from "./sfx";

/** A part of the RAW video to keep. Several segments = jump cuts (silences removed). */
export type Segment = { start: number; end: number };

type Timed = {
  /** Start/end in the EDITED timeline (after segments are joined). */
  from: number;
  to: number;
  /** Sound effect on entrance. Default depends on the scene type; false = silent. */
  sfx?: SfxName | false;
};

export type SceneSpec = Timed &
  (
    | ({ type: "hook" } & HookProps)
    | ({ type: "explanation" } & ExplanationProps)
    | ({ type: "points" } & PointsProps)
    | ({ type: "cta" } & CTAProps)
    | ({ type: "stat" } & StatProps)
    | ({ type: "lowerThird" } & LowerThirdProps)
    | ({ type: "iconPop" } & IconPopProps)
  );

export type ReelSpec = {
  /** Composition id shown in Remotion Studio (letters, digits, dashes). */
  id: string;
  /** Path inside public/, e.g. "raw/2026-11-03_mic-tips.mp4". Empty = placeholder speaker. */
  video?: string;
  /**
   * Parts of the raw video to keep (seconds in the RAW file).
   * Omit to keep the whole file. `npm run probe` suggests segments from silences.
   */
  segments?: Segment[];
  /** Alternate 1.0 / 1.12 zoom on every cut between segments (jump-cut energy). */
  autoPunchIn?: boolean;
  /** Extra zooms in the edited timeline. */
  zooms?: Zoom[];
  /** Force the length (seconds). Otherwise derived from segments / the video. */
  duration?: number;
  /** Brand color overrides for this video. */
  colors?: Partial<ThemeColors>;
  /** Word-synced subtitles from `npm run transcribe` (path inside public/). */
  captions?: { src: string; enabled?: boolean; y?: number };
  /** Overlay scenes (motion graphics) in the edited timeline. */
  scenes: SceneSpec[];
  /** White flashes at these edited-timeline seconds (punctuate a cut). */
  flashes?: number[];
  music?: { src: string; volume?: number };
  /** Automatic SFX on scene entrances (default true). */
  sfx?: boolean;
  videoVolume?: number;
  progressBar?: boolean;
  /** Shade the areas Instagram's UI covers (preview only — turn off before render). */
  showSafeZone?: boolean;
};
