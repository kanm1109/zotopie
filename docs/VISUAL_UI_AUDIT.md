# VISUAL UI AUDIT — E1

**Date:** 2026-06-13
**Project:** Zotopie
**References:** AlternativeTo, Futurepedia, 21st.dev

---

## Audit Method

Each page type reviewed against:
1. **Current code** (read from `src/pages/` and `src/components/`)
2. **AlternativeTo** — mature tool directory with 1M+ tools; strong comparison and alternatives UX
3. **Futurepedia** — fast-growing AI tools directory; strong visual hierarchy, filtering, monetization
4. **21st.dev** — component design reference for modern SaaS UI patterns

---

## Page-by-Page Audit

### 1. Homepage `/`

**Current:**
- Hero with search bar + category chips — good
- Popular Tools (6 cards, ToolCard component)
- Newly Added (2-column compact list)
- Most Compared (6 cards, pa-card component)
- Browse by Category (full grid)
- CTA + Trust Stats (bottom section)

**Gaps vs. references:**

| Gap | Impact | Fix |
|---|---|---|
| No visual differentiation — looks like default gray/white | High | Add colored category icons or gradient accents to category chips |
| ToolCard shows "View Review" only — no pricing, no "Try" CTA | High | Add startingPrice and affiliate CTA to ToolCard |
| Category cards are text-only — no icons | Medium | Add emoji or SVG icons to CategoryCard |
| No social proof — no "X teams use this", no testimonial quotes | Medium | Add 2-3 trust quotes or a "Trusted by X teams" strip |
| No value proposition differentiation ("why Zotopie?") | Medium | Add one-line hooks: "No sponsored rankings. No BS." |
| Stats section (119+ tools) is weak — competitors show millions | Low | Reframe: "439 compare pages" is more unique than "119 tools" |
| No newsletter capture | High | Add newsletter section above or below CTA |

**What AlternativeTo does better:** Clear category pills with tool counts; grid shows direct link to "visit software"; shows alternatives count per tool on cards.

**What Futurepedia does better:** Visual gradient cards; filter by pricing (free/freemium/paid) above the grid; editorial "Staff Pick" badges; newsletter capture in hero.

---

### 2. Tool Review Page `/reviews/[slug]`

**Current:**
- Review hero with logo, name, rating badge — good
- Summary card: Rating, Pricing, Starting Price, Category + "Visit [Tool]" CTA — good
- Sticky bottom CTA bar — good ✓
- TOC horizontal scroll — good ✓
- Overview, Pros/Cons, Best For, Key Features, Use Cases, Pricing Breakdown, Verdict — good ✓
- Alternatives (AltCard list), FAQ accordion, Related Tools grid

**Gaps vs. references:**

| Gap | Impact | Fix |
|---|---|---|
| AltCard links to review only — no "Compare" or "Try" CTA | High | Add `[Compare →]` link and `[Try →]` affiliate button to AltCard |
| Summary card "Visit [Tool]" button has no pricing context | Medium | Add "Starting at $X/mo" below the visit button |
| No affiliate disclosure near CTAs | Medium (legal) | Add "Affiliate link" disclosure tooltip or line near visit buttons |
| Pros/Cons grid collapses to 1 column on mobile — fine | None | Already handled |
| No comparison CTA within the review | Medium | Add inline "Compare [Tool] vs [Alt]" links in Alternatives section |
| Related Tools section shows ToolCard without "Try" CTA | Low | ToolCard needs affiliate CTA upgrade |
| Review date is "June 2026" — could be more trustworthy with author | Low | Add "By Zotopie Editorial" or similar |
| No schema for author (Person type) | Low | Add author Organization node to JSON-LD |

**What AlternativeTo does better:** Each alternative card has "Visit Website" CTA alongside "See Details". Rating shown as bar chart (visual). Platform/OS badges on alternatives.

**What Futurepedia does better:** Bold pricing tier comparison table in reviews. "Get [X]% off" promotional banners when affiliate deal available. Video embed for tool demo.

---

### 3. Compare Page `/compare/[pair]`

**Need to confirm current state from code** — from reading [pair].astro structure:
- Two-column side-by-side comparison
- Winner logic (higher rating or free pricing wins)
- Related compare pairs section
- FAQ accordion

**Gaps vs. references:**

| Gap | Impact | Fix |
|---|---|---|
| No affiliate CTAs on compare page — highest-intent pages have zero revenue | Critical | Add "Try [ToolA] Free →" and "Try [ToolB] →" buttons in hero/summary |
| No feature comparison table (checkbox grid) | High | Add a static feature checklist table from tool data |
| No "Our Recommendation" box with clear winner + rationale | High | Winner box with bold recommendation copy |
| No pricing comparison row (visual: "$X/mo vs $Y/mo") | High | Add pricing comparison in summary card |
| Related pairs section exists but could be richer | Low | Add category breadcrumb context |

**What AlternativeTo does better:** Direct "Go to website" buttons for both tools. Rating comparison as bar or number. Vote system ("I prefer X") for social engagement.

**What Futurepedia does better:** Explicit "Best for [use case]" recommendation box. Category filter within compare context.

---

### 4. Alternatives Page `/alternatives/[slug]`

**Current:**
- Intro paragraph (tool overview excerpt)
- "Why Switch" section (from tool cons)
- AltCard list (6 alternatives, sorted by rating)
- FAQ accordion (3 auto-generated questions)
- No outbound CTAs

**Gaps vs. references:**

| Gap | Impact | Fix |
|---|---|---|
| AltCard has "Read Review →" only — no "Try Free", no "Compare vs [tool]" | High | Add dual CTA to AltCard |
| No filter by pricing (free/paid) on alternatives list | Medium | Add simple free/paid filter tab |
| No "Best Overall" / "Best Free" / "Best for [use case]" editorial picks | Medium | Add 3-up "editorial picks" above the full list |
| No compare link between main tool and each alternative | High | Add "Compare [Tool] vs [Alt] →" link on each AltCard |
| Page doesn't link to compare page for each pair | High | Each AltCard should have a compare link |

**What AlternativeTo does better:** Each alternative card has "Compare with [original tool]" link, "Visit Website" button, and filter by OS/pricing. Shows pros of switching to each alternative.

---

### 5. Category Page `/category/[slug]`

**Current:**
- Category hero with stats (avg rating, freemium count, paid count)
- Top Rated 3-grid
- Remaining tools (ToolCard grid, sorted by rating)
- SEO intro paragraphs (catContent.intro)
- Related Categories
- FAQ accordion

**Gaps vs. references:**

| Gap | Impact | Fix |
|---|---|---|
| Top Rated section has 3 cards but no "Best Pick" editorial recommendation | Medium | Add editorial "Editor's Pick" or "Our #1" label to top-rated tool |
| No pricing filter (show free tools only / paid tools only) | Medium | Add filter tabs: All / Free & Freemium / Paid |
| ToolCard doesn't show actual price ("$10/mo"), only pricing tier label | High | Show startingPrice in ToolCard footer |
| No affiliate CTAs in category — all links go to review pages | Medium | Add "Try Free" CTA to featured/top-rated tools in category |
| Related categories shown but not visually differentiated | Low | Add icon + tool count to related category chips |

**What Futurepedia does better:** Category page has pricing filter prominently above the grid. Each tool card shows "Free" or "$X/mo" pricing pill. "Most popular" sort is the default.

---

### 6. Search Page `/search`

**Current (from code review):**
- Full-text search across tools and taxonomies
- Results shown as tool list
- Category filter chips likely present

**Gaps vs. references:**

| Gap | Impact | Fix |
|---|---|---|
| No pricing filter in search results | Medium | Add "Free only" toggle |
| No sort options (by rating, by name, by newest) | Medium | Add sort dropdown |
| Search results likely show ToolCard — no pricing displayed | Medium | Show startingPrice in search results |
| No "X results for [query]" count shown | Low | Add result count header |

---

## Component-Level Gaps

### ToolCard (used everywhere)
**Current:** Logo + Name + Rating badge + Description + Pricing tier + "View Review"
**Missing:** Actual price ($X/mo), "Try [Tool]" affiliate button, compare shortcut

**Proposed upgrade:**
```
[Logo] [Name] [★ 4.8]
[Description — 2 lines]
[Free / $13/mo] ............. [View Review] [Try Free →]
```

### AltCard (used in reviews + alternatives)
**Current:** Logo + Name + Rating + Description + Price tier + "Read Review →"
**Missing:** "Try [Tool]" affiliate CTA, "Compare vs [current tool]" link

**Proposed upgrade:**
```
[Logo] [Name] [★ 4.7] [from $13/mo]
[Description]
[Compare →]  [Try Free →]  [Read Review →]
```

### CategoryCard (used on homepage)
**Current:** Category name + tool count
**Missing:** Icon/emoji, visual color accent

---

## Visual Design Assessment

**Strengths:**
- Typography is clean (Arial, good sizes)
- Color system is consistent (blue #2563eb, amber for ratings)
- Card borders/hover states are polished
- Responsive breakpoints work correctly
- Sticky CTA bar on reviews is a strong conversion pattern

**Weaknesses:**
- No distinct visual identity — looks like a generic gray/white site
- No custom typeface — Arial is functional but not differentiated
- Category section is visually flat — no icons, no color differentiation
- Hero could use a subtle background treatment (gradient, pattern) to feel premium
- Font hierarchy is good but could use a display font for H1 ("Discover The Best Software Tools")

**Recommendation:**
The foundation is solid. Priority is adding revenue-driving CTAs (affiliate buttons, compare CTAs), not a full visual redesign. Do a "CTA and conversion" sprint before a "visual rebrand" sprint — the former pays for itself.

---

## Priority Summary

| Issue | Page | Effort | Impact | Priority |
|---|---|---|---|---|
| Add affiliate CTAs to compare pages | Compare | XS | Critical | **P1** |
| Add affiliate CTA to AltCard (alternatives + reviews) | Alt/Review | XS | High | **P1** |
| Add startingPrice to ToolCard | Global | XS | High | **P1** |
| Add "Compare vs X" link to AltCard | Alt/Review | S | High | **P1** |
| Add newsletter capture section | Homepage/Reviews | S | High | **P1** |
| Add "Editor's Pick" label to top-rated tools | Category | XS | Medium | **P2** |
| Add pricing filter to category and search | Category/Search | M | Medium | **P2** |
| Add feature comparison table to compare pages | Compare | M | High | **P2** |
| Add icons to CategoryCard | Homepage | XS | Low | **P3** |
| Add visual hero background treatment | Homepage | S | Low | **P3** |
| Custom display font for H1 | Global | XS | Low | **P3** |
| "Best of [Category]" editorial pages | New pages | L | High | **P2** |

---

*Generated: 2026-06-13 | Task: E1-MONETIZATION-AND-UI*
