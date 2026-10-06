// QA helper: renders stills at given seconds from the bundled project.
// Usage: node scripts/stills.mjs out/qa 1.0 4.0 ...
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const [outDir, ...secs] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = path.resolve("build");
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const composition = await selectComposition({ serveUrl, id: "AliAlhamedMain", browserExecutable });
for (const s of secs) {
  const frame = Math.round(parseFloat(s) * 30);
  const output = path.join(outDir, `f_${String(s).padStart(6, "0")}.jpg`);
  await renderStill({ composition, serveUrl, frame, output, imageFormat: "jpeg", jpegQuality: 85, browserExecutable });
  console.log("still", s, output);
}
