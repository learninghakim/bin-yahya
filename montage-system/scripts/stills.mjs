// npm run still <compositionId> [seconds...]
// Renders PNG stills for visual checks into out/stills/<id>/ (default: key moments).
import { mkdirSync } from "node:fs";
import path from "node:path";
import { browserArgs, ROOT, run } from "./lib.mjs";

const [id, ...times] = process.argv.slice(2);
if (!id) { console.error("Usage: npm run still <compositionId> [seconds...]"); process.exit(1); }
const dir = path.join(ROOT, "out", "stills", id);
mkdirSync(dir, { recursive: true });

// Default: a spread of key moments for a 25–40 s reel.
const secs = times.length ? times.map(Number) : [0.5, 2, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
for (const s of secs) {
  const frame = Math.round(s * 30);
  run("npx", ["remotion", "still", "src/index.ts", id, path.join(dir, `t${s.toFixed(1).padStart(5, "0")}.png`), `--frame=${frame}`, "--log=error", ...browserArgs()]);
}
console.log(`Stills in out/stills/${id}/`);
