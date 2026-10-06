// Exports src/data/timing.ts → timing.json (for editors / other tools).
// Run (Node ≥22.6): node --experimental-strip-types scripts/export-timing.mjs
import { writeFileSync } from "node:fs";
const t = await import("../src/data/timing.ts");
writeFileSync(
  "timing.json",
  JSON.stringify(
    { fps: t.FPS, width: t.WIDTH, height: t.HEIGHT, durationInFrames: t.DURATION_FRAMES, scenes: t.SCENES, layoutTrack: t.LAYOUT_TRACK, sfx: t.SFX },
    null,
    2,
  ),
);
console.log("timing.json written");
