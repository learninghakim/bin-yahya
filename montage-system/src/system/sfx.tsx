import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

export const SFX = {
  whoosh: { file: "sfx/whoosh.wav", volume: 0.35 },
  pop: { file: "sfx/pop.wav", volume: 0.5 },
  click: { file: "sfx/click.wav", volume: 0.45 },
  thump: { file: "sfx/thump.wav", volume: 0.5 },
  chime: { file: "sfx/chime.wav", volume: 0.3 },
} as const;

export type SfxName = keyof typeof SFX;

/** Plays a sound 2 frames BEFORE `at` (early feels synced, late feels broken). */
export const Sfx: React.FC<{ name: SfxName; at: number }> = ({ name, at }) => (
  <Sequence from={Math.max(0, at - 2)} durationInFrames={60} layout="none">
    <Audio src={staticFile(SFX[name].file)} volume={SFX[name].volume} />
  </Sequence>
);
