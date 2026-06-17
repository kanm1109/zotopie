# Article Layout Migration Report — TASK D-011
**Date:** 2026-06-15

---

## Files Changed

| File | Change |
| --- | --- |
| `src/layouts/ArticleLayout.astro` | Replace Footer→SiteFooter; CSS Gen 1→Gen 2 |

No other files changed — `SiteHeader` was already in use. `BaseHead` already received impact.com tag in D-010.

---

## Components Replaced

### Footer
| Before | After |
| --- | --- |
| `src/components/Footer.astro` | `src/components/SiteFooter.astro` |
| Dark background, "Software reviews and digital marketing insights" | Light bg (#FAFBFC), Explore + Compare columns, affiliate disclosure |
| Old category list links | `/reviews`, `/best/`, `/category`, `/search` links |
| "All rights reserved" | "Find the best software tools" + affiliate disclosure |

---

## CSS Changes Detail

| Property | Before | After |
| --- | --- | --- |
| Body font | `'Plus Jakarta Sans', ...` string literal | `var(--font-sans)` |
| Body color | not set (fell through to global.css default) | `var(--c-dark)` = `#0F172A` |
| Body antialiasing | not set | `-webkit-font-smoothing: antialiased` |
| `.tag` color | `var(--accent)` = `#2337ff` (Gen 1 blue) | `var(--c-purple)` = `#7C3AED` |
| `.tag` font-weight | not set | `500` |
| `h1` font-weight | not set (inherited) | `800` |
| `h1` letter-spacing | none | `-0.5px` |
| `h1` color | not set (inherited) | `var(--c-dark)` |
| `.meta` color | `rgb(var(--gray))` (Gen 1) | `var(--c-gray)` = `#647488` |
| `.meta` font-size | `0.9rem` | `0.875rem` |
| `.dot` color | `rgb(var(--gray))` (Gen 1) | `var(--c-gray)` |
| `.footer-tags` border | `rgb(var(--gray-light))` (Gen 1) | `var(--c-border)` = `#E8ECF0` |
| `.footer-tags` font-size | `0.9rem` | `0.875rem` |
| `.footer-tags .tag` color | `var(--accent)` (inherited, Gen 1) | `var(--c-purple)` (explicit) |
| `.article-wrap` side padding | `1rem` | `1.5rem` |
| 400px breakpoint | missing | added: `h1 { font-size: 1.5rem }` |

---

## What Was NOT Changed

| Element | Status | Reason |
| --- | --- | --- |
| `SiteHeader` | ✅ already correct | Was migrated in previous session |
| Google Fonts link | ✅ already present | Was added in previous session |
| `.article-wrap` max-width 780px | ✅ kept | Correct reading width for articles — intentionally narrower than 1200px |
| `.prose table` scoped rule | ✅ removed (was wrong) | Astro scoped styles don't reach `<slot />` content — rule lives in `global.css` |
| Article content, frontmatter, URLs | ✅ untouched | Per task restrictions |

---

## Affected Routes

All routes using `ArticleLayout.astro`:

| Route Pattern | Status |
| --- | --- |
| `/reddit/[...slug]` | ✅ SiteFooter |
| `/blog/[...slug]` | ✅ SiteFooter |
| `/threads/[...slug]` | ✅ SiteFooter |
| `/extensions/[...slug]` | ✅ SiteFooter |
| `/marketing/[...slug]` | ✅ SiteFooter |

---

## Visual Consistency After Migration

| Element | Homepage | Article Pages (after) |
| --- | --- | --- |
| Header | SiteHeader | ✅ Identical |
| Footer | SiteFooter (inline in MainLayout) | ✅ Identical (SiteFooter component) |
| Font | Plus Jakarta Sans 800 | ✅ Same |
| H1 weight/tracking | 800, -0.5px | ✅ Same |
| Link/accent color | #7C3AED purple | ✅ Same |
| Footer border color | #E8ECF0 | ✅ Same |
| Body text color | #0F172A | ✅ Same |
| Muted text color | #647488 | ✅ Same |

---

## Verification Pages

### `/reddit/brand24-review`
- Header: SiteHeader ✅
- Footer: SiteFooter ✅
- H1: "Brand24 Review (2026): A Deep Dive..." — 800 weight, -0.5px tracking
- Tags: purple (#7C3AED)
- Meta (author, date): #647488 muted
- Tables: scroll horizontally (from global.css fix)
- Images: responsive (from global.css)

### Additional article pages (any `/blog/`, `/threads/`, `/marketing/`, `/extensions/` slug)
- All share the same ArticleLayout → same results

---

## Known Issues

| Issue | Severity | Notes |
| --- | --- | --- |
| `global.css` still loads via BaseHead — Gen 1 CSS variables still in `:root` | None | They're unused in updated components; no conflict |
| Article prose inherits `body` font from global.css which sets `var(--font-atkinson)` — then ArticleLayout's body rule overrides with `var(--font-sans)` | None | Override happens correctly; article body renders in Plus Jakarta Sans |
| `BlogPost.astro` still uses old Header + Footer | Low | Only `/about` — separate task (D-013) |
| `tags/[tag].astro` still uses old Header + Footer | Low | Separate task (D-012) |

---

## Definition of Done — Status

| Criterion | Status |
| --- | --- |
| ArticleLayout uses SiteFooter | ✅ |
| Brand24 Review visually matches Homepage | ✅ |
| No Gen 1 footer on article pages | ✅ |
| No layout regressions | ✅ |
| Ready for production verification | ✅ |

---

## Remaining Migration Tasks

Per `layout-migration-plan.md`:

| Task | File | Status |
| --- | --- | --- |
| D-009 | Create SiteFooter.astro | ✅ Done |
| D-010 | Migrate CategoryLayout | ✅ Done |
| D-011 | Migrate ArticleLayout | ✅ Done |
| D-012 | Migrate tags/[tag].astro | ⏳ Pending |
| D-013 | Migrate about.astro | ⏳ Pending |
| D-014 | Delete Gen 1 components | ⏳ Pending (after D-012, D-013) |
