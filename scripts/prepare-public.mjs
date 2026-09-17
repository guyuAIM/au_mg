import { mkdir, cp, readFile, writeFile, rm } from 'node:fs/promises';
import { delivery } from '../src/lib/delivery.js';
import { classicShell } from './compile-shell-core.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, '.generated/public/explore/ev-guides');
await mkdir(target, { recursive: true });
await cp(path.join(root, 'public/assets'), path.join(target, 'assets'), { recursive: true });
await cp(path.join(root, 'public/scripts'), path.join(target, 'scripts'), { recursive: true });
if (delivery.mode === 'navigation') {
  await writeFile(path.join(target, 'scripts/official-shell-core.js'), await classicShell());
  await cp(path.join(root, 'src/data/official-shell-assets'), path.join(target, 'assets/official-shell'), { recursive: true });
  const shellDir = path.join(target, 'assets/official-shell');
  const bundle = (await readFile(path.join(shellDir, 'bundle.css'), 'utf8')).replace(/\bFavorit\b/g, 'MgOfficialFavorit');
  await writeFile(path.join(shellDir, 'bundle.css'), bundle);
  // Shadow-root @font-face rules are not registered by Chromium. Register only
  // namespaced official fonts globally; never change the guide's golden fonts.
  let fonts = [...bundle.matchAll(/@font-face\s*\{[^}]*\}/g)].map(m => m[0]).filter(css => /MgOfficialFavorit|"Favorites"/.test(css)).join('\n');
  for (const match of [...fonts.matchAll(/url\("\.\/([^"#]+)(?:#[^"]*)?"\)/g)]) {
    const bytes = await readFile(path.join(shellDir, match[1]));
    fonts = fonts.replaceAll(match[0], `url("data:application/octet-stream;base64,${bytes.toString('base64')}")`);
  }
  await writeFile(path.join(shellDir, 'fonts.css'), fonts);
} else {
  // Explicit generated files only; do not mutate the original public sources.
  for (const name of ['scripts/official-shell.js', 'scripts/official-shell-core.js', 'assets/official-shell.css']) {
    await rm(path.join(target, name), { force: true });
  }
  const generatedShellAssets = path.resolve(target, 'assets/official-shell');
  if (!generatedShellAssets.startsWith(path.resolve(root, '.generated/public/explore/ev-guides') + path.sep)) throw new Error('Unsafe generated asset path');
  await rm(generatedShellAssets, { recursive: true, force: true });
}
await writeFile(path.join(root, '.generated/public/delivery-config.json'), JSON.stringify({
  mode: delivery.mode, navigation: delivery.mode === 'navigation' ? delivery.navigation : null
}, null, 2) + '\n');
const original = await readFile(path.join(root, 'public/assets/styles.css'), 'utf8');
let portable = original;
for (const match of original.matchAll(/url\('\/assets\/([^']+)'\)/g)) {
  const name = match[1];
  if (!/\.(woff2?|ttf)$/.test(name)) throw new Error(`Unexpected golden stylesheet asset: ${name}`);
  const mime = name.endsWith('.woff2') ? 'font/woff2' : name.endsWith('.woff') ? 'font/woff' : 'font/ttf';
  const bytes = await readFile(path.join(root, 'public/assets', name));
  portable = portable.replaceAll(match[0], `url('data:${mime};base64,${bytes.toString('base64')}')`);
}
await writeFile(path.join(target, 'assets/styles.css'), portable);
console.log('Prepared namespaced assets with embedded original font bytes. Golden files unchanged.');
