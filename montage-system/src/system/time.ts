import { useVideoConfig } from "remotion";

/** Seconds → frames. All timing in specs is written in seconds. */
export const sec = (s: number, fps: number) => Math.round(s * fps);

export const useSec = () => {
  const { fps } = useVideoConfig();
  return (s: number) => sec(s, fps);
};

/** True if the string contains Arabic/Hebrew characters → render RTL. */
export const isRTL = (text: string) => /[֐-ࣿ]/.test(text);
