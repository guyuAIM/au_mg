import { parseHTML } from 'linkedom';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { delivery } from '../src/lib/delivery.js';
import { extractShell } from '../src/lib/shell-core.js';
import { adaptOfficialCss, officialUrl } from '../src/lib/official-markup.js';

const config = delivery.navigation;
const response = await fetch(config.sourceUrl, { signal: AbortSignal.timeout(15000), credentials: 'omit' });
if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) throw new Error('Official HTML unavailable');
const html = await response.text();
if (Buffer.byteLength(html) > config.maxResponseBytes) throw new Error('Official response too large');
const { document } = parseHTML(html); // Does not execute scripts or fetch resources.
const data = extractShell(document, config);
const directory = new URL('../src/data/official-shell-assets/', import.meta.url);
await mkdir(directory, { recursive: true });
const assetMap = {};
const assets = new Map();
async function cacheAsset(url) {
  if (assets.has(url)) return assets.get(url);
  const pending = (async () => {
    const r = await fetch(url, { signal: AbortSignal.timeout(20000), credentials: 'omit' });
    if (!r.ok) throw new Error(`Official asset HTTP ${r.status}: ${new URL(url).pathname}`);
    const bytes = Buffer.from(await r.arrayBuffer());
    if (bytes.length > 5000000) throw new Error('Official asset exceeds size limit');
    const extension = path.extname(new URL(url).pathname).toLowerCase();
    if (!/^\.(css|png|jpe?g|webp|svg|woff2?|ttf|eot)$/.test(extension)) throw new Error('Unexpected official asset type');
    const file = createHash('sha256').update(url).digest('hex').slice(0, 16) + extension;
    await writeFile(new URL(file, directory), bytes);
    assetMap[url] = file;
    return bytes;
  })();
  assets.set(url, pending);
  return pending;
}
let bundle = '';
for (const style of data.appearance.styles) {
  const css = style.href ? adaptOfficialCss((await cacheAsset(style.href)).toString(), style.href) : style.css;
  bundle += '\n' + css;
}
const media = [...data.appearance.header.matchAll(/src="([^"]+)"/g), ...data.appearance.footer.matchAll(/src="([^"]+)"/g)].map(match => match[1].replaceAll('&amp;', '&'));
const fonts = [...bundle.matchAll(/url\("(https:[^"]+\.(?:woff2?|ttf|eot|svg)(?:\?[^"#]*)?(?:#[^"]*)?)"\)/g)].map(match => match[1]);
for (const url of new Set([...media, ...fonts])) {
  if (officialUrl(url, config.sourceUrl, true)) await cacheAsset(url);
}
for (const [url, file] of Object.entries(assetMap)) bundle = bundle.replaceAll(`url("${url}")`, `url("./${file}")`);
await writeFile(new URL('bundle.css', directory), bundle);
await writeFile(new URL('manifest.json', directory), JSON.stringify({ assetMap }, null, 2) + '\n');
const snapshot = { sourceUrl: config.sourceUrl, capturedAt: new Date().toISOString(),
  dataSha256: createHash('sha256').update(JSON.stringify(data)).digest('hex'), data };
await writeFile(new URL('../src/data/navigation-snapshot.json', import.meta.url), JSON.stringify(snapshot, null, 2) + '\n');
console.log(JSON.stringify({ sourceUrl: config.sourceUrl, capturedAt: snapshot.capturedAt,
  groups: data.groups.length, links: data.groups.reduce((n, group) => n + group.links.length, 0),
  footerGroups: data.footerGroups.length, dataSha256: snapshot.dataSha256 }, null, 2));
