// npm run render <compositionId> [--client <client-slug>]
// Renders the final MP4 to out/<id>.mp4. Optionally copies it to ../clients/<client>/deliveries/.
// ⚠ Only run when the user explicitly asks for the final render.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { browserArgs, ROOT, run } from "./lib.mjs";

const args = process.argv.slice(2);
const id = args[0];
if (!id) { console.error("Usage: npm run render <compositionId> [--client <slug>]"); process.exit(1); }
const ci = args.indexOf("--client");
const client = ci >= 0 ? args[ci + 1] : undefined;

const out = path.join(ROOT, "out", `${id}.mp4`);
run("npx", ["remotion", "render", "src/index.ts", id, out, "--codec=h264", "--crf=17", "--audio-bitrate=320k", ...browserArgs()]);
console.log(`\nRendered ${path.relative(ROOT, out)}`);

if (client) {
  const dest = path.join(ROOT, "..", "clients", client, "deliveries");
  if (!existsSync(path.dirname(dest))) throw new Error(`clients/${client} does not exist`);
  mkdirSync(dest, { recursive: true });
  copyFileSync(out, path.join(dest, `${id}.mp4`));
  console.log(`Copied to clients/${client}/deliveries/${id}.mp4`);
}
