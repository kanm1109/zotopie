# D-058 — Sitemap Cleanup Report

**Date:** 2026-06-22
**Status:** Complete

---

## Root Cause

The `@astrojs/sitemap` plugin auto-discovers all statically generated pages and includes them in the sitemap unless explicitly filtered out. The previous filter only excluded:
- URLs with query strings (`?`)
- `/go/` redirect pages
- `/search/` page

The following noindex pages were NOT excluded from the filter, creating conflicting signals (sitemap says "crawl this" / meta robots says "don't index"):

| URL | Noindex Reason |
|-----|---------------|
| `/stats/` | Always noindex — internal analytics page |
| `/blog/` | Conditional noindex when collection is empty (currently empty) |
| `/threads/` | Conditional noindex when collection is empty (currently empty) |
| `/extensions/` | Conditional noindex when collection is empty (currently empty) |
| `/marketing/` | Conditional noindex when collection is empty (currently empty) |

---

## Files Modified

### `astro.config.mjs`

Updated sitemap `filter` function to exclude all noindex legacy sections:

**Before:**
```js
filter: (page) => !page.includes('?') && !page.includes('/go/') && !page.endsWith('/search/') && page !== 'https://zotopie.com/search/',
```

**After:**
```js
filter: (page) =>
  !page.includes('?') &&
  !page.includes('/go/') &&
  !page.endsWith('/search/') &&
  page !== 'https://zotopie.com/search/' &&
  page !== 'https://zotopie.com/stats/' &&
  !page.startsWith('https://zotopie.com/blog/') &&
  !page.startsWith('https://zotopie.com/threads/') &&
  !page.startsWith('https://zotopie.com/extensions/') &&
  !page.startsWith('https://zotopie.com/marketing/'),
```

---

## Before / After Sitemap Counts

| Category | Before | After |
|----------|--------|-------|
| Noindex URLs in sitemap | 5 | **0** |
| Total sitemap URLs | ~949 | ~944 |

---

## Verification Results

- Build: ✅ Pass (944 pages built)
- Sitemap noindex URL count: **0** (verified via regex search of `dist/sitemap-0.xml`)
- Alternatives hub in sitemap: 127 URLs (126 tools + 1 hub page)
