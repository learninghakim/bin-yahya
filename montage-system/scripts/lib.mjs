// Shared helpers for the workflow scripts.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const RAW_DIR = path.join(ROOT, "public", "raw");

/** Find a local Chrome/Chromium for Remotion (falls back to Remotion's own download). */
export const browserArgs = () => {
  const candidates = [
    process.env.REMOTION_BROWSER,
    ...(existsSync("/opt/pw-browsers")
      ? readdirSync("/opt/pw-browsers")
          .filter((d) => d.startsWith("chromium_headless_shell"))
          .map((d) => `/opt/pw-browsers/${d}/chrome-headless-shell-linux64/chrome-headless-shell`)
      : []),
  ].filter(Boolean);
  const found = candidates.find((c) => existsSync(c));
  return found ? [`--browser-executable=${found}`] : [];
};

/** Resolve a raw video by slug or file name → absolute path. */
export const resolveRaw = (arg) => {
  if (!arg) throw new Error("Pass a slug or file name, e.g. 2026-11-03_mic-tips");
  if (existsSync(arg)) return path.resolve(arg);
  const files = existsSync(RAW_DIR) ? readdirSync(RAW_DIR) : [];
  const hit = files.find((f) => f === arg || f.replace(/\.[^.]+$/, "") === arg);
  if (!hit) throw new Error(`No raw video "${arg}" in public/raw/. Found: ${files.join(", ") || "(empty)"}`);
  return path.join(RAW_DIR, hit);
};

export const slugOf = (file) => path.basename(file).replace(/\.[^.]+$/, "");

export const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { stdio: "inherit", cwd: ROOT, ...opts });
export const capture = (cmd, args) => execFileSync(cmd, args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
