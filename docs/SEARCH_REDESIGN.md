# SEARCH REDESIGN — Zotopie U3

**Date:** 2026-06-12
**Task:** U3-GLOBAL-SEARCH-REDESIGN
**Role:** Product Designer / UX Designer / Frontend Engineer
**Objective:** Redesign Zotopie around a search-first experience

---

## PART 1 — SEARCH AUDIT

### Current State

| Location | Element | Status | Problem |
|---|---|---|---|
| Homepage hero | "Search Tools" button | ❌ Secondary CTA | Search is an afterthought — secondary outline button below "Browse All Reviews" |
| Homepage | Search box | ❌ Missing | No search box on homepage at all |
| Header (all pages) | Search pill button | ⚠ Weak | Tiny pill button styled like nav text — low affordance, links to /search page |
| /search page | Search box | ✅ Good | Functional, with relevance scoring and keyword highlighting |
| /search page | Autocomplete | ❌ Missing | No suggestions while typing — cold start only |
| /search page | Category chips | ⚠ Too many | 14 chips cause visual clutter on narrow screens |
| All pages | Keyboard access | ❌ Missing | No keyboard shortcut to focus search |

### Discovery Flow Problems

**Current flow** (4 steps to first result):
```
Land on homepage → read hero text → click "Search Tools" button → navigate to /search → type query → see results
```

**Target flow** (1 step):
```
Land on homepage → see search box → type → see inline suggestions → click result
```

### Key Weaknesses

1. **No search on homepage** — The primary action (search) requires a page navigation before user can act. Cold start costs the user 1 full page load.
2. **Header search has no input** — The "Search" pill in the nav is a link, not a search input. Users expect the search element to accept text.
3. **No autocomplete anywhere** — Users must type a full query and wait for results. No real-time suggestions while typing.
4. **Homepage has 3 identical tool sections** — "Popular Tools", "Top Rated", "Recently Added" all use the same ToolCard. Visual monotony, no clear hierarchy.
5. **Search is listed 4th in nav** — Behind Home, Categories, Reviews. Search should be persistently visible.
6. **No keyboard shortcut** — Power users on competitor sites (G2, Product Hunt, TAAFT) expect `/` to focus search.

---

## PART 2 — SEARCH EXPERIENCE DESIGN

### Design Philosophy

> "Users should be able to find a tool within seconds."

The search box is not a feature — it is the product. Everything else is content hierarchy around the search.

### Homepage Redesign

**Layout (top to bottom):**

```
┌───────────────────────────────────────────────────────────────┐
│ HEADER                                                        │
│  Zotopie    Home  Categories  Reviews   [🔍 Search tools…  /]│
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│ HERO                                                          │
│                                                               │
│        Discover The Best Software Tools                       │
│    Search 119+ expert reviews across 12 categories           │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ 🔍  Search 119+ software tools…                        │   │
│  └────────────────────────────────────────────────────────┘   │
│    ┌─────────────────────────────────────────────────────┐    │
│    │ Tools                              Ahrefs     ★ 4.8 │    │
│    │                                   SEMrush    ★ 4.7 │    │
│    │ Categories                                          │    │
│    │                                   SEO Tools        │    │
│    └─────────────────────────────────────────────────────┘    │
│                                                               │
│  [SEO] [Automation] [AI Writing] [Email] [CRM] [Social] ...  │
│                                                               │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│ POPULAR TOOLS (6 cards)                                       │
│  See all 119 reviews →                                       │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│ BROWSE BY CATEGORY                                            │
│  See all 12 categories →                                     │
└───────────────────────────────────────────────────────────────┘
```

**Removed:** "Top Rated" and "Recently Added" sections — redundant with Popular Tools; they added length without differentiation.

### Header Search Design

**Desktop:** Real text input in header (200px → 260px on focus). Right-aligned.

```
[Zotopie]  Home  Categories  Reviews   [🔍 Search tools… /]
```

- `/` key shortcut focuses the header input (shows `/ ` hint in the input, disappears on focus)
- On Enter → navigates to `/search?q=term`  
- No autocomplete in header (keeps all pages lightweight, no tool data embedding needed)
- On mobile (≤768px): Replaced by icon link to `/search`

### Autocomplete Design (Homepage + Search Page)

**Triggered on:** 1+ characters typed
**Debounce:** 100ms
**Max suggestions:** 5 tools + 3 categories

```
┌──────────────────────────────────────────────┐
│ Tools                                        │
│  Ahrefs                            ★ 4.8    │ ← highlighted match
│  SEMrush                           ★ 4.7    │
│                                              │
│ Categories                                   │
│  SEO Tools                                   │
│  Social Media Management                    │
└──────────────────────────────────────────────┘
```

**Keyboard behavior:**
- `↓ / ↑` — move selection
- `Enter` with item selected — navigate to item
- `Enter` with no item — navigate to `/search?q=`
- `Escape` — close dropdown
- Click outside — close dropdown

**Tool item:** Name (with match highlighted) + Rating badge
**Category item:** Name (with match highlighted)

**Matching logic:**
1. Name prefix match — prioritized (Ahrefs before "automation")
2. Name contains match — secondary
3. Sort by rating within each group

### Empty State (Search Page)

When no query is entered, show:
- **Popular Searches** chips: SEO, Automation, AI Writing, Social Media (already implemented ✅)

### No-Results State (Search Page)

When query matches nothing, show:
- "No results for `{query}`"  
- "Try a different keyword or browse categories →" (already implemented ✅)

---

## PART 3 — IMPLEMENTATION PLAN

### Existing Architecture

| Component | File | Status |
|---|---|---|
| Search engine (full-text) | `src/pages/search.astro` (inline script) | ✅ Exists |
| Search data | `src/data/generated/tools-enriched.json` | ✅ Exists |
| Taxonomy data | `src/data/taxonomies.json` | ✅ Exists |
| Header | `src/layouts/MainLayout.astro` | ⚠ Needs update |
| Homepage hero | `src/pages/index.astro` | ❌ Needs redesign |
| Autocomplete | — | ❌ Does not exist |

### Changes Required

#### 1. `src/layouts/MainLayout.astro`

- **Replace** `.nav-search-btn` anchor link with `<form action="/search" method="get">` containing a text input
- **Add** CSS for `.nav-search-form`, `.nav-s-input` (200px → 260px on focus), `.nav-s-kbd` hint
- **Add** mobile fallback: icon-only link on ≤768px
- **Add** inline `<script>`: press `/` → focus `#nav-q` (standard keyboard shortcut pattern)
- **Risk:** Low — additive change, replaces a link with a form input

#### 2. `src/pages/index.astro`

- **Add** frontmatter: `toolCount`, `catCount`, `slimTools`, `slimCats`, `top8cats`
- **Replace** hero section: remove 2 CTA buttons, add search box + autocomplete + category chips
- **Remove** "Top Rated" and "Recently Added" sections
- **Reorder** sections: Hero → Popular Tools → Browse by Category → CTA
- **Add** `<script define:vars={{ slimTools, slimCats }}>` with autocomplete logic
- **Add** CSS for hero search, autocomplete dropdown, category chips
- **Risk:** Medium — significant homepage restructuring; Popular Tools and category sections preserved intact

#### 3. `src/pages/search.astro`

- **Add** `<div id="ac-drop">` inside `.search-box` (position: absolute)
- **Add** autocomplete JS at end of existing `<script>` block (reuses `TOOLS` + `TAXONOMIES` already parsed)
- **Add** CSS for autocomplete dropdown
- **Risk:** Low — purely additive; existing search logic untouched

### Data Flow

```
tools-enriched.json (build time)
  ↓
index.astro frontmatter: slimTools = [{name, slug, rating}] (119 entries ~4KB)
  ↓
<script define:vars={{ slimTools, slimCats }}>
  ↓
autocomplete JS (client-side filtering + dropdown render)
```

```
search.astro: TOOLS (already loaded, full JSON)
  ↓
end of script block: derive slimTools from TOOLS
  ↓
autocomplete JS (same logic)
```

### No new files needed — all changes are within 3 existing files.

---

## PART 4 — ESTIMATED EFFORT

| Task | Effort | Risk |
|---|---|---|
| Header search input | ~30 min | Low |
| Homepage hero redesign | ~45 min | Medium |
| Homepage autocomplete | ~45 min | Low |
| Search page autocomplete | ~30 min | Low |
| Testing + CSS polish | ~30 min | Low |
| **Total** | **~3 hours** | **Low–Medium** |

---

## PART 5 — RISKS

| Risk | Mitigation |
|---|---|
| Header form breaks on mobile | Hide form on ≤768px, show icon link instead |
| Autocomplete blocks keyboard access | Escape key always closes; focus management correct |
| slimTools data too large | 119 tools × 30B = ~3.6KB — acceptable |
| Homepage restructure breaks ToolCard | ToolCard is unchanged; only section order changes |
| search.astro autocomplete conflicts with existing search | Added at end of script, separate event listener (`keydown` not `input`) |
| No-JS users | Header: form works without JS. Homepage: form submits to /search?q= without JS. |

---

*Generated: 2026-06-12 | Task: U3-GLOBAL-SEARCH-REDESIGN*
