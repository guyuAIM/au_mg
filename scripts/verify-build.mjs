import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalRoutes, editorialGuides, guideSources } from '../src/lib/content.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const delivery = JSON.parse(await readFile(path.join(dist, 'delivery-config.json'), 'utf8'));
const htmlFile = (route) => path.join(dist, ...route.slice(1).split('/'), 'index.html');
const failures = [];
const htmlByRoute = new Map();
const check = (condition, message) => { if (!condition) failures.push(message); };
const escaped = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const tableCells = (table) => Array.isArray(table) ? table.flat() : [...(table?.headers || []), ...(table?.rows || []).flat()];

const launcher = await readFile(path.join(dist, 'index.html'), 'utf8');
if (delivery.mode === 'content') {
  for (const asset of ['official-shell.js', 'official-shell-core.js']) {
    try { await access(path.join(dist, 'explore/ev-guides/scripts', asset)); failures.push('content mode includes shell runtime: ' + asset); } catch {}
  }
}
check(launcher.includes('noindex') && launcher.includes('location.replace') && launcher.includes('./explore/ev-guides/index.html'), 'root launcher is missing file/HTTP redirect or noindex');
for (const forbidden of ['about/faqs/index.html', 'vehicles/mgs6-ev/index.html', 'robots.txt', 'sitemap.xml', 'assets', 'scripts']) {
  try { await access(path.join(dist, forbidden)); failures.push('unexpected output: ' + forbidden); } catch {}
}

for (const route of canonicalRoutes) {
  const file = htmlFile(route);
  let html = '';
  try { html = await readFile(file, 'utf8'); } catch { failures.push(`missing built route ${route}: ${file}`); continue; }
  htmlByRoute.set(route, html);
  check(!html.includes('class="hover-cta-container'), route + ' must not contain floating official CTA');
  check(html.includes(`data-shell-mode="${delivery.mode}"`), route + ' mode mismatch');
  check((html.match(/<mg-site-shell\b/g) || []).length === (delivery.mode === 'navigation' ? 2 : 0), route + ' shell count mismatch');
  check(html.includes('id="mg-navigation-config"') === (delivery.mode === 'navigation'), route + ' shell configuration mismatch');
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  check(h1Count === 1, `${route} must contain exactly one h1, found ${h1Count}`);
  check(!html.includes('<div id="root"></div>'), `${route} still contains an empty SPA root`);
  check(html.includes('<script type="application/ld+json">'), `${route} is missing JSON-LD`);
  check(html.includes(`rel="canonical" href="https://mgmotor.com.au${route}"`), `${route} has the wrong canonical`);
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (match) {
    try { JSON.parse(match[1]); } catch (error) { failures.push(`${route} has invalid JSON-LD: ${error.message}`); }
  }
}

const guideHub = await readFile(htmlFile('/explore/ev-guides'), 'utf8');
for (const guide of editorialGuides) {
  check(guideHub.includes(escaped(guide.title)), `guide hub is missing ${guide.guideId}`);
  const article = await readFile(htmlFile(`/explore/ev-guides/${guide.slug}`), 'utf8');
  check(article.includes(escaped(guide.title)), `${guide.slug} is missing its title`);
  check(article.includes(escaped(guide.quickAnswer)), `${guide.slug} is missing its quick answer`);
  for (const section of guide.sections) {
    check(article.includes(escaped(section.heading)), `${guide.slug} is missing section ${section.heading}`);
    for (const paragraph of section.paragraphs) check(article.includes(escaped(paragraph)), `${guide.slug} is missing a source paragraph`);
    for (const cell of tableCells(section.table)) {
      check(article.includes(escaped(cell)), `${guide.slug} is missing table cell: ${cell}`);
    }
    for (const bullet of section.bullets || []) check(article.includes(escaped(bullet)), `${guide.slug} is missing bullet: ${bullet}`);
  }
  for (const note of guide.notes || []) check(article.includes(escaped(note)), `${guide.slug} is missing note: ${note}`);
  for (const [question, answer] of guide.faq) {
    check(article.includes(escaped(question)) && article.includes(escaped(answer)), `${guide.slug} is missing a buyer FAQ`);
  }
  for (const sourceId of new Set([...guide.sources, ...guide.sections.flatMap((section) => section.sources || [])])) {
    check(article.includes(escaped(guideSources[sourceId].url)), `${guide.slug} is missing source URL ${sourceId}`);
  }
}

const localTargets = new Set(canonicalRoutes);
for (const [route, html] of htmlByRoute) {
  check(html.includes(`<base href="${route}/"`), route + ' has wrong HTTP resource base');
  for (const tag of html.matchAll(/<(?:a|img|source|link|script)\b[^>]*>/g)) {
    for (const match of tag[0].matchAll(/(?:href|src|srcset)="([^"]+)"/g)) {
      const value = match[1].replaceAll('&amp;', '&');
      // Official menu triggers are controls, not canonical content links.
      if (value === '#' && /\bmega-link\b/.test(tag[0]) && /aria-haspopup=/.test(tag[0])) continue;
      if (/^(https?:|data:)/.test(value)) continue;
      const resolved = new URL(value, 'https://mgmotor.com.au' + route + '/');
      const target = resolved.pathname;
      if (target.includes('/assets/') || target.includes('/scripts/')) {
        await access(path.join(dist, ...target.slice(1).split('/'))).catch(() => failures.push(route + ' references missing asset ' + target));
        check(target.startsWith('/explore/ev-guides/'), 'asset escaped guide namespace: ' + target);
      } else {
        check(localTargets.has(target), route + ' references non-canonical route ' + target);
        if (resolved.hash && htmlByRoute.has(target)) check(htmlByRoute.get(target).includes(`id="${resolved.hash.slice(1)}"`), 'missing anchor: ' + value);
      }
    }
  }
}
const sitemap = await readFile(path.join(dist, 'sitemap_evguide.xml'), 'utf8');
check((sitemap.match(/<url>/g) || []).length === 15, 'sitemap must contain exactly 15 URLs');
for (const route of canonicalRoutes) check(sitemap.includes(`<loc>https://mgmotor.com.au${route}</loc>`), `sitemap is missing ${route}`);

await access(path.join(dist, '404.html')).catch(async () => access(path.join(dist, '404', 'index.html')));

const deployment = await readFile(path.join(root, 'deployment/nginx-geo-static.conf'), 'utf8');
check(!/^\s*location\s+(?:=\s+)?\/\s*\{/m.test(deployment), 'integration must not take over the MG root route');
for (const route of canonicalRoutes) check(deployment.includes(`location = ${route} {`), `deployment is missing ${route}`);
const redirects = await readFile(path.join(root, 'deployment/legacy-guide-redirects.conf'), 'utf8');
check((redirects.match(/return 301 /g) || []).length === 25, 'deployment must contain 25 legacy redirects');

const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
check(new Set(locations).size === 15, 'sitemap must have 15 unique URLs');
const latest = editorialGuides.map(guide => guide.modifiedIso).sort().at(-1);
check(sitemap.includes(`<loc>https://mgmotor.com.au/explore/ev-guides</loc><lastmod>${latest}</lastmod>`), 'hub lastmod must reflect latest guide date');
for (const guide of editorialGuides) check(sitemap.includes(`<loc>https://mgmotor.com.au/explore/ev-guides/${guide.slug}</loc><lastmod>${guide.modifiedIso}</lastmod>`), 'guide lastmod mismatch');
check(!/^\s*location\s+=\s+\/(?:index\.html|robots\.txt|sitemap\.xml)\s*\{/m.test(deployment), 'integration must not replace existing MG root files');
for (const route of canonicalRoutes) {
  check(deployment.includes(`location = ${route}/index.html { return 301 ${route}; }`), 'index.html redirect missing');
  check(deployment.includes(`location = ${route}/ { return 301 ${route}; }`), 'trailing slash redirect missing');
}
if (failures.length) throw new Error(`Build verification failed (${failures.length}):\n- ${failures.join('\n- ')}`);
console.log(JSON.stringify({ canonicalRoutes: 15, guideArticles: 14, h1PerPage: 1, jsonLdPerPage: true, spaRootFound: false, sitemapUrls: 15, tableCellsAndSourcesVerified: true, localLinksAndAssetsVerified: true }, null, 2));
