import { writeFile } from 'node:fs/promises';
import { canonicalRoutes } from '../src/lib/content.js';

const origin = process.env.PREVIEW_ORIGIN || 'http://localhost:4321';
const checks = [...canonicalRoutes.map(path => [path, 200]), ['/', 404], ['/missing-geo-review-route', 404], ['/explore/ev-guides/missing-geo-review-guide', 404], ['/robots.txt', 200], ['/sitemap.xml', 200]];
const results = [];
for (const [path, expected] of checks) {
  const response = await fetch(origin + path, { redirect: 'manual' });
  results.push({ path, expected, status: response.status, pass: expected === response.status });
  await response.arrayBuffer();
}
await writeFile(new URL('../qa/recheck/http.json', import.meta.url), JSON.stringify({ origin, results }, null, 2) + '\n');
console.log(JSON.stringify(results, null, 2));
if (results.some(result => !result.pass)) process.exitCode = 1;
