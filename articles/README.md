# /articles/ — maintainer notes

## Files

| File | Purpose |
|---|---|
| `authors.js` | **Author registry**: the only place where names, roles, bios and avatars live. Keyed by stable id (`aditya-putra`, `mia-gomes`, …). |
| `articles-data.js` | Article registry for the hub: titles and descriptions per language, and `author` (an id from `authors.js`). |
| `articles-renderer.js` | Renders hub cards from both registries for the selected language and topic. |
| `article-i18n.js` | Language switcher: UI strings, `[data-lang-content]` blocks, one visible `<h1>`. |
| `article-page.js` | Reading progress bar and active table-of-contents link. |
| `articles.css`, `icons.svg` | Article styles and the icon sprite. These depend only on `:root` tokens from `/style.css`. |
| `check-authors.js` | Consistency check: `node articles/check-authors.js` |

## Add an author

1. Add an entry to `authors.js` (see the header comment there). The id never changes once used.
2. Use the id in `articles-data.js` (`author`, `updatedBy`, `reviewedBy`). The hub needs no other change.
3. In a static article page, copy the author block and Person JSON-LD below with the registry values.
4. Run `node articles/check-authors.js`.

## Mark an article as updated or reviewed

**1. `articles-data.js`**

```js
dateModified: '2027-03-01',
updatedBy: 'mia-gomes',     // optional, author id
reviewedBy: 'aditya-putra', // optional, author id
```

**2. Article header** (each language block, inside `.article-meta`):

```html
<span><svg class="icon" aria-hidden="true"><use href="/articles/icons.svg#check-circle"></use></svg>
  Updated <time datetime="2027-03-01">1 Mar 2027</time> by <a href="/#team">Mia Gomes</a></span>
<span>Reviewed by <a href="/#team">Aditya Putra</a></span>
```

Also update the "Last reviewed" line in the *Sources & review* box, and `article:modified_time`.

**3. JSON-LD** (in the page's `@graph`):

```json
{ "@type": "Article", "...": "...",
  "dateModified": "2027-03-01",
  "author": { "@id": "https://www.lusonusa.agency/#aditya-putra" },
  "editor": { "@id": "https://www.lusonusa.agency/#mia-gomes" } },
{ "@type": "WebPage", "@id": "<article url>",
  "lastReviewed": "2027-03-01",
  "reviewedBy": { "@id": "https://www.lusonusa.agency/#aditya-putra" } },
{ "@type": "Person", "@id": "https://www.lusonusa.agency/#mia-gomes",
  "name": "Mia Gomes", "jobTitle": "Translation Specialist, Legal & Notarized Translation Lead",
  "image": "https://www.lusonusa.agency/assets/mia.jpg", "url": "https://www.lusonusa.agency/#team",
  "worksFor": { "@id": "https://www.lusonusa.agency/#organization" } }
```

`editor` belongs on the Article; `reviewedBy` and `lastReviewed` are WebPage properties. Every Person referenced needs its own node, with `@id` `https://www.lusonusa.agency/#<author id>`.

## Content rules

- **Who we are:** LUSONUSA is a collaborative network of independent bilingual professionals in Portugal and Indonesia, not a company. Each service is contracted and invoiced directly by the professional who delivers it. The site operator and contact is Aditya Putra (founder), Portugal: contact@lusonusa.agency, WhatsApp +351 930 534 440. Do not name any legal entity in copy, footers or JSON-LD. The JSON-LD Organization is the LUSONUSA brand only (name, url, logo).
- **Positioning:** information and practical guidance based on public official sources. This does not replace a lawyer; refer readers to licensed professionals (advogado/solicitador, Indonesian lawyer or notary, tax adviser) when needed. Never use "lawyer", "legal advice" or "sworn translator" as a LUSONUSA title.
- **Documents:** never invite readers to send identity or immigration documents (passport, residence permit, visa, etc.) by WhatsApp, email or upload. Ask them to describe what they have.
- **Travel:** recommendations and booking assistance only.
- **Footer** (all pages; translated via `footer.disclaimer` in `article-i18n.js`): "LUSONUSA is a network of independent bilingual professionals in Portugal and Indonesia. Services are contracted directly with the professional who delivers them. Information and guidance, not legal advice." Add links to `/privacy.html` and `/terms.html`.
- Every regulatory article needs a "Last reviewed" date and links to official sources. Review it at least every 6 months.
- Unconfirmed facts get `<span class="verify-flag">…</span>` plus an `<!-- OWNER REVIEW: … -->` comment until confirmed.
- WhatsApp links: `https://wa.me/351930534440?text=…(Ref: <article-id>)`.
- Service hours: Mon–Fri, 10:00–16:00 Lisbon time.
