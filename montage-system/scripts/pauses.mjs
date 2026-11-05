// npm run pauses <slug>
// Detects real speech pauses (silencedetect −30 dB, ≥ 0.15 s) in the raw clip and writes
// public/captions/<slug>.pauses.json ([[start, end], …] raw seconds). The v2 caption chunker breaks lines on
// these pauses, so a caption never glues the end of one sentence to the start of the next.
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { resolveRaw, ROOT, slugOf } from "./lib.mjs";

const file = resolveRaw(process.argv[2]);
const slug = slugOf(file);
const r = spawnSync("ffmpeg", ["-i", file, "-af", "silencedetect=noise=-30dB:d=0.15", "-vn", "-f", "null", "-"], { encoding: "utf8" });
const out = [];
let s = null;
for (const m of r.stderr.matchAll(/silence_(start|end): ([0-9.]+)/g)) {
  if (m[1] === "start") s = Number(m[2]);
  else if (s !== null) { out.push([s, Number(m[2])]); s = null; }
}
const dest = path.join(ROOT, "public", "captions", `${slug}.pauses.json`);
writeFileSync(dest, JSON.stringify(out));
console.log(`${out.length} pauses → ${path.relative(ROOT, dest)}`);
