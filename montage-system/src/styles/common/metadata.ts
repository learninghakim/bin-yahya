// Shared metadata + caption plumbing for the data-driven styles (Punch / Paper / Newsroom).
// A style spec only needs: video, optional segments, optional captions, beats with `to`, optional duration.
import { CalculateMetadataFunction, staticFile } from "remotion";
import { parseMedia } from "@remotion/media-parser";
import type { Caption } from "@remotion/captions";
import { segmentsDuration } from "../../system/timeline";
import type { Segment } from "../../system/types";
import { VIDEO } from "../../system/safeArea";

export type BaseSpec = {
  id: string;
  video?: string; // path inside public/
  segments?: Segment[];
  captions?: { src: string };
  duration?: number;
  beats: { to: number }[];
};

export type Resolved = { segments: Segment[]; captions: Caption[]; pauses?: [number, number][] };

export const makeMetadata = <P extends { spec: BaseSpec; resolved?: Resolved }>(): CalculateMetadataFunction<P> => async ({ props }) => {
  const { spec } = props;
  let segments = spec.segments;
  if (!segments && spec.video) {
    const { slowDurationInSeconds } = await parseMedia({ src: staticFile(spec.video), fields: { slowDurationInSeconds: true }, acknowledgeRemotionLicense: true });
    segments = [{ start: 0, end: slowDurationInSeconds }];
  }
  const seconds = spec.duration ?? (segments ? segmentsDuration(segments) : Math.max(10, ...spec.beats.map((b) => b.to)));
  let captions: Caption[] = [];
  let pauses: [number, number][] = [];
  if (spec.captions) {
    const res = await fetch(staticFile(spec.captions.src));
    if (res.ok) captions = (await res.json()) as Caption[];
    const pr = await fetch(staticFile(spec.captions.src.replace(/\.json$/, ".pauses.json")));
    if (pr.ok) pauses = (await pr.json()) as [number, number][];
  }
  return { durationInFrames: Math.max(1, Math.round(seconds * VIDEO.fps)), props: { ...props, resolved: { segments: segments ?? [], captions, pauses } } };
};

/** Caption words as plain {text, s, e} seconds. */
export type Word = { text: string; s: number; e: number };
export const toWords = (caps: Caption[]): Word[] =>
  caps.map((c) => ({ text: c.text.trim(), s: c.startMs / 1000, e: c.endMs / 1000 })).filter((w) => w.text);

export type WordChunk = { words: Word[]; s: number; e: number; show: number; hide: number };

/** Group words into short chunks: ≤ maxWords, break on pause > gap, on punctuation, or if longer than maxDur. */
export const chunkWords = (words: Word[], maxWords: number, opts: { gap?: number; maxDur?: number; hold?: number; maxChars?: number } = {}): WordChunk[] => {
  const { gap = 0.4, maxDur = 1.8, hold = 0.4, maxChars = 99 } = opts;
  const chunks: WordChunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) chunks.push({ words: cur, s: cur[0].s, e: cur[cur.length - 1].e, show: 0, hide: 0 });
    cur = [];
  };
  words.forEach((w, i) => {
    const prev = words[i - 1];
    const chars = cur.reduce((n, x) => n + x.text.length + 1, 0) + w.text.length;
    if (cur.length && (cur.length >= maxWords || w.s - prev.e > gap || w.e - cur[0].s > maxDur || chars > maxChars)) flush();
    cur.push(w);
    if (/[.,!?؟،:]$/.test(w.text)) flush();
  });
  flush();
  chunks.forEach((c, i) => {
    const next = chunks[i + 1];
    c.show = c.s - 0.04;
    c.hide = next && next.s - c.e < 0.8 ? next.s - 0.04 : c.e + hold;
  });
  return chunks;
};

/** Strip punctuation for display / matching. */
export const clean = (s: string) => s.replace(/[.,!?؟،:"«»]/g, "").trim();
export const isArabic = (s: string) => /[؀-ۿ]/.test(s);

/**
 * Sentence-safe chunking (v2): a chunk never spans a pause ≥ `gap` (a sentence boundary in speech),
 * never exceeds `maxWords`/`maxChars`, and is balanced (a long run is split into near-equal parts,
 * so no lonely 1-word tail). Every word stays FULLY visible while its chunk is on screen.
 */
export const chunkPhrases = (words: Word[], maxWords: number, opts: { gap?: number; maxChars?: number; hold?: number; pauses?: [number, number][] } = {}): WordChunk[] => {
  const { gap = 0.25, maxChars = 24, hold = 0.35, pauses = [] } = opts;
  // a real audio pause that starts between the previous word's start and this word's start = sentence break
  const paused = (prev: Word, w: Word) => pauses.some(([a]) => a >= prev.s + 0.1 && a <= w.s + 0.05);
  // 1) split into phrases on pauses / punctuation
  const phrases: Word[][] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    const prev = words[i - 1];
    if (cur.length && (w.s - prev.e >= gap || paused(prev, w) || /[.!?؟،,:]$/.test(prev.text))) { phrases.push(cur); cur = []; }
    cur.push(w);
  });
  if (cur.length) phrases.push(cur);
  // 2) split each phrase into balanced chunks
  const chunks: WordChunk[] = [];
  for (const ph of phrases) {
    const chars = ph.reduce((n, w) => n + w.text.length + 1, 0);
    const parts = Math.max(Math.ceil(ph.length / maxWords), Math.ceil(chars / maxChars));
    const per = Math.ceil(ph.length / parts);
    const groups: Word[][] = [];
    for (let k = 0; k < ph.length; k += per) groups.push(ph.slice(k, k + per));
    // never end a line on a dangling function word ("في", "من", "اللي"…): move it to the next line
    for (let g = 0; g < groups.length - 1; g++) {
      const last = groups[g][groups[g].length - 1];
      if (groups[g].length > 1 && FUNCTION_WORDS.has(clean(last.text))) groups[g + 1].unshift(groups[g].pop()!);
    }
    for (const ws of groups) chunks.push({ words: ws, s: ws[0].s, e: ws[ws.length - 1].e, show: 0, hide: 0 });
  }
  // a lone sentence-final word (ends with . ، ؟ !) belongs to the line before it
  for (let i = chunks.length - 1; i > 0; i--) {
    const c = chunks[i], p = chunks[i - 1];
    if (c.words.length === 1 && /[.,،؟?!]$/.test(c.words[0].text) && c.s - p.e < 0.5 && p.words.length < maxWords + 1) {
      p.words.push(c.words[0]);
      p.e = c.e;
      chunks.splice(i, 1);
    }
  }
  // across chunks too: a line never ends on a function word when the next line follows within 0.8 s
  for (let i = 0; i < chunks.length - 1; i++) {
    const c = chunks[i], n = chunks[i + 1];
    const last = c.words[c.words.length - 1];
    if (c.words.length > 1 && FUNCTION_WORDS.has(clean(last.text)) && n.s - last.e < 0.8 && n.words.length < maxWords + 1) {
      n.words.unshift(c.words.pop()!);
      c.e = c.words[c.words.length - 1].e;
      n.s = n.words[0].s;
    }
  }
  // a line that would flash for under 0.45 s joins its neighbour (next one if close, else previous)
  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i], n = chunks[i + 1], p = chunks[i - 1];
    if (c.e - c.s >= 0.45 && (!n || n.s - c.s >= 0.45)) continue;
    const endsSentence = /[.,،؟?!]$/.test(c.words[c.words.length - 1].text);
    if (n && n.s - c.e < 0.5 && !(endsSentence && p)) { n.words.unshift(...c.words); n.s = c.s; chunks.splice(i, 1); i--; }
    else if (p && (c.s - p.e < 0.5 || endsSentence)) { p.words.push(...c.words); p.e = c.e; chunks.splice(i, 1); i--; }
  }
  chunks.forEach((c, i) => {
    const next = chunks[i + 1];
    c.show = c.s - 0.05;
    c.hide = next && next.s - c.e < 0.7 ? next.s - 0.05 : c.e + hold;
    if (c.hide - c.show < 0.3) c.hide = c.show + 0.3;
    // sentence punctuation added to force line breaks is not displayed (question/exclamation marks are)
    c.words = c.words.map((w) => ({ ...w, text: w.text.replace(/[.,،]+$/, "") }));
  });
  return chunks;
};

const FUNCTION_WORDS = new Set(["في", "من", "على", "إلى", "عن", "مع", "اللي", "ما", "لا", "إن", "أن", "إنه", "أنه", "لو", "إذا", "عشان", "بدون", "بدل", "و", "أو", "ثم", "لكن", "هو", "هي", "هذا", "هذه", "كل", "قبل", "بعد", "حتى", "يا", "لـ", "كان", "راح", "هم", "تم", "يا"]);

/** Pauses (raw seconds) → edited timeline. */
export const retimePauses = (pauses: [number, number][] | undefined, segs: Segment[]): [number, number][] => {
  if (!pauses?.length) return [];
  let acc = 0;
  const out: [number, number][] = [];
  for (const sg of segs) {
    for (const [a, b] of pauses) if (a >= sg.start && a < sg.end) out.push([acc + a - sg.start, acc + Math.min(b, sg.end) - sg.start]);
    acc += sg.end - sg.start;
  }
  return out;
};
