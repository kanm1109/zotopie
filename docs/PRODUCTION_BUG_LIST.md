# Zotopie — Production Bug List

**QA Task:** QA-FINAL-PRODUCTION-SWEEP  
**Role:** Senior QA Engineer  
**Date:** 2026-06-14  
**Status:** Audit Complete — Fix Required  

---

## Severity Legend

| Level | Meaning |
|---|---|
| **P0 — Critical** | User-visible corruption; directly harms trust or revenue |
| **P1 — High** | Broken feature or significant SEO/UX degradation |
| **P2 — Medium** | Quality issue; does not break flow but reduces polish |
| **P3 — Low** | Cosmetic, documentation, or minor inconsistency |

---

## P0 — Critical

### BUG-001: Star rating mojibake (★ → â˜…) — 6 files, 435+ pages

| Field | Value |
|---|---|
| **ID** | BUG-001 |
| **Severity** | P0 — Critical |
| **Symptom** | Star rating displays as `â˜… 4.8` instead of `★ 4.8` on every review card, search result, and hero badge across the site |
| **Affected files** | `src/pages/search.astro` L142, `src/pages/reviews/index.astro` (multiple), `src/pages/reviews/[slug].astro` (multiple), `src/pages/best/[slug].astro` (multiple), `src/pages/compare/[pair].astro` (multiple), `src/pages/alternatives/[slug].astro` (multiple) |
| **Affected pages** | ~435 pages: 119 review pages, 119 alternatives pages, ~180 compare pages, 15 best pages, reviews index, search page |
| **Pattern** | `â˜…` — UTF-8 bytes E2 98 85 misread as Windows-1252 and re-saved |
| **Root cause** | Same double-encoding as fixed in UI-FIX task, but ★ (U+2605) was missed. Previous fix only covered 5 patterns (em dash, ellipsis, 3 arrows). |
| **Evidence** | PowerShell scan confirmed: `$moji_star = [char]0x00E2 + [char]0x02DC + [char]0x2026` found in all 6 files |
| **Fix** | Replace `â˜…` → `★` in all 6 files (same PowerShell binary-safe approach used in UI-FIX task) |

---

### BUG-002: Check mark mojibake (✓ → âœ") — 3 files

| Field | Value |
|---|---|
| **ID** | BUG-002 |
| **Severity** | P0 — Critical |
| **Symptom** | Pricing table "✓ Yes" displays as `âœ" Yes`; CSS bullet list item before-content also corrupted — affects every pricing row and pros list on best/compare/review pages |
| **Affected files** | `src/pages/best/[slug].astro` L218, L854; `src/pages/compare/[pair].astro` L320, L321, L757, L846; `src/pages/reviews/[slug].astro` L824 |
| **Affected pages** | ~314 pages: 15 best pages, ~180 compare pages, 119 review pages |
| **Pattern** | `âœ"` — UTF-8 bytes E2 9C 93 misread as Windows-1252 |
| **Root cause** | Same double-encoding; ✓ (U+2713) was not in the original 5-pattern fix |
| **Evidence** | `$moji_check = [char]0x00E2 + [char]0x0153 + [char]0x201C` found in 3 files |
| **Fix** | Replace `âœ"` → `✓` in all 3 files |

---

### BUG-003: Ballot-X mojibake (✗ → âœ—) — 3 files

| Field | Value |
|---|---|
| **ID** | BUG-003 |
| **Severity** | P0 — Critical |
| **Symptom** | Pricing table "✗ No" displays as `âœ— No`; appears alongside BUG-002 on same lines |
| **Affected files** | `src/pages/best/[slug].astro` L218; `src/pages/compare/[pair].astro` L320, L321; `src/pages/reviews/[slug].astro` L824 |
| **Affected pages** | Same 314 pages as BUG-002 |
| **Pattern** | `âœ—` — UTF-8 bytes E2 9C 97 misread as Windows-1252 |
| **Root cause** | Same double-encoding; ✗ (U+2717) not in original fix |
| **Evidence** | `$moji_ballotx = [char]0x00E2 + [char]0x0153 + [char]0x2014` found in 3 files |
| **Fix** | Replace `âœ—` → `✗` in all 3 files (bundle with BUG-002 fix) |

---

### BUG-004: White star mojibake (☆ → â˜†) in compare star function

| Field | Value |
|---|---|
| **ID** | BUG-004 |
| **Severity** | P0 — Critical |
| **Symptom** | Compare page star rating display function renders `â˜…â˜…â˜…â˜…Â½â˜†` instead of `★★★★½☆`; all compare star ratings are garbled |
| **Affected files** | `src/pages/compare/[pair].astro` L42 |
| **Affected pages** | ~180 compare pages |
| **Pattern** | `â˜†` — UTF-8 bytes E2 98 86 misread as Windows-1252; also `Â½` for half-star |
| **Root cause** | The `renderStars()` function on line 42 uses three mojibake chars (★, ☆, ½) |
| **Evidence** | `return "â˜…".repeat(full) + (half ? "Â½" : "") + "â˜†".repeat(empty);` visible in file |
| **Fix** | Replace all three patterns in L42: `"â˜…"` → `"★"`, `"Â½"` → `"½"`, `"â˜†"` → `"☆"` |

---

### BUG-005: Em dash missed in best/[slug].astro (â€" on L331)

| Field | Value |
|---|---|
| **ID** | BUG-005 |
| **Severity** | P0 — Critical |
| **Symptom** | Scoring criteria text reads: "Each tool is scored 1â€"5 based on feature depth" — em dash visible as mojibake |
| **Affected files** | `src/pages/best/[slug].astro` L331 |
| **Affected pages** | 15 best/authority pages |
| **Pattern** | `â€"` — same em dash (U+2014) pattern fixed elsewhere, but this line was missed in UI-FIX task |
| **Root cause** | The UI-FIX task missed this specific occurrence; grep was not exhaustive for em dash |
| **Evidence** | Confirmed via content search in QA sweep |
| **Fix** | Replace `â€"` → `—` on L331 of best/[slug].astro |

---

## P1 — High

### BUG-006: 57 SVG logo files in public/logos/ are orphaned — ToolLogo ignores them

| Field | Value |
|---|---|
| **ID** | BUG-006 |
| **Severity** | P1 — High |
| **Symptom** | 30+ tools that were intended to have brand logos display initials fallback instead — e.g., Grammarly, HubSpot, Mailchimp, Yoast, Asana, Todoist, Wix, WooCommerce, BigCommerce, Ghost, IFTTT, Hotjar, Brevo, Kinsta, WP Engine, Namecheap, Vultr, Squarespace, Canva, Slack |
| **Affected files** | `src/components/ToolLogo.astro` (reads only `icon-data.json`, never `/logos/*.svg`) |
| **Affected pages** | All pages showing tool logos (~435 pages) |
| **Root cause** | BRAND-V1 task added SVG files to `public/logos/` but did NOT update `ToolLogo.astro` to check for those files, and did NOT update `icon-data.json` with the 30 new icons. The component still only reads from `icon-data.json` which has 24 entries. |
| **Evidence** | `public/logos/` has 57 SVG files; grep of all `*.astro` source shows ZERO references to `/logos/` directory; `icon-data.json` has 24 keys; `tools-enriched.json` has 24 tools with `simple_icon` |
| **Discrepancy** | TOOL_LOGO_AUDIT.md claims "54 tools with official logos" but actual live count is 24 |
| **Fix** | Either: (A) Update `ToolLogo.astro` to use `<img src={/logos/${tool.slug}.svg}>` as primary check, or (B) Add all 30+ missing tools to `icon-data.json` with hex + SVG path |

---

### BUG-007: `aggregateRating.ratingCount` hardcoded to "1" across all 119 review pages

| Field | Value |
|---|---|
| **ID** | BUG-007 |
| **Severity** | P1 — High |
| **Symptom** | All 119 review pages emit `"ratingCount": "1"` in SoftwareApplication JSON-LD, implying only 1 person has rated each tool — factually incorrect and may trigger Google's quality review |
| **Affected files** | `src/pages/reviews/[slug].astro` L202 |
| **Affected pages** | 119 review pages |
| **Root cause** | `ratingCount: "1"` was hardcoded as a placeholder; no real user rating count data exists |
| **Evidence** | L202: `ratingCount: "1",` — static string, not derived from data |
| **Fix** | Either: (A) Remove `aggregateRating` from SoftwareApplication (leave only in Review node), or (B) Add a `ratingCount` field to tool data with realistic values, or (C) Change to a higher placeholder (100+ minimum to be credible) |

---

### BUG-008: Homepage (index.astro) has no JSON-LD structured data

| Field | Value |
|---|---|
| **ID** | BUG-008 |
| **Severity** | P1 — High |
| **Symptom** | The homepage emits no structured data — no WebSite schema, no Organization schema, no SearchAction (sitelinks search box) |
| **Affected files** | `src/pages/index.astro` |
| **Affected pages** | 1 page (homepage) — but impacts Google Search appearance for entire domain |
| **Root cause** | JSON-LD was never added to the homepage during any build task |
| **Evidence** | `index.astro - JSON-LD: False, schema.org: False` confirmed via grep |
| **Fix** | Add WebSite + Organization + SearchAction JSON-LD to index.astro (or MainLayout with homepage-only condition) |

---

## P2 — Medium

### BUG-009: Font inconsistency — core pages use Plus Jakarta Sans, content pages use Atkinson

| Field | Value |
|---|---|
| **ID** | BUG-009 |
| **Severity** | P2 — Medium |
| **Symptom** | Visiting a blog/extensions/reddit/threads article switches the entire typography to Atkinson Hyperlegible; visiting any tool review, compare, or search page uses Plus Jakarta Sans — two different design languages on same domain |
| **Affected files** | `src/layouts/ArticleLayout.astro`, `src/layouts/BlogPost.astro`, `src/layouts/CategoryLayout.astro` (all use `BaseHead.astro` → `global.css` with Atkinson) vs `src/layouts/MainLayout.astro` (Plus Jakarta Sans via Google Fonts) |
| **Affected pages** | Blog, Extensions, Marketing, Reddit, Threads sections |
| **Root cause** | Legacy Astro blog template layouts (ArticleLayout, BlogPost, CategoryLayout) were never updated to use MainLayout when the UI-V2 rebrand shipped Plus Jakarta Sans |
| **Evidence** | `BaseHead.astro` references Atkinson font; `MainLayout.astro` loads Plus Jakarta Sans from Google Fonts CDN |
| **Fix** | Migrate content section layouts to use MainLayout, or inject Plus Jakarta Sans into BaseHead.astro and remove Atkinson config from astro.config.mjs |

---

### BUG-010: GA4 event coverage gaps — key user interactions not tracked

| Field | Value |
|---|---|
| **ID** | BUG-010 |
| **Severity** | P2 — Medium |
| **Symptom** | Only 2 custom events exist: `affiliate_click` (go/[slug]) and `search` (search.astro). No events for: compare page views by pair, review page "Visit Tool" CTA (non-affiliate), best page tool clicks, category browsing depth |
| **Affected files** | `src/pages/compare/[pair].astro`, `src/pages/reviews/[slug].astro`, `src/pages/best/[slug].astro`, `src/pages/category/[slug].astro` |
| **Root cause** | S1.1 Measurement Foundation task only implemented the two highest-priority events; additional events were listed as future work |
| **Evidence** | Grep for `gtag('event'` across all source files returns only 2 locations (go/[slug].astro:59 and search.astro:254) |
| **Fix** | Add `tool_view` event on review pages, `compare_view` on compare pages, `cta_click` on best pages |

---

### BUG-011: GA4 Measurement ID not verified as deployed to Cloudflare Pages

| Field | Value |
|---|---|
| **ID** | BUG-011 |
| **Severity** | P2 — Medium |
| **Symptom** | If `PUBLIC_GA_ID` is not set in Cloudflare Pages environment variables, ALL analytics are silently disabled — GA4 gating `{GA_ID && (...)}` emits nothing |
| **Affected files** | `src/layouts/MainLayout.astro` L13, L258-264; `src/pages/go/[slug].astro` L16 |
| **Root cause** | The env variable is gated by design (good), but deployment to Cloudflare Pages Settings → Environment Variables has not been confirmed as complete |
| **Evidence** | `.env.example` exists with `PUBLIC_GA_ID=` blank; no `.env` file in repo (correct); cannot verify Cloudflare dashboard from source code |
| **Fix** | Verify in Cloudflare Pages dashboard: Settings → Environment Variables → `PUBLIC_GA_ID = G-XXXXXXXXXX` is set for Production environment |

---

## P3 — Low

### BUG-012: public/logos/ contains 5 SVG files for tools not in the database

| Field | Value |
|---|---|
| **ID** | BUG-012 |
| **Severity** | P3 — Low |
| **Symptom** | Orphan asset files: `apollo.svg`, `frase.svg`, `instantly.svg`, `lemlist.svg`, `snovio.svg` — no corresponding tool slugs in tools-enriched.json |
| **Affected files** | `public/logos/apollo.svg`, `public/logos/frase.svg`, `public/logos/instantly.svg`, `public/logos/lemlist.svg`, `public/logos/snovio.svg` |
| **Root cause** | Pre-populated for planned tool expansion (these appear in TOOL_EXPANSION_PLAN.md Priority 1 list) |
| **Evidence** | None of these slugs appear in tools-enriched.json |
| **Fix** | Either add these tools to the database (part of S1 expansion) or remove the orphan SVG files |

---

### BUG-013: TOOL_LOGO_AUDIT.md documents incorrect logo count (54 claimed, 24 actual)

| Field | Value |
|---|---|
| **ID** | BUG-013 |
| **Severity** | P3 — Low |
| **Symptom** | Documentation says "54 tools have official logos" — the BRAND-V1 commit message and docs repeat this claim — but the live site shows 24 tools with logos and 95 with initials fallback |
| **Affected files** | `docs/TOOL_LOGO_AUDIT.md` |
| **Root cause** | The audit doc was written for the planned outcome; the actual data file update (icon-data.json and tools-enriched.json simple_icon fields) was not completed for the additional 30 tools |
| **Evidence** | `tools-enriched.json` git history: only 24 entries with `simple_icon` in BRAND-V1 commit (confirmed via `git show de00b67:src/data/generated/tools-enriched.json`) |
| **Fix** | Update TOOL_LOGO_AUDIT.md to reflect actual 24/119, and resolve BUG-006 to make the count match documentation |

---

## Summary Table

| Bug ID | Severity | Category | Files | Pages Affected |
|---|---|---|---|---|
| BUG-001 | P0 | Encoding | 6 | 435+ |
| BUG-002 | P0 | Encoding | 3 | 314 |
| BUG-003 | P0 | Encoding | 3 | 314 |
| BUG-004 | P0 | Encoding | 1 | ~180 |
| BUG-005 | P0 | Encoding | 1 | 15 |
| BUG-006 | P1 | Logo system | 1 component | 435+ |
| BUG-007 | P1 | Structured data | 1 | 119 |
| BUG-008 | P1 | Structured data | 1 | 1 (homepage) |
| BUG-009 | P2 | Brand/UX | 3 layouts | Blog/content sections |
| BUG-010 | P2 | Analytics | 4 pages | N/A (tracking gap) |
| BUG-011 | P2 | Analytics | 2 files | All pages |
| BUG-012 | P3 | Assets | 5 files | 0 (orphaned) |
| BUG-013 | P3 | Docs | 1 doc | 0 (documentation) |

**Total P0:** 5  
**Total P1:** 3  
**Total P2:** 3  
**Total P3:** 2  
**Grand total:** 13 bugs

---

*Audit performed: 2026-06-14 | QA-FINAL-PRODUCTION-SWEEP | Do not fix during audit phase*
