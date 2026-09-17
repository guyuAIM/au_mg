// Local HTTP preview of the fixed-folder delivery and its public URL mappings.
import http from 'node:http';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { canonicalRoutes, legacyGuideAliases } from '../src/lib/content.js';
import { guideBase, contentFile } from '../src/lib/site.js';

const args = process.argv.slice(2);
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const port = Number(option('--port', '4330'));
const root = path.resolve(option('--dir', fileURLToPath(new URL('../dist/', import.meta.url))));
const routes = new Set(canonicalRoutes);
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.xml':'application/xml', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.woff':'font/woff', '.woff2':'font/woff2', '.ttf':'font/ttf', '.eot':'application/vnd.ms-fontobject' };
http.createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); return res.end(); }
    const url = new URL(req.url, 'http://127.0.0.1');
    const pathname = decodeURIComponent(url.pathname);
    const alias = pathname.startsWith(guideBase + '/') ? pathname.slice(guideBase.length + 1) : '';
    const normalized = pathname.replace(/\/index\.html$|\/$/, '');
    const redirect = legacyGuideAliases[alias] ? `${guideBase}/${legacyGuideAliases[alias]}` : pathname !== normalized && routes.has(normalized) ? normalized : null;
    if (redirect) { res.writeHead(301, { Location: redirect + url.search }); return res.end(); }
    let relative = routes.has(pathname) ? contentFile(pathname) : null;
    if (pathname === '/' || pathname === '/index.html') relative = 'index.html';
    if (['/sitemap_evguide.xml', '/404.html'].includes(pathname)) relative = pathname.slice(1);
    if ([guideBase + '/assets/', guideBase + '/scripts/'].some(prefix => pathname.startsWith(prefix))) relative = pathname.slice(guideBase.length + 1);
    if (!relative) throw new Error('Unknown route');
    const file = path.resolve(root, relative);
    if (!file.startsWith(root + path.sep)) throw new Error('Invalid path');
    const bytes = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(await readFile(path.join(root, '404.html')).catch(() => 'Not found'));
  }
}).listen(port, '127.0.0.1', () => console.log(`EV guide preview http://127.0.0.1:${port} -> ${root}`));
