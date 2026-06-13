# BRAND-V1 — Logo System

**Date:** 2026-06-13  
**Role:** Senior Brand Designer  
**Status:** Production-ready

---

## 1. Zotopie Logo Design

### Concept

The Zotopie logo is built around a clean geometric **Z letterform** — representing the brand name while evoking comparison/direction (two horizontal bars connected by a diagonal). This diagonal element naturally suggests "choice between two paths," aligning with the software comparison positioning.

### Color System

| Token | Hex | Usage |
|---|---|---|
| Purple (Primary) | `#7C3AED` | Primary CTA, logo, highlights |
| Indigo (Secondary) | `#6366F1` | Gradients, hover states |
| Pink (Accent) | `#EC4899` | Accent highlights |
| Green (Success) | `#10B981` | Trust signals, "free" badges |
| Dark | `#0F172A` | Body text, dark backgrounds |
| Gray | `#647488` | Secondary text, labels |
| Border | `#E8ECF0` | Card borders, dividers |

---

## 2. Logo Variants

### Primary Logo (Horizontal)
`nav` — shown in site header

```
[Z icon in gradient rounded square] + "Zotopie" wordmark
```

The Z icon uses a 32×32 rounded square (`border-radius: 8px`) with `linear-gradient(135deg, #7C3AED, #6366F1)`. Inside: stroke-based Z (`stroke: #fff; stroke-width: 2.8`).

### Icon-Only
`public/favicon.svg` — 64×64 viewBox, scales to any size

```svg
<rect width="64" height="64" rx="14" fill="url(#gradient-purple)"/>
<path d="M14 15 H50 L14 49 H50" stroke="#fff" stroke-width="7" 
      stroke-linecap="round" stroke-linejoin="round" fill="none"/>
```

### Light Version (on dark backgrounds)
- Icon background: gradient `#7C3AED` → `#6366F1` (same)
- Wordmark: `#FFFFFF`
- Used in: OG image, dark-background contexts

### Dark Version (on white/light backgrounds)
- Icon background: gradient (same)
- Wordmark: `#0F172A`
- Used in: nav header, footer

### Favicon (16×16 effective)
Path: `public/favicon.svg` with `viewBox="0 0 64 64"`

The path `M14 15 H50 L14 49 H50` creates a clean Z:
- Top bar: horizontal line at y=15
- Diagonal: from top-right (50,15) to bottom-left (14,49)
- Bottom bar: horizontal line at y=49

At 16×16px, the Z remains legible due to:
- Thick `stroke-width: 7` (scales to ~1.75px at 16px)
- `stroke-linecap: round` for softness
- High contrast (white on purple)

### Social Share / OG Image
Path: `public/og-default.svg` (1200×630)

- Dark background: `#0F172A` → `#1E1040` diagonal gradient
- Purple glow blobs for depth
- Logo (icon + wordmark) at top-left
- Large headline: "Find the Best / Software Tools"
- Stats pills at bottom

---

## 3. Typography

| Weight | Usage |
|---|---|
| 800 (ExtraBold) | H1, logo wordmark, headline numbers |
| 700 (Bold) | H2, H3, card titles, CTA buttons |
| 600 (SemiBold) | Nav links, labels, badges |
| 500 (Medium) | Body emphasis, secondary text |
| 400 (Regular) | Body text, descriptions |

Font: **Plus Jakarta Sans** — loaded via Google Fonts CDN, covers all weights 400–800.

Fallback stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

---

## 4. Logo Usage Rules

**DO:**
- Use the gradient Z icon on all branded surfaces
- Maintain minimum clear space: half the icon height on each side
- Use white wordmark on dark/colored backgrounds
- Use dark (#0F172A) wordmark on white/light backgrounds

**DON'T:**
- Change the Z stroke to filled
- Use colors other than the gradient on the icon
- Stretch or rotate the logo
- Use the wordmark without the icon in headers

---

## 5. Implementation Locations

| Location | Asset | Notes |
|---|---|---|
| Browser tab | `public/favicon.svg` | Replaces old Astro logo |
| Site header nav | `MainLayout.astro` - `.nav-logo` | SVG inline in component |
| Site footer | `MainLayout.astro` - `.footer-brand` | SVG inline in component |
| Social sharing | `public/og-default.svg` | 1200×630, all pages |
| Open Graph | Referenced in MainLayout `<head>` | `/og-default.svg` |
