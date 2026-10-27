/* ═══════════════════════════════════════════════════════════════
   LUSONUSA — Homepage logic
   Loaded with `defer`, so the DOM is already parsed when this runs.
   ═══════════════════════════════════════════════════════════════ */
'use strict';

/* ── Configuration ───────────────────────────────────────────── */
const WHATSAPP_NUMBER = '351930534440';
const CONTACT_EMAIL = 'contact@lusonusa.agency';

/* Guides section: off until the articles are verified. Set to true to insert
   the #insights section from its <template> and show the "Guides" links. */
const SHOW_GUIDES = false;

/* Shared with the article pages so the language choice follows the visitor */
const LANG_STORAGE_KEY = 'lusonusa_lang';
const SUPPORTED_LANGS = ['en', 'pt', 'id'];

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileQuery = window.matchMedia('(max-width: 860px)');

let currentLang = 'en';

function prefersReducedMotion() {
  return reducedMotionQuery.matches;
}

function saveDataEnabled() {
  return !!(navigator.connection && navigator.connection.saveData);
}

function whatsappUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}` + (text ? `?text=${encodeURIComponent(text)}` : '');
}

/* Pick the current language from a { en, pt, id } object */
function pick(obj) {
  return obj[currentLang] !== undefined ? obj[currentLang] : obj.en;
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
   1. FINDER DATA — direction → topic → timing
   `accompany: true` shows "Accompaniment: from €15/h" in the result;
   otherwise the result says deeper work is quoted upfront.
   ═══════════════════════════════════════════════════════════════ */
const FINDER = {
  directions: [
    {
      id: 'pt-id',
      label: { en: 'Portugal → Indonesia', pt: 'Portugal → Indonésia', id: 'Portugal → Indonesia' },
      topics: [
        {
          id: 'market-entry',
          accompany: false,
          label: { en: 'Market entry & PT PMA', pt: 'Entrada no mercado & PT PMA', id: 'Masuk pasar & PT PMA' },
          bullets: {
            en: [
              'Explain how a PT PMA works and which questions to settle first, based on official sources',
              'Outline the main steps, typical timelines and the documents usually requested',
              'Help you prepare for meetings with Indonesian partners and authorities'
            ],
            pt: [
              'Explicar como funciona uma PT PMA e que questões decidir primeiro, com base em fontes oficiais',
              'Resumir os passos principais, os prazos habituais e os documentos normalmente pedidos',
              'Ajudar a preparar reuniões com parceiros e entidades indonésias'
            ],
            id: [
              'Menjelaskan cara kerja PT PMA dan hal yang perlu diputuskan lebih dulu, berdasarkan sumber resmi',
              'Merangkum langkah utama, perkiraan waktu, dan dokumen yang biasanya diminta',
              'Membantu persiapan pertemuan dengan mitra dan instansi di Indonesia'
            ]
          }
        },
        {
          id: 'supplier-checks',
          accompany: true,
          label: { en: 'Supplier & partner checks', pt: 'Verificar fornecedores e parceiros', id: 'Cek supplier & mitra' },
          bullets: {
            en: [
              'Check a company’s public registration details in Indonesia',
              'Set up video calls or factory visits to meet the people behind it',
              'Point out common warning signs before you pay a deposit'
            ],
            pt: [
              'Verificar os dados de registo públicos de uma empresa na Indonésia',
              'Organizar videochamadas ou visitas à fábrica para conhecer quem está por trás',
              'Apontar sinais de alerta comuns antes de pagar um sinal'
            ],
            id: [
              'Mengecek data registrasi publik perusahaan di Indonesia',
              'Mengatur video call atau kunjungan pabrik untuk bertemu langsung pihaknya',
              'Menunjukkan tanda bahaya yang umum sebelum Anda membayar uang muka'
            ]
          }
        },
        {
          id: 'sourcing',
          accompany: true,
          label: { en: 'Product sourcing', pt: 'Procura de produtos', id: 'Pencarian produk' },
          bullets: {
            en: [
              'Find and shortlist Indonesian manufacturers for your product',
              'Request samples and coordinate quality checks on the ground',
              'Keep communication with the factory clear, in both languages'
            ],
            pt: [
              'Encontrar e selecionar fabricantes indonésios para o seu produto',
              'Pedir amostras e coordenar verificações de qualidade no local',
              'Manter a comunicação com a fábrica clara, nas duas línguas'
            ],
            id: [
              'Mencari dan menyaring produsen Indonesia untuk produk Anda',
              'Meminta sampel dan mengoordinasikan pengecekan kualitas di lapangan',
              'Menjaga komunikasi dengan pabrik tetap jelas, dalam dua bahasa'
            ]
          }
        },
        {
          id: 'export-import',
          accompany: false,
          label: { en: 'Export & import', pt: 'Exportação & importação', id: 'Ekspor & impor' },
          bullets: {
            en: [
              'Summarise the customs rules, duties and permits that usually apply, from official sources',
              'Explain the documents a shipment between Portugal and Indonesia typically needs',
              'Help you coordinate with your freight forwarder and supplier'
            ],
            pt: [
              'Resumir as regras alfandegárias, direitos e licenças que normalmente se aplicam, a partir de fontes oficiais',
              'Explicar os documentos que um envio entre Portugal e a Indonésia costuma exigir',
              'Ajudar a coordenar com o transitário e o fornecedor'
            ],
            id: [
              'Merangkum aturan bea cukai, bea masuk, dan izin yang biasanya berlaku, dari sumber resmi',
              'Menjelaskan dokumen yang biasanya dibutuhkan untuk pengiriman antara Portugal dan Indonesia',
              'Membantu koordinasi dengan forwarder dan supplier Anda'
            ]
          }
        },
        {
          id: 'visas-kitas',
          accompany: false,
          label: { en: 'Visas & KITAS', pt: 'Vistos & KITAS', id: 'Visa & KITAS' },
          bullets: {
            en: [
              'Explain which visa or stay permit generally fits your plans',
              'List the documents and sponsor requirements usually involved',
              'Walk you through the official application and extension steps'
            ],
            pt: [
              'Explicar que visto ou autorização de estadia se adequa, em geral, aos seus planos',
              'Listar os documentos e os requisitos de patrocinador normalmente envolvidos',
              'Acompanhar os passos oficiais do pedido e da prorrogação'
            ],
            id: [
              'Menjelaskan visa atau izin tinggal yang umumnya sesuai dengan rencana Anda',
              'Mendaftar dokumen dan persyaratan penjamin yang biasanya diperlukan',
              'Memandu langkah resmi pengajuan dan perpanjangan'
            ]
          }
        }
      ]
    },
    {
      id: 'id-pt',
      label: { en: 'Indonesia → Portugal', pt: 'Indonésia → Portugal', id: 'Indonesia → Portugal' },
      topics: [
        {
          id: 'nif-niss',
          accompany: true,
          label: { en: 'NIF & NISS', pt: 'NIF & NISS', id: 'NIF & NISS' },
          bullets: {
            en: [
              'Explain which route fits your situation and what to prepare',
              'Book and accompany you to Finanças and Segurança Social',
              'Coordinate certified translations if an office asks for them'
            ],
            pt: [
              'Explicar qual o caminho adequado à sua situação e o que preparar',
              'Marcar e acompanhar a ida às Finanças e à Segurança Social',
              'Coordenar traduções certificadas, se algum serviço as pedir'
            ],
            id: [
              'Menjelaskan jalur yang sesuai dengan situasi Anda dan apa yang perlu disiapkan',
              'Membuat janji dan menemani Anda ke Finanças dan Segurança Social',
              'Mengoordinasikan terjemahan bersertifikat jika diminta oleh kantor terkait'
            ]
          }
        },
        {
          id: 'aima',
          accompany: true,
          label: { en: 'AIMA residence', pt: 'Residência (AIMA)', id: 'Izin tinggal AIMA' },
          bullets: {
            en: [
              'Explain the residence route that generally applies and the usual documents',
              'Help you prepare your file before the AIMA appointment',
              'Go with you to the appointment if you’d like support'
            ],
            pt: [
              'Explicar a via de residência que normalmente se aplica e os documentos habituais',
              'Ajudar a preparar o processo antes do atendimento na AIMA',
              'Acompanhar o atendimento, se quiser apoio'
            ],
            id: [
              'Menjelaskan jalur izin tinggal yang umumnya berlaku dan dokumen yang biasa diminta',
              'Membantu menyiapkan berkas sebelum jadwal di AIMA',
              'Menemani Anda ke jadwal AIMA jika Anda ingin didampingi'
            ]
          }
        },
        {
          id: 'bank',
          accompany: true,
          label: { en: 'Bank account', pt: 'Conta bancária', id: 'Rekening bank' },
          bullets: {
            en: [
              'Explain what Portuguese banks usually ask for',
              'Help you compare options and prepare the paperwork',
              'Accompany you to the branch appointment'
            ],
            pt: [
              'Explicar o que os bancos portugueses costumam pedir',
              'Ajudar a comparar opções e a preparar a documentação',
              'Acompanhar a ida ao balcão'
            ],
            id: [
              'Menjelaskan apa yang biasanya diminta bank di Portugal',
              'Membantu membandingkan pilihan dan menyiapkan dokumen',
              'Menemani Anda ke kantor cabang bank'
            ]
          }
        },
        {
          id: 'translation',
          accompany: false,
          label: { en: 'Certified translation', pt: 'Tradução certificada', id: 'Terjemahan bersertifikat' },
          bullets: {
            en: [
              'Translate documents between Indonesian and European Portuguese',
              'Have translations certified before a Portuguese notary when an official version is needed',
              'Tell you upfront which documents an office usually expects'
            ],
            pt: [
              'Traduzir documentos entre indonésio e português europeu',
              'Certificar as traduções perante notário português quando é necessária uma versão oficial',
              'Indicar à partida que documentos um serviço costuma pedir'
            ],
            id: [
              'Menerjemahkan dokumen antara bahasa Indonesia dan bahasa Portugis (Portugal)',
              'Mensertifikasi terjemahan di hadapan notaris Portugal bila diperlukan versi resmi',
              'Memberi tahu sejak awal dokumen apa yang biasanya diminta suatu kantor'
            ]
          }
        },
        {
          id: 'housing-arrival',
          accompany: true,
          label: { en: 'Housing & arrival', pt: 'Alojamento & chegada', id: 'Tempat tinggal & kedatangan' },
          bullets: {
            en: [
              'Help you check listings and rental contracts before you commit',
              'Arrival orientation: SIM card, transport and first errands',
              'Practical tips for students starting university life'
            ],
            pt: [
              'Ajudar a verificar anúncios e contratos de arrendamento antes de se comprometer',
              'Orientação à chegada: cartão SIM, transportes e primeiras tarefas',
              'Dicas práticas para estudantes que começam a vida universitária'
            ],
            id: [
              'Membantu mengecek iklan dan kontrak sewa sebelum Anda setuju',
              'Orientasi kedatangan: kartu SIM, transportasi, dan urusan pertama',
              'Tips praktis bagi mahasiswa yang baru memulai kuliah'
            ]
          }
        },
        {
          id: 'business-portugal',
          accompany: true,
          label: { en: 'Business in Portugal', pt: 'Negócio em Portugal', id: 'Usaha di Portugal' },
          bullets: {
            en: [
              'Explain the usual ways to set up and register a business in Portugal, from official sources',
              'Outline the licences and steps for sectors such as food and retail',
              'Help Indonesian companies plan their first steps into Portugal and the EU'
            ],
            pt: [
              'Explicar as formas habituais de criar e registar uma empresa em Portugal, a partir de fontes oficiais',
              'Resumir as licenças e os passos em setores como a restauração e o comércio',
              'Ajudar empresas indonésias a planear os primeiros passos em Portugal e na UE'
            ],
            id: [
              'Menjelaskan cara umum mendirikan dan mendaftarkan usaha di Portugal, dari sumber resmi',
              'Merangkum izin dan langkah untuk sektor seperti kuliner dan ritel',
              'Membantu perusahaan Indonesia merencanakan langkah awal ke Portugal dan Uni Eropa'
            ]
          }
        },
        {
          id: 'travel-guide',
          accompany: true,
          label: { en: 'Travel & local guide', pt: 'Viagem & guia local', id: 'Wisata & pemandu lokal' },
          bullets: {
            en: [
              'A bilingual local guide for business or leisure days in Portugal',
              'Guide support for visiting delegations',
              'Itinerary, hotel and rental car recommendations with booking assistance; you book and pay the provider directly'
            ],
            pt: [
              'Guia local bilingue para dias de negócios ou de lazer em Portugal',
              'Apoio de guia para delegações em visita',
              'Recomendações de itinerário, hotéis e aluguer de carro, com assistência na reserva; reserva e paga diretamente ao fornecedor'
            ],
            id: [
              'Pemandu lokal bilingual untuk urusan bisnis atau wisata di Portugal',
              'Pendampingan pemandu untuk delegasi yang berkunjung',
              'Rekomendasi itinerari, hotel, dan sewa mobil, serta bantuan pemesanan; pemesanan dan pembayaran langsung ke penyedia'
            ]
          }
        }
      ]
    }
  ],
  timings: [
    { id: 'this-month', label: { en: 'This month', pt: 'Este mês', id: 'Bulan ini' } },
    { id: '1-3-months', label: { en: '1–3 months', pt: '1–3 meses', id: '1–3 bulan' } },
    { id: 'exploring', label: { en: 'Just exploring', pt: 'Só a explorar', id: 'Baru cari info' } }
  ]
};


/* ═══════════════════════════════════════════════════════════════
   2. FINDER — chat-style flow with real buttons (aria-pressed)
   ═══════════════════════════════════════════════════════════════ */
const finder = { dir: null, topic: null, time: null };

const $ = (id) => document.getElementById(id);

function findDirection(id) {
  return FINDER.directions.find(d => d.id === id) || null;
}

function findTopic() {
  const dir = findDirection(finder.dir);
  return dir ? dir.topics.find(tp => tp.id === finder.topic) || null : null;
}

function findTiming() {
  return FINDER.timings.find(tm => tm.id === finder.time) || null;
}

/* Rebuild one chip group, keeping keyboard focus on the same chip if it had it */
function renderChips(container, items, selectedId, onSelect) {
  if (!container) return;
  const focusedId = container.contains(document.activeElement) ? document.activeElement.dataset.value : null;
  container.textContent = '';
  items.forEach(item => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.dataset.value = item.id;
    chip.textContent = pick(item.label);
    chip.setAttribute('aria-pressed', item.id === selectedId ? 'true' : 'false');
    chip.addEventListener('click', () => onSelect(item.id, chip));
    container.appendChild(chip);
    if (item.id === focusedId) chip.focus({ preventScroll: true });
  });
}

function renderFinder() {
  const dir = findDirection(finder.dir);
  const topic = findTopic();
  const timing = findTiming();

  renderChips($('finder-dir'), FINDER.directions, finder.dir, (id) => selectDirection(id, true));

  $('finder-step-topic').hidden = !dir;
  if (dir) renderChips($('finder-topic'), dir.topics, finder.topic, (id) => selectTopic(id));

  $('finder-step-time').hidden = !topic;
  if (topic) renderChips($('finder-time'), FINDER.timings, finder.time, (id) => selectTiming(id));

  $('finder-restart').hidden = !dir;

  const result = $('finder-result');
  result.hidden = !(dir && topic && timing);
  if (result.hidden) return;

  $('finder-result-title').textContent = t('finder.result.title').replace('{s}', pick(topic.label));
  const list = $('finder-result-list');
  list.textContent = '';
  pick(topic.bullets).forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    list.appendChild(li);
  });
  $('finder-meta-accomp').hidden = !topic.accompany;
  $('finder-meta-quoted').hidden = topic.accompany;

  const message = [
    t('msg.greeting'),
    t('msg.direction').replace('{s}', pick(dir.label)),
    t('msg.topic').replace('{s}', pick(topic.label)),
    t('msg.timing').replace('{s}', pick(timing.label)),
    t('msg.close'),
    `(Ref: web-${dir.id}-${topic.id}-${timing.id}-${currentLang})`
  ].join('\n');
  const subject = t('msg.subject').replace('{s}', pick(topic.label));
  $('finder-wa').href = whatsappUrl(message);
  $('finder-email').href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

function announce(text) {
  const status = $('finder-status');
  if (status) status.textContent = text;
}

function focusFirstChip(container) {
  const first = container && container.querySelector('.chip');
  if (first) first.focus({ preventScroll: true });
  if (first && mobileQuery.matches) {
    first.closest('.step-group').scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
  }
}

/* moveFocus: true when the visitor answered inside the chat (not from a hero card) */
function selectDirection(id, moveFocus) {
  if (!findDirection(id)) return;
  if (finder.dir !== id) {
    finder.dir = id;
    finder.topic = null;
    finder.time = null;
  }
  renderFinder();
  announce(t('finder.q.topic'));
  if (moveFocus) focusFirstChip($('finder-topic'));
}

function selectTopic(id) {
  finder.topic = id;
  finder.time = null;
  renderFinder();
  announce(t('finder.q.time'));
  focusFirstChip($('finder-time'));
}

function selectTiming(id) {
  finder.time = id;
  renderFinder();
  const title = $('finder-result-title');
  announce(title.textContent);
  title.focus({ preventScroll: true });
  $('finder-result').scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: mobileQuery.matches ? 'start' : 'nearest' });
}

function resetFinder() {
  finder.dir = finder.topic = finder.time = null;
  renderFinder();
  announce('');
  const first = $('finder-dir').querySelector('.chip');
  if (first) first.focus();
}

function initFinder() {
  $('finder-restart').addEventListener('click', resetFinder);
  renderFinder();
}


/* ═══════════════════════════════════════════════════════════════
   3. HERO — direction cards slide the Lisbon/Java seam and pre-set
   the finder (the link itself scrolls to #finder, also without JS)
   ═══════════════════════════════════════════════════════════════ */
function initHero() {
  const hero = document.querySelector('.hero');
  document.querySelectorAll('.dir[data-direction]').forEach(card => {
    const side = card.dataset.direction === 'pt-id' ? 'focus-pt' : 'focus-id';
    const on = () => hero.classList.add(side);
    const off = () => hero.classList.remove(side);
    card.addEventListener('pointerenter', on);
    card.addEventListener('pointerleave', off);
    card.addEventListener('focus', on);
    card.addEventListener('blur', off);
    card.addEventListener('click', () => selectDirection(card.dataset.direction, false));
  });
  initHeroVideo();
}

/* Optional, not shipped yet: a single self-hosted muted loop
   (<video data-hero-video> inside .hero-bg) that crossfades in over the photos. */
function initHeroVideo() {
  const video = document.querySelector('video[data-hero-video]');
  if (!video || prefersReducedMotion() || saveDataEnabled()) return;
  video.addEventListener('playing', () => video.classList.add('is-playing'), { once: true });
  video.play().catch(() => { /* autoplay refused: the photos stay */ });
  reducedMotionQuery.addEventListener('change', (e) => {
    if (e.matches) {
      video.pause();
      video.classList.remove('is-playing');
    }
  });
}


/* ═══════════════════════════════════════════════════════════════
   4. TEAM — bios open on hover/focus (CSS) and on tap (button)
   ═══════════════════════════════════════════════════════════════ */
function initTeam() {
  document.querySelectorAll('.person').forEach(person => {
    const button = person.querySelector('.bio-toggle');
    if (!button) return;
    button.addEventListener('click', () => {
      const open = !person.classList.contains('is-open');
      person.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = document.activeElement && document.activeElement.closest('.person.is-open');
    if (!open) return;
    open.classList.remove('is-open');
    open.querySelector('.bio-toggle').setAttribute('aria-expanded', 'false');
  });
}


/* ═══════════════════════════════════════════════════════════════
   5. LANGUAGE SYSTEM (i18n)
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
    'nav.menu': 'Menu',
    'nav.insights': 'Guides',
    'nav.contact': 'Contact',
    'nav.team': 'Team',
    'msg.generic': 'Hello LUSONUSA! I would like to book a free consultation.',
    'msg.greeting': 'Hello LUSONUSA!',
    'msg.close': 'Could you tell me the next steps?',
    'msg.subject': 'Enquiry: {s}',
    'footer.tagline': 'Bilateral Information, Guidance & Accompaniment',
    'footer.contact.title': 'Get in Touch',
    'footer.wa.btn': 'Direct WhatsApp Consultation',
    'footer.email': 'Email:',
    'footer.hours': 'Service hours: Mon–Fri, 10:00–16:00 Lisbon time (16:00–22:00 WIB in summer, 17:00–23:00 WIB in winter)',
    'footer.consult': 'Consultations in English & Indonesian.',
    'footer.legal': 'LUSONUSA is an information and guidance service, not a law firm, and does not give legal advice. When your situation needs a lawyer or another licensed professional, we\'ll tell you clearly.',
    'footer.entity': 'LUSONUSA is a network of independent bilingual professionals in Portugal and Indonesia. Services are contracted directly with the professional who delivers them.',
    'footer.privacy': 'Privacy & cookies',
    'footer.terms': 'Terms & disclaimer',
    'footer.copy': '© 2026 LUSONUSA. All rights reserved.',
    'link.terms': '/terms.html',
    'link.privacy': '/privacy.html',
    'sticky.wa': 'WhatsApp',
    'sticky.wa.aria': 'Chat with us on WhatsApp',
    'team.c1.role': 'Founder',
    'team.c1.title': 'Business & Bilateral Relations Lead',
    'team.c1.lang': 'English & Indonesian',
    'team.c2.role': 'Banking & Finance',
    'team.c2.title': 'Banking & Finance Specialist',
    'team.c2.bio': '7+ years residing in Portugal with a Master of Science in Economics from ISEG Lisbon. Currently active in the European banking sector, bringing domain expertise in capital movements, cross-border financial flows, and compliance.',
    'team.c2.lang': 'English & Indonesian',
    'team.c3.role': 'Technology & AI',
    'team.c3.title': 'Digital Transformation & Innovation',
    'team.c3.bio': 'M.Sc. in Strategic Marketing currently leading enterprise tech initiatives. Specializes in digital workflow adaptation, modern market expansion, and business AI adoption across cross-border operations.',
    'team.c3.lang': 'English & Indonesian',
    'team.c4.role': 'Translation Specialist',
    'team.c4.title': 'Portuguese–Indonesian Translator & Interpreter',
    'team.c4.bio': 'Native speaker of both European Portuguese and Indonesian. Translates and interprets between the two languages; when an official version is needed, translations are certified before a Portuguese notary.',
    'team.c4.lang': 'Portuguese & Indonesian',
    'team.subtitle': 'A network of independent bilingual professionals embedded in both nations.',
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

    'nav.services': 'Services',
    'nav.process': 'How we work',
    'header.cta': 'Free first consultation',

    'hero.eyebrow': 'Portugal · Indonesia',
    'hero.title.a': 'Your trusted bridge between',
    'hero.title.pt': 'Portugal',
    'hero.title.and': 'and',
    'hero.title.id': 'Indonesia',
    'hero.lede': 'Practical guidance and in-person accompaniment for company setup, visas, residency paperwork and certified translations — from a bilingual team at home in both countries.',
    'hero.cta1': 'Start a free conversation',
    'hero.cta2': 'How we work',

    'dir.pt.from': 'Portugal',
    'dir.pt.to': 'Indonesia',
    'dir.pt.title': 'Grow into Indonesia',
    'dir.pt.text': 'For Portuguese companies and professionals exploring, sourcing from or expanding into the Indonesian market.',
    'dir.pt.tags': 'Market entry · PT PMA · Supplier checks · Visas & KITAS',
    'dir.id.from': 'Indonesia',
    'dir.id.to': 'Portugal',
    'dir.id.title': 'Settle & build in Portugal',
    'dir.id.text': 'For Indonesians living, studying or working in Portugal — and Indonesian businesses expanding into Portugal and Europe.',
    'dir.id.tags': 'NIF & NISS · AIMA · Banking · Certified translation · Business setup',

    'finder.eyebrow': 'Find your path',
    'finder.title': 'Tell us where you’re headed. | We’ll point the way.',
    'finder.intro': 'Three quick taps turn your situation — say, checking a supplier in Jepara or getting your NIF in Lisbon — into a clear message for our team. No forms, no account.',
    'promise.1.t': 'A real person replies',
    'promise.1.d': 'Within 1–2 working days, in English or Indonesian.',
    'promise.2.t': 'Your first orientation is free',
    'promise.2.d': 'An honest overview based on public official information.',
    'promise.3.t': 'Deeper work is quoted first',
    'promise.3.d': 'Scope, time and price in writing before anything starts.',
    'finder.head.sub': 'Usually replies within 1–2 working days',
    'finder.restart': 'Start over',
    'finder.q.dir': 'Olá! Which way are you heading?',
    'finder.q.topic': 'What do you need help with?',
    'finder.q.time': 'When do you need it?',
    'finder.result.title': '{s} — how we can help',
    'finder.meta.first': 'First orientation:',
    'finder.meta.free': 'free',
    'finder.meta.accomp': 'Accompaniment:',
    'finder.meta.from': 'from €15/h',
    'finder.meta.deeper': 'Deeper work:',
    'finder.meta.quoted': 'quoted upfront',
    'finder.wa': 'Send to us on WhatsApp',
    'finder.email': 'Email instead',
    'finder.fine': 'Information and guidance, not legal advice. Please don’t send ID documents in this first message.',
    'msg.direction': 'Direction: {s}',
    'msg.topic': 'Topic: {s}',
    'msg.timing': 'Timing: {s}',

    'process.eyebrow': 'How we work',
    'process.title': 'Honest first answers. | Deeper help when you need it.',
    'step.1.badge': 'Free',
    'step.1.title': 'Tell us your situation',
    'step.1.text': 'A short WhatsApp message or email is enough. No fees, no obligation.',
    'step.2.badge': 'Reply in 1–2 working days',
    'step.2.title': 'Your free first orientation',
    'step.2.text': 'We look at your case and reply with what applies, the main requirements and where to find the official information — or a short call if that’s easier.',
    'step.3.badge': 'Quoted upfront',
    'step.3.title': 'Go deeper, if you want',
    'step.3.text': 'Need detailed research — for example, the import rules for teak furniture from Indonesia, or what you need to open a restaurant in Lisbon? We send scope, time and price first.',
    'step.4.badge': 'Agreed in writing',
    'step.4.title': 'We walk it with you',
    'step.4.text': 'Hands-on help, such as going with you to an AIMA appointment or a supplier visit in Java. Extra time is only billed after we ask you.',
    'process.note': 'Accompaniment from €15/hour. Anything beyond the free first orientation is quoted before we start.',

    'team.eyebrow': 'Our network',
    'team.title': 'The people | behind the bridge.',
    'team.bio.btn': 'Bio',
    'team.c1.tag1': 'Double Master’s · UGM × ISCTE',
    'team.c1.tag2': '9+ yrs in Portugal',
    'team.c1.bio': 'Double master’s degree: MBA (FEB UGM) and M.Sc. in International Management (ISCTE-IUL). Nine years in Portugal, including five in the Economic Section of the Embassy of the Republic of Indonesia in Lisbon.',
    'team.c2.tag1': 'M.Sc. Economics · ISEG',
    'team.c2.tag2': '7+ yrs in Portugal',
    'team.c3.tag1': 'M.Sc. Strategic Marketing',
    'team.c3.tag2': '6+ yrs in Portugal',
    'team.c4.tag1': 'Native PT & ID',
    'team.c4.tag2': '20+ yrs in Portugal'
  },

  pt: {
    'meta.title': 'LUSONUSA | Portugal ↔ Indonésia: criação de empresas, vistos e apoio à mudança',
    'meta.description': 'A LUSONUSA dá orientação prática e acompanhamento presencial a empresas portuguesas que entram na Indonésia e a indonésios que se instalam em Portugal: PT PMA, vistos e KITAS, NIF/NISS/AIMA e traduções certificadas por notário.',
    'skip': 'Saltar para o conteúdo',
    'aria.nav': 'Navegação principal',
    'aria.footer': 'Rodapé',
    'aria.menu.close': 'Fechar menu',
    'nav.menu': 'Menu',
    'nav.insights': 'Guias',
    'nav.contact': 'Contacto',
    'nav.team': 'Equipa',
    'msg.generic': 'Olá LUSONUSA! Gostaria de marcar uma consulta gratuita.',
    'msg.greeting': 'Olá LUSONUSA!',
    'msg.close': 'Podem indicar-me os próximos passos?',
    'msg.subject': 'Pedido de informação: {s}',
    'footer.tagline': 'Informação, Orientação e Acompanhamento Bilateral',
    'footer.contact.title': 'Entre em Contacto',
    'footer.wa.btn': 'Consulta Direta via WhatsApp',
    'footer.email': 'Email:',
    'footer.hours': 'Horário: seg.–sex., 10:00–16:00 hora de Lisboa (16:00–22:00 WIB no verão, 17:00–23:00 WIB no inverno)',
    'footer.consult': 'Consultas em inglês e indonésio.',
    'footer.legal': 'A LUSONUSA é um serviço de informação e orientação, não um escritório de advogados, e não presta aconselhamento jurídico. Quando a sua situação exigir um advogado ou outro profissional habilitado, dizemos-lhe claramente.',
    'footer.entity': 'A LUSONUSA é uma rede de profissionais bilingues independentes em Portugal e na Indonésia. Os serviços são contratados diretamente com o profissional que os presta.',
    'footer.privacy': 'Privacidade e cookies',
    'footer.terms': 'Termos e aviso legal',
    'footer.copy': '© 2026 LUSONUSA. Todos os direitos reservados.',
    'link.terms': '/termos.html',
    'link.privacy': '/privacidade.html',
    'sticky.wa': 'WhatsApp',
    'sticky.wa.aria': 'Fale connosco pelo WhatsApp',
    'team.c1.role': 'Fundador',
    'team.c1.title': 'Líder de Negócios e Relações Bilaterais',
    'team.c1.lang': 'Inglês & Indonésio',
    'team.c2.role': 'Banca & Finanças',
    'team.c2.title': 'Especialista em Banca e Finanças',
    'team.c2.bio': '7+ anos a residir em Portugal, com Mestrado em Economia pelo ISEG Lisboa. Atualmente a trabalhar no setor bancário europeu, com experiência em movimentos de capital, fluxos financeiros transfronteiriços e conformidade.',
    'team.c2.lang': 'Inglês & Indonésio',
    'team.c3.role': 'Tecnologia & IA',
    'team.c3.title': 'Transformação Digital e Inovação',
    'team.c3.bio': 'Mestrado (M.Sc.) em Marketing Estratégico, atualmente a liderar iniciativas tecnológicas empresariais. Especialização em adaptação de fluxos de trabalho digitais, expansão de mercado e adoção de IA em operações transfronteiriças.',
    'team.c3.lang': 'Inglês & Indonésio',
    'team.c4.role': 'Especialista em Tradução',
    'team.c4.title': 'Tradutora e Intérprete Português–Indonésio',
    'team.c4.bio': 'Falante nativa de português europeu e de indonésio. Traduz e interpreta entre as duas línguas; quando é necessária uma versão oficial, as traduções são certificadas perante notário português.',
    'team.c4.lang': 'Português & Indonésio',
    'team.subtitle': 'Uma rede de profissionais bilingues independentes integrados em ambas as nações.',
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

    'nav.services': 'Serviços',
    'nav.process': 'Como trabalhamos',
    'header.cta': 'Primeira consulta gratuita',

    'hero.eyebrow': 'Portugal · Indonésia',
    'hero.title.a': 'A sua ponte de confiança entre',
    'hero.title.pt': 'Portugal',
    'hero.title.and': 'e a',
    'hero.title.id': 'Indonésia',
    'hero.lede': 'Orientação prática e acompanhamento presencial na criação de empresas, vistos, documentação de residência e traduções certificadas — por uma equipa bilingue que conhece bem os dois países.',
    'hero.cta1': 'Iniciar uma conversa gratuita',
    'hero.cta2': 'Como trabalhamos',

    'dir.pt.from': 'Portugal',
    'dir.pt.to': 'Indonésia',
    'dir.pt.title': 'Crescer na Indonésia',
    'dir.pt.text': 'Para empresas e profissionais portugueses que querem explorar o mercado indonésio, comprar lá ou expandir-se para lá.',
    'dir.pt.tags': 'Entrada no mercado · PT PMA · Verificação de fornecedores · Vistos & KITAS',
    'dir.id.from': 'Indonésia',
    'dir.id.to': 'Portugal',
    'dir.id.title': 'Viver e crescer em Portugal',
    'dir.id.text': 'Para indonésios que vivem, estudam ou trabalham em Portugal — e para empresas indonésias que se expandem para Portugal e para a Europa.',
    'dir.id.tags': 'NIF & NISS · AIMA · Banco · Tradução certificada · Criação de empresa',

    'finder.eyebrow': 'Encontre o seu caminho',
    'finder.title': 'Diga-nos para onde vai. | Nós indicamos o caminho.',
    'finder.intro': 'Três toques transformam a sua situação — por exemplo, verificar um fornecedor em Jepara ou importar mobiliário de Java — numa mensagem clara para a nossa equipa. Sem formulários, sem conta.',
    'promise.1.t': 'Responde-lhe uma pessoa',
    'promise.1.d': 'Em 1–2 dias úteis, em inglês ou indonésio.',
    'promise.2.t': 'A primeira orientação é gratuita',
    'promise.2.d': 'Uma visão honesta, com base em informação oficial pública.',
    'promise.3.t': 'Trabalho aprofundado com orçamento prévio',
    'promise.3.d': 'Âmbito, prazo e preço por escrito antes de começarmos.',
    'finder.head.sub': 'Responde normalmente em 1–2 dias úteis',
    'finder.restart': 'Recomeçar',
    'finder.q.dir': 'Olá! Para onde quer ir?',
    'finder.q.topic': 'Em que precisa de ajuda?',
    'finder.q.time': 'Para quando precisa?',
    'finder.result.title': '{s} — como podemos ajudar',
    'finder.meta.first': 'Primeira orientação:',
    'finder.meta.free': 'gratuita',
    'finder.meta.accomp': 'Acompanhamento:',
    'finder.meta.from': 'a partir de €15/h',
    'finder.meta.deeper': 'Trabalho aprofundado:',
    'finder.meta.quoted': 'com orçamento prévio',
    'finder.wa': 'Enviar por WhatsApp',
    'finder.email': 'Prefiro email',
    'finder.fine': 'Informação e orientação, não aconselhamento jurídico. Por favor, não envie documentos de identificação nesta primeira mensagem.',
    'msg.direction': 'Direção: {s}',
    'msg.topic': 'Assunto: {s}',
    'msg.timing': 'Prazo: {s}',

    'process.eyebrow': 'Como trabalhamos',
    'process.title': 'Primeiro, respostas honestas. | Ajuda mais profunda quando precisar.',
    'step.1.badge': 'Grátis',
    'step.1.title': 'Conte-nos a sua situação',
    'step.1.text': 'Basta uma mensagem curta por WhatsApp ou email. Sem custos nem compromisso.',
    'step.2.badge': 'Resposta em 1–2 dias úteis',
    'step.2.title': 'A sua primeira orientação gratuita',
    'step.2.text': 'Analisamos o seu caso e respondemos com o que se aplica, os principais requisitos e onde encontrar a informação oficial — ou uma chamada curta, se for mais fácil.',
    'step.3.badge': 'Orçamento prévio',
    'step.3.title': 'Aprofundar, se quiser',
    'step.3.text': 'Precisa de uma análise detalhada — por exemplo, as regras para importar mobiliário em teca da Indonésia, ou como verificar um fornecedor em Jepara antes de pagar? Enviamos primeiro o âmbito, o prazo e o preço.',
    'step.4.badge': 'Acordado por escrito',
    'step.4.title': 'Acompanhamos o processo consigo',
    'step.4.text': 'Apoio no terreno, como acompanhar uma visita a fornecedores em Java ou uma reunião com um parceiro local. O tempo adicional só é faturado depois de lhe perguntarmos.',
    'process.note': 'Acompanhamento a partir de €15/hora. Tudo o que vá além da primeira orientação gratuita é orçamentado antes de começarmos.',

    'team.eyebrow': 'A nossa rede',
    'team.title': 'As pessoas | por trás da ponte.',
    'team.bio.btn': 'Bio',
    'team.c1.tag1': 'Duplo Mestrado · UGM × ISCTE',
    'team.c1.tag2': '9+ anos em Portugal',
    'team.c1.bio': 'Duplo mestrado: MBA (FEB UGM) e M.Sc. em Gestão Internacional (ISCTE-IUL). Nove anos em Portugal, incluindo cinco na Secção Económica da Embaixada da República da Indonésia em Lisboa.',
    'team.c2.tag1': 'M.Sc. Economia · ISEG',
    'team.c2.tag2': '7+ anos em Portugal',
    'team.c3.tag1': 'M.Sc. Marketing Estratégico',
    'team.c3.tag2': '6+ anos em Portugal',
    'team.c4.tag1': 'Nativa PT & ID',
    'team.c4.tag2': '20+ anos em Portugal'
  },

  id: {
    'meta.title': 'LUSONUSA | Portugal ↔ Indonesia: pendirian usaha, visa & pendampingan pindah',
    'meta.description': 'LUSONUSA memberikan panduan praktis dan pendampingan langsung bagi bisnis Portugal yang masuk ke Indonesia dan WNI yang menetap di Portugal: PT PMA, visa & KITAS, NIF/NISS/AIMA, dan terjemahan bersertifikat notaris.',
    'skip': 'Langsung ke konten',
    'aria.nav': 'Navigasi utama',
    'aria.footer': 'Footer',
    'aria.menu.close': 'Tutup menu',
    'nav.menu': 'Menu',
    'nav.insights': 'Panduan',
    'nav.contact': 'Kontak',
    'nav.team': 'Tim',
    'msg.generic': 'Halo LUSONUSA! Saya ingin menjadwalkan konsultasi gratis.',
    'msg.greeting': 'Halo LUSONUSA!',
    'msg.close': 'Boleh saya tahu langkah selanjutnya?',
    'msg.subject': 'Pertanyaan: {s}',
    'footer.tagline': 'Informasi, Panduan & Pendampingan Bilateral',
    'footer.contact.title': 'Hubungi Kami',
    'footer.wa.btn': 'Konsultasi Langsung via WhatsApp',
    'footer.email': 'Email:',
    'footer.hours': 'Jam layanan: Senin–Jumat, 10.00–16.00 waktu Lisbon (16.00–22.00 WIB saat musim panas Eropa, 17.00–23.00 WIB saat musim dingin)',
    'footer.consult': 'Konsultasi dalam bahasa Inggris & Indonesia.',
    'footer.legal': 'LUSONUSA adalah layanan informasi dan panduan, bukan kantor hukum, dan tidak memberikan nasihat hukum. Jika situasi Anda memerlukan pengacara atau profesional berlisensi lainnya, kami akan menyampaikannya dengan jelas.',
    'footer.entity': 'LUSONUSA adalah jaringan profesional bilingual independen di Portugal dan Indonesia. Layanan dikontrak langsung dengan profesional yang memberikannya.',
    'footer.privacy': 'Privasi & cookie',
    'footer.terms': 'Ketentuan & penafian',
    'footer.copy': '© 2026 LUSONUSA. Hak cipta dilindungi.',
    'link.terms': '/terms.html',
    'link.privacy': '/privacy.html',
    'sticky.wa': 'WhatsApp',
    'sticky.wa.aria': 'Chat dengan kami via WhatsApp',
    'team.c1.role': 'Pendiri',
    'team.c1.title': 'Pemimpin Bisnis & Hubungan Bilateral',
    'team.c1.lang': 'Inggris & Indonesia',
    'team.c2.role': 'Perbankan & Keuangan',
    'team.c2.title': 'Spesialis Perbankan & Keuangan',
    'team.c2.bio': '7+ tahun tinggal di Portugal dengan gelar Master Ekonomi dari ISEG Lisbon. Saat ini aktif di sektor perbankan Eropa, membawa keahlian dalam pergerakan modal, arus keuangan lintas batas, dan kepatuhan.',
    'team.c2.lang': 'Inggris & Indonesia',
    'team.c3.role': 'Teknologi & AI',
    'team.c3.title': 'Transformasi Digital & Inovasi',
    'team.c3.bio': 'M.Sc. Pemasaran Strategis, saat ini memimpin inisiatif teknologi perusahaan. Spesialisasi dalam adaptasi alur kerja digital, ekspansi pasar modern, dan adopsi AI bisnis lintas operasi.',
    'team.c3.lang': 'Inggris & Indonesia',
    'team.c4.role': 'Spesialis Penerjemahan',
    'team.c4.title': 'Penerjemah & Juru Bahasa Portugis–Indonesia',
    'team.c4.bio': 'Penutur asli bahasa Portugis (Portugal) dan bahasa Indonesia. Menerjemahkan dan menjadi juru bahasa di antara kedua bahasa; bila diperlukan versi resmi, terjemahan disertifikasi di hadapan notaris Portugal.',
    'team.c4.lang': 'Portugis & Indonesia',
    'team.subtitle': 'Jaringan profesional bilingual independen yang berpengalaman di kedua negara.',
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

    'nav.services': 'Layanan',
    'nav.process': 'Cara kerja',
    'header.cta': 'Konsultasi awal gratis',

    'hero.eyebrow': 'Portugal · Indonesia',
    'hero.title.a': 'Jembatan terpercaya Anda antara',
    'hero.title.pt': 'Portugal',
    'hero.title.and': 'dan',
    'hero.title.id': 'Indonesia',
    'hero.lede': 'Panduan praktis dan pendampingan langsung untuk pendirian usaha, visa, dokumen izin tinggal, dan terjemahan bersertifikat — dari tim bilingual yang akrab dengan kedua negara.',
    'hero.cta1': 'Mulai percakapan gratis',
    'hero.cta2': 'Cara kami bekerja',

    'dir.pt.from': 'Portugal',
    'dir.pt.to': 'Indonesia',
    'dir.pt.title': 'Berkembang ke Indonesia',
    'dir.pt.text': 'Untuk perusahaan dan profesional Portugal yang menjajaki, membeli dari, atau berekspansi ke pasar Indonesia.',
    'dir.pt.tags': 'Masuk pasar · PT PMA · Cek supplier · Visa & KITAS',
    'dir.id.from': 'Indonesia',
    'dir.id.to': 'Portugal',
    'dir.id.title': 'Menetap & berkarya di Portugal',
    'dir.id.text': 'Untuk WNI yang tinggal, kuliah, atau bekerja di Portugal — serta bisnis Indonesia yang berekspansi ke Portugal dan Eropa.',
    'dir.id.tags': 'NIF & NISS · AIMA · Rekening bank · Terjemahan bersertifikat · Pendirian usaha',

    'finder.eyebrow': 'Temukan jalan Anda',
    'finder.title': 'Ceritakan tujuan Anda. | Kami tunjukkan jalannya.',
    'finder.intro': 'Tiga ketukan mengubah situasi Anda — misalnya mengurus NIF atau membuka usaha kuliner di Portugal — menjadi pesan yang jelas untuk tim kami. Tanpa formulir, tanpa akun.',
    'promise.1.t': 'Dibalas langsung oleh orang, bukan bot',
    'promise.1.d': 'Dalam 1–2 hari kerja, dalam bahasa Inggris atau Indonesia.',
    'promise.2.t': 'Orientasi pertama gratis',
    'promise.2.d': 'Gambaran jujur berdasarkan informasi resmi yang terbuka untuk umum.',
    'promise.3.t': 'Pekerjaan lanjutan dengan penawaran di awal',
    'promise.3.d': 'Cakupan, waktu, dan biaya tertulis sebelum pekerjaan dimulai.',
    'finder.head.sub': 'Biasanya membalas dalam 1–2 hari kerja',
    'finder.restart': 'Mulai lagi',
    'finder.q.dir': 'Halo! Ke arah mana tujuan Anda?',
    'finder.q.topic': 'Apa yang perlu kami bantu?',
    'finder.q.time': 'Kapan Anda membutuhkannya?',
    'finder.result.title': '{s} — bagaimana kami bisa membantu',
    'finder.meta.first': 'Orientasi pertama:',
    'finder.meta.free': 'gratis',
    'finder.meta.accomp': 'Pendampingan:',
    'finder.meta.from': 'mulai €15/jam',
    'finder.meta.deeper': 'Pekerjaan lanjutan:',
    'finder.meta.quoted': 'penawaran di awal',
    'finder.wa': 'Kirim lewat WhatsApp',
    'finder.email': 'Kirim lewat email',
    'finder.fine': 'Informasi dan panduan, bukan nasihat hukum. Mohon jangan mengirim dokumen identitas di pesan pertama ini.',
    'msg.direction': 'Arah: {s}',
    'msg.topic': 'Topik: {s}',
    'msg.timing': 'Waktu: {s}',

    'process.eyebrow': 'Cara kami bekerja',
    'process.title': 'Jawaban jujur lebih dulu. | Bantuan lebih dalam saat Anda butuh.',
    'step.1.badge': 'Gratis',
    'step.1.title': 'Ceritakan situasi Anda',
    'step.1.text': 'Cukup pesan singkat lewat WhatsApp atau email. Tanpa biaya, tanpa kewajiban.',
    'step.2.badge': 'Balasan dalam 1–2 hari kerja',
    'step.2.title': 'Orientasi awal gratis',
    'step.2.text': 'Kami pelajari kasus Anda lalu membalas dengan hal yang berlaku, persyaratan utama, dan sumber informasi resminya — atau telepon singkat jika lebih mudah.',
    'step.3.badge': 'Biaya disepakati di awal',
    'step.3.title': 'Mendalami lebih jauh, jika Anda mau',
    'step.3.text': 'Butuh riset yang lebih rinci — misalnya syarat membuka usaha kuliner Indonesia di Portugal, atau prosedur membawa keluarga lewat reagrupamento familiar? Kami kirimkan cakupan, waktu, dan biayanya lebih dulu.',
    'step.4.badge': 'Disepakati tertulis',
    'step.4.title': 'Kami dampingi prosesnya',
    'step.4.text': 'Pendampingan langsung, seperti menemani ke jadwal AIMA, Finanças, atau pembukaan rekening bank. Waktu tambahan hanya ditagih setelah kami menanyakannya kepada Anda.',
    'process.note': 'Pendampingan mulai €15/jam. Apa pun di luar orientasi awal gratis akan diberi penawaran harga sebelum dimulai.',

    'team.eyebrow': 'Jaringan kami',
    'team.title': 'Orang-orang | di balik jembatan ini.',
    'team.bio.btn': 'Profil',
    'team.c1.tag1': 'Double Master · UGM × ISCTE',
    'team.c1.tag2': '9+ tahun di Portugal',
    'team.c1.bio': 'Gelar double master: MBA (FEB UGM) dan M.Sc. International Management (ISCTE-IUL). Sembilan tahun di Portugal, termasuk lima tahun di Seksi Ekonomi Kedutaan Besar Republik Indonesia di Lisbon.',
    'team.c2.tag1': 'M.Sc. Ekonomi · ISEG',
    'team.c2.tag2': '7+ tahun di Portugal',
    'team.c3.tag1': 'M.Sc. Pemasaran Strategis',
    'team.c3.tag2': '6+ tahun di Portugal',
    'team.c4.tag1': 'Native PT & ID',
    'team.c4.tag2': '20+ tahun di Portugal'
  }
};

function initLanguageSystem() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang, true));
  });

  const stored = readStoredLang();
  setLanguage(SUPPORTED_LANGS.includes(stored) ? stored : 'en', false);
}

/* Two-part titles are stored as "first part | second part"; each part becomes
   a .t-line span so the break always falls between them, in every language */
function renderLines(el, value) {
  el.textContent = '';
  value.split('|').map(part => part.trim()).forEach((part, i) => {
    if (i > 0) el.appendChild(document.createTextNode(' '));
    const line = document.createElement('span');
    line.className = 't-line';
    line.textContent = part;
    el.appendChild(line);
  });
}

function setLanguage(lang, persist) {
  const dict = translations[lang];
  if (!dict) return;
  currentLang = lang;
  if (persist) storeLang(lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const value = dict[el.getAttribute('data-i18n')];
    if (value === undefined) return;
    if (el.hasAttribute('data-i18n-lines')) renderLines(el, value);
    else el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const value = dict[el.getAttribute('data-i18n-aria')];
    if (value !== undefined) el.setAttribute('aria-label', value);
  });

  // Legal pages exist per language (PT has /termos.html and /privacidade.html)
  document.querySelectorAll('[data-i18n-href]').forEach(el => {
    const value = dict[el.getAttribute('data-i18n-href')];
    if (value !== undefined) el.setAttribute('href', value);
  });

  document.documentElement.lang = lang;
  document.title = dict['meta.title'];
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute('content', dict['meta.description']);

  document.querySelectorAll('.lang-btn').forEach(b => {
    const isActive = b.dataset.lang === lang;
    b.classList.toggle('is-active', isActive);
    b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  const genericWa = whatsappUrl(dict['msg.generic']);
  document.querySelectorAll('a[data-wa="generic"]').forEach(a => { a.href = genericWa; });

  renderFinder();
}


/* ═══════════════════════════════════════════════════════════════
   6. HEADER, MENU, STICKY WHATSAPP, GUIDES
   ═══════════════════════════════════════════════════════════════ */
function initHeader() {
  const header = $('site-header');
  if (!header) return;
  let ticking = false;
  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  update();
}

let closeMobileMenu = () => {};

function initMobileMenu() {
  const trigger = $('mobile-nav-trigger');
  const menu = $('mobile-menu');
  const closeBtn = $('mobile-menu-close');
  if (!trigger || !menu) return;

  const focusables = () => Array.from(menu.querySelectorAll('a[href]:not([hidden]), button:not([disabled])'));

  function openMenu() {
    menu.classList.add('is-open');
    menu.removeAttribute('inert');
    menu.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    const first = menu.querySelector('.mobile-menu-links a:not([hidden])');
    if (first) first.focus();
  }

  function closeMenu(returnFocus) {
    if (!menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    menu.setAttribute('inert', '');
    menu.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    if (returnFocus) trigger.focus();
  }
  closeMobileMenu = closeMenu;

  trigger.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) closeMenu(true);
    else openMenu();
  });
  if (closeBtn) closeBtn.addEventListener('click', () => closeMenu(true));
  menu.addEventListener('click', (e) => {
    if (e.target === menu) closeMenu(true);
  });
  menu.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => closeMenu(false)));

  document.addEventListener('keydown', (e) => {
    if (!menu.classList.contains('is-open')) return;
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

/* Mobile sticky WhatsApp: hidden while another contact button is on screen */
function initStickyWhatsApp() {
  const sticky = $('sticky-wa');
  const targets = Array.from(document.querySelectorAll('.hero-ctas, #finder-result .actions, #footer'));
  if (!sticky || !('IntersectionObserver' in window)) return;

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

function initGuides() {
  if (!SHOW_GUIDES) return;
  const template = $('insights-template');
  if (!template) return;
  const section = template.content.cloneNode(true);
  section.querySelectorAll('a[data-article-path]').forEach(a => {
    a.href = `/articles/${a.dataset.articlePath}`;
  });
  template.replaceWith(section);
  document.querySelectorAll('[data-guides-link]').forEach(el => { el.hidden = false; });
}


/* ═══════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════ */
initGuides();
initHeader();
initHero();
initFinder();
initTeam();
initLanguageSystem();
initMobileMenu();
initStickyWhatsApp();

/* Restored from the back/forward cache: the page keeps its state,
   so only undo transient UI (an open menu). */
window.addEventListener('pageshow', (e) => {
  if (e.persisted) closeMobileMenu(false);
});
