# D-074 — Money Page Architecture Decision

**Date:** 2026-06-23  
**Status:** FINAL DECISION — DO NOT REVISIT  
**Owner:** D  
**Scope:** Which URL structure is Zotopie's primary money page system for the next 12 months

---

## Final Answer First

**Option B — `/reviews/` is the primary money page system.**

This document explains why. If you are reading this to confirm the decision before executing the roadmap, the answer is above. The rest of this document is the evidence.

---

## Option A — /ai-tools/ as Primary

### SEO Advantages

- Higher content depth per page today (3,282–5,071w vs ~200w in /reviews/)
- Unique article titles ("Is It Still the Best AI Video Generator?") vs template titles ("Pricing, Pros & Cons")
- Better signal for "best of" and question-based queries

### SEO Risks

- **URL format is wrong for scale.** `/ai-tools/synthesia-review/` — the `-review` suffix in the URL slug is redundant. The `/ai-tools/` prefix means it's a review. Clean URL: `/reviews/synthesia/`. Google's own documentation favors descriptive, clean URLs. The current format is `/ai-tools/synthesia-review/` — functionally a double descriptor.
- **Only 8 URLs in sitemap.** 8 /ai-tools/ entries vs 128 /reviews/ entries. Google crawls 128 /reviews/ pages regularly; /ai-tools/ is a small island.
- **Zero ecosystem links from templates.** Audit confirms: Astro templates (compare pages, alternatives pages) contain **0 hardcoded `/ai-tools/` references** and **38 `/reviews/` references**. Every compare page and every alternatives page currently links to `/reviews/[slug]/`, not `/ai-tools/[slug]-review/`. Choosing /ai-tools/ as primary requires rewriting every template.
- **Compare pages link to /reviews/, not /ai-tools/.** Sample audit: `/compare/gptzero-vs-grammarly/` has 9 links to `/reviews/` and 1 link to `/ai-tools/`. Choosing /ai-tools/ as primary means 458 compare pages are all sending internal link equity to the wrong URL.
- **Duplicate content problem continues.** Without redirecting /reviews/ to /ai-tools/, both URLs remain indexed, both self-canonical. The cannibalization problem identified in D-072 does not resolve — it just shifts which side is losing.

### Affiliate Advantages

None specific to /ai-tools/. The `/go/` redirect system reads `tool.affiliateApproved` and `tool.affiliateUrl` from tools.json. It does not care whether the CTA appears on `/ai-tools/` or `/reviews/`. Affiliate tracking is URL-agnostic.

### Maintenance Cost

**Very high.** Every new tool added to the DB auto-generates `/reviews/`, `/alternatives/`, and `/compare/` pages pointing to `/reviews/[slug]/`. To maintain /ai-tools/ as primary, every new long-form article must also be written. There is no auto-generation path for /ai-tools/. Each article requires: write markdown → place in `src/content/ai-tools/` → manually verify internal links → confirm cross-links in other articles. At 128 tools in DB, maintaining a long-form article for every tool at /ai-tools/ would require ~500,000+ words of content.

### Scalability

**Does not scale.** The DB system can grow to 500+ tools with zero additional writing. /ai-tools/ requires human-written content for every URL that should rank. This works for the top 5–10 money pages but cannot serve as the primary system for the entire site.

### Internal Linking Impact

**Requires total reconstruction.** Currently:
- 458 compare pages → all link to /reviews/
- 128 alternatives pages → all link to /reviews/
- Homepage → 38 links to /reviews/, 25 to /ai-tools/
- Astro templates → 38 /reviews/ references, 0 /ai-tools/ references

Switching to /ai-tools/ as primary means rewriting every Astro template, changing every compare page output, and changing every alternatives page output. That is 734+ auto-generated pages that would need to be redirected or rebuilt.

### Migration Requirements

If /ai-tools/ is chosen as primary:
1. Modify `src/pages/reviews/[slug].astro` to redirect to `/ai-tools/[slug]-review/`
2. Modify `src/pages/compare/[pair].astro` to link to `/ai-tools/` instead of `/reviews/`
3. Modify `src/pages/alternatives/[slug].astro` to link to `/ai-tools/` instead of `/reviews/`
4. Modify `src/pages/index.astro` (Editor's Picks links)
5. Write long-form articles for every tool that should have an /ai-tools/ page
6. 128 /reviews/ pages become orphaned or need 301 redirects

**Estimated effort: 40+ hours of template work + months of content writing.**

### Risk to Current Indexed URLs

**High.** 128 /reviews/ URLs are indexed, in sitemap, and receiving link equity from the ecosystem. Redirecting all of them triggers a 4–8 week re-indexing period where rankings for all 128 tools drop or disappear. During this period, revenue from Synthesia, GPTZero, and Fireflies AI (the only earning tools) is at risk.

---

## Option B — /reviews/ as Primary

### SEO Advantages

- **Clean URL structure.** `/reviews/synthesia/` is the canonical form for a review page. No redundant suffix. Matches what users type in search ("synthesia review site:zotopie.com" would return /reviews/synthesia/). Google prefers shorter, descriptive URLs.
- **Already receives ecosystem link equity.** 458 compare pages, 128 alternatives pages, and the homepage already point to /reviews/ with no template changes required. This internal link equity is real and accumulating today.
- **128 URLs indexed.** Google is already crawling and indexing 128 /reviews/ pages, which means the site has established crawl authority on this URL structure.
- **Sitemap priority 0.7.** The site's own `astro.config.mjs` assigns /reviews/ priority 0.7 vs /ai-tools/ default 0.5 — consistent signal to Google about which structure matters.
- **DB auto-generation.** Every new tool added to tools.json automatically creates a /reviews/[slug]/ page. New money pages can be created with zero content writing — just DB data entry.
- **Scales to 500+ tools.** /reviews/ can grow indefinitely from the DB without a corresponding content production burden.

### SEO Risks

- **Current /reviews/ pages are thin (~200w).** Template output is not competitive for high-volume review keywords. Google currently has thin content at the most important URLs. This is the primary weakness and the reason /ai-tools/ feels like a better choice.
- **Content migration required for 3 revenue tools.** Synthesia, GPTZero, Fireflies AI long-form content is currently at /ai-tools/. Until it is migrated to /reviews/, those review pages remain thin. This migration was planned in D-071.
- **Temporary ranking volatility.** Migrating content from /ai-tools/ to /reviews/ plus adding 301 redirects will cause a 4–6 week re-consolidation period. During this time, /ai-tools/ impressions fall, /reviews/ impressions may temporarily dip before rising with richer content.

### Affiliate Advantages

- **More CTAs per page.** The /reviews/ template generates 3 own-tool `/go/` CTAs + 3–4 compare-tool CTAs per page. The /ai-tools/ articles have 2–3 external `?via=` links. /reviews/ has more conversion surface.
- **Every tool in DB gets a /go/ CTA automatically.** When affiliateApproved is set to true for a new tool, the /reviews/ template immediately creates a page with multiple tracked CTAs. No article writing required to activate revenue tracking.
- **Compare ecosystem feeds /reviews/ directly.** 458 compare pages each link to 2 /reviews/ pages. Traffic from compare pages converts at /reviews/ — these are the highest-intent pages on the site (user is comparing, decision-ready).

### Maintenance Cost

**Low for DB tools. Medium for long-form content.** Adding a new tool to the DB automatically creates and maintains the /reviews/ page. Long-form content (when warranted for top money pages) is written once and migrated per D-071 plan.

### Scalability

**Scales to the full 128+ tool DB with zero additional work.** Adding a new tool to tools.json creates /reviews/, /alternatives/, and compare pages in one build. No per-URL writing required for DB-tier tools. Long-form content is reserved for top revenue tools only (currently 3, targeted 10+).

### Internal Linking Impact

**Zero ecosystem changes required.** The entire internal link structure — all 458 compare pages, all 128 alternatives pages, the homepage — already links to /reviews/. Choosing /reviews/ as primary requires no template edits at all.

### Migration Requirements

To make /reviews/ the complete primary system:

1. **For 3 revenue tools** (Synthesia, GPTZero, Fireflies AI): override `/reviews/[slug].astro` with static pages per D-071 plan. Move long-form content from /ai-tools/ markdown into /reviews/ rendering. Add 301 redirects for /ai-tools/ → /reviews/. Estimated effort: 4–8 hours.
2. **For 5 remaining /ai-tools/ articles** (Arcads, Clipto, Copymatic, HyperWrite, Rytr): optionally migrate or keep as supplemental content. Their /go/ integration is absent anyway. 301 redirect them after migration when ready.
3. **No ecosystem template changes.** Zero changes to compare pages, alternatives pages, or homepage links.

### Risk to Current Indexed URLs

**Managed and low.** /reviews/ pages stay live throughout. /ai-tools/ pages get 301 redirects, which pass full link equity to /reviews/. The only URLs at risk are the 8 /ai-tools/ pages, which currently have fewer inlinks (17–20) than the /reviews/ pages they will redirect to (32–72). Google will consolidate signals faster because the destination URL (/reviews/) already has more equity.

---

## Side-by-Side Comparison

| Factor | Option A (/ai-tools/) | Option B (/reviews/) |
|--------|----------------------|----------------------|
| Current ecosystem links | 17–20 inlinks (receive) | **32–72 inlinks (receive)** |
| Template hardcoding | 0 references in templates | **38 references in templates** |
| Auto-generation | ❌ None — manual only | ✅ Full DB auto-generation |
| URL format | `/ai-tools/synthesia-review/` (redundant) | **`/reviews/synthesia/`** (clean) |
| Pages in sitemap | 8 | **128** |
| Migration effort | 40+ hours (rebuild ecosystem) | **4–8 hours (3 static overrides)** |
| Ecosystem rebuild required | YES — all 734 ecosystem pages | **NO — zero changes** |
| CTAs per page | 2–3 external direct | **3 /go/ + 3–4 compare tools** |
| Scalability | Manual — one article per URL | **DB-driven — one JSON entry** |
| Revenue risk during migration | HIGH — 128 /reviews/ URLs at risk | **LOW — /reviews/ stays live** |
| Fits the DB system | ❌ No | **✅ Yes** |

---

## Final Recommendation

### Choice: **Option B — /reviews/**

### Justification

The /reviews/ URL structure is already the primary system by every structural measure: all templates link to it, all ecosystem pages point to it, it has 16× more sitemap entries, and the entire DB auto-generation pipeline produces it. Choosing /ai-tools/ as primary would require dismantling and rebuilding a working ecosystem at high effort and revenue risk, in order to make the smaller, manually-maintained URL structure the canonical one.

The only argument for /ai-tools/ is content depth. That argument evaporates when content migration is understood: the long-form content from /ai-tools/ can be placed at /reviews/ without changing the content itself. The words do not care which URL they live at. Moving 3 articles from `/ai-tools/[slug]-review/` to `/reviews/[slug]/` via static page overrides takes 4–8 hours. Rebuilding the ecosystem to point to /ai-tools/ would take 40+ hours and puts 128 currently-indexed URLs at risk.

The revenue system (the `/go/` redirect and `affiliateApproved` logic) is URL-agnostic. Synthesia's affiliate tracking works identically whether the CTA appears at `/reviews/synthesia/` or `/ai-tools/synthesia-review/`. Moving the content to /reviews/ does not change how revenue is earned.

### Why /ai-tools/ Must Be Rejected

/ai-tools/ cannot be the primary system because it cannot scale. It requires a human-written long-form article for every money page URL. At 128 tools in DB today, and a growth target of 200–300 tools over 12 months, /ai-tools/ as primary means writing 200–300 long-form articles. The /reviews/ DB system generates those pages automatically from structured data. Content writing is reserved for the top revenue tools where depth matters — not every tool in the DB.

Choosing /ai-tools/ also requires immediately dismantling 734 auto-generated ecosystem pages that are correctly functioning and driving traffic to /reviews/ today. There is no benefit that justifies this cost.

---

## Architecture Freeze

From this decision forward:

| Rule | Detail |
|------|--------|
| Primary money page URL | `/reviews/[slug]/` |
| Long-form content destination | `/reviews/[slug]/` (via static override, per D-071 plan) |
| /ai-tools/ role | 301 redirect source → `/reviews/[slug]/` (after content migration) |
| New tool onboarding | Add to `src/data/tools.json` → auto-generates /reviews/, /alternatives/, /compare/ |
| Long-form article triggers | Only for tools with `affiliateApproved=true` or imminent approval |
| Article placement | `src/content/ai-tools/[slug]-review.md` → migrated to /reviews/ override |
| No new /ai-tools/ articles | New long-form content must be written for /reviews/ display, not /ai-tools/ |

This architecture is frozen. No further discussion of /ai-tools/ vs /reviews/ is required.

---

**D-074 STATUS: FINAL DECISION ISSUED**
