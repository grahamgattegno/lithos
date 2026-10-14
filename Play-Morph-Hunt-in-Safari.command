#!/bin/bash
cd "$(dirname "$0")"
URL="https://grahamgattegno.github.io/lithos/?mh=void-2d-v80&play=safari#morphhunt"
open -a "Safari" "$URL" 2>/dev/null || open "$URL"
