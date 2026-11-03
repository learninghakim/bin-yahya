import type { ReelSpec } from "../system/types";

// Brief: briefs/2026-11-03_06r.md
export const v_2026_11_03_06r: ReelSpec = {
  id: "reel-2026-11-03-06r",
  video: "raw/2026-11-03_06r.mp4",
  // segments: [], // from `npm run probe 2026-11-03_06r`
  autoPunchIn: true,
  progressBar: true,
  // captions: { src: "captions/2026-11-03_06r.json" }, // from `npm run transcribe 2026-11-03_06r`
  scenes: [
    { type: "hook", from: 0, to: 2.5, title: "TODO hook" },
    { type: "cta", from: 25, to: 29, label: "تابعني" },
  ],
};
