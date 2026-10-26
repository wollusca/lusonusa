# Off-Page Playbook: Local, Reviews, Partners, LinkedIn

**Goal (audit §5.3–5.4, §6.4):** within 6 months, 25+ Google reviews at ≥ 4.8, 15+ relevant referring domains, and consistent entity data (same name, people, contact details everywhere) so Google and AI assistants recognise LUSONUSA as *the* Portugal ↔ Indonesia specialist.

**Entity data to use everywhere (copy exactly):**
- Name: **LUSONUSA** (all caps, one word). Legal entity: **PT Wollusca Sukses Bersama** (Purwokerto, Jawa Tengah, Indonesia)
- Website: `https://www.lusonusa.agency/` · Email: `contact@lusonusa.agency` · WhatsApp: `+351 930 534 440`
- Hours: 10:00–16:00 Lisbon time (Mon–Fri) · 16:00–22:00 WIB (summer) / 17:00–23:00 WIB (winter)
- Short description (EN): "Portugal ↔ Indonesia bilateral guidance: practical, official-source information and in-person accompaniment for company setup, visas, residence paperwork and certified translations. Not a law firm. We refer you to licensed professionals when needed." Never use "legal services", "lawyer" or "sworn translator", and never offer recruitment or job placement.

---

## 1. Google Business Profile (GBP)

### 1.1 Eligibility decision (owner must choose before creating)

Google requires a **real location where you serve customers in person, or a real base you travel from**. Virtual offices, PO boxes and co-working addresses without staff and signage are not eligible, and a profile built on one risks suspension (see Google's "Guidelines for representing your business on Google" and the service-area help page `support.google.com/business/answer/3038177`, plus third-party summaries, *[verify the current wording]*).

| Option | When it fits | Setup |
|---|---|---|
| **A. Lisbon service-area business (recommended if a team member lives in the Lisbon area and travels to clients/AIMA/banks)** | NUSA work is done in person in Lisbon | Register with that team member's real address, then **hide the address**. Service areas: Lisboa, Amadora, Oeiras, Sintra, Almada, Setúbal, Porto (if served). Max 20 areas, roughly 2 hours' drive |
| **B. Purwokerto storefront/office** | The PT Wollusca office is staffed, signed and receives clients | Show the address. Useful for Indonesian searches and entity consistency with the legal entity |
| **C. Both A and B** | Both are true | Two profiles, one per real location. Same name, same website (with different UTMs) |
| **D. No GBP yet** | No eligible address | Focus on reviews on other platforms (§2.4) and on LinkedIn. Revisit later |

**Owner decision needed:** A, B, C or D. Who is the Lisbon-based person, and do they agree to use their address (hidden) for verification?

### 1.2 Profile content

| Field | Value |
|---|---|
| Business name | `LUSONUSA` (no keywords added. Keyword-stuffing names violates the guidelines) |
| Primary category | **Business management consultant** *(exact label to confirm in the GBP picker)* |
| Additional categories | **Immigration & naturalization service**, **Translator**, **Business to business service**, **Consultant** *(check availability in pt-PT UI: "Consultor de gestão empresarial", "Serviço de imigração e naturalização", "Tradutor")* |
| Description (750 chars max) | EN first, then a short PT line. PT and ID versions go in posts |
| Services | One per service page (10), with a short description and the "from" price once set |
| Website | `https://www.lusonusa.agency/?utm_source=gbp&utm_medium=organic-local&utm_campaign=gbp-en` |
| Appointment link | `[BOOKING_URL: owner to set]` |
| WhatsApp/chat | `+351 930 534 440` |
| Languages | Attributes: "Languages spoken: English, Portuguese, Indonesian" (if offered) |
| Photos | Team photos (re-use the optimised versions from Stream 1, `assets/img/**`), Lisbon context shots, logo, cover image. No stock photos of "lawyers" |
| Q&A | Seed 5 real FAQs from the service pages (e.g. "Do you help with AIMA appointments?", "Are your translations certified?" → "Yes, certified before a Portuguese notary.", "Can I send my documents on WhatsApp?" → "Please don't. We check documents with you in person.", "Do you find jobs in Portugal?" → "No, we don't recruit or place workers.") |
| Posts | Twice a month: new guide (with UTM), regulatory update (e.g. Lei 61/2025, CEPA milestone), event/webinar |

### 1.3 After verification

- Create the **review short link** (GBP → "Ask for reviews") and store it in the CRM as `{{REVIEW_LINK}}`.
- Add the GBP URL to `sameAs` in the Organization schema (`site-architecture.md` §7).
- Also create **Bing Places** (it can import from GBP) and **Apple Business Connect** with the same data.

---

## 2. Review requests

### 2.1 Process

1. **When:** 2–5 days after the CRM stage "Delivered" (`offers-and-pricing.md` §5.4), while the result is fresh: NIF issued, AIMA appointment done, translation delivered, PT PMA NIB issued.
2. **Who asks:** the team member who did the work, from WhatsApp Business, in the client's language.
3. **One reminder** after 7 days if there's no review. Never more.
4. **Never:** offer incentives or discounts for reviews, ask only happy clients to review ("review gating"), write reviews for clients, or post reviews from team or family. These break Google policy and, in the EU, consumer law on fake reviews *[verify: Omnibus Directive as transposed in Portugal]*.
5. **Reply to every review** within 3 business days, in the reviewer's language, without revealing case details (GDPR: don't confirm immigration status or documents publicly).
6. **Privacy note:** many NUSA clients may not want to reveal their immigration matter. Offer "you can just mention the type of help, no details needed".

### 2.2 Scripts (WhatsApp)

**EN**
> Hi {{first_name}}, this is {{team_member}} from LUSONUSA. I'm glad your {{service}} is sorted! 🙏
> If you have one minute, a short Google review would really help other people find us. You don't need to share any personal details, just how the support felt:
> {{REVIEW_LINK}}
> Thank you, and you can always message us if anything else comes up.

**pt-PT**
> Olá {{nome}}, fala {{membro_equipa}} da LUSONUSA. Fico muito contente por o processo de {{serviço}} ter ficado resolvido!
> Se tiver um minuto, uma breve avaliação no Google ajuda muito outras pessoas e empresas a encontrar-nos. Não precisa de partilhar detalhes do seu caso, basta dizer como correu o acompanhamento:
> {{REVIEW_LINK}}
> Muito obrigado/a. Continuamos ao dispor para o que precisar.

**Bahasa Indonesia**
> Halo Kak {{nama}}, saya {{anggota_tim}} dari LUSONUSA. Senang sekali urusan {{layanan}}-nya sudah beres! 🙏
> Kalau ada waktu satu menit, boleh minta tolong kasih ulasan singkat di Google? Ulasan Kakak sangat membantu teman-teman WNI lain menemukan kami. Tidak perlu cerita detail kasusnya, cukup bagaimana pengalaman didampingi kami:
> {{REVIEW_LINK}}
> Terima kasih banyak ya. Kalau nanti ada perlu lagi, langsung chat saja.

**Reminder (7 days, all languages, one line):**
- EN: "Hi {{first_name}}, just a gentle reminder about the review link, only if you have a moment. Thanks again! {{REVIEW_LINK}}"
- PT: "Olá {{nome}}, só um lembrete simpático do link da avaliação, apenas se tiver um momento. Obrigado/a! {{REVIEW_LINK}}"
- ID: "Halo Kak {{nama}}, sekadar mengingatkan link ulasannya ya, kalau sempat saja. Terima kasih! {{REVIEW_LINK}}"

**LUSO (B2B) variant, email, PT:**
> Assunto: Obrigado, e um pedido rápido
> Caro/a {{nome}}, obrigado pela confiança na LUSONUSA no processo de {{serviço}}. Se considerar justo, uma avaliação no Google ou uma recomendação no LinkedIn ajuda outras empresas portuguesas a encontrar apoio fiável para a Indonésia: {{REVIEW_LINK}}. Se preferir, também podemos preparar um caso de estudo anonimizado consigo. Com os melhores cumprimentos, {{assinatura}}

### 2.3 Review reply templates

- **Positive (ID):** "Terima kasih banyak, Kak {{nama}}! Senang bisa membantu. Sukses selalu di Portugal 🇵🇹🇮🇩"
- **Positive (PT):** "Muito obrigado, {{nome}}! Foi um prazer acompanhar o processo. Boa sorte com o projeto na Indonésia."
- **Negative (any language):** thank them, acknowledge the issue without case details, give a direct contact ("please message us at +351 930 534 440 so we can look into this"), and never argue publicly.

### 2.4 Other review surfaces

- **LinkedIn recommendations** (founder profile) for LUSO clients.
- **Facebook page reviews** if the diaspora uses the page.
- Testimonials on the site need **written consent** (save it in the CRM). Use first name + initial + city, and a photo only with consent.

---

## 3. Partner, directory and outreach targets

**Verification status (Oct 2026 web search):**
- ✅ **Verified**: the organisation's existence was confirmed in this session's search results.
- ☑️ **Known**: a well-established organisation, not re-checked this session.
- ⚠️ **Uncertain**: no website or current activity found. Confirm before outreach and don't list it on the site until confirmed.

### 3.1 Institutional & diplomatic

| Target | Status | Why it matters | Ask / action |
|---|---|---|---|
| **Embassy of the Republic of Indonesia, Lisbon (KBRI Lisabon)**: kemlu.go.id/lisbon · Instagram `@indonesiainlisbon` | ✅ (established by Keppres 98/2000; Ambassador Susi Marleny Bachsin presented credentials May 2025) | Founder's former employer (Economic Section). Most trusted source for WNI. Hosts community events | Ask to be listed among community resources / service providers if they keep such a list *[verify]*. Offer free info sessions for WNI. **Don't imply endorsement** |
| **Embassy of Portugal in Jakarta** (and its economic/AICEP desk) | ☑️ (relations restored 1999, embassies on both sides) | LUSO referrals, trade missions | Introduce LUSO services. Ask about trade-mission calendars |
| **AICEP Portugal Global**: portugalglobal.pt | ☑️ (AICEP exists. **A current Jakarta delegation was not confirmed** ⚠️) | Portugal's trade and investment agency. Its Indonesia market pages and events reach Portuguese exporters | Ask to be included in market-entry events/webinars as a local-support provider. Offer a market note on CEPA |
| **Chambers of Commerce and Industry Indonesia–Portugal** (bilateral chamber) | ⚠️ (activity found in 2012 (Antara) and at a 2023 Porto forum (SPI). **No website found**) | Natural LUSO referral partner. Already mentioned in current site copy ("Direct connection with the Indonesia-Portugal Chamber of Commerce") | **Owner: confirm the relationship and the exact name.** If it can't be confirmed, remove the claim from the site |
| **CCIP – Câmara de Comércio e Indústria Portuguesa** (Lisbon, Rua das Portas de Santo Antão 89) | ✅ | Umbrella for Portuguese chambers. Bilateral-chamber network (RCCP) | Listing / event participation. Ask about the bilateral chamber's status |
| **AEP – Associação Empresarial de Portugal** | ✅ (coordinated a Porto business mission to Jakarta in 2013) | Northern exporters, past Indonesia missions | Pitch an Indonesia market-entry seminar |
| **EU–Indonesia Business Network (EIBN)** | ✅ (consortium of European chambers in Indonesia, hosted by EKONID. SwedCham joined in July 2026) | First-entry focal point for EU companies in Indonesia. Partner search, B2B | Register as a service provider for Portuguese clients *[verify listing policy]* |
| **EuroCham Indonesia** | ✅ (170+ European member companies, 13 working groups) | Policy updates (CEPA), credibility, LUSO leads | Consider membership (cost: owner) and working groups |
| **Enterprise Europe Network – Portugal** (een.ec.europa.eu) | ✅ | SME internationalisation partner search | Publish partnership profile for Indonesia sourcing/market entry |
| **SPI – Sociedade Portuguesa de Inovação** | ✅ (presented Indonesia opportunities at the 2023 bilateral-chambers forum) | Knows the Indonesia–Portugal chamber, runs EU projects | Ask for an intro to the bilateral chamber |
| **ITPC (Indonesian Trade Promotion Center)** | ⚠️ (offices exist worldwide (e.g. Hamburg). **No Lisbon office found**) | Indonesian exporters looking for EU buyers | Check kemendag.go.id for which ITPC covers Portugal. Contact that one |
| **Instituto Camões / Portuguese-language centre in Indonesia** | ⚠️ (not confirmed for Jakarta) | Indonesians learning Portuguese = future NUSA clients | Confirm existence first |

### 3.2 Community (NUSA)

| Target | Status | Why it matters | Ask / action |
|---|---|---|---|
| **PPI Portugal** (Perhimpunan Pelajar Indonesia di Portugal) | ⚠️ (PPI chapters exist across Europe (PPI Jerman, PPI Belgia, PPI Delft) and a PPI Dunia network; **no web presence for a Portugal chapter found**. Likely Instagram-only) | Direct channel to Indonesian students. Basis of the 20% student discount | Owner/founder to contact via KBRI or Instagram. Offer pre-arrival webinars and a member discount (`PPI20`) |
| **Indonesian Diaspora Network (IDN Global)**, diasporaindonesia.org | ✅ global org · ⚠️ **no Portugal chapter found** | Diaspora professionals and business council | Ask whether a Portugal/Iberia contact exists. Offer to help start one |
| **Indonesian community groups** (WhatsApp/Facebook "WNI di Portugal"-type groups, mosque and church communities in Lisbon) | ⚠️ (names not verified) | Where NUSA questions are asked first | Share guides when asked, not spam. Ask admins before posting offers |
| **Good News From Indonesia (GNFI)** user pages / **Kumparan** user posts | ✅ (platforms host PPI and diaspora writers) | ID-language publishing platforms with domain authority | Guest posts by Aditya ("Kuliah di Portugal", "Urus NIF") with a link to the guide |

### 3.3 Universities (NUSA students, partnerships)

| Target | Status | Why it matters | Ask |
|---|---|---|---|
| Universidade de Lisboa (incl. ISEG: Joko's alma mater) | ☑️ | Largest university. Alumni link via ISEG | International office: pre-arrival webinar, "useful services" page listing |
| Universidade NOVA de Lisboa | ☑️ (its FCT visa & residence page appeared in search) | International students | Same |
| Universidade do Porto | ☑️ | Second city | Same |
| Universidade de Coimbra | ☑️ | Large international intake | Same |
| Universidade do Minho | ☑️ | — | Same |
| Universidade Lusófona | ☑️ (its visa page appeared in search) | Many non-EU students | Same |
| Indonesian universities with Portugal links (e.g. UIN Jakarta hosted a KBRI Lisbon public lecture) | ✅ (UIN Jakarta event found) | Outbound students, alumni | Webinar on studying in Portugal |

### 3.4 Sector associations (LUSO)

| Target | Status | Why | Ask |
|---|---|---|---|
| **APCOR** (cork) | ✅ | Cork exporters exploring Asia | Article/webinar on Indonesia market + CEPA |
| **ViniPortugal** (wine) | ☑️ | Wine exports. Indonesia has alcohol import restrictions *[verify]*, so the useful content is regulatory | "Can you export wine to Indonesia?" explainer |
| **Casa do Azeite** (olive oil) | ☑️ | Halal/BPOM requirements | Joint note |
| **AIMMP** (wood & furniture industry) | ☑️ | Furniture sourcing from Java (Jepara) and EUDR | Sourcing/verification offer |
| **APICCAPS** (footwear) | ☑️ | Sourcing and market | — |
| **CEFAMOL** (moulds) | ☑️ | Industrial exports to Indonesian manufacturing | — |

### 3.5 Directories & expat platforms

| Target | Status | Why | Note |
|---|---|---|---|
| Expatica (Portugal) | ☑️ | Expat service directory, EN | Paid/free listing: check |
| expat.com (Portugal forum) | ✅ (AIMA threads found) | Q&A traffic | Helpful answers with profile link. No spam |
| InterNations | ☑️ | Expat events Lisbon | Event sponsorship (optional) |
| Portugalist.com | ✅ (AIMA guides found) | High-authority EN Portugal guides | Pitch a guest piece: "Portugal for Indonesian residents" |
| Bing Places, Apple Business Connect | ☑️ | Map visibility | Mirror GBP |
| LinkedIn company page, Instagram, Facebook | ☑️ | `sameAs` entity signals | Same name, logo and description everywhere |

### 3.6 Media (digital PR)

| Outlet | Language | Angle |
|---|---|---|
| Jornal Económico, ECO, Jornal de Negócios, Dinheiro Vivo | pt-PT | Founder op-ed: "IEU-CEPA: what Portuguese exporters should do before 2027" (time it to the signing/entry-into-force milestones *[verify dates]*) |
| Essential Business (essential-business.pt) | EN (Portugal) | It has covered Portugal–Indonesia ties |
| Antara (EN/ID), The Jakarta Post | EN/ID | Indonesian diaspora in Portugal, bilateral trade |
| Kumparan, GNFI | ID | Student and worker stories, scam-awareness guide |

**Outreach rules:** personalise every message. Lead with a useful asset (guide, data, webinar), not a link request. Log every contact in the CRM as `PTN-<code>` so referrals can be tracked (`offers-and-pricing.md` §5). Aim for 6–8 outreach contacts per month.

---

## 4. LinkedIn plan (LUSO's main channel)

### 4.1 Setup (week 1–2)

- **Company page "LUSONUSA"**: tagline (EN) "Portugal ↔ Indonesia bilateral advisory for business and people". About in EN + PT. Website with `utm_source=linkedin&utm_medium=social`. Industry: Business Consulting and Services. Locations: Lisbon (if GBP option A/C) and Purwokerto. Add **PT and ID page translations** (LinkedIn supports multi-language page info).
- **Founder profile (Aditya Putra)**: headline e.g. "Founder, LUSONUSA · Portugal ↔ Indonesia business & bilateral relations · 5 yrs Economic Section, Embassy of Indonesia in Lisbon" *[owner to confirm wording of the embassy credential]*. Featured: top 3 guides + booking link. Experience entries match the website bio exactly.
- **Team profiles** (Mia, Joko, Nabela): list LUSONUSA as a position (with their consent) so `Person` `sameAs` works. Joko and Nabela have other employers, so they must **check their employers' outside-activity policies** *[owner/team to confirm]*.

### 4.2 Content rhythm

| Who | Frequency | Language | Content |
|---|---|---|---|
| Aditya (founder) | 2 posts/week | Alternate PT / EN | Mon: regulatory or market insight (BKPM 5/2025, visa index, CEPA milestones) · Thu: story from the field (anonymised case, embassy-years lessons, Indonesia culture for business) |
| Company page | 2 posts/week | PT + EN | Reshare founder posts. New guides. Event announcements. "Myth vs fact" carousels (e.g. "PT PMA needs IDR 10 bn paid-up? Not since Oct 2025") |
| Joko | 2 posts/month | EN | Cross-border payments, FX, fraud red flags (no bank-specific advice) |
| Nabela | 2 posts/month | EN/ID | Digital tools for cross-border teams, AI for SMEs entering Asia |
| Mia | 1 post/month | PT | Translation and document tips for Portuguese companies dealing with Indonesia |

### 4.3 Growth actions

- Founder connects with 20–30 relevant people/week: Portuguese export managers in target sectors, AICEP/AEP/chamber staff, EuroCham/EIBN contacts, Indonesian buyers.
- One **LinkedIn newsletter** ("Ponte Portugal–Indonésia", monthly, PT/EN) that repurposes the LUSO guides.
- One **LinkedIn Live/webinar per quarter** with a partner (chamber, AICEP, partner law firm): "Indonesia market entry after CEPA".
- Measure: followers, post impressions, profile → site clicks (UTM `utm_source=linkedin`), and `LN-*-*-LI` WhatsApp tags. Review monthly with the CRM KPIs.

### 4.4 Guardrails

- No claims of government endorsement or "official partner" status without a written agreement.
- No client names without written consent.
- Same compliance vocabulary as the site: information and practical guidance, in-person accompaniment, certified translations, licensed partners for legal/tax/customs matters. Business guidance only, never legal, tax, investment or customs-brokerage advice.
- Never post or invite job offers / candidate requests. Decline recruitment enquiries politely ("we don't recruit or place workers").

---

## 5. 90-day checklist

| Week | Action | Owner |
|---|---|---|
| 1 | Decide the GBP option (§1.1). Create LinkedIn page. Align founder profile | Aditya |
| 1–2 | Verify GBP. Mirror to Bing/Apple. Create review link | Aditya / Nabela |
| 2 | Contact KBRI Lisabon, confirm the bilateral chamber, reach PPI Portugal | Aditya |
| 3–4 | Ask all past clients (last 12 months) for reviews using §2 scripts | Whole team |
| 4–6 | University international offices (×6): webinar offer | Aditya |
| 4–8 | Sector associations (×6): CEPA/market note offer | Aditya |
| 6–10 | First op-ed pitch (PT media) timed to the CEPA milestone | Aditya |
| Monthly | 6–8 outreach contacts, review KPIs, update this list's ⚠️ items | Aditya / Nabela |
