# Category Layout Migration Report — TASK D-010
**Date:** 2026-06-15

---

## Files Changed

| File | Change |
| --- | --- |
| `src/layouts/CategoryLayout.astro` | Replace Header→SiteHeader, Footer→SiteFooter; add Google Fonts; rewrite CSS to Gen 2 |
| `src/components/ArticleCard.astro` | CSS rewrite: Gen 1 → Gen 2 design (purple, border-based cards) |
| `src/components/Pagination.astro` | CSS rewrite: Gen 1 accent blue → Gen 2 purple |
| `src/components/Breadcrumb.astro` | Link color: `var(--accent)` blue → `#7C3AED` purple |
| `src/components/BaseHead.astro` | Added impact.com site verification meta tag |

---

## Components Replaced

### Header
| Before | After |
| --- | --- |
| `src/components/Header.astro` | `src/components/SiteHeader.astro` |
| Plain "Zotopie" text, accent blue, basic hamburger | Purple gradient logo, Plus Jakarta Sans, inline search, styled hamburger |

### Footer
| Before | After |
| --- | --- |
| `src/components/Footer.astro` | `src/components/SiteFooter.astro` |
| Dark bg, old category links, "All rights reserved" | Light bg, Explore+Compare columns, affiliate disclosure |

---

## Design System Changes Per File

### CategoryLayout.astro

| Property | Before | After |
| --- | --- | --- |
| Font | Atkinson Hyperlegible (via global.css) | Plus Jakarta Sans (Google Fonts) |
| Container padding | `2rem 1.5rem 4rem` | `0 24px 80px` (matches MainLayout) |
| Container max-width | `1200px` ✅ | `1200px` ✅ |
| H1 weight | not specified | `800` |
| H1 letter-spacing | none | `-0.5px` |
| Cat header | `margin-bottom: 2.5rem` only | `padding: 40px 0 32px` + `border-bottom` separator |
| Text color `.cat-desc` | `rgb(var(--gray))` (Gen 1) | `var(--c-gray)` = `#647488` (Gen 2) |
| Body base styles | from global.css | explicit: `font-family`, `color`, `background`, `antialiased` |
| 640px container padding | unchanged | `0 16px 64px` |
| Grid gap | `2rem` | `24px` |

### ArticleCard.astro

| Property | Before | After |
| --- | --- | --- |
| Card border | none (box-shadow only) | `1.5px solid #E8ECF0` |
| Card border-radius | `12px` | `14px` |
| Box shadow (default) | `var(--box-shadow)` (Gen 1 heavy blue) | none |
| Box shadow (hover) | multi-layer blue rgba | `0 6px 20px rgba(124,58,237,0.08)` |
| Hover border | — | `#C4B5FD` |
| Category tag bg | `var(--accent)` = `#2337ff` (blue) | `linear-gradient(135deg, #7C3AED, #6366F1)` (purple) |
| Title link color | `rgb(var(--black))` | `var(--c-dark)` = `#0F172A` |
| Title hover | `var(--accent)` blue | `var(--c-purple)` = `#7C3AED` |
| Description color | `rgb(var(--gray))` | `var(--c-gray)` = `#647488` |
| Tag color | `var(--accent)` blue | `var(--c-purple)` purple |
| Card padding | `1.25rem` | `20px` (featured: `28px`) |

### Pagination.astro

| Property | Before | After |
| --- | --- | --- |
| Border color | `rgb(var(--gray-light))` | `var(--c-border)` = `#E8ECF0` |
| Link border | `1px solid rgb(var(--gray-light))` | `1.5px solid var(--c-border)` |
| Link border-radius | `6px` | `8px` |
| Link color | `var(--accent)` blue | `var(--c-purple)` purple |
| Link hover bg | `var(--accent)` blue | `linear-gradient(135deg, #7C3AED, #6366F1)` |
| Font size | `0.9rem` | `0.875rem` |
| Font weight | not set | `600` |

### Breadcrumb.astro

| Property | Before | After |
| --- | --- | --- |
| Link color | `var(--accent)` = `#2337ff` blue | `#7C3AED` purple |
| Separator color | `rgb(var(--gray))` | `#9ca3af` |
| Current page color | `rgb(var(--gray))` | `#647488` |

### BaseHead.astro

Added after viewport meta:
```html
<meta name='impact-site-verification' value='5c335fea-1969-4d9a-b64f-1be8b20a77da' />
```
Now present on ALL pages using BaseHead (ArticleLayout, CategoryLayout, tags/[tag]).

---

## Affected Routes

All routes fixed by CategoryLayout migration:

| Route | Status |
| --- | --- |
| `/reddit` | ✅ Now uses SiteHeader + SiteFooter |
| `/reddit/page/[page]` | ✅ |
| `/blog` | ✅ |
| `/blog/page/[page]` | ✅ |
| `/threads` | ✅ |
| `/threads/page/[page]` | ✅ |
| `/extensions` | ✅ |
| `/extensions/page/[page]` | ✅ |
| `/marketing` | ✅ |
| `/marketing/page/[page]` | ✅ |

---

## Visual Consistency After Migration

| Element | Homepage | Category Pages (after) |
| --- | --- | --- |
| Header | Purple logo, Plus Jakarta Sans, search | ✅ Identical (SiteHeader) |
| Footer | Light bg, Explore/Compare cols, affiliate note | ✅ Identical (SiteFooter) |
| Font | Plus Jakarta Sans | ✅ Same |
| H1 style | 800 weight, -0.5px tracking | ✅ Same |
| Container | 1200px max, 24px padding | ✅ Same |
| Card borders | 1.5px #E8ECF0 | ✅ Same pattern |
| Accent color | #7C3AED purple | ✅ Same |
| Link hover | #7C3AED | ✅ Same |

---

## Known Issues

| Issue | Severity | Notes |
| --- | --- | --- |
| `ArticleCard` used `var(--box-shadow)` from global.css — now removed | None | New border-based card style is cleaner |
| `global.css` is still imported via BaseHead — Gen 1 CSS variables still exist in root | None | They are unused by updated components; no conflict |
| `Breadcrumb` also used by `ArticleLayout` — color change affects those pages | Positive | Links now purple everywhere — consistent |
| Featured card takes full grid width — first card is full-bleed | Intentional | Preserved from original layout |
| No `BlogPost.astro` migration yet | Low | Only used by `/about` — separate task |
| `tags/[tag].astro` still uses old `Header` + `Footer` | Low | Separate task per layout-migration-plan.md |

---

## Definition of Done — Status

| Criterion | Status |
| --- | --- |
| CategoryLayout uses SiteHeader | ✅ |
| CategoryLayout uses SiteFooter | ✅ |
| Reddit page visually matches Homepage | ✅ |
| Threads page visually matches Homepage | ✅ |
| Marketing page visually matches Homepage | ✅ |
| No layout regressions | ✅ |
| impact.com verification on all pages | ✅ (added to BaseHead) |

---

## Next Steps (per layout-migration-plan.md)

- **D-011:** Migrate `ArticleLayout.astro` footer: `Footer` → `SiteFooter`
- **D-012:** Migrate `tags/[tag].astro`: `Header`+`Footer` → `SiteHeader`+`SiteFooter`
- **D-013:** Migrate `about.astro`: `BlogPost` → `ArticleLayout`
- **D-014:** Delete Gen 1 components: `Header.astro`, `Footer.astro`, `BlogPost.astro`, `HeaderLink.astro`
