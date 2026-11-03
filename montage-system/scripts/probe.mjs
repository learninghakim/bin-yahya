// npm run probe <slug>
// Prints the raw video's specs and suggests `segments` that cut out silences.
// Writes briefs/<slug>.probe.json for reference.
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { capture, resolveRaw, ROOT, slugOf } from "./lib.mjs";

const file = resolveRaw(process.argv[2]);
const slug = slugOf(file);
const noiseDb = Number(process.env.SILENCE_DB ?? -35); // louder rooms: -30
const minSilence = Number(process.env.SILENCE_MIN ?? 0.45); // seconds of silence worth cutting
const pad = 0.12; // keep a little air around speech

const info = JSON.parse(capture("ffprobe", ["-v", "error", "-print_format", "json", "-show_streams", "-show_format", file]));
const v = info.streams.find((s) => s.codec_type === "video");
const a = info.streams.find((s) => s.codec_type === "audio");
const duration = Number(info.format.duration);
const [n, d] = (v?.r_frame_rate ?? "30/1").split("/").map(Number);
const rotation = Number(v?.side_data_list?.find((x) => x.rotation !== undefined)?.rotation ?? v?.tags?.rotate ?? 0);
const vertical = Math.abs(rotation) === 90 ? v.width > v.height : v.height > v.width;

// silencedetect writes to stderr
const sd = spawnSync("ffmpeg", ["-hide_banner", "-i", file, "-af", `silencedetect=noise=${noiseDb}dB:d=${minSilence}`, "-f", "null", "-"], { encoding: "utf8" });
const silences = [];
let cur = null;
for (const line of sd.stderr.split("\n")) {
  const s = line.match(/silence_start: ([\d.]+)/);
  const e = line.match(/silence_end: ([\d.]+)/);
  if (s) cur = Number(s[1]);
  if (e && cur !== null) { silences.push([cur, Number(e[1])]); cur = null; }
}
if (cur !== null) silences.push([cur, duration]);

const segments = [];
let t = 0;
for (const [s, e] of silences) {
  if (s - t > 0.25) segments.push({ start: +Math.max(0, t - pad).toFixed(2), end: +Math.min(duration, s + pad).toFixed(2) });
  t = e;
}
if (duration - t > 0.25) segments.push({ start: +Math.max(0, t - pad).toFixed(2), end: +duration.toFixed(2) });
const kept = segments.reduce((acc, s) => acc + s.end - s.start, 0);

const report = {
  file: path.relative(path.join(ROOT, "public"), file),
  duration: +duration.toFixed(2),
  width: v?.width, height: v?.height, rotation, vertical,
  fps: +(n / d).toFixed(3),
  audio: a ? `${a.codec_name} ${a.sample_rate}Hz` : "NONE",
  silences: silences.map(([s, e]) => [+s.toFixed(2), +e.toFixed(2)]),
  suggestedSegments: segments,
  editedDuration: +kept.toFixed(2),
};
mkdirSync(path.join(ROOT, "briefs"), { recursive: true });
writeFileSync(path.join(ROOT, "briefs", `${slug}.probe.json`), JSON.stringify(report, null, 2));

console.log(`\n${slug}`);
console.log(`  ${report.width}x${report.height} rot=${rotation} @ ${report.fps}fps, ${report.duration}s, audio: ${report.audio}`);
if (!vertical) console.log("  ⚠ Not vertical — it will be center-cropped to 9:16.");
if (!a) console.log("  ⚠ No audio track.");
console.log(`  ${silences.length} silences → ${segments.length} segments, edited length ≈ ${report.editedDuration}s`);
console.log(`  saved briefs/${slug}.probe.json`);
