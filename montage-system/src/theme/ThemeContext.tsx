import React, { createContext, useContext } from "react";
import { defaultColors, ThemeColors } from "./theme";

const Ctx = createContext<ThemeColors>(defaultColors);

/** Wrap a video with a color override; every component reads it via useColors(). */
export const ThemeProvider: React.FC<{
  colors?: Partial<ThemeColors>;
  children: React.ReactNode;
}> = ({ colors, children }) => (
  <Ctx.Provider value={{ ...defaultColors, ...colors }}>{children}</Ctx.Provider>
);

export const useColors = () => useContext(Ctx);
