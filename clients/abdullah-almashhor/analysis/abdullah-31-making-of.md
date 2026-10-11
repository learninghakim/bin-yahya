# كيف صُنع فيديو abdullah-31 — الشرح الكامل

> **المرجع:** هذا الوصف مأخوذ من الكود كما كان لحظة تصدير `abdullah-31.mp4`، وهو commit رقم `06458fd` على الفرع `claude/elegant-faraday-vx7wsa` في `learninghakim/bin-yahya`. التعديلات التي جاءت بعده (النسختان v2 و v3، وخط Dubai، وخط Segoe UI) **ليست** جزءاً من هذا الفيديو.
> كل الأرقام هنا منقولة من الكود. **الإطار** = الثانية × 30 مقرّبة.

---

## 1) المشروع والملفات

### شجرة الملفات (بدون node_modules)
```
bin-yahya/
├── .claude/hooks/telegram-notify.sh        ← إشعار تيليجرام (لا علاقة له بالفيديو)
├── .claude/settings.json
├── .gitignore
├── CLAUDE.md
├── README.md
├── clients/
│   ├── _template/ {brand,references,deliveries}/.gitkeep, brief.md
│   └── abdullah-almashhor/
│       ├── brand/.gitkeep
│       ├── brief.md
│       ├── deliveries/abdullah-31.mp4      ← الناتج النهائي
│       ├── deliveries/study-reel.mp4       ← فيديو قديم آخر
│       └── references/style-01..05.webp    ← صور الستايل المرجعية
└── my-remotion-video/
    ├── .gitignore  .prettierrc  README.md  eslint.config.mjs
    ├── package.json  package-lock.json  remotion.config.ts  tsconfig.json
    ├── public/
    │   ├── clients/abdullah-almashhor/31.mp4   ← الفيديو الخام (خارج git، يُنزَّل بالسكربت)
    │   ├── fonts/  cairo-*.woff2  reemkufi-*.woff2
    │   │           noto-kufi-arabic-arabic-800/900-normal.woff2, noto-kufi-arabic-latin-800-normal.woff2
    │   │           ibm-plex-sans-arabic-arabic-500/600-normal.woff2, ibm-plex-sans-arabic-latin-600-normal.woff2
    │   └── sfx/  chime.wav click.wav pad.wav paper.wav pop.wav thump.wav whoosh.wav
    ├── scripts/fetch-footage.sh   ← ينزّل 31.mp4 من GitHub Release
    ├── scripts/make-sfx.mjs       ← يولّد ملفات المؤثرات الصوتية بالكود
    └── src/
        ├── index.ts  index.css  Root.tsx  fonts.ts
        ├── shared/theme.ts
        ├── shared/components/ Background.tsx Chalk.tsx Icons.tsx Overlays.tsx Paper.tsx WordReveal.tsx motion.ts textures.ts
        └── clients/abdullah-almashhor/
            ├── theme.ts
            ├── StudyReel.tsx + scenes/Scene1..4.tsx      ← فيديو آخر قديم (غير مستخدم في 31)
            ├── components/GoldInkDefs.tsx  components/TornBackdrop.tsx
            └── video31/ Video31.tsx Footage.tsx Scenes.tsx Words.tsx kit.tsx Sfx.tsx timing.json
```

**الملفات التي يستخدمها فيديو 31 فعلاً:**
- `index.ts`, `Root.tsx`, `index.css`, `fonts.ts`
- `shared/theme.ts`
- من `shared/components`: الملفات `Chalk.tsx`, `Overlays.tsx` (منه `Grain` فقط), `Paper.tsx`, `motion.ts`, `textures.ts`
- `clients/abdullah-almashhor/theme.ts`
- `components/GoldInkDefs.tsx`, `components/TornBackdrop.tsx`
- كل ملفات مجلد `video31/`

**الملفات غير المستخدمة في 31:** `Background.tsx`, `Icons.tsx`, `WordReveal.tsx`, `StudyReel.tsx`, `scenes/`.

### الحزم (`package.json` كاملاً)
```json
{
  "name": "my-remotion-video",
  "version": "1.0.0",
  "description": "My Remotion video",
  "repository": {},
  "license": "UNLICENSED",
  "private": true,
  "dependencies": {
    "@remotion/cli": "4.0.532",
    "@remotion/fonts": "^4.0.532",
    "@remotion/google-fonts": "^4.0.532",
    "@remotion/media": "^4.0.532",
    "@remotion/paths": "^4.0.532",
    "@remotion/tailwind-v4": "4.0.532",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "remotion": "4.0.532",
    "tailwindcss": "4.0.0"
  },
  "devDependencies": {
    "@remotion/eslint-config-flat": "4.0.532",
    "@types/react": "19.2.7",
    "@types/web": "0.0.166",
    "eslint": "9.39.5",
    "prettier": "3.8.1",
    "typescript": "5.9.3"
  },
  "scripts": {
    "dev": "remotion studio",
    "build": "remotion bundle",
    "upgrade": "remotion upgrade",
    "lint": "eslint src && tsc"
  },
  "sideEffects": ["*.css"]
}
```
- **نسخة Remotion:** 4.0.532.
- **الحزم المستخدمة فعلاً في 31:**
  - `remotion`: عناصر `AbsoluteFill`, `Sequence`, `OffthreadVideo`, `spring`, `interpolate`, `random`, `Easing`, `staticFile`.
  - `@remotion/media`: عنصر `Audio` للمؤثرات الصوتية.
  - `@remotion/fonts`: الدالة `loadFont`.
- **الحزم غير المستخدمة في 31:** `@remotion/paths` (يستخدمه الفيديو القديم فقط)، و`@remotion/google-fonts` و`tailwind`.
- **تعديل في `tsconfig.json`:** أضفت `"resolveJsonModule": true` حتى يُقرأ `timing.json`.

### المصدر الخام والتوقيت
- **مصدر الملفات:** في GitHub Release على الوسم `abdullah-almashhor`، واسم الإصدار "31":
  - `31.mp4`: الفيديو الخام. 1080×1920، 30fps، مدته 35.968 ثانية، صوت AAC بتردد 48kHz، وعلوّه -16.6 LUFS.
  - `31_clean_for_claude.-.Copy.srt`
  - `31_script_clean.txt`
- **التوقيت:** على مستوى **مقاطع الـ SRT فقط**، وكل مقطع من 2 إلى 4 كلمات. **لم أستخدم Whisper**، ولم أحسب توقيت كل كلمة من الصوت.
- **تحليل الـ SRT:** حلّلته بـ Python وحوّلت التوقيت إلى ثوانٍ. حذفت مقطعاً شاذاً عند 94.5 ثانية ("تكفي وتزيد") لأنه خارج مدة الفيديو.
- **كشف الصمت:** شغّلت `ffmpeg silencedetect` بإعداد `n=-35dB:d=0.25`، ولم يخرج بفواصل مفيدة، فاعتمدت على الـ SRT كما هو بلا أي تعديل.
- **ملف التوقيت:** كتبت التوقيت في `video31/timing.json`، وفيه:
  - `cues`: مقاطع الـ SRT.
  - `scenes`: حدود المشاهد، واخترتها يدوياً على بدايات الجمل.
- **توقيت الكلمات داخل الكابشن:** تقسيم تقريبي متساوٍ. الكلمة رقم i تبدأ عند `بداية المقطع + (مدة المقطع ÷ عدد الكلمات) × i × 0.8`.

---

## 3) خريطة المشاهد بالإطارات

**أنواع المشاهد:**
- **A**: عبدالله كامل الشاشة.
- **B**: عبدالله داخل إطار ورقي.
- **C**: مشهد بصري كامل (كولاج)، والفيديو الأصلي مخفي وصوته مستمر.

كل مشهد ملفوف في `<Sequence>` يبدأ عند `round(from×30)`، ومدته `round((to−from)×30)+2`، فيتداخل كل مشهد مع الذي بعده بإطارين. مشاهد B و C تُرسم **تحت** طبقة الفيديو، ومشاهد A تُرسم **فوقها**.

| المشهد | الإطارات | الثواني | النوع | الجملة |
|---|---|---|---|---|
| s1 | 0–165 | 0–5.5 | A | أسرع طريقة تفشل فيها بتثبيت أي مهارة هي أن تكرر نفس النمط لساعات متواصلة |
| s2 | 165–247 | 5.5–8.22 | C | التدريب على شكل واحد أو صورة واحدة يخدعك |
| s3 | 247–352 | 8.22–11.73 | B | يعطيك شعور مؤقت أنك أتقنت الفكرة في نفس اللحظة |
| s4a | 352–392 | 11.73–13.07 | A | لكن الصدمة أن |
| s4b | 392–501 | 13.07–16.7 | C | هذا الإتقان يتبخر عند أول اختبار حقيقي على أرض الواقع |
| s5 | 501–615 | 16.7–20.5 | A | الحل المثبت في أبحاث التعلم هو ما يسمى بالتدريب المتداخل |
| s6 | 615–677 | 20.5–22.55 | B | لا تركز على تمرين واحد في الجلسة |
| s7 | 677–833 | 22.55–27.78 | C | اخلط ثلاثة أشكال أو أدوات مختلفة داخل نفس الساعة وبترتيب عشوائي |
| s8 | 833–926 | 27.78–30.87 | A | صحيح أن التنقل بين أنماط مختلفة بيتعب عقلك في البداية |
| s9 | 926–1020 | 30.87–34.0 | C | لكن هذا المجهود بالذات يبني روابط قوية |
| s10 | 1020–1079 | 34.0–35.968 | A | ويحفر هذه المهارة في الذاكرة طويلة المدى |

**مدة كل نوع:**
- **A:** 15.66 ثانية.
- **B:** 5.56 ثانية.
- **C:** 14.74 ثانية.
- **عبدالله ظاهر (A + B):** 21.2 ثانية، أي **59%** من الفيديو.

### تفاصيل كل مشهد (الإطارات مطلقة من بداية الفيديو)

**s1 (A).** ورقة عدّ وساعة.
- **ورقة العدّ:**
  - **المكان:** Paper بمقاس 250×330 ولون `chalk`، في الموضع left 60 / top 440.
  - **الدخول (إطار 6):** spring snappy، ترتفع من 80 بكسل، وتدور من −16° إلى −5°، والشفافية `min(1, p×1.5)`.
  - **السطور:** 6 خطوط سماوية بشفافية 0.35.
  - **علامات العدّ:** 20 علامة. تبدأ العلامة i عند الإطار `12 + i×6`، وتُرسم خلال 5 إطارات. المجموعات من 5: أربع علامات عمودية بفاصل 16 بكسل، والخامسة مائلة.
- **الساعة:**
  - **المكان والشكل:** دائرة 230×230 في الموضع left 790 / top 470. خلفيتها `bgLift`، وحدّها 12 بكسل بلون `paper`.
  - **الدخول (إطار 11):** spring snappy، تكبر من 0.5 إلى 1، وتدور من 30° إلى 4°.
  - **العقارب:** العقرب الكبير يدور من 0 إلى 2160° (6 لفات) بين الإطار 12 والإطار 165، بمنحنى `ease.inOut`. العقرب الصغير بسرعة 1/12 من ذلك.
- **علامة X:** ChalkLine في الموضع 150,380، تبدأ عند الإطار 24 وتُرسم خلال 8 إطارات، بسماكة 12.
- **الخروج:** المشهد كله يختفي خلال الإطارات 156–165 (useOut بطول 9 إطارات).
- **زوم على عبدالله:** من 1.00 إلى 1.05 على مدة المشهد كله.

**s2 (C).** رزمة بطاقات متطابقة وعين.
- **الخلفية:** Backdrop، تظهر بـ spring smooth، وتختفي في آخر 8 إطارات.
- **الحلقة:**
  - **الدائرة:** نصف قطرها 360 ومركزها (540,900)، بخط ذهبي متقطع `22 18` وسماكة 4.
  - **الأسهم:** سهمان صغيران عند الأعلى والأسفل.
  - **الدوران:** الدائرة وأسهمها تدور 0.9° في كل إطار.
- **الرزمة:**
  - **البطاقات:** 5 نسخ Paper بمقاس 300×370، مكتوب عليها "تمرين ١" بحجم 46، وتحتها أيقونة قلم بحجم 120.
  - **الانفراش (إطار 171):** spring smooth. البطاقة i تنزاح أفقياً `(i−2)×46`، وتنزل `|i−2|×14`، وتدور `(i−2)×9°`، ونقطة الدوران `50% 120%`.
- **العين:**
  - **البطاقة:** Paper بمقاس 260×160 في الموضع left 410 / top 1170.
  - **الدخول (إطار 219):** spring bouncy، تكبر من 0.3 إلى 1، وتدور من 20° إلى −4°.
  - **الرمش:** الجفن ينغلق حين `|sin((frame−228)/7)| > 0.97`، فيصير مقياسه الرأسي 0.15.

**s3 (B).** عبدالله في إطار ورقي، وبجانبه ختم "أتقنت ✓".
- **الختم:** دائرة 250×250 في الموضع left 760 / top 640، بحدّ سماوي 10 بكسل، وفيه ✓ و"أتقنت" بحجم 60.
- **الدخول (إطار 254):** spring bouncy، يصغر من 1.8 إلى 1، وزاويته −14°.
- **مرحلة الشك (الإطارات 291–345):**
  - المتغيّر `doubt` يرتفع من 0 إلى 1.
  - الشفافية تنخفض حتى 0.25 (`1 − doubt×0.75`).
  - التمويه `doubt×3px`.
  - اهتزاز `sin(frame×1.7)×6×doubt` على الدوران والإزاحة.
- **شرارات:** Sparks في الموضع 885,600، تبدأ عند الإطار 255.

**s4a (A).** لكن الصدمة.
- **الزوم:** من 1.00 إلى 1.12 خلال الإطارات 352–369، بمنحنى `ease.inOut`.
- **الشرارات:**
  - مجموعة عند 210,1000 بزاوية −140°، تبدأ عند الإطار 354.
  - مجموعة عند 870,1000 بزاوية −40°، تبدأ عند الإطار 356.
  - في كل مجموعة 4 خطوط بحجم 80.

**s4b (C).** الإتقان يتبخر.
- **ورقة "الإتقان":** 7 شرائح عمودية من نفس الورقة (760×300، الموضع top 560)، مكتوب عليها "الإتقان" بحجم 150.
- **الدخول (إطار 393):** spring snappy، ترتفع من 80، وتكبر من 0.7 إلى 1.
- **التبخّر (من الإطار 416):** لكل شريحة i متغيّر `d = max(0, t − i×0.08)` بالثواني، وعليه:
  - **الارتفاع:** `d²×260 + d×40`.
  - **الانجراف الأفقي:** `(random−0.5)×180×d`.
  - **الدوران:** `(random−0.5)×30×d`.
  - **التمويه:** `min(10, d×8)`.
  - **الشفافية:** تنخفض من 1 إلى 0 مع `d` من 0 إلى 1.3.
- **ورقة الاختبار:**
  - **المكان والمحتوى:** Paper بمقاس 440×420 بلون `chalk`، في الموضع left 320 / top 930. فيها العنوان "اختبار حقيقي" بحجم 44، و4 صفوف، كل صف فيه مربع وخط.
  - **الدخول (إطار 450):** spring snappy، تصعد من 500، وتدور من 12° إلى 3°.
- **علامة "?":** ChalkLine في الموضع 600,960، تبدأ عند الإطار 465، وتُرسم خلال 12 إطاراً.

**s5 (A).** ثلاث بطاقات تتداخل.
- **البطاقات:** Card بمقاس 180×150:
  - قلم: لونها `paper`، تبدأ من (170,560)، وتدخل عند الإطار 507.
  - كتاب: لونها `yellow`، تبدأ من (910,560)، وتدخل عند الإطار 519.
  - فرجار: لونها `teal`، تبدأ من (180,860)، وتدخل عند الإطار 531.
- **التداخل (الإطارات 564–579):** بمنحنى `ease.inOut` تتحرك البطاقات إلى (400,1290) و(540,1310) و(680,1290)، وتقلّ زاويتها إلى النصف.
- **الخروج:** عند الإطار 615.
- **الزوم:** من 1.00 إلى 1.06 بين الإطار 564 والإطار 588.

**s6 (B).** تمرين واحد يُشطب.
- **بطاقة "تمرين ١":** Card بمقاس 240×200 في الموضع 870,520، تدخل عند الإطار 618، وفيها قلم و"تمرين ١".
- **علامة X:** تبدأ عند الإطار 642، وتُرسم خلال 8 إطارات، بسماكة 14.
- **بطاقة الكتاب:** Card بمقاس 190×160 ولون ذهبي، في الموضع 880,800، تدخل عند الإطار 660.
- **بطاقة الفرجار:** Card بمقاس 190×160 ولون سماوي، في الموضع 860,1030، تدخل عند الإطار 663.

**s7 (C).** ساعة ورقية وتبديل البطاقات.
- **الساعة:**
  - **المكان والشكل:** دائرة 460×460 مركزها (540,940). خلفيتها `bgLift`، وحدّها 14 بكسل بلون `paper`. فيها 12 علامة.
  - **العقارب:** عقرب ذهبي طوله 150 وسماكته 10، يدور من −90° إلى 630° خلال الإطارات 678–831. وعقرب كريمي طوله 90 بسرعة 1/12 من ذلك.
  - **الدخول (إطار 678):** spring smooth، تكبر من 0.5 إلى 1، وتدور من −30° إلى 0°.
- **البطاقات:**
  - **الأنواع:** ثلاث Card بمقاس 210×200: كتابة/قلم بلون `paper`، وقراءة/كتاب بلون `yellow`، ورسم/فرجار بلون `teal`.
  - **المكان:** على دائرة نصف قطرها 300، بزوايا −90° و30° و150°.
  - **الدخول:** عند الإطارات 681 و686 و691.
- **التبديل:**
  - **الترتيب:** يتغير من [0,1,2] إلى [2,0,1] ثم [1,2,0] ثم [0,2,1].
  - **التوقيت:** عند الإطارات 750 و789 و810، بـ spring bouncy على **الزاوية**، فتدور البطاقات حول الساعة.
- **الأسهم:** 3 أسهم DashedArrow بشكل قوس Q على دائرة نصف قطرها 450، تبدأ عند الإطارات 696 و701 و706.

**s8 (A).** خربشات حول الرأس.
- **الخربشات:** 6 خطوط ChalkLine تتناوب بين 3 مسارات:
  - حلقة عند (150,260).
  - زجزاج عند (700,240).
  - قوس فوق الرأس عند (380,140).
- **التوقيت:** تبدأ عند الإطار `837 + k×12`، وكل خط يُرسم خلال 10 إطارات. أول 3 بشفافية 0.5، والثلاثة التالية بشفافية 0.95.
- **الأسهم:** DashedArrow عند (60,380) يبدأ عند الإطار 861، وآخر عند (740,380) يبدأ عند الإطار 873.
- **الزوم:** من 1.00 إلى 1.05.

**s9 (C).** رأس فيه شبكة روابط.
- **الرأس:** مسار `HEAD` بلون `paper` وحدّ `chalk` بسماكة 14، وفوقه نسخة مصغّرة 0.92 بلون `bgLift`.
- **الدخول (إطار 927):** spring smooth، يصعد من 60.
- **النقاط:**
  - **العدد والمكان:** 22 نقطة عشوائية ثابتة (`random`) داخل المستطيل x من 330 إلى 750، و y من 620 إلى 1140.
  - **التوقيت:** النقطة i تظهر عند `936 + (1020−936)×i/22`.
  - **الشكل:** spring bouncy، نصف قطرها 11، بلون `teal` مع توهج.
- **الخطوط:** لكل نقطة 3 خطوط إلى أقرب نقاطها، فيكون المجموع 66 خطاً.
  - **التوقيت:** الخط يبدأ عند ظهور النقطة المتأخرة من طرفيه، ويمتد خلال 8 إطارات.
  - **الشكل:** ذهبي، سماكته `3 + p`، وشفافيته 0.85.

**s10 (A).** الختام.
- **بقايا الشبكة:** أول 18 خطاً من شبكة s9، مزاحة (−300, +200)، تختفي من شفافية 0.6 إلى 0 خلال أول 18 إطاراً.
- **خط تحت "طويلة المدى":** ChalkLine في الموضع 260,1300 بعرض 560، يبدأ عند الإطار 1064، ويُرسم خلال 9 إطارات، بسماكة 10، ويبقى حتى النهاية.
- **الزوم:** من 1.00 إلى 1.08.

---

## 4) نظام التصميم

### الألوان (`shared/theme.ts`)
| الاسم | القيمة | الاستخدام |
|---|---|---|
| bg | `#0A1526` | الكحلي الأساسي، ولون تدرّجات الخلفية |
| bgDeep | `#04080F` | أطراف الخلفية، وخلفية الـ composition |
| bgLift | `#1B2F55` | ألواح الورق الكحلية، ووجه الساعة، وداخل الرأس |
| teal | `#3FB8D4` | التوهّج السماوي: خط الحافة، والختم، والعين، ونقاط الشبكة، وكلمة "يخدعك" و"عشوائي" |
| tealDeep | `#1F6F8B` | معرّف في الكود لكنه غير مستخدم في 31 |
| yellow | `#C9A24B` | الذهبي: الخطوط، والشبكة، والعقارب، والخط تحت الكلمات |
| paper | `#E8DCC4` | الورق الكريمي، وحواف القصاصات، والإطار الورقي حول عبدالله |
| paperShade | `#C9BBA0` | خطوط ورقة الاختبار |
| greyLight | `#8A9099` | معرّف في الكود لكنه غير مستخدم في 31 |
| ink | `#0E1622` | الحبر الداكن على الورق |
| chalk | `#F3EEE3` | النص الكريمي، والبطاقات الفاتحة |
| tealGlow | `rgba(63,184,212,0.55)` | توهّج السماوي |

**ألوان مكتوبة مباشرة في الكود:**
- تدرّج الذهب في الكلمات: `#F3DA94 → #D9B25A → #A9822F`.
- تدرّج السماوي في الكلمات: `#A9EEFF → teal → #1C8FB0`.
- شريط الذهب في الخلفية: `#C9A24B, #E9CC7A, #9C7A2E`.
- لون الحبر الذهبي في فلتر GoldInk: RGB = (0.86, 0.70, 0.36).
- ظلال الكابشن والكلمات: `rgba(4,10,22,…)`.

### الخطوط
| الاستخدام | الخط | الوزن | الملف |
|---|---|---|---|
| الكلمات الكبيرة، ونصوص البطاقات | **Noto Kufi Arabic** (family `NotoKufi`) | يُطلب 900، و800 في البطاقات | `noto-kufi-arabic-arabic-800/900-normal.woff2` + `…-latin-800` |
| الكابشن | **IBM Plex Sans Arabic** (family `PlexArabic`) | 600 | `ibm-plex-sans-arabic-arabic-500/600-normal.woff2` + `…-latin-600` |

- **طريقة التحميل:** `loadFont` من `@remotion/fonts`، من الملفات المحلية في `public/fonts`. نزّلت الملفات بالأمر `npm pack @fontsource/noto-kufi-arabic` و`@fontsource/ibm-plex-sans-arabic` 5.3.0، وكلاهما برخصة OFL.
- **خط احتياطي:** Cairo في نهاية القائمة.
- **Segoe UI:** **غير مستخدم في هذا الفيديو.** ملفاته أُضيفت لاحقاً للنسخة v3، وهي محلية وغير مرفوعة إلى git.

### الخلفية (`components/TornBackdrop.tsx`): تظهر في مشاهد B و C فقط
1. **الطبقة الأساسية:** `radial-gradient(110% 70% at 50% 50%, bgLift 0%, bg 55%, bgDeep 100%)`.
2. **بقع خفيفة:** خامة `paperBlotch` بنمط `mix-blend overlay` وشفافية 0.35.
3. **الهندسة الذهبية (GoldGeometry):** طبقة SVG بشفافية 0.55، وكل خطوطها ذهبية بسماكة 1.6:
   - **دائرة كبيرة:** مركزها (540,960) ونصف قطرها 470، بشفافية 0.5. هذه هي "الدائرة الخفيفة في الوسط".
   - **دائرة متقطعة:** نصف قطرها 410، بنمط `2 14`، تدور 0.06° في كل إطار.
   - **دائرة جانبية:** مركزها (930,260) ونصف قطرها 300، بشفافية 0.35.
   - **خطان:** خط عمودي عند x=540 بشفافية 0.25، وخط أفقي عند y=960 بشفافية 0.12.
   - **حبّات ذهبية:** 4 حبّات على x=540 عند y = 260 و520 و1500 و1720. أنصاف أقطارها 9 و6 بالتناوب، وتتحرك `sin(frame/40+i)×6`، مع توهّج.
4. **لوحان كحليان ممزقان (Slab):**
   - **اللوح العلوي:** حافته خط من (−60,560) إلى (1140,150).
   - **اللوح السفلي:** حافته من (−60,1820) إلى (1140,1430).
   - **الحافة الممزقة:** `clip-path: polygon(...)` تُبنى نقطة كل 12 بكسل، مع اهتزاز عشوائي ثابت `(random(seed)−0.5)×amp×2`.
   - **طبقات كل لوح، من الأسفل إلى الأعلى:**
     - **شريط ذهبي:** مزاح 34 بكسل، بتدرّج 100°، والاهتزاز ±14، وتوهّج `drop-shadow 0 0 14px` ذهبي بشفافية 0.35.
     - **حافة كريمية:** مزاحة 18 بكسل، بلون `paper`، والاهتزاز ±12.
     - **الورق الكحلي:** تدرّج من `bgLift` إلى `bg`، والاهتزاز ±9، وظل `drop-shadow(0 18px 24px rgba(0,0,0,.55))`.
     - **خامة:** `paperNoise` + `paperBlotch` بنمط overlay وشفافية 0.5.
   - **الحركة:** اللوحان يتحركان رأسياً `sin(frame/70)×10` و`cos(frame/85)×10`.
   - **خط سماوي متوهّج (اللوح العلوي فقط):** من (−60,562) إلى (486,369)، بسماكة 5 وشفافية 0.8، مع ظلين `0 0 10px` و`0 0 24px` بلون `tealGlow`.
5. **الحبيبات (Grain):** فوق الفيديو كله. خامة `filmGrain` بحجم 220 بكسل، تتحرك `(frame×7, frame×13)`، بشفافية 0.07 ونمط overlay.
   - **ملاحظة:** طبقة Grade و Vignette **غير مستخدمتين**، والفيديو الأصلي بلا أي تلوين.

### الورق (`shared/components/Paper.tsx`)
- **الحافة الممزقة:** `tornPolygon(seed, w, h, amp, step)` يبني نقاط `clip-path: polygon` حول المستطيل، ويهزّ كل نقطة بقيمة `random(seed-i)×amp`.
- **الطبقات:**
  - **الحافة الكريمية (rim):** بسماكة 8 افتراضياً، أو 10 أو 12 أو 14 حسب المكان. لونها `paper`، و`amp` 9، و`step` 14.
  - **الورقة الداخلية:** بلونها، و`amp` 5 (أو 8 إذا لم تكن هناك حافة).
  - **الخامة:** `paperNoise` بنمط multiply وشفافية 0.55 وحجم 260 بكسل، و`paperBlotch` بنمط multiply وشفافية 0.6 وحجم 600 بكسل.
  - **لمعة خفيفة:** تدرّج 160° من أبيض شفاف إلى أسود شفاف.
- **الظل:** `drop-shadow(0 22px 26px rgba(0,0,0,.5)) drop-shadow(0 4px 5px rgba(0,0,0,.35))`.
  - **ملاحظة:** هذا يختلف عن قيم البرومبت (blur 20 بشفافية 25%).
- **الخامات (`textures.ts`):** صور SVG مدمجة كـ data URI، فيها `feTurbulence`. لا توجد ملفات صور.

### الأيقونات: SVG مكتوب يدوياً في الكود، بلا أي ملفات
- **القلم:** `M22 80 L30 60 L70 20 L80 30 L40 70 Z M30 60 L40 70`، ضمن `viewBox="0 0 100 100"`، بسماكة 7.
- **الكتاب:** `M50 26 C38 18 22 18 12 22 V80 C22 76 38 76 50 84 C62 76 78 76 88 80 V22 C78 18 62 18 50 26 Z M50 26 V84`
- **الفرجار (يظهر كحرف A):** دائرة عند (50,18) نصف قطرها 7، ثم `M46 24 L24 86 M54 24 L76 86 M33 60 C42 66 58 66 67 60`
- **علامة ✓:** `M10 42 L42 70 L100 10`، ضمن viewBox 110×80، بسماكة 14.
- **العين:** `M10 55 C60 0 140 0 190 55 C140 110 60 110 10 55 Z`، والحدقة دوائر بنصف قطر 30 و14 و5، والرمش بتغيير المقياس الرأسي.
- **علامة X:** `M10 10 L110 110 M110 12 L14 108`
- **"?" في s4b:** `M70 10 C120 10 130 70 70 80 L70 100 M70 125 L70 128`
- **الرأس:** `M300 1260 C290 1180 250 1150 250 1080 C250 1040 210 1020 230 980 C250 950 230 900 250 850 C270 700 380 560 560 560 C740 560 860 690 860 860 C860 980 800 1050 790 1120 C785 1170 800 1220 810 1260 Z`
- **الخربشات فوق الرأس:**
  - `M20 120 C60 20 160 20 200 100 C230 160 120 190 110 120 C100 60 220 40 260 90`
  - `M20 40 L80 120 L140 40 L200 120 L260 40`
  - `M20 80 C80 10 240 10 300 80`
- **أسهم s8:**
  - `M40 260 C10 160 60 60 200 40` ورأسه `M168 22 L204 40 L176 70`
  - `M260 260 C290 160 240 60 100 40` ورأسه `M132 22 L96 40 L124 70`
- **الخط تحت "طويلة المدى":** `M540 20 C420 34 260 10 120 28 C80 32 40 26 20 34`
- **الساعات وعلامات العدّ:** تُحسب بالـ cos و sin داخل الكود، وتفاصيلها في القسم 3.
- **فلتر الحبر الذهبي (`GoldInkDefs.tsx`):** فلتر SVG بالـ id `chalk`. يحوّل أي خط يمرّ عبر ChalkLine أو DashedArrow أو Sparks إلى ذهبي:
  - `feColorMatrix` إلى RGB (0.86, 0.70, 0.36).
  - `feGaussianBlur` بقيمة 6 للتوهّج.
  - `feMerge` يدمج التوهّج مع الخط.

### إطار عبدالله في مشاهد B (`Footage.tsx`)
- **المقياس:** 0.52، أي حوالي 562×998 بكسل على الشاشة.
- **الموضع:** `translate(−120px, −260px)`، فيصير مركزه عند (420,700).
- **الميل:** −3°.
- **الحد الكريمي:** طبقة بلون `paper` بـ `inset: -34px`، أي حوالي 18 بكسل بعد التصغير. فيها `clip-path` مائل قليلاً: `polygon(0.6% 0.4%, 99.2% 0%, 100% 99.3%, 0% 100%)`.
- **الظل:** `0 40px 80px rgba(0,0,0,0.5)`.

---

## 5) الحركة

| الاسم | القيم |
|---|---|
| spring.snappy | damping 14, stiffness 160, mass 0.6 |
| spring.smooth | damping 20, stiffness 90, mass 1 |
| spring.bouncy | damping 11, stiffness 170, mass 0.7 |
| spring.gentle | damping 24, stiffness 70, mass 1 (غير مستخدم في 31) |
| ease.out | bezier(0.16, 1, 0.3, 1) |
| ease.inOut | bezier(0.83, 0, 0.17, 1) |
| ease.in | bezier(0.7, 0, 0.84, 0) |

- **الخروج (useOut):** خلال 9 إطارات بمنحنى `ease.in`، والخلفية Backdrop خلال 8 إطارات.
- **البطاقات (Card):**
  - **الدخول:** spring snappy، ترتفع من 70، وتكبر من 0.6 إلى 1، وتدور من −14° إلى 0°، والشفافية `min(1, p×1.6)`.
  - **الحركة الخفيفة:** تدور `sin(frame/26 + seed.length)×1.2°`.
  - **الخروج:** تصعد 40، وتصغر حتى 0.85.
- **التتابع:**
  - كلمات العناوين: 5 إطارات بين كل كلمة.
  - شرارات Sparks: 3 إطارات.
  - علامات العدّ: 6 إطارات.
  - بطاقات s7: 5 إطارات.
  - أسهم s7: 5 إطارات.
  - خربشات s8: 12 إطاراً.
- **الانتقال بين المشاهد:** لا يوجد قطع ولا transitions جاهزة.
  - **طبقة الفيديو:** تنتقل بين حالات A و B و C بمزج خطي للقيم (المقياس، والموضع، والدوران، والإطار، والشفافية) خلال **0.3 ثانية (9 إطارات)** بمنحنى `ease.out`.
  - **الخلفية والعناصر:** تظهر وتختفي بالـ spring و useOut.
  - **إطار عبدالله:** حالة C تعني مقياس 0.4، وإزاحة (−120,−300)، ودوران −6°، وشفافية 0، فيبدو الإطار كأنه يطير ويختفي.
- **الكاميرا (زوم على عبدالله):** نقطة الزوم عند `50% 30%`، أي عند الوجه، ولا يعمل إلا في مشاهد A:
  - s1 من 1 إلى 1.05.
  - s4a من 1 إلى 1.12 خلال 0.57 ثانية.
  - s5 من 1 إلى 1.06.
  - s8 من 1 إلى 1.05.
  - s10 من 1 إلى 1.08.
  - الكل بمنحنى `ease.inOut`.
- **الفيديو الأصلي:** **طبقة `OffthreadVideo` واحدة مستمرة** طوال 1079 إطاراً، فلا يُقطع الصوت ولا التزامن.

---

## 6) الصوت
- **الموسيقى:** **لا توجد موسيقى.** الملف `pad.wav` موجود في المشروع لكنه غير مستخدم في 31.
- **المؤثرات:** ملفات WAV مولّدة بالكود عبر `scripts/make-sfx.mjs`، أحادية القناة، 16-bit، بتردد 44.1kHz.
- **حساب المستوى:** `GAIN × 0.92 × vol`، والـ 0.92 هو تخفيض الـ 8% الذي طلبته. كل مؤثر داخل `<Sequence>` مدته 48 إطاراً (1.6 ثانية)، ويخفت صوته في آخر 6 إطارات.
- **المستوى الأساسي لكل مؤثر (GAIN):** whoosh 0.16، paper 0.24، pop 0.18، click 0.2، chime 0.3.
- **النتيجة:** العلوّ الإجمالي -16.5 LUFS، وكان قبل المؤثرات -16.6.

| الإطار | الثانية | الملف | الحجم الفعلي (خطي) | ≈ dB | ملاحظة |
|---|---|---|---|---|---|
| 4 | 0.12 | `sfx/paper.wav` | 0.221 | -13.1 | tally sheet + clock |
| 22 | 0.75 | `sfx/click.wav` | 0.184 | -14.7 | X over the sheet |
| 164 | 5.45 | `sfx/whoosh.wav` | 0.147 | -16.6 | → collage |
| 170 | 5.68 | `sfx/paper.wav` | 0.221 | -13.1 | deck fans out |
| 218 | 7.25 | `sfx/pop.wav` | 0.132 | -17.6 | eye |
| 245 | 8.17 | `sfx/whoosh.wav` | 0.118 | -18.6 | → paper frame |
| 252 | 8.4 | `sfx/click.wav` | 0.184 | -14.7 | stamp |
| 350 | 11.68 | `sfx/whoosh.wav` | 0.147 | -16.6 | back to Abdullah + push-in |
| 391 | 13.02 | `sfx/whoosh.wav` | 0.147 | -16.6 | → collage |
| 414 | 13.8 | `sfx/paper.wav` | 0.199 | -14.0 | mastery tears away |
| 448 | 14.95 | `sfx/paper.wav` | 0.221 | -13.1 | exam sheet |
| 499 | 16.65 | `sfx/whoosh.wav` | 0.118 | -18.6 |  |
| 506 | 16.85 | `sfx/paper.wav` | 0.155 | -16.2 |  |
| 518 | 17.25 | `sfx/paper.wav` | 0.132 | -17.6 |  |
| 530 | 17.65 | `sfx/paper.wav` | 0.132 | -17.6 |  |
| 563 | 18.78 | `sfx/pop.wav` | 0.166 | -15.6 | "المتداخل" |
| 614 | 20.45 | `sfx/whoosh.wav` | 0.118 | -18.6 |  |
| 640 | 21.35 | `sfx/click.wav` | 0.184 | -14.7 | X |
| 675 | 22.5 | `sfx/whoosh.wav` | 0.147 | -16.6 | → clock collage |
| 680 | 22.68 | `sfx/paper.wav` | 0.221 | -13.1 |  |
| 749 | 24.98 | `sfx/click.wav` | 0.129 | -17.8 | shuffle beat 1 |
| 788 | 26.25 | `sfx/paper.wav` | 0.177 | -15.1 | shuffle beat 2 |
| 808 | 26.95 | `sfx/paper.wav` | 0.155 | -16.2 | shuffle beat 3 |
| 832 | 27.74 | `sfx/whoosh.wav` | 0.118 | -18.6 |  |
| 925 | 30.83 | `sfx/whoosh.wav` | 0.118 | -18.6 | → network head |
| 984 | 32.8 | `sfx/pop.wav` | 0.132 | -17.6 | "روابط قوية" |
| 1019 | 33.95 | `sfx/whoosh.wav` | 0.088 | -21.1 |  |
| 1055 | 35.18 | `sfx/chime.wav` | 0.276 | -11.2 | "طويلة المدى" |

---

## 7) النصوص والكابشن

**القاعدة:**
- **الكلمات الكبيرة:** من خريطة المشاهد في البرومبت، من كلمة إلى أربع كلمات في كل لحظة.
- **الكابشن:** كل مقطع SRT يظهر ككابشن، **إلا** إذا كان على الشاشة في نفس الوقت عنوان، ووُجد في نص المقطع `min(2, عدد كلمات العنوان)` من كلماته على الأقل.
- **عيب في القاعدة:** عند "التدريب المتداخل"، المقطعان "ما يسمى بالتدريب" و"المتداخل" لم يُحذفا، لأن كل واحد منهما فيه كلمة واحدة فقط من العنوان، فظهرا مكررين مع العنوان.

**الكلمات الكبيرة (Keyword في `kit.tsx`):**
- **الخط:** NotoKufi بوزن 900. الحجم الافتراضي 104، والارتفاع 1.5.
- **المكان:** `left` و`right` بقيمة 120، والمحاذاة في المنتصف، والاتجاه RTL.
- **دخول كل كلمة:** spring snappy بفارق 5 إطارات، تصعد من `size×0.45`، وتكبر من 0.86 إلى 1، والتمويه من 10 إلى 0 بكسل، مع `drop-shadow(0 8px 18px rgba(0,0,0,.55))`.
- **الكلمة المميزة:**
  - **اللون:** تدرّج ذهبي أو سماوي داخل الحروف (`background-clip: text`).
  - **الخط تحتها:** يُرسم بين الإطار `at+i×5+8` والإطار `+20`، بسماكة 5، تحت الكلمة بـ `size×0.2`.
- **خلفية للوضوح:** بقعة بيضاوية خلف السطر، `radial-gradient` بلون `rgba(4,10,22,.78)` إلى `.45` ثم شفاف، مع تمويه 28 بكسل. تكبر من 0.6 إلى 1.25 بـ spring smooth.
- **الخروج:** خلال 9 إطارات، تصعد 24 بكسل.

**جدول الكلمات الكبيرة:**

| الثواني | الكلمات | y | الحجم | المميزة |
|---|---|---|---|---|
| 0.03–2.95 | أسرع طريقة تفشل | 1030 | 104 | تفشل (ذهبي) |
| 3.0–5.45 | نفس النمط | 1030 | 120 | — |
| 5.6–7.25 | شكل واحد | 250 | 116 | — |
| 7.3–8.2 | يخدعك | 250 | 130 | يخدعك (سماوي) |
| 8.3–9.65 | شعور مؤقت | 1250 | 104 | — |
| 9.7–11.7 | أتقنت؟ | 1250 | 120 | — |
| 11.75–13.05 | لكن الصدمة | 1030 | 116 | الصدمة |
| 13.85–16.65 | يتبخر | 250 | 120 | — |
| 16.8–18.8 | الحل المثبت | 1030 | 104 | — |
| 18.85–20.45 | التدريب المتداخل | 1030 | 112 | المتداخل |
| 20.55–22.5 | لا تمرين واحد | 1250 | 104 | — |
| 22.6–26.2 | 3 أشكال | 250 | 116 | 3 |
| 26.27–27.75 | ترتيب عشوائي | 250 | 116 | عشوائي (سماوي) |
| 29.7–30.85 | بيتعب عقلك | 1030 | 104 | — |
| 30.9–32.8 | المجهود يبني | 250 | 104 | — |
| 32.85–33.98 | روابط قوية | 250 | 116 | قوية |
| 34.83–36.0 | الذاكرة | 990 | 118 | — |
| 35.23–36.0 | طويلة المدى | 1135 | 118 | — |

**الكابشن (Captions في `Words.tsx`):**
- **الخط:** PlexArabic بوزن 600، بحجم 52، والارتفاع 1.45، ولون `chalk`.
- **المكان:** `top: 1410`، و`left` و`right` بقيمة 140.
- **الوضوح:** ظل `0 2px 3px rgba(0,0,0,.7), 0 6px 22px rgba(0,0,0,.6)`، وتدرّج ثابت أسفل الشاشة من 62% إلى 100% (شفاف ثم `rgba(4,10,22,.55)` ثم `.7`).
- **الحركة:** الكلمات تظهر بـ spring snappy، وتصعد من 12 بكسل إلى 0. لا يوجد خروج، فالمقطع يختفي فجأة عند نهايته.

**المقاطع التي ظهرت ككابشن والتي حُذفت** (الإطارات):

| الإطارات | النص | الحالة |
|---|---|---|
| 1–35 | أسرع طريقة تفشل | محذوف (موجود كعنوان) |
| 35–61 | فيها بتثبيت أي | كابشن |
| 61–107 | مهارة هي أن تكرر | كابشن |
| 107–148 | نفس النمط لساعات | محذوف (موجود كعنوان) |
| 148–165 | متواصلة | كابشن |
| 165–197 | التدريب على شكل | كابشن |
| 197–220 | واحد أو صورة | كابشن |
| 220–246 | واحدة يخدعك | محذوف (موجود كعنوان) |
| 247–290 | يعطيك شعور مؤقت | محذوف (موجود كعنوان) |
| 290–328 | أنك أتقنت الفكرة | محذوف (موجود كعنوان) |
| 328–352 | في نفس اللحظة | كابشن |
| 352–392 | لكن الصدمة أن | محذوف (موجود كعنوان) |
| 392–415 | هذا الإتقان | كابشن |
| 415–451 | يتبخر عند أول | محذوف (موجود كعنوان) |
| 451–479 | اختبار حقيقي على | كابشن |
| 479–497 | أرض الواقع | كابشن |
| 503–528 | الحل المثبت في | محذوف (موجود كعنوان) |
| 528–565 | أبحاث التعلم هو | كابشن |
| 565–598 | ما يسمى بالتدريب | كابشن |
| 598–615 | المتداخل | كابشن |
| 615–640 | لا تركز على | كابشن |
| 640–660 | تمرين واحد | محذوف (موجود كعنوان) |
| 660–676 | في الجلسة | كابشن |
| 677–719 | اخلط ثلاثة أشكال | كابشن |
| 719–750 | أو أدوات مختلفة | كابشن |
| 750–788 | داخل نفس الساعة | كابشن |
| 788–830 | وبترتيب عشوائي | محذوف (موجود كعنوان) |
| 835–862 | صحيح أن التنقل | كابشن |
| 862–892 | بين أنماط مختلفة | كابشن |
| 892–911 | بيتعب عقلك في | محذوف (موجود كعنوان) |
| 911–926 | البداية | كابشن |
| 926–961 | لكن هذا المجهود | كابشن |
| 961–985 | بالذات يبني | كابشن |
| 985–1021 | روابط قوية ويحفر | محذوف (موجود كعنوان) |
| 1021–1045 | هذه المهارة في | كابشن |
| 1045–1057 | الذاكرة | محذوف (موجود كعنوان) |
| 1057–1078 | طويلة المدى | محذوف (موجود كعنوان) |

---

## 8) الرندر

```bash
cd my-remotion-video
npx remotion render Abdullah-31 out/abdullah-31.mp4 \
  --codec=h264 --crf=18 --pixel-format=yuv420p \
  --audio-codec=aac --audio-bitrate=192k --overwrite \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

**الناتج والفحص:**
- **الحجم:** 30.4 MB.
- **المدة:** 35.968 ثانية، مطابقة للأصل.
- **الصوت:** AAC بتردد 48kHz وجودة حوالي 189kbps.
- **ملاحظة:** ffprobe يقرأ صيغة الألوان `yuvj420p`، مع أني طلبت `yuv420p`.
- **التزامن:** قارنت إطارات من الأصل والناتج عند الثانية 3 و19 و35، وكانت متطابقة.

**مشاكل وحلول:**
1. **Remotion لم يستطع تنزيل Chrome** (`ENOTFOUND remotion.media`)، لأن الشبكة في البيئة السحابية مقيّدة. استخدمت متصفح `headless_shell` من Playwright المثبت مسبقاً، بالخيار `--browser-executable`.
2. **ملف الفيديو الخام 53MB**، فلم أرفعه إلى git. وضعته في `public/clients/abdullah-almashhor/31.mp4`، واستثنيته في `.gitignore`، وكتبت سكربت ينزّله من GitHub Release.
3. **قراءة `timing.json` من TypeScript:** أضفت `resolveJsonModule` في `tsconfig.json`.
4. **الخط تحت الكلمة المميزة كان يظهر مقطّعاً** بسبب `vectorEffect="non-scaling-stroke"` مع `pathLength`. حذفته، وأنزلت الخط تحت الحروف.
5. **أثناء المراجعة:** صدّرت صوراً بالأمر `npx remotion still Abdullah-31 … --frame=N --scale=0.5`. وصدّرت الصوت وحده للمراجعة بالأمر `--codec=mp3`.

---

## 9) رأيي

**أهم 5 قرارات تصميم:**
1. **الفيديو الأصلي طبقة واحدة مستمرة.** طبقة `OffthreadVideo` واحدة، وأغيّر فقط "إطارها": كامل الشاشة، أو ورقة مائلة، أو مخفية. هذا يضمن صفر قطع في الصوت والشفاه، وانتقالات ناعمة بين المشاهد.
2. **ثلاثة ألوان فقط** (كحلي، ذهبي، كريمي)، والسماوي كتوهّج نادر. كلها مأخوذة من صور الستايل الخمس.
3. **الورق الممزق في كل شيء**، مولّد بالكود (`clip-path`) وليس صوراً، فيبقى ثابتاً في كل رندر ويُعاد استخدامه بأي مقاس.
4. **فلتر الحبر الذهبي (GoldInkDefs).** فلتر واحد يحوّل كل الخطوط اليدوية إلى ذهب متوهج، فتتوحد كل الأسهم والخربشات بصرياً.
5. **فصل الكلمات الكبيرة عن الكابشن.** الكلمة الكبيرة تشرح الفكرة، والكابشن يغطي بقية الكلام، ولا يظهر الاثنان بنفس المعنى في نفس اللحظة. والقرار مكمّل بخلفية ضبابية خلف النص بدل الصناديق.

**ما عُمل يدوياً أو خارج الكود:**
- **الملفات الخام:** نزّلت ملفات الإصدار بـ `curl` من GitHub Release.
- **الخطوط:** نزّلتها بالأمر `npm pack @fontsource/...`، ونسخت منها ملفات woff2 إلى `public/fonts`.
- **التوقيت:** حوّلت الـ SRT إلى `timing.json` بسكربت Python صغير، وهو غير محفوظ في المشروع، والناتج هو الملف نفسه. وحدود المشاهد كتبتها يدوياً.
- **المؤثرات الصوتية:** ولّدتها في جلسة سابقة بالسكربت `scripts/make-sfx.mjs`.
- **صور الستايل:** `style-01..05.webp` موجودة للمرجع فقط، ولا يقرأها الكود.
- **ملفات لم تُستخدم في 31:** الصور الثابتة `31-stills/` والنسختان v2 و v3 جاءت بعد هذا الفيديو.

---

## 2) الكود المصدري كاملاً: كل ملفات `src/` كما كانت عند commit `06458fd`


### `my-remotion-video/src/Root.tsx`

```tsx
import "./index.css";
import "./fonts";
import { Composition } from "remotion";
import { StudyReel } from "./clients/abdullah-almashhor/StudyReel";
import { VIDEO } from "./shared/theme";
import { Video31 } from "./clients/abdullah-almashhor/video31/Video31";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StudyReel"
        component={StudyReel}
        durationInFrames={VIDEO.durationInSeconds * VIDEO.fps}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="Abdullah-31"
        component={Video31}
        durationInFrames={1079}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
```

### `my-remotion-video/src/clients/abdullah-almashhor/StudyReel.tsx`

```tsx
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { TornBackdrop } from "./components/TornBackdrop";
import { GoldInkDefs } from "./components/GoldInkDefs";
import { Grade, Grain, Vignette } from "../../shared/components/Overlays";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Hook } from "./scenes/Scene2Hook";
import { Scene3Points } from "./scenes/Scene3Points";
import { Scene4Cta } from "./scenes/Scene4Cta";

const SCENES = [
  { key: "scene1", Component: Scene1Intro },
  { key: "scene2", Component: Scene2Hook },
  { key: "scene3", Component: Scene3Points },
  { key: "scene4", Component: Scene4Cta },
] as const;

type Sfx = { at: number; src: string; volume: number };

// Cue times in seconds. SFX land 2–3 frames before the visual hit.
const SFX: Sfx[] = [
  { at: 0.0, src: "pop", volume: 0.45 },
  { at: 0.2, src: "whoosh", volume: 0.35 },
  { at: 0.95, src: "paper", volume: 0.6 },
  { at: 2.3, src: "whoosh", volume: 0.25 },
  { at: 4.8, src: "whoosh", volume: 0.3 },
  { at: 5.0, src: "thump", volume: 0.6 },
  { at: 5.65, src: "pop", volume: 0.35 },
  { at: 6.45, src: "whoosh", volume: 0.2 },
  { at: 6.95, src: "paper", volume: 0.6 },
  { at: 7.3, src: "paper", volume: 0.4 },
  { at: 8.0, src: "paper", volume: 0.5 },
  { at: 8.35, src: "pop", volume: 0.3 },
  { at: 11.8, src: "whoosh", volume: 0.3 },
  { at: 12.0, src: "thump", volume: 0.6 },
  { at: 12.25, src: "paper", volume: 0.6 },
  { at: 13.2, src: "paper", volume: 0.6 },
  { at: 14.15, src: "paper", volume: 0.6 },
  { at: 15.28, src: "pop", volume: 0.35 },
  { at: 15.48, src: "pop", volume: 0.35 },
  { at: 15.68, src: "pop", volume: 0.35 },
  { at: 17.8, src: "whoosh", volume: 0.3 },
  { at: 18.0, src: "thump", volume: 0.6 },
  { at: 18.85, src: "click", volume: 0.6 },
  { at: 18.92, src: "chime", volume: 0.55 },
];

export const StudyReel: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (seconds: number) => Math.round(seconds * fps);

  return (
    <AbsoluteFill style={{ direction: "rtl", backgroundColor: theme.colors.bgDeep }}>
      <GoldInkDefs />
      {/* 1. background */}
      <TornBackdrop />

      {/* 2–3. assets + graphics/type, one Sequence per scene */}
      {SCENES.map(({ key, Component }) => {
        const t = theme.timing[key];
        return (
          <Sequence key={key} name={key} from={f(t.from)} durationInFrames={f(t.duration)} layout="none">
            <AbsoluteFill>
              <Component />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* 4. grade, 5. grain + vignette */}
      <Grade />
      <Grain />
      <Vignette />

      {/* Sound */}
      <Audio src={staticFile("sfx/pad.wav")} volume={0.55} />
      {SFX.map((cue, i) => (
        <Sequence key={i} from={Math.max(0, f(cue.at))} durationInFrames={f(1.6)} layout="none" name={`sfx-${cue.src}`}>
          <Audio src={staticFile(`sfx/${cue.src}.wav`)} volume={cue.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
```

### `my-remotion-video/src/clients/abdullah-almashhor/components/GoldInkDefs.tsx`

```tsx
// Replaces the shared chalk filter (same id "chalk") with crisp gold-leaf ink + soft glow,
// so every ChalkLine / DashedArrow / Sparks in this client's scenes renders as gold line art.
export const GoldInkDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter id="chalk" filterUnits="userSpaceOnUse" x={-2000} y={-2000} width={6000} height={6000}>
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="0 0 0 0 0.86  0 0 0 0 0.70  0 0 0 0 0.36  0 0 0 1 0"
          result="gold"
        />
        <feGaussianBlur in="gold" stdDeviation={6} result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="gold" />
        </feMerge>
      </filter>
    </defs>
  </svg>
);
```

### `my-remotion-video/src/clients/abdullah-almashhor/components/TornBackdrop.tsx`

```tsx
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { paperBlotch, paperNoise } from "../../../shared/components/textures";
import { theme } from "../theme";

const { colors } = theme;
const W = 1080;
const H = 1920;

/** Jagged torn edge along a straight line from (x0,y0) to (x1,y1), closed toward the top or bottom. */
const tornSlab = (seed: string, y0: number, y1: number, side: "top" | "bottom", amp = 10, step = 12) => {
  const pts: string[] = [];
  const x0 = -60;
  const x1 = W + 60;
  let i = 0;
  for (let x = x0; x <= x1; x += step) {
    const t = (x - x0) / (x1 - x0);
    const y = y0 + (y1 - y0) * t + (random(`${seed}-${i++}`) - 0.5) * amp * 2;
    pts.push(`${x}px ${y.toFixed(1)}px`);
  }
  const edgeY = side === "top" ? -200 : H + 200;
  pts.push(`${x1}px ${edgeY}px`, `${x0}px ${edgeY}px`);
  return `polygon(${pts.join(", ")})`;
};

type SlabProps = {
  seed: string;
  y0: number;
  y1: number;
  side: "top" | "bottom";
  fill: string;
  drift: number;
  glow?: boolean;
};

/** One navy paper slab with a cream torn rim and a gold-leaf seam under it. */
const Slab: React.FC<SlabProps> = ({ seed, y0, y1, side, fill, drift, glow }) => {
  const dir = side === "top" ? 1 : -1;
  const layer = (off: number, background: string, amp: number, extra?: React.CSSProperties) => (
    <AbsoluteFill
      style={{
        background,
        clipPath: tornSlab(seed, y0 + off * dir, y1 + off * dir, side, amp),
        ...extra,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ transform: `translateY(${drift}px)` }}>
      {/* gold leaf seam, then cream rim, then the navy slab on top */}
      {layer(
        34,
        `linear-gradient(100deg, ${colors.yellow}, #E9CC7A 35%, #9C7A2E 60%, ${colors.yellow})`,
        14,
        { filter: "drop-shadow(0 0 14px rgba(201,162,75,0.35))" },
      )}
      {layer(18, colors.paper, 12)}
      <AbsoluteFill style={{ filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.55))" }}>
        {layer(0, `linear-gradient(${side === "top" ? 170 : 10}deg, ${fill}, ${colors.bg})`, 9)}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: tornSlab(seed, y0, y1, side, 9),
          backgroundImage: `${paperNoise}, ${paperBlotch}`,
          backgroundSize: "260px, 600px",
          mixBlendMode: "overlay",
          opacity: 0.5,
        }}
      />
      {glow ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <line
            x1={-60}
            y1={y0 + 2 * dir}
            x2={W * 0.45}
            y2={y0 + (y1 - y0) * 0.47 + 2 * dir}
            stroke={colors.teal}
            strokeWidth={5}
            style={{ filter: `drop-shadow(0 0 10px ${colors.tealGlow}) drop-shadow(0 0 24px ${colors.tealGlow})` }}
            opacity={0.8}
          />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

/** Thin gold sacred-geometry linework: orbit circles, an axis line with beads. */
const GoldGeometry: React.FC<{ frame: number }> = ({ frame }) => {
  const rot = frame * 0.06;
  const beads = [260, 520, 1500, 1720];
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.55 }}>
      <g stroke={colors.yellow} fill="none" strokeWidth={1.6}>
        <circle cx={540} cy={960} r={470} opacity={0.5} />
        <circle
          cx={540}
          cy={960}
          r={410}
          strokeDasharray="2 14"
          opacity={0.7}
          transform={`rotate(${rot} 540 960)`}
        />
        <circle cx={930} cy={260} r={300} opacity={0.35} />
        <line x1={540} y1={0} x2={540} y2={H} opacity={0.25} />
        <line x1={0} y1={960} x2={W} y2={960} opacity={0.12} />
      </g>
      {beads.map((y, i) => (
        <circle
          key={y}
          cx={540}
          cy={y + Math.sin(frame / 40 + i) * 6}
          r={i % 2 ? 6 : 9}
          fill={colors.yellow}
          style={{ filter: "drop-shadow(0 0 8px rgba(201,162,75,0.8))" }}
        />
      ))}
    </svg>
  );
};

/** Deep navy torn-paper collage with gold seams and a cyan edge glow (style-*.webp references). */
export const TornBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 70) * 10;
  const d2 = Math.cos(frame / 85) * 10;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(110% 70% at 50% 50%, ${colors.bgLift} 0%, ${colors.bg} 55%, ${colors.bgDeep} 100%)`,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: paperBlotch,
          backgroundSize: "600px",
          mixBlendMode: "overlay",
          opacity: 0.35,
        }}
      />
      <GoldGeometry frame={frame} />
      <Slab seed="top" y0={560} y1={150} side="top" fill={colors.bgLift} drift={d1} glow />
      <Slab seed="bottom" y0={1820} y1={1430} side="bottom" fill={colors.bgLift} drift={d2} />
    </AbsoluteFill>
  );
};
```

### `my-remotion-video/src/clients/abdullah-almashhor/scenes/Scene1Intro.tsx`

```tsx
import { getLength, getPointAtLength } from "@remotion/paths";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { ChalkLine, DashedArrow, Ring, Sparks } from "../../../shared/components/Chalk";
import { Bulb, Pencil } from "../../../shared/components/Icons";
import { CLAMP, useBreath, useExit, useProgress, useSeconds, useSpringAt } from "../../../shared/components/motion";
import { Paper, Tape } from "../../../shared/components/Paper";
import { WordReveal } from "../../../shared/components/WordReveal";

const { colors, fonts } = theme;

const SCRIBBLE = {
  x: 290,
  y: 1330,
  d: "M300 80 C230 60 140 40 120 90 C100 150 210 160 200 100 C190 40 80 60 20 120",
};
const SCRIBBLE_LEN = getLength(SCRIBBLE.d);
const PENCIL = { length: 430, tipX: 430 * 0.06, tipY: 430 * 0.1 };

/** 0–5s: name + tagline on the chalkboard. */
export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useSeconds();
  const exit = useExit();

  const bulbIn = useSpringAt(s(0.07), theme.spring.bouncy);
  const labelIn = useSpringAt(s(1.0), theme.spring.bouncy);
  const pencilIn = useProgress(s(2.3), s(0.6), theme.ease.out);
  const drawStart = s(2.9);
  const drawLen = s(0.9);
  const draw = useProgress(drawStart, drawLen, theme.ease.inOut);
  const pencilLift = useProgress(drawStart + drawLen, s(0.5), theme.ease.out);
  const glow = 0.6 + 0.4 * Math.sin(frame / 9);
  const float = useBreath(32, 6);
  const sway = useBreath(26, 3);

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        transform: `translateY(${-70 * exit}px) scale(${1 - 0.04 * exit})`,
        filter: `blur(${exit * 6}px)`,
      }}
    >
      {/* Light bulb idea mark */}
      <div
        style={{
          position: "absolute",
          left: 540 - 95,
          top: 380 + float,
          opacity: Math.min(1, bulbIn * 1.5),
          transform: `scale(${interpolate(bulbIn, [0, 1], [0.5, 1])}) rotate(${interpolate(bulbIn, [0, 1], [-18, 0]) + sway}deg)`,
          transformOrigin: "50% 80%",
        }}
      >
        <Bulb size={190} glow={bulbIn * glow} />
      </div>
      <Sparks x={540} y={420} delay={s(0.45)} angle={-90} size={150} count={5} color={colors.yellow} />

      {/* Name */}
      <WordReveal
        delay={s(0.25)}
        per={s(0.17)}
        gap={34}
        words={[{ text: "عبدالله" }, { text: "المشهور" }]}
        style={{
          position: "absolute",
          top: 720,
          left: 0,
          right: 0,
          fontFamily: fonts.display,
          fontWeight: 900,
          fontSize: 132,
          lineHeight: 1.3,
          color: colors.chalk,
          textShadow: "0 8px 30px rgba(0,0,0,0.45)",
          transform: `translateY(${float * 0.4}px)`,
        }}
      />
      <ChalkLine
        x={200}
        y={905}
        width={680}
        height={60}
        delay={s(0.8)}
        duration={s(0.5)}
        d="M660 22 C520 40 330 8 150 30 C90 36 40 30 18 40"
        strokeWidth={8}
      />

      {/* Tagline on a teal torn label */}
      <div
        style={{
          position: "absolute",
          left: 540 - 250,
          top: 1010,
          opacity: Math.min(1, labelIn * 1.6),
          transform: `scale(${interpolate(labelIn, [0, 1], [1.35, 1])}) rotate(${interpolate(labelIn, [0, 1], [-12, -3]) + sway * 0.3}deg)`,
        }}
      >
        <Paper width={500} height={130} color={colors.bgLift} seed="tagline">
          <span
            style={{
              fontFamily: fonts.label,
              fontWeight: 700,
              fontSize: 66,
              color: colors.chalk,
              direction: "rtl",
              marginTop: -6,
            }}
          >
            تعليم وريادة
          </span>
        </Paper>
        <Tape seed="tagline-tape" color={colors.yellow} width={120} height={44} style={{ top: -18, right: -30, transform: "rotate(28deg)" }} />
      </div>
      <Sparks x={830} y={1020} delay={s(1.3)} angle={-40} size={60} />

      {/* Ambient doodles */}
      <DashedArrow
        id="s1-arrow"
        x={90}
        y={560}
        width={220}
        height={360}
        delay={s(0.6)}
        d="M150 20 C40 60 30 200 120 300"
        head="M86 284 L122 304 L130 264"
      />
      <Ring x={150} y={1240} r={18} delay={s(0.5)} color={colors.teal} />
      <Ring x={930} y={640} r={14} delay={s(0.7)} color={colors.chalk} phase={1.4} />
      <Ring x={880} y={1330} r={12} delay={s(1.1)} color={colors.yellow} phase={2.1} />

      {/* Pencil slides in at 2.3s, then its tip traces the chalk scribble */}
      <ChalkLine
        x={SCRIBBLE.x}
        y={SCRIBBLE.y}
        width={320}
        height={200}
        delay={drawStart}
        duration={drawLen}
        easing={theme.ease.inOut}
        d={SCRIBBLE.d}
        strokeWidth={7}
      />
      {(() => {
        const pt = getPointAtLength(SCRIBBLE.d, SCRIBBLE_LEN * draw) ?? { x: 0, y: 0 };
        const tipX = SCRIBBLE.x + pt.x;
        const tipY = SCRIBBLE.y + pt.y;
        return (
          <div
            style={{
              position: "absolute",
              left: tipX - PENCIL.tipX + interpolate(pencilIn, [0, 1], [700, 0]) - pencilLift * 40,
              top: tipY - PENCIL.tipY - interpolate(pencilIn, [0, 1], [260, 0]) - pencilLift * 30,
              transformOrigin: `${PENCIL.tipX}px ${PENCIL.tipY}px`,
              transform: `rotate(${interpolate(pencilIn, [0, 1], [-10, -38]) + Math.sin(frame / 3) * draw * (1 - draw) * 6}deg)`,
              opacity: interpolate(pencilIn, [0, 0.25], [0, 1], CLAMP),
            }}
          >
            <Pencil length={PENCIL.length} />
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};
```

### `my-remotion-video/src/clients/abdullah-almashhor/scenes/Scene2Hook.tsx`

```tsx
import { AbsoluteFill, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { ChalkLine, Ring, Sparks } from "../../../shared/components/Chalk";
import { ChartArt } from "../../../shared/components/Icons";
import { useBreath, useExit, useProgress, useSeconds, useSpringAt } from "../../../shared/components/motion";
import { Paper, Tape } from "../../../shared/components/Paper";
import { WordReveal } from "../../../shared/components/WordReveal";

const { colors, fonts } = theme;

const headline: React.CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 116,
  lineHeight: 1.35,
  color: colors.chalk,
  textShadow: "0 8px 30px rgba(0,0,0,0.45)",
};

/** 5–12s: the core promise, the supporting line, and a rising chart. */
export const Scene2Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSeconds();
  const exit = useExit();

  const highlight = useProgress(s(0.75), s(0.35));
  const strike = s(1.5);
  const cardIn = useSpringAt(s(2.0));
  const tapeIn = useSpringAt(s(2.35), theme.spring.bouncy);
  const chartIn = useSpringAt(s(3.0));
  const bars = [0, 1, 2, 3].map((i) =>
    spring({ frame: frame - s(3.35) - i * 4, fps, config: theme.spring.snappy }),
  );
  const arrow = useProgress(s(3.8), s(0.7), theme.ease.inOut);
  const float = useBreath(34, 5);

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        transform: `translateY(${-70 * exit}px) scale(${1 - 0.04 * exit})`,
        filter: `blur(${exit * 6}px)`,
      }}
    >
      <div style={{ position: "absolute", top: 410, left: 60, right: 60, transform: `translateY(${float * 0.5}px)` }}>
        <WordReveal
          delay={s(0.1)}
          per={s(0.14)}
          gap={30}
          words={[{ text: "الدراسة" }, { text: "بذكاء...", key: "smart" }]}
          style={headline}
          renderWord={(w) =>
            w.key === "smart" ? (
              <>
                <span
                  style={{
                    position: "absolute",
                    left: -18,
                    right: -18,
                    top: "22%",
                    bottom: "8%",
                    background: colors.yellow,
                    transform: `scaleX(${highlight}) rotate(-1.5deg)`,
                    transformOrigin: "100% 50%",
                    borderRadius: 6,
                    boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
                  }}
                />
                <span
                  style={{
                    position: "relative",
                    color: interpolateColors(highlight, [0, 0.6], [colors.chalk, colors.ink]),
                    textShadow: "none",
                  }}
                >
                  {w.text}
                </span>
              </>
            ) : (
              w.text
            )
          }
        />
        <WordReveal
          delay={s(0.45)}
          per={s(0.14)}
          gap={30}
          words={[
            { text: "مش", style: { color: colors.chalkDim } },
            { text: "بجهد" },
            { text: "مضاعف" },
          ]}
          style={{ ...headline, marginTop: 6 }}
        />
        {/* Chalk strike through "بجهد مضاعف" — the effort we're dropping */}
        <ChalkLine
          x={40}
          y={232}
          width={740}
          height={60}
          delay={strike}
          duration={s(0.35)}
          d="M720 34 C520 22 260 40 20 26"
          strokeWidth={9}
          color={colors.yellow}
          opacity={0.85}
        />
      </div>

      {/* Supporting line on torn paper */}
      <div
        style={{
          position: "absolute",
          left: 540 - 450,
          top: 870,
          opacity: Math.min(1, cardIn * 1.5),
          transform: `translateY(${interpolate(cardIn, [0, 1], [140, 0]) + float * 0.4}px) rotate(${interpolate(cardIn, [0, 1], [7, 1.5])}deg)`,
        }}
      >
        <Paper width={900} height={200} color={colors.paper} rim={0} seed="sub-card">
          <span
            style={{
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 58,
              color: colors.ink,
              direction: "rtl",
            }}
          >
            تعلم كيف تذاكر <span style={{ color: colors.grey }}>أقل</span> وتحفظ{" "}
            <span style={{ color: colors.bgLift }}>أكثر</span>
          </span>
        </Paper>
        <Tape
          seed="sub-tape"
          width={190}
          height={56}
          style={{
            top: -26,
            left: 355,
            opacity: Math.min(0.88, tapeIn),
            transform: `rotate(-4deg) scale(${interpolate(tapeIn, [0, 1], [1.4, 1])})`,
          }}
        />
      </div>

      {/* Rising chart — "memorise more" made visible */}
      <div
        style={{
          position: "absolute",
          left: 540 - 300,
          top: 1180,
          opacity: Math.min(1, chartIn * 1.5),
          transform: `translateY(${interpolate(chartIn, [0, 1], [160, 0]) - float * 0.4}px) rotate(${interpolate(chartIn, [0, 1], [-9, -3])}deg)`,
        }}
      >
        <Paper width={600} height={380} color={colors.paperShade} seed="chart" rim={0}>
          <ChartArt width={580} height={360} bars={bars} arrow={arrow} />
        </Paper>
      </div>
      <Sparks x={860} y={1170} delay={s(4.4)} angle={-50} size={70} color={colors.yellow} />

      <Ring x={140} y={380} r={14} delay={s(0.3)} color={colors.teal} />
      <Ring x={950} y={1520} r={18} delay={s(3.2)} color={colors.chalk} phase={1} />
    </AbsoluteFill>
  );
};
```

### `my-remotion-video/src/clients/abdullah-almashhor/scenes/Scene3Points.tsx`

```tsx
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { ChalkLine, DashedArrow, Ring } from "../../../shared/components/Chalk";
import { Gear, QuestionIcon, RepeatIcon, TargetIcon } from "../../../shared/components/Icons";
import { useExit, useSeconds } from "../../../shared/components/motion";
import { Paper, Tape } from "../../../shared/components/Paper";

const { colors, fonts } = theme;

type Point = {
  text: string;
  color: string;
  ink: string;
  tile: string;
  icon: (size: number, color: string) => React.ReactNode;
  rotate: number;
};

const POINTS: Point[] = [
  {
    text: "التكرار المتباعد",
    color: colors.bgLift,
    ink: colors.chalk,
    tile: colors.bg,
    icon: (size, c) => <RepeatIcon size={size} color={c} />,
    rotate: -1.6,
  },
  {
    text: "التركيز العميق",
    color: colors.yellow,
    ink: colors.ink,
    tile: "#C99F25",
    icon: (size, c) => <TargetIcon size={size} color={c} />,
    rotate: 1.2,
  },
  {
    text: "الأسئلة الصحيحة",
    color: colors.paper,
    ink: colors.ink,
    tile: colors.paperShade,
    icon: (size, c) => <QuestionIcon size={size} color={c} fontFamily={fonts.display} />,
    rotate: -0.8,
  },
];

const CARD = { w: 880, h: 200, gap: 54, top: 620 };

/** 12–18s: three study techniques, pasted on one by one, then ticked off. */
export const Scene3Points: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSeconds();
  const exit = useExit();
  const gearSpin = frame * 0.9;
  const gearsIn = spring({ frame: frame - s(0.05), fps, config: theme.spring.bouncy });

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        transform: `translateY(${-70 * exit}px) scale(${1 - 0.04 * exit})`,
        filter: `blur(${exit * 6}px)`,
      }}
    >
      {/* Gears turning — "how the mind works" */}
      <div
        style={{
          position: "absolute",
          left: 540 - 150,
          top: 330,
          width: 300,
          height: 220,
          opacity: Math.min(1, gearsIn * 1.5),
          transform: `scale(${interpolate(gearsIn, [0, 1], [0.6, 1])})`,
        }}
      >
        <div style={{ position: "absolute", left: 30, top: 20 }}>
          <Gear size={170} rotate={gearSpin} />
        </div>
        <div style={{ position: "absolute", left: 172, top: 92 }}>
          <Gear size={112} rotate={-gearSpin * 1.5 + 18} />
        </div>
      </div>

      {POINTS.map((pt, i) => {
        const delay = s(0.3) + i * s(0.95);
        const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
        const tape = spring({ frame: frame - delay - 6, fps, config: theme.spring.bouncy });
        const breathe = Math.sin(frame / 30 + i * 1.3) * 3;
        return (
          <div
            key={pt.text}
            style={{
              position: "absolute",
              left: 540 - CARD.w / 2,
              top: CARD.top + i * (CARD.h + CARD.gap) + breathe,
              opacity: Math.min(1, p * 1.6),
              transform: `translateX(${interpolate(p, [0, 1], [220, 0])}px) scale(${interpolate(p, [0, 1], [1.08, 1])}) rotate(${interpolate(p, [0, 1], [7, pt.rotate])}deg)`,
            }}
          >
            <Paper width={CARD.w} height={CARD.h} color={pt.color} seed={`point-${i}`}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  direction: "rtl",
                  alignItems: "center",
                  gap: 40,
                  padding: "0 34px",
                }}
              >
                <div
                  style={{
                    width: 132,
                    height: 132,
                    borderRadius: 18,
                    background: pt.tile,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "inset 0 -6px 0 rgba(0,0,0,0.12)",
                  }}
                >
                  {pt.icon(96, pt.ink)}
                </div>
                <span
                  style={{
                    fontFamily: fonts.display,
                    fontWeight: 800,
                    fontSize: 72,
                    color: pt.ink,
                    marginTop: -8,
                  }}
                >
                  {pt.text}
                </span>
              </div>
            </Paper>
            <Tape
              seed={`point-tape-${i}`}
              color={i === 0 ? colors.yellow : colors.paper}
              width={130}
              height={46}
              style={{
                top: -20,
                left: -34,
                opacity: Math.min(0.88, tape),
                transform: `rotate(-32deg) scale(${interpolate(tape, [0, 1], [1.5, 1])})`,
              }}
            />
          </div>
        );
      })}

      {/* Chalk ticks once all three are on the board */}
      {POINTS.map((pt, i) => (
        <ChalkLine
          key={i}
          x={150}
          y={CARD.top + i * (CARD.h + CARD.gap) + 40}
          width={120}
          height={120}
          delay={s(3.3) + i * s(0.2)}
          duration={s(0.3)}
          d="M18 62 L48 92 L104 22"
          strokeWidth={11}
          color={pt.ink}
          opacity={0.95}
        />
      ))}

      <DashedArrow
        id="s3-arrow"
        x={800}
        y={1360}
        width={200}
        height={240}
        delay={s(3.8)}
        d="M150 20 C190 110 140 180 40 200"
        head="M70 176 L36 200 L74 222"
      />
      <Ring x={160} y={1460} r={16} delay={s(2.6)} color={colors.yellow} />
      <Ring x={920} y={420} r={12} delay={s(0.6)} color={colors.teal} phase={2} />
    </AbsoluteFill>
  );
};
```

### `my-remotion-video/src/clients/abdullah-almashhor/scenes/Scene4Cta.tsx`

```tsx
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { Ring, Sparks } from "../../../shared/components/Chalk";
import { Cursor } from "../../../shared/components/Icons";
import { CLAMP, useBreath, useProgress, useSeconds, useSpringAt } from "../../../shared/components/motion";
import { Paper } from "../../../shared/components/Paper";
import { paperNoise } from "../../../shared/components/textures";

const { colors, fonts } = theme;
const BTN = { w: 800, h: 180, y: 820 };

/** 18–20s: one clear call to action, a click, and the handle. */
export const Scene4Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useSeconds();

  const btnIn = useSpringAt(s(0.03), theme.spring.bouncy);
  const clickAt = s(0.9);
  const cursorMove = useProgress(s(0.25), s(0.6), theme.ease.out);
  const press = useSpringAt(clickAt, theme.spring.snappy);
  const pressDip = interpolate(frame, [clickAt - 2, clickAt + 1, clickAt + 6], [0, 1, 0], {
    ...CLAMP,
    easing: theme.ease.inOut,
  });
  const ripple = useProgress(clickAt, s(0.6));
  const handleIn = useSpringAt(s(0.45), theme.spring.bouncy);
  const glow = 0.75 + 0.25 * Math.sin(frame / 8);
  const float = useBreath(24, 4);

  return (
    <AbsoluteFill>
      {/* Ripple ring from the click */}
      <div
        style={{
          position: "absolute",
          left: 540 - BTN.w / 2,
          top: BTN.y,
          width: BTN.w,
          height: BTN.h,
          borderRadius: BTN.h / 2,
          border: `5px solid ${colors.teal}`,
          opacity: ripple > 0 ? (1 - ripple) * 0.9 : 0,
          transform: `scale(${1 + ripple * 0.22})`,
        }}
      />

      {/* CTA button */}
      <div
        style={{
          position: "absolute",
          left: 540 - BTN.w / 2,
          top: BTN.y + float,
          width: BTN.w,
          height: BTN.h,
          borderRadius: BTN.h / 2,
          background: `linear-gradient(180deg, ${colors.bgLift}, ${colors.bg})`,
          boxShadow: `0 0 ${70 * glow}px ${colors.tealGlow}, 0 24px 40px rgba(0,0,0,0.45), inset 0 -8px 0 rgba(0,0,0,0.15)`,
          border: `6px solid ${colors.teal}`,
          display: "flex",
          direction: "rtl",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          overflow: "hidden",
          opacity: Math.min(1, btnIn * 1.6),
          transform: `translateY(${interpolate(btnIn, [0, 1], [90, 0])}px) scale(${interpolate(btnIn, [0, 1], [0.7, 1]) - pressDip * 0.05})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: paperNoise,
            backgroundSize: "260px",
            mixBlendMode: "multiply",
            opacity: 0.35,
          }}
        />
        <span
          style={{
            position: "relative",
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: 80,
            color: colors.chalk,
            marginTop: -10,
          }}
        >
          ابدأ رحلتك الآن
        </span>
        <svg width={64} height={64} viewBox="0 0 64 64" style={{ position: "relative" }}>
          <path
            d="M40 14 L22 32 L40 50"
            fill="none"
            stroke={colors.chalk}
            strokeWidth={9}
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`translate(${-6 * press} 0)`}
          />
        </svg>
      </div>

      <Sparks x={540 - BTN.w / 2 - 10} y={BTN.y + 20} delay={clickAt + 1} angle={-135} size={70} color={colors.yellow} />
      <Sparks x={540 + BTN.w / 2 + 10} y={BTN.y + 20} delay={clickAt + 3} angle={-45} size={70} color={colors.yellow} />

      {/* Cursor glides in from bottom-left and clicks */}
      <div
        style={{
          position: "absolute",
          left: interpolate(cursorMove, [0, 1], [-140, 277]),
          top: interpolate(cursorMove, [0, 1], [1500, BTN.y + 109]),
          transform: `scale(${1 - pressDip * 0.12}) rotate(${interpolate(cursorMove, [0, 1], [-14, 0])}deg)`,
          transformOrigin: "10% 5%",
          opacity: interpolate(cursorMove, [0, 0.15], [0, 1], CLAMP),
          filter: "drop-shadow(0 12px 16px rgba(0,0,0,0.5))",
        }}
      >
        <Cursor size={96} />
      </div>

      {/* Handle */}
      <div
        style={{
          position: "absolute",
          left: 540 - 270,
          top: 1110 - float * 0.6,
          opacity: Math.min(1, handleIn * 1.6),
          transform: `scale(${interpolate(handleIn, [0, 1], [1.3, 1])}) rotate(${interpolate(handleIn, [0, 1], [6, -2])}deg)`,
        }}
      >
        <Paper width={540} height={110} color={colors.yellow} seed="handle">
          <span
            style={{
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 52,
              color: colors.ink,
              direction: "ltr",
              marginTop: -6,
            }}
          >
            @almashhor_edu0
          </span>
        </Paper>
      </div>

      <Ring x={170} y={760} r={14} delay={s(0.2)} color={colors.chalk} />
      <Ring x={910} y={1240} r={16} delay={s(0.5)} color={colors.teal} phase={1.2} />
    </AbsoluteFill>
  );
};
```

### `my-remotion-video/src/clients/abdullah-almashhor/theme.ts`

```ts
// هوية العميل: عبدالله المشهور
// Client brand. Starts from the shared base theme; override colors/fonts here.
import { baseTheme, VIDEO } from "../../shared/theme";

export const theme = baseTheme;
export { VIDEO };
```

### `my-remotion-video/src/clients/abdullah-almashhor/video31/Footage.tsx`

```tsx
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP } from "../../../shared/components/motion";
import { colors, theme } from "./kit";
import timing from "./timing.json";

type Layout = "A" | "B" | "C";
type State = { scale: number; x: number; y: number; rot: number; frame: number; opacity: number };

// B = Abdullah inside a tilted paper frame, upper-left, keywords below it.
const STATES: Record<Layout, State> = {
  A: { scale: 1, x: 0, y: 0, rot: 0, frame: 0, opacity: 1 },
  B: { scale: 0.52, x: -120, y: -260, rot: -3, frame: 1, opacity: 1 },
  C: { scale: 0.4, x: -120, y: -300, rot: -6, frame: 1, opacity: 0 },
};

// Gentle push-ins on A shots at emphasis moments: [sceneId, startSec, endSec, zoom].
const ZOOMS: [string, number, number, number][] = [
  ["s1", 0, 5.5, 1.05],
  ["s4a", 11.73, 12.3, 1.12],
  ["s5", 18.8, 19.6, 1.06],
  ["s8", 27.8, 30.8, 1.05],
  ["s10", 34.0, 35.9, 1.08],
];

const mix = (a: State, b: State, t: number): State => ({
  scale: a.scale + (b.scale - a.scale) * t,
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  rot: a.rot + (b.rot - a.rot) * t,
  frame: a.frame + (b.frame - a.frame) * t,
  opacity: a.opacity + (b.opacity - a.opacity) * t,
});

/** The original recording as ONE continuous layer (audio + lip sync never cut); only its framing changes. */
export const Footage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scenes = timing.scenes;
  const i = Math.max(0, scenes.findIndex((s) => t >= s.from && t < s.to));
  const cur = scenes[i] ?? scenes[scenes.length - 1];
  const prev = scenes[i - 1];
  const target = STATES[cur.layout as Layout];
  const blend = prev
    ? interpolate(t, [cur.from, cur.from + 0.3], [0, 1], { ...CLAMP, easing: theme.ease.out })
    : 1;
  const s = prev ? mix(STATES[prev.layout as Layout], target, blend) : target;

  const z = ZOOMS.find(([id]) => id === cur.id);
  const zoom = z ? interpolate(t, [z[1], z[2]], [1, z[3]], { ...CLAMP, easing: theme.ease.inOut }) : 1;
  const zoomA = 1 + (zoom - 1) * (1 - s.frame);

  return (
    <AbsoluteFill
      style={{
        opacity: s.opacity,
        transform: `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg) scale(${s.scale})`,
      }}
    >
      {/* paper border + shadow, only visible when framed (B) */}
      <AbsoluteFill
        style={{
          inset: -34,
          background: colors.paper,
          opacity: s.frame,
          boxShadow: `0 40px 80px rgba(0,0,0,${0.5 * s.frame})`,
          clipPath: "polygon(0.6% 0.4%, 99.2% 0%, 100% 99.3%, 0% 100%)",
        }}
      />
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile("clients/abdullah-almashhor/31.mp4")}
          style={{ width: "100%", height: "100%", transform: `scale(${zoomA})`, transformOrigin: "50% 30%" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

### `my-remotion-video/src/clients/abdullah-almashhor/video31/Scenes.tsx`

```tsx
import { AbsoluteFill, interpolate, random, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ChalkLine, DashedArrow, Sparks } from "../../../shared/components/Chalk";
import { CLAMP } from "../../../shared/components/motion";
import { Paper } from "../../../shared/components/Paper";
import { TornBackdrop } from "../components/TornBackdrop";
import { Card, colors, fonts, Glyph, theme, useAt, useOut, useSpr } from "./kit";
import timing from "./timing.json";

const X_MARK = "M10 10 L110 110 M110 12 L14 108";

/** Collage background that fades in under C/B shots. */
const Backdrop: React.FC<{ fadeOut?: number }> = ({ fadeOut }) => {
  const p = useSpr(0, theme.spring.smooth);
  const o = useOut(fadeOut ?? 1e9, 8);
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, p * 1.4) * (1 - o) }}>
      <TornBackdrop />
    </AbsoluteFill>
  );
};

/* s1 — A: hours of the same drill — a tally sheet that keeps filling, a clock that keeps spinning. */
const S1: React.FC = () => {
  const at = useAt(0);
  const frame = useCurrentFrame();
  const sheetIn = useSpr(at(0.2), theme.spring.snappy);
  const clockIn = useSpr(at(0.35), theme.spring.snappy);
  const o = useOut(at(5.5));
  const marks = 20;
  const spin = interpolate(frame, [at(0.4), at(5.5)], [0, 2160], { ...CLAMP, easing: theme.ease.inOut });
  return (
    <AbsoluteFill style={{ opacity: 1 - o }}>
      {/* tally sheet (left) */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 440,
          opacity: Math.min(1, sheetIn * 1.5),
          transform: `translateY(${interpolate(sheetIn, [0, 1], [80, 0])}px) rotate(${interpolate(sheetIn, [0, 1], [-16, -5])}deg)`,
        }}
      >
        <Paper width={250} height={330} color={colors.chalk} seed="tally">
          <svg width={210} height={290} viewBox="0 0 210 290">
            {[0, 1, 2, 3, 4, 5].map((r) => (
              <line key={r} x1={10} x2={200} y1={40 + r * 46} y2={40 + r * 46} stroke={colors.teal} strokeOpacity={0.35} strokeWidth={2} />
            ))}
            {Array.from({ length: marks }).map((_, i) => {
              const group = Math.floor(i / 5);
              const k = i % 5;
              const start = at(0.4) + i * 6;
              const p = interpolate(frame, [start, start + 5], [0, 1], CLAMP);
              const gx = 190 - (group % 2) * 95;
              const gy = 30 + Math.floor(group / 2) * 120;
              const d = k < 4 ? `M${gx - k * 16} ${gy} L${gx - k * 16 - 4} ${gy + 70}` : `M${gx + 8} ${gy + 52} L${gx - 64} ${gy + 14}`;
              return <path key={i} d={d} stroke={colors.ink} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} fill="none" opacity={p > 0 ? 1 : 0} />;
            })}
          </svg>
        </Paper>
      </div>
      {/* clock (right) */}
      <div
        style={{
          position: "absolute",
          left: 790,
          top: 470,
          width: 230,
          height: 230,
          borderRadius: "50%",
          background: colors.bgLift,
          border: `12px solid ${colors.paper}`,
          boxSizing: "border-box",
          boxShadow: "0 20px 30px rgba(0,0,0,0.45)",
          opacity: Math.min(1, clockIn * 1.5),
          transform: `scale(${interpolate(clockIn, [0, 1], [0.5, 1])}) rotate(${interpolate(clockIn, [0, 1], [30, 4])}deg)`,
        }}
      >
        <svg width={206} height={206} viewBox="0 0 206 206">
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <line key={i} x1={103 + Math.cos(a) * 78} y1={103 + Math.sin(a) * 78} x2={103 + Math.cos(a) * 90} y2={103 + Math.sin(a) * 90} stroke={colors.chalk} strokeWidth={i % 3 ? 3 : 6} />;
          })}
          <line x1={103} y1={103} x2={103 + Math.cos(((spin - 90) * Math.PI) / 180) * 72} y2={103 + Math.sin(((spin - 90) * Math.PI) / 180) * 72} stroke={colors.yellow} strokeWidth={6} strokeLinecap="round" />
          <line x1={103} y1={103} x2={103 + Math.cos(((spin / 12 - 90) * Math.PI) / 180) * 48} y2={103 + Math.sin(((spin / 12 - 90) * Math.PI) / 180) * 48} stroke={colors.chalk} strokeWidth={8} strokeLinecap="round" />
          <circle cx={103} cy={103} r={8} fill={colors.yellow} />
        </svg>
      </div>
      <ChalkLine x={150} y={380} width={130} height={130} d={X_MARK} delay={at(0.8)} duration={8} strokeWidth={12} />
    </AbsoluteFill>
  );
};

/* s2 — C: copies of the SAME card fan out like a deck inside a loop; an eye says "it fools you". */
const S2: React.FC = () => {
  const at = useAt(5.5);
  const frame = useCurrentFrame();
  const spin = frame * 0.9;
  const fan = useSpr(at(5.7), theme.spring.smooth);
  const eyeIn = useSpr(at(7.3), theme.spring.bouncy);
  const blink = Math.abs(Math.sin((frame - at(7.6)) / 7)) > 0.97 ? 0.15 : 1;
  const o = useOut(at(8.22));
  return (
    <AbsoluteFill>
      <Backdrop fadeOut={at(8.22)} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
        <g transform={`rotate(${spin} 540 900)`}>
          <circle cx={540} cy={900} r={360} fill="none" stroke={colors.yellow} strokeWidth={4} strokeDasharray="22 18" opacity={0.75} filter="url(#chalk)" />
          <path d="M540 540 l-26 -18 M540 540 l-26 18" stroke={colors.yellow} strokeWidth={5} strokeLinecap="round" filter="url(#chalk)" />
          <path d="M540 1260 l26 -18 M540 1260 l26 18" stroke={colors.yellow} strokeWidth={5} strokeLinecap="round" filter="url(#chalk)" />
        </g>
      </svg>
      {[4, 3, 2, 1, 0].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 540 - 150,
            top: 900 - 185,
            opacity: Math.min(1, fan * 2) * (1 - o),
            transform: `translate(${(i - 2) * 46 * fan}px, ${Math.abs(i - 2) * 14 * fan}px) rotate(${(i - 2) * 9 * fan}deg)`,
            transformOrigin: "50% 120%",
          }}
        >
          <Paper width={300} height={370} color={colors.chalk} seed="same-card">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: fonts.headline, fontWeight: 900, fontSize: 46, color: colors.ink }}>تمرين ١</span>
              <Glyph kind="pen" size={120} />
            </div>
          </Paper>
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: 540 - 130,
          top: 1170,
          opacity: Math.min(1, eyeIn * 1.5) * (1 - o),
          transform: `scale(${interpolate(eyeIn, [0, 1], [0.3, 1])}) rotate(${interpolate(eyeIn, [0, 1], [20, -4])}deg)`,
        }}
      >
        <Paper width={260} height={160} color={colors.paper} seed="eye">
          <svg width={200} height={110} viewBox="0 0 200 110">
            <path d="M10 55 C60 0 140 0 190 55 C140 110 60 110 10 55 Z" fill={colors.chalk} stroke={colors.ink} strokeWidth={6} />
            <g transform={`translate(100 55) scale(1 ${blink})`}>
              <circle r={30} fill={colors.teal} />
              <circle r={14} fill={colors.ink} />
              <circle r={5} cx={-8} cy={-8} fill="#fff" />
            </g>
          </svg>
        </Paper>
      </div>
    </AbsoluteFill>
  );
};

/* s3 — B: a "done" stamp that shakes and fades — the feeling is temporary. */
const S3: React.FC = () => {
  const at = useAt(8.22);
  const frame = useCurrentFrame();
  const p = useSpr(at(8.45), theme.spring.bouncy);
  const doubt = interpolate(frame, [at(9.7), at(11.5)], [0, 1], CLAMP);
  const shake = Math.sin(frame * 1.7) * 6 * doubt;
  return (
    <AbsoluteFill>
      <Backdrop fadeOut={at(11.73)} />
      <div
        style={{
          position: "absolute",
          left: 760,
          top: 640,
          width: 250,
          height: 250,
          borderRadius: "50%",
          border: `10px solid ${colors.teal}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: colors.teal,
          fontFamily: fonts.headline,
          fontWeight: 900,
          fontSize: 60,
          opacity: Math.min(1, p * 1.5) * (1 - doubt * 0.75),
          filter: `blur(${doubt * 3}px)`,
          transform: `scale(${interpolate(p, [0, 1], [1.8, 1])}) rotate(${-14 + shake}deg) translateX(${shake}px)`,
          boxShadow: `0 0 30px ${colors.tealGlow}`,
        }}
      >
        <svg width={110} height={80} viewBox="0 0 110 80">
          <path d="M10 42 L42 70 L100 10" fill="none" stroke={colors.teal} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>أتقنت</span>
      </div>
      <Sparks x={885} y={600} delay={at(8.5)} angle={-90} size={70} />
    </AbsoluteFill>
  );
};

/* s4a — A: the shock beat (zoom handled by Footage), a few sparks. */
const S4a: React.FC = () => {
  const at = useAt(11.73);
  return (
    <AbsoluteFill>
      <Sparks x={210} y={1000} delay={at(11.8)} angle={-140} size={80} count={4} />
      <Sparks x={870} y={1000} delay={at(11.85)} angle={-40} size={80} count={4} />
    </AbsoluteFill>
  );
};

/* s4b — C: "الإتقان" on torn paper evaporates; then the first real test arrives. */
const S4b: React.FC = () => {
  const at = useAt(13.07);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = useSpr(at(13.1), theme.spring.snappy);
  const evap = (frame - at(13.85)) / fps;
  const SLICES = 7;
  const W = 760;
  const H = 300;
  const test = useSpr(at(15.0), theme.spring.snappy);
  return (
    <AbsoluteFill>
      <Backdrop fadeOut={at(16.7)} />
      <div style={{ position: "absolute", left: 540 - W / 2, top: 560, width: W, height: H }}>
        {Array.from({ length: SLICES }).map((_, i) => {
          const d = Math.max(0, evap - i * 0.08);
          const rise = d * d * 260 + d * 40;
          const drift = (random(`ev-${i}`) - 0.5) * 180 * d;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                clipPath: `polygon(${(i / SLICES) * 100}% 0, ${((i + 1) / SLICES) * 100 + 0.5}% 0, ${((i + 1) / SLICES) * 100 + 0.5}% 100%, ${(i / SLICES) * 100}% 100%)`,
                opacity: Math.min(1, inP * 1.5) * interpolate(d, [0, 1.3], [1, 0], CLAMP),
                filter: `blur(${Math.min(10, d * 8)}px)`,
                transform: `translate(${drift}px, ${interpolate(inP, [0, 1], [80, 0]) - rise}px) rotate(${(random(`evr-${i}`) - 0.5) * 30 * d}deg) scale(${interpolate(inP, [0, 1], [0.7, 1])})`,
              }}
            >
              <Paper width={W} height={H} color={colors.paper} seed="mastery">
                <span style={{ fontFamily: fonts.headline, fontWeight: 900, fontSize: 150, color: colors.ink, direction: "rtl" }}>
                  الإتقان
                </span>
              </Paper>
            </div>
          );
        })}
      </div>
      {/* the first real test: an exam sheet slides up */}
      <div
        style={{
          position: "absolute",
          left: 540 - 220,
          top: 930,
          opacity: Math.min(1, test * 1.5),
          transform: `translateY(${interpolate(test, [0, 1], [500, 0])}px) rotate(${interpolate(test, [0, 1], [12, 3])}deg)`,
        }}
      >
        <Paper width={440} height={420} color={colors.chalk} seed="exam">
          <div style={{ width: 340, direction: "rtl" }}>
            <div style={{ fontFamily: fonts.headline, fontWeight: 900, fontSize: 44, color: colors.ink, marginBottom: 18, textAlign: "center" }}>اختبار حقيقي</div>
            {[0, 1, 2, 3].map((r) => (
              <div key={r} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
                <div style={{ width: 34, height: 34, border: `5px solid ${colors.ink}`, borderRadius: 6 }} />
                <div style={{ flex: 1, height: 8, background: colors.paperShade, borderRadius: 4 }} />
              </div>
            ))}
          </div>
        </Paper>
      </div>
      <ChalkLine x={600} y={960} width={140} height={140} d="M70 10 C120 10 130 70 70 80 L70 100 M70 125 L70 128" delay={at(15.5)} duration={12} strokeWidth={12} />
    </AbsoluteFill>
  );
};

/* s5 — A: three different cards arrive around him, then overlap into "interleaved". */
const S5: React.FC = () => {
  const at = useAt(16.7);
  const frame = useCurrentFrame();
  const merge = interpolate(frame, [at(18.8), at(19.3)], [0, 1], { ...CLAMP, easing: theme.ease.inOut });
  const cards = [
    { kind: "pen" as const, color: colors.paper, from: [170, 560], to: [400, 1290], t: 16.9, rot: -8 },
    { kind: "book" as const, color: colors.yellow, from: [910, 560], to: [540, 1310], t: 17.3, rot: 6 },
    { kind: "compass" as const, color: colors.teal, from: [180, 860], to: [680, 1290], t: 17.7, rot: -3 },
  ];
  return (
    <AbsoluteFill>
      {cards.map((c, i) => (
        <Card
          key={i}
          x={c.from[0] + (c.to[0] - c.from[0]) * merge}
          y={c.from[1] + (c.to[1] - c.from[1]) * merge}
          w={180}
          h={150}
          seed={`mix-${i}`}
          at={at(c.t)}
          out={at(20.5)}
          color={c.color}
          rot={c.rot * (1 - merge * 0.5)}
        >
          <Glyph kind={c.kind} size={88} />
        </Card>
      ))}
    </AbsoluteFill>
  );
};

/* s6 — B: one exercise card gets crossed out; two different ones slide in. */
const S6: React.FC = () => {
  const at = useAt(20.5);
  return (
    <AbsoluteFill>
      <Backdrop fadeOut={at(22.55)} />
      <Card x={870} y={520} w={240} h={200} seed="one" at={at(20.6)} out={at(22.55)} rot={4}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><Glyph kind="pen" size={90} /><span style={{ fontFamily: fonts.headline, fontWeight: 900, fontSize: 36, color: colors.ink }}>تمرين ١</span></div>
      </Card>
      <ChalkLine x={780} y={450} width={150} height={150} d={X_MARK} delay={at(21.4)} duration={8} strokeWidth={14} />
      <Card x={880} y={800} w={190} h={160} seed="two" at={at(22.0)} out={at(22.55)} color={colors.yellow} rot={-5}>
        <Glyph kind="book" size={88} />
      </Card>
      <Card x={860} y={1030} w={190} h={160} seed="three" at={at(22.1)} out={at(22.55)} color={colors.teal} rot={6}>
        <Glyph kind="compass" size={88} />
      </Card>
    </AbsoluteFill>
  );
};

/* s7 — C (hero scene): three different practice types on a paper clock, shuffled at random. */
const S7: React.FC = () => {
  const at = useAt(22.55);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = { x: 540, y: 940 };
  const R = 300;
  const clockIn = useSpr(at(22.6), theme.spring.smooth);
  const hand = interpolate(frame, [at(22.6), at(27.7)], [-90, 630], { ...CLAMP, easing: theme.ease.inOut });
  // slot order changes at each shuffle beat
  const ORDERS = [
    [0, 1, 2],
    [2, 0, 1],
    [1, 2, 0],
    [0, 2, 1],
  ];
  const beats = [at(25.0), at(26.3), at(27.0)];
  const slotAngle = (slot: number) => -90 + slot * 120;
  const types = [
    { kind: "pen" as const, color: colors.paper, label: "كتابة" },
    { kind: "book" as const, color: colors.yellow, label: "قراءة" },
    { kind: "compass" as const, color: colors.teal, label: "رسم" },
  ];
  const posOf = (i: number) => {
    let a = slotAngle(ORDERS[0][i]);
    beats.forEach((b, k) => {
      const p = spring({ frame: frame - b, fps, config: theme.spring.bouncy });
      a += (slotAngle(ORDERS[k + 1][i]) - slotAngle(ORDERS[k][i])) * p;
    });
    const r = (a * Math.PI) / 180;
    return { x: C.x + Math.cos(r) * R, y: C.y + Math.sin(r) * R };
  };
  return (
    <AbsoluteFill>
      <Backdrop fadeOut={at(27.78)} />
      {/* paper clock */}
      <div
        style={{
          position: "absolute",
          left: C.x - 230,
          top: C.y - 230,
          opacity: Math.min(1, clockIn * 1.4),
          transform: `scale(${interpolate(clockIn, [0, 1], [0.5, 1])}) rotate(${interpolate(clockIn, [0, 1], [-30, 0])}deg)`,
        }}
      >
        <div style={{ width: 460, height: 460, borderRadius: "50%", background: colors.bgLift, border: `14px solid ${colors.paper}`, boxSizing: "border-box", boxShadow: "0 24px 40px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={432} height={432} viewBox="0 0 460 460">
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return (
                <line key={i} x1={230 + Math.cos(a) * 170} y1={230 + Math.sin(a) * 170} x2={230 + Math.cos(a) * (i % 3 ? 185 : 200)} y2={230 + Math.sin(a) * (i % 3 ? 185 : 200)} stroke={colors.chalk} strokeWidth={i % 3 ? 4 : 8} strokeLinecap="round" />
              );
            })}
            <g transform={`rotate(${hand} 230 230)`}>
              <line x1={230} y1={230} x2={380} y2={230} stroke={colors.yellow} strokeWidth={10} strokeLinecap="round" />
            </g>
            <g transform={`rotate(${hand / 12} 230 230)`}>
              <line x1={230} y1={230} x2={320} y2={230} stroke={colors.chalk} strokeWidth={12} strokeLinecap="round" />
            </g>
            <circle cx={230} cy={230} r={14} fill={colors.yellow} />
          </svg>
        </div>
      </div>
      {/* arrows between the slots */}
      {[0, 1, 2].map((k) => {
        const a0 = ((slotAngle(k) + 25) * Math.PI) / 180;
        const a1 = ((slotAngle(k) + 95) * Math.PI) / 180;
        const rr = R + 150;
        const p0 = { x: C.x + Math.cos(a0) * rr, y: C.y + Math.sin(a0) * rr };
        const p1 = { x: C.x + Math.cos(a1) * rr, y: C.y + Math.sin(a1) * rr };
        const am = ((slotAngle(k) + 60) * Math.PI) / 180;
        const pm = { x: C.x + Math.cos(am) * (rr + 40), y: C.y + Math.sin(am) * (rr + 40) };
        const back = { x: p1.x - Math.cos(a1 - Math.PI / 2) * 30, y: p1.y - Math.sin(a1 - Math.PI / 2) * 30 };
        return (
          <DashedArrow
            key={k}
            id={`s7-arrow-${k}`}
            x={0}
            y={0}
            width={1080}
            height={1920}
            delay={at(23.2) + k * 5}
            d={`M${p0.x} ${p0.y} Q${pm.x} ${pm.y} ${p1.x} ${p1.y}`}
            head={`M${back.x + Math.cos(a1) * 22} ${back.y + Math.sin(a1) * 22} L${p1.x} ${p1.y} L${back.x - Math.cos(a1) * 22} ${back.y - Math.sin(a1) * 22}`}
          />
        );
      })}
      {types.map((t, i) => {
        const p = posOf(i);
        return (
          <Card key={i} x={p.x} y={p.y} w={210} h={200} seed={`type-${i}`} at={at(22.7) + i * 5} out={at(27.78)} color={t.color} rot={(i - 1) * 6}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Glyph kind={t.kind} size={96} />
              <span style={{ fontFamily: fonts.headline, fontWeight: 800, fontSize: 40, color: colors.ink, marginTop: -4 }}>{t.label}</span>
            </div>
          </Card>
        );
      })}
    </AbsoluteFill>
  );
};

/* s8 — A: scribbles switch between three patterns around the head (never over the face). */
const S8: React.FC = () => {
  const at = useAt(27.78);
  const paths = [
    { x: 150, y: 260, d: "M20 120 C60 20 160 20 200 100 C230 160 120 190 110 120 C100 60 220 40 260 90" },
    { x: 700, y: 240, d: "M20 40 L80 120 L140 40 L200 120 L260 40" },
    { x: 380, y: 140, d: "M20 80 C80 10 240 10 300 80" },
  ];
  return (
    <AbsoluteFill>
      {[0, 1, 2, 3, 4, 5].map((k) => {
        const p = paths[k % 3];
        return (
          <ChalkLine key={k} x={p.x} y={p.y} width={320} height={220} d={p.d} delay={at(27.9) + k * 12} duration={10} strokeWidth={8} opacity={k < 3 ? 0.5 : 0.95} />
        );
      })}
      <DashedArrow id="s8-a" x={60} y={380} width={300} height={300} delay={at(28.7)} d="M40 260 C10 160 60 60 200 40" head="M168 22 L204 40 L176 70" />
      <DashedArrow id="s8-b" x={740} y={380} width={300} height={300} delay={at(29.1)} d="M260 260 C290 160 240 60 100 40" head="M132 22 L96 40 L124 70" />
    </AbsoluteFill>
  );
};

/* s9 — C: an abstract head; the network of connections builds node by node with the words. */
const NODES = Array.from({ length: 22 }).map((_, i) => ({
  x: 330 + random(`nx-${i}`) * 420,
  y: 620 + random(`ny-${i}`) * 520,
}));
const EDGES = NODES.flatMap((a, i) =>
  NODES.map((b, j) => ({ i, j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
    .filter((e) => e.j < i)
    .sort((p, q) => p.d - q.d)
    .slice(0, 3),
);
const HEAD = "M300 1260 C290 1180 250 1150 250 1080 C250 1040 210 1020 230 980 C250 950 230 900 250 850 C270 700 380 560 560 560 C740 560 860 690 860 860 C860 980 800 1050 790 1120 C785 1170 800 1220 810 1260 Z";

const S9: React.FC = () => {
  const at = useAt(30.87);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headIn = useSpr(at(30.9), theme.spring.smooth);
  const span = [at(31.2), at(34.0)];
  const nodeAt = (i: number) => span[0] + ((span[1] - span[0]) * i) / NODES.length;
  return (
    <AbsoluteFill>
      <Backdrop fadeOut={at(34.0)} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: Math.min(1, headIn * 1.4), transform: `translateY(${interpolate(headIn, [0, 1], [60, 0])}px)` }}>
        <path d={HEAD} fill={colors.paper} stroke={colors.chalk} strokeWidth={14} style={{ filter: "drop-shadow(0 20px 20px rgba(0,0,0,0.3))" }} />
        <path d={HEAD} fill={colors.bgLift} opacity={0.9} transform="translate(540 910) scale(0.92) translate(-540 -910)" />
        {EDGES.map((e, k) => {
          const start = Math.max(nodeAt(e.i), nodeAt(e.j));
          const p = interpolate(frame, [start, start + 8], [0, 1], { ...CLAMP, easing: theme.ease.out });
          const a = NODES[e.j];
          const b = NODES[e.i];
          return p > 0 ? (
            <line key={k} x1={a.x} y1={a.y} x2={a.x + (b.x - a.x) * p} y2={a.y + (b.y - a.y) * p} stroke={colors.yellow} strokeWidth={3 + p} opacity={0.85} />
          ) : null;
        })}
        {NODES.map((n, i) => {
          const p = spring({ frame: frame - nodeAt(i), fps, config: theme.spring.bouncy });
          return (
            <circle key={i} cx={n.x} cy={n.y} r={11 * p} fill={colors.teal} style={{ filter: `drop-shadow(0 0 ${10 * p}px ${colors.tealGlow})` }} />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/* s10 — A: calm ending; a hand underline under "طويلة المدى" stays to the last frame. */
const S10: React.FC = () => {
  const at = useAt(34.0);
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, at(34.6)], [0.6, 0], CLAMP);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: fade }}>
        {EDGES.slice(0, 18).map((e, k) => (
          <line key={k} x1={NODES[e.i].x - 300} y1={NODES[e.i].y + 200} x2={NODES[e.j].x - 300} y2={NODES[e.j].y + 200} stroke={colors.yellow} strokeWidth={3} />
        ))}
      </svg>
      <ChalkLine x={260} y={1300} width={560} height={50} d="M540 20 C420 34 260 10 120 28 C80 32 40 26 20 34" delay={at(35.45)} duration={9} strokeWidth={10} />
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4a: S4a, s4b: S4b, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9, s10: S10 };

/** Backdrop + collage graphics for each scene, placed by timing.json. */
export const SceneGraphics: React.FC<{ layer: "under" | "over" }> = ({ layer }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {timing.scenes.map((s) => {
        const Comp = MAP[s.id];
        const isUnder = s.layout !== "A";
        if ((layer === "under") !== isUnder) return null;
        return (
          <Sequence key={s.id} name={s.id} from={Math.round(s.from * fps)} durationInFrames={Math.round((s.to - s.from) * fps) + 2} layout="none">
            <AbsoluteFill>
              <Comp />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </>
  );
};
```

### `my-remotion-video/src/clients/abdullah-almashhor/video31/Sfx.tsx`

```tsx
import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile, useVideoConfig } from "remotion";

type Cue = {
  at: number;
  src: "whoosh" | "paper" | "pop" | "click" | "chime";
  vol?: number;
};

// Voice sits at about -16.6 LUFS. Base gains keep every effect roughly 18–20 dB under it,
// so they read as texture, never over the words. Cues land ~2 frames before the visual hit.
// Overall SFX trim requested by the client: −8%.
const SFX_TRIM = 0.92;
const GAIN: Record<Cue["src"], number> = {
  whoosh: 0.16,
  paper: 0.24,
  pop: 0.18,
  click: 0.2,
  chime: 0.3,
};

const CUES: Cue[] = [
  { at: 0.12, src: "paper" }, // tally sheet + clock
  { at: 0.75, src: "click" }, // X over the sheet
  { at: 5.45, src: "whoosh" }, // → collage
  { at: 5.68, src: "paper" }, // deck fans out
  { at: 7.25, src: "pop", vol: 0.8 }, // eye
  { at: 8.17, src: "whoosh", vol: 0.8 }, // → paper frame
  { at: 8.4, src: "click" }, // stamp
  { at: 11.68, src: "whoosh" }, // back to Abdullah + push-in
  { at: 13.02, src: "whoosh" }, // → collage
  { at: 13.8, src: "paper", vol: 0.9 }, // mastery tears away
  { at: 14.95, src: "paper" }, // exam sheet
  { at: 16.65, src: "whoosh", vol: 0.8 },
  { at: 16.85, src: "paper", vol: 0.7 },
  { at: 17.25, src: "paper", vol: 0.6 },
  { at: 17.65, src: "paper", vol: 0.6 },
  { at: 18.78, src: "pop" }, // "المتداخل"
  { at: 20.45, src: "whoosh", vol: 0.8 },
  { at: 21.35, src: "click" }, // X
  { at: 22.5, src: "whoosh" }, // → clock collage
  { at: 22.68, src: "paper" },
  { at: 24.98, src: "click", vol: 0.7 }, // shuffle beat 1
  { at: 26.25, src: "paper", vol: 0.8 }, // shuffle beat 2
  { at: 26.95, src: "paper", vol: 0.7 }, // shuffle beat 3
  { at: 27.74, src: "whoosh", vol: 0.8 },
  { at: 30.83, src: "whoosh", vol: 0.8 }, // → network head
  { at: 32.8, src: "pop", vol: 0.8 }, // "روابط قوية"
  { at: 33.95, src: "whoosh", vol: 0.6 },
  { at: 35.18, src: "chime" }, // "طويلة المدى"
];

/** Soft sound design on top of the original voice (no music). */
export const Sfx: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <>
      {CUES.map((c, i) => {
        const from = Math.round(c.at * fps);
        const len = Math.min(Math.round(1.6 * fps), durationInFrames - from);
        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={len}
            layout="none"
            name={`sfx-${c.src}`}
          >
            <Audio
              src={staticFile(`sfx/${c.src}.wav`)}
              // short fade at the tail so nothing clicks when cut by the end of the reel
              volume={(f) =>
                GAIN[c.src] *
                SFX_TRIM *
                (c.vol ?? 1) *
                interpolate(f, [len - 6, len], [1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              }
            />
          </Sequence>
        );
      })}
    </>
  );
};
```

### `my-remotion-video/src/clients/abdullah-almashhor/video31/Video31.tsx`

```tsx
import { AbsoluteFill } from "remotion";
import { Grain } from "../../../shared/components/Overlays";
import { GoldInkDefs } from "../components/GoldInkDefs";
import { colors } from "./kit";
import { Footage } from "./Footage";
import { SceneGraphics } from "./Scenes";
import { Captions, Keywords } from "./Words";
import { Sfx } from "./Sfx";

/** Reel 31 — interleaved practice. Original audio only; footage never colour-graded. */
export const Video31: React.FC = () => (
  <AbsoluteFill style={{ direction: "rtl", backgroundColor: colors.bgDeep }}>
    <GoldInkDefs />
    <SceneGraphics layer="under" />
    <Footage />
    <SceneGraphics layer="over" />
    <Keywords />
    <Captions />
    <Grain />
    <Sfx />
  </AbsoluteFill>
);
```

### `my-remotion-video/src/clients/abdullah-almashhor/video31/Words.tsx`

```tsx
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP } from "../../../shared/components/motion";
import { colors, fonts, Keyword, theme } from "./kit";
import timing from "./timing.json";

type Kw = { from: number; to: number; words: string[]; y: number; size?: number; hl?: number[]; hlColor?: string };

// On-screen motion keywords (global seconds). Everything else that is spoken goes to the caption.
export const KEYWORDS: Kw[] = [
  { from: 0.03, to: 2.95, words: ["أسرع", "طريقة", "تفشل"], y: 1030, hl: [2] },
  { from: 3.0, to: 5.45, words: ["نفس", "النمط"], y: 1030, size: 120 },
  { from: 5.6, to: 7.25, words: ["شكل", "واحد"], y: 250, size: 116 },
  { from: 7.3, to: 8.2, words: ["يخدعك"], y: 250, size: 130, hl: [0], hlColor: colors.teal },
  { from: 8.3, to: 9.65, words: ["شعور", "مؤقت"], y: 1250 },
  { from: 9.7, to: 11.7, words: ["أتقنت؟"], y: 1250, size: 120 },
  { from: 11.75, to: 13.05, words: ["لكن", "الصدمة"], y: 1030, size: 116, hl: [1] },
  { from: 13.85, to: 16.65, words: ["يتبخر"], y: 250, size: 120 },
  { from: 16.8, to: 18.8, words: ["الحل", "المثبت"], y: 1030 },
  { from: 18.85, to: 20.45, words: ["التدريب", "المتداخل"], y: 1030, size: 112, hl: [1] },
  { from: 20.55, to: 22.5, words: ["لا", "تمرين", "واحد"], y: 1250 },
  { from: 22.6, to: 26.2, words: ["3", "أشكال"], y: 250, size: 116, hl: [0] },
  { from: 26.27, to: 27.75, words: ["ترتيب", "عشوائي"], y: 250, size: 116, hl: [1], hlColor: colors.teal },
  { from: 29.7, to: 30.85, words: ["بيتعب", "عقلك"], y: 1030 },
  { from: 30.9, to: 32.8, words: ["المجهود", "يبني"], y: 250 },
  { from: 32.85, to: 33.98, words: ["روابط", "قوية"], y: 250, size: 116, hl: [1] },
  { from: 34.83, to: 36.0, words: ["الذاكرة"], y: 990, size: 118 },
  { from: 35.23, to: 36.0, words: ["طويلة", "المدى"], y: 1135, size: 118 },
];

export const Keywords: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      {KEYWORDS.map((k, i) => (
        <Sequence key={i} from={Math.round(k.from * fps)} durationInFrames={Math.round((k.to - k.from) * fps) + 1} layout="none" name={`kw-${k.words.join(" ")}`}>
          <Keyword words={k.words} at={0} out={Math.round((k.to - k.from) * fps) + (k.to >= 36 ? 99 : 0)} y={k.y} size={k.size} hl={k.hl} hlColor={k.hlColor} />
        </Sequence>
      ))}
    </>
  );
};

// A cue is captioned unless it repeats a keyword that is on screen at the same time.
const shown = (c: { from: number; to: number; text: string }) =>
  !KEYWORDS.some(
    (k) => k.from < c.to && k.to > c.from && k.words.filter((w) => c.text.includes(w.replace("؟", ""))).length >= Math.min(2, k.words.length),
  );
const CUES = timing.cues.filter(shown);

/**
 * Caption for the spoken words that are not animated: IBM Plex Sans Arabic SemiBold, no box.
 * Readability comes from a soft bottom gradient + shadow; words appear as they are spoken.
 */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const c = CUES.find((q) => t >= q.from && t < q.to);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, transparent 62%, rgba(4,10,22,0.55) 78%, rgba(4,10,22,0.7) 100%)",

        }}
      />
      {c ? (
        <div
          style={{
            position: "absolute",
            top: 1410,
            left: 140,
            right: 140,
            display: "flex",
            direction: "rtl",
            flexWrap: "wrap",
            justifyContent: "center",
            columnGap: 14,
            fontFamily: fonts.caption,
            fontWeight: 600,
            fontSize: 52,
            lineHeight: 1.45,
            color: colors.chalk,
            textShadow: "0 2px 3px rgba(0,0,0,0.7), 0 6px 22px rgba(0,0,0,0.6)",
          }}
        >
          {c.text.split(" ").map((w, i, all) => {
            const start = Math.round(c.from * fps) + Math.round((((c.to - c.from) * fps) / all.length) * i * 0.8);
            const p = spring({ frame: frame - start, fps, config: theme.spring.snappy });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: interpolate(p, [0, 1], [0.0, 1], CLAMP),
                  transform: `translateY(${interpolate(p, [0, 1], [12, 0])}px)`,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
```

### `my-remotion-video/src/clients/abdullah-almashhor/video31/kit.tsx`

```tsx
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP } from "../../../shared/components/motion";
import { Paper } from "../../../shared/components/Paper";
import { theme } from "../theme";

export const { colors, fonts } = theme;
export { theme };

/** Global seconds → frame inside a Sequence that starts at `t0` seconds. */
export const useAt = (t0: number) => {
  const { fps } = useVideoConfig();
  return (sec: number) => Math.round((sec - t0) * fps);
};

/** Spring 0→1 from a local frame. */
export const useSpr = (from: number, config: (typeof theme.spring)[keyof typeof theme.spring] = theme.spring.snappy) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - from, fps, config });
};

/** Fast eased exit 0→1 over ~9 frames ending at `end`. */
export const useOut = (end: number, len = 9) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [end - len, end], [0, 1], { ...CLAMP, easing: theme.ease.in });
};

/** Torn paper card that drops in (scale + rotate + rise) and breathes. */
export const Card: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  seed: string;
  at: number;
  out?: number;
  color?: string;
  rot?: number;
  rim?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ x, y, w, h, seed, at, out, color = colors.paper, rot = 0, rim = 12, children, style }) => {
  const frame = useCurrentFrame();
  const p = useSpr(at, theme.spring.snappy);
  const o = useOut(out ?? 1e9);
  const breathe = Math.sin(frame / 26 + seed.length) * 1.2;
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        opacity: Math.min(1, p * 1.6) * (1 - o),
        transform: `translateY(${interpolate(p, [0, 1], [70, 0]) - o * 40}px) scale(${interpolate(p, [0, 1], [0.6, 1]) * (1 - o * 0.15)}) rotate(${rot + interpolate(p, [0, 1], [-14, 0]) + breathe}deg)`,
        ...style,
      }}
    >
      <Paper width={w} height={h} color={color} seed={seed} rim={rim}>
        {children}
      </Paper>
    </div>
  );
};

/**
 * Headline keywords: Noto Kufi Black, cream with a soft cast shadow; the accent word is filled
 * with a gold-leaf gradient and gets a hand-drawn gold underline. A blurred navy pool behind the
 * line keeps it readable over the white thobe without a hard box. Words animate as whole units.
 */
export const Keyword: React.FC<{
  words: string[];
  at: number;
  out: number;
  y: number;
  size?: number;
  hl?: number[];
  hlColor?: string;
}> = ({ words, at, out, y, size = 104, hl = [], hlColor = colors.yellow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = useOut(out);
  const pool = spring({ frame: frame - at, fps, config: theme.spring.smooth });
  const gold = hlColor === colors.yellow;
  const fill = gold
    ? "linear-gradient(180deg, #F3DA94 0%, #D9B25A 45%, #A9822F 100%)"
    : `linear-gradient(180deg, #A9EEFF 0%, ${colors.teal} 60%, #1C8FB0 100%)`;
  return (
    <div style={{ position: "absolute", top: y, left: 120, right: 120, opacity: 1 - o, transform: `translateY(${-24 * o}px)` }}>
      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          top: "18%",
          bottom: "10%",
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(4,10,22,0.78), rgba(4,10,22,0.45) 55%, transparent)",
          filter: "blur(28px)",
          transform: `scale(${interpolate(pool, [0, 1], [0.6, 1.25])})`,
          opacity: pool,
        }}
      />
      <div style={{ position: "relative", display: "flex", direction: "rtl", flexWrap: "wrap", justifyContent: "center", columnGap: size * 0.28 }}>
        {words.map((w, i) => {
          const p = spring({ frame: frame - at - i * 5, fps, config: theme.spring.snappy });
          const line = interpolate(frame, [at + i * 5 + 8, at + i * 5 + 20], [0, 1], { ...CLAMP, easing: theme.ease.out });
          const isHl = hl.includes(i);
          return (
            <span
              key={i}
              style={{
                position: "relative",
                display: "inline-block",
                fontFamily: fonts.headline,
                fontWeight: 900,
                fontSize: size,
                lineHeight: 1.5,
                letterSpacing: 0,
                opacity: Math.min(1, p * 1.6),
                transform: `translateY(${interpolate(p, [0, 1], [size * 0.45, 0])}px) scale(${interpolate(p, [0, 1], [0.86, 1])})`,
                filter: `blur(${interpolate(p, [0, 1], [10, 0], CLAMP)}px) drop-shadow(0 8px 18px rgba(0,0,0,0.55))`,
              }}
            >
              <span
                style={
                  isHl
                    ? { background: fill, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }
                    : { color: colors.chalk }
                }
              >
                {w}
              </span>
              {isHl ? (
                <svg
                  width="100%"
                  height={size * 0.3}
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                  style={{ position: "absolute", left: "4%", width: "92%", bottom: -size * 0.2, overflow: "visible" }}
                >
                  <path
                    d="M98 8 C70 14 40 4 2 12"
                    fill="none"
                    stroke={gold ? colors.yellow : colors.teal}
                    strokeWidth={5}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1 1"
                    strokeDashoffset={1 - line}
                  />
                </svg>
              ) : null}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/** Simple geometric glyphs for "different kinds of practice". */
export const Glyph: React.FC<{ kind: "tri" | "circle" | "grid" | "pen" | "wave" | "book" | "compass"; size: number; color?: string }> = ({
  kind,
  size,
  color = colors.ink,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <g fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
      {kind === "tri" && <path d="M50 14 L88 84 L12 84 Z" />}
      {kind === "circle" && (
        <>
          <circle cx={50} cy={50} r={34} />
          <circle cx={50} cy={50} r={12} fill={color} />
        </>
      )}
      {kind === "grid" && <path d="M18 18 H82 V82 H18 Z M18 50 H82 M50 18 V82" />}
      {kind === "pen" && <path d="M22 80 L30 60 L70 20 L80 30 L40 70 Z M30 60 L40 70" />}
      {kind === "book" && (
        <path d="M50 26 C38 18 22 18 12 22 V80 C22 76 38 76 50 84 C62 76 78 76 88 80 V22 C78 18 62 18 50 26 Z M50 26 V84" />
      )}
      {kind === "compass" && (
        <>
          <circle cx={50} cy={18} r={7} />
          <path d="M46 24 L24 86 M54 24 L76 86 M33 60 C42 66 58 66 67 60" />
        </>
      )}
      {kind === "wave" && <path d="M10 60 C25 30 40 30 50 50 C60 70 75 70 90 40" />}
    </g>
  </svg>
);
```

### `my-remotion-video/src/clients/abdullah-almashhor/video31/timing.json`

```json
{
 "source": "31.mp4",
 "duration": 35.968,
 "fps": 30,
 "scenes": [
  {
   "id": "s1",
   "from": 0.0,
   "to": 5.5,
   "layout": "A",
   "idea": "تكرار نفس النمط"
  },
  {
   "id": "s2",
   "from": 5.5,
   "to": 8.22,
   "layout": "C",
   "idea": "شكل واحد يخدعك"
  },
  {
   "id": "s3",
   "from": 8.22,
   "to": 11.73,
   "layout": "B",
   "idea": "شعور مؤقت"
  },
  {
   "id": "s4a",
   "from": 11.73,
   "to": 13.07,
   "layout": "A",
   "idea": "لكن الصدمة"
  },
  {
   "id": "s4b",
   "from": 13.07,
   "to": 16.7,
   "layout": "C",
   "idea": "الإتقان يتبخر"
  },
  {
   "id": "s5",
   "from": 16.7,
   "to": 20.5,
   "layout": "A",
   "idea": "التدريب المتداخل"
  },
  {
   "id": "s6",
   "from": 20.5,
   "to": 22.55,
   "layout": "B",
   "idea": "لا تمرين واحد"
  },
  {
   "id": "s7",
   "from": 22.55,
   "to": 27.78,
   "layout": "C",
   "idea": "3 أشكال بترتيب عشوائي"
  },
  {
   "id": "s8",
   "from": 27.78,
   "to": 30.87,
   "layout": "A",
   "idea": "بيتعب عقلك"
  },
  {
   "id": "s9",
   "from": 30.87,
   "to": 34.0,
   "layout": "C",
   "idea": "روابط قوية"
  },
  {
   "id": "s10",
   "from": 34.0,
   "to": 35.968,
   "layout": "A",
   "idea": "الذاكرة طويلة المدى"
  }
 ],
 "cues": [
  {
   "from": 0.033,
   "to": 1.166,
   "text": "أسرع طريقة تفشل"
  },
  {
   "from": 1.166,
   "to": 2.033,
   "text": "فيها بتثبيت أي"
  },
  {
   "from": 2.033,
   "to": 3.566,
   "text": "مهارة هي أن تكرر"
  },
  {
   "from": 3.566,
   "to": 4.933,
   "text": "نفس النمط لساعات"
  },
  {
   "from": 4.933,
   "to": 5.5,
   "text": "متواصلة"
  },
  {
   "from": 5.5,
   "to": 6.566,
   "text": "التدريب على شكل"
  },
  {
   "from": 6.566,
   "to": 7.333,
   "text": "واحد أو صورة"
  },
  {
   "from": 7.333,
   "to": 8.199,
   "text": "واحدة يخدعك"
  },
  {
   "from": 8.233,
   "to": 9.666,
   "text": "يعطيك شعور مؤقت"
  },
  {
   "from": 9.666,
   "to": 10.933,
   "text": "أنك أتقنت الفكرة"
  },
  {
   "from": 10.933,
   "to": 11.733,
   "text": "في نفس اللحظة"
  },
  {
   "from": 11.733,
   "to": 13.066,
   "text": "لكن الصدمة أن"
  },
  {
   "from": 13.066,
   "to": 13.833,
   "text": "هذا الإتقان"
  },
  {
   "from": 13.833,
   "to": 15.033,
   "text": "يتبخر عند أول"
  },
  {
   "from": 15.033,
   "to": 15.966,
   "text": "اختبار حقيقي على"
  },
  {
   "from": 15.966,
   "to": 16.566,
   "text": "أرض الواقع"
  },
  {
   "from": 16.766,
   "to": 17.599,
   "text": "الحل المثبت في"
  },
  {
   "from": 17.599,
   "to": 18.833,
   "text": "أبحاث التعلم هو"
  },
  {
   "from": 18.833,
   "to": 19.933,
   "text": "ما يسمى بالتدريب"
  },
  {
   "from": 19.933,
   "to": 20.5,
   "text": "المتداخل"
  },
  {
   "from": 20.5,
   "to": 21.333,
   "text": "لا تركز على"
  },
  {
   "from": 21.333,
   "to": 22.0,
   "text": "تمرين واحد"
  },
  {
   "from": 22.0,
   "to": 22.533,
   "text": "في الجلسة"
  },
  {
   "from": 22.566,
   "to": 23.966,
   "text": "اخلط ثلاثة أشكال"
  },
  {
   "from": 23.966,
   "to": 25.0,
   "text": "أو أدوات مختلفة"
  },
  {
   "from": 25.0,
   "to": 26.266,
   "text": "داخل نفس الساعة"
  },
  {
   "from": 26.266,
   "to": 27.666,
   "text": "وبترتيب عشوائي"
  },
  {
   "from": 27.833,
   "to": 28.733,
   "text": "صحيح أن التنقل"
  },
  {
   "from": 28.733,
   "to": 29.733,
   "text": "بين أنماط مختلفة"
  },
  {
   "from": 29.733,
   "to": 30.366,
   "text": "بيتعب عقلك في"
  },
  {
   "from": 30.366,
   "to": 30.866,
   "text": "البداية"
  },
  {
   "from": 30.866,
   "to": 32.033,
   "text": "لكن هذا المجهود"
  },
  {
   "from": 32.033,
   "to": 32.833,
   "text": "بالذات يبني"
  },
  {
   "from": 32.833,
   "to": 34.033,
   "text": "روابط قوية ويحفر"
  },
  {
   "from": 34.033,
   "to": 34.833,
   "text": "هذه المهارة في"
  },
  {
   "from": 34.833,
   "to": 35.233,
   "text": "الذاكرة"
  },
  {
   "from": 35.233,
   "to": 35.933,
   "text": "طويلة المدى"
  }
 ]
}
```

### `my-remotion-video/src/fonts.ts`

```ts
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts so renders never depend on the network.
// Each subset gets its own family name; theme.fonts stacks them.
const face = (family: string, file: string, weight: string) =>
  loadFont({ family, url: staticFile(`fonts/${file}`), weight, display: "block" });

export const fontsReady = Promise.all([
  face("Cairo", "cairo-arabic.woff2", "400 900"),
  face("CairoLatin", "cairo-latin.woff2", "400 900"),
  face("ReemKufi", "reemkufi-arabic.woff2", "600 700"),
  face("ReemKufiLatin", "reemkufi-latin.woff2", "600 700"),
  // Editorial pair for talking-head reels: Noto Kufi (headlines) + IBM Plex Sans Arabic (captions). OFL.
  face("NotoKufi", "noto-kufi-arabic-arabic-800-normal.woff2", "800"),
  face("NotoKufi", "noto-kufi-arabic-arabic-900-normal.woff2", "900"),
  face("NotoKufiLatin", "noto-kufi-arabic-latin-800-normal.woff2", "800 900"),
  face("PlexArabic", "ibm-plex-sans-arabic-arabic-500-normal.woff2", "500"),
  face("PlexArabic", "ibm-plex-sans-arabic-arabic-600-normal.woff2", "600"),
  face("PlexArabicLatin", "ibm-plex-sans-arabic-latin-600-normal.woff2", "500 600"),
]);
```

### `my-remotion-video/src/index.css`

```css
@import "tailwindcss";
```

### `my-remotion-video/src/index.ts`

```ts
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
```

### `my-remotion-video/src/shared/components/Background.tsx`

```tsx
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { baseTheme as theme } from "../theme";
import { chalkDust } from "./textures";

/** Navy chalkboard: gradient base, drifting light pools, chalk dust and smudges. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 60) * 60;
  const d2 = Math.cos(frame / 75) * 50;
  const { colors } = theme;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 75% at 50% 42%, ${colors.bgLift} 0%, ${colors.bg} 52%, ${colors.bgDeep} 100%)`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          top: -420,
          left: -380 + d1,
          filter: "blur(60px)",
          background: `radial-gradient(circle, ${colors.teal}2a, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          bottom: -380,
          right: -420 - d2,
          filter: "blur(70px)",
          background: `radial-gradient(circle, ${colors.yellow}14, transparent 64%)`,
        }}
      />
      {/* Erased-chalk smudges */}
      {[
        { x: 120, y: 300, w: 620, h: 180, r: -14 },
        { x: 480, y: 1380, w: 700, h: 200, r: 9 },
        { x: -120, y: 1050, w: 520, h: 160, r: 4 },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.x,
            top: s.y + Math.sin(frame / 90 + i) * 8,
            width: s.w,
            height: s.h,
            borderRadius: "50%",
            background: "rgba(242,240,234,0.035)",
            filter: "blur(40px)",
            transform: `rotate(${s.r}deg)`,
          }}
        />
      ))}
      <AbsoluteFill
        style={{
          backgroundImage: chalkDust,
          backgroundSize: "300px",
          mixBlendMode: "screen",
          opacity: 0.09,
        }}
      />
    </AbsoluteFill>
  );
};
```

### `my-remotion-video/src/shared/components/Chalk.tsx`

```tsx
import { useCurrentFrame } from "remotion";
import { baseTheme as theme } from "../theme";
import { useProgress, useSpringAt } from "./motion";

/** Global SVG defs: a dusty, slightly wobbly chalk stroke filter. Mount once. */
export const ChalkDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter
        id="chalk"
        filterUnits="userSpaceOnUse"
        x={-2000}
        y={-2000}
        width={6000}
        height={6000}
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="1.1"
          numOctaves={2}
          seed={3}
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={4}
          xChannelSelector="R"
          yChannelSelector="G"
          result="wobble"
        />
        <feColorMatrix
          in="noise"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.75"
          result="holes"
        />
        <feComposite in="wobble" in2="holes" operator="in" />
      </filter>
    </defs>
  </svg>
);

type SvgBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  viewBox?: string;
  style?: React.CSSProperties;
};

const Svg: React.FC<SvgBox & { children: React.ReactNode }> = ({
  x,
  y,
  width,
  height,
  viewBox,
  style,
  children,
}) => (
  <svg
    width={width}
    height={height}
    viewBox={viewBox ?? `0 0 ${width} ${height}`}
    style={{ position: "absolute", left: x, top: y, overflow: "visible", ...style }}
  >
    {children}
  </svg>
);

/** A chalk stroke that draws itself on. */
export const ChalkLine: React.FC<
  SvgBox & {
    d: string;
    delay: number;
    duration?: number;
    color?: string;
    strokeWidth?: number;
    opacity?: number;
    easing?: (t: number) => number;
  }
> = ({
  d,
  delay,
  duration = 14,
  easing = theme.ease.out,
  color = theme.colors.chalk,
  strokeWidth = 7,
  opacity = 0.9,
  ...box
}) => {
  const p = useProgress(delay, duration, easing);
  return (
    <Svg {...box}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
        opacity={p > 0 ? opacity : 0}
        filter="url(#chalk)"
      />
    </Svg>
  );
};

/** Dashed chalk path (like the reference's motion arrows) revealed along its length. */
export const DashedArrow: React.FC<
  SvgBox & {
    id: string;
    d: string;
    head: string; // arrowhead path at the end of d
    delay: number;
    duration?: number;
    color?: string;
  }
> = ({ id, d, head, delay, duration = 18, color = theme.colors.chalk, ...box }) => {
  const frame = useCurrentFrame();
  const p = useProgress(delay, duration);
  const headP = useSpringAt(delay + duration - 4, theme.spring.snappy);
  return (
    <Svg {...box}>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={-500} y={-500} width={3000} height={3000}>
          <path
            d={d}
            fill="none"
            stroke="#fff"
            strokeWidth={20}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - p}
          />
        </mask>
      </defs>
      <g filter="url(#chalk)" opacity={0.85}>
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray="18 16"
          strokeDashoffset={-frame * 0.6}
          mask={`url(#${id})`}
        />
        <path
          d={head}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={headP}
        />
      </g>
    </Svg>
  );
};

/** Three short emphasis strokes radiating from a point. */
export const Sparks: React.FC<{
  x: number;
  y: number;
  delay: number;
  angle?: number; // direction the burst faces, degrees
  color?: string;
  size?: number;
  count?: number;
}> = ({ x, y, delay, angle = -90, color = theme.colors.chalk, size = 60, count = 3 }) => {
  const frame = useCurrentFrame();
  const spread = 70;
  return (
    <Svg x={x - size * 1.5} y={y - size * 1.5} width={size * 3} height={size * 3}>
      <g filter="url(#chalk)">
        {Array.from({ length: count }).map((_, i) => {
          const local = Math.max(0, frame - delay - i * 3);
          const p = Math.min(1, local / 8);
          const eased = theme.ease.out(p);
          const a = ((angle + (i - (count - 1) / 2) * (spread / Math.max(1, count - 1))) * Math.PI) / 180;
          const c = size * 1.5;
          const r0 = size * 0.35;
          const r1 = r0 + size * 0.75 * eased;
          return (
            <line
              key={i}
              x1={c + Math.cos(a) * r0}
              y1={c + Math.sin(a) * r0}
              x2={c + Math.cos(a) * r1}
              y2={c + Math.sin(a) * r1}
              stroke={color}
              strokeWidth={6}
              strokeLinecap="round"
              opacity={p > 0 ? 0.9 : 0}
            />
          );
        })}
      </g>
    </Svg>
  );
};

/** Small outlined circle doodle that pops in and floats. */
export const Ring: React.FC<{
  x: number;
  y: number;
  r?: number;
  delay: number;
  color?: string;
  phase?: number;
}> = ({ x, y, r = 16, delay, color = theme.colors.teal, phase = 0 }) => {
  const frame = useCurrentFrame();
  const p = useSpringAt(delay, theme.spring.bouncy);
  const float = Math.sin(frame / 28 + phase) * 6;
  return (
    <Svg x={x - r * 2} y={y - r * 2 + float} width={r * 4} height={r * 4}>
      <circle
        cx={r * 2}
        cy={r * 2}
        r={r * p}
        fill="none"
        stroke={color}
        strokeWidth={5}
        opacity={Math.min(1, p)}
      />
    </Svg>
  );
};
```

### `my-remotion-video/src/shared/components/Icons.tsx`

```tsx
import { baseTheme as theme } from "../theme";

const { colors } = theme;
// Sticker look from the reference: dark ink fill with a thick paper-white outline.
const sticker = {
  stroke: colors.paper,
  strokeWidth: 10,
  paintOrder: "stroke" as const,
  strokeLinejoin: "round" as const,
};

export const Bulb: React.FC<{ size: number; glow?: number }> = ({ size, glow = 0 }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 200 260" style={{ overflow: "visible" }}>
    <circle cx={100} cy={92} r={86} fill={colors.yellow} opacity={0.18 * glow} />
    <path
      d="M100 20 C55 20 28 52 28 92 C28 122 46 140 60 156 C68 166 72 176 72 188 L128 188 C128 176 132 166 140 156 C154 140 172 122 172 92 C172 52 145 20 100 20 Z"
      fill={colors.yellow}
      stroke={colors.ink}
      strokeWidth={9}
      strokeLinejoin="round"
    />
    <path d="M82 188 L82 140 Q100 118 118 140 L118 188" fill="none" stroke={colors.ink} strokeWidth={7} strokeLinecap="round" />
    <path d="M58 70 Q66 48 90 40" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.7} />
    <rect x={70} y={192} width={60} height={16} rx={5} fill={colors.paperShade} stroke={colors.ink} strokeWidth={7} />
    <rect x={72} y={212} width={56} height={16} rx={5} fill={colors.paperShade} stroke={colors.ink} strokeWidth={7} />
    <path d="M84 234 L116 234 L108 248 L92 248 Z" fill={colors.ink} />
  </svg>
);

/** Pencil with its tip on the left (at 6% of length, 50% of height). */
export const Pencil: React.FC<{ length: number }> = ({ length }) => (
  <svg width={length} height={length * 0.2} viewBox="0 0 500 100" style={{ overflow: "visible" }}>
    <g transform="translate(500 0) scale(-1 1)">
    <g {...sticker}>
      <path d="M40 30 L400 30 L470 50 L400 70 L40 70 Z" fill={colors.ink} />
    </g>
    <path d="M400 30 L470 50 L400 70 Z" fill={colors.paperShade} />
    <path d="M448 44 L470 50 L448 56 Z" fill={colors.ink} />
    <rect x={10} y={30} width={42} height={40} rx={6} fill={colors.yellow} />
    <rect x={52} y={30} width={16} height={40} fill={colors.greyLight} />
    <path d="M80 42 L390 42" stroke="#fff" strokeWidth={4} opacity={0.25} strokeLinecap="round" />
    </g>
  </svg>
);

const gearPath = (teeth: number, rOut: number, rIn: number) => {
  const pts: string[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const corners = [
      [rIn, a - step * 0.5],
      [rIn, a - step * 0.28],
      [rOut, a - step * 0.18],
      [rOut, a + step * 0.18],
      [rIn, a + step * 0.28],
    ];
    corners.forEach(([r, ang]) =>
      pts.push(`${(100 + Math.cos(ang) * r).toFixed(1)} ${(100 + Math.sin(ang) * r).toFixed(1)}`),
    );
  }
  return `M${pts.join(" L")} Z`;
};
const GEAR = gearPath(10, 92, 74);

export const Gear: React.FC<{ size: number; rotate: number }> = ({ size, rotate }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible", transform: `rotate(${rotate}deg)` }}>
    <path d={GEAR} fill={colors.ink} {...sticker} />
    <circle cx={100} cy={100} r={44} fill="none" stroke={colors.grey} strokeWidth={6} />
    <circle cx={100} cy={100} r={20} fill={colors.paper} />
  </svg>
);

export const Cursor: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 120 150" style={{ overflow: "visible" }}>
    <path
      d="M10 8 L10 118 L38 92 L58 138 L80 128 L60 84 L98 82 Z"
      fill={colors.ink}
      {...sticker}
      strokeWidth={9}
    />
  </svg>
);

/** Spaced repetition: circular arrows with growing gaps between review dots. */
export const RepeatIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M78 40 A30 30 0 0 0 24 34" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />
    <path d="M22 60 A30 30 0 0 0 76 66" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />
    <path d="M14 22 L24 36 L38 28" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M86 78 L76 64 L62 72" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={34} cy={50} r={4.5} fill={color} />
    <circle cx={46} cy={50} r={4.5} fill={color} />
    <circle cx={66} cy={50} r={4.5} fill={color} />
  </svg>
);

/** Deep focus: target with an arrow in the bullseye. */
export const TargetIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={46} cy={54} r={36} fill="none" stroke={color} strokeWidth={8} />
    <circle cx={46} cy={54} r={20} fill="none" stroke={color} strokeWidth={8} />
    <circle cx={46} cy={54} r={6} fill={color} />
    <path d="M46 54 L86 14" stroke={color} strokeWidth={8} strokeLinecap="round" />
    <path d="M72 12 L88 12 L88 28" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Right questions: speech bubble with an Arabic question mark. */
export const QuestionIcon: React.FC<{ size: number; color: string; fontFamily: string }> = ({
  size,
  color,
  fontFamily,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path
      d="M16 18 H84 Q92 18 92 26 V64 Q92 72 84 72 H44 L26 88 L28 72 H16 Q8 72 8 64 V26 Q8 18 16 18 Z"
      fill="none"
      stroke={color}
      strokeWidth={8}
      strokeLinejoin="round"
    />
    <text x={50} y={62} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={50} fill={color}>
      ؟
    </text>
  </svg>
);

/** Rising bar chart on grid paper, as in the reference collage. */
export const ChartArt: React.FC<{ width: number; height: number; bars: number[]; arrow: number }> = ({
  width,
  height,
  bars,
  arrow,
}) => {
  const base = height - 40;
  const bw = 58;
  const gap = 34;
  const left = 60;
  const heights = [0.32, 0.5, 0.66, 0.9];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`v${i}`} x1={30 + i * 56} y1={20} x2={30 + i * 56} y2={height - 20} stroke={colors.grey} strokeWidth={1.5} opacity={0.35} />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={`h${i}`} x1={20} y1={30 + i * 50} x2={width - 20} y2={30 + i * 50} stroke={colors.grey} strokeWidth={1.5} opacity={0.35} />
      ))}
      {heights.map((h, i) => {
        const bh = h * (base - 40) * bars[i];
        return (
          <rect
            key={i}
            x={left + i * (bw + gap)}
            y={base - bh}
            width={bw}
            height={bh}
            fill={i === heights.length - 1 ? colors.teal : colors.ink}
          />
        );
      })}
      <path
        d={`M${left - 10} ${base - 70} L${left + 120} ${base - 130} L${left + 200} ${base - 110} L${left + 330} ${base - 230}`}
        fill="none"
        stroke={colors.ink}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - arrow}
      />
      <path
        d={`M${left + 290} ${base - 236} L${left + 334} ${base - 234} L${left + 326} ${base - 192}`}
        fill="none"
        stroke={colors.ink}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={arrow > 0.95 ? 1 : 0}
      />
      <line x1={30} y1={base} x2={width - 30} y2={base} stroke={colors.ink} strokeWidth={5} />
    </svg>
  );
};
```

### `my-remotion-video/src/shared/components/Overlays.tsx`

```tsx
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { baseTheme as theme } from "../theme";
import { filmGrain } from "./textures";

/** Unifies every layer into one navy look. Sits above content, below grain. */
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        mixBlendMode: "soft-light",
        opacity: 0.22,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.18), transparent 22%, transparent 78%, rgba(0,0,0,0.28))",
      }}
    />
  </AbsoluteFill>
);

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: filmGrain,
        backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.07,
        mixBlendMode: "overlay",
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(ellipse 75% 60% at 50% 48%, transparent 52%, rgba(2,5,12,0.55) 100%)",
    }}
  />
);
```

### `my-remotion-video/src/shared/components/Paper.tsx`

```tsx
import { random } from "remotion";
import { baseTheme as theme } from "../theme";
import { paperBlotch, paperNoise } from "./textures";

/** Deterministic torn-edge clip-path for a w×h rectangle. */
export const tornPolygon = (
  seed: string,
  w: number,
  h: number,
  amp = 7,
  step = 16,
) => {
  const pts: [number, number][] = [];
  let i = 0;
  const j = () => random(`${seed}-${i++}`) * amp;
  for (let x = 0; x <= w; x += step) pts.push([x, j()]);
  for (let y = step; y <= h; y += step) pts.push([w - j(), y]);
  for (let x = w - step; x >= 0; x -= step) pts.push([x, h - j()]);
  for (let y = h - step; y > 0; y -= step) pts.push([j(), y]);
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(", ")})`;
};

type PaperProps = {
  width: number;
  height: number;
  color: string;
  seed: string;
  rim?: number; // white torn border, like a cut-out sticker
  radius?: number;
  shadow?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** Torn paper cut-out with fibre texture, aged blotches and a soft cast shadow. */
export const Paper: React.FC<PaperProps> = ({
  width,
  height,
  color,
  seed,
  rim = 8,
  shadow = true,
  style,
  children,
}) => {
  const inner = { w: width - rim * 2, h: height - rim * 2 };
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        filter: shadow
          ? "drop-shadow(0 22px 26px rgba(0,0,0,0.5)) drop-shadow(0 4px 5px rgba(0,0,0,0.35))"
          : undefined,
        ...style,
      }}
    >
      {rim > 0 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: theme.colors.paper,
            clipPath: tornPolygon(`${seed}-rim`, width, height, 9, 14),
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: rim,
          top: rim,
          width: inner.w,
          height: inner.h,
          background: color,
          clipPath: tornPolygon(seed, inner.w, inner.h, rim > 0 ? 5 : 8),
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: paperNoise,
            backgroundSize: "260px",
            mixBlendMode: "multiply",
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: paperBlotch,
            backgroundSize: "600px",
            mixBlendMode: "multiply",
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.12), transparent 40%, rgba(0,0,0,0.12))",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Translucent strip of masking tape. */
export const Tape: React.FC<{
  width?: number;
  height?: number;
  color?: string;
  seed: string;
  style?: React.CSSProperties;
}> = ({ width = 170, height = 52, color = theme.colors.teal, seed, style }) => (
  <div
    style={{
      position: "absolute",
      width,
      height,
      background: color,
      opacity: 0.88,
      clipPath: tornPolygon(seed, width, height, 6, 9),
      boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: paperNoise,
        backgroundSize: "260px",
        mixBlendMode: "multiply",
        opacity: 0.5,
      }}
    />
  </div>
);
```

### `my-remotion-video/src/shared/components/WordReveal.tsx`

```tsx
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { baseTheme as theme } from "../theme";

export type Word = { text: string; style?: React.CSSProperties; key?: string };

/**
 * Right-to-left, word-by-word reveal: each word rises, scales and un-blurs.
 * Words are split on spaces only, so Arabic letter shaping is preserved.
 */
export const WordReveal: React.FC<{
  words: Word[];
  delay: number;
  per?: number;
  gap?: number;
  style?: React.CSSProperties;
  renderWord?: (word: Word, progress: number, index: number) => React.ReactNode;
}> = ({ words, delay, per = 4, gap = 26, style, renderWord }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: "flex",
        direction: "rtl",
        flexWrap: "wrap",
        justifyContent: "center",
        gap,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const p = spring({ frame: frame - delay - i * per, fps, config: theme.spring.smooth });
        return (
          <span
            key={w.key ?? i}
            style={{
              display: "inline-block",
              position: "relative",
              opacity: Math.min(1, p * 1.4),
              transform: `translateY(${interpolate(p, [0, 1], [56, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
              filter: `blur(${interpolate(p, [0, 1], [8, 0])}px)`,
              ...w.style,
            }}
          >
            {renderWord ? renderWord(w, p, i) : w.text}
          </span>
        );
      })}
    </div>
  );
};
```

### `my-remotion-video/src/shared/components/motion.ts`

```ts
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { baseTheme as theme } from "../theme";

type SpringConfig = (typeof theme.spring)[keyof typeof theme.spring];

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** Seconds → frames for the current composition. */
export const useSeconds = () => {
  const { fps } = useVideoConfig();
  return (seconds: number) => Math.round(seconds * fps);
};

/** Spring progress 0→1 starting `delay` frames into the current Sequence. */
export const useSpringAt = (
  delay: number,
  config: SpringConfig = theme.spring.smooth,
) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

/** Eased 0→1 progress across a frame window. Never linear. */
export const useProgress = (
  start: number,
  length: number,
  easing = theme.ease.out,
) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + length], [0, 1], {
    ...CLAMP,
    easing,
  });
};

/** 0→1 over the last `theme.timing.exit` seconds of the current Sequence. */
export const useExit = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const len = Math.round(theme.timing.exit * fps);
  return interpolate(
    frame,
    [durationInFrames - len, durationInFrames],
    [0, 1],
    { ...CLAMP, easing: theme.ease.in },
  );
};

/** Sin-wave idle motion so anything on screen for >2s keeps breathing. */
export const useBreath = (period = 30, amount = 1, phase = 0) => {
  const frame = useCurrentFrame();
  return Math.sin(frame / period + phase) * amount;
};
```

### `my-remotion-video/src/shared/components/textures.ts`

```ts
// Procedural textures as data URIs — no image assets needed.
const svg = (inner: string, size: number) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${inner}</svg>`,
  )}")`;

/** Fibrous paper grain, meant for mix-blend-mode: multiply. */
export const paperNoise = svg(
  `<filter id='p'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' seed='4'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='table' tableValues='0 0.55'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(#p)'/>`,
  260,
);

/** Large soft blotches for aged paper. */
export const paperBlotch = svg(
  `<filter id='b'><feTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='2' seed='9'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='table' tableValues='0 0.35'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(#b)'/>`,
  600,
);

/** Chalk dust on the board, meant for mix-blend-mode: screen. */
export const chalkDust = svg(
  `<filter id='c'><feTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='2' seed='2'/><feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.2 -1.25'/></filter><rect width='100%' height='100%' filter='url(#c)'/>`,
  300,
);

/** Film grain for the top overlay. */
export const filmGrain = svg(
  `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='0.5'/>`,
  220,
);
```

### `my-remotion-video/src/shared/theme.ts`

```ts
// Single source of truth for colors, type, easings and spring presets.
// Palette from clients/abdullah-almashhor/references/style-*.webp:
// deep navy torn paper, cream paper, gold leaf seams, cyan glow accents.
import { Easing } from "remotion";

export const baseTheme = {
  colors: {
    bg: "#0A1526", // deep navy
    bgDeep: "#04080F",
    bgLift: "#1B2F55", // royal navy panels
    teal: "#3FB8D4", // cyan glow — hero color, one element per frame
    tealDeep: "#1F6F8B",
    yellow: "#C9A24B", // gold leaf accent
    paper: "#E8DCC4", // cream torn paper
    paperShade: "#C9BBA0",
    grey: "#4E5560",
    greyLight: "#8A9099",
    ink: "#0E1622",
    chalk: "#F3EEE3",
    chalkDim: "rgba(243, 238, 227, 0.72)",
    tealGlow: "rgba(63, 184, 212, 0.55)",
  },
  fonts: {
    // Arabic and Latin subsets are separate files; the browser falls back per glyph.
    display: "Cairo, CairoLatin, sans-serif",
    label: "ReemKufi, ReemKufiLatin, Cairo, sans-serif",
    headline: "NotoKufi, NotoKufiLatin, Cairo, sans-serif",
    caption: "PlexArabic, PlexArabicLatin, Cairo, sans-serif",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    gentle: { damping: 24, stiffness: 70, mass: 1 },
  },
  // Scene boundaries in seconds — converted with fps everywhere.
  timing: {
    scene1: { from: 0, duration: 5 },
    scene2: { from: 5, duration: 7 },
    scene3: { from: 12, duration: 6 },
    scene4: { from: 18, duration: 2 },
    exit: 0.34, // exits are faster than entrances
  },
} as const;

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInSeconds: 20,
} as const;
```

### `my-remotion-video/tsconfig.json` (خارج src، للمرجع)

```
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "Preserve",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "lib": ["es2015"],
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "resolveJsonModule": true
  },
  "exclude": ["remotion.config.ts"]
}
```

### `my-remotion-video/remotion.config.ts` (خارج src، للمرجع)

```
/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideBundlerConfig(enableTailwind);
```

### `my-remotion-video/scripts/fetch-footage.sh` (خارج src، للمرجع)

```
#!/bin/bash
# Downloads client source footage from GitHub Releases into public/ (kept out of git).
set -e
cd "$(dirname "$0")/.."
mkdir -p public/clients/abdullah-almashhor
curl -L -o public/clients/abdullah-almashhor/31.mp4 \
  https://github.com/learninghakim/bin-yahya/releases/download/abdullah-almashhor/31.mp4
```

### `my-remotion-video/scripts/make-sfx.mjs` (خارج src، للمرجع)

```
// Synthesizes a small, deterministic SFX kit into public/sfx as 16-bit mono WAVs.
// Run: node scripts/make-sfx.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const SR = 44100;
const OUT = new URL("../public/sfx/", import.meta.url);
mkdirSync(OUT, { recursive: true });

// Deterministic PRNG so the kit is identical on every run.
let seed = 1337;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const noise = () => rnd() * 2 - 1;

const writeWav = (name, samples) => {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => {
    const v = Math.max(-1, Math.min(1, s));
    data.writeInt16LE(Math.round(v * 32767), i * 2);
  });
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write("WAVE", 8);
  h.write("fmt ", 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(data.length, 40);
  writeFileSync(new URL(name, OUT), Buffer.concat([h, data]));
};

const render = (seconds, fn) =>
  Array.from({ length: Math.round(seconds * SR) }, (_, i) => fn(i / SR, i));

// Whoosh: noise through a swept one-pole low-pass, swelling then fading.
{
  const dur = 0.5;
  let lp = 0;
  writeWav(
    "whoosh.wav",
    render(dur, (t) => {
      const x = t / dur;
      const cutoff = 300 + 5200 * Math.sin(Math.PI * x);
      const a = 1 - Math.exp((-2 * Math.PI * cutoff) / SR);
      lp += a * (noise() - lp);
      const env = Math.pow(Math.sin(Math.PI * Math.pow(x, 0.7)), 2);
      return lp * env * 0.9;
    }),
  );
}

// Pop: fast pitch-drop sine, for small UI elements landing.
{
  let ph = 0;
  writeWav(
    "pop.wav",
    render(0.14, (t) => {
      const f = 260 + 760 * Math.exp(-t * 45);
      ph += (2 * Math.PI * f) / SR;
      return Math.sin(ph) * Math.exp(-t * 32) * 0.7;
    }),
  );
}

// Paper slap: short high-passed noise burst with a soft body.
{
  let prev = 0;
  let ph = 0;
  writeWav(
    "paper.wav",
    render(0.18, (t) => {
      const n = noise();
      const hp = n - prev * 0.6;
      prev = n;
      ph += (2 * Math.PI * 140) / SR;
      const body = Math.sin(ph) * Math.exp(-t * 40) * 0.35;
      return hp * Math.exp(-t * 38) * 0.45 + body;
    }),
  );
}

// Click: crisp mouse click (two transients).
{
  writeWav(
    "click.wav",
    render(0.12, (t) => {
      const c1 = t < 0.006 ? noise() * (1 - t / 0.006) : 0;
      const t2 = t - 0.045;
      const c2 = t2 > 0 && t2 < 0.005 ? noise() * 0.6 * (1 - t2 / 0.005) : 0;
      const tone = Math.sin(2 * Math.PI * 2100 * t) * Math.exp(-t * 90) * 0.25;
      return (c1 + c2) * 0.8 + tone;
    }),
  );
}

// Thump: soft sub hit for scene changes.
{
  let ph = 0;
  writeWav(
    "thump.wav",
    render(0.45, (t) => {
      const f = 48 + 70 * Math.exp(-t * 18);
      ph += (2 * Math.PI * f) / SR;
      return Math.sin(ph) * Math.exp(-t * 7) * 0.85;
    }),
  );
}

// Chime: gentle two-note bell for the CTA.
{
  const bell = (t, f) =>
    (Math.sin(2 * Math.PI * f * t) +
      0.4 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t * 6) +
      0.2 * Math.sin(2 * Math.PI * f * 5.4 * t) * Math.exp(-t * 10)) *
    Math.exp(-t * 3.2);
  writeWav(
    "chime.wav",
    render(1.6, (t) => {
      const a = bell(t, 1318.5);
      const b = t > 0.09 ? bell(t - 0.09, 1975.5) : 0;
      return (a * 0.22 + b * 0.18) * Math.min(1, t / 0.004);
    }),
  );
}

// Pad: calm, slowly breathing Dmaj9 bed under the whole video.
{
  const dur = 20.5;
  const notes = [73.42, 146.83, 220.0, 277.18, 329.63, 440.0];
  writeWav(
    "pad.wav",
    render(dur, (t) => {
      let s = 0;
      notes.forEach((f, k) => {
        const det = 1 + (k % 2 ? 0.0021 : -0.0018);
        const amp = k === 0 ? 0.5 : 0.28 / (1 + k * 0.25);
        const lfo = 0.75 + 0.25 * Math.sin(2 * Math.PI * (0.07 + k * 0.013) * t + k);
        s += (Math.sin(2 * Math.PI * f * t) + Math.sin(2 * Math.PI * f * det * t)) * amp * lfo;
      });
      const fadeIn = Math.min(1, t / 1.8);
      const fadeOut = Math.min(1, (dur - t) / 1.6);
      return s * 0.16 * fadeIn * Math.max(0, fadeOut);
    }),
  );
}

console.log("SFX written to public/sfx");
```
