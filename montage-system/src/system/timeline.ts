import type { Caption } from "@remotion/captions";
import type { Segment } from "./types";

/** Total length of the kept segments, in seconds. */
export const segmentsDuration = (segs: Segment[]) => segs.reduce((a, s) => a + (s.end - s.start), 0);

/** Where each segment starts in the edited timeline. */
export const segmentOffsets = (segs: Segment[]) => {
  let acc = 0;
  return segs.map((s) => {
    const o = acc;
    acc += s.end - s.start;
    return o;
  });
};

/** Raw-file seconds → edited-timeline seconds (null if that moment was cut). */
export const rawToEdited = (t: number, segs: Segment[]) => {
  const offs = segmentOffsets(segs);
  for (let i = 0; i < segs.length; i++) {
    if (t >= segs[i].start && t < segs[i].end) return offs[i] + (t - segs[i].start);
  }
  return null;
};

/** Re-time captions from the raw file onto the edited timeline; drops words that were cut. */
export const retimeCaptions = (caps: Caption[], segs: Segment[]): Caption[] =>
  caps.flatMap((c) => {
    const s = rawToEdited(c.startMs / 1000, segs);
    if (s === null) return [];
    const len = (c.endMs - c.startMs) / 1000;
    return [{ ...c, startMs: s * 1000, endMs: (s + len) * 1000, timestampMs: c.timestampMs === null ? null : s * 1000 }];
  });
