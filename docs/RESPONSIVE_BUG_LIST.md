# RESPONSIVE BUG LIST — Zotopie UX Polish Audit

**Date:** 2026-06-14  
**Source:** UX-POLISH-FINAL-AUDIT  
**Status:** Audit only — no fixes applied yet

---

## Priority Summary

| ID | Severity | Fix Effort | Description |
|---|---|---|---|
| BUG-R001 | **P0** | Medium | Nav overflow on all phones (320–520px) |
| BUG-R002 | **P1** | Trivial | Best page table clips instead of scrolls |
| BUG-R003 | P2 | Trivial | Alternatives page uses 600px breakpoint (not 640px) |
| BUG-R004 | P2 | Small | Tap targets below 44px: nav links, mobile icon, pills |
| BUG-R005 | P2 | Trivial | Page wrapper keeps 24px padding at 320px |
| BUG-R006 | P2 | Trivial | Sticky CTA missing `env(safe-area-inset-bottom)` |
| BUG-R007 | P2 | Small | Missing `<meta property="og:image">` (social shares) |
| BUG-R008 | P3 | Trivial | Best page card `border-radius: 16px` vs 14px standard |
| BUG-R009 | P3 | Small | Two near-black hex values used across pages |
| BUG-R010 | P3 | Trivial | Hero search button border-radius 10px vs 8px standard |
| BUG-R011 | P3 | Large | No tablet breakpoints (769–1024px) |

---

## Bug Details

---

### BUG-R001 — Nav Overflow — P0 CRITICAL

**Affects:** ALL 861 pages  
**Viewports:** 320px, 375px, 390px, 414px, 480px, up to ~520px (all common phone viewports)  
**File:** `src/layouts/MainLayout.astro` L114, L156-159

**Problem:**
```css
/* L114 */
.nav-links { display: flex; align-items: center; gap: 4px; }
/* ↑ 4 nav items: Home, Best Tools, Categories, Reviews — NEVER collapse */

/* L156-159 — only media query for nav: */
@media (max-width: 768px) {
  .nav-search-form { display: none; }
  .nav-s-mobile { display: flex; align-items: center; }
}
/* No hamburger menu. Nav links visible at all widths. */
```

**Width math at 375px:**
- Available: 375 − 48px (padding) = **327px**
- Nav content: logo (~110px) + 4 links (~348px) + search icon (~40px) = **~498px**
- **Overflow: 171px**

**Fix options (choose one):**

Option A — Hamburger menu (best UX):
```css
@media (max-width: 600px) {
  .nav-links { display: none; }
  .nav-links.is-open { display: flex; flex-direction: column; ... }
  .nav-hamburger { display: flex; }
}
```
Requires adding hamburger button HTML + JS toggle.

Option B — Minimal CSS-only fix (fast):
```css
@media (max-width: 540px) {
  .nav-logo-text { display: none; }     /* saves ~70px */
  .nav-links a { padding: 6px 8px; font-size: 0.8rem; }  /* tighter */
}
@media (max-width: 420px) {
  .nav-links a[href="/"] { display: none; }  /* hide "Home" — logo links there */
}
```
Saves enough space to fit remaining links at 375px without hamburger.

---

### BUG-R002 — Best Page Table Clips — P1

**Affects:** `/best/[slug]/` — 15 pages  
**Viewports:** 320px–768px  
**File:** `src/pages/best/[slug].astro` L615-618

**Problem:**
```css
/* L615-618 */
.cmp-table-wrap {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;   /* ← CLIPS table content on mobile */
}
```

**Compare page (correct):**
```css
/* compare/[pair].astro */
.cmp-table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
```

**Fix:**
```css
/* best/[slug].astro — change L618: */
.cmp-table-wrap {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
```

Note: `overflow-x: auto` + `border-radius` can cause border to clip on some browsers. Use `clip-path` or a wrapper element if border-radius is needed with scrollable table.

---

### BUG-R003 — Alternatives Breakpoint Mismatch — P2

**Affects:** `/alternatives/[slug]/` — ~119 pages  
**Viewport gap:** 601px–640px gets no responsive treatment  
**File:** `src/pages/alternatives/[slug].astro` L770

**Problem:**
```css
@media (max-width: 600px) {   /* ← should be 640px */
  h1 { font-size: 1.6rem; }
  .cc-meta { align-items: flex-start; }
  .cmp-bestfor { display: none; }
  .alt-bestfor, .alt-compare-link { margin-left: 0; }
}
```

**Fix:**
```css
@media (max-width: 640px) {   /* ← change to 640px */
```

---

### BUG-R004 — Tap Targets Below 44px — P2

**Affects:** All pages (nav) + category, alternatives pages  
**File:** `src/layouts/MainLayout.astro` L115-122, L155; `category/[slug].astro` L566-573; `alternatives/[slug].astro` L735-746

**Problems:**

```css
/* Nav links: MainLayout L115-122 */
.nav-links a {
  padding: 6px 12px;    /* ← tap height ≈ 34px — need 44px */
}

/* Mobile search icon: MainLayout L155 */
.nav-s-mobile { padding: 4px; }   /* ← 28px tap area */

/* Category card CTA: category/[slug].astro L566-573 */
.rc-cta {
  padding: 4px 12px;    /* ← ~30px tap height */
}

/* Compare pills: alternatives/[slug].astro L737 */
.compare-pill {
  padding: 7px 14px;    /* ← ~30px tap height */
}
```

**Fix for nav links:**
```css
.nav-links a {
  padding: 11px 12px;   /* ← 11+11+22 = 44px tap height */
}
```

**Fix for mobile search icon:**
```css
.nav-s-mobile {
  padding: 12px;        /* ← 12+12+20 = 44px */
  min-width: 44px;
  min-height: 44px;
  display: flex; align-items: center; justify-content: center;
}
```

---

### BUG-R005 — Page Wrapper Tight at 320px — P2

**Affects:** All pages  
**File:** `src/layouts/MainLayout.astro` L162-166

**Problem:**
```css
.page-wrapper {
  padding: 0 24px 80px;   /* ← 24px sides at ALL widths */
}
/* At 320px: usable content = 320 - 48 = 272px — very tight */
```

**Fix:**
```css
.page-wrapper {
  padding: 0 24px 80px;
}
@media (max-width: 375px) {
  .page-wrapper { padding: 0 16px 64px; }
}
```

---

### BUG-R006 — Sticky CTA Missing Safe Area Inset — P2

**Affects:** `/reviews/[slug]/` on iPhone X/11/12/13/14 (all with home indicator)  
**File:** `src/pages/reviews/[slug].astro` L1108-1119

**Problem:**
```css
.sticky-cta {
  position: fixed;
  bottom: 0;
  /* missing: padding-bottom: env(safe-area-inset-bottom) */
}
```

**Fix:**
```css
.sticky-cta {
  position: fixed;
  bottom: 0;
  padding-bottom: env(safe-area-inset-bottom);
}
/* Also update .sticky-inner to account for the extra padding: */
.sticky-inner {
  padding: 12px 24px;   /* keep top/sides */
}
```

Also add to `<html>` in MainLayout (or is already via viewport meta):
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```
(The `viewport-fit=cover` enables `env(safe-area-inset-*)` to work.)

---

### BUG-R007 — Missing OG Image Meta Tag — P2

**Affects:** All pages (social sharing)  
**File:** `src/layouts/MainLayout.astro` head section

**Problem:** No `<meta property="og:image">` in MainLayout head. When pages are shared on Twitter/LinkedIn/Slack, no image preview appears.

**Fix — add to MainLayout `<head>`:**
```html
<meta property="og:image" content="https://zotopie.com/og-default.svg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://zotopie.com/og-default.svg" />
```

Note: Need to create `public/og-default.svg` (or `.png`) if it doesn't exist. PNG format preferred for maximum social platform compatibility.

---

### BUG-R008 — Card Border Radius Inconsistency — P3

**Affects:** `/best/[slug]/` visual consistency  
**File:** `src/pages/best/[slug].astro`

**Problem:** `.tool-entry { border-radius: 16px }` vs all other pages using `14px`.

**Fix:** Change to `14px` to match system standard (or update the standard to 16px everywhere).

---

### BUG-R009 — Two Near-Black Hex Values — P3

**Affects:** Visual consistency across all pages  

| Value | Used in |
|---|---|
| `#111827` | reviews, compare, MainLayout footer |
| `#0F172A` | index.astro hero |

**Fix:** Standardize on one value. `#0F172A` (Slate 950) is slightly cooler/darker — matches modern design system defaults. Or use the CSS variable `var(--c-dark)` consistently (already set to `#0F172A` in MainLayout).

---

### BUG-R010 — Hero Search Button Border Radius — P3

**Affects:** Homepage only  
**File:** `src/pages/index.astro` L549

```css
.hero-search-btn { border-radius: 10px; }   /* ← standard is 8px */
```

**Fix:** Change to `8px` to match all other CTA buttons.

---

### BUG-R011 — No Tablet Breakpoints (769–1024px) — P3

**Affects:** All pages  
**Impact:** iPad portrait/landscape users see desktop layout at 768px+ which is generally fine, but some content areas could benefit from intermediate treatment.

**Examples of potential improvement:**
- `index.astro` tools grid: at 769px, `minmax(290px,1fr)` might give 2 cols (~490px each) — fine
- `best/[slug].astro` tool list: at 769px shows full desktop layout — acceptable
- Category page: `minmax(280px,1fr)` auto-fills → 2-3 cols at tablet — fine

**Assessment:** Not truly broken. Desktop layout adapts reasonably in the tablet range. This is a P3 enhancement, not a bug.

---

## Fix Time Estimates

| Bug | Effort | Time |
|---|---|---|
| BUG-R001 (nav overflow) | Option B CSS-only | ~30min |
| BUG-R001 (nav overflow) | Option A hamburger | ~2-3hr |
| BUG-R002 (table clip) | 1 line CSS | ~5min |
| BUG-R003 (breakpoint) | 1 line CSS | ~2min |
| BUG-R004 (tap targets) | 4-5 CSS changes | ~30min |
| BUG-R005 (wrapper padding) | 3 lines CSS | ~5min |
| BUG-R006 (safe area) | 2 lines CSS + viewport-fit | ~10min |
| BUG-R007 (OG image) | Create image + 5 lines HTML | ~1hr |
| BUG-R008-011 | Minor CSS | ~30min total |

**Total for P0+P1+P2 (Option B nav):** ~2.5 hours  
**Total for P0+P1+P2 (Option A nav with hamburger):** ~5-6 hours

---

*RESPONSIVE BUG LIST — UX-POLISH-FINAL-AUDIT — 2026-06-14*
