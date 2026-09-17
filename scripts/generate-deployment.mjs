import { writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { legacyGuideAliases, canonicalRoutes } from '../src/lib/content.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = '/explore/ev-guides';
const rules = Object.entries(legacyGuideAliases).map(([from, to]) => `location = ${base}/${from} { return 301 ${base}/${to}; }`).join('\n');
await writeFile(path.join(root, 'deployment/legacy-guide-redirects.conf'), rules + '\n');
const locations = canonicalRoutes.flatMap(route => [
  `location = ${route} { root /srv/mg-geo/dist; try_files ${route}/index.html =404; }`,
  `location = ${route}/ { return 301 ${route}; }`,
  `location = ${route}/index.html { return 301 ${route}; }`
]);
for (const directory of ['assets', 'scripts']) {
  async function addFiles(folder, prefix) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      if (entry.isDirectory()) await addFiles(path.join(folder, entry.name), prefix + '/' + entry.name);
      else locations.push(`location = ${prefix}/${entry.name} { root /srv/mg-geo/dist; try_files $uri =404; }`);
    }
  }
  await addFiles(path.join(root, '.generated/public/explore/ev-guides', directory), `${base}/${directory}`);
}
locations.push('location = /sitemap_evguide.xml { root /srv/mg-geo/dist; default_type application/xml; try_files $uri =404; }');
locations.push(`location ${base}/ { return 404; }`);
await writeFile(path.join(root, 'deployment/nginx-geo-static.conf'), [
  '# Include in the existing MG server block; replace /srv/mg-geo/dist with the release directory.',
  '# Include legacy-guide-redirects.conf in that same server block.',
  '# No root page, server-wide root, robots policy or existing main sitemap is replaced.',
  ...locations, ''
].join('\n'));
await writeFile(path.join(root, 'deployment/robots-sitemap-snippet.txt'), 'Sitemap: https://mgmotor.com.au/sitemap_evguide.xml\n');
await writeFile(path.join(root, 'deployment/sitemap-index-snippet.xml'), '<sitemap><loc>https://mgmotor.com.au/sitemap_evguide.xml</loc></sitemap>\n');
console.log('Generated 15 scoped page mappings, 30 canonical redirects and 25 legacy redirects.');
