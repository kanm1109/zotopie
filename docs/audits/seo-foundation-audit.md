# D-028 — SEO Foundation Audit
**Date:** 2026-06-16  
**Build:** 857 pages  
**Status:** AUDIT ONLY — No changes made

---

## Executive Summary

| Area | Status | Priority Issues |
|---|---|---|
| Sitemap | ✅ PASS | /stats/ present but noindex |
| robots.txt | ✅ PASS | None |
| Canonicals | ✅ PASS | None |
| Indexability | ⚠️ WARN | 404 missing noindex; /stats/ conflict |
| Metadata | ⚠️ WARN | Homepage OG image is SVG |
| Structured Data | ✅ PASS | dateModified = datePublished (minor) |
| Internal Discovery | ✅ PASS | No orphan pages |

---

## Check 1 — Sitemap

**File:** `dist/sitemap-index.xml` → `dist/sitemap-0.xml`

### Result: ✅ PASS (with one note)

| Metric | Value |
|---|---|
| Sitemap index | `https://zotopie.com/sitemap-index.xml` |
| Sitemap file | `https://zotopie.com/sitemap-0.xml` |
| Total URLs | **735** |
| Last modified | `2026-06-16T07:57:50.188Z` |

### URL breakdown

| Section | Count |
|---|---|
| Homepage | 1 |
| Reddit articles | 5 |
| Category pages | 12 |
| Review pages | 120 |
| Best pages | 21 |
| Compare pages | 440 |
| Alternatives pages | 120 |
| Tag pages | 10 |

### Reddit articles in sitemap ✅

All 4 published articles + category page present:
- `https://zotopie.com/reddit/` ✅
- `https://zotopie.com/reddit/brand24-review/` — lastmod `2026-06-16`
- `https://zotopie.com/reddit/gummysearch-review/` — lastmod `2026-06-16`
- `https://zotopie.com/reddit/awario-review/` — lastmod `2026-06-16`
- `https://zotopie.com/reddit/best-reddit-monitoring-tools/` — lastmod `2026-06-16`

### Pages correctly excluded from sitemap ✅
- `/search/` — noindex, correctly excluded
- `/go/*` — 120 affiliate redirect pages, correctly excluded (matches robots.txt `Disallow: /go/`)

### ⚠️ Note — /stats/ in sitemap despite noindex
- `https://zotopie.com/stats/` is in sitemap
- Page has `noindex, nofollow` robots meta
- Contradictory: sitemap signals "crawl me" while noindex says "don't index me"
- Wastes crawl budget, should be excluded

### Built vs Sitemap delta
- Built index.html pages: **856**
- Sitemap URLs: **735**
- Delta: 121 (120 × `/go/` + 1 × `/search/` = all intentionally excluded ✅)

---

## Check 2 — robots.txt

**File:** `public/robots.txt`

### Result: ✅ PASS

```
User-agent: *
Allow: /

Disallow: /go/
Disallow: /search?*

Sitemap: https://zotopie.com/sitemap-index.xml
```

| Check | Status |
|---|---|
| Sitemap declaration | ✅ `https://zotopie.com/sitemap-index.xml` |
| Allow all | ✅ `Allow: /` |
| Affiliate redirects blocked | ✅ `Disallow: /go/` |
| Search with params blocked | ✅ `Disallow: /search?*` |
| No accidental blocking | ✅ |

**Note:** `/search?*` blocks parameterized search URLs but `/search/` (the page itself) is still crawlable — however it has `noindex` so this is acceptable.

---

## Check 3 — Canonicals

### Result: ✅ PASS

All 5 audited pages: self-referencing canonical, no duplicates, no localhost references.

| Page | Canonical | Count | Issues |
|---|---|---|---|
| Homepage | `https://zotopie.com/` | 1 | None |
| Brand24 Review | `https://zotopie.com/reddit/brand24-review/` | 1 | None |
| GummySearch Review | `https://zotopie.com/reddit/gummysearch-review/` | 1 | None |
| Awario Review | `https://zotopie.com/reddit/awario-review/` | 1 | None |
| Best Reddit Monitoring Tools | `https://zotopie.com/reddit/best-reddit-monitoring-tools/` | 1 | None |

---

## Check 4 — Indexability

### Result: ⚠️ WARN — 2 issues

| Page | noindex | robots meta | Notes |
|---|---|---|---|
| Homepage | ❌ (not set) | — | Correct — should be indexed ✅ |
| /reddit/ category | ❌ (not set) | — | Correct — should be indexed ✅ |
| /search/ | ✅ set | `noindex, follow` | Correct ✅ |
| /stats/ | ✅ set | `noindex, nofollow` | ⚠️ But in sitemap (conflict) |
| /404 | ❌ not set | — | ⚠️ Should have noindex |
| Reddit articles | ❌ (not set) | — | Correct — should be indexed ✅ |

### Issues

**Issue 1 — P2: `/stats/` is noindex but present in sitemap**
- `dist/stats/index.html` has `noindex, nofollow`
- `sitemap-0.xml` includes `https://zotopie.com/stats/`
- Fix: exclude `/stats/` from sitemap generation

**Issue 2 — P2: `/404` page has no noindex directive**
- `dist/404.html` has canonical pointing to `https://zotopie.com/404/`
- No `noindex` meta tag
- Google could potentially index the 404 page
- Fix: add `<meta name="robots" content="noindex, nofollow">` to 404 layout

---

## Check 5 — Metadata

### Result: ⚠️ WARN — OG image format issue on homepage

#### Homepage

| Field | Value | Status |
|---|---|---|
| Title | `Zotopie — Find the Best Software Tools` | ✅ |
| Description | `Search 100+ expert software tool reviews...` | ✅ |
| Canonical | `https://zotopie.com/` | ✅ |
| OG Title | `Zotopie — Find the Best Software Tools` | ✅ |
| OG Description | `Search 100+ expert software tool reviews...` | ✅ |
| OG URL | `https://zotopie.com/` | ✅ |
| OG Image | `https://zotopie.com/og-default.svg` | ⚠️ **SVG format** |
| Twitter Image | `https://zotopie.com/og-default.svg` | ⚠️ **SVG format** |

**Issue — P1: OG/Twitter image is SVG**
Facebook, Twitter/X, LinkedIn, Discord, and Slack do not render SVG in link previews. Only raster formats (WebP, PNG, JPG) are supported. The homepage will show a broken or empty image preview when shared on social media.
- Fix: replace `og-default.svg` with `og-default.webp` or `og-default.png` (recommended: 1200×630px)

#### Article Pages — All PASS

| Page | Title | Description | OG Image | noindex |
|---|---|---|---|---|
| Brand24 Review | ✅ `Brand24 Review (2026)...` | ✅ 155 chars | ✅ `.webp` | ❌ (correct) |
| GummySearch Review | ✅ `GummySearch Review (2026)...` | ✅ 147 chars | ✅ `.webp` | ❌ (correct) |
| Awario Review | ✅ `Awario Review (2026)...` | ✅ 147 chars | ✅ `.webp` | ❌ (correct) |
| Best Reddit Monitoring | ✅ `Best Reddit Monitoring Tools (2026)...` | ✅ 142 chars | ✅ `.webp` | ❌ (correct) |

---

## Check 6 — Structured Data

### Result: ✅ PASS (minor note)

#### Homepage schemas
- `WebSite` with `SearchAction` (potentialAction) ✅
- `Organization` ✅
- `EntryPoint` / `ImageObject` ✅

#### Article pages (Brand24, Awario, GummySearch, Best Reddit Monitoring)
- `Article` ✅ — headline, description, image, author, publisher, datePublished, dateModified, mainEntityOfPage, keywords
- `BreadcrumbList` ✅ — correct 2-level breadcrumb (Reddit → Article title)
- `WebSite` ✅
- `Organization` ✅
- `Person` ✅ (author)

#### Sample Article schema (Brand24)
```json
{
  "@type": "Article",
  "headline": "Brand24 Review (2026): Features, Pricing, and Reddit Tracking",
  "image": "https://zotopie.com/images/reddit/brand24-dashboard.webp",
  "author": { "@type": "Person", "name": "Zotopie Editorial Team" },
  "datePublished": "2026-06-15T00:00:00.000Z",
  "dateModified": "2026-06-15T00:00:00.000Z"
}
```

#### ⚠️ Minor note — dateModified = datePublished
`dateModified` is always identical to `datePublished`. When articles are updated in future, `updatedDate` frontmatter should be set so Google can distinguish fresh updates. Not a blocking issue today.

---

## Check 7 — Internal Discovery

### Result: ✅ PASS — No orphan pages

#### Homepage → Reddit articles
All 4 articles linked from homepage "Latest Articles" section (`.slice(0, 6)` — currently 4 articles, all visible):
- `/reddit/brand24-review/` ✅
- `/reddit/gummysearch-review/` ✅
- `/reddit/awario-review/` ✅
- `/reddit/best-reddit-monitoring-tools/` ✅

#### /reddit/ category page → articles
All 4 articles appear in `/reddit/` category listing ✅

#### Cross-article internal links
| From | Links to | Status |
|---|---|---|
| Brand24 Review | GummySearch, Awario, Best Reddit Monitoring | ✅ |
| GummySearch Review | Brand24, Awario, Best Reddit Monitoring | ✅ |
| Awario Review | Brand24, GummySearch, Best Reddit Monitoring | ✅ |
| Best Reddit Monitoring | Brand24, GummySearch, Awario | ✅ |

**Zero orphan pages.** All reddit articles are reachable via: Homepage → /reddit/ category → Article, and cross-linked between articles.

---

## Issues Summary

| Priority | Issue | Location | Fix |
|---|---|---|---|
| P1 | OG/Twitter image is SVG — won't render on social platforms | Homepage | Replace `og-default.svg` with `og-default.webp` (1200×630px) |
| P2 | 404 page missing `noindex` directive | `dist/404.html` | Add `noindex, nofollow` to 404 layout |
| P2 | `/stats/` page is noindex but included in sitemap | Sitemap config | Exclude `/stats/` from sitemap generation |
| P3 | `dateModified` always equals `datePublished` | Article schema | Use `updatedDate` frontmatter when articles are revised |

---

## What's Working Well

- All 735 sitemap URLs are valid production URLs (no localhost, no draft pages)
- `/go/` affiliate redirects correctly excluded from sitemap and blocked in robots.txt
- All reddit articles have correct self-referencing canonicals
- Article OG images are WebP format with absolute production URLs
- Full schema stack on article pages: Article + BreadcrumbList + WebSite + Organization
- Zero orphan pages — full internal link mesh across all content
- No encoding artifacts in any indexed pages
- Search page correctly noindex'd
- robots.txt properly declares sitemap and blocks affiliate routes
