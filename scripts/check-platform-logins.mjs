#!/usr/bin/env node
/** Check login state on each upload platform (uses Chrome profile cookies). */
import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const meta = JSON.parse(readFileSync(resolve(ROOT, 'ads/social/metadata.json'), 'utf8'));
const CHROME = resolve(homedir(), 'Library/Application Support/Google/Chrome/Default');

const CHECKS = {
  youtube: { url: 'https://studio.youtube.com/', loggedIn: (url, t) => !url.includes('accounts.google.com') && (t.includes('Channel') || t.includes('YouTube Studio') || t.includes('studio')) },
  tiktok: { url: 'https://www.tiktok.com/upload', loggedIn: (url, t) => !url.includes('login') && !t.toLowerCase().includes('log in') },
  instagram: { url: 'https://www.instagram.com/', loggedIn: (url, t) => !url.includes('accounts/login') },
  facebook: { url: 'https://www.facebook.com/', loggedIn: (url, t) => !url.includes('login') && !t.includes('Log Into Facebook') },
  dailymotion: { url: 'https://www.dailymotion.com/upload', loggedIn: (url) => !url.includes('signin') && !url.includes('login') },
  vimeo: { url: 'https://vimeo.com/upload', loggedIn: (url) => !url.includes('log_in') && !url.includes('join') },
  streamable: { url: 'https://streamable.com/', loggedIn: (url, t) => t.includes('Upload') || !t.includes('Sign') },
  twitch: { url: 'https://dashboard.twitch.tv/', loggedIn: (url) => !url.includes('login') },
  kick: { url: 'https://kick.com/dashboard', loggedIn: (url) => !url.includes('login') },
  x: { url: 'https://x.com/home', loggedIn: (url) => !url.includes('login') && !url.includes('i/flow') },
};

async function main() {
  let context;
  try {
    context = await chromium.launchPersistentContext(CHROME, {
      headless: true,
      channel: 'chrome',
      args: ['--disable-blink-features=AutomationControlled'],
    });
  } catch (e) {
    console.log('Could not read Chrome profile (close Chrome and retry, or log in manually):', e.message);
    process.exit(1);
  }

  const results = [];
  for (const [name, check] of Object.entries(CHECKS)) {
    const page = await context.newPage();
    try {
      await page.goto(check.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);
      const url = page.url();
      const title = await page.title();
      const ok = check.loggedIn(url, title);
      results.push({ name, ok, url });
      console.log(`${ok ? 'LOGGED IN ' : 'NEEDS LOGIN'} — ${name} (${url})`);
    } catch (e) {
      results.push({ name, ok: false, error: e.message });
      console.log(`UNKNOWN — ${name}: ${e.message}`);
    }
    await page.close();
  }

  await context.close();
  const need = results.filter((r) => !r.ok).map((r) => r.name);
  if (need.length) {
    console.log('\nNeed login:', need.join(', '));
    console.log('Run: node scripts/login-all-platforms.mjs');
  } else {
    console.log('\nAll platforms appear logged in.');
  }
}

main().catch(console.error);
