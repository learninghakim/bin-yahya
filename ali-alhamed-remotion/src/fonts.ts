// Local fonts (no network at render time): Cairo for headlines/numbers, Tajawal for details.
import "@fontsource/cairo/500.css";
import "@fontsource/cairo/600.css";
import "@fontsource/cairo/700.css";
import "@fontsource/cairo/800.css";
import "@fontsource/cairo/900.css";
import "@fontsource/tajawal/500.css";
import "@fontsource/tajawal/700.css";
import { continueRender, delayRender } from "remotion";

const handle = delayRender("Loading Cairo / Tajawal");
const weights = ["500", "600", "700", "800", "900"];
Promise.all([
  ...weights.map((w) => document.fonts.load(`${w} 40px Cairo`, "عربي 0123")),
  document.fonts.load(`500 40px Tajawal`, "عربي"),
  document.fonts.load(`700 40px Tajawal`, "عربي"),
])
  .then(() => continueRender(handle))
  .catch(() => continueRender(handle));
