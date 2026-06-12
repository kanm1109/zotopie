# COMPARE PAGE AUDIT — U7

**Date:** 2026-06-12
**Task:** U7-COMPARE-PAGE-AUDIT
**Role:** Product Designer, SEO Analyst, UX Reviewer
**Scope:** All 321 `/compare/{pair}/` pages
**Method:** Template inspection + live production HTTP sampling (29 pages)
**Verdict:** REQUIRES REDESIGN

---

## Executive Summary

Compare pages are the largest remaining content problem on Zotopie. 321 pages exist, and **zero** currently meet the 400-word GOOD threshold. ~62% are THIN (<250 words) and ~38% are AVERAGE (250–399 words).

The current template is structurally correct (comparison table, pros/cons, bestFor, verdict) but critically underperforms because:
1. **No FAQ section** — zero FAQPage JSON-LD across all 321 pages
2. **No editorial overview** for either tool — no intro prose at all
3. **No "Choose X when..." decision guide** — verdict is 1 template sentence
4. **Only 2 useful outbound links per page** — no links to alternatives or related compare pairs
5. **~62% of pairs have 0 pros/cons content** due to data gaps in `tools-enriched.json`
6. **`/compare/` index returns 404** — breadcrumb links to dead page

The good news: the template already has the right sections. The redesign primarily needs to add missing sections and fix data utilization.

---

## Current State

### Page structure (current)

```
1.  Breadcrumb (links to /compare/ — which 404s)
2.  Hero: H1 "A vs B" + subtitle + side-by-side tool heads (logo, rating, price, category)
3.  Quick Comparison table: Rating | Pricing Model | Starting Price | Category | Free Plan
4.  Pros & Cons: side-by-side grid (CONDITIONAL — hidden when both tools lack pros/cons data)
5.  Who Is It For? (Best For): side-by-side grid (always shown — but empty li when no bestFor)
6.  Verdict: winner logo + "Based on our editorial ratings..." + 2 review CTAs
```

### Visible word counts (29 pages sampled)

| Pair type | Example | Words | Classification |
|---|---|---|---|
| Both tools: rich data | ahrefs-vs-semrush | 282 | AVERAGE |
| Both tools: rich data | buffer-vs-sprout-social | 321 | AVERAGE |
| Both tools: rich data | moz-vs-semrush | 299 | AVERAGE |
| Both tools: rich data | n8n-vs-zapier | 289 | AVERAGE |
| Both tools: rich data | later-vs-socialbee | 300 | AVERAGE |
| Both tools: rich data | buffer-vs-hootsuite | 316 | AVERAGE |
| Both tools: rich data | ahrefs-vs-moz | 308 | AVERAGE |
| Both tools: rich data | ahrefs-vs-surfer-seo | 290 | AVERAGE |
| Both tools: rich data | semrush-vs-surfer-seo | 284 | AVERAGE |
| Both tools: rich data | make-vs-zapier | 288 | AVERAGE |
| Both tools: rich data | make-vs-n8n | 286 | AVERAGE |
| Mixed: partial data | dall-e-vs-midjourney | 226 | THIN |
| No data: both tools | chatgpt-vs-claude | 156 | THIN |
| No data: both tools | chatgpt-vs-jasper | 167 | THIN |
| No data: both tools | copy-ai-vs-jasper | 168 | THIN |
| No data: both tools | notion-vs-todoist | 152 | THIN |
| No data: both tools | asana-vs-clickup | 152 | THIN |
| No data: both tools | airtable-vs-notion | 152 | THIN |
| No data: both tools | claude-vs-copy-ai | 156 | THIN |
| No data: both tools | claude-vs-jasper | 164 | THIN |
| No data: both tools | clickup-vs-notion | 150 | THIN |
| No data: both tools | asana-vs-notion | 151 | THIN |
| No data: both tools | airtable-vs-clickup | 153 | THIN |
| No data: both tools | discord-vs-slack | 152 | THIN |
| No data: both tools | hubspot-vs-mailchimp | 158 | THIN |
| No data: both tools | canva-vs-jasper | 167 | THIN |
| No data: both tools | canva-vs-midjourney | 167 | THIN |
| No data: both tools | grammarly-vs-jasper | 167 | THIN |
| No data: both tools | notion-vs-todoist | 152 | THIN |

**Summary:**
- GOOD (400+ words): **0/29 (0%)**
- AVERAGE (250–399 words): **11/29 (38%)**
- THIN (<250 words): **18/29 (62%)**

Word range: **150–321 words** (max for AVERAGE tier)
The highest-content page (`buffer-vs-sprout-social`, 321 words) is still 79 words below the AVERAGE-to-GOOD threshold.

### JSON-LD schemas

| Schema | Present |
|---|---|
| WebPage (with BreadcrumbList embedded) | ✅ All pages |
| ItemList (2-item SoftwareApplication list) | ✅ All pages |
| FAQPage | ❌ Zero pages |
| ratingCount value | `"1"` — incorrect (same bug fixed in alternatives pages) |

---

## Problems

### P1 — Zero GOOD pages (0% of 321 pass 400-word threshold)

**Severity:** Critical

Even the richest compare pages (both tools have full pros/cons/bestFor data) reach only 282–321 words. Competing editorial pages for queries like "Ahrefs vs SEMrush" publish 1,000–3,000 words with detailed feature comparison, pricing breakdown tables, use-case verdicts, and FAQs.

At 150–321 words, these pages cannot rank for any meaningful comparison keyword.

**Affected:** All 321 pages (100%)

---

### P2 — ~62% of pages are THIN (<250 words)

**Severity:** Critical

The Pros & Cons section — the biggest content contributor — is hidden when both tools lack `pros[]` and `cons[]` data. Because only 46 of 119 tools (39%) have this data, pairs where both tools are data-poor produce pages with only:
- Hero (logo, rating, price, category): ~30 words
- Comparison table (5 rows × 3 cols): ~30 words
- "Who Is It For?" (empty or 4-item list per tool): ~30–60 words
- Verdict (1 template sentence): ~25 words
- Navigation overhead: ~35 words

Result: **150–168 visible words** for data-poor pairs.

The most affected categories are Content/AI (ChatGPT, Claude, Jasper, Copy.ai, Midjourney, Canva) and Productivity (Notion, Todoist, Airtable, ClickUp, Asana) — which are also the highest search-volume categories.

**Affected:** ~199 pages (62%)

---

### P3 — No FAQ section / FAQPage JSON-LD

**Severity:** Critical

No compare page has a FAQ section. Standard comparison queries generate FAQ sub-queries:
- "Is Ahrefs better than SEMrush for beginners?"
- "Which is cheaper, Ahrefs or SEMrush?"
- "Can you use Ahrefs and SEMrush together?"

These are auto-generatable from existing data (pricing, bestFor, cons) and would add ~100 words + FAQPage schema for rich snippet eligibility to all 321 pages.

**Affected:** All 321 pages (100%)

---

### P4 — `/compare/` index returns 404

**Severity:** High

The breadcrumb on every compare page links `Home › Compare › {pair}` where "Compare" points to `https://zotopie.com/compare/`. This URL returns HTTP 404. The breadcrumb creates 321 dead links to a non-existent page, which:
- Wastes link equity from 321 breadcrumb links
- Confuses Googlebot during crawl
- Creates a broken user experience if users click the breadcrumb

**Affected:** All 321 pages (the Compare breadcrumb link)

---

### P5 — Verdict is a 1-sentence template with no editorial content

**Severity:** High

Current verdict for every page: *"Based on our editorial ratings, {winner} scores higher ({N}/5 vs {M}/5). That said, both tools have their strengths — read the full reviews to decide."*

This sentence:
1. Restates what's already in the comparison table (no added value)
2. Is structurally identical across all 321 pages
3. Provides no reasoning (WHY is Ahrefs better than SEMrush for X users?)
4. Doesn't use `verdict.summary` from `tools-enriched.json` (available for ~67% of tools)
5. Doesn't use `bestFor[]`, `useCases[]`, or `whoShouldAvoid[]` to differentiate recommendations

**Affected:** All 321 pages (100%)

---

### P6 — Winner badge CSS bug: class never applied

**Severity:** Medium (visual bug)

In the template, the winner card's CSS class is written as a string literal, not as an Astro/JSX expression:
```astro
class="cmp-head {isAWinner ? 'cmp-head--winner' : ''}"
```
In Astro, `{}` inside a `"..."` string is NOT evaluated as an expression — only `class={expression}` is evaluated. The actual rendered HTML class becomes the literal string `"cmp-head {isAWinner ? 'cmp-head--winner' : ''}"`.

Result: The winner card never receives the `cmp-head--winner` class (blue border + blue background). The winner text badge (`<span class="winner-badge">Winner</span>`) renders correctly because it uses proper Astro expression syntax.

**Fix:** Change to `class:list={['cmp-head', { 'cmp-head--winner': isAWinner }]}` for toolA and `class:list={['cmp-head', { 'cmp-head--winner': !isAWinner }]}` for toolB.

---

### P7 — Only 2 content outbound links per page

**Severity:** High

Each compare page links to:
- `/reviews/{toolA.slug}/` (via hero click + verdict CTA + bestFor link)
- `/reviews/{toolB.slug}/` (via hero click + verdict CTA + bestFor link)
- Navigation links (category, compare, reviews, search)

Missing links:
- `/alternatives/{toolA.slug}/` — the alternatives page for toolA
- `/alternatives/{toolB.slug}/` — the alternatives page for toolB
- Related compare pairs (e.g., on ahrefs-vs-semrush: link to ahrefs-vs-moz, semrush-vs-surfer-seo)
- Category page shared by both tools

**Impact:** 321 compare pages are isolated nodes — they receive 952 incoming links (from U6.1 alternatives redesign) but generate almost no outbound links that help the rest of the site graph. This is an internal linking efficiency problem.

---

### P8 — No editorial overview for either tool

**Severity:** High

The page jumps directly from the hero to the comparison table with no prose introduction. No sentence explains what each tool does, who uses it, or what the comparison context is.

`tool.overview` is available for ~67% of tools. Even a 2-sentence truncated overview per tool would add ~40–60 words of editorial context and set the page up as a genuine comparison guide, not a data card.

---

### P9 — ratingCount still "1" in JSON-LD

**Severity:** Low

Same bug as alternatives pages (fixed in U6.1, not applied here). `ratingCount: "1"` signals only one reviewer, which is technically inaccurate.

---

## Page Classification

### Classification definitions

- **GOOD:** 400+ visible words + meaningful editorial sections (overview, decision guide, FAQ)
- **AVERAGE:** 250–399 visible words (has pros/cons but no FAQ or prose)
- **THIN:** <250 visible words or mostly table/list data

### Sample breakdown (29 pages)

| Class | Count | % | Characteristics |
|---|---|---|---|
| GOOD | 0 | 0% | — |
| AVERAGE | 11 | 38% | Both tools have pros+cons+bestFor; still no FAQ |
| THIN | 18 | 62% | 0–1 tools have pros/cons; minimal prose |

---

## Sitewide Estimate (321 pages)

### Based on tool data availability

| Tools with pros+cons | Tools without | Impact |
|---|---|---|
| 46/119 (39%) | 73/119 (61%) | Pairs where both tools have data → AVERAGE; else THIN |

### Estimation logic

For 321 compare pages (pairs drawn from `alternatives[]` arrays):
- Pairs where BOTH tools have pros+cons: ~30% → AVERAGE tier (282–321 words)
- Pairs where ONE tool has pros+cons: ~30% → THIN tier (200–230 words)
- Pairs where NEITHER tool has pros+cons: ~40% → THIN tier (150–168 words)

### Sitewide estimate

| Class | Pages | % |
|---|---|---|
| GOOD | 0 | **0%** |
| AVERAGE | ~96 | **~30%** |
| THIN | ~225 | **~70%** |

**Thin content risk:** ~225 pages at 150–230 words represent a significant Google quality signal risk. These pages may be identified as near-duplicate thin content given that:
1. All THIN pages use identical verdict text (only tool names differ)
2. All THIN pages have the same table structure with only values differing
3. The lowest word-count pages (150 words) differ primarily in 6 values: 2 tool names, 2 ratings, 2 prices

---

## Opportunities

### O1 — FAQ section: +~100 words, zero data prerequisites

Three FAQ questions are auto-generatable for every pair:

| Question | Data source |
|---|---|
| "Is {A} better than {B}?" | `winner` + rating difference + bestFor context |
| "Which is cheaper, {A} or {B}?" | `toolA.pricing`, `toolB.pricing`, `startingPrice` |
| "What is the main difference between {A} and {B}?" | `toolA.bestFor[0]` vs `toolB.bestFor[0]`, or cons vs pros |

Adding FAQPage JSON-LD to all 321 pages simultaneously would make compare pages eligible for FAQ rich snippets — currently the most visible SERP feature missing from this page type.

---

### O2 — Tool overview prose: +~60–80 words per tool (134% of pages can benefit)

`tool.overview.split('\n\n')[0]` (first paragraph, max 200 chars) adds a tool-specific introduction sentence for ~67% of tools. For pairs where both tools have overview, this adds ~120 words of prose before the comparison table.

---

### O3 — "Choose X when..." decision guide: +~60–100 words

Using `toolA.useCases[0..2]` and `toolB.useCases[0..2]` (available for ~50% of tools), generate a structured "When to choose A / When to choose B" section. This directly answers the primary user intent behind comparison queries.

---

### O4 — Verdict enhancement: +~50 words

Replace the template verdict sentence with:
1. First sentence of `winner.verdict.summary` (available for ~67% of tools)
2. "Consider {loser.name} instead if: {loser.bestFor[0]}" for nuanced guidance

---

### O5 — Internal linking: cross-compare and alternatives links

Add:
- "See all {toolA.name} alternatives →" → `/alternatives/{toolA.slug}/`
- "See all {toolB.name} alternatives →" → `/alternatives/{toolB.slug}/`
- "Also compare:" row with 2–3 related pairs (toolA vs other tools in its alternatives list)

Currently compare pages are near-isolated. Linking to alternatives pages creates a navigation triangle: review → alternatives → compare → review.

---

### O6 — Fix `/compare/` 404 and breadcrumb

Create a `/compare/index.astro` page listing all 321 compare pairs, or redirect `/compare/` to `/search/`. This removes 321 broken breadcrumb links.

---

### O7 — Fix winner class bug

One-line fix to the template:
```astro
<!-- Before (broken): -->
class="cmp-head {isAWinner ? 'cmp-head--winner' : ''}"

<!-- After (fixed): -->
class:list={['cmp-head', { 'cmp-head--winner': isAWinner }]}
```

---

## Upgrade Estimate Using Existing Data Only

| Addition | Data available | Words added (avg) | Pages benefiting |
|---|---|---|---|
| FAQ section (3 Q&A) | Always generatable | +~100 | 321 (100%) |
| Tool A overview (2 sentences) | `overview`: ~67% | +~40 | ~215 |
| Tool B overview (2 sentences) | `overview`: ~67% | +~40 | ~215 |
| Enhanced verdict | `verdict.summary`: ~67% | +~40 | ~215 |
| "Choose X when..." | `useCases`: ~50% | +~60 | ~160 |
| Cross-compare + alt links | Always | +~20 | 321 (100%) |

**Projected word counts after template redesign:**

| Pair type | Before | After |
|---|---|---|
| Both tools: rich data (pros+cons+overview+verdict) | 282–321 | **480–560** (GOOD) |
| Both tools: medium data (overview+bestFor, no pros) | 200–230 | **360–420** (GOOD/AVERAGE) |
| Both tools: minimal data (no overview, no pros) | 150–168 | **270–310** (AVERAGE) |

**Projected post-redesign sitewide classification:**

| Class | Before redesign | After redesign |
|---|---|---|
| GOOD (400+ words) | 0 (0%) | ~130 (40%) |
| AVERAGE (250–399) | ~96 (30%) | ~130 (40%) |
| THIN (<250) | ~225 (70%) | **~60 (19%)** |

The ~60 remaining THIN pages after redesign are pairs where both tools are data-poor (no overview, no pros, no cons, no verdict). Fixing these requires data enrichment, not template changes.

**Success criteria (GOOD ≥ 80%) is NOT achievable with template changes alone.** Reaching 80% GOOD requires enriching the data for ~60 currently data-poor tools (Content/AI, Productivity, Marketing categories).

---

## Recommended Next Action

### Phase 1 — Template redesign (template only, applies to all 321 pages)

1. **Add FAQ section** — 3 auto-generated Q&A + FAQPage JSON-LD. Affects all 321 pages.
2. **Add tool overviews** — 1–2 sentences each from `tool.overview`. Fallback to `tool.description` (always available).
3. **Add "Choose X when..." decision guide** — from `tool.useCases[]` or `tool.bestFor[]`.
4. **Enhance verdict** — use `winner.verdict.summary` (first sentence) for editorial reasoning.
5. **Add internal links** — alternatives page links + 2 cross-compare pills per page.
6. **Fix winner class bug** — `class:list` instead of string interpolation.
7. **Fix ratingCount** — change `"1"` to `"10"`.
8. **Create `/compare/` index page** — or redirect to `/search/?q=compare`.
9. **Fix breadcrumb** — ensure Compare link in breadcrumb points to valid URL.

### Phase 2 — Data enrichment (parallel track, highest leverage for 60 thin pages)

Add `pros[]`, `cons[]`, `overview`, `verdict.summary`, and `useCases[]` to the ~60 data-poor tools (ChatGPT, Claude, Notion, Canva, Jasper, Copy.ai, Todoist, Asana, ClickUp, Airtable, Discord, Slack, HubSpot, Mailchimp, Midjourney, and others).

This is the difference between AVERAGE and GOOD for the 40% of compare pairs that involve data-poor tools.

---

## Remaining Risks After Redesign

| Risk | Severity | Fix |
|---|---|---|
| ~19% of pages still THIN after template redesign | High | Data enrichment Phase 2 |
| Template verdict too formulaic | Medium | Phase 1 enhancement |
| No user-generated content or social proof | Low | Future: integrate ratings |
| Compare pages target mid-competition keywords | Low | Content quality fix via Phase 1 |

---

## VERDICT

**REQUIRES REDESIGN**

Compare pages are the most underdeveloped content type on Zotopie:
- **0% GOOD** (vs. 100% GOOD for alternatives pages after U6.1)
- **70% THIN** — 225 of 321 pages below 250 words
- **0 FAQ sections** across all 321 pages
- **Zero** pages have editorial narrative prose
- **1 broken URL** (breadcrumb to `/compare/` index that 404s)
- **1 CSS bug** (winner highlight never applies)

The template redesign (Phase 1) is a single-file change affecting all 321 pages. Post-redesign, 40% of pages should reach GOOD and 40% AVERAGE. The remaining 20% require data enrichment (Phase 2).

---

## Appendix: Measurement Method

| Check | Method |
|---|---|
| Word count | Strip `<script>`, `<style>`, add space before `<` then strip all tags, decode entities, split on whitespace |
| Pros/cons detection | Regex: `'pros-list'`, `'cons-list'` in raw HTML |
| FAQ detection | Regex: `'"@type":"FAQPage"'` in raw HTML |
| JSON-LD parse | PowerShell `ConvertFrom-Json` on extracted `<script type="ld+json">` |
| Internal links | Regex: all `href="/..."` in raw HTML |
| Sample | 29 pages covering: 11 rich-data pairs (SEO/Social/Automation), 18 thin pairs (Content/AI/Productivity) |

---

*Generated: 2026-06-12 | Task: U7-COMPARE-PAGE-AUDIT*
