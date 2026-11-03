# نظام المونتاج — Talking Head Reels

نظام Remotion يحوّل فيديو خام لشخص يتكلم أمام الكاميرا إلى Reel تعليمي احترافي
(1080×1920، 30fps، من 25 إلى 40 ثانية) فيه موشن جرافيك، وترجمة كلمة بكلمة، وقص للسكتات، وزوم، ومؤثرات صوتية.

**الفكرة:** كل فيديو عبارة عن ملف بيانات واحد (`src/videos/<slug>.ts`) يصف المونتاج:
المقاطع التي نحتفظ بها، والمشاهد، والنصوص، والتوقيتات. ويتولى مكوّن `<Reel>` تحويل هذا الوصف إلى فيديو.

---

## 1) أين ترفع الفيديو الخام

```
montage-system/public/raw/
```

**التسمية:** `YYYY-MM-DD_slug.mp4`، بحروف إنجليزية صغيرة وشرطات، وبدون مسافات أو حروف عربية.

| ✅ صح | ❌ خطأ |
|---|---|
| `2026-11-10_mic-mistakes.mp4` | `فيديو المايك.mp4` |
| `2026-11-12_lighting-tips.mp4` | `IMG_4421 final(2).MOV` |

**طرق الرفع:**
- **أرسله لي في المحادثة كمرفق.** هذه الطريقة الأسهل، وأنا أضعه في المكان الصحيح بالاسم الصحيح.
- **من GitHub:** افتح المستودع وانتقل إلى الفرع ثم إلى `montage-system/public/raw/`، واضغط **Add file → Upload files**.
  حد الرفع من المتصفح 25MB. إذا كان الملف أكبر فاضغطه أولاً (HandBrake، الإعداد Fast 1080p30) أو أرسله في المحادثة.

**مواصفات التصوير المفضلة:**
- عمودي 9:16. إذا كان أفقياً فسيُقص من المنتصف.
- 1080p أو أعلى، و30 أو 60 إطاراً في الثانية.
- صوت واضح، ويفضل ميكروفون لاسلكي.
- خلّ بين الجمل سكتة قصيرة؛ النظام يقصها تلقائياً.
- وجهك في الثلث العلوي من الكادر، لأن الرسوم تظهر غالباً في النصف السفلي.

## 2) هل تحتاج تسوي شيء قبل الطلب؟

لا. ارفع الفيديو واكتب لي الطلب فقط. النظام مثبّت ومُختبر.

إذا أردت معاينة النتيجة بنفسك على جهازك (مرة واحدة فقط):
```bash
cd montage-system
npm install
npm run dev
```
ثم افتح Remotion Studio واختر الفيديو من مجلد **Videos**.

## 3) كيف تطلب مونتاج

اكتب لي رسالة مثل هذه. القالب الكامل موجود في `briefs/_template.md`:

```
سوّ مونتاج للفيديو 2026-11-10_mic-mistakes.mp4

الهوك: "3 أخطاء تدمّر صوت فيديوهاتك" (ميّز كلمة: تدمّر)
النقاط:
1. الميكروفون بعيد عن فمك
2. تصوّر في غرفة فاضية
3. ما تسمع المقطع قبل النشر
إحصائية: 87% يتركون الفيديو إذا كان الصوت سيئ
CTA: "تبي قائمة أفضل المايكات؟" — الزر: اكتب «مايك»
اسمي في البداية: عبدالله — صانع محتوى تعليمي
```

## 4) ماذا يحدث بعد طلبك

| الخطوة | الأمر | الناتج |
|---|---|---|
| فحص الفيديو واكتشاف السكتات | `npm run probe <slug>` | `briefs/<slug>.probe.json` |
| تفريغ الكلام بتوقيت كل كلمة | `npm run transcribe <slug>` | `public/captions/<slug>.json` + `briefs/<slug>.transcript.txt` |
| إنشاء ملف المونتاج | `npm run new <slug>` | `src/videos/<slug>.ts` + `briefs/<slug>.md` |
| كتابة المشاهد ومزامنتها مع الكلام | (أنا) | ملف المونتاج مكتمل |
| فحص بصري للإطارات | `npm run still <id>` | `out/stills/<id>/*.png` |
| **معاينتك** في Studio | `npm run dev` | — |
| الرندر النهائي (فقط عندما تطلبه) | `npm run render <id> [--client <slug>]` | `out/<id>.mp4` |

## 5) هيكل المشروع

```
montage-system/
├── public/
│   ├── raw/                 ← ارفع الفيديوهات الخام هنا
│   ├── captions/            ← الترجمة المولّدة تلقائياً (JSON)
│   ├── fonts/               ← خط Cairo (عربي + لاتيني)
│   └── sfx/                 ← المؤثرات الصوتية (whoosh, pop, click, thump, chime)
├── briefs/                  ← طلبات المونتاج + التفريغ + نتائج الفحص
│   └── _template.md
├── scripts/                 ← probe / transcribe / new / still / render
├── src/
│   ├── Root.tsx             ← يسجّل الفيديوهات + الأمثلة في Studio
│   ├── videos/              ← ملف مونتاج لكل فيديو (+ _demo.ts مثال كامل)
│   ├── system/              ← المحرك: Reel, types, timeline, safeArea, sfx
│   ├── templates/           ← قوالب المشاهد: Hook, Explanation, Points, CTA, Stat, LowerThird, IconPop
│   ├── components/
│   │   ├── motion/          ← useSpringIn, useExit, Entrance, Stagger
│   │   ├── text/            ← TextReveal (كلمة/حرف/سطر), Captions
│   │   ├── graphics/        ← Icon, IconAnimation, StaggerList, LowerThird, CTAButton, Counter, Tag, ProgressBar
│   │   ├── layout/          ← SafeArea, GlassCard, Scrim
│   │   ├── fx/              ← Grade, Grain, Vignette, BgMesh, FlashCut, SafeZoneGuide
│   │   └── footage/         ← TalkingHead (قص + زوم), PlaceholderSpeaker
│   ├── theme/               ← الألوان والخطوط والحركات (مصدر واحد)
│   └── examples/            ← مثال حي لكل مكوّن (مجلد Examples في Studio)
└── out/                     ← الفيديوهات النهائية (غير مرفوعة على git)
```

## 6) قوالب المشاهد

كل مشهد يُكتب في ملف المونتاج بتوقيت `from`/`to` بالثواني. ويقبل كل مشهد أيضاً:
`placement: "top" | "center" | "bottom"` و `backdrop: "none" | "scrim" | "full"`.

| القالب | متى يُستخدم | مثال |
|---|---|---|
| `hook` | أول 1–3 ثواني | `{ type: "hook", from: 0, to: 2.8, title: "3 أخطاء تدمّر\nصوتك", highlight: ["تدمّر"], tag: "انتبه" }` |
| `lowerThird` | تعريف المتحدث | `{ type: "lowerThird", from: 3, to: 6, name: "عبدالله", role: "صانع محتوى" }` |
| `explanation` | فكرة واحدة في بطاقة | `{ type: "explanation", from: 11, to: 15, icon: "mic", title: "الخطأ الأول", body: "الميكروفون بعيد", highlight: ["بعيد"] }` |
| `points` | قائمة نقاط متزامنة مع الكلام | `{ type: "points", from: 18, to: 25, bullet: "check", items: [{ text: "...", at: 0.6 }] }` |
| `stat` | رقم كبير متحرك | `{ type: "stat", from: 7, to: 11, value: 87, suffix: "%", caption: "..." }` |
| `iconPop` | لمسة سريعة ✓ ✗ ⚠ | `{ type: "iconPop", from: 16, to: 17.5, icon: "x", tone: "danger", label: "لا تسويها!" }` |
| `cta` | آخر 3–5 ثواني | `{ type: "cta", from: 26, to: 30, title: "...", label: "اكتب «مايك»" }` |

إعدادات الفيديو كاملة موجودة في `src/system/types.ts`، وأهمها: `segments` (قص السكتات)، `autoPunchIn` (زوم مع كل قطع)،
`captions` (الترجمة)، `colors` (ألوان البراند)، `flashes`، `music`، `progressBar`، `showSafeZone`.

## 7) أمثلة حيّة

- **Videos → Demo-Reel:** فيديو كامل مدته 30 ثانية يستخدم كل القوالب (بمتحدث تجريبي).
- **Examples → Ex-***: كل مكوّن لوحده، وكود الاستخدام في `src/examples/Examples.tsx`.

## 8) قواعد التصميم المطبّقة

- لا توجد حركة خطية (linear) إطلاقاً، فكل الحركات spring أو easing.
- كل عنصر يدخل بخاصيتين أو ثلاث معاً (شفافية + حركة + تكبير)، ويخرج أسرع مما دخل.
- العناصر تدخل بالتتابع (stagger)، ولا يدخل عنصران في نفس اللحظة.
- لون بطل واحد (الأصفر) لكلمة واحدة أو لزر الـ CTA في الإطار الواحد.
- كل النصوص داخل منطقة إنستغرام الآمنة. للتأكد شغّل `showSafeZone: true`.
- النص العربي في وضع "حرف بحرف" يُكشف بمسح من اليمين، حتى لا تنفصل الحروف المتصلة.
