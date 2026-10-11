#!/usr/bin/env node
/**
 * Open each social platform upload page with the correct video pre-selected metadata.
 * Uses Playwright in headed mode — log in when prompted, then the script fills forms.
 *
 * Usage:
 *   node scripts/deploy-social.mjs              # all platforms
 *   node scripts/deploy-social.mjs youtube x    # subset
 *
 * Env (optional — for API upload later):
 *   YOUTUBE_CLIENT_SECRETS, YOUTUBE_TOKEN_PATH
 *   META_ACCESS_TOKEN, META_PAGE_ID, META_IG_USER_ID
 *   X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET
 *   TIKTOK_ACCESS_TOKEN
 */
import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const meta = JSON.parse(readFileSync(resolve(ROOT, 'ads/social/metadata.json'), 'utf8'));

const PLATFORMS = {
  youtube: {
    label: 'YouTube',
    url: 'https://studio.youtube.com/channel/UC/videos/upload?d=ud',
    video: () => resolve(ROOT, meta.platforms.youtube.video),
    async fill(page) {
      await page.waitForTimeout(3000);
      const fileInput = page.locator('input[type="file"]').first();
      if (await fileInput.count()) {
        await fileInput.setInputFiles(this.video());
      }
      await page.waitForTimeout(5000);
      const title = page.locator('#textbox[aria-label*="title" i], #textbox[aria-label*="Title" i]').first();
      if (await title.count()) await title.fill(meta.platforms.youtube.title);
      const desc = page.locator('#textbox[aria-label*="description" i], #textbox[aria-label*="Tell viewers" i]').first();
      if (await desc.count()) await desc.fill(meta.platforms.youtube.description);
      console.log('YouTube: file attached + metadata filled. Review visibility and click Publish.');
    },
  },
  tiktok: {
    label: 'TikTok',
    url: 'https://www.tiktok.com/upload?lang=en',
    video: () => resolve(ROOT, meta.platforms.tiktok.video),
    async fill(page) {
      await page.waitForTimeout(3000);
      const fileInput = page.locator('input[type="file"]').first();
      if (await fileInput.count()) await fileInput.setInputFiles(this.video());
      await page.waitForTimeout(3000);
      const caption = page.locator('[contenteditable="true"], div[role="textbox"]').first();
      if (await caption.count()) await caption.fill(meta.platforms.tiktok.caption);
      console.log('TikTok: file attached + caption filled. Click Post.');
    },
  },
  x: {
    label: 'X (Twitter)',
    url: 'https://x.com/compose/post',
    video: () => resolve(ROOT, meta.platforms.x.video),
    async fill(page) {
      await page.waitForTimeout(4000);
      const fileInput = page.locator('input[type="file"]').first();
      if (await fileInput.count()) await fileInput.setInputFiles(this.video());
      await page.waitForTimeout(2000);
      const box = page.locator('[data-testid="tweetTextarea_0"], div[role="textbox"]').first();
      if (await box.count()) await box.fill(meta.platforms.x.text);
      console.log('X: file attached + text filled. Click Post.');
    },
  },
  facebook: {
    label: 'Facebook',
    url: 'https://www.facebook.com/reels/create',
    video: () => resolve(ROOT, meta.platforms.facebook.video),
    async fill(page) {
      await page.waitForTimeout(4000);
      const fileInput = page.locator('input[type="file"]').first();
      if (await fileInput.count()) await fileInput.setInputFiles(this.video());
      await page.waitForTimeout(3000);
      const box = page.locator('[contenteditable="true"][role="textbox"], div[aria-label*="Describe" i]').first();
      if (await box.count()) await box.fill(meta.platforms.facebook.text);
      console.log('Facebook Reels: file attached + text filled. Click Publish/Share.');
    },
  },
  instagram: {
    label: 'Instagram',
    url: 'https://www.instagram.com/',
    video: () => resolve(ROOT, meta.platforms.instagram.reels),
    async fill(page) {
      await page.waitForTimeout(4000);
      const create = page.locator('[aria-label="New post"], [aria-label="Create"]').first();
      if (await create.count()) await create.click();
      await page.waitForTimeout(1500);
      const fileInput = page.locator('input[type="file"]').first();
      if (await fileInput.count()) await fileInput.setInputFiles(this.video());
      await page.waitForTimeout(3000);
      console.log('Instagram: file selected. Choose Reels, add caption manually or paste:');
      console.log(meta.platforms.instagram.caption);
    },
  },
};

async function deployOne(browser, key) {
  const p = PLATFORMS[key];
  if (!p) {
    console.warn(`Unknown platform: ${key}`);
    return;
  }
  const videoPath = p.video();
  if (!existsSync(videoPath)) {
    console.error(`Missing video for ${p.label}: ${videoPath}`);
    console.error('Run: bash scripts/export-social-videos.sh');
    return;
  }
  console.log(`\n=== ${p.label} ===`);
  console.log(`Video: ${videoPath}`);
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await context.newPage();
  await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log(`Opened ${p.url}`);
  console.log('Log in if needed, then press Enter in this terminal to continue automation…');
  await new Promise((r) => process.stdin.once('data', r));
  try {
    await p.fill(page);
  } catch (e) {
    console.warn(`${p.label} automation partial:`, e.message);
    console.log('Complete upload manually in the browser window.');
  }
  console.log(`Press Enter when ${p.label} is published (or skip)…`);
  await new Promise((r) => process.stdin.once('data', r));
  await context.close();
}

async function main() {
  const wanted = process.argv.slice(2).filter(Boolean);
  const keys = wanted.length ? wanted.filter((k) => PLATFORMS[k]) : Object.keys(PLATFORMS);
  if (!keys.length) {
    console.error('No valid platforms. Choose: youtube tiktok x facebook instagram');
    process.exit(1);
  }
  console.log('Lithos social deploy — headed browser');
  console.log('Platforms:', keys.join(', '));
  console.log('Site:', meta.siteUrl);

  const browser = await chromium.launch({ headless: false, channel: 'chrome' }).catch(() =>
    chromium.launch({ headless: false })
  );

  for (const key of keys) {
    await deployOne(browser, key);
  }

  await browser.close();
  console.log('\nDone. All selected platforms processed.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
