# User Journey Map — Zotopie
**Date:** 2026-06-15 | **Audit D-016**

---

## Journey 1 — Tool Researcher ("Which social listening tool should I use?")

**Goal:** Find and compare social listening tools
**Entry:** Google → Zotopie homepage

```
[Google: "best social listening tools 2026"]
          ↓
[Homepage /]                                         Click 0
  → Hero search: type "social listening"
          ↓
[Search results /search?q=social+listening]          Click 1
  → Brand24 appears as tool card
          ↓
[/reviews/brand24]                                   Click 2
  → Reads overview, pros/cons, pricing, rating 4.3
  → Sees "Alternatives" panel: Mention, Awario
          ↓
[/alternatives/brand24]  OR  [/compare/brand24-vs-mention]   Click 3
  → Compares Brand24 vs Mention
          ↓
[/go/brand24]  (or /go/mention)                      Click 4
  → Affiliate redirect to tool website
```

**Total clicks to conversion: 4**
**Conversion path quality: ✅ Good**

---

## Journey 2 — Article Reader ("I want to read the Brand24 Review")

**Goal:** Find and read the Brand24 editorial review article
**Entry:** Direct navigation from homepage

```
[Homepage /]                                         Click 0
  → Clicks "Reddit" in nav
          ↓
[/reddit/]                                           Click 1
  → Sees Brand24 Review card (only article)
          ↓
[/reddit/brand24-review]                             Click 2
  → Reads full review article
  → Clicks affiliate link in article
          ↓
[External: brand24.com]                              Click 3
```

**Total clicks to article: 2**
**Conversion path quality: ✅ Satisfactory (after D-015 nav fix)**

---

## Journey 3 — Category Browser ("Show me all SEO tools")

**Goal:** Browse all tools in SEO category
**Entry:** Homepage

```
[Homepage /]                                         Click 0
  → Clicks "Categories" in nav
          ↓
[/category/]                                         Click 1
  → Sees 11 category cards, clicks "SEO & Search"
          ↓
[/category/seo-search]                               Click 2
  → Top Rated: 3 tools
  → Full grid: remaining tools
  → Each card → /reviews/[slug]
          ↓
[/reviews/ahrefs] (or semrush, etc.)                 Click 3
```

**Total clicks to tool: 3**
**Conversion path quality: ✅ Good**

---

## Journey 4 — Best Guide Reader ("What's the best email marketing tool?")

**Goal:** Find an authoritative ranked list
**Entry:** Google → Best guide page

```
[Google: "best email marketing tools 2026"]
          ↓
[/best/email-marketing-tools]                        Click 0 (organic)
  → Ranked list: #1 Mailchimp, #2 ConvertKit...
  → Clicks "Read Full Review" for #1
          ↓
[/reviews/mailchimp]                                 Click 1
  → Full review page
  → Clicks CTA: "Visit Mailchimp"
          ↓
[/go/mailchimp]                                      Click 2
  → Redirect to mailchimp.com
```

**Total clicks to conversion: 2 (from organic landing)**
**Conversion path quality: ✅ Excellent**

---

## Journey 5 — Comparison Searcher ("Brand24 vs Mention — which is better?")

**Goal:** Get a direct comparison between two tools
**Entry:** Google → Compare page

```
[Google: "brand24 vs mention"]
          ↓
[/compare/brand24-vs-mention]                        Click 0 (organic)
  → Side-by-side comparison table
  → Sees Brand24 wins on Reddit monitoring
  → Clicks winner's CTA
          ↓
[/go/brand24]                                        Click 1
  → Redirect to brand24.com
```

**Total clicks to conversion: 1 (from organic landing)**
**Conversion path quality: ✅ Excellent**

---

## Journey 6 — Tag Browser ("Show me all 'review' articles")

**Goal:** Find more editorial review articles
**Entry:** Reads Brand24 Review → clicks footer tag

```
[/reddit/brand24-review]                             Click 0
  → Footer: Tags: #brand24 #social listening #review
  → Clicks "#review" tag
          ↓
[/tags/review]                                       Click 1
  → Shows all articles tagged "review"
  → (Currently: only Brand24 Review itself)
```

**Path quality: ⚠️ Works, but tag pages only reachable from inside articles**
**Entry point: None from nav or homepage**

---

## Journey 7 — Mobile User ("Quick tool lookup on phone")

**Goal:** Search for a tool on mobile device
**Entry:** Homepage on mobile

```
[Homepage /] on 390px mobile                         Click 0
  → Taps [🔍] search icon (nav-s-mobile)
          ↓
[/search/]                                           Click 1
  → Types "seo" in search box
  → Category filters appear: SEO & Search chip
  → Taps chip → filters results
          ↓
[/reviews/ahrefs]                                    Click 2
  → Mobile-responsive tool review page
  → Scrolls to pricing table (horizontally scrollable)
  → Taps CTA
          ↓
[/go/ahrefs]                                         Click 3
```

**Total clicks to conversion: 3**
**Conversion path quality: ✅ Good — mobile responsive throughout**

---

## Journey 8 — 404 Recovery

**Goal:** User lands on deleted or misspelled URL
**Entry:** `/reddit/old-article-slug` (404)

```
[/reddit/deleted-article]  → 404 page
  Options shown:
  ├── "Go Home" → /
  ├── "Browse Reviews" → /reviews/
  └── "Browse Categories" → /category/
```

**Recovery path quality: ⚠️ Acceptable — but 404 doesn't offer "/reddit/" as recovery option for article URLs**

---

## Journey Summary Table

| Journey | Entry Point | Goal | Clicks | Quality |
| --- | --- | --- | --- | --- |
| 1 — Tool Research | Homepage | Find + compare tool | 4 | ✅ Good |
| 2 — Article Reader | Homepage nav | Read editorial review | 2 | ✅ Good (post D-015) |
| 3 — Category Browse | Homepage nav | Browse category | 3 | ✅ Good |
| 4 — Best Guide | Google organic | Find ranked list | 2 | ✅ Excellent |
| 5 — Comparison | Google organic | Compare two tools | 1 | ✅ Excellent |
| 6 — Tag Browse | Inside article | Find more articles | 1 | ⚠️ Isolated |
| 7 — Mobile Search | Homepage mobile | Quick tool lookup | 3 | ✅ Good |
| 8 — 404 Recovery | Broken link | Find alternative | 1 | ⚠️ Partial |

---

## Identified Journey Gaps

### Gap 1 — No cross-journey bridge (articles ↔ tools)
**Problem:** A user reading Brand24 Review cannot easily navigate to `/reviews/brand24` (the tool database entry) or to competing tools like Mention, Awario.
**Impact:** Lost navigation opportunity, broken user intent flow.
**Fix:** Add "See Brand24 in our tool database →" link in article, and "Read our editorial Brand24 review →" on `/reviews/brand24`.

### Gap 2 — Articles invisible from homepage
**Problem:** Homepage surfaces tools only. New visitors who land on homepage never see content articles.
**Impact:** Content system gets no organic discovery traffic from homepage.
**Fix:** Add "Latest Articles" or "Editorial Reviews" section to homepage.

### Gap 3 — Search doesn't return articles
**Problem:** Searching "brand24 review" in site search returns tool database entries, not the editorial article.
**Impact:** Search is unusable for content discovery.
**Fix:** Include content collection articles in search data.

### Gap 4 — Tag pages unreachable without reading an article
**Problem:** `/tags/review`, `/tags/brand24` etc. have no nav entry point.
**Impact:** These pages exist in sitemap but contribute no link equity.
**Fix:** Add tag cloud or "Topics" section to footer or sidebar.

### Gap 5 — 404 recovery doesn't know article context
**Problem:** 404 from `/reddit/old-slug` shows generic recovery links to `/reviews/` and `/category/` but not `/reddit/`.
**Fix:** Could be enhanced with context-aware 404 recovery (low priority).
