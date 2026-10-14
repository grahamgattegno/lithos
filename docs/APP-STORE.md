# Lithos on the Apple App Store

Lithos ships as a **native iOS shell** (Capacitor) with the same website **bundled inside the app** so it works offline and passes Apple’s “more than a website” review better than a bare browser link.

## What you need (adult / account holder)

1. **Apple Developer Program** — [developer.apple.com/programs](https://developer.apple.com/programs/) ($99/year).
2. **Mac with Xcode** (free from the Mac App Store).
3. **App Store Connect** — [appstoreconnect.apple.com](https://appstoreconnect.apple.com) (same Apple ID as Developer).

**Bundle ID (already in this repo):** `com.grahamgattegno.lithos`  
**App name:** Lithos

## One-time setup on your Mac

```bash
cd /path/to/lithos
npm install
npm run ios:prepare
```

That copies the site into `www/`, syncs into `ios/`, and opens **Xcode**.

In Xcode:

1. Select the **App** target → **Signing & Capabilities**.
2. Choose your **Team** (Developer account).
3. Confirm **Bundle Identifier** is `com.grahamgattegno.lithos`.

## Create the App Store record

1. App Store Connect → **Apps** → **+** → **New App**.
2. Platform: **iOS**. Name: **Lithos**. Primary language: English.
3. Bundle ID: pick `com.grahamgattegno.lithos` (must match Xcode).
4. SKU: e.g. `lithos-2026`.

After the app exists, **App Information** shows the numeric **Apple ID** (App Store ID).

## Privacy policy URL (required)

Use your hosted policy, for example:

`https://grahamgattegno.github.io/lithos/privacy.html`

(Push `privacy.html` with your site if it is not live yet.)

## Archive and upload

1. In Xcode, device target: **Any iOS Device (arm64)**.
2. **Product → Archive**.
3. **Distribute App → App Store Connect → Upload**.
4. In App Store Connect, add screenshots, description, age rating, and submit for **Review**.

## Updating Lithos after code changes

```bash
npm run cap:sync
```

Then archive again in Xcode and upload a new build; increment **Version** / **Build** in Xcode.

## Category suggestions

- **Primary:** Education  
- **Secondary:** Games  

## Support URL

Your GitHub Pages site or a simple support page:  
`https://grahamgattegno.github.io/lithos/`
