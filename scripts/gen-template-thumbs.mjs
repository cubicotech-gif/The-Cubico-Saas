#!/usr/bin/env node
/**
 * Generates real PNG screenshots of every template's index.html so the
 * /templates browse grid can show actual website previews instead of
 * loading live iframes.
 *
 * Usage:
 *   npm run gen:thumbs
 *
 * Output:
 *   public/templates/<key>/thumb.jpg  (1280x800, quality 82)
 *
 * The TemplateThumb component automatically prefers `template.thumb`
 * over the live iframe, so once these files exist and the manifest
 * has `thumb: '/templates/<key>/thumb.png'` set, cards switch to the
 * static screenshot.
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import http from 'node:http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const TEMPLATES_DIR = path.join(PUBLIC_DIR, 'templates');

const VIEWPORT = { width: 1280, height: 800 };

// Discover templates: every subfolder of public/templates that has index.html
const templates = fs
  .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== '_shared' && d.name !== 'public')
  .map((d) => d.name)
  .filter((key) => fs.existsSync(path.join(TEMPLATES_DIR, key, 'index.html')));

if (templates.length === 0) {
  console.error('No templates found in', TEMPLATES_DIR);
  process.exit(1);
}

// Tiny static server so relative paths like /templates/_shared/inner.css resolve.
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const filePath = path.join(PUBLIC_DIR, urlPath);
    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403);
      return res.end('forbidden');
    }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404);
      return res.end('not found');
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.writeHead(500);
    res.end(String(err));
  }
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const base = `http://127.0.0.1:${port}`;
console.log(`Static server listening on ${base}`);

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 1.5, // balance crispness vs file size
});

let ok = 0;
for (const key of templates) {
  const url = `${base}/templates/${key}/index.html`;
  const out = path.join(TEMPLATES_DIR, key, 'thumb.jpg');
  process.stdout.write(`→ ${key} … `);
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
    // Give web fonts + any animations a moment to settle.
    await page.waitForTimeout(800);
    await page.screenshot({
      path: out,
      clip: { x: 0, y: 0, ...VIEWPORT },
      type: 'jpeg',
      quality: 82,
    });
    console.log('ok');
    ok++;
  } catch (err) {
    console.log('FAIL', err.message);
  } finally {
    await page.close();
  }
}

await browser.close();
server.close();
console.log(`\nGenerated ${ok}/${templates.length} thumbnails.`);
process.exit(ok === templates.length ? 0 : 1);
