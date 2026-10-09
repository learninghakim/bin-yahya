# bin-yahya

مشروع فيديوهات قصيرة (ريلز) تُصنع بالبرمجة عبر Remotion.

## ترتيب الملفات

```
bin-yahya/
├── README.md              ← هذا الملف: شرح المشروع وترتيبه
├── CLAUDE.md              ← تعليمات لـ Claude داخل المشروع
├── references/            ← صور مرجعية للتصميم (الألوان والأسلوب)
│   └── r1.png
├── .claude/               ← إعدادات Claude: الإضافات وسكربت إشعارات تيليجرام
│   ├── settings.json
│   └── hooks/telegram-notify.sh
└── my-remotion-video/     ← مشروع الفيديو
    ├── src/
    │   ├── Root.tsx         ← قائمة الفيديوهات (Compositions)
    │   ├── StudyReel.tsx    ← ريل نصائح المذاكرة (يجمع المشاهد)
    │   ├── scenes/          ← مشاهد الفيديو بالترتيب (مقدمة، جذب، نقاط، دعوة)
    │   ├── components/      ← عناصر مشتركة (خلفية، نصوص متحركة، أيقونات)
    │   ├── theme.ts         ← الألوان
    │   └── fonts.ts         ← الخطوط
    ├── public/
    │   ├── fonts/           ← ملفات الخطوط العربية
    │   └── sfx/             ← المؤثرات الصوتية
    ├── scripts/             ← سكربتات مساعدة (توليد المؤثرات الصوتية)
    └── out/                 ← الفيديو النهائي بعد التصدير (.mp4)
```

## التشغيل

```bash
cd my-remotion-video
npm install
npm run dev          # معاينة في المتصفح
npx remotion render  # تصدير الفيديو إلى out/
```
