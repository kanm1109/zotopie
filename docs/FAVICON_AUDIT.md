# FAVICON AUDIT — Zotopie

**Task:** FAVICON-PRODUCTION-VERIFICATION  
**Date:** 2026-06-14  
**Triggered by:** Chrome tab reportedly still showing old favicon after Brand V2 deployment

---

## Audit Findings

### 1. File Inventory (`public/`)

| File | Size | Date | Status |
|---|---|---|---|
| `favicon.svg` | 711 bytes | 2026-06-14 | ✅ Brand V2 — 512×512 gradient Z |
| `favicon.ico` | 655 bytes | **2026-06-04** | ⚠️ PRE-Brand-V2 — PNG bytes in .ico wrapper |
| `apple-touch-icon.svg` | 1,453 bytes | 2026-06-14 | ✅ Brand V2 — Z + white network nodes |
| `brand/logo-primary.svg` | 1,393 bytes | 2026-06-14 | ✅ Brand V2 |
| `brand/logo-dark.svg` | 1,527 bytes | 2026-06-14 | ✅ Brand V2 |
| `brand/logo-light.svg` | 1,315 bytes | 2026-06-14 | ✅ Brand V2 |
| `brand/logo-compact.svg` | 1,103 bytes | 2026-06-14 | ✅ Brand V2 |
| `brand/icon-square.svg` | 1,469 bytes | 2026-06-14 | ✅ Brand V2 |
| `brand/icon-circle.svg` | 1,413 bytes | 2026-06-14 | ✅ Brand V2 |

---

### 2. Root Cause: `favicon.ico` — Stale Pre-Brand-V2 Asset

**Binary inspection of `favicon.ico`:**
```
Size: 655 bytes
First 4 bytes: 89 50 4E 47  ← PNG magic header (\x89PNG)
```

The file is **a PNG file with `.ico` extension**. This is technically valid (ICO format since Windows Vista can embed PNG data), but:

- **Dated 2026-06-04** — created before Brand V2 refinement (2026-06-14)
- **Not updated** when favicon.svg was overwritten with Brand V2
- **No cache-control header** in `_headers` for `/favicon.ico` — Cloudflare CDN used default TTL

**Why Chrome shows the old favicon:**
1. HTML had `<link rel="icon" href="/favicon.ico">` as the second link tag — browsers fall back to it when preferred type is unclear
2. Chrome stores favicons in a separate internal database (`chrome://favicon/`), independent of the HTTP cache
3. Cloudflare CDN was serving the June 4 `.ico` file with no explicit TTL (using edge default)
4. Normal "Clear cache" in Chrome does **not** clear the favicon database

---

### 3. Missing: `BaseHead.astro` Brand V2 Updates

`BaseHead.astro` is used by 4 page types:
- `ArticleLayout.astro` — blog articles
- `BlogPost.astro` — blog posts  
- `CategoryLayout.astro` — category layout pages
- `src/pages/tags/[tag].astro` — tag archive pages

**Before fix, `BaseHead.astro` was missing:**

| Feature | MainLayout.astro | BaseHead.astro (before) |
|---|---|---|
| `viewport-fit=cover` | ✅ | ✗ Missing |
| `favicon.svg` SVG link | ✅ | ✅ Had it |
| `favicon.ico` legacy link | ✅ (listed) | ✅ (listed) |
| `apple-touch-icon` | ✅ Added 2026-06-14 | ✗ Missing |

---

### 4. Missing: Cache-Control for Favicon Files

`public/_headers` before fix — no explicit rule for favicon files:
```
/*  →  only security headers, no Cache-Control
/*.html  →  max-age=600
/_astro/*  →  max-age=31536000, immutable
```

Favicon files (`/favicon.svg`, `/favicon.ico`, `/apple-touch-icon.svg`) fell through to Cloudflare's default edge TTL, which can cache static assets for **hours to days**.

---

### 5. Logo Implementation in HTML

**Nav icon (MainLayout.astro):**
```html
<!-- 32×32px squircle container with gradient bg -->
<div class="nav-logo-icon">
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M4 4 H14 L4 14 H14" stroke="#fff" stroke-width="2.8"
      stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Brand V2: network nodes at Z pivot points -->
    <circle cx="14" cy="4" r="1.8" fill="#fff" opacity="0.9"/>
    <circle cx="9" cy="9" r="1.2" fill="#fff" opacity="0.6"/>
    <circle cx="4" cy="14" r="1.8" fill="#fff" opacity="0.9"/>
  </svg>
</div>
<span class="nav-logo-text">Zotopie</span>
```
**Status: ✅ Brand V2** — network nodes added 2026-06-14

**Footer icon (MainLayout.astro):** Same inline SVG. ✅ Brand V2

**OG image (`/og-default.svg`):** 1200×630, created prior to Brand V2 but already correct. ✅

---

### 6. Manifest / PWA Icons

No `manifest.webmanifest` file found in the project. No PWA icon set required.

---

## Issues Summary

| # | Issue | Severity | Status |
|---|---|---|---|
| ICON-01 | `favicon.ico` is pre-Brand-V2 (dated 6/4), still served by Cloudflare CDN | **P0** | ✅ Fixed |
| ICON-02 | `<link rel="icon" href="/favicon.ico">` in MainLayout directed Chrome to stale file | **P0** | ✅ Fixed |
| ICON-03 | `BaseHead.astro` missing `apple-touch-icon` on blog/tag pages | P1 | ✅ Fixed |
| ICON-04 | `BaseHead.astro` missing `viewport-fit=cover` | P1 | ✅ Fixed |
| ICON-05 | `BaseHead.astro` had stale `favicon.ico` link | P1 | ✅ Fixed |
| ICON-06 | No `Cache-Control` header for favicon files in `_headers` | P1 | ✅ Fixed |
| ICON-07 | Chrome favicon database caches independently of HTTP — may need manual clear | P2 | Documented |

---

*FAVICON-PRODUCTION-VERIFICATION Audit — 2026-06-14 — commit 29df607*
