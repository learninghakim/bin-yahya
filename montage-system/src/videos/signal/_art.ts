import type { SignalSpec } from "../../styles/signal/types";

/**
 * SIGNAL ART GALLERY — every illustrative motion graphic (styles/signal/art.tsx) on the placeholder speaker.
 * Each block shows the props it needs; in a real video every time must sit on a spoken word.
 */
export const signalArt: SignalSpec = {
  id: "Signal-Art",
  video: "",
  duration: 40,
  sfx: false,
  beats: [
    { from: 0, to: 3, kind: "art", viewfinder: true, art: { type: "gauge", at: 1.0, settleAt: 1.6, left: "متعبة", right: "مريحة" } },
    { from: 3, to: 5.5, kind: "art", art: { type: "bolt", at: 3.3 } },
    { from: 5.5, to: 9, kind: "art", art: { type: "illusion", fillAt: 5.7, trickAt: 7.4, full: "فاهم", trick: "خدعة" } },
    { from: 9, to: 13, kind: "art", stage: true, art: { type: "book", title: "Book Title", openAt: 10, peopleAt: 11, chips: [{ text: "شريحة", at: 11.8, icon: "brain" }] } },
    { from: 13, to: 17, kind: "art", art: { type: "curve", feelAt: 13.4, realAt: 14.4, longAt: 16, feel: "إحساسك", real: "اللي يبقى", xLabel: "الوقت", yLabel: "الحفظ" } },
    { from: 17, to: 21.5, kind: "art", art: { type: "habits", pageAt: 17.3, highlightAt: 18, rereadAt: 18.8, illusionAt: 19.8, crackAt: 20.6, bubble: "فاهم!" } },
    { from: 21.5, to: 24, kind: "art", art: { type: "toggle", flipAt: 22.6, off: "قبل", on: "بعد" } },
    { from: 24, to: 29, kind: "art", art: { type: "journey", stops: [{ label: "واحد", icon: "book", at: 24.5 }, { label: "اثنين", icon: "eyeOff", at: 25.4 }, { label: "ثلاثة", icon: "brain", at: 26.3 }, { label: "أربعة", icon: "calendar", at: 27.2 }] } },
    { from: 29, to: 32.5, kind: "art", stage: true, title: [{ text: "عنوان", at: 29.3 }, { text: "قصير", at: 29.6 }], highlight: ["قصير"], art: { type: "barbell", liftAt: 30, squeezeAt: 31.2 } },
    { from: 32.5, to: 37, kind: "art", art: { type: "brain", weakAt: 32.8, crossAt: 33.6, buildAt: 34.2, strongAt: 35.4, weak: "ضعف؟" } },
    { from: 37, to: 40, kind: "art", art: { type: "follow", tapAt: 37.6, bellAt: 38.4, button: "متابعة", done: "متابَع" } },
  ],
};
