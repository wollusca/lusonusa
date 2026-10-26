/* ═══════════════════════════════════════════════════════════════
   LUSONUSA — Knowledge hub card renderer
   The hub ships crawlable English cards in its HTML; this script
   re-renders them for the selected language and category filter.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  const ICONS = '/articles/icons.svg';
  let activeCategory = 'all';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function currentLang() {
    const lang = document.documentElement.lang;
    return ['en', 'pt', 'id'].includes(lang) ? lang : 'en';
  }

  function cardHtml(art, lang, headingTag) {
    const t = (field) => esc(art[field][lang] || art[field].en);
    const strings = (window.LUSONUSA_I18N && window.LUSONUSA_I18N.strings[lang]) || {};
    const authors = window.LUSONUSA_AUTHORS || {};
    const author = authors[art.author];
    const credit = [author ? esc(author.name) : ''];
    const labels = {
      updated: { en: 'updated by', pt: 'atualizado por', id: 'diperbarui oleh' },
      reviewed: { en: 'reviewed by', pt: 'revisto por', id: 'ditinjau oleh' }
    };
    if (art.updatedBy && authors[art.updatedBy] && art.updatedBy !== art.author) {
      credit.push(`${labels.updated[lang]} ${esc(authors[art.updatedBy].name)}`);
    }
    if (art.reviewedBy && authors[art.reviewedBy]) {
      credit.push(`${labels.reviewed[lang]} ${esc(authors[art.reviewedBy].name)}`);
    }
    return `
      <article class="article-card" data-category="${art.category}" data-langs="${art.langs.join(' ')}">
        <div>
          <div class="card-meta">
            <span class="card-tag">${t('categoryName')}</span>
            <span class="card-langs${art.tone === 'nusa' ? ' nusa' : ''}">${art.langs.map(l => l.toUpperCase()).join(' • ')}</span>
            <span>${t('readTime')}</span>
          </div>
          <${headingTag} class="card-title"><a href="/articles/${art.file}">${t('title')}</a></${headingTag}>
          <p class="card-desc">${t('desc')}</p>
        </div>
        <div class="card-footer">
          <span>${credit.filter(Boolean).join(' · ')}</span>
          <span class="card-cta" aria-hidden="true">${esc(strings['hub.read'] || 'Read guide')} <svg class="icon"><use href="${ICONS}#arrow-right"></use></svg></span>
        </div>
      </article>`;
  }

  function render() {
    const pinnedGrid = document.getElementById('articlesPinnedGrid');
    const allGrid = document.getElementById('articlesGrid');
    if (!pinnedGrid || !allGrid) return;

    const lang = currentLang();
    const strings = (window.LUSONUSA_I18N && window.LUSONUSA_I18N.strings[lang]) || {};
    const articles = (window.LUSONUSA_ARTICLES || [])
      .filter(a => lang === 'en' || a.langs.includes(lang))
      .filter(a => activeCategory === 'all' || a.category === activeCategory);

    const pinned = articles.filter(a => a.pinned);
    const rest = articles.filter(a => !a.pinned);
    const empty = `<p class="hub-empty">${esc(strings['hub.empty'] || '')}</p>`;

    pinnedGrid.closest('section').hidden = pinned.length === 0;
    pinnedGrid.innerHTML = pinned.map(a => cardHtml(a, lang, 'h3')).join('');
    allGrid.innerHTML = rest.length ? rest.map(a => cardHtml(a, lang, 'h3')).join('') : (pinned.length ? '' : empty);
    allGrid.closest('section').hidden = rest.length === 0 && pinned.length > 0;

    const allTab = document.querySelector('.category-btn[data-category="all"]');
    if (allTab) {
      const total = (window.LUSONUSA_ARTICLES || []).filter(a => lang === 'en' || a.langs.includes(lang)).length;
      const label = { en: 'All Topics', pt: 'Todos os Temas', id: 'Semua Topik' }[lang];
      allTab.textContent = `${label} (${total})`;
    }
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.category-btn');
    if (!btn) return;
    const cat = btn.dataset.category;
    activeCategory = (cat === activeCategory && cat !== 'all') ? 'all' : cat;
    document.querySelectorAll('.category-btn').forEach(b => {
      b.setAttribute('aria-pressed', b.dataset.category === activeCategory ? 'true' : 'false');
    });
    render();
  });

  document.addEventListener('lusonusa:lang', render);
  window.renderLusonusaArticles = render;
})();
