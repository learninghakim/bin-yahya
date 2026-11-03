// npm run new <slug>
// Creates briefs/<slug>.md (if missing) + src/videos/<slug>.ts and registers it in src/videos/index.ts.
import { copyFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { RAW_DIR, ROOT } from "./lib.mjs";

const slug = process.argv[2];
if (!slug || !/^[a-z0-9][a-z0-9_-]*$/.test(slug)) {
  console.error("Usage: npm run new <slug>   (lowercase letters, digits, - and _ only)");
  process.exit(1);
}
const raw = existsSync(RAW_DIR) ? readdirSync(RAW_DIR).find((f) => f.replace(/\.[^.]+$/, "") === slug) : undefined;
const id = "reel-" + slug.replace(/_/g, "-");
const varName = "v_" + slug.replace(/[^a-z0-9]/g, "_");

const brief = path.join(ROOT, "briefs", `${slug}.md`);
if (!existsSync(brief)) copyFileSync(path.join(ROOT, "briefs", "_template.md"), brief);

const specFile = path.join(ROOT, "src", "videos", `${slug}.ts`);
if (existsSync(specFile)) {
  console.error(`src/videos/${slug}.ts already exists`);
  process.exit(1);
}
writeFileSync(
  specFile,
  `import type { ReelSpec } from "../system/types";

// Brief: briefs/${slug}.md
export const ${varName}: ReelSpec = {
  id: "${id}",
  video: ${raw ? `"raw/${raw}"` : `"" // TODO: put the file in public/raw/`},
  // segments: [], // from \`npm run probe ${slug}\`
  autoPunchIn: true,
  progressBar: true,
  // captions: { src: "captions/${slug}.json" }, // from \`npm run transcribe ${slug}\`
  scenes: [
    { type: "hook", from: 0, to: 2.5, title: "TODO hook" },
    { type: "cta", from: 25, to: 29, label: "تابعني" },
  ],
};
`,
);

const idx = path.join(ROOT, "src", "videos", "index.ts");
let s = readFileSync(idx, "utf8");
s = s.replace("// @new-video-imports", `import { ${varName} } from "./${slug}";\n// @new-video-imports`);
s = s.replace("  // @new-video-entries", `  ${varName},\n  // @new-video-entries`);
writeFileSync(idx, s);
console.log(`Created briefs/${slug}.md and src/videos/${slug}.ts (composition "${id}")`);
