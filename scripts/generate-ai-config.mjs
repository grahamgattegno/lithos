#!/usr/bin/env node
/** Build ai-config.js from GEMINI_API_KEY (.env.local or env). Not committed — injected at deploy. */
import fs from 'fs';
import path from 'path';

function loadEnvLocal() {
  const p = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(p)) return {};
  const env = {};
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i < 1) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    env[k] = v;
  }
  return env;
}

const key = (process.env.GEMINI_API_KEY || loadEnvLocal().GEMINI_API_KEY || '').trim();
const outPath = path.join(process.cwd(), 'ai-config.js');

if (!key) {
  if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
  console.log('No GEMINI_API_KEY — ai-config.js not generated.');
  process.exit(0);
}

const content = `// Generated at build time — do not commit.
window.LITHOS_AI_CONFIG={
 key:${JSON.stringify(key)},
 provider:"gemini",
 base:"https://generativelanguage.googleapis.com/v1beta",
 model:"gemini-flash-latest"
};
`;

fs.writeFileSync(outPath, content);
console.log('Wrote ai-config.js (Gemini class AI enabled).');
