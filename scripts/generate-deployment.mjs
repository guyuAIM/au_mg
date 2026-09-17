import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { legacyGuideAliases, canonicalRoutes } from '../src/lib/content.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = '/explore/ev-guides';
const rules = Object.entries(legacyGuideAliases).map(([from, to]) => `location = ${base}/${from} { return 301 ${base}/${to}; }`).join('\n');
await writeFile(path.join(root, 'deployment/legacy-guide-redirects.conf'), rules + '\n');
const locations = [
  'set $mg_evguide_dir /srv/mg-geo/dist;',
  `location = ${base} { root $mg_evguide_dir; try_files /index.html =404; }`,
  `location = ${base}/ { return 301 ${base}; }`,
  `location = ${base}/index.html { return 301 ${base}; }`,
  ...['assets', 'scripts'].map(directory => `location ^~ ${base}/${directory}/ { alias $mg_evguide_dir/${directory}/; autoindex off; }`),
  `location ~ ^${base}/(?<mg_evguide_slug>[a-z0-9]+(?:-[a-z0-9]+)*)(?<mg_evguide_suffix>/index[.]html|/)?$ {`,
  '  root $mg_evguide_dir;',
  '  if (!-f $mg_evguide_dir/$mg_evguide_slug/index.html) { return 404; }',
  `  if ($mg_evguide_suffix != "") { return 301 ${base}/$mg_evguide_slug; }`,
  '  try_files /$mg_evguide_slug/index.html =404;',
  '}',
  'location = /sitemap_evguide.xml { root $mg_evguide_dir; default_type application/xml; try_files /sitemap_evguide.xml =404; }'
];
locations.push(`location ${base}/ { return 404; }`);
await writeFile(path.join(root, 'deployment/nginx-geo-static.conf'), [
  '# Include in the existing MG server block; replace /srv/mg-geo/dist with the release directory.',
  '# Include legacy-guide-redirects.conf in that same server block.',
  '# No root page, server-wide root, robots policy or existing main sitemap is replaced.',
  ...locations, ''
].join('\n'));
await writeFile(path.join(root, 'deployment/robots-sitemap-snippet.txt'), 'Sitemap: https://mgmotor.com.au/sitemap_evguide.xml\n');
await writeFile(path.join(root, 'deployment/sitemap-index-snippet.xml'), '<sitemap><loc>https://mgmotor.com.au/sitemap_evguide.xml</loc></sitemap>\n');
console.log(`Generated stable directory mapping for ${canonicalRoutes.length} content pages, namespaced resources and child sitemap; 25 legacy redirects.`);
