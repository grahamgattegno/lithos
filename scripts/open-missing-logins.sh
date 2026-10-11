#!/usr/bin/env bash
# Opens login tabs in YOUR Google Chrome (saved passwords work). No Playwright lock.
set -euo pipefail
URLS=(
  "https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fstudio.youtube.com"
  "https://www.tiktok.com/login"
  "https://www.dailymotion.com/signin"
  "https://x.com/i/flow/login"
)
for u in "${URLS[@]}"; do
  open -a "Google Chrome" "$u"
  sleep 0.4
done
osascript -e 'tell application "Google Chrome" to activate' 2>/dev/null || true
echo "Opened ${#URLS[@]} login tabs in Chrome. Sign in, then: node scripts/check-platform-logins.mjs"
