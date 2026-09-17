import { canonicalRoutes, editorialGuides, faqData } from '../lib/content.js';
import { canonical } from '../lib/site.js';

export function GET() {
  const guideDates = new Map(editorialGuides.map((guide) => [`/explore/ev-guides/${guide.slug}`, guide.modifiedIso]));
  const defaultDate = faqData.reviewed || '2026-09-16';
  const urls = canonicalRoutes.map((path) => {
    const lastmod = guideDates.get(path) || defaultDate;
    return `  <url><loc>${canonical(path)}</loc><lastmod>${lastmod}</lastmod></url>`;
  }).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
