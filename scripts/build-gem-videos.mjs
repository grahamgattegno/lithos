#!/usr/bin/env node
/**
 * Build short MP4 clips for Lithos field-catalog gemstones (kind=gem with photos).
 * Usage: node scripts/build-gem-videos.mjs [--limit N] [--skip-cards] [--compile-only]
 */
import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'fs';
import { spawnSync } from 'child_process';
import { mkdir, writeFile, access } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'videos', 'gems');
const CARDS = path.join(ROOT, 'assets', '.gem-video-cards');
const MANIFEST = path.join(ROOT, 'data', 'gem-videos-manifest.json');
const COMPILATION = path.join(ROOT, 'assets', 'lithos-field-catalog-gems.mp4');
const W = 1280;
const H = 720;
const FPS = 30;
const CLIP_SEC = 2.2;
const FRAMES = Math.round(CLIP_SEC * FPS);

const args = process.argv.slice(2);
const limit = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1], 10) : Infinity;
const skipCards = args.includes('--skip-cards');
const compileOnly = args.includes('--compile-only');

function slugFromGem(g) {
  const stem = (g.img || '').replace(/^images\//, '').replace(/\.[^.]+$/i, '');
  if (stem) return stem;
  return g.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function parseGems() {
  const text = readFileSync(path.join(ROOT, 'gems-data.js'), 'utf8');
  const gems = [];
  const re = /\{name:"([^"]+)",kind:"([^"]+)"[^}]*?img:"([^"]*)"[^}]*?formula:"([^"]*)"[^}]*?class:"([^"]*)"[^}]*?system:"([^"]*)"[^}]*?mohs:([\d.]+)/g;
  let m;
  while ((m = re.exec(text))) {
    gems.push({
      name: m[1],
      kind: m[2],
      img: m[3],
      formula: m[4],
      class: m[5],
      system: m[6],
      mohs: m[7],
    });
  }
  return gems.filter((g) => g.kind === 'gem' && g.img && !g.img.startsWith('http'));
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

function runFfmpeg(args) {
  const r = spawnSync('ffmpeg', args, { stdio: 'pipe', encoding: 'utf8' });
  if (r.status !== 0) throw new Error(r.stderr?.slice(-400) || 'ffmpeg failed');
}

function makeClip(png, mp4) {
  runFfmpeg([
    '-y', '-loop', '1', '-i', png,
    '-vf',
    `scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:black,zoompan=z='min(zoom+0.0012,1.06)':d=${FRAMES}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${W}x${H},format=yuv420p`,
    '-t', String(CLIP_SEC), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-r', String(FPS),
    '-movflags', '+faststart', mp4,
  ]);
}

async function renderCards(gems) {
  await mkdir(CARDS, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: W, height: H } });

  for (const g of gems) {
    const slug = slugFromGem(g);
    const cardPath = path.join(CARDS, `${slug}.png`);
    const imgPath = path.join(ROOT, g.img);
    if (!(await fileExists(imgPath))) {
      console.warn(`  skip ${g.name}: missing ${g.img}`);
      continue;
    }
    const imgUrl = `file://${imgPath}`;
    const html = `<!DOCTYPE html><html><body style="margin:0;width:${W}px;height:${H}px;background:#0a0b0f;font-family:Georgia,'Times New Roman',serif;color:#e8e8ec;overflow:hidden">
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse 70% 55% at 50% 38%,rgba(201,169,79,.12),transparent 70%)"></div>
      <div style="position:absolute;top:28px;left:36px;font-family:ui-monospace,monospace;font-size:13px;letter-spacing:.28em;text-transform:uppercase;color:#c9a94f">Lithos · Field Catalog</div>
      <div style="position:absolute;top:28px;right:36px;font-family:ui-monospace,monospace;font-size:12px;letter-spacing:.14em;color:#888">Gemstone</div>
      <div style="position:absolute;left:50%;top:48%;transform:translate(-50%,-50%);width:520px;height:520px;border-radius:50%;overflow:hidden;box-shadow:0 0 80px rgba(201,169,79,.25),0 24px 60px rgba(0,0,0,.55);border:2px solid rgba(201,169,79,.35)">
        <img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover" crossorigin="anonymous">
      </div>
      <div style="position:absolute;left:0;right:0;bottom:0;padding:28px 40px 36px;background:linear-gradient(transparent,rgba(0,0,0,.85));">
        <div style="font-size:52px;font-weight:400;line-height:1.05;margin-bottom:10px;color:#fff">${esc(g.name)}</div>
        <div style="font-family:ui-monospace,monospace;font-size:15px;letter-spacing:.08em;color:#c9a94f;margin-bottom:8px">${esc(g.formula)}</div>
        <div style="display:flex;gap:24px;font-family:ui-monospace,monospace;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#aaa">
          <span>Mohs ${esc(g.mohs)}</span><span>${esc(g.class)}</span><span>${esc(g.system)}</span>
        </div>
      </div>
    </body></html>`;
    await page.setContent(html, { waitUntil: 'load' });
    await page.waitForTimeout(120);
    await page.screenshot({ path: cardPath, type: 'png' });
    console.log(`  card ${slug}`);
  }
  await browser.close();
}

async function buildClips(gems) {
  await mkdir(OUT, { recursive: true });
  const manifest = [];
  for (const g of gems) {
    const slug = slugFromGem(g);
    const card = path.join(CARDS, `${slug}.png`);
    const mp4 = path.join(OUT, `${slug}.mp4`);
    if (!(await fileExists(card))) continue;
    if (!existsSync(mp4) || !compileOnly) {
      makeClip(card, mp4);
      console.log(`  clip ${slug}.mp4`);
    }
    manifest.push({ slug, name: g.name, video: `videos/gems/${slug}.mp4`, img: g.img });
  }
  await mkdir(path.dirname(MANIFEST), { recursive: true });
  await writeFile(MANIFEST, JSON.stringify({ generated: new Date().toISOString(), count: manifest.length, gems: manifest }, null, 2) + '\n');
  return manifest;
}

async function compile(manifest) {
  if (!manifest.length) return;
  const tmp = path.join(ROOT, 'assets', '.gem-video-build');
  await mkdir(tmp, { recursive: true });
  const listPath = path.join(tmp, 'concat.txt');
  const lines = manifest.map((m) => `file '${path.join(OUT, `${m.slug}.mp4`)}'`).join('\n');
  await writeFile(listPath, lines + '\n');
  runFfmpeg(['-y', '-f', 'concat', '-safe', '0', '-i', listPath, '-c', 'copy', COMPILATION]);
  console.log(`Compilation: ${COMPILATION} (${manifest.length} gems)`);
}

async function main() {
  if (spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status !== 0) {
    console.error('ffmpeg required');
    process.exit(1);
  }
  let gems = parseGems();
  if (Number.isFinite(limit)) gems = gems.slice(0, limit);
  console.log(`Building ${gems.length} gemstone videos…`);
  if (!skipCards && !compileOnly) await renderCards(gems);
  const manifest = await buildClips(gems);
  await compile(manifest);
  console.log(`Done — ${manifest.length} videos, manifest → ${MANIFEST}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
