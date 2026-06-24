# D-081 — AI Detection Cluster Audit

**Date:** 2026-06-24  
**Status:** COMPLETE  
**Scope:** Full audit of AI Detection cluster after D-080 deployment  
**Trigger:** PM prerequisite before opening G-025  
**Deliverable:** Factual audit only — no implementation, no code changes

---

## Cluster Inventory (post D-077 / D-080)

| Tool | Slug | Tier | Affiliate Status |
|------|------|------|-----------------|
| GPTZero | `gptzero` | T1-LIVE | Earning — `/go/gptzero` active |
| Originality.ai | `originality-ai` | T4-NONE | No public program |
| Turnitin | `turnitin` | T4-NONE | Institutional B2B only |
| Copyleaks | `copyleaks` | T3-PEND | PartnerStack — not yet joined |
| Winston AI | `winston-ai` | T3-PEND | Direct — not yet joined |
| ZeroGPT | `zerogpt` | T4-NONE | No program |

**Total tools in cluster:** 6  
**Affiliate-eligible tools:** 1 live + 2 pending = 3  
**Affiliate-ineligible tools:** 3

---

## Section 1 — Internal Linking Audit

### 1.1 Inbound Links Per Page (from editorial content)

| URL | Inbound Links | Source Type |
|-----|--------------|-------------|
| `/comparisons/gptzero-vs-originality/` | 10 | Most-linked page in cluster |
| `/reviews/gptzero/` | 7 | Template page |
| `/ai-tools/gptzero-review/` | 5 | Long-form editorial |
| `/ai-tools/originality-ai-review/` | 4 | Long-form editorial |
| `/comparisons/copyleaks-vs-gptzero/` | 3 | Long-form editorial |
| `/ai-tools/copyleaks-review/` | 1 | Long-form editorial — WEAKEST |
| `/reviews/originality-ai/` | 0 | Template — orphan |
| `/reviews/copyleaks/` | 0 | Template — orphan |
| `/reviews/turnitin/` | 0 | Template — orphan |
| `/reviews/winston-ai/` | 0 | Template — orphan |
| `/reviews/zerogpt/` | 0 | Template — orphan |

### 1.2 Orphan Pages

**5 template pages with zero editorial inlinks:**
- `/reviews/originality-ai/`
- `/reviews/copyleaks/`
- `/reviews/turnitin/`
- `/reviews/winston-ai/`
- `/reviews/zerogpt/`

These pages exist and are indexed but receive no link equity from editorial content. They are reachable only via `/alternatives/` pages or direct navigation.

### 1.3 Broken Links

No broken internal links detected in published editorial content. All placeholder links from G-deliveries were resolved in D-078, D-079, D-080.

Previously broken patterns (`/reviews/gptzero-review/`, `/reviews/rytr-review/`) were corrected to canonical `/reviews/[slug]/` format.

### 1.4 Missing Link Opportunities

**Critical gaps (high inbound, low outbound):**

| Source Article | Missing Link Target | Priority |
|----------------|---------------------|----------|
| `/ai-tools/gptzero-review/` | `/go/gptzero` | CRITICAL (see Section 2) |
| `/ai-tools/copyleaks-review/` | `/reviews/copyleaks/` | HIGH — only 1 inbound link |
| `/ai-tools/copyleaks-review/` | `/comparisons/copyleaks-vs-gptzero/` | HIGH |
| `/ai-tools/originality-ai-review/` | `/reviews/originality-ai/` | MEDIUM |
| `/comparisons/copyleaks-vs-gptzero/` | `/ai-tools/copyleaks-review/` | MEDIUM |
| Any article | `/reviews/turnitin/`, `/reviews/winston-ai/`, `/reviews/zerogpt/` | LOW (thin templates) |

---

## Section 2 — Revenue Audit

### 2.1 Affiliate-Enabled Pages

Only GPTZero has an active affiliate relationship (T1-LIVE). The tracked redirect `/go/gptzero` leads to the GPTZero website with affiliate tracking.

### 2.2 CTA Audit Per Editorial Article

| Article | CTA Count | CTA Type | Revenue Impact |
|---------|-----------|----------|----------------|
| `/ai-tools/gptzero-review/` | **0** | None | **CRITICAL — zero CTAs on T1-LIVE page** |
| `/ai-tools/originality-ai-review/` | 2 | Direct → `https://originality.ai/` | Sends traffic, earns nothing |
| `/ai-tools/copyleaks-review/` | 2 | Direct → `https://copyleaks.com/` | Sends traffic, earns nothing |
| `/comparisons/gptzero-vs-originality/` | 3 | Tracked → `/go/gptzero` | ✅ Earns on click |
| `/comparisons/copyleaks-vs-gptzero/` | 2 | Direct → `https://copyleaks.com/` | Sends traffic, earns nothing |

### 2.3 Critical Revenue Gap

**`/ai-tools/gptzero-review/` has zero affiliate CTAs.**

This is the highest-potential revenue page in the cluster:
- GPTZero is the only T1-LIVE tool
- The review article is a commercial-intent page
- Users reading a product review are in purchase-consideration mode
- The `/go/gptzero` redirect already exists and works
- The omission means affiliate traffic from the review page is zero

The comparison article (`/comparisons/gptzero-vs-originality/`) correctly uses `/go/gptzero` in 3 CTAs. The review article does not link to `/go/gptzero` at all.

### 2.4 Pending Affiliate Programs

| Tool | Program | Network | Action Required |
|------|---------|---------|-----------------|
| Copyleaks | Yes | PartnerStack | Apply at `https://copyleaks.partnerstack.com` |
| Winston AI | Yes | Direct | Apply at `https://gowinston.ai/affiliate` |

Once approved, both tools will require CTA updates in their review articles (`copyleaks-review.md`, and future `winston-ai-review.md`).

---

## Section 3 — Content Depth Audit

### 3.1 Long-Form Editorial Content

| Article | URL Pattern | Word Count | Status |
|---------|-------------|------------|--------|
| Copyleaks vs GPTZero | `/comparisons/copyleaks-vs-gptzero/` | 5,932 | ✅ Strong |
| Originality.ai Review | `/ai-tools/originality-ai-review/` | 5,230 | ✅ Strong |
| Copyleaks Review | `/ai-tools/copyleaks-review/` | 4,673 | ✅ Adequate |
| GPTZero vs Originality | `/comparisons/gptzero-vs-originality/` | 4,639 | ✅ Adequate |
| GPTZero Review | `/ai-tools/gptzero-review/` | 3,742 | ⚠️ Shortest — below cluster average |

**Cluster average (long-form only):** 4,843 words  
**GPTZero review gap:** 1,101 words below average

### 3.2 Template-Only Pages (Thin Content)

| URL | Content Type | Word Depth |
|-----|-------------|------------|
| `/reviews/gptzero/` | Auto-template | ~400–600 words (structured data only) |
| `/reviews/originality-ai/` | Auto-template | ~400–600 words |
| `/reviews/copyleaks/` | Auto-template | ~400–600 words |
| `/reviews/turnitin/` | Auto-template | ~400–600 words |
| `/reviews/winston-ai/` | Auto-template | ~400–600 words |
| `/reviews/zerogpt/` | Auto-template | ~400–600 words |
| All `/compare/` pages (14) | Auto-template | ~300–500 words |
| All `/alternatives/` pages (6) | Auto-template | ~300–500 words |

Template pages serve as supplementary SERP coverage, not ranking anchors. None are suitable as primary money pages without long-form editorial.

### 3.3 Long-Form Coverage Gaps

No long-form content exists for:
- Turnitin (4th most-searched tool in cluster)
- Winston AI
- ZeroGPT
- Any Turnitin-specific comparison
- Any Winston AI-specific comparison

---

## Section 4 — SERP Coverage

### 4.1 Covered Keywords (Long-Form or Strong Template)

| Keyword Pattern | Covered By | Depth |
|-----------------|-----------|-------|
| `gptzero review` | `/ai-tools/gptzero-review/` + `/reviews/gptzero/` | Long-form + template |
| `originality ai review` | `/ai-tools/originality-ai-review/` + `/reviews/originality-ai/` | Long-form + template |
| `copyleaks review` | `/ai-tools/copyleaks-review/` + `/reviews/copyleaks/` | Long-form + template |
| `gptzero vs originality ai` | `/comparisons/gptzero-vs-originality/` + `/compare/gptzero-vs-originality-ai/` | Long-form + template |
| `copyleaks vs gptzero` | `/comparisons/copyleaks-vs-gptzero/` + `/compare/copyleaks-vs-gptzero/` | Long-form + template |
| `copyleaks vs originality ai` | `/compare/copyleaks-vs-originality-ai/` | Template only |
| `gptzero vs turnitin` | `/compare/gptzero-vs-turnitin/` | Template only |
| `copyleaks vs turnitin` | `/compare/copyleaks-vs-turnitin/` | Template only |
| `originality ai alternatives` | `/alternatives/originality-ai/` | Template only |
| `gptzero alternatives` | `/alternatives/gptzero/` | Template only |
| `copyleaks alternatives` | `/alternatives/copyleaks/` | Template only |

### 4.2 Missing High-Value Keywords

| Keyword | Estimated Intent | Gap Type |
|---------|-----------------|----------|
| `best ai detection tools` | Commercial | No `/best/ai-detection-tools/` page |
| `best ai content detector` | Commercial | Same — redirects to nothing |
| `turnitin review` | Commercial | Template only — no long-form |
| `turnitin alternatives` | Commercial | Template only |
| `turnitin vs copyleaks` | Commercial | Template only |
| `winston ai review` | Commercial | Template only — no long-form |
| `zerogpt review` | Commercial | Template only — no long-form |
| `free ai detector` | Informational | No dedicated content |
| `ai content detector comparison` | Informational | No hub/guide page |
| `how to detect ai writing` | Informational | No content |

**Biggest structural gap:** No `/best/ai-detection-tools/` page. This keyword pattern earns featured snippets and drives high-intent traffic across all 6 detection tools simultaneously.

---

## Section 5 — Best Page Readiness

**Verdict: YES — `/best/ai-detection-tools/` can be created today with no code changes.**

### Evidence

| Requirement | Status |
|------------|--------|
| `/best/[slug].astro` template exists | ✅ Confirmed |
| `src/data/best-pages.json` drives content | ✅ Confirmed (20 existing entries) |
| No code changes required — JSON entry only | ✅ Confirmed |
| 6 tools in cluster for toolSlugs array | ✅ Confirmed |
| Enough content exists for FAQs | ✅ Confirmed |
| At least 1 tool with affiliate link for revenue | ✅ GPTZero T1-LIVE |

### What's Needed

A single JSON entry in `src/data/best-pages.json` with this schema:
```json
{
  "slug": "ai-detection-tools",
  "h1": "Best AI Detection Tools in 2025",
  "metaTitle": "Best AI Detection Tools (2025) — Ranked & Reviewed",
  "metaDesc": "...",
  "intro": "...",
  "categorySlug": "content-ai-creation",
  "categoryName": "AI Detection",
  "toolSlugs": ["gptzero", "originality-ai", "copyleaks", "turnitin", "winston-ai", "zerogpt"],
  "rankLabels": { ... },
  "faqs": [ ... ]
}
```

No Astro template modification. No new page file. Build picks up the JSON entry automatically.

**Estimated new pages generated from this one entry:** 1 (the /best/ai-detection-tools/ page itself)

---

## Section 6 — Next Highest ROI Content

Ranked by estimated revenue impact × content effort × SERP opportunity. All recommendations are for G to write; D to publish.

| Rank | Content | URL | Rationale | Est. Words |
|------|---------|-----|-----------|------------|
| 1 | `/best/ai-detection-tools/` entry in best-pages.json | `/best/ai-detection-tools/` | Highest-intent keyword, captures all 6 tools, GPTZero CTA earns on click, zero code needed — JSON edit only | PM writes JSON, no G needed |
| 2 | Fix GPTZero review CTAs | `/ai-tools/gptzero-review/` | T1-LIVE tool with 0 affiliate CTAs — revenue leak, 5 inbound links, cheapest fix vs highest ROI | Edit only, no G needed |
| 3 | Turnitin Review (long-form) | `/ai-tools/turnitin-review/` | 4th most-searched tool in cluster, template-only now, "turnitin review" is high-volume educational keyword, cross-links to 4 existing compare pages | ~4,500 |
| 4 | Winston AI Review (long-form) | `/ai-tools/winston-ai-review/` | T3-PEND affiliate — long-form review positions site before approval, unlocks CTA update once approved | ~4,000 |
| 5 | Turnitin vs Copyleaks (long-form) | `/comparisons/turnitin-vs-copyleaks/` | Highest-volume compare pair not yet covered by long-form; template exists at `/compare/copyleaks-vs-turnitin/` | ~4,500 |

### Priority Matrix

```
                    HIGH REVENUE POTENTIAL
                            ↑
                            │
   Fix GPTZero CTAs  ★──────┤  Best Page JSON ★
   (edit, no G)      │      │  (PM edit, no G)
                     │      │
   ─────────────────-┤──────┼──────────────────
   LOW EFFORT        │      │       HIGH EFFORT
                     │      │
   Winston AI review │      │  Turnitin review ★
   (T3, build ahead) │      │  Turnitin vs Copyleaks ★
                     │      │
                            │
                            ↓
                    LOW REVENUE POTENTIAL
```

**Immediate actions (no G brief needed):**
1. Add `ai-detection-tools` entry to `best-pages.json` — PM can draft, D publishes
2. Add `/go/gptzero` CTAs to `gptzero-review.md` — D task, no G involvement

**Next G briefs:**
3. G-025: Turnitin Review (~4,500w)
4. G-026: Winston AI Review (~4,000w)
5. G-027: Turnitin vs Copyleaks comparison (~4,500w)

---

## Summary Dashboard

| Metric | Current State |
|--------|--------------|
| Total cluster tools | 6 |
| Long-form review articles | 3 (GPTZero, Originality.ai, Copyleaks) |
| Long-form comparison articles | 2 (GPTZero vs Originality, Copyleaks vs GPTZero) |
| Template-only pages (cluster) | 32 (6 reviews + 6 alternatives + 14 compare + 6 others) |
| Orphan pages (0 editorial inlinks) | 5 |
| Critical revenue gap | GPTZero review: 0 affiliate CTAs |
| Affiliate-earning tools | 1 (GPTZero T1-LIVE) |
| Affiliate-pending tools | 2 (Copyleaks T3, Winston AI T3) |
| Best page ready to publish | YES — JSON entry only needed |
| Missing top keyword | `best ai detection tools` |
| Next G brief recommended | G-025: Turnitin Review |

---

**D-081 STATUS: COMPLETE**  
**Report prepared for PM review. G-025 can now be opened.**
