// npm run check [compositionId]
// Static check of every Signal spec (or one): timing vs spoken words, beat windows, linger rule,
// overlaps, zooms, SFX density, caption integrity. Exit code 1 on errors.
import { build } from "esbuild";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { capture, ROOT } from "./lib.mjs";

const only = process.argv[2];
const out = path.join(ROOT, "node_modules", ".cache", "check-signal.mjs");
await build({
  stdin: { contents: `export { signalVideos } from "./src/videos/signal/index.ts"; export { validateSignal } from "./src/styles/signal/validate.ts";`, resolveDir: ROOT, loader: "ts" },
  bundle: true, platform: "node", format: "esm", outfile: out, logLevel: "error",
});
const { signalVideos, validateSignal } = await import(pathToFileURL(out).href);

let failed = false;
for (const spec of signalVideos) {
  if (only && spec.id !== only) continue;
  const file = spec.video ? path.join(ROOT, "public", spec.video) : null;
  let duration = spec.duration;
  if (!duration && file && existsSync(file)) duration = Number(capture("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).trim());
  if (!duration) { console.log(`\n■ ${spec.id}: skipped (raw video missing — npm run fetch-raw)`); continue; }
  const capFile = spec.captions ? path.join(ROOT, "public", spec.captions.src) : null;
  const caps = capFile && existsSync(capFile) ? JSON.parse(readFileSync(capFile, "utf8")) : [];
  const r = validateSignal(spec, duration, caps);
  console.log(`\n■ ${spec.id}  (${duration.toFixed(2)}s)`);
  r.errors.forEach((e) => console.log(`  ✗ ${e}`));
  r.warnings.forEach((w) => console.log(`  ⚠ ${w}`));
  r.info.forEach((i) => console.log(`  · ${i}`));
  if (!r.errors.length && !r.warnings.length) console.log("  ✓ no problems");
  if (r.errors.length) failed = true;
}
process.exit(failed ? 1 : 0);
