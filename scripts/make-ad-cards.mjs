#!/usr/bin/env node
/** Generate title/end card PNGs for Lithos ad (ffmpeg lacks drawtext). */
import { chromium } from 'playwright';
import path from 'path';

const OUT = path.resolve(process.argv[2] || 'assets/ad-clips');
const cards = [
  {
    file: '00-title-card.png',
    html: `<body style="margin:0;width:1920px;height:1080px;background:#0a0b0f;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Georgia,'Times New Roman',serif;color:#c9a94f">
      <div style="font-size:120px;letter-spacing:.08em;margin-bottom:24px">LITHOS</div>
      <div style="font-family:system-ui,sans-serif;font-size:32px;color:#cccccc">6000 Specimens · 11 Games · Geology School</div>
    </body>`,
  },
  {
    file: '99-end-card.png',
    html: `<body style="margin:0;width:1920px;height:1080px;background:#0a0b0f;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Georgia,'Times New Roman',serif;color:#c9a94f">
      <div style="font-size:64px;margin-bottom:20px">Start Your Expedition</div>
      <div style="font-family:system-ui,sans-serif;font-size:36px;color:#ffffff">grahamgattegno.github.io/lithos</div>
    </body>`,
  },
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
for (const card of cards) {
  await page.setContent(`<!DOCTYPE html><html>${card.html}</html>`, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(OUT, card.file), type: 'png' });
  console.log('Wrote', card.file);
}
await browser.close();
