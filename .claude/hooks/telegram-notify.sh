#!/bin/bash

if [[ -z "$TELEGRAM_BOT_TOKEN" || -z "$TELEGRAM_CHAT_ID" ]]; then
  echo "Telegram credentials not set"
  exit 0
fi

MESSAGE="✅ انتهت المهمة في الجلسة السحابية
المشروع: $(basename "$PWD")
الوقت: $(date '+%Y-%m-%d %H:%M:%S')"

curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d "chat_id=${TELEGRAM_CHAT_ID}" \
  -d "text=${MESSAGE}" \
  -d "parse_mode=HTML" > /dev/null 2>&1
