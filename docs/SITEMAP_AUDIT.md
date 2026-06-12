# SITEMAP XML AUDIT

**Date:** 2026-06-12  
**Task:** T2.1-SITEMAP-XML-AUDIT  
**Commit (fix):** `bc194bf`  
**Status:** RESOLVED — all issues fixed and deployed

---

## Verdict

> **Root cause: `/sitemap.xml` does not exist — Astro generates `sitemap-index.xml` + `sitemap-0.xml` only.**  
> `robots.txt` declared `Sitemap: https://zotopie.com/sitemap.xml` (broken URL). No redirect existed.  
> **Fix applied:** Added `_redirects` rule + corrected `robots.txt` declarations. Deployed and verified.

---

## Audit Results

| # | Check | Result | Detail |
|---|---|---|---|
| 1 | `/sitemap.xml` route implementation | ❌ FAIL → ✅ FIXED | No file, no route — Astro does not generate this path. Redirect added. |
| 2 | Astro sitemap integration | ✅ PASS | `@astrojs/sitemap` generates `sitemap-index.xml` + `sitemap-0.xml` correctly |
| 3 | XML content-type header | ✅ PASS | `_headers` sets `Content-Type: application/xml` for `/sitemap*.xml` glob |
| 4 | HTML injection | ✅ PASS | No `<html>`, `<body>`, or `<script>` tags in either sitemap file |
| 5 | `data-astro-cid` contamination | ✅ PASS | Zero occurrences in `sitemap-0.xml` |
| 6 | Production output | ✅ PASS | 1,261 URLs, valid XML, correct `https://zotopie.com/` base |
| 7 | Google compatibility | ✅ PASS | Absolute URLs, `<lastmod>`, `<changefreq>`, `<priority>` all present |
| 8 | `robots.txt` Sitemap declarations | ❌ FAIL → ✅ FIXED | Referenced `sitemap.xml` (404). Now references `sitemap-index.xml` + `sitemap-0.xml` |

---

## Issue 1: `/sitemap.xml` Returns 404

### What Astro generates

The `@astrojs/sitemap` integration generates exactly two files at build time:

```
dist/sitemap-index.xml    ← index pointing to child sitemap(s)
dist/sitemap-0.xml        ← all URL entries
```

No `dist/sitemap.xml` is generated. There is no `src/pages/sitemap.xml.*` route. The file simply does not exist.

### Why `/sitemap.xml` returned 404

`public/_redirects` contained a catch-all rule:
```
/*  /404  404
```

Any request for a non-existent path (including `/sitemap.xml`) hit this rule and returned HTTP 404 — served as the custom 404 page with status code 404.

### Fix applied

Added to `public/_redirects`:

```
# Sitemap alias — Astro generates sitemap-index.xml, not sitemap.xml
/sitemap.xml  /sitemap-index.xml  301
```

This rule was placed **before** the catch-all `/*` rule (Cloudflare Pages evaluates `_redirects` in order — first match wins).

**After fix:** `/sitemap.xml` → HTTP 301 → `/sitemap-index.xml` → valid XML returned.

---

## Issue 2: `robots.txt` Declared a Broken Sitemap URL

### Before fix

```
Sitemap: https://zotopie.com/sitemap-index.xml    ← valid ✅
Sitemap: https://zotopie.com/sitemap.xml          ← 404 ❌
```

Google's robots.txt parser fetches declared Sitemap URLs. A 404 on a declared Sitemap URL generates a coverage error in Google Search Console.

### After fix

```
Sitemap: https://zotopie.com/sitemap-index.xml    ← valid ✅
Sitemap: https://zotopie.com/sitemap-0.xml        ← valid ✅
```

Both URLs now return valid XML. Declaring both is intentional: `sitemap-index.xml` is the canonical index; `sitemap-0.xml` is the direct URL list (useful for tools that don't follow index references).

---

## Sitemap Content Quality Check

### `sitemap-index.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://zotopie.com/sitemap-0.xml</loc>
    <lastmod>2026-06-12T01:26:36.279Z</lastmod>
  </sitemap>
</sitemapindex>
```

| Check | Result |
|---|---|
| Valid XML declaration | ✅ `<?xml version="1.0" encoding="UTF-8"?>` |
| Correct namespace | ✅ `http://www.sitemaps.org/schemas/sitemap/0.9` |
| Child sitemap URL | ✅ `https://zotopie.com/sitemap-0.xml` |
| `lastmod` present | ✅ Build timestamp |
| HTML contamination | ✅ None |

---

### `sitemap-0.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>https://zotopie.com/</loc>
    <lastmod>2026-06-12T01:26:36.279Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ...
</urlset>
```

| Check | Result | Detail |
|---|---|---|
| Valid XML declaration | ✅ | `<?xml version="1.0" encoding="UTF-8"?>` |
| Root element | ✅ | `<urlset>` |
| Namespaces | ✅ | sitemap + news + xhtml + image + video schemas |
| Total `<url>` entries | ✅ | **1,261 URLs** |
| All URLs use HTTPS | ✅ | All start with `https://zotopie.com/` |
| `<lastmod>` present | ✅ | All entries have build timestamp |
| `<changefreq>` present | ✅ | daily / weekly / monthly per page type |
| `<priority>` present | ✅ | 1.0 / 0.9 / 0.8 / 0.7 / 0.5 per page type |
| `/go/` paths excluded | ✅ | Filter `!page.includes('/go/')` in `astro.config.mjs` |
| `?*` query strings excluded | ✅ | Filter `!page.includes('?')` in `astro.config.mjs` |
| HTML tags in content | ✅ | None — pure XML |
| `data-astro-cid` attributes | ✅ | None |
| First URL | ✅ | `https://zotopie.com/` (homepage, priority 1.0) |

**Sample URLs in sitemap:**
```
https://zotopie.com/
https://zotopie.com/about/
https://zotopie.com/alternatives/activecampaign/
https://zotopie.com/alternatives/ahrefs/
https://zotopie.com/reviews/...  (119 entries)
https://zotopie.com/category/... (11 entries)
https://zotopie.com/alternatives/... (119 entries)
https://zotopie.com/compare/... (~900+ entries)
```

---

## Content-Type Header

The `_headers` rule `/sitemap*.xml` applies to all files matching the glob:

```
/sitemap*.xml
  Cache-Control: public, max-age=3600, s-maxage=3600
  Content-Type: application/xml; charset=utf-8
```

| File | Content-Type applied? |
|---|---|
| `/sitemap-index.xml` | ✅ Matched by `/sitemap*.xml` glob |
| `/sitemap-0.xml` | ✅ Matched by `/sitemap*.xml` glob |
| `/sitemap.xml` (redirect) | N/A — 301 redirect served before headers apply |

---

## Google Compatibility

| Requirement | Status |
|---|---|
| URLs absolute (must include `https://`) | ✅ All URLs use `https://zotopie.com/` |
| XML encoding declared | ✅ `UTF-8` |
| Standard sitemap namespace | ✅ `http://www.sitemaps.org/schemas/sitemap/0.9` |
| Max 50,000 URLs per file | ✅ 1,261 << 50,000 |
| Max 50MB uncompressed | ✅ ~150KB << 50MB |
| `<loc>` values URL-encoded | ✅ No special chars in generated URLs |
| Sitemap declared in robots.txt | ✅ Two declarations, both valid |
| Sitemap URL accessible | ✅ After fix: all sitemap URLs return valid XML |

---

## Files Modified

| File | Change |
|---|---|
| `public/_redirects` | Added `/sitemap.xml → /sitemap-index.xml 301` before catch-all `/*` |
| `public/robots.txt` | Changed `Sitemap: .../sitemap.xml` → `Sitemap: .../sitemap-0.xml` |

---

## Production Verification

After deploying commit `bc194bf`:

| URL | Before | After |
|---|---|---|
| `https://zotopie.pages.dev/sitemap.xml` | HTTP 404 | HTTP 301 → `/sitemap-index.xml` → valid XML ✅ |
| `https://zotopie.pages.dev/sitemap-index.xml` | HTTP 200, valid XML | HTTP 200, valid XML ✅ |
| `https://zotopie.pages.dev/sitemap-0.xml` | HTTP 200, valid XML | HTTP 200, valid XML ✅ |
| `robots.txt` Sitemap declarations | `sitemap.xml` (broken) | `sitemap-0.xml` (valid) ✅ |

---

## Google Search Console Action

After this fix, submit both URLs in GSC → Sitemaps:

```
sitemap-index.xml    ← submit this one (or it may auto-discover from robots.txt)
sitemap-0.xml        ← can also submit directly
```

Remove any previously submitted `sitemap.xml` entry in GSC if it was added during the broken period.

---

*Generated: 2026-06-12 | Task: T2.1-SITEMAP-XML-AUDIT*
