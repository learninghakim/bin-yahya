// Registry for videos edited in the SIGNAL style (Studio folder "Signal").
import type { SignalSpec } from "../../styles/signal/types";
import { signalDemo } from "./_demo";
import { signalArt } from "./_art";
import { signal_06r } from "./2026-11-03_06r";
// @new-signal-imports

export const signalVideos: SignalSpec[] = [
  signalDemo,
  signalArt,
  signal_06r,
  // @new-signal-entries
];
