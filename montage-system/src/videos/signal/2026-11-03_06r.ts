import type { SignalSpec } from "../../styles/signal/types";

// Make It Stick — re-edit in the SIGNAL style (74 s, full length).
// v2: no big text blocks — every idea is SHOWN with an illustrative motion graphic (styles/signal/art.tsx);
// the captions at the bottom carry every spoken word.
// Times are absolute seconds from public/captions/2026-11-03_06r.json.
export const signal_06r: SignalSpec = {
  id: "signal-2026-11-03-06r",
  video: "raw/2026-11-03_06r.mp4",
  captions: { src: "captions/2026-11-03_06r.json" },
  zooms: [
    { at: 2.42, scale: 1.06, style: "smooth", focusY: 0.3 }, // slow push-in through "تعال خلينا" (riser)
    { at: 3.28, scale: 1.14, focusY: 0.3 }, // snap on "أصدمك"
    { at: 5.19, scale: 1 },
    { at: 15.18, scale: 1.06, style: "smooth", focusY: 0.3 }, // "فكرته الصادمة" — face only, captions carry it
    { at: 17.0, scale: 1 },
    { at: 24.32, scale: 1.06, style: "smooth", focusY: 0.3 }, // "أنا شخصياً"
    { at: 26.3, scale: 1 },
    { at: 48.22, scale: 1.12, focusY: 0.3 }, // "لكن أكثر شي أعجبني" — face only
    { at: 50.95, scale: 1 },
  ],
  beats: [
    // HOOK 0–5.1 (viral "you're doing it wrong"): camera punch + flash on frame 0, ✓ "سهلة" / ✓ "مريحة" stamp on
    // as he says them, a riser builds through "تعال خلينا", and on "أصدمك" the badges shatter, a red ✗ slams in,
    // the frame shakes (glitch + hit + boom). Shards are gone by "هذا الكتاب أثبت".
    {
      from: 0, to: 4.6, kind: "art", y: 1100,
      art: { type: "hookShatter", punchAt: 0, checks: [{ text: "سهلة", at: 1.34 }, { text: "مريحة", at: 1.67 }], shatterAt: 3.28 },
    },
    // "المذاكرة اللي ما تتعبك هي أكبر خدعة يخدعك فيها عقلك" — 'understood' bar fills, then glitches and collapses
    { from: 5.2, to: 9.0, kind: "art", art: { type: "illusion", fillAt: 5.4, trickAt: 7.42, full: "فاهم", trick: "خدعة" } },
    // "الكتاب اسمه Make It Stick ألّفه ثلاثة من كبار باحثي علم التعلم والإدراك" — the book opens, 3 researchers
    {
      from: 9.0, to: 15.15, kind: "art", stage: true,
      art: { type: "book", title: "Make It Stick", openAt: 10.3, peopleAt: 11.75, chips: [
        { text: "علم التعلّم", at: 13.35, icon: "brain" },
        { text: "الإدراك", at: 14.31, icon: "bulb" },
      ] },
    },
    // "كل طريقة مذاكرة تحسها سهلة … أضعف طريقة لتثبيت المعلومة على المدى البعيد" — feeling vs real retention
    {
      from: 17.0, to: 24.2, kind: "art",
      art: { type: "curve", feelAt: 18.25, realAt: 21.5, longAt: 23.55, feel: "إحساسك", real: "اللي يبقى فعلاً", xLabel: "الوقت", yLabel: "الحفظ" },
    },
    // "أفتح الملخصات وأظلل بالقلم وأعيد القراءة ثم أوهم نفسي أني فاهم" — then "لكن" cracks the illusion
    { from: 26.3, to: 33.0, kind: "art", art: { type: "habits", pageAt: 26.8, highlightAt: 27.88, rereadAt: 28.87, illusionAt: 31.49, crackAt: 32.54, bubble: "فاهم!" } },
    // "بعدما قرأت هذا الكتاب تغير كل شيء" — the switch flips
    { from: 33.0, to: 35.25, kind: "art", art: { type: "toggle", flipAt: 34.07, off: "قبل", on: "بعد" } },
    // The new method — a path lights each station as it is said
    {
      from: 35.3, to: 47.75, kind: "art",
      art: { type: "journey", stops: [
        { label: "اقرأ", icon: "book", at: 35.99 },
        { label: "أغلق", icon: "eyeOff", at: 37.28 },
        { label: "استرجع", icon: "brain", at: 39.21 },
        { label: "باعد", icon: "calendar", at: 42.61 },
        { label: "اخلط", icon: "shuffle", at: 44.41 },
      ] },
    },
    // "قاعدة الصعوبة المفيدة … الثقل والمجهود … تعصر مخك" — reps, effort, squeezed brain
    {
      from: 50.95, to: 58.0, kind: "art", stage: true, highlight: ["المفيدة"],
      title: [{ text: "الصعوبة", at: 51.69 }, { text: "المفيدة", at: 52.36 }],
      art: { type: "barbell", liftAt: 53.79, squeezeAt: 56.12 },
    },
    // "مش علامة ضعف … اللحظة اللي عقلك يبني فيها روابط عصبية قوية" — 'weakness?' crossed out, the brain wires up
    { from: 58.1, to: 68.1, kind: "art", art: { type: "brain", weakAt: 59.39, crossAt: 61.26, buildAt: 62.11, strongAt: 65.91, weak: "ضعف؟" } },
    // CTA — "تابع الحساب لأنه كل فترة راح أشارك معك…"
    { from: 68.12, to: 74.05, kind: "art", art: { type: "follow", tapAt: 68.6, bellAt: 70.04, button: "متابعة", done: "متابَع" } },
  ],
};
