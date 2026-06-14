# LOGO USAGE GUIDE — Zotopie Brand System

**Version:** 2.0  
**Date:** 2026-06-14

---

## Logo Files

```
public/
├── favicon.svg              # Browser tab icon (512×512 viewBox, no nodes)
├── apple-touch-icon.svg     # iOS home screen icon (512×512, square, with nodes)
└── brand/
    ├── logo-primary.svg     # Default logo — use on white/light backgrounds
    ├── logo-dark.svg        # Dark mode logo — use on dark/navy backgrounds  
    ├── logo-light.svg       # Reversed logo — use on gradient/image backgrounds
    ├── logo-compact.svg     # No-tagline compact — use in navbars, small spaces
    ├── icon-square.svg      # Squircle app icon (512×512, rounded rect bg)
    └── icon-circle.svg      # Circle avatar icon (512×512, circle bg)
```

---

## Choosing the Right Variant

| Background | Recommended Variant |
|---|---|
| White (#FFFFFF) | `logo-primary.svg` |
| Light gray (#F8FAFC, #F1F5F9) | `logo-primary.svg` |
| Dark (#0F172A, #1E293B) | `logo-dark.svg` |
| Purple gradient | `logo-light.svg` |
| Hero image or photo | `logo-light.svg` |
| Navbar (compact space) | `logo-compact.svg` |
| Social profile avatar | `icon-circle.svg` |
| App store / app icon | `icon-square.svg` |
| iOS home screen | `apple-touch-icon.svg` (auto-served via `<link rel="apple-touch-icon">`) |
| Browser tab | `favicon.svg` (auto-served via `<link rel="icon">`) |

---

## Clear Space

Always maintain a minimum clear space around the logo equal to the height of the **Z mark**.

- In `logo-primary.svg`: Z mark height ≈ 60px within the 120px viewBox → clear space ≈ 10px minimum
- In practice: never place the logo within 10% of its own height from any other element or edge

---

## Minimum Sizes

| Variant | Minimum width | Minimum width (px) |
|---|---|---|
| logo-primary / logo-dark / logo-light | Full viewBox renders at... | 180px |
| logo-compact | Full viewBox renders at... | 120px |
| icon-square / icon-circle | | 24px |
| favicon.svg | Browser controls size | 16px (browser tab) |

Below these minimums, use the icon variants instead of the wordmark.

---

## Do Not

- Do not change the gradient direction or colors
- Do not recolor the wordmark to anything other than the specified values per variant  
- Do not place `logo-primary` on a dark background (low contrast)
- Do not place `logo-dark` on a white background (low contrast Z gradient on dark text)
- Do not stretch or skew the logo
- Do not add drop shadows directly to the SVG files
- Do not add a border or outline around icons
- Do not reproduce the logo without the network nodes (they are part of the brand identity)
- Do not use a white Z on a white background (use `logo-primary` instead)

---

## Network Node System

The three white circles on the Z mark are **not decorative** — they represent the network/connection concept in the Zotopie brand name:

| Node position | Meaning |
|---|---|
| Top-right (largest) | Starting point — discovery |
| Center-diagonal (smallest) | The connection — search |
| Bottom-left (largest) | End point — the right tool |

These nodes must always be **white** when on gradient backgrounds, and **gradient-matched colors** when on white backgrounds (logo-primary variant).

---

## Color Palette

| Role | Value |
|---|---|
| Gradient start | `#7C3AED` (Primary Purple) |
| Gradient mid | `#6366F1` (Indigo) |
| Gradient end | `#0EA5E9` (Sky Blue) |
| Dark text | `#0F172A` (Dark Slate) |
| Secondary text | `#6B7280` (Gray 500) |
| Hover / interactive | `#8B5CF6` (Vibrant Violet) |

---

## Website Integration Reference

The logo is currently used in `src/layouts/MainLayout.astro` as an inline SVG:

**Nav (32×32px icon + text):**
```html
<div class="nav-logo-icon">
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M4 4 H14 L4 14 H14" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="14" cy="4" r="1.8" fill="#fff" opacity="0.9"/>
    <circle cx="9" cy="9" r="1.2" fill="#fff" opacity="0.6"/>
    <circle cx="4" cy="14" r="1.8" fill="#fff" opacity="0.9"/>
  </svg>
</div>
<span class="nav-logo-text">Zotopie</span>
```

**Favicon and apple-touch-icon** are linked in `<head>`:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
```

---

*Zotopie Brand System v2.0 — 2026-06-14*
