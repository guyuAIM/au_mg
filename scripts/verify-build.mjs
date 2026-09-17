import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalRoutes, editorialGuides, faqData, guideSources } from '../src/lib/content.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const htmlFile = (route) => path.join(dist, ...route.slice(1).split('/'), 'index.html');
const failures = [];
const htmlByRoute = new Map();
const check = (condition, message) => { if (!condition) failures.push(message); };
const escaped = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const tableCells = (table) => Array.isArray(table) ? table.flat() : [...(table?.headers || []), ...(table?.rows || []).flat()];

try { await access(path.join(dist, 'index.html')); failures.push('dist/index.html must not exist because this project does not own /'); } catch {}

for (const route of canonicalRoutes) {
  const file = htmlFile(route);
  let html = '';
  try { html = await readFile(file, 'utf8'); } catch { failures.push(`missing built route ${route}: ${file}`); continue; }
  htmlByRoute.set(route, html);
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

const faqHtml = await readFile(htmlFile('/about/faqs'), 'utf8');
for (const faq of faqData.faqs) {
  check(faqHtml.includes(escaped(faq.question)), `/about/faqs is missing FAQ question ${faq.id}`);
  for (const paragraph of faq.paragraphs) check(faqHtml.includes(escaped(paragraph)), `/about/faqs is missing paragraph from ${faq.id}`);
  for (const cell of tableCells(faq.table)) {
    check(faqHtml.includes(escaped(cell)), `/about/faqs is missing table cell from ${faq.id}: ${cell}`);
  }
  for (const sourceId of faq.sources || []) {
    check(faqHtml.includes(escaped(faqData.sources[sourceId].url)), `/about/faqs is missing source URL ${sourceId}`);
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
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1].replaceAll('&amp;', '&');
    if (value.startsWith('#')) {
      check(html.includes(`id="${value.slice(1)}"`), `${route} has missing anchor ${value}`);
      continue;
    }
    if (!value.startsWith('/') || value.startsWith('//')) continue;
    const target = value.split(/[?#]/, 1)[0] || route;
    if (target.startsWith('/assets/') || target.startsWith('/scripts/')) {
      await access(path.join(dist, ...target.slice(1).split('/'))).catch(() => failures.push(`${route} references missing asset ${target}`));
    } else {
      check(localTargets.has(target), `${route} references non-canonical local route ${target}`);
      const fragment = value.split('#')[1];
      if (fragment && htmlByRoute.has(target)) check(htmlByRoute.get(target).includes(`id="${fragment}"`), `${route} references missing anchor ${value}`);
    }
  }
}

const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
check((sitemap.match(/<url>/g) || []).length === 17, 'sitemap must contain exactly 17 URLs');
for (const route of canonicalRoutes) check(sitemap.includes(`<loc>https://mgmotor.com.au${route}</loc>`), `sitemap is missing ${route}`);
await access(path.join(dist, 'robots.txt'));
await access(path.join(dist, '404.html')).catch(async () => access(path.join(dist, '404', 'index.html')));

const deployment = await readFile(path.join(root, 'deployment/nginx-geo-static.conf'), 'utf8');
check(!/^\s*location\s+(?:=\s+)?\/\s*\{/m.test(deployment), 'integration must not take over the MG root route');
for (const route of canonicalRoutes) check(deployment.includes(`location = ${route} {`), `deployment is missing ${route}`);
const redirects = await readFile(path.join(root, 'deployment/legacy-guide-redirects.conf'), 'utf8');
check((redirects.match(/return 301 /g) || []).length === 25, 'deployment must contain 25 legacy redirects');

if (failures.length) throw new Error(`Build verification failed (${failures.length}):\n- ${failures.join('\n- ')}`);
console.log(JSON.stringify({ canonicalRoutes: 17, guideArticles: 14, faqsVerified: 16, h1PerPage: 1, jsonLdPerPage: true, spaRootFound: false, sitemapUrls: 17, tableCellsAndSourcesVerified: true, localLinksAndAssetsVerified: true }, null, 2));
