import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, springs, stagger, type as T } from "../../theme/theme";
import { useColors } from "../../theme/ThemeContext";
import { isRTL } from "../../system/time";
import { useExit } from "../motion/motion";
import { Icon } from "./Icon";
import { IconName } from "./icons";

export type ListItem = {
  text: string;
  /** Seconds from the START OF THE SCENE when this item appears (sync to speech). */
  at?: number;
  icon?: IconName;
};

/**
 * Animated list of points. Items enter staggered — or exactly when the speaker
 * says them, if each item has `at`. With `focus`, earlier items dim so the eye
 * follows the newest point.
 *
 * @example
 * <StaggerList bullet="number" items={[{ text: "الإضاءة", at: 0.5 }, { text: "الصوت", at: 3 }]} />
 */
export const StaggerList: React.FC<{
  items: ListItem[];
  bullet?: "number" | "check" | "dot" | "icon";
  delay?: number; // frames, used when items have no `at`
  every?: number; // frames between items when no `at`
  size?: number;
  focus?: boolean;
  gap?: number;
}> = ({ items, bullet = "number", delay = 0, every = stagger.item, size = T.body, focus = true, gap = 22 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useColors();
  const x = useExit();
  const rtl = items.some((i) => isRTL(i.text));
  const starts = items.map((it, i) => (it.at !== undefined ? Math.round(it.at * fps) : delay + i * every));
  const newest = starts.reduce((acc, s, i) => (frame >= s ? i : acc), -1);

  return (
    <div dir={rtl ? "rtl" : "ltr"} style={{ display: "flex", flexDirection: "column", gap, width: "100%" }}>
      {items.map((it, i) => {
        const p = spring({ frame: frame - starts[i], fps, config: springs.smooth });
        const bp = spring({ frame: frame - starts[i] - 4, fps, config: springs.bouncy });
        const dim = focus && newest > i ? 0.5 : 1;
        const ex = interpolate(x, [0, 1], [0, 1]);
        const slide = interpolate(p, [0, 1], [rtl ? -60 : 60, 0]) * -1;
        return (
          <div
            key={i}
            style={{
              display: "flex", alignItems: "center", gap: 26, padding: "22px 30px", borderRadius: 28,
              background: c.glass, border: `1.5px solid ${newest === i ? c.accent + "88" : c.glassBorder}`,
              backdropFilter: "blur(16px)", boxShadow: `0 24px 50px -24px ${c.shadow}`,
              opacity: Math.min(p, 1) * (1 - ex) * interpolate(dim, [0.5, 1], [0.55, 1]),
              transform: `translateX(${slide}px) translateY(${-20 * ex}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
            }}
          >
            <div
              style={{
                flex: "0 0 auto", width: size * 1.35, height: size * 1.35, borderRadius: "50%",
                background: bullet === "number" ? c.accent : "transparent", border: bullet === "number" ? "none" : `3px solid ${c.accent}`,
                display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${bp})`,
                fontFamily: fonts.display, fontWeight: 900, fontSize: size * 0.75, color: c.ink,
              }}
            >
              {bullet === "number" ? i + 1 : null}
              {bullet === "check" ? <Icon name="check" size={size * 0.85} color={c.accent} strokeWidth={3} drawAt={starts[i] + 4} /> : null}
              {bullet === "icon" ? <Icon name={it.icon ?? "star"} size={size * 0.8} color={c.accent} drawAt={starts[i] + 4} /> : null}
              {bullet === "dot" ? <div style={{ width: size * 0.4, height: size * 0.4, borderRadius: "50%", background: c.accent }} /> : null}
            </div>
            <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: size, lineHeight: 1.25, color: c.paper }}>{it.text}</div>
          </div>
        );
      })}
    </div>
  );
};
