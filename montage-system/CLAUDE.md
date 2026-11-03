# Montage System — notes for Claude

Remotion system that turns a raw talking-head clip into an Instagram Reel (1080×1920, 30fps, 25–40s).
**Each video is just data:** a `ReelSpec` in `src/videos/<slug>.ts`, rendered by the single `<Reel>` composition.

## Editing procedure (follow in order when the user asks for a montage)
1. **Find the raw file** in `public/raw/` (naming: `YYYY-MM-DD_slug.mp4`, lowercase, dashes). If it came as a chat
   attachment, copy it there under that name.
2. **Probe:** `npm run probe <slug>` → resolution, fps, audio, silences, `suggestedSegments`
   (written to `briefs/<slug>.probe.json`). Warn if not vertical / no audio.
3. **Transcribe:** `npm run transcribe <slug>` (default Arabic; `WHISPER_MODEL=large-v3` for best Arabic)
   → `public/captions/<slug>.json` + `briefs/<slug>.transcript.txt` (timestamps in RAW seconds).
   If whisper can't run (e.g. huggingface.co blocked), tell the user, and time scenes from the silences + script instead.
4. **Scaffold:** `npm run new <slug>` → `briefs/<slug>.md` + `src/videos/<slug>.ts` (registered automatically).
5. **Write the spec** from the user's brief + transcript:
   - `segments` from the probe (drop false starts / retakes the transcript reveals). `autoPunchIn: true`.
   - Scene times are in the EDITED timeline. Convert raw → edited with the segment offsets
     (edited = offset_of_segment + (raw − segment.start)).
   - Structure: hook 0–~2.5s → (lowerThird) → explanation/stat/iconPop beats → points (items `at` = when said,
     seconds from scene start) → cta last 3–5s. New visual at least every ~3s; leave some breathing room on the face.
   - Max one highlighted word per headline; only the CTA glows.
6. **Verify:** `npx tsc`, then `npm run still <id> <seconds…>` and LOOK at every frame
   (`out/stills/<id>/`): safe zone (`showSafeZone: true` temporarily), overlaps with the face, captions vs overlays,
   text overflow, Arabic joining.
7. **Hand off for preview:** tell the user to run `npm run dev` and open the composition in Studio.
   **Never render the final video unless the user explicitly says so.** When they do:
   `npm run render <id> [--client <client-slug>]` → `out/<id>.mp4` (+ copy to `../clients/<slug>/deliveries/`).

## Map
- `src/system/` — `types.ts` (ReelSpec), `Reel.tsx` (layer stack), `calculateMetadata.ts` (auto duration, captions),
  `timeline.ts` (segments/retiming), `safeArea.ts` (IG safe zone), `sfx.tsx`
- `src/templates/` — Hook, Explanation, Points, CTA, Stat, LowerThird, IconPop (+ SceneShell: placement/backdrop)
- `src/components/` — motion (useSpringIn/useExit/Entrance/Stagger), text (TextReveal, Captions),
  graphics (Icon, IconAnimation, StaggerList, LowerThird, CTAButton, Counter, Tag, ProgressBar),
  layout (SafeArea, GlassCard, Scrim), fx (Grade, Grain, Vignette, BgMesh, FlashCut, SafeZoneGuide), footage (TalkingHead)
- `src/theme/theme.ts` — all colors/easings/springs/type sizes. Never inline them. Per-video override: `spec.colors`.
- `src/examples/` — one Studio composition per component.
- Arabic: `TextReveal mode="char"` uses a per-word wipe for Arabic (never split joined letters).
- Rules: no linear easing, clamp every interpolate, entrances animate 2–3 properties, staggered, exits faster.
