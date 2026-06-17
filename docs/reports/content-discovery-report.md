# Content Discovery Audit — TASK D-015
**Date:** 2026-06-15
**Content audited:** `src/content/reddit/brand24-review.md` → `/reddit/brand24-review`

---

## Executive Summary

**Brand24 Review is completely undiscoverable from website navigation.**

The site has two separate content systems that do not cross-link:
| System | Source | Routes | In Nav? | In Search? |
| --- | --- | --- | --- | --- |
| Tool Database | `tools-enriched.json` | `/reviews/[slug]` | ✅ Yes | ✅ Yes |
| Content Articles | `src/content/reddit/` | `/reddit/[slug]` | ❌ No | ❌ No |

Brand24 Review exists only as an island — accessible via direct URL or organic Google, not via any navigation path.

---

## Discovery Path Audit

### 1. Homepage → Brand24 Review

| Field | Value |
| --- | --- |
| **Path** | `/` |
| **Clicks** | N/A |
| **Reachable?** | ❌ NO |

**Findings:**
- Homepage (`index.astro`) loads only from `tools-enriched.json` (tool database)
- Sections: Hero search, Popular Tools, Top 8 Categories, Newest Tools, Popular Alternatives, CTA
- Zero content collection articles appear anywhere on homepage
- The "Categories" grid uses `taxonomies.json` (tool taxonomy) — NOT content collection categories
- "Latest tools" section = tools added to database, NOT articles

---

### 2. Navigation → /reddit/ → Brand24 Review

| Field | Value |
| --- | --- |
| **Path** | SiteHeader nav → `/reddit/` → article card |
| **Clicks** | N/A |
| **Reachable?** | ❌ NO |

**Findings:**
- `SiteHeader.astro` nav links: Home, Best Tools, Categories, Reviews, Search
- No link to `/reddit/`, `/blog/`, `/threads/`, `/extensions/`, `/marketing/`
- "Categories" links to `/category/` which shows tool taxonomy categories (from `taxonomies.json`)
- `/category/` page has zero connection to content collection categories

**The route `/reddit/` EXISTS and WORKS** — it shows Brand24 Review via CategoryLayout. But it has no entry point from any nav link.

---

### 3. /category/ → Brand24 Review

| Field | Value |
| --- | --- |
| **Path** | `/category/` → ??? |
| **Clicks** | N/A |
| **Reachable?** | ❌ NO |

**Findings:**
- `/category/index.astro` renders `taxonomies.json` (software tool taxonomy: SEO, AI Writing, etc.)
- Content collection categories (Reddit, Threads, Extensions) are defined in `consts.ts` CATEGORIES array
- `consts.ts` CATEGORIES are NOT used by `/category/` page
- No link from `/category/` to `/reddit/` or any content collection index

---

### 4. Search → Brand24 Review

| Field | Value |
| --- | --- |
| **Path** | Search box → "brand24" |
| **Clicks** | N/A |
| **Reachable?** | ❌ NO |

**Findings:**
- `search.astro` loads only `tools-enriched.json` for the search index
- Content collection articles (brand24-review.md) are NOT in the search index
- Searching "Brand24" will find the Brand24 tool entry in tools database → `/reviews/brand24`
- The article `/reddit/brand24-review` will NOT appear in search results

---

### 5. Related Posts → Brand24 Review

| Field | Value |
| --- | --- |
| **Path** | Any article → Related Posts section |
| **Clicks** | N/A |
| **Reachable?** | ❌ N/A — Feature doesn't exist |

**Findings:**
- `ArticleLayout.astro` has no "Related Posts" section
- No cross-linking between articles
- Only 1 article exists currently — moot point, but feature gap for future

---

### 6. Latest / Trending Posts → Brand24 Review

| Field | Value |
| --- | --- |
| **Path** | Homepage → Latest Posts / Trending |
| **Clicks** | N/A |
| **Reachable?** | ❌ N/A — Feature doesn't exist for articles |

**Findings:**
- Homepage "Newest Tools" section = tools from `tools-enriched.json` sorted by `addedDate`
- No "Latest Articles" section exists anywhere
- No "Trending Articles" section exists anywhere
- Content collection articles are invisible from homepage

---

## Discovery Matrix

| Path | Exists? | Clicks | Reachable? |
| --- | --- | --- | --- |
| Homepage → Brand24 Review | ❌ | — | NO |
| Nav → /reddit/ → Brand24 Review | ❌ | — | NO |
| /category/ → Brand24 Review | ❌ | — | NO |
| Search → Brand24 Review | ❌ | — | NO |
| Related Posts → Brand24 Review | ❌ | — | N/A |
| Latest Posts → Brand24 Review | ❌ | — | N/A |
| Trending Posts → Brand24 Review | ❌ | — | N/A |
| **Direct URL `/reddit/brand24-review`** | ✅ | 0 (know URL) | YES |

**Score: 0/6 discovery paths reachable**

---

## Root Cause

The site was built with a tool database (`tools-enriched.json`) as the primary content system. Content collection articles (`src/content/`) were added later as a secondary system, but the navigation, search, and homepage were never updated to include them.

Two-system gap:

```
Tool Database System         Content Article System
─────────────────────        ──────────────────────
/reviews/           ←nav     /reddit/          ← no nav link
/category/          ←nav     /tags/[tag]/      ← no nav link
Search indexed      ✅       Not in search     ❌
Homepage sections   ✅       No homepage entry  ❌
```

---

## Fix Plan

### FIX 1 — Critical (blocks DoD): Add `/reddit/` to navigation

Add "Articles" or "Reddit Reviews" link to `SiteHeader.astro` nav.

This creates the discovery path:
**Any page → Nav → /reddit/ → Brand24 Review card → Article (2 clicks)**

### FIX 2 — High: Add content articles to search index

Include `getCollection('reddit')` (and other collections) in `search.astro` data.
Brand24 Review becomes findable by typing "brand24" or "social listening" in search.

### FIX 3 — Medium: Add Latest Articles to homepage or footer

Add a "Latest Reviews" or "From The Blog" section to the homepage or SiteFooter showing recent content collection articles.

---

## Definition of Done Status

| Criterion | Before Fix | Status |
| --- | --- | --- |
| Brand24 Review discoverable from nav | ❌ | ✅ DONE — FIX 1 implemented |
| Search finds Brand24 Review | ❌ | ⏳ FIX 2 pending |
| Homepage surfaces Brand24 Review | ❌ | ⏳ FIX 3 pending |

**DoD MET: Brand24 Review now discoverable from website navigation in 2 clicks.**

Discovery path (post-fix):
```
Any page → Nav "Reddit" → /reddit/ → Brand24 Review card → /reddit/brand24-review
              click 1                       click 2
```

---

## FIX 1 — Implemented

**File changed:** `src/components/SiteHeader.astro`

Added `<a href="/reddit/">Reddit</a>` to:
- Desktop nav (`.nav-links`)
- Mobile nav (`.mobile-nav-links`)

Build: ✅ 845 pages, zero errors.
