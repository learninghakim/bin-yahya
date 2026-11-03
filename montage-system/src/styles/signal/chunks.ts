// Pure caption chunking (no React) — shared by <SignalCaptions> and the checker.
import type { Caption } from "@remotion/captions";

const HOLD = 0.45;

export type Chunk = { words: { text: string; s: number; e: number }[]; s: number; e: number; show: number; hide: number };

export const chunkCaptions = (caps: Caption[], maxWords = 4): Chunk[] => {
  const words = caps.map((c) => ({ text: c.text.trim(), s: c.startMs / 1000, e: c.endMs / 1000 })).filter((w) => w.text);
  const chunks: Chunk[] = [];
  let cur: Chunk["words"] = [];
  const flush = () => {
    if (cur.length) chunks.push({ words: cur, s: cur[0].s, e: cur[cur.length - 1].e, show: 0, hide: 0 });
    cur = [];
  };
  words.forEach((w, i) => {
    const prev = words[i - 1];
    if (cur.length && (cur.length >= maxWords || w.s - prev.e > 0.45 || w.e - cur[0].s > 2.0)) flush();
    cur.push(w);
    if (/[.,!?؟،:]$/.test(w.text)) flush();
  });
  flush();
  chunks.forEach((c, i) => {
    const next = chunks[i + 1];
    c.show = c.s - 0.05;
    c.hide = next && next.s - c.e < 0.8 ? next.s - 0.05 : c.e + HOLD;
  });
  return chunks;
};


/** Font size a chunk gets so it fits on one line (same formula as <SignalCaptions>). */
export const chunkFontSize = (c: Chunk, maxW = 860) => {
  const chars = c.words.reduce((n, w) => n + w.text.length + 1, 0);
  return Math.min(56, Math.round((maxW - 60) / (chars * 0.52)));
};
