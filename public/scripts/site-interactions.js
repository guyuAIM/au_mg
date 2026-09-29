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

  const isFile = location.protocol === 'file:';
  const fileState = new URL(location.href).searchParams;
  const faqRoot = document.querySelector('[data-faq-root]');
  if (faqRoot) {
    const search = faqRoot.querySelector('[data-faq-search]');
    const searchClear = faqRoot.querySelector('[data-faq-search-clear]');
    const modelButtons = [...faqRoot.querySelectorAll('[data-faq-model]')];
    const categoryButtons = [...faqRoot.querySelectorAll('[data-faq-category]')];
    const items = [...faqRoot.querySelectorAll('[data-faq-item]')];
    const budgetSection = faqRoot.querySelector('[data-faq-budget-section]');
    const budgetRow = faqRoot.querySelector('[data-faq-budget-row]');
    const modelRow = faqRoot.querySelector('[data-faq-model-row]');
    const budgetFilter = faqRoot.querySelector('[data-faq-budget-filter]');
    const budgetButtons = [...faqRoot.querySelectorAll('[data-budget]')];
    const modelOptions = modelButtons.filter((button) => button.dataset.faqModel !== 'all');
    const modelEmpty = faqRoot.querySelector('[data-model-empty]');
    const priceValid = Date.now() <= new Date(`${faqRoot.dataset.budgetExpiry}T23:59:59+10:00`).getTime();
    const count = faqRoot.querySelector('[data-faq-count]');
    const empty = faqRoot.querySelector('[data-faq-empty]');
    const expandAll = faqRoot.querySelector('[data-faq-expand-all]');
    const resetButtons = [...faqRoot.querySelectorAll('[data-faq-reset]')];
    let category = 'All topics';
    let budget = 'all';
    let selectedModel = 'all';

    if (budgetSection) {
      if (budgetFilter) budgetFilter.hidden = !priceValid;
      const currentNote = budgetSection.querySelector('[data-budget-current]');
      const expiredNote = budgetSection.querySelector('[data-budget-expired]');
      const priceFilterPaused = budgetSection.querySelector('[data-price-filter-paused]');
      if (currentNote) currentNote.hidden = !priceValid;
      if (expiredNote) expiredNote.hidden = priceValid;
      if (priceFilterPaused) priceFilterPaused.hidden = priceValid;
    }

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
      const query = search?.value.trim() || '';
      const essentialsOnly = category === 'EV essentials';
      if (budgetRow) budgetRow.hidden = essentialsOnly;
      if (modelRow) modelRow.hidden = essentialsOnly;
      const currentNote = budgetSection?.querySelector('[data-budget-current]');
      const expiredNote = budgetSection?.querySelector('[data-budget-expired]');
      if (currentNote) currentNote.hidden = essentialsOnly || !priceValid;
      if (expiredNote) expiredNote.hidden = essentialsOnly || priceValid;
      const allowedModels = budget === 'all' || !priceValid ? null : new Set(modelOptions.filter((option) => (option.dataset.bands || '').split(' ').includes(budget)).map((option) => option.dataset.faqModel));
      const visible = items.filter((item) => {
        const faqModels = (item.dataset.models || '').split(' ');
        const isGeneral = item.dataset.faqKind === 'general';
        const matchesCategory = category === 'All topics' || (essentialsOnly ? isGeneral : item.dataset.category === category);
        const matchesModel = isGeneral
          ? selectedModel === 'all' && budget === 'all'
          : selectedModel === 'all'
            ? !allowedModels || faqModels.some((id) => allowedModels.has(id))
            : faqModels.includes(selectedModel) && (!allowedModels || allowedModels.has(selectedModel));
        const matchesSearch = matchesQuery(item, query);
        item.hidden = !(matchesCategory && matchesModel && matchesSearch);
        return !item.hidden;
      });
      items.forEach((item) => item.classList.remove('is-last-visible'));
      visible.at(-1)?.classList.add('is-last-visible');
      const modelCount = visible.filter((item) => item.dataset.faqKind === 'model').length;
      if (modelEmpty) {
        modelEmpty.hidden = essentialsOnly || modelCount > 0 || Boolean(query);
        const selectedOption = modelButtons.find((button) => button.dataset.faqModel === selectedModel);
        const selectedName = selectedOption?.dataset.modelName || '';
        const modelHasAnswers = items.some((item) => item.dataset.faqKind === 'model' && (item.dataset.models || '').split(' ').includes(selectedModel));
        const copy = modelEmpty.querySelector('[data-model-empty-copy]');
        const link = modelEmpty.querySelector('[data-model-empty-link]');
        if (copy) {
          copy.textContent = selectedModel !== 'all' && !modelHasAnswers
            ? allowedModels && !allowedModels.has(selectedModel)
              ? selectedOption?.dataset.bands
                ? `${selectedName} is outside this price range. Model-specific answers are being updated.`
                : `Price filtering is not available for ${selectedName} yet. Model-specific answers are being updated.`
              : `Answers about ${selectedName} are being updated.`
            : selectedModel !== 'all' && allowedModels && !allowedModels.has(selectedModel)
              ? `${selectedName} is outside this price range. Choose another price range or model.`
              : budget !== 'all' && selectedModel === 'all'
                ? 'No model questions are available for this price range yet. Try another price range or model.'
                : 'No model questions match these filters. Try another topic or model.';
        }
        if (link) {
          link.hidden = modelEmpty.hidden || !selectedOption?.dataset.url;
          if (selectedOption?.dataset.url) {
            link.href = selectedOption.dataset.url;
            link.setAttribute('aria-label', `Explore ${selectedName} on MG Australia`);
          }
        }
      }
      const active = Boolean(query || category !== 'All topics' || selectedModel !== 'all' || budget !== 'all');
      if (count) count.textContent = `${visible.length} ${visible.length === 1 ? 'question' : 'questions'}`;
      if (empty) empty.hidden = visible.length > 0 || (modelEmpty && !modelEmpty.hidden);
      if (searchClear) searchClear.hidden = !query;
      resetButtons.forEach((button) => { button.hidden = !active && !button.closest('[data-faq-empty]'); });
      if (expandAll) {
        expandAll.disabled = visible.length === 0;
        expandAll.textContent = visible.length > 0 && visible.every((item) => item.classList.contains('is-open')) ? 'Collapse all' : 'Expand all';
      }
    };

    const clearFacetSelections = () => {
      selectedModel = 'all';
      modelButtons.forEach((candidate) => {
        const selected = candidate.dataset.faqModel === 'all';
        candidate.classList.toggle('selected', selected);
        candidate.setAttribute('aria-pressed', String(selected));
      });
      category = 'All topics';
      budget = 'all';
      budgetButtons.forEach((candidate, index) => {
        candidate.classList.toggle('selected', index === 0);
        candidate.setAttribute('aria-pressed', String(index === 0));
      });
      categoryButtons.forEach((candidate, index) => {
        candidate.classList.toggle('selected', index === 0);
        candidate.setAttribute('aria-pressed', String(index === 0));
      });
    };
    search?.addEventListener('input', update);
    searchClear?.addEventListener('click', () => { search.value = ''; update(); search.focus(); });
    modelButtons.forEach((button) => button.addEventListener('click', () => {
      selectedModel = button.dataset.faqModel;
      modelButtons.forEach((candidate) => {
        const selected = candidate === button;
        candidate.classList.toggle('selected', selected);
        candidate.setAttribute('aria-pressed', String(selected));
      });
      update();
    }));
    budgetButtons.forEach((button) => button.addEventListener('click', () => {
      if (!priceValid) return;
      budget = button.dataset.budget;
      budgetButtons.forEach((candidate) => {
        const selected = candidate === button;
        candidate.classList.toggle('selected', selected);
        candidate.setAttribute('aria-pressed', String(selected));
      });
      update();
    }));
    categoryButtons.forEach((button) => button.addEventListener('click', () => {
      category = button.dataset.faqCategory;
      if (category === 'EV essentials') {
        selectedModel = 'all';
        budget = 'all';
        modelButtons.forEach((candidate) => {
          const selected = candidate.dataset.faqModel === 'all';
          candidate.classList.toggle('selected', selected);
          candidate.setAttribute('aria-pressed', String(selected));
        });
        budgetButtons.forEach((candidate) => {
          const selected = candidate.dataset.budget === 'all';
          candidate.classList.toggle('selected', selected);
          candidate.setAttribute('aria-pressed', String(selected));
        });
      }
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
      clearFacetSelections();
      update();
    };
    resetButtons.forEach((button) => button.addEventListener('click', resetFilters));
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
    update();
    openHash();
  }

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
            button.setAttribute('aria-pressed', String(selected));
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
      if (heading) heading.textContent = category === 'All guides' ? 'Explore EV guides.' : `${category}, explained.`;
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
        candidate.setAttribute('aria-pressed', String(selected));
      });
      update();
    }));
    reset?.addEventListener('click', () => {
      if (search) search.value = '';
      category = 'All guides';
      categoryButtons.forEach((candidate, index) => {
        candidate.classList.toggle('selected', index === 0);
        candidate.setAttribute('aria-pressed', String(index === 0));
      });
      update();
    });
    update();
  }
})();
