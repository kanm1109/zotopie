# ALTERNATIVES RELEASE REPORT — U6.1

**Date:** 2026-06-12
**Task:** U6.1-ALTERNATIVES-PAGE-REDESIGN
**Branch:** `main`
**Commit:** `7a6f4bc`
**File modified:** `src/pages/alternatives/[slug].astro`
**Net change:** 494 insertions, 61 deletions
**Pages generated:** 119 `/alternatives/{slug}/` pages

---

## Summary

Alternatives pages redesigned from thin link-lists (~138 words) to editorial comparison pages (447–600 words) using only existing `tools-enriched.json` data. Template changes only — no new data fields, no manual writing.

**Before:** 0 GOOD / 119 THIN
**After:** 119 GOOD / 0 THIN

---

## What Changed

### Sections Added

| Section | Data source |
|---|---|
| Editorial intro paragraph | `tool.overview` (first paragraph, max 360 chars) |
| Quick Comparison table | `alt.pricing`, `alt.startingPrice`, `alt.rating`, `alt.bestFor[0]` |
| Per-alt "Best for" blurb | `alt.bestFor[0..1]` + `alt.pros[0]` |
| Per-alt compare link | `[tool.slug, alt.slug].sort().join("-vs-")` |
| "Why keep" callout | `tool.bestFor[0..1]` |
| Best Overall Pick card | `bestAlt.name`, `bestAlt.verdict.summary`, `bestAlt.bestFor[0..2]` |
| FAQ section (3 Q&A) | Various fields (see ALTERNATIVES_REDESIGN.md Part 3) |
| Compare pills section | `compareLinks` array (4 per page) |

### Sections Fixed

| Section | Before | After |
|---|---|---|
| Why Switch | Shown only when `tool.pros.length > 0` — hidden on 73 pages | Always shown; uses `tool.cons[]` + `tool.whoShouldAvoid[]`; fallback text |
| Category link | "More X tools" (text only) | "Browse all X tools →" (improved CTA) |

### JSON-LD Changes

| Schema | Change |
|---|---|
| ItemList `ratingCount` | Fixed `"1"` → `"10"` on all 119 pages |
| FAQPage | **Added** — 3 questions per page, auto-generated |

---

## Metrics

### Word Count

| Statistic | Before | After | Change |
|---|---|---|---|
| Average | ~148 words | 489 words | +3.3× |
| Minimum | ~135 words | 447 words | +3.3× |
| Maximum | ~180 words | 600 words | +3.3× |

### Content Classification

| Class | Before | After |
|---|---|---|
| GOOD (≥400 words) | 0 (0%) | **119 (100%)** |
| AVERAGE (250–399) | 0 (0%) | 0 (0%) |
| THIN (<250 words) | 119 (100%) | **0 (0%)** |

### Internal Links

| Link type | Before per page | After per page |
|---|---|---|
| Review page links | 5 | 6 |
| Compare page links | 0 | **8** |
| Category links | 1 | 1 |
| **Total** | **~6** | **~15** |

Total new compare page links across 119 pages: **952**

### Schema Coverage

| Schema | Before | After |
|---|---|---|
| WebPage | ✅ all 119 | ✅ all 119 |
| ItemList | ✅ all 119 | ✅ all 119 |
| FAQPage | ❌ 0 | ✅ **all 119** |

---

## Verification Checklist

- [x] Build succeeds — `720 page(s) built` in `9.12s`, 0 TypeScript errors
- [x] All 119 alternatives pages generated
- [x] Comparison table visible: Tool | Pricing | Rating | Best For
- [x] Pricing pills: Free (green) / Freemium (blue) / Paid (gray)
- [x] Per-alt Best For line rendered below each AltCard
- [x] Per-alt compare link renders correct sorted slug
- [x] Why Switch shown on all pages (not conditional on pros existence)
- [x] Why Keep callout only shown when `tool.bestFor.length > 0`
- [x] Best Overall Pick card shows for all pages (all have ≥1 alternative)
- [x] FAQ accordion: 3 questions per page
- [x] FAQPage JSON-LD: present in `<head>` of all 119 pages
- [x] ItemList ratingCount: `"10"` on all pages
- [x] Compare pills: 4 per page, correct `/compare/` URLs
- [x] Mobile: `cmp-bestfor` hidden on ≤600px; table scrollable horizontally
- [x] Intro text truncated at 360 chars with `...`
- [x] FAQ Q1 has no duplicate sentences (fixed: verdict-only, not description+verdict)
- [x] Verdict card shows `verdict.summary` (max 300 chars) or falls back to `description`

---

## Sample Pages

### /alternatives/ahrefs/ (rich data — has cons, verdict, whoShouldAvoid)
- Words: 553
- Intro: "Ahrefs is one of the most powerful SEO toolsets available..." (real overview)
- Why Switch: 5 items (3 cons + 2 whoShouldAvoid)
- Best Overall: Surfer SEO (★4.8) — shows description (no Surfer verdict.summary)
- FAQ Q3: Uses actual cons text — specific, not generic

### /alternatives/chatgpt/ (minimal cons data)
- Words: 455
- Intro: ChatGPT overview paragraph
- Why Switch: Fallback text + "still excels for: Conversational AI users..."
- Best Overall: Claude (★4.8)
- FAQ Q2: "Is there a free ChatGPT alternative? Yes — Claude offers a freemium plan..."

### /alternatives/todoist/ (minimal data — lowest word count)
- Words: 447
- Intro: Generic overview (pre-existing data quality issue — not template related)
- Why Switch: Fallback text + "still excels for: Task managers..."
- Best Overall: Notion (★4.9)
- All 4 alts: Freemium — FAQ Q2 uses Notion as free alternative

---

## Expected SEO Impact

| Item | Before | After |
|---|---|---|
| Thin content risk | 100% of pages | 0% of pages |
| FAQPage rich snippets | ❌ | ✅ eligibility on all 119 pages |
| Compare page internal links | 0 | 952 new links |
| Editorial ranking potential | ~3–5% of pages | ~20–35% estimated |
| Word count vs competitors | 5–15× below | Approaching parity |

---

## Known Data Issues (Pre-Existing, Not Template Related)

1. **Generic overview text**: Some tools have boilerplate first-paragraph text ("According to its official website and product documentation..."). This appears in the intro section. Fixing requires data re-enrichment.

2. **4 alternatives per tool (uniform)**: All tools hardcoded to exactly 4 alternatives. Expanding to 6–8 would increase content volume further. Requires editing `tools-enriched.json`.

3. **Missing verdict.summary**: ~40% of tools have `verdict: null`. Best Overall card falls back to `bestAlt.description`. Still useful but less editorial.

---

*Generated: 2026-06-12 | Task: U6.1-ALTERNATIVES-PAGE-REDESIGN | Commit: 7a6f4bc*
