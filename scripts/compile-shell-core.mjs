import { readFile } from 'node:fs/promises';
export async function classicShell() {
  const markup = await readFile(new URL('../src/lib/official-markup.js', import.meta.url), 'utf8');
  const core = await readFile(new URL('../src/lib/shell-core.js', import.meta.url), 'utf8');
  return '(function(){\n' + markup.replace(/^export \{[^\n]+\};$/m, '') + '\n' + core.replace(/^import [^\n]+\n/m, '').replace('export { extractShell, renderShell, safeUrl };', 'globalThis.MgShell = { extractShell, renderShell, safeUrl };') + '\n})();\n';
}
