// ─────────────────────────────────────────────────────────────────────────────
// Signal sound design — professional CC0 kit (public/sfx/pro, see LICENSE.md).
// Every sound has a `lead`: seconds from the start of the file to its hit, so a cue at time t
// is played from t − lead and the impact lands exactly on the word.
// Variety: repeated cue types rotate through several files (never the same sound twice in a row).
// ─────────────────────────────────────────────────────────────────────────────
import type { Art, Beat, SignalSfx, Widget } from "./types";

export const SIGNAL_SFX: Record<SignalSfx, { file: string; volume: number; lead: number }> = {
  riser: { file: "sfx/pro/riser.wav", volume: 0.32, lead: 2.15 }, // builds INTO the hit
  boom: { file: "sfx/pro/boom.wav", volume: 0.34, lead: 0.45 }, // cinematic low boom
  suck: { file: "sfx/pro/suck.wav", volume: 0.26, lead: 1.3 }, // reverse whoosh into a cut
  hit: { file: "sfx/pro/hit.wav", volume: 0.5, lead: 0 }, // sub thud
  punch: { file: "sfx/pro/punch.wav", volume: 0.32, lead: 0 }, // punchy transient
  whoosh: { file: "sfx/pro/whoosh.wav", volume: 0.2, lead: 0.12 },
  whoosh2: { file: "sfx/pro/whoosh2.wav", volume: 0.2, lead: 0.3 },
  swoosh: { file: "sfx/pro/swoosh.wav", volume: 0.18, lead: 0.45 },
  whooshLow: { file: "sfx/pro/whooshLow.wav", volume: 0.24, lead: 0.3 },
  glitch: { file: "sfx/pro/glitch.wav", volume: 0.2, lead: 0.05 },
  reveal: { file: "sfx/pro/reveal.wav", volume: 0.26, lead: 0.25 },
  zap: { file: "sfx/pro/zap.wav", volume: 0.16, lead: 0.03 },
  shutter: { file: "sfx/pro/shutter.wav", volume: 0.3, lead: 0 },
  pop: { file: "sfx/pro/pop.wav", volume: 0.2, lead: 0 },
  click: { file: "sfx/pro/click.wav", volume: 0.18, lead: 0 },
  tick: { file: "sfx/pro/tick.wav", volume: 0.16, lead: 0 },
  tick2: { file: "sfx/pro/tick2.wav", volume: 0.16, lead: 0 },
  notify: { file: "sfx/pro/notify.wav", volume: 0.26, lead: 0 },
  chime: { file: "sfx/pro/chime.wav", volume: 0.28, lead: 0 },
};

type Cue = { name: SignalSfx; at: number };

/** Rotating pools so the same category never repeats the same file back to back. */
const pools = {
  ui: ["pop", "tick", "click", "tick2"] as SignalSfx[],
  move: ["whoosh", "whoosh2", "swoosh"] as SignalSfx[],
};
const makeRotor = () => {
  const n = { ui: 0, move: 0 };
  return (k: keyof typeof pools): SignalSfx => pools[k][n[k]++ % pools[k].length];
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

const artSfx = (a: Art, r: ReturnType<typeof makeRotor>): Cue[] => {
  switch (a.type) {
    case "hookShatter":
      return [
        { name: "hit", at: a.punchAt },
        ...a.checks.map((c) => ({ name: r("ui"), at: c.at })),
        { name: "riser", at: a.shatterAt }, { name: "glitch", at: a.shatterAt }, { name: "boom", at: a.shatterAt + 0.05 },
      ];
    case "gauge": return [{ name: r("move"), at: a.at - 0.4 }, { name: r("ui"), at: a.at + 0.35 }];
    case "bolt": return [{ name: "zap", at: a.at + 0.3 }, { name: "punch", at: a.at + 0.3 }];
    case "illusion": return [{ name: "glitch", at: a.trickAt }, { name: "punch", at: a.trickAt + 0.25 }];
    case "book": return [{ name: "reveal", at: a.openAt }];
    case "curve": return [{ name: r("move"), at: a.feelAt }, { name: "whooshLow", at: a.realAt + 0.3 }];
    case "habits": return [{ name: "glitch", at: a.crackAt }];
    case "toggle": return [{ name: "shutter", at: a.flipAt - 0.03 }, { name: "chime", at: a.flipAt + 0.2 }];
    case "journey": return a.stops.map((s) => ({ name: r("ui"), at: s.at }));
    case "barbell": return [{ name: "punch", at: a.liftAt }];
    case "brain": return [{ name: "punch", at: a.crossAt }, { name: r("move"), at: a.buildAt }, { name: "reveal", at: a.strongAt }];
    case "follow": return [{ name: "click", at: a.tapAt }, { name: "notify", at: a.bellAt }];
  }
};

/**
 * Sound rules: stage in = reverse-suck into a sub HIT; stage out = low whoosh; the hook gets a riser into
 * a hit + glitch + boom; UI pieces get soft rotating clicks/pops; moving graphics get rotating whooshes.
 * Meaningful moments only — `npm run check` warns above 24/min.
 */
export const autoSfx = (beats: Beat[]): Cue[] => {
  const r = makeRotor();
  const out: Cue[] = [];
  for (const b of beats) {
    if (b.sfx === false) continue;
    switch (b.kind) {
      case "stage":
        out.push({ name: "suck", at: b.from }, { name: "hit", at: b.from }, { name: "whooshLow", at: b.to - 0.3 });
        (b.chips ?? []).forEach((c) => out.push({ name: r("ui"), at: c.at }));
        break;
      case "slam":
        out.push({ name: "hit", at: b.words[0].at }, { name: "boom", at: b.words[0].at });
        break;
      case "burst":
        out.push({ name: r("move"), at: b.at }, { name: "punch", at: b.at + 0.1 });
        break;
      case "hookCam":
        b.words.filter((w) => b.highlight?.includes(w.text)).forEach((w) => out.push({ name: r("ui"), at: w.at }));
        break;
      case "art":
        if (b.stage) out.push({ name: "suck", at: b.from }, { name: "hit", at: b.from });
        out.push(...artSfx(b.art, r));
        break;
      case "panel":
        b.widgets.forEach((w) => {
          if (w.type === "follow") out.push({ name: "click", at: w.tapAt });
          widgetTimes(w).forEach((t) => out.push({ name: r("ui"), at: t }));
        });
        break;
    }
  }
  return out;
};
