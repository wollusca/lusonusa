/* ═══════════════════════════════════════════════════════════════
   LUSONUSA — Application Logic (homepage)
   Loaded with `defer`, so the DOM is already parsed when this runs.
   ═══════════════════════════════════════════════════════════════ */
'use strict';

/* ── Contact configuration (single source of truth) ─────────── */
const WHATSAPP_NUMBER = '351930534440';
const CONTACT_EMAIL = 'contact@lusonusa.agency';

/* Shared with /articles/ so the language choice follows the visitor */
const LANG_STORAGE_KEY = 'lusonusa_lang';
const SUPPORTED_LANGS = ['en', 'pt', 'id'];

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
const mobileQuery = window.matchMedia('(max-width: 768px)');

let currentLang = 'en';
let currentAudience = 'nusa';
let currentScenario = null;

function prefersReducedMotion() {
  return reducedMotionQuery.matches;
}

function saveDataEnabled() {
  return !!(navigator.connection && navigator.connection.saveData);
}

function whatsappUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}` + (text ? `?text=${encodeURIComponent(text)}` : '');
}

function t(key) {
  const dict = translations[currentLang] || translations.en;
  if (dict[key] !== undefined) return dict[key];
  return translations.en[key] !== undefined ? translations.en[key] : '';
}

function readStoredLang() {
  try {
    return localStorage.getItem(LANG_STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

function storeLang(lang) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch (e) {
    /* Storage blocked (private mode, disabled cookies): language just isn't remembered */
  }
}


/* ═══════════════════════════════════════════════════════════════
   1. COMPACT STICKY HEADER
   ═══════════════════════════════════════════════════════════════ */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  let ticking = false;
  function update() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}


/* ═══════════════════════════════════════════════════════════════
   2. HERO — the two door CTAs preselect the matching resolver tab
   (the link itself scrolls to #resolver, so this also works without JS)
   ═══════════════════════════════════════════════════════════════ */
function initHeroCtas() {
  document.querySelectorAll('.hero-cta[data-audience]').forEach(cta => {
    cta.addEventListener('click', () => {
      activateResolverTab(cta.dataset.audience);
    });
  });
}


/* ═══════════════════════════════════════════════════════════════
   3. PROBLEM RESOLVER — scenario → 2 questions → prefilled message
   ═══════════════════════════════════════════════════════════════ */
const problemMatrix = {
  nusa: [
    {
      id: 'nif-niss-aima',
      icon: 'file-text',
      label: {
        en: 'Bureaucracy & AIMA (NIF, NISS, Bank)',
        pt: 'Burocracia & AIMA (NIF, NISS, Banco)',
        id: 'Birokrasi & AIMA (NIF, NISS, Bank)'
      },
      bullets: {
        en: [
          'Step-by-step accompaniment through the NIF & NISS applications, based on the official requirements.',
          'Bank account opening support & SIM card registration in Portugal.',
          'Document preparation guidance & in-person orientation for AIMA scheduling.'
        ],
        pt: [
          'Acompanhamento passo a passo nos pedidos de NIF e NISS, com base nos requisitos oficiais.',
          'Apoio na abertura de conta bancária e registo de cartão SIM em Portugal.',
          'Orientação na preparação documental e acompanhamento presencial para agendamento AIMA.'
        ],
        id: [
          'Pendampingan langkah demi langkah pengurusan NIF & NISS, berdasarkan persyaratan resmi.',
          'Asistensi pembukaan rekening bank Portugal & registrasi SIM Card.',
          'Panduan persiapan dokumen & orientasi tatap muka untuk jadwal AIMA.'
        ]
      }
    },
    {
      id: 'business-docs',
      icon: 'file-check-2',
      label: {
        en: 'Business & Official Documents',
        pt: 'Documentos Empresariais & Oficiais',
        id: 'Dokumen Bisnis & Resmi'
      },
      bullets: {
        en: [
          'Practical guidance on the documents usually needed to set up a business in Portugal, with referral to a licensed lawyer for contracts.',
          'Coordination of translations certified before a Portuguese notary (Indonesian ↔ European Portuguese).',
          'Document legalisation & Apostille assistance at the relevant institutions and the Embassy.'
        ],
        pt: [
          'Orientação prática sobre os documentos habitualmente necessários para criar uma empresa em Portugal, com encaminhamento para advogado habilitado no caso de contratos.',
          'Coordenação de traduções certificadas perante notário português (Indonésio ↔ Português Europeu).',
          'Assistência na legalização de documentos e Apostila em instituições relevantes e na Embaixada.'
        ],
        id: [
          'Panduan praktis tentang dokumen yang biasanya diperlukan untuk mendirikan usaha di Portugal, dengan rujukan ke pengacara berlisensi untuk urusan kontrak.',
          'Koordinasi terjemahan yang disertifikasi notaris Portugal (Bahasa Indonesia ↔ Portugis Portugal).',
          'Asistensi legalisasi dokumen & Apostille di instansi terkait dan Kedutaan.'
        ]
      }
    },
    {
      id: 'student-housing',
      icon: 'house',
      label: {
        en: 'Students & Accommodation Search',
        pt: 'Estudantes & Procura de Alojamento',
        id: 'Mahasiswa & Pencarian Akomodasi'
      },
      bullets: {
        en: [
          'Search & verification of safe housing and rental contracts.',
          'Arrival orientation support (first-time life setup in Portugal).',
          'Cultural adjustment & campus bureaucracy consultation.'
        ],
        pt: [
          'Pesquisa e verificação de alojamento seguro e contratos de arrendamento.',
          'Apoio na orientação à chegada (primeira instalação em Portugal).',
          'Consulta de adaptação cultural e burocracia académica.'
        ],
        id: [
          'Pencarian & verifikasi tempat tinggal/kontrak rumah yang aman.',
          'Pendampingan orientasi kedatangan (set-up kehidupan pertama di Portugal).',
          'Konsultasi penyesuaian budaya & birokrasi kampus.'
        ]
      }
    },
    {
      id: 'local-guide-travel',
      icon: 'map-pin',
      label: {
        en: 'Local Guide & Travel Suggestions',
        pt: 'Guia Local & Sugestões de Viagem',
        id: 'Panduan Tour Lokal & Rekomendasi Wisata'
      },
      bullets: {
        en: [
          'Private bilingual local guide & orientation accompaniment for business or leisure trips.',
          'Customized itinerary planning & local travel recommendations across Portugal.',
          'Cultural orientation & local insider safety, dining, and transit tips.'
        ],
        pt: [
          'Guia local bilingue privado e acompanhamento de orientação para negócios ou turismo.',
          'Planeamento de itinerários personalizados e recomendações de viagem em Portugal.',
          'Orientação cultural e dicas locais de segurança, restauração e trânsito.'
        ],
        id: [
          'Panduan tur lokal bilingual pribadi & pendampingan orientasi bisnis atau wisata.',
          'Perencanaan itinerari khusus & rekomendasi tempat wisata di Portugal.',
          'Orientasi budaya lokal & tips kuliner, transportasi, serta keamanan.'
        ]
      }
    },
    {
      id: 'rental-cars-hotels',
      icon: 'car',
      label: {
        en: 'Rental Cars & Hotel Logistics',
        pt: 'Carro de Aluguer & Logística de Hotéis',
        id: 'Sewa Mobil & Logistik Hotel'
      },
      bullets: {
        en: [
          'Assistance with rental car booking & local transit navigation.',
          'Hotel, guesthouse, & boutique accommodation booking recommendations.',
          'Airport transfer coordination & ground transport logistics support.'
        ],
        pt: [
          'Assistência na reserva de veículo de aluguer e navegação de condução local.',
          'Recomendações de reserva de hotéis, alojamentos e estadias.',
          'Coordenação de transporte de aeroporto e logística de transporte no terreno.'
        ],
        id: [
          'Bantuan pemesanan kendaraan sewa/mobil & navigasi transportasi darat.',
          'Rekomendasi pemesanan hotel, penginapan, & akomodasi.',
          'Koordinasi penjemputan bandara & dukungan logistik transportasi darat.'
        ]
      }
    }
  ],
  luso: [
    {
      id: 'indonesia-product-sourcing',
      icon: 'boxes',
      label: {
        en: 'Product Sourcing from Indonesia',
        pt: 'Procura de Produtos e Fornecedores na Indonésia',
        id: 'Pencarian Produk & Supplier di Indonesia'
      },
      bullets: {
        en: [
          'Identification and vetting of reliable Indonesian manufacturers and suppliers.',
          'Sample inspection, quality-control checks, and direct factory communication.',
          'Connection with verified exporters across furniture, handicrafts, textiles, and commodities.'
        ],
        pt: [
          'Identificação e verificação de fabricantes e fornecedores de confiança na Indonésia.',
          'Inspeção de amostras, verificações de controlo de qualidade e comunicação direta com fábricas.',
          'Conexão com exportadores verificados de mobiliário, artesanato, têxteis e mercadorias.'
        ],
        id: [
          'Identifikasi & verifikasi produsen/supplier terpercaya di Indonesia.',
          'Inspeksi sampel, pengecekan kontrol kualitas, & komunikasi pabrik langsung.',
          'Koneksi dengan eksportir terverifikasi sektor mebel, kerajinan, tekstil, & komoditas.'
        ]
      }
    },
    {
      id: 'pt-pma-setup',
      icon: 'building-2',
      label: {
        en: 'Company Setup in Indonesia (PT PMA)',
        pt: 'Abertura de Empresa na Indonésia (PT PMA)',
        id: 'Pendirian PT PMA di Indonesia'
      },
      bullets: {
        en: [
          'Information on how the PT PMA structure for foreign investment works, based on official sources.',
          'Business guidance on market entry, with referral to licensed tax advisers in Indonesia.',
          'Direct connection with the Indonesia-Portugal Chamber of Commerce.'
        ],
        pt: [
          'Informação sobre o funcionamento da estrutura PT PMA para investimento estrangeiro, com base em fontes oficiais.',
          'Orientação empresarial para a entrada no mercado, com encaminhamento para consultores fiscais habilitados na Indonésia.',
          'Conexão direta com a Câmara de Comércio e Indústria Indonésia-Portugal.'
        ],
        id: [
          'Informasi cara kerja struktur PT PMA untuk investasi asing, berdasarkan sumber resmi.',
          'Panduan bisnis untuk masuk pasar, dengan rujukan ke konsultan pajak berlisensi di Indonesia.',
          'Koneksi langsung dengan Kamar Dagang Indonesia-Portugal.'
        ]
      }
    },
    {
      id: 'partner-scam-check',
      icon: 'shield-check',
      label: {
        en: 'Company & Partner Background Checks',
        pt: 'Verificação de Empresas & Parceiros',
        id: 'Pengecekan Latar Belakang Perusahaan & Mitra'
      },
      bullets: {
        en: [
          'Checks of a company or partner’s public registration details in Indonesia.',
          'Facilitation of online meetings with identity and credential verification.',
          'Practical pointers to help you spot common risks in international transactions.'
        ],
        pt: [
          'Verificação dos dados de registo públicos de empresas ou parceiros na Indonésia.',
          'Facilitação de reuniões online com verificação de identidade e credenciais.',
          'Indicações práticas para ajudar a identificar riscos comuns em transações internacionais.'
        ],
        id: [
          'Pengecekan data registrasi publik perusahaan atau mitra di Indonesia.',
          'Fasilitasi pertemuan online dengan verifikasi identitas dan kredensial.',
          'Petunjuk praktis untuk membantu mengenali risiko umum dalam transaksi internasional.'
        ]
      }
    },
    {
      id: 'export-import-trade',
      icon: 'ship',
      label: {
        en: 'Export-Import Guidance',
        pt: 'Orientação para Exportação e Importação',
        id: 'Panduan Ekspor-Impor'
      },
      bullets: {
        en: [
          'Information on customs rules, import duties, and trade permits (PT ↔ ID), based on official sources.',
          'Practical guidance on cross-border shipping logistics, with referral to licensed customs brokers.',
          'Administrative support for bilateral commercial trade operations.'
        ],
        pt: [
          'Informação sobre regras alfandegárias, direitos de importação e licenças comerciais (PT ↔ ID), com base em fontes oficiais.',
          'Orientação prática sobre logística de envio transfronteiriço, com encaminhamento para despachantes aduaneiros habilitados.',
          'Apoio administrativo para operações de comércio bilateral.'
        ],
        id: [
          'Informasi aturan bea cukai, bea impor, & izin perdagangan (PT ↔ ID) berdasarkan sumber resmi.',
          'Panduan praktis logistik pengiriman lintas batas, dengan rujukan ke PPJK (customs broker) berlisensi.',
          'Dukungan administratif untuk operasi perdagangan komersial bilateral.'
        ]
      }
    },
    {
      id: 'indonesia-visa-advisory',
      icon: 'file-badge',
      label: {
        en: 'Indonesia Visa & KITAS Guidance',
        pt: 'Orientação sobre Vistos e KITAS para a Indonésia',
        id: 'Panduan Visa & KITAS Indonesia'
      },
      bullets: {
        en: [
          'Information on business visit visas, work visas, and Investor KITAS.',
          'Family stay permits (ITAS/ITAP) and residence obligations for expats in Indonesia.',
          'Step-by-step guidance on official immigration sponsorship and extensions.'
        ],
        pt: [
          'Informação sobre vistos de visita de negócios, vistos de trabalho e KITAS de Investidor.',
          'Autorizações de residência familiar (ITAS/ITAP) e obrigações de residência na Indonésia.',
          'Orientação passo a passo sobre patrocínio de imigração e prorrogações oficiais.'
        ],
        id: [
          'Informasi visa kunjungan bisnis, visa kerja, & KITAS Investor.',
          'Izin tinggal keluarga (ITAS/ITAP) & kewajiban izin tinggal expat di Indonesia.',
          'Panduan penjaminan (sponsor) imigrasi resmi & prosedur perpanjangan.'
        ]
      }
    }
  ]
};

function initProblemResolver() {
  const tabs = Array.from(document.querySelectorAll('.resolver-tab'));
  const questions = document.getElementById('resolver-questions');

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateResolverTab(tab.dataset.audience));

    // WAI-ARIA tabs pattern: arrow keys move between tabs (automatic activation)
    tab.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(index + 1) % tabs.length];
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(index - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (!next) return;
      e.preventDefault();
      activateResolverTab(next.dataset.audience);
      next.focus();
    });
  });

  if (questions) {
    questions.addEventListener('change', updateResolverMessage);
    questions.addEventListener('submit', (e) => e.preventDefault());
  }

  renderPills(currentAudience);
}

function activateResolverTab(audience) {
  if (!problemMatrix[audience]) return;
  const changed = audience !== currentAudience;
  currentAudience = audience;

  const panel = document.getElementById('resolver-panel');
  document.querySelectorAll('.resolver-tab').forEach(tab => {
    const isActive = tab.dataset.audience === audience;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    tab.tabIndex = isActive ? 0 : -1;
    if (isActive && panel) panel.setAttribute('aria-labelledby', tab.id);
  });

  if (changed) {
    currentScenario = null;
    renderPills(audience);
    renderSolution();
  }
}

function renderPills(audience) {
  const container = document.getElementById('resolver-pills');
  if (!container) return;

  const animate = !prefersReducedMotion();
  container.innerHTML = '';

  problemMatrix[audience].forEach((scenario, index) => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'resolver-pill' + (audience === 'nusa' ? ' is-nusa' : '');
    pill.id = `pill-${scenario.id}`;
    const isActive = !!currentScenario && currentScenario.id === scenario.id;
    pill.classList.toggle('active', isActive);
    pill.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    pill.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#i-${scenario.icon}"/></svg><span></span>`;
    pill.querySelector('span').textContent = scenario.label[currentLang] || scenario.label.en;

    if (animate) {
      pill.style.opacity = '0';
      pill.style.translate = '0 10px';
      pill.style.transition = `opacity 0.4s ease ${index * 0.06}s, translate 0.4s ease ${index * 0.06}s`;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        pill.style.opacity = '1';
        pill.style.translate = '0 0';
      }));
    }

    pill.addEventListener('click', () => selectScenario(scenario));
    container.appendChild(pill);
  });
}

function selectScenario(scenario) {
  currentScenario = scenario;

  document.querySelectorAll('.resolver-pill').forEach(p => {
    const isActive = p.id === `pill-${scenario.id}`;
    p.classList.toggle('active', isActive);
    p.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  renderSolution();

  const status = document.getElementById('resolver-status');
  if (status) status.textContent = t('resolver.status').replace('{s}', scenarioLabel(scenario));

  // On narrow screens the result sits below the list: bring it into view
  if (mobileQuery.matches) {
    const solution = document.getElementById('resolver-solution');
    const title = document.getElementById('resolver-solution-title');
    if (solution) {
      solution.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }
    if (title) title.focus({ preventScroll: true });
  }
}

function scenarioLabel(scenario) {
  return scenario.label[currentLang] || scenario.label.en;
}

function renderSolution() {
  const emptyState = document.querySelector('.resolver-solution-empty');
  const content = document.getElementById('resolver-solution-content');
  const titleEl = document.getElementById('resolver-solution-title');
  const bulletsEl = document.getElementById('resolver-solution-bullets');
  if (!content) return;

  if (!currentScenario) {
    content.hidden = true;
    if (emptyState) emptyState.hidden = false;
    return;
  }

  if (emptyState) emptyState.hidden = true;
  const wasHidden = content.hidden;
  content.hidden = false;

  if (wasHidden && !prefersReducedMotion()) {
    content.style.opacity = '0';
    content.style.translate = '0 10px';
    content.style.transition = 'opacity 0.4s ease, translate 0.4s ease';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      content.style.opacity = '1';
      content.style.translate = '0 0';
    }));
  }

  if (titleEl) titleEl.textContent = scenarioLabel(currentScenario);
  const disclaimer = document.getElementById('resolver-disclaimer');
  if (disclaimer) disclaimer.textContent = t(`resolver.note.${currentAudience}`);
  if (bulletsEl) {
    bulletsEl.innerHTML = '';
    (currentScenario.bullets[currentLang] || currentScenario.bullets.en).forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      bulletsEl.appendChild(li);
    });
  }

  updateResolverMessage();
}

function composeResolverMessage() {
  const form = document.getElementById('resolver-questions');
  const where = form ? (form.querySelector('input[name="where"]:checked') || {}).value : null;
  const when = form ? (form.querySelector('input[name="when"]:checked') || {}).value : null;

  const lines = [
    t('msg.greeting'),
    t('msg.interest').replace('{s}', scenarioLabel(currentScenario))
  ];
  if (where) lines.push(t(`msg.where.${where}`));
  if (when) lines.push(t(`msg.when.${when}`));
  lines.push(t('msg.close'));
  lines.push(`(Ref: web-${currentAudience}-${currentScenario.id})`);
  return lines.join('\n');
}

function updateResolverMessage() {
  if (!currentScenario) return;
  const message = composeResolverMessage();
  const subject = t('msg.subject').replace('{s}', scenarioLabel(currentScenario));

  const waBtn = document.getElementById('resolver-wa-btn');
  const emailBtn = document.getElementById('resolver-email-btn');
  const preview = document.getElementById('resolver-preview');

  if (waBtn) waBtn.href = whatsappUrl(message);
  if (emailBtn) {
    emailBtn.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  }
  if (preview) preview.textContent = message;
}

/* Every generic WhatsApp link ([data-wa="generic"]) is built from the constant */
function updateGenericWhatsAppLinks() {
  const url = whatsappUrl(t('msg.generic'));
  document.querySelectorAll('a[data-wa="generic"]').forEach(a => {
    a.href = url;
  });
}


/* ═══════════════════════════════════════════════════════════════
   4. LANGUAGE SYSTEM (i18n)
   HTML defaults are the English strings; keep both in sync.
   ═══════════════════════════════════════════════════════════════ */
const translations = {
  en: {
    'meta.title': 'LUSONUSA | Portugal ↔ Indonesia business setup, visas & relocation support',
    'meta.description': 'LUSONUSA gives practical guidance and in-person accompaniment to Portuguese businesses entering Indonesia and Indonesians settling in Portugal: PT PMA setup, visas and KITAS, NIF/NISS/AIMA paperwork and notary-certified translations.',
    'skip': 'Skip to content',
    'aria.nav': 'Main navigation',
    'aria.footer': 'Footer',
    'aria.menu.close': 'Close menu',

    // Nav
    'nav.services': 'Services',
    'nav.process': 'Process',
    'nav.team': 'Team',
    'nav.insights': 'Guides',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'header.cta': 'Free consultation',

    // Hero
    'hero.title': 'Your trusted bridge between Portugal and Indonesia',
    'hero.lede': 'Practical guidance and in-person accompaniment for company setup, visas, residency paperwork and certified translations, from a bilingual team based in Portugal and Indonesia.',
    'hero.trust': 'Founded by a former member of the Economic Section of the Embassy of Indonesia in Lisbon (5 years)',
    'hero.video.credit': 'Video',
    'hero.luso.audience': 'For Portuguese businesses entering Indonesia',
    'hero.luso.sub': 'Connecting Portuguese business to the Indonesian market.',
    'hero.luso.cta': 'Explore business services',
    'hero.luso.pill1': 'Company Verification',
    'hero.luso.pill2': 'PT PMA Setup',
    'hero.luso.pill3': 'Export-Import Guidance',
    'hero.luso.pill4': 'Indonesia Visa & KITAS',
    'hero.luso.pill5': 'Product Sourcing',
    'hero.nusa.audience': 'For Indonesians moving to or living in Portugal',
    'hero.nusa.sub': 'Trusted guidance for Indonesians in Portugal.',
    'hero.nusa.cta': 'See services for Indonesians',
    'hero.nusa.pill1': 'AIMA Assistance',
    'hero.nusa.pill2': 'NIF & NISS',
    'hero.nusa.pill3': 'Bank Account Opening',
    'hero.nusa.pill4': 'Business & Official Docs',
    'hero.nusa.pill5': 'Notarized Translation',
    'hero.nusa.pill6': 'Local Guide & Travel',

    // Resolver
    'resolver.eyebrow': 'How Can We Help?',
    'resolver.title': 'What Is Your Immediate Challenge?',
    'resolver.subtitle': 'Pick your situation, answer two quick questions and send a ready-made message to our team.',
    'resolver.tabs.label': 'Select your audience',
    'resolver.tab.nusa': 'For Indonesians in/to Portugal',
    'resolver.tab.luso': 'For Portuguese Businesses & Citizens',
    'resolver.step1': '1. Choose your situation',
    'resolver.empty': 'Select a scenario to see how we can help.',
    'resolver.step2': '2. Two quick questions',
    'resolver.optional': 'Optional, but it helps us reply faster.',
    'resolver.q.where': 'Where are you now?',
    'resolver.q.where.pt': 'In Portugal',
    'resolver.q.where.id': 'In Indonesia',
    'resolver.q.where.other': 'Elsewhere',
    'resolver.q.when': 'When do you need this?',
    'resolver.q.when.urgent': 'Within 2 weeks',
    'resolver.q.when.soon': 'In 1–3 months',
    'resolver.q.when.exploring': 'Just exploring',
    'resolver.step3': '3. Send your message',
    'resolver.wa.btn': 'Send on WhatsApp',
    'resolver.email.btn': 'Prefer email? Send the same details',
    'resolver.preview': 'Your message will read:',
    'resolver.status': 'Showing help for: {s}',
    'resolver.note.nusa': 'Information and practical guidance based on official public sources, plus in-person accompaniment. Not legal advice; we refer you to licensed professionals when needed.',
    'resolver.note.luso': 'Business guidance only, not legal, tax, financial or customs-brokerage advice. We refer you to licensed professionals when needed.',

    // Prefilled messages
    'msg.generic': 'Hello LUSONUSA! I would like to book a free consultation.',
    'msg.greeting': 'Hello LUSONUSA!',
    'msg.interest': 'I need help with: {s}.',
    'msg.where.pt': 'I am currently in Portugal.',
    'msg.where.id': 'I am currently in Indonesia.',
    'msg.where.other': 'I am currently outside Portugal and Indonesia.',
    'msg.when.urgent': 'I need this within 2 weeks.',
    'msg.when.soon': 'I need this in the next 1–3 months.',
    'msg.when.exploring': 'I am exploring options for now.',
    'msg.close': 'Could you tell me the next steps?',
    'msg.subject': 'Enquiry: {s}',

    // Workflow
    'workflow.eyebrow': 'How We Work',
    'workflow.title': 'How We Support & Guide You',
    'workflow.subtitle': 'A friendly, step-by-step approach designed to give you clarity and peace of mind.',
    'workflow.s1.badge': '100% Free & Open',
    'workflow.s1.title': 'Tell Us Your Challenge',
    'workflow.s1.desc': 'Send a quick WhatsApp message detailing your goals. No fees, no obligations—just a friendly team ready to listen.',
    'workflow.s1.btn': 'Chat on WhatsApp',
    'workflow.s2.badge': '1–2 Days Research',
    'workflow.s2.title': 'We Prepare Your Options',
    'workflow.s2.desc': 'Before we talk, our team takes 1–2 days to review the official requirements and prepare concrete, actionable steps for your case.',
    'workflow.s3.badge': 'Complimentary 1-on-1',
    'workflow.s3.title': 'Initial Strategic Call',
    'workflow.s3.desc': 'A focused 1-on-1 consultation to explore your roadmap. Simple cases receive step-by-step guidance completely free.',
    'workflow.s4.badge': 'Clear Upfront Pricing',
    'workflow.s4.title': 'Hands-On Accompaniment',
    'workflow.s4.desc': 'Need hands-on help? We offer flexible assistance—from coordinating notary-certified translations to in-person accompaniment (AIMA, Finanças, banks)—with all fees agreed upfront.',

    // Pathways
    'pathways.eyebrow': 'Service Options & Pricing Philosophy',
    'pathways.title': 'Transparent Options Built Around Your Needs',
    'pathway.p1.name': '1. Free Community Guidance',
    'pathway.p1.desc': 'Basic questions & general guidance answered during the free call. Perfect if you can handle filings yourself.',
    'pathway.p1.price': '€0 • Free Consultation',
    'pathway.p2.name': '2. Document & Report Prep',
    'pathway.p2.desc': 'Notary-certified translations, NIF/NISS setups, business roadmaps, and custom documentation reports.',
    'pathway.p2.price': 'Fixed Transparent Fee',
    'pathway.p3.name': '3. In-Person Ground Accompaniment',
    'pathway.p3.desc': 'In-person attendance for AIMA appointments, Bank visits, PT PMA corporate setups, or bilingual local field accompaniment.',
    'pathway.p3.price': '€15 – €30 / hour or Fixed Package',
    'pathways.note.label': 'Purchasing Power Equity:',
    'pathways.note': 'We tailor our fees fairly—offering accessible rates for individual community members while providing dedicated business guidance for companies.',

    // Team
    'team.eyebrow': 'Our Team',
    'team.title': 'The Collaborators Behind the Bilateral Bridge',
    'team.subtitle': 'A multidisciplinary team of bilingual professionals embedded in both nations.',
    'team.c1.role': 'Founder',
    'team.c1.title': 'Business & Bilateral Relations Lead',
    'team.c1.cred1': 'Ex-Embassy of Indonesia, Lisbon (5 yrs)',
    'team.c1.cred2': '9+ years in Portugal',
    'team.c1.bio': '9+ years residing in Portugal with 5 years of service in the Economic Section of the Embassy of the Republic of Indonesia in Lisbon. Specialist in diplomatic protocol, cross-border business setup, and administrative navigation.',
    'team.c1.lang': 'English & Indonesian',
    'team.c2.role': 'Banking & Finance',
    'team.c2.title': 'Banking & Financial Advisory Specialist',
    'team.c2.cred1': 'MSc Economics, ISEG Lisbon',
    'team.c2.cred2': 'European banking sector',
    'team.c2.bio': '7+ years residing in Portugal with a Master of Science in Economics from ISEG Lisbon. Currently active in the European banking sector, bringing domain expertise in capital movements, cross-border financial flows, and compliance.',
    'team.c2.lang': 'English & Indonesian',
    'team.c3.role': 'Technology & AI',
    'team.c3.title': 'Digital Transformation & Innovation Specialist',
    'team.c3.cred1': 'M.Sc. Strategic Marketing',
    'team.c3.cred2': 'Enterprise tech & AI adoption',
    'team.c3.bio': 'M.Sc. in Strategic Marketing currently leading enterprise tech initiatives. Specializes in digital workflow adaptation, modern market expansion, and business AI adoption across cross-border operations.',
    'team.c3.lang': 'English & Indonesian',
    'team.c4.role': 'Translation Specialist',
    'team.c4.title': 'Legal & Notarized Translation Lead',
    'team.c4.cred1': 'Native PT-PT & Indonesian',
    'team.c4.cred2': 'Notary-certified translations',
    'team.c4.bio': 'Native bilingual specialist (European Portuguese / Indonesian) recognized by the Embassy of Indonesia in Lisbon. Prepares translations of civil, corporate and legal documents, certified before a Portuguese notary. Work is scheduled after a short feasibility check.',
    'team.c4.lang': 'Portuguese & Indonesian',

    // Insights
    'insights.eyebrow': 'Knowledge Resource',
    'insights.title': 'Guides & Bilateral Insights',
    'insights.subtitle': 'Practical guides on visas, company setup, residency paperwork and translations between Portugal and Indonesia.',
    'insights.all': 'All guides',
    'insights.a1.tag': 'Indonesia Visas',
    'insights.a1.title': 'Indonesian visas and KITAS for Portuguese entrepreneurs and investors (2026)',
    'insights.a1.desc': 'Business visits, investor stay permits and residence options for Portuguese company owners and directors.',
    'insights.a2.tag': 'PT PMA Setup',
    'insights.a2.title': 'Setting up a PT PMA in Indonesia: foreign direct investment step by step',
    'insights.a2.desc': 'Company structure, capital requirements and OSS licensing for European companies entering Indonesia.',
    'insights.a3.tag': 'Portugal Paperwork',
    'insights.a3.title': 'NIF, NISS and AIMA residence registration in Portugal: a guide for Indonesians',
    'insights.a3.desc': 'Tax number, social security and residence appointments for Indonesians moving to Portugal.',
    'insights.a4.tag': 'Translation & Notary',
    'insights.a4.title': 'Certified translation and notary legalisation of Indonesian and Portuguese documents',
    'insights.a4.desc': 'How translations are certified before a Portuguese notary, plus legalisation and apostille basics.',

    // Footer
    'footer.tagline': 'Bilateral Information, Guidance & Accompaniment',
    'footer.contact.title': 'Get in Touch',
    'footer.contact.sub': 'Direct Assistance & Consultations',
    'footer.wa.btn': 'Direct WhatsApp Consultation',
    'footer.email': 'Email:',
    'footer.hours': 'Service hours: Mon–Fri, 10:00–16:00 Lisbon time (16:00–22:00 WIB in summer, 17:00–23:00 WIB in winter)',
    'footer.consult': 'Consultations conducted in English & Indonesian.',
    'footer.legal': 'LUSONUSA is an information and guidance service, not a law firm, and does not give legal advice; we refer you to licensed professionals when needed.',
    'footer.entity': 'Operating as PT Wollusca Sukses Bersama (Purwokerto, Jawa Tengah, Indonesia)',
    'footer.privacy': 'Privacy & cookies',
    'footer.terms': 'Terms & disclaimer',
    'footer.copy': '© 2026 LUSONUSA · PT Wollusca Sukses Bersama. All rights reserved.',

    'sticky.wa': 'WhatsApp',
    'sticky.wa.aria': 'Chat with us on WhatsApp'
  },

  pt: {
    'meta.title': 'LUSONUSA | Portugal ↔ Indonésia: criação de empresas, vistos e apoio à mudança',
    'meta.description': 'A LUSONUSA dá orientação prática e acompanhamento presencial a empresas portuguesas que entram na Indonésia e a indonésios que se instalam em Portugal: PT PMA, vistos e KITAS, NIF/NISS/AIMA e traduções certificadas por notário.',
    'skip': 'Saltar para o conteúdo',
    'aria.nav': 'Navegação principal',
    'aria.footer': 'Rodapé',
    'aria.menu.close': 'Fechar menu',

    'nav.services': 'Serviços',
    'nav.process': 'Processo',
    'nav.team': 'Equipa',
    'nav.insights': 'Guias',
    'nav.contact': 'Contacto',
    'nav.menu': 'Menu',
    'header.cta': 'Consulta gratuita',

    'hero.title': 'A sua ponte de confiança entre Portugal e a Indonésia',
    'hero.lede': 'Orientação prática e acompanhamento presencial em criação de empresas, vistos, documentação de residência e traduções certificadas, por uma equipa bilingue em Portugal e na Indonésia.',
    'hero.trust': 'Fundada por um ex-membro da Secção Económica da Embaixada da Indonésia em Lisboa (5 anos)',
    'hero.video.credit': 'Vídeo',
    'hero.luso.audience': 'Para empresas portuguesas que entram na Indonésia',
    'hero.luso.sub': 'Conectando negócios portugueses ao mercado indonésio.',
    'hero.luso.cta': 'Ver serviços para empresas',
    'hero.luso.pill1': 'Verificação de Empresa',
    'hero.luso.pill2': 'Criação de PT PMA',
    'hero.luso.pill3': 'Exportação & Importação',
    'hero.luso.pill4': 'Vistos & KITAS Indonésia',
    'hero.luso.pill5': 'Procura de Produtos',
    'hero.nusa.audience': 'Para indonésios que se mudam ou vivem em Portugal',
    'hero.nusa.sub': 'Orientação de confiança para indonésios em Portugal.',
    'hero.nusa.cta': 'Ver serviços para indonésios',
    'hero.nusa.pill1': 'Apoio AIMA',
    'hero.nusa.pill2': 'NIF & NISS',
    'hero.nusa.pill3': 'Conta Bancária',
    'hero.nusa.pill4': 'Documentos Empresariais & Oficiais',
    'hero.nusa.pill5': 'Tradução Notariada',
    'hero.nusa.pill6': 'Guia Local & Viagem',

    'resolver.eyebrow': 'Como Podemos Ajudar?',
    'resolver.title': 'Qual é o Seu Desafio Imediato?',
    'resolver.subtitle': 'Escolha a sua situação, responda a duas perguntas rápidas e envie uma mensagem pronta à nossa equipa.',
    'resolver.tabs.label': 'Selecione o seu perfil',
    'resolver.tab.nusa': 'Para Indonésios em/para Portugal',
    'resolver.tab.luso': 'Para Empresas e Cidadãos Portugueses',
    'resolver.step1': '1. Escolha a sua situação',
    'resolver.empty': 'Selecione um cenário para ver como podemos ajudar.',
    'resolver.step2': '2. Duas perguntas rápidas',
    'resolver.optional': 'Opcional, mas ajuda-nos a responder mais depressa.',
    'resolver.q.where': 'Onde está neste momento?',
    'resolver.q.where.pt': 'Em Portugal',
    'resolver.q.where.id': 'Na Indonésia',
    'resolver.q.where.other': 'Noutro país',
    'resolver.q.when': 'Para quando precisa?',
    'resolver.q.when.urgent': 'Nas próximas 2 semanas',
    'resolver.q.when.soon': 'Dentro de 1–3 meses',
    'resolver.q.when.exploring': 'Estou só a explorar',
    'resolver.step3': '3. Envie a sua mensagem',
    'resolver.wa.btn': 'Enviar por WhatsApp',
    'resolver.email.btn': 'Prefere email? Envie os mesmos dados',
    'resolver.preview': 'A sua mensagem:',
    'resolver.status': 'A mostrar ajuda para: {s}',
    'resolver.note.nusa': 'Informação e orientação prática com base em fontes oficiais públicas, além de acompanhamento presencial. Não é aconselhamento jurídico; quando necessário, encaminhamos para profissionais habilitados.',
    'resolver.note.luso': 'Apenas orientação empresarial, não aconselhamento jurídico, fiscal, financeiro ou de despacho aduaneiro. Quando necessário, encaminhamos para profissionais habilitados.',

    'msg.generic': 'Olá LUSONUSA! Gostaria de marcar uma consulta gratuita.',
    'msg.greeting': 'Olá LUSONUSA!',
    'msg.interest': 'Preciso de ajuda com: {s}.',
    'msg.where.pt': 'Neste momento estou em Portugal.',
    'msg.where.id': 'Neste momento estou na Indonésia.',
    'msg.where.other': 'Neste momento estou fora de Portugal e da Indonésia.',
    'msg.when.urgent': 'Preciso disto nas próximas 2 semanas.',
    'msg.when.soon': 'Preciso disto dentro de 1–3 meses.',
    'msg.when.exploring': 'Por agora estou só a explorar opções.',
    'msg.close': 'Podem indicar-me os próximos passos?',
    'msg.subject': 'Pedido de informação: {s}',

    'workflow.eyebrow': 'Como Trabalhamos',
    'workflow.title': 'Como Acompanhamos e Guiamos a Sua Jornada',
    'workflow.subtitle': 'Uma abordagem humana e acolhedora, passo a passo, para lhe dar clareza e tranquilidade.',
    'workflow.s1.badge': '100% Grátis & Aberto',
    'workflow.s1.title': 'Partilhe o Seu Desafio',
    'workflow.s1.desc': 'Envie uma mensagem rápida pelo WhatsApp. Sem custos ou compromisso—apenas uma equipa pronta para escutar.',
    'workflow.s1.btn': 'Conversar no WhatsApp',
    'workflow.s2.badge': '1–2 Dias de Análise',
    'workflow.s2.title': 'Preparamos o Seu Caso',
    'workflow.s2.desc': 'Antes da conversa, analisamos o seu caso durante 1–2 dias para rever os requisitos oficiais e preparar soluções concretas.',
    'workflow.s3.badge': 'Sessão 1-on-1 Gratuita',
    'workflow.s3.title': 'Discussão Estratégica',
    'workflow.s3.desc': 'Uma consulta focada para explorar o seu plano. Casos simples recebem um guia passo a passo sem qualquer custo.',
    'workflow.s4.badge': 'Preços Transparentes',
    'workflow.s4.title': 'Acompanhamento Presencial',
    'workflow.s4.desc': 'Precisa de apoio presencial? Oferecemos apoio flexível—desde a coordenação de traduções certificadas por notário até ao acompanhamento presencial (AIMA, Finanças, bancos)—com taxas acordadas antecipadamente.',

    'pathways.eyebrow': 'Opções de Serviço e Filosofia de Preços',
    'pathways.title': 'Opções Transparentes Criadas para as Suas Necessidades',
    'pathway.p1.name': '1. Orientação Comunitária Grátis',
    'pathway.p1.desc': 'Dúvidas básicas e orientação geral explicadas na consulta grátis. Ideal se puder tratar dos processos autonomamente.',
    'pathway.p1.price': '€0 • Consulta Gratuita',
    'pathway.p2.name': '2. Preparação de Documentos e Relatórios',
    'pathway.p2.desc': 'Traduções certificadas por notário, NIF/NISS, planos de negócio e relatórios de documentação.',
    'pathway.p2.price': 'Taxa Fixa Transparente',
    'pathway.p3.name': '3. Acompanhamento Presencial',
    'pathway.p3.desc': 'Presença física na AIMA, visitas a Bancos, abertura de empresas PT PMA ou acompanhamento bilingue no terreno.',
    'pathway.p3.price': '€15 – €30 / hora ou Pacote Fixo',
    'pathways.note.label': 'Equidade de Poder de Compra:',
    'pathways.note': 'Adaptamos os nossos preços com justiça—oferecendo tarifas acessíveis a membros da comunidade e orientação empresarial dedicada a empresas.',

    'team.eyebrow': 'Nossa Equipa',
    'team.title': 'Os Colaboradores por trás da Ponte Bilateral',
    'team.subtitle': 'Uma equipa multidisciplinar de profissionais bilingues integrados em ambas as nações.',
    'team.c1.role': 'Fundador',
    'team.c1.title': 'Líder de Negócios e Relações Bilaterais',
    'team.c1.cred1': 'Ex-Embaixada da Indonésia, Lisboa (5 anos)',
    'team.c1.cred2': '9+ anos em Portugal',
    'team.c1.bio': '9+ anos a residir em Portugal com 5 anos de serviço na Secção Económica da Embaixada da República da Indonésia em Lisboa. Especialista em protocolo diplomático, criação de empresas transfronteiriças e navegação administrativa.',
    'team.c1.lang': 'Inglês & Indonésio',
    'team.c2.role': 'Banca & Finanças',
    'team.c2.title': 'Especialista em Consultoria Bancária e Financeira',
    'team.c2.cred1': 'Mestrado em Economia, ISEG Lisboa',
    'team.c2.cred2': 'Setor bancário europeu',
    'team.c2.bio': '7+ anos a residir em Portugal, com Mestrado em Economia pelo ISEG Lisboa. Atualmente a trabalhar no setor bancário europeu, com experiência em movimentos de capital, fluxos financeiros transfronteiriços e conformidade.',
    'team.c2.lang': 'Inglês & Indonésio',
    'team.c3.role': 'Tecnologia & IA',
    'team.c3.title': 'Especialista em Transformação Digital e Inovação',
    'team.c3.cred1': 'M.Sc. Marketing Estratégico',
    'team.c3.cred2': 'Tecnologia empresarial & IA',
    'team.c3.bio': 'Mestrado (M.Sc.) em Marketing Estratégico, atualmente a liderar iniciativas tecnológicas empresariais. Especialização em adaptação de fluxos de trabalho digitais, expansão de mercado e adoção de IA em operações transfronteiriças.',
    'team.c3.lang': 'Inglês & Indonésio',
    'team.c4.role': 'Especialista em Tradução',
    'team.c4.title': 'Líder de Tradução Legal e Notariada',
    'team.c4.cred1': 'Língua nativa: PT-PT & indonésio',
    'team.c4.cred2': 'Traduções certificadas por notário',
    'team.c4.bio': 'Português europeu e indonésio como línguas nativas, com reconhecimento da Embaixada da Indonésia em Lisboa. Prepara traduções de documentos civis, empresariais e jurídicos, certificadas perante notário português. Os trabalhos são agendados após uma breve análise de viabilidade.',
    'team.c4.lang': 'Português & Indonésio',

    'insights.eyebrow': 'Recursos',
    'insights.title': 'Guias e Análises Bilaterais',
    'insights.subtitle': 'Guias práticos sobre vistos, criação de empresas, documentação de residência e traduções entre Portugal e a Indonésia.',
    'insights.all': 'Todos os guias',
    'insights.a1.tag': 'Vistos Indonésia',
    'insights.a1.title': 'Vistos e KITAS na Indonésia para empresários e investidores portugueses (2026)',
    'insights.a1.desc': 'Viagens de negócios, autorizações de estadia para investidores e opções de residência para empresários e administradores portugueses.',
    'insights.a2.tag': 'Criação de PT PMA',
    'insights.a2.title': 'Criar uma PT PMA na Indonésia: investimento direto estrangeiro passo a passo',
    'insights.a2.desc': 'Estrutura da empresa, requisitos de capital e licenciamento OSS para empresas europeias que entram na Indonésia.',
    'insights.a3.tag': 'Burocracia em Portugal',
    'insights.a3.title': 'NIF, NISS e registo de residência na AIMA: guia para indonésios',
    'insights.a3.desc': 'Número fiscal, segurança social e agendamentos de residência para indonésios que se mudam para Portugal.',
    'insights.a4.tag': 'Tradução & Notário',
    'insights.a4.title': 'Tradução certificada e legalização notarial de documentos indonésios e portugueses',
    'insights.a4.desc': 'Como as traduções são certificadas perante notário português, com noções de legalização e apostila.',

    'footer.tagline': 'Informação, Orientação e Acompanhamento Bilateral',
    'footer.contact.title': 'Entre em Contacto',
    'footer.contact.sub': 'Assistência Direta & Consultas',
    'footer.wa.btn': 'Consulta Direta via WhatsApp',
    'footer.email': 'Email:',
    'footer.hours': 'Horário: seg.–sex., 10:00–16:00 hora de Lisboa (16:00–22:00 WIB no verão, 17:00–23:00 WIB no inverno)',
    'footer.consult': 'Consultas realizadas em Inglês e Indonésio.',
    'footer.legal': 'A LUSONUSA é um serviço de informação e orientação, não um escritório de advogados, e não presta aconselhamento jurídico; quando necessário, encaminhamos para profissionais habilitados.',
    'footer.entity': 'Operado por PT Wollusca Sukses Bersama (Purwokerto, Jawa Tengah, Indonésia)',
    'footer.privacy': 'Privacidade e cookies',
    'footer.terms': 'Termos e aviso legal',
    'footer.copy': '© 2026 LUSONUSA · PT Wollusca Sukses Bersama. Todos os direitos reservados.',

    'sticky.wa': 'WhatsApp',
    'sticky.wa.aria': 'Fale connosco pelo WhatsApp'
  },

  id: {
    'meta.title': 'LUSONUSA | Portugal ↔ Indonesia: pendirian usaha, visa & pendampingan pindah',
    'meta.description': 'LUSONUSA memberikan panduan praktis dan pendampingan langsung bagi bisnis Portugal yang masuk ke Indonesia dan WNI yang menetap di Portugal: PT PMA, visa & KITAS, NIF/NISS/AIMA, dan terjemahan bersertifikat notaris.',
    'skip': 'Langsung ke konten',
    'aria.nav': 'Navigasi utama',
    'aria.footer': 'Footer',
    'aria.menu.close': 'Tutup menu',

    'nav.services': 'Layanan',
    'nav.process': 'Proses',
    'nav.team': 'Tim',
    'nav.insights': 'Panduan',
    'nav.contact': 'Kontak',
    'nav.menu': 'Menu',
    'header.cta': 'Konsultasi gratis',

    'hero.title': 'Jembatan terpercaya Anda antara Portugal dan Indonesia',
    'hero.lede': 'Panduan praktis dan pendampingan langsung untuk pendirian usaha, visa, dokumen izin tinggal, dan terjemahan bersertifikat, dari tim bilingual di Portugal dan Indonesia.',
    'hero.trust': 'Didirikan oleh mantan staf Seksi Ekonomi Kedutaan Besar RI di Lisbon (5 tahun)',
    'hero.video.credit': 'Video',
    'hero.luso.audience': 'Untuk bisnis Portugal yang masuk ke Indonesia',
    'hero.luso.sub': 'Menghubungkan bisnis Portugis ke pasar Indonesia.',
    'hero.luso.cta': 'Lihat layanan bisnis',
    'hero.luso.pill1': 'Verifikasi Bisnis',
    'hero.luso.pill2': 'Pendirian PT PMA',
    'hero.luso.pill3': 'Panduan Ekspor-Impor',
    'hero.luso.pill4': 'Visa & KITAS Indonesia',
    'hero.luso.pill5': 'Pencarian Produk',
    'hero.nusa.audience': 'Untuk WNI yang pindah ke atau tinggal di Portugal',
    'hero.nusa.sub': 'Pendampingan terpercaya untuk WNI di Portugal.',
    'hero.nusa.cta': 'Lihat layanan untuk WNI',
    'hero.nusa.pill1': 'Pendampingan AIMA',
    'hero.nusa.pill2': 'NIF & NISS',
    'hero.nusa.pill3': 'Buka Rekening',
    'hero.nusa.pill4': 'Dokumen Bisnis & Resmi',
    'hero.nusa.pill5': 'Penerjemahan Notaris',
    'hero.nusa.pill6': 'Panduan Lokal & Travel',

    'resolver.eyebrow': 'Bagaimana Kami Bisa Membantu?',
    'resolver.title': 'Apa Tantangan Anda Saat Ini?',
    'resolver.subtitle': 'Pilih situasi Anda, jawab dua pertanyaan singkat, lalu kirim pesan siap pakai ke tim kami.',
    'resolver.tabs.label': 'Pilih kategori Anda',
    'resolver.tab.nusa': 'Untuk WNI di/ke Portugal',
    'resolver.tab.luso': 'Untuk Bisnis & Warga Portugis',
    'resolver.step1': '1. Pilih situasi Anda',
    'resolver.empty': 'Pilih skenario untuk melihat bagaimana kami bisa membantu.',
    'resolver.step2': '2. Dua pertanyaan singkat',
    'resolver.optional': 'Opsional, tetapi membantu kami membalas lebih cepat.',
    'resolver.q.where': 'Di mana Anda sekarang?',
    'resolver.q.where.pt': 'Di Portugal',
    'resolver.q.where.id': 'Di Indonesia',
    'resolver.q.where.other': 'Di negara lain',
    'resolver.q.when': 'Kapan Anda membutuhkannya?',
    'resolver.q.when.urgent': 'Dalam 2 minggu',
    'resolver.q.when.soon': 'Dalam 1–3 bulan',
    'resolver.q.when.exploring': 'Baru mencari informasi',
    'resolver.step3': '3. Kirim pesan Anda',
    'resolver.wa.btn': 'Kirim via WhatsApp',
    'resolver.email.btn': 'Lebih suka email? Kirim detail yang sama',
    'resolver.preview': 'Pesan Anda:',
    'resolver.status': 'Menampilkan bantuan untuk: {s}',
    'resolver.note.nusa': 'Informasi dan panduan praktis berdasarkan sumber resmi yang terbuka untuk umum, serta pendampingan langsung. Bukan nasihat hukum; bila diperlukan, kami merujuk Anda ke profesional berlisensi.',
    'resolver.note.luso': 'Hanya panduan bisnis, bukan nasihat hukum, pajak, keuangan, atau jasa kepabeanan. Bila diperlukan, kami merujuk Anda ke profesional berlisensi.',

    'msg.generic': 'Halo LUSONUSA! Saya ingin menjadwalkan konsultasi gratis.',
    'msg.greeting': 'Halo LUSONUSA!',
    'msg.interest': 'Saya butuh bantuan terkait: {s}.',
    'msg.where.pt': 'Saat ini saya berada di Portugal.',
    'msg.where.id': 'Saat ini saya berada di Indonesia.',
    'msg.where.other': 'Saat ini saya berada di luar Portugal dan Indonesia.',
    'msg.when.urgent': 'Saya membutuhkannya dalam 2 minggu.',
    'msg.when.soon': 'Saya membutuhkannya dalam 1–3 bulan.',
    'msg.when.exploring': 'Saat ini saya baru mencari informasi.',
    'msg.close': 'Boleh saya tahu langkah selanjutnya?',
    'msg.subject': 'Pertanyaan: {s}',

    'workflow.eyebrow': 'Cara Kami Bekerja',
    'workflow.title': 'Bagaimana Kami Mendampingi & Membantu Anda',
    'workflow.subtitle': 'Pendekatan 4 langkah yang ramah, dirancang untuk memberi Anda kejelasan dan ketenangan.',
    'workflow.s1.badge': '100% Gratis & Terbuka',
    'workflow.s1.title': 'Ceritakan Tantangan Anda',
    'workflow.s1.desc': 'Kirim pesan singkat via WhatsApp mengenai kebutuhan Anda. Tanpa biaya atau komitmen—kami siap mendengarkan.',
    'workflow.s1.btn': 'Chat via WhatsApp',
    'workflow.s2.badge': '1–2 Hari Riset',
    'workflow.s2.title': 'Kami Siapkan Pilihan Anda',
    'workflow.s2.desc': 'Sebelum berdiskusi, tim kami meluangkan 1–2 hari untuk mempelajari persyaratan resmi dan menyiapkan langkah konkret.',
    'workflow.s3.badge': 'Sesi 1-on-1 Bebas Biaya',
    'workflow.s3.title': 'Diskusi Strategis Awal',
    'workflow.s3.desc': 'Konsultasi terfokus 1-on-1 untuk memilih jalur terbaik. Masalah sederhana kami berikan panduan mandiri gratis.',
    'workflow.s4.badge': 'Biaya Jelas di Awal',
    'workflow.s4.title': 'Pendampingan Terukur',
    'workflow.s4.desc': 'Butuh bantuan langsung? Kami hadirkan layanan fleksibel—dari koordinasi terjemahan bersertifikat notaris hingga pendampingan langsung (AIMA, Finanças, bank)—dengan biaya yang disepakati di awal.',

    'pathways.eyebrow': 'Pilihan Layanan & Filosofi Biaya',
    'pathways.title': 'Pilihan Transparan yang Disesuaikan dengan Kebutuhan Anda',
    'pathway.p1.name': '1. Bimbingan Komunitas Gratis',
    'pathway.p1.desc': 'Pertanyaan dasar & panduan umum dijawab saat konsultasi gratis. Cocok jika Anda ingin mengurus dokumen sendiri.',
    'pathway.p1.price': '€0 • Konsultasi Gratis',
    'pathway.p2.name': '2. Persiapan Dokumen & Laporan',
    'pathway.p2.desc': 'Terjemahan bersertifikat notaris, pembuatan NIF/NISS, peta bisnis, dan laporan dokumentasi.',
    'pathway.p2.price': 'Biaya Paket Transparan',
    'pathway.p3.name': '3. Pendampingan Lapangan',
    'pathway.p3.desc': 'Pendampingan fisik di kantor AIMA, Bank, pendirian PT PMA, atau pendamping lapangan bilingual.',
    'pathway.p3.price': '€15 – €30 / jam atau Paket Fiks',
    'pathways.note.label': 'Keadilan Daya Beli:',
    'pathways.note': 'Kami menyesuaikan biaya secara adil—memberikan tarif yang terjangkau bagi perorangan dan layanan profesional bagi bisnis.',

    'team.eyebrow': 'Tim Kami',
    'team.title': 'Para Kolaborator di Balik Jembatan Bilateral',
    'team.subtitle': 'Tim multidisiplin profesional bilingual yang berpengalaman di kedua negara.',
    'team.c1.role': 'Pendiri',
    'team.c1.title': 'Pemimpin Bisnis & Hubungan Bilateral',
    'team.c1.cred1': 'Eks-KBRI Lisbon (5 tahun)',
    'team.c1.cred2': '9+ tahun di Portugal',
    'team.c1.bio': '9+ tahun tinggal di Portugal dengan 5 tahun bertugas di Seksi Ekonomi Kedutaan Besar Republik Indonesia di Lisbon. Spesialis dalam protokol diplomatik, pendirian bisnis lintas batas, dan navigasi administratif.',
    'team.c1.lang': 'Inggris & Indonesia',
    'team.c2.role': 'Perbankan & Keuangan',
    'team.c2.title': 'Spesialis Konsultasi Perbankan & Keuangan',
    'team.c2.cred1': 'MSc Ekonomi, ISEG Lisbon',
    'team.c2.cred2': 'Sektor perbankan Eropa',
    'team.c2.bio': '7+ tahun tinggal di Portugal dengan gelar Master Ekonomi dari ISEG Lisbon. Saat ini aktif di sektor perbankan Eropa, membawa keahlian dalam pergerakan modal, arus keuangan lintas batas, dan kepatuhan.',
    'team.c2.lang': 'Inggris & Indonesia',
    'team.c3.role': 'Teknologi & AI',
    'team.c3.title': 'Spesialis Transformasi Digital & Inovasi',
    'team.c3.cred1': 'M.Sc. Pemasaran Strategis',
    'team.c3.cred2': 'Teknologi korporat & adopsi AI',
    'team.c3.bio': 'M.Sc. Pemasaran Strategis, saat ini memimpin inisiatif teknologi perusahaan. Spesialisasi dalam adaptasi alur kerja digital, ekspansi pasar modern, dan adopsi AI bisnis lintas operasi.',
    'team.c3.lang': 'Inggris & Indonesia',
    'team.c4.role': 'Spesialis Penerjemahan',
    'team.c4.title': 'Kepala Penerjemahan Dokumen Legal & Notaris',
    'team.c4.cred1': 'Native PT-PT & Indonesia',
    'team.c4.cred2': 'Terjemahan bersertifikat notaris',
    'team.c4.bio': 'Spesialis bilingual native (Portugis-Portugal / Indonesia) yang diakui oleh KBRI Lisbon. Menyiapkan terjemahan dokumen sipil, korporat, dan legal yang disertifikasi di hadapan notaris Portugal. Pekerjaan dijadwalkan setelah pengecekan kelayakan singkat.',
    'team.c4.lang': 'Portugis & Indonesia',

    'insights.eyebrow': 'Sumber Pengetahuan',
    'insights.title': 'Panduan & Wawasan Bilateral',
    'insights.subtitle': 'Panduan praktis tentang visa, pendirian usaha, dokumen izin tinggal, dan terjemahan antara Portugal dan Indonesia.',
    'insights.all': 'Semua panduan',
    'insights.a1.tag': 'Visa Indonesia',
    'insights.a1.title': 'Visa dan KITAS Indonesia untuk pengusaha dan investor Portugal (2026)',
    'insights.a1.desc': 'Kunjungan bisnis, izin tinggal investor, dan opsi tinggal bagi pemilik dan direktur perusahaan Portugal.',
    'insights.a2.tag': 'Pendirian PT PMA',
    'insights.a2.title': 'Mendirikan PT PMA di Indonesia: penanaman modal asing langkah demi langkah',
    'insights.a2.desc': 'Struktur perusahaan, ketentuan modal, dan perizinan OSS bagi perusahaan Eropa yang masuk ke Indonesia.',
    'insights.a3.tag': 'Administrasi Portugal',
    'insights.a3.title': 'NIF, NISS, dan pendaftaran izin tinggal AIMA di Portugal: panduan untuk WNI',
    'insights.a3.desc': 'Nomor pajak, jaminan sosial, dan jadwal izin tinggal bagi WNI yang pindah ke Portugal.',
    'insights.a4.tag': 'Terjemahan & Notaris',
    'insights.a4.title': 'Terjemahan bersertifikat dan legalisasi notaris untuk dokumen Indonesia dan Portugal',
    'insights.a4.desc': 'Cara terjemahan disertifikasi di hadapan notaris Portugal, serta dasar legalisasi dan apostille.',

    'footer.tagline': 'Informasi, Panduan & Pendampingan Bilateral',
    'footer.contact.title': 'Hubungi Kami',
    'footer.contact.sub': 'Bantuan Langsung & Konsultasi',
    'footer.wa.btn': 'Konsultasi Langsung via WhatsApp',
    'footer.email': 'Email:',
    'footer.hours': 'Jam layanan: Senin–Jumat, 10.00–16.00 waktu Lisbon (16.00–22.00 WIB saat musim panas Eropa, 17.00–23.00 WIB saat musim dingin)',
    'footer.consult': 'Konsultasi dilakukan dalam Bahasa Inggris & Indonesia.',
    'footer.legal': 'LUSONUSA adalah layanan informasi dan panduan, bukan kantor hukum, dan tidak memberikan nasihat hukum; bila diperlukan, kami merujuk Anda ke profesional berlisensi.',
    'footer.entity': 'Dioperasikan oleh PT Wollusca Sukses Bersama (Purwokerto, Jawa Tengah, Indonesia)',
    'footer.privacy': 'Privasi & cookie',
    'footer.terms': 'Ketentuan & penafian',
    'footer.copy': '© 2026 LUSONUSA · PT Wollusca Sukses Bersama. Hak cipta dilindungi.',

    'sticky.wa': 'WhatsApp',
    'sticky.wa.aria': 'Chat dengan kami via WhatsApp'
  }
};

function initLanguageSystem() {
  document.querySelectorAll('.nav-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang, true));
  });

  const stored = readStoredLang();
  setLanguage(SUPPORTED_LANGS.includes(stored) ? stored : 'en', false);
}

function setLanguage(lang, persist) {
  const dict = translations[lang];
  if (!dict) return;
  currentLang = lang;
  if (persist) storeLang(lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const value = dict[el.getAttribute('data-i18n')];
    if (value !== undefined) el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const value = dict[el.getAttribute('data-i18n-aria')];
    if (value !== undefined) el.setAttribute('aria-label', value);
  });

  document.documentElement.lang = lang;
  document.title = dict['meta.title'];
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute('content', dict['meta.description']);

  document.querySelectorAll('.nav-lang-btn').forEach(b => {
    const isActive = b.dataset.lang === lang;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  document.querySelectorAll('.hero-video-credit-label').forEach(el => {
    el.textContent = dict['hero.video.credit'];
  });

  renderPills(currentAudience);
  renderSolution();
  updateGenericWhatsAppLinks();
}


/* ═══════════════════════════════════════════════════════════════
   5. SCROLL REVEAL — IntersectionObserver (skipped for reduced motion)
   ═══════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;

  const revealSelectors = [
    '.section-resolver .section-eyebrow',
    '.section-resolver .section-title',
    '.section-resolver .section-subtitle',
    '.resolver-tabs',
    '.resolver-body',
    '.section-workflow .section-eyebrow',
    '.section-workflow .section-title',
    '.section-workflow .section-subtitle',
    '.workflow-card',
    '.section-team .section-eyebrow',
    '.section-team .section-title',
    '.section-team .section-subtitle',
    '.team-card',
    '.insight-compact-row'
  ];

  const elements = document.querySelectorAll(revealSelectors.join(','));
  elements.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

function revealAll() {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}


/* ═══════════════════════════════════════════════════════════════
   6. DECORATIVE YOUTUBE BACKGROUNDS
   youtube-nocookie only; desktop with a mouse; never under reduced
   motion or Save-Data; created on demand rather than on page load.
   ═══════════════════════════════════════════════════════════════ */
function videoBackgroundsAllowed() {
  return !prefersReducedMotion() && !saveDataEnabled() && !mobileQuery.matches;
}

function createYouTubeIframe(id, start, className) {
  const iframe = document.createElement('iframe');
  iframe.className = className;
  iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&rel=0&start=${start || 0}&cc_load_policy=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1`;
  iframe.title = 'Decorative background video';
  iframe.allow = 'autoplay; encrypted-media';
  iframe.setAttribute('tabindex', '-1');
  iframe.setAttribute('aria-hidden', 'true');
  return iframe;
}

function initYouTubeBackgrounds() {
  // Hero panels: load the panel's video the first time a mouse hovers it
  document.querySelectorAll('.hero-panel').forEach(panel => {
    const wrapper = panel.querySelector('.hero-panel-yt-wrapper');
    if (!wrapper) return;

    panel.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse' || !finePointerQuery.matches || !videoBackgroundsAllowed()) return;
      if (wrapper.querySelector('iframe')) return;

      const id = (wrapper.dataset.ytId || '').trim();
      if (id.length < 4) return;
      wrapper.appendChild(createYouTubeIframe(id, wrapper.dataset.ytStart, 'hero-panel-yt-iframe'));
      // Short delay keeps YouTube's boot screen hidden
      setTimeout(() => wrapper.classList.add('active'), 600);

      if (wrapper.dataset.ytCredit && !panel.querySelector('.hero-video-credit')) {
        const credit = document.createElement('a');
        credit.className = 'hero-video-credit';
        credit.href = wrapper.dataset.ytCreditUrl;
        credit.target = '_blank';
        credit.rel = 'noopener noreferrer';
        const label = document.createElement('span');
        label.className = 'hero-video-credit-label';
        label.textContent = t('hero.video.credit');
        credit.append(label, document.createTextNode(`: ${wrapper.dataset.ytCredit}`));
        panel.appendChild(credit);
      }
    });
  });

  // Workflow section: load once the section approaches the viewport
  const workflowSection = document.getElementById('workflow');
  const workflowBg = document.getElementById('workflow-bg-video');
  if (!workflowSection || !workflowBg || !('IntersectionObserver' in window)) return;

  const loader = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || !videoBackgroundsAllowed()) return;
      if (!workflowBg.querySelector('iframe')) {
        workflowBg.insertBefore(createYouTubeIframe(workflowBg.dataset.ytId, 0, 'workflow-yt-iframe'), workflowBg.firstChild);
      }
      loader.disconnect();
    });
  }, { rootMargin: '300px 0px' });
  loader.observe(workflowSection);

  // Keep the screen-pegged video visible only while the section is on screen
  const visibility = new IntersectionObserver((entries) => {
    entries.forEach(entry => workflowBg.classList.toggle('is-in-view', entry.isIntersecting));
  }, { threshold: 0.05 });
  visibility.observe(workflowSection);
}

function removeVideoBackgrounds() {
  document.querySelectorAll('.hero-panel-yt-iframe, .workflow-yt-iframe').forEach(iframe => iframe.remove());
  document.querySelectorAll('.hero-panel-yt-wrapper').forEach(w => w.classList.remove('active'));
  document.querySelectorAll('.hero-video-credit').forEach(c => c.remove());
}


/* ═══════════════════════════════════════════════════════════════
   7. MOBILE NAVIGATION MENU (focus is kept inside while open)
   ═══════════════════════════════════════════════════════════════ */
let closeMobileMenu = () => {};

function initMobileMenu() {
  const trigger = document.getElementById('mobile-nav-trigger');
  const overlay = document.getElementById('mobile-menu-overlay');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  const closeBtn = document.getElementById('mobile-menu-close');
  if (!trigger || !overlay) return;

  const focusables = () => Array.from(overlay.querySelectorAll('a[href], button:not([disabled])'));

  function openMenu() {
    overlay.classList.add('is-active');
    overlay.removeAttribute('inert');
    overlay.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    const first = overlay.querySelector('.mobile-menu-link');
    if (first) first.focus();
  }

  function closeMenu(returnFocus) {
    if (!overlay.classList.contains('is-active')) return;
    overlay.classList.remove('is-active');
    overlay.setAttribute('inert', '');
    overlay.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    if (returnFocus) trigger.focus();
  }
  closeMobileMenu = closeMenu;

  trigger.addEventListener('click', () => {
    if (overlay.classList.contains('is-active')) closeMenu(true);
    else openMenu();
  });

  if (closeBtn) closeBtn.addEventListener('click', () => closeMenu(true));
  if (backdrop) backdrop.addEventListener('click', () => closeMenu(true));
  overlay.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => closeMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('is-active')) return;
    if (e.key === 'Escape') {
      closeMenu(true);
    } else if (e.key === 'Tab') {
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Leaving the mobile breakpoint with the menu open must not leave the page locked
  mobileQuery.addEventListener('change', (e) => {
    if (!e.matches) closeMenu(false);
  });
}


/* ═══════════════════════════════════════════════════════════════
   8. MOBILE STICKY WHATSAPP — hidden while the hero doors, the resolver
   send buttons or the footer contact are on screen, so it never covers another CTA
   ═══════════════════════════════════════════════════════════════ */
function initStickyWhatsApp() {
  const sticky = document.getElementById('sticky-wa');
  const targets = Array.from(document.querySelectorAll('.hero-cta, .resolver-actions, #footer'));
  if (!sticky || !targets.length || !('IntersectionObserver' in window)) return;

  const onScreen = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) onScreen.add(entry.target);
      else onScreen.delete(entry.target);
    });
    sticky.classList.toggle('is-hidden', onScreen.size > 0);
  }, { threshold: 0.1 });
  targets.forEach(el => observer.observe(el));
}


/* ═══════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════ */
initHeader();
initHeroCtas();
initProblemResolver();
initLanguageSystem();
initScrollReveal();
initYouTubeBackgrounds();
initMobileMenu();
initStickyWhatsApp();

reducedMotionQuery.addEventListener('change', (e) => {
  if (e.matches) {
    removeVideoBackgrounds();
    revealAll();
  }
});

/* Restored from the back/forward cache: the page keeps its state, so only
   undo transient UI (open menu) and make sure nothing is left hidden. */
window.addEventListener('pageshow', (e) => {
  if (!e.persisted) return;
  closeMobileMenu(false);
  revealAll();
});
