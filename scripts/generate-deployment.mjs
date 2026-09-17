import { writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { legacyGuideAliases, canonicalRoutes } from '../src/lib/content.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rules = Object.entries(legacyGuideAliases).map(([from, to]) => `location = /explore/ev-guides/${from} { return 301 /explore/ev-guides/${to}; }`).join('\n');
await writeFile(path.join(root, 'deployment', 'legacy-guide-redirects.conf'), `${rules}\n`, 'utf8');
console.log(`Generated ${Object.keys(legacyGuideAliases).length} permanent redirects.`);
const locations = canonicalRoutes.flatMap((route) => [
  `location = ${route} { root /srv/mg-geo/dist; try_files ${route}/index.html =404; }`,
  `location = ${route}/ { return 301 ${route}; }`
]);
for (const directory of ['assets', 'scripts']) {
  for (const name of await readdir(path.join(root, 'public', directory))) {
    locations.push(`location = /${directory}/${name} { root /srv/mg-geo/dist; try_files $uri =404; }`);
  }
}
locations.push('location /explore/ev-guides/ { return 404; }');
await writeFile(path.join(root, 'deployment', 'nginx-geo-static.conf'), [
  '# Include inside the existing MG server block; replace /srv/mg-geo/dist with the release directory.',
  '# Include legacy-guide-redirects.conf in the same server block.',
  '# This file intentionally defines no location / and no server-wide root or error_page.',
  '# Merge sitemap.xml into the existing sitemap index and preserve the existing site robots.txt.',
  ...locations, ''
].join('\n'), 'utf8');
