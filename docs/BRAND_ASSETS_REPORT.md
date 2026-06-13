# BRAND-V1 — Brand Assets Report

**Date:** 2026-06-13  
**Role:** Senior Brand Designer

---

## Assets Created / Updated

### 1. Favicon — `public/favicon.svg`

**Before:** Used the Astro framework default logo (A-shaped path, unrelated to Zotopie)

**After:** Zotopie Z mark

```svg
<rect width="64" height="64" rx="14" fill="url(#gradient-purple)"/>
<path d="M14 15 H50 L14 49 H50" 
      stroke="#fff" stroke-width="7" 
      stroke-linecap="round" stroke-linejoin="round" fill="none"/>
```

- Gradient: `#7C3AED → #6366F1` (brand purple → indigo)
- Corner radius: 14/64 = ~22% — matches iOS icon style
- Stroke Z: thick white letterform, round caps
- Effective at 16×16, 32×32, and larger display contexts (pinned tabs, etc.)

---

### 2. Open Graph Image — `public/og-default.svg`

**Before:** Blue gradient (#1e40af → #1e3a8a) background, Arial Black text

**After:** Dark brand background with purple glow

**Specifications:**
- Canvas: 1200×630 (Twitter large card, Facebook, LinkedIn)
- Background: `#0F172A → #1E1040` (brand dark)
- Visual depth: 3 radial blur globs (purple, indigo, pink at 6-10% opacity)
- Grid: 55 white dots at 6% opacity — subtle texture
- Logo block: Z icon (64×64 rounded) + "Zotopie" wordmark
- Category pill: "SOFTWARE DISCOVERY" in lavender on translucent background
- Headline: "Find the Best / Software Tools" (white + gradient)
- Subline: "119+ expert reviews · honest comparisons · no fluff" at 50% white
- Stats pills: 4 pills (Reviews / Comparisons / Categories / Expert Reviewed) in translucent purple
- Domain watermark: `zotopie.com` at 25% white, bottom-right

**Social preview behavior:**
Referenced as `/og-default.svg` in MainLayout `<head>`:
```html
<meta property="og:image" content="{SITE}/og-default.svg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/svg+xml" />
```

Note: Twitter/X natively renders SVG in OG cards. Facebook and LinkedIn may render as rasterized. For maximum compatibility, consider adding a PNG fallback generated from this SVG at launch.

---

### 3. Z Icon (Inline SVG)

Used in MainLayout nav and footer (not a file — inline SVG):

```svg
<path d="M4 4 H14 L4 14 H14" 
      stroke="#fff" stroke-width="2.8" 
      stroke-linecap="round" stroke-linejoin="round"/>
```

On `18×18 viewBox` inside a 28-32px rounded square with purple gradient background.

---

## Asset Locations

| Asset | Path | Usage |
|---|---|---|
| Favicon | `public/favicon.svg` | Browser tab, bookmarks, PWA |
| OG default | `public/og-default.svg` | Social sharing (all 860 pages) |
| OG custom pages | (per-page title/desc only) | Title/desc override in individual templates |
| Z icon inline | `src/layouts/MainLayout.astro` | Nav + footer |

---

## Recommended Next Assets

| Asset | Priority | Notes |
|---|---|---|
| `og-default.png` | High | PNG fallback for Facebook/LinkedIn |
| `apple-touch-icon.png` | Medium | 180×180 PNG for iOS home screen |
| `og-review-[slug].svg` | Low | Per-review OG with tool name/logo |
| `og-category-[slug].svg` | Low | Per-category OG with category name |
| Social banner (Twitter header) | Low | 1500×500 for @Zotopie account |
