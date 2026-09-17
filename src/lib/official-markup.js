// Preserve the official shell's markup/classes, but never its executable code.
const resourceHosts = new Set(['mgmotor.com.au', 'www.mgmotor.com.au', 'cdn.virtualyard.com.au', 'dealers.virtualyard.com.au', 'sitebuilder.virtualyard.com.au']);
const linkHosts = new Set([...resourceHosts, 'www.facebook.com', 'www.instagram.com', 'www.youtube.com', 'au.linkedin.com', 'www.linkedin.com', 'www.tiktok.com', 'virtualyard.com']);
const encode = value => String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function officialUrl(value, source, resource = false) {
  try {
    const u = new URL(value, source);
    return u.protocol === 'https:' && !u.username && !u.password && (resource ? resourceHosts : linkHosts).has(u.hostname) ? u.href : null;
  } catch { return null; }
}
function adaptOfficialCss(css, source) {
  // Local copy is scoped by Shadow DOM. Replace body selectors with its context
  // element so official body classes / :has / scroll states retain their meaning.
  return css.replace(/\bFavorit\b/g, 'MgOfficialFavorit').replace(/(^|[\s,}>+~])body(?=[\s.#[:{>+~])/gm, '$1.official-context')
    .replace(/:root\b/g, '.official-context')
    .replace(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/gi, (match, quote, value) => {
      if (/^data:(?:image|font|application\/font)/i.test(value)) return match;
      const url = officialUrl(value, source, true);
      return url ? `url("${url}")` : 'none';
    }).replace(/@import\s+[^;]+;/gi, '');
}
const tiktok = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true"><path d="M412.19 118.66a109 109 0 0 1-9.45-5.5 133 133 0 0 1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14 23.9 350 16 350.13 16h-82.44v318.78c0 4.28 0 8.51-.18 12.69 0 .52-.05 1-.08 1.56 0 .23 0 .47-.05.71v.18a70 70 0 0 1-35.22 55.56 68.8 68.8 0 0 1-34.11 9c-38.41 0-69.54-31.32-69.54-70s31.13-70 69.54-70a68.9 68.9 0 0 1 21.41 3.39l.1-83.94a153.14 153.14 0 0 0-118 34.52 161.8 161.8 0 0 0-35.3 43.53c-3.48 6-16.61 30.11-18.2 69.24-1 22.21 5.67 45.22 8.85 54.73v.2c2 5.6 9.75 24.71 22.38 40.82A167.5 167.5 0 0 0 115 470.66v-.2l.2.2c39.91 27.12 84.16 25.34 84.16 25.34 7.66-.31 33.32 0 62.46-13.81 32.32-15.31 50.72-38.12 50.72-38.12a158.5 158.5 0 0 0 27.64-45.93c7.46-19.61 9.95-43.13 9.95-52.53V176.49c1 .6 14.32 9.41 14.32 9.41s19.19 12.3 49.13 20.31c21.48 5.7 50.42 6.9 50.42 6.9v-81.84c-10.14 1.1-30.73-2.1-51.81-12.61"/></svg>';

function extractAppearance(document, options = {}) {
  const source = options.sourceUrl || 'https://mgmotor.com.au/about/faqs';
  const actionUrl = options.actionUrl || 'https://mgmotor.com.au/';
  function clean(original) {
    if (!original) return '';
    const node = original.cloneNode(true);
    const allowed = new Set(['NAV','DIV','UL','LI','A','SPAN','STRONG','SMALL','IMG','BUTTON','I','H2','P','BR','HR','FOOTER','CENTER','ION-ICON']);
    for (const el of [node, ...node.querySelectorAll('*')]) {
      if (!allowed.has(el.tagName)) { el.remove(); continue; }
      const action = /\b(?:testDriveBooking|updatesNow|enquireNow|subscribeNewsletter)\s*\(/.test((el.getAttribute('onclick') || '') + (el.getAttribute('href') || ''));
      for (const attr of [...el.attributes]) {
        if (!/^(class|id|style|href|src|alt|title|width|height|type|name|role|tabindex|aria-[\w-]+|data-(menu|filter))$/.test(attr.name)) el.removeAttribute(attr.name);
      }
      if (el.hasAttribute('style')) el.setAttribute('style', adaptOfficialCss(el.getAttribute('style'), source).replace(/(?:expression\s*\(|javascript:|behavior\s*:)[^;]*/gi, ''));
      if (el.tagName === 'IMG') {
        const url = officialUrl(el.getAttribute('src'), source, true);
        if (!url) { el.remove(); continue; }
        el.setAttribute('src', url);
        if (!el.hasAttribute('alt')) el.setAttribute('alt', '');
      }
      if (el.tagName === 'A' || (el.tagName === 'BUTTON' && action)) {
        let href = action ? actionUrl : officialUrl(el.getAttribute('href'), source);
        if (el.matches('.mega-link')) href = '#';
        if (!href) { el.remove(); continue; }
        if (el.tagName === 'BUTTON') {
          const replacement = el.ownerDocument.createElement('a');
          for (const attr of [...el.attributes]) replacement.setAttribute(attr.name, attr.value);
          replacement.innerHTML = el.innerHTML;
          replacement.setAttribute('href', href);
          replacement.setAttribute('data-official-action', '');
          replacement.removeAttribute('type');
          el.replaceWith(replacement);
        } else {
          el.setAttribute('href', href);
          if (action) el.setAttribute('data-official-action', '');
          if (!el.textContent.trim() && !el.querySelector('img')) el.setAttribute('aria-label', new URL(href, source).hostname.replace(/^www\./, ''));
        }
      }
      if (el.matches('.mega-link')) { el.setAttribute('aria-expanded', 'false'); el.setAttribute('aria-haspopup', 'true'); }
      if (el.matches('.mega-menu-filter-option')) { el.setAttribute('role', 'button'); el.setAttribute('tabindex', '0'); el.setAttribute('aria-pressed', String(el.classList.contains('active'))); }
      if (el.matches('.navbar-toggler')) { el.setAttribute('aria-label', 'Open navigation'); el.setAttribute('aria-expanded', 'false'); }
    }
    if (node.matches('nav')) {
      const explore = [...node.querySelectorAll('li.nav-item')].find(item => /^explore$/i.test(item.querySelector('.mega-link')?.textContent.trim() || ''));
      const row = explore?.querySelector('.mega-menu .container > div');
      if (row && !row.querySelector('a[href="https://mgmotor.com.au/explore/ev-guides"]')) {
        const a = node.ownerDocument.createElement('a'); a.className = 'btn btn-hollow btn-hollow-actions'; a.setAttribute('href', 'https://mgmotor.com.au/explore/ev-guides'); a.innerHTML = 'EV Guides &amp; Advice <i class="icon ion-ios-arrow-right ml-5"></i>'; row.append(a);
      }
    }
    const exploreFooter = [...node.querySelectorAll('.col')].find(col => /^explore$/i.test(col.querySelector('h2')?.textContent.trim() || ''));
    const list = exploreFooter?.querySelector('ul');
    if (list && !list.querySelector('a[href="https://mgmotor.com.au/explore/ev-guides"]')) {
      const li = node.ownerDocument.createElement('li'); li.className = 'list-group-item'; li.innerHTML = '<a href="https://mgmotor.com.au/explore/ev-guides">EV Guides &amp; Advice</a>'; list.append(li);
    }
    return node.outerHTML.replace(/<!--[\s\S]*?-->/g, '').replace(/<ion-icon\b[^>]*name="logo-tiktok"[^>]*>[\s\S]*?<\/ion-icon>/g, `<span class="official-tiktok">${tiktok}</span>`);
  }
  const nav = document.querySelector('nav.navbar');
  const footer = document.querySelector('footer.footer');
  const basic = document.querySelector('footer.footer-basic');
  const styles = [...document.querySelectorAll('link[rel="stylesheet"],style')].map(el => {
    if (el.tagName === 'STYLE') return { css: adaptOfficialCss(el.textContent, source) };
    const href = officialUrl(el.getAttribute('href'), source, true);
    // Exclude dealer overlays/chat/forms. Only the observed official theme CSS.
    return href && /\/theme3\//.test(href) ? { href } : null;
  }).filter(Boolean);
  return { header: clean(nav), footer: clean(footer?.parentElement?.classList.contains('footer-buttons') ? footer.parentElement : footer) + clean(basic),
    cta: clean(document.querySelector('.hover-cta-container')), styles,
    bodyClass: (document.querySelector('body')?.getAttribute('class') || '').replace(/[^\w -]/g, '') };
}

function renderAppearance(appearance, part, options = {}) {
  const map = options.assetMap || {};
  // This delivery intentionally excludes the official floating enquiry bar,
  // both from the packaged snapshot and subsequent live synchronizations.
  let markup = part === 'header' ? appearance.header : appearance.footer;
  if (options.localAssets) markup = markup.replace(/src="([^"]+)"/g, (all, url) => map[url.replaceAll('&amp;', '&')] ? `src="${encode(map[url.replaceAll('&amp;', '&')])}"` : all);
  markup = markup.replace(/href="https:\/\/mgmotor\.com\.au\/explore\/ev-guides"/g, `href="${encode(options.guideHref || '/explore/ev-guides')}"`);
  return `<div class="official-context ${encode(appearance.bodyClass)}"><span class="hero-banner-img" data-shell-sentinel hidden></span>${markup}</div>`;
}

export { extractAppearance, renderAppearance, adaptOfficialCss, officialUrl };
