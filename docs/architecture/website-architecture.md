# Zotopie Website Architecture
**Date:** 2026-06-15 | **Auditor:** D-016

---

## Section 1 — Current Navigation Map

### Global Navigation (SiteHeader — all pages)

```
[Zotopie Logo]   Home   Best Tools   Categories   Reviews   Reddit   [Search Box]
```

| Link | URL | Destination |
| --- | --- | --- |
| Home | `/` | Homepage (tool discovery hub) |
| Best Tools | `/best/` | 20 editorial "Best X" guides |
| Categories | `/category/` | 11 tool taxonomy categories |
| Reviews | `/reviews/` | All 119 tool reviews |
| Reddit | `/reddit/` | Reddit content articles |
| Search | `/search/` | Tool search (tool database only) |

**Mobile nav additions:** same links + explicit "Search Tools" link.

---

### Footer (SiteFooter — all pages)

| Column | Links |
| --- | --- |
| Explore | All Reviews `/reviews/`, Best Tools `/best/`, Categories `/category/` |
| Compare | Search Tools `/search/`, AI Writing `/best/ai-writing-tools/`, SEO Tools `/best/seo-tools/` |

**Gap:** Footer does not link to `/reddit/`, `/tags/`, `/compare/`, or `/alternatives/`.

---

### 404 Page — Recovery Links

- Go Home → `/`
- Browse Reviews → `/reviews/`
- Browse Categories → `/category/`

---

## Section 2 — Content Systems

Zotopie has **two distinct content systems** that do not share a search index or cross-link automatically.

---

### System A: Tool Database (Primary)

Data source: `src/data/generated/tools-enriched.json`

**119 tools.** Each tool has: `name`, `slug`, `rating`, `pricing`, `startingPrice`, `categories[]`, `primaryCategory`, `alternatives[]`, `pros[]`, `cons[]`, `overview`, `description`, `keyFeatures[]`, `bestFor[]`, `useCases[]`, `verdict`, `whoShouldAvoid[]`, `affiliate`, `affiliateUrl`, `website`, `addedDate`, `featured`.

#### 2A-1 — Tool Review Pages

| Field | Value |
| --- | --- |
| **URL pattern** | `/reviews/[slug]` |
| **Data source** | `tools-enriched.json` → single tool entry |
| **Template** | `src/pages/reviews/[slug].astro` (inline, uses MainLayout) |
| **Purpose** | Full tool review: overview, rating, pros/cons, pricing, alternatives panel, related guides, compare links |
| **Count** | 119 pages |
| **Internal links out** | `/alternatives/[slug]`, `/compare/[pair]`, `/best/[slug]`, `/category/[slug]` |
| **Internal links in** | Homepage, `/reviews/`, `/category/[slug]`, `/best/[slug]`, `/compare/[pair]` |

#### 2A-2 — Tool Category Pages (Taxonomy)

| Field | Value |
| --- | --- |
| **URL pattern** | `/category/[slug]` |
| **Data source** | `taxonomies.json` (11 categories) + `tools-enriched.json` (filtered by category) |
| **Template** | `src/pages/category/[slug].astro` (inline, uses MainLayout) |
| **Purpose** | Browse all tools in a category: top-rated, remaining grid, stats, related categories |
| **Count** | 11 pages |
| **Internal links out** | `/reviews/[slug]`, `/compare/[pair]`, `/alternatives/[slug]`, `/category/[other-slug]` |
| **Internal links in** | Homepage hero grid, `/category/`, SiteHeader "Categories" |

#### 2A-3 — Category Index

| Field | Value |
| --- | --- |
| **URL pattern** | `/category/` |
| **Data source** | `taxonomies.json` + `tools-enriched.json` (count per category) |
| **Template** | `src/pages/category/index.astro` (inline, uses MainLayout) |
| **Purpose** | Grid of all 11 taxonomy categories with tool counts |
| **Count** | 1 page |

#### 2A-4 — "Best X" Editorial Guides

| Field | Value |
| --- | --- |
| **URL pattern** | `/best/[slug]` |
| **Data source** | `best-pages.json` (20 entries) + `tools-enriched.json` (enriched tool data) |
| **Template** | `src/pages/best/[slug].astro` (inline, uses MainLayout) |
| **Purpose** | Ranked "Best AI Writing Tools", "Best SEO Tools", etc. with editorial verdict per tool |
| **Count** | 20 pages |
| **Internal links out** | `/reviews/[slug]`, `/compare/[pair]` |
| **Internal links in** | `/best/`, Homepage "Popular Tools" |

#### 2A-5 — Best Index

| Field | Value |
| --- | --- |
| **URL pattern** | `/best/` |
| **Data source** | `best-pages.json` |
| **Template** | `src/pages/best/index.astro` (inline, uses MainLayout) |
| **Purpose** | Grid of all 20 editorial guides |
| **Count** | 1 page |

#### 2A-6 — Tool vs. Tool Compare Pages

| Field | Value |
| --- | --- |
| **URL pattern** | `/compare/[tool-a-slug]-vs-[tool-b-slug]` |
| **Data source** | `tools-enriched.json` (alternatives field creates pairs) |
| **Template** | `src/pages/compare/[pair].astro` (inline, uses MainLayout) |
| **Purpose** | Side-by-side comparison of two tools |
| **Count** | 439 pages |
| **Internal links out** | `/reviews/[slug]`, `/go/[slug]` |
| **Internal links in** | `/reviews/[slug]` (related compare links) |

#### 2A-7 — Alternatives Pages

| Field | Value |
| --- | --- |
| **URL pattern** | `/alternatives/[slug]` |
| **Data source** | `tools-enriched.json` (alternatives field per tool) |
| **Template** | `src/pages/alternatives/[slug].astro` (inline, uses MainLayout) |
| **Purpose** | "Best alternatives to [Tool]" page listing competitor tools |
| **Count** | Subset of 119 (tools with alternatives defined) |
| **Internal links out** | `/reviews/[slug]`, `/compare/[pair]` |
| **Internal links in** | `/reviews/[slug]` (alternatives panel) |

#### 2A-8 — Affiliate Redirect

| Field | Value |
| --- | --- |
| **URL pattern** | `/go/[slug]` |
| **Data source** | `tools-enriched.json` (affiliate + affiliateUrl fields) |
| **Template** | `src/pages/go/[slug].astro` (bare HTML, noindex/nofollow) |
| **Purpose** | Track affiliate clicks then redirect to tool website |
| **Indexed?** | No (noindex + sitemap excluded) |

---

### System B: Content Articles (Secondary)

Data source: `src/content/{reddit,blog,threads,extensions,marketing}/`

**1 article currently live** (brand24-review.md). 5 collection routes defined, only `reddit` has content.

#### 2B-1 — Article Pages

| Field | Value |
| --- | --- |
| **URL pattern** | `/{collection}/[slug]` e.g. `/reddit/brand24-review` |
| **Data source** | `src/content/{collection}/*.md` (frontmatter + markdown body) |
| **Template** | `src/layouts/ArticleLayout.astro` → via `src/pages/{collection}/[...slug].astro` |
| **Purpose** | Long-form editorial articles: tool reviews, guides, category roundups |
| **Count** | 1 live (`/reddit/brand24-review`) |
| **Collections** | `reddit`, `blog`, `threads`, `extensions`, `marketing` |
| **Internal links out** | External affiliate links only (current); tag pages via footer tags |
| **Internal links in** | `/reddit/` listing, `/tags/brand24/` etc. |

#### 2B-2 — Article Collection Index Pages

| Field | Value |
| --- | --- |
| **URL pattern** | `/{collection}/` and `/{collection}/page/[page]` |
| **Data source** | `getCollection(collection, !draft)` from content files |
| **Template** | `src/layouts/CategoryLayout.astro` |
| **Purpose** | Paginated listing of articles in a collection |
| **Count** | 5 index pages (most empty), 1 with content (`/reddit/`) |

#### 2B-3 — Tag Pages

| Field | Value |
| --- | --- |
| **URL pattern** | `/tags/[tag]` |
| **Data source** | All content collections combined — tags from article frontmatter |
| **Template** | `src/pages/tags/[tag].astro` (inline, SiteHeader + SiteFooter) |
| **Purpose** | List all articles tagged with a specific tag |
| **Count** | 4 (brand24, social listening, reddit monitoring, review) |
| **Internal links in** | Article footer tags, article header tags |

---

### System C: Utility Pages

| Page | URL | Template | Purpose | Indexed? |
| --- | --- | --- | --- | --- |
| Homepage | `/` | `src/pages/index.astro` (MainLayout) | Tool discovery hub | ✅ |
| Search | `/search/` | `src/pages/search.astro` (MainLayout) | Search tool database | ❌ noindex |
| Compare Index | `/compare/` | `src/pages/compare/index.astro` (MainLayout) | Browse all compare pairs | ✅ |
| Click Stats | `/stats/` | `src/pages/stats.astro` (MainLayout) | Local analytics debug | ❌ noindex |
| 404 | `/404/` | `src/pages/404.astro` (MainLayout) | Not Found recovery | — |

---

## Section 3 — Discovery Paths

### 3A — Discovering Brand24 Review (`/reddit/brand24-review`)

| Path | Steps | Clicks | Status |
| --- | --- | --- | --- |
| Nav → Reddit → Brand24 card | SiteHeader "Reddit" → `/reddit/` → click card | 2 | ✅ Available (added D-015) |
| Tags | `/tags/brand24/` | — | Requires knowing tag; no nav entry point |
| Organic search | Google "brand24 review reddit" | 0 (off-site) | ✅ Indexed |
| Site search | `/search/` → "brand24" | 1 search | ❌ Not in search index (only tool DB) |
| Homepage | Anywhere on homepage | — | ❌ Not surfaced |

**Minimum click path:** Home → [Reddit nav] → /reddit/ → card → article = **2 clicks**

---

### 3B — Discovering Brand24 Tool Page (`/reviews/brand24`)

| Path | Steps | Clicks | Status |
| --- | --- | --- | --- |
| Search | Type "brand24" in search box | 1 | ✅ Tool DB indexed |
| Reviews index | `/reviews/` → filter/scroll | 1–2 | ✅ |
| Category | `/category/community-growth/` → scroll to Brand24 | 2 | ✅ (if Brand24 is in community-growth) |
| Homepage | Scroll to Popular Tools or Newest Tools | 1 | ✅ (if featured=true) |
| Best guide | `/best/[related]/` → Brand24 listed | 2 | ✅ (if in a best guide) |

**Minimum click path:** Search "brand24" → result = **1 click**

---

### 3C — Discovering Reddit Category (`/reddit/`)

| Path | Steps | Clicks | Status |
| --- | --- | --- | --- |
| Nav | SiteHeader "Reddit" | 1 | ✅ Available (added D-015) |
| Tag page | `/tags/reddit-monitoring/` → listed | — | Requires knowing tag |
| Homepage | — | — | ❌ Not surfaced |

**Minimum click path:** [Reddit nav] = **1 click**

---

## Section 4 — SEO Architecture

### BaseHead (applied to all pages via component)

- `<meta charset>`, `<meta viewport>`
- `<meta name="impact-site-verification">` (impact.com affiliate)
- `<meta name="google-site-verification">`
- `<link rel="canonical">`
- Open Graph: `og:type`, `og:title`, `og:description`, `og:image`, `og:url`
- Twitter Card
- Article schema: `article:published_time`, `article:tag` (when type=article)
- JSON-LD: Website schema (all pages), BreadcrumbList (when breadcrumbs provided), Article schema (article pages)
- `<link rel="sitemap">`, `<link rel="alternate" type="application/rss+xml">`

### Per Page Type SEO Strengths

| Page Type | Canonical | H1 | Breadcrumb | JSON-LD | Internal Links |
| --- | --- | --- | --- | --- | --- |
| Homepage | ✅ | ✅ | — | Website + Org | Popular Tools, Categories, Newest |
| Tool Review `/reviews/[slug]` | ✅ | ✅ | ✅ | Article + Breadcrumb | Alternatives, Compare, Best Guides |
| Category `/category/[slug]` | ✅ | ✅ | ✅ | Breadcrumb | Tool cards, Related categories |
| Best Guide `/best/[slug]` | ✅ | ✅ | ✅ | ItemList | Tool cards, Compare |
| Compare `/compare/[pair]` | ✅ | ✅ | ✅ | — | Tool reviews, /go/ |
| Alternatives `/alternatives/[slug]` | ✅ | ✅ | ✅ | — | Tool reviews, Compare |
| Article `/reddit/[slug]` | ✅ | ✅ | ✅ | Article + Breadcrumb | Tag pages (footer) |
| Tag `/tags/[tag]` | ✅ | ✅ | ✅ | Breadcrumb | Article cards |

### Internal Linking Structure

```
Homepage
├──→ /reviews/ (see all link)
├──→ /reviews/[slug] (popular + newest tool cards)
├──→ /category/[slug] (top 8 category cards)
├──→ /alternatives/[slug] (popular alternatives cards)
└──→ /best/ (nav link only)

/reviews/[slug]
├──→ /alternatives/[slug]
├──→ /compare/[pair] (up to 3 compare links)
├──→ /best/[slug] (related guides, up to 4)
├──→ /reviews/[prev] + /reviews/[next]
└──→ /go/[slug] (CTA affiliate)

/category/[slug]
├──→ /reviews/[slug] (all tools in grid)
└──→ /category/[other-slug] (related categories)

/best/[slug]
├──→ /reviews/[slug] (all ranked tools)
└──→ /compare/[pair] (top 3 compare pairs)

/reddit/[slug] (articles)
├──→ /tags/[tag] (footer tags)
└──→ External affiliate links (current gap: no internal tool links)

/tags/[tag]
└──→ /reddit/[slug] (article cards)
```

### SEO Gaps Identified

1. **Content articles don't link to tool pages.** Brand24 Review mentions Mention and Awario but has no internal links to `/reviews/mention` or `/reviews/awario`. Lost PageRank and topical authority signal.
2. **Tool pages don't link to content articles.** `/reviews/brand24` does not link to `/reddit/brand24-review`.
3. **Tag pages isolated.** No nav entry point — only reachable via article footer.
4. **Compare index not in nav/footer.** 439 programmatic pages with no direct nav path.
5. **RSS feed exists** but not promoted (auto-generated at `/rss.xml`).

---

## Section 5 — Recommended Architecture

```
┌─────────────────────────────────────────────────────┐
│                    HOMEPAGE /                        │
│   Featured Tools · Top Categories · Newest Tools    │
│   + Latest Articles (gap: currently missing)         │
└────────────┬────────────────┬────────────────────────┘
             │                │
     ┌───────▼──────┐  ┌──────▼──────────────────────┐
     │  TOOL DATABASE│  │  CONTENT ARTICLE SYSTEM      │
     └───────┬──────┘  └──────┬──────────────────────┘
             │                │
     ┌───────▼──────┐  ┌──────▼──────────────────────┐
     │  /category/  │  │  /reddit/ /blog/ /threads/   │
     │  11 taxonomy │  │  Article collection indexes  │
     │  categories  │  └──────┬──────────────────────┘
     └───────┬──────┘         │
             │          ┌──────▼──────────────────────┐
     ┌───────▼──────┐   │  /reddit/[slug] ARTICLE      │
     │ /category/   │   │  ArticleLayout               │
     │ [slug]       │   │  + footer tags               │
     └───────┬──────┘   └──────┬──────────────────────┘
             │                 │
     ┌───────▼──────┐  ┌───────▼───────┐
     │ /reviews/    │  │ /tags/[tag]   │
     │ [slug]       ◄──┤               │
     │ TOOL REVIEW  │  └───────────────┘
     └───┬──┬───┬───┘
         │  │   │
   ┌─────▼┐ │ ┌─▼──────────┐
   │/alts/│ │ │ /best/[slug]│
   │[slug]│ │ │ EDITORIAL   │
   └──────┘ │ └────────────┘
            │
     ┌──────▼──────────────┐
     │ /compare/[a-vs-b]   │
     │ 439 compare pairs   │
     └─────────────────────┘
                    │
     ┌──────────────▼──────┐
     │ /go/[slug]          │
     │ Affiliate redirect  │
     │ noindex/nofollow    │
     └─────────────────────┘

SEARCH /search/  ─────────── indexes tool database only
                              (gap: articles not indexed)
```

### Key Architecture Issues

| Issue | Impact | Severity |
| --- | --- | --- |
| Articles not in search index | Search "brand24 review" returns nothing | P1 |
| No cross-linking articles ↔ tool pages | Lost SEO authority, user can't navigate between systems | P1 |
| No "Latest Articles" on homepage | Content system invisible to most visitors | P1 |
| Tags not in nav or footer | Tag discovery requires reading an article first | P2 |
| Compare index not in nav | 439 pages not promoted | P2 |
| Article to tool internal links missing | Brand24 review mentions competitors without links | P2 |
| Footer hardcodes 2 best-guide links | Should be dynamic / broader | P3 |
