(() => {
  'use strict';
  const configNode = document.getElementById('mg-navigation-config');
  const hosts = [...document.querySelectorAll('mg-site-shell')];
  if (!configNode || hosts.length !== 2 || !globalThis.MgShell) return;
  const config = JSON.parse(configNode.textContent), core = globalThis.MgShell;
  const isFile = location.protocol === 'file:';
  const mobile = () => matchMedia('(max-width:991px)').matches;
  function guideHref() {
    const pagesBase = document.documentElement.dataset.pagesBase;
    if (!isFile && pagesBase) return pagesBase;
    if (!isFile) return '/explore/ev-guides';
    const depth = Math.max(0, document.body.dataset.pagePath.split('/').filter(Boolean).length - 2);
    return new URL('index.html', new URL('../'.repeat(depth), new URL('.', location.href))).href;
  }
  function context(host) { return host.shadowRoot.querySelector('.official-context'); }
  const originalOverflow = document.body.style.overflow;
  function syncShellState() {
    const header = hosts.find(host => host.dataset.part === 'header');
    const footer = hosts.find(host => host.dataset.part === 'footer');
    if (!header?.shadowRoot || !footer?.shadowRoot) return;
    for (const state of ['mega-menu-open', 'side-menu-visible']) context(footer)?.classList.toggle(state, context(header)?.classList.contains(state));
    document.body.style.overflow = context(header)?.classList.contains('side-menu-visible') ? 'hidden' : originalOverflow;
  }
  function closeMenus(host) {
    const root = host.shadowRoot, ctx = context(host);
    root.querySelectorAll('.mega-menu.active,.mega-menu-bg.active,.nav-item.active').forEach(e => e.classList.remove('active'));
    root.querySelectorAll('.mega-link').forEach(e => e.setAttribute('aria-expanded', 'false'));
    ctx?.classList.remove('mega-menu-open');
    host.classList.remove('mega-menu-open');
    syncShellState();
  }
  function openMenu(host, link, open) {
    closeMenus(host);
    if (!open) return;
    const li = link.closest('.nav-item');
    li.classList.add('active');
    li.querySelectorAll('.mega-menu,.mega-menu-bg').forEach(e => e.classList.add('active'));
    link.setAttribute('aria-expanded', 'true');
    context(host).classList.add('mega-menu-open');
    host.classList.add('mega-menu-open');
    syncShellState();
  }
  function sideMenu(host, open) {
    const root = host.shadowRoot, ctx = context(host);
    if (!ctx) return;
    if (open && !root.querySelector('#side-menu')) {
      const side = document.createElement('div'); side.id = 'side-menu';
      side.innerHTML = '<button class="close" type="button" aria-label="Close navigation"><span aria-hidden="true">×</span></button><div class="contents"></div>';
      side.querySelector('.contents').innerHTML = root.querySelector('.navbar-collapse').innerHTML;
      const overlay = document.createElement('div'); overlay.className = 'side-menu-overlay';
      ctx.append(overlay, side);
    }
    closeMenus(host);
    ctx.classList.toggle('side-menu-visible', open);
    host.classList.toggle('side-menu-visible', open);
    syncShellState();
    for (const selector of ['#side-menu', '.side-menu-overlay']) { const el = root.querySelector(selector); if (el) el.style.display = open ? 'block' : 'none'; }
    const toggle = root.querySelector('.navbar-toggler');
    toggle?.setAttribute('aria-expanded', String(open));
    toggle?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    if (open) root.querySelector('#side-menu .close')?.focus();
  }
  const scrollState = () => hosts.forEach(host => context(host)?.classList.toggle('vy-scrolling', window.scrollY > 10));
  for (const host of hosts) {
    if (!host.shadowRoot) {
      const template = host.querySelector('template');
      if (!template) return;
      host.attachShadow({ mode: 'open' }).append(template.content.cloneNode(true)); template.remove();
    }
    const root = host.shadowRoot;
    host.setAttribute('data-interactive', '');
    if (isFile) root.querySelectorAll('a[href="/explore/ev-guides"]').forEach(a => a.href = guideHref());
    root.addEventListener('click', event => {
      const toggle = event.target.closest('.navbar-toggler');
      if (toggle) { event.preventDefault(); sideMenu(host, !context(host).classList.contains('side-menu-visible')); return; }
      if (event.target.closest('#side-menu .close,.side-menu-overlay')) { event.preventDefault(); sideMenu(host, false); root.querySelector('.navbar-toggler')?.focus(); return; }
      const menu = event.target.closest('a.mega-link');
      if (menu) { event.preventDefault(); openMenu(host, menu, !menu.closest('.nav-item').classList.contains('active')); return; }
      if (event.target.matches('.mega-menu-bg')) { closeMenus(host); return; }
      const filter = event.target.closest('.mega-menu-filter-option');
      if (filter) {
        const panel = filter.closest('.mega-menu');
        panel.querySelectorAll('.mega-menu-filter-option').forEach(e => { e.classList.toggle('active', e === filter); e.setAttribute('aria-pressed', String(e === filter)); });
        panel.querySelectorAll('.model-card').forEach(e => e.classList.toggle('hidden', filter.dataset.filter !== 'all' && !e.classList.contains(filter.dataset.filter)));
      }
    });
    root.addEventListener('keydown', event => {
      if (event.target.matches('.mega-menu-filter-option') && ['Enter', ' '].includes(event.key)) { event.preventDefault(); event.target.click(); }
      if (event.key === 'Escape') { const link = root.querySelector('.mega-link[aria-expanded=true]'); closeMenus(host); if (link) link.focus(); else sideMenu(host, false); }
    });
    document.addEventListener('click', event => { if (!event.composedPath().includes(host)) { closeMenus(host); sideMenu(host, false); } });
  }
  window.addEventListener('scroll', scrollState, { passive: true });
  window.addEventListener('resize', () => hosts.forEach(host => { if (!mobile()) sideMenu(host, false); }));
  scrollState();
  const status = value => hosts.forEach(host => host.dataset.status = value);
  if (isFile || !config.enabled) { status(isFile ? 'offline' : 'disabled'); return; }
  async function update() {
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), config.timeoutMs);
    try {
      const response = await fetch(config.sourceUrl, { signal: controller.signal, credentials: 'omit', cache: 'no-cache', referrerPolicy: 'no-referrer' });
      if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) throw new Error('source-unavailable');
      const reader = response.body.getReader(), decoder = new TextDecoder(); let html = '', size = 0;
      while (true) { const chunk = await reader.read(); if (chunk.done) break; size += chunk.value.byteLength;
        if (size > config.maxResponseBytes) { await reader.cancel(); throw new Error('source-too-large'); }
        html += decoder.decode(chunk.value, { stream: true }); }
      html += decoder.decode();
      const template = document.createElement('template'); template.innerHTML = html;
      const data = core.extractShell(template.content, config);
      // Native template parsing discards <body>; retain its inert class names only.
      const bodyClass = html.match(/<body\b[^>]*\bclass=["']([^"']*)["']/i)?.[1];
      if (bodyClass) data.appearance.bodyClass = bodyClass.replace(/[^\w -]/g, '');
      const rendered = hosts.map(host => core.renderShell(data, host.dataset.part, { guideHref: guideHref() }));
      // Remote styles stay inside the shadow root. A complete local CSS bundle
      // remains underneath as a fallback if a CDN link cannot be loaded.
      const styleNodes = hosts.map(host => data.appearance.styles.map(style => {
        const node = document.createElement(style.href ? 'link' : 'style');
        node.setAttribute('data-live-style', '');
        if (style.href) { node.rel = 'stylesheet'; node.href = style.href; } else node.textContent = style.css;
        return node;
      }));
      function commit() {
        if (hosts.some(host => host.shadowRoot.activeElement || context(host)?.classList.contains('mega-menu-open') || context(host)?.classList.contains('side-menu-visible'))) return;
        hosts.forEach((host, index) => {
          host.shadowRoot.querySelectorAll('[data-live-style]').forEach(n => n.remove());
          const adapter = host.shadowRoot.querySelector('[data-shell-adapter]');
          styleNodes[index].forEach(node => host.shadowRoot.insertBefore(node, adapter));
          host.shadowRoot.querySelector('[data-shell-content]').innerHTML = rendered[index];
          host.shadowRoot.removeEventListener('focusout', retry); host.shadowRoot.removeEventListener('click', retry);
        });
        scrollState(); status('live');
      }
      const retry = () => setTimeout(commit, 0);
      hosts.forEach(host => { host.shadowRoot.addEventListener('focusout', retry); host.shadowRoot.addEventListener('click', retry); });
      commit();
    } catch { status('fallback'); console.warn('[MG navigation] Official shell unavailable or changed; using packaged snapshot.'); }
    finally { clearTimeout(timer); }
  }
  update();
})();
