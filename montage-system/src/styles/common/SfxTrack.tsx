// Plays a list of sound cues from the pro CC0 kit (levels/leads from the Signal sound table).
import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { SIGNAL_SFX } from "../signal/sfx";
import type { SignalSfx } from "../signal/types";

export type Cue = { name: SignalSfx; at: number; gain?: number };

export const SfxTrack: React.FC<{ cues: Cue[]; gain?: number }> = ({ cues, gain = 1 }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {cues.map((s, i) => {
        const d = SIGNAL_SFX[s.name];
        return (
          <Sequence key={i} from={Math.max(0, Math.round((s.at - d.lead) * fps))} durationInFrames={Math.round((d.lead + 2.7) * fps)} layout="none" name={`sfx ${s.name}`}>
            <Audio src={staticFile(d.file)} volume={d.volume * gain * (s.gain ?? 1)} />
          </Sequence>
        );
      })}
    </>
  );
};

/** Rotates through a pool so the same file never plays twice in a row. */
export const rotor = <K extends string>(pools: Record<K, SignalSfx[]>) => {
  const n = {} as Record<K, number>;
  return (k: K): SignalSfx => {
    n[k] = (n[k] ?? 0) + 1;
    return pools[k][(n[k] - 1) % pools[k].length];
  };
};
