// Synthesizes a small, deterministic SFX kit into public/sfx as 16-bit mono WAVs.
// Run: node scripts/make-sfx.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const SR = 44100;
const OUT = new URL("../public/sfx/", import.meta.url);
mkdirSync(OUT, { recursive: true });

// Deterministic PRNG so the kit is identical on every run.
let seed = 1337;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const noise = () => rnd() * 2 - 1;

const writeWav = (name, samples) => {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => {
    const v = Math.max(-1, Math.min(1, s));
    data.writeInt16LE(Math.round(v * 32767), i * 2);
  });
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write("WAVE", 8);
  h.write("fmt ", 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(data.length, 40);
  writeFileSync(new URL(name, OUT), Buffer.concat([h, data]));
};

const render = (seconds, fn) =>
  Array.from({ length: Math.round(seconds * SR) }, (_, i) => fn(i / SR, i));

// Whoosh: noise through a swept one-pole low-pass, swelling then fading.
{
  const dur = 0.5;
  let lp = 0;
  writeWav(
    "whoosh.wav",
    render(dur, (t) => {
      const x = t / dur;
      const cutoff = 300 + 5200 * Math.sin(Math.PI * x);
      const a = 1 - Math.exp((-2 * Math.PI * cutoff) / SR);
      lp += a * (noise() - lp);
      const env = Math.pow(Math.sin(Math.PI * Math.pow(x, 0.7)), 2);
      return lp * env * 0.9;
    }),
  );
}

// Pop: fast pitch-drop sine, for small UI elements landing.
{
  let ph = 0;
  writeWav(
    "pop.wav",
    render(0.14, (t) => {
      const f = 260 + 760 * Math.exp(-t * 45);
      ph += (2 * Math.PI * f) / SR;
      return Math.sin(ph) * Math.exp(-t * 32) * 0.7;
    }),
  );
}

// Paper slap: short high-passed noise burst with a soft body.
{
  let prev = 0;
  let ph = 0;
  writeWav(
    "paper.wav",
    render(0.18, (t) => {
      const n = noise();
      const hp = n - prev * 0.6;
      prev = n;
      ph += (2 * Math.PI * 140) / SR;
      const body = Math.sin(ph) * Math.exp(-t * 40) * 0.35;
      return hp * Math.exp(-t * 38) * 0.45 + body;
    }),
  );
}

// Click: crisp mouse click (two transients).
{
  writeWav(
    "click.wav",
    render(0.12, (t) => {
      const c1 = t < 0.006 ? noise() * (1 - t / 0.006) : 0;
      const t2 = t - 0.045;
      const c2 = t2 > 0 && t2 < 0.005 ? noise() * 0.6 * (1 - t2 / 0.005) : 0;
      const tone = Math.sin(2 * Math.PI * 2100 * t) * Math.exp(-t * 90) * 0.25;
      return (c1 + c2) * 0.8 + tone;
    }),
  );
}

// Thump: soft sub hit for scene changes.
{
  let ph = 0;
  writeWav(
    "thump.wav",
    render(0.45, (t) => {
      const f = 48 + 70 * Math.exp(-t * 18);
      ph += (2 * Math.PI * f) / SR;
      return Math.sin(ph) * Math.exp(-t * 7) * 0.85;
    }),
  );
}

// Chime: gentle two-note bell for the CTA.
{
  const bell = (t, f) =>
    (Math.sin(2 * Math.PI * f * t) +
      0.4 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t * 6) +
      0.2 * Math.sin(2 * Math.PI * f * 5.4 * t) * Math.exp(-t * 10)) *
    Math.exp(-t * 3.2);
  writeWav(
    "chime.wav",
    render(1.6, (t) => {
      const a = bell(t, 1318.5);
      const b = t > 0.09 ? bell(t - 0.09, 1975.5) : 0;
      return (a * 0.22 + b * 0.18) * Math.min(1, t / 0.004);
    }),
  );
}

// Pad: calm, slowly breathing Dmaj9 bed under the whole video.
{
  const dur = 20.5;
  const notes = [73.42, 146.83, 220.0, 277.18, 329.63, 440.0];
  writeWav(
    "pad.wav",
    render(dur, (t) => {
      let s = 0;
      notes.forEach((f, k) => {
        const det = 1 + (k % 2 ? 0.0021 : -0.0018);
        const amp = k === 0 ? 0.5 : 0.28 / (1 + k * 0.25);
        const lfo = 0.75 + 0.25 * Math.sin(2 * Math.PI * (0.07 + k * 0.013) * t + k);
        s += (Math.sin(2 * Math.PI * f * t) + Math.sin(2 * Math.PI * f * det * t)) * amp * lfo;
      });
      const fadeIn = Math.min(1, t / 1.8);
      const fadeOut = Math.min(1, (dur - t) / 1.6);
      return s * 0.16 * fadeIn * Math.max(0, fadeOut);
    }),
  );
}

console.log("SFX written to public/sfx");
