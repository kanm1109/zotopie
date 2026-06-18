# Mobile Responsiveness Audit Report
**Task:** D-006  
**Date:** 2026-06-15  
**Breakpoints tested:** 320px, 375px, 390px, 430px, 768px, 1024px

---

## Summary

| Severity | Count |
| --- | --- |
| Critical (causes horizontal scroll) | 2 |
| Medium (layout degraded) | 1 |
| Low (cosmetic) | 0 |
| Pass (no fix needed) | 11 |

---

## Audit Results

### 1. Article Layout — Prose Tables
| Field | Value |
| --- | --- |
| **Page** | All article pages (`/reddit/`, `/blog/`, `/threads/`, `/extensions/`, `/marketing/`) |
| **Element** | `table` inside `.prose` |
| **Issue** | No `overflow-x: auto` on table container. Multi-column tables (Brand24 pricing: 5 cols, comparison: 4 cols) overflow horizontally at 320–430px. `global.css` sets `table { width: 100%; }` with no scroll wrapper. |
| **Severity** | **CRITICAL** |
| **File** | `src/layouts/ArticleLayout.astro` |
| **Fix** | Add `display: block; overflow-x: auto; -webkit-overflow-scrolling: touch;` to `.prose table` |

---

### 2. Code Blocks (`pre`) — All Pages with Prose
| Field | Value |
| --- | --- |
| **Page** | Article pages (and any page using `global.css`) |
| **Element** | `pre` (code blocks) |
| **Issue** | `global.css` sets `pre { padding: 1.5em; }` with no `overflow-x: auto`. Long lines of code overflow the viewport on all mobile widths. |
| **Severity** | **CRITICAL** |
| **File** | `src/styles/global.css` |
| **Fix** | Add `overflow-x: auto; max-width: 100%;` to `pre` rule |

---

### 3. Review Page — Pricing Table at 320px
| Field | Value |
| --- | --- |
| **Page** | `/reviews/[slug]` |
| **Element** | `.pricing-table` |
| **Issue** | At `max-width: 640px`, media query forces `grid-template-columns: 1fr 1fr`. At 320px viewport, each column is ~138px — too narrow for pricing card content. Should collapse to single column at ≤400px. |
| **Severity** | **MEDIUM** |
| **File** | `src/pages/reviews/[slug].astro` |
| **Fix** | Add `@media (max-width: 400px) { .pricing-table { grid-template-columns: 1fr; } }` |

---

## Passing Elements (No Fix Required)

| Element | Page | Status |
| --- | --- | --- |
| Homepage grids (tools, cats, new) | `/` | ✅ All collapse to 1fr at 640px |
| Stats bar | `/` | ✅ Collapses to column at 640px |
| Hero search form | `/` | ✅ Full-width at 640px |
| Hero trust signals | `/` | ✅ `flex-wrap: wrap` handles 320px |
| Category chips | `/` | ✅ `flex-wrap: wrap` |
| Navigation / hamburger | All pages | ✅ Hamburger at 600px, search icon at 768px |
| Mobile menu | All pages | ✅ Full-width dropdown |
| Review pros/cons grid | `/reviews/[slug]` | ✅ 1fr at 640px |
| Review prev/next nav | `/reviews/[slug]` | ✅ 1fr at 640px |
| Sticky CTA | `/reviews/[slug]` | ✅ Price/rating hidden at 640px |
| Search results grid | `/search` | ✅ 1fr at 640px |
| AltCard component | Anywhere | ✅ 640px + 400px breakpoints |
| Images | All pages | ✅ `max-width: 100%; height: auto` in global.css |
| TOC | `/reviews/[slug]` | ✅ `overflow-x: auto` already set |

---

## Files to Modify

1. `src/styles/global.css` — Fix `pre` overflow
2. `src/layouts/ArticleLayout.astro` — Fix `.prose table` overflow
3. `src/pages/reviews/[slug].astro` — Fix `.pricing-table` at 320px
