# Ali Alhamed — شراء البيت مقابل الإيجار (Remotion edit)

This is the full horizontal YouTube edit in the **Kinetic Chapter Frame — Arabic** style, which follows the references R1–R10 and `توجيهات.txt`.

| | |
|---|---|
| Composition | `AliAlhamedMain` |
| Resolution | 1920 × 1080 (16:9) |
| FPS | 30 |
| Duration | 4055 frames = 135.167 s (same as the source) |
| Output | H.264, yuv420p, CRF 18, AAC 320k / 48 kHz |

## Setup
```bash
npm install
# Copy the source video (not included: 176 MB) to public/source.mp4
cp "../ali alhamed 1/ali alhamed test.mp4" public/source.mp4
node scripts/make-sfx.mjs   # (re)generates the synthesized SFX kit in public/sfx (already included)
```
Fonts (Cairo and Tajawal) are installed locally from `@fontsource`, so rendering needs no network.

## Preview (Remotion Studio)
```bash
npm run dev
```

## Render
```bash
npx remotion render src/index.ts AliAlhamedMain out/ali_alhamed_final.mp4 \
  --codec=h264 --crf=18 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=320k
```
`remotion.config.ts` points to a Playwright headless-shell Chromium at
`/opt/pw-browsers/...`. Remove `setBrowserExecutable` on a normal machine to let
Remotion use its own browser.

QA helpers:
- `node scripts/stills.mjs out/qa 12.5 49.97 …` renders stills, given in seconds. Run `npx remotion bundle src/index.ts --out-dir=build` first.
- `python3 scripts/sheet.py out/qa out/qa/sheet` tiles those stills into contact sheets.

## Project structure
```
src/
  index.ts / Root.tsx            registerRoot + <Composition>
  theme.ts                       colours, easings, springs, motion timing (single source)
  fonts.ts                       local Cairo / Tajawal + delayRender until loaded
  data/timing.ts                 ALL timing: scenes, presenter layout track, SFX cues
  compositions/AliAlhamedMain.tsx  layer stack (bg → presenter → scenes → grade/grain → SFX)
  components/                    DotGrid, Presenter, Stage (FullScreen/Window/Flash/Finish/SfxTrack),
                                 UI (Ar, Num, Counter, Card, Kicker, Rule, IconBadge, SideKeyword), Icon, anim
  scenes/                        FinancialProfile, BiggerDecisions, DubaiRent, TenYearEquation,
                                 StopAndCosts, BuyVsRent, ResearchInsight, DecisionChapter,
                                 SevenQuestions, AliIntro (intro + outro)
timing.json                      export of src/data/timing.ts
scene-plan.md                    scene-by-scene plan (times, sentences, layout, text, SFX)
```

## Notes
- The source MP4 is used as **one continuous `<OffthreadVideo>`**, and its original audio is kept unchanged. The edit never cuts, re-orders, changes the speed or changes the pitch of the recording. Layouts (full / side panel / card / cinematic band) only re-frame the picture.
- The source MP4 is itself an older edit with burned-in overlays. `scene-plan.md` lists each one and how the new edit covers it.
- To retime anything, edit `src/data/timing.ts`. Scenes read their cues in seconds through `F()`.
