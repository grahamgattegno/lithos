#!/bin/bash
cd "$(dirname "$0")"
MH="void-2d-v112"
T="$(date +%s)"
PORT=8765
BASE="http://127.0.0.1:${PORT}"
if ! curl -sf -o /dev/null "${BASE}/morph-hunt.js" 2>/dev/null; then
  echo "Starting local server on ${PORT}…"
  python3 -m http.server "$PORT" >/dev/null 2>&1 &
  sleep 0.6
fi
URL="${BASE}/index.html?mh=${MH}&t=${T}&owner=1#morphhunt"
echo "Opening LOCAL Morph Hunt (newest code):"
echo "$URL"
open -a "Safari" "$URL" 2>/dev/null || open "$URL"
