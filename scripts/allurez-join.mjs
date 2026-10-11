import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const EMAIL = 'graham.gattegno@alpha.school';
const PASSWORD = process.env.AWIN_PASSWORD || '';
if (!PASSWORD) throw new Error('Set AWIN_PASSWORD env var (do not hardcode credentials)');
const PUBLISHER_ID = '3027627';
const OUT_DIR = path.join(process.cwd(), 'scripts', 'allurez-out');
fs.mkdirSync(OUT_DIR, { recursive: true });
const log = (...a) => console.log(new Date().toISOString(), ...a);
const shot = async (page, name) => {
  await page.screenshot({ path: path.join(OUT_DIR, `${name}.png`), fullPage: true });
  log('shot', name);
};
const dump = async (page, name) => {
  fs.writeFileSync(path.join(OUT_DIR, `${name}.txt`), (await page.locator('body').innerText()).slice(0, 15000));
  fs.writeFileSync(path.join(OUT_DIR, `${name}.html`), await page.content());
};

async function login(page) {
  await page.goto('https://ui.awin.com/idp/en/awin/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2500);
  for (const sel of ['button:has-text("Accept all")', '#onetrust-accept-btn-handler']) {
    const b = page.locator(sel).first();
    if (await b.isVisible({ timeout: 1500 }).catch(() => false)) await b.click();
  }
  const email = page.locator('input[type="email"], input[name="email"], input[autocomplete="username"]').first();
  await email.waitFor({ state: 'visible' });
  await email.fill(EMAIL);
  await page.locator('button:has-text("Continue")').first().click();
  const pass = page.locator('input[type="password"]').first();
  await pass.waitFor({ state: 'visible' });
  await pass.fill(PASSWORD);
  await page.locator('button[type="submit"], button:has-text("Sign in")').first().click();
  await page.waitForURL(/dashboard|affiliate|publisher/, { timeout: 60000 });
  await page.waitForTimeout(2000);
  log('logged in', page.url());
}

async function main() {
  let browser;
  try {
    browser = await chromium.launch({
      headless: false,
      channel: 'chrome',
      args: ['--disable-blink-features=AutomationControlled'],
    });
  } catch {
    browser = await chromium.launch({
      headless: false,
      args: ['--disable-blink-features=AutomationControlled'],
    });
  }
  const context = await browser.newContext({ viewport: { width: 1400, height: 1000 }, locale: 'en-US' });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });
  const page = await context.newPage();
  page.setDefaultTimeout(45000);
  page.on('dialog', async (d) => {
    log('dialog', d.type(), d.message());
    await d.accept().catch(() => {});
  });

  try {
    await login(page);

    const profileUrl = `https://ui.awin.com/affiliate/${PUBLISHER_ID}/merchant-profile/122728`;
    await page.goto(profileUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await shot(page, 'j01-profile');
    await dump(page, 'j01-profile');

    // Find Join Programme control via multiple strategies
    let clicked = false;
    const candidates = [
      page.getByRole('button', { name: /Join Programme/i }),
      page.getByRole('link', { name: /Join Programme/i }),
      page.locator('a:has-text("Join Programme")'),
      page.locator('button:has-text("Join Programme")'),
      page.locator('text=+ Join Programme'),
      page.locator('text=Join Programme'),
      page.locator('[href*="join" i]'),
      page.locator('button:has-text("+ Join")'),
      page.locator('a:has-text("+ Join")'),
    ];

    for (const loc of candidates) {
      const el = loc.first();
      if (await el.isVisible({ timeout: 1200 }).catch(() => false)) {
        const box = await el.boundingBox().catch(() => null);
        log('candidate visible', await el.evaluate((n) => ({ tag: n.tagName, text: n.textContent?.trim(), href: n.getAttribute?.('href'), className: n.className })).catch(() => null), box);
        await el.scrollIntoViewIfNeeded().catch(() => {});
        await el.click({ force: true });
        clicked = true;
        log('clicked join candidate');
        break;
      }
    }

    if (!clicked) {
      // JS click any element containing Join Programme
      const jsClicked = await page.evaluate(() => {
        const nodes = Array.from(document.querySelectorAll('a,button,span,div'));
        const el = nodes.find((n) => /join programme/i.test(n.textContent || '') && (n.textContent || '').trim().length < 40);
        if (!el) return false;
        el.click();
        return { tag: el.tagName, text: el.textContent.trim() };
      });
      log('js click', jsClicked);
      clicked = !!jsClicked;
    }

    await page.waitForTimeout(2500);
    await shot(page, 'j02-after-join-click');
    await dump(page, 'j02-after-join-click');

    // Handle modal / terms / confirmation
    for (let i = 0; i < 5; i++) {
      // checkboxes
      const checks = page.locator('input[type="checkbox"]');
      const n = await checks.count();
      for (let c = 0; c < n; c++) {
        const box = checks.nth(c);
        if (!(await box.isChecked().catch(() => true))) {
          await box.check({ force: true }).catch(() => box.click({ force: true }));
          log('checked checkbox', c);
        }
      }

      const confirm = page.getByRole('button', { name: /Confirm|Submit|Apply|Send|Join|Continue|Accept|Agree|Yes/i }).first();
      if (await confirm.isVisible({ timeout: 1500 }).catch(() => false)) {
        const txt = await confirm.innerText().catch(() => '');
        log('confirm button', txt);
        await confirm.click({ force: true });
        await page.waitForTimeout(2000);
        await shot(page, `j03-confirm-${i}`);
        await dump(page, `j03-confirm-${i}`);
      } else {
        break;
      }
    }

    // Refresh profile and check status
    await page.goto(profileUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await shot(page, 'j04-profile-refresh');
    await dump(page, 'j04-profile-refresh');
    const text = await page.locator('body').innerText();

    let membership = 'not_joined';
    if (/\(Pending\)|Pending Approval|Awaiting Approval|Pending/i.test(text) && /ALLUREZ/i.test(text)) membership = 'pending';
    if (/\(Joined\)|\(Active\)|Active Membership|Joined/i.test(text) && !/Not Joined/i.test(text)) membership = 'active';
    if (/Not Joined/i.test(text)) membership = 'not_joined';

    // If still not joined, try network API discovery
    if (membership === 'not_joined') {
      // Capture XHR join endpoints from page
      const joinInfo = await page.evaluate(() => {
        const html = document.documentElement.outerHTML;
        const mids = [...html.matchAll(/122728/g)].length;
        const joinLinks = Array.from(document.querySelectorAll('a[href],button')).map((el) => ({
          tag: el.tagName,
          text: (el.textContent || '').trim().slice(0, 80),
          href: el.getAttribute('href'),
          onclick: el.getAttribute('onclick'),
          id: el.id,
          className: el.className,
        })).filter((x) => /join/i.test(JSON.stringify(x)));
        return { mids, joinLinks: joinLinks.slice(0, 30) };
      });
      fs.writeFileSync(path.join(OUT_DIR, 'join-dom.json'), JSON.stringify(joinInfo, null, 2));
      log('join-dom', joinInfo);
    }

    // Try create link if active
    let trackingLink = null;
    if (membership === 'active') {
      await page.goto(`https://ui.awin.com/dashboard/awin/publisher/${PUBLISHER_ID}/us`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      // navigate toolbox
      const toolbox = page.getByRole('link', { name: /Toolbox|Link Builder|Create Link/i }).first();
      if (await toolbox.isVisible({ timeout: 2000 }).catch(() => false)) await toolbox.click();
      await page.waitForTimeout(2000);
      await shot(page, 'j05-toolbox');
    }

    const status = {
      status: membership === 'active' ? 'signed_up' : membership === 'pending' ? 'pending' : clicked ? 'join_clicked_uncertain' : 'blocked',
      membership,
      clicked,
      trackingLink,
      publisherId: PUBLISHER_ID,
      advertiserId: '122728',
      loginUrl: 'https://ui.awin.com/idp/en/awin/login',
      profileUrl,
      dashboardUrl: `https://ui.awin.com/dashboard/awin/publisher/${PUBLISHER_ID}/us`,
    };
    fs.writeFileSync(path.join(OUT_DIR, 'status.json'), JSON.stringify(status, null, 2));
    log('DONE', status);
  } catch (e) {
    log('ERROR', e);
    await shot(page, 'j-error').catch(() => {});
    fs.writeFileSync(path.join(OUT_DIR, 'status.json'), JSON.stringify({ status: 'error', error: String(e) }, null, 2));
  } finally {
    await browser.close();
  }
}

main();
