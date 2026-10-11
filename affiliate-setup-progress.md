# Lithos Affiliate Setup Progress

Email: graham.gattegno@alpha.school  
Awin publisher ID: **3027627**  
Awin password: stored in password manager only — **do not put plaintext credentials in this file**

Last Awin dashboard check: **2026-08-09** (Playwright login OK)

## Company signups (goal: ≥5)

| # | Company | Network | Status | Tracking link |
|---|---------|---------|--------|---------------|
| 1 | **Brian Gavin Diamonds** | Post Affiliate Pro | Signed up (Pending approval) | **LIVE** `https://bgd.postaffiliatepro.com/scripts/click.php?a_aid=lithos` |
| 2 | **Miles Jewellery** | Awin (mid **129311**) | **Joined / active** · 10% · 30-day cookie · Link status Online | **LIVE** `https://www.awin1.com/cread.php?awinmid=129311&awinaffid=3027627&ued=https%3A%2F%2Fmilesjewellery.com%2F` |
| 3 | **Diamond Rocks** | Awin (mid **51929**) | **Joined / active** · 4% · ~£2k AOV · UK · Link status Online | **LIVE** `https://www.awin1.com/cread.php?awinmid=51929&awinaffid=3027627&ued=https%3A%2F%2Fwww.diamondrocks.co.uk%2F` |
| 4 | **Leibish** | Post Affiliate Pro | Signed up — login fails; no password email; reset skipped (captcha) | Login: https://pap.leibish.com/affiliates/login.php |
| 5 | **WhiteFlash** | Post Affiliate Pro | Submitted — await password email | Pending inbox |
| 6 | **Awin publisher** | Awin | **Approved** (ID **3027627**) | Network access |
| 7 | Angara | Impact | Blocked: SMS OTP to real phone | — |
| 8 | GemsNY | Impact | Blocked: SMS OTP to real phone | Site scaffold ready (`clickUrl` empty) |
| 9 | **Allurez** | Awin (mid **122728**) | **Still PENDING** (dashboard 2026-08-09; no approval email) | Wire after approval |
| 10 | Brilliant Earth | Impact | **Blocked: SMS OTP** | Signup: https://app.impact.com/campaign-promo-signup/Brilliant-Earth.brand |

### Awin approved (joined)

- Miles Jewellery (129311)
- Diamond Rocks (51929)

### Awin pending (applied, awaiting advertiser) — dashboard 2026-08-09

Allurez (122728), Pippa Small Jewellery (US), Jacques du Manoir GLOBAL, Chow Sang Sang Jewellery, Missoma US, Miraki Jewels, Stretch It Body Jewellery, ALMASIKA Fine Jewellery (US), LeiVanKash Jewellery, Alder Fine Jewellery, Ouros Jewels.

Not found / no pending row on search: Gemondo, Angara (Awin UK/DE/Canada may have closed or not matched search).

## Live on Lithos site (`index.html`)

- Partner strip: **Brian Gavin**, **Miles** (10%), **Diamond Rocks** (tracked Awin)
- Footer: Brian Gavin, Miles, Diamond Rocks, GemsNY
- Company → Partners: Brian Gavin, Miles, Diamond Rocks, GemsNY (Impact pending)
- Drawer CTAs: diamonds → Brian Gavin + Diamond Rocks; colored gems → GemsNY + Miles
- `AFFILIATE_PARTNERS`: `briangavin`, `miles`, `diamondrocks` with `clickUrl` set; `gemsny` untracked until Impact

## Credentials / notes

- Site URL: https://grahamgattegno.github.io/lithos/
- Company: Lithos
- Awin login: https://ui.awin.com/idp/en/awin/login
- Incomplete Awin publisher profile banner still showing (may slow some approvals)

## Blockers needing Graham

1. **Real mobile number** for Angara / GemsNY / Brilliant Earth Impact SMS OTP
2. Optional: complete Awin publisher profile; check spam for Leibish / WhiteFlash / Brian Gavin password emails
3. Wait for Allurez (+ other pending Awin jewellery) approvals, then wire mid + `cread.php` links

## Deploy note

GitHub Pages serves from the repo — commit + push needed for live site to show new tracked partner strip/footer (ask before committing).
