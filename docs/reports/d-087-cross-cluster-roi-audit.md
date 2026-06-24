# D-087 — Cross-Cluster ROI Audit

**Date:** 2026-06-24
**Owner:** D
**Status:** FINAL — no implementation, audit only
**Purpose:** PM roadmap decision for next 30 days

---

## Data Sources

All figures derived from live codebase state as of this audit:

| Source | What it drives |
|--------|---------------|
| `src/content/ai-tools/` | Published review pages |
| `src/content/comparisons/` | Published comparison pages |
| `src/data/best-pages.json` | Best/pillar pages (21 entries) |
| `src/data/generated/tools-enriched.json` | Affiliate status per tool |
| `src/pages/go/[slug].astro` | Affiliate redirect system |

**Affiliate tier definitions used in this report:**

- **T1-LIVE** — `affiliateApproved: true` AND `affiliateUrl` set → tracking active, earning
- **T2-PEND** — `affiliateProgramExists: true` → program identified, not yet approved
- **T3-NONE** — `affiliate: true` in base data → program known to exist, not configured
- **T4-NONE** — `affiliate: false` → no affiliate program

---

## Cluster 1 — AI Detection

### Content Assets

| Type | Count | Pages |
|------|-------|-------|
| Reviews | 4 | GPTZero, Originality.ai, Copyleaks, Turnitin |
| Comparisons | 4 | GPTZero vs Originality.ai, Copyleaks vs GPTZero, Originality.ai vs Copyleaks, GPTZero vs Turnitin |
| Best Pages | 1 | Best AI Detection Tools (6 tools ranked) |
| **Total** | **9** | |

### Revenue Readiness

| Tool | Tier | Status |
|------|------|--------|
| GPTZero | **T1-LIVE** | `/go/gptzero` active → `gptzero.me/?via=nguyen-khanh` |
| Copyleaks | T2-PEND | PartnerStack network identified, not approved |
| Winston AI | T2-PEND | Direct program, not approved |
| Originality.ai | T4-NONE | No affiliate program |
| Turnitin | T4-NONE | No affiliate program |
| ZeroGPT | T4-NONE | No affiliate program |

**Active revenue paths:** 1 (GPTZero only)

### Content Gaps

- **Winston AI Review** — featured as #5 in pillar ("Best OCR Detection") with no supporting review page — orphaned reference
- **ZeroGPT Review** — featured as #6 in pillar ("Best Free Option") with no supporting review page — orphaned reference
- **Best AI Detectors for Teachers** — highest-volume use-case query, not covered
- **Best AI Detectors for Publishers** — Originality.ai's native audience, not covered
- **Copyleaks vs Turnitin** — both reviews exist, comparison missing
- **Winston AI vs GPTZero** — awaiting Winston AI Review

### Authority Score: 72 / 100

Most developed cluster on the site. 4 reviews cover the top tools. 4 comparisons create dense internal linking. 1 pillar anchors the cluster. Deductions: two orphaned pillar references (Winston AI, ZeroGPT), no use-case guides, Copyleaks vs Turnitin missing.

### Revenue Score: 35 / 100

Only 1 T1-LIVE tool. Revenue is actively earned from GPTZero CTAs across 9 pages. Copyleaks T2-PEND could become T1-LIVE with a PartnerStack application — would add a second revenue stream. Ceiling is limited while Originality.ai remains T4-NONE.

### Recommended Next Action

**Winston AI Review** — closes the orphaned pillar reference, enables Winston AI affiliate activation, and unlocks 2 downstream comparison pages.

---

## Cluster 2 — Meeting AI

### Content Assets

| Type | Count | Pages |
|------|-------|-------|
| Reviews | 1 | Fireflies |
| Comparisons | 1 | Fireflies vs Otter |
| Best Pages | 0 | — |
| **Total** | **2** | |

### Revenue Readiness

| Tool | Tier | Status |
|------|------|--------|
| Fireflies AI | **T1-LIVE** | `/go/fireflies-ai` active → `app.fireflies.ai/?via=nguyen-khanh` |
| Otter.ai | T4-NONE | No affiliate program |

**Active revenue paths:** 1 (Fireflies) — but only 2 pages reference it, and there is no pillar to drive discovery traffic.

### Content Gaps

- **Best Meeting AI Tools** *(critical)* — no pillar exists; Fireflies T1-LIVE has no hub driving organic discovery
- **Otter.ai Review** — featured in comparison without a standalone review
- **tl;dv Review** — rising challenger, searchable standalone tool
- **Fathom (meeting notes) Review** — popular alternative with freemium model
- **Best Meeting AI for Remote Teams** — use-case guide
- **Comparison pages**: Otter.ai vs Fireflies, Fathom vs Fireflies, tl;dv vs Otter

### Authority Score: 15 / 100

Thinnest active cluster on the site. 2 pages cannot form a topical authority signal. No pillar. Reviews for only 1 of 4 major tools in the category. Internal linking minimal (only Fireflies ↔ Fireflies vs Otter).

### Revenue Score: 30 / 100

Score is paradoxically higher than authority suggests: Fireflies is T1-LIVE, the affiliate redirect is configured, and it has a real commission URL. The revenue mechanism works — the problem is that the cluster is too thin to drive meaningful organic traffic. A single pillar page would immediately multiply the Fireflies revenue surface.

### Recommended Next Action

**Best Meeting AI Tools** (/best/meeting-ai-tools/) — a single JSON entry in `best-pages.json` creates a pillar page that immediately routes traffic toward the only T1-LIVE tool in this cluster. Highest immediate revenue ROI across the entire site.

---

## Cluster 3 — AI Writing

### Content Assets

| Type | Count | Pages |
|------|-------|-------|
| Reviews | 3 | Rytr, Hyperwrite, Copymatic |
| Comparisons | 1 | Rytr vs Jasper |
| Best Pages | 1 | Best AI Writing Tools (ChatGPT, Claude, Grammarly, Copy.ai, Jasper) |
| **Total** | **5** | |

### Revenue Readiness

| Tool | Tier | Status |
|------|------|--------|
| Rytr | T2-PEND | Program exists, not approved |
| Hyperwrite | T2-PEND | Program exists, not approved |
| Copymatic | T2-PEND | Program exists, not approved |
| Jasper | T3-NONE | Has program, not configured |
| Copy.ai | T3-NONE | Has program, not configured |
| ChatGPT | T4-NONE | No affiliate program |
| Claude | T4-NONE | No affiliate program |
| Grammarly | T3-NONE | Has program, not configured |

**Active revenue paths:** 0

### Content Gaps

Critical structural mismatch: the best page features ChatGPT, Claude, Jasper, Copy.ai, Grammarly — but none of these have dedicated review pages. The pillar is a dead end for readers wanting deeper analysis.

- **Jasper Review** — featured in `rytr-vs-jasper.md` without a standalone review (broken reference)
- **Copy.ai Review** — no review despite strong search volume
- **Grammarly Review** — very high search volume, T3-NONE affiliate (worth activating)
- **Jasper vs Copy.ai** — highest-volume AI writing comparison
- **Jasper vs Rytr** — already have comparison but missing Jasper review
- **Best AI Writing Tools for [use case]** — no segmented guides

### Authority Score: 22 / 100

3 reviews exist but cover the secondary tier (Rytr, Hyperwrite, Copymatic). The best page features tier-1 tools (ChatGPT, Claude, Jasper) with no supporting reviews. The `rytr-vs-jasper` comparison references a tool (Jasper) without a review — creates poor UX. Cluster lacks topical coherence.

### Revenue Score: 8 / 100

Zero T1-LIVE tools. Multiple T2-PEND tools with published reviews but no affiliate activation. The Synthesia review exists and Synthesia IS T1-LIVE (`/go/synthesia` active) — but Synthesia is Video AI, not AI Writing. No revenue from this cluster.

### Recommended Next Action

**Jasper Review** — resolves the `rytr-vs-jasper` broken reference, enables Jasper T3-NONE affiliate configuration, and gives the pillar a supporting spoke for its featured tool.

*Note: Activating Jasper affiliate (impact.com network) is a prerequisite before the review drives revenue.*

---

## Cluster 4 — SEO Tools

### Content Assets

| Type | Count | Pages |
|------|-------|-------|
| Reviews | 0 | — |
| Comparisons | 0 | — |
| Best Pages | 2 | Best SEO Tools, Best Free SEO Tools |
| **Total** | **2** | |

### Revenue Readiness

| Tool | Tier | Status |
|------|------|--------|
| Semrush | T3-NONE | Has affiliate program, not configured |
| Surfer SEO | T3-NONE | Has affiliate program, not configured |
| Rank Math | T3-NONE | Has affiliate program (recurring), not configured |
| Moz | T3-NONE | Has affiliate program, not configured |
| Ahrefs | T4-NONE | No public affiliate program |
| Screaming Frog | T4-NONE | No affiliate program |

**Active revenue paths:** 0

### Content Gaps

Entire editorial layer missing. The 2 best pages exist as JSON-driven templates with tool cards but no supporting reviews, comparisons, or use-case guides.

- **Semrush Review** — highest search volume + strong affiliate commissions (30% recurring via impact.com)
- **Surfer SEO Review** — popular tool, active affiliate program, AI content angle
- **Ahrefs vs Semrush** — highest-volume SEO comparison on the internet
- **Best SEO Tools for Bloggers**, **Best SEO Tools for Agencies** — use-case guides
- All comparison pages: Ahrefs vs Semrush, Surfer SEO vs Clearscope, Rank Math vs Yoast

### Authority Score: 12 / 100

Two JSON-driven best pages exist but have no editorial backing. Zero reviews, zero comparisons. The cluster is functionally a stub — the best pages list tools but provide no comparative depth that would signal topical authority to search engines or readers.

### Revenue Score: 5 / 100

Zero active programs. However: SEO tools have some of the highest affiliate commission rates in software ($6.67/sale for Semrush standard, 25-30% recurring for Surfer SEO). The revenue ceiling, once developed, is the highest of any cluster evaluated here. This is a long-term investment opportunity, not a 30-day sprint.

### Recommended Next Action

**Configure Semrush affiliate (impact.com) + publish Semrush Review** — this is the minimum viable step to begin earning from the SEO cluster. Cannot earn without activation.

---

## Cluster 5 — Social Media Tools

### Content Assets

| Type | Count | Pages |
|------|-------|-------|
| Reviews | 0 | — |
| Comparisons | 0 | — |
| Best Pages | 1 | Best Social Media Management Tools |
| **Total** | **1** | |

### Revenue Readiness

| Tool | Tier | Status |
|------|------|--------|
| Metricool | T3-NONE | Has affiliate program, not configured |
| Publer | T3-NONE | Has affiliate program, not configured |
| Buffer | T3-NONE | Has affiliate program, not configured |
| Agorapulse | T3-NONE | Has affiliate program, not configured |
| Later | T3-NONE | Has affiliate program, not configured |
| Hootsuite | T3-NONE | Has affiliate program, not configured |
| Sendible | T3-NONE | Has affiliate program, not configured |

**Active revenue paths:** 0

### Content Gaps

Complete editorial blank. All 9 social media tools have known affiliate programs but none are configured.

- **Metricool Review** — highest-rated freemium tool, strong SEO interest, T3-NONE
- **Buffer Review** — most-searched brand name in social scheduling
- **Publer Review** — featured prominently in best page
- **Buffer vs Hootsuite** — #1 comparison query in social media tools
- **Metricool vs Buffer** — high commercial intent
- **Best Social Media Tools for Small Businesses** — use-case guide

### Authority Score: 8 / 100

Single best page. No reviews, no comparisons, no use-case content. No cluster structure at all. Score reflects the page's existence but near-zero topical coverage.

### Revenue Score: 5 / 100

Zero active programs despite 9 tools with known affiliate availability. Requires simultaneous affiliate activation + content creation before any revenue flows. 30-day horizon may not be sufficient for full cluster development.

### Recommended Next Action

**Configure Buffer affiliate + publish Buffer Review** — Buffer has the highest name recognition for social scheduling searches, simplest affiliate setup, and a freemium model that makes CTAs natural.

---

## Cluster Comparison Matrix

| Cluster | Reviews | Comparisons | Best Pages | T1-LIVE Tools | Authority | Revenue |
|---------|---------|-------------|-----------|--------------|-----------|---------|
| AI Detection | 4 | 4 | 1 | 1 (GPTZero) | 72/100 | 35/100 |
| Meeting AI | 1 | 1 | 0 | 1 (Fireflies) | 15/100 | 30/100 |
| AI Writing | 3 | 1 | 1 | 0 | 22/100 | 8/100 |
| SEO Tools | 0 | 0 | 2 | 0 | 12/100 | 5/100 |
| Social Media | 0 | 0 | 1 | 0 | 8/100 | 5/100 |

**Critical observation:** Two clusters have T1-LIVE tools (AI Detection, Meeting AI). Both are earning. All other clusters earn nothing. The 30-day roadmap should prioritize content that multiplies existing T1-LIVE revenue before opening new clusters.

---

## Final Recommendation — Top 5 Next Content Opportunities

| Rank | Page | Cluster | Revenue Driver | Effort |
|------|------|---------|---------------|--------|
| **1** | **Best Meeting AI Tools** | Meeting AI | Fireflies T1-LIVE — existing affiliate URL, no pillar routing traffic to it | Low (JSON entry + content block) |
| **2** | **Best AI Detectors for Teachers** | AI Detection | GPTZero T1-LIVE — highest-volume use-case query in AI detection | Medium (new guide page) |
| **3** | **Winston AI Review** | AI Detection | Closes orphaned pillar reference; enables Winston AI T2→T1 activation | Medium (standard review) |
| **4** | **Synthesia Review expansion** | AI/Video | Synthesia is T1-LIVE (`/go/synthesia` active) — existing review needs CTAs validated and comparison pages added | Low-Medium |
| **5** | **Jasper Review** | AI Writing | Breaks the `rytr-vs-jasper` broken reference; prerequisite for Jasper affiliate activation | Medium |

### Rationale

**#1 — Best Meeting AI Tools**
Fireflies already has an approved affiliate URL. The cluster earns zero revenue from non-review traffic because there is no pillar to capture "best meeting AI" searches. One JSON entry in `best-pages.json` creates a data-driven pillar page (same template as Best AI Detection Tools) at minimal effort. Revenue is immediate.

**#2 — Best AI Detectors for Teachers**
GPTZero has an active affiliate URL. Teachers searching for "best AI detectors for teachers" have high purchase intent (they need a tool for the classroom). This page would sit above the existing cluster as a use-case hub, linking back to GPTZero review, Turnitin review, and the main pillar.

**#3 — Winston AI Review**
Winston AI is referenced in the Best AI Detection Tools pillar with the label "Best OCR Detection" but has no review. This is a broken editorial promise to the reader. Publishing the review closes the orphaned reference, enables the T2-PEND Winston AI direct affiliate to be activated, and unlocks the Winston AI vs GPTZero comparison.

**#4 — Synthesia Review CTA audit**
Synthesia is T1-LIVE (`/go/synthesia` active with `synthesia.io/?via=1a4a4b`). The review exists but has not been audited for CTA placement post-D-085. A 30-minute CTA audit and Synthesia comparison page (Synthesia vs HeyGen) would be quick revenue wins without new research.

**#5 — Jasper Review**
The `rytr-vs-jasper.md` comparison references Jasper without a standalone review. Readers clicking on Jasper in that comparison hit the template review page with generic data, not editorial content. A dedicated Jasper review resolves this, activates the Jasper T3-NONE affiliate path, and gives the AI Writing cluster its first tier-1 tool review.

---

## 30-Day Roadmap Allocation (Suggested)

| Week | Action | Expected Output |
|------|--------|----------------|
| Week 1 | G writes Best Meeting AI Tools + Best AI Detectors for Teachers | 2 pillar/guide pages → 2 T1-LIVE revenue paths active |
| Week 2 | G writes Winston AI Review + D publishes | Pillar gap closed, Winston affiliate T2-PEND available for activation |
| Week 3 | D audits Synthesia CTAs + G writes Synthesia vs HeyGen comparison | Third T1-LIVE tool fully monetized |
| Week 4 | G writes Jasper Review + D activates Jasper affiliate | AI Writing cluster gets first tier-1 review, affiliate path opens |

**Revenue state after 30 days (projected):**
- T1-LIVE tools earning: GPTZero, Fireflies, Synthesia (3 vs 2 today if Synthesia CTA audit confirms CTAs active)
- New review pages: 2-3
- New pillar/guide pages: 2
- Pending activations: Winston AI, Jasper, Copyleaks (PartnerStack)

---

*Report generated: 2026-06-24. No pages created. No code changed.*
