import type { PulseSpec } from "../../styles/pulse/types";

// 08r v2 — "AI raises your homework grades… and fails you in the exam" — PULSE (tech HUD) style.
// Fixes from v1 (Newsroom): no empty cards or "+0%" placeholders (graphics appear WITH their content),
// no text boxes repeating the captions (each idea is drawn: a chart that crashes, a crowd of 1000 dots,
// bars above/below zero, a key press, a sleeping brain vs a busy chip, a countdown, a chat window),
// sentence-safe captions with no dimmed words, one graphic at a time with breathing room between.
export const pulse_08r: PulseSpec = {
  id: "pulse-2026-11-03-08r",
  video: "raw/2026-11-03_08r.mp4",
  captions: { src: "captions/2026-11-03_08r.json" },
  glitches: [3.13, 10.16, 24.45, 36.75, 42.1, 49.72],
  zooms: [
    { at: 3.13, scale: 1.1, focusY: 0.3 },
    { at: 6.55, scale: 1 },
    { at: 10.16, scale: 1.12, focusY: 0.3 },
    { at: 12.2, scale: 1.04, style: "smooth", focusY: 0.3 },
    { at: 14.3, scale: 1 },
    { at: 33.2, scale: 1.08, style: "smooth", focusY: 0.3 },
    { at: 34.85, scale: 1 },
    { at: 57.5, scale: 1.05, style: "smooth", focusY: 0.3 },
    { at: 64.45, scale: 1 },
  ],
  chapters: [
    { from: 36.75, to: 42.05, n: 1, text: "حاول لحالك أولاً" },
    { from: 42.1, to: 49.65, n: 2, text: "تلميح… مو حل" },
    { from: 49.75, to: 57.45, n: 3, text: "بكرة: حلّها من الصفر" },
  ],
  beats: [
    // HOOK — grades line shoots up ("يرفع درجاتك في الواجبات") then crashes on "يدمرك ويرسبك"
    {
      from: 0, to: 6.45, kind: "chart",
      points: [
        { y: 0.2, at: 0.1 },
        { y: 0.55, at: 1.44 },
        { y: 0.88, at: 2.22, label: "الواجبات" },
        { y: 0.08, at: 5.0, label: "الامتحان", bad: true },
      ],
    },
    // "تجربة علمية … على قرابة 1000 طالب رياضيات"
    { from: 7.6, to: 10.1, kind: "crowd", count: 1000, at: 8.64, label: "طالب رياضيات" },
    // "قفزت درجاتهم بنسبة 48% … أداؤهم صار أسوأ بنسبة 17%"
    { from: 15.8, to: 24.35, kind: "bars", bars: [{ label: "الواجبات", value: 48, at: 16.17 }, { label: "الامتحان", value: 17, at: 19.46, down: true }] },
    // "ليش هذا الأمر حصل؟"
    { from: 24.45, to: 26.6, kind: "glyph", text: "؟", at: 24.5 },
    // "أخذوا الحلول جاهزة بضغطة زر"
    { from: 28.4, to: 30.12, kind: "key", key: "Enter", pressAt: 29.61, result: { text: "حل جاهز", at: 29.72 } },
    // "عقلهم كان نايم والذكاء الاصطناعي هو اللي يفكر بديل عنهم"
    { from: 30.2, to: 33.1, kind: "sleep", brainAt: 30.42, chipAt: 32.1, brain: "عقلك نايم", chip: "يفكّر بدالك" },
    // "طبق القواعد التالية"
    { from: 34.95, to: 36.7, kind: "steps", n: 3, at: 35.4, label: "قواعد" },
    // 1 — "اعصر مخك وحاول تحل المسألة ولو لخمس دقائق قبل ما تفتح الشات"
    { from: 37.3, to: 42.0, kind: "timer", minutes: 5, at: 37.6, label: { text: "لحالك", at: 38.5 }, lockAt: 40.75, lock: "الشات" },
    // 2 — "إياك أن تطلب الحل كامل"
    { from: 42.6, to: 45.4, kind: "chat", mode: "blocked", text: "أعطني الحل كامل", at: 42.85, strikeAt: 44.05 },
    // "…اطلب منه يعطيك تلميح يفهمك الفكرة بدون ما يعطيك الجواب النهائي"
    { from: 45.45, to: 49.6, kind: "chat", mode: "typing", tag: "اكتب له كذا", text: "أعطني أصغر تلميح يفهمني الفكرة، بدون الجواب النهائي", at: 45.55, dur: 3.4 },
    // 3 — "ثاني يوم الصباح … حلها لحالك من الصفر بدون ما ترجع للمحادثة"
    { from: 51.4, to: 57.45, kind: "calendar", flipAt: 51.84, today: "اليوم", tomorrow: "بكرة", chips: [{ text: "الصباح", at: 52.1 }, { text: "من الصفر", at: 55.35 }, { text: "بدون شات", at: 56.03 }] },
    // "إذا قدرت تحلها مبروك… وإذا عجزت فأنت مجرد متفرج يخدع نفسه"
    { from: 58.6, to: 64.4, kind: "outcome", items: [{ text: "فهمت فعلاً", at: 58.73, good: true }, { text: "متفرّج", at: 62.92, good: false, icon: "eyeOff" }] },
    // CTA — "احفظ هذا الفيديو وطبق هذه القاعدة"
    { from: 64.5, to: 67.84, kind: "cta", items: [{ icon: "bookmark", text: "احفظ", at: 64.55 }, { icon: "check", text: "طبّق", at: 65.55 }] },
  ],
};
