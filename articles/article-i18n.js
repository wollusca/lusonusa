/* ═══════════════════════════════════════════════════════════════
   LUSONUSA — Article & Knowledge Hub language manager
   - Translates [data-i18n] UI strings.
   - Shows the [data-lang-content] block for the active language (falls
     back to English) and keeps exactly one <h1>: the visible title.
   - Shows a short notice when an article has no version in the
     selected language.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  const STORAGE_KEY = 'lusonusa_lang';
  const LANGS = ['en', 'pt', 'id'];

  const strings = {
    en: {
      'nav.all_articles': 'All Articles',
      'nav.whatsapp_contact': 'Contact',
      'nav.skip': 'Skip to content',
      'hub.eyebrow': 'Portugal ↔ Indonesia Knowledge Hub',
      'hub.title': 'Practical Guides & Articles',
      'hub.subtitle': 'Step-by-step administrative guides on visas, company setup, Portuguese paperwork and certified translations for Portugal and Indonesia.',
      'hub.tab.visa': '🇮🇩 Visas & Residence',
      'hub.tab.bureaucracy': '🇵🇹 Portugal Paperwork',
      'hub.tab.trade': '🚢 Business & PT PMA',
      'hub.tab.notary': '📄 Certified Translation',
      'hub.pinned': 'Pinned Guides',
      'hub.all_pub': 'All Published Guides',
      'hub.empty': 'No guides in this topic for the selected language yet.',
      'hub.read': 'Read guide',
      'toc.title': 'Contents',
      'footer.hours': 'Mon–Fri, 10:00–16:00 Lisbon time (16:00–22:00 WIB in summer, 17:00–23:00 WIB in winter)',
      'footer.privacy': 'Privacy & Cookies',
      'footer.terms': 'Terms & Disclaimer',
      'footer.disclaimer': 'Administrative support, guidance and document coordination. Not legal advice.',
      'dialog.title': 'Published in English',
      'dialog.body': 'This guide is currently available in English only.',
      'dialog.ok': 'OK, read in English'
    },
    pt: {
      'nav.all_articles': 'Todos os Artigos',
      'nav.whatsapp_contact': 'Contacto',
      'nav.skip': 'Saltar para o conteúdo',
      'hub.eyebrow': 'Centro de Conhecimento Portugal ↔ Indonésia',
      'hub.title': 'Guias Práticos e Artigos',
      'hub.subtitle': 'Guias administrativos passo a passo sobre vistos, constituição de empresas, burocracia portuguesa e traduções certificadas.',
      'hub.tab.visa': '🇮🇩 Vistos e Residência',
      'hub.tab.bureaucracy': '🇵🇹 Burocracia em Portugal',
      'hub.tab.trade': '🚢 Negócios e PT PMA',
      'hub.tab.notary': '📄 Tradução Certificada',
      'hub.pinned': 'Guias em Destaque',
      'hub.all_pub': 'Todos os Guias Publicados',
      'hub.empty': 'Ainda não há guias deste tema no idioma selecionado.',
      'hub.read': 'Ler guia',
      'toc.title': 'Índice',
      'footer.hours': 'Seg–Sex, 10:00–16:00 hora de Lisboa (16:00–22:00 WIB no verão, 17:00–23:00 WIB no inverno)',
      'footer.privacy': 'Privacidade e Cookies',
      'footer.terms': 'Termos e Aviso Legal',
      'footer.disclaimer': 'Apoio administrativo, orientação e coordenação documental. Não constitui aconselhamento jurídico.',
      'dialog.title': 'Publicado em Inglês',
      'dialog.body': 'Este guia está disponível apenas em inglês por agora. Estamos a preparar a versão em português.',
      'dialog.ok': 'Entendido, ler em inglês'
    },
    id: {
      'nav.all_articles': 'Semua Artikel',
      'nav.whatsapp_contact': 'Kontak',
      'nav.skip': 'Langsung ke konten',
      'hub.eyebrow': 'Pusat Pengetahuan Portugal ↔ Indonesia',
      'hub.title': 'Panduan Praktis & Artikel',
      'hub.subtitle': 'Panduan administratif langkah demi langkah tentang visa, pendirian perusahaan, birokrasi Portugal, dan terjemahan tersertifikasi.',
      'hub.tab.visa': '🇮🇩 Visa & Izin Tinggal',
      'hub.tab.bureaucracy': '🇵🇹 Birokrasi Portugal',
      'hub.tab.trade': '🚢 Bisnis & PT PMA',
      'hub.tab.notary': '📄 Terjemahan Tersertifikasi',
      'hub.pinned': 'Panduan Utama',
      'hub.all_pub': 'Semua Panduan',
      'hub.empty': 'Belum ada panduan untuk topik ini dalam bahasa yang dipilih.',
      'hub.read': 'Baca panduan',
      'toc.title': 'Daftar Isi',
      'footer.hours': 'Senin–Jumat, 10:00–16:00 waktu Lisbon (16:00–22:00 WIB saat musim panas, 17:00–23:00 WIB saat musim dingin)',
      'footer.privacy': 'Privasi & Cookie',
      'footer.terms': 'Ketentuan & Penafian',
      'footer.disclaimer': 'Dukungan administratif, panduan, dan koordinasi dokumen. Bukan nasihat hukum.',
      'dialog.title': 'Diterbitkan dalam Bahasa Inggris',
      'dialog.body': 'Panduan ini saat ini hanya tersedia dalam bahasa Inggris. Versi Bahasa Indonesia sedang kami siapkan.',
      'dialog.ok': 'Mengerti, baca dalam bahasa Inggris'
    }
  };

  function readStoredLang() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return LANGS.includes(v) ? v : 'en';
    } catch (e) {
      return 'en';
    }
  }

  function storeLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* storage blocked */ }
  }

  // Swap an element to another tag, keeping attributes and children.
  function retag(el, tag) {
    if (el.tagName.toLowerCase() === tag) return el;
    const next = document.createElement(tag);
    for (const attr of el.attributes) next.setAttribute(attr.name, attr.value);
    while (el.firstChild) next.appendChild(el.firstChild);
    el.replaceWith(next);
    return next;
  }

  function showBlocks(lang) {
    const blocks = document.querySelectorAll('[data-lang-content]');
    if (!blocks.length) return true;

    const available = new Set([...blocks].map(b => b.dataset.langContent));
    const target = available.has(lang) ? lang : 'en';

    blocks.forEach(block => {
      const active = block.dataset.langContent === target;
      block.hidden = !active;
      block.querySelectorAll('.article-title').forEach(t => retag(t, active ? 'h1' : 'p'));
    });

    return available.has(lang);
  }

  function showNotice(lang) {
    const dict = strings[lang] || strings.en;
    let dialog = document.getElementById('langDialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'langDialog';
      dialog.className = 'lang-dialog';
      dialog.setAttribute('aria-labelledby', 'langDialogTitle');
      dialog.innerHTML = '<h2 id="langDialogTitle"></h2><p></p><form method="dialog"><button type="submit" autofocus></button></form>';
      dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
      document.body.appendChild(dialog);
    }
    dialog.setAttribute('lang', lang);
    dialog.querySelector('h2').textContent = dict['dialog.title'];
    dialog.querySelector('p').textContent = dict['dialog.body'];
    dialog.querySelector('button').textContent = dict['dialog.ok'];
    if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
  }

  function applyLanguage(lang, fromUser) {
    if (!LANGS.includes(lang)) lang = 'en';
    storeLang(lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.setAttribute('aria-pressed', btn.dataset.langBtn === lang ? 'true' : 'false');
    });

    const dict = strings[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const value = dict[el.dataset.i18n];
      if (value) el.textContent = value;
    });

    const hasVersion = showBlocks(lang);
    if (fromUser && lang !== 'en' && !hasVersion && document.body.classList.contains('is-article')) {
      showNotice(lang);
    }

    document.dispatchEvent(new CustomEvent('lusonusa:lang', { detail: { lang } }));
  }

  function init() {
    applyLanguage(readStoredLang(), false);
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-lang-btn]');
      if (btn) applyLanguage(btn.dataset.langBtn, true);
    });
  }

  window.LUSONUSA_I18N = { strings, current: readStoredLang };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
