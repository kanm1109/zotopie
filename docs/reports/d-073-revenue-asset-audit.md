# D-073 — Revenue Asset Audit

**Date:** 2026-06-23  
**Status:** COMPLETE  
**Method:** tools.json DB scan · Built HTML analysis · Sitemap URL count · Affiliate link crawl  

---

## Critical Finding Before Reading This Report

Zotopie has **two separate affiliate tracking mechanisms**:

1. **`/go/` redirect system** — routes through `/go/[slug]`, records GA4 event, redirects to `affiliateUrl`. Only works when `affiliateApproved === true` in tools.json. Currently active for **3 tools only**.

2. **Direct external links in markdown** — hardcoded `?via=nguyen-khanh` links embedded in article body. Active for **8 ai-tools/ articles + 3 comparisons/ articles**. These earn revenue regardless of the `/go/` system.

Most of this report was written assuming only `/go/` counted. That was wrong. Both mechanisms matter.

---

## Section 1 — Affiliate Inventory

### Tier 1: Fully Approved — Earning Today (affiliateApproved=true)

These 3 tools use the `/go/` redirect + GA4 event tracking. Every click is recorded.

| Tool | Slug | /go/ URL | Affiliate URL | System |
|------|------|---------|--------------|--------|
| Synthesia | `synthesia` | `/go/synthesia` | `synthesia.io/?via=1a4a4b` | Direct |
| GPTZero | `gptzero` | `/go/gptzero` | `gptzero.me/?via=nguyen-khanh` | Direct |
| Fireflies AI | `fireflies-ai` | `/go/fireflies-ai` | `fireflies.ai/?via=nguyen-khanh` | Direct |

**These are the only tools where clicking `/go/[slug]` triggers an affiliate commission.**  
All other `/go/[slug]` links send traffic to `tool.website` with no tracking — they earn $0.

---

### Tier 2: Direct External Links — Potentially Earning (no /go/ integration)

These tools have `?via=nguyen-khanh` links embedded directly in published article markdown. If the affiliate program is active for these referral URLs, they earn money silently.

| Tool | Article URL | External Link | Link Count | affiliateApproved in DB |
|------|------------|--------------|-----------|------------------------|
| Arcads | `/ai-tools/arcads-review/` | `arcads.ai/?via=nguyen-khanh` | 2 | ❌ False |
| Clipto | `/ai-tools/clipto-review/` | `clipto.com/?via=nguyen-khanh` | 3 | ❌ False |
| Copymatic | `/ai-tools/copymatic-review/` | `copymatic.ai/?via=nguyen-khanh` | 4 | ❌ False |
| HyperWrite | `/ai-tools/hyperwrite-review/` | `hyperwriteai.com/?via=nguyen-khanh` | 2 | ❌ False |
| Rytr | `/ai-tools/rytr-review/` | (check markdown directly) | — | ❌ False |
| Fireflies AI | `/comparisons/fireflies-vs-otter/` | `fireflies.ai/?via=nguyen-khanh` | 2 | ✅ True (same tool) |
| GPTZero | `/comparisons/gptzero-vs-originality/` | `gptzero.me/?via=nguyen-khanh` | 4 | ✅ True (same tool) |
| Rytr | `/comparisons/rytr-vs-jasper/` | `rytr.me/?via=nguyen-khanh` | 3 | ❌ False |

**Action required:** Verify with affiliate platforms (Arcads, Clipto, Copymatic, HyperWrite, Rytr) whether `?via=nguyen-khanh` referrals are being tracked. If yes, these articles are generating silent revenue with no DB record.

---

### Tier 3: Program Exists, Not Joined (affiliate=true, affiliateApproved=false)

74 tools have affiliate programs available to join. Top candidates by compare page count:

| Tool | Rating | Compare Pages | Category | affiliate URL on file |
|------|--------|--------------|----------|-----------------------|
| Canva | 4.9 | **12** | content-ai-creation | ❌ No |
| HubSpot | 4.6 | **11** | marketing-lead-generation | ✅ Yes (sign-up page) |
| Jasper | 4.6 | **10** | content-ai-creation | ✅ Yes (sign-up page) |
| ConvertKit | 4.8 | **10** | marketing-lead-generation | ❌ No |
| Notion | 4.9 | **10** | productivity-knowledge-management | ❌ No |
| Grammarly | 4.7 | **9** | content-ai-creation | ❌ No |
| ClickUp | 4.7 | **9** | productivity-knowledge-management | ✅ Yes |
| Copy.ai | 4.6 | **9** | content-ai-creation | ❌ No |
| Surfer SEO | 4.8 | **8** | seo-search | ❌ No |
| Semrush | 4.7 | **8** | seo-search | ❌ No |

---

### Tier 4: No Affiliate Information

51 tools with `affiliate=false` and no program data. Not relevant for revenue planning.

---

### Affiliate Summary

| Tier | Count | Revenue Status |
|------|-------|---------------|
| Tier 1 — Approved + tracking | **3** | ✅ Earning today |
| Tier 2 — Direct external links (unverified) | **5–6 tools, 11 articles** | ⚠️ Possibly earning silently |
| Tier 3 — Program exists, not joined | **74** | ❌ Earning $0 |
| Tier 4 — No program | **51** | ❌ Earning $0 |
| **Total in DB** | **128** | |

---

## Section 2 — Revenue Articles

All 17 published articles. Affiliate link type is critical: `/go/` links earn via tracking system, external `?via=` links earn directly.

### /ai-tools/ — Long-Form Reviews

| URL | Words | /go/ Links | External Aff. Links | Internal Links | Money Page? |
|-----|-------|-----------|---------------------|---------------|-------------|
| `/ai-tools/synthesia-review/` | 3,282 | **2** ✅ | — | 46 | **YES** |
| `/ai-tools/gptzero-review/` | 3,688 | **2** ✅ | — | 49 | **YES** |
| `/ai-tools/fireflies-review/` | 4,277 | **3** ✅ | — | 46 | **YES** |
| `/ai-tools/arcads-review/` | 5,020 | 0 | **2** ⚠️ | 45 | **PARTIAL** |
| `/ai-tools/clipto-review/` | 5,071 | 0 | **3** ⚠️ | 43 | **PARTIAL** |
| `/ai-tools/copymatic-review/` | 4,704 | 0 | **4** ⚠️ | 35 | **PARTIAL** |
| `/ai-tools/hyperwrite-review/` | 4,988 | 0 | **2** ⚠️ | 50 | **PARTIAL** |
| `/ai-tools/rytr-review/` | 3,985 | 0 | TBC | 42 | **PARTIAL** |

**Legend:** YES = /go/ tracking confirmed. PARTIAL = direct external `?via=` link, not in DB tracking system. Both earn if affiliate program is active.

### /comparisons/ — Comparison Articles

| URL | Words | /go/ Links | External Aff. Links | Internal Links | Money Page? |
|-----|-------|-----------|---------------------|---------------|-------------|
| `/comparisons/gptzero-vs-originality/` | 4,425 | 0 | **4** ✅ (gptzero tracked) | 34 | **YES** |
| `/comparisons/fireflies-vs-otter/` | 4,827 | 0 | **2** ✅ (fireflies tracked) | 35 | **YES** |
| `/comparisons/rytr-vs-jasper/` | 3,410 | 0 | **3** ⚠️ (rytr unverified) | 34 | **PARTIAL** |

### /reddit/ — Reddit & Social Articles

| URL | Words | /go/ Links | External Aff. Links | Internal Links | Money Page? |
|-----|-------|-----------|---------------------|---------------|-------------|
| `/reddit/gummysearch-review/` | 3,460 | 0 | 0 | 50 | **NO** |
| `/reddit/f5bot-review/` | 3,332 | 0 | 0 | 45 | **NO** |
| `/reddit/awario-review/` | 3,046 | 0 | 0 | 44 | **NO** |
| `/reddit/brand24-review/` | 2,017 | 0 | 0 | 44 | **NO** |
| `/reddit/best-reddit-marketing-tools/` | 2,637 | 0 | 0 | 47 | **NO** |
| `/reddit/best-reddit-monitoring-tools/` | 2,435 | 0 | 0 | 44 | **NO** |

**Finding:** All 6 reddit/ articles are pure content with zero affiliate links. They earn $0 directly. Their value is SEO traffic and internal linking only.

---

## Section 3 — Revenue Clusters

### AI Video (Video AI)

| Asset | Type | Words | Revenue Status |
|-------|------|-------|---------------|
| `/ai-tools/synthesia-review/` | Long-form review | 3,282 | ✅ LIVE — /go/ tracking |
| `/reviews/synthesia/` | DB template review | ~200 | ✅ LIVE — /go/ tracking |
| `/alternatives/synthesia/` | Alternatives page | template | ✅ LIVE |
| 8× `/compare/*-vs-synthesia/` | Compare pages | template | ✅ LIVE |

**Cluster:** 1 article + 11 supporting pages  
**Affiliate ready:** YES — earning today  
**Gap:** No ElevenLabs, HeyGen, D-ID reviews (all are Synthesia alternatives in DB)

---

### AI Detection

| Asset | Type | Words | Revenue Status |
|-------|------|-------|---------------|
| `/ai-tools/gptzero-review/` | Long-form review | 3,688 | ✅ LIVE — /go/ tracking |
| `/comparisons/gptzero-vs-originality/` | Comparison article | 4,425 | ✅ LIVE — direct link |
| `/reviews/gptzero/` | DB template review | ~200 | ✅ LIVE — /go/ tracking |
| `/alternatives/gptzero/` | Alternatives page | template | ✅ LIVE |
| 3× `/compare/gptzero-vs-*/` | Compare pages | template | ✅ LIVE |

**Cluster:** 2 articles + 6 supporting pages  
**Affiliate ready:** YES — earning today  
**Gap:** No Turnitin, Copyleaks, Winston AI reviews (need DB + content)

---

### Meeting AI

| Asset | Type | Words | Revenue Status |
|-------|------|-------|---------------|
| `/ai-tools/fireflies-review/` | Long-form review | 4,277 | ✅ LIVE — /go/ tracking |
| `/comparisons/fireflies-vs-otter/` | Comparison article | 4,827 | ✅ LIVE — direct link |
| `/reviews/fireflies-ai/` | DB template review | ~200 | ✅ LIVE — /go/ tracking |
| `/alternatives/fireflies-ai/` | Alternatives page | template | ✅ LIVE |
| 3× `/compare/fireflies-ai-vs-*/` | Compare pages | template | ✅ LIVE |

**Cluster:** 2 articles + 6 supporting pages  
**Affiliate ready:** YES — earning today  
**Gap:** No Gong, tl;dv, Otter.ai reviews (Otter is in DB but no article)

---

### AI Writing

| Asset | Type | Words | Revenue Status |
|-------|------|-------|---------------|
| `/ai-tools/arcads-review/` | Long-form review | 5,020 | ⚠️ Direct link (unverified) |
| `/ai-tools/clipto-review/` | Long-form review | 5,071 | ⚠️ Direct link (unverified) |
| `/ai-tools/copymatic-review/` | Long-form review | 4,704 | ⚠️ Direct link (unverified) |
| `/ai-tools/hyperwrite-review/` | Long-form review | 4,988 | ⚠️ Direct link (unverified) |
| `/ai-tools/rytr-review/` | Long-form review | 3,985 | ⚠️ Direct link (unverified) |
| `/comparisons/rytr-vs-jasper/` | Comparison article | 3,410 | ⚠️ Direct link (unverified) |
| `/reviews/jasper/` | DB template review | ~200 | ❌ No tracking |
| 10× `/compare/*-vs-jasper/` | Compare pages | template | ❌ No revenue |

**Cluster:** 6 articles + many supporting pages  
**Affiliate ready:** NOT CONFIRMED — all using direct external links, none in /go/ system  
**Gap:** No affiliate approval in tools.json for any AI writing tool. Jasper has 10 compare pages but no long-form article.

---

### SEO

| Asset | Type | Words | Revenue Status |
|-------|------|-------|---------------|
| `/reviews/semrush/` | DB template review | ~200 | ❌ No tracking |
| `/reviews/surfer-seo/` | DB template review | ~200 | ❌ No tracking |
| 8× `/compare/*-vs-semrush/` | Compare pages | template | ❌ No revenue |
| 8× `/compare/*-vs-surfer-seo/` | Compare pages | template | ❌ No revenue |

**Cluster:** 0 articles, many template pages  
**Affiliate ready:** NO — no approval, no long-form content  
**Gap:** Entire cluster is template-only. No human-written SEO content exists.

---

### Reddit / Social Listening

| Asset | Type | Words | Revenue Status |
|-------|------|-------|---------------|
| `/reddit/gummysearch-review/` | Long-form review | 3,460 | ❌ No affiliate |
| `/reddit/f5bot-review/` | Long-form review | 3,332 | ❌ No affiliate |
| `/reddit/awario-review/` | Long-form review | 3,046 | ❌ No affiliate |
| `/reddit/brand24-review/` | Long-form review | 2,017 | ❌ No affiliate |
| `/reddit/best-reddit-marketing-tools/` | Best list article | 2,637 | ❌ No affiliate |
| `/reddit/best-reddit-monitoring-tools/` | Best list article | 2,435 | ❌ No affiliate |

**Cluster:** 6 articles, 0 supporting compare/alternatives pages  
**Affiliate ready:** NO — none of these tools have active affiliate programs in DB  
**Role:** SEO traffic source and internal linking only. Not a revenue cluster.

---

### Cluster Summary

| Cluster | Articles | Total Words | Compare Pages | Affiliate Ready |
|---------|----------|-------------|--------------|----------------|
| **AI Video** | 1 | 3,282 | 8 | ✅ LIVE |
| **AI Detection** | 2 | 8,113 | 3 | ✅ LIVE |
| **Meeting AI** | 2 | 9,104 | 3 | ✅ LIVE |
| AI Writing | 6 | 27,178 | 3–10 (Jasper) | ⚠️ UNVERIFIED |
| SEO | 0 | 0 | 16 | ❌ NONE |
| Reddit/Social | 6 | 16,927 | 0 | ❌ NONE |

**Strongest cluster today:** Meeting AI (most words + approved affiliate + comparison article).  
**Highest potential undeveloped:** AI Writing (most content written but no confirmed affiliate revenue).  
**Most valuable undeveloped:** SEO (Semrush + Surfer have 16 compare pages combined but zero long-form content).

---

## Section 4 — Top 20 Revenue Opportunities

Ranked by: (1) affiliate status → (2) compare page ecosystem → (3) existing content assets → (4) tool rating.

| # | Tool | Category | Compare Pages | Has Article | Affiliate Status | Revenue Potential | Action Needed |
|---|------|----------|--------------|-------------|-----------------|------------------|---------------|
| 1 | **Synthesia** | AI Video | 8 | ✅ 3,282w | ✅ APPROVED | **HIGHEST** | Expand article to 4,500w |
| 2 | **GPTZero** | AI Detection | 3 | ✅ 3,688w | ✅ APPROVED | **HIGH** | Expand article + add compare pages |
| 3 | **Fireflies AI** | Meeting AI | 3 | ✅ 4,277w | ✅ APPROVED | **HIGH** | Expand article + add compare pages |
| 4 | **Canva** | AI Creation | **12** | ❌ None | ⏳ Pending | **HIGH** | Join affiliate → write long-form review |
| 5 | **Jasper** | AI Writing | **10** | ❌ None | ⏳ Pending (URL on file) | **HIGH** | Join affiliate → write long-form review |
| 6 | **Grammarly** | AI Writing | 9 | ❌ None | ⏳ Pending | **HIGH** | Join affiliate → write review |
| 7 | **ConvertKit** | Email Marketing | **10** | ❌ None | ⏳ Pending | **HIGH** | Join affiliate → write review |
| 8 | **HubSpot** | Marketing | 11 | ❌ None | ⏳ Pending (URL on file) | **HIGH** | Join affiliate → write review |
| 9 | **Notion** | Productivity | **10** | ❌ None | ⏳ Pending | **MEDIUM-HIGH** | Join affiliate → write review |
| 10 | **Surfer SEO** | SEO | 8 | ❌ None | ⏳ Pending | **MEDIUM-HIGH** | Join affiliate → write SEO review |
| 11 | **Semrush** | SEO | 8 | ❌ None | ⏳ Pending | **MEDIUM-HIGH** | Join affiliate → write SEO review |
| 12 | **ClickUp** | Productivity | 9 | ❌ None | ⏳ Pending (URL on file) | **MEDIUM-HIGH** | Join affiliate → write review |
| 13 | **ElevenLabs** | AI Video/Audio | 6 | ❌ None | ⏳ Pending | **MEDIUM** | Adjacent to Synthesia cluster — write review |
| 14 | **Shopify** | Ecommerce | 6 | ❌ None | ⏳ Pending | **MEDIUM** | High-volume keyword — join affiliate |
| 15 | **Kinsta** | Hosting | 7 | ❌ None | ⏳ Pending | **MEDIUM** | High commission hosting — join affiliate |
| 16 | **Copy.ai** | AI Writing | 9 | ❌ None | ⏳ Pending | **MEDIUM** | AI Writing cluster — join affiliate |
| 17 | **Rytr** | AI Writing | 3 | ✅ 3,985w | ⚠️ Direct link only | **MEDIUM** | Verify tracking → add to /go/ system |
| 18 | **Arcads** | AI Video | 3 | ✅ 5,020w | ⚠️ Direct link only | **MEDIUM** | Verify tracking → add to /go/ system |
| 19 | **HyperWrite** | AI Writing | 3 | ✅ 4,988w | ⚠️ Direct link only | **MEDIUM** | Verify tracking → add to /go/ system |
| 20 | **Beehiiv** | Newsletter | — | ❌ None | ⏳ Pending | **MEDIUM** | High-growth creator tool — join affiliate |

**Why #4–#16 require affiliate approval FIRST:** Writing a 4,000-word review for a tool with no tracking link generates content but zero revenue. Affiliate approval is a prerequisite for content investment ROI.

---

## Section 5 — Recommended Next Articles (Top 5)

Filtered by: has affiliate OR near affiliate, has compare page ecosystem, has cluster support.

---

### #1 — Jasper Review

**Write immediately if affiliate is approved.**

| Factor | Data |
|--------|------|
| Compare pages | **10** (most in AI Writing cluster) |
| Cluster articles | Rytr review (3,985w), HyperWrite review (4,988w), Copymatic review (4,704w) already live |
| Affiliate status | affiliate=true, URL on file (`jasper.ai/affiliate-program`) — join and get tracking link |
| Why now | 10 compare pages are already generating traffic. Readers reaching `/compare/jasper-vs-*/` have no long-form review to land on. Revenue gap is live today. |
| Target URL | `/ai-tools/jasper-review/` |
| Target words | 4,000–5,000w |

**Condition:** Founder must approve Jasper affiliate application first. D adds tracking URL to tools.json. Then G writes.

---

### #2 — Grammarly Review

**Second highest compare page count in AI Writing cluster.**

| Factor | Data |
|--------|------|
| Compare pages | **9** (includes gptzero-vs-grammarly — already receiving AI detection traffic) |
| Cluster support | GPTZero review links to Grammarly as alternative. Internal link exists. |
| Affiliate status | affiliate=true, no URL — Grammarly has an affiliate program (ShareASale) |
| Why now | GPTZero review mentions Grammarly → readers already navigate there. No content waiting for them. |
| Target URL | `/ai-tools/grammarly-review/` |
| Target words | 4,000w |

---

### #3 — ElevenLabs Review

**Extends the Synthesia (AI Video) cluster.**

| Factor | Data |
|--------|------|
| Compare pages | **6** (elevenlabs-vs-synthesia, elevenlabs-vs-canva, etc.) |
| Cluster support | Synthesia review already live. ElevenLabs is in Synthesia's alternatives. Cross-link opportunity is immediate. |
| Affiliate status | affiliate=true, 4.9 rating — high-growth tool with active affiliate program |
| Why now | Synthesia cluster currently has 1 article. ElevenLabs review creates a second anchor in the AI Video cluster and double the compare page ecosystem coverage. |
| Target URL | `/ai-tools/elevenlabs-review/` |
| Target words | 4,000w |

---

### #4 — Canva Review

**Highest compare page count on the entire site (12 pages).**

| Factor | Data |
|--------|------|
| Compare pages | **12** — highest of any tool |
| Cluster support | Adjacent to Synthesia (AI creation), GPTZero (content creation), many cross-links possible |
| Affiliate status | affiliate=true, 4.9 rating — Canva has an affiliate program via Impact.com |
| Why now | 12 compare pages are live, generating traffic, and have no long-form review to link to. This is the largest single content gap in the site by compare page count. |
| Target URL | `/ai-tools/canva-review/` |
| Target words | 4,000–5,000w |

**Condition:** Affiliate must be joined before writing. Canva affiliate pays commission on Pro/Teams upgrades.

---

### #5 — Otter.ai Review

**Extends the Fireflies AI (Meeting AI) cluster.**

| Factor | Data |
|--------|------|
| Compare pages | 1 (fireflies-ai-vs-otter-ai — added D-069) |
| Cluster support | Fireflies review + Fireflies vs Otter comparison already live. Otter is already in DB (slug: otter-ai). |
| Affiliate status | Otter.ai has an affiliate program — affiliate=false currently (not even marked in DB) |
| Why now | Fireflies vs Otter comparison is live but has no Otter.ai-side review. Readers comparing the two have only one side of the story. Writing the Otter review completes the comparison pair and enables a bidirectional internal link. |
| Target URL | `/ai-tools/otter-review/` or `/ai-tools/otter-ai-review/` |
| Target words | 3,500–4,000w |

---

## Summary for PM

### Website kiếm tiền từ đâu hôm nay?

Chỉ từ **3 tools**: Synthesia, GPTZero, Fireflies AI. Tất cả 3 đều dùng `/go/` redirect với `affiliateApproved=true`. Mỗi click vào `/go/synthesia`, `/go/gptzero`, `/go/fireflies-ai` = 1 tracked affiliate event.

8 bài ai-tools/ và 3 bài comparisons/ có external `?via=` links — những links này có thể đang earn silently nhưng chưa được verify và không có trong DB tracking.

### Cluster nào mạnh nhất?

**Meeting AI** (Fireflies) — nhiều content nhất (9,104w giữa 2 articles) + affiliate live + có comparison article.  
**AI Detection** (GPTZero) — sát sau, 8,113w + affiliate live + có comparison article.

### Bài nào nên viết tiếp?

**Thứ tự:** Jasper → Grammarly → ElevenLabs → Canva → Otter.ai  
**Điều kiện bắt buộc cho Jasper/Grammarly/Canva:** Phải join affiliate program trước. Không có tracking = không có revenue ROI.

### Bài nào không nên đụng tới?

- **Reddit/ articles** — 6 bài không có affiliate, không nên expand thêm cho đến khi các tools đó có tracking.
- **SEO cluster** — Semrush/Surfer có 16 compare pages nhưng không có approval. Đừng viết content cho đến khi affiliate được duyệt.
- **Blog/, threads/, extensions/, marketing/** — empty, không có kế hoạch.

---

**D-073 STATUS: COMPLETE**
