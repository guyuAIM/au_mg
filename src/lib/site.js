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
export const assetPath = (path) => path.replace(/^\/(assets|scripts)\//, `${guideBase}/$1/`);
export const absoluteAsset = (path) => new URL(assetPath(path), `${site.origin}/`).href;
export const resourceHref = (asset, pagePath) => {
  const depth = pagePath.replace(/\/$/, '').split('/').filter(Boolean).length - 2;
  return '../'.repeat(Math.max(0, depth)) + asset.replace(/^\//, '');
};
