# T4 — Traffic Tracking System

**Project:** Zotopie  
**Role:** Growth Engineer  
**Status:** Operational

---

## Overview

This document defines the full measurement stack for Zotopie: what to track, how to track it, and how to read the numbers weekly. The goal is to make traffic acquisition measurable and actionable, not just visible.

**Metrics that matter:**
1. Clicks (Google Search Console)
2. Visits + behavior (Google Analytics 4)
3. Conversions (affiliate click events)
4. Channel attribution (UTM system)

---

## 1. UTM Parameter System

Every external link pointing to Zotopie must carry UTM parameters. This makes channel attribution 100% reliable in GA4.

### UTM Schema

```
?utm_source=[source]&utm_medium=[medium]&utm_campaign=[campaign]&utm_content=[content]
```

### Source / Medium Reference

| Channel | `utm_source` | `utm_medium` | Example |
|---|---|---|---|
| Reddit post | `reddit` | `post` | `?utm_source=reddit&utm_medium=post` |
| Reddit comment | `reddit` | `comment` | `?utm_source=reddit&utm_medium=comment` |
| X thread | `x` | `thread` | `?utm_source=x&utm_medium=thread` |
| X single tweet | `x` | `tweet` | `?utm_source=x&utm_medium=tweet` |
| Product Hunt | `producthunt` | `launch` | `?utm_source=producthunt&utm_medium=launch` |
| X bio link | `x` | `bio` | `?utm_source=x&utm_medium=bio` |
| Email newsletter | `email` | `newsletter` | `?utm_source=email&utm_medium=newsletter` |
| Direct / unknown | (no UTM) | — | natural direct traffic |

### Campaign Naming Convention

| Context | `utm_campaign` format | Example |
|---|---|---|
| Compare thread | `compare-[pair]` | `compare-zapier-vs-make` |
| Best/authority post | `best-[slug]` | `best-seo-tools` |
| Review post | `review-[slug]` | `review-semrush` |
| Alternatives post | `alt-[slug]` | `alt-zapier` |
| Reddit subreddit | `r-[subreddit]` | `r-seo` |
| Product Hunt launch | `ph-launch-2025` | — |
| Category post | `category-[slug]` | `category-seo-search` |

### Content Field (optional, for A/B)

Use `utm_content` to distinguish variants:

```
?utm_content=hook-v1   ← first title variant
?utm_content=hook-v2   ← second title variant
```

### UTM Builder Quick Reference

```
Reddit post (r/SEO, best SEO tools page):
/best/seo-tools?utm_source=reddit&utm_medium=post&utm_campaign=r-seo&utm_content=best-seo-tools

X compare thread (Zapier vs Make):
/compare/zapier-vs-make?utm_source=x&utm_medium=thread&utm_campaign=compare-zapier-vs-make

Product Hunt (homepage):
/?utm_source=producthunt&utm_medium=launch&utm_campaign=ph-launch-2025

X bio link:
/?utm_source=x&utm_medium=bio&utm_campaign=profile
```

---

## 2. Google Analytics 4 Setup

### Events to Track

Beyond the GA4 defaults (page_view, session, engagement), configure these custom events:

#### Event 1: `affiliate_click`

Fires when a user clicks an affiliate/external tool link.

**Implementation in Astro review/compare/best pages:**

```astro
<a 
  href={tool.affiliateUrl || tool.url}
  target="_blank"
  rel="noopener"
  onclick={`gtag('event', 'affiliate_click', { tool_name: '${tool.name}', tool_slug: '${tool.slug}', page_type: 'review', page_url: window.location.href })`}
>
  Try {tool.name}
</a>
```

**GA4 event parameters:**
- `tool_name`: string — e.g., "HubSpot"
- `tool_slug`: string — e.g., "hubspot"
- `page_type`: string — "review" | "compare" | "best" | "alternatives"
- `page_url`: string — full URL

#### Event 2: `search_performed`

Fires when user submits the search form.

```js
// On search form submit
gtag('event', 'search_performed', {
  search_term: searchQuery,
  results_count: resultsCount
});
```

#### Event 3: `compare_initiated`

Fires when user clicks a "Compare" button (tool selection for comparison).

```js
gtag('event', 'compare_initiated', {
  tool_a: toolASlug,
  tool_b: toolBSlug
});
```

#### Event 4: `outbound_link`

Catch-all for any external link click (tool official site, not tracked as affiliate).

```js
gtag('event', 'outbound_link', {
  link_url: href,
  link_domain: domain
});
```

### GA4 Conversion Setup

Mark these events as **Conversions** in GA4 Admin → Events:

| Event | Why a Conversion |
|---|---|
| `affiliate_click` | Primary revenue signal |
| `search_performed` | High-intent engagement |

### GA4 Audiences to Create

| Audience | Definition | Use |
|---|---|---|
| High Intent | Visited 3+ pages in session | Retargeting pool |
| Affiliate Clickers | Triggered `affiliate_click` | Revenue attribution |
| Reddit Traffic | `utm_source = reddit` | Channel analysis |
| PH Launch Cohort | Sessions during PH launch window | Launch impact |

### GA4 Custom Dimensions (Admin → Custom Definitions)

| Dimension | Scope | Parameter | Example |
|---|---|---|---|
| Tool Name | Event | `tool_name` | "HubSpot" |
| Tool Slug | Event | `tool_slug` | "hubspot" |
| Page Type | Event | `page_type` | "compare" |

---

## 3. Google Search Console

### Setup

1. Verify Zotopie domain (DNS TXT record via Cloudflare)
2. Submit sitemap: `https://zotopie.com/sitemap-index.xml`
3. Set preferred domain in GSC settings

### Weekly Queries to Monitor

In GSC → Performance → Queries, filter by:

| Filter | What to Watch |
|---|---|
| Queries containing "vs" | Compare page ranking progress |
| Queries containing "best" | Authority page ranking progress |
| Queries containing "alternative" | Alternatives page ranking |
| Queries containing "review" | Review page clicks |
| CTR < 3% AND Position < 20 | Title tag optimization candidates |

### Click Tracking via GSC

GSC gives you **clicks, impressions, CTR, position** at the query level — use it to understand which pages are getting organic traffic and which are impressions-but-no-clicks (title/meta issue).

**Weekly export:** Download `Performance → Pages` CSV for pages with >100 impressions but <2% CTR — these need title/description optimization.

---

## 4. Affiliate Click Tracking

### Current State

As of BRAND-V1, approximately 49/119 tools have `affiliateUrl` populated in `tools-enriched.json`. The remaining 70 use the `url` field (official site, no affiliate tracking).

### Tracking Architecture

```
User clicks "Try [Tool]" button
→ Affiliate URL fires (tools-enriched.json: affiliateUrl)
→ GA4 affiliate_click event fires
→ Affiliate network records click (per-network dashboard)
→ GA4 + affiliate dashboard reconcile weekly
```

### Per-Network Dashboards

| Network | Tools | Dashboard |
|---|---|---|
| ShareASale | Various | app.shareasale.com |
| Impact | HubSpot, others | app.impact.com |
| PartnerStack | SaaS tools | app.partnerstack.com |
| Direct programs | Varies | Tool-specific portals |

### Affiliate Click KPIs

| Metric | Definition | Target (Month 3) |
|---|---|---|
| Total affiliate clicks | GA4 `affiliate_click` event count | 500/month |
| Affiliate click rate | affiliate_clicks / total_sessions | 8% |
| Top click tool | Highest `tool_name` in events | — |
| Revenue per click | Commission / total clicks | $1.50+ |

### Click Attribution Model

Use **last non-direct click** attribution in GA4 (default). This gives credit to the last channel before conversion (affiliate click).

---

## 5. Weekly Reporting Dashboard

Review every Monday morning. Takes 15 minutes.

### Weekly Scorecard Template

```
Week: [DATE RANGE]

--- TRAFFIC ---
Total sessions:          [N]   (vs last week: +/-%)
Organic (Google):        [N]   (vs last week: +/-%)  
Reddit referral:         [N]   (vs last week: +/-%)
X referral:              [N]   (vs last week: +/-%)
Product Hunt:            [N]   (launch week only)
Direct:                  [N]

--- ENGAGEMENT ---
Pages/session:           [N]
Avg session duration:    [Xm Ys]
Bounce rate:             [%]
Search events:           [N]

--- CONVERSIONS ---
Affiliate clicks total:  [N]
Top tool clicked:        [Tool name] ([N] clicks)
Affiliate click rate:    [%] of sessions

--- SEO (GSC) ---
Total clicks:            [N]   (vs last week: +/-%)
Total impressions:       [N]
Average CTR:             [%]
Average position:        [N]
Top gaining query:       [query] ([N] clicks)
Top losing query:        [query] ([N] clicks)

--- ACTIONS ---
[ ] Optimize underperforming title: [page]
[ ] Post Reddit thread: [topic]
[ ] Post X thread: [compare pair]
[ ] New content needed: [gap identified]
```

---

## 6. Monthly Review (First Monday of Month)

### Channel Performance Table

| Channel | Sessions | Affiliate Clicks | Click Rate | MoM Change |
|---|---|---|---|---|
| Organic Search | | | | |
| Reddit | | | | |
| X | | | | |
| Direct | | | | |
| Product Hunt | | | | |
| Total | | | | |

### Content Performance: Top 10 Pages

Pull from GA4: Pages and Screens report, sorted by Sessions.

| Page | Sessions | Avg Duration | Affiliate Clicks | Affiliate Rate |
|---|---|---|---|---|
| /best/seo-tools | | | | |
| /compare/zapier-vs-make | | | | |
| /reviews/[slug] | | | | |
| ... | | | | |

### GSC: Top 10 Ranking Queries

| Query | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| ... | | | | |

### Monthly Decision Rule

- If organic clicks grew >20%: double content output in winning categories
- If Reddit drives >10% of sessions: increase post frequency
- If affiliate click rate <5%: review CTA placement on top pages
- If a compare page is position 5–20 with >1% CTR: optimize title tag

---

## 7. Tracking Implementation Priority

### Phase 1 — Immediate (before any outbound posts)

- [ ] Add GA4 measurement ID to MainLayout.astro
- [ ] Verify GA4 tracking is firing on all pages
- [ ] Create `affiliate_click` event on all outbound tool links
- [ ] Submit sitemap to GSC
- [ ] Verify GSC domain ownership

### Phase 2 — Week 1

- [ ] Set up `affiliate_click` as a GA4 conversion
- [ ] Create UTM-tagged links for first Reddit posts
- [ ] Set up GSC weekly export reminder
- [ ] Create GA4 custom dimensions (tool_name, tool_slug, page_type)
- [ ] Set up first GA4 audience (High Intent: 3+ pages)

### Phase 3 — Month 1

- [ ] Build GA4 Exploration report for affiliate attribution by page
- [ ] Connect affiliate network dashboards to weekly review
- [ ] Set up GA4 → Google Sheets automated export (via Looker Studio or manual CSV)
- [ ] Create 90-day traffic baseline for future comparison

---

## 8. GA4 Implementation in MainLayout.astro

Add to `<head>` in `src/layouts/MainLayout.astro`:

```astro
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Replace `G-XXXXXXXXXX` with your GA4 Measurement ID from GA4 Admin → Data Streams → Web.

### Affiliate Click Event — Add to ToolCard, AltCard, Review pages

```js
// Add to any "Try [Tool]" or external tool link
function trackAffiliateClick(toolName, toolSlug, pageType) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'affiliate_click', {
      tool_name: toolName,
      tool_slug: toolSlug,
      page_type: pageType,
      page_url: window.location.href
    });
  }
}
```

In Astro component:

```astro
<a 
  href={tool.affiliateUrl || tool.url}
  target="_blank"
  rel="noopener noreferrer"
  onclick={`trackAffiliateClick('${tool.name}', '${tool.slug}', 'review')`}
>
  Try {tool.name} →
</a>
```

---

## 9. 90-Day Traffic Targets

| Metric | Day 30 | Day 60 | Day 90 |
|---|---|---|---|
| Monthly sessions | 500 | 2,000 | 5,000 |
| Organic sessions | 100 | 800 | 3,000 |
| Reddit sessions | 200 | 600 | 1,000 |
| X sessions | 100 | 300 | 600 |
| Monthly affiliate clicks | 40 | 160 | 400 |
| Affiliate click rate | 8% | 8% | 8% |
| GSC clicks/month | 50 | 500 | 2,000 |
| Average GSC position | 45 | 25 | 15 |

These targets assume: weekly Reddit posts (4/month), X threads (7/week), no paid traffic.
