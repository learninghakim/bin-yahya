# Notes for Claude

## Telegram notifications
The Stop hook (`.claude/hooks/telegram-notify.sh`) sends a Telegram message only when:
- a new or re-rendered `.mp4` appears in an `out/` folder (e.g. `my-remotion-video/out/final-video.mp4`), or
- the file `.claude/notify-now` exists.

Create `.claude/notify-now` (optionally containing a short Arabic summary of what was done) when the user
asks to be notified, or when a long task they requested is fully finished. Do not create it after
ordinary replies or follow-up questions. The hook deletes the file after sending.

## Clients
Each client has `clients/<slug>/` (brief, brand, references, deliveries) and
`my-remotion-video/src/clients/<slug>/` (theme + videos). Shared motion pieces live in
`my-remotion-video/src/shared/`. New client: copy `clients/_template`. After rendering to `out/`,
copy the final video into `clients/<slug>/deliveries/`.

## Rendering
Never render the final video on your own. Prepare the changes and let the user preview them in
Remotion Studio (`npm run dev` in `my-remotion-video/`). Render only when the user explicitly says to.

## Montage system (talking-head Reels)
`montage-system/` is a standalone Remotion project for editing raw talking-head clips into Reels.
Raw uploads go in `montage-system/public/raw/` (`YYYY-MM-DD_slug.mp4`). Follow `montage-system/CLAUDE.md`
for the editing procedure. Same rendering rule applies: preview first, render only when asked.
