import type { CinemaSpec } from "../../styles/cinema/types";

// 11r v2 — "Learning styles are a myth" — CINEMA (documentary essay) style.
// Fixes from v1 (Paper): no empty cards before their words, no paper box covering the chest the whole time
// (type floats on a soft shade and leaves long stretches of face), captions fully readable (no dimmed words,
// sentence-safe chunks), no stamp repeating the caption, a richer non-grey grade.
export const cinema_11r: CinemaSpec = {
  id: "cinema-2026-11-03-11r",
  video: "raw/2026-11-03_11r.mp4",
  captions: { src: "captions/2026-11-03_11r.json" },
  leaks: [1.0, 20.75, 33.5, 50.05],
  zooms: [
    { at: 1.1, scale: 1.06, style: "smooth", focusY: 0.3 },
    { at: 3.95, scale: 1 },
    { at: 8.3, scale: 1.07, style: "smooth", focusY: 0.3 },
    { at: 12.0, scale: 1 },
    { at: 33.56, scale: 1.1, style: "smooth", focusY: 0.3 },
    { at: 37.5, scale: 1 },
  ],
  beats: [
    // HOOK — "هذه للأسف كذبة تعليمية قيدت عقولنا وصدقناها"
    { from: 0.05, to: 3.9, kind: "quote", size: 128, words: [{ text: "كذبة", at: 1.12 }, { text: "تعليمية", at: 1.29 }], highlight: ["كذبة"] },
    // "مقسمين لأنماط: سمعي وبصري وحركي"
    { from: 5.3, to: 8.05, kind: "triptych", items: [{ icon: "ear", label: "سمعي", at: 6.19 }, { icon: "eye", label: "بصري", at: 6.5 }, { icon: "hand", label: "حركي", at: 7.19 }] },
    // "هذه تسمعها في المدارس وفي دورات تطوير الذات"
    { from: 12.1, to: 15.45, kind: "lower", title: { text: "المدارس", at: 13.07 }, sub: { text: "ودورات تطوير الذات", at: 14.04 } },
    // "على أنها حقيقة علمية مقدسة"
    { from: 17.6, to: 20.7, kind: "quote", words: [{ text: "حقيقة", at: 18.1 }, { text: "علمية", at: 18.66 }, { text: "مقدّسة", at: 19.14 }], highlight: ["مقدّسة"] },
    // "لكن مراجعات علم النفس الإدراكي…"
    { from: 20.82, to: 22.85, kind: "chapter", kicker: "لكن… ماذا يقول", title: [{ text: "علم", at: 21.72 }, { text: "النفس", at: 21.83 }, { text: "الإدراكي", at: 22.22 }] },
    // "تقول إنه ما في ولا بحث علمي يثبت…"
    { from: 22.95, to: 28.6, kind: "evidence", title: { text: "أبحاث تُثبت أنماط التعلّم", at: 23.0 }, from0: 99, value: 0, at: 24.38, label: "ولا بحث واحد" },
    // "لكن ارتياحك ما كان أبداً هو اللي يحدد كيف عقلك يستوعب"
    { from: 28.7, to: 33.45, kind: "strike", word: { text: "ارتياحك", at: 28.92 }, strikeAt: 30.08, into: { text: "ما يحدد كيف تستوعب", at: 30.89 } },
    // the student's inner voice: "أنا سمعي… راح أسمع المحاضرة وخلاص"
    { from: 38.9, to: 43.5, kind: "quote", label: "صوت الطالب", size: 84, words: [{ text: "أنا", at: 39.25 }, { text: "سمعي…", at: 39.64 }, { text: "أسمع", at: 41.25 }, { text: "المحاضرة", at: 41.41 }, { text: "وخلاص", at: 42.09 }], highlight: ["سمعي…"] },
    // "يهرب من الكتابة والاسترجاع وحل المسائل اللي هم أساس تثبيت الروابط في الدماغ"
    {
      from: 44.5, to: 50.0, kind: "triptych", struck: true,
      items: [{ icon: "pen", label: "الكتابة", at: 44.92 }, { icon: "brain", label: "الاسترجاع", at: 45.68 }, { icon: "check", label: "حل المسائل", at: 46.57 }],
      glowAt: 48.08, glowLabel: { text: "أساس تثبيت المعلومة", at: 48.48 },
    },
    // "فتنغلق على نفسك داخل قالب وهمي"
    { from: 50.1, to: 52.98, kind: "iris", closeAt: 51.29, openAt: 52.6, label: { text: "قالب وهمي", at: 51.69 } },
    // "وتترك الأدوات الحقيقية اللي فعلاً تصنع التفوق"
    { from: 53.0, to: 56.0, kind: "end", words: [{ text: "الأدوات", at: 53.05 }, { text: "الحقيقية", at: 53.67 }, { text: "تصنع", at: 54.92 }, { text: "التفوق", at: 55.24 }], highlight: ["التفوق"] },
  ],
};
