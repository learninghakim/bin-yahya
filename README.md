# bin-yahya

مشروع فيديوهات قصيرة (ريلز) تُصنع بالبرمجة عبر Remotion، مرتّب حسب العملاء.

## ترتيب الملفات

```
bin-yahya/
├── README.md
├── CLAUDE.md                      ← تعليمات Claude
├── .claude/                       ← الإعدادات وسكربت إشعارات تيليجرام
├── clients/                       ← العملاء: مجلد لكل عميل
│   ├── _template/                 ← نموذج فارغ يُنسخ لكل عميل جديد
│   └── abdullah-almashhor/
│       ├── brief.md               ← طلب العميل وهويته
│       ├── brand/                 ← الشعار وملفات الهوية
│       ├── references/            ← الصور المرجعية
│       └── deliveries/            ← الفيديوهات المسلَّمة
└── my-remotion-video/             ← محرك الفيديو (واحد لكل العملاء)
    ├── src/
    │   ├── Root.tsx               ← قائمة الفيديوهات
    │   ├── shared/                ← المشترك: الثيم الأساسي والعناصر المتحركة
    │   └── clients/<العميل>/      ← ثيم العميل ومشاهد فيديوهاته
    └── public/                    ← الخطوط والمؤثرات الصوتية
```

## إضافة عميل جديد

1. انسخ `clients/_template` إلى `clients/<اسم-العميل>` واملأ `brief.md`، وضع الشعار في `brand/`.
2. أنشئ `my-remotion-video/src/clients/<اسم-العميل>/` فيه `theme.ts` بألوانه وملف الفيديو ومشاهده.
3. سجّل الفيديو في `src/Root.tsx`.
4. بعد التصدير انقل الفيديو إلى `clients/<اسم-العميل>/deliveries/`.

## التشغيل

```bash
cd my-remotion-video
npm install
npm run dev                                  # معاينة في المتصفح
npx remotion render StudyReel out/video.mp4  # تصدير الفيديو
```
