#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WWW="$ROOT/www"
rm -rf "$WWW"
mkdir -p "$WWW"
rsync -a \
  --exclude node_modules \
  --exclude ios \
  --exclude android \
  --exclude www \
  --exclude .git \
  --exclude .DS_Store \
  --exclude 'morph-hunt.void-2d-v*.js' \
  --exclude ads \
  --exclude 'scripts/allurez-out' \
  --exclude ai-config.js \
  "$ROOT/" "$WWW/"
# App Store build: open at catalog (games still reachable in-app)
if [[ -f "$WWW/index.html" ]]; then
  echo "Lithos www bundle ready at $WWW ($(du -sh "$WWW" | cut -f1))"
fi
