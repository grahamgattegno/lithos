#!/usr/bin/env node
/**
 * Refresh data/claw-quest-videos.json from the Claw Quest YouTube channel.
 * Requires yt-dlp: pip install yt-dlp
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'data/claw-quest-videos.json');
const channel = 'https://www.youtube.com/@clawquest/videos';

const raw = execFileSync('yt-dlp', ['--flat-playlist', '--print', '%(id)s|%(title)s', channel], {
  encoding: 'utf8',
  maxBuffer: 10 * 1024 * 1024,
});

const seen = new Set();
const videos = [];
for (const line of raw.split('\n')) {
  const m = line.trim().match(/^([\w-]{11})\|(.+)$/);
  if (!m || seen.has(m[1])) continue;
  seen.add(m[1]);
  videos.push({ id: m[1], title: m[2] });
}

writeFileSync(out, JSON.stringify(videos, null, 2) + '\n');
console.log(`Wrote ${videos.length} videos to ${out}`);
