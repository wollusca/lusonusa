/* ═══════════════════════════════════════════════════════════════
   LUSONUSA — Application Logic
   ═══════════════════════════════════════════════════════════════ */

/* ── Safari bfcache Fix ─────────────────────────────────────────
   Safari aggressively caches pages in its back-forward cache.
   When a page is restored from bfcache, DOMContentLoaded does NOT
   re-fire, leaving scroll-dependent elements stuck at opacity: 0.
   Forcing a reload on bfcache restore guarantees a clean state.
   ─────────────────────────────────────────────────────────────── */
window.addEventListener('pageshow', function (event) {
  if (event.persisted) {
    window.location.reload();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  initHeroScrollTransition();
  initHeroPanels();
  initTeamCards();
  initProblemResolver();
  initLanguageSystem();
  initScrollReveal();
  initVideoSupport();
  initMobileMenu();
});


/* ═══════════════════════════════════════════════════════════════
   1. HERO SCROLL TRANSITION — Cinematic opener → Nav reveal
   ═══════════════════════════════════════════════════════════════
   Phase 1 (scroll 0): Logo centered & large, panels dim, no text
   Phase 2 (scroll 0→300px): Logo fades out, nav fades in,
           panel content fades in from blur, scroll indicator fades
   ═══════════════════════════════════════════════════════════════ */
function initHeroScrollTransition() {
  const heroLogo = document.getElementById('hero-logo');
  const nav = document.getElementById('site-nav');
  const hero = document.getElementById('hero');
  const scrollIndicator = document.getElementById('scroll-indicator');
  const panelContents = document.querySelectorAll('.hero-panel-content');
  const panels = document.querySelectorAll('.hero-panel');
  const gradientVeil = document.querySelector('.nav-gradient-veil');

  if (!heroLogo || !nav || !hero) return;

  const SCROLL_RANGE = 300; // px over which the transition completes
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateHeroState();
        ticking = false;
      });
      ticking = true;
    }
  }

  function updateHeroState() {
    const heroRect = hero.getBoundingClientRect();
    const totalScroll = Math.max(1, hero.offsetHeight - window.innerHeight);
    const currentScroll = Math.max(0, -heroRect.top);
    const progress = Math.min(Math.max(0, currentScroll / totalScroll), 1);
    const eased = easeOutCubic(progress);
    const viewportH = window.innerHeight;

    // ── Logo Overlay: move from center to lowered top (48px) ──
    const startTop = viewportH * 0.5;     // 50vh (centered)
    const endTop = 48;                     // 48px from top (lowered resting position)
    const currentTop = startTop + (endTop - startTop) * eased;
    const logoScale = 1 - eased * 0.52;   // 1.0 → 0.48

    heroLogo.style.top = `${currentTop}px`;
    heroLogo.style.transform = `translate(-50%, -50%) scale(${logoScale})`;

    // ── Subtitle: fades out slowly, fully gone BEFORE menu pill appears (40%) ──
    const subEl = heroLogo.querySelector('.hero-logo-sub');
    if (subEl) {
      if (progress > 0.01) {
        subEl.style.animation = 'none'; // Cancel CSS animation so JS opacity takes effect
      }
      const subOpacity = Math.max(0, 1 - progress * 2.8); // fades slowly, gone by ~36% scroll
      subEl.style.opacity = subOpacity;
    }

    // ── Navigation Pill: STAYS HIDDEN until logo reaches top (40% scroll), then fades in ──
    if (progress >= 0.40) {
      const navProgress = Math.min(1, (progress - 0.40) / 0.35); // 40% → 75% scroll
      const navOpacity = easeOutCubic(navProgress);
      nav.style.opacity = navOpacity;
      if (navOpacity > 0.05) {
        nav.classList.add('visible');
      } else {
        nav.classList.remove('visible');
      }
    } else {
      nav.style.opacity = 0;
      nav.classList.remove('visible');
    }

    // ── Panel Content (Luso/Nusa text & pills): continuous, slow unblur over 70% scroll window ──
    const contentProgress = Math.max(0, Math.min(1, (progress - 0.20) / 0.70)); // 20% → 90% scroll
    const contentEased = easeOutCubic(contentProgress);
    panelContents.forEach(content => {
      content.style.opacity = contentEased;
      content.style.filter = `blur(${(1 - contentEased) * 16}px)`;
      content.style.transform = `translateY(${(1 - contentEased) * 20}px)`;
    });

    // ── Panels: brighten from 30% dimmed state ──
    const brightnessProgress = easeOutCubic(progress);
    const panelBrightness = 0.7 + brightnessProgress * 0.3; // 0.7 → 1.0
    panels.forEach(panel => {
      panel.style.filter = `brightness(${panelBrightness})`;
    });

    // ── Hover box expansion: unlocks ONLY after menu is fully revealed ──
    if (progress >= 0.95) {
      hero.classList.add('hero-scrolled');
    } else {
      hero.classList.remove('hero-scrolled');
    }

    // ── Scroll Indicator: fade out ──
    if (scrollIndicator) {
      if (progress > 0.15) {
        scrollIndicator.classList.add('faded');
      } else {
        scrollIndicator.classList.remove('faded');
      }
    }

    // ── Gradient Veil: activate once hero scrolls away to keep nav area focused ──
    if (gradientVeil) {
      if (progress >= 0.95) {
        gradientVeil.classList.add('active');
      } else {
        gradientVeil.classList.remove('active');
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Run once on load (in case page is already scrolled or has hash)
  updateHeroState();

  if (window.location.hash || window.scrollY > 100) {
    nav.classList.add('visible');
    nav.style.opacity = 1;
    panelContents.forEach(content => {
      content.style.opacity = 1;
      content.style.filter = 'blur(0px)';
      content.style.transform = 'translateY(0px)';
    });
  }
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}


/* ═══════════════════════════════════════════════════════════════
   2. HERO PANEL — Click-to-scroll to Resolver Section
   ═══════════════════════════════════════════════════════════════ */
function initHeroPanels() {
  const panelLuso = document.getElementById('panel-luso');
  const panelNusa = document.getElementById('panel-nusa');
  const cursorBadge = document.getElementById('hero-cursor-badge');
  const cursorText = document.getElementById('hero-cursor-text');
  const hero = document.getElementById('hero');

  if (!panelLuso || !panelNusa) return;

  panelLuso.addEventListener('click', () => {
    activateResolverTab('luso');
    scrollToResolver();
  });

  panelNusa.addEventListener('click', () => {
    activateResolverTab('nusa');
    scrollToResolver();
  });

  [panelLuso, panelNusa].forEach(panel => {
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        panel.click();
      }
    });
  });

  // ── Mouse Follower CTA Badge (Option A) ─────────────
  if (!cursorBadge || !cursorText) return;

  function updateBadgeText(type) {
    const key = type === 'luso' ? 'hero.luso.cta' : 'hero.nusa.cta';
    const text = (translations[currentLang] && translations[currentLang][key]) || translations.en[key];
    cursorText.textContent = text;
  }

  function handleMouseMove(e, type) {
    // Only show mouse follower after scroll transition is active
    if (hero && hero.classList.contains('hero-scrolled')) {
      updateBadgeText(type);
      cursorBadge.style.left = `${e.clientX}px`;
      cursorBadge.style.top = `${e.clientY}px`;
      cursorBadge.classList.add('active');
    } else {
      cursorBadge.classList.remove('active');
    }
  }

  panelLuso.addEventListener('mousemove', (e) => handleMouseMove(e, 'luso'));
  panelNusa.addEventListener('mousemove', (e) => handleMouseMove(e, 'nusa'));

  panelLuso.addEventListener('mouseleave', () => cursorBadge.classList.remove('active'));
  panelNusa.addEventListener('mouseleave', () => cursorBadge.classList.remove('active'));
}

function scrollToResolver() {
  const resolver = document.getElementById('resolver');
  if (resolver) {
    resolver.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


/* ═══════════════════════════════════════════════════════════════
   3. INTERACTIVE 3D FLIP CARDS ("OUR TEAM")
   ═══════════════════════════════════════════════════════════════ */
function initTeamCards() {
  const cards = document.querySelectorAll('.team-flip-card');
  const badge = document.getElementById('team-cursor-badge');
  if (!cards.length) return;

  function hideBadge() {
    if (badge) badge.classList.remove('active');
  }

  cards.forEach(card => {
    const cardInner = card.querySelector('.team-flip-card-inner');
    if (!cardInner) return;

    let currentAngle = 0; // Cumulative Y rotation angle in degrees
    let startX = 0;
    let startY = 0;
    let initialAngle = 0;
    let isDragging = false;
    let isHorizontalGesture = false;

    function setCardRotation(angle, animated = true, duration = 0.7) {
      currentAngle = angle;
      if (animated) {
        cardInner.style.transition = `transform ${duration}s cubic-bezier(0.33, 1, 0.68, 1), -webkit-transform ${duration}s cubic-bezier(0.33, 1, 0.68, 1)`;
      } else {
        cardInner.style.transition = 'none';
      }

      cardInner.style.transform = `rotateY(${angle}deg)`;
      cardInner.style.webkitTransform = `rotateY(${angle}deg)`;

      // Card face is flipped if angle normalized modulo 360 is around 180deg
      const norm = Math.abs(angle % 360);
      const isFlipped = norm > 45 && norm < 315;
      card.classList.toggle('is-flipped', isFlipped);
      card.setAttribute('aria-expanded', isFlipped ? 'true' : 'false');
    }

    // Touch Event Listeners for Touchscreens & Tablets
    card.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      initialAngle = currentAngle;
      isDragging = true;
      isHorizontalGesture = false;
      hideBadge();
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const deltaX = touchX - startX;
      const deltaY = touchY - startY;

      // Lock direction after 10px movement
      if (!isHorizontalGesture) {
        if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
          isHorizontalGesture = true;
        } else if (Math.abs(deltaY) > 10) {
          isDragging = false;
          return;
        }
      }

      if (isHorizontalGesture) {
        if (e.cancelable) e.preventDefault();
        const cardWidth = card.offsetWidth || 300;
        // Dragging full card width rotates 180 degrees
        const angleChange = (deltaX / cardWidth) * 180;
        setCardRotation(initialAngle + angleChange, false);
      }
    }, { passive: false });

    function handleTouchEnd(e) {
      if (!isDragging) return;
      isDragging = false;

      const touch = (e.changedTouches && e.changedTouches.length) ? e.changedTouches[0] : null;
      const deltaX = touch ? (touch.clientX - startX) : 0;

      if (isHorizontalGesture && Math.abs(deltaX) > 30) {
        // Complete the flip in the direction of finger drag
        if (deltaX > 0) {
          // Swiped Right -> increase rotation to next +180 step
          const target = Math.ceil(initialAngle / 180) * 180;
          const finalAngle = (target > initialAngle) ? target : (initialAngle + 180);
          setCardRotation(finalAngle, true, 0.7);
        } else {
          // Swiped Left -> decrease rotation to next -180 step
          const target = Math.floor(initialAngle / 180) * 180;
          const finalAngle = (target < initialAngle) ? target : (initialAngle - 180);
          setCardRotation(finalAngle, true, 0.7);
        }
      } else if (isHorizontalGesture) {
        // Dragged less than 30px -> snap back smoothly to nearest 180 step
        const snapAngle = Math.round(initialAngle / 180) * 180;
        setCardRotation(snapAngle, true, 0.4);
      }

      isHorizontalGesture = false;
    }

    card.addEventListener('touchend', handleTouchEnd, { passive: true });
    card.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    // Click / Tap Fallback (for mouse clicks or simple touch taps)
    card.addEventListener('click', (e) => {
      if (isHorizontalGesture) return; // Ignore if user was swiping
      const nextAngle = (currentAngle % 180 === 0) ? (currentAngle + 180) : Math.round(currentAngle / 180) * 180;
      setCardRotation(nextAngle, true, 0.75);
      hideBadge();
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const nextAngle = (currentAngle % 180 === 0) ? (currentAngle + 180) : Math.round(currentAngle / 180) * 180;
        setCardRotation(nextAngle, true, 0.75);
      }
    });

    // Mouse Follower Badge (Desktop)
    if (badge) {
      card.addEventListener('mousemove', (e) => {
        if (!card.classList.contains('is-flipped')) {
          badge.style.left = `${e.clientX}px`;
          badge.style.top = `${e.clientY}px`;
          badge.classList.add('active');
        } else {
          hideBadge();
        }
      });
      card.addEventListener('mouseleave', () => {
        hideBadge();
      });
    }
  });
}


/* ═══════════════════════════════════════════════════════════════
   4. INTERACTIVE PROBLEM RESOLVER — WhatsApp Lead Engine
   ═══════════════════════════════════════════════════════════════ */

const WHATSAPP_NUMBER = '351930534440'; // Replace with actual number

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
          'Assisted NIF & NISS acquisition without local bureaucracy hurdles.',
          'Bank account opening support & SIM card registration in Portugal.',
          'Document preparation guidance & in-person orientation for AIMA scheduling.'
        ],
        pt: [
          'Assistência na obtenção de NIF e NISS sem obstáculos burocráticos.',
          'Apoio na abertura de conta bancária e registo de cartão SIM em Portugal.',
          'Orientação na preparação documental e acompanhamento presencial para agendamento AIMA.'
        ],
        id: [
          'Pendampingan perolehan NIF & NISS tanpa kendala birokrasi lokal.',
          'Asistensi pembukaan rekening bank Portugal & registrasi SIM Card.',
          'Panduan persiapan dokumen & orientasi tatap muka untuk jadwal AIMA.'
        ]
      },
      waText: {
        en: 'Hello LUSONUSA! My name is [Name]. I need help regarding Bureaucracy (NIF, NISS, Bank & AIMA Guidance). Details: [explain details here]',
        pt: 'Olá LUSONUSA! O meu nome é [Nome]. Preciso de ajuda com Burocracia (NIF, NISS, Banco & Orientação AIMA). Detalhes: [explique detalhes aqui]',
        id: 'Halo LUSONUSA! Nama saya [Nama]. Saya butuh bantuan terkait pengurusan Birokrasi (NIF, NISS, Bank, & Pendampingan AIMA). Detail: [jelaskan detail di sini]'
      }
    },
    {
      id: 'marriage-legal',
      icon: 'file-text',
      label: {
        en: 'Business & Legal Documents',
        pt: 'Documentos Empresariais & Legais',
        id: 'Dokumen Bisnis & Legalitas'
      },
      bullets: {
        en: [
          'Legal compliance & documentation guidance for business setup & contracts in Portugal.',
          'Coordination of sworn & notarized translations (Indonesian ↔ European Portuguese).',
          'Document legalization & Apostille assistance at relevant institutions and the Embassy.'
        ],
        pt: [
          'Orientação sobre requisitos legais e documentais para constituição de empresas e contratos em Portugal.',
          'Coordenação de traduções notariadas (Indonésio ↔ Português Europeu).',
          'Assistência na legalização de documentos e Apostila em instituições relevantes e na Embaixada.'
        ],
        id: [
          'Panduan syarat hukum & dokumen pendirian usaha serta kontrak bisnis di Portugal.',
          'Koordinasi penerjemahan tersumpah & notaris resmi (Bahasa Indonesia ↔ Portugis Portugal).',
          'Asistensi legalisasi dokumen & Apostille di instansi terkait dan Kedutaan.'
        ]
      },
      waText: {
        en: 'Hello LUSONUSA! My name is [Name]. I need information and help with Business & Legal Documents & Notarized Translation. Details: [explain details here]',
        pt: 'Olá LUSONUSA! O meu nome é [Nome]. Preciso de informação e ajuda com Documentos Empresariais & Tradução Notariada. Detalhes: [explique detalhes aqui]',
        id: 'Halo LUSONUSA! Nama saya [Nama]. Saya butuh informasi dan bantuan terkait Dokumen Bisnis & Penerjemahan Notaris. Detail: [jelaskan detail di sini]'
      }
    },
    {
      id: 'student-housing',
      icon: 'home',
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
      },
      waText: {
        en: 'Hello LUSONUSA! My name is [Name]. I\'m a student/future resident who needs help with Accommodation Search & Orientation. Details: [explain details here]',
        pt: 'Olá LUSONUSA! O meu nome é [Nome]. Sou estudante/futuro residente e preciso de ajuda com Alojamento & Orientação. Detalhes: [explique detalhes aqui]',
        id: 'Halo LUSONUSA! Nama saya [Nama]. Saya mahasiswa/calon menetap yang membutuhkan bantuan Pencarian Akomodasi & Orientasi. Detail: [jelaskan detail di sini]'
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
          'Private bilingual local guide & orientation escort for business or leisure trips.',
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
      },
      waText: {
        en: 'Hello LUSONUSA! My name is [Name]. I need assistance regarding Bilingual Local Guide & Travel Suggestions in Portugal. Details: [explain details here]',
        pt: 'Olá LUSONUSA! O meu nome é [Nome]. Preciso de assistência com Guia Local e Sugestões de Viagem em Portugal. Detalhes: [explique detalhes aqui]',
        id: 'Halo LUSONUSA! Nama saya [Nama]. Saya membutuhkan bantuan Panduan Tour Lokal & Rekomendasi Wisata di Portugal. Detail: [jelaskan detail di sini]'
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
      },
      waText: {
        en: 'Hello LUSONUSA! My name is [Name]. I need assistance regarding Rental Cars, Hotel Booking & Transport Logistics in Portugal. Details: [explain details here]',
        pt: 'Olá LUSONUSA! O meu nome é [Nome]. Preciso de assistência com Carro de Aluguer, Reserva de Hotéis e Logística de Transporte em Portugal. Detalhes: [explique detalhes aqui]',
        id: 'Halo LUSONUSA! Nama saya [Nama]. Saya membutuhkan bantuan Sewa Mobil, Pemesanan Hotel & Logistik Transportasi di Portugal. Detail: [jelaskan detail di sini]'
      }
    }
  ],
  luso: [
    {
      id: 'partner-scam-check',
      icon: 'shield-check',
      label: {
        en: 'Company Verification & Fraud Prevention',
        pt: 'Verificação de Empresa & Prevenção de Burlas',
        id: 'Verifikasi Perusahaan & Pencegahan Penipuan'
      },
      bullets: {
        en: [
          'Validation of company and business partner legitimacy in Indonesia.',
          'Facilitation of online meetings with identity and credential verification.',
          'Minimization of operational risks in international transactions.'
        ],
        pt: [
          'Validação de legitimidade de empresas e parceiros comerciais na Indonésia.',
          'Facilitação de reuniões online com verificação de identidade e credenciais.',
          'Minimização de riscos operacionais em transações internacionais.'
        ],
        id: [
          'Validasi legitimasi perusahaan dan mitra bisnis di Indonesia.',
          'Fasilitasi pertemuan online dengan verifikasi identitas dan kredensial.',
          'Minimalisasi risiko operasional dalam transaksi internasional.'
        ]
      },
      waText: {
        en: 'Hello LUSONUSA! My name is [Name]. I\'d like to request Company Verification in Indonesia. Details: [explain details here]',
        pt: 'Olá LUSONUSA! O meu nome é [Nome]. Gostaria de agendar Verificação de Empresa na Indonésia. Detalhes: [explique detalhes aqui]',
        id: 'Halo LUSONUSA! Nama saya [Nama]. Saya ingin konsultasi Verifikasi Perusahaan di Indonesia. Detail: [jelaskan detail di sini]'
      }
    },
    {
      id: 'pt-pma-setup',
      icon: 'building-2',
      label: {
        en: 'Company Setup in Indonesia (PT PMA) & Taxes',
        pt: 'Abertura de Empresa na Indonésia (PT PMA) & Impostos',
        id: 'Pendirian PT PMA di Indonesia & Pajak'
      },
      bullets: {
        en: [
          'Consulting on legal structure for foreign investment (PT PMA).',
          'Market entry strategy and tax framework advisory.',
          'Direct connection with the Indonesia-Portugal Chamber of Commerce.'
        ],
        pt: [
          'Consultoria sobre estrutura legal para investimento estrangeiro (PT PMA).',
          'Aconselhamento sobre estratégia de entrada no mercado e enquadramento fiscal.',
          'Conexão direta com a Câmara de Comércio e Indústria Indonésia-Portugal.'
        ],
        id: [
          'Konsultasi struktur hukum untuk investasi asing (PT PMA).',
          'Penasihat strategi masuk pasar dan kerangka pajak.',
          'Koneksi langsung dengan Kamar Dagang Indonesia-Portugal.'
        ]
      },
      waText: {
        en: 'Hello LUSONUSA! My name is [Name]. I need advisory for Company Setup in Indonesia (PT PMA). Details: [explain details here]',
        pt: 'Olá LUSONUSA! O meu nome é [Nome]. Preciso de consultoria para Abertura de Empresa na Indonésia (PT PMA). Detalhes: [explique detalhes aqui]',
        id: 'Halo LUSONUSA! Nama saya [Nama]. Saya butuh konsultasi Pendirian PT PMA di Indonesia. Detail: [jelaskan detail di sini]'
      }
    },
    {
      id: 'export-import-trade',
      icon: 'ship',
      label: {
        en: 'Export-Import & Trade Compliance',
        pt: 'Exportação-Importação & Conformidade Comercial',
        id: 'Ekspor-Impor & Kepatuhan Perdagangan'
      },
      bullets: {
        en: [
          'Guidance on customs regulations, import duties, and trade permits (PT ↔ ID).',
          'Advisory on cross-border shipping logistics, freight compliance, and contracts.',
          'Administrative support for bilateral commercial trade operations.'
        ],
        pt: [
          'Orientação sobre regulamentos alfandegários, direitos de importação e licenças comerciais.',
          'Aconselhamento sobre logística de envio transfronteiriço e contratos comerciais.',
          'Apoio administrativo para operações de comércio bilateral.'
        ],
        id: [
          'Panduan regulasi beacukai, bea impor, & izin perdagangan (PT ↔ ID).',
          'Konsultasi logistik pengiriman lintas batas & kontrak perdagangan.',
          'Dukungan administratif untuk operasi perdagangan komersial bilateral.'
        ]
      },
      waText: {
        en: 'Hello LUSONUSA! My name is [Name]. I need advisory regarding Export-Import & Trade Compliance between Portugal and Indonesia. Details: [explain details here]',
        pt: 'Olá LUSONUSA! O meu nome é [Nome]. Preciso de consultoria sobre Exportação-Importação entre Portugal e Indonésia. Detalhes: [explique detalhes aqui]',
        id: 'Halo LUSONUSA! Nama saya [Nama]. Saya butuh konsultasi Ekspor-Impor & Kepatuhan Perdagangan Portugal-Indonesia. Detail: [jelaskan detail di sini]'
      }
    },
    {
      id: 'indonesia-visa-advisory',
      icon: 'file-badge',
      label: {
        en: 'Indonesia Visa & KITAS Advisory',
        pt: 'Consultoria de Vistos e KITAS para a Indonésia',
        id: 'Konsultasi Visa & KITAS Indonesia'
      },
      bullets: {
        en: [
          'Consultation on Business Visas (B211A), Working Visas, and Investor KITAS.',
          'Family stay permits (ITAS/ITAP) and residence compliance for expats in Indonesia.',
          'Step-by-step guidance on official immigration sponsorship and extensions.'
        ],
        pt: [
          'Consultoria sobre Vistos de Negócios (B211A), Vistos de Trabalho e KITAS de Investidor.',
          'Permissões de residência familiar (ITAS/ITAP) e conformidade para residentes na Indonésia.',
          'Orientação passo a passo sobre patrocínio de imigração e prorrogações oficiais.'
        ],
        id: [
          'Konsultasi Visa Bisnis (B211A), Visa Kerja, & KITAS Investor.',
          'Izin tinggal keluarga (ITAS/ITAP) & kepatuhan imigrasi expat di Indonesia.',
          'Panduan penjaminan (sponsor) imigrasi resmi & prosedur perpanjangan.'
        ]
      },
      waText: {
        en: 'Hello LUSONUSA! My name is [Name]. I need consultation regarding Indonesia Visa & KITAS (Business / Residence). Details: [explain details here]',
        pt: 'Olá LUSONUSA! O meu nome é [Nome]. Preciso de consultoria sobre Vistos e KITAS para a Indonésia. Detalhes: [explique detalhes aqui]',
        id: 'Halo LUSONUSA! Nama saya [Nama]. Saya membutuhkan konsultasi Visa & KITAS Indonesia. Detail: [jelaskan detail di sini]'
      }
    },
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
          'Sample inspection, quality control advisory, and direct factory communication.',
          'Connection with verified exporters across furniture, handicrafts, textiles, and commodities.'
        ],
        pt: [
          'Identificação e verificação de fabricantes e fornecedores de confiança na Indonésia.',
          'Inspeção de amostras, controlo de qualidade e comunicação direta com fábricas.',
          'Conexão com exportadores verificados de mobiliário, artesanato, têxteis e mercadorias.'
        ],
        id: [
          'Identifikasi & verifikasi produsen/supplier terpercaya di Indonesia.',
          'Inspeksi sampel, penasihat kontrol kualitas, & komunikasi pabrik langsung.',
          'Koneksi dengan eksportir terverifikasi sektor mebel, kerajinan, tekstil, & komoditas.'
        ]
      },
      waText: {
        en: 'Hello LUSONUSA! My name is [Name]. I am looking for Product Sourcing & Supplier Matchmaking in Indonesia. Details: [explain details here]',
        pt: 'Olá LUSONUSA! O meu nome é [Nome]. Procuro serviços de Procura de Produtos e Fornecedores na Indonésia. Detalhes: [explique detalhes aqui]',
        id: 'Halo LUSONUSA! Nama saya [Nama]. Saya mencari layanan Pencarian Produk & Supplier di Indonesia. Detail: [jelaskan detail di sini]'
      }
    }
  ]
};

let currentAudience = 'nusa';
let currentScenario = null;
let currentLang = 'en';

function initProblemResolver() {
  const tabs = document.querySelectorAll('.resolver-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const audience = tab.dataset.audience;
      setActiveTab(audience);
      renderPills(audience);
      resetSolutionCard();
    });
  });

  renderPills('nusa');
}

function activateResolverTab(audience) {
  setActiveTab(audience);
  renderPills(audience);
  resetSolutionCard();
}

function setActiveTab(audience) {
  currentAudience = audience;
  currentScenario = null;

  const tabs = document.querySelectorAll('.resolver-tab');
  tabs.forEach(tab => {
    const isActive = tab.dataset.audience === audience;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
}

function renderPills(audience) {
  const container = document.getElementById('resolver-pills');
  if (!container) return;

  const scenarios = problemMatrix[audience];
  container.innerHTML = '';

  scenarios.forEach((scenario, index) => {
    const pill = document.createElement('button');
    pill.classList.add('resolver-pill');
    pill.setAttribute('role', 'option');
    pill.setAttribute('aria-selected', 'false');
    pill.setAttribute('id', `pill-${scenario.id}`);

    const label = scenario.label[currentLang] || scenario.label.en;
    pill.innerHTML = `
      <i data-lucide="${scenario.icon}"></i>
      <span>${label}</span>
    `;

    pill.style.opacity = '0';
    pill.style.translate = '0 10px';
    pill.style.transition = `opacity 0.4s ease ${index * 0.08}s, translate 0.4s ease ${index * 0.08}s`;
    requestAnimationFrame(() => {
      pill.style.opacity = '1';
      pill.style.translate = '0 0';
    });

    pill.addEventListener('click', () => {
      selectScenario(audience, scenario, pill);
    });

    container.appendChild(pill);
  });

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function selectScenario(audience, scenario, activePill) {
  currentScenario = scenario;

  const pills = document.querySelectorAll('.resolver-pill');
  pills.forEach(p => {
    p.classList.remove('active', 'nusa-active');
    p.setAttribute('aria-selected', 'false');
  });
  activePill.classList.add('active');
  if (audience === 'nusa') activePill.classList.add('nusa-active');
  activePill.setAttribute('aria-selected', 'true');

  const emptyState = document.querySelector('.resolver-solution-empty');
  const contentState = document.getElementById('resolver-solution-content');
  const titleEl = document.getElementById('resolver-solution-title');
  const bulletsEl = document.getElementById('resolver-solution-bullets');
  const waBtn = document.getElementById('resolver-wa-btn');

  if (!contentState) return;

  if (emptyState) emptyState.style.display = 'none';
  contentState.style.display = 'block';

  contentState.style.opacity = '0';
  contentState.style.translate = '0 10px';
  contentState.style.transition = 'opacity 0.4s ease, translate 0.4s ease';
  requestAnimationFrame(() => {
    contentState.style.opacity = '1';
    contentState.style.translate = '0 0';
  });

  const label = scenario.label[currentLang] || scenario.label.en;
  const bullets = scenario.bullets[currentLang] || scenario.bullets.en;
  const waText = scenario.waText[currentLang] || scenario.waText.en;

  if (titleEl) titleEl.textContent = label;
  if (bulletsEl) {
    bulletsEl.innerHTML = bullets.map(b => `<li>${b}</li>`).join('');
  }
  if (waBtn) {
    waBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;
  }
}

function resetSolutionCard() {
  const emptyState = document.querySelector('.resolver-solution-empty');
  const contentState = document.getElementById('resolver-solution-content');
  if (emptyState) emptyState.style.display = 'flex';
  if (contentState) contentState.style.display = 'none';
}


/* ═══════════════════════════════════════════════════════════════
   5. LANGUAGE SYSTEM (i18n)
   ═══════════════════════════════════════════════════════════════ */
/* Translation Dictionaries */
const translations = {
  en: {
    // Nav
    'nav.services': 'Services',
    'nav.process': 'Process',
    'nav.team': 'Team',
    'nav.insights': 'Insights',
    'nav.contact': 'Contact',

    // Hero
    'hero.luso.sub': 'Connecting Portuguese business to the Indonesian market.',
    'hero.nusa.sub': 'Trusted solutions for Indonesians in Portugal.',
    'hero.luso.cta': 'Click to Explore PT → ID Solutions ↗',
    'hero.nusa.cta': 'Click to Explore ID → PT Solutions ↗',
    'hero.luso.pill1': 'Company Verification',
    'hero.luso.pill2': 'PT PMA Setup',
    'hero.luso.pill3': 'Export-Import Advisory',
    'hero.luso.pill4': 'Indonesia Visa & KITAS',
    'hero.luso.pill5': 'Product Sourcing',
    'hero.nusa.pill1': 'AIMA Assistance',
    'hero.nusa.pill2': 'NIF & NISS',
    'hero.nusa.pill3': 'Bank Account Opening',
    'hero.nusa.pill4': 'Business & Legal Docs',
    'hero.nusa.pill5': 'Notarized Translation',
    'hero.nusa.pill6': 'Local Guide & Travel',

    // Resolver
    'resolver.eyebrow': 'How Can We Help?',
    'resolver.title': 'What Is Your Immediate Challenge?',
    'resolver.subtitle': 'Select your situation to generate an instant resolution roadmap with a direct line to our team.',
    'resolver.tab.nusa': 'For Indonesians in/to Portugal',
    'resolver.tab.luso': 'For Portuguese Businesses & Citizens',
    'resolver.empty': 'Select a scenario above to see your resolution roadmap.',
    'resolver.wa.btn': 'Start WhatsApp Consultation',

    // Workflow
    'workflow.eyebrow': 'Our Guarantee & Promise',
    'workflow.title': 'How We Support & Guide You',
    'workflow.subtitle': 'A friendly, step-by-step approach designed to give you clarity, peace of mind, and real solutions.',
    'workflow.s1.badge': '100% Free & Casual',
    'workflow.s1.title': "Tell Us What's On Your Mind",
    'workflow.s1.desc': 'Send us a quick message via WhatsApp detailing your challenge. No fees, no obligations—just a friendly listening ear ready to help.',
    'workflow.s2.badge': '1–2 Days Research',
    'workflow.s2.title': 'We Prepare Before We Talk',
    'workflow.s2.desc': 'Before our call, our team takes 1–2 business days to review your case, research legal rules, and prepare actionable steps so our talk is genuinely useful.',
    'workflow.s3.badge': 'Friendly & Free',
    'workflow.s3.title': 'Warm Initial Consultation',
    'workflow.s3.desc': 'A relaxed 1-on-1 discussion to explore your options. If your problem is simple, we will give you the exact step-by-step roadmap to solve it yourself—completely free.',
    'workflow.s4.badge': 'Transparent & Fair',
    'workflow.s4.title': 'Tailored Support, Your Way',
    'workflow.s4.desc': "If you'd like us by your side, we offer flexible assistance—from self-guided roadmaps to document notarization and ground escort—at clear, honest rates.",

    // Pathways
    'pathways.eyebrow': 'Resolution Pathways & Pricing Philosophy',
    'pathways.title': 'Transparent Options Built Around Your Needs',
    'pathway.p1.name': '1. Free Community Advice',
    'pathway.p1.desc': 'Basic questions & general guidance answered during the free call. Perfect if you can handle filings yourself.',
    'pathway.p1.price': '€0 • Pro-Bono',
    'pathway.p2.name': '2. Document & Report Prep',
    'pathway.p2.desc': 'Legalized translations (Notary), NIF/NISS setups, business roadmaps, and custom compliance reports.',
    'pathway.p2.price': 'Fixed Transparent Fee',
    'pathway.p3.name': '3. Ground Escort & Guide',
    'pathway.p3.desc': 'In-person attendance for AIMA appointments, Bank visits, PT PMA corporate setups, or bilingual local guide escort.',
    'pathway.p3.price': 'Fixed Package or Hourly',
    'pathways.note': 'Purchasing Power Equity: We tailor our fees fairly—offering accessible rates for individual community members while providing enterprise-grade consulting for businesses.',

    // Insights
    'insights.eyebrow': 'Bilateral Knowledge Hub',
    'insights.title': 'Guides & Operational Insights',
    'insights.subtitle': 'In-depth regulatory analyses, visa compliance guides, and market entry roadmaps for Portugal and Indonesia.',

    // Team
    'team.eyebrow': 'Our Team',
    'team.title': 'The Collaborators Behind the Bilateral Bridge',
    'team.subtitle': 'A multidisciplinary team of bilingual professionals embedded in both nations.',
    'team.flip.badge': 'Click to flip',
    'team.flip.back': 'Click to flip back',
    'team.touch.cue': 'Swipe to flip',
    'team.c1.role': 'FOUNDER',
    'team.c1.title': 'Business & Bilateral Relations Lead',
    'team.c1.bio': '9+ years residing in Portugal with 5 years of service in the Economic Section of the Embassy of the Republic of Indonesia in Lisbon. Specialist in diplomatic protocol, cross-border business setup, and administrative navigation.',
    'team.c1.lang': 'English & Indonesian',
    'team.c2.role': 'Banking & Financial Compliance Lead',
    'team.c2.title': 'Banking & Financial Advisory Specialist',
    'team.c2.bio': '7+ years residing in Portugal with a Master of Science in Economics from ISEG Lisbon. Currently active in the European banking sector, bringing domain expertise in capital movements, cross-border financial flows, and compliance.',
    'team.c2.lang': 'English & Indonesian',
    'team.c3.role': 'Technology & AI Strategy Lead',
    'team.c3.title': 'Digital Transformation & Innovation Specialist',
    'team.c3.bio': 'M.Sc. in Strategic Marketing currently leading enterprise tech initiatives. Specializes in digital workflow adaptation, modern market expansion, and business AI adoption across cross-border operations.',
    'team.c3.lang': 'English & Indonesian',
    'team.c4.role': 'TRANSLATION SPECIALIST',
    'team.c4.title': 'Legal & Notarized Translation Lead',
    'team.c4.bio': 'Native bilingual specialist (Portuguese-Portugal / Indonesian) recognized by the Embassy of Indonesia in Lisbon. Executes official legal, civil, and corporate translations, officially legalized through certified Portuguese Notaries (Notários). Jobs scheduled after pre-intake feasibility appraisal.',
    'team.c4.lang': 'Português & Indonesian',

    // Footer
    'footer.tagline': 'Bilateral Advisory & Cross-Border Consulting',
    'footer.contact.title': 'Get in Touch',
    'footer.contact.sub': 'Direct Assistance & Consultations',
    'footer.wa.btn': 'Direct WhatsApp Consultation',
    'footer.hours': 'Service Hours: Mon – Fri | 10:00 – 16:00 WET (Portugal) / 16:00 – 22:00 WIB (Indonesia)',
    'footer.consult': 'Consultations conducted in English & Indonesian.',
    'footer.legal': 'Legal notarization & administrative support executed via native Portuguese specialists & certified Notaries.',
    'footer.entity': 'Operating as PT Wollusca Sukses Bersama (Purwokerto, Jawa Tengah)'
  },

  pt: {
    'nav.services': 'Serviços',
    'nav.process': 'Processo',
    'nav.team': 'Equipa',
    'nav.contact': 'Contacto',

    'hero.luso.sub': 'Conectando negócios portugueses ao mercado indonésio.',
    'hero.nusa.sub': 'Soluções de confiança para indonésios em Portugal.',
    'hero.luso.cta': 'Clique para Explorar Soluções PT → ID ↗',
    'hero.nusa.cta': 'Clique para Explorar Soluções ID → PT ↗',
    'hero.luso.pill1': 'Verificação de Empresa',
    'hero.luso.pill2': 'Criação de PT PMA',
    'hero.luso.pill3': 'Exportação & Importação',
    'hero.luso.pill4': 'Vistos & KITAS Indonésia',
    'hero.luso.pill5': 'Procura de Produtos',
    'hero.nusa.pill1': 'Apoio AIMA',
    'hero.nusa.pill2': 'NIF & NISS',
    'hero.nusa.pill3': 'Conta Bancária',
    'hero.nusa.pill4': 'Documentos Empresariais & Legais',
    'hero.nusa.pill5': 'Tradução Notariada',
    'hero.nusa.pill6': 'Guia Local & Viagem',

    'resolver.eyebrow': 'Como Podemos Ajudar?',
    'resolver.title': 'Qual é o Seu Desafio Imediato?',
    'resolver.subtitle': 'Selecione a sua situação e obtenha um plano de resolução instantâneo com linha direta à nossa equipa.',
    'resolver.tab.nusa': 'Para Indonésios em/para Portugal',
    'resolver.tab.luso': 'Para Empresas e Cidadãos Portugueses',
    'resolver.empty': 'Selecione um cenário acima para ver o plano de resolução.',
    'resolver.wa.btn': 'Iniciar Consulta via WhatsApp',

    'workflow.eyebrow': 'Nossa Garantia e Promessa',
    'workflow.title': 'Como Acompanhamos e Guiamos a Sua Jornada',
    'workflow.subtitle': 'Uma abordagem humana e acolhedora—concebida para lhe dar clareza, tranquilidade e soluções reais.',
    'workflow.s1.badge': '100% Grátis & Sem Custos',
    'workflow.s1.title': 'Partilhe a Sua Situação',
    'workflow.s1.desc': 'Envie-nos uma breve mensagem pelo WhatsApp. Sem custos, sem compromisso—estamos aqui para ouvir e encontrar a melhor solução.',
    'workflow.s2.badge': '1–2 Dias de Pesquisa',
    'workflow.s2.title': 'Preparamos Tudo Antes de Falar',
    'workflow.s2.desc': 'Antes da nossa conversa, a nossa equipa analisa o seu caso durante 1–2 dias para pesquisar requisitos legais e garantir soluções concretas.',
    'workflow.s3.badge': 'Consulta Gratuita',
    'workflow.s3.title': 'Consulta Inicial Amigável',
    'workflow.s3.desc': 'Uma conversa tranquila de 1 para 1. Se a sua questão for simples, dar-lhe-emos o passo a passo exato para resolver sozinho sem qualquer custo.',
    'workflow.s4.badge': 'Transparente e Justo',
    'workflow.s4.title': 'Apoio À Sua Medida',
    'workflow.s4.desc': 'Se desejar acompanhamento presencial ou técnico, oferecemos assistência flexível—desde traduções notariadas até apoio presencial—com preços claros e honestos.',

    'pathways.eyebrow': 'Caminhos de Resolução e Filosofia de Preços',
    'pathways.title': 'Opções Transparentes Criadas para as Suas Necessidades',
    'pathway.p1.name': '1. Aconselhamento Comunitário Grátis',
    'pathway.p1.desc': 'Dúvidas básicas e orientação geral explicadas na consulta grátis. Ideal se puder tratar dos processos autonomamente.',
    'pathway.p1.price': '€0 • Pro-Bono',
    'pathway.p2.name': '2. Preparação de Documentos e Relatórios',
    'pathway.p2.desc': 'Traduções legalizadas no Cartório, NIF/NISS, planos de negócios e relatórios de conformidade.',
    'pathway.p2.price': 'Taxa Fixa Transparente',
    'pathway.p3.name': '3. Acompanhamento Presencial & Guia',
    'pathway.p3.desc': 'Presença física na AIMA, visitas a Bancos, abertura de empresas PT PMA ou guia local bilingue.',
    'pathway.p3.price': 'Pacote Fixo ou Hora',
    'pathways.note': 'Equidade de Poder de Compra: Adaptamos os nossos preços com justiça—oferecendo tarifas acessíveis a membros da comunidade e consultoria empresarial a negócios.',

    'team.eyebrow': 'Nossa Equipa',
    'team.title': 'Os Colaboradores por trás da Ponte Bilateral',
    'team.subtitle': 'Uma equipa multidisciplinar de profissionais bilingues integrados em ambas as nações.',
    'team.flip.badge': 'Clique para virar',
    'team.flip.back': 'Clique para voltar',
    'team.touch.cue': 'Deslize para virar',
    'team.c1.role': 'FUNDADOR',
    'team.c1.title': 'Líder de Negócios e Relações Bilaterais',
    'team.c1.bio': '9+ anos a residir em Portugal com 5 anos de serviço na Secção Económica da Embaixada da República da Indonésia em Lisboa. Especialista em protocolo diplomático, criação de empresas transfronteiriças e navegação administrativa.',
    'team.c1.lang': 'Inglês & Indonésio',
    'team.c2.role': 'Líder de Conformidade Bancária e Financeira',
    'team.c2.title': 'Especialista em Consultoria Bancária e Financeira',
    'team.c2.bio': '7+ anos a residir em Portugal com Mestrado em Economia pelo ISEG Lisboa. Atualmente ativo no setor bancário europeu, com experiência em movimentos de capital, fluxos financeiros transfronteiriços e conformidade.',
    'team.c2.lang': 'Inglês & Indonésio',
    'team.c3.role': 'Líder de Estratégia Tecnológica e IA',
    'team.c3.title': 'Especialista em Transformação Digital e Inovação',
    'team.c3.bio': 'M.Sc. em Marketing Estratégico, atualmente a liderar iniciativas tecnológicas empresariais. Especializado em adaptação de fluxos digitais, expansão de mercado e adoção de IA em operações transfronteiriças.',
    'team.c3.lang': 'Inglês & Indonésio',
    'team.c4.role': 'ESPECIALISTA EM TRADUÇÃO',
    'team.c4.title': 'Líder de Tradução Legal e Notariada',
    'team.c4.bio': 'Especialista bilingue nativo (Português-Portugal / Indonésio) reconhecido pela Embaixada da Indonésia em Lisboa. Executa traduções oficiais legais e civis, devidamente legalizadas em Cartórios Notariais em Portugal. Trabalhos agendados após avaliação de viabilidade.',
    'team.c4.lang': 'Português & Indonésio',

    'footer.tagline': 'Consultoria Bilateral e Transfronteiriça',
    'footer.contact.title': 'Entre em Contacto',
    'footer.contact.sub': 'Assistência Direta & Consultas',
    'footer.wa.btn': 'Consulta Direta via WhatsApp',
    'footer.hours': 'Horário: Seg – Sex | 10:00 – 16:00 WET (Portugal) / 16:00 – 22:00 WIB (Indonésia)',
    'footer.consult': 'Consultas realizadas em Inglês e Indonésio.',
    'footer.legal': 'Legalização notarial e serviços administrativos executados com especialistas nativos e Notários certificados.',
    'footer.entity': 'Operating as PT Wollusca Sukses Bersama (Purwokerto, Jawa Tengah)'
  },

  id: {
    'nav.services': 'Layanan',
    'nav.process': 'Proses',
    'nav.team': 'Tim',
    'nav.contact': 'Kontak',

    'hero.luso.sub': 'Menghubungkan bisnis Portugis ke pasar Indonesia.',
    'hero.nusa.sub': 'Solusi terpercaya untuk WNI di Portugal.',
    'hero.luso.cta': 'Klik untuk Solusi PT → ID ↗',
    'hero.nusa.cta': 'Klik untuk Solusi ID → PT ↗',
    'hero.luso.pill1': 'Verifikasi Bisnis',
    'hero.luso.pill2': 'Pendirian PT PMA',
    'hero.luso.pill3': 'Konsultasi Ekspor-Impor',
    'hero.luso.pill4': 'Visa & KITAS Indonesia',
    'hero.luso.pill5': 'Pencarian Produk',
    'hero.nusa.pill1': 'Pendampingan AIMA',
    'hero.nusa.pill2': 'NIF & NISS',
    'hero.nusa.pill3': 'Buka Rekening',
    'hero.nusa.pill4': 'Dokumen Bisnis & Legalitas',
    'hero.nusa.pill5': 'Penerjemahan Notaris',
    'hero.nusa.pill6': 'Panduan Lokal & Travel',

    'resolver.eyebrow': 'Bagaimana Kami Bisa Membantu?',
    'resolver.title': 'Apa Tantangan Anda Saat Ini?',
    'resolver.subtitle': 'Pilih situasi Anda dan dapatkan peta solusi instan dengan jalur langsung ke tim kami.',
    'resolver.tab.nusa': 'Untuk WNI di/ke Portugal',
    'resolver.tab.luso': 'Untuk Bisnis & Warga Portugis',
    'resolver.empty': 'Pilih skenario di atas untuk melihat peta solusi Anda.',
    'resolver.wa.btn': 'Mulai Konsultasi WhatsApp',

    'workflow.eyebrow': 'Jaminan & Komitmen Kami',
    'workflow.title': 'Bagaimana Kami Mendampingi & Membantu Anda',
    'workflow.subtitle': 'Pendekatan 4 langkah yang ramah dan solutif—dirancang untuk memberikan kejelasan, ketenangan, dan solusi nyata.',
    'workflow.s1.badge': '100% Gratis & Santai',
    'workflow.s1.title': 'Ceritakan Kendala Anda',
    'workflow.s1.desc': 'Kirimkan pesan singkat melalui WhatsApp mengenai masalah Anda. Tanpa biaya, tanpa komitmen—kami siap mendengarkan dan membantu.',
    'workflow.s2.badge': '1–2 Hari Riset',
    'workflow.s2.title': 'Kami Bersiap Sebelum Berdiskusi',
    'workflow.s2.desc': 'Sebelum jadwal telepon, tim kami meluangkan 1–2 hari kerja untuk mempelajari masalah Anda dan menyiapkan solusi yang paling tepat.',
    'workflow.s3.badge': 'Ramah & Gratis',
    'workflow.s3.title': 'Konsultasi Awal yang Ramah',
    'workflow.s3.desc': 'Diskusi santai 1-on-1 untuk membahas masalah Anda. Jika solusinya sederhana, kami berikan panduan lengkapnya agar bisa Anda urus sendiri secara gratis.',
    'workflow.s4.badge': 'Transparan & Adil',
    'workflow.s4.title': 'Dukungan Sesuai Kebutuhan',
    'workflow.s4.desc': 'Jika Anda membutuhkan pendampingan langsung, kami siap membantu—dari panduan mandiri, penerjemah notaris, hingga pengawalan lokasi—dengan biaya yang jujur dan adil.',

    'pathways.eyebrow': 'Jalur Solusi & Filosofi Biaya',
    'pathways.title': 'Pilihan Transparan yang Disesuaikan dengan Kebutuhan Anda',
    'pathway.p1.name': '1. Bimbingan Komunitas Gratis',
    'pathway.p1.desc': 'Pertanyaan dasar & panduan umum dijawab saat konsultasi gratis. Cocok jika Anda ingin mengurus dokumen sendiri.',
    'pathway.p1.price': '€0 • Pro-Bono',
    'pathway.p2.name': '2. Legalisasi Dokumen & Laporan',
    'pathway.p2.desc': 'Penerjemahan terlegalisasi Notaris, pembuatan NIF/NISS, peta bisnis, dan laporan kepatuhan.',
    'pathway.p2.price': 'Biaya Paket Transparan',
    'pathway.p3.name': '3. Pendampingan Lapangan & Tour',
    'pathway.p3.desc': 'Pendampingan fisik di kantor AIMA, Bank, pendirian PT PMA, atau panduan lokal bilingual.',
    'pathway.p3.price': 'Paket Fixo / Per Jam',
    'pathways.note': 'Keadilan Daya Beli: Kami menyesuaikan biaya secara adil—memberikan tarif yang terjangkau bagi perorangan dan layanan profesional bagi bisnis.',

    'team.eyebrow': 'Tim Kami',
    'team.title': 'Para Kolaborator di Balik Jembatan Bilateral',
    'team.subtitle': 'Tim multidisiplin profesional bilingual yang berpengalaman di kedua negara.',
    'team.flip.badge': 'Klik untuk membalik',
    'team.flip.back': 'Klik untuk kembali',
    'team.touch.cue': 'Usap untuk membalik',
    'team.c1.title': 'Pendiri & Pemimpin Hubungan Bilateral',
    'team.c1.bio': '9+ tahun tinggal di Portugal dengan 5 tahun bertugas di Seksi Ekonomi Kedutaan Besar Republik Indonesia di Lisbon. Spesialis dalam protokol diplomatik, pendirian bisnis lintas batas, dan navigasi administratif.',
    'team.c1.lang': 'Inggris & Indonesia',
    'team.c2.role': 'Kepala Kepatuhan Perbankan & Keuangan',
    'team.c2.title': 'Spesialis Konsultasi Perbankan & Keuangan',
    'team.c2.bio': '7+ tahun tinggal di Portugal dengan gelar Master Ekonomi dari ISEG Lisbon. Saat ini aktif di sektor perbankan Eropa, membawa keahlian dalam pergerakan modal, arus keuangan lintas batas, dan kepatuhan.',
    'team.c2.lang': 'Inggris & Indonesia',
    'team.c3.role': 'Kepala Strategi Teknologi & AI',
    'team.c3.title': 'Spesialis Transformasi Digital & Inovasi',
    'team.c3.bio': 'M.Sc. Pemasaran Strategis, saat ini memimpin inisiatif teknologi perusahaan. Spesialisasi dalam adaptasi alur kerja digital, ekspansi pasar modern, dan adopsi AI bisnis lintas operasi.',
    'team.c3.lang': 'Inggris & Indonesia',
    'team.c4.role': 'Spesialis Penerjemahan Tersumpah & Pengadilan',
    'team.c4.title': 'Penerjemah Hukum & Tersumpah Pengadilan',
    'team.c4.bio': 'Spesialis bilingual native (Portugis-Portugal / Indonesia) dengan pengalaman luas dalam penerjemahan pengadilan dan administratif. Dipercaya untuk penerjemahan tersumpah dokumen hukum, sipil, dan korporat di Portugal.',
    'team.c4.lang': 'Portugis & Indonesia',

    'footer.tagline': 'Konsultasi Bilateral & Lintas Batas',
    'footer.contact.title': 'Hubungi Kami',
    'footer.contact.sub': 'Bantuan Langsung & Konsultasi',
    'footer.wa.btn': 'Konsultasi Langsung via WhatsApp',
    'footer.hours': 'Jam Layanan: Sen – Jum | 09:00 – 18:00 WET / WIB',
    'footer.consult': 'Konsultasi dilakukan dalam Bahasa Inggris & Indonesia.',
    'footer.legal': 'Layanan hukum & administratif tersumpah dilaksanakan oleh spesialis native Portugis bersertifikat.'
  }
};

function initLanguageSystem() {
  const langBtns = document.querySelectorAll('.nav-lang-btn');

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      setLanguage(lang);

      // Update button states
      langBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.lang === lang);
        b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false');
      });
    });
  });
}

function setLanguage(lang) {
  currentLang = lang;
  const dict = translations[lang];
  if (!dict) return;

  // Update all [data-i18n] elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  // Update <html lang>
  document.documentElement.lang = lang;

  // Re-render problem resolver pills with new language
  renderPills(currentAudience);
  resetSolutionCard();

  // If a scenario was selected, re-select it
  if (currentScenario) {
    const activePill = document.getElementById(`pill-${currentScenario.id}`);
    if (activePill) {
      selectScenario(currentAudience, currentScenario, activePill);
    }
  }
}


/* ═══════════════════════════════════════════════════════════════
   6. SCROLL REVEAL — IntersectionObserver
   ═══════════════════════════════════════════════════════════════ */
function initScrollReveal() {
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
    '.workflow-connector',
    '.section-team .section-eyebrow',
    '.section-team .section-title',
    '.section-team .section-subtitle',
    '.tvos-card',
    '.footer-brand',
    '.footer-contact',
    '.footer-meta'
  ];

  const elements = document.querySelectorAll(revealSelectors.join(','));
  elements.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));

  // Safety fallback: ensure all elements are visible after 500ms
  setTimeout(() => {
    elements.forEach(el => el.classList.add('visible'));
  }, 500);
}


/* ═══════════════════════════════════════════════════════════════
   7. VIDEO SUPPORT — Activate hero videos when source is added
   ═══════════════════════════════════════════════════════════════ */
function initVideoSupport() {
  const videos = document.querySelectorAll('.hero-panel-video');

  videos.forEach(video => {
    // Check if a <source> element with a valid src exists
    const source = video.querySelector('source');
    if (source && source.src && !source.src.includes('<!--')) {
      video.classList.add('active');
      video.load();

      // Auto-play when visible
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              video.play().catch(() => {}); // Silently handle autoplay blocks
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(video);
    }
  });
}

/* ═══════════════════════════════════════════════════════════════
   8. COMPACT INSIGHTS TAB SWITCHER
   ═══════════════════════════════════════════════════════════════ */
function switchInsightTab(tab) {
  const pinnedList = document.getElementById('insights-pinned-list');
  const latestList = document.getElementById('insights-latest-list');
  const btnPinned = document.getElementById('btn-pinned-articles');
  const btnLatest = document.getElementById('btn-latest-articles');

  if (!pinnedList || !latestList || !btnPinned || !btnLatest) return;

  if (tab === 'pinned') {
    pinnedList.style.display = 'flex';
    latestList.style.display = 'none';
    btnPinned.classList.add('active');
    btnLatest.classList.remove('active');
  } else {
    pinnedList.style.display = 'none';
    latestList.style.display = 'flex';
    btnPinned.classList.remove('active');
    btnLatest.classList.add('active');
  }
}

/* ═══════════════════════════════════════════════════════════════
   9. MOBILE NAVIGATION MENU
   ═══════════════════════════════════════════════════════════════ */
function initMobileMenu() {
  const trigger = document.getElementById('mobile-nav-trigger');
  const overlay = document.getElementById('mobile-menu-overlay');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  const closeBtn = document.getElementById('mobile-menu-close');
  const links = document.querySelectorAll('.mobile-menu-link');

  if (!trigger || !overlay) return;

  function openMenu() {
    overlay.classList.add('is-active');
    overlay.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('is-active');
    overlay.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  trigger.addEventListener('click', () => {
    const isActive = overlay.classList.contains('is-active');
    if (isActive) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-active')) {
      closeMenu();
    }
  });
}
