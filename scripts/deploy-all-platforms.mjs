#!/usr/bin/env node
/**
 * Open every uploadable video platform in tabs, attach the Lithos ad, fill metadata.
 * Uses your Chrome login session if available.
 *
 *   node scripts/deploy-all-platforms.mjs
 *   node scripts/deploy-all-platforms.mjs youtube vimeo dailymotion
 */
import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const meta = JSON.parse(readFileSync(resolve(ROOT, 'ads/social/metadata.json'), 'utf8'));
const CHROME_PROFILE = resolve(homedir(), 'Library/Application Support/Google/Chrome/Default');

async function tryFill(page, platform, key) {
  const p = meta.platforms[key];
  const videoPath = resolve(ROOT, p.video);
  await page.waitForTimeout(2500);

  const fileInput = page.locator('input[type="file"]').first();
  if (await fileInput.count()) {
    await fileInput.setInputFiles(videoPath);
    console.log(`  ✓ ${platform}: video attached`);
  } else {
    console.log(`  · ${platform}: no file input yet — drag ${videoPath} manually`);
  }

  await page.waitForTimeout(2000);

  const titleText = p.title || meta.title;
  const descText = p.description || p.text || p.caption || meta.description;

  const titleSel = page.locator(
    'input[name="title"], input[placeholder*="title" i], #textbox[aria-label*="title" i], textarea[name="title"]'
  ).first();
  if (titleText && (await titleSel.count())) {
    await titleSel.fill(titleText);
    console.log(`  ✓ ${platform}: title filled`);
  }

  const descSel = page.locator(
    '#textbox[aria-label*="description" i], textarea[name="description"], textarea[placeholder*="description" i], [contenteditable="true"], div[role="textbox"]'
  ).first();
  if (descText && (await descSel.count())) {
    await descSel.fill(descText);
    console.log(`  ✓ ${platform}: description/caption filled`);
  }
}

async function main() {
  const wanted = process.argv.slice(2).filter(Boolean);
  const keys = wanted.length ? wanted.filter((k) => meta.platforms[k]) : Object.keys(meta.platforms);

  for (const key of keys) {
    const vp = resolve(ROOT, meta.platforms[key].video);
    if (!existsSync(vp)) {
      console.error(`Missing ${vp} — run: bash scripts/export-social-videos.sh`);
      process.exit(1);
    }
  }

  console.log('Lithos ad deploy — opening upload tabs');
  console.log('Site:', meta.siteUrl);
  console.log('Platforms:', keys.join(', '));
  console.log('\nNot uploadable (streaming/enterprise only):', meta.notUploadable.platforms.join(', '));
  console.log('\nLog in on any tab that asks, then Publish on each.\n');

  let context;
  try {
    context = await chromium.launchPersistentContext(CHROME_PROFILE, {
      headless: false,
      channel: 'chrome',
      viewport: { width: 1400, height: 900 },
      args: ['--disable-blink-features=AutomationControlled'],
    });
  } catch {
    const browser = await chromium.launch({ headless: false, channel: 'chrome' }).catch(() =>
      chromium.launch({ headless: false })
    );
    context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  }

  const pages = [];
  for (const key of keys) {
    const p = meta.platforms[key];
    const page = await context.newPage();
    pages.push({ key, label: key, page });
    await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
    console.log(`Opened tab: ${key} → ${p.url}`);
  }

  console.log('\nWaiting 8s for logins…');
  await new Promise((r) => setTimeout(r, 8000));

  for (const { key, label, page } of pages) {
    console.log(`\nFilling ${label}…`);
    try {
      await tryFill(page, label, key);
    } catch (e) {
      console.log(`  ! ${label}: ${e.message} — finish manually`);
    }
  }

  console.log('\n========================================');
  console.log('All tabs ready. Review each and click Publish/Post.');
  console.log('Close the browser when done.');
  console.log('========================================\n');

  await new Promise(() => {});
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
