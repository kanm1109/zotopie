# D-070 — Project State Audit

**Date:** 2026-06-23  
**Status:** COMPLETE  
**Method:** File system scan · Build artifact analysis · Source code inspection  
**Total live pages:** 947

---

## Section 1 — Content Inventory

Zotopie has two completely separate content systems. Understanding the difference is the most important thing in this document.

### System A — Manual Content (Markdown files)

Human-written articles stored as `.md` files in `src/content/`. Astro reads them and generates pages.

| Location | Purpose | Files | Content Type |
|----------|---------|-------|-------------|
| `src/content/ai-tools/` | Long-form tool review articles | **8** | Markdown (.md) |
| `src/content/comparisons/` | Long-form head-to-head comparison articles | **3** | Markdown (.md) |
| `src/content/reddit/` | Long-form Reddit/social listening articles | **6** | Markdown (.md) |
| `src/content/blog/` | Blog (collection registered, no content yet) | **0** | — |
| `src/content/threads/` | Threads (registered, no content) | **0** | — |
| `src/content/extensions/` | Extensions (registered, no content) | **0** | — |
| `src/content/marketing/` | Marketing (registered, no content) | **0** | — |

**Manual content total: 17 published articles**

---

### System B — Data-Driven Pages (JSON database)

No human-written body text. Pages are generated automatically from structured JSON data. Changing a field in the JSON updates every page that uses it at next build.

| Location | Purpose | Size | What It Drives |
|----------|---------|------|---------------|
| `src/data/tools.json` | Master database of all tools | 328 KB / **128 tools** | /reviews/, /alternatives/, /compare/ |
| `src/data/best-pages.json` | Best page definitions (slug + tool list) | 51 KB / **20 pages** | /best/ |
| `src/data/best-for.json` | Use-case descriptions per tool | 30 KB | /reviews/ "best for" sections |
| `src/data/overviews.json` | Tool overview text | 170 KB | /reviews/ overview section |
| `src/data/pros-cons.json` | Pros and cons per tool | 128 KB | /reviews/ pros/cons section |
| `src/data/pros-cons-seo.json` | SEO-optimized pros/cons variant | 20 KB | /reviews/ |
| `src/data/alternatives.json` | Override for alternatives arrays | 16 KB | /reviews/ alternatives section |
| `src/data/category-content.json` | Category page text | 77 KB | /category/ |
| `src/data/taxonomies.json` | Category taxonomy definitions | 1.8 KB | /category/, /reviews/ |
| `src/data/logo-mapping.json` | Logo URL per tool | 3.6 KB | All pages with tool logos |
| `src/data/reddit-tools.json` | Reddit tool metadata | 32 KB | /reddit/ sidebar/toolbox |

**Auto-generated from tools.json (do not edit directly):**

| Location | How Created | Purpose |
|----------|------------|---------|
| `src/data/generated/tools-enriched.json` | `node scripts/merge-data.mjs` (prebuild) | Merged tool data used by all page templates |
| `src/data/generated/icon-data.json` | Prebuild script | Icon cache |
| `src/data/generated/logo-slugs.json` | Prebuild script | Logo slug list |

---

### System C — Images

| Location | Purpose | Files |
|----------|---------|-------|
| `public/images/ai-tools/` | Images for `/ai-tools/` articles | **21 files** in per-tool subfolders |
| `public/images/comparisons/` | Images for `/comparisons/` articles | **9 files** in per-pair subfolders |
| `public/images/reddit/` | Images for `/reddit/` articles | **24 files** (flat, not per-article subfolders) |
| `public/images/logos/` | Tool logos | 0 files (logos served from external CDN via logo-mapping.json) |

---

### System D — Documentation and Drafts

| Location | Purpose | Files |
|----------|---------|-------|
| `docs/reports/` | Audit reports, decision logs (D-058 → D-072) | 40+ markdown files |
| `drafts/archived/` | Raw drafts before editorial processing | **8 files** |

`drafts/archived/` contains raw versions of 5 published articles (synthesia, gptzero, fireflies, awario, f5bot, gummysearch, best-reddit-marketing, best-reddit-monitoring). These are the pre-edit originals. They are **not** source files — the live articles are in `src/content/`, not `drafts/`.

---

## Section 2 — Route Inventory

### Auto-Generated Routes (from JSON data)

| Route | Live Pages | Source File | Astro Template | Status |
|-------|-----------|-------------|----------------|--------|
| `/reviews/` | **128** | `src/data/generated/tools-enriched.json` | `src/pages/reviews/[slug].astro` | ✅ LIVE |
| `/alternatives/` | **128** | `src/data/generated/tools-enriched.json` | `src/pages/alternatives/[slug].astro` | ✅ LIVE |
| `/compare/` | **458** | tools.json `alternatives` arrays (pair math) | `src/pages/compare/[pair].astro` | ✅ LIVE |
| `/best/` | **20** | `src/data/best-pages.json` | `src/pages/best/[slug].astro` | ✅ LIVE |
| `/category/` | **11** | `src/data/taxonomies.json` | `src/pages/category/[slug].astro` | ✅ LIVE |
| `/tags/` | **42** | Article frontmatter `tags:` fields | `src/pages/tags/[tag].astro` | ✅ LIVE |

**How `/compare/` count works:** For each tool in tools.json, its `alternatives` array lists competitor slugs. Every pair is sorted alphabetically and deduplicated. 128 tools × avg. ~7 alternatives = 458 unique pairs.

**How `/reviews/` count works:** One page per tool slug. 128 tools = 128 review pages.

---

### Manual Content Routes (from Markdown)

| Route | Live Pages | Source Folder | Astro Template | Status |
|-------|-----------|---------------|----------------|--------|
| `/ai-tools/` | **8** | `src/content/ai-tools/` | `src/pages/ai-tools/[...slug].astro` | ✅ LIVE |
| `/reddit/` | **6** | `src/content/reddit/` | `src/pages/reddit/[...slug].astro` | ✅ LIVE |
| `/comparisons/` | **3** | `src/content/comparisons/` | `src/pages/comparisons/[slug].astro` | ✅ LIVE |
| `/blog/` | **0** | `src/content/blog/` (empty) | `src/pages/blog/[...slug].astro` | ⚠️ EMPTY |
| `/threads/` | **0** | `src/content/threads/` (empty) | `src/pages/threads/[...slug].astro` | ⚠️ EMPTY |
| `/extensions/` | **0** | `src/content/extensions/` (empty) | `src/pages/extensions/[...slug].astro` | ⚠️ EMPTY |
| `/marketing/` | **0** | `src/content/marketing/` (empty) | `src/pages/marketing/[...slug].astro` | ⚠️ EMPTY |

---

### Static Pages

| Route | Source | Status |
|-------|--------|--------|
| `/` | `src/pages/index.astro` | ✅ LIVE |
| `/search/` | `src/pages/search.astro` | ✅ LIVE |
| `/reviews/` (hub) | `src/pages/reviews/index.astro` | ✅ LIVE |
| `/alternatives/` (hub) | `src/pages/alternatives/index.astro` | ✅ LIVE |
| `/compare/` (hub) | `src/pages/compare/index.astro` | ✅ LIVE |
| `/best/` (hub) | `src/pages/best/index.astro` | ✅ LIVE |
| `/go/[slug]` | `src/pages/go/[slug].astro` | ✅ LIVE (affiliate redirects) |
| `/404` | `src/pages/404.astro` | ✅ LIVE |

---

### Important: What `/reviews/` Is and Is NOT

`/reviews/[slug]/` pages have **NO markdown source file**. There is no `src/content/reviews/` folder. Every word on a review page comes from fields in `tools.json` rendered through a template. This means:

- Adding a review page = adding a tool entry to `src/data/tools.json`
- Editing a review page = editing that tool's fields in `tools.json`
- Writing a long-form review = writing a markdown file in `src/content/ai-tools/` (different URL)

---

## Section 3 — Content Ownership

| Content Type | Route | Who Creates It | Method |
|-------------|-------|---------------|--------|
| Long-form tool reviews | `/ai-tools/[slug]-review/` | **G** | Writes markdown in `src/content/ai-tools/` |
| Long-form comparisons | `/comparisons/[a]-vs-[b]/` | **G** | Writes markdown in `src/content/comparisons/` |
| Reddit / social tool articles | `/reddit/[slug]/` | **G** | Writes markdown in `src/content/reddit/` |
| Tool database (DB reviews) | `/reviews/[slug]/` | **D** | Edits `src/data/tools.json` fields |
| Best pages | `/best/[slug]/` | **D** | Edits `src/data/best-pages.json` + tool selections |
| Compare pages | `/compare/[pair]/` | **D** | Auto-generated when alternatives arrays are updated in tools.json |
| Alternatives pages | `/alternatives/[slug]/` | **D** | Auto-generated from tools.json |
| Category pages | `/category/[slug]/` | **D** | Auto-generated from taxonomies.json |
| Images | `public/images/[section]/` | **G** (article images) / **D** (DB images) | Added to public/ before publish |
| Affiliate links | `/go/[slug]` | **D** | Configured in tools.json `affiliateUrl` field |
| Strategic tool selection | Which tools enter DB | **Founder** | Approves before D adds to tools.json |

---

## Section 4 — Current Published Articles

**17 long-form articles live on production. No template-generated pages included.**

### /ai-tools/ — Tool Reviews

| Title | URL | Words | Source File | Status |
|-------|-----|-------|-------------|--------|
| Arcads Review 2026 | `/ai-tools/arcads-review/` | 5,020 | `src/content/ai-tools/arcads-review.md` | ✅ Live |
| Clipto Review 2026 | `/ai-tools/clipto-review/` | 5,071 | `src/content/ai-tools/clipto-review.md` | ✅ Live |
| Copymatic Review 2026 | `/ai-tools/copymatic-review/` | 4,704 | `src/content/ai-tools/copymatic-review.md` | ✅ Live |
| Fireflies AI Review 2026 | `/ai-tools/fireflies-review/` | 4,277 | `src/content/ai-tools/fireflies-review.md` | ✅ Live |
| GPTZero Review 2026 | `/ai-tools/gptzero-review/` | 3,688 | `src/content/ai-tools/gptzero-review.md` | ✅ Live |
| HyperWrite Review 2026 | `/ai-tools/hyperwrite-review/` | 4,988 | `src/content/ai-tools/hyperwrite-review.md` | ✅ Live |
| Rytr Review 2026 | `/ai-tools/rytr-review/` | 3,985 | `src/content/ai-tools/rytr-review.md` | ✅ Live |
| Synthesia Review 2026 | `/ai-tools/synthesia-review/` | 3,282 | `src/content/ai-tools/synthesia-review.md` | ✅ Live |

**Subtotal: 8 articles, 35,015 words**

### /comparisons/ — Head-to-Head Comparisons

| Title | URL | Words | Source File | Status |
|-------|-----|-------|-------------|--------|
| Fireflies vs Otter 2026 | `/comparisons/fireflies-vs-otter/` | 4,827 | `src/content/comparisons/fireflies-vs-otter.md` | ✅ Live |
| GPTZero vs Originality.ai 2026 | `/comparisons/gptzero-vs-originality/` | 4,425 | `src/content/comparisons/gptzero-vs-originality.md` | ✅ Live |
| Rytr vs Jasper 2026 | `/comparisons/rytr-vs-jasper/` | 3,410 | `src/content/comparisons/rytr-vs-jasper.md` | ✅ Live |

**Subtotal: 3 articles, 12,662 words**

### /reddit/ — Reddit & Social Listening Articles

| Title | URL | Words | Source File | Status |
|-------|-----|-------|-------------|--------|
| Awario Review 2026 | `/reddit/awario-review/` | 3,046 | `src/content/reddit/awario-review.md` | ✅ Live |
| Best Reddit Marketing Tools 2026 | `/reddit/best-reddit-marketing-tools/` | 2,637 | `src/content/reddit/best-reddit-marketing-tools.md` | ✅ Live |
| Best Reddit Monitoring Tools 2026 | `/reddit/best-reddit-monitoring-tools/` | 2,435 | `src/content/reddit/best-reddit-monitoring-tools.md` | ✅ Live |
| Brand24 Review 2026 | `/reddit/brand24-review/` | 2,017 | `src/content/reddit/brand24-review.md` | ✅ Live |
| F5Bot Review 2026 | `/reddit/f5bot-review/` | 3,332 | `src/content/reddit/f5bot-review.md` | ✅ Live |
| GummySearch Review 2026 | `/reddit/gummysearch-review/` | 3,460 | `src/content/reddit/gummysearch-review.md` | ✅ Live |

**Subtotal: 6 articles, 16,927 words**

---

**Grand total: 17 articles, 64,604 words**

---

## Section 5 — Production Architecture

### The Two Systems Side-by-Side

```
SYSTEM A — Manual Content (articles)
──────────────────────────────────────────────────────
You write:   src/content/ai-tools/[slug]-review.md
You get:     zotopie.com/ai-tools/[slug]-review/
────────────────────────────────────────────────
You write:   src/content/comparisons/[a]-vs-[b].md
You get:     zotopie.com/comparisons/[a]-vs-[b]/
────────────────────────────────────────────────
You write:   src/content/reddit/[slug].md
You get:     zotopie.com/reddit/[slug]/

SYSTEM B — Data-Driven (database pages)
──────────────────────────────────────────────────────
You add to:  src/data/tools.json  (1 tool entry)
You get:     zotopie.com/reviews/[slug]/
             zotopie.com/alternatives/[slug]/
             zotopie.com/compare/[slug]-vs-[other]/  (×N)

You edit:    src/data/best-pages.json
You get:     zotopie.com/best/[slug]/
```

### Correct Path for Future Content

| Content Type | Exact File Location | Notes |
|-------------|---------------------|-------|
| New long-form tool review | `src/content/ai-tools/[tool-name]-review.md` | Use kebab-case. File name becomes URL slug. |
| New long-form comparison | `src/content/comparisons/[tool-a]-vs-[tool-b].md` | Sort A/B alphabetically to match URL convention. |
| New Reddit/social article | `src/content/reddit/[slug].md` | Slug is the URL. |
| New tool in DB (thin review) | Edit `src/data/tools.json` → add tool object | Triggers auto-generation of 3+ pages on next build. |
| New best page | Edit `src/data/best-pages.json` → add page object with toolSlugs array | All referenced tools must already exist in tools.json. |
| Article images | `public/images/[collection]/[slug]/[image-name].webp` | Match folder to the collection name (ai-tools, comparisons, reddit). |

### Frontmatter Required for Markdown Articles

Every `.md` file in `src/content/` must include this frontmatter (from `src/content/config.ts`):

```yaml
---
title: "Article Title Here"
description: "Meta description, 150-160 characters"
publishDate: 2026-06-23
author: "Zotopie Team"
tags: ["Tag One", "Tag Two"]
category: "ai-tools"
featuredImage: "/images/ai-tools/[slug]/hero.webp"
draft: false
---
```

If `draft: true`, the page is excluded from the build (not published).

---

## Section 6 — Workflow Recommendation

### G (Content Writer)

G's job is markdown files and images only. G never touches JSON data files.

```
Step 1 — Write the article
  File location:  src/content/[collection]/[slug].md
  Frontmatter:    Fill all required fields (title, description, publishDate, tags, category)
  Body:           Full article in markdown

Step 2 — Add images
  Location:       public/images/[collection]/[slug]/
  Format:         WebP preferred. 3 images per article typical (hero + 2 screenshots)
  Naming:         [slug]-hero.webp, [slug]-screenshot-1.webp, [slug]-screenshot-2.webp
  Reference:      In frontmatter: featuredImage: "/images/[collection]/[slug]/[slug]-hero.webp"
  In body:        ![Alt text](/images/[collection]/[slug]/[slug]-screenshot-1.webp)

Step 3 — Notify D
  Confirm file is placed. D reviews and deploys.
```

**G does NOT need to:**
- Run builds
- Edit tools.json
- Push to GitHub
- Know about templates or Astro

---

### D (Developer/System Owner)

D controls the database, scripts, and deployment.

```
Step 1 — New tool entry (when adding to DB)
  File:    src/data/tools.json
  Action:  Add complete tool object (slug, name, categories, rating, pricing, overview,
           affiliateUrl, alternatives, etc.)

Step 2 — Regenerate enriched data
  Command: npm run prebuild
  Output:  src/data/generated/tools-enriched.json (auto-updated)
  When:    Always run after editing tools.json before pushing

Step 3 — Best page updates
  File:    src/data/best-pages.json
  Action:  Add/update page objects with toolSlugs arrays

Step 4 — Review G's content
  Check:   Frontmatter complete, images in correct location, no draft:true left in

Step 5 — Deploy
  Command: git add [specific files] → git commit → git push origin main
  Result:  Cloudflare Pages auto-builds and deploys (prebuild runs automatically in CI)
```

**D does NOT:**
- Write article body text
- Choose which tools to add (Founder decides)
- Write comparison articles

---

### Founder (PM / Strategic Owner)

```
Step 1 — Approve which tools enter DB
  Signal to D: "Add [Tool X] to tools.json"
  D does the data entry

Step 2 — Approve content strategy
  Signal to G: "Write a review of [Tool X]"
  G writes the markdown

Step 3 — Review before publish
  D sets draft: false in the markdown file when Founder approves
  OR Founder reviews in GitHub before D merges

Step 4 — Affiliate program decisions
  Founder approves which programs to apply for
  D updates affiliateUrl and affiliate: true in tools.json after approval
```

---

### Deployment Flow (end-to-end)

```
G writes file  →  D reviews  →  D runs prebuild (if tools.json changed)
→  D pushes to GitHub  →  Cloudflare Pages triggers build
→  npm run prebuild (runs automatically in CI)
→  Astro builds all 947+ pages
→  Cloudflare Pages deploys globally
→  Live within ~2 minutes of push
```

---

### Image Storage Convention (exact paths)

| Article Type | Image Folder | Example |
|-------------|-------------|---------|
| Tool review (ai-tools) | `public/images/ai-tools/[tool-slug]/` | `public/images/ai-tools/synthesia/hero.webp` |
| Comparison | `public/images/comparisons/[pair-slug]/` | `public/images/comparisons/fireflies-vs-otter/hero.webp` |
| Reddit article | `public/images/reddit/` | `public/images/reddit/gummysearch-hero.webp` |

Note: Reddit images are currently flat (no per-article subfolders). New reddit articles should follow the same pattern as existing ones for consistency.

---

## Quick Reference for PM

**"Where is everything?"**

| What | Where |
|------|-------|
| Published article files | `src/content/ai-tools/`, `src/content/comparisons/`, `src/content/reddit/` |
| Tool database | `src/data/tools.json` |
| Best page definitions | `src/data/best-pages.json` |
| Article images | `public/images/[collection]/[slug]/` |
| Page templates | `src/pages/[route]/[slug].astro` |
| Draft articles (pre-edit) | `drafts/archived/` |
| Audit reports | `docs/reports/` |

**"How do I publish a new article?"**

G writes `src/content/[collection]/[slug].md` → adds images to `public/images/[collection]/[slug]/` → D pushes to GitHub.

**"How do I add a new tool to the reviews section?"**

D adds it to `src/data/tools.json` → runs `npm run prebuild` → pushes. No markdown needed. Review page auto-generates.

**"Where do images go?"**

`public/images/[collection-name]/[article-slug]/[image-name].webp`

---

**D-070 STATUS: COMPLETE**
