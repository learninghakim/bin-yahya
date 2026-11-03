// npm run snap <slug>
// Whisper often starts a word right where the previous one ended, even when the speaker paused —
// so the word lights up 0.15–0.3 s early. This moves each word's start to the first audible
// 10 ms frame (within 0.45 s, never past its end). Runs automatically after `npm run transcribe`.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { resolveRaw, ROOT, slugOf } from "./lib.mjs";

export const snapCaptions = (rawFile, capFile) => {
  const pcm = execFileSync("ffmpeg", ["-v", "error", "-i", rawFile, "-vn", "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], { maxBuffer: 1 << 30 });
  const n = pcm.length / 2, hop = 160; // 10 ms
  const db = [];
  for (let i = 0; i + hop <= n; i += hop) {
    let e = 0;
    for (let k = 0; k < hop; k++) { const v = pcm.readInt16LE((i + k) * 2) / 32768; e += v * v; }
    db.push(10 * Math.log10(e / hop + 1e-12));
  }
  // smooth to 50 ms (energy average of 5 frames) so short dips inside a word don't count as silence
  const sm = db.map((_, i) => {
    let e = 0, k = 0;
    for (let j = i - 2; j <= i + 2; j++) if (j >= 0 && j < db.length) { e += 10 ** (db[j] / 10); k++; }
    return 10 * Math.log10(e / k);
  });
  db.splice(0, db.length, ...sm);
  const floor = [...db].sort((a, b) => a - b)[Math.floor(db.length * 0.1)];
  const at = (s) => db[Math.min(db.length - 1, Math.max(0, Math.round(s * 100)))];
  const caps = JSON.parse(readFileSync(capFile, "utf8"));
  let moved = 0;
  caps.forEach((c, idx) => {
    const s = c.startMs / 1000, e = c.endMs / 1000;
    const next = caps[idx + 1];
    // search to the end of the word, or a bit past it when whisper put the whole word inside the pause,
    // but never at/after the next word's start
    const limit = Math.min(Math.max(e - 0.04, s + 0.45), next ? next.startMs / 1000 - 0.08 : s + 0.45);
    const quiet = [0, 0.02, 0.04].every((d) => at(s + d) < floor + 14);
    if (!quiet) return;
    let found = false;
    for (let t = s; t <= limit; t += 0.01) {
      if (at(t) > floor + 20) {
        const ms = Math.round(t * 1000);
        if (ms - c.startMs >= 40) { c.startMs = ms; c.endMs = Math.max(c.endMs, ms + 80); if (c.timestampMs !== null) c.timestampMs = Math.max(ms, c.timestampMs); moved++; }
        found = true;
        break;
      }
    }
    // whole word sits in silence up to the next word → it is spoken right before the next one
    if (!found && next && limit - s >= 0.04) {
      const ms = Math.round(limit * 1000);
      c.startMs = ms; c.endMs = Math.max(c.endMs, ms + 60); if (c.timestampMs !== null) c.timestampMs = ms; moved++;
    }
  });
  writeFileSync(capFile, JSON.stringify(caps, null, 1));
  return moved;
};

if (process.argv[1] && process.argv[1].endsWith("snap-captions.mjs")) {
  const raw = resolveRaw(process.argv[2]);
  const capFile = path.join(ROOT, "public", "captions", `${slugOf(raw)}.json`);
  console.log(`snapped ${snapCaptions(raw, capFile)} word starts to the audio`);
}
