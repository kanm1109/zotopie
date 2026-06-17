# Layout Consistency Audit — TASK D-008
**Date:** 2026-06-15

---

## Component Inventory

| Component | File | Design Era | Description |
| --- | --- | --- | --- |
| **SiteHeader** | `src/components/SiteHeader.astro` | ✅ NEW | Purple gradient logo, Plus Jakarta Sans, hamburger, inline search, keyboard shortcut |
| **Header** | `src/components/Header.astro` | ❌ OLD | Plain "Zotopie" text in accent blue, HeaderLink category nav, basic hamburger |
| **Footer** (component) | `src/components/Footer.astro` | ❌ OLD | Dark bg, "Software reviews and digital marketing insights", old category links, "All rights reserved" — no affiliate disclosure |
| **MainLayout footer** | `src/layouts/MainLayout.astro` (inline) | ✅ NEW | Multi-column, light bg, affiliate disclosure, brand links |

---

## Layout Files

| Layout | Header Used | Footer Used | SEO | Font | Status |
| --- | --- | --- | --- | --- | --- |
| `MainLayout.astro` | Inline (canonical SiteHeader design) | Inline (new footer) | Inline custom | Plus Jakarta Sans | ✅ CANONICAL |
| `ArticleLayout.astro` | `SiteHeader.astro` ✅ | `Footer.astro` ❌ | `BaseHead.astro` | Plus Jakarta Sans (Google Fonts link) | ⚠️ PARTIAL |
| `CategoryLayout.astro` | `Header.astro` ❌ | `Footer.astro` ❌ | `BaseHead.astro` | global.css default | ❌ FAIL |
| `BlogPost.astro` | `Header.astro` ❌ | `Footer.astro` ❌ | `BaseHead.astro` | Atkinson Hyperlegible | ❌ FAIL |

---

## Page-by-Page Audit

### Homepage
| Field | Value |
| --- | --- |
| **Route** | `/` |
| **Layout** | `MainLayout.astro` |
| **Header** | Inline SiteHeader-equivalent |
| **Footer** | Inline modern footer |
| **Status** | ✅ PASS |

---

### Reviews Index
| Field | Value |
| --- | --- |
| **Route** | `/reviews` |
| **Layout** | `MainLayout.astro` |
| **Header** | Inline |
| **Footer** | Inline modern footer |
| **Status** | ✅ PASS |

---

### Reviews Detail
| Field | Value |
| --- | --- |
| **Route** | `/reviews/[slug]` |
| **Layout** | `MainLayout.astro` |
| **Header** | Inline |
| **Footer** | Inline modern footer |
| **Status** | ✅ PASS |

---

### Category Index
| Field | Value |
| --- | --- |
| **Route** | `/category`, `/category/[slug]` |
| **Layout** | `MainLayout.astro` |
| **Header** | Inline |
| **Footer** | Inline modern footer |
| **Status** | ✅ PASS |

---

### Search
| Field | Value |
| --- | --- |
| **Route** | `/search` |
| **Layout** | `MainLayout.astro` |
| **Header** | Inline |
| **Footer** | Inline modern footer |
| **Status** | ✅ PASS |

---

### Best Tools Guides
| Field | Value |
| --- | --- |
| **Route** | `/best`, `/best/[slug]` |
| **Layout** | `MainLayout.astro` |
| **Header** | Inline |
| **Footer** | Inline modern footer |
| **Status** | ✅ PASS |

---

### Compare Pages
| Field | Value |
| --- | --- |
| **Route** | `/compare`, `/compare/[pair]` |
| **Layout** | `MainLayout.astro` |
| **Header** | Inline |
| **Footer** | Inline modern footer |
| **Status** | ✅ PASS |

---

### Alternatives Pages
| Field | Value |
| --- | --- |
| **Route** | `/alternatives/[slug]` |
| **Layout** | `MainLayout.astro` |
| **Header** | Inline |
| **Footer** | Inline modern footer |
| **Status** | ✅ PASS |

---

### Reddit Articles (detail)
| Field | Value |
| --- | --- |
| **Route** | `/reddit/[...slug]` |
| **Layout** | `ArticleLayout.astro` |
| **Header** | `SiteHeader.astro` ✅ |
| **Footer** | `Footer.astro` ❌ (old design) |
| **Status** | ⚠️ PARTIAL — header OK, footer wrong |

---

### Blog Articles (detail)
| Field | Value |
| --- | --- |
| **Route** | `/blog/[...slug]` |
| **Layout** | `ArticleLayout.astro` |
| **Header** | `SiteHeader.astro` ✅ |
| **Footer** | `Footer.astro` ❌ (old design) |
| **Status** | ⚠️ PARTIAL — header OK, footer wrong |

---

### Threads Articles (detail)
| Field | Value |
| --- | --- |
| **Route** | `/threads/[...slug]` |
| **Layout** | `ArticleLayout.astro` |
| **Header** | `SiteHeader.astro` ✅ |
| **Footer** | `Footer.astro` ❌ (old design) |
| **Status** | ⚠️ PARTIAL — header OK, footer wrong |

---

### Extensions Articles (detail)
| Field | Value |
| --- | --- |
| **Route** | `/extensions/[...slug]` |
| **Layout** | `ArticleLayout.astro` |
| **Header** | `SiteHeader.astro` ✅ |
| **Footer** | `Footer.astro` ❌ (old design) |
| **Status** | ⚠️ PARTIAL — header OK, footer wrong |

---

### Marketing Articles (detail)
| Field | Value |
| --- | --- |
| **Route** | `/marketing/[...slug]` |
| **Layout** | `ArticleLayout.astro` |
| **Header** | `SiteHeader.astro` ✅ |
| **Footer** | `Footer.astro` ❌ (old design) |
| **Status** | ⚠️ PARTIAL — header OK, footer wrong |

---

### Reddit Category Listing
| Field | Value |
| --- | --- |
| **Route** | `/reddit`, `/reddit/page/[page]` |
| **Layout** | `CategoryLayout.astro` |
| **Header** | `Header.astro` ❌ (old — plain blue text) |
| **Footer** | `Footer.astro` ❌ (old design) |
| **Status** | ❌ FAIL |

---

### Blog Category Listing
| Field | Value |
| --- | --- |
| **Route** | `/blog`, `/blog/page/[page]` |
| **Layout** | `CategoryLayout.astro` |
| **Header** | `Header.astro` ❌ |
| **Footer** | `Footer.astro` ❌ |
| **Status** | ❌ FAIL |

---

### Threads Category Listing
| Field | Value |
| --- | --- |
| **Route** | `/threads`, `/threads/page/[page]` |
| **Layout** | `CategoryLayout.astro` |
| **Header** | `Header.astro` ❌ |
| **Footer** | `Footer.astro` ❌ |
| **Status** | ❌ FAIL |

---

### Extensions Category Listing
| Field | Value |
| --- | --- |
| **Route** | `/extensions`, `/extensions/page/[page]` |
| **Layout** | `CategoryLayout.astro` |
| **Header** | `Header.astro` ❌ |
| **Footer** | `Footer.astro` ❌ |
| **Status** | ❌ FAIL |

---

### Marketing Category Listing
| Field | Value |
| --- | --- |
| **Route** | `/marketing`, `/marketing/page/[page]` |
| **Layout** | `CategoryLayout.astro` |
| **Header** | `Header.astro` ❌ |
| **Footer** | `Footer.astro` ❌ |
| **Status** | ❌ FAIL |

---

### Tags Page
| Field | Value |
| --- | --- |
| **Route** | `/tags/[tag]` |
| **Layout** | ❌ NONE — raw HTML, no layout component |
| **Header** | `Header.astro` ❌ |
| **Footer** | `Footer.astro` ❌ |
| **Status** | ❌ FAIL |

---

### About Page
| Field | Value |
| --- | --- |
| **Route** | `/about` |
| **Layout** | `BlogPost.astro` |
| **Header** | `Header.astro` ❌ |
| **Footer** | `Footer.astro` ❌ |
| **Status** | ❌ FAIL |

---

### Stats Page
| Field | Value |
| --- | --- |
| **Route** | `/stats` |
| **Layout** | `MainLayout.astro` |
| **Header** | Inline |
| **Footer** | Inline modern footer |
| **Status** | ✅ PASS |

---

### 404 Page
| Field | Value |
| --- | --- |
| **Route** | `/404` |
| **Layout** | `MainLayout.astro` |
| **Header** | Inline |
| **Footer** | Inline modern footer |
| **Status** | ✅ PASS |

---

### Tools Page (placeholder)
| Field | Value |
| --- | --- |
| **Route** | `/tools` |
| **Layout** | ❌ NONE — bare `<html><body>` |
| **Header** | None |
| **Footer** | None |
| **Status** | ❌ FAIL (placeholder, not production) |

---

### Go / Redirect Page
| Field | Value |
| --- | --- |
| **Route** | `/go/[slug]` |
| **Layout** | None (intentional) |
| **Header** | None (intentional) |
| **Footer** | None (intentional) |
| **Status** | N/A — redirect page, no nav required |

---

## Summary

| Status | Count | Routes |
| --- | --- | --- |
| ✅ PASS | 14 | /, /reviews, /category, /search, /best, /compare, /alternatives, /stats, /404 and variants |
| ⚠️ PARTIAL | 5 | /reddit/slug, /blog/slug, /threads/slug, /extensions/slug, /marketing/slug |
| ❌ FAIL | 13 | /reddit, /blog, /threads, /extensions, /marketing (listings + pagination), /tags, /about, /tools |
| N/A | 1 | /go/[slug] (redirect) |

---

## Root Cause Analysis

Two distinct design generations exist in the codebase:

| Generation | Files | Design |
| --- | --- | --- |
| **Gen 1 (old)** | `Header.astro`, `Footer.astro`, `BlogPost.astro` | Plain blue accent text, Atkinson/system font, dark footer |
| **Gen 2 (new)** | `MainLayout.astro`, `SiteHeader.astro` | Purple gradient, Plus Jakarta Sans, modern multi-column footer |

`CategoryLayout.astro` was built using Gen 1 components and was never updated when the design was overhauled. `ArticleLayout.astro` was partially updated (header → SiteHeader) but footer was not replaced.
