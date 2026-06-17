# D-029 — Homepage Social Preview Fix Report

**Date:** 2026-06-16  
**Priority:** P1  
**Status:** COMPLETE — Awaiting commit/push approval

---

## Problem

Homepage OG/Twitter image was `og-default.svg`.  
SVG format is not supported by social platforms:
- Facebook / Meta — does not render SVG previews
- Twitter / X — does not render SVG previews
- LinkedIn — does not render SVG previews
- Discord — does not render SVG previews
- Slack — does not render SVG previews

---

## Files Changed

| File | Action |
|---|---|
| `public/images/og-homepage.webp` | **CREATED** — 1200×630px WebP OG image |
| `src/pages/index.astro` | **MODIFIED** — pass `image` prop + update Organization schema |
| `src/layouts/MainLayout.astro` | **MODIFIED** — dynamic `og:image:type` |

---

## Image Details

| Property | Value |
|---|---|
| File | `public/images/og-homepage.webp` |
| Format | WebP |
| Dimensions | 1200 × 630 px |
| File size | 28.3 KB |
| Generator | Node.js + sharp (SVG → WebP) |

**Design:**
- Background: light purple-to-green gradient (`#F5F3FF → #EEF2FF → #ECFDF5`)
- Top accent bar: brand gradient (purple → indigo → pink)
- Logo mark: purple square with "Z"
- Headline: "Find the Best Software Tools"
- Sub-line: "Expert reviews. No fluff. Updated regularly."
- Stat chips: "100+ Reviews", "20 Categories", "100% Independent"
- URL label: `zotopie.com`

---

## Code Changes

### 1. `src/pages/index.astro`

**Added `image` prop to MainLayout:**
```astro
<MainLayout
  title="Zotopie — Find the Best Software Tools"
  description="..."
  image="/images/og-homepage.webp"   ← added
>
```

**Updated Organization schema logo:**
```js
// Before
logo: { "@type": "ImageObject", url: `${SITE}/favicon.svg` }

// After
logo: { "@type": "ImageObject", url: `${SITE}/images/og-homepage.webp`, width: 1200, height: 630 }
```

### 2. `src/layouts/MainLayout.astro`

**Fixed hardcoded `og:image:type`:**
```astro
<!-- Before -->
<meta property="og:image:type" content="image/svg+xml" />

<!-- After -->
<meta property="og:image:type" content={
  ogImage.endsWith('.webp') ? 'image/webp' :
  ogImage.endsWith('.png')  ? 'image/png'  :
  ogImage.endsWith('.jpg') || ogImage.endsWith('.jpeg') ? 'image/jpeg' :
  'image/svg+xml'
} />
```

This fix applies to all pages using MainLayout — correctly identifies image MIME type for any format.

---

## Verification — Built HTML (`dist/index.html`)

| Tag | Value | Status |
|---|---|---|
| `og:image` | `https://zotopie.com/images/og-homepage.webp` | ✅ |
| `og:image:type` | `image/webp` | ✅ |
| `og:image:width` | `1200` | ✅ |
| `og:image:height` | `630` | ✅ |
| `twitter:image` | `https://zotopie.com/images/og-homepage.webp` | ✅ |
| SVG still in OG | `False` | ✅ |
| Organization logo | `https://zotopie.com/images/og-homepage.webp` | ✅ |

---

## Article Pages — Unchanged ✅

Article pages use `ArticleLayout` → `BaseHead` (separate pipeline from MainLayout).  
Verified Brand24 still uses its own image:
```
og:image = https://zotopie.com/images/reddit/brand24-dashboard.webp
```

---

## Build Result

```
857 page(s) built — 0 errors
```

---

## Awaiting Approval

Files to commit when approved:
- `public/images/og-homepage.webp`
- `src/pages/index.astro`
- `src/layouts/MainLayout.astro`
