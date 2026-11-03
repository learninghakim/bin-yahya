import type { ReelSpec } from "../system/types";

/**
 * DEMO — a full 30 s Reel using every template, with the placeholder speaker
 * (no raw video needed). Copy this file to start a new video (`npm run new`).
 */
export const demo: ReelSpec = {
  id: "Demo-Reel",
  video: "", // e.g. "raw/2026-11-03_mic-tips.mp4"
  duration: 30,
  progressBar: true,
  showSafeZone: false,
  zooms: [
    { at: 2.8, scale: 1.12 },
    { at: 8, scale: 1 },
    { at: 14.5, scale: 1.15, style: "smooth" },
    { at: 21, scale: 1 },
  ],
  flashes: [2.8, 26],
  scenes: [
    { type: "hook", from: 0, to: 2.8, tag: "انتبه", title: "3 أخطاء تدمّر\nصوت فيديوهاتك", highlight: ["تدمّر"] },
    { type: "lowerThird", from: 3.1, to: 6.5, name: "عبدالله", role: "صانع محتوى تعليمي" },
    { type: "stat", from: 7, to: 11, value: 87, suffix: "%", caption: "يتركون الفيديو\nإذا كان الصوت سيئ", backdrop: "full" },
    { type: "explanation", from: 11.5, to: 15.5, icon: "mic", title: "الخطأ الأول", body: "الميكروفون بعيد عن فمك", highlight: ["بعيد"] },
    { type: "iconPop", from: 16, to: 17.6, icon: "x", tone: "danger", label: "لا تسويها!" },
    {
      type: "points", from: 18, to: 25.5, title: "الحل", bullet: "check",
      items: [
        { text: "ميكروفون لاسلكي على الصدر", at: 0.6 },
        { text: "صوّر في غرفة فيها أثاث", at: 2.6 },
        { text: "اسمع المقطع قبل النشر", at: 4.6 },
      ],
    },
    { type: "cta", from: 26, to: 30, title: "تبي قائمة أفضل المايكات؟", label: "اكتب «مايك»", icon: "arrow", subtitle: "وأرسلها لك بالخاص" },
  ],
};
