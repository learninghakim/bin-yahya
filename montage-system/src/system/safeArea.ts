// Instagram Reels safe zone for 1080×1920.
// Top: account/audio bar. Bottom: caption, username, music ticker.
// Right: like/comment/share/save column. Keep critical text inside SAFE.
export const VIDEO = { width: 1080, height: 1920, fps: 30 } as const;

export const SAFE = {
  top: 250,
  bottom: 420,
  left: 72,
  right: 150, // wider on the right because of the action buttons
} as const;

export const SAFE_WIDTH = VIDEO.width - SAFE.left - SAFE.right; // 858
export const SAFE_HEIGHT = VIDEO.height - SAFE.top - SAFE.bottom; // 1250

/** Vertical anchor points inside the safe zone (px from top). */
export const ANCHOR = {
  top: SAFE.top + 20,
  center: SAFE.top + SAFE_HEIGHT / 2,
  // Lower third of the safe zone: under the speaker's face.
  bottom: VIDEO.height - SAFE.bottom - 40,
} as const;
