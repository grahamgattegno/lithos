#!/usr/bin/env node
/**
 * Open login pages for every video platform in Chrome tabs.
 * YOU must enter your username/password on each — I cannot log in without your credentials.
 *
 *   node scripts/login-all-platforms.mjs
 */
import { chromium } from 'playwright';
import { homedir } from 'os';
import { resolve } from 'path';

const CHROME = resolve(homedir(), 'Library/Application Support/Google/Chrome/Default');

const LOGINS = [
  { name: 'YouTube (Google)', url: 'https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fstudio.youtube.com' },
  { name: 'TikTok', url: 'https://www.tiktok.com/login' },
  { name: 'Instagram', url: 'https://www.instagram.com/accounts/login/' },
  { name: 'Facebook', url: 'https://www.facebook.com/login/' },
  { name: 'Dailymotion', url: 'https://www.dailymotion.com/signin' },
  { name: 'Vimeo', url: 'https://vimeo.com/log_in' },
  { name: 'Streamable', url: 'https://streamable.com/signup' },
  { name: 'Twitch', url: 'https://www.twitch.tv/login' },
  { name: 'Kick', url: 'https://kick.com/login' },
  { name: 'X (Twitter)', url: 'https://x.com/i/flow/login' },
];

async function main() {
  console.log('Opening login pages — enter YOUR password on each tab.');
  console.log('I cannot log in for you; only you have your account credentials.\n');

  let context;
  try {
    context = await chromium.launchPersistentContext(CHROME, {
      headless: false,
      channel: 'chrome',
      viewport: { width: 1280, height: 900 },
    });
  } catch {
    const browser = await chromium.launch({ headless: false, channel: 'chrome' }).catch(() =>
      chromium.launch({ headless: false })
    );
    context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    console.log('Tip: close Google Chrome first so this uses your saved passwords/cookies.\n');
  }

  for (const { name, url } of LOGINS) {
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    console.log(`Tab: ${name} → ${url}`);
  }

  console.log('\nLog in on each tab. When done, run:');
  console.log('  node scripts/check-platform-logins.mjs');
  console.log('  node scripts/deploy-all-platforms.mjs');
  console.log('\nBrowser stays open until you close it.');

  await new Promise(() => {});
}

main().catch(console.error);
