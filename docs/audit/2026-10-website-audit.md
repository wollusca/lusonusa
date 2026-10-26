# LUSONUSA — Website Audit & Growth Plan

**Site:** www.lusonusa.agency (static site, GitHub Pages, `CNAME`)
**Audit date:** 26 October 2026
**Scope:** All files in this repository: `index.html`, `app.js`, `style.css`, `articles/*`, `assets/*`, `images/*`. The site was rendered locally in headless Chromium at 1440×900 (desktop) and 390×844 (mobile).
**Limitation:** The audit sandbox's network policy blocked the live domain, YouTube and unpkg. Live HTTP headers, real Core Web Vitals, Search Console data and backlink data were **not** measured. Every finding below comes from the source code and the local render. Items marked *(verify)* need a check against the live site or an official source.

---

## 0. Executive summary

LUSONUSA has a strong, distinctive concept: a two-way Portugal ↔ Indonesia bridge with a real credibility asset (the founder spent five years at the Indonesian Embassy in Lisbon). It also has a polished, cinematic dark visual identity. The site, however, works against the business in three ways:

1. **Search engines and AI assistants can barely see it.** The only `<h1>` is hidden from assistive tech (`aria-hidden`). Portuguese and Indonesian content exists only in JavaScript, with no URLs. There is no sitemap, robots.txt, favicon, canonical, structured data or OG image on the homepage. The four articles that do exist are hidden from navigation, and their canonical URLs point to `http://localhost:3001`.
2. **Visitors have to work too hard to understand the offer and contact you.** The first screen shows only the brand name on dark photos, with no value proposition and no call to action. Visitors scroll through 2.5 screens of pinned animation before reaching any service. Key trust content (bios) sits behind 3D flip cards. The only conversion path is WhatsApp, and on the article pages that link points to a **placeholder number (`351000000000`)**, so every article lead is lost.
3. **Trust signals are inconsistent or missing.** Team names and roles differ between the homepage and the articles (for example, "Mia Gomes" on the homepage vs "Maria Santos" on an article, "Nabela Huwaida – AI Strategy" vs "Nabela Rahma – Legal Lead"). Translations contradict each other (different service hours, a stronger "court sworn translator" claim in Indonesian only). There are no testimonials, address, privacy policy, cookie consent or legal disclaimer, and some article facts look outdated.

The good news is that the fixes are mostly cheap. The plan in sections 5–7 starts with a one-week "stop the bleeding" sprint. That is followed by a 4–6 week rebuild of the information architecture (multilingual URLs and service pages) and a 3–6 month content and authority programme. The business has a real advantage here: Google results for **Portugal ↔ Indonesia** queries face low competition, especially in Bahasa Indonesia and Portuguese.

### Scorecard (subjective, 0–10)

| Area | Score | One-line reason |
|---|---|---|
| Visual design / brand | 7 | Distinctive, premium, cohesive. Too dark and low-contrast in places |
| UX & conversion | 3 | No above-the-fold value proposition or CTA, scroll-jacking, WhatsApp-only, broken article CTAs |
| Accessibility | 3 | Hidden H1, no focus styles, contrast failures, ARIA misuse, motion not fully reducible |
| Performance | 3 | About 4.4 MB of first-party images, 3 autoplaying YouTube iframes, unpinned full icon library |
| Technical SEO | 2 | JS-only i18n, no sitemap/robots/schema/canonical, localhost canonicals, orphaned articles |
| Content & E-E-A-T | 4 | Good topics, but inconsistent authors, possibly outdated facts, articles hidden |
| Trust & compliance | 3 | No privacy policy, cookies before consent, legal-advice wording risk, no reviews |
| Business model clarity | 5 | Two good audiences, but diluted service list and under-priced positioning |

---

## 1. Site inventory

| Page / asset | Notes |
|---|---|
| `index.html` (one-page site) | Hero (250vh pinned split screen) → Problem Resolver → How We Work + pricing → Team flip cards → (hidden Insights) → Footer |
| `app.js` (1,427 lines) | Scroll animation, resolver data (10 scenarios × 3 languages), translation dictionaries, YouTube embeds, team-card gestures, mobile menu |
| `style.css` (2,474 lines) | Single stylesheet, dark theme tokens |
| `articles/index.html` + 4 articles | Visa (EN/PT), PT PMA (EN/PT), NIF/NISS/AIMA (EN/ID), Sworn translation (EN/ID) |
| Images | `images/portugal-bg.png`, `indonesia-bg.png` (actually JPEGs, 1024×1024, about 0.7 MB each), team photos 1250×1125 JPEG at 0.36–1.25 MB each, article banner 0.79 MB |
| Missing | `robots.txt`, `sitemap.xml`, favicon / app icons, `404.html`, privacy / terms / cookie pages, OG image, `/pt/` and `/id/` pages |

---

## 2. Detailed findings

Severity: **P0** = losing money or credibility now; **P1** = significant; **P2** = improvement.

### 2.1 Conversion and broken funnels

| # | Sev | Finding | Evidence |
|---|---|---|---|
| C1 | **P0** | **Every WhatsApp CTA on the articles uses a placeholder number** `wa.me/351000000000`. Article readers are the highest-intent organic visitors, and all of their leads are lost. | `articles/index.html:238`, `articles/indonesia-visa-guide-2026.html`, `pt-pma-indonesia-setup.html:320,456,491`, `nif-niss-aima-portugal-guide.html:441,469`, `sworn-translation-notary-guide.html:320,440,472` |
| C2 | **P0** | **The first screen has no value proposition and no CTA.** It shows only "LUSONUSA / The Portugal ↔ Indonesia Bilateral Bridge" over dark photos. The service pills fade in only after scrolling, and the nav appears only after 40% of the scroll track. | `app.js:65–146`, screenshot `desktop-0-top` |
| C3 | P1 | **Scroll-jacked hero is 250vh.** Visitors must scroll about 1,350px (desktop) before the first service section begins (`#resolver` at y=2250 on desktop, 2110 on mobile). Many visitors leave before then. | `style.css:448–452` |
| C4 | P1 | **WhatsApp is the only real channel.** There is no form, no booking calendar and no phone call option. Portuguese B2B buyers (the higher-value LUSO audience) usually expect email, a form, LinkedIn or a calendar link. WhatsApp clicks are also not tracked, so you cannot measure what works. | `index.html:221, 258, 662` |
| C5 | P1 | **The "instant resolution roadmap" over-promises.** Selecting a scenario shows three generic bullets, then a WhatsApp message that still contains `[Name]` and `[explain details here]` placeholders the user must edit. That adds friction and feels template-like. | `app.js:401–716` |
| C6 | P1 | On mobile, the roadmap card renders **below** five or more pills, so after tapping a scenario nothing visibly happens unless the user scrolls. | screenshot `mobile-resolver` |
| C7 | P2 | The hero mouse-follower badge ("Click to Explore…") only appears after the scroll animation completes, and it is invisible to touch and keyboard users. Hero panels are `role="button"` but carry no visible button. | `app.js:200–226` |
| C8 | P2 | Article nav "back" link goes to `/index.html#insights`, which is `display:none`. | article nav, `index.html:506` |

### 2.2 UI / visual design

| # | Sev | Finding |
|---|---|---|
| U1 | P1 | **The fixed logo and nav overlay covers about 120px at the top of every section.** In screenshots, section titles sit under the glass pill and the eyebrow text is hidden. On mobile, the "LUSONUSA" wordmark collides with the MENU button. (`index.html:95–101`, screenshots `desktop-2`, `mobile-resolver`) |
| U2 | P1 | **Low contrast.** `--text-dim #64748B` on `#0B0D12` is 4.08:1, which fails WCAG AA for normal-size text. Several labels are 0.55–0.66rem (9–10.5px) uppercase with letter spacing. Hero photos are darkened so far that they read as near-black. |
| U3 | P1 | **Team cards hide the most important trust content (bios) behind a 3D flip.** Long role labels ("BANKING & FINANCIAL COMPLIANCE LEAD", "TECHNOLOGY & AI STRATEGY LEAD") wrap into the photo and become unreadable (screenshot `desktop-team`). Role casing is inconsistent ("FOUNDER" vs title case). Joko's role and title repeat each other. |
| U4 | P1 | **Icons depend on `unpkg.com/lucide@latest`.** In the test render the CDN was unreachable, every icon disappeared, and pills were left with empty indents. `@latest` can also ship breaking changes overnight. |
| U5 | P2 | **Two type systems.** The homepage uses Cinzel + Inter; the articles use Cinzel + Plus Jakarta Sans. Large Cinzel all-caps headings with glow are hard to read at length (e.g., "The Collaborators Behind the Bilateral Bridge" wraps to two lines). |
| U6 | P2 | The "How we work" section uses a fixed YouTube video background behind text cards, which adds visual noise and costs contrast and performance. |
| U7 | P2 | Pricing is mixed into the process section. "€15–€30/hour" appears next to "enterprise-grade consulting", which sends a mixed signal (see Business, section 2.8). |
| U8 | P2 | The footer has no navigation, social links, address, legal links or language switch. |

### 2.3 Accessibility (WCAG 2.2)

| # | Sev | Finding | Evidence |
|---|---|---|---|
| A1 | **P0** | **The page's only `<h1>` is inside `aria-hidden="true"`.** Screen readers and some crawlers see no H1. The visible H2s "LUSO" and "NUSA" are not descriptive. | `index.html:98–100` |
| A2 | P1 | **No visible keyboard focus styles.** There are no `:focus-visible` rules in `style.css`, and team cards set `outline: none`. | `style.css:892` |
| A3 | P1 | **ARIA misuse.** Resolver tabs reference `aria-controls="panel-resolver-nusa"/"panel-resolver-luso"`, which don't exist, and have no arrow-key support. Pills use `role="listbox"`/`option` on buttons without listbox keyboard behaviour. Hero panels are `role="button"` but contain a link (nested interactive). Team cards are `<article role="button">` and both faces are read aloud. | `index.html:116,144,191–207,361` |
| A4 | P1 | **Motion.** `prefers-reduced-motion` doesn't stop the YouTube autoplay videos, the pinned scroll animation, the logo scaling or the 3D flips. The reveal-on-scroll elements depend on JS (a 500ms fallback exists). | `style.css:2026–2050` |
| A5 | P2 | **Language switching keeps the `<title>`, meta and ARIA labels in English,** and the choice is not remembered between visits. | `app.js:1159–1186` |
| A6 | P2 | Team photos are CSS backgrounds with no text alternative. | `index.html:364…` |

### 2.4 Performance

| # | Sev | Finding |
|---|---|---|
| P1 | P1 | **About 4.4 MB of first-party bytes on load** (measured in the local render). Team photos are 1250×1125 JPEGs of up to 1.25 MB, displayed at about 270px wide, and they load immediately because they are CSS backgrounds. Hero "PNGs" are 1024×1024 JPEGs stretched over half of a 1440px+ screen, which makes them both heavy and soft. |
| P2 | P1 | **Three autoplaying YouTube iframes** (2 hero + 1 workflow; the hero ones are skipped on ≤768px). Each iframe pulls about 1 MB+ of YouTube JS, hurts LCP/INP/TBT and sets third-party cookies (see 2.7). The non-cookie `youtube-nocookie.com` domain is not used. |
| P3 | P1 | **The whole Lucide UMD library loads from unpkg `@latest`** to render about 30 icons. That means an extra DNS/TLS handshake, no version pinning and a supply-chain risk. Article pages load it twice (`articles/index.html:21,370`). |
| P4 | P2 | **The Safari bfcache "fix" forces a full reload on every Back navigation** and is registered twice (inline + `app.js:11`). That throws away instant back/forward, a real speed win. The root issue is that scroll state is initialised only on `DOMContentLoaded`. |
| P5 | P2 | The scroll handler runs `querySelectorAll` and writes `filter: blur()` and `transform` on multiple elements each frame. Animating blur is expensive on low-end Android. |
| P6 | P2 | No `<link rel="preload">` for the LCP image or fonts, no `fetchpriority`, no responsive `srcset`, and no WebP/AVIF. |

### 2.5 Technical SEO

| # | Sev | Finding |
|---|---|---|
| S1 | **P0** | **Portuguese and Indonesian versions don't exist as URLs.** All translation happens client-side via `data-i18n`. Google indexes only English, so you rank for nothing in the two languages that are your actual markets ("cara mengurus NIF Portugal", "abrir empresa na Indonésia"…). |
| S2 | **P0** | **Article canonicals, `og:url`, `og:image` and JSON-LD point to `http://localhost:3001/…`.** Google may ignore the canonical or treat the pages as duplicates, and WhatsApp/LinkedIn link previews show no image. (20 occurrences across `articles/*.html`) |
| S3 | **P0** | **The articles are orphaned.** The Insights section is `display:none` and its nav link is commented out (`index.html:39–41, 506`), so no crawlable internal link reaches `/articles/`. |
| S4 | P1 | **No `robots.txt`, `sitemap.xml`, favicon or `404.html`.** |
| S5 | P1 | **Homepage has no canonical, `og:image`, `og:url`, Twitter card or structured data** (Organization / ProfessionalService, Person, FAQ). `meta keywords` is present but ignored by Google. |
| S6 | P1 | **Article pages contain two `<h1>`s** (one per language) toggled by JS, which mixes languages in one indexable document. |
| S7 | P2 | `.html` URLs and a non-descriptive structure (`/articles/x.html`). There are no breadcrumbs and no service pages, so there is nothing to rank for "PT PMA setup Portugal", "NIF for Indonesians", and similar queries. |
| S8 | P2 | `http://www.lusonusa.agency` → HTTPS redirect, apex → www redirect and "Enforce HTTPS" in GitHub Pages need confirming *(verify)*. |

### 2.6 Content, accuracy and E-E-A-T

| # | Sev | Finding |
|---|---|---|
| E1 | **P0** | **Team identities are inconsistent across the site.** Homepage: Mia Gomes (translation), Nabela Huwaida (tech & AI), Joko Supriyanto (banking). Articles and `articles-data.js`: "Maria Santos – Lisbon Relocation Lead" using Mia's photo, "Nabela Rahma – Legal & Corporate Governance Lead" using Nabela's photo, "Joko Santoso – Sworn Translator" using Joko's photo. To a careful reader or Google's quality raters this looks fabricated, and it damages trust. |
| E2 | **P0** | **Translations make different claims.** The Indonesian bio for Mia calls her "Penerjemah Hukum & Tersumpah Pengadilan" (court sworn translator), but the English and Portuguese bios don't. "Penerjemah tersumpah" is a regulated title in Indonesia. Service hours: EN/PT say "10:00–16:00 WET / 16:00–22:00 WIB", but ID says "09:00–18:00 WET / WIB". `team.c1.role` and `footer.entity` are missing in ID, and `footer.entity` is untranslated in PT, so stale text from the previous language stays on screen after switching. |
| E3 | P1 | **Possibly outdated regulatory facts** *(verify with official sources before republishing)*. The visa guide is built around "B211A", while Indonesia's immigration has used a new visa index (C-/D-/E-series, e.g. C2 business visit visa, E28A investor KITAS) since 2023–2024. The PT PMA article states a minimum paid-up capital of IDR 10 billion; BKPM/Ministry of Investment regulations issued in 2025 reportedly lowered the paid-up requirement. Outdated legal facts in YMYL topics are a ranking risk and a liability risk. |
| E4 | P1 | **No proof.** There are no testimonials, case studies, Google reviews, client or partner logos, media mentions, registration numbers (NIB of PT Wollusca Sukses Bersama), LinkedIn profiles or Portugal address. The strongest credential, five years at the Economic Section of the Indonesian Embassy in Lisbon, is buried on the back of a flip card. |
| E5 | P2 | The "Latest Articles" list shows four articles that don't exist yet, with "Read Article" buttons disabled. |
| E6 | P2 | The homepage copy is generic ("friendly team", "real solutions") with few concrete outcomes, timelines, numbers or prices per service. |

### 2.7 Legal, privacy and compliance (EU / Portugal / Indonesia)

*Not legal advice. Have a Portuguese lawyer (advogado/solicitador) confirm these points.*

| # | Sev | Finding |
|---|---|---|
| L1 | **P0** | **GDPR/ePrivacy: no privacy policy and no cookie consent.** YouTube embeds (`youtube.com`, not `youtube-nocookie.com`) and Google Fonts load before any consent, which transfers EU visitors' IP addresses to Google. WhatsApp chats also collect personal data, including immigration documents, with no privacy notice. |
| L2 | P1 | **"Legal" wording.** In Portugal, legal consultation is reserved to advogados and solicitadores (Lei n.º 49/2004, *atos próprios*). Copy such as "Legal compliance & documentation guidance", "Legal & sworn administrative services" and "Legal & Corporate Governance Lead" could be read as offering legal acts. Reframe the copy as administrative support, partner with a named licensed lawyer, and add a disclaimer. |
| L3 | P1 | **Translation claims.** Portugal has no "sworn translator" title; translations are certified before a notary, lawyer, solicitor or consulate. Use precise wording ("certified translation, certified before a Portuguese notary") consistently across EN, PT and ID. |
| L4 | P2 | If the business serves consumers from a Portuguese establishment, the **Livro de Reclamações Eletrónico** link is mandatory on the website *(verify)*. Add the operating entity, NIB/tax ID and contact address to the footer or an imprint page. Copyright reads "© 2026 LUSONUSA" but the operating entity is PT Wollusca Sukses Bersama, so align them. |

### 2.8 Business and positioning

| # | Finding |
|---|---|
| B1 | **Two audiences with very different economics share one funnel.** NUSA (Indonesian students and workers in Portugal) is price-sensitive, high in volume and community-driven. LUSO (Portuguese SMEs and investors entering Indonesia) is low in volume but high in ticket size (PT PMA setup, sourcing and due diligence can be worth thousands of euros per client). The site gives them equal weight and the same WhatsApp funnel. |
| B2 | **Service sprawl dilutes authority.** "Rental cars & hotel logistics" and "travel suggestions" sit next to FDI structuring and fraud prevention. That makes a premium advisory firm look like a general fixer. |
| B3 | **Pricing signals.** "€15–€30/hour" anchors the brand as cheap, which undermines the LUSO B2B offer. The "free 1–2 days of research before a free call" promise is expensive to deliver and attracts unqualified leads. |
| B4 | **No lead qualification or CRM.** Leads arrive as unstructured WhatsApp messages. There is no tracking of source, service or conversion, so marketing spend can't be optimised. |
| B5 | **Unused assets.** The founder's embassy background, existing community networks (PPI Portugal student association, KBRI Lisbon, Indonesian diaspora) and the Portugal–Indonesia chamber of commerce are natural partnership and referral channels. The site barely uses them. |

### 2.9 Code quality and maintainability

- All copy lives in `app.js` dictionaries **and** in the HTML defaults, and they have already drifted apart. Examples: resolver title "What's Your Immediate Challenge?" vs "What Is Your…", "AIMA Guidance" vs "AIMA Assistance", and `footer.legal` differs between the HTML and the dictionary.
- Dead code: `.tvos-card` reveal selector, `initVideoSupport` with commented-out `<source>`, duplicated pageshow handler, `WHATSAPP_NUMBER // Replace with actual number` comment. The article data lives in both `articles-data.js` and inline in `articles/index.html`.
- Large inline styles in article pages (each about 400 lines of `<style>`), so changing the design means editing five files.
- **Recommendation:** move to a tiny static site generator (Eleventy, Astro or Hugo) with one content file per page per language. That fixes i18n SEO, duplication and drift together, and still deploys to GitHub Pages.

---

## 3. What's working (keep it)

- A memorable, ownable brand idea: **LUSO ↔ NUSA** as a split-screen bridge.
- The **problem-first resolver** concept: letting users pick their situation is the right UX pattern. It needs depth, not removal.
- **Transparent process + free first contact** lowers the barrier for the community audience.
- **Trilingual intent** (EN/PT/ID) and a focused niche with little direct competition.
- The **founder's embassy credential** and real team photos.
- The articles already target the right long-tail topics, and one has `Article` JSON-LD.
- Basic semantics are in place: `lang`, landmarks, `aria-pressed` on language buttons, Escape closes the mobile menu, a `prefers-reduced-motion` block exists.

---

## 4. UI / UX improvement plan

### 4.1 Guiding principles
1. **Clarity in five seconds:** who you help, with what, and how to start, all in the first viewport.
2. **Two doors, two journeys:** NUSA (people) and LUSO (businesses) get their own landing pages, copy tone, proof and CTA.
3. **Proof before ask:** credentials, reviews and process appear before the contact request.
4. **Cinematic but optional:** keep the brand's atmosphere, but never block content behind animation.

### 4.2 Proposed homepage structure

```
[Header]  LUSONUSA logo · Services ▾ · Guides · About · Contact · EN/PT/ID · [Book a free call]
[Hero, 100vh max, no scroll pinning]
   H1: "Your trusted bridge between Portugal and Indonesia"
   Sub: "Company setup, visas, residency paperwork and certified translations,
         handled by bilingual specialists in Lisbon and Java."
   Two large door cards (keep the split-screen look):
     ┌ LUSO: For Portuguese businesses → Indonesia ┐ ┌ NUSA: For Indonesians → Portugal ┐
     │ PT PMA · Visas/KITAS · Sourcing · Due diligence│ │ NIF/NISS · AIMA · Bank · Translation│
     │ [Explore business services]                    │ │ [Lihat layanan / See services]      │
   Trust strip: "5 yrs Indonesian Embassy Lisbon · X clients helped · ★ 4.9 Google"
[Problem resolver v2]  3-step intake (situation → urgency/timeline → contact preference)
[Services grid]  Each card → dedicated service page
[How it works]   4 steps (keep), no video background
[Pricing]        Packages per audience (see 6.2)
[Proof]          Testimonials, case studies, partner logos
[Team]           Visible bios, credentials, LinkedIn. Flip optional or removed
[Guides]         Latest 3 articles + "All guides"
[FAQ]            8–10 questions (also FAQPage schema)
[Final CTA]      WhatsApp · Email · Book a call (Cal.com/Calendly)
[Footer]         Sitemap links, address, entity & NIB, privacy, terms, cookies, socials
```

### 4.3 Specific changes

| Priority | Change | Fixes |
|---|---|---|
| Now | Put a real, visible H1 + value proposition + 2 CTAs in the first viewport. Cut the hero track from 250vh to ≤100vh (or replace the scroll animation with a 1–2s intro that is skippable and doesn't block scrolling). | C2, C3, A1 |
| Now | Replace placeholder WhatsApp numbers. Centralise the number in one config. Add a **sticky "Chat on WhatsApp" button** on mobile and in article sidebars. | C1 |
| Now | Shrink or let the fixed logo overlay scroll away. Use a standard compact sticky header (logo left, nav center, CTA right). Add `scroll-margin-top` to sections. | U1 |
| Now | Self-host icons as inline SVG (or pin `lucide@x.y.z` and bundle only used icons). | U4, P3 |
| Next | **Resolver v2:** after picking a scenario, ask 2–3 short questions (e.g., "Where are you now?", "When do you need this?", "Have you got your NIF?"). Show a concrete checklist, typical timeline and price-from. Pre-fill the WhatsApp/email message with the answers, without `[placeholders]`. Scroll the result into view on mobile. Add an **email/form fallback** for businesses. | C4, C5, C6 |
| Next | **Team:** show name, role, 2-line bio, credential badges ("Ex-Embassy of Indonesia, Lisbon", "MSc ISEG Lisbon") and a LinkedIn link directly. Keep the flip only as a desktop enhancement. Fix long roles and casing. | U3, E4 |
| Next | Raise contrast: `--text-dim` → ≥ `#8592A6` (≥ 4.5:1). Minimum label size 12px. Lighten hero photo overlays so the imagery reads. | U2 |
| Next | Add `:focus-visible` styles. Fix the tabs pattern (real `tabpanel` + arrow keys). Make pills plain buttons with `aria-pressed`. Remove the nested link from hero panels. Hide the back face from screen readers until flipped. | A2, A3 |
| Next | Honour reduced motion fully: no video autoplay, no pinning, no flips. | A4 |
| Later | Unify typography: Cinzel for the logo and H1 only, Inter (or Plus Jakarta) for everything else, sentence-case headings. | U5 |
| Later | Replace YouTube backgrounds with self-hosted, compressed 6–10s MP4/WebM loops (≤1.5 MB, poster image, `preload="none"`, paused offscreen), or with still images. | U6, P2, L1 |
| Later | Remember the language (localStorage + `navigator.language` detection on first visit, with a non-intrusive suggestion banner rather than an auto-redirect). | A5 |

### 4.4 UX success metrics
- WhatsApp/form/booking clicks per session (target: 2× baseline within 60 days)
- % of visitors reaching the services section (scroll depth)
- Resolver completion rate (scenario selected → contact action)
- Mobile bounce rate and engaged time
- Lighthouse Accessibility ≥ 95, Performance ≥ 90 on mobile

---

## 5. SEO plan

### 5.1 Technical foundation (weeks 1–3)

1. **Fix article metadata now:** replace every `http://localhost:3001` with `https://www.lusonusa.agency` (canonical, `og:url`, `og:image`, JSON-LD).
2. **Unhide the guides:** restore the Insights section and nav link, link to `/articles/` from the footer, and remove the "coming soon" rows.
3. **Add `robots.txt`** (allow all + sitemap line), **`sitemap.xml`** (with `hreflang` alternates), **favicon set**, **`404.html`**, and **homepage canonical + OG/Twitter tags + a 1200×630 OG image**.
4. **Real multilingual URLs (the biggest SEO win):**
   ```
   /            (EN)    /pt/            /id/
   /services/pt-pma-setup-indonesia/    /pt/servicos/criar-empresa-indonesia/   /id/layanan/pendirian-pt-pma/
   /guides/nif-niss-aima-portugal/      /pt/guias/…                              /id/panduan/cara-mengurus-nif-niss-aima-portugal/
   ```
   Each page should be pre-rendered HTML in one language with `<html lang>`, a translated `<title>`/description, and reciprocal `hreflang` (`en`, `pt-PT`, `id`, `x-default`). The easiest route is Eleventy or Astro with i18n, still on GitHub Pages.
5. **Structured data:**
   - `ProfessionalService`/`Organization` on the homepage (name, logo, url, `areaServed: [PT, ID]`, `knowsLanguage`, contactPoint with WhatsApp, `sameAs` social profiles, address).
   - `Person` for each team member (`jobTitle`, `alumniOf`, `worksFor`, `sameAs` LinkedIn).
   - `Service` per service page, `FAQPage` where you have FAQs, `Article` + `BreadcrumbList` on guides (author must match a real `Person`).
6. **Core Web Vitals:** compress images (team photos to ~600px WebP/AVIF, about 40–80 KB each; hero to responsive `srcset` at 960/1440/1920), use `<img loading="lazy">` instead of CSS backgrounds, remove YouTube iframes, self-host fonts with `font-display: swap` and subset them, and preload the LCP image. Target LCP < 2.0s and CLS < 0.05 on mobile.
7. **Measurement:** Google Search Console + Bing Webmaster Tools (submit the sitemap), plus privacy-friendly analytics (Plausible/Umami, or GA4 behind consent). Track events: `wa_click` (with service and language), `form_submit`, `booking`, `resolver_select`. Add UTM parameters to WhatsApp links from each placement.

### 5.2 Keyword and content strategy

**Positioning:** "the Portugal ↔ Indonesia specialist". Generic "Bali company setup" is dominated by large agencies, so win the **bilateral niche** and the **Bahasa Indonesia / European Portuguese long tail**, where competition is thin.

| Cluster | Language | Example target queries (validate volumes in GSC/Ahrefs/Semrush) | Page type |
|---|---|---|---|
| Moving to Portugal | ID | cara membuat NIF Portugal, NISS Portugal untuk WNI, jadwal AIMA, visa kerja Portugal, kuliah di Portugal, buka rekening bank Portugal, biaya hidup di Lisbon | Pillar guide + 6–8 cluster articles + service pages |
| Translation & legalisation | ID/PT | terjemahan dokumen ke bahasa Portugis, legalisasi dokumen KBRI Lisbon, apostille Indonesia Portugal, tradução certificada indonésio | Service page + guide |
| Doing business in Indonesia | PT | abrir empresa na Indonésia, PT PMA Indonésia, exportar para a Indonésia, importar da Indonésia, fornecedores Indonésia mobiliário | Pillar + service pages |
| Visas to Indonesia | PT/EN | visto Indonésia portugueses, visto de negócios Indonésia, KITAS investidor, visto nómada digital Bali | Guide (kept up to date yearly) |
| Due diligence & sourcing | EN/PT | verify Indonesian company, check supplier Indonesia scam, verificar empresa indonésia | Service page + case study |
| Bilateral trade | EN/PT/ID | Portugal Indonesia trade, IEU-CEPA (EU–Indonesia agreement) impact for Portuguese exporters | Thought leadership / news |

> The EU–Indonesia Comprehensive Economic Partnership Agreement (IEU-CEPA), politically concluded in 2025, is a timely hook for LUSO content. Writing early, accurate explainers for Portuguese exporters can earn links from trade bodies and press *(verify current ratification status before publishing)*.

**Content rules (YMYL topics):**
- One named, real author per article, with a matching team bio page and `Person` schema. **Fix the Maria Santos / Nabela Rahma / Joko Santoso discrepancies first.**
- Show "Last reviewed: <date> by <name>" and cite official sources (AIMA, Portal das Finanças, Segurança Social, imigrasi.go.id, BKPM/OSS).
- Review every regulatory article at least every 6 months. Correct the B211A and PT PMA capital facts now *(verify)*.
- Publishing cadence: 2 articles/month per audience. Each article links to its service page and ends with a contextual CTA.
- Repurpose each guide as an Instagram/TikTok carousel or short video in Bahasa (the diaspora audience lives there), linking back to the guide.

### 5.3 Off-page, local and authority

- **Google Business Profile** (if you have a staffable address in Lisbon, and/or Purwokerto): categories "Business management consultant", "Immigration & naturalization service", "Translator". Ask every satisfied client for a review, with a direct review link in the follow-up WhatsApp message.
- **Directories and partners:** Portugal–Indonesia chamber of commerce, AICEP, Indonesian Embassy (KBRI) Lisbon community pages, PPI Portugal (student association), Indonesian diaspora groups, expat directories (e.g., Expatica-style listings), university international offices that host Indonesian students.
- **Digital PR:** founder op-eds in Portuguese business media (Jornal de Negócios, ECO, Dinheiro Vivo) and Indonesian diaspora media on bilateral trade, CEPA and relocation trends. Appear on podcasts and webinars with the chamber of commerce.
- **LinkedIn:** a company page plus founder posting weekly. This is the main channel for the LUSO B2B audience.
- **AI search visibility:** clear FAQ-style answers, consistent entity data (same name, address, phone and people everywhere) and schema raise the chance of being cited by Google AI Overviews, ChatGPT and Perplexity for "Portugal Indonesia consultant" queries.

### 5.4 SEO KPIs (6 months)
- Indexed pages: from about 5 (EN only) to 60+ (3 languages)
- Non-brand organic clicks: baseline → 1,000+/month *(depends on baseline; set after the first GSC month)*
- Top-3 rankings for 20+ bilateral long-tail queries in ID and PT
- 15+ referring domains from relevant sources (chambers, universities, diaspora, media)
- 25+ Google reviews at ≥ 4.8

---

## 6. Business growth plan

### 6.1 Sharpen positioning
- **Tagline:** "Your trusted bridge between Portugal and Indonesia, for people and for business."
- **Lead with the founder's credential** everywhere (hero trust strip, About page, LinkedIn).
- **Trim or regroup services:** move car rental, hotels and travel suggestions into a single "Arrival & concierge" add-on for NUSA clients rather than a headline service. Make the LUSO side unmistakably B2B.

### 6.2 Productise and re-price

| Audience | Package (example, adjust to your costs) | Indicative price model |
|---|---|---|
| NUSA | **Arrival Starter:** NIF + NISS + bank account + SIM, checklist & accompaniment | Fixed price (e.g., from €X) |
| NUSA | **AIMA Ready:** document review, appointment prep, accompaniment | Fixed price |
| NUSA | **Certified Translation:** per page, with notary certification | Per page + notary fee |
| NUSA | **Student Landing:** housing verification + arrival orientation | Fixed price; offer university partnerships |
| LUSO | **Market Entry Assessment:** 2-week report on feasibility, structure, licences, costs | Fixed fee (premium), credited against setup |
| LUSO | **PT PMA Setup:** with licensed Indonesian legal partner | Project fee + government costs |
| LUSO | **Supplier Verification / Due Diligence:** company registry checks, site visit, report | Per-supplier fee |
| LUSO | **Sourcing Retainer:** ongoing supplier management, QC, shipping coordination | Monthly retainer or % of order value |

- Keep a **free 15-minute triage call** (not 1–2 days of free research). Offer a **paid case assessment** that is credited if the client proceeds. This filters out tyre-kickers and pays for the research time.
- Publish "from" prices per package. Transparent anchors convert better than "€15–30/hour" and stop the B2B side from looking cheap.
- Keep the "purchasing power equity" idea as a **community/student discount** (e.g., 20% with a student ID or PPI membership) rather than a public hourly rate.

### 6.3 Build a measurable funnel
1. **Capture:** every CTA carries a source tag (page + service + language), such as WhatsApp prefill text "Ref: NIF-guide-ID" or UTM parameters.
2. **Qualify:** use WhatsApp Business with quick replies, labels per service and a catalogue of packages, plus a short web intake form for B2B.
3. **Track:** use a lightweight CRM (HubSpot free, Pipedrive, or a shared Notion/Sheets pipeline) with stages Lead → Qualified → Proposal → Won → Review requested.
4. **Nurture:** a monthly bilingual newsletter (policy changes, AIMA updates, trade news), with signup on every guide.
5. **Referral:** a referral reward for community clients, plus partner commissions with lawyers, accountants, relocation agents and universities.

### 6.4 Partnerships (high leverage, low cost)
- **Licensed Portuguese lawyer/solicitor** and **Indonesian notary/legal firm** as named partners. This removes legal risk (L2) and adds credibility.
- **Universities** with Indonesian students (Lisbon, Porto, Coimbra, Minho): pre-arrival webinars.
- **Indonesian employers/agencies** placing workers in Portugal (agriculture, hospitality, care): bulk NIF/NISS/AIMA packages.
- **Portuguese exporters' associations** (cork, wine, olive oil, moulds, footwear): Indonesia market-entry seminars.

### 6.5 Compliance as a selling point
Publish a short "How we handle your documents" page (GDPR, retention, encryption, who sees what). For an immigration and document business, that is a trust differentiator, not just a legal chore.

---

## 7. Prioritised roadmap

### Week 1: stop the bleeding (≈1–2 days of dev)
- [ ] Replace `351000000000` with the real number in all articles. Centralise it.
- [ ] Fix all `localhost:3001` URLs (canonical, OG, JSON-LD).
- [ ] Make the H1 visible and accessible. Add a value-proposition line + CTA to the first viewport.
- [ ] Reconcile team names, roles and photos across homepage, articles and `articles-data.js`.
- [ ] Reconcile translations (hours, Mia's title, missing ID/PT keys).
- [ ] Add `robots.txt`, `sitemap.xml`, favicon, homepage canonical/OG image, `404.html`.
- [ ] Unhide the guides section and nav link. Remove the "coming soon" rows.
- [ ] Pin or self-host the icon library.
- [ ] Switch YouTube embeds to `youtube-nocookie.com` (interim), add a privacy policy and a basic consent banner.
- [ ] Set up Google Search Console + Bing Webmaster Tools + analytics with WhatsApp click events.

### Weeks 2–6: rebuild the structure
- [ ] Migrate to Eleventy/Astro with `/`, `/pt/`, `/id/` pre-rendered pages and hreflang.
- [ ] Create ~10 service pages × 3 languages, About/Team page, Contact page, Privacy/Terms/Cookies.
- [ ] Redesign the hero (≤100vh, no scroll-jacking), sticky header with CTA, mobile sticky WhatsApp.
- [ ] Resolver v2 with qualifying questions and form/booking fallback.
- [ ] Team section with visible bios and credentials. Add a testimonials/case-study block.
- [ ] Image pipeline (WebP/AVIF, `srcset`, lazy loading), self-hosted fonts, remove YouTube backgrounds.
- [ ] Accessibility pass: contrast, focus, ARIA, reduced motion. Target Lighthouse A11y ≥ 95.
- [ ] Schema: Organization/ProfessionalService, Person, Service, FAQPage, Article, BreadcrumbList.
- [ ] Google Business Profile, LinkedIn company page, review-request process.

### Months 2–6: grow
- [ ] 4 articles/month (2 ID for NUSA, 2 PT/EN for LUSO), each reviewed and sourced.
- [ ] Update the visa and PT PMA guides with current regulations; schedule 6-monthly reviews.
- [ ] Partnerships: lawyer, universities, chamber of commerce, exporters' associations.
- [ ] Digital PR on IEU-CEPA and bilateral trade, plus founder thought leadership on LinkedIn.
- [ ] Monthly newsletter, referral programme, case studies from the first clients.
- [ ] Monthly KPI review (section 4.4, section 5.4); A/B test hero copy and CTA labels.

---

## Appendix A: Quick reference of file locations

| Issue | Location |
|---|---|
| Hidden H1 | `index.html:98–101` |
| Hero 250vh track | `style.css:448–452`, `app.js:41–162` |
| Placeholder WhatsApp number | `articles/*.html` (search `351000000000`) |
| localhost canonicals | `articles/*.html` (search `localhost:3001`) |
| Hidden insights + nav | `index.html:39–41`, `index.html:506` |
| Inconsistent authors | `articles/articles-data.js`, article headers (`article-author-name`) |
| Translation drift | `app.js:850–1140` vs `index.html` defaults |
| YouTube embeds | `index.html:122,150,238`, `app.js:1272–1325` |
| Lucide `@latest` | `index.html:20`, `articles/*.html` |
| No focus styles / outline none | `style.css:892` |
| ARIA tabs/listbox | `index.html:191–207`, `app.js:754–792` |
| Low-contrast token | `style.css:18` (`--text-dim`) |

## Appendix B: Method
- Full manual read of `index.html`, `app.js`, the key sections of `style.css`, and every article and data file.
- Headless Chromium render (Playwright) at 1440×900 and 390×844 with scroll-position screenshots, DOM checks (H1, alt text, layout offsets) and transfer-size measurement.
- Contrast computed with the WCAG relative-luminance formula.
- Live-site checks (headers, redirects, real CWV, GSC) were not possible from the audit sandbox. Run PageSpeed Insights and Search Console on the live domain to set baselines before starting the roadmap.
