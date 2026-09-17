(() => {
  const normalise = (value) => value.toLowerCase().replace(/a?\$|,/g, '').replace(/\b(30|40|50|60)k\b/g, (_, number) => `${number}000`);

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

  const faqRoot = document.querySelector('[data-faq-root]');
  if (faqRoot) {
    const search = faqRoot.querySelector('[data-faq-search]');
    const searchClear = faqRoot.querySelector('[data-faq-search-clear]');
    const model = faqRoot.querySelector('[data-faq-model]');
    const categoryButtons = [...faqRoot.querySelectorAll('[data-faq-category]')];
    const items = [...faqRoot.querySelectorAll('[data-faq-item]')];
    const count = faqRoot.querySelector('[data-faq-count]');
    const empty = faqRoot.querySelector('[data-faq-empty]');
    const expandAll = faqRoot.querySelector('[data-faq-expand-all]');
    const resetButtons = [...faqRoot.querySelectorAll('[data-faq-reset]')];
    let category = 'All topics';

    const setOpen = (item, open) => {
      const trigger = item.querySelector('[data-faq-trigger]');
      const answer = item.querySelector('.answer');
      item.classList.toggle('is-open', open);
      trigger?.setAttribute('aria-expanded', String(open));
      if (answer) answer.hidden = !open;
    };

    const matchesQuery = (item, query) => {
      const haystack = normalise(item.dataset.search || '');
      return normalise(query).split(/\s+/).filter(Boolean).every((needle) => /^\d+$/.test(needle) ? haystack.split(/\D+/).includes(needle) : haystack.includes(needle));
    };

    const update = () => {
      const query = search?.value || '';
      const selectedModel = model?.value || 'all';
      const visible = items.filter((item) => {
        const matchesCategory = category === 'All topics' || item.dataset.category === category;
        const matchesModel = selectedModel === 'all' || (item.dataset.models || '').split(' ').includes(selectedModel);
        const matchesSearch = matchesQuery(item, query);
        item.hidden = !(matchesCategory && matchesModel && matchesSearch);
        return !item.hidden;
      });
      items.forEach((item) => item.classList.remove('is-last-visible'));
      visible.at(-1)?.classList.add('is-last-visible');
      const active = Boolean(query || category !== 'All topics' || selectedModel !== 'all');
      if (count) count.textContent = `${visible.length} ${visible.length === 1 ? 'question' : 'questions'}`;
      if (empty) empty.hidden = visible.length > 0;
      if (searchClear) searchClear.hidden = !query;
      resetButtons.forEach((button) => { button.hidden = !active && !button.closest('[data-faq-empty]'); });
      if (expandAll) {
        expandAll.disabled = visible.length === 0;
        expandAll.textContent = visible.length > 0 && visible.every((item) => item.classList.contains('is-open')) ? 'Collapse all' : 'Expand all';
      }
    };

    search?.addEventListener('input', update);
    searchClear?.addEventListener('click', () => { search.value = ''; update(); search.focus(); });
    model?.addEventListener('change', update);
    categoryButtons.forEach((button) => button.addEventListener('click', () => {
      category = button.dataset.faqCategory;
      categoryButtons.forEach((candidate) => {
        const selected = candidate === button;
        candidate.classList.toggle('selected', selected);
        candidate.setAttribute('aria-pressed', String(selected));
      });
      update();
    }));
    items.forEach((item) => item.querySelector('[data-faq-trigger]')?.addEventListener('click', () => {
      setOpen(item, !item.classList.contains('is-open'));
      update();
    }));
    expandAll?.addEventListener('click', () => {
      const visible = items.filter((item) => !item.hidden);
      const shouldOpen = !visible.every((item) => item.classList.contains('is-open'));
      items.forEach((item) => setOpen(item, shouldOpen && !item.hidden));
      update();
    });
    const resetFilters = () => {
      if (search) search.value = '';
      if (model) model.value = 'all';
      category = 'All topics';
      categoryButtons.forEach((candidate, index) => {
        candidate.classList.toggle('selected', index === 0);
        candidate.setAttribute('aria-pressed', String(index === 0));
      });
      update();
    };
    resetButtons.forEach((button) => button.addEventListener('click', resetFilters));
    const setCopyStatus = (value) => items.forEach((item) => {
      const button = item.querySelector('[data-copy-answer]');
      const status = item.querySelector('[data-copy-status]');
      if (button) button.textContent = value === item.id ? 'Link copied' : 'Copy answer link';
      if (status) {
        status.hidden = !value.startsWith('Link:');
        status.textContent = status.hidden ? '' : value;
      }
    });
    items.forEach((item) => item.querySelector('[data-copy-answer]')?.addEventListener('click', async () => {
      const url = new URL(location.pathname, location.origin);
      url.hash = item.id;
      try {
        await navigator.clipboard.writeText(url.href);
        setCopyStatus(item.id);
      } catch {
        setCopyStatus(`Link: ${url.href}`);
      }
    }));

    const openHash = () => {
      let id;
      try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
      if (!id) return;
      const item = document.getElementById(id);
      if (item?.matches('[data-faq-item]')) {
        resetFilters();
        setOpen(item, true);
        update();
        requestAnimationFrame(() => item.scrollIntoView({ block: 'start' }));
      }
    };
    window.addEventListener('hashchange', openHash);
    faqRoot.querySelectorAll('.related a').forEach((link) => link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const target = new URL(link.href);
      if (target.pathname !== location.pathname) return;
      event.preventDefault();
      history.pushState({}, '', target.hash);
      openHash();
    }));
    update();
    openHash();
  }

  const guideStateKey = 'mg-ev-guide-filter';
  const guideRestoreKey = 'mg-ev-guide-restore';
  document.querySelector('.guide-breadcrumb a')?.addEventListener('click', () => {
    try { sessionStorage.setItem(guideRestoreKey, '1'); } catch {}
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
      if (sessionStorage.getItem(guideRestoreKey) === '1') {
        const saved = JSON.parse(sessionStorage.getItem(guideStateKey) || 'null');
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
      sessionStorage.removeItem(guideRestoreKey);
    } catch {}
    guideRoot.querySelectorAll('.guide-card a').forEach((link) => link.addEventListener('click', () => {
      try { sessionStorage.setItem(guideStateKey, JSON.stringify({ category, query: search?.value || '' })); } catch {}
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
