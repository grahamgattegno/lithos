#!/usr/bin/env bash
# Build Lithos promotional ad from screenshots in assets/ad-clips/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLIPS_DIR="${1:-$ROOT/assets/ad-clips}"
OUT_VIDEO="${2:-$ROOT/assets/lithos-ad.mp4}"
TMP_DIR="$ROOT/assets/.ad-build-tmp"
CLIP_DUR=1.5
TITLE_DUR=2.0
END_DUR=2.5
FPS=30
W=1920
H=1080
FRAMES=$(python3 -c "print(int($CLIP_DUR * $FPS))")

mkdir -p "$TMP_DIR" "$(dirname "$OUT_VIDEO")"
node "$ROOT/scripts/make-ad-cards.mjs" "$CLIPS_DIR"

make_clip() {
  local input="$1" output="$2" duration="$3"
  ffmpeg -y -loop 1 -i "$input" \
    -vf "scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:black,zoompan=z='min(zoom+0.0008,1.08)':d=${FRAMES}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${W}x${H},format=yuv420p" \
    -t "$duration" -c:v libx264 -pix_fmt yuv420p -r "$FPS" "$output"
}

concat_list="$TMP_DIR/concat.txt"
: > "$concat_list"

make_clip "$CLIPS_DIR/00-title-card.png" "$TMP_DIR/00-title.mp4" "$TITLE_DUR"
echo "file '00-title.mp4'" >> "$concat_list"

clip_idx=1
for png in "$CLIPS_DIR"/[0-9][0-9]-*.png; do
  base=$(basename "$png")
  [[ "$base" == "00-title-card.png" || "$base" == "99-end-card.png" ]] && continue
  [ -f "$png" ] || continue
  out="$TMP_DIR/$(printf '%02d' "$clip_idx")-${base%.png}.mp4"
  make_clip "$png" "$out" "$CLIP_DUR"
  echo "file '$(basename "$out")'" >> "$concat_list"
  clip_idx=$((clip_idx + 1))
done

make_clip "$CLIPS_DIR/99-end-card.png" "$TMP_DIR/99-end.mp4" "$END_DUR"
echo "file '99-end.mp4'" >> "$concat_list"

ffmpeg -y -f concat -safe 0 -i "$concat_list" -c copy "$OUT_VIDEO"

duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT_VIDEO")
content_clips=$((clip_idx - 1))
echo "Built $OUT_VIDEO (${duration}s, ${content_clips} content clips + title/end, 16:9 ${W}x${H})"
