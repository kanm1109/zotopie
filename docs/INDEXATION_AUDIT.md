# T1-INDEXATION-AUDIT — Technical SEO Report

**Date:** 2026-06-13  
**Analyst role:** Technical SEO Analyst  
**Site:** zotopie.com  
**Build:** 860 pages total

---

## 1. Current Indexation State (Estimated)

> **Note:** Direct Google Search Console access is unavailable. This audit is derived from static analysis of the sitemap, robots.txt, page structure, internal linking graph, and crawl depth — combined with known Google indexation patterns for new sites in this content category.

### Site Age Context
The site launched in June 2026. Google typically takes **3-6 months** to complete initial indexation of a new domain and 6-12 months to assign meaningful authority scores. Indexation issues at this stage are normal and expected — but technical gaps compound over time.

### Estimated Indexation State by Section

| Section | Pages in Sitemap | Est. Indexed | Est. Excluded/Pending | Risk Level |
|---|---|---|---|---|
| `/best/` authority pages | 21 | 5–12 | 8–15 | **Medium** |
| `/reviews/` tool pages | 120 | 40–80 | 40–80 | Low |
| `/alternatives/` pages | 119 | 30–70 | 49–89 | Low |
| `/compare/` pages | 440 | 30–150 | 290–410 | **High** |
| `/category/` pages | 12 | 8–12 | 0–4 | Low |
| `/tags/` pages | 13 | 5–10 | 3–8 | Medium |
| `/` + misc | 15 | 10–14 | 1–5 | Low |
| **Total** | **740** | **~130–350** | **~390–610** | — |

**Key insight:** Most "Excluded" pages for a new site fall into "Discovered - currently not indexed" or "Crawled - currently not indexed" — not hard errors. Google is actively evaluating these pages; indexation will increase naturally over 3-6 months if technical issues are resolved.

---

## 2. Issues Identified

### CRITICAL — Priority 0.5 on /best/ Pages

**File:** `astro.config.mjs` — sitemap serializer

The `/best/` authority pages fall into the default `priority: 0.5` branch because no specific rule exists for `/best/` URLs. This puts them at the same priority as random "other" pages (`/about/`, `/tools/`, `/stats/`), significantly below `/reviews/` (0.8) and even `/alternatives/` (0.7).

```
Current priority map:
  /               → 1.0  ✓
  /reviews/       → 0.9  ✓
  /category/*     → 0.9  ✓
  /reviews/*      → 0.8  ✓
  /alternatives/* → 0.7  ✓
  /compare/*      → 0.7  ✓
  /best/*         → 0.5  ✗ ← WRONG (defaults to catch-all)
  /best/          → 0.5  ✗ ← WRONG
  /search         → 0.5  (should be lower or noindex)
```

**Impact:** Googlebot uses sitemap priority as a relative crawl hint. Assigning 0.5 to your highest-value editorial pages signals they are less important than category pages. Combined with being a new site, this delays crawl and indexation of the pages most likely to drive organic revenue.

**Fix:** Add a `/best/` rule in `astro.config.mjs` before the default return:
```js
if (url.includes('/best/')) {
  return { ...item, changefreq: 'weekly', priority: 0.9 };
}
```

**Effort:** 2 minutes. **Impact:** High.

---

### HIGH — 440 Compare Pages Thin Content Risk

**Path:** `/compare/[pair].astro`

440 compare pages all use an identical template structure. While the content is personalized per tool pair (different names, ratings, pricing, pros/cons), Google identifies template-heavy pages as potentially low-value when:
- The domain is new and has low authority
- The content depth is similar across hundreds of pages
- Pages receive few or no inbound links

**Predicted GSC state:** Most compare pages will appear as "Discovered - currently not indexed" or "Crawled - currently not indexed" for the first 6-12 months. Google will index the top ~50-100 most internally-linked compare pairs first.

**Immediate actions:**
1. Ensure compare pages for **high-value pairs** (Zapier vs Make, Notion vs ClickUp, Beehiiv vs ConvertKit) are linked from relevant `/best/` pages. The `[slug].astro` auto-generates compare pills between top 3 tools — verify these are rendering correctly.
2. Do not add a `noindex` to compare pages — they are valid content that will index over time as the domain gains authority.

**Wait-and-observe:** Check GSC "Pages" → "Not indexed" at 90 days. If >300 compare pages remain in "Crawled - not indexed" at that point, consider consolidating lowest-value pairs.

---

### HIGH — /best/ Pages Receive No Internal Links from Reviews or Alternatives

**Affected files:**
- `src/pages/reviews/[slug].astro` — 0 links to any `/best/` page
- `src/pages/alternatives/[slug].astro` — 0 links to any `/best/` page

The 119 review pages and 119 alternatives pages are the most crawled and internally-linked pages on the site. None of them link to the `/best/` authority pages.

**Current internal link flow to /best/:**
```
Homepage hero section → 6 best pages     (6 links)
Nav "Best Tools"      → /best/ index     (sitewide, 1 link rendered per page)
/best/ index          → 20 best pages    (20 links)
/best/[slug] pages    → each other       (minimal)
```

**Missing link flows:**
- `reviews/beehiiv` → should link to `/best/newsletter-platforms/` and `/best/free-email-marketing-tools/`
- `reviews/notion` → should link to `/best/productivity-tools/` and `/best/tools-for-solopreneurs/`
- `alternatives/zapier` → should link to `/best/workflow-automation-tools/`

**Fix:** Add a "Best Guides for this Tool" sidebar or footer section in `reviews/[slug].astro` that cross-references relevant `/best/` pages using each tool's `categories` array to match against `best-pages.json`'s `categorySlug`. This is a medium-effort improvement (see Priority Actions below).

---

### MEDIUM — Homepage Exposes Only 6 of 20 Best Pages

**File:** `src/pages/index.astro` — "Expert Best-Of Guides" section

```js
bestPages.slice(0, 6).map((page) => ...)
```

14 of 20 authority pages have no direct homepage exposure. Homepage PageRank is the highest on the site — pages not linked from the homepage receive significantly less crawl priority and link equity.

**Fix options (choose one):**
1. Show all 20 cards in a 4×5 grid (simple, low impact on design)
2. Show top 6 by estimated search volume (editorial judgment call)
3. Add a second "More Guides →" row showing 6 more + link to /best/ index

**Recommendation:** Option 3 — show 12 cards (2 rows of 6) and add a "See all 20 guides →" link.

---

### MEDIUM — /search Static Page Should Be Noindex

**File:** `src/pages/search.astro`  
**Sitemap:** Listed with priority 0.5, changefreq: monthly

The `/search` page is a user interface (search box) with no meaningful content for Google to index. It provides zero value in search results and consumes crawl budget.

**robots.txt currently disallows:** `/search?*` (query string variants) ✓  
**robots.txt currently allows:** `/search` (the bare page) ✗

**Fix:** Add `<meta name="robots" content="noindex, follow" />` to `src/pages/search.astro`, and update the sitemap filter to exclude `/search` entirely:
```js
filter: (page) => !page.includes('?') && !page.includes('/go/') && !page.endsWith('/search/') && page !== 'https://zotopie.com/search/',
```

**Effort:** 5 minutes. **Impact:** Minor (frees one crawl slot, cleaner index).

---

### MEDIUM — Unvetted Sections in Sitemap

The following sections appear in the sitemap but were not part of the structured content build:

| Section | URLs | Notes |
|---|---|---|
| `/tags/*` | 13 pages | Tag aggregation pages — likely thin (list of articles per tag) |
| `/extensions/*` | 2 pages | Low page count — unclear content depth |
| `/marketing/*` | 3 pages | Low page count — unknown content quality |
| `/reddit/*` | 2–3 pages | Aggregated Reddit content — canonical issues possible |
| `/threads/*` | 1 page | Single page — unknown |

**Risk:** If these pages contain thin, scraped, or low-quality content, they negatively affect domain-level quality signals. Google evaluates the quality of the entire crawled domain when deciding how aggressively to crawl and index new pages.

**Action:** Review these sections manually. If content is thin or syndicated without added value, add `<meta name="robots" content="noindex" />` to those templates.

---

### LOW — All Pages Share the Same `lastmod` Timestamp

**File:** `astro.config.mjs`
```js
lastmod: new Date()
```

Every URL in the sitemap shows the same timestamp (build time). Google may ignore `lastmod` entirely if it doesn't reflect actual content changes — which is the case here, since a build doesn't mean every page changed.

**Impact:** Minor. Google's documentation says it "may use" lastmod as a hint. For a new site, Google is crawling everything regardless. This becomes more important at scale.

**Fix (optional):** Use `tool.addedDate` or the git commit date per page type via a custom serializer. Low priority — don't implement now.

---

### NONE — /go/ Redirect Pages (Correctly Handled)

`/go/[slug]` pages are built as static HTML with:
- `<meta name="robots" content="noindex, nofollow" />` ✓
- Excluded from sitemap via filter ✓  
- `Disallow: /go/` in robots.txt ✓
- `rel="sponsored noopener"` on outbound affiliate links ✓

No action needed.

---

### NONE — robots.txt Structure

```
User-agent: *
Allow: /
Disallow: /go/
Disallow: /search?*
Sitemap: https://zotopie.com/sitemap-index.xml
```

Correct configuration. No blocking issues.

---

### NONE — Sitemap Structure

- Single sitemap file (`sitemap-0.xml`) with 740 URLs
- Well under the 50,000 URL limit per file
- Submitted via `sitemap-index.xml` ✓
- No `?` query strings in sitemap ✓
- Sitemap URL declared in robots.txt ✓

---

## 3. Crawl Depth Analysis

```
Level 0 → Homepage (/)
Level 1 → /category/ (via nav)
           /best/ index (via nav + homepage section)
           /reviews/ index (via nav)
           6× /best/[slug] (via homepage section)
Level 2 → /category/[slug] (from category index)
           /reviews/[slug] (from reviews index)
           20× /best/[slug] (from /best/ index)
Level 3 → /alternatives/[slug] (from reviews pages)
           /compare/[pair] (from reviews + alternatives pages)
```

**Assessment:** Crawl depth is acceptable. All content pages are reachable within 3 clicks from the homepage. Compare pages at depth 3-4 are within Google's typical crawl range for a well-structured site.

**Gap:** The 14 best pages not linked from the homepage are at depth 2 (via /best/ index) but have no direct depth-1 path. This is acceptable but not ideal.

---

## 4. Priority Actions

### Immediate (do now — low effort, high impact)

| # | Action | File | Effort |
|---|---|---|---|
| 1 | Fix `/best/` sitemap priority from 0.5 → 0.9 | `astro.config.mjs` | 2 min |
| 2 | Add `noindex` to `/search` page | `src/pages/search.astro` | 3 min |
| 3 | Exclude `/search` from sitemap filter | `astro.config.mjs` | 1 min |

### Short-term (this sprint — medium effort, high impact)

| # | Action | File | Effort |
|---|---|---|---|
| 4 | Add "Related Guides" section in review pages linking to relevant `/best/` pages | `src/pages/reviews/[slug].astro` | 2–3 hr |
| 5 | Expand homepage best-of section from 6 to 12 cards | `src/pages/index.astro` | 30 min |
| 6 | Audit /tags/, /extensions/, /marketing/, /reddit/ — add noindex if thin | respective templates | 1 hr |

### Wait-and-observe (re-evaluate in 90 days)

| # | Action | Trigger |
|---|---|---|
| 7 | Compare page consolidation | If >300 compare pages remain "Crawled - not indexed" at 90 days |
| 8 | Increase `/alternatives/` priority from 0.7 → 0.8 | If alternatives pages start ranking for tool queries |
| 9 | Request indexation via GSC URL Inspection | For the 20 `/best/` pages individually — after fixing priority |

---

## 5. Final Verdict

**Technical setup:** Solid foundation. No catastrophic errors (no accidental noindex on money pages, no blocked crawl paths, clean robots.txt, valid sitemap structure).

**Primary risk:** The site is new (June 2026) and Google is still evaluating domain quality. The 440 compare pages create a thin-content surface area that may slow trust-building. The `/best/` sitemap priority misconfiguration means Google is systematically underprioritizing the most commercially valuable pages.

**Projected outcome without fixes:**
- `/best/` pages: first indexation in 60-90 days, slow ranking progression
- Compare pages: 50-100 indexed in year 1, remainder in "Discovered - not indexed"
- Review pages: gradual indexation over 90-180 days as domain builds trust

**Projected outcome with Priority Actions 1-6:**
- `/best/` pages: crawled within 14 days of sitemap re-submission
- Internal link boost from review pages → earlier `best` page indexation
- Cleaner index profile improves domain-level quality signal

**Single most important action:** Fix sitemap priority for `/best/` pages (action #1 above — 2 minutes). Do it before the next commit.
