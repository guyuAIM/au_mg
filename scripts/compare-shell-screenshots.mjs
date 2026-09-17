import sharp from 'sharp';
import { readFile, writeFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../qa/delivery/', import.meta.url);
const report = JSON.parse(await readFile(new URL('shell-browser.json', root), 'utf8'));
const results = [];
for (const baseline of report.screenshots.filter(item => item.variant === 'baseline')) {
  const group = report.screenshots.filter(item => item.width === baseline.width && item.route === baseline.route);
  const pixels = [];
  const encodings = [];
  for (const item of group) {
    let file = new URL('shell-screenshots/' + item.name, root);
    const meta = await sharp(await readFile(file)).metadata();
    encodings.push({ format: meta.format, width: meta.width, height: meta.height, cssWidth: item.width, cssHeight: item.height });
    if (meta.format === 'jpeg' && item.name.endsWith('.png')) {
      item.name = item.name.replace(/\.png$/, '.jpg');
      const renamed = new URL('shell-screenshots/' + item.name, root);
      await rename(file, renamed);
      file = renamed;
    }
    // Exclude scrollbar and align the body area, not the intentionally different shell.
    const crop = { left: 0, top: Math.round(item.mainTop * meta.width / item.width), width: meta.width - 20, height: 650 };
    const image = sharp(await readFile(file)).extract(crop);
    pixels.push(await image.clone().raw().toBuffer());
    await image.png().toFile(fileURLToPath(new URL('shell-screenshots/aligned-' + item.name.replace(/\.jpg$/, '.png'), root)));
  }
  const result = { width: baseline.width, route: baseline.route,
    navigationPixelsExact: pixels[0].equals(pixels[1]), contentPixelsExact: pixels[0].equals(pixels[2]), cropHeight: 650, encodings,
    losslessPixelCertification: false,
    limitation: 'Browser screenshot channel returned resized lossy JPEG. Different document offsets also change resampling phase. Not a lossless pixel comparison; use DOM geometry evidence and visual review separately.' };
  results.push(result);
}
await writeFile(new URL('shell-pixels.json', root), JSON.stringify(results, null, 2) + '\n');
await writeFile(new URL('shell-browser.json', root), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(results, null, 2));
