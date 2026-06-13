# BRAND-V1 — Brand Consistency Report

**Date:** 2026-06-13  
**Role:** Senior Brand Designer  
**Scope:** All 860 pages across 8 page templates

---

## Executive Summary

After BRAND-V1, Zotopie has a coherent, consistent design language across all templates. The system uses a small, well-defined set of tokens — one primary color, two supporting colors, one font family, and one border system — applied uniformly across all 860 pages.

**Overall consistency score: 9/10** (up from 5/10 pre-V1)

---

## 1. Color System Audit

### Primary Color Usage

| Component | Before | After | Status |
|---|---|---|---|
| CTA buttons | `#2563eb` blue | `#7C3AED` purple gradient | ✅ Consistent |
| Nav hover | `#2563eb` | `#7C3AED` | ✅ Consistent |
| Link color | `#2563eb` | `#7C3AED` | ✅ Consistent |
| Badge backgrounds | `#eff6ff` blue-light | `#F5F3FF` purple-light | ✅ Consistent |
| Badge borders | `#bfdbfe` blue | `#DDD6FE` purple | ✅ Consistent |
| Search focus ring | Blue | Purple | ✅ Consistent |
| Card hover border | `#93c5fd` | `#C4B5FD` | ✅ Consistent |
| See-all buttons | Blue | Purple | ✅ Consistent |
| Section gradients | `#2563eb → #7c3aed` | `#7C3AED → #6366F1` | ✅ Consistent |
| Rating badges | Amber (unchanged) | Amber | ✅ Correct (distinct) |
| Free pricing badge | Green (unchanged) | Green | ✅ Correct (distinct) |

### CSS Variables (MainLayout global)

```css
:root {
  --c-purple: #7C3AED;     /* Primary */
  --c-purple-light: #EDE9FE;
  --c-purple-mid: #DDD6FE;
  --c-blue: #6366F1;       /* Secondary */
  --c-blue-light: #EEF2FF;
  --c-pink: #EC4899;       /* Accent */
  --c-green: #10B981;      /* Success/Trust */
  --c-green-light: #ECFDF5;
  --c-dark: #0F172A;       /* Text/Dark */
  --c-gray: #647488;       /* Secondary text */
  --c-border: #E8ECF0;     /* Borders */
  --c-bg: #FAFBFC;         /* Subtle background */
}
```

---

## 2. Typography Audit

| Element | Font | Weight | Status |
|---|---|---|---|
| Body text | Plus Jakarta Sans | 400 | ✅ |
| Nav links | Plus Jakarta Sans | 500 | ✅ |
| H1 hero | Plus Jakarta Sans | 800 | ✅ |
| H2 sections | Plus Jakarta Sans | 800 | ✅ |
| Card titles | Plus Jakarta Sans | 700 | ✅ |
| Badges/labels | Plus Jakarta Sans | 600-700 | ✅ |
| CTA buttons | Plus Jakarta Sans | 700 | ✅ |

**Font loading:** Google Fonts CDN, `display=swap`, `preconnect` to fonts.googleapis.com and fonts.gstatic.com. Loaded once in MainLayout head, applies globally.

---

## 3. Component Audit

### Header (MainLayout)

| Element | Status | Notes |
|---|---|---|
| Logo Z icon | ✅ | SVG path `M4 4 H14 L4 14 H14` — geometric Z |
| Logo gradient | ✅ | `#7C3AED → #6366F1` |
| Nav link hover | ✅ | Purple background pill on hover |
| Search focus | ✅ | Purple ring `rgba(124,58,237,0.12)` |
| Sticky behavior | ✅ | `backdrop-filter: blur(12px)` |

### Footer (MainLayout)

| Element | Status | Notes |
|---|---|---|
| Brand block | ✅ | Z icon + "Zotopie" + tagline |
| Link columns | ✅ | Explore / Compare, 3 links each |
| Affiliate disclosure | ✅ | Present, compliant |
| Bottom copy | ✅ | Copyright + disclosure on one row |

### ToolCard

| Element | Status | Notes |
|---|---|---|
| Border | ✅ | `1.5px solid #E8ECF0` |
| Hover border | ✅ | `#C4B5FD` purple |
| Top gradient bar | ✅ | `#7C3AED → #6366F1` |
| CTA button | ✅ | Purple text on `#F5F3FF` bg |
| CTA hover | ✅ | Solid purple fill |
| Rating badge | ✅ | Amber (intentionally distinct) |
| Free badge | ✅ | Green (intentionally distinct) |

### AltCard

| Element | Status | Notes |
|---|---|---|
| Border | ✅ | `1.5px solid #E8ECF0` |
| Hover | ✅ | `#C4B5FD` purple border + shadow |
| Try-btn | ✅ | Purple gradient + shadow |
| Compare-btn | ✅ | Purple ghost style |
| Rating | ✅ | Amber (consistent) |

### CategoryCard

| Element | Status | Notes |
|---|---|---|
| Icon container | ✅ | Per-category emoji + semantic color |
| Hover border | ✅ | `--c-purple` |
| Tool count badge | ✅ | Per-category color |
| Typography | ✅ | Plus Jakarta Sans 700 title |

### ToolLogo

| Element | Status | Notes |
|---|---|---|
| SVG mode | ✅ | White bg + `#E8ECF0` border + subtle shadow |
| Fallback mode | ✅ | Consistent border-radius 8px, Plus Jakarta Sans |
| Size prop | ✅ | Accepts any size, scales cleanly |

---

## 4. Page Template Audit

### Homepage (index.astro)

| Section | Status | Notes |
|---|---|---|
| Hero eyebrow | ✅ | Purple pill badge |
| H1 gradient accent | ✅ | `#7C3AED → #6366F1 → #EC4899` |
| Trust signals | ✅ | NEW: 3 trust items with green check icons |
| Search box | ✅ | Purple focus ring, purple submit button |
| Stats bar | ✅ | 4 stat items with purple/blue/pink/green icons |
| Category chips | ✅ | Purple hover state |
| Section headings | ✅ | `--c-dark` color, weight 800 |
| See-all buttons | ✅ | Purple ghost → solid on hover |
| Best cards | ✅ | Purple gradient top bar on hover |
| CTA section | ✅ | Purple gradient background |
| Button primary | ✅ | Purple gradient |
| Button secondary | ✅ | Purple border hover |

### Category Page ([slug].astro)

| Element | Status | Notes |
|---|---|---|
| Hero accent bar | ✅ | `#7C3AED → #6366F1` |
| Top-ranked cards | ✅ | Purple hover border/shadow |
| RC badge | ✅ | Purple |
| RC CTA | ✅ | Purple ghost |
| Filter tabs active | ✅ | Purple count badge |
| FAQ open state | ✅ | Purple bg + border |
| HOW-TO numbers | ✅ | Purple circles |
| Related cards hover | ✅ | Purple border |
| Intro toggle | ✅ | Purple text |

### Review Page ([slug].astro)

| Element | Status | Notes |
|---|---|---|
| All blue references | ✅ | Replaced (27 occurrences) |
| Expert guides section | ✅ | Purple gradient on guide cards |
| Affiliate disclosure | ✅ | Gray pill badge |

### Compare Page ([pair].astro)

| Element | Status | Notes |
|---|---|---|
| Blue references | ✅ | Replaced (14 occurrences) |

### Alternatives Page ([slug].astro)

| Element | Status | Notes |
|---|---|---|
| Blue references | ✅ | Replaced (10 occurrences) |
| Best Overall CTA | ✅ | Purple gradient button (R1 fix) |

### Best/Authority Page ([slug].astro)

| Element | Status | Notes |
|---|---|---|
| Blue references | ✅ | Replaced (17 occurrences) |
| Top Pick banner | ✅ | Purple gradient |

### Search Page

| Element | Status | Notes |
|---|---|---|
| Blue references | ✅ | Replaced (12 occurrences) |
| noindex | ✅ | Applied |

---

## 5. Outstanding Items (Non-blocking)

| Item | Priority | Notes |
|---|---|---|
| Slack, Canva, OpenAI logos | Medium | Not in simple-icons v16. Need local SVG files. |
| Monday.com, Salesforce logos | Medium | Not in simple-icons v16 |
| `favicon.ico` (binary) | Low | `.ico` not updated, only `.svg`. Browser prefers SVG. |
| Dark mode variant | Low | Not implemented. System font CSS has `prefers-color-scheme` in `favicon.svg` only |
| Tailwind App vs TailwindCSS | Low | Using fallback to avoid incorrect icon |

---

## 6. Brand Consistency Checklist

- ✅ One primary color used consistently (#7C3AED)
- ✅ One font family (Plus Jakarta Sans)
- ✅ Consistent border radius system (8px logos, 12-16px cards, 20px pills)
- ✅ Consistent border color (#E8ECF0)
- ✅ Consistent hover shadow depth
- ✅ Consistent rating badge (amber — intentionally separate)
- ✅ Consistent free/paid badge (green — intentionally separate)
- ✅ Logo Z mark appears in nav, footer, favicon, OG image
- ✅ Trust signals present on homepage
- ✅ Affiliate disclosures present on all pages (MainLayout footer)
- ✅ 860 pages build clean
