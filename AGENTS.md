# AGENTS.md — instructions for AI coding agents (Antigravity, Gemini, Claude, Copilot, …)

LUSONUSA (www.lusonusa.agency) is a static website: plain HTML, CSS and JavaScript with no build step, hosted on **GitHub Pages from the `main` branch**. Anything pushed to `main` is live within about a minute.

## ⚠️ Required after editing CSS or JS
Browsers cache `style.css`, `app.js`, `legal.css` and `legal.js`. The HTML loads them with version tags (`style.css?v=377daeb5`). If you change any of those four files and don't update the tags, visitors with a cached copy get the **new HTML with the old CSS**, and the layout breaks until they hard-refresh.

**Before every commit that touches `style.css`, `app.js`, `legal.css` or `legal.js`, run:**
```bash
./tools/bump-asset-versions.sh
```
Commit the HTML files it changes together with your CSS/JS change. The script is safe to run any number of times.

Optional, once per machine: `git config core.hooksPath .githooks` installs a pre-commit hook that runs the script for you.

## Project map
| Path | What it is |
|---|---|
| `index.html`, `style.css`, `app.js` | Homepage. All homepage copy is translated in `app.js` (`translations` = EN/PT/ID; `FINDER` = "Find your path" topics) |
| `terms.html` / `termos.html`, `privacy.html` / `privacidade.html` | Legal pages in EN and PT, styled by `legal.css`; `legal.js` = "Show NIF" button |
| `404.html`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, icons, `og-image.jpg` | SEO and site files |
| `assets/img/` | Optimised images (WebP + JPEG, several sizes) |
| `docs/design/2026-10-redesign/` | Design system and blueprint: fonts, sizes, colours, spacing. Follow it |
| `docs/research/`, `docs/operations/`, `docs/content/` | Legal/tax research, client SOP, content plans (not part of the website) |
| `tools/` | Helper scripts |

## Rules that must not be broken
1. **Translations:** every visible text has EN, PT (European Portuguese) and ID versions in `app.js`, and the HTML default text must equal the EN entry. Add all three when you add text. Two-part titles use `"part one | part two"`; each part becomes its own line.
2. **Legal wording:** LUSONUSA gives information, guidance and in-person accompaniment, **not legal advice**, and is not a law firm. Never call anyone a "sworn translator" (*tradutor juramentado*, *penerjemah tersumpah*). Translations are "certified before a Portuguese notary". Don't promise outcomes or referrals to partners that don't exist. Only promise replies "in English or Indonesian".
3. **Personal data:** never write the operator's NIF as plain text anywhere in the repo (it is public). It is stored encoded in the legal pages and revealed by `legal.js`. Don't publish a home address.
4. **Business identity:** LUSONUSA is a network of independent professionals. Do not mention "PT Wollusca Sukses Bersama" anywhere on the site. Do not mention the Embassy of Indonesia except in Aditya's bio text.
5. **Articles/guides are offline on purpose** until every legal claim is verified (`docs/research/article-claims-source-map.md`). Keep `SHOW_GUIDES = false` in `app.js` and don't link to `/articles/` or add it to the sitemap without the owner's approval.
6. **Contacts:** WhatsApp `351930534440` (constant `WHATSAPP_NUMBER` in `app.js`), email `contact@lusonusa.agency`. Never use placeholder numbers.
7. **No unpinned third-party scripts**, e.g. no `@latest` from a CDN. Icons are inline SVG. No YouTube embeds or pinned (`position: fixed`) background videos; they caused scroll glitches and privacy issues.
8. **Design:** fonts are Cinzel (logo only), Cormorant Garamond (headings) and Inter (text). Team photo look is the `--portrait-filter` token in `style.css` (currently softened colour). Keep WCAG AA contrast and visible keyboard focus.

## Before pushing to `main`
- Run `./tools/bump-asset-versions.sh` if CSS/JS changed (see above).
- Open the page with a local server (`python3 -m http.server`), not by double-clicking: check desktop and mobile widths, switch EN/PT/ID, and confirm there are no console errors.
- Prefer working on a branch and letting the owner preview it before merging to `main`.
