import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled locally so renders never depend on the network.
const face = (family: string, file: string) =>
  loadFont({ family, url: staticFile(`fonts/${file}`), weight: "400 900", display: "block" });

export const fontsReady = Promise.all([
  face("Cairo", "cairo-arabic.woff2"),
  face("CairoLatin", "cairo-latin.woff2"),
]);
