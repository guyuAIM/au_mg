import { canonicalRoutes, editorialGuides, faqData, questionsPath } from '../lib/content.js';
import { canonical } from '../lib/site.js';

export function GET() {
  const dates = new Map(editorialGuides.map(guide => [`/explore/ev-guides/${guide.slug}`, guide.modifiedIso]));
  const latestGuide = editorialGuides.map(guide => guide.modifiedIso).sort().at(-1);
  dates.set('/explore/ev-guides', latestGuide);
  dates.set(questionsPath, faqData.modified);
  const entries = canonicalRoutes.map(path => `  <url><loc>${canonical(path)}</loc><lastmod>${dates.get(path) || latestGuide}</lastmod></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
