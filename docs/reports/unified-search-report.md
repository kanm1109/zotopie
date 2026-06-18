# Unified Search Report
**Task:** D-019  
**Date:** 2026-06-15  
**Scope:** Extend search to cover both Tools and Articles with grouped results UI, exact-match ranking, and autocomplete suggestions

---

## Files Changed

| File | Change |
|---|---|
| `src/pages/search.astro` | All changes — article index, scoring, grouped result rendering, autocomplete |

No other files modified. Article data is pulled at build time inside `search.astro`'s frontmatter.

---

## Index Strategy

### Tools (unchanged)
Tools were already indexed via `getCollection('tools')` and passed as `toolsData` through `define:vars`. Each tool slim object contains: `id`, `name`, `slug`, `description`, `categories`, `tags`, `rating`, `pricing`.

### Articles (new)
Articles are fetched at build time using `Promise.allSettled` across all four article collections to tolerate empty collections without throwing:

```js
const results = await Promise.allSettled([
  getCollection('reddit'),
  getCollection('threads'),
  getCollection('extensions'),
  getCollection('marketing'),
]);
```

Only fulfilled results with non-draft entries are included. Each article slim object: `title`, `description`, `slug`, `collection`, `tags`, `publishDate` (ISO string).

The slim array is serialised with `JSON.stringify` and passed to the browser via `define:vars` as `articlesData`. No runtime API calls — all data is baked into the page HTML at build time.

---

## Result Ranking

### Tools (`scoreMatch`)
| Signal | Points |
|---|---|
| Title exact match | 30 |
| Title starts with query | 20 |
| Title contains query | 10 |
| Tag contains query | 8 |
| Description contains query | 3 |
| Slug contains query | 1 |

### Articles (`scoreArticle` — new)
Same weight table as tools, applied to article fields:

| Signal | Points |
|---|---|
| Title exact match | 30 |
| Title starts with query | 20 |
| Title contains query | 10 |
| Tag contains query | 8 |
| Description contains query | 3 |
| Slug contains query | 1 |

Results with score = 0 are excluded. Both lists are sorted descending by score.

---

## UI — Grouped Results

Results render in two labelled sections inside `#results`:

```
TOOLS  [n]
  <results-grid of tool cards>

ARTICLES  [n]
  <results-grid of article cards>
```

Article cards mirror the tool card layout: icon badge (document SVG on purple background), collection label pill (Reddit / Threads / etc.), description, publish date, and "Read Article →" CTA.

Count label: `"1 tool, 1 article for 'brand24'"` (singular/plural handled).

---

## Autocomplete

The autocomplete dropdown now has three sections:
1. **Tools** — up to 5 matches (unchanged)
2. **Articles** — up to 3 matches (new); each entry shows the article title + collection badge pill
3. **Categories** — up to 3 tag matches (unchanged)

Sections are hidden if they have no matches.

---

## Build Verification

```
✓ 848 page(s) built
✓ No errors
```

Warnings about empty collections (`blog`, `threads`, `extensions`, `marketing`) are pre-existing.

---

## Verification — Brand24 Query

Search for `brand24` returns:

- **TOOLS 1** — Brand24 tool card (rating 4.3, "Paid · from /month", "View Review →")
- **ARTICLES 1** — Brand24 Review (2026): Features, Pricing, and Reddit… card ("Reddit" badge, "Read Article →")

Confirmed via `search-brand24-v2.png` and `search-final.png` screenshots.

---

## Performance Notes

- All data is client-side; search is synchronous with zero network requests after page load
- Article index is lightweight: 6 fields per entry, no body content
- `Promise.allSettled` at build time adds negligible overhead (collections are small)
- CSS for injected elements uses `:global()` wrappers to escape Astro's component scoping

---

## Known Limitations

| Limitation | Detail |
|---|---|
| Category filter applies to tools only | The category pill filter (Content & AI Creation, Marketing & Lead Gen, …) filters tools by `categories` field. Articles are not assigned to these same categories, so the filter has no effect on the Articles section. |
| Autocomplete max 3 articles | `suggestAcArticles` caps at 3 results to keep the dropdown compact. |
| Empty collections contribute 0 articles | `threads`, `extensions`, `marketing` folders have no content yet; they will appear automatically once articles are added. |
| Article sort is title-only | Article ranking uses only metadata fields (title, description, tags, slug). Full-text body search is not available at client side without a dedicated index (e.g. Pagefind). |
