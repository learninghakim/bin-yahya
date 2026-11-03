// npm run transcribe <slug> [language]   (language default: ar)
// Word-level transcript of the raw video with whisper.cpp (runs locally, free).
// Output: public/captions/<slug>.json (Remotion Caption[]) + briefs/<slug>.transcript.txt
// First run downloads whisper.cpp + the model into .whisper/ (one time, a few minutes).
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { installWhisperCpp, toCaptions, transcribe } from "@remotion/install-whisper-cpp";
import { spawnSync } from "node:child_process";
import { resolveRaw, ROOT, run, slugOf } from "./lib.mjs";
import { snapCaptions } from "./snap-captions.mjs";

const file = resolveRaw(process.argv[2]);
const language = process.argv[3] ?? "ar";
const model = process.env.WHISPER_MODEL ?? "medium"; // "small" = faster, "large-v3" = best Arabic
const slug = slugOf(file);
const whisperPath = path.join(ROOT, ".whisper");
const WHISPER_VERSION = "1.7.6";

await installWhisperCpp({ to: whisperPath, version: WHISPER_VERSION });
// Model download goes through curl (Node's fetch ignores HTTPS_PROXY in cloud sandboxes).
const modelFile = path.join(whisperPath, `ggml-${model}.bin`);
if (!existsSync(modelFile)) {
  console.log(`Downloading whisper model "${model}"…`);
  const url = `https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-${model}.bin`;
  const r = spawnSync("curl", ["-fL", "--retry", "3", "-o", modelFile + ".part", url], { stdio: "inherit" });
  if (r.status !== 0) {
    spawnSync("rm", ["-f", modelFile + ".part"]);
    console.error(`\n✗ Could not download ${url}\n  If huggingface.co is blocked by the network policy, allow it, or copy ggml-${model}.bin into montage-system/.whisper/ manually.`);
    process.exit(1);
  }
  spawnSync("mv", [modelFile + ".part", modelFile]);
}

const wav = path.join(whisperPath, `${slug}.16k.wav`);
run("ffmpeg", ["-v", "error", "-y", "-i", file, "-ar", "16000", "-ac", "1", wav]);

const output = await transcribe({
  inputPath: wav,
  whisperPath,
  whisperCppVersion: WHISPER_VERSION,
  model,
  language,
  tokenLevelTimestamps: true,
  splitOnWord: true,
});
const { captions } = toCaptions({ whisperCppOutput: output });

mkdirSync(path.join(ROOT, "public", "captions"), { recursive: true });
const capFile = path.join(ROOT, "public", "captions", `${slug}.json`);
writeFileSync(capFile, JSON.stringify(captions, null, 1));
console.log(`snapped ${snapCaptions(file, capFile)} word starts to the audio`);

// Human-readable transcript with timestamps — used to time the scenes.
const lines = [];
let line = { start: 0, text: "" };
for (const c of captions) {
  if (!line.text) line.start = c.startMs / 1000;
  line.text += c.text;
  if (/[.!?؟،,]$/.test(c.text.trim()) || line.text.length > 60) {
    lines.push(`[${line.start.toFixed(2)}] ${line.text.trim()}`);
    line = { start: 0, text: "" };
  }
}
if (line.text) lines.push(`[${line.start.toFixed(2)}] ${line.text.trim()}`);
writeFileSync(path.join(ROOT, "briefs", `${slug}.transcript.txt`), lines.join("\n") + "\n");
console.log(`\n${captions.length} words → public/captions/${slug}.json, briefs/${slug}.transcript.txt`);
