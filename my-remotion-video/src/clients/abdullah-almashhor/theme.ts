// هوية العميل: عبدالله المشهور
// Client brand. Starts from the shared base theme; override colors/fonts here.
import { baseTheme, VIDEO } from "../../shared/theme";

export const theme = {
  ...baseTheme,
  fonts: {
    ...baseTheme.fonts,
    // Client font: Dubai (Bold for headlines, Medium for captions).
    headline: "Dubai, NotoKufi, sans-serif",
    caption: "Dubai, PlexArabic, sans-serif",
  },
} as const;
export { VIDEO };
