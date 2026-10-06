import React from "react";
import { theme } from "../theme";

// Minimal geometric outline icons (24×24 grid), drawn in theme colours.
export type IconName =
  | "house"
  | "building"
  | "wallet"
  | "bank"
  | "percent"
  | "wrench"
  | "handshake"
  | "calendar"
  | "family"
  | "pin"
  | "document"
  | "chart"
  | "key"
  | "check"
  | "x"
  | "question"
  | "coins"
  | "user"
  | "users"
  | "shield"
  | "growth"
  | "heart";

const P: Record<IconName, React.ReactNode> = {
  house: (
    <>
      <path d="M3 11.2 12 4l9 7.2" />
      <path d="M5.5 9.4V20h13V9.4" />
      <path d="M10 20v-5.5h4V20" />
    </>
  ),
  building: (
    <>
      <rect x="5" y="3" width="9" height="18" rx="0.6" />
      <path d="M14 9h5v12h-5" />
      <path d="M8 7h3M8 10.5h3M8 14h3M16.5 13h0.01M16.5 16.5h0.01" />
      <path d="M8.5 21v-3h2v3" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 7.5h14.5a1.5 1.5 0 0 1 1.5 1.5v9.5a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 18.5z" />
      <path d="M4 7.5 15.5 4v3.5" />
      <path d="M20 12h-4a1.5 1.5 0 0 0 0 3h4" />
    </>
  ),
  bank: (
    <>
      <path d="M3 9.5 12 4l9 5.5" />
      <path d="M4 9.5h16" />
      <path d="M6 12v6M10 12v6M14 12v6M18 12v6" />
      <path d="M3.5 20.5h17" />
    </>
  ),
  percent: (
    <>
      <path d="M19 5 5 19" />
      <circle cx="7" cy="7" r="2.4" />
      <circle cx="17" cy="17" r="2.4" />
    </>
  ),
  wrench: (
    <path d="M14.5 6.2a4 4 0 0 0 4.9 5.2l-8.9 8.9a2.1 2.1 0 0 1-3-3l8.9-8.9a4 4 0 0 0-5.2-4.9l2.6 2.6-.6 2.3-2.3.6z" />
  ),
  handshake: (
    <>
      <path d="M2.5 10.5 6 7l3 1.2" />
      <path d="M21.5 10.5 18 7l-4.5 1.5-3.6 3a1.3 1.3 0 0 0 1.8 1.9l2.3-1.6" />
      <path d="M6 7v7.5l4.5 4a1.4 1.4 0 0 0 2-.1l4.6-4.9" />
      <path d="M18 7v7.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.6" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </>
  ),
  family: (
    <>
      <circle cx="7.5" cy="6.5" r="2.3" />
      <circle cx="16.5" cy="6.5" r="2.3" />
      <circle cx="12" cy="12.6" r="1.8" />
      <path d="M3.5 19v-4.5a4 4 0 0 1 6.6-3" />
      <path d="M20.5 19v-4.5a4 4 0 0 0-6.6-3" />
      <path d="M9.2 20v-2a2.8 2.8 0 0 1 5.6 0v2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.8" r="2.4" />
    </>
  ),
  document: (
    <>
      <path d="M6 3h8.5L19 7.5V21H6z" />
      <path d="M14 3v5h5" />
      <path d="M9 12h7M9 15.5h7M9 9h3" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20h16" />
      <path d="M6.5 16.5v-4M11 16.5V9M15.5 16.5v-6M20 16.5V5" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="12" r="4" />
      <path d="M12 12h9M18 12v3M21 12v2.2" />
    </>
  ),
  check: <path d="M5 12.5 10 17.5 19.5 7" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  question: (
    <>
      <path d="M9 9.2a3 3 0 1 1 4.3 2.7c-.9.4-1.3 1.1-1.3 2v.8" />
      <path d="M12 18h0.01" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="9" cy="7" rx="5.5" ry="2.5" />
      <path d="M3.5 7v4c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5V7" />
      <path d="M9.5 15.4c.9 1.2 3 2.1 5.5 2.1 3 0 5.5-1.1 5.5-2.5v-4c0-1.2-1.8-2.2-4.3-2.4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.2" r="3.2" />
      <path d="M2.8 20a6.2 6.2 0 0 1 12.4 0" />
      <path d="M15.5 5.3a3.1 3.1 0 0 1 0 5.9M17.7 13.9a6.2 6.2 0 0 1 3.5 6.1" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 19.5 6v5.6c0 4.6-3.2 8.2-7.5 9.4-4.3-1.2-7.5-4.8-7.5-9.4V6z" />
      <path d="M8.8 12.2 11 14.4l4.3-4.4" />
    </>
  ),
  growth: (
    <>
      <path d="M3.5 18.5 9 13l3.5 3.5 8-8.5" />
      <path d="M15 8h5.5v5.5" />
    </>
  ),
  heart: (
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" />
  ),
};

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  stroke?: number;
  glow?: boolean;
  style?: React.CSSProperties;
}> = ({ name, size = 48, color = theme.colors.text, stroke = 1.7, glow, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      display: "block",
      filter: glow ? `drop-shadow(0 0 ${size * 0.18}px ${theme.colors.glow})` : undefined,
      ...style,
    }}
  >
    {P[name]}
  </svg>
);
