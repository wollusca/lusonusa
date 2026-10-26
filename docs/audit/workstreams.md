# Parallel Workstreams: Phase 1

This document splits the improvements from `docs/audit/2026-10-website-audit.md` into workstreams that can run **at the same time in separate Claude Code cloud sessions without editing the same files**.

## How the split avoids conflicts

The site is three shared files (`index.html`, `app.js`, `style.css`), an `articles/` folder, and image folders. Most homepage fixes touch all three shared files at once, so they cannot be split across sessions safely. The split is therefore **by file ownership**, not by topic:

- Each workstream **owns** a set of paths. Only the owner edits or deletes them.
- Workstreams may **create new files** only inside their own paths.
- Cross-stream needs (a favicon, a privacy page, a link) are settled **in advance** by the shared contract below. Nobody waits on another session; they reference the agreed path.
- **Phase 2** (moving to a static site generator with `/pt/` and `/id/` URLs) rewrites every file. It runs **after** Phase 1 is merged and is not part of this split.

## Ownership map

| Stream | Branch | Owns (may edit) | Must not touch |
|---|---|---|---|
| **1. Homepage UX, accessibility & performance** | `claude/p1-homepage` | `index.html`, `app.js`, `style.css`, `images/**`, new files under `assets/img/**` | `articles/**`, root SEO/legal files of Stream 3, `docs/**` |
| **2. Articles & guides** | `claude/p1-articles` | `articles/**`, new files under `assets/articles/**` | `index.html`, `app.js`, `style.css`, existing `assets/*.jpg|png` (read-only, still referenced) |
| **3. SEO infrastructure & legal pages** | `claude/p1-seo-legal` | new root files: `robots.txt`, `sitemap.xml`, `404.html`, `privacy.html`, `terms.html`, `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest`, `og-image.jpg`, `legal.css` | everything else |
| **4. Content strategy & Phase-2 copy** | `claude/p1-content` | `docs/content/**` (Markdown only, no site code) | everything else |

`CNAME` and the existing `assets/*.jpg|png` files are **frozen** for everyone. Both homepage and articles use them, so add optimised copies under your own folder instead of replacing them.

## Shared contract (all streams follow this)

**Domain & canonical base:** `https://www.lusonusa.agency` (www, https, no trailing `index.html`). Homepage canonical is `https://www.lusonusa.agency/`.

**WhatsApp number:** `351930534440` → `https://wa.me/351930534440?text=…`. No placeholders anywhere.

**Email:** `contact@lusonusa.agency`

**Operating entity:** PT Wollusca Sukses Bersama (Purwokerto, Jawa Tengah, Indonesia).

**Team (the single source of truth; the homepage is correct, the articles are wrong):**

| Name | Role label | Title | Photo |
|---|---|---|---|
| Aditya Putra | Founder | Business & Bilateral Relations Lead | `assets/aditya.jpg` |
| Mia Gomes | Translation Specialist | Legal & Notarized Translation Lead | `assets/mia.jpg` |
| Joko Supriyanto | Banking & Finance | Banking & Financial Advisory Specialist | `assets/joko.jpg` |
| Nabela Huwaida | Technology & AI | Digital Transformation & Innovation Specialist | `assets/nabela.jpg` |

"Maria Santos", "Nabela Rahma" and "Joko Santoso" must not appear anywhere. Mia Gomes is **not** a "sworn" or "court" translator in any language. Translations are "certified/notarized before a Portuguese notary".

**Article author mapping (owner to confirm in review):** Indonesia visa guide → Aditya Putra; PT PMA guide → Aditya Putra; NIF/NISS/AIMA guide → Aditya Putra; translation & notary guide → Mia Gomes.

**Service hours (all languages):** Mon–Fri, 10:00–16:00 Lisbon time / 16:00–22:00 WIB (summer), or 17:00–23:00 WIB in winter. Phrase it as "10:00–16:00 Lisbon time (Mon–Fri)" plus the WIB equivalent.

**Fixed paths created by Stream 3 (others may link to them before they exist):**

| Path | Purpose |
|---|---|
| `/favicon.svg`, `/favicon.ico`, `/apple-touch-icon.png`, `/site.webmanifest` | icons |
| `/og-image.jpg` (1200×630) | default social preview image |
| `/privacy.html` | Privacy & cookie policy (EN, with PT/ID summaries) |
| `/terms.html` | Terms & legal disclaimer |
| `/404.html` | Not found page |

Standard `<head>` icon block for any page (Streams 1 and 2 paste this):
```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

**Article URLs (keep unchanged in Phase 1 so links don't break):** `/articles/`, `/articles/indonesia-visa-guide-2026.html`, `/articles/pt-pma-indonesia-setup.html`, `/articles/nif-niss-aima-portugal-guide.html`, `/articles/sworn-translation-notary-guide.html`. Stream 3's sitemap lists these. Stream 1 links to them from the homepage (`#insights` section).

**CSS dependency:** article pages load `/style.css`. Stream 1 must **keep these selectors and variables working**: `.site-nav`, `.nav-pill`, `.nav-pill-dot`, `.nav-lang`, `.nav-lang-btn`, `.nav-gradient-veil`, `.section-container`, `.reveal`, and every CSS custom property in `:root` (they may get new values, but not be renamed or removed). Stream 2 may reduce this dependency by moving article-specific styles into `articles/articles.css`.

**Icons:** no `unpkg.com/lucide@latest`. Use inline SVG, or a pinned version (`lucide@0.469.0` or similar) only as a stop-gap.

**Third-party embeds:** YouTube must use `https://www.youtube-nocookie.com/embed/…` and must not autoplay under `prefers-reduced-motion: reduce`.

**Legal wording:** describe services as administrative support, guidance and document coordination, not legal advice. Wording like "legal advice", "lawyer" or "sworn translator" (as LUSONUSA's own title) is not allowed.

## Definition of done (every stream)

1. Only owned paths changed (`git diff --stat main...HEAD` proves it).
2. The page(s) render in headless Chromium at 1440×900 and 390×844 with no console errors from your code. Screenshots checked.
3. Every link you add points to a contract path or an existing file.
4. Commit on your branch and push it. Do **not** open a pull request; the owner will decide. End with a summary of what changed and anything the owner must confirm.

## Merge order

Any order works because file sets don't overlap. Recommended: 3 → 2 → 1 → 4. Phase 2 starts from `main` once all four have merged.
