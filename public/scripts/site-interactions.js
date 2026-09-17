(() => {
  const nav = document.querySelector('[data-main-nav]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const explore = document.querySelector('[data-explore-nav]');
  const exploreToggle = document.querySelector('[data-explore-toggle]');
  const exploreMenu = document.querySelector('[data-explore-menu]');

  menuToggle?.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menuToggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    nav?.classList.toggle('expanded', !expanded);
    const icon = menuToggle.querySelector('.icon');
    icon?.classList.toggle('menu', expanded);
    icon?.classList.toggle('close', !expanded);
    if (exploreMenu) {
      exploreMenu.hidden = true;
      explore?.classList.remove('is-open');
      exploreToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  exploreToggle?.addEventListener('click', () => {
    const expanded = exploreToggle.getAttribute('aria-expanded') === 'true';
    exploreToggle.setAttribute('aria-expanded', String(!expanded));
    explore?.classList.toggle('is-open', !expanded);
    if (exploreMenu) exploreMenu.hidden = expanded;
  });

  const isFile = location.protocol === 'file:';
  const fileState = new URL(location.href).searchParams;
  const guideStateKey = 'mg-ev-guide-filter';
  const guideRestoreKey = 'mg-ev-guide-restore';
  document.querySelector('.guide-breadcrumb a')?.addEventListener('click', () => {
    if (!isFile) try { sessionStorage.setItem(guideRestoreKey, '1'); } catch {}
  });
  const guideRoot = document.querySelector('[data-guide-root]');
  if (guideRoot) {
    const search = guideRoot.querySelector('[data-guide-search]');
    const clear = guideRoot.querySelector('[data-guide-search-clear]');
    const categoryButtons = [...guideRoot.querySelectorAll('[data-guide-category]')];
    const cards = [...guideRoot.querySelectorAll('[data-guide-card]')];
    const eyebrow = guideRoot.querySelector('[data-guide-eyebrow]');
    const heading = guideRoot.querySelector('[data-guide-heading]');
    const count = guideRoot.querySelector('[data-guide-count]');
    const empty = guideRoot.querySelector('[data-guide-empty]');
    const reset = guideRoot.querySelector('[data-guide-reset]');
    let category = 'All guides';
    try {
      if (isFile || sessionStorage.getItem(guideRestoreKey) === '1') {
        const saved = isFile ? { category: fileState.get('category') || 'All guides', query: fileState.get('q') || '' } : JSON.parse(sessionStorage.getItem(guideStateKey) || 'null');
        if (saved && categoryButtons.some((button) => button.dataset.guideCategory === saved.category)) {
          category = saved.category;
          if (search) search.value = saved.query || '';
          categoryButtons.forEach((button) => {
            const selected = button.dataset.guideCategory === category;
            button.classList.toggle('selected', selected);
            if (selected) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
          });
        }
      }
      if (!isFile) sessionStorage.removeItem(guideRestoreKey);
    } catch {}
    guideRoot.querySelectorAll('.guide-card a').forEach((link) => link.addEventListener('click', () => {
      if (!isFile) try { sessionStorage.setItem(guideStateKey, JSON.stringify({ category, query: search?.value || '' })); } catch {}
    }));

    const update = () => {
      const query = (search?.value || '').trim().toLowerCase();
      const visible = cards.filter((card) => {
        const show = (category === 'All guides' || card.dataset.category === category) && (!query || (card.dataset.search || '').toLowerCase().includes(query));
        card.hidden = !show;
        return show;
      });
      if (clear) clear.hidden = !query;
      if (eyebrow) eyebrow.textContent = category;
      if (heading) heading.textContent = category === 'All guides' ? 'Popular EV questions, answered.' : `${category}, explained.`;
      if (count) count.textContent = `${visible.length} ${visible.length === 1 ? 'guide' : 'guides'}`;
      if (empty) empty.hidden = visible.length > 0;
      if (isFile) guideRoot.querySelectorAll('.guide-card a').forEach(link => {
        const url = new URL(link.href);
        url.searchParams.set('category', category);
        url.searchParams.set('q', search?.value || '');
        link.href = url.href;
      });
    };

    search?.addEventListener('input', update);
    clear?.addEventListener('click', () => { search.value = ''; update(); search.focus(); });
    categoryButtons.forEach((button) => button.addEventListener('click', () => {
      category = button.dataset.guideCategory;
      categoryButtons.forEach((candidate) => {
        const selected = candidate === button;
        candidate.classList.toggle('selected', selected);
        if (selected) candidate.setAttribute('aria-current', 'page'); else candidate.removeAttribute('aria-current');
      });
      update();
    }));
    reset?.addEventListener('click', () => {
      if (search) search.value = '';
      category = 'All guides';
      categoryButtons.forEach((candidate, index) => {
        candidate.classList.toggle('selected', index === 0);
        if (index === 0) candidate.setAttribute('aria-current', 'page'); else candidate.removeAttribute('aria-current');
      });
      update();
    });
    update();
  }
})();
