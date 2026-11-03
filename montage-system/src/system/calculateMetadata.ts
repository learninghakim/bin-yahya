import { CalculateMetadataFunction, staticFile } from "remotion";
import { parseMedia } from "@remotion/media-parser";
import type { Caption } from "@remotion/captions";
import { VIDEO } from "./safeArea";
import { segmentsDuration } from "./timeline";
import type { ReelProps } from "./Reel";

/**
 * Runs before the composition renders:
 *  - reads the raw video length (so you never type durations by hand)
 *  - loads the captions JSON
 */
export const calculateReelMetadata: CalculateMetadataFunction<ReelProps> = async ({ props }) => {
  const { spec } = props;
  let segments = spec.segments;

  if (!segments && spec.video) {
    const { slowDurationInSeconds } = await parseMedia({
      src: staticFile(spec.video),
      fields: { slowDurationInSeconds: true },
      acknowledgeRemotionLicense: true,
    });
    segments = [{ start: 0, end: slowDurationInSeconds }];
  }

  const lastScene = Math.max(0, ...spec.scenes.map((s) => s.to));
  const seconds = spec.duration ?? (segments ? segmentsDuration(segments) : Math.max(lastScene + 0.5, 10));

  let captions: Caption[] = [];
  if (spec.captions && spec.captions.enabled !== false) {
    const res = await fetch(staticFile(spec.captions.src));
    if (res.ok) captions = (await res.json()) as Caption[];
  }

  return {
    durationInFrames: Math.max(1, Math.round(seconds * VIDEO.fps)),
    props: { ...props, resolved: { segments: segments ?? [], captions } },
  };
};
