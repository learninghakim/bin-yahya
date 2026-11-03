import type { PaperSpec } from "../../styles/paper/types";

// 11r — "Learning styles are a myth" — PAPER style (56 s, full length).
// A calm myth-busting explainer → notebook treatment: warm near-mono footage, colour only in the paper
// graphics (sticky notes for the three "styles", a research paper stamped "no evidence", a red-pen strike,
// the student's thought bubble, avoided tools flipping ✗ → ✓).
// Times are absolute seconds from public/captions/2026-11-03_11r.json.
export const paper_11r: PaperSpec = {
  id: "paper-2026-11-03-11r",
  video: "raw/2026-11-03_11r.mp4",
  captions: { src: "captions/2026-11-03_11r.json" },
  zooms: [
    { at: 1.1, scale: 1.06, style: "smooth", focusY: 0.3 },
    { at: 3.95, scale: 1 },
    { at: 8.3, scale: 1.05, style: "smooth", focusY: 0.3 },
    { at: 12.1, scale: 1 },
    { at: 20.8, scale: 1.08, style: "smooth", focusY: 0.3 }, // "لكن مراجعات علم النفس…"
    { at: 25.5, scale: 1 },
    { at: 33.56, scale: 1.1, focusY: 0.3 }, // "والمشكلة إن هذا الوهم"
    { at: 37.5, scale: 1 },
    { at: 50.1, scale: 1.06, style: "smooth", focusY: 0.3 },
  ],
  beats: [
    // HOOK — "هذه للأسف كذبة تعليمية قيدت عقولنا وصدقناها"
    { from: 0.05, to: 3.9, kind: "banner", words: [{ text: "كذبة", at: 1.12 }, { text: "تعليمية", at: 1.29 }, { text: "قيّدت", at: 2.23 }, { text: "عقولنا", at: 2.44 }], highlight: ["كذبة"] },
    { from: 0.9, to: 3.9, kind: "stamp", text: "كذبة!", at: 1.12, y: 935 },
    // "فكرة إن البشر مقسمين لأنماط: سمعي وبصري وحركي"
    {
      from: 5.25, to: 8.05, kind: "stickies",
      items: [
        { text: "سمعي", icon: "ear", color: "yellow", at: 6.19 },
        { text: "بصري", icon: "eye", color: "pink", at: 6.5 },
        { text: "حركي", icon: "hand", color: "blue", at: 7.19 },
      ],
    },
    // "وإنك مستحيل تفهم إلا إذا شرحوا لك بنمطك الخاص"
    { from: 8.1, to: 11.95, kind: "note", words: [{ text: "مستحيل", at: 8.36 }, { text: "تفهم", at: 9.07 }, { text: "إلا", at: 9.62 }, { text: "بنمطك", at: 11.0 }], highlight: ["بنمطك"], doodle: { type: "circle", word: "مستحيل", at: 8.7 } },
    // "هذه تسمعها في المدارس وفي دورات تطوير الذات"
    { from: 12.1, to: 15.45, kind: "list", title: { text: "تسمعها في:", at: 12.24 }, items: [{ text: "المدارس", at: 13.07 }, { text: "دورات تطوير الذات", at: 14.04 }] },
    // "الكل يتعامل معها على أنها حقيقة علمية مقدسة ومفروغ منها"
    { from: 17.45, to: 20.75, kind: "note", tilt: 2, words: [{ text: "حقيقة", at: 18.1 }, { text: "علمية", at: 18.66 }, { text: "مقدّسة", at: 19.14 }], highlight: ["مقدّسة"], sub: { text: "ومفروغ منها؟", at: 19.85 }, doodle: { type: "underline", word: "علمية", at: 18.95 } },
    // "لكن مراجعات علم النفس الإدراكي تقول: ما في ولا بحث علمي يثبت…"
    { from: 20.8, to: 28.6, kind: "doc", heading: { text: "علم النفس الإدراكي", at: 21.72 }, stamp: { text: "لا دليل!", at: 24.38 } },
    // "لكن ارتياحك ما كان أبداً هو اللي يحدد كيف عقلك يستوعب"
    { from: 28.7, to: 33.45, kind: "strike", word: { text: "ارتياحك", at: 28.92 }, strikeAt: 30.08, into: { text: "ما يحدد كيف تستوعب", at: 30.89 } },
    // "والمشكلة إن هذا الوهم هو اللي جالس يدمر دراستك"
    { from: 33.5, to: 37.45, kind: "stamp", text: "وهم!", at: 34.59, y: 935 },
    // "تحصل الطالب يقنع نفسه: أنا سمعي… راح أسمع المحاضرة وخلاص أفهم"
    { from: 37.55, to: 43.5, kind: "bubble", who: "الطالب:", text: "أنا سمعي… راح أسمع المحاضرة وخلاص أفهم!", at: 39.25, dur: 3.9 },
    // "يهرب من الكتابة والاسترجاع وحل المسائل — اللي هم أساس تثبيت الروابط في الدماغ"
    {
      from: 43.55, to: 50.0, kind: "list", title: { text: "يهرب من:", at: 44.38 },
      items: [{ text: "الكتابة", at: 44.92, mark: "x" }, { text: "الاسترجاع", at: 45.68, mark: "x" }, { text: "حل المسائل", at: 46.57, mark: "x" }],
      flipAt: 48.08, flipLabel: { text: "= أساس تثبيت المعلومة", at: 48.48 },
    },
    // "فتنغلق على نفسك داخل قالب وهمي"
    { from: 50.1, to: 52.95, kind: "note", tilt: 2, words: [{ text: "قالب", at: 51.69 }, { text: "وهمي", at: 52.48 }], highlight: ["وهمي"], doodle: { type: "circle", word: "قالب", at: 51.9 } },
    // "وتترك الأدوات الحقيقية اللي فعلاً تصنع التفوق"
    { from: 53.0, to: 56.0, kind: "note", words: [{ text: "الأدوات", at: 53.05 }, { text: "الحقيقية", at: 53.67 }, { text: "تصنع", at: 54.92 }, { text: "التفوق", at: 55.24 }], highlight: ["التفوق"], doodle: { type: "star", word: "التفوق", at: 55.3 } },
  ],
};
