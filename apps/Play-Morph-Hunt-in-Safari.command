#!/bin/bash
cd "$(dirname "$0")/.."
MH="void-2d-v84"
T="$(date +%s)"
URL="https://grahamgattegno.github.io/lithos/index.html?mh=${MH}&t=${T}&play=safari#morphhunt"
open -a "Safari" "$URL" 2>/dev/null || open "$URL"
