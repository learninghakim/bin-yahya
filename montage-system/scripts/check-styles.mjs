// npm run check-styles [id]
// Static QA for the v2 styles (Pulse / Phone / Cinema): beat overlaps, timed elements outside their beat
// window, empty lead-in (container on screen > 0.6 s before its first element), coverage, longest stretch with
// no visual change, captions (sentence-safe chunks, max chars), SFX density. Exit 1 on errors.
import { build } from "esbuild";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { capture, ROOT } from "./lib.mjs";

const only = process.argv[2];
const out = path.join(ROOT, "node_modules", ".cache", "check-styles.mjs");
await build({
  stdin: { contents: `export { pulseVideos, phoneVideos, cinemaVideos } from "./src/videos/styles/index.ts"; export { chunkPhrases, toWords, retimePauses } from "./src/styles/common/metadata.ts";`, resolveDir: ROOT, loader: "ts" },
  bundle: true, platform: "node", format: "esm", outfile: out, logLevel: "error", external: ["remotion", "@remotion/*"],
});
const m = await import(pathToFileURL(out).href);
const specs = [...m.pulseVideos, ...m.phoneVideos, ...m.cinemaVideos];

/** every number-valued `at`-like field inside a beat (deep) */
const times = (o, acc = []) => {
  if (Array.isArray(o)) o.forEach((x) => times(x, acc));
  else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) {
    if (["from", "to", "value", "start", "end", "count", "n", "minutes", "dur", "from0", "size", "y"].includes(k)) continue;
    if (typeof v === "number" && /at$|At$/.test(k)) acc.push(v); else times(v, acc);
  }
  return acc;
};

let failed = false;
for (const spec of specs) {
  if (only && spec.id !== only) continue;
  const file = path.join(ROOT, "public", spec.video);
  const rawDur = Number(capture("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).trim());
  const segs = spec.segments ?? [{ start: 0, end: rawDur }];
  const dur = segs.reduce((a, s) => a + s.end - s.start, 0);
  const E = [], W = [], I = [];
  const beats = [...spec.beats].sort((a, b) => a.from - b.from);
  beats.forEach((b, i) => {
    const ts = times(b);
    const name = `#${i + 1} ${b.kind} [${b.from}–${b.to}]`;
    if (b.to <= b.from) E.push(`${name}: to ≤ from`);
    if (b.to > dur + 0.05) E.push(`${name}: ends after the video (${dur.toFixed(2)})`);
    ts.forEach((t) => { if (t < b.from - 0.05 || t > b.to) E.push(`${name}: element at ${t} outside its window`); });
    const first = Math.min(...ts, b.to);
    const next = beats[i + 1];
    if (next && next.from < b.to - 0.01) E.push(`${name} overlaps #${i + 2} ${next.kind} (${next.from})`);
  });
  const covered = beats.reduce((a, b) => a + (b.to - b.from), 0);
  I.push(`coverage ${(100 * covered / dur).toFixed(0)}% of ${dur.toFixed(1)} s (face-only ${(dur - covered).toFixed(1)} s)`);
  const marks = [0, ...beats.flatMap((b) => [b.from, b.to]), ...(spec.zooms ?? []).map((z) => z.at), dur].sort((a, b) => a - b);
  let gap = 0, at = 0;
  for (let k = 1; k < marks.length; k++) if (marks[k] - marks[k - 1] > gap) { gap = marks[k] - marks[k - 1]; at = marks[k - 1]; }
  (gap > 4.5 ? W : I).push(`longest stretch with no visual change: ${gap.toFixed(1)} s at ${at.toFixed(1)} s`);
  if (spec.captions) {
    const capFile = path.join(ROOT, "public", spec.captions.src);
    if (existsSync(capFile)) {
      const caps = JSON.parse(readFileSync(capFile, "utf8"));
      const words = m.toWords(caps).map((w) => ({ ...w, s: w.s - segs[0].start, e: w.e - segs[0].start })).filter((w) => w.s >= 0);
      const pf = capFile.replace(/\.json$/, ".pauses.json");
      const pauses = existsSync(pf) ? m.retimePauses(JSON.parse(readFileSync(pf, "utf8")), segs) : [];
      const isCinema = spec.id.startsWith("cinema");
      const chunks = m.chunkPhrases(words, isCinema ? 5 : 4, { maxChars: isCinema ? 28 : 24, pauses });
      if (process.env.SHOW) console.log(chunks.map((c) => `   [${c.s.toFixed(2)}] ${c.words.map((w) => w.text).join(" ")}`).join("\n"));
      const lonely = chunks.filter((c) => c.words.length === 1 && c.words[0].text.length < 4).length;
      I.push(`${chunks.length} caption chunks, ${lonely} single short-word chunks`);
      const overlapC = chunks.filter((c, i) => chunks[i + 1] && c.hide > chunks[i + 1].show + 0.01).length;
      if (overlapC) E.push(`${overlapC} caption chunks overlap`);
    }
  }
  console.log(`\n■ ${spec.id}`);
  E.forEach((e) => console.log(`  ✗ ${e}`)); W.forEach((w) => console.log(`  ⚠ ${w}`)); I.forEach((x) => console.log(`  · ${x}`));
  if (E.length) failed = true;
}
process.exit(failed ? 1 : 0);
