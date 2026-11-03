import type { ReelSpec } from "../system/types";

// Brief: briefs/2026-11-03_06r.md — book "Make It Stick", 74 s (kept full length at the user's request).
// Transcript: briefs/2026-11-03_06r.transcript.txt. No segments: speech is continuous, raw time = edited time.
// Layout: the face fills the upper half, so every overlay sits at the bottom; captions carry the gaps.
export const v_2026_11_03_06r: ReelSpec = {
  id: "reel-2026-11-03-06r",
  video: "raw/2026-11-03_06r.mp4",
  progressBar: true,
  captions: { src: "captions/2026-11-03_06r.json" },
  // Punch-ins on sentence starts (jump-cut energy without cutting speech).
  zooms: [
    { at: 2.42, scale: 1.1, focusY: 0.3 }, // "تعال خلينا أصدمك"
    { at: 5.18, scale: 1 },
    { at: 9.63, scale: 1.1, focusY: 0.3 }, // "الكتاب اسمه"
    { at: 15.18, scale: 1 },
    { at: 19.6, scale: 1.16, style: "smooth", focusY: 0.3 }, // push in on "أضعف طريقة"
    { at: 24.32, scale: 1 },
    { at: 32.54, scale: 1.12, focusY: 0.3 }, // "لكن بعدما قرأت"
    { at: 35.26, scale: 1 },
    { at: 48.22, scale: 1.1, focusY: 0.3 },
    { at: 51.15, scale: 1.18, style: "smooth", focusY: 0.3 }, // "قاعدة الصعوبة المفيدة"
    { at: 55.36, scale: 1 },
    { at: 62.11, scale: 1.12, focusY: 0.3 },
    { at: 68.12, scale: 1 }, // CTA
  ],
  flashes: [19.6, 35.2, 51.1],
  scenes: [
    {
      type: "hook", from: 0, to: 3.2, placement: "bottom",
      tag: "انتبه", title: "مذاكرتك سهلة\nومريحة؟", highlight: ["سهلة"],
    },
    {
      type: "explanation", from: 5.2, to: 9.0, icon: "warning",
      title: "أكبر خدعة", body: "المذاكرة اللي ما تتعبك\nخدعة من عقلك", highlight: ["خدعة"],
    },
    {
      type: "explanation", from: 10.2, to: 15.0, icon: "book",
      title: "Make It Stick", body: "ألّفه 3 من كبار باحثي\nعلم التعلّم والإدراك", highlight: ["3"],
    },
    {
      type: "hook", from: 19.6, to: 24.2, placement: "bottom",
      tag: "الفكرة الصادمة", title: "المذاكرة السهلة\nأضعف طريقة للحفظ", highlight: ["أضعف"],
    },
    {
      type: "points", from: 26.0, to: 32.4, title: "قبل الكتاب", bullet: "icon", tone: "danger",
      items: [
        { text: "أفتح الملخصات", icon: "x", at: 0.8 },
        { text: "أظلّل بالقلم", icon: "x", at: 1.9 },
        { text: "أعيد القراءة", icon: "x", at: 2.9 },
        { text: "وأوهم نفسي إني فاهم", icon: "x", at: 4.3 },
      ],
    },
    {
      type: "points", from: 35.2, to: 47.9, title: "بعد الكتاب", bullet: "check", tone: "success",
      items: [
        { text: "أقرأ ثم أغلق الكتاب", at: 0.8 },
        { text: "أسترجع من الذاكرة", at: 3.2 },
        { text: "أباعد بين أيام المراجعة", at: 7.4 },
        { text: "أخلط أنماط مختلفة", at: 9.2 },
      ],
    },
    {
      type: "hook", from: 51.1, to: 55.2, placement: "bottom", mode: "char",
      tag: "القاعدة", title: "الصعوبة المفيدة", highlight: ["المفيدة"],
    },
    {
      type: "iconPop", from: 59.3, to: 62.0, placement: "bottom", backdrop: "scrim",
      icon: "x", tone: "danger", label: "مش ضعف فيك",
    },
    {
      type: "explanation", from: 64.9, to: 68.0, icon: "bulb",
      title: "روابط عصبية قوية", body: "ما تنساها طول عمرك", highlight: ["عمرك"],
    },
    {
      type: "cta", from: 68.1, to: 74.05,
      title: "أساليب تعلّم فعّالة\nكل فترة", label: "تابع الحساب", icon: "arrow",
    },
  ],
};
