import type { PunchSpec } from "../../styles/punch/types";

// 10r — "Before you spend your first riyal on your project" — PUNCH style (62.3 s after cutting the retake).
// Business advice → the bold kinetic look: chest captions that pop on every chunk, punch-in on every
// sentence, emoji stickers, chapter boxes for the 3 rules, B&W shock windows, flash cuts, a slam.
// The first take of the opening line (raw 0–3.42 s) is cut; it is repeated right after.
// Times are absolute seconds in the EDITED timeline (raw − 3.42).
export const punch_10r: PunchSpec = {
  id: "punch-2026-11-03-10r",
  video: "raw/2026-11-03_10r.mp4",
  captions: { src: "captions/2026-11-03_10r.json" },
  segments: [{ start: 3.42, end: 65.7 }],
  flashes: [15.7, 20.92, 33.66, 49.06, 56.81],
  bw: [{ from: 15.7, to: 18.43 }, { from: 52.83, to: 56.68 }],
  emphasis: {
    ريال: "green", بالمقلوب: "red", ميزانيتك: "yellow", تنصدم: "red", مشوشة: "red", مصغرة: "green",
    مخاطرة: "red", تدفع: "green", مجاملة: "red", ببلاش: "red", الإثبات: "green", حقيقي: "green", مستقبل: "green",
  },
  beats: [
    // HOOK — "قبل ما تمد يدك لجيبك وتصرف أول ريال على مشروعك"
    { from: 0, to: 3.28, kind: "title", words: [{ text: "قبل", at: 0.1 }, { text: "تصرف", at: 1.38 }, { text: "أول", at: 1.78 }, { text: "ريال", at: 2.1 }] },
    { from: 1.88, to: 3.28, kind: "emoji", emoji: "💸", at: 2.1, side: "left" },
    // "ركز معي في هذه الثلاث الخطوات"
    { from: 4.03, to: 5.38, kind: "number", value: 3, at: 4.17, tone: "yellow", label: { text: "خطوات", at: 4.73 } },
    // "أغلب المشاريع وللأسف تبدأ بالمقلوب"
    { from: 7.28, to: 8.23, kind: "emoji", emoji: "🙃", at: 7.41, side: "right" },
    // "تصمم شعار فخم، تفتح لها حساب، وتجهز منتج كامل"
    { from: 8.53, to: 10.23, kind: "emoji", emoji: "🎨", at: 8.63, side: "left" },
    { from: 10.2, to: 11.43, kind: "emoji", emoji: "📱", at: 10.3, side: "right" },
    { from: 11.37, to: 13.08, kind: "emoji", emoji: "📦", at: 11.47, side: "left" },
    // "وبعدما تحط كل ميزانيتك على هذا المشروع"
    { from: 13.82, to: 15.63, kind: "emoji", emoji: "💰", at: 13.92, side: "right" },
    // "تنصدم إن السوق ما يحتاج لهذا المنتج أصلاً" — B&W + flash
    { from: 15.68, to: 18.38, kind: "emoji", emoji: "😱", at: 15.7, side: "left" },
    // "عشان تحمي نفسك طبق هذه القواعد"
    { from: 18.64, to: 20.78, kind: "emoji", emoji: "🛡️", at: 18.74, side: "right" },
    // RULE 1 — "أولاً لخص مشروعك في سطر واحد" (chapter header stays while he explains)
    { from: 20.92, to: 33.53, kind: "title", n: 1, words: [{ text: "لخّص", at: 21.57 }, { text: "مشروعك", at: 21.84 }, { text: "في", at: 22.52 }, { text: "سطر", at: 22.64 }, { text: "واحد", at: 22.94 }] },
    { from: 22.84, to: 24.58, kind: "emoji", emoji: "✍️", at: 22.94, side: "left", y: 520 },
    { from: 27.68, to: 29.58, kind: "emoji", emoji: "🤔", at: 27.78, side: "right", y: 520 },
    { from: 31.16, to: 33.48, kind: "emoji", emoji: "😵‍💫", at: 31.26, side: "left", y: 520 },
    // RULE 2 — "ثانياً الكلام وحده ما يكفي، ضروري تكون عندك نسخة مصغرة تقدر تبيعها"
    { from: 33.66, to: 48.98, kind: "title", n: 2, words: [{ text: "سوّي", at: 35.82 }, { text: "نسخة", at: 36.81 }, { text: "مصغّرة", at: 37.11 }, { text: "تبيعها", at: 38.06 }] },
    { from: 38.75, to: 40.23, kind: "emoji", emoji: "🧪", at: 38.85, side: "left", y: 520 },
    { from: 40.21, to: 41.73, kind: "emoji", emoji: "🤝", at: 40.31, side: "right", y: 520 },
    { from: 41.71, to: 43.78, kind: "emoji", emoji: "💻", at: 41.81, side: "left", y: 520 },
    { from: 48.13, to: 48.98, kind: "emoji", emoji: "🛡️", at: 48.23, side: "right", y: 520 },
    // RULE 3 — "أما الخطوة الثالثة فخلي الناس تدفع ولو مبلغ بسيط"
    { from: 49.06, to: 56.68, kind: "title", n: 3, words: [{ text: "خلّ", at: 50.44 }, { text: "الناس", at: 50.67 }, { text: "تدفع", at: 51.09 }] },
    { from: 51.73, to: 52.78, kind: "emoji", emoji: "💵", at: 51.83, side: "left", y: 520 },
    // "عبارة والله فكرتك ممتازة — هذه مجاملة ببلاش" — B&W
    { from: 55.24, to: 56.68, kind: "emoji", emoji: "🙄", at: 55.34, side: "right", y: 520 },
    // "الدفع الفعلي من جيب العميل…" — slam
    { from: 56.73, to: 58.53, kind: "slam", emoji: "💳", words: [{ text: "الدفع", at: 56.81 }, { text: "الفعلي", at: 57.1 }], tone: "green" },
    // "…هو الإثبات الوحيد إنه مشروعك حقيقي وله مستقبل في السوق"
    { from: 60.27, to: 62.28, kind: "emoji", emoji: "✅", at: 60.37, side: "left", y: 520 },
  ],
};
