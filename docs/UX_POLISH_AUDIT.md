# UX POLISH AUDIT — Zotopie

**Task:** UX-POLISH-FINAL-AUDIT  
**Role:** Senior UX Engineer + Frontend QA  
**Date:** 2026-06-14  
**Constraint:** Audit only — NO fixes implemented  
**Scope:** All 8 page types, all viewport breakpoints, brand + visual consistency

---

## Verdict

> **REQUIRES UX POLISH SPRINT**

1 critical bug (nav overflow on all mobile phones), 1 P1 bug (best page table clipping), and several P2 issues found.  
Core desktop experience and content rendering are solid. Mobile experience needs attention.

---

## Phase 1 — Responsive Audit

### Breakpoint Coverage Summary

| Page | Breakpoints | Notes |
|---|---|---|
| `MainLayout.astro` | 768px only | Nav links never collapse |
| `index.astro` | 768px + 640px | Grids + hero + stats bar ✓ |
| `reviews/[slug].astro` | 640px only | Sticky CTA hides price/rating ✓ |
| `best/[slug].astro` | 768px + 640px | Table still clips (see BUG-R001) |
| `compare/[pair].astro` | 640px only | Table scrollable ✓ |
| `alternatives/[slug].astro` | **600px** | **Inconsistent — all others use 640px** |
| `category/[slug].astro` | 640px only | Filter tabs wrap ✓ |
| `search.astro` | 640px only | Cat chips wrap ✓ |

**Key gap:** No breakpoints between 640px–768px on most pages. The 769px–1024px tablet range is unstyled.

---

### BUG-R001 (P0 — CRITICAL): Navigation overflow on all phones

**Location:** `src/layouts/MainLayout.astro` — affects ALL 861 pages  
**Breakpoints:** Occurs from ~320px to ~520px (every common phone viewport)

**Root cause:**
```css
/* Only media query for nav: */
@media (max-width: 768px) {
  .nav-search-form { display: none; }    /* search hides */
  .nav-s-mobile { display: flex; }       /* icon replaces it */
}
/* nav-links with 4 items NEVER collapses — no hamburger menu */
```

**Width calculation at 375px (iPhone 14):**
- `.nav-inner` padding: `24px × 2 = 48px` → usable: **327px**
- Logo: icon (32px) + gap (8px) + "Zotopie" text (~70px) = **~110px**
- `.nav-links` with 4 items at `padding: 6px 12px` each:
  - "Home" ~59px, "Best Tools" ~94px, "Categories" ~99px, "Reviews" ~84px + 12px gaps = **~348px**
- Mobile search icon: ~28px + 12px gap = **~40px**
- **Total nav-right: ~388px**
- **Total nav content: 110 + 388 = ~498px in 327px → 171px overflow**

**Viewports affected:**

| Viewport | Available | Nav content | Overflow |
|---|---|---|---|
| 320px | 272px | ~498px | 226px overflow |
| 375px | 327px | ~498px | 171px overflow |
| 390px | 342px | ~498px | 156px overflow |
| 414px | 366px | ~498px | 132px overflow |
| 480px | 432px | ~498px | 66px overflow |
| 520px | 472px | ~498px | ~26px overflow |

**No `overflow-x: hidden` on `body`** → horizontal scrollbar appears on mobile.

**Fix recommendation:** Add hamburger menu below ~600px, or hide "Home" link (logo already links home), or hide "Best Tools" + "Categories" text showing icons only.

---

### BUG-R002 (P1): Best page comparison table clips instead of scrolls

**Location:** `src/pages/best/[slug].astro` L615-618

```css
/* BEST PAGE — WRONG: clips table content */
.cmp-table-wrap {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;   /* ← CLIPS content, no horizontal scroll */
}
```

vs:

```css
/* COMPARE PAGE — CORRECT: table scrolls horizontally */
.cmp-table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
```

At 768px, best page hides `.tbl-bestfor` column and reduces font-size — but table still has multiple columns (Rank, Tool, Pricing, Free Trial, Rating, Best For) that overflow at 640px with `overflow: hidden`.

**Fix:** Change `overflow: hidden` → `overflow-x: auto; -webkit-overflow-scrolling: touch;` on `.cmp-table-wrap` in `best/[slug].astro`.

---

### BUG-R003 (P2): Alternatives page breakpoint inconsistency

**Location:** `src/pages/alternatives/[slug].astro` L770

```css
@media (max-width: 600px) {   /* ← 600px, should be 640px */
  h1 { font-size: 1.6rem; }
  .cc-meta { align-items: flex-start; }
  .cmp-bestfor { display: none; }
  .alt-bestfor, .alt-compare-link { margin-left: 0; }
}
```

**Gap:** At 601px–640px (many mid-range Android phones), alternatives page does NOT adapt while all other page types already have. Users see un-adapted layout at this range.

---

### BUG-R004 (P2): Tap targets below 44px minimum

WCAG 2.5.5 (AAA) recommends 44×44px minimum. Apple HIG requires 44×44pt.

| Element | Location | Tap height | Issue |
|---|---|---|---|
| `.nav-links a` | MainLayout L115-122 | `6+6px pad + ~22px text ≈ 34px` | ✗ Below 44px |
| `.nav-s-mobile` | MainLayout L155 | `4px pad + 20px icon = 28px` | ✗ Very small |
| `.nav-logo` | MainLayout L91 | `32px icon height, no explicit tap padding` | ✗ Borderline |
| `.sticky-btn` (mobile) | reviews/[slug].astro L1181 | `9+9px pad + ~22px text ≈ 40px` | ~ Close but not quite 44px |
| `.rc-cta` category card | category/[slug].astro L572 | `4+4px pad + tiny font → ≈ 30px` | ✗ Below 44px |
| `.compare-pill` | alternatives/[slug].astro L737 | `7+7px pad + ~16px text ≈ 30px` | ✗ Below 44px |

**Primary CTA buttons** (`.visit-btn`, `.hero-search-btn`, etc.) are acceptable at 10+px padding.

---

### BUG-R005 (P2): Page wrapper no responsive padding reduction

**Location:** `src/layouts/MainLayout.astro` L162-166

```css
.page-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 80px;   /* ← same 24px at all viewport widths */
}
```

At 320px: `320 - 48px = 272px` usable content width. 24px is generous relative to screen width. Reducing to 16px at ≤375px would give 288px (+16px more).

---

### BUG-R006 (P2): Missing safe-area-inset-bottom on sticky CTA

**Location:** `src/pages/reviews/[slug].astro` sticky CTA

```css
.sticky-cta {
  position: fixed;
  bottom: 0;
  /* missing: padding-bottom: env(safe-area-inset-bottom) */
}
```

On iPhone X, 11, 12, 13, 14 (any with home indicator): the 34px home indicator zone at the bottom overlaps the sticky CTA. The button is partially obscured.

---

## Phase 2 — Brand Consistency

### Logo / Icon

| Location | Container | Icon SVG |
|---|---|---|
| Nav (MainLayout L272-276) | 32×32px, gradient bg, border-radius: 8px | `M4 4 H14 L4 14 H14`, stroke white 2.8, linecap round |
| Footer (MainLayout L312-316) | 28×28px, gradient bg, border-radius: 7px | Same SVG path |

**Result:** Same SVG mark used in both locations. Slightly different container sizes (32 vs 28) — intentional hierarchy, **acceptable**.

### Favicon

- `public/favicon.svg` referenced in `<head>` as site icon
- Also referenced in Organization JSON-LD schema: `"logo": { "url": "https://zotopie.com/favicon.svg" }`
- Cannot verify visual match without rendering, but consistent URL reference ✓

### OG Image

- `og-default.svg` (if it exists) not audited — no reference found in MainLayout `<head>` tag
- **Finding:** No `<meta property="og:image">` tag in MainLayout — **OG image missing from social share**
- Each page likely relies on per-page schema or no social image at all
- Not a mobile/UX bug but worth noting for social sharing

### Tool Logo Rendering

- 3-tier: simple-icons inline SVG → public/logos/ img → initials fallback
- Initials color: deterministic per-slug (`getAvatarColor`) → consistent across pages ✓
- `.tl-svg`, `.tl-img`, `.tl-fallback` all use same `border-radius: 8px; border: 1px solid #E8ECF0` → consistent card treatment ✓

---

## Phase 3 — Mobile UX

### Hero Search (index.astro)

- `max-width: 600px; margin: 0 auto` → naturally constrains to mobile viewport ✓
- At 640px: input `padding: 14px 14px 14px 46px`, button `padding: 8px 16px` → still usable ✓
- Autocomplete dropdown: `overflow: hidden; z-index: 200` → works on mobile ✓
- **GOOD** — no issues

### Navigation Search (mobile)

- Desktop: 200px search input (expands to 260px on focus)
- At ≤768px: form hidden, icon link shown instead
- Mobile icon links to `/search` page → correct fallback ✓
- **GOOD** — functional

### Category Filter Tabs

- `flex-wrap: wrap; width: fit-content` — tabs wrap naturally ✓
- At 640px: `gap: 6px; font-size: 0.8rem; padding: 6px 12px` — smaller but still usable
- No `overflow-x: auto` container — wrapping preferred over scrolling for 3 tabs (All / Free / Paid) ✓
- **GOOD** — 3 tabs fit fine

### Compare Table (compare page)

- `.cmp-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch }` ✓
- At 640px: `.cmp-heads { grid-template-columns: 1fr 32px 1fr }` (reduced center) ✓
- **GOOD**

### Compare Table (best page)

- `overflow: hidden` → **CLIPS content** — documented as BUG-R002

### FAQ Accordions

- At 640px: `padding: 14px; font-size: 0.9rem` → readable ✓
- **GOOD**

### Pricing Table (review page)

- At 640px: `grid-template-columns: 1fr 1fr` (collapses from 3 to 2 columns)
- At 375px with `padding: 0 24px`: each column ≈ (327 - gap) / 2 ≈ 157px
- 2-column at 375px is acceptable for pricing labels ✓
- **GOOD**

### Review Sticky CTA

- At 640px: price + rating hidden, only name + button remain ✓
- Button `padding: 9px 16px` → height ≈ 40px (slightly below 44px — minor)
- Missing `env(safe-area-inset-bottom)` — documented as BUG-R006
- **MOSTLY GOOD** with 2 minor issues

---

## Phase 4 — Visual Consistency

### Button Styles

| Button Type | Background | Color | Border-radius | Pages |
|---|---|---|---|---|
| Primary CTA | `#7C3AED` | `#fff` | 8px | reviews, best, compare, search, index ✓ |
| Outline CTA | `transparent / border #7C3AED` | `#7C3AED` | 8px | reviews `.alt-link` ✓ |
| Hero search | gradient `#7C3AED → #6366F1` | `#fff` | 10px | index only (slight variation) |

**Minor inconsistency:** Hero search button uses `border-radius: 10px` vs standard `8px`. Low impact.

### Badge / Tag Styles

- Category tag: `bg: #F5F3FF; color: #7C3AED; border: 1px solid #DDD6FE; border-radius: 20px` — used consistently across review, search, best pages ✓
- Pricing badge: varies per page (inline styles or different classes) — minor
- Rating badge: `bg: #fef3c7; color: #d97706` in multiple locations ✓

### Card Styles

| Card | Border | Radius | Pages |
|---|---|---|---|
| Tool card | `1px solid #e5e7eb` | `14px` | category, compare, search ✓ |
| Tool entry (best) | `1px solid #e5e7eb` | **`16px`** | best page — 2px larger |
| Prev/Next nav card | `1px solid #e5e7eb` | `14px` | review ✓ |

**Finding:** Best page uses `border-radius: 16px` on `.tool-entry` while all other cards use `14px`. Minor inconsistency.

### Grid Column Gap

- `index.astro` tools: `minmax(290px, 1fr)`
- `category/[slug].astro` tools: `minmax(280px, 1fr)` (10px smaller min)

Minor — cards still visually consistent.

### Color System

| Token | Value | Usage |
|---|---|---|
| Purple primary | `#7C3AED` | CTAs, badges, active states — ALL pages ✓ |
| Purple dark | `#6D28D9` | Hover states — consistent ✓ |
| Purple light | `#F5F3FF` | Tag bg, card hover bg — consistent ✓ |
| Text dark | `#111827` / `#0F172A` | Headings — minor variation (2 hex values for near-black) |
| Text gray | `#6b7280` / `#647488` | Body text — minor variation |

**Finding:** Two slightly different "dark text" hex values (`#111827` vs `#0F172A`) used across pages. Visual difference is imperceptible but indicates inconsistency in design system.

### Typography

| Pages | Font | Status |
|---|---|---|
| Core tool pages (all via MainLayout) | Plus Jakarta Sans | Standard ✓ |
| Blog / content pages (via ArticleLayout) | Atkinson Hyperlegible | Different font ✗ |

**Pre-existing P2 bug** from prior audit (BUG-009). Users who browse from blog → tool reviews notice font switch.

---

## Phase 5 — Production Spot Check

Production verification was completed in the prior FINAL-STABILIZATION-SPRINT:
- 40 pages spot-checked via HTTP — all returned 200, no mojibake, GA4 + JSON-LD present
- No additional production fetches run (Cloudflare bot protection blocks WebFetch)

---

## Complete Bug Registry

| ID | Severity | Area | Description | File(s) |
|---|---|---|---|---|
| BUG-R001 | **P0** | Responsive | Nav overflow on all phones (320–520px) — no hamburger | MainLayout.astro |
| BUG-R002 | **P1** | Responsive | Best page comparison table `overflow: hidden` clips on mobile | best/[slug].astro L618 |
| BUG-R003 | P2 | Responsive | Alternatives breakpoint at 600px (should be 640px) | alternatives/[slug].astro L770 |
| BUG-R004 | P2 | Mobile UX | Tap targets below 44px: nav links, mobile search icon, rc-cta, compare pills | MainLayout, category, alternatives |
| BUG-R005 | P2 | Responsive | page-wrapper padding stays 24px at all viewports (tight at 320px) | MainLayout.astro L165 |
| BUG-R006 | P2 | Mobile UX | Sticky CTA bar missing `env(safe-area-inset-bottom)` for iPhone notch | reviews/[slug].astro |
| BUG-R007 | P2 | Brand | Missing `<meta property="og:image">` — social shares have no preview image | MainLayout.astro head |
| BUG-R008 | P3 | Visual | Best page card `border-radius: 16px` vs 14px on all other pages | best/[slug].astro |
| BUG-R009 | P3 | Visual | Two "near-black" hex values: `#111827` vs `#0F172A` across pages | Multiple |
| BUG-R010 | P3 | Visual | Hero search button `border-radius: 10px` vs 8px standard | index.astro |
| BUG-R011 | P3 | Responsive | No tablet-range (769–1024px) breakpoints on any page | All page templates |

---

## Priority Fix Order

1. **BUG-R001** — Nav overflow affects 100% of mobile users, every page. Fix first.
2. **BUG-R002** — Best page table clips on mobile, affecting 15 authority pages.
3. **BUG-R006** — Sticky CTA overlaps home indicator on all modern iPhones during review reading.
4. **BUG-R003** — Alternatives breakpoint mismatch: 1-line CSS change.
5. **BUG-R004** — Tap targets: primarily nav links; increase padding or minimum touch area.
6. **BUG-R007** — OG image: high marketing value, low effort with a default image.
7. BUG-R005, BUG-R008, BUG-R009, BUG-R010, BUG-R011 — polish only, defer to design sprint.

---

*UX-POLISH-FINAL-AUDIT — audit complete 2026-06-14*
