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

export type Resolved = { segments: Segment[]; captions: Caption[] };

export const makeMetadata = <P extends { spec: BaseSpec; resolved?: Resolved }>(): CalculateMetadataFunction<P> => async ({ props }) => {
  const { spec } = props;
  let segments = spec.segments;
  if (!segments && spec.video) {
    const { slowDurationInSeconds } = await parseMedia({ src: staticFile(spec.video), fields: { slowDurationInSeconds: true }, acknowledgeRemotionLicense: true });
    segments = [{ start: 0, end: slowDurationInSeconds }];
  }
  const seconds = spec.duration ?? (segments ? segmentsDuration(segments) : Math.max(10, ...spec.beats.map((b) => b.to)));
  let captions: Caption[] = [];
  if (spec.captions) {
    const res = await fetch(staticFile(spec.captions.src));
    if (res.ok) captions = (await res.json()) as Caption[];
  }
  return { durationInFrames: Math.max(1, Math.round(seconds * VIDEO.fps)), props: { ...props, resolved: { segments: segments ?? [], captions } } };
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
