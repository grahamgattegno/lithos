#!/usr/bin/env bash
# Export Lithos ad in formats suited for each social platform.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${1:-$ROOT/assets/lithos-ad.mp4}"
OUT_DIR="${2:-$ROOT/assets/social}"

mkdir -p "$OUT_DIR"

# YouTube / Facebook / X — landscape 16:9 (source is already 1920x1080)
cp -f "$SRC" "$OUT_DIR/lithos-ad-youtube.mp4"
cp -f "$SRC" "$OUT_DIR/lithos-ad-facebook.mp4"
cp -f "$SRC" "$OUT_DIR/lithos-ad-x.mp4"

# TikTok / Instagram Reels — vertical 9:16 with blurred pillarbox
ffmpeg -y -i "$SRC" \
  -vf "split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:20[bg];[b]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2" \
  -c:v libx264 -pix_fmt yuv420p -crf 20 -movflags +faststart \
  "$OUT_DIR/lithos-ad-tiktok.mp4"

cp -f "$OUT_DIR/lithos-ad-tiktok.mp4" "$OUT_DIR/lithos-ad-instagram-reels.mp4"

# Instagram feed — square 1:1
ffmpeg -y -i "$SRC" \
  -vf "split[a][b];[a]scale=1080:1080:force_original_aspect_ratio=increase,crop=1080:1080,boxblur=20:20[bg];[b]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2" \
  -c:v libx264 -pix_fmt yuv420p -crf 20 -movflags +faststart \
  "$OUT_DIR/lithos-ad-instagram-feed.mp4"

echo "Exported social videos to $OUT_DIR:"
ls -lh "$OUT_DIR"/*.mp4
