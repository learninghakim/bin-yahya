# Notes for Claude

## Telegram notifications
The Stop hook (`.claude/hooks/telegram-notify.sh`) sends a Telegram message only when:
- a new or re-rendered `.mp4` appears in an `out/` folder (e.g. `my-remotion-video/out/final-video.mp4`), or
- the file `.claude/notify-now` exists.

Create `.claude/notify-now` (optionally containing a short Arabic summary of what was done) when the user
asks to be notified, or when a long task they requested is fully finished. Do not create it after
ordinary replies or follow-up questions. The hook deletes the file after sending.
