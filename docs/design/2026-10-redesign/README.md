# LUSONUSA homepage redesign: proposal (Oct 2026)

Status: **proposal, awaiting owner approval**. Nothing here is live.
Prototype: `prototype/index.html` (open it from a local server at the repo root, e.g. `python3 -m http.server` then `/docs/design/2026-10-redesign/prototype/`). Screens: `screens/`.

## Why a redesign
The Phase 1 changes fixed SEO, accessibility and conversion, but did it by stacking new content on top of a design built for a different structure. The result is a centred stack of four competing text blocks (logo, bold sans tagline, grey paragraph, trust pill) above a split screen. This proposal rebuilds the blueprint around the new content instead.

Owner feedback addressed:
1. Hero typography looked poor → new type system (below).
2. Remove the embassy "Founded by…" line → removed everywhere except as a factual line in Aditya's bio.
3. Retire the LUSO/NUSA split and the hover-expansion effect → one cinematic Lisbon/Java canvas plus two "direction" cards. Hovering a card slides the seam between the two photos toward that side, a quieter descendant of the original split.
4. "How Can We Help?" glitch and upgrade → replaced by a chat-style "Find your path" concierge (see below). The glitch came from the next section's pinned (`position: fixed`) YouTube background inside a `clip-path` container, which browsers re-clip a frame late while scrolling. The new design has no pinned video.
5. "1–2 days research" ambiguity → process rewritten around a free first orientation (reply within 1–2 working days) and paid, quoted deeper research.
6. Team tags → academic credentials as the blue tag; embassy kept only in the bio text.

## Typography system
Three families, each with one job.

| Role | Family | Weight | Size (mobile → desktop) | Line height | Tracking | Notes |
|---|---|---|---|---|---|---|
| Wordmark | Cinzel | 600 | 18px | 1 | 0.22em | Logo only. Never for sentences |
| H1 | Cormorant Garamond | 500 (+ italic 500 for *Portugal*/*Indonesia*) | 42 → 84px `clamp(2.625rem, 1.5rem + 4vw, 5.25rem)` | 1.0 | −0.015em | Sentence case. Max 2 lines on desktop |
| H2 (section titles) | Cormorant Garamond | 500 | 36 → 60px `clamp(2.25rem, 1.6rem + 2.6vw, 3.75rem)` | 1.05 | −0.01em | `text-wrap: balance` |
| Card display titles | Cormorant Garamond | 500 | 28 → 34px | 1.1 | 0 | Direction cards, team names |
| H3 (UI headings) | Inter | 600 | 18px | 1.3 | 0 | Process steps, result cards |
| Eyebrow | Inter | 600 | 12px | 1 | 0.2em, uppercase | Preceded by a 36px blue→red gradient rule |
| Lede | Inter | 400 | 17 → 20px | 1.6 | 0 | Max 38em wide, colour `--muted` |
| Body | Inter | 400 | 16px | 1.65 | 0 | |
| Small / meta | Inter | 500 | 13–14px | 1.5 | 0 | |
| Buttons | Inter | 600 | 15px (14px small) | 1 | 0.01em | Pill radius, 0.95rem × 1.4rem padding |

Rules:
- One display serif (Cormorant) carries all large text. Cinzel is reserved for the logo, because all-caps Cinzel is unreadable in sentences.
- Never bold the serif; size and italics do the emphasis.
- Left-align hero and section copy; centred multi-line text was the main cause of the old hero's messy look.
- Country names are the only coloured words: *Portugal* in `--luso` (#6EA8FF), *Indonesia* in `--nusa` (#F2697C).

## Colour & spacing tokens
`--bg #0B0D12`, `--surface #12151C`, `--surface-2 #171B24`, `--text #F3F4F6`, `--muted #B4BBC8` (≈ 10:1 on bg), `--dim #8E98AA` (≈ 6:1), `--luso #6EA8FF`, `--nusa #F2697C`, `--wa #1FAF5A`.
Spacing: 8-pt scale (8, 16, 24, 32, 48, 64, 96, 128px). Sections 128px top/bottom on desktop, 96px on mobile. Container 1216px. Card radius 18px.

## Section blueprint
1. **Header**: wordmark left, 4 links centre, language switch and one white "Free first consultation" button right. Transparent gradient over the hero, solid on scroll.
2. **Hero** (≥100svh): full-bleed Lisbon (left) and Java (right) photos joined by a soft 28%-wide feathered seam. Videos can return later as a single crossfading loop, not two iframes. Left-aligned copy: eyebrow "Portugal · Indonesia", H1, lede, two buttons. Bottom: two glass **direction cards**:
   - *Portugal → Indonesia: Grow into Indonesia*: market entry, PT PMA, supplier checks, visas & KITAS.
   - *Indonesia → Portugal: Settle & build in Portugal*: NIF & NISS, AIMA, banking, certified translation, business setup. This covers Indonesian businesses expanding into Portugal too.
   Hover or focus slides the seam toward that side (66% / 34%). Click opens the finder pre-set to that direction.
3. **Find your path** (replaces "How Can We Help?"): left, H2 plus three promises (a real person replies within 1–2 working days; first orientation free; deeper work quoted first). Right, a chat-style panel styled like a messaging thread: direction → topic → timing as tap-able chips. It ends in a result card listing what we can help with, the indicative price and **Send to us on WhatsApp** (pre-filled with the answers) or **Email instead**, plus the "not legal advice / don't send ID documents" line. Fully keyboard-accessible buttons; no free-text fields.
4. **How we work**: 4 steps on a ruled timeline: Tell us (free) → Free first orientation (reply in 1–2 working days) → Go deeper if you want (quoted upfront) → We walk it with you (agreed in writing; extra time only after asking). No background video.
5. **Our network**: tall black-and-white portraits (back to the original card look), name in Cormorant, one blue credential tag plus optional grey tag. Bios open on tap or hover in the implementation.
6. Footer unchanged in content.

## Team tags
| Person | Blue tag | Grey tag | Bio note |
|---|---|---|---|
| Aditya Putra | MBA · M.Sc. Double Degree | 9+ yrs in Portugal | "Double master's: MBA (FEB UGM) and M.Sc. in International Management (ISCTE-IUL). Nine years in Portugal, including five in the Economic Section of the Embassy of the Republic of Indonesia in Lisbon." |
| Mia Gomes | Native PT & ID | | No embassy or court mention until she confirms |
| Joko Supriyanto | M.Sc. Economics · ISEG | 7+ yrs in Portugal | |
| Nabela Huwaida | M.Sc. Strategic Marketing | | |

## Open choices for the owner
- Approve the overall direction, or ask for changes.
- Keep the photos static or bring back video as one crossfading loop.
- Process step 3 replaces the old "complimentary 1-on-1 call" step; the call becomes part of the free orientation ("or a short call if that's easier"). Confirm.
