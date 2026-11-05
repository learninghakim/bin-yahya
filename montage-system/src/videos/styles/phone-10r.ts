import type { PhoneSpec } from "../../styles/phone/types";

// 10r v2 — "Before you spend your first riyal on your project" — PHONE (iPhone UI) style.
// Fixes from v1 (Punch): sentence-safe captions (no chunk mixing two sentences), one highlight colour only,
// no washed-out white flashes, no stretches without a visual, no emoji clipped at the frame edge; every idea is a
// phone interface piece that appears WITH its content: payment stopped, a reminder, the dock flipping upside down,
// logo/account/product apps, the budget draining to 0, "0 orders", a Notes pitch that blurs, MVP tiles, demand
// widget, the first real payment, a polite "great idea!" worth 0, and the payment proof.
// The retake of the opening line (raw 0–3.42 s) is cut. Times are EDITED seconds (raw − 3.42).
export const phone_10r: PhoneSpec = {
  id: "phone-2026-11-03-10r",
  video: "raw/2026-11-03_10r.mp4",
  captions: { src: "captions/2026-11-03_10r.json" },
  segments: [{ start: 3.42, end: 65.7 }],
  zooms: [
    { at: 27.78, scale: 1.05, style: "smooth", focusY: 0.3 }, // "إذا عجزت تكتبها بوضوح"
    { at: 31.2, scale: 1 },
    { at: 15.7, scale: 1.1, focusY: 0.3 },
    { at: 18.43, scale: 1 },
    { at: 33.66, scale: 1.08, style: "smooth", focusY: 0.3 },
    { at: 38.58, scale: 1 },
    { at: 55.34, scale: 1.1, focusY: 0.3 },
    { at: 56.78, scale: 1 },
  ],
  island: [
    { from: 20.92, to: 33.53, n: 1, text: "لخّص مشروعك في سطر" },
    { from: 33.66, to: 48.98, n: 2, text: "نسخة مصغّرة تبيعها" },
    { from: 49.06, to: 62.18, n: 3, text: "خلّ الناس تدفع" },
  ],
  beats: [
    // HOOK — "قبل ما تمد يدك لجيبك وتصرف أول ريال على مشروعك" → payment sheet, stopped on "مشروعك"
    { from: 0, to: 3.3, kind: "pay", merchant: "مشروعك", amount: "1 ر.س", at: 0.08, stopAt: 2.58, stop: "انتظر!" },
    // "ركز معي في هذه الثلاث الخطوات"
    { from: 3.38, to: 5.33, kind: "notif", items: [{ app: "تذكير", glyph: "⏰", tint: "orange", title: "3 خطوات قبل ما تصرف", at: 4.17 }] },
    // "أغلب المشاريع وللأسف تبدأ بالمقلوب" → the dock flips upside down
    { from: 5.48, to: 8.2, kind: "apps", flipAt: 7.41, items: [{ glyph: "💡", label: "فكرة", tint: "yellow", at: 5.7 }, { glyph: "🧪", label: "تجربة", tint: "blue", at: 5.9 }, { glyph: "🚀", label: "إطلاق", tint: "purple", at: 6.1 }] },
    // "تصمم شعار فخم، تفتح لها حساب، وتجهز منتج كامل"
    { from: 8.33, to: 13.08, kind: "apps", items: [{ glyph: "🎨", label: "الشعار", tint: "purple", at: 8.63 }, { glyph: "📱", label: "الحساب", tint: "blue", at: 10.3 }, { glyph: "📦", label: "المنتج", tint: "orange", at: 11.47 }] },
    // "وبعدما تحط كل ميزانيتك على هذا المشروع"
    { from: 13.18, to: 15.63, kind: "balance", label: "ميزانية المشروع", start: 50000, end: 0, at: 13.92, dur: 1.45, currency: "ر.س" },
    // "تنصدم إن السوق ما يحتاج لهذا المنتج أصلاً"
    { from: 15.68, to: 18.43, kind: "notif", items: [{ app: "المتجر", glyph: "🛒", tint: "red", title: "طلبات اليوم: 0", body: "السوق ما يحتاج المنتج", at: 16.15 }] },
    // 1 — "لخص مشروعك في سطر واحد: أنا أساعد مين على حل إيش وكيف … إذا عجزت … مشوشة"
    { from: 23.33, to: 33.48, kind: "notes", title: "مشروعي في سطر:", line: "أنا أساعد ___ على حل ___ بطريقة ___", at: 23.51, dur: 3.0, blurAt: 30.88, blurLabel: { text: "مشوّشة", at: 31.26 } },
    // 2 — "نسخة مصغرة تقدر تبيعها: عيّنة أولية أو خدمة بيدك أو حتى موقع"
    { from: 38.58, to: 43.78, kind: "tiles", items: [{ glyph: "🧪", label: "عيّنة", tint: "blue", at: 38.85 }, { glyph: "🤝", label: "خدمة بيدك", tint: "green", at: 40.31 }, { glyph: "💻", label: "موقع بسيط", tint: "purple", at: 41.81 }] },
    // "الهدف إنك تختبر إقبال الناس وتتعلم بأقل تكلفة وبدون مخاطرة"
    { from: 44.88, to: 48.98, kind: "activity", title: "إقبال الناس", at: 45.08, chip: { text: "تكلفة أقل · بدون مخاطرة", at: 47.2 } },
    // 3 — "فخلي الناس تدفع ولو مبلغ بسيط"
    { from: 50.78, to: 52.78, kind: "pay", merchant: "عميلك الأول", amount: "19 ر.س", at: 51.09, confirmAt: 51.58, done: "تم الدفع" },
    // "عبارة والله فكرتك ممتازة — هذه مجاملة ببلاش"
    { from: 53.18, to: 56.73, kind: "chat", items: [{ text: "والله فكرتك ممتازة 👏", at: 53.74 }], tag: { text: "مجاملة = 0 ر.س", at: 55.34 } },
    // "الدفع الفعلي من جيب العميل هو الإثبات الوحيد إنه مشروعك حقيقي وله مستقبل في السوق"
    { from: 56.78, to: 62.28, kind: "notif", items: [{ app: "المدفوعات", glyph: "💳", tint: "green", title: "وصلك 19 ر.س", body: "من عميل حقيقي", at: 57.1 }, { app: "مشروعك", glyph: "✅", tint: "blue", title: "هذا هو الإثبات", body: "مشروع حقيقي وله مستقبل", at: 58.64 }] },
  ],
};
