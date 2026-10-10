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
  // Editorial pair for talking-head reels: Noto Kufi (headlines) + IBM Plex Sans Arabic (captions). OFL.
  face("NotoKufi", "noto-kufi-arabic-arabic-800-normal.woff2", "800"),
  face("NotoKufi", "noto-kufi-arabic-arabic-900-normal.woff2", "900"),
  face("NotoKufiLatin", "noto-kufi-arabic-latin-800-normal.woff2", "800 900"),
  face("PlexArabic", "ibm-plex-sans-arabic-arabic-500-normal.woff2", "500"),
  face("PlexArabic", "ibm-plex-sans-arabic-arabic-600-normal.woff2", "600"),
  face("PlexArabicLatin", "ibm-plex-sans-arabic-latin-600-normal.woff2", "500 600"),
]);
