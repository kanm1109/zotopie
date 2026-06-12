# TOOL PAGE REDESIGN REPORT — U5

**Date:** 2026-06-12
**Task:** U5-TOOL-PAGE-REDESIGN
**Role:** Product Designer / UX Designer / Frontend Engineer
**Reference:** Futurepedia, Capterra — structural principles only

---

## PART 1 — AUDIT

### File Reviewed
- `src/pages/reviews/[slug].astro` — 990 lines

### Current Section Order

```
1.  Breadcrumb
2.  Hero (Logo + H1 + description)
3.  Summary Card (rating, pricing, category, visit button, category tags)
4.  Overview
5.  Pros & Cons
6.  Best For
7.  Related Tools ← ⚠️ WRONG POSITION
8.  Key Features
9.  Use Cases
10. Pricing Breakdown
11. Who Should Avoid
12. Final Verdict
13. Alternatives ← ⚠️ TOO LATE
14. Prev / Next navigation
15. Sticky CTA (fixed bottom bar)
```

### Findings

| ID | Severity | Issue |
|---|---|---|
| A-01 | P1 | Related Tools placed after Best For (section 7) — interrupts the review mid-way, pushes user to leave before reaching Pricing, Verdict |
| A-02 | P1 | Alternatives section placed after Final Verdict (section 13) — user decision already made; Alternatives should surface before or right after Verdict |
| A-03 | P1 | No FAQ section and no FAQPage JSON-LD — missing Google rich snippet opportunity for high-volume "what is X?", "how much does X cost?" queries |
| A-04 | P2 | No section `id` anchors — deep linking impossible (e.g. `/reviews/ahrefs#pricing`) |
| A-05 | P2 | No Table of Contents — pages with 10+ sections have no navigation aid |
| A-06 | P2 | Hero has no rating badge — user must scroll past description to see score |
| A-07 | P2 | No "Reviewed [Month Year]" visible — trust issue for a review site |
| A-08 | P3 | Prev/Next uses raw JSON dataset order (arbitrary insertion order), not rating or alphabetical |
| A-09 | P3 | Who Should Avoid section visually similar to Use Cases — both use gray bg + border, doesn't stand out as a trust signal |
| A-10 | Info | No `autocomplete="off"` on search inputs — minor |

### What Works Well

- ✅ Sticky CTA bar with IntersectionObserver — disappears when Summary Card is visible
- ✅ Pros & Cons two-column green/red layout
- ✅ Best For chip grid
- ✅ Key Features card grid
- ✅ Pricing Breakdown plan cards
- ✅ Final Verdict box with big score + CTA
- ✅ AltCard component for alternatives
- ✅ Full JSON-LD: WebPage + BreadcrumbList + SoftwareApplication + Review
- ✅ `/go/{slug}` affiliate link wrapper for tracking

---

## PART 2 — REDESIGN

### Target Section Order

```
Breadcrumb
↓
Hero (Logo + H1 + RATING BADGE + description + REVIEWED DATE) ← improved
↓
Summary Card (unchanged)
↓
TABLE OF CONTENTS (new — horizontal chip links)
↓
Overview (#overview)
↓
Pros & Cons (#pros-cons)
↓
Best For (#best-for)
↓
Key Features (#key-features)
↓
Use Cases (#use-cases)
↓
Pricing Breakdown (#pricing)
↓
Who Should Avoid (#who-should-avoid)
↓
Final Verdict (#verdict)
↓
Alternatives (#alternatives) ← moved up from after Verdict
↓
FAQ (#faq) ← NEW: auto-generated from tool data
↓
Related Tools (#related) ← moved to end
↓
Prev / Next
↓
Sticky CTA (unchanged)
```

### Design Rationale

**Related Tools → move to end**
Surfacing "Related Tools" after Best For sends users away before they've read Pricing, Verdict, or compared Alternatives. Moving it to after FAQ keeps the review flow intact. Users who want to explore alternatives/related tools can scroll to the bottom — or use the TOC.

**Alternatives → before FAQ**
After reading the Verdict, users decide: "Is this the right tool?" If not, they need to see alternatives immediately. Placing Alternatives right after Verdict reduces drop-off at the decision moment.

**FAQ → new auto-generated section**
Auto-generated from existing tool data. Four questions:
1. "What is {tool}?" — from overview
2. "Is {tool} free?" / "How much does {tool} cost?" — from pricing
3. "Who is {tool} best for?" — from bestFor
4. "What are the best {tool} alternatives?" — from alternatives list

FAQPage JSON-LD added to `<head>` — enables Google FAQ rich snippets.

**Table of Contents**
Static horizontal chip row after Summary Card. Links to sections with `id` anchors. Scrolls horizontally on mobile. No JS needed — just anchor links. Sections only shown if data exists for that tool.

**Rating badge in hero**
Visible immediately on page load without any scrolling. Amber star rating pill next to H1.

**"Reviewed [Month Year]"**
Computed from `tool.addedDate` at build time (no runtime JS). Displayed below hero description. Adds trust.

---

## PART 3 — INTERNAL LINKING

| Link | From | To |
|---|---|---|
| Category breadcrumb | Every tool page | `/category/{primaryCategory}` |
| Category tag (summary card) | Every tool page | `/category/{cat}` for each category |
| Alternatives "See all" | Every tool page | `/alternatives/{tool.slug}` |
| Related Tools "See all" | Every tool page | `/category/{primaryCategory}` |
| Verdict CTA | Every tool page | `/go/{tool.slug}` (affiliate) |
| Prev/Next | Every tool page | `/reviews/{prevSlug}` and `/reviews/{nextSlug}` |
| Alternative cards | Every tool page | `/reviews/{altSlug}` |
| Related tool cards | Every tool page | `/reviews/{relatedSlug}` |

**New links added:**
- TOC anchor links → same page sections
- FAQ answers can include tool names linked to review pages (future enhancement)

**Crawl impact:**
Each tool page links to: 1 category + up to 4 alternative tool pages + up to 4 related tool pages + 1 prev + 1 next. Average outbound links per tool page: ~12. This creates a dense link graph enabling Googlebot to discover all tool pages from any entry point.

---

## PART 4 — IMPLEMENTATION

### Changes to `src/pages/reviews/[slug].astro`

**Frontmatter additions:**
- `autoFaqs` — auto-generated FAQ array
- `faqJsonLdStr` — FAQPage JSON-LD string
- `reviewDateStr` — "June 2026" formatted date
- `toc` — array of `{ id, label }` for Table of Contents

**HTML changes:**
- Hero: add rating badge + "Reviewed [date]"
- After Summary Card: add `<nav class="toc">` with section jump links
- All sections: add `id` attributes
- Reorder: Related Tools moved after FAQ, Alternatives moved after Verdict
- New FAQ section: accordion + FAQPage JSON-LD in head

**CSS additions:**
- `.hero-rating-badge` — amber pill in hero
- `.review-date` — muted date line below description
- `.toc`, `.toc-inner`, `.toc-link` — horizontal TOC nav
- `.faq-list`, `.faq-item`, `.faq-q`, `.faq-a`, `.faq-icon` — FAQ accordion

**No changes to:**
- Summary Card layout
- Sticky CTA
- Prev/Next design
- Pros & Cons layout
- JSON-LD schemas (except FAQPage addition)

---

*Generated: 2026-06-12 | Task: U5-TOOL-PAGE-REDESIGN*
