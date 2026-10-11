#!/usr/bin/env node
/** Click first Google account on chooser, then verify upload URLs. */
import { chromium } from 'playwright';
import { homedir } from 'os';
import { resolve } from 'path';

const CHROME = resolve(homedir(), 'Library/Application Support/Google/Chrome/Default');

async function clickAccount(page) {
  await page.waitForTimeout(2000);
  const email = page.locator('[data-email]').first();
  if (await email.count()) {
    await page.evaluate(() => {
      const el = document.querySelector('[data-email]');
      const row = el?.closest('[role="link"], li, .VV3oRb, .lPxAeb') ?? el?.parentElement?.parentElement;
      (row ?? el)?.click();
    });
    await page.waitForTimeout(6000);
    return true;
  }
  for (const sel of ['[data-identifier]', 'div[role="link"]']) {
    const n = await page.locator(sel).count();
    if (n > 0) {
      await page.locator(sel).first().click({ force: true, timeout: 8000 });
      await page.waitForTimeout(6000);
      return true;
    }
  }
  const btn = page.getByRole('button', { name: /continue|next/i }).first();
  if (await btn.count()) {
    await btn.click().catch(() => {});
    await page.waitForTimeout(4000);
  }
  return false;
}

async function main() {
  const context = await chromium.launchPersistentContext(CHROME, {
    headless: false,
    channel: 'chrome',
    viewport: { width: 1280, height: 900 },
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const steps = [
    ['youtube', 'https://accounts.google.com/AccountChooser?continue=https%3A%2F%2Fstudio.youtube.com%2F', 'https://studio.youtube.com/'],
    ['tiktok', 'https://www.tiktok.com/login', 'https://www.tiktok.com/upload'],
    ['dailymotion', 'https://www.dailymotion.com/signin', 'https://www.dailymotion.com/upload'],
    ['x', 'https://x.com/i/flow/login', 'https://x.com/home'],
  ];

  for (const [name, loginUrl, okUrl] of steps) {
    const page = await context.newPage();
    console.log(name, '→', loginUrl);
    await page.goto(loginUrl, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    if (page.url().includes('google.com')) await clickAccount(page);
    if (name === 'tiktok') {
      const g = page.locator('a[href*="google"], div:has-text("Google")').first();
      if (await g.count()) {
        await g.click().catch(() => {});
        await page.waitForTimeout(5000);
        if (context.pages().length > 1) {
          const gp = context.pages().at(-1);
          await clickAccount(gp);
        } else await clickAccount(page);
      }
    }
    await page.goto(okUrl, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(3000);
    console.log(' ', name, 'now at', page.url());
  }

  console.log('\nIf any tab still asks for password/2FA, complete it in Chrome. Leaving browser open.');
  await new Promise(() => {});
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
