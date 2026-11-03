// ─────────────────────────────────────────────────────────────────────────────
// Signal spec checker (pure — runs in Node via `npm run check <id>`).
// Errors = must fix. Warnings = look at it.
// ─────────────────────────────────────────────────────────────────────────────
import type { Caption } from "@remotion/captions";
import { chunkCaptions, chunkFontSize } from "./chunks";
import { autoSfx, SIGNAL_SFX } from "./sfx";
import type { Beat, SignalSpec } from "./types";

export type Report = { errors: string[]; warnings: string[]; info: string[] };

/** Every timed value inside a beat: keys `at` or ending in `At`. */
const timesIn = (o: unknown, path = ""): { path: string; v: number }[] => {
  if (Array.isArray(o)) return o.flatMap((x, i) => timesIn(x, `${path}[${i}]`));
  if (o && typeof o === "object") {
    return Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
      typeof v === "number" && (k === "at" || /At$/.test(k)) ? [{ path: `${path}.${k}`, v }] : timesIn(v, `${path}.${k}`),
    );
  }
  return [];
};

const label = (b: Beat, i: number) => `beat ${i + 1} (${b.kind}${b.kind === "art" ? ":" + b.art.type : ""} ${b.from}–${b.to}s)`;

export const validateSignal = (spec: SignalSpec, duration: number, caps: Caption[]): Report => {
  const r: Report = { errors: [], warnings: [], info: [] };
  const words = caps.map((c) => ({ text: c.text.trim(), s: c.startMs / 1000, e: c.endMs / 1000 }));
  const hasVoice = !!spec.captions;
  const nearWord = (v: number, tol = 0.3) => !hasVoice || words.some((w) => Math.abs(w.s - v) <= tol);

  // ── beats
  const beats = spec.beats;
  beats.forEach((b, i) => {
    const L = label(b, i);
    if (!(b.to > b.from)) r.errors.push(`${L}: 'to' must be after 'from'`);
    if (b.from < 0 || b.to > duration + 0.01) r.errors.push(`${L}: outside the video (0–${duration.toFixed(2)}s)`);
    if (i > 0 && b.from < beats[i - 1].from) r.errors.push(`${L}: beats must be in time order`);
    if (i > 0 && beats[i - 1].to - b.from > 0.35) r.warnings.push(`${L}: overlaps the previous beat by ${(beats[i - 1].to - b.from).toFixed(2)}s`);
    const ts = timesIn(b);
    ts.forEach(({ path, v }) => {
      if (v < b.from - 0.05 || v > b.to - 0.25) r.errors.push(`${L}: ${path}=${v} is outside its beat window (needs from ≤ t ≤ to−0.25)`);
      else if (!nearWord(v) && !/fillAt|liftAt|settleAt|buildAt/.test(path)) r.warnings.push(`${L}: ${path}=${v} is not on a spoken word (±0.3s)`);
    });
    const last = Math.max(b.from, ...ts.map((x) => x.v));
    if (b.to - last < 0.3 && b.to < duration - 0.05) r.warnings.push(`${L}: leaves only ${(b.to - last).toFixed(2)}s after its last cue (rule: ≥ 0.45s)`);
  });

  // ── gaps (captions-only stretches)
  let prev = 0;
  [...beats, { from: duration, to: duration } as Beat].forEach((b) => {
    if (b.from - prev > 4) r.info.push(`captions-only stretch ${prev.toFixed(1)}–${b.from.toFixed(1)}s (${(b.from - prev).toFixed(1)}s)`);
    prev = Math.max(prev, b.to);
  });

  // ── zooms
  (spec.zooms ?? []).forEach((z, i, a) => {
    if (z.at < 0 || z.at > duration) r.errors.push(`zoom ${i + 1} at ${z.at}s is outside the video`);
    if (i && z.at < a[i - 1].at) r.errors.push(`zoom ${i + 1}: zooms must be in time order`);
    if (z.scale < 1) r.errors.push(`zoom ${i + 1}: scale < 1 shows black edges`);
  });

  // ── sound
  const sfx = [...(spec.sfx === false ? [] : autoSfx(beats)), ...(spec.sfxExtra ?? [])].sort((a, b) => a.at - b.at);
  sfx.forEach((s) => {
    if (!SIGNAL_SFX[s.name]) r.errors.push(`unknown sfx "${s.name}"`);
    else if (s.at - SIGNAL_SFX[s.name].lead < -0.01 || s.at > duration) r.errors.push(`sfx ${s.name} at ${s.at.toFixed(2)}s starts outside the video (lead ${SIGNAL_SFX[s.name].lead}s)`);
  });
  // same file twice within 0.6 s sounds like a stutter
  sfx.forEach((s, i) => sfx.slice(0, i).forEach((p) => { if (p.name === s.name && s.at - p.at < 0.6 && s.at !== p.at) r.warnings.push(`sfx "${s.name}" repeats within ${(s.at - p.at).toFixed(2)}s at ${s.at.toFixed(2)}s`); }));
  // the same UI sound on consecutive cues = repetitive
  const ui = sfx.filter((s) => ["pop", "tick", "tick2", "click"].includes(s.name));
  ui.forEach((s, i) => { if (i && s.name === ui[i - 1].name && s.at - ui[i - 1].at < 3) r.warnings.push(`UI sound "${s.name}" used twice in a row (${ui[i - 1].at.toFixed(2)}s, ${s.at.toFixed(2)}s)`); });
  const perMin = (sfx.length / duration) * 60;
  const booms = sfx.filter((s) => s.name === "boom").length;
  r.info.push(`sfx: ${sfx.length} total (${perMin.toFixed(0)}/min), ${booms} booms, ${sfx.filter((s) => s.name.startsWith("tick")).length} pings`);
  if (perMin > 24) r.warnings.push(`${perMin.toFixed(0)} sounds/min — keep sounds for meaningful moments`);
  r.info.push(`distinct sound files used: ${new Set(sfx.map((s) => s.name)).size}`);
  if (booms / duration * 60 > 8) r.warnings.push(`too many booms (${booms}) — keep them for world changes`);

  // ── captions
  if (!hasVoice) { r.info.push("no captions in this spec (demo) — caption checks skipped"); return r; }
  if (!caps.length) r.errors.push("no captions loaded");
  words.forEach((w, i) => {
    if (w.e < w.s) r.errors.push(`caption word ${i} "${w.text}" ends before it starts`);
    if (i && w.s < words[i - 1].s - 0.01) r.errors.push(`caption word ${i} "${w.text}" is out of order`);
    if (!w.text) r.warnings.push(`caption word ${i} is empty`);
  });
  for (let i = 3; i < words.length; i++) {
    const seq = words.slice(i - 3, i + 1).map((w) => w.text);
    if (new Set(seq).size === 1) r.errors.push(`caption: "${seq[0]}" repeated 4× at ${words[i].s.toFixed(1)}s (whisper hallucination?)`);
  }
  const chunks = chunkCaptions(caps);
  const small = chunks.filter((c) => chunkFontSize(c) < 40);
  if (small.length) r.warnings.push(`${small.length} caption chunks render below 40px: ${small.map((c) => c.words.map((w) => w.text).join(" ")).join(" | ")}`);
  if (words.length && words[0].s > 0.5) r.warnings.push(`first spoken word at ${words[0].s.toFixed(2)}s — first caption should appear in the first 0.5s`);
  r.info.push(`captions: ${words.length} words in ${chunks.length} chunks; every word shown`);
  return r;
};
