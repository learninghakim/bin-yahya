import type { NewsSpec } from "../../styles/news/types";

// 08r — "AI raises your homework grades… and fails you in the exam" — NEWSROOM style (67.8 s, full length).
// A study-driven story → broadcast treatment: live bug + ticker, breaking bars, a counting +48% and a
// race between homework (+48%) and exam (−17%), three numbered rules, a typed prompt, verdict stamps.
// Times are absolute seconds from public/captions/2026-11-03_08r.json.
export const news_08r: NewsSpec = {
  id: "news-2026-11-03-08r",
  video: "raw/2026-11-03_08r.mp4",
  captions: { src: "captions/2026-11-03_08r.json" },
  bug: "الذكاء الاصطناعي والمذاكرة",
  ticker: ["تجربة على قرابة 1000 طالب رياضيات", "+48% في الواجبات", "−17% في الامتحان", "القاعدة: اطلب تلميح لا حل"],
  flashes: [3.13, 18.0, 49.72],
  zooms: [
    { at: 3.13, scale: 1.12, focusY: 0.3 }, // "لكن" — the turn
    { at: 6.55, scale: 1 },
    { at: 10.16, scale: 1.08, style: "smooth", focusY: 0.3 }, // "كشفت مفارقة مرعبة"
    { at: 12.0, scale: 1 },
    { at: 26.03, scale: 1.1, focusY: 0.3 }, // "لأنهم…"
    { at: 30.0, scale: 1 },
    { at: 36.8, scale: 1.06, style: "smooth", focusY: 0.3 },
    { at: 42.14, scale: 1.12, focusY: 0.3 }, // "ثانياً إياك"
    { at: 45.45, scale: 1 },
    { at: 49.76, scale: 1.1, focusY: 0.3 }, // "ثالثاً… الأهم"
    { at: 57.5, scale: 1 },
    { at: 60.84, scale: 1.14, focusY: 0.3 }, // "وإذا عجزت"
    { at: 64.5, scale: 1 },
  ],
  beats: [
    // HOOK — breaking bar: "الذكاء الاصطناعي ممكن يرفع درجاتك"
    { from: 0, to: 3.1, kind: "breaking", tag: "عاجل", headline: [{ text: "الذكاء", at: 0.03 }, { text: "الاصطناعي", at: 0.52 }, { text: "يرفع", at: 1.44 }, { text: "درجاتك", at: 1.68 }], highlight: ["يرفع"] },
    // "لكن في نفس اللحظة ممكن يدمرك ويرسبك" — full-screen turn
    { from: 3.15, to: 6.5, kind: "stage", kicker: { text: "لكن", at: 3.15 }, lines: [{ text: "يدمّرك", at: 4.58 }, { text: "ويرسّبك", at: 5.0 }], highlight: ["ويرسّبك"] },
    // "في تجربة علمية … على قرابة 1000 طالب رياضيات"
    { from: 6.55, to: 10.1, kind: "cite", icon: "book", title: "تجربة علمية", detail: { text: "قرابة 1000 طالب رياضيات", at: 8.64 } },
    // "كشفت مفارقة مرعبة جداً"
    { from: 10.12, to: 12.35, kind: "breaking", tag: "النتيجة", headline: [{ text: "مفارقة", at: 10.52 }, { text: "مرعبة", at: 11.1 }], highlight: ["مرعبة"] },
    // "قفزت درجاتهم بنسبة 48%"
    { from: 14.45, to: 17.95, kind: "stat", value: 48, prefix: "+", suffix: "%", at: 16.17, dir: "up", label: { text: "درجاتهم في الواجبات", at: 15.02 } },
    // "أداؤهم صار أسوأ بنسبة 17% من الطلاب العاديين"
    {
      from: 18.0, to: 24.4, kind: "versus", title: "مستخدمو الذكاء الاصطناعي",
      bars: [
        { label: "في الواجبات", value: 48, suffix: "%", at: 18.15, tone: "up" },
        { label: "في الامتحان", value: 17, suffix: "%", at: 19.46, tone: "down" },
      ],
    },
    // "ليش هذا الأمر حصل؟"
    { from: 24.45, to: 26.6, kind: "stage", lines: [{ text: "ليش", at: 24.5 }, { text: "هذا", at: 24.81 }, { text: "الأمر", at: 25.13 }, { text: "حصل؟", at: 25.95 }], highlight: ["حصل؟"] },
    // "لأنهم أخذوا الحلول جاهزة بضغطة زر"
    { from: 26.65, to: 30.0, kind: "breaking", tag: "السبب", headline: [{ text: "حلول", at: 27.53 }, { text: "جاهزة", at: 28.58 }, { text: "بضغطة", at: 29.12 }, { text: "زر", at: 29.61 }], highlight: ["زر"] },
    // "عقلهم كان نايم والذكاء الاصطناعي هو اللي يفكر بديل عنهم"
    { from: 30.05, to: 33.1, kind: "verdict", items: [{ text: "عقلك نايم", at: 30.42, good: false }, { text: "الذكاء يفكّر بدالك", at: 32.1, good: false }] },
    // "عشان تخليه يبنيك بدل ما يهدمك طبق القواعد التالية"
    { from: 33.15, to: 36.65, kind: "stage", kicker: { text: "الحل", at: 33.2 }, lines: [{ text: "3", at: 35.0 }, { text: "قواعد", at: 35.4 }], highlight: ["3"] },
    // "أولاً اعصر مخك وحاول تحل المسألة ولو لخمس دقائق قبل ما تفتح الشات"
    { from: 36.75, to: 42.05, kind: "rule", n: 1, icon: "brain", title: { text: "اعصر مخك 5 دقائق", at: 37.6 }, sub: { text: "قبل ما تفتح الشات", at: 40.75 } },
    // "ثانياً إياك أن تطلب الحل كامل بدل من ذلك…"
    { from: 42.1, to: 45.4, kind: "rule", n: 2, icon: "lock", title: { text: "إياك تطلب الحل كامل", at: 42.85 }, sub: { text: "اطلب تلميح بس", at: 44.5 } },
    // "…اطلب منه يعطيك تلميح يفهمك الفكرة بدون ما يعطيك الجواب النهائي"
    { from: 45.45, to: 49.6, kind: "prompt", label: "اكتب له", text: "أعطني أصغر تلميح يفهمني الفكرة بدون ما تعطيني الجواب النهائي", at: 45.6, dur: 3.3 },
    // "ثالثاً وهي الخطوة الأهم: ثاني يوم الصباح … حلها لحالك من الصفر بدون ما ترجع للمحادثة"
    { from: 49.75, to: 57.45, kind: "rule", n: 3, icon: "calendar", title: { text: "ثاني يوم: حلّها من الصفر", at: 51.59 }, sub: { text: "بدون ما ترجع للمحادثة", at: 56.03 } },
    // "إذا قدرت تحلها مبروك… وإذا عجزت فأنت بالأمس مجرد متفرج يخدع نفسه"
    { from: 57.5, to: 64.45, kind: "verdict", items: [{ text: "حلّيتها؟ فهمت فعلاً", at: 58.73, good: true }, { text: "عجزت؟ كنت متفرّج", at: 62.92, good: false }] },
    // CTA — "احفظ هذا الفيديو وطبق هذه القاعدة"
    { from: 64.5, to: 67.84, kind: "cta", items: [{ icon: "bookmark", text: "احفظ", at: 64.55 }, { icon: "check", text: "طبّق", at: 65.55 }] },
  ],
};
