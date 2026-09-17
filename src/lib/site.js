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
export const absoluteAsset = (path) => new URL(path, `${site.origin}/`).href;
