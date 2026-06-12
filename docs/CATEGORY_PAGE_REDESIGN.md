# CATEGORY PAGE REDESIGN — U4

**Date:** 2026-06-12
**Task:** U4-CATEGORY-PAGE-REDESIGN
**Role:** Product Designer / UX Designer / Frontend Engineer
**Reference:** Futurepedia structural principles (not visual clone)

---

## PART 1 — AUDIT

### Files Reviewed
- `src/pages/category/[slug].astro` — individual category pages (932 lines)
- `src/pages/category/index.astro` — category listing page
- `src/data/category-content.json` — intro text, how_to_choose, FAQ per category
- `src/data/taxonomies.json` — 11 categories

### Current Structure (Category [slug].astro)

```
1.  Hero (breadcrumb + H1 + description + stats)
2.  Intro (expandable text from category-content.json)
3.  Top Rated (ranked #1 #2 #3 list)
4.  Editor's Picks (featured tools NOT in top-rated, max 3)
5.  Recently Added (newest tools NOT in top-3/featured, max 3)
6.  All Tools (full grid — ALL category tools, including duplicates from above)
7.  Buying Guide (auto-generated checklist + sidebar)
8.  How to Choose (from category-content.json, numbered list)
9.  FAQ (from category-content.json, accordion)
10. Related Categories (6 chips)
```

### Findings

| ID | Severity | Area | Problem |
|---|---|---|---|
| A-01 | Bug | Intro toggle | Button has no `<span>` — JS does `btn.querySelector('span')` which returns null, so "Read more" never changes to "Show less" |
| A-02 | P1 | Duplicate content | Buying Guide generates `<h2>How to Choose the Right X Tool</h2>` AND the JSON section generates `<h2>How to Choose the Best X Tool</h2>` — two near-identical H2s on the same page |
| A-03 | P1 | Redundant display | "All Tools" section shows ALL tools — including the same tools already displayed in Top Rated, Editor's Picks, and Recently Added. A user sees ChatGPT 3–4 times on one page. |
| A-04 | P2 | Navigation | Related Categories uses `slice(0, 6)` on the raw JSON array — picks the first 6 in file order, not the 6 most semantically related categories |
| A-05 | P2 | Discovery | No filter or sort UI — users can't filter by Free/Paid pricing on a category page |
| A-06 | P2 | Internal linking | Related Categories chip shows name + count badge, but no category description — insufficient context for navigation |
| A-07 | P3 | SEO | Meta description is `Discover the best ${name} tools. ${category.description}` — does not include tool count |
| A-08 | P3 | UX | 9-section structure is too long for scanning. Editor's Picks and Recently Added add ~3 cards each but create section fatigue |
| A-09 | Info | Category index | `/category/index.astro` has no breadcrumb JSON-LD or SEO schema |

### What Works Well
- ✅ Hero stats (tool count, avg rating, free count)
- ✅ Top Rated ranked list — clear visual hierarchy #1 #2 #3
- ✅ Intro expand/collapse pattern (structure is correct, just has a bug)
- ✅ FAQ accordion with JSON-LD FAQPage schema
- ✅ Buying Guide sidebar with Quick Stats
- ✅ ToolLogo component for consistent logos
- ✅ JSON-LD: CollectionPage + BreadcrumbList + ItemList

---

## PART 2 — REDESIGN

### Target Structure

```
HERO (breadcrumb + H1 + description + stats)
↓
INTRO / DESCRIPTION (expandable — fix bug)
↓
TOP RATED (ranked #1 #2 #3)
↓
MORE TOOLS (remaining tools with pricing filter tabs)
↓
HOW TO CHOOSE (JSON-driven only — remove auto-generated duplicate)
↓
FAQ (JSON-driven accordion with JSON-LD)
↓
RELATED CATEGORIES (all 10 others, sorted by tool count, with description)
```

### Design Decisions

**Remove: Editor's Picks + Recently Added**
These 2 sections add 3 cards each but no new information. Top Rated already surfaces the best tools. The "More Tools" grid covers everything else. Removing these simplifies the page from 9 sections to 7.

**Remove: Auto-generated Buying Guide**
The Buying Guide auto-generates "How to Choose the Right X Tool" content. The JSON `how_to_choose` section provides category-specific, manually-curated criteria. Keeping both creates duplicate H2s and duplicate intent. Remove the auto-generated version.

The Buying Guide sidebar (Quick Stats) is already covered by the Hero stats bar (tool count, avg rating, free count). No data loss.

**Add: Pricing Filter Tabs**
Above the "More Tools" grid, add: [All] [Free / Freemium] [Paid] filter tabs. Pure client-side JS. No server-side changes needed. Solves A-05.

**Fix: Intro toggle**
Wrap "Read more" text in `<span>` so the JS can update it to "Show less".

**Improve: Related Categories**
Show all 10 remaining categories (up from 6), sorted by tool count descending. Show category description, not just name. Convert from flex chip row to a proper 2-column grid for readability.

**Improve: Meta description**
Include tool count: `Discover the best ${name} tools. Expert reviews of ${count} tools — ${category.description}`

---

## PART 3 — SEO IMPROVEMENTS

### Internal Linking

| Before | After |
|---|---|
| Related: 6 of 11 categories linked | Related: all 10 other categories linked |
| "All Tools" section has all tool links, but redundant | "More Tools" shows unique tools with direct links |
| Buying Guide links to top-rated + cheapest tool | How to Choose (JSON) links to top tools via buying guide removal N/A |

### Crawl Path Improvements

**Category discovery path:**
`/` → `/category/` → `/category/{slug}/` → `/reviews/{slug}/`

**Cross-category linking:**
Each category page now links to all 10 other categories (was: 6). Googlebot can crawl all categories from any single category page.

### Schema / Meta
- FAQ JSON-LD preserved
- ItemList JSON-LD preserved
- CollectionPage + BreadcrumbList preserved
- Meta description updated to include tool count

---

## PART 4 — IMPLEMENTATION

### Changes to `src/pages/category/[slug].astro`

**Frontmatter:**
- Remove `featuredTools`, `featuredSlugs`, `newestTools` variables
- Add `allRemainingTools` (tools not in top-3, sorted by rating)
- Add `freemiumCount`, `paidCount`
- Change `relatedCategories` to all 10 others sorted by tool count
- Improve meta description

**HTML:**
- Wrap "Read more" in `<span>` (fix A-01)
- Remove Editor's Picks section
- Remove Recently Added section
- Rename "All Tools" → "More {category.name} Tools", use `allRemainingTools`
- Add pricing filter tabs above tools grid
- Remove Buying Guide auto-generated section (lines 262–378)
- Improve Related Categories: 2-column grid, show description, all 10 categories

**JS:**
- Fix intro-toggle text update
- Add pricing filter logic (~20 lines)

**CSS:**
- Add `.filter-tabs`, `.ftab`, `.ftab-active` styles
- Update `.related-grid` to 2-column grid
- Update `.related-card` to show description

---

*Generated: 2026-06-12 | Task: U4-CATEGORY-PAGE-REDESIGN*
