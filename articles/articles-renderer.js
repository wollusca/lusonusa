/* ═══════════════════════════════════════════════════════════════
   LUSONUSA — Automated Foolproof Article Card Renderer & Router
   ═══════════════════════════════════════════════════════════════ */

(function () {
  // 1. Return absolute article URL so links never fail or drop /articles/
  function getArticleUrl(fileName) {
    if (fileName.startsWith('/articles/')) return fileName;
    return '/articles/' + fileName;
  }

  function getAvatarUrl(avatarPath) {
    const path = window.location.pathname;
    if (path.includes('/articles/') || path.endsWith('/articles')) {
      return avatarPath;
    }
    return avatarPath.replace('../', '');
  }

  let activeCategory = 'all';

  function renderArticles() {
    const articles = window.LUSONUSA_ARTICLES || [];
    const currentLang = localStorage.getItem('lusonusa_lang') || 'en';

    // Target elements
    const pinnedGrid = document.getElementById('articlesPinnedGrid') || document.getElementById('insights-pinned-list');
    const articlesGrid = document.getElementById('articlesGrid');

    // 1. FILTER BY LANGUAGE
    const langFiltered = articles.filter(art => {
      if (currentLang === 'en') return true;
      return art.langs.includes(currentLang);
    });

    // 2. FILTER BY CATEGORY
    const categoryFiltered = langFiltered.filter(art => {
      if (activeCategory === 'all') return true;
      return art.category === activeCategory;
    });

    // Update count badge on All Topics category button
    const allTabBtn = document.querySelector('[data-category="all"]');
    if (allTabBtn) {
      const counts = {
        en: `All Topics (${langFiltered.length})`,
        pt: `Todos os Tópicos (${langFiltered.length})`,
        id: `Semua Topik (${langFiltered.length})`
      };
      allTabBtn.textContent = counts[currentLang] || counts.en;
    }

    // RENDER HUB PAGE PINNED GRID
    if (pinnedGrid && document.getElementById('articlesPinnedGrid')) {
      const pinnedArticles = categoryFiltered.slice(0, 2);
      if (pinnedArticles.length === 0) {
        pinnedGrid.innerHTML = `<div style="grid-column: 1/-1; padding: 32px; text-align: center; color: #94a3b8; font-size: 0.9rem;">No articles available in this topic for the selected language.</div>`;
      } else {
        pinnedGrid.innerHTML = pinnedArticles.map(art => {
          const url = getArticleUrl(art.file);
          const langPill = art.langs.map(l => l.toUpperCase()).join(' • ');
          const title = art.title[currentLang] || art.title.en;
          const desc = art.desc[currentLang] || art.desc.en;

          return `
            <a href="${url}" class="article-card-featured" data-category="${art.category}" data-langs="${art.langs.join(' ')}">
              <div>
                <div class="card-meta">
                  <span class="card-tag">${art.categoryName}</span>
                  <span style="padding: 2px 8px; background: ${art.badgeBg}; border-radius: 10px; font-weight: 700; color: ${art.badgeColor}; font-size: 0.72rem;">${langPill}</span>
                  <span>• ${art.readTime}</span>
                </div>
                <h2 class="card-title">${title}</h2>
                <p class="card-desc">${desc}</p>
              </div>
              <div class="card-cta-row">
                <span>Read Full Guide</span>
                <i data-lucide="arrow-right"></i>
              </div>
            </a>
          `;
        }).join('');
      }
    }

    // RENDER HUB PAGE ALL ARTICLES GRID
    if (articlesGrid) {
      const gridArticles = categoryFiltered.slice(2);
      if (gridArticles.length === 0 && (!pinnedGrid || document.getElementById('articlesPinnedGrid'))) {
        articlesGrid.innerHTML = '';
      } else {
        const displayList = document.getElementById('articlesPinnedGrid') ? gridArticles : categoryFiltered;
        articlesGrid.innerHTML = displayList.map(art => {
          const url = getArticleUrl(art.file);
          const langPill = art.langs.map(l => l.toUpperCase()).join(' • ');
          const title = art.title[currentLang] || art.title.en;
          const desc = art.desc[currentLang] || art.desc.en;

          return `
            <a href="${url}" class="article-compact-card" data-category="${art.category}" data-langs="${art.langs.join(' ')}">
              <div class="card-meta">
                <span class="card-tag">${art.categoryName}</span>
                <span style="padding: 2px 8px; background: ${art.badgeBg}; border-radius: 10px; font-weight: 700; color: ${art.badgeColor}; font-size: 0.72rem;">${langPill}</span>
                <span>${art.readTime}</span>
              </div>
              <h3 style="font-size: 1.05rem; font-weight: 600; color: #fff; margin-bottom: 8px;">${title}</h3>
              <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 16px;">${desc}</p>
              <div style="font-size: 0.8rem; color: var(--accent-luso); font-weight: 600; display: flex; align-items: center; justify-content: space-between;">
                <span>Read Guide</span>
                <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
              </div>
            </a>
          `;
        }).join('');
      }
    }

    // RENDER HOMEPAGE SECTION 5
    const homeList = document.getElementById('insights-pinned-list');
    if (homeList && !document.getElementById('articlesPinnedGrid')) {
      homeList.innerHTML = langFiltered.slice(0, 4).map((art, idx) => {
        const url = getArticleUrl(art.file);
        const langPill = art.langs.map(l => l.toUpperCase()).join(' • ');
        const title = art.title[currentLang] || art.title.en;
        const desc = art.desc[currentLang] || art.desc.en;

        return `
          <article class="insight-compact-row ${idx === 0 ? 'featured' : ''}">
            <div class="insight-row-left">
              <span class="insight-tag-mini"><i data-lucide="file-text"></i> ${art.categoryName} <span style="margin-left: 6px; padding: 1px 6px; background: ${art.badgeBg}; border-radius: 8px; font-weight: 700; color: ${art.badgeColor}; font-size: 0.7rem;">${langPill}</span></span>
              <h3 class="insight-row-title">
                <a href="${url}">${title}</a>
              </h3>
              <p class="insight-row-desc">${desc}</p>
            </div>
            <div class="insight-row-right">
              <span class="insight-row-meta">${art.date} • ${art.readTime}</span>
              <a href="${url}" class="insight-row-btn">Read <i data-lucide="arrow-right"></i></a>
            </div>
          </article>
        `;
      }).join('');
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Handle Category Tab Click / Toggle
  document.addEventListener('click', e => {
    const btn = e.target.closest('.category-btn');
    if (btn && btn.dataset.category) {
      const selectedCat = btn.dataset.category;

      if (btn.classList.contains('active') && selectedCat !== 'all') {
        // Toggle off back to all
        activeCategory = 'all';
      } else {
        activeCategory = selectedCat;
      }

      document.querySelectorAll('.category-btn').forEach(b => {
        if (b.dataset.category === activeCategory) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });

      renderArticles();
    }

    // Re-render when language selector is clicked
    const langBtn = e.target.closest('.nav-lang-btn');
    if (langBtn) {
      setTimeout(renderArticles, 50);
    }
  });

  // Expose render function
  window.renderLusonusaArticles = renderArticles;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderArticles);
  } else {
    renderArticles();
  }
})();
