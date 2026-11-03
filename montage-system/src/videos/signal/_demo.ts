import type { SignalSpec } from "../../styles/signal/types";

/**
 * SIGNAL GALLERY — every Signal beat and widget on the placeholder speaker (no raw video needed).
 * Copy a block from here into a real video spec and change the times to the spoken words.
 */
export const signalDemo: SignalSpec = {
  id: "Signal-Gallery",
  video: "",
  duration: 33,
  sfx: false, // visual gallery — sounds are demonstrated in real videos
  beats: [
    { from: 0, to: 2.6, kind: "hookCam", highlight: ["الأسرار"], words: [{ text: "أهم", at: 0.2 }, { text: "3", at: 0.5 }, { text: "الأسرار", at: 0.9 }, { text: "للحفظ", at: 1.4 }] },
    { from: 2.6, to: 5.2, kind: "burst", icon: "zap", at: 2.7, highlight: ["فكرة"], words: [{ text: "فكرة", at: 3.2 }, { text: "صادمة", at: 3.6 }] },
    { from: 5.2, to: 9, kind: "stage", icon: "book", label: { text: "اسم الكتاب", at: 5.5 }, title: [{ text: "Make", at: 5.8 }, { text: "It", at: 6 }, { text: "Stick", at: 6.2 }], chips: [{ text: "مثال", at: 7, icon: "star" }, { text: "شريحة", at: 7.5, icon: "bulb" }] },
    { from: 9, to: 12.5, kind: "panel", label: "iconTitle + bars", top: 900, widgets: [
      { type: "iconTitle", icon: "zap", title: "عنوان اللوحة", at: 9.3, sub: { text: "سطر فرعي يصل بعده", at: 9.8 } },
      { type: "bars", bars: [{ label: "سهولة", value: 0.9, at: 10.3 }, { label: "تثبيت", value: 0.2, at: 11, tone: "danger" }] },
    ] },
    { from: 12.5, to: 16, kind: "panel", label: "checklist", top: 880, widgets: [{ type: "checklist", rows: [
      { text: "عادة قديمة", at: 12.8, mark: "x" }, { text: "عادة ثانية", at: 13.4, mark: "x" }, { text: "عادة صحيحة", at: 14.2, mark: "check" },
    ] }] },
    { from: 16, to: 19, kind: "slam", label: { text: "سطر صغير فوق", at: 16.1 }, highlight: ["كبيرة"], words: [{ text: "كلمة", at: 16.4 }, { text: "كبيرة", at: 16.8 }] },
    { from: 19, to: 23, kind: "panel", label: "stepper", widgets: [{ type: "stepper", steps: [{ label: "واحد", at: 19.3 }, { label: "اثنين", at: 20 }, { label: "ثلاثة", at: 20.7 }, { label: "أربعة", at: 21.4 }], note: { text: "ملاحظة تحت الخطوات", at: 21.8 } }] },
    { from: 23, to: 26, kind: "panel", label: "reframe", widgets: [{ type: "reframe", from: { text: "الفكرة القديمة", at: 23.3 }, strikeAt: 24.2, to: { text: "الجديدة", at: 24.7 } }] },
    { from: 26, to: 29.5, kind: "panel", label: "links", widgets: [{ type: "links", at: 26.3, strongAt: 27.5, label: { text: "روابط تقوى", at: 28 } }] },
    { from: 29.5, to: 33, kind: "panel", label: "follow + chips", widgets: [
      { type: "follow", title: "تابع الحساب", tapAt: 30.2, bell: { text: "تنبيه يصل بعد الضغط", at: 30.9 } },
      { type: "chips", chips: [{ text: "شريحة", at: 31.4, icon: "check" }, { text: "ثانية", at: 31.7, icon: "star" }] },
    ] },
  ],
};
