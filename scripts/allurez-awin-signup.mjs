import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const EMAIL = 'graham.gattegno@alpha.school';
const PASSWORD = process.env.AWIN_PASSWORD || '';
if (!PASSWORD) throw new Error('Set AWIN_PASSWORD env var (do not hardcode credentials)');
const PUBLISHER_ID = '3027627';
const OUT_DIR = path.join(process.cwd(), 'scripts', 'allurez-out');
fs.mkdirSync(OUT_DIR, { recursive: true });

const log = (...args) => console.log(new Date().toISOString(), ...args);
const shot = async (page, name) => {
  const p = path.join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: p, fullPage: true });
  log('shot', name);
};

async function dump(page, name) {
  const html = await page.content();
  fs.writeFileSync(path.join(OUT_DIR, `${name}.html`), html);
  const text = await page.locator('body').innerText().catch(() => '');
  fs.writeFileSync(path.join(OUT_DIR, `${name}.txt`), text.slice(0, 12000));
  log('url', page.url(), 'title', await page.title());
}

async function main() {
  // Use headed channel chrome if available for less bot detection
  let browser;
  try {
    browser = await chromium.launch({
      headless: false,
      channel: 'chrome',
      args: ['--disable-blink-features=AutomationControlled'],
    });
    log('launched chrome channel');
  } catch {
    browser = await chromium.launch({
      headless: false,
      args: ['--disable-blink-features=AutomationControlled'],
    });
    log('launched chromium headed');
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    locale: 'en-US',
    timezoneId: 'America/Chicago',
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  try {
    await page.goto('https://ui.awin.com/idp/en/awin/login', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);
    await shot(page, 'r01-login');
    await dump(page, 'r01-login');

    // Cookie banners
    for (const sel of ['#onetrust-accept-btn-handler', 'button:has-text("Accept all")', 'button:has-text("Accept All")']) {
      const b = page.locator(sel).first();
      if (await b.isVisible({ timeout: 1500 }).catch(() => false)) {
        await b.click();
        log('cookies', sel);
      }
    }

    // Multi-step: email first
    const emailSel = page.locator('input[type="email"], input[name="email"], input[name="username"], #email, #username, input[autocomplete="username"]').first();
    await emailSel.waitFor({ state: 'visible', timeout: 20000 });
    await emailSel.click();
    await emailSel.fill('');
    await emailSel.type(EMAIL, { delay: 40 });
    await shot(page, 'r02-email');

    // Sometimes Continue before password
    const continueBtn = page.locator('button:has-text("Continue"), button:has-text("Next")').first();
    if (await continueBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await continueBtn.click();
      await page.waitForTimeout(1500);
      log('clicked continue');
    }

    const passSel = page.locator('input[type="password"], input[name="password"], #password, input[autocomplete="current-password"]').first();
    await passSel.waitFor({ state: 'visible', timeout: 20000 });
    await passSel.click();
    await passSel.type(PASSWORD, { delay: 40 });
    await shot(page, 'r03-password');

    const submit = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")').first();
    await submit.click();
    log('submitted');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(4000);
    await shot(page, 'r04-after-login');
    await dump(page, 'r04-after-login');

    const url = page.url();
    const body = await page.locator('body').innerText();
    if (/otp|verification code|two-factor|authenticator|sms/i.test(body) && !/publisher|advertiser directory|dashboard/i.test(body)) {
      fs.writeFileSync(path.join(OUT_DIR, 'status.json'), JSON.stringify({ status: 'blocked', reason: 'OTP/MFA', url }, null, 2));
      log('BLOCKED OTP');
      return;
    }

    // Search Allurez in directory
    const dirUrl = `https://ui.awin.com/affiliate/${PUBLISHER_ID}/advertise-directory`;
    await page.goto(dirUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await shot(page, 'r05-directory');
    await dump(page, 'r05-directory');

    // Try search
    const search = page.locator('input[type="search"], input[placeholder*="Search" i], input[name*="search" i]').first();
    if (await search.isVisible({ timeout: 3000 }).catch(() => false)) {
      await search.fill('Allurez');
      await search.press('Enter');
      await page.waitForTimeout(3000);
      await shot(page, 'r06-search');
      await dump(page, 'r06-search');
    }

    // Click Allurez
    const link = page.getByRole('link', { name: /Allurez/i }).first();
    if (await link.isVisible({ timeout: 4000 }).catch(() => false)) {
      await link.click();
      await page.waitForTimeout(3000);
    } else {
      // try text click
      const t = page.locator('text=Allurez').first();
      if (await t.isVisible({ timeout: 2000 }).catch(() => false)) {
        await t.click();
        await page.waitForTimeout(3000);
      } else {
        await page.goto(`https://ui.awin.com/affiliate/${PUBLISHER_ID}/merchant-profile/122728`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);
      }
    }
    await shot(page, 'r07-profile');
    await dump(page, 'r07-profile');

    let applied = false;
    for (const name of [/Join programme/i, /Join program/i, /Apply to join/i, /^Apply$/i, /^Join$/i]) {
      const btn = page.getByRole('button', { name }).first();
      if (await btn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await btn.click();
        applied = true;
        log('clicked', String(name));
        await page.waitForTimeout(2000);
        const conf = page.getByRole('button', { name: /Confirm|Submit|Send|Yes|Apply/i }).first();
        if (await conf.isVisible({ timeout: 2000 }).catch(() => false)) {
          await conf.click();
          await page.waitForTimeout(2000);
        }
        break;
      }
      const abtn = page.getByRole('link', { name }).first();
      if (await abtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await abtn.click();
        applied = true;
        await page.waitForTimeout(2000);
        break;
      }
    }
    await shot(page, 'r08-after-apply');
    await dump(page, 'r08-after-apply');

    // Check membership list
    await page.goto(`https://ui.awin.com/affiliate/${PUBLISHER_ID}/programmes`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    const s2 = page.locator('input[type="search"], input[placeholder*="Search" i]').first();
    if (await s2.isVisible({ timeout: 2000 }).catch(() => false)) {
      await s2.fill('Allurez');
      await s2.press('Enter');
      await page.waitForTimeout(2500);
    }
    await shot(page, 'r09-programmes');
    await dump(page, 'r09-programmes');

    // Try link builder if active
    let trackingLink = null;
    for (const u of [
      `https://ui.awin.com/affiliate/${PUBLISHER_ID}/tools/link-builder`,
      `https://ui.awin.com/affiliate/${PUBLISHER_ID}/create-links`,
      `https://ui.awin.com/affiliate/${PUBLISHER_ID}/promotional-tools`,
    ]) {
      const resp = await page.goto(u, { waitUntil: 'domcontentloaded' }).catch(() => null);
      if (!resp) continue;
      await page.waitForTimeout(2000);
      await shot(page, `r10-${u.split('/').pop()}`);
      const html = await page.content();
      const m = html.match(/https:\/\/www\.awin1\.com\/cread\.php\?[^"'\s]+/i);
      if (m) trackingLink = m[0];
    }

    const profileText = fs.readFileSync(path.join(OUT_DIR, 'r08-after-apply.txt'), 'utf8');
    const progText = fs.readFileSync(path.join(OUT_DIR, 'r09-programmes.txt'), 'utf8');
    let membership = 'unknown';
    if (/Allurez/i.test(progText)) {
      if (/Pending|Awaiting|Pending Approval/i.test(progText)) membership = 'pending';
      else if (/Active|Joined|Approved/i.test(progText)) membership = 'active';
      else membership = 'listed';
    }
    if (/Pending|application/i.test(profileText) && membership === 'unknown') membership = 'pending';
    if (/Active membership|You are a member|Joined/i.test(profileText) && membership === 'unknown') membership = 'active';

    const status = {
      status: applied ? (membership === 'active' ? 'signed_up' : 'pending') : membership,
      applied,
      membership,
      trackingLink,
      publisherId: PUBLISHER_ID,
      loginUrl: 'https://ui.awin.com/idp/en/awin/login',
      dashboardUrl: `https://ui.awin.com/affiliate/${PUBLISHER_ID}`,
      finalUrl: page.url(),
    };
    fs.writeFileSync(path.join(OUT_DIR, 'status.json'), JSON.stringify(status, null, 2));
    log('DONE', status);
  } catch (e) {
    log('ERROR', e);
    await shot(page, 'r-error').catch(() => {});
    await dump(page, 'r-error').catch(() => {});
    fs.writeFileSync(path.join(OUT_DIR, 'status.json'), JSON.stringify({ status: 'error', error: String(e), url: page.url() }, null, 2));
  } finally {
    await browser.close();
  }
}

main();
