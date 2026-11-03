// Levels matched to the reference reel: boom ≈ +8 dB over the voice low band, pings ≈ +11 dB over the voice at 2 kHz.
import type { Art, Beat, SignalSfx, Widget } from "./types";

export const SIGNAL_SFX: Record<SignalSfx, { file: string; volume: number }> = {
  boom: { file: "sfx/signal/boom.wav", volume: 0.3 },
  tick: { file: "sfx/signal/tick.wav", volume: 0.11 },
  tick2: { file: "sfx/signal/tick2.wav", volume: 0.11 },
  swish: { file: "sfx/signal/swish.wav", volume: 0.16 },
  tap: { file: "sfx/signal/tap.wav", volume: 0.4 },
};

const widgetTimes = (w: Widget): number[] => {
  switch (w.type) {
    case "checklist": return w.rows.map((r) => r.at);
    case "stepper": return w.steps.map((s) => s.at);
    case "bars": return w.bars.map((b) => b.at);
    case "chips": return w.chips.map((c) => c.at);
    case "reframe": return [w.strikeAt, w.to.at];
    case "links": return [w.strongAt];
    case "follow": return w.bell ? [w.bell.at] : [];
    case "iconTitle": return [w.at];
  }
};

const artSfx = (a: Art): { name: SignalSfx; at: number }[] => {
  switch (a.type) {
    case "gauge": return [{ name: "tick", at: a.at + 0.35 }];
    case "bolt": return [{ name: "boom", at: a.at + 0.3 }];
    case "illusion": return [{ name: "tick", at: a.fillAt + 1.0 }, { name: "swish", at: a.trickAt }, { name: "tick2", at: a.trickAt + 0.5 }];
    case "book": return [{ name: "tick", at: a.peopleAt }, ...(a.chips ?? []).map((c, i) => ({ name: (i % 2 ? "tick" : "tick2") as SignalSfx, at: c.at }))];
    case "curve": return [{ name: "tick", at: a.feelAt }, { name: "tick2", at: a.longAt }];
    case "habits": return [{ name: "tick", at: a.pageAt }, { name: "tick2", at: a.illusionAt }, { name: "tap", at: a.crackAt }];
    case "toggle": return [{ name: "boom", at: a.flipAt }];
    case "journey": return a.stops.map((s, i) => ({ name: (i % 2 ? "tick2" : "tick") as SignalSfx, at: s.at }));
    case "barbell": return [{ name: "tap", at: a.squeezeAt }];
    case "brain": return [{ name: "tap", at: a.crossAt }, { name: "tick", at: a.strongAt }];
    case "follow": return [{ name: "tap", at: a.tapAt }, { name: "tick", at: a.bellAt }];
  }
};

/**
 * Sound rules (from the reference reel): a sub BOOM when the frame changes world
 * (stage in/out, slam), soft PINGS when UI pieces appear, a TAP on buttons. Meaningful moments only.
 */
export const autoSfx = (beats: Beat[]): { name: SignalSfx; at: number }[] => {
  const out: { name: SignalSfx; at: number }[] = [];
  let alt = 0;
  const ping = (at: number) => out.push({ name: alt++ % 2 ? "tick2" : "tick", at });
  for (const b of beats) {
    if (b.sfx === false) continue;
    switch (b.kind) {
      case "stage":
        out.push({ name: "boom", at: b.from }, { name: "boom", at: b.to - 0.3 });
        (b.chips ?? []).forEach((c) => ping(c.at));
        break;
      case "slam":
        out.push({ name: "boom", at: b.words[0].at });
        break;
      case "burst":
        out.push({ name: "swish", at: b.at - 0.15 }, { name: "tick", at: b.at });
        break;
      case "hookCam":
        b.words.filter((w) => b.highlight?.includes(w.text)).forEach((w) => ping(w.at));
        break;
      case "art":
        if (b.stage) out.push({ name: "boom", at: b.from }, { name: "boom", at: b.to - 0.3 });
        out.push(...artSfx(b.art));
        break;
      case "panel":
        b.widgets.forEach((w) => {
          if (w.type === "follow") out.push({ name: "tap", at: w.tapAt });
          widgetTimes(w).forEach(ping);
        });
        break;
    }
  }
  return out;
};
