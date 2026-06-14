# S1.1 — Growth Dashboard Specification

**Project:** Zotopie  
**Role:** Analytics Engineer  
**Date:** 2026-06-13  
**Status:** Operational

---

## Overview

This document defines the weekly and monthly measurement cadence for Zotopie. The goal: replace "I think traffic is growing" with "sessions grew 23% WoW driven by Reddit, and affiliate clicks are at 7.4% of sessions."

**Data sources:**
- **GA4** — sessions, events, conversions, acquisition
- **Google Search Console (GSC)** — organic clicks, impressions, CTR, position
- **Affiliate Network Dashboards** — confirmed commissions (cross-referenced with GA4 affiliate_click events)

---

## Weekly KPIs

**Review cadence:** Every Monday, 15–20 minutes. Log results in a spreadsheet or the template below.

### Traffic KPIs

| KPI | Definition | Data Source | Target (Month 1) | Target (Month 3) |
|---|---|---|---|---|
| **Weekly Sessions** | Total sessions, all sources | GA4 → Reports → Acquisition | 200 | 1,500 |
| **Organic Sessions** | Sessions from Google (no UTM, organic medium) | GA4 → Acquisition → Traffic → Organic | 20 | 800 |
| **Reddit Sessions** | Sessions where `utm_source = reddit` | GA4 → Acquisition → Traffic → filter Source = reddit | 50 | 400 |
| **X Sessions** | Sessions where `utm_source = x` | GA4 → Acquisition → Traffic → filter Source = x | 30 | 200 |
| **Direct Sessions** | Sessions with no source | GA4 → Direct channel | 50 | 200 |
| **WoW Session Growth** | (This week - last week) / last week | Calculated | +5% | +10% |

### Engagement KPIs

| KPI | Definition | Data Source | Target |
|---|---|---|---|
| **Pages / Session** | Average pages viewed per session | GA4 → Engagement | 2.5+ |
| **Avg Session Duration** | Average active time per session | GA4 → Engagement | 1m 30s+ |
| **Search Events** | Count of `search` events fired | GA4 → Events → search | 20+/week |
| **Top Search Terms** | Most frequent `search_term` param | GA4 → Events → search → search_term | Review weekly |
| **Zero-Result Searches** | `search` events where `results_count = 0` | GA4 → Explore → filter results_count = 0 | <10% of searches |

### Conversion KPIs

| KPI | Definition | Data Source | Target (Month 1) | Target (Month 3) |
|---|---|---|---|---|
| **Weekly Affiliate Clicks** | Count of `affiliate_click` events | GA4 → Conversions → affiliate_click | 20 | 150 |
| **Affiliate Click Rate** | affiliate_clicks / total_sessions | Calculated | 8% | 10% |
| **Top Clicked Tool** | Highest `tool_slug` in affiliate_click events | GA4 → Events → affiliate_click → tool_slug | — | — |
| **Top Clicked Category** | Category of top tools | Cross-reference tool_slug with category | — | — |

### SEO KPIs

| KPI | Definition | Data Source | Target (Month 1) | Target (Month 3) |
|---|---|---|---|---|
| **Organic Clicks** | Total clicks from Google Search | GSC → Performance → Total Clicks | 20 | 500 |
| **Total Impressions** | Pages shown in search results | GSC → Performance → Total Impressions | 500 | 10,000 |
| **Average CTR** | Clicks / Impressions | GSC → Performance | 2%+ | 3%+ |
| **Average Position** | Mean ranking position | GSC → Performance | <40 | <20 |
| **New Pages Indexed** | Pages added to Google's index this week | GSC → Coverage → Valid | Track delta | — |

---

## Weekly Scorecard Template

Copy and fill in every Monday:

```
═══════════════════════════════════════════
ZOTOPIE WEEKLY GROWTH SCORECARD
Week: [START_DATE] → [END_DATE]
═══════════════════════════════════════════

TRAFFIC
  Total sessions      : _____ (WoW: _____%)
  Organic (Google)    : _____ (WoW: _____%)
  Reddit              : _____ (WoW: _____%)
  X (Twitter)         : _____ (WoW: _____%)
  Product Hunt        : _____ (launch only)
  Direct              : _____

ENGAGEMENT
  Pages / session     : _____
  Avg session duration: _____ min _____ sec
  Search events fired : _____
  Top search term     : _____________________

CONVERSIONS
  Affiliate clicks    : _____
  Affiliate click rate: _____% 
  Top tool clicked    : _____________________
  Affiliate is_true % : _____% (affiliate links vs non-affiliate)

SEO (GSC)
  Organic clicks      : _____ (WoW: _____%)
  Impressions         : _____
  Average CTR         : _____%
  Average position    : _____
  Top gaining query   : _____________________
  Top losing query    : _____________________

ACTIONS THIS WEEK
  □ Reddit posts published  : _____ 
  □ X threads published     : _____
  □ Top page to optimize    : _____________________
  □ Next week priority      : _____________________
═══════════════════════════════════════════
```

---

## Monthly KPIs

**Review cadence:** First Monday of each month. 45–60 minutes. Compare to prior month.

### Monthly Traffic Report

| Metric | Formula | GA4 Location |
|---|---|---|
| Monthly sessions | Sum of all sessions in month | Reports → Acquisition → Overview |
| Organic session share | Organic sessions / total × 100 | Reports → Acquisition → Traffic |
| Reddit session share | Reddit sessions / total × 100 | Filter source = reddit |
| X session share | X sessions / total × 100 | Filter source = x |
| New users | Users with `first_visit` event | Reports → Acquisition → User |
| Returning users | Users without `first_visit` | Calculated |
| MoM growth | (This month - last month) / last month | Calculated |

### Monthly Channel Performance Table

| Channel | Sessions | % of Total | Affiliate Clicks | Affiliate Click Rate | MoM Change |
|---|---|---|---|---|---|
| Organic Search | | | | | |
| Reddit | | | | | |
| X | | | | | |
| Direct | | | | | |
| Product Hunt | | | | | |
| Other Referral | | | | | |
| **Total** | | 100% | | | |

### Monthly Content Performance

Pull from GA4: Explore → Blank → Dimensions: Page path, Sessions, Events. Sort by sessions.

#### Top 10 Pages by Sessions

| Page | Sessions | Avg Duration | Affiliate Clicks | Affiliate Rate |
|---|---|---|---|---|
| /reviews/... | | | | |
| /compare/... | | | | |
| /best/... | | | | |
| /alternatives/... | | | | |
| /category/... | | | | |

#### Top 10 Affiliate-Clicked Tools

Pull from GA4: Events → affiliate_click → Filter by `tool_slug` dimension.

| Tool | Affiliate Clicks | Is Affiliate Link | Page Sources |
|---|---|---|---|
| | | | |

### Monthly SEO Report

Pull from GSC: Performance → Pages (sorted by Clicks).

#### Top 10 Pages by Organic Clicks

| Page | Clicks | Impressions | CTR | Avg Position |
|---|---|---|---|---|
| | | | | |

#### Top 10 Queries

| Query | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| | | | | |

#### Pages in Position 5–20 with CTR < 3% (Title Optimization Candidates)

These are pages Google ranks but users don't click — the title/meta is underperforming.

| Page | Position | Impressions | CTR | Action |
|---|---|---|---|---|
| | | | | Rewrite title tag |

### Monthly Affiliate Reconciliation

Cross-reference GA4 with affiliate network dashboards:

| Network | GA4 affiliate_clicks | Network Reported Clicks | Discrepancy | Commissions Earned |
|---|---|---|---|---|
| ShareASale | | | | |
| Impact | | | | |
| PartnerStack | | | | |
| Direct programs | | | | |
| **Total** | | | | |

**Acceptable discrepancy:** GA4 may undercount by 5–15% (ad blockers, JS disabled users). Network numbers are authoritative for commission calculation.

---

## GA4 Dashboard Setup (Recommended Reports)

### Report 1: Traffic Overview

**GA4 Path:** Reports → Acquisition → Traffic Acquisition

**Columns to show:**
- Session source/medium
- Sessions
- New users
- Average engagement time
- Conversions (affiliate_click)
- Conversion rate

**Apply date comparison:** Current period vs. previous period.

---

### Report 2: Affiliate Click Analysis

**GA4 Path:** Explore → Blank Exploration

**Configuration:**
- Dimension 1: `Event name` (filter: affiliate_click)
- Dimension 2: Custom dimension `tool_slug`
- Dimension 3: Custom dimension `is_affiliate`
- Metric: Event count
- Breakdown: Session source/medium

**Purpose:** See which tools get the most clicks, from which channels, and whether affiliate links are being used correctly.

---

### Report 3: Search Intelligence

**GA4 Path:** Explore → Blank Exploration

**Configuration:**
- Dimension 1: `Event name` (filter: search)
- Dimension 2: Event parameter `search_term`
- Dimension 3: Event parameter `results_count`
- Metric: Event count

**Sort by:** Event count descending

**Purpose:** Discover what users search for that Zotopie doesn't have (zero results) and what they find (high-count searches with results).

---

### Report 4: Page-Type Funnel

**GA4 Path:** Explore → Funnel Exploration

**Funnel steps:**
1. Page path contains `/category/` → Category browsing
2. Page path contains `/reviews/` OR `/best/` OR `/compare/` → Tool discovery
3. Event = `affiliate_click` → Conversion

**Purpose:** See the drop-off between browsing categories → reading reviews → clicking affiliate links.

---

### Report 5: UTM Attribution Table

**GA4 Path:** Reports → Acquisition → Traffic Acquisition

**Filter:** Session campaign is not (not set)

**Shows:** All UTM-tagged traffic, which campaigns drive affiliate clicks.

---

## KPI Alerts (Set in GA4)

### Weekly Alerts to Configure

**GA4:** Admin → Custom Alerts

| Alert | Condition | Threshold | Frequency |
|---|---|---|---|
| Traffic spike | Sessions > baseline × 3 | Auto | Daily |
| Traffic drop | Sessions < baseline × 0.5 | Auto | Daily |
| Affiliate click drop | affiliate_click events < 5 | Weekly | Weekly |
| Zero-result search spike | search events with results_count=0 > 20% of searches | — | Weekly |

---

## 90-Day Growth Targets

### Traffic Trajectory

| Month | Sessions | Organic | Reddit | X | Direct |
|---|---|---|---|---|---|
| Month 1 | 500 | 50 | 200 | 100 | 150 |
| Month 2 | 1,500 | 300 | 500 | 300 | 400 |
| Month 3 | 4,000 | 1,200 | 1,000 | 600 | 800 |

### Conversion Trajectory

| Month | Affiliate Clicks | Click Rate | Est. Revenue |
|---|---|---|---|
| Month 1 | 40 | 8% | $40–80 |
| Month 2 | 120 | 8% | $120–240 |
| Month 3 | 320 | 8% | $320–640 |

*Revenue estimate: $1–2 per affiliate click at ~1–2% trial conversion × $50–100 average commission*

### SEO Trajectory

| Month | GSC Clicks | Impressions | Avg Position |
|---|---|---|---|
| Month 1 | 50 | 2,000 | 45 |
| Month 2 | 300 | 8,000 | 28 |
| Month 3 | 1,000 | 25,000 | 18 |

---

## Decision Rules

Apply these rules mechanically each week:

| Observation | Rule |
|---|---|
| Reddit drives >20% of sessions | Increase Reddit post frequency from 2 → 3/week |
| Reddit drives <5% of sessions | Audit post format — switch to Format C (question-bait) |
| Affiliate click rate <6% | Review CTA placement on top 5 pages; add inline "Try [Tool]" CTAs |
| Affiliate click rate >12% | Scale traffic — current conversion is strong |
| Search term has >10 events, tool doesn't exist in DB | Add that tool to expansion queue |
| Zero-result searches >15% | Add those tools OR improve search to suggest alternatives |
| Page at position 8–15 with <2% CTR | Rewrite title tag — add year, comparison angle, or specificity |
| Page at position 1–5 but low sessions | Impressions likely low — this page needs backlinks |
| Compare page gets >100 sessions/week organically | Write Reddit post + X thread based on that comparison |
| New authority page gets <10 sessions in first 2 weeks | Add internal links to it from relevant review pages |

---

## Measurement Stack Summary

| Tool | What It Measures | Access |
|---|---|---|
| Google Analytics 4 | Sessions, events, affiliate clicks, search, UTM attribution | analytics.google.com |
| Google Search Console | Organic clicks, impressions, positions, indexing | search.google.com/search-console |
| Affiliate Network Dashboards | Commissions earned, payout amounts | Per-network |
| Zotopie `/stats` page | Per-browser click debugging (owner only) | /stats |
| Cloudflare Analytics | CDN-level traffic (bots included, no JS required) | Cloudflare dashboard |

**Cloudflare Analytics is available immediately** (no setup needed) and serves as a sanity check against GA4. Cloudflare counts all requests including bots; GA4 is JS-dependent. Expect GA4 to show ~20% fewer "sessions" than Cloudflare shows "visits."
