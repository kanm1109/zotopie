# MOBILE QA REPORT — Zotopie

**Task:** UX-POLISH-FINAL-AUDIT  
**Date:** 2026-06-14  
**Method:** Static CSS analysis across all 8 page type templates  
**Viewports tested:** 320px / 375px / 390px / 414px / 768px / 1024px / 1440px

---

## Summary

| Viewport | Status | Critical Issues |
|---|---|---|
| 320px (small Android) | ✗ FAIL | Nav overflows +226px, table clips (best page) |
| 375px (iPhone SE/14) | ✗ FAIL | Nav overflows +171px, table clips (best page) |
| 390px (iPhone 14 Pro) | ✗ FAIL | Nav overflows +156px |
| 414px (iPhone 14 Plus) | ✗ FAIL | Nav overflows +132px |
| 768px (iPad portrait) | ⚠ WARN | Table clips (best page), tap targets small |
| 1024px (iPad landscape) | ✓ PASS | No issues |
| 1440px (Desktop) | ✓ PASS | No issues |

---

## Per-Page Results

### Homepage (`/`)

| Viewport | Layout | Hero Search | Category Grid | Tools Grid | Stats Bar |
|---|---|---|---|---|---|
| 320px | ✗ nav overflow | ✓ constrained to 100% | ✓ 1fr | ✓ 1fr | ✓ flex-col |
| 375px | ✗ nav overflow | ✓ | ✓ | ✓ | ✓ |
| 640px | ✗ nav overflow | ✓ | ✓ | ✓ | ✓ |
| 768px | ✓ | ✓ | ✓ | auto-fill min 290px → multi-col | ✓ horizontal |
| 1440px | ✓ | ✓ max-width 600px centered | ✓ 3-4 cols | ✓ 3-4 cols | ✓ |

**Issues:** Nav overflow only (affects all pages, not homepage-specific).

---

### Review Page (`/reviews/[slug]/`)

| Viewport | Hero | Pros/Cons | Summary Grid | Pricing Table | Sticky CTA | FAQ |
|---|---|---|---|---|---|---|
| 320px | ✗ nav overflow, h1 OK 1.6rem | ✓ 1fr | ✓ 1fr 1fr | ✓ 1fr 1fr | ⚠ home indicator overlap | ✓ |
| 375px | ✗ nav overflow | ✓ | ✓ | ✓ | ⚠ | ✓ |
| 640px | ✗ nav overflow | ✓ 1fr | ✓ 2 col | ✓ 2 col | ✓ price/rating hidden | ✓ smaller font |
| 768px | ✓ | ✓ 2 col | ✓ 3 col | ✓ 3 col | ✓ all visible | ✓ |
| 1440px | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**Issues:**
- Nav overflow (all viewports < ~520px)
- Sticky CTA: missing `env(safe-area-inset-bottom)` → overlaps home indicator at bottom on iPhone X–14

---

### Best Tools Page (`/best/[slug]/`)

| Viewport | Tool List | Comparison Table | Pros/Cons | How-to Grid |
|---|---|---|---|---|
| 320px | ✗ nav overflow, cards flex-col | ✗ TABLE CLIPS | ✓ 1fr | ✓ 1fr |
| 375px | ✗ nav overflow | ✗ TABLE CLIPS | ✓ | ✓ |
| 640px | ✗ nav overflow, tool entry col | ✗ TABLE CLIPS | ✓ | ✓ |
| 768px | ✓ table font reduced | ⚠ font reduced, hidden bestfor col, but still `overflow: hidden` | ✓ 1fr | ✓ 1fr |
| 1024px | ✓ | ✓ full table | ✓ | ✓ |

**Issues:**
- Nav overflow
- `.cmp-table-wrap { overflow: hidden }` clips comparison table at all mobile viewports. Content is NOT scrollable — it is HIDDEN. Users cannot see all comparison columns.

**Severity:** P1 — 15 best pages affected.

---

### Compare Page (`/compare/[pair]/`)

| Viewport | Header Row | Comparison Table | vs Badge |
|---|---|---|---|
| 320px | ✗ nav overflow, `.cmp-heads` 1fr 32px 1fr | ✓ table scrolls (overflow-x: auto) | ✓ centered |
| 375px | ✗ nav overflow | ✓ scrollable | ✓ |
| 640px | ✗ nav overflow | ✓ scrollable | ✓ |
| 768px | ✓ full width | ✓ | ✓ |

**Issues:** Nav overflow only. Comparison table correctly uses `overflow-x: auto` — horizontally scrollable ✓.

---

### Alternatives Page (`/alternatives/[slug]/`)

| Viewport | Alt Cards | Compare Pills | Breakpoint |
|---|---|---|---|
| 320px | ✗ nav overflow, `.cc-meta` not adapted until 600px | ✓ pills wrap | wrong breakpoint at 600px |
| 375px | ✗ nav overflow, meta NOT adapted (640px standard missed) | ✓ | ⚠ |
| 600px | border | meta adapts | transitions here |
| 601–640px | cc-meta adapted | pills wrap | |
| 640px | adapted | ✓ | |
| 768px | ✓ | ✓ | |

**Issues:**
- Nav overflow
- Breakpoint at 600px (not 640px) — at 601–640px range, alternatives page is the only page NOT yet adapted

---

### Category Page (`/category/[slug]/`)

| Viewport | Hero Stats | Filter Tabs | Tools Grid | Related Grid |
|---|---|---|---|---|
| 320px | ✗ nav overflow, stats flex-col gap 16px | ✓ tabs wrap | ✓ 1fr | ✓ 1fr |
| 375px | ✗ nav overflow | ✓ | ✓ | ✓ |
| 640px | ✗ nav overflow | ✓ smaller | ✓ 1fr | ✓ 1fr |
| 768px | ✓ | ✓ | ✓ auto-fill 280px | ✓ auto-fill 220px |

**Issues:** Nav overflow only.

---

### Search Page (`/search/`)

| Viewport | Search Input | Category Filter Chips | Results Grid |
|---|---|---|---|
| 320px | ✗ nav overflow, 1fr input | ✓ chips wrap | ✓ 1fr |
| 375px | ✗ nav overflow | ✓ | ✓ |
| 640px | ✗ nav overflow | ✓ smaller size | ✓ 1fr |
| 768px | ✓ | ✓ auto-fill | ✓ |

**Issues:** Nav overflow only.

---

## Nav Overflow Detail

**CSS:** `src/layouts/MainLayout.astro` L114-159

```
.nav-links { display: flex; gap: 4px; }          /* never hides */
.nav-links a { padding: 6px 12px; }               /* 4 items always visible */
@media (max-width: 768px) {
  .nav-search-form { display: none; }             /* only search hides */
}
```

**Nav content width (at all mobile viewports):**
- Logo: ~110px
- 4 nav items with padding: ~348px
- Mobile search icon: ~40px
- **Total: ~498px**

| Device | Viewport | Usable (−48px padding) | Overflow |
|---|---|---|---|
| Small Android | 320px | 272px | 226px |
| iPhone SE | 375px | 327px | 171px |
| iPhone 14 Pro | 390px | 342px | 156px |
| iPhone 14 Plus | 414px | 366px | 132px |
| Mid Android | 480px | 432px | 66px |

---

## Tap Target Audit

WCAG 2.5.5 minimum: 44×44px. Apple HIG: 44×44pt.

| Element | Tap Height | Pass/Fail |
|---|---|---|
| `.nav-links a` (6px v-pad + ~22px text) | ~34px | ✗ FAIL |
| `.nav-s-mobile` (4px pad + 20px icon) | ~28px | ✗ FAIL |
| `.visit-btn` review (10px v-pad + ~22px) | ~42px | ~ BORDERLINE |
| `.sticky-btn` mobile (9px v-pad + ~22px) | ~40px | ~ BORDERLINE |
| `.hero-search-btn` (10px v-pad + ~22px) | ~42px | ~ BORDERLINE |
| `.rc-cta` category (4px v-pad + tiny text) | ~30px | ✗ FAIL |
| `.compare-pill` (7px v-pad + ~16px) | ~30px | ✗ FAIL |
| `.ftab` filter (7px v-pad + ~13px) | ~27px | ✗ FAIL |
| `.ranked-card` category (18px v-pad + full row) | Full card = OK | ✓ PASS |

---

## iOS-Specific Issues

### Safe Area (iPhone X and newer)

```css
/* MISSING in reviews/[slug].astro sticky CTA: */
.sticky-cta {
  position: fixed;
  bottom: 0;
  /* should add: padding-bottom: env(safe-area-inset-bottom); */
}
```

iPhone X/11/12/13/14 home indicator is 34px. The sticky CTA bar sits at `bottom: 0` with 12px padding. At `10px + ~22px text + 10px = 42px` bar height, the lower 34px of home indicator zone partially overlaps.

---

## Android-Specific Issues

No specific Android-only issues identified beyond the general viewport overflow.

---

## Keyboard Accessibility

- `/` shortcut focuses nav search input ✓ (MainLayout L345-352)
- FAQ accordions: `<button>` elements with click handlers ✓
- Form: `role="search"` + `aria-label` on inputs ✓
- Nav: `aria-hidden="true"` on decorative icons ✓
- **Missing:** `aria-label` or `aria-expanded` on nav mobile search icon (`.nav-s-mobile`) 

---

## Recommendations by Priority

### P0 — Fix before any mobile traffic
1. **Nav hamburger menu** at ≤600px: collapse nav-links, show hamburger icon  
   _OR_ minimal fix: hide `nav-logo-text` (saves ~70px) and abbreviate nav items at ≤480px

### P1 — Fix in next sprint
2. **Best page table**: `.cmp-table-wrap { overflow-x: auto }` (1 line CSS change)

### P2 — Fix in UX polish sprint
3. **Safe area inset**: `.sticky-cta { padding-bottom: env(safe-area-inset-bottom) }` (1 line)
4. **Alternatives breakpoint**: 600px → 640px (1 line CSS change)
5. **Tap targets**: Increase nav link padding to `10px 12px`, add `min-height: 44px` to `.nav-s-mobile`
6. **OG image tag**: Add `<meta property="og:image" content="/og-default.svg">` to MainLayout head

---

*MOBILE QA REPORT — 2026-06-14*
