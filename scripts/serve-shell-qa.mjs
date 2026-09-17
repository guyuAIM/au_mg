// Local-only test harness. Never copied into dist or customer packages.
import http from 'node:http';
import path from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import snapshot from '../src/data/navigation-snapshot.json' with { type: 'json' };

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.resolve(process.argv[2] || path.join(project, 'dist'));
const port = Number(process.argv[3] || 4334);
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const links = list => list.map(item => `<a href="${escape(item.href)}">${escape(item.label)}</a>`).join('');
const sourceFixture = `<nav class="navbar"><ul class="navbar-nav mx-auto">${snapshot.data.groups.map((group, index) => `<li class="nav-item"><a href="#">${escape(group.label)}</a><div class="mega-menu">${links(group.links)}${index === 0 ? '<a href="https://mgmotor.com.au/vehicles/qa-future-model">QA future model</a>' : ''}</div></li>`).join('')}</ul><ul id="moreInfo">${links(snapshot.data.actions)}</ul></nav><footer class="footer">${snapshot.data.footerGroups.map(group => `<div class="col"><h2>${escape(group.label)}</h2>${links(group.links)}</div>`).join('')}</footer><footer class="footer-basic"><li>MG Australia Pty Ltd © 2027 QA</li>${links(snapshot.data.legal)}</footer>`;
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.xml': 'application/xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    if (url.pathname.startsWith('/__shell-source/')) {
      res.setHeader('Content-Type', 'text/html');
      if (url.pathname.endsWith('/updated')) return res.end(sourceFixture);
      if (url.pathname.endsWith('/invalid')) return res.end('<html>Changed official layout</html>');
      if (url.pathname.endsWith('/timeout')) { setTimeout(() => res.end(sourceFixture), 1000); return; }
      res.writeHead(503); return res.end('Unavailable');
    }
    let pathname = decodeURIComponent(url.pathname);
    // New package layout is flat; historical baseline packages remain nested.
    const flat = !(await stat(path.join(root, 'explore/ev-guides/index.html')).catch(() => null));
    if (flat && (pathname === '/explore/ev-guides' || pathname.startsWith('/explore/ev-guides/'))) pathname = pathname.slice('/explore/ev-guides'.length) || '/';
    let file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); return res.end(); }
    try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html'); }
    catch { file = path.join(file, 'index.html'); }
    let bytes = await readFile(file);
    if (file.endsWith('.html')) {
      let html = bytes.toString();
      const scenario = url.searchParams.get('qa-shell');
      if (['updated', 'invalid', 'timeout', 'unavailable'].includes(scenario)) {
        html = html.replace(/(<script[^>]*id="mg-navigation-config"[^>]*>)([\s\S]*?)(<\/script>)/, (_, before, raw, after) => {
          const config = JSON.parse(raw);
          config.sourceUrl = `http://127.0.0.1:${port}/__shell-source/${scenario}`;
          config.timeoutMs = scenario === 'timeout' ? 100 : 4500;
          return before + JSON.stringify(config) + after;
        });
      }
      if (url.searchParams.has('qa-nojs')) res.setHeader('Content-Security-Policy', "script-src 'none'");
      bytes = Buffer.from(html);
    }
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.end(bytes);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Shell QA: http://127.0.0.1:${port} -> ${root}`));
