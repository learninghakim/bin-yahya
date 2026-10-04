import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts so renders never depend on the network.
// Each subset gets its own family name; theme.fonts stacks them.
const face = (family: string, file: string, weight: string) =>
  loadFont({ family, url: staticFile(`fonts/${file}`), weight, display: "block" });

export const fontsReady = Promise.all([
  face("Cairo", "cairo-arabic.woff2", "400 900"),
  face("CairoLatin", "cairo-latin.woff2", "400 900"),
  face("ReemKufi", "reemkufi-arabic.woff2", "600 700"),
  face("ReemKufiLatin", "reemkufi-latin.woff2", "600 700"),
]);
