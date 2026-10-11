// هوية العميل: عبدالله المشهور
// Client brand. Starts from the shared base theme; override colors/fonts here.
import { baseTheme, VIDEO } from "../../shared/theme";

export const theme = {
  ...baseTheme,
  fonts: {
    ...baseTheme.fonts,
    // Client font: Segoe UI (Bold for headlines, Semibold for captions). Files in brand/fonts/segoe-ui.
    headline: "SegoeUI, Dubai, sans-serif",
    caption: "SegoeUI, Dubai, sans-serif",
  },
} as const;
export { VIDEO };
