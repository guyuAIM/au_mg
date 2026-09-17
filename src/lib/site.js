export const site = Object.freeze({
  origin: 'https://mgmotor.com.au',
  brandName: 'MG Australia',
  legalName: 'MG Australia Pty Ltd',
  language: 'en-AU',
  logoPath: '/assets/mg-logo.jpg',
  socialImagePath: '/assets/faq-banner.jpg'
});

export const official = (path) => `${site.origin}${path}`;
export const canonical = (path) => official(path);
export const guideBase = '/explore/ev-guides';
// Physical package paths are independent from the canonical public prefix.
export const contentFile = (route) => {
  if (route === guideBase) return 'index.html';
  if (!route.startsWith(guideBase + '/')) throw new Error('Not a guide route: ' + route);
  const slug = route.slice(guideBase.length + 1);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid guide slug: ' + slug);
  return slug + '/index.html';
};
export const assetPath = (path) => path.replace(/^\/(assets|scripts)\//, `${guideBase}/$1/`);
export const absoluteAsset = (path) => new URL(assetPath(path), `${site.origin}/`).href;
export const resourceHref = (asset, pagePath) => {
  const depth = pagePath.replace(/\/$/, '').split('/').filter(Boolean).length - 2;
  return '../'.repeat(Math.max(0, depth)) + asset.replace(/^\//, '');
};
