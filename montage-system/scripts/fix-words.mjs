// npm run fix-words <slug> "<wrong>=<right>" ...   (or a briefs/<slug>.fixes.json map)
// Corrects whisper spelling in public/captions/<slug>.json, keeping timings. Matches whole words
// (punctuation kept). Every replacement is listed so it can be reviewed.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ROOT } from "./lib.mjs";

const [slug, ...pairs] = process.argv.slice(2);
if (!slug) { console.error('Usage: npm run fix-words <slug> "wrong=right" ...'); process.exit(1); }
const capFile = path.join(ROOT, "public", "captions", `${slug}.json`);
const fixFile = path.join(ROOT, "briefs", `${slug}.fixes.json`);
const map = existsSync(fixFile) ? JSON.parse(readFileSync(fixFile, "utf8")) : {};
for (const p of pairs) { const [a, b] = p.split("="); map[a] = b; }
const caps = JSON.parse(readFileSync(capFile, "utf8"));
let n = 0;
for (const c of caps) {
  const m = c.text.match(/^(\s*)(.*?)([.,!?؟،:]*)(\s*)$/);
  const word = m[2];
  if (map[word] !== undefined && map[word] !== word) {
    console.log(`  ${word} → ${map[word]}  @${(c.startMs / 1000).toFixed(2)}`);
    c.text = m[1] + map[word] + m[3] + m[4];
    n++;
  }
}
writeFileSync(capFile, JSON.stringify(caps, null, 1));
writeFileSync(fixFile, JSON.stringify(map, null, 1) + "\n");
console.log(`${n} words fixed in public/captions/${slug}.json (map saved to briefs/${slug}.fixes.json)`);
