import React from "react";
import { stagger as S, SpringName } from "../../theme/theme";
import { EnterFrom } from "./motion";
import { Entrance } from "./Entrance";

/**
 * Staggers its children: child i enters at `delay + i * every` frames.
 *
 * @example
 * <Stagger delay={6} every={5} gap={24}>
 *   <Card a /> <Card b /> <Card c />
 * </Stagger>
 */
export const Stagger: React.FC<{
  delay?: number;
  every?: number;
  from?: EnterFrom;
  spring?: SpringName;
  gap?: number; // px — never em around big type
  direction?: "column" | "row";
  align?: React.CSSProperties["alignItems"];
  children: React.ReactNode;
}> = ({ delay = 0, every = S.item, from = "bottom", spring = "smooth", gap = 20, direction = "column", align = "stretch", children }) => (
  <div style={{ display: "flex", flexDirection: direction, gap, alignItems: align }}>
    {React.Children.toArray(children).map((child, i) => (
      <Entrance key={i} delay={delay + i * every} from={from} spring={spring}>
        {child}
      </Entrance>
    ))}
  </div>
);
