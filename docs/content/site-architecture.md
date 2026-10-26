# Phase 2 Site Architecture (EN · pt-PT · id)

**Status:** proposal for the Phase 2 static-site-generator migration (Eleventy or Astro, GitHub Pages).
**Owner:** Stream 4 (`docs/content/**`). Inputs: `docs/audit/2026-10-website-audit.md` §4.2, §5.1, §6.1; `docs/audit/workstreams.md` (shared contract).
**Canonical base:** `https://www.lusonusa.agency` — https, www, trailing slash, no `index.html`, no `.html` on new pages.

---

## 1. Principles

1. **One page = one language = one URL.** Every page is pre-rendered HTML with `<html lang>`, its own `<title>`, meta description, canonical and a full reciprocal `hreflang` set. No client-side language switching for indexable copy.
2. **Two doors.** Every service sits under exactly one audience hub: **LUSO** (Portuguese businesses → Indonesia) or **NUSA** (Indonesians → Portugal). The homepage presents both doors; hubs carry audience-specific proof and CTAs.
3. **Language follows the audience, but all three exist.** LUSO pages are written PT-first (then EN, then ID for Indonesian partner companies). NUSA pages are written ID-first (then EN, then PT for Portuguese employers/universities). The *x-default* is always the EN URL.
4. **Slugs are native-language keywords**, lowercase, hyphenated, ASCII only (no accents: `servicos`, not `serviços`), ≤ 5 words. Directory names are localised: `services` / `servicos` / `layanan`, `guides` / `guias` / `panduan`.
5. **Service pages are the money pages; guides feed them.** Each guide links to exactly one primary service and one secondary service; each service page links back to its 2–4 supporting guides.
6. **Compliance wording everywhere:** LUSONUSA is not a law firm and doesn't replace a lawyer. It provides "information and practical guidance based on public official information, plus in-person accompaniment", and refers clients to licensed lawyers, notaries, accountants and customs brokers when needed. LUSO is business guidance, never legal, tax, investment or customs-brokerage advice. Translations are "certified before a Portuguese notary". Never "sworn translator", "legal advice", "lawyer" as LUSONUSA's own title. Every service page carries a "What we don't do / when you need a lawyer" block.
7. **No digital ID/immigration documents.** No page, form or CTA asks visitors to send passports, permits, visas or civil documents by WhatsApp, email or upload. Forms have no file-upload field. Documents are checked in person.
8. **No recruitment.** No page offers job placement, recruitment or worker supply. Employer partnerships appear only as "staff referred by their employer for administrative guidance".

---

## 2. Service regrouping (from the current 10 resolver scenarios + 11 hero pills)

| Current item (app.js / index.html) | Phase 2 destination | Why |
|---|---|---|
| NUSA · "Bureaucracy & AIMA (NIF, NISS, Bank)" | Split into **NIF & NISS**, **AIMA residence support**, **Bank account & arrival** | Three distinct search intents and three price points |
| NUSA · "Business & Legal Documents" | Merged into **Certified translation & legalisation**; "business setup in Portugal for Indonesians" becomes a guide that refers to a partner *contabilista certificado* / *solicitador* | Avoids offering legal acts (audit L2) |
| NUSA · "Notarized Translation" pill | **Certified translation & legalisation** | Rename: "notarized" → "certified before a Portuguese notary" |
| NUSA · "Students & Accommodation Search" | **Students, housing & arrival concierge** | Keeps the student niche (PPI/university partnerships) |
| NUSA · "Local Guide & Travel Suggestions" | Add-on inside **Arrival & concierge** (section on the students page; also sold to LUSO business visitors) | Audit B2: travel/fixer services dilute authority |
| NUSA · "Rental Cars & Hotel Logistics" | Add-on inside **Arrival & concierge** | Same |
| LUSO · "Company Setup in Indonesia (PT PMA) & Taxes" | **PT PMA company setup** (tax framework is a section, delivered with a partner tax consultant) | Main B2B ticket |
| LUSO · "Indonesia Visa & KITAS Advisory" | **Indonesia visa & KITAS** | Update B211A → current visa index (C2, D2, E28A, E33G…) |
| LUSO · "Company Verification & Fraud Prevention" | **Company verification & due diligence** | — |
| LUSO · "Product Sourcing from Indonesia" | **Product sourcing & supplier management** | Includes the retainer offer |
| LUSO · "Export-Import & Trade Compliance" | **Export-import advisory (PT ↔ ID)** | IEU-CEPA hook |

Result: **10 service pages × 3 languages = 30 URLs**, plus one add-on section (Arrival & concierge) that does not get its own URL in Phase 2. If the concierge add-on later earns search demand (watch GSC for "airport pickup Lisbon Indonesian" type queries), split it out.

---

## 3. Sitemap

### 3.1 Core pages

| # | Page | EN | pt-PT | id |
|---|---|---|---|---|
| 1 | Home | `/` | `/pt/` | `/id/` |
| 2 | LUSO hub (businesses → Indonesia) | `/business-in-indonesia/` | `/pt/negocios-na-indonesia/` | `/id/bisnis-portugal-ke-indonesia/` |
| 3 | NUSA hub (Indonesians → Portugal) | `/moving-to-portugal/` | `/pt/indonesios-em-portugal/` | `/id/pindah-ke-portugal/` |
| 4 | Services index | `/services/` | `/pt/servicos/` | `/id/layanan/` |
| 5 | Pricing & packages | `/pricing/` | `/pt/precos/` | `/id/harga/` |
| 6 | About & team | `/about/` | `/pt/sobre-nos/` | `/id/tentang-kami/` |
| 6b | How our network works | `/about/how-our-network-works/` | `/pt/sobre-nos/como-funciona-a-rede/` | `/id/tentang-kami/cara-kerja-jaringan/` |
| 7 | Team member (×4) | `/about/aditya-putra/` … | `/pt/sobre-nos/aditya-putra/` … | `/id/tentang-kami/aditya-putra/` … |
| 8 | Contact & booking | `/contact/` | `/pt/contacto/` | `/id/kontak/` |
| 9 | Guides index | `/guides/` | `/pt/guias/` | `/id/panduan/` |
| 10 | How we handle your documents (GDPR/trust, audit 6.5) | `/document-handling/` | `/pt/tratamento-de-documentos/` | `/id/keamanan-dokumen/` |
| 11 | FAQ (global) | `/faq/` | `/pt/perguntas-frequentes/` | `/id/tanya-jawab/` |
| 12 | Privacy | `/privacy/` | `/pt/privacidade/` | `/id/privasi/` |
| 13 | Terms & disclaimer | `/terms/` | `/pt/termos/` | `/id/ketentuan/` |
| 14 | 404 | `/404.html` (single, trilingual) | — | — |

Page **6b "How our network works"** explains that LUSONUSA is a collaborative network of independent professionals, not a company with employees. Sections: who we are (founder + independent professionals) · how a case is assigned · **each service is quoted and invoiced by the professional who delivers it** (recibos verdes in Portugal, or PT Wollusca Sukses Bersama for some Indonesia-side consulting *[owner to confirm]*) · licensed partners we refer to (lawyers, notaries, accountants, customs brokers), who are independent · what we don't do (no legal/tax/investment/customs-brokerage advice, no recruitment, no travel packages sold) · how we handle documents (link to #10). Link it from every quote, the footer, the pricing page and each service page's price block. Schema: `AboutPage`.

Team-member pages (#7) exist to give every guide author a real `Person` entity with `sameAs` LinkedIn (audit E1/E4). Slugs use the person's name unchanged in all languages: `aditya-putra`, `mia-gomes`, `joko-supriyanto`, `nabela-huwaida`.

> Phase 1 legal files (`/privacy.html`, `/terms.html`, `/404.html`) are owned by Stream 3. In Phase 2, keep them reachable: 301 `/privacy.html` → `/privacy/` and `/terms.html` → `/terms/` (GitHub Pages cannot send real 301s; use a meta-refresh stub + canonical, or move hosting to Cloudflare Pages/Netlify if true redirects matter — **owner decision**).

### 3.2 Service pages (10)

Content for each lives in `docs/content/services/<file>.md`.

| Audience | Service | File | EN | pt-PT | id |
|---|---|---|---|---|---|
| LUSO | PT PMA company setup | `pt-pma-setup.md` | `/services/pt-pma-company-setup-indonesia/` | `/pt/servicos/abrir-empresa-indonesia-pt-pma/` | `/id/layanan/pendirian-pt-pma/` |
| LUSO | Indonesia visa & KITAS | `indonesia-visa-kitas.md` | `/services/indonesia-visa-kitas/` | `/pt/servicos/visto-indonesia-kitas/` | `/id/layanan/visa-kitas-indonesia-wna/` |
| LUSO | Company verification & due diligence | `company-verification.md` | `/services/indonesian-company-verification/` | `/pt/servicos/verificar-empresa-indonesia/` | `/id/layanan/verifikasi-perusahaan-indonesia/` |
| LUSO | Product sourcing & supplier management | `product-sourcing.md` | `/services/product-sourcing-indonesia/` | `/pt/servicos/fornecedores-indonesia/` | `/id/layanan/pencarian-supplier-indonesia/` |
| LUSO | Export-import advisory | `export-import-advisory.md` | `/services/export-import-portugal-indonesia/` | `/pt/servicos/exportar-para-indonesia/` | `/id/layanan/ekspor-impor-portugal-indonesia/` |
| NUSA | NIF & NISS | `nif-niss.md` | `/services/nif-niss-portugal/` | `/pt/servicos/nif-niss-estrangeiros/` | `/id/layanan/pengurusan-nif-niss-portugal/` |
| NUSA | AIMA residence support | `aima-residence-support.md` | `/services/aima-residence-permit-support/` | `/pt/servicos/apoio-autorizacao-residencia-aima/` | `/id/layanan/pendampingan-izin-tinggal-aima/` |
| NUSA | Bank account & arrival setup | `bank-account-arrival.md` | `/services/portugal-bank-account-arrival/` | `/pt/servicos/conta-bancaria-chegada-portugal/` | `/id/layanan/buka-rekening-bank-portugal/` |
| NUSA | Certified translation & legalisation | `certified-translation-legalisation.md` | `/services/certified-translation-indonesian-portuguese/` | `/pt/servicos/traducao-certificada-indonesio-portugues/` | `/id/layanan/terjemahan-dokumen-portugis-legalisasi/` |
| NUSA | Students, housing & arrival concierge | `students-housing-concierge.md` | `/services/students-housing-arrival-portugal/` | `/pt/servicos/estudantes-alojamento-chegada/` | `/id/layanan/mahasiswa-akomodasi-kedatangan-portugal/` |

### 3.3 Guides (articles)

Existing Phase 1 URLs (contract: unchanged in Phase 1) and their Phase 2 homes:

| Phase 1 URL | Phase 2 EN | Phase 2 pt-PT | Phase 2 id |
|---|---|---|---|
| `/articles/indonesia-visa-guide-2026.html` | `/guides/indonesia-visa-guide/` | `/pt/guias/vistos-indonesia/` | `/id/panduan/jenis-visa-indonesia-untuk-wna/` |
| `/articles/pt-pma-indonesia-setup.html` | `/guides/pt-pma-indonesia/` | `/pt/guias/abrir-empresa-indonesia/` | `/id/panduan/syarat-pendirian-pt-pma/` |
| `/articles/nif-niss-aima-portugal-guide.html` | `/guides/nif-niss-aima-portugal/` | `/pt/guias/nif-niss-aima-estrangeiros/` | `/id/panduan/cara-mengurus-nif-niss-aima-portugal/` |
| `/articles/sworn-translation-notary-guide.html` | `/guides/certified-translation-portugal/` | `/pt/guias/traducao-certificada-notario/` | `/id/panduan/terjemahan-dan-legalisasi-dokumen-portugal/` |
| `/articles/` | `/guides/` | `/pt/guias/` | `/id/panduan/` |

Notes:
- Drop the year from slugs (`-2026`). Put the year in the title and a visible "Last reviewed" date instead, so the URL survives annual updates.
- The old `sworn-translation-…` slug contains the non-compliant word "sworn"; the Phase 2 slug removes it. Keep a redirect stub at the old URL.
- Old article URLs must redirect (meta-refresh + canonical stub, or real 301s if hosting changes) to the **EN** Phase 2 URL; the PT/ID versions currently embedded in the same file become their own pages.
- New guide slugs come from `editorial-calendar.md`. Pattern: `/guides/<slug>/`, `/pt/guias/<slug>/`, `/id/panduan/<slug>/`. A guide written only in one or two languages gets hreflang only for the languages that exist (never point hreflang at a missing translation).

---

## 4. hreflang

Every page in a translation set emits the **full set, including itself**, plus `x-default` → EN:

```html
<link rel="canonical" href="https://www.lusonusa.agency/pt/servicos/nif-niss-estrangeiros/">
<link rel="alternate" hreflang="en"        href="https://www.lusonusa.agency/services/nif-niss-portugal/">
<link rel="alternate" hreflang="pt-PT"     href="https://www.lusonusa.agency/pt/servicos/nif-niss-estrangeiros/">
<link rel="alternate" hreflang="id"        href="https://www.lusonusa.agency/id/layanan/pengurusan-nif-niss-portugal/">
<link rel="alternate" hreflang="x-default" href="https://www.lusonusa.agency/services/nif-niss-portugal/">
```

Rules:
- Codes: `en`, `pt-PT`, `id`. Use `pt-PT` (not bare `pt`) so Brazilian Portuguese results don't treat the page as generic; *optional*: add `hreflang="pt"` pointing to the same pt-PT URL to also catch generic Portuguese (cheap, harmless — **owner/Phase 2 dev decision**).
- `<html lang="pt-PT">`, `<html lang="id">`, `<html lang="en">`.
- Canonical is always self-referencing (never points PT to EN).
- The SSG should generate hreflang from a single `translationKey` front-matter field (e.g. `translationKey: svc-nif-niss`) so pairs can't drift. The pairs in §3 are the source of truth for that key.
- `sitemap.xml` repeats the hreflang set with `xhtml:link` entries (Stream 3's Phase 1 sitemap is the starting point).
- Language switcher links go to the **equivalent** page (via `translationKey`), not to the other language's homepage. Remember choice in `localStorage`; suggest (banner) rather than auto-redirect based on `navigator.language`.

---

## 5. Navigation

**Header (all languages, localised labels):**
`Logo` · `Business in Indonesia ▾` (5 LUSO services) · `Moving to Portugal ▾` (5 NUSA services) · `Guides` · `Pricing` · `About` · `EN | PT | ID` · **[Free 15-min call]** (primary CTA → `/contact/` with WhatsApp + booking + form)

| EN | pt-PT | id |
|---|---|---|
| Business in Indonesia | Negócios na Indonésia | Bisnis ke Indonesia |
| Moving to Portugal | Viver em Portugal | Pindah ke Portugal |
| Guides | Guias | Panduan |
| Pricing | Preços | Harga |
| About | Sobre nós | Tentang Kami |
| Free 15-min call | Chamada grátis de 15 min | Konsultasi gratis 15 menit |

**Mobile:** sticky bottom bar with `WhatsApp` + `Book a call`. On NUSA pages WhatsApp is primary; on LUSO pages "Book a call / email" is primary (audit C4).

**Footer:** both service lists, guides, pricing, about, contact, document-handling page, privacy, terms, language links, operating entity "PT Wollusca Sukses Bersama (Purwokerto, Jawa Tengah, Indonesia)" + NIB **[owner to supply]**, email `contact@lusonusa.agency`, WhatsApp `+351 930 534 440`, hours "10:00–16:00 Lisbon time (Mon–Fri) · 16:00–22:00 WIB (summer) / 17:00–23:00 WIB (winter)". Livro de Reclamações link if a Portuguese establishment serves consumers **[verify with a Portuguese lawyer]**.

**Breadcrumbs** on every non-home page (`BreadcrumbList` schema): Home › Hub › Service, Home › Guides › Guide.

---

## 6. Internal-linking plan

### 6.1 Hub-and-spoke

```
                     Home (/, /pt/, /id/)
            ┌──────────────┴───────────────┐
        LUSO hub                        NUSA hub
  ┌──┬───┬───┬───┐                ┌──┬───┬───┬───┐
 PMA Visa Verif Sourc Exp        NIF AIMA Bank Transl Students
  │    │    │    │    │            │    │    │    │      │
 guides (2–4 each, see 6.3)       guides (2–4 each, see 6.3)
```

### 6.2 Rules

| From | Must link to | Anchor text |
|---|---|---|
| Home | Both hubs, all 10 services (grid), 3 latest guides, pricing, about | Descriptive service names in the page language |
| Hub | Its 5 services, its pillar guide(s), pricing section for that audience, team members most relevant | — |
| Service page | (a) its hub, (b) 2–4 supporting guides, (c) 1–2 "next step" services (table 6.4), (d) pricing anchor, (e) the author/lead team member page | Keyword-rich but natural ("como obter o NIF sendo estrangeiro") |
| Guide | 1 primary service (in-text early + end CTA), 1 secondary service, 2 related guides, author page | — |
| Team page | Guides they wrote, services they lead | — |
| Pricing | Every package → its service page | — |

- No orphan pages: CI check in Phase 2 that every page has ≥ 3 internal inbound links.
- Same-language links only (an ID page never links to an EN service unless the ID version doesn't exist).
- Max one exact-match anchor per target per page; vary the rest.

### 6.3 Guide → service mapping (initial)

| Guide | Primary service | Secondary service |
|---|---|---|
| Indonesia visa guide | Indonesia visa & KITAS | PT PMA setup |
| PT PMA guide | PT PMA setup | Company verification |
| NIF/NISS/AIMA guide | NIF & NISS | AIMA residence support |
| Certified translation guide | Certified translation & legalisation | AIMA residence support |
| New guides | see `editorial-calendar.md` (each row names its primary service) | — |

### 6.4 Cross-sell ("next step") links between services

| Service | Next-step links |
|---|---|
| PT PMA setup | Indonesia visa & KITAS (Investor KITAS), Export-import advisory |
| Indonesia visa & KITAS | PT PMA setup, Arrival & concierge add-on |
| Company verification | Product sourcing, Export-import advisory |
| Product sourcing | Company verification, Export-import advisory |
| Export-import advisory | Product sourcing, PT PMA setup |
| NIF & NISS | Bank account & arrival, AIMA residence support |
| AIMA residence support | Certified translation & legalisation, NIF & NISS |
| Bank account & arrival | NIF & NISS, Students & concierge |
| Certified translation & legalisation | AIMA residence support, NIF & NISS |
| Students, housing & concierge | NIF & NISS, Bank account & arrival |

---

## 7. Page templates (for the Phase 2 dev)

| Template | Blocks (in order) | Schema |
|---|---|---|
| Service | Breadcrumb · H1 + value prop + primary CTA · Who it's for · What's included · What we don't do / when you need a lawyer · Process & timeline · Price "from" + package link · Proof (testimonial/case) · FAQs (accordion, 5+) · Related guides · Final CTA (WhatsApp prefilled with source tag + booking + email) · Disclaimer | `Service` (provider → `ProfessionalService` @id), `FAQPage`, `BreadcrumbList` |
| Hub | H1 · audience promise · 5 service cards · process · pricing teaser · proof · team · guides · FAQ · CTA | `CollectionPage`, `BreadcrumbList`, `FAQPage` |
| Guide | Breadcrumb · H1 · author + "Last reviewed <date> by <name>" · TL;DR box · TOC · body · "Official sources" list · inline CTA after 1st section · end CTA · related | `Article` (author → `Person` @id), `BreadcrumbList`; `FAQPage` only if real Q&A block |
| Team member | Photo · name · role · bio · credentials · languages · LinkedIn · guides authored | `Person` (`memberOf` → #org, `knowsLanguage`, `sameAs`) |
| Home | per audit §4.2 | `ProfessionalService` + `Organization`, `WebSite` |

Global entity (`@id: https://www.lusonusa.agency/#org`): name LUSONUSA, described as a network (`Organization`, not an employer; use `member` → each `Person`, and each `Person` has `memberOf` → #org rather than `worksFor`). Whether `legalName` = PT Wollusca Sukses Bersama is right for the brand is an **owner decision**, since Portugal-side professionals invoice independently. Service schema `provider` = the delivering `Person`. Other fields: url, logo, email, `contactPoint` (WhatsApp +351930534440, `availableLanguage: [en, pt, id]`), `areaServed: [PT, ID]`, `knowsLanguage: [en, pt-PT, id]`, `sameAs` (LinkedIn, Instagram, GBP URL — **owner to supply**). Address: only publish an address that is real and staffable (see `off-page-playbook.md`).

---

## 8. Content source structure (proposed for the SSG)

```
src/
  content/
    services/
      nif-niss/
        en.md   # front matter: title, description, slug, translationKey: svc-nif-niss, audience: nusa, lead: aditya-putra, price_from
        pt.md
        id.md
    guides/<key>/{en,pt,id}.md
    team/<person>.json
  data/
    site.json      # WhatsApp number, email, hours, entity — single source (fixes audit 2.9 drift)
    nav.{en,pt,id}.json
```

The Markdown in `docs/content/services/*.md` is written so each language block can be copied straight into `en.md` / `pt.md` / `id.md`.

---

## 9. Redirect / migration checklist

- [ ] Map every Phase 1 URL (homepage anchors `#resolver`, `#team`, `#insights`, four articles, `/articles/`, `/privacy.html`, `/terms.html`) to a Phase 2 URL.
- [ ] Keep `/index.html` → `/` canonical.
- [ ] Old article files become stubs: `<meta http-equiv="refresh" content="0; url=…">` + `<link rel="canonical">` to the new URL.
- [ ] Re-submit `sitemap.xml` in GSC and Bing; watch Coverage for 4 weeks.
- [ ] Update WhatsApp prefill source tags and UTMs to the new page keys (`offers-and-pricing.md` §5).
