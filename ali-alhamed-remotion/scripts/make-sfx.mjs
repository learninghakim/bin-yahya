// Synthesizes a small, subtle SFX kit as 16-bit 48kHz mono WAVs into public/sfx/.
// Deterministic (seeded noise), zero downloads. Run: node scripts/make-sfx.mjs
import { writeFileSync, mkdirSync } from "node:fs";

const SR = 48000;
let seed = 1337;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const noise = () => rnd() * 2 - 1;

const writeWav = (name, samples) => {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  let peak = 0;
  for (const s of samples) peak = Math.max(peak, Math.abs(s));
  const norm = peak > 0 ? 0.89 / peak : 1;
  samples.forEach((s, i) => buf.writeInt16LE(Math.round(s * norm * 32767), 44 + i * 2));
  writeFileSync(`public/sfx/${name}.wav`, buf);
};

const gen = (dur, fn) => Array.from({ length: Math.floor(dur * SR) }, (_, i) => fn(i / SR, i));

// One-pole low-pass helper over a whole buffer with time-varying cutoff
const lowpass = (arr, cutoffAt) => {
  let y = 0;
  return arr.map((x, i) => {
    const fc = cutoffAt(i / SR);
    const a = 1 - Math.exp((-2 * Math.PI * fc) / SR);
    y += a * (x - y);
    return y;
  });
};

// Soft whoosh — filtered noise swell, 0.32s
{
  const d = 0.32;
  const raw = gen(d, (t) => noise() * Math.sin(Math.PI * Math.pow(t / d, 0.7)) ** 2);
  writeWav("whoosh", lowpass(raw, (t) => 600 + 4200 * Math.sin(Math.PI * (t / d))));
}

// Digital click — short high blip with fast decay, 0.05s
writeWav(
  "click",
  gen(0.05, (t) => (Math.sin(2 * Math.PI * 2200 * t) * 0.6 + noise() * 0.25) * Math.exp(-t * 140)),
);

// Tick — very short mechanical tick, 0.03s
writeWav(
  "tick",
  gen(0.03, (t) => (Math.sin(2 * Math.PI * 3400 * t) * 0.5 + noise() * 0.5) * Math.exp(-t * 260)),
);

// Soft low impact — sine thump with pitch drop + noise transient, 0.6s
writeWav(
  "impact",
  gen(0.6, (t) => {
    const f = 46 + 70 * Math.exp(-t * 18);
    const body = Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 6.5);
    const click = noise() * Math.exp(-t * 90) * 0.35;
    return body + click;
  }),
);

// Pop — tiny pitch-drop pop for icons/nodes, 0.09s
writeWav(
  "pop",
  gen(0.09, (t) => Math.sin(2 * Math.PI * (900 - 4200 * t) * t) * Math.exp(-t * 45)),
);

// Short riser — filtered noise + rising sine, 0.9s
{
  const d = 0.9;
  const raw = gen(d, (t) => {
    const env = Math.pow(t / d, 2.2) * (t > d - 0.03 ? (d - t) / 0.03 : 1);
    return (noise() * 0.6 + Math.sin(2 * Math.PI * (220 + 700 * (t / d) ** 2) * t) * 0.4) * env;
  });
  writeWav("riser", lowpass(raw, (t) => 400 + 5000 * (t / d)));
}

console.log("SFX written to public/sfx/");
