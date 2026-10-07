/**
 * Renders cover.png (link preview, 1200x630) and apple-touch-icon.png from the games' own covers.
 *   PLAYWRIGHT_CORE=/path/to/playwright-core/index.mjs node scripts/assets.mjs
 * Expects the game repos (GAMES below) next to this one.
 */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME_PATH ?? path.join(homedir(), '.cache/ms-playwright/chromium-1223/chrome-linux/chrome');
const { chromium } = await import(process.env.PLAYWRIGHT_CORE ?? 'playwright-core');

const uri = (file, type) => `data:${type};base64,${readFileSync(file).toString('base64')}`;
const cover = (game) => uri(path.join(root, '..', game, 'public/cover.png'), 'image/png');
const icon = uri(path.join(root, 'favicon.svg'), 'image/svg+xml');

/** Repository name and display name, in catalog order. */
const GAMES = [
  ['suika-jelly', 'Suika Jelly'],
  ['gold-miner', 'Gold Miner'],
  ['pelican-pedal', 'Pelican Pedal'],
  ['flap-flock', 'Flap Flock'],
];
// The thumbnails share the 1072 px between the 64 px side margins.
const GAP = 24;
const THUMB = Math.floor((1200 - 128 - GAP * (GAMES.length - 1)) / GAMES.length);
const tilt = (i) => (GAMES.length === 1 ? 0 : (-3 + (6 * i) / (GAMES.length - 1)).toFixed(2));

const html = `<!doctype html><meta charset="utf-8"><style>
  html,body{margin:0;width:1200px;height:630px;overflow:hidden}
  body{font-family:ui-rounded,system-ui,'Noto Sans CJK SC',sans-serif;color:#fff7ea;
    background:radial-gradient(900px 500px at 8% -10%,rgba(255,143,163,.35),transparent 60%),
      radial-gradient(800px 500px at 100% 0,rgba(95,198,216,.3),transparent 60%),
      linear-gradient(180deg,#1d1836,#15112a)}
  .head{display:flex;align-items:center;gap:26px;padding:104px 64px 0}
  .head img{width:112px;height:112px;border-radius:26px}
  h1{margin:0;font-size:92px;line-height:1;font-weight:800;letter-spacing:-1px}
  p{margin:10px 0 0;font-size:34px;color:#cfc6e8}
  .row{display:flex;gap:${GAP}px;padding:72px 64px 0}
  .row img{width:${THUMB}px;height:auto;aspect-ratio:1200/630;object-fit:cover;border-radius:18px;
    border:3px solid rgba(255,255,255,.2);box-shadow:0 14px 34px rgba(0,0,0,.5)}
  ${GAMES.map((_, i) => `.row img:nth-child(${i + 1}){transform:rotate(${tilt(i)}deg)}`).join('\n  ')}
  .names{display:flex;gap:${GAP}px;padding:24px 64px 0;font-size:26px;font-weight:700}
  .names span{width:${THUMB}px;text-align:center}
</style>
<div class="head"><img src="${icon}"><div><h1>HZ Arcade</h1><p>Free browser games for phone and desktop</p></div></div>
<div class="row">${GAMES.map(([repo]) => `<img src="${cover(repo)}">`).join('')}</div>
<div class="names">${GAMES.map(([, name]) => `<span>${name}</span>`).join('')}</div>`;

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
let page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.screenshot({ path: path.join(root, 'cover.png') });
await page.close();

page = await browser.newPage({ viewport: { width: 180, height: 180 } });
// iOS rounds the corners itself, so the icon fills the square.
await page.setContent(`<style>html,body{margin:0;background:#1d1836}img{display:block;width:180px;height:180px;transform:scale(1.14)}</style><img src="${icon}">`, { waitUntil: 'load' });
await page.screenshot({ path: path.join(root, 'apple-touch-icon.png') });
await browser.close();
console.log('wrote cover.png and apple-touch-icon.png');
