// ─────────────────────────────────────────────────────────────────────────────
// REGISTRY — every video spec listed here appears in Remotion Studio.
// `npm run new <slug>` adds new entries automatically.
// ─────────────────────────────────────────────────────────────────────────────
import type { ReelSpec } from "../system/types";
import { demo } from "./_demo";
import { v_2026_11_03_06r } from "./2026-11-03_06r";
// @new-video-imports

export const videos: ReelSpec[] = [
  demo,
  v_2026_11_03_06r,
  // @new-video-entries
];
