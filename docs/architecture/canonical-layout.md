# Canonical Design System — TASK D-008
**Date:** 2026-06-15

---

## Answer

The canonical Zotopie design is represented by **`src/layouts/MainLayout.astro`**.

All other layouts must be migrated to match MainLayout's visual language.

---

## Canonical Layout File

`src/layouts/MainLayout.astro`

---

## Canonical Components

### Header
**Component:** `src/components/SiteHeader.astro`

This component was extracted from MainLayout's inline header. It IS the canonical header — already used by `ArticleLayout.astro`. Other layouts must adopt it.

Key design elements:
- Purple gradient logo icon (SVG, `linear-gradient(135deg, #7C3AED, #6366F1)`)
- Wordmark "Zotopie" in `#0F172A`, 1.2rem, 800 weight
- Nav links: Home / Best Tools / Categories / Reviews — 0.875rem, gray (#4B5563)
- Inline search bar (200px → 260px on focus, 22px border-radius)
- Keyboard shortcut `/` to focus search
- Hamburger at 600px, search icon only at 768px
- Sticky, backdrop-filter blur(12px), box-shadow

---

### Footer
**Current situation:** MainLayout has its footer **inline** (not a separate component). `Footer.astro` is a different, older design.

**Canonical footer spec (from MainLayout inline):**
- Light background (`#FAFBFC`)
- Multi-column: Brand column + Explore column + Compare column
- Brand copy: "© {year} Zotopie — Find the best software tools"
- Affiliate disclosure paragraph
- Border-top separator
- Does NOT use `Footer.astro` component

**Recommendation:** Extract MainLayout's inline footer to a new `SiteFooter.astro` component before migrating other layouts.

---

### SEO / Head
**For main pages:** MainLayout handles meta tags inline (OG, canonical, GA4, impact.com verification, structured data slots).

**For article pages:** `src/components/BaseHead.astro` — handles OG, structured data, article-specific meta. Acceptable for content pages.

**Key tags that must appear on ALL pages (currently only in MainLayout):**
```html
<meta name='impact-site-verification' value='5c335fea-1969-4d9a-b64f-1be8b20a77da' />
```
⚠️ This verification tag is missing from `BaseHead.astro` — must be added.

---

### Typography
**Font:** Plus Jakarta Sans (Google Fonts)
```
https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap
```

**CSS variable:** `--font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

**Note:** `global.css` sets `font-family: var(--font-atkinson)` as base — this is the Gen 1 font. ArticleLayout overrides it with Plus Jakarta Sans in the `<body>` rule. CategoryLayout and BlogPost do NOT override, so they still render in Atkinson Hyperlegible.

---

### Color Palette
```css
--c-purple: #7C3AED
--c-blue: #6366F1
--c-dark: #0F172A
--c-border: #E8ECF0
--c-bg: #FAFBFC
```

---

### Design Tokens Summary

| Token | Value | Used In |
| --- | --- | --- |
| Primary color | `#7C3AED` | Logo, CTAs, hover states, focus rings |
| Secondary color | `#6366F1` | Gradients, accents |
| Text dark | `#0F172A` | Headings, nav |
| Text muted | `#647488` | Body text, metadata |
| Border | `#E8ECF0` | Cards, dividers, inputs |
| Background | `#FAFBFC` | Page bg, cards |
| Font | Plus Jakarta Sans | All text |
| Border radius | 8–14px (cards), 22px (pills/search) | — |
| Header height | 64px | Nav |
| Max content width | 1200px (main nav) / 780px (articles) | — |
