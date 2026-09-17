import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { parseHTML } from 'linkedom';
import { extractShell, renderShell, safeUrl } from '../src/lib/shell-core.js';
import { resolveDelivery } from '../src/lib/delivery.js';
import { classicShell } from '../scripts/compile-shell-core.mjs';
import { adaptOfficialCss } from '../src/lib/official-markup.js';

const fixture = name => `<nav class="navbar"><ul class="navbar-nav mx-auto">
${['Vehicles', 'Offers', 'Explore'].map(label => `<li class="nav-item"><a href="#">${label}</a><div class="mega-menu"><a href="/vehicles/${name}">${name}</a><a href="javascript:testDriveBooking()">Test Drive</a><a href="javascript:alert(1)">Bad</a><a href="https://evil.invalid/x">Bad domain</a><button onclick="updatesNow()">Follow Updates</button></div></li>`).join('')}
</ul><ul id="moreInfo"><li><a href="/my-account/">My Account</a></li></ul></nav>
<footer class="footer">${['Vehicles', 'Explore', 'Contact'].map(label => `<div class="col"><h2>${label}</h2><a href="/about/faqs">FAQ</a></div>`).join('')}</footer><footer class="footer-basic"><ul><li>MG Australia Pty Ltd © 2026</li></ul><a href="/privacy-policy">Privacy Policy</a></footer>`;

test('default navigation mode; content override; unknown mode fails closed', () => {
  assert.equal(resolveDelivery({}).mode, 'navigation');
  assert.equal(resolveDelivery({ MG_SHELL_MODE: 'content' }).mode, 'content');
  assert.throws(() => resolveDelivery({ MG_SHELL_MODE: 'typo' }));
});
test('only HTTPS official URLs and explicitly allowed social destinations', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,x', '//evil.invalid', 'https://mgmotor.com.au@evil.invalid', 'http://mgmotor.com.au/', '#', 'https://user:pass@mgmotor.com.au/']) assert.equal(safeUrl(value), null);
  assert.equal(safeUrl('/offers'), 'https://mgmotor.com.au/offers');
  assert.equal(safeUrl('https://www.facebook.com/au.mgmotor/', undefined, true), 'https://www.facebook.com/au.mgmotor/');
});
test('source additions and renamed links synchronize; remote executable HTML is discarded', () => {
  const first = extractShell(parseHTML(fixture('MG-A')).document);
  const next = extractShell(parseHTML(fixture('MG-B')).document);
  assert.equal(first.groups[0].links[0].label, 'MG-A');
  assert.equal(next.groups[0].links[0].label, 'MG-B');
  assert.equal(next.groups[0].links[0].href, 'https://mgmotor.com.au/vehicles/MG-B');
  assert.equal(next.groups[0].links.length, 3);
  assert.equal(next.groups[0].links[1].action, true);
  assert.equal(next.groups[0].links[1].href, 'https://mgmotor.com.au/');
  const html = renderShell(next, 'header', { logo: 'assets/mg-logo.jpg' });
  assert.doesNotMatch(html, /onclick|javascript:|<script|evil\.invalid/);
  assert.match(html, /MG-B/);
});
test('markup changes/challenge pages reject instead of replacing a working fallback', () => {
  assert.throws(() => extractShell(parseHTML('<html>Access denied</html>').document));
  assert.throws(() => extractShell(parseHTML(fixture('x').replace('navbar-nav mx-auto', 'new-schema')).document));
});
test('labels cannot inject HTML; local guide URL is supported without storage or API', () => {
  const data = extractShell(parseHTML(fixture('&lt;img src=x onerror=alert(1)&gt;')).document);
  data.appearance.header += '<a href="https://mgmotor.com.au/explore/ev-guides">EV Guides</a>';
  const html = renderShell(data, 'header', { logo: 'assets/logo.jpg', guideHref: 'file:///D:/中文 空格/dist/explore/ev-guides/index.html' });
  assert.match(html, /&lt;img/);
  assert.doesNotMatch(html, /<img src=x/);
  assert.match(html, /file:\/\/\/D:\/中文 空格/);
});
test('classic browser adapter has the same exports as the server adapter', async () => {
  const sandbox = { URL };
  vm.runInNewContext(await classicShell(), sandbox);
  assert.equal(sandbox.MgShell.renderShell(extractShell(parseHTML(fixture('x')).document), 'footer'), renderShell(extractShell(parseHTML(fixture('x')).document), 'footer'));
});
test('packaged official snapshot integrity and deep-file guide mapping', async () => {
  const snapshot = JSON.parse(await readFile(new URL('../src/data/navigation-snapshot.json', import.meta.url), 'utf8'));
  assert.equal(createHash('sha256').update(JSON.stringify(snapshot.data)).digest('hex'), snapshot.dataSha256);
  const data = extractShell(parseHTML(fixture('x')).document);
  data.appearance.header += '<a href="https://mgmotor.com.au/explore/ev-guides">Official EV guides</a>';
  assert.match(renderShell(data, 'header', { guideHref: 'file:///D:/package/explore/ev-guides/index.html' }), /href="file:\/\/\/D:\/package\/explore\/ev-guides\/index.html">Official EV guides/);
});

test('official CSS isolates body selectors and fonts while retaining layout rules', () => {
  const css = adaptOfficialCss('body.x nav{font-family:Favorit;padding:8px 16px;background:url(/logo.png)}', 'https://mgmotor.com.au/about/faqs');
  assert.match(css, /\.official-context.x nav/);
  assert.match(css, /MgOfficialFavorit/);
  assert.match(css, /padding:8px 16px/);
  assert.match(css, /https:\/\/mgmotor.com.au\/logo.png/);
});

test('official snapshot preserves vehicle images, footer icons and removes executable handlers', async () => {
  const {data} = JSON.parse(await readFile(new URL('../src/data/navigation-snapshot.json', import.meta.url), 'utf8'));
  assert.equal(parseHTML(data.appearance.header).document.querySelectorAll('.model-card img').length, 14);
  assert.match(data.appearance.footer, /ion-social-facebook/);
  assert.match(data.appearance.footer, /official-tiktok/);
  assert.doesNotMatch(data.appearance.header + data.appearance.footer + data.appearance.cta, /\son\w+=|javascript:|<script|<iframe/);
});

test('floating enquiry bar is excluded from snapshot and live footer rendering', async () => {
  const { data } = JSON.parse(await readFile(new URL('../src/data/navigation-snapshot.json', import.meta.url), 'utf8'));
  assert.match(data.appearance.cta, /hover-cta-container/);
  assert.doesNotMatch(renderShell(data, 'footer'), /hover-cta-container|hover-cta-btn/);
  const live = extractShell(parseHTML(fixture('Updated') + '<div class="hover-cta-container"><button onclick="enquireNow()">Enquire</button></div>').document);
  assert.doesNotMatch(renderShell(live, 'footer'), /hover-cta-container|>Enquire</);
});

test('menu runtime is click-only and header wrapper does not mask official glass', async () => {
  const runtime = await readFile(new URL('../public/scripts/official-shell.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../public/assets/official-shell.css', import.meta.url), 'utf8');
  assert.doesNotMatch(runtime, /addEventListener\(['"](?:mouseover|mouseenter|pointerover|pointerenter|mouseout)['"]/);
  assert.doesNotMatch(css, /:hover[^{}]*>\.mega-menu/);
  assert.match(css, /:host\(\[data-part=header\]\) \.official-context\{background:transparent!important\}/);
});
