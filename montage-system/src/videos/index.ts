// ─────────────────────────────────────────────────────────────────────────────
// REGISTRY — every video spec listed here appears in Remotion Studio.
// `npm run new <slug>` adds new entries automatically.
// ─────────────────────────────────────────────────────────────────────────────
import type { ReelSpec } from "../system/types";
import { demo } from "./_demo";
// @new-video-imports

export const videos: ReelSpec[] = [
  demo,
  // @new-video-entries
];
