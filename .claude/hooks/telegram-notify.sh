#!/bin/bash
# Stop hook: sends a Telegram message only when
#   1) a new or re-rendered video appears in any out/ folder (e.g. out/final-video.mp4), or
#   2) the flag file .claude/notify-now exists (created when the user asks for a notification).
# Usage: telegram-notify.sh          -> Stop hook (check and maybe send)
#        telegram-notify.sh --init   -> SessionStart hook (record existing videos, send nothing)

ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
STATE="$ROOT/.claude/.telegram-videos"
FLAG="$ROOT/.claude/notify-now"

snapshot() {
  find "$ROOT" -path '*/node_modules' -prune -o -path '*/out/*.mp4' -type f -printf '%T@ %P\n' 2>/dev/null | sort -k2
}

if [[ "$1" == "--init" ]]; then
  snapshot > "$STATE"
  exit 0
fi

CURRENT="$(snapshot)"
NEW_VIDEOS=""
if [[ -f "$STATE" ]]; then
  NEW_VIDEOS="$(comm -13 <(sort "$STATE") <(echo "$CURRENT" | sort) | cut -d' ' -f2- | sed '/^$/d')"
fi
echo "$CURRENT" > "$STATE"

REASON=""
if [[ -f "$FLAG" ]]; then
  REASON="$(cat "$FLAG")"
  [[ -z "$REASON" ]] && REASON="المهمة اكتملت"
  rm -f "$FLAG"
fi
if [[ -n "$NEW_VIDEOS" ]]; then
  REASON="${REASON:+$REASON
}🎬 فيديو جديد جاهز:
$NEW_VIDEOS"
fi

[[ -z "$REASON" ]] && exit 0

if [[ -z "$TELEGRAM_BOT_TOKEN" || -z "$TELEGRAM_CHAT_ID" ]]; then
  echo "Telegram credentials not set"
  exit 0
fi

MESSAGE="✅ انتهت المهمة في الجلسة السحابية
المشروع: $(basename "$ROOT")
$REASON
الوقت: $(date '+%Y-%m-%d %H:%M:%S')"

curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d "chat_id=${TELEGRAM_CHAT_ID}" \
  --data-urlencode "text=${MESSAGE}" > /dev/null 2>&1
exit 0
