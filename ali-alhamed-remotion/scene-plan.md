# Scene plan — Ali Alhamed · شراء البيت مقابل الإيجار

Style: **KINETIC CHAPTER FRAME — ARABIC** (R1–R10): near-black dot grid, white Cairo Black type, neon pink `#FF1A6C` only for emphasis.
Source: `ali alhamed test.mp4` — 1920×1080, 30 fps, 4055 frames (135.167 s), AAC 48 kHz stereo.
Timing source of truth: `src/data/timing.ts` (also exported as `timing.json`). Times = source seconds.

**SRT offset check:** the SRT already starts at 00:00:00 (not 01:00:00), and it matches the audio (silence 66.05–66.70 s ↔ SRT gap 66.13–66.73 s). No offset applied.

**The source is an already-edited export.** It has its own orange overlays, B-roll and social bars burned in. The new edit covers every one of them:

| Baked-in source element | Time (s) | How it is covered |
|---|---|---|
| "10,000$ شهريا" badge (top-left, slides in from the edge) | 3.07–5.1 | Data panel docked flush to the left edge |
| "قراراته المالية تكبر" lower text | 11.0–14.4 | BAND layout (shows source rows 0–640 only) |
| Dubai B-roll + text | 15.3–18.7 | Full-screen C |
| "90-120" badge | 21.3–23.2 | B panel crops source x 560–1300 |
| Full-screen 120,000 graphic | 31.17–36.2 | Full-screen C |
| "شقتك المناسبة 1,200,000" lower text | 52–56.4 | Full-screen C (extended to 56.4) |
| 4% / 5% / 2% badges (top-left) | 58.5–65.3 | B panel crop. The source's invented "5%" maintenance figure is not shown |
| "التملك ليس أفضل…" lower text | 74.5–79.6 | Full-screen C |
| Journal cover insert (left) | 83.2–86.6 | Opaque journal card on the left |
| House B-roll | 88.2–91.6 | Full-screen C |
| Stairs graphic + white flash | 93.13–98.5 | Full-screen C |
| Question-marks graphic + flash + circle wipe | 107.2–111.4 | Full-screen C (until 111.45) |
| ADNOC / training B-roll (real footage of Ali) | 111.5–119.8 | Kept, framed inside a card (CARD layout) |
| Social bars + dua text (bottom) | 125–135 | BAND layout |

## Layout legend
- **A**: presenter full screen (optional punch-in of 1.04–1.12)
- **B**: presenter in a left panel, graphics on the right
- **C**: full-screen motion graphic. The original audio continues underneath.
- **CARD**: full source frame scaled into a framed card
- **BAND**: cinematic band, with text in the bottom bar

The presenter is a single, continuous `<OffthreadVideo>` that morphs between layouts. It is never cut, sped up or re-ordered.

## Scenes

| # | Start → End | Source sentence(s) | Type | Visual purpose / text | Transition | SFX |
|---|---|---|---|---|---|---|
| 01 | 0.00 → 8.37 | 40 ألف درهم · 10 آلاف دولار · 200 ألف درهم · وضع مالي جيد | A (+punch 1.04 at 6.43) | Financial profile: 3 data cards staggered to the audio (40,000 درهم · $10,000 · 200,000 درهم), then a "وضع مالي جيد ✓" chip | Panel slides from the left edge | click ×3, tick |
| 02 | 8.37 → 14.47 | قراراته المالية صارت تكبر · عائلة · مكان محترم | A → BAND | Decision growth: قرارات أكبر → عائلة → مكان محترم (icon nodes light up in turn) | Morph to band | whoosh |
| 03a | 14.47 → 19.33 | شقة في دبي · غرفتين وصالة | C | "شقة في دبي" (دبي pops in pink), stroke-drawn skyline, room chips | Pink line-wipe (RTL) | whoosh |
| 03b | 19.33 → 24.10 | إيجار سنوي 90 ألف إلى 120 ألف · حسب المنطقة | B | Rent card: 90,000 → 120,000 درهم range bar filling right→left | Cut | whoosh, tick |
| 03c | 24.10 → 28.65 | 120 ألف السنة · 10 آلاف شهريًا | C | Equation 120,000 ÷ 12 = 10,000 (counter, pink result) | Wipe | whoosh, pop |
| 04a | 28.65 → 30.95 | فأول شيء بيخبرون الناس | A (1.04) | Calm: presenter only | Cut | — |
| 04b | 30.95 → 36.30 | يا ريال حرام عليك · 120 ألف تعطيها للمالك | C | Quote card "يا ريال، حرام عليك!" + money flow 120,000 → للمالك | Wipe | whoosh |
| 04c | 36.30 → 39.40 | خذ لك بيت عن طريق التمويل | A | Side keyword: خذ لك بيت **بالتمويل** | Cut | — |
| 04d | 39.40 → 45.40 | 120 ألف × 10 سنوات = مليون ومئتين · كنت تقدر تاخذ فيها شقة | C | Equation built step by step: 120,000 × 10 = 1,200,000, with 10 year-blocks; then house "= شقة؟" | Wipe | whoosh, tick ×2, impact, pop |
| 04e | 45.40 → 49.93 | بتفكير منطقي كلامهم صح · روح على طول اشتري | A (punch 1.07 at 48.57) | Side "كلامهم صح ✓", then a pink "اشتري؟" chip, framed as a question | Cut | click, riser |
| 05a | 49.93 → 51.37 | **بس وقف، وقف شوي** | C — PATTERN INTERRUPT | Huge "وقف!" slam (1.35→1) with a 2-frame pink flash and frame rules. The "freeze feeling" is purely visual; audio stays in sync | Hard cut + flash | **impact** |
| 05b | 51.37 → 56.40 | الشقة بمليون ومئتين وين موجودة؟ · سعره 2 مليون | C | 1,200,000؟ struck through → ≈ 2,000,000 counter | Cut | whoosh, impact |
| 05c | 56.40 → 65.40 | غير الـ2 مليون · 4% دائرة الأراضي · رسوم صيانة · 2% للبروكر | B | Cost stack accumulates: سعر العقار 2,000,000 + 4% + رسوم صيانة + 2%. No total is shown, because none is spoken | Cut | click, tick ×3 |
| 05d | 65.40 → 66.60 | وقف، وقف | A (punch 1.12) | "وقف" keyword | Punch cut | impact |
| 06a | 66.60 → 69.90 | فيه مصاريف أكثر بكثير غير سعر الشقة | C | سعر العقار **≠** التكلفة الكاملة | Wipe | whoosh |
| 06b | 69.90 → 73.17 | فأكيد هنا غلط · ما بشتري · بأستأجر | B | شراء ✗ / إيجار ✓ cards | Cut | click ×2 |
| 06c | 73.17 → 79.75 | لا لا · الدراسات ما تقول… · القرار يعتمد على عوامل عدة | C | Reset sweep; التملّك ≠ الأفضل دائمًا / الإيجار ≠ الأفضل دائمًا; Key idea quote "القرار يعتمد على **عوامل عدّة**" | Hard cut | impact, pop |
| 07a | 79.75 → 82.40 | وخلنا نتكلم بالمنطق | A | Calm breathing room | Cut | — |
| 07b | 82.40 → 86.90 | دراسة منشورة · Journal of Housing Economics · الدراسة كانت واضحة | A + card | Journal card (English kept LTR). No authors, year or title are invented | Slide in | whoosh |
| 07c | 86.90 → 91.75 | الشعور بأنك متملك بيت شعور جميل · الراحة | C (calm) | Glowing house; "شعور جميل"; chips الراحة / الاستقرار | Wipe, fade out | whoosh |
| 07d | 91.75 → 92.90 | ويخليك ترتاح في حياتك | A (1.04) | — | Fade | — |
| 08a | 92.90 → 98.60 | في هذا المقطع بعطيك الخطوات · القرار الصح · تشتري أو تستأجر | C — chapter frame | Big "؟", divider line reveal, "القرار الصح", then chips تشتري؟ أم تستأجر؟ | Wipe | whoosh, impact, click ×2 |
| 08b | 98.60 → 101.87 | هذا المقطع جدًا مهم · مو قرار بسيط | A (1.05 at 99.73) | Side: "مقطع مهم جدًا" + "قرار **كبير**" | Cut | — |
| 08c | 101.87 → 105.45 | تمويل عقاري · 20 سنة من حياتك · قد تكون خطأ | C | Huge pink "20 سنة" + timeline اليوم → بعد 20 سنة | Wipe | whoosh, impact |
| 09a | 105.45 → 106.67 | ففي آخر الفيديو | A | — | Cut | — |
| 09b | 106.67 → 111.45 | سبع أسئلة مفروض تجاوبها · تشتري أم تستأجر | C | "7 أسئلة" + 7 nodes lighting + تملّك ↔ إيجار. The questions themselves are not shown, since they are not in this excerpt | Wipe | whoosh, impact |
| 10 | 111.45 → 122.50 | أنا علي الحامد · مؤثر مالي مرخص · 40 ألف · 5 آلاف · المتوافقة مع الشريعة | CARD | Lower third (name, licensed role, licensing body), stats +40,000 مستثمر / +5,000 متدرّب, "استثمار متوافق مع الشريعة" chip. Real B-roll is kept inside the card | Cut | whoosh, tick ×2, click |
| 11 | 122.50 → 135.17 | هدفي نشر فكر الاستثمار بالطريقة الحلال · اشترك · تابعني · بسم الله… | BAND | Bottom bar: "هدفي: نشر فكر الاستثمار **بالطريقة الحلال**", then a small "اشترك في القناة" chip and "وتابعني…"; from 130.2 the frame is clean and Ali alone. No fade before the audio ends (the source's own last 0.4 s fade is kept) | Morph | click |

Rhythm: dense (01–05) → calm (07) → dense (08–09) → calm, presenter-led (10–11). About 59% of runtime shows Ali (A/B/CARD/BAND) and about 41% (56 s) is full-screen graphics. The C share runs a bit above the 35% guide because several C windows are needed to hide the old full-screen inserts baked into the source.
