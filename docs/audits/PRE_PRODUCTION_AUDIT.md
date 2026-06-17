# PRE-PRODUCTION AUDIT — Zotopie
**Date:** 2026-06-10  
**Scope:** Full project audit before Phase 2  
**Status:** Audit only — no fixes applied

---

## Summary Scorecard

| Area        | Issues | CRITICAL | HIGH | MEDIUM | LOW |
|-------------|--------|----------|------|--------|-----|
| UI          | 11     | 1        | 3    | 5      | 2   |
| Links       | 5      | 0        | 2    | 2      | 1   |
| SEO         | 10     | 2        | 4    | 3      | 1   |
| Data        | 8      | 1        | 2    | 3      | 2   |
| Performance | 5      | 0        | 3    | 1      | 1   |
| **Total**   | **39** | **4**    | **14**| **14** | **7** |

---

## 1. UI AUDIT

### 1.1 Compare Page — Class Binding Bug
**Priority: CRITICAL**  
**File:** `src/pages/compare/[pair].astro:121, 136`

Astro does not evaluate template literals inside the `class` attribute when mixed with expressions:

```astro
<!-- BUG: Evaluates to literal string, not conditional class -->
<a href={...} class="cmp-head {isAWinner ? 'cmp-head--winner' : ''}">
```

The `cmp-head--winner` class is never applied. The winner card does not get the blue highlight border or blue background. The `winner-badge` still renders (it's inside a conditional block) but the card styling does not differentiate winner from loser. All 321 compare pages are affected.

**Correct syntax:**
```astro
<a href={...} class:list={["cmp-head", { "cmp-head--winner": isAWinner }]}>
```

---

### 1.2 Reviews Listing — Fully Client-Side Rendered
**Priority: HIGH**  
**File:** `src/pages/reviews/index.astro`

The tool grid (`#rv-grid`) and pagination are rendered entirely by JavaScript after page load. The server-rendered HTML contains only the filter bar and an empty `<div id="rv-grid">`. Crawlers that do not execute JavaScript see zero tool cards.

- No SSR content for the 119 tools listed
- `rel=prev/rel=next` added by JS — crawlers may miss pagination signals
- Canonical URL updated by JS — server-rendered canonical always points to `/reviews/`

---

### 1.3 Search Page — Fully Client-Side Rendered
**Priority: HIGH**  
**File:** `src/pages/search.astro`

Same issue as Reviews. The `#results` div starts empty. Crawlers see only the search input and category chips. Search results are not indexable, but more critically:

- `autofocus` on the search `<input>` forces the mobile keyboard to open immediately on page load — very disruptive UX on phones

---

### 1.4 Homepage CTA Section — Negative Margin Overflow
**Priority: MEDIUM**  
**File:** `src/pages/index.astro:215`

```css
.cta-section {
  margin: 0 -24px;  /* breaks out of .page-wrapper padding */
}
```

This negative margin hack can cause a horizontal scrollbar or clipped content on mobile viewports where the container has no overflow protection. The `.page-wrapper` does not have `overflow: hidden`.

---

### 1.5 Category Detail — Two "How to Choose" Sections
**Priority: MEDIUM**  
**File:** `src/pages/category/[slug].astro:262, 381`

There are two "How to Choose" sections on every category detail page:

1. **Generated Buying Guide** (lines 262–378): Auto-generated from tool data, titled "How to Choose the Right {category} Tool"
2. **category-content.json "how_to_choose"** (lines 381–398): Content from JSON file, titled "How to Choose the Best {category} Tool"

Both sections appear on the same page with near-identical titles. For categories that have `category-content.json` data, users see duplicate guidance.

---

### 1.6 Category Intro — querySelector Is Fragile
**Priority: MEDIUM**  
**File:** `src/pages/category/[slug].astro:920`

```js
const inner = document.querySelector('.intro-inner');
```

This selector matches the first `.intro-inner` on the page. If any component ever adds a `.intro-inner` class elsewhere, this breaks silently. Should use `document.getElementById()`.

---

### 1.7 Review Detail — Hardcoded Year in Title
**Priority: MEDIUM**  
**File:** `src/pages/reviews/[slug].astro:48`

```js
const pageTitle = `${tool.name} Review 2026: Pricing, Pros & Cons | Zotopie`;
```

"2026" is hardcoded. All 119 review pages will have stale titles after December 2026 without a rebuild.

---

### 1.8 Review Detail — Section Ordering
**Priority: MEDIUM**  
**File:** `src/pages/reviews/[slug].astro`

Section order for most tools (97/119 with no keyFeatures, pricingBreakdown, verdict):

1. Overview → 2. Pros & Cons → 3. Best For → 4. Related Tools → 5. (empty) → 6. Alternatives → 7. Prev/Next

The "Related Tools" block appears mid-page, separating "Best For" from the "Alternatives" section. For 116 tools where these sections are the only content, this creates a visually disconnected flow.

---

### 1.9 Navigation — Incomplete Links
**Priority: MEDIUM**  
**File:** `src/layouts/MainLayout.astro:104`

Nav only shows: Home, Categories, Reviews, Search.  
Missing: Alternatives, Compare, About — users have no way to discover these sections without direct URLs.

---

### 1.10 Orphan Pages — Not in Nav or Site Structure
**Priority: LOW**  
**Files:** `src/pages/about.astro`, `src/pages/tools.astro`, `src/pages/stats.astro`

These pages exist but are not linked from navigation, footer, or any other page. They are reachable only by direct URL.

---

### 1.11 Mobile — Search Autofocus
**Priority: LOW**  
**File:** `src/pages/search.astro:74`

```html
<input ... autofocus />
```

On iOS and Android, `autofocus` immediately opens the virtual keyboard on page load, pushing the entire page up and hiding the category chips and context. This creates a jarring UX entry for mobile users navigating to the search page.

---

## 2. LINK AUDIT

### 2.1 `/alternatives/` — Dead Route in Breadcrumb
**Priority: HIGH**  
**File:** `src/pages/alternatives/[slug].astro:74`

```astro
<a href="/alternatives/">Alternatives</a>
```

No `src/pages/alternatives/index.astro` exists. Clicking this breadcrumb link returns a 404. Every one of the 119 alternatives pages has this broken breadcrumb.

---

### 2.2 `/compare/` — Dead Route in Breadcrumb
**Priority: HIGH**  
**File:** `src/pages/compare/[pair].astro:112`

```astro
<a href="/compare">Compare</a>
```

No `src/pages/compare/index.astro` exists. Every one of the 321 compare pages has a broken breadcrumb link.

---

### 2.3 Alternative Slug — `tailwind` Unverified
**Priority: MEDIUM**

`planoly.alternatives` includes `tailwind`. This slug does not appear in the main 100 tools, and the 19 placeholder tools added in C24-B do not include it. If `tailwind` is not in `tools-enriched.json`, the alternatives section on the Planoly review page will silently render with fewer cards (no error, just missing card).

**Action:** Verify `tailwind` exists as a tool slug, or replace with a valid slug.

---

### 2.4 Go Pages — No noindex Propagation
**Priority: MEDIUM**  
**File:** `src/pages/go/[slug].astro:22`

```html
<meta name="robots" content="noindex, nofollow" />
```

This is correctly set. However, the sitemap config explicitly filters `/go/` pages:
```js
filter: (page) => !page.includes('/go/')
```
This is correct — but `/go/` pages have no canonical pointing to their parent review page, so if a crawler does index them, there's no signal to consolidate to the review page.

---

### 2.5 Blog/Reddit/Threads/Extensions/Marketing Pages — Isolated
**Priority: LOW**  
**Files:** `src/pages/blog/`, `src/pages/reddit/`, `src/pages/threads/`, `src/pages/extensions/`, `src/pages/marketing/`

These content sections exist with full pagination (`/page/[page].astro`) but are completely absent from the main navigation. No cross-links from tool review pages to related blog content.

---

## 3. SEO AUDIT

### 3.1 No `robots.txt`
**Priority: CRITICAL**

No `robots.txt` file exists in the `public/` directory. Without it:
- Crawlers assume all pages are allowed (default behavior is fine)
- Cannot block `/go/` redirect pages from crawlers that ignore `noindex`
- Cannot set a sitemap pointer for crawlers that look for robots.txt

---

### 3.2 No `og:image` on Review/Category/Search Pages
**Priority: CRITICAL**  
**File:** `src/layouts/MainLayout.astro`

`MainLayout.astro` (used by all tool review, category, search, and alternatives pages) does NOT include an `og:image` meta tag. When shared on social media (Twitter, LinkedIn, Facebook), these pages show no preview image — just title and description. This significantly reduces click-through rates from social shares.

`BaseHead.astro` (used only by blog/article pages) correctly includes:
```html
<meta property="og:image" content={imageUrl} />
<meta name="twitter:card" content="summary_large_image" />
```

But `MainLayout.astro` only has:
```html
<meta name="twitter:card" content="summary" />
```

---

### 3.3 Two Parallel `<head>` Implementations
**Priority: HIGH**  
**Files:** `src/layouts/MainLayout.astro`, `src/components/BaseHead.astro`

Two completely separate head components exist with divergent capabilities:

| Feature | `MainLayout` | `BaseHead` |
|---|---|---|
| og:image | ✗ Missing | ✓ Present |
| twitter:card | `summary` | `summary_large_image` |
| Favicon | ✗ Missing | ✓ Present |
| Sitemap link | ✗ Missing | ✓ Present |
| JSON-LD | ✗ Missing | ✓ Article/Breadcrumb |
| Custom font | ✗ Arial fallback | ✓ Atkinson via Font component |
| Google verification | ✗ Missing | ✓ Present |

The main tool review site (all pages using `MainLayout`) is missing favicon, sitemap link, og:image, and the custom Atkinson font. `BaseHead.astro` is unused by the tool review section.

---

### 3.4 `ratingCount: "1"` in JSON-LD
**Priority: HIGH**  
**File:** `src/pages/reviews/[slug].astro:116` and `src/pages/category/[slug].astro:114`

```js
ratingCount: "1"
```

Google's Rich Results guidelines require `ratingCount` to reflect the actual number of reviews. Hardcoding `"1"` for all 119 tools is technically valid but will:
1. Look suspicious in Google Search Console validation
2. Potentially suppress rich snippet display if Google deems the count implausible
3. Fail Rich Results Test for aggregateRating on tools that show ratings in SERPs

---

### 3.5 Missing Favicon Files
**Priority: HIGH**  
**File:** `src/components/BaseHead.astro:83`

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" href="/favicon.ico" />
```

The `public/` directory is empty — no favicon files exist. Browser tabs will show a blank favicon. Since `MainLayout` doesn't reference `BaseHead`, even pages using `BaseHead` depend on missing files.

---

### 3.6 Sitemap — `lastmod` Set to Build Date for All Pages
**Priority: MEDIUM**  
**File:** `astro.config.mjs:11`

```js
sitemap({ lastmod: new Date(), ... })
```

Every page in the sitemap gets today's date as `lastmod`, regardless of when content was last changed. This misrepresents the actual modification frequency to crawlers and can cause unnecessary re-crawling of pages that haven't changed.

---

### 3.7 Review Title — Hardcoded "2026" in Meta
**Priority: MEDIUM**  
**File:** `src/pages/reviews/[slug].astro:48–49`

Both `pageTitle` and `pageDesc` hardcode "2026":
```js
const pageTitle = `${tool.name} Review 2026: Pricing, Pros & Cons | Zotopie`;
const pageDesc  = `${tool.name} review 2026: ...`;
```

The JSON-LD `datePublished` correctly uses `tool.addedDate`, but the page title will become stale in 2027.

---

### 3.8 Category Pages — No `dateModified` in Schema
**Priority: MEDIUM**  
**File:** `src/pages/category/[slug].astro:76`

The `CollectionPage` JSON-LD schema does not include `dateModified`. When new tools are added to a category, Google has no signal that the page has been updated.

---

### 3.9 Search Page — No Indexable Content
**Priority: MEDIUM**  
**File:** `src/pages/search.astro`

The Search page has correct JSON-LD (`WebSite` with `SearchAction`) but the `SearchAction.urlTemplate` is:
```
https://zotopie.com/search?q={search_term_string}
```
Since search is client-side, `?q=` URLs are not static pages and return the same empty shell. Google Sitelinks Search Box relies on this being functional — it will return no results for crawlers.

---

### 3.10 `SITE_DESCRIPTION` in `consts.ts` — Incorrect
**Priority: LOW**  
**File:** `src/consts.ts:2`

```ts
export const SITE_DESCRIPTION =
  'Software reviews and digital marketing insights. Find the best tools, strategies, and guides for Reddit, Threads, browser extensions, and more.';
```

This description references "Reddit, Threads, browser extensions" — a legacy description from before the site pivoted to software tool reviews. Used in any page that imports from `consts.ts`.

---

## 4. DATA AUDIT

### 4.1 97/119 Tools Have Boilerplate Overviews
**Priority: CRITICAL**  
**Source:** `src/data/overviews.json`

All 100 original tools have overviews in `overviews.json`. 97 of these are identical boilerplate templates:

> *"[Tool] is a software platform used primarily in the [category] category. According to its official website and product documentation, the platform is designed to help users accomplish specific workflows more efficiently..."*

This content:
- Provides zero unique value to users
- Signals low-quality thin content to Google
- Will trigger duplicate content penalties across 97 review pages (text pattern is nearly identical)
- Is now prioritized LOWER than `tools.json` (after C24-C fix), but the `overviews.json` boilerplate still renders for any tool without a real `tools.json` overview

Only 3 tools (Ahrefs, Buffer, Zapier) have real, unique overviews.

---

### 4.2 97/119 Tools Have Boilerplate Pros & Cons
**Priority: HIGH**  
**Source:** `src/data/pros-cons.json`

Same boilerplate issue as overviews. All 97 non-featured tools have identical generic pros/cons:

**Pros (identical for all 97):**
- "Comprehensive feature set for its primary use case"
- "Integrates with commonly used third-party tools and services"
- "Documentation and learning resources are widely available"
- "Suitable for both individual users and growing teams"
- "Regular product updates and active development"

**Cons (identical for all 97):**
- "Advanced functionality may require a learning curve"
- "Some features are limited to higher-priced plans"
- "Costs can increase as usage, users, or data volume grows"
- "Configuration and setup may take time for new users"
- "May include more functionality than needed for simple use cases"

These same 5 pros and 5 cons appear verbatim across 97 review pages. This is a major content quality and SEO issue.

---

### 4.3 96/119 Tools Missing Logo (Simple Icon)
**Priority: HIGH**

Only 23 tools have a `simple_icon` mapping in `logo-mapping.json`. The remaining 96 tools display a colored initials fallback. While functional, the visual quality is significantly lower.

Tools with logos: Notion, ClickUp, Obsidian, Trello, Airtable, Buffer, Hootsuite, Claude (Anthropic), Semrush, ConvertKit (Kit), Discord, Circle, Zapier, Make, n8n, Google Analytics, Mixpanel, Plausible Analytics, Bitly, Cloudflare, DigitalOcean, Shopify, Gumroad.

---

### 4.4 116/119 Tools Missing `startingPrice`
**Priority: MEDIUM**

Only 3 tools have a `startingPrice` value (Ahrefs: `$129/mo`, Buffer: `$0/mo`, Zapier: `$0/mo`). All other 116 tools show only the pricing model (Free/Freemium/Paid) with no specific price.

Impact:
- Review summary card shows "Starting Price" row only for 3 tools
- JSON-LD `Offer.price` field falls back to `null` for most tools
- Buying guide price range calculations produce no results for most categories
- Sticky CTA shows no price for 116 tools

---

### 4.5 118/119 Tools Missing `keyFeatures`
**Priority: MEDIUM**

Only Ahrefs has a full `keyFeatures` array. The Key Features section is completely absent from 118 review pages. This removes a high-value conversion and SEO section from almost all pages.

---

### 4.6 118/119 Tools Missing `pricingBreakdown`
**Priority: MEDIUM**

Only Ahrefs has `pricingBreakdown`. Pricing breakdown tables are absent from 118 review pages.

---

### 4.7 118/119 Tools Missing `verdict`
**Priority: LOW**

Only Ahrefs has a `verdict`. The "Final Verdict" section is absent from 118 review pages. This is the strongest conversion section of a review page.

---

### 4.8 `tailwind` Slug in Planoly Alternatives — Unverified
**Priority: LOW**  
**Source:** `src/data/alternatives.json` (planoly entry)

See Link Audit item 2.3. The `tailwind` slug should be verified against `tools-enriched.json`.

---

## 5. PERFORMANCE AUDIT

### 5.1 Full Dataset Inlined in Two Pages
**Priority: HIGH**  
**Files:** `src/pages/reviews/index.astro:7–9`, `src/pages/search.astro:7–9`

Both the Reviews listing and Search pages serialize and inline the entire `tools-enriched.json` (119 tools × full record) plus `icon-data.json` directly into the HTML as JavaScript variables:

```js
const toolsData      = JSON.stringify(tools);    // ~350KB raw
const taxonomiesData = JSON.stringify(taxonomies);
const iconDataStr    = JSON.stringify(iconData);
```

This results in:
- **Reviews page HTML weight:** Estimated 400–500KB before compression (gzip reduces ~5-10x)
- **Search page HTML weight:** Same inline payload
- First Contentful Paint delayed by script parse time
- Both pages must download and parse the full dataset before rendering any tool cards

This architecture is inherently problematic for performance and should be replaced with a JSON endpoint + client fetch, or SSR pagination.

---

### 5.2 Custom Font Not Used on Tool Review Pages
**Priority: HIGH**  
**File:** `src/layouts/MainLayout.astro:28`

```css
font-family: Arial, sans-serif;
```

The project loads the Atkinson Hyperlegible font via `astro.config.mjs` (as `fontProviders.local()`), and `BaseHead.astro` uses `<Font cssVariable="--font-atkinson" preload />`. However, `MainLayout.astro` (used by all tool review pages) hardcodes `Arial` and never loads or applies the Atkinson font.

Result: Tool review pages (the core of the site) use Arial. Blog/article pages use Atkinson. The designed typography is applied to the wrong set of pages.

---

### 5.3 Duplicate Icon Rendering Logic
**Priority: HIGH**  
**Files:** `src/pages/reviews/index.astro:99–108`, `src/pages/search.astro:106–114`

Both pages implement their own `logoHtml()` function in inline `<script>` blocks, duplicating the logic from `src/components/ToolLogo.astro`. Three separate implementations of the same logic exist. Any future icon system change requires updating three files.

---

### 5.4 No `<Image>` Component Usage
**Priority: MEDIUM**

No pages use Astro's built-in `<Image>` component from `astro:assets`. All images are SVG-based (tool logos) or not present. While the current SVG-only approach has no image performance issues, the infrastructure for future JPEG/PNG image optimization is not established.

---

### 5.5 IntersectionObserver — Fallback Not Handled
**Priority: LOW**  
**File:** `src/pages/reviews/[slug].astro:432`

```js
const cta    = document.getElementById('sticky-cta');
const anchor = document.querySelector('.summary-card');
if (cta && anchor) {
  new IntersectionObserver(...)
```

The null check is present. However, if JavaScript fails entirely, `#sticky-cta` remains hidden (`transform: translateY(100%)`) permanently — the CTA is never accessible without JS. For users with JS disabled, the "Visit {tool}" button in the sticky bar is invisible. The button also appears in the summary-card, so this is acceptable, but worth noting.

---

## Appendix: Page Count

| Route Pattern | Count |
|---|---|
| `/reviews/[slug]` | 119 |
| `/category/[slug]` | 11 |
| `/alternatives/[slug]` | 119 |
| `/compare/[pair]` | ~321 |
| Static pages (home, category index, reviews index, search, about, etc.) | ~10 |
| `/go/[slug]` (redirect, noindex) | 119 |
| **Total indexed pages (approx)** | **~580** |

---

## Priority Action List

### CRITICAL — Must fix before Phase 2
1. **Compare page class binding bug** — winner highlight broken on all 321 compare pages
2. **No robots.txt** — missing crawl control file
3. **No og:image** — all review/category pages share with no image
4. **Boilerplate overviews on 97 tools** — thin content SEO risk

### HIGH — Fix in Phase 2 sprint 1
5. Unify `<head>` — consolidate `MainLayout` and `BaseHead` into one implementation
6. Add `/alternatives/index.astro` — fix dead breadcrumb on 119 pages
7. Add `/compare/index.astro` — fix dead breadcrumb on 321 pages
8. Fix `ratingCount` — use realistic value or remove from JSON-LD
9. Write real pros/cons for 97 tools (same issue as #4)
10. Expand logo coverage — add simple_icon for 96 missing tools
11. Apply custom Atkinson font in MainLayout
12. Reviews listing + Search: move tool data to static JSON endpoint

### MEDIUM — Phase 2 sprint 2
13. Add favicon (`/public/favicon.svg` and `/public/favicon.ico`)
14. Fix sitemap `lastmod` per-page
15. Add startingPrice for key tools (at minimum the 20 most popular)
16. Remove duplicate "How to Choose" section on category pages
17. Fix `SITE_DESCRIPTION` in `consts.ts`
18. Add `og:image` template (at minimum a branded fallback)
19. Fix `autofocus` on search input (remove or use `requestAnimationFrame`)
20. Add nav links for Alternatives and Compare
21. Verify `tailwind` slug in Planoly alternatives

### LOW — Backlog
22. Internationalize "2026" year in review titles (`new Date().getFullYear()`)
23. Add `verdict`, `keyFeatures`, `pricingBreakdown` for top 20 tools
24. Link orphan pages (about, tools, stats) from footer
25. Refactor duplicate `logoHtml()` logic into shared script module
26. Add `prev/next` logic by rating or alphabetical (not array position)
27. Add `dateModified` to category JSON-LD schema
