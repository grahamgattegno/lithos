#!/usr/bin/env bash
# Build per-gem MP4 clips + full field-catalog gemstone reel.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec node "$ROOT/scripts/build-gem-videos.mjs" "$@"
