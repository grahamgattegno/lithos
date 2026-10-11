#!/usr/bin/env node
/**
 * Capture Lithos website screenshots for promotional ad.
 * Usage: node scripts/capture-ad-clips.mjs [outputDir]
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

const SITE = 'https://grahamgattegno.github.io/lithos/?v=ad-capture';
const OUT = path.resolve(process.argv[2] || 'assets/ad-clips');
const VIEWPORT = { width: 1920, height: 1080 };

/** @type {{ id: string; label: string; setup: (page: import('playwright').Page) => Promise<void> }[]} */
const CLIPS = [
  {
    id: '01-catalog-hero',
    label: 'Catalog Hero / Landing',
    async setup(page) {
      await page.evaluate(() => {
        localStorage.setItem('lithos_adventure_dismissed', '1');
        if (typeof closeAdventurePreview === 'function') closeAdventurePreview({ keepDismiss: true, skipHash: true });
        if (typeof closeGamesHub === 'function') closeGamesHub({ skipHash: true });
        if (typeof closeDrawer === 'function') closeDrawer();
        switchView('catalog');
      });
      await page.waitForTimeout(800);
    },
  },
  {
    id: '02-catalog-grid',
    label: 'Gem Catalog Grid',
    async setup(page) {
      await page.evaluate(() => {
        switchView('catalog');
        const grid = document.getElementById('grid');
        if (grid) grid.scrollIntoView({ block: 'start' });
      });
      await page.waitForTimeout(600);
    },
  },
  {
    id: '03-catalog-radioactive',
    label: 'Radioactive Filter',
    async setup(page) {
      await page.evaluate(() => {
        switchView('catalog');
        const chips = [...document.querySelectorAll('#filters .chip')];
        const radio = chips.find((c) => c.textContent.trim() === 'Radioactive');
        if (radio) radio.click();
        const grid = document.getElementById('grid');
        if (grid) grid.scrollIntoView({ block: 'start' });
      });
      await page.waitForTimeout(700);
    },
  },
  {
    id: '04-gem-detail',
    label: 'Gem Detail Modal',
    async setup(page) {
      await page.evaluate(() => {
        switchView('catalog');
        const chips = [...document.querySelectorAll('#filters .chip')];
        const radio = chips.find((c) => c.textContent.trim() === 'Radioactive');
        if (radio) radio.click();
      });
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        const card = document.querySelector('#grid .card');
        if (card) card.click();
      });
      await page.waitForTimeout(700);
    },
  },
  {
    id: '05-gem-week',
    label: 'Gem of the Week',
    async setup(page) {
      await page.evaluate(() => {
        if (typeof closeDrawer === 'function') closeDrawer();
        switchView('catalog');
        const el = document.getElementById('gem-week-wrap');
        if (el) el.scrollIntoView({ block: 'center' });
      });
      await page.waitForTimeout(600);
    },
  },
  {
    id: '06-learn',
    label: 'Learn',
    async setup(page) {
      await page.evaluate(() => switchView('learn'));
      await page.waitForTimeout(900);
    },
  },
  {
    id: '07-hunt',
    label: 'Scavenger Hunt',
    async setup(page) {
      await page.evaluate(() => switchView('hunt'));
      await page.waitForTimeout(900);
    },
  },
  {
    id: '08-company',
    label: 'Company',
    async setup(page) {
      await page.evaluate(() => switchView('company'));
      await page.waitForTimeout(800);
    },
  },
  {
    id: '09-classes',
    label: 'Classes',
    async setup(page) {
      await page.evaluate(() => switchView('classes'));
      await page.waitForTimeout(800);
    },
  },
  {
    id: '10-teacher',
    label: 'Rock Teacher',
    async setup(page) {
      await page.evaluate(() => switchView('teacher'));
      await page.waitForTimeout(800);
    },
  },
  {
    id: '11-identify',
    label: 'Identify a Rock',
    async setup(page) {
      await page.evaluate(() => switchView('identify'));
      await page.waitForTimeout(800);
    },
  },
  {
    id: '12-feedback',
    label: 'Feedback',
    async setup(page) {
      await page.evaluate(() => switchView('feedback'));
      await page.waitForTimeout(800);
    },
  },
  {
    id: '13-crafts',
    label: 'Crafts',
    async setup(page) {
      await page.evaluate(() => switchView('crafts'));
      await page.waitForTimeout(800);
    },
  },
  {
    id: '14-memberships',
    label: 'Memberships (Sapphire/Diamond)',
    async setup(page) {
      await page.evaluate(() => switchView('memberships'));
      await page.waitForTimeout(800);
    },
  },
  {
    id: '15-games-hub',
    label: 'Games Hub',
    async setup(page) {
      await page.evaluate(() => openGamesHub());
      await page.waitForTimeout(800);
    },
  },
  {
    id: '16-arcade',
    label: 'Arcade',
    async setup(page) {
      await page.evaluate(() => {
        if (typeof closeGamesHub === 'function') closeGamesHub({ skipHash: true });
        switchView('arcade');
      });
      await page.waitForTimeout(800);
    },
  },
  {
    id: '17-nightshift',
    label: 'Night Shift',
    async setup(page) {
      await page.evaluate(() => {
        if (typeof closeGamesHub === 'function') closeGamesHub({ skipHash: true });
        playNightShift();
      });
      await page.waitForTimeout(1500);
    },
  },
  {
    id: '18-nightshift2',
    label: 'Night Shift 2',
    async setup(page) {
      await page.evaluate(() => {
        if (typeof nsCloseGame === 'function') nsCloseGame();
        playNightShift2();
      });
      await page.waitForTimeout(1500);
    },
  },
  {
    id: '19-gemstone-convoy',
    label: 'Gemstone Convoy',
    async setup(page) {
      await page.evaluate(() => {
        if (typeof ns2CloseGame === 'function') ns2CloseGame();
        playGemDrive();
      });
      await page.waitForTimeout(1500);
    },
  },
  {
    id: '20-gem-rush',
    label: 'Gem Rush',
    async setup(page) {
      await page.evaluate(() => {
        if (typeof gdClose === 'function') gdClose();
        playGemRush();
      });
      await page.waitForTimeout(1200);
    },
  },
  {
    id: '21-gem-digger',
    label: 'Gem Digger',
    async setup(page) {
      await page.evaluate(() => {
        if (typeof grClose === 'function') grClose();
        playGemDigger();
      });
      await page.waitForTimeout(1200);
    },
  },
  {
    id: '22-gem-factory',
    label: 'Gem Factory (Poppy)',
    async setup(page) {
      await page.evaluate(() => {
        if (typeof dgClose === 'function') dgClose();
        if (typeof lithosCloseGameOverlays === 'function') lithosCloseGameOverlays();
        switchView('poppy');
      });
      await page.waitForTimeout(900);
    },
  },
  {
    id: '23-gem-arena',
    label: 'Gem Arena',
    async setup(page) {
      await page.evaluate(() => switchView('game'));
      await page.waitForTimeout(900);
    },
  },
  {
    id: '24-battlefield',
    label: 'Battlefield',
    async setup(page) {
      await page.evaluate(() => switchView('battlefield'));
      await page.waitForTimeout(900);
    },
  },
  {
    id: '25-gem-hunt',
    label: 'Gem Hunt',
    async setup(page) {
      await page.evaluate(() => switchView('gemhunt'));
      await page.waitForTimeout(900);
    },
  },
  {
    id: '26-gem-warriors',
    label: 'Gem Warriors Parade',
    async setup(page) {
      await page.evaluate(() => switchView('parade'));
      await page.waitForTimeout(900);
    },
  },
  {
    id: '27-motion-battlefield',
    label: 'Motion Battlefield',
    async setup(page) {
      await page.evaluate(() => switchView('gemmotion'));
      await page.waitForTimeout(900);
    },
  },
  {
    id: '28-auras',
    label: 'Auras',
    async setup(page) {
      await page.evaluate(() => switchView('auras'));
      await page.waitForTimeout(900);
    },
  },
  {
    id: '29-secret-codes',
    label: 'Secret Codes',
    async setup(page) {
      await page.evaluate(() => switchView('codes'));
      await page.waitForTimeout(800);
    },
  },
  {
    id: '30-mineral-quiz',
    label: 'Mineral Quiz',
    async setup(page) {
      await page.evaluate(() => switchView('quiz'));
      await page.waitForTimeout(800);
    },
  },
  {
    id: '31-donate',
    label: 'Donate',
    async setup(page) {
      await page.evaluate(() => switchView('donate'));
      await page.waitForTimeout(800);
    },
  },
  {
    id: '32-money-goal',
    label: 'Money Goal',
    async setup(page) {
      await page.evaluate(() => switchView('moneygoal'));
      await page.waitForTimeout(800);
    },
  },
  {
    id: '33-owner-tv',
    label: 'Owner TV',
    async setup(page) {
      await page.evaluate(() => switchView('video'));
      await page.waitForTimeout(900);
    },
  },
];

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    colorScheme: 'dark',
  });
  const page = await context.newPage();

  console.log(`Navigating to ${SITE}...`);
  await page.goto(SITE, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForFunction(() => typeof switchView === 'function' && typeof GEMS !== 'undefined', null, {
    timeout: 60000,
  });
  await page.evaluate(() => {
    localStorage.setItem('lithos_adventure_dismissed', '1');
    document.documentElement.classList.add('lithos-computer');
    document.documentElement.classList.remove('lithos-mobile');
  });
  await page.waitForTimeout(2000);

  const manifest = [];

  for (const clip of CLIPS) {
    process.stdout.write(`Capturing ${clip.id}: ${clip.label}... `);
    try {
      await clip.setup(page);
      const file = `${clip.id}.png`;
      const filepath = path.join(OUT, file);
      await page.screenshot({ path: filepath, type: 'png' });
      manifest.push({ order: manifest.length + 1, id: clip.id, label: clip.label, file });
      console.log('OK');
    } catch (err) {
      console.log(`FAIL: ${err.message}`);
      manifest.push({ order: manifest.length + 1, id: clip.id, label: clip.label, error: err.message });
    }
    // Reset overlays between clips
    await page.evaluate(() => {
      try {
        if (typeof closeDrawer === 'function') closeDrawer();
        if (typeof closeGamesHub === 'function') closeGamesHub({ skipHash: true });
      } catch (_) {}
    });
  }

  await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  await browser.close();
  console.log(`\nCaptured ${manifest.filter((m) => m.file).length}/${CLIPS.length} clips → ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
