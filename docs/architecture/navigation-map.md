# Navigation Map — Zotopie
**Date:** 2026-06-15 | **Audit D-016**

---

## Global Navigation (SiteHeader)

Present on: every page (sticky, `z-index: 100`)

```
Desktop (≥769px):
┌──────────────────────────────────────────────────────────────────────────┐
│  [Z] Zotopie    Home    Best Tools    Categories    Reviews    Reddit    [🔍 Search tools…  /]  │
└──────────────────────────────────────────────────────────────────────────┘

Tablet (≤768px):
┌──────────────────────────────────────────────────────┐
│  [Z] Zotopie    Home    Best Tools    Categories    Reviews    Reddit    [🔍]  │
└──────────────────────────────────────────────────────┘
(search box collapses → icon only)

Mobile (≤600px):
┌────────────────────────────────────┐
│  [Z] Zotopie                  [🔍] [☰]  │
└────────────────────────────────────┘
(nav links hidden → hamburger menu)

Mobile menu (expanded):
  Home
  Best Tools
  Categories
  Reviews
  Reddit
  Search Tools
```

**Nav link targets:**

| Label | URL | Content |
| --- | --- | --- |
| Home | `/` | Tool discovery homepage |
| Best Tools | `/best/` | 20 editorial "Best X" guides |
| Categories | `/category/` | 11 tool taxonomy categories |
| Reviews | `/reviews/` | 119 tool reviews |
| Reddit | `/reddit/` | Reddit content articles |
| Search (inline form) | `/search?q=` | Tool database search |
| Search (mobile icon) | `/search/` | Search page |

---

## Global Footer (SiteFooter)

Present on: every page

```
┌─────────────────────────────────────────────────────────┐
│  [Z] Zotopie                           Explore  Compare │
│  Expert software reviews, comparisons, ───────  ─────── │
│  and rankings — built for modern teams.All Reviews  Search Tools │
│                                        Best Tools   AI Writing  │
│                                        Categories   SEO Tools   │
│─────────────────────────────────────────────────────────│
│  © 2026 Zotopie                    [Affiliate disclosure] │
└─────────────────────────────────────────────────────────┘
```

**Footer link targets:**

| Column | Label | URL |
| --- | --- | --- |
| Explore | All Reviews | `/reviews/` |
| Explore | Best Tools | `/best/` |
| Explore | Categories | `/category/` |
| Compare | Search Tools | `/search/` |
| Compare | AI Writing | `/best/ai-writing-tools/` |
| Compare | SEO Tools | `/best/seo-tools/` |

**Footer gaps:** No link to `/reddit/`, `/tags/`, `/compare/`, `/alternatives/`, or any specific article.

---

## Homepage Sections

URL: `/`

```
[Hero: Search + tagline]
      ↓
[Popular Tools — 6 featured tools from tools-enriched.json where featured=true]
      ↓
[Top 8 Categories — highest tool count from taxonomies.json]
      ↓
[Newest Tools — 6 most recently added to tools-enriched.json]
      ↓
[Popular Alternatives — 6 tools most referenced as alternatives]
      ↓
[CTA — "Browse N Reviews"]
```

**Each section links to:**
- Popular Tools → `/reviews/[slug]`
- Top 8 Categories → `/category/[slug]`
- Newest Tools → `/reviews/[slug]`
- Popular Alternatives → `/alternatives/[slug]`

**Homepage does NOT surface:** content articles, tag pages, compare index, blog/threads/marketing/extensions

---

## Page Map — Full Site

```
/                          Homepage
│
├── /reviews/              All Tool Reviews (119 tools)
│   └── /reviews/[slug]    Individual Tool Review
│
├── /category/             All Tool Categories
│   └── /category/[slug]   Category Page (11 categories)
│
├── /best/                 All Editorial Guides
│   └── /best/[slug]       Best X Guide (20 guides)
│
├── /compare/              All Comparisons Index
│   └── /compare/[a-vs-b]  Tool Comparison (439 pairs)
│
├── /alternatives/
│   └── /alternatives/[slug]  Alternatives Page
│
├── /reddit/               Reddit Articles (1 article live)
│   ├── /reddit/[slug]     Article Page
│   └── /reddit/page/[n]   Paginated listing
│
├── /blog/                 Blog Articles (0 articles live)
│   ├── /blog/[slug]       Article Page
│   └── /blog/page/[n]     Paginated listing
│
├── /threads/              Threads Articles (0 live)
├── /extensions/           Extensions Articles (0 live)
├── /marketing/            Marketing Articles (0 live)
│
├── /tags/[tag]            Tag Pages (4 live)
│   ├── /tags/brand24
│   ├── /tags/social listening
│   ├── /tags/reddit monitoring
│   └── /tags/review
│
├── /search/               Tool Search (noindex)
├── /go/[slug]             Affiliate Redirect (noindex, ~119 pages)
├── /stats/                Click Analytics (noindex)
└── /404/                  Not Found
```

---

## Breadcrumb Trails

Every page except Homepage renders a BreadcrumbList both visually and as JSON-LD.

| Page | Breadcrumb |
| --- | --- |
| `/reviews/brand24` | Home › brand24 |
| `/category/seo-search` | Home › Category |
| `/best/ai-writing-tools/` | Home › Best Tools |
| `/compare/chatgpt-vs-claude` | Home › Compare |
| `/reddit/brand24-review` | Home › reddit › Brand24 Review |
| `/tags/brand24` | Home › Tags › #brand24 |

---

## Search Architecture

URL: `/search/` (noindex — discovery via nav search box or mobile icon)

**Indexed content:** `tools-enriched.json` only (119 tools)

**Search fields:** name, description, categories (from tools-enriched.json)

**NOT indexed:** content articles, best pages, alternatives pages, compare pages, tags

**Autocomplete:** Client-side JS against tool name + slug array (`slimTools`)

**Category filter chips:** Generated from `taxonomies.json` (11 tool taxonomy categories)

---

## Internal Link Density Map

High density (many inbound links):
- `/reviews/[slug]` — linked from homepage, category pages, best guides, compare pages, alternatives pages
- `/category/[slug]` — linked from homepage, nav, all tool review pages

Medium density:
- `/best/[slug]` — linked from nav, tool review pages (related guides)
- `/alternatives/[slug]` — linked from homepage, tool review pages

Low density:
- `/compare/[pair]` — linked from tool review pages, best guides, but no nav entry
- `/reddit/[slug]` — linked from `/reddit/` index only (+ tag pages)

Orphan risk:
- `/tags/[tag]` — only reachable via article footer tags or direct URL
- `/reddit/` and collection index pages — only via nav "Reddit" link (single entry point)
