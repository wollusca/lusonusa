/* ═══════════════════════════════════════════════════════════════
   LUSONUSA — Article & Knowledge Hub i18n Language Manager
   ═══════════════════════════════════════════════════════════════ */

(function () {
  const articleTranslations = {
    en: {
      'nav.all_articles': 'All Articles',
      'nav.whatsapp_contact': 'Contact',
      'nav.main_site': 'Main Site',
      'hub.eyebrow': 'Bilateral Resource & Knowledge Hub',
      'hub.title': 'Operational Guides & Articles',
      'hub.subtitle': 'In-depth legal roadmaps, immigration guides, and bilateral trade compliance insights for Portugal and Indonesia.',
      'hub.tab.all': 'All Topics (4)',
      'hub.tab.visa': '🇮🇩 Visas & Residence',
      'hub.tab.bureaucracy': '🇵🇹 Portugal Bureaucracy',
      'hub.tab.trade': '🚢 Trade & PMA Setup',
      'hub.tab.notary': '⚖️ Sworn Translation',
      'hub.pinned': 'Pinned Guides',
      'hub.all_pub': 'All Published Articles & Resources',
      'toc.title': 'Table of Contents',
      'article.read_time': '6 min read',
      'article.back': 'All Articles'
    },
    pt: {
      'nav.all_articles': 'Todos os Artigos',
      'nav.whatsapp_contact': 'Contacto',
      'nav.main_site': 'Página Principal',
      'hub.eyebrow': 'Centro de Recursos e Conhecimento Bilateral',
      'hub.title': 'Guias Operacionais e Artigos (Português)',
      'hub.subtitle': 'Manuais jurídicos detalhados, guias de imigração para a Indonésia e soluções para empresas portuguesas.',
      'hub.tab.all': 'Todos os Tópicos (2)',
      'hub.tab.visa': '🇮🇩 Vistos e Residência',
      'hub.tab.bureaucracy': '🇵🇹 Burocracia em Portugal',
      'hub.tab.trade': '🚢 Comércio e PT PMA',
      'hub.tab.notary': '⚖️ Tradução Juramentada',
      'hub.pinned': 'Guias em Destaque',
      'hub.all_pub': 'Todos os Artigos Disponíveis em Português',
      'toc.title': 'Índice de Conteúdos',
      'article.read_time': 'Leitura de 6 min',
      'article.back': 'Todos os Artigos'
    },
    id: {
      'nav.all_articles': 'Semua Artikel',
      'nav.whatsapp_contact': 'Kontak',
      'nav.main_site': 'Situs Utama',
      'hub.eyebrow': 'Pusat Pengetahuan & Sumber Daya Bilateral',
      'hub.title': 'Panduan Operasional & Artikel (Bahasa Indonesia)',
      'hub.subtitle': 'Panduan hukum mendalam, birokrasi Portugal, NIF/AIMA, dan penerjemah tersumpah untuk WNI.',
      'hub.tab.all': 'Semua Topik (2)',
      'hub.tab.visa': '🇮🇩 Visa & Izin Tinggal',
      'hub.tab.bureaucracy': '🇵🇹 Birokrasi Portugal',
      'hub.tab.trade': '🚢 Perdagangan & PT PMA',
      'hub.tab.notary': '⚖️ Penerjemah Tersumpah',
      'hub.pinned': 'Panduan Utama',
      'hub.all_pub': 'Semua Artikel Tersedia dalam Bahasa Indonesia',
      'toc.title': 'Daftar Isi',
      'article.read_time': 'Waktu baca 6 menit',
      'article.back': 'Semua Artikel'
    }
  };

  let currentLang = localStorage.getItem('lusonusa_lang') || 'en';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lusonusa_lang', lang);
    document.documentElement.lang = lang;

    // Update Language Buttons Active State
    const langBtns = document.querySelectorAll('.nav-lang-btn');
    langBtns.forEach(btn => {
      const bLang = btn.dataset.lang;
      if (bLang === lang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // Translate DOM elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    const dict = articleTranslations[lang] || articleTranslations.en;

    elements.forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // 1. FILTER ARTICLES ON HUB PAGE BASED ON SELECTED LANGUAGE
    const cards = document.querySelectorAll('[data-langs]');
    if (cards.length > 0) {
      let visibleCount = 0;
      cards.forEach(card => {
        const supportedLangs = card.dataset.langs ? card.dataset.langs.split(' ') : ['en'];
        // Show card if 'en' is selected (shows all) or if card supports the selected language
        if (lang === 'en' || supportedLangs.includes(lang)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Update count badge in All Topics tab
      const allTabBtn = document.querySelector('[data-category="all"]');
      if (allTabBtn) {
        const tabNames = {
          en: `All Topics (${visibleCount})`,
          pt: `Todos os Tópicos (${visibleCount})`,
          id: `Semua Topik (${visibleCount})`
        };
        allTabBtn.textContent = tabNames[lang] || tabNames.en;
      }
    }

    // 2. MULTI-LANGUAGE CONTENT TOGGLE ON INDIVIDUAL ARTICLE PAGE
    const langContents = document.querySelectorAll('[data-lang-content]');
    if (langContents.length > 0) {
      let foundMatch = false;
      langContents.forEach(el => {
        if (el.dataset.langContent === lang) {
          el.style.display = 'block';
          foundMatch = true;
        } else {
          el.style.display = 'none';
        }
      });

      if (!foundMatch && lang !== 'en') {
        const enContent = document.querySelector('[data-lang-content="en"]');
        if (enContent) enContent.style.display = 'block';
        showLanguageModal(lang);
      }
    } else if (lang !== 'en' && document.querySelector('.article-layout') && !document.querySelector('[data-lang-content]')) {
      // Pop-up modal notification if single-language article
      showLanguageModal(lang);
    }
  }

  function showLanguageModal(lang) {
    let backdrop = document.getElementById('langModalBackdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'langModalBackdrop';
      backdrop.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(6, 8, 14, 0.78);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      `;
      document.body.appendChild(backdrop);
    }

    const titles = {
      pt: 'Publicação em Inglês',
      id: 'Artikel dalam Bahasa Inggris'
    };

    const messages = {
      pt: 'Este artigo encontra-se publicado em Inglês (língua oficial de consultoria bilateral). Estamos a preparar a tradução em Português.',
      id: 'Artikel ini saat ini diterbitkan dalam Bahasa Inggris (bahasa resmi konsultasi bilateral). Tim kami sedang menyiapkan terjemahan Bahasa Indonesia.'
    };

    const btnTexts = {
      pt: 'Entendido • Ler em Inglês',
      id: 'Mengerti • Baca (English)'
    };

    const title = titles[lang] || titles.pt;
    const msg = messages[lang] || messages.pt;
    const btnText = btnTexts[lang] || btnTexts.pt;

    backdrop.innerHTML = `
      <div id="langModalCard" style="
        background: linear-gradient(145deg, rgba(20, 24, 35, 0.98), rgba(11, 13, 18, 0.99));
        border: 1px solid rgba(59, 130, 246, 0.35);
        border-radius: 20px;
        padding: 32px 28px;
        max-width: 440px;
        width: 100%;
        text-align: center;
        box-shadow: 0 30px 70px rgba(0, 0, 0, 0.85);
        transform: scale(0.92);
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      ">
        <div style="
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: #3b82f6;
        ">
          <i data-lucide="globe" style="width: 26px; height: 26px;"></i>
        </div>
        <h3 style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 700; color: #fff; margin-bottom: 10px;">${title}</h3>
        <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.55; margin-bottom: 24px;">${msg}</p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button id="closeLangModal" style="
            width: 100%;
            padding: 12px 20px;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            border: none;
            border-radius: 12px;
            color: #fff;
            font-weight: 600;
            font-size: 0.88rem;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
            transition: all 0.2s ease;
          ">${btnText}</button>
        </div>
      </div>
    `;

    if (typeof lucide !== 'undefined') lucide.createIcons();

    requestAnimationFrame(() => {
      backdrop.style.pointerEvents = 'auto';
      backdrop.style.opacity = '1';
      const card = document.getElementById('langModalCard');
      if (card) card.style.transform = 'scale(1)';
    });

    function dismissModal() {
      backdrop.style.opacity = '0';
      backdrop.style.pointerEvents = 'none';
      const card = document.getElementById('langModalCard');
      if (card) card.style.transform = 'scale(0.92)';
    }

    const closeBtn = document.getElementById('closeLangModal');
    if (closeBtn) closeBtn.onclick = dismissModal;
    backdrop.onclick = (e) => {
      if (e.target === backdrop) dismissModal();
    };
  }

  function init() {
    applyLanguage(currentLang);

    document.addEventListener('click', e => {
      const btn = e.target.closest('.nav-lang-btn');
      if (btn && btn.dataset.lang) {
        applyLanguage(btn.dataset.lang);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
