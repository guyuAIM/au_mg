(() => {
  if (location.protocol !== 'file:') return;
  const page = document.body.dataset.pagePath;
  if (!page) return;
  const root = new URL('../'.repeat(page.split('/').filter(Boolean).length), new URL('.', location.href));
  const state = new URL(location.href).searchParams;
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href.startsWith('/explore/ev-guides') && !href.startsWith('#')) return;
    const url = new URL(href, `https://mgmotor.com.au${page}`);
    if (url.pathname !== '/explore/ev-guides' && !url.pathname.startsWith('/explore/ev-guides/')) return;
    const local = new URL(url.pathname.slice(1).replace(/\/$/, '') + '/index.html', root);
    local.hash = url.hash;
    local.search = url.search;
    if (link.closest('.guide-breadcrumb, .guide-related')) {
      for (const key of ['category', 'q']) if (state.has(key)) local.searchParams.set(key, state.get(key));
    }
    link.href = local.href;
  });
})();
