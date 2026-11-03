// Synthesizes the "Signal" SFX kit into public/sfx/signal/ (16-bit mono WAV, deterministic).
// Modelled on the reference reel's sound palette (measured from its spectrum):
//   boom   — sub impact: ~200 Hz transient → 35–45 Hz tail, ~0.45 s (full-screen cuts, big-word slams)
//   tick   — soft UI ping at ~2.1 kHz, fast decay (chips, steps, list rows appearing)
//   tick2  — lower ping ~1.57 kHz (alternate, so repeated ticks don't sound robotic)
//   swish  — very soft airy noise sweep (panel in/out)
//   tap    — tiny click (button press)
// Run: node scripts/make-sfx-signal.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const SR = 44100;
const OUT = new URL("../public/sfx/signal/", import.meta.url);
mkdirSync(OUT, { recursive: true });
let seed = 4242;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

const write = (name, s) => {
  const peak = Math.max(...s.map(Math.abs)) || 1;
  const data = Buffer.alloc(s.length * 2);
  s.forEach((v, i) => data.writeInt16LE(Math.round((v / peak) * 0.89 * 32767), i * 2));
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVE", 8); h.write("fmt ", 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write("data", 36); h.writeUInt32LE(data.length, 40);
  writeFileSync(new URL(name, OUT), Buffer.concat([h, data]));
};
const buf = (sec) => new Array(Math.round(sec * SR)).fill(0);

// boom: pitch-dropping sine + short low-passed noise transient
{
  const s = buf(0.6); let ph = 0; let lp = 0;
  for (let i = 0; i < s.length; i++) {
    const t = i / SR;
    const f = 40 + 160 * Math.exp(-t / 0.035);
    ph += (2 * Math.PI * f) / SR;
    const body = Math.sin(ph) * Math.exp(-t / 0.18) * Math.min(1, t / 0.002);
    lp += 0.08 * (rnd() - lp);
    const hit = lp * Math.exp(-t / 0.015) * 2.5;
    s[i] = Math.tanh((body + hit) * 1.6);
  }
  write("boom.wav", s);
}
// pings
const ping = (name, f0, dur = 0.22) => {
  const s = buf(dur);
  for (let i = 0; i < s.length; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.003) * Math.exp(-t / 0.055);
    s[i] = env * (Math.sin(2 * Math.PI * f0 * t) + 0.25 * Math.sin(2 * Math.PI * f0 * 2.01 * t));
  }
  write(name, s);
};
ping("tick.wav", 2100);
ping("tick2.wav", 1570);
// swish: band-passed noise with a rise/fall envelope and moving centre
{
  const s = buf(0.38); let a = 0, b = 0;
  for (let i = 0; i < s.length; i++) {
    const t = i / SR, p = t / 0.38;
    const env = Math.sin(Math.PI * p) ** 2;
    const k = 0.04 + 0.25 * p; // brighter as it moves
    a += k * (rnd() - a); b += k * (a - b);
    s[i] = (a - b) * env;
  }
  write("swish.wav", s);
}
// tap
{
  const s = buf(0.06);
  for (let i = 0; i < s.length; i++) { const t = i / SR; s[i] = (rnd() * 0.5 + Math.sin(2 * Math.PI * 900 * t)) * Math.exp(-t / 0.008); }
  write("tap.wav", s);
}
console.log("signal sfx → public/sfx/signal/");
