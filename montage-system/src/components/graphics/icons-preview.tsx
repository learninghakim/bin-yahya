import React from "react";
import { ICONS, IconName } from "./icons";
import { Icon as SvgIcon } from "./Icon";

/** Grid of every available icon with its name — handy reference in the Examples folder. */
export const Icon: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 120px)", gap: 14, direction: "ltr" }}>
    {(Object.keys(ICONS) as IconName[]).map((n) => (
      <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color, fontSize: 18, fontFamily: "monospace" }}>
        <SvgIcon name={n} size={48} color={color} />
        {n}
      </div>
    ))}
  </div>
);
