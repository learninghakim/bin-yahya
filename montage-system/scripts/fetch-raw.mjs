// npm run fetch-raw <release-tag>
// Downloads every video attached to a GitHub Release into public/raw/.
// Large raw files (>25MB) are uploaded as Release assets, not committed to git.
import { mkdirSync } from "node:fs";
import path from "node:path";
import { capture, RAW_DIR, run } from "./lib.mjs";

const REPO = process.env.RAW_REPO ?? "learninghakim/bin-yahya";
const tag = process.argv[2];
if (!tag) { console.error("Usage: npm run fetch-raw <release-tag>"); process.exit(1); }

const rel = JSON.parse(capture("curl", ["-fsSL", `https://api.github.com/repos/${REPO}/releases/tags/${encodeURIComponent(tag)}`]));
const assets = rel.assets.filter((a) => /\.(mp4|mov|m4v|mkv|webm)$/i.test(a.name));
if (!assets.length) { console.error(`No video assets in release "${tag}"`); process.exit(1); }
mkdirSync(RAW_DIR, { recursive: true });
for (const a of assets) {
  const dest = path.join(RAW_DIR, a.name);
  console.log(`↓ ${a.name} (${(a.size / 1e6).toFixed(1)} MB)`);
  run("curl", ["-fL", "--retry", "3", "-o", dest, a.browser_download_url]);
}
console.log(`Saved to public/raw/`);
