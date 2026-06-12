# TOOLS LIST AUDIT

**Date:** 2026-06-12  
**Task:** T1-TOOLS-LIST-AUDIT  
**Trigger:** D3-POST-DEPLOY-VERIFICATION observed `/tools/` showing 97 tools vs expected 119  

---

## Verdict

> **Root cause: 19 tools existed only in local `tools.json` — never committed.**  
> The deployed `tools-enriched.json` (commit `f0a0d66`) was generated from an older `tools.json` that had 100 tools. After that commit, 19 new tools were added to `tools.json` locally but the generated file was never re-committed until D4.  
>
> **Status: RESOLVED** — D4 release (`06ad4f3`) committed the updated `tools-enriched.json`. Production now shows **119 tools**.

---

## Count Reconciliation

| Source | Count | Notes |
|---|---|---|
| `tools-enriched.json` (commit `f0a0d66`, deployed pre-D4) | **100** | The actual live count before D4 |
| `tools.json` (local, pre-D4) | **119** | 19 tools added locally, never committed |
| D3 WebFetch report | **97** | ❌ Model miscount — actual was 100 (3 off) |
| `tools-enriched.json` (commit `06ad4f3`, post-D4) | **119** | Correct — matches `tools.json` |
| Production `/tools/` post-D4 | **119** | ✅ Verified via WebFetch |

**The "22 missing" assumption in D3 was double-wrong**: WebFetch reported 97 (not 100), and the expected count was 119 (not inferred from the miscount). Actual gap was 19 tools.

---

## Root Cause Analysis

### Was there a filter in `tools.astro`?

**No.** Both the old commit (`f0a0d66`) and the current commit have identical `tools.astro` logic:

```astro
import tools from "../data/generated/tools-enriched.json";
// ...
{tools.map((tool) => (
  <li>{tool.name}</li>
))}
```

No `filter()`, no `hidden` flag check, no category filter, no pagination. 100% of `tools-enriched.json` entries are rendered.

### Was there a category mapping issue?

**No.** All 19 missing tools have valid `primaryCategory` values matching the 11 valid taxonomy slugs.

### Was there a missing field causing exclusion?

**No.** The merge pipeline does not exclude tools based on missing fields. All 100 tools in the old commit rendered regardless of content completeness.

### Was there a hidden/draft flag?

**No.** Neither `tools.json` nor `tools-enriched.json` has a `hidden`, `draft`, `published`, or `visible` field. No such flag exists in the data schema.

### Was there a build logic issue?

**No.** The build was working correctly — it rendered exactly what was in `tools-enriched.json`. The issue was upstream: `tools-enriched.json` itself was stale.

### Actual root cause: stale committed generated file

```
Timeline:
─────────────────────────────────────────────────────
Commit f0a0d66   tools.json: 100 tools
                 tools-enriched.json: 100 tools (correct at time of commit)
                 ↓
[local work]     tools.json: +19 tools added (119 total)
                 node scripts/merge-data.mjs run locally
                 tools-enriched.json regenerated locally: 119 tools
                 ← never committed ←
                 ↓
D3 observation   Cloudflare serves tools-enriched.json from f0a0d66: 100 tools
                 WebFetch model misreports as: 97
                 ↓
Commit 06ad4f3   tools.json: 119 tools (committed)
                 tools-enriched.json: 119 tools (committed)
                 ↓
D4 post-deploy   Production shows: 119 tools ✅
─────────────────────────────────────────────────────
```

---

## The 19 Missing Tools

These tools existed in local `tools.json` but were absent from the committed `tools-enriched.json` (commit `f0a0d66`). All 19 are now live in production.

| # | Slug | Name | Category | Has Full Content |
|---|---|---|---|---|
| 1 | `dall-e` | DALL-E | content-ai-creation | ✅ overview + pros + bestFor |
| 2 | `d-id` | D-ID | content-ai-creation | ✅ overview + pros + bestFor |
| 3 | `gemini` | Gemini | content-ai-creation | ✅ overview + pros + bestFor |
| 4 | `heygen` | HeyGen | content-ai-creation | ✅ overview + pros + bestFor |
| 5 | `stable-diffusion` | Stable Diffusion | content-ai-creation | ✅ overview + pros + bestFor |
| 6 | `socialbee` | SocialBee | social-media-management | ✅ overview + pros + bestFor |
| 7 | `planoly` | Planoly | social-media-management | ✅ overview + pros + bestFor |
| 8 | `substack` | Substack | marketing-lead-generation | ✅ overview + pros + bestFor |
| 9 | `mailerlite` | MailerLite | marketing-lead-generation | ✅ overview + pros + bestFor |
| 10 | `salesforce` | Salesforce | marketing-lead-generation | ✅ overview + pros + bestFor |
| 11 | `kartra` | Kartra | marketing-lead-generation | ✅ overview + pros + bestFor |
| 12 | `microsoft-teams` | Microsoft Teams | community-growth | ✅ overview + pros + bestFor |
| 13 | `wordpress` | WordPress | community-growth | ✅ overview + pros + bestFor |
| 14 | `godaddy` | GoDaddy | infrastructure-hosting | ✅ overview + pros + bestFor |
| 15 | `hetzner` | Hetzner | infrastructure-hosting | ✅ overview + pros + bestFor |
| 16 | `linode` | Linode | infrastructure-hosting | ✅ overview + pros + bestFor |
| 17 | `magento` | Magento | ecommerce-monetization | ✅ overview + pros + bestFor |
| 18 | `paddle` | Paddle | ecommerce-monetization | ✅ overview + pros + bestFor |
| 19 | `thrivecart` | ThriveCart | ecommerce-monetization | ✅ overview + pros + bestFor |

**Distribution by category:**

| Category | Missing tools |
|---|---|
| content-ai-creation | 5 (dall-e, d-id, gemini, heygen, stable-diffusion) |
| marketing-lead-generation | 4 (substack, mailerlite, salesforce, kartra) |
| ecommerce-monetization | 3 (magento, paddle, thrivecart) |
| infrastructure-hosting | 3 (godaddy, hetzner, linode) |
| social-media-management | 2 (socialbee, planoly) |
| community-growth | 2 (microsoft-teams, wordpress) |

---

## WebFetch Counting Errors (D3 and D4)

WebFetch passes page content through an AI model for extraction. That model miscounted in both observations:

| Observation | WebFetch reported | Actual count | Error |
|---|---|---|---|
| D3 (pre-D4, `/tools/`) | 97 | 100 | −3 |
| D4 (post-D4, `/tools/`) | 138 (said), 119 (listed) | 119 | said wrong, listed right |

**Mitigation:** When using WebFetch for counts, always request a full list (not a summary count), then count the list items independently. A numeric claim from the model is not reliable; an enumerated list is.

---

## Updated Category Tool Counts (Post-D4)

With all 119 tools live:

| Category | Tool count |
|---|---|
| content-ai-creation | 14 |
| marketing-lead-generation | 13 |
| ecommerce-monetization | 13 |
| community-growth | 11 |
| social-media-management | 11 |
| infrastructure-hosting | 12 |
| data-analytics | 9 |
| seo-search | 9 |
| workflow-automation | 9 |
| productivity-knowledge-management | 9 |
| link-tracking | 9 |
| **Total** | **119** |

---

## Prevention

To prevent stale `tools-enriched.json` in future:

1. **Always commit `src/data/generated/` together with `src/data/tools.json`.** When adding new tools to `tools.json`, always run `node scripts/merge-data.mjs` and stage the updated generated files in the same commit.
2. **The prebuild fallback is a safety net, not a workflow.** The `|| echo '[prebuild] merge-data failed...'` fallback means Cloudflare will use the committed `tools-enriched.json` if the prebuild fails. If that file is stale, stale data goes to production.
3. **Consider adding a CI check**: count tools in `tools.json` vs `tools-enriched.json` — fail if they don't match.

---

## Status

| Item | Status |
|---|---|
| Root cause identified | ✅ Stale committed `tools-enriched.json` |
| Missing tools identified | ✅ 19 tools (not 22 — D3 count was wrong) |
| Filter / flag / mapping issues | ✅ None found |
| Fix deployed | ✅ D4 release (`06ad4f3`) |
| Production verification | ✅ 119 tools now live |

---

*Generated: 2026-06-12 | Task: T1-TOOLS-LIST-AUDIT*
