# Final Category Consistency Report
**Task:** D-018A  
**Date:** 2026-06-15  
**Scope:** Homepage vs Reddit Category page — header, navigation, card CTA, mobile overflow

---

## Changes Made

### Fix 1 — Header Consolidation

**Problem:** `MainLayout.astro` had its own inline `<header>` HTML (50+ lines) duplicating `SiteHeader.astro`. Two sources of truth for the same UI.

**Fix:**
- Added `import SiteHeader from '../components/SiteHeader.astro'` to `MainLayout.astro`
- Replaced the inline `<header>...</header>` block with `<SiteHeader />`
- Removed the duplicate nav CSS block from `MainLayout.astro` (lines 74–228: `.site-header`, `.nav-inner`, `.nav-logo`, `.nav-links`, `.nav-hamburger`, `.mobile-menu`, etc.)
- Removed the duplicate `<script>` block for keyboard `/` shortcut and hamburger toggle (already handled inside `SiteHeader.astro`)

**Files changed:** `src/layouts/MainLayout.astro`

---

### Fix 2 — Navigation Consistency

**Problem:** `SiteHeader.astro` had `<a href="/reddit/">Reddit</a>` hardcoded in both desktop nav and mobile menu. Homepage nav had 4 items; all category pages had 5.

**Fix:** Removed `Reddit` link from both nav locations in `SiteHeader.astro`:
- Desktop nav (was line 22): removed `<a href="/reddit/">Reddit</a>`
- Mobile menu (was line 50): removed `<a href="/reddit/">Reddit</a>`

Both pages now render identical nav: **Home · Best Tools · Categories · Reviews · [search]**

**Files changed:** `src/components/SiteHeader.astro`

---

### Fix 3 — Article Card CTA

**Problem:** `ArticleCard.astro` had no explicit call-to-action. ToolCard had `Read Review →`; ArticleCard was only clickable via the title `<h2>`.

**Fix:** Added `<a href={articleUrl} class="card-cta">Read Article →</a>` to `.card-body` after the tags section. Added `.card-cta` CSS:

```css
.card-cta {
  display: inline-block;
  margin-top: 14px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--c-purple);
  text-decoration: none;
}
.card-cta:hover { text-decoration: underline; }
```

**Files changed:** `src/components/ArticleCard.astro`

---

### Fix 4 — Mobile Overflow (.cat-desc)

**Problem:** At 375px, the category subtitle text overflowed the right edge of the viewport.

**Fix:** Added to `.cat-desc` in `CategoryLayout.astro`:
```css
overflow-wrap: break-word;
word-break: break-word;
```

**Note:** The subtitle overflow is still partially visible in headless screenshots at 375px. The `overflow-wrap` fix addresses long-word scenarios. The root cause may be an element inside the `.posts-grid` (possibly the featured card's title or `-webkit-box` display on `.card-desc`) causing body-level horizontal overflow that extends the viewport, preventing the paragraph from seeing the correct container width. Needs DevTools verification in a real browser. This is a P1 issue and does not block the P0 fixes.

**Files changed:** `src/layouts/CategoryLayout.astro`

---

## Build Verification

```
✓ 848 page(s) built in 17.53s
✓ Completed — no errors
```

Warnings about empty collections (`blog`, `threads`, `extensions`, `marketing`) are pre-existing — those content folders have no articles yet, not caused by these changes.

---

## Before / After Screenshots

### Desktop 1440px — Navigation

| Before | After |
|---|---|
| Homepage: 4 items (Home, Best Tools, Categories, Reviews) | Homepage: 4 items ✅ |
| Reddit: **5 items** (+ Reddit) | Reddit: **4 items — matches homepage** ✅ |

### Desktop 1440px — Article Card

| Before | After |
|---|---|
| Card ends with hashtag tags, no CTA | **"Read Article →"** link visible below tags ✅ |

### Mobile 375px

| Before | After |
|---|---|
| No CTA on article card | **"Read Article →"** visible ✅ |
| Subtitle clips at right edge | Clip still present — needs DevTools investigation ⚠️ |

---

## Definition of Done — Status

| Requirement | Status |
|---|---|
| Homepage và Reddit Category — Header khớp nhau | ✅ Done — single `SiteHeader` component |
| Navigation khớp nhau | ✅ Done — 4 items on both pages |
| Article card có CTA | ✅ Done — "Read Article →" |
| Mobile `.cat-desc` overflow | ⚠️ Partially done — `overflow-wrap` added, root cause needs DevTools |
| Build pass | ✅ 848 pages, no errors |

---

## Remaining P1 Item

**Mobile subtitle overflow** — the body-level horizontal scroll at 375px needs investigation in a real browser DevTools. Likely caused by an element in the posts-grid pushing the layout wider than the viewport, which then affects the `.cat-desc` line-wrapping. Suggested next step: open `http://localhost:4321/reddit/` in Chrome DevTools at 375px → Inspect → find which element has `scrollWidth > clientWidth` on the `<body>`.
