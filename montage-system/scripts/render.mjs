// npm run render <compositionId> [--client <client-slug>]
// Renders the final MP4 to out/<id>.mp4. Optionally copies it to ../clients/<client>/deliveries/.
// ⚠ Only run when the user explicitly asks for the final render.
import { copyFileSync, existsSync, mkdirSync, renameSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { browserArgs, ROOT, run } from "./lib.mjs";

const args = process.argv.slice(2);
const id = args[0];
if (!id) { console.error("Usage: npm run render <compositionId> [--client <slug>]"); process.exit(1); }
const ci = args.indexOf("--client");
const client = ci >= 0 ? args[ci + 1] : undefined;

const out = path.join(ROOT, "out", `${id}.mp4`);
run("npx", ["remotion", "render", "src/index.ts", id, out, "--codec=h264", "--crf=17", "--audio-bitrate=320k", ...browserArgs()]);
console.log(`\nRendered ${path.relative(ROOT, out)}`);

// Loudness: normalise to the Reels/Shorts target (−14 LUFS integrated, −1.5 dBTP true peak) in two passes,
// video stream copied untouched. Skip with --no-loudnorm.
if (!args.includes("--no-loudnorm")) {
  const target = "I=-14:TP=-1.5:LRA=11";
  const m = spawnSync("ffmpeg", ["-hide_banner", "-i", out, "-af", `loudnorm=${target}:print_format=json`, "-vn", "-f", "null", "-"], { encoding: "utf8" });
  const j = JSON.parse(m.stderr.slice(m.stderr.lastIndexOf("{"), m.stderr.lastIndexOf("}") + 1));
  const tmp = out.replace(/\.mp4$/, ".norm.mp4");
  const af = `loudnorm=${target}:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true`;
  run("ffmpeg", ["-v", "error", "-y", "-i", out, "-c:v", "copy", "-af", af, "-ar", "48000", "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart", tmp]);
  renameSync(tmp, out);
  console.log(`Loudness: ${j.input_i} LUFS / ${j.input_tp} dBTP → −14 LUFS / −1.5 dBTP`);
}

if (client) {
  const dest = path.join(ROOT, "..", "clients", client, "deliveries");
  if (!existsSync(path.dirname(dest))) throw new Error(`clients/${client} does not exist`);
  mkdirSync(dest, { recursive: true });
  copyFileSync(out, path.join(dest, `${id}.mp4`));
  console.log(`Copied to clients/${client}/deliveries/${id}.mp4`);
}
