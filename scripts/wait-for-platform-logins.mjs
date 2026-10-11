#!/usr/bin/env node
/**
 * Poll login state every 20s until all platforms OK or you Ctrl+C.
 * Close extra Chrome windows first if you get "profile in use".
 *
 *   node scripts/wait-for-platform-logins.mjs
 */
import { chromium } from 'playwright';
import { homedir } from 'os';
import { resolve } from 'path';

const CHROME = resolve(homedir(), 'Library/Application Support/Google/Chrome/Default');

const CHECKS = {
  youtube: { url: 'https://studio.youtube.com/', ok: (url) => !url.includes('accounts.google.com') },
  tiktok: { url: 'https://www.tiktok.com/upload', ok: (url) => !url.includes('login') },
  instagram: { url: 'https://www.instagram.com/', ok: (url) => !url.includes('accounts/login') },
  facebook: { url: 'https://www.facebook.com/', ok: (url) => !url.includes('login') },
  dailymotion: { url: 'https://www.dailymotion.com/upload', ok: (url) => !url.includes('signin') },
  vimeo: { url: 'https://vimeo.com/upload', ok: (url) => !url.includes('log_in') },
  streamable: { url: 'https://streamable.com/', ok: () => true },
  twitch: { url: 'https://dashboard.twitch.tv/', ok: (url) => !url.includes('login') },
  kick: { url: 'https://dashboard.kick.com/', ok: (url) => !url.includes('login') },
  x: { url: 'https://x.com/home', ok: (url) => !url.includes('login') && !url.includes('i/flow') },
};

async function runCheck(context) {
  const out = {};
  for (const [name, check] of Object.entries(CHECKS)) {
    const page = await context.newPage();
    try {
      await page.goto(check.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(1500);
      out[name] = check.ok(page.url());
    } catch {
      out[name] = false;
    }
    await page.close();
  }
  return out;
}

async function main() {
  console.log('Waiting for all platform logins (poll every 20s)…\n');

  let context;
  try {
    context = await chromium.launchPersistentContext(CHROME, {
      headless: true,
      channel: 'chrome',
      args: ['--disable-blink-features=AutomationControlled'],
    });
  } catch (e) {
    console.error('Chrome profile busy. Finish logging in on the open Chrome window, then close ALL Chrome windows and run again.');
    console.error(e.message);
    process.exit(1);
  }

  for (;;) {
    const status = await runCheck(context);
    const need = Object.entries(status).filter(([, ok]) => !ok).map(([n]) => n);
    const ok = Object.entries(status).filter(([, v]) => v).map(([n]) => n);
    console.log(new Date().toLocaleTimeString(), 'OK:', ok.join(', ') || '(none)');
    if (need.length) console.log('  Still need:', need.join(', '));
    else {
      console.log('\nAll platforms logged in! Run: node scripts/deploy-all-platforms.mjs');
      await context.close();
      process.exit(0);
    }
    await new Promise((r) => setTimeout(r, 20000));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
