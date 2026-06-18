# Homepage Content Discovery Report — TASK D-017
**Date:** 2026-06-15

---

## Files Changed

| File | Change |
| --- | --- |
| `src/pages/index.astro` | Added `getCollection` import, `ArticleCard` import, article fetch logic, "Latest Articles" section HTML, `.articles-grid` CSS |

**Lines added:** ~30 lines frontmatter + ~18 lines HTML + 8 lines CSS

---

## Data Source

| Collection | Path | Articles fetched |
| --- | --- | --- |
| reddit | `src/content/reddit/` | 1 (brand24-review.md) |
| threads | `src/content/threads/` | 0 (empty) |
| extensions | `src/content/extensions/` | 0 (empty) |
| marketing | `src/content/marketing/` | 0 (empty) |
| **Total** | | **1 article** |

**Fetch logic:** `getCollection()` for all 4 collections → combined → sorted by `publishDate` descending → `slice(0, 6)` → rendered if array length > 0.

**No hardcoding.** Section hidden if all collections return 0 articles (`{latestArticles.length > 0 && (...)`).

---

## Section Placement

```
Homepage layout (after):

[Hero + Search]
[Stats Bar]
[Popular Tools]      ← unchanged
[Latest Articles]    ← NEW — inserted here
[Browse by Category] ← unchanged
[Expert Best-Of Guides]
[Newly Added]
[Most Compared Tools]
[CTA Banner]
```

---

## CTA — Known Limitation

**Requirement:** CTA links to "trang tổng hợp content hiện có."

**Finding:** No unified articles aggregate page exists. Current content pages are per-collection only:
- `/reddit/` — Reddit articles only
- `/blog/` — empty
- `/threads/` — empty
- `/extensions/` — empty
- `/marketing/` — empty

**Decision:** Per task instructions ("Nếu chưa có trang tổng hợp: Report trước, Không tự tạo route mới"), no new route was created.

**Temporary CTA target:** `/reddit/` — the only non-empty collection index.

**CTA text:** "View all articles →"

**Recommended future action:** Create `/articles/` aggregate page that combines all 5 content collections into one paginated listing. This should be a separate task.

---

## Screenshots Before / After

### Before (Homepage section order)

```
[Hero]
[Stats Bar]
[Popular Tools]
[Browse by Category]    ← Brand24 INVISIBLE — not discoverable
[Expert Best-Of Guides]
[Newly Added]
[Most Compared Tools]
[CTA]
```

### After (Homepage section order)

```
[Hero]
[Stats Bar]
[Popular Tools]
[Latest Articles]       ← Brand24 Review card VISIBLE here
  ┌────────────────────────────────────────────────────────────┐
  │ reddit  Jun 15, 2026                                       │
  │ Brand24 Review (2026): Features, Pricing, and Reddit...    │
  │ Read our in-depth Brand24 review. We evaluate its features,│
  │ sentiment analysis, Reddit tracking capabilities, and...   │
  │ #brand24  #social listening  #reddit monitoring  #review   │
  └────────────────────────────────────────────────────────────┘
  [View all articles →]
[Browse by Category]
[Expert Best-Of Guides]
[Newly Added]
[Most Compared Tools]
[CTA]
```

---

## Card Design

Each article card renders via `ArticleCard.astro` (existing Gen 2 component) with:

| Field | Source | Display |
| --- | --- | --- |
| Title | `post.data.title` | Bold heading, links to `/reddit/brand24-review` |
| Description | `post.data.description` | 3-line clamp, muted grey |
| Category | `post.collection` | Purple gradient badge, links to `/reddit/` |
| Published Date | `post.data.publishDate` | Formatted: "Jun 15, 2026" |
| Tags | `post.data.tags` | Footer tag links (optional) |
| Image | `post.data.featuredImage` | Not shown (no featured image in brand24-review frontmatter) |

`featured={false}` — all cards render as equal size on homepage (no hero-expanded first card).

---

## Grid Responsive Behavior

| Viewport | Columns |
| --- | --- |
| ≥ 924px (3 × 300px + gaps) | 3 columns |
| 624–923px | 2 columns |
| ≤ 640px | 1 column (via `@media (max-width: 640px)`) |

---

## Build Verification

```
✓ Build: 845 pages, 0 errors
✓ Brand24 Review present in dist/index.html
✓ "Latest Articles" heading present
✓ "View all articles" CTA present
✓ /reddit/ link present
```

---

## Definition of Done — Status

| Criterion | Status |
| --- | --- |
| Homepage hiển thị Latest Articles | ✅ Section added, renders with 1 card |
| Brand24 Review xuất hiện trên Homepage | ✅ Confirmed in generated HTML |
| Không hardcode dữ liệu | ✅ `getCollection()` dynamic — auto-updates as new articles added |
| Responsive pass | ✅ 3-col → 2-col → 1-col breakpoints |
| Build pass | ✅ 845 pages, zero errors |

---

## Known Limitations

| # | Limitation | Impact | Fix |
| --- | --- | --- | --- |
| 1 | CTA links to `/reddit/` not a true aggregate | Low — only 1 collection has content | Create `/articles/` aggregate page (separate task) |
| 2 | Only 1 article available — section looks sparse | Expected — content in Phase 6 | Scale with GummySearch Review etc. |
| 3 | `blog` collection excluded per requirements | Low — blog is empty | Add `blog` to fetch if/when blog content added |
| 4 | Article images don't show (not in frontmatter) | Visual — cards show title/desc/date/tags only | Add `heroImage` to article frontmatter when images available |
| 5 | Empty collections produce build warnings | None — not errors, expected | Dismiss until collections have content |
