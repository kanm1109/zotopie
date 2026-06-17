# Homepage vs Category Page — Visual Gap Report
**Task:** D-018R  
**Date:** 2026-06-15  
**Method:** Live browser screenshots (Chrome headless, 1440px desktop + 375px mobile) against `localhost:4321`  
**Pages compared:** `/` (Homepage) vs `/reddit/` (Category / Reddit page)

---

## Screenshots

| | Desktop 1440px | Mobile 375px |
|---|---|---|
| **Homepage** | `homepage-full.png` | `homepage-mobile.png` |
| **Reddit page** | `reddit-full.png` | `reddit-mobile.png` |

---

## Gap Analysis — 10 Points

---

### 1. Header

| | Homepage | Reddit page |
|---|---|---|
| **Current** | Inline `<header>` inside `MainLayout.astro` (own HTML, not a component) | `<SiteHeader />` component |
| **Expected** | Single shared component across all pages | — |
| **Root cause** | Two separate header implementations that look identical now but can drift |
| **Impact** | High — any future header change requires updating two places |
| **Complexity** | Low — extract MainLayout header into SiteHeader or replace MainLayout's inline header with `<SiteHeader />` |

---

### 2. Navigation

| | Homepage | Reddit page |
|---|---|---|
| **Current** | 4 items: Home · Best Tools · Categories · Reviews | 5 items: Home · Best Tools · Categories · Reviews · **Reddit** |
| **Expected** | Same 4 items on all pages — "Reddit" should not be a top-level nav item |
| **Impact** | High — inconsistent information architecture; "Reddit" in nav is a legacy category name, not a primary section |
| **Complexity** | Low — remove `<a href="/reddit/">Reddit</a>` from `SiteHeader.astro` (lines 22 and 50) and update mobile menu |

Screenshot evidence: Reddit desktop nav has 5 items, Homepage desktop nav has 4.

---

### 3. Search

| | Homepage | Reddit page |
|---|---|---|
| **Current** | Large centered hero search bar — 400px+, purple "Search" button, placeholder "Search 120+ software tools…", trust badges below | Header inline search only (200px pill) |
| **Expected** | Category pages should have a page-level search bar to enable tool discovery from content pages |
| **Impact** | Medium — lost conversion opportunity; users on category pages have no direct path to tool search |
| **Complexity** | Medium — add search bar block to CategoryLayout between header section and posts grid |

---

### 4. Container Width

| | Homepage | Reddit page |
|---|---|---|
| **Current** | `max-width: 1200px` (via `.page-wrapper` in MainLayout) | `max-width: 1200px; padding: 0 24px 80px` (via `.cat-main` in CategoryLayout) |
| **Expected** | Match — both use 1200px |
| **Impact** | None — **this point is consistent** ✓ |
| **Complexity** | N/A |

Container width is identical between the two pages. No gap here.

---

### 5. Typography

| | Homepage | Reddit page |
|---|---|---|
| **H1 Current** | `font-size: 3.5rem+, font-weight: 800` — mixed black/purple gradient ("Find The **Best Tools**") | `font-size: 2.4rem, font-weight: 800` — plain `var(--c-dark)`, `text-transform: capitalize` |
| **Section headings** | "Popular Tools", "Latest Articles" etc. at ~1.35rem, bold, with "See all →" links | None — no section headings on category page |
| **Subtitle** | Rich centered subheading with supporting text | Single-line gray description under h1, `max-width: 600px` |
| **Expected** | Category H1 is acceptable at its scale but needs a more distinct visual hierarchy |
| **Impact** | Low — category page typography is functional but visually lighter |
| **Complexity** | Low — minor styling adjustments |

Mobile issue: at 375px, the Reddit page subtitle ("Reddit marketing strategies, tips, and growth") clips on the right edge — the text overflows the viewport horizontally. Root cause: no `word-wrap: break-word` or `overflow-wrap` on `.cat-desc`.

---

### 6. Card Design

| | Homepage | Reddit page |
|---|---|---|
| **Component** | `ToolCard.astro` | `ArticleCard.astro` |
| **Homepage card** | Logo + Tool name + rating badge + category tag + description + **"Read Review →" CTA** |
| **Reddit card** | Purple category pill + date + title + description (3-line clamp) + hashtag tags — **no CTA** |
| **Featured card** | Not applicable (homepage has no "featured" concept) | First card gets `grid-column: 1/-1` (full width) + larger title (1.5rem) + more padding (28px) |
| **Expected** | Article cards should have an explicit "Read Article →" CTA link to match Homepage card pattern |
| **Impact** | Medium — no CTA reduces click-through intent signal |
| **Complexity** | Low — add CTA anchor to `.card-body` in `ArticleCard.astro` |

---

### 7. Section Spacing & Page Structure

| | Homepage | Reddit page |
|---|---|---|
| **Current** | 5+ distinct sections: Hero → Popular Tools → Latest Articles → Browse by Category → Expert Best-Of Guides → Footer. Each section has a header, "See all →" link, and structured grid | Single section: breadcrumb → h1 → description → HR divider → posts grid → footer |
| **Expected** | Category pages should have at minimum: (a) a richer category hero, (b) related sections or cross-links to comparable content |
| **Visual gap** | With only 1 article, the Reddit page has ~300px of empty white space between the article card and the footer (visible on 900px viewport) |
| **Impact** | High — page looks sparse and unfinished with few articles |
| **Complexity** | High — requires adding new content sections (e.g., "Related Tools", "Popular in this category") |

---

### 8. Footer

| | Homepage | Reddit page |
|---|---|---|
| **Current** | `<SiteFooter />` component | `<SiteFooter />` component |
| **Expected** | Match — both use the same component |
| **Impact** | None — **this point is consistent** ✓ |
| **Complexity** | N/A |

Footer is identical between both pages. No gap here.

---

### 9. CTA Style

| | Homepage | Reddit page |
|---|---|---|
| **Page-level CTAs** | "Search" button (purple, full), "See all 120+ reviews →", "View all articles →", "All guides →", "All 11 categories →" | None |
| **Card-level CTAs** | "Read Review →" link on each ToolCard | No explicit CTA — only clickable title |
| **Expected** | Each article card should have a "Read Article →" CTA. Category page should have at least one section-level CTA (e.g., "Browse all tools →") |
| **Impact** | Medium — no explicit action prompts; relies purely on title clicks |
| **Complexity** | Low for card CTA, Medium for section CTAs |

---

### 10. Responsive Behavior

| | Homepage 375px | Reddit 375px |
|---|---|---|
| **Nav** | Logo + search icon (hamburger visible, nav links hidden) ✓ | Same — consistent ✓ |
| **Hero/Header** | Hero search button clips slightly off right edge | Subtitle text clips off right edge — overflow bug |
| **Cards** | Single column grid ✓ | Single column grid ✓ |
| **Content** | Category pills wrap to multiple rows ✓ | Card is full-width ✓ |
| **Spacing** | Compact — no excess whitespace | Gap between card and footer is compact at mobile — acceptable |

**Mobile overflow bug (Reddit):** `.cat-desc` text overflows viewport at 375px. The `max-width: 600px` rule doesn't help at narrow widths — missing `overflow-wrap: break-word` or `word-break: break-word`.

---

## Summary Table

| Point | Gap? | Severity |
|---|---|---|
| 1. Header | ✗ Two separate implementations | High |
| 2. Navigation | ✗ "Reddit" extra item on category nav | High |
| 3. Search | ✗ No page-level search on category | Medium |
| 4. Container width | ✓ Match | — |
| 5. Typography | ✗ Minor — mobile clip on subtitle | Low |
| 6. Card design | ✗ No CTA on article cards | Medium |
| 7. Section spacing | ✗ Sparse with few articles, no multi-section structure | High |
| 8. Footer | ✓ Match | — |
| 9. CTA style | ✗ No CTAs on category page | Medium |
| 10. Responsive | ✗ Mobile subtitle overflow on Reddit page | Low |

---

## Migration Backlog

### P0 — Critical, fix first

**P0 · Unify header into single component**
- Current: `MainLayout.astro` has its own inline `<header>` HTML (lines 256–306). `SiteHeader.astro` is a separate component. Both look identical today but will drift.
- Fix: Replace the inline header in `MainLayout.astro` with `<SiteHeader />`.
- Files: `src/layouts/MainLayout.astro`, `src/components/SiteHeader.astro`

**P0 · Remove "Reddit" from SiteHeader nav**
- Current: `SiteHeader.astro` has `<a href="/reddit/">Reddit</a>` in both desktop nav (line 22) and mobile nav (line 50). Homepage does not have this item.
- Fix: Remove the Reddit link from both nav lists in `SiteHeader.astro`. Reddit is a content category, not a primary navigation destination.
- Files: `src/components/SiteHeader.astro`

**P0 · Add "Read Article →" CTA to ArticleCard**
- Current: `ArticleCard.astro` has no explicit CTA. The clickable element is only the `<h2>` title.
- Fix: Add `<a href={articleUrl} class="card-cta">Read Article →</a>` inside `.card-body` after `.card-tags`.
- Files: `src/components/ArticleCard.astro`

---

### P1 — Important, do after P0

**P1 · Fix mobile subtitle overflow on category pages**
- Current: `.cat-desc` in `CategoryLayout.astro` clips horizontally at 375px.
- Fix: Add `overflow-wrap: break-word; word-break: break-word;` to `.cat-desc` rule.
- Files: `src/layouts/CategoryLayout.astro`

**P1 · Add page-level search to category pages**
- Current: Category pages have no search affordance beyond the header pill input.
- Fix: Add a search bar block above or below the posts grid in `CategoryLayout.astro`, reusing the same search form pattern from the homepage hero.
- Files: `src/layouts/CategoryLayout.astro`

**P1 · Section-level CTA on category pages**
- Current: No "See all →" or equivalent CTA on category pages.
- Fix: Add a "Browse all tools in this category →" link below the posts grid, linking to the relevant `/category/{slug}/` or `/reviews/` page.
- Files: `src/layouts/CategoryLayout.astro`

---

### P2 — Nice to have

**P2 · Improve category hero section**
- Current: Breadcrumb + H1 + description + HR is minimal.
- Expected: Add a stat (e.g., article count), a category icon, or a subtle colored background strip to give the section more visual weight — matching the visual density of the homepage hero.
- Files: `src/layouts/CategoryLayout.astro`

**P2 · Empty / sparse state for few articles**
- Current: With 1 article, the page has ~300px of empty white space before the footer.
- Fix: Add a min-height on `.posts-grid` or add a supplementary "Related Tools" block that pulls tools from the same category — ensuring the page has content below the fold.
- Files: `src/layouts/CategoryLayout.astro`

---

## Known Limitations

- Screenshots taken via Chrome headless `--headless=new`. Fonts loaded from Google Fonts may not render identically without network access — fallback system fonts may be active.
- Only `/reddit/` was tested as the representative category page. Other category pages (`/threads/`, `/extensions/`, `/marketing/`) share the same `CategoryLayout.astro` and will have identical gaps.
- The homepage hero section (below the fold) was partially cut off in the 3000px tall screenshot. The Popular Tools and Browse by Category sections were visible; the Footer was not captured — however, the SiteFooter component is confirmed shared by reading source code.
- No JavaScript interactions were tested (sticky nav scroll behavior, search focus expansion, hamburger menu toggle).
