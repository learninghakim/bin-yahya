import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// OFL fonts (see public/fonts/signal/LICENSES.txt), bundled so renders never hit the network.
export const signalFontsReady = Promise.all([
  loadFont({ family: "Readex", url: staticFile("fonts/signal/ReadexPro-VF.ttf"), weight: "160 700", display: "block" }),
  loadFont({ family: "Lalezar", url: staticFile("fonts/signal/Lalezar-Regular.ttf"), weight: "400", display: "block" }),
]);
