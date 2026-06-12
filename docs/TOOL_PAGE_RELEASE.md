# TOOL PAGE RELEASE REPORT — U5

**Date:** 2026-06-12
**Task:** U5-TOOL-PAGE-REDESIGN
**Branch:** `main`
**File modified:** `src/pages/reviews/[slug].astro`
**Pages generated:** 119 tool review pages

---

## Summary

Tool pages redesigned: sections reordered for better reading flow, FAQ auto-generated from tool data with FAQPage JSON-LD added, Table of Contents added for navigation, rating badge added to hero, "Reviewed [Month Year]" date added. No new dependencies, no data file changes.

---

## Section Order Change

### Before
```
1.  Breadcrumb
2.  Hero
3.  Summary Card
4.  Overview
5.  Pros & Cons
6.  Best For
7.  Related Tools   ← wrong: pushes user off page mid-review
8.  Key Features
9.  Use Cases
10. Pricing Breakdown
11. Who Should Avoid
12. Final Verdict
13. Alternatives     ← wrong: too late for decision-stage user
14. Prev/Next
15. Sticky CTA
```

### After
```
1.  Breadcrumb
2.  Hero (+rating badge, +reviewed date)
3.  Summary Card
4.  Table of Contents  ← NEW
5.  Overview (#overview)
6.  Pros & Cons (#pros-cons)
7.  Best For (#best-for)
8.  Key Features (#key-features)
9.  Use Cases (#use-cases)
10. Pricing Breakdown (#pricing)
11. Who Should Avoid (#who-should-avoid)
12. Final Verdict (#verdict)
13. Alternatives (#alternatives)  ← moved right after Verdict
14. FAQ (#faq)                     ← NEW auto-generated
15. Related Tools (#related)       ← moved to end
16. Prev/Next
17. Sticky CTA
```

---

## New Features

### 1. Rating Badge in Hero

Amber pill `★ 4.8` displayed inline next to H1 — visible without scrolling.

```html
<div class="hero-title-row">
  <h1>Ahrefs Review</h1>
  <span class="hero-rating-badge">★ 4.8</span>
</div>
```

### 2. "Reviewed [Month Year]"

Computed at build time from `tool.addedDate`. No runtime JS.

```js
const [addedYear, addedMonth] = tool.addedDate.split('-');
const reviewDateStr = `${MONTH_NAMES[parseInt(addedMonth) - 1]} ${addedYear}`;
// → "June 2026"
```

Displayed as small muted text below tool description.

### 3. Table of Contents

Horizontal chip row between Summary Card and first section. Scrollable on mobile (scrollbar hidden). Shows only sections with content — different tools have different sections available.

```
[Overview] [Pros & Cons] [Best For] [Key Features] [Pricing] [Verdict] [Alternatives] [FAQ] [Related]
```

Only rendered when `toc.length > 2` (minimal single-section pages don't get a TOC).

### 4. Section Anchors

All sections now have `id` attributes:

| Section | Anchor |
|---|---|
| Overview | `#overview` |
| Pros & Cons | `#pros-cons` |
| Best For | `#best-for` |
| Key Features | `#key-features` |
| Use Cases | `#use-cases` |
| Pricing Breakdown | `#pricing` |
| Who Should Avoid | `#who-should-avoid` |
| Final Verdict | `#verdict` |
| Alternatives | `#alternatives` |
| FAQ | `#faq` |
| Related Tools | `#related` |

Deep links now work: `/reviews/ahrefs#pricing`, `/reviews/chatgpt#alternatives`

### 5. Auto-Generated FAQ + FAQPage JSON-LD

Four FAQ questions generated per tool from existing data fields:

| Question | Data source | Condition |
|---|---|---|
| "What is {tool}?" | `tool.overview` (first paragraph, max 350 chars) | `tool.overview` exists |
| "Is {tool} free?" or "How much does {tool} cost?" | `tool.pricing`, `tool.startingPrice` | always |
| "Who is {tool} best for?" | `tool.bestFor` | `bestFor.length > 0` |
| "What are the best alternatives to {tool}?" | `alternativeTools[0..2].name` | `alternatives.length > 0` |

FAQPage JSON-LD added to `<head>` alongside existing schemas. All 119 tool pages will now have FAQ rich snippet eligibility.

Example output:
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is Ahrefs?",
      "acceptedAnswer": { "@type": "Answer", "text": "Ahrefs is an SEO tool..." } },
    { "@type": "Question", "name": "How much does Ahrefs cost?",
      "acceptedAnswer": { "@type": "Answer", "text": "Ahrefs pricing starts at $129/month." } },
    ...
  ]
}
```

FAQ section rendered as `<details>/<summary>` accordion (same pattern as category pages). Max-width 780px for readable column.

---

## Frontmatter Changes

| Variable | Change |
|---|---|
| `reviewDateStr` | NEW: "June 2026" from addedDate split |
| `autoFaqs` | NEW: `{ question, answer }[]` auto-generated |
| `faqJsonLdStr` | NEW: FAQPage JSON-LD string (null if no FAQs) |
| `toc` | NEW: `{ id, label }[]` for Table of Contents |
| All existing variables | Unchanged |

---

## CSS Changes

**Added:**
- `.hero-text` — flex column wrapper for title row + description + date
- `.hero-title-row` — flex row for H1 + rating badge
- `.hero-rating-badge` — amber pill `★ 4.8`
- `.review-date` — muted "Reviewed June 2026" line
- `.toc`, `.toc-inner`, `.toc-link` — horizontal TOC nav
- `.avoid-section` — faint red background on "Who Should Avoid" section (differentiates from gray Use Cases)
- `.faq-list`, `.faq-item`, `.faq-q`, `.faq-a`, `.faq-icon` — FAQ accordion
- `.overview-text:last-child { margin-bottom: 0 }` — remove extra margin on last overview paragraph

**Unchanged:**
- Summary Card styles
- Pros & Cons styles
- Best For, Key Features, Use Cases, Pricing Breakdown styles
- Verdict box
- AltCard (alt-list) styles
- Prev/Next styles
- Sticky CTA styles

---

## Internal Linking Coverage

Each tool page now links to:
- 1 primary category page (breadcrumb + summary card + Related Tools "see all")
- All assigned categories (summary card tags)
- Up to 4 alternative tool pages (via AltCard)
- 1 alternatives landing page (`/alternatives/{slug}`)
- Up to 4 related tool pages (via ToolCard)
- 1 prev review + 1 next review (Prev/Next nav)
- 2× `/go/{slug}` affiliate links (Hero Verdict + Sticky CTA)

Average internal outbound links per tool page: **~14 links**

---

## SEO Impact

| Item | Before | After |
|---|---|---|
| FAQPage JSON-LD | ✗ | ✅ on all 119 pages |
| Section deep links | ✗ | ✅ `#pricing`, `#alternatives`, etc. |
| Rating visible in hero | ✗ | ✅ |
| Review date visible | ✗ | ✅ "Reviewed June 2026" |
| Alternatives placement | After Verdict | After Verdict (same, but Alternatives now #13, not buried at end) |
| Related Tools placement | After Best For (interrupted review) | After FAQ (end of page) |

---

## Verification Checklist

- [x] Rating badge in hero (amber pill, visible without scrolling)
- [x] "Reviewed [Month Year]" below description (computed at build time)
- [x] TOC shown only when `toc.length > 2`
- [x] TOC links match section `id` attributes exactly
- [x] All sections have `id` attributes for deep linking
- [x] Related Tools moved to after FAQ (end of page)
- [x] Alternatives placed after Final Verdict
- [x] Auto-generated FAQs: overview (Q1), pricing (Q2), bestFor (Q3), alternatives (Q4)
- [x] FAQPage JSON-LD added to `<head>` when `autoFaqs.length > 0`
- [x] FAQ accordion uses `<details>/<summary>` — no JS required
- [x] Sticky CTA unchanged (IntersectionObserver on `.summary-card`)
- [x] Mobile: `hero-title-row` wraps, rating badge scales, TOC scrolls horizontally
- [x] "Visit {tool} ↗" symbol consistently applied (hero + verdict + sticky)
- [x] TypeScript type annotations on `tool.*` fields (Astro/Vite processes correctly)

---

## Known Limitations

| ID | Issue | Rationale |
|---|---|---|
| U5-L1 | TOC does not highlight active section on scroll | Requires IntersectionObserver JS; static anchor links provide the core value |
| U5-L2 | FAQ answers are short (single sentence) | Adequate for FAQPage schema; richer answers require data additions |
| U5-L3 | Prev/Next still uses raw JSON dataset order | Low-impact; changing sort order requires larger frontmatter recompute |
| U5-L4 | No "Last Updated" field — uses addedDate for both review date and JSON-LD `datePublished` | Would require a separate `updatedDate` field in tools-enriched.json |

---

*Generated: 2026-06-12 | Task: U5-TOOL-PAGE-REDESIGN*
