#!/bin/bash
cd "$(dirname "$0")"
if ! xcode-select -p 2>/dev/null | grep -q "Xcode.app"; then
  echo "⚠️  Full Xcode is required (not just Command Line Tools)."
  echo "   Install Xcode from the Mac App Store, open it once, then run:"
  echo "   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"
  exit 1
fi
if [[ ! -d node_modules ]]; then
  echo "Installing npm packages…"
  npm install
fi
echo "Bundling Lithos into the iOS app…"
npm run cap:sync
echo "Opening Xcode (open ios/App/App.xcworkspace)…"
open ios/App/App.xcworkspace
