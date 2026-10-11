#!/usr/bin/env node
/**
 * Headed Chrome with real profile + keychain. Clicks saved Google accounts,
 * waits for SSO redirects, retries upload URLs.
 */
import { chromium } from 'playwright';
import { homedir } from 'os';
import { resolve } from 'path';

const CHROME = resolve(homedir(), 'Library/Application Support/Google/Chrome/Default');

const TARGETS = [
  {
    name: 'youtube',
    start: 'https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fstudio.youtube.com',
    success: (url) => url.includes('studio.youtube.com') && !url.includes('accounts.google.com'),
  },
  {
    name: 'tiktok',
    start: 'https://www.tiktok.com/login',
    success: (url) => url.includes('tiktok.com') && !url.includes('/login'),
  },
  {
    name: 'dailymotion',
    start: 'https://www.dailymotion.com/signin',
    success: (url) => url.includes('dailymotion.com') && !url.includes('signin'),
  },
  {
    name: 'x',
    start: 'https://x.com/i/flow/login',
    success: (url) => url.includes('x.com/home') || (url.includes('x.com') && !url.includes('login') && !url.includes('flow')),
  },
];

async function tryGoogleAccountPicker(page) {
  const selectors = [
    '[data-email]',
    'div[data-identifier]',
    '[data-authuser]',
    'li[role="link"]',
    'div[role="link"]',
  ];
  for (const sel of selectors) {
    const el = page.locator(sel).first();
    if (await el.count()) {
      await el.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(4000);
      return true;
    }
  }
  const useAnother = page.getByRole('button', { name: /continue/i }).first();
  if (await useAnother.count()) {
    await useAnother.click().catch(() => {});
    await page.waitForTimeout(3000);
  }
  return false;
}

async function tryTikTokGoogle(page) {
  const google = page.getByRole('link', { name: /google/i }).or(page.locator('a[href*="google"]')).first();
  if (await google.count()) {
    await google.click().catch(() => {});
    await page.waitForTimeout(5000);
    await tryGoogleAccountPicker(page);
    await page.waitForTimeout(5000);
  }
}

async function assistOne(page, target) {
  console.log(`\n→ ${target.name}`);
  await page.goto(target.start, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3000);

  if (target.name === 'youtube' || page.url().includes('accounts.google.com')) {
    await tryGoogleAccountPicker(page);
    await page.waitForTimeout(5000);
  }
  if (target.name === 'tiktok') {
    await tryTikTokGoogle(page);
  }

  if (target.name === 'youtube') {
    await page.goto('https://studio.youtube.com/', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(3000);
  }
  if (target.name === 'tiktok') {
    await page.goto('https://www.tiktok.com/upload', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(3000);
  }
  if (target.name === 'dailymotion') {
    await page.goto('https://www.dailymotion.com/upload', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(3000);
  }
  if (target.name === 'x') {
    await page.goto('https://x.com/home', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(3000);
  }

  const url = page.url();
  const ok = target.success(url);
  console.log(ok ? `  ✓ ${target.name} OK` : `  ✗ ${target.name} still needs credentials (${url})`);
  return ok;
}

async function main() {
  console.log('Assist login — using your Chrome profile + Mac keychain (close other Chrome first).\n');

  const context = await chromium.launchPersistentContext(CHROME, {
    headless: false,
    channel: 'chrome',
    viewport: { width: 1280, height: 900 },
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const page = await context.newPage();
  const results = {};
  for (const t of TARGETS) {
    results[t.name] = await assistOne(page, t);
  }

  console.log('\nSummary:', results);
  const need = Object.entries(results).filter(([, v]) => !v).map(([k]) => k);
  if (need.length) {
    console.log('\nBrowser stays open on login pages — complete password/2FA on screen, then close Chrome and run check.');
    await new Promise(() => {});
  } else {
    console.log('\nAll four assisted platforms OK.');
    await context.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
