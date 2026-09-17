import { extractAppearance, renderAppearance } from './official-markup.js';
// Retain official presentation while excluding executable remote code.
const OFFICIAL = 'https://mgmotor.com.au';
const SOCIAL = new Set(['www.facebook.com', 'www.instagram.com', 'www.youtube.com', 'au.linkedin.com', 'www.linkedin.com', 'www.tiktok.com']);
const text = node => (node?.textContent || '').replace(/\s+/g, ' ').trim();
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function safeUrl(value, sourceUrl = OFFICIAL, social = false) {
  if (!value || /^[\s]*(?:javascript|data|vbscript):/i.test(value) || value.trim().startsWith('#')) return null;
  try {
    const url = new URL(value, sourceUrl);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    if (!['mgmotor.com.au', 'www.mgmotor.com.au'].includes(url.hostname) && !(social && SOCIAL.has(url.hostname))) return null;
    return url.href;
  } catch { return null; }
}

function extractShell(document, options = {}) {
  const sourceUrl = options.sourceUrl || OFFICIAL + '/about/faqs';
  const actionUrl = safeUrl(options.actionUrl || OFFICIAL + '/', sourceUrl);
  const nav = document.querySelector('nav.navbar');
  const footer = document.querySelector('footer.footer');
  const basic = document.querySelector('footer.footer-basic');
  if (!nav || !footer || !basic) throw new Error('Official shell structure changed');
  function link(node, social = false) {
    let label = text(node.querySelector('.text-black')) || text(node) || node.getAttribute('aria-label') || node.getAttribute('title') || '';
    let href = safeUrl(node.getAttribute('href'), sourceUrl, social);
    const action = /\b(?:testDriveBooking|updatesNow|enquireNow|subscribeNewsletter)\s*\(/.test((node.getAttribute('onclick') || '') + (node.getAttribute('href') || ''));
    if (!href && action) href = actionUrl;
    if (!label && social && href) label = new URL(href).hostname.replace(/^(www\.|au\.)/, '').split('.')[0];
    if (!href || !label || label.length > 160) return null;
    const card = node.closest('.model-card');
    return { label, href, ...(action ? { action: true } : {}), ...(card ? {
      description: text(node.querySelector('.text-muted')).slice(0, 160),
      categories: [...card.classList].filter(name => !/^(col-|mb-|model-card$|all$)/.test(name))
    } : {}) };
  }
  function links(container, selector, social = false) {
    return [...container.querySelectorAll(selector)].map(node => link(node, social)).filter(Boolean);
  }
  const menu = nav.querySelector('ul.navbar-nav.mx-auto');
  if (!menu) throw new Error('Official menu missing');
  const groups = [...menu.children].filter(node => node.matches('li.nav-item')).map(node => {
    const top = [...node.children].find(child => child.matches('a,button'));
    return {
      label: text(top), href: safeUrl(top?.getAttribute('href'), sourceUrl),
      links: links(node, '.mega-menu a, .mega-menu button'),
      filters: [...node.querySelectorAll('.mega-menu-filter-option')].map(item => ({ label: text(item), value: item.getAttribute('data-filter') }))
    };
  });
  const footerGroups = [...footer.querySelectorAll('.col')].filter(col => col.querySelector('h2')).map(col => ({
    label: text(col.querySelector('h2')), links: links(col, 'a,button')
  }));
  const copyright = text(basic.querySelector('.copyright')) || [...basic.querySelectorAll('li')].map(text).find(value => value.includes('©'));
  const result = { groups, actions: links(nav, '#moreInfo a'), footerGroups,
    social: links(footer, '.social a', true), legal: links(basic, 'a'), copyright,
    appearance: extractAppearance(document, options) };
  if (groups.length < 3 || groups.length > 15 || footerGroups.length < 3 || footerGroups.length > 15 || !copyright) throw new Error('Incomplete official shell');
  for (const group of [...groups, ...footerGroups]) {
    if (!group.label || group.label.length > 80 || (!group.links.length && !group.href) || group.links.length > 100) throw new Error('Invalid official menu group');
  }
  return result;
}

function renderShell(data, part, options = {}) {
  if (data.appearance) return renderAppearance(data.appearance, part, options);
  const guideHref = options.guideHref || '/explore/ev-guides';
  const a = item => `<a href="${escapeHtml(item.href === OFFICIAL + '/explore/ev-guides' ? guideHref : item.href)}"${item.action ? ' title="Continue on the MG website"' : ''}${item.categories ? ` data-categories="${escapeHtml(item.categories.join(' '))}"` : ''}>${escapeHtml(item.label)}${item.description ? `<small>${escapeHtml(item.description)}</small>` : ''}</a>`;
  const guideLink = a({ label: 'EV Guides & Advice', href: guideHref });
  if (part === 'header') {
    const groups = data.groups.map(group => {
      if (!group.links.length) return a(group);
      const filters = group.filters?.length ? `<div class="filters" role="group" aria-label="Vehicle type">${group.filters.map((filter, index) => `<button type="button" data-filter="${escapeHtml(filter.value)}" aria-pressed="${index === 0}">${escapeHtml(filter.label)}</button>`).join('')}</div>` : '';
      return `<details class="menu-group"><summary>${escapeHtml(group.label)}</summary><div class="panel">${filters}<div class="menu-links">${group.links.map(a).join('')}${/explore/i.test(group.label) && !group.links.some(item => item.href.includes('/explore/ev-guides')) ? guideLink : ''}</div></div></details>`;
    }).join('');
    return `<header class="shell-header"><a class="brand" href="${OFFICIAL}/" aria-label="MG Australia home"><img src="${escapeHtml(options.logo)}" alt="MG" width="50" height="50"></a><details class="mobile-menu"><summary class="mobile-toggle">Menu <span aria-hidden="true">☰</span></summary><nav aria-label="MG main navigation">${groups}${data.actions.map(a).join('')}</nav></details></header>`;
  }
  return `<footer class="shell-footer"><div class="footer-top"><a href="${OFFICIAL}/"><img src="${escapeHtml(options.footerLogo)}" width="180" height="63" alt="Morris Garages"></a><div class="social">${data.social.map(a).join('')}</div></div><div class="footer-columns">${data.footerGroups.map(group => `<section><h2>${escapeHtml(group.label)}</h2>${group.links.map(a).join('')}${/explore/i.test(group.label) && !group.links.some(item => item.href.includes('/explore/ev-guides')) ? guideLink : ''}</section>`).join('')}</div><div class="legal"><span>${escapeHtml(data.copyright)}</span>${data.legal.map(a).join('')}</div></footer>`;
}

export { extractShell, renderShell, safeUrl };
