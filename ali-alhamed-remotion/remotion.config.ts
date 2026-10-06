import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");
Config.setCrf(18);
Config.setBrowserExecutable("/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell");
