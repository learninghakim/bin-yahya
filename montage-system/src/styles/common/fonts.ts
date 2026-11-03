import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// OFL fonts from Google Fonts (public/fonts/styles/LICENSES.txt), bundled so renders never hit the network.
// Arabic + Latin subsets are separate families; stacks list both.
const f = (family: string, file: string, weight: string) => loadFont({ family, url: staticFile(`fonts/styles/${file}`), weight, display: "block" });

export const styleFontsReady = Promise.all([
  f("Changa", "changa-800-ar.woff2", "800"),
  f("ChangaLatin", "changa-800-lat.woff2", "800"),
  f("Marhey", "marhey-ar.woff2", "300 700"),
  f("MarheyLatin", "marhey-lat.woff2", "300 700"),
  f("Plex", "plex-400-ar.woff2", "400"),
  f("Plex", "plex-700-ar.woff2", "700"),
  f("PlexLatin", "plex-400-lat.woff2", "400"),
  f("PlexLatin", "plex-700-lat.woff2", "700"),
]);

export const FONT = {
  punch: "Changa, ChangaLatin, Lalezar, sans-serif",
  paper: "Marhey, MarheyLatin, sans-serif",
  news: "Plex, PlexLatin, sans-serif",
} as const;
