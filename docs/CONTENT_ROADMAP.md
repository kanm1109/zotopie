# CONTENT ROADMAP

**Date:** 2026-06-10  
**Role:** Content Operations Analyst  
**Source data:** `src/data/content-coverage-report.json` | `src/data/tools.json`  
**Objective:** Maximize website value with minimum AI generation cost

---

## Current State

| Field | Have | Missing | Coverage |
|---|---|---|---|
| overview | 28 / 119 | 91 | 23.5% |
| pros | 46 / 119 | 73 | 38.7% |
| cons | 46 / 119 | 73 | 38.7% |
| bestFor | 22 / 119 | 97 | 18.5% |
| alternatives | 119 / 119 | 0 | **100%** |
| verdict | 1 / 119 | 118 | 0.8% |

**Fully complete tools** (have all 4 content fields): ~22 tools — 18.5% of catalogue

---

## Category Analysis

| Category | Tools | Overview | Pros/Cons | BestFor | Complete% |
|---|---|---|---|---|---|
| seo-search | 9 | 7 / 9 | **9 / 9** | 1 / 9 | 78% |
| social-media-management | 11 | 3 / 11 | **11 / 11** | 3 / 11 | 45% |
| workflow-automation | 9 | 1 / 9 | **9 / 9** | 1 / 9 | 37% |
| content-ai-creation | 14 | 5 / 14 | 5 / 14 | 5 / 14 | 36% |
| marketing-lead-generation | 13 | 4 / 13 | 4 / 13 | 4 / 13 | 31% |
| community-growth | 11 | 2 / 11 | 2 / 11 | 2 / 11 | 18% |
| infrastructure-hosting | 12 | 3 / 12 | 3 / 12 | 3 / 12 | 25% |
| ecommerce-monetization | 13 | 3 / 13 | 3 / 13 | 3 / 13 | 23% |
| link-tracking | 9 | 0 / 9 | 0 / 9 | 0 / 9 | 0% |
| data-analytics | 9 | 0 / 9 | 0 / 9 | 0 / 9 | 0% |
| productivity-knowledge-management | 9 | 0 / 9 | 0 / 9 | 0 / 9 | 0% |

---

## Priority Scoring

Each category scored on 3 factors (1–5 each):

| Factor | Weight | Rationale |
|---|---|---|
| **Traffic potential** | 40% | Search demand for tools in this category |
| **Work efficiency** | 35% | Fields already partially done = cheaper to finish |
| **Commercial value** | 25% | Affiliate conversion likelihood |

### Scores

| Category | Traffic | Efficiency | Commercial | **Score** |
|---|---|---|---|---|
| seo-search | 5 | 5 | 5 | **5.0** |
| social-media-management | 4 | 5 | 4 | **4.35** |
| workflow-automation | 4 | 5 | 3 | **4.00** |
| content-ai-creation | 5 | 3 | 3 | **3.95** |
| productivity-knowledge-management | 5 | 1 | 2 | **2.95** |
| marketing-lead-generation | 4 | 3 | 5 | **3.90** |
| data-analytics | 4 | 1 | 3 | **2.80** |
| ecommerce-monetization | 3 | 3 | 5 | **3.50** |
| community-growth | 3 | 2 | 2 | **2.55** |
| infrastructure-hosting | 2 | 3 | 3 | **2.60** |
| link-tracking | 2 | 1 | 2 | **1.70** |

---

## Priority Groups

### Priority 1 — Complete partial coverage (quick wins)

**Logic:** Pros/cons already done for all tools in these 3 categories. Only overview + bestFor remain. Each tool here needs 2 fields, not 4. Highest ROI.

| Category | Tools | Missing overview | Missing bestFor | Generation units |
|---|---|---|---|---|
| seo-search | 9 | 2 (moz, ubersuggest) | 8 | **10** |
| social-media-management | 11 | 8 | 8 | **16** |
| workflow-automation | 9 | 8 | 8 | **16** |
| **P1 Total** | **29** | **18** | **24** | **42** |

**What ships after P1:** 29 tools with complete review pages (overview + pros + cons + bestFor). This is the fastest path to quality content.

**P1 tools list:**

*seo-search — need overview:* `moz`, `ubersuggest`  
*seo-search — need bestFor:* `semrush`, `moz`, `surfer-seo`, `rank-math`, `yoast-seo`, `screaming-frog`, `ubersuggest`, `clearscope`  

*social-media-management — need overview:* `hootsuite`, `sprout-social`, `later`, `metricool`, `publer`, `agorapulse`, `sendible`, `tailwind`  
*social-media-management — need bestFor:* same 8 tools above  

*workflow-automation — need overview:* `n8n`, `pabbly-connect`, `ifttt`, `tray-io`, `workato`, `integrately`, `celigo`, `make` (zapier already done)  
*workflow-automation — need bestFor:* same 8 tools + `zapier`

---

### Priority 2 — High-traffic categories, full generation

**Logic:** High search demand. Need all 4 fields per tool. Content-ai-creation and productivity tools are currently the highest-searched tool types on the internet.

| Category | Tools | Need full gen | Need partial gen | Generation units |
|---|---|---|---|---|
| content-ai-creation | 14 | 9 (no content) | 5 (need bestFor only) | **41** |
| marketing-lead-generation | 13 | 9 (no content) | 4 (need bestFor only) | **40** |
| productivity-knowledge-management | 9 | 9 (no content) | 0 | **36** |
| **P2 Total** | **36** | **27** | **9** | **117** |

**What ships after P2:** 65 tools with complete review pages — **54.6% catalogue coverage**

**P2 tools list:**

*content-ai-creation — full gen needed:* `chatgpt`, `claude`, `jasper`, `copy-ai`, `canva`, `midjourney`, `elevenlabs`, `grammarly`, `synthesia`  
*content-ai-creation — bestFor only:* `ahrefs` adjacent content tools (5 already have overview+pros+cons)  

*marketing-lead-generation — full gen needed:* `ghost`, `convertkit`, `activecampaign`, `hubspot`, `mailchimp`, `systeme-io`, `getresponse`, `brevo`, `beehiiv`  (and `clickfunnels`)  
*marketing-lead-generation — bestFor only:* 4 tools already partially done  

*productivity-knowledge-management — full gen:* `notion`, `clickup`, `monday`, `asana`, `trello`, `obsidian`, `airtable`, `todoist`, `coda`

---

### Priority 3 — Complete the catalogue

**Logic:** Lower per-tool traffic or more specialized audience. Important for completeness but not blocking.

| Category | Tools | Generation units | Recommended order |
|---|---|---|---|
| data-analytics | 9 | 36 | 3rd — Google Analytics, Hotjar have high search |
| ecommerce-monetization | 13 | 52 | 4th — high commercial value but Shopify already partially done |
| community-growth | 11 | 47 | 5th — Discord/Slack popular but less tool-comparison intent |
| infrastructure-hosting | 12 | 48 | 6th — developer audience, useful for completeness |
| link-tracking | 9 | 36 | Last — smallest niche, lowest general-audience demand |
| **P3 Total** | **54** | **219** | |

**P3 tools list:**

*data-analytics:* `google-analytics`, `plausible`, `hotjar`, `mixpanel`, `amplitude`, `fathom`, `matomo`, `crazy-egg`, `microsoft-clarity`  
*ecommerce-monetization:* `shopify`, `woocommerce`, `gumroad`, `lemon-squeezy`, `bigcommerce`, `wix`, `squarespace`, `sendowl`, `payhip`, `samcart` + 3 partial  
*community-growth:* `skool`, `circle`, `discord`, `patreon`, `mighty-networks`, `bettermode`, `slack`, `discourse` + 3 partial  
*infrastructure-hosting:* `cloudflare`, `digitalocean`, `vultr`, `hostinger`, `siteground`, `bluehost`, `namecheap`, `wp-engine`, `kinsta` + 3 partial  
*link-tracking:* `bitly`, `voluum`, `clickmagick`, `redtrack`, `rebrandly`, `tinyurl`, `blink`, `bemob`, `pretty-links`

---

## Strategic Recommendations

### 1. Category-by-category, not field-by-field

**Recommendation: generate one complete category at a time.**

| Approach | Pros | Cons |
|---|---|---|
| **Category-by-category** ✓ | Ships complete review pages early; easier to QA one category at a time; can publish incrementally | Slightly slower overall start |
| Field-by-field | Maximally parallelizable | Nothing ships until all fields across all tools are done; harder to QA |

Category-by-category wins because each finished category immediately produces deployable, linkable, shareable review pages. Field-by-field delays all value until the very end.

### 2. Pros/cons before overview (for zero-coverage categories)

**For Priority 2 and 3 categories with no existing content:**

Generate in this order within each category:
1. **pros + cons** (2 fields, structured, fastest to generate in batch)
2. **overview** (1 field, longer text, benefits from pros/cons context)
3. **bestFor** (1 field, short list, easiest to generate last)
4. **verdict** (1 field, defer to Phase 2 — requires editorial judgment)

**Rationale:**
- Pros/cons is the core user-facing content on a tool comparison site
- Structured format (5 items / 3 items) is the most batchable with AI
- Overview quality improves when written after pros/cons exist
- bestFor is a short list and easy to generate quickly

**Exception for P1 categories:** pros/cons already done → generate overview first (SEO meta description value), then bestFor.

### 3. Fastest path to 80% content coverage

**80% target = 95 tools with complete content (overview + pros + cons + bestFor)**

| Phase | Action | New complete tools | Cumulative |
|---|---|---|---|
| Current | — | 22 | 22 (18.5%) |
| P1 complete | Finish seo + social + workflow | +29 | **51 (42.9%)** |
| P2a: content-ai | Full gen 9 tools + bestFor 5 | +14 | 65 (54.6%) |
| P2b: marketing | Full gen 9 tools + bestFor 4 | +13 | 78 (65.5%) |
| P2c: productivity | Full gen 9 tools | +9 | **87 (73.1%)** |
| P3a: data-analytics | Full gen 9 tools | +9 | **96 (80.7%)** ← **80% threshold** |

**To reach 80%: complete P1 + P2 + data-analytics category = 159 generation units across 74 tools.**

Verdict field is excluded from the 80% target — it requires editorial judgment and should be written by a human reviewer after pros/cons are established.

---

## Workload Summary

| Phase | Categories | Tools | Generation units | Est. tools with full content |
|---|---|---|---|---|
| P1 | 3 | 29 | 42 | +29 |
| P2 | 3 | 36 | 117 | +36 |
| P3 | 5 | 54 | 219 | +54 |
| **Total** | **11** | **119** | **378** | **119** |

One "generation unit" = one content field (overview OR pros OR cons OR bestFor) for one tool.  
Verdict (118 missing) treated as a separate phase requiring human review.

---

## Generation Field Spec (for AI prompting)

When generating each field, use these targets:

| Field | Format | Target length |
|---|---|---|
| overview | 3–4 paragraphs, plain prose, no marketing language | 300–500 words |
| pros | Array of 5 strings, each 1 sentence | 5 × 15–25 words |
| cons | Array of 3 strings, each 1 sentence | 3 × 15–25 words |
| bestFor | Array of 3–5 strings, short descriptive labels | 3–5 × 5–10 words |
| verdict | 2–3 sentences summarizing bottom line | 50–80 words |

All fields must pass PROJECT_SPEC.md validation rules:
- No external URLs, Clearbit, or CDN dependencies
- No first-person language
- No unsubstantiated superlatives
- Slug must match `tools.json` entry exactly

---

## Next Immediate Actions

1. **Generate P1 content** — 42 units across 3 categories (start with `seo-search`, then `social-media-management`, then `workflow-automation`)
2. **Run `node scripts/merge-data.mjs`** after each category batch to verify output
3. **Deploy to Cloudflare Pages** after P1 to validate live review pages
4. **Begin P2 with `content-ai-creation`** — highest traffic category still unfinished
