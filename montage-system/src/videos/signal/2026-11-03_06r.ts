import type { SignalSpec } from "../../styles/signal/types";

// Make It Stick — re-edit in the SIGNAL style (74 s, full length).
// Times are absolute seconds from public/captions/2026-11-03_06r.json.
// Face fills the top half → panels sit on the chest (y≈900–1380), captions under them (y 1440), every word.
export const signal_06r: SignalSpec = {
  id: "signal-2026-11-03-06r",
  video: "raw/2026-11-03_06r.mp4",
  captions: { src: "captions/2026-11-03_06r.json" },
  zooms: [
    { at: 2.42, scale: 1.08, focusY: 0.3 },
    { at: 5.19, scale: 1 },
    { at: 15.18, scale: 1.05, style: "smooth", focusY: 0.3 },
    { at: 24.32, scale: 1 },
    { at: 48.22, scale: 1.12, focusY: 0.3 }, // video-only moment before the rule
    { at: 50.95, scale: 1 },
    { at: 68.12, scale: 1.05, style: "smooth", focusY: 0.3 },
  ],
  beats: [
    // HOOK — viewfinder + words land on the chest as said
    {
      from: 0, to: 2.4, kind: "hookCam", highlight: ["سهلة"],
      words: [
        { text: "لو", at: 0.04 }, { text: "تحس", at: 0.24 }, { text: "مذاكرتك", at: 0.65 },
        { text: "سهلة", at: 1.34 }, { text: "ومريحة؟", at: 1.67 },
      ],
    },
    // "تعال خلينا أصدمك" — burst
    {
      from: 2.4, to: 5.1, kind: "burst", icon: "zap", at: 2.42, highlight: ["أصدمك"],
      words: [{ text: "خلّني", at: 2.78 }, { text: "أصدمك", at: 3.28 }],
    },
    // "المذاكرة اللي ما تتعبك هي أكبر خدعة يخدعك فيها عقلك"
    {
      from: 5.2, to: 9.0, kind: "panel", label: "خدعة العقل",
      widgets: [{ type: "iconTitle", icon: "warning", tone: "danger", title: "المذاكرة اللي ما تتعبك", at: 5.4, sub: { text: "أكبر خدعة يخدعك فيها عقلك", at: 7.09 } }],
    },
    // STAGE — the book
    {
      from: 9.0, to: 15.15, kind: "stage", icon: "book", label: { text: "الكتاب اسمه", at: 9.63 },
      title: [{ text: "Make", at: 10.3 }, { text: "It", at: 10.51 }, { text: "Stick", at: 10.75 }],
      chips: [
        { text: "3 باحثين", at: 11.75, icon: "user" },
        { text: "علم التعلّم", at: 13.35, icon: "brain" },
        { text: "الإدراك", at: 14.31, icon: "bulb" },
      ],
    },
    // "كل طريقة مذاكرة سهلة وممتعة … أضعف طريقة لتثبيت المعلومة"
    {
      from: 15.2, to: 24.2, kind: "panel", label: "Make It Stick", top: 900,
      widgets: [
        { type: "iconTitle", icon: "zap", title: "الفكرة الصادمة", at: 15.55, sub: { text: "كل مذاكرة سهلة وممتعة…", at: 17.07 } },
        { type: "bars", bars: [
          { label: "مذاكرة سهلة وممتعة", value: 0.94, at: 18.69 },
          { label: "تثبيت المعلومة", value: 0.16, at: 22.14, tone: "danger" },
        ] },
      ],
    },
    // "قبل هذا الكتاب كنت …" — old habits struck out
    {
      from: 24.4, to: 32.6, kind: "panel", label: "قبل الكتاب", top: 880,
      widgets: [{ type: "checklist", rows: [
        { text: "أفتح الملخصات", at: 26.8, mark: "x", icon: "book" },
        { text: "أظلّل بالقلم", at: 27.88, mark: "x", icon: "highlighter" },
        { text: "أعيد القراءة", at: 28.87, mark: "x", icon: "eyeOff" },
        { text: "وأوهم نفسي إني فاهم", at: 30.3, mark: "x", icon: "question" },
      ] }],
    },
    // "لكن بعدما قرأت هذا الكتاب تغيّر كل شيء" — slam above the head
    {
      from: 32.55, to: 35.25, kind: "slam", label: { text: "بعدما قرأت الكتاب", at: 32.78 }, highlight: ["شيء"],
      words: [{ text: "تغيّر", at: 34.07 }, { text: "كل", at: 34.36 }, { text: "شيء", at: 34.51 }],
    },
    // The new method — stepper fills as each step is said
    {
      from: 35.3, to: 47.75, kind: "panel", label: "بعد الكتاب",
      widgets: [{ type: "stepper",
        steps: [
          { label: "اقرأ", at: 35.99 }, { label: "أغلق", at: 37.28 }, { label: "استرجع", at: 39.21 },
          { label: "باعد", at: 42.61 }, { label: "اخلط", at: 44.41 },
        ],
        note: { text: "بدل ما أكرر نفس النمط بالساعات", at: 45.63 },
      }],
    },
    // STAGE — the rule (48.2–50.9 stays on the face with a zoom)
    {
      from: 50.95, to: 58.0, kind: "stage", icon: "dumbbell", label: { text: "أكثر شيء أعجبني", at: 51.0 },
      title: [{ text: "قاعدة", at: 51.15 }, { text: "الصعوبة", at: 51.69 }, { text: "المفيدة", at: 52.36 }], highlight: ["المفيدة"],
      chips: [
        { text: "الثقل", at: 53.79, icon: "dumbbell" },
        { text: "المجهود المزعج", at: 54.26, icon: "zap" },
        { text: "تعصر مخك", at: 56.12, icon: "brain" },
      ],
    },
    // "مش علامة ضعف أو نقص فيك … هو بالضبط اللحظة الحقيقية"
    {
      from: 58.1, to: 63.1, kind: "panel", label: "الحقيقة",
      widgets: [{ type: "reframe", from: { text: "ضعف أو نقص", at: 59.88 }, strikeAt: 61.26, to: { text: "لحظة البناء", at: 62.11 } }],
    },
    // "عقلك جالس يبني فيها روابط عصبية قوية عشان ما تنساها طول عمرك"
    {
      from: 63.0, to: 68.05, kind: "panel", label: "عقلك يبني",
      widgets: [{ type: "links", at: 64.3, strongAt: 65.91, label: { text: "ما تنساها طول عمرك", at: 66.74 } }],
    },
    // CTA
    {
      from: 68.12, to: 74.05, kind: "panel", label: "كل فترة شي جديد",
      widgets: [{ type: "follow", title: "تابع الحساب", tapAt: 68.6, bell: { text: "أساليب تعلّم فعّالة تغيّر دراستك", at: 70.7 } }],
    },
  ],
};
