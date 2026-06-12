# PRE-DEPLOY VALIDATION CHECKLIST

**Date:** 2026-06-12  
**Role:** Release Manager  
**Task:** D1-PRE-DEPLOY-VALIDATION  
**Source:** docs/LAUNCH_READINESS_REPORT.md + live validation

---

## Deployment Verdict

> ## ✅ READY TO DEPLOY
>
> **No FAIL items found.** All critical systems validated.  
> 2 WARNING items are non-blocking (see details below).

---

## Checklist Summary

| # | Area | Status | Detail |
|---|---|---|---|
| 1 | Build configuration | ✅ PASS | prebuild + build scripts correct |
| 2 | Astro compatibility | ✅ PASS | v6.4.4, static SSG, no adapter needed |
| 3 | Cloudflare Pages compatibility | ✅ PASS | Static output, _headers, _redirects valid |
| 4 | Node.js version requirements | ⚠ WARNING | CF default v18 works; upgrade to v20 recommended |
| 5 | Generated files exist | ✅ PASS | tools-enriched.json + icon-data.json committed |
| 6 | Required environment variables | ✅ PASS | No custom env vars required |
| 7 | Sitemap generation | ✅ PASS | Configured, filters correct |
| 8 | Robots.txt | ✅ PASS | Allow/Disallow/Sitemap correct |
| 9 | Structured data | ✅ PASS | All JSON-LD schemas present (minor ratingCount note) |
| 10 | Internal link integrity | ✅ PASS | All 10 page templates exist |
| 11 | Asset existence | ✅ PASS | Fonts, headers, redirects, OG image present |
| 12 | Favicon existence | ✅ PASS | favicon.ico + favicon.svg present |
| 13 | Open Graph image | ⚠ WARNING | SVG only; PNG recommended for Facebook/WhatsApp |

---

## Detailed Results

### 1. Build Configuration — ✅ PASS

```json
"prebuild": "node scripts/merge-data.mjs || echo '[prebuild] merge-data failed — using committed generated files'",
"build": "astro build",
"engines": { "node": ">=18.0.0" }
```

- `||` fallback ensures Cloudflare build does not fail if merge script errors
- `src/data/generated/` is committed to git → fallback is guaranteed to work
- `astro build` is the correct command for static SSG output

---

### 2. Astro Compatibility — ✅ PASS

| Check | Result |
|---|---|
| Version installed | astro 6.4.4 |
| Output mode | `static` (SSG default — no `output:` config means static) |
| Cloudflare adapter | Not required for static output |
| Sharp installed | 0.34.3 (image optimization) |

---

### 3. Cloudflare Pages Compatibility — ✅ PASS

| Check | Result |
|---|---|
| `public/_headers` | Present (1KB) — security headers + cache policies |
| `public/_redirects` | Present (0.4KB) — www→apex, HTTP→HTTPS |
| Output type | Static — no server runtime required |
| No external CDN dependencies | Confirmed — fonts local, icons via npm |
| No Clearbit / external logo URLs | Confirmed — offline-safe |

---

### 4. Node.js Version Requirements — ⚠ WARNING (non-blocking)

| Check | Result |
|---|---|
| `engines` requirement | `>=18.0.0` |
| Cloudflare Pages default | Node.js v18 (satisfies `>=18.0.0`) |
| Local dev version | v24.11.1 (via nvm) |
| Risk | None — v18 satisfies the engine constraint |

**Recommended action (not blocking):**  
Set `NODE_VERSION = 20` in Cloudflare Pages → Settings → Environment Variables.  
This pins CF to a supported LTS version and avoids any future v18 EOL issues.

---

### 5. Generated Files — ✅ PASS

| File | Size | In .gitignore? |
|---|---|---|
| `src/data/generated/tools-enriched.json` | 308KB | No — committed ✓ |
| `src/data/generated/icon-data.json` | 21KB | No — committed ✓ |

**Note on false positive:** `.gitignore` contains comment `# generated types` which references `.astro/` TypeScript types — NOT `src/data/generated/`. The generated data files are fully committed and will be present on Cloudflare without any `prebuild` running.

---

### 6. Required Environment Variables — ✅ PASS

Scanned all `*.astro`, `*.mjs`, `*.ts`, `*.js` files in `src/`.

| Variable | Source | Required? |
|---|---|---|
| `import.meta.env.BASE_URL` | `src/components/HeaderLink.astro` | Built-in Astro — defaults to `/` |

**No custom environment variables required.** No `.env` file needed. No secrets.

---

### 7. Sitemap Generation — ✅ PASS

| Check | Result |
|---|---|
| `@astrojs/sitemap` installed | PASS |
| `site:` configured | `https://zotopie.com` |
| Filter — excludes `?*` | PASS (`!page.includes('?')`) |
| Filter — excludes `/go/` | PASS (`!page.includes('/go/')`) |
| `<link rel="sitemap">` in `<head>` | PASS (MainLayout.astro) |
| `robots.txt` Sitemap references | PASS (both sitemap-index.xml and sitemap.xml) |
| Expected build output | `/sitemap-index.xml` + `/sitemap-0.xml` |

---

### 8. Robots.txt — ✅ PASS

```
User-agent: *
Allow: /

Disallow: /go/
Disallow: /search?*

Sitemap: https://zotopie.com/sitemap-index.xml
Sitemap: https://zotopie.com/sitemap.xml
```

Affiliate redirect paths excluded, query-string search excluded, both sitemap URLs declared.

---

### 9. Structured Data — ✅ PASS

**Review pages (`src/pages/reviews/[slug].astro`):**

| Schema | Status |
|---|---|
| WebPage | ✅ Present |
| BreadcrumbList | ✅ Present (4-level: Home → Reviews → Category → Tool) |
| SoftwareApplication | ✅ Present (with `offers`, `applicationCategory`) |
| Review | ✅ Present (author = Organization) |
| AggregateRating | ✅ Present |

**Category pages (`src/pages/category/[slug].astro`):**

| Schema | Status |
|---|---|
| CollectionPage | ✅ Present |
| BreadcrumbList | ✅ Present |
| ItemList | ✅ Present (all tools per category) |
| FAQPage | ✅ Present (from category-content.json) |

**Known minor issue:** `ratingCount` is hardcoded to `"1"` on all 119 review pages.  
Google Search Console may generate a warning. Not blocking launch — monitor in GSC after indexing.

---

### 10. Internal Link Integrity — ✅ PASS

All dynamic route templates and static pages verified to exist:

| Template | Status |
|---|---|
| `src/pages/reviews/[slug].astro` | ✅ Exists → 119 pages |
| `src/pages/category/[slug].astro` | ✅ Exists → 11 pages |
| `src/pages/alternatives/[slug].astro` | ✅ Exists → 119 pages |
| `src/pages/compare/[pair].astro` | ✅ Exists |
| `src/pages/go/[slug].astro` | ✅ Exists → 119 redirect pages |
| `src/pages/search.astro` | ✅ Exists |
| `src/pages/tools.astro` | ✅ Exists |
| `src/pages/stats.astro` | ✅ Exists |
| `src/pages/404.astro` | ✅ Exists |
| `src/pages/index.astro` | ✅ Exists |

Alternative slug references validated: 0 broken (all 119 tools have valid `alternatives[]` slugs pointing to other tools in `tools.json`).

---

### 11. Asset Existence — ✅ PASS

| Asset | Size | Status |
|---|---|---|
| `src/assets/fonts/atkinson-regular.woff` | 22.3KB | ✅ Present — local font |
| `src/assets/fonts/atkinson-bold.woff` | 23.2KB | ✅ Present — local font |
| `public/og-default.svg` | 3.9KB | ✅ Present |
| `public/robots.txt` | 0.1KB | ✅ Present |
| `public/_headers` | 1KB | ✅ Present |
| `public/_redirects` | 0.4KB | ✅ Present |

All fonts are local — no external CDN calls. Offline-safe constraint satisfied.

---

### 12. Favicon — ✅ PASS

| File | Size | Status |
|---|---|---|
| `public/favicon.ico` | 0.6KB | ✅ Present — browser default fallback |
| `public/favicon.svg` | 0.7KB | ✅ Present — modern browsers prefer SVG |

Additional files in `public/`:
- `google701d569ec51e922b.html` — Google Search Console ownership verification

Optional improvements (not blocking): `apple-touch-icon.png`, `site.webmanifest` for PWA support.

---

### 13. Open Graph Image — ⚠ WARNING (non-blocking)

| Check | Result |
|---|---|
| `public/og-default.svg` | ✅ Present (3.9KB) |
| `public/og-default.png` | ⚠ Missing |

SVG is set as the default OG image in `MainLayout.astro`. Twitter/X renders SVG correctly.  
Facebook and WhatsApp may not render SVG og:image — they require PNG or JPEG.

**Recommended action (not blocking):**  
Export `public/og-default.svg` to `public/og-default.png` (1200×630px) and update `MainLayout.astro` to reference the PNG. Do before social media promotion.

---

## Pre-Deploy Action List

| Priority | Action | Status |
|---|---|---|
| **DONE** | Fix overview `\n\n` paragraph rendering in `reviews/[slug].astro` | ✅ Fixed in P6.5 |
| **DONE** | Verify pros/cons pipeline — remove pros-cons.json boilerplate override | ✅ Fixed in P3 |
| **DONE** | Complete P1 category content (seo, social, workflow) | ✅ Done in P6 |
| **Recommended** | Set `NODE_VERSION = 20` in Cloudflare Pages env vars | Do before first deploy |
| **Recommended** | Export og-default.svg → og-default.png for social sharing | Before social promotion |
| **Monitoring** | Track `ratingCount` in Google Search Console | After indexing |
| **Ongoing** | Continue P2 content generation (content-ai, marketing, productivity) | Post-launch |

---

## Cloudflare Pages Deploy Settings

```
Framework preset:  Astro
Build command:     npm run build
Output directory:  dist
Root directory:    /  (or your repo subdirectory)
Node.js version:   20 (set in Environment Variables: NODE_VERSION = 20)
```

No build-time secrets required. No environment variables except `NODE_VERSION`.

---

*Generated: 2026-06-12 | Task: D1-PRE-DEPLOY-VALIDATION*
