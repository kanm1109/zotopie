# D-077 — AI Detection Cluster Expansion Report

**Date:** 2026-06-23  
**Status:** COMPLETE  
**Commit:** `fb65497`  
**Deploy:** Cloudflare Pages build triggered — main branch pushed

---

## Objective

Expand AI Detection cluster from 2 tools to minimum 6 tools.

**Result: 6 tools — objective met.**

---

## Tools Added

| Tool | Slug | Rating | Pricing | Affiliate |
|------|------|--------|---------|-----------|
| Turnitin | `turnitin` | 4.6 | Paid (institutional) | None — no public program |
| Copyleaks | `copyleaks` | 4.2 | Freemium / $9.99/mo | T3 — pending (PartnerStack) |
| Winston AI | `winston-ai` | 4.1 | Freemium / $12/mo | T3 — pending (direct) |
| ZeroGPT | `zerogpt` | 3.9 | Freemium / $6.99/mo | None — no program |

---

## Existing Tools Updated

| Tool | Change |
|------|--------|
| GPTZero | Alternatives expanded: added copyleaks, winston-ai, zerogpt, turnitin |
| Originality.ai | Alternatives expanded: added copyleaks, winston-ai, turnitin, zerogpt |

---

## Auto-Generated Pages

### Review Pages (4 new)

| URL | Status |
|-----|--------|
| `/reviews/turnitin/` | ✅ Generated |
| `/reviews/copyleaks/` | ✅ Generated |
| `/reviews/winston-ai/` | ✅ Generated |
| `/reviews/zerogpt/` | ✅ Generated |

### Alternatives Pages (4 new)

| URL | Status |
|-----|--------|
| `/alternatives/turnitin/` | ✅ Generated |
| `/alternatives/copyleaks/` | ✅ Generated |
| `/alternatives/winston-ai/` | ✅ Generated |
| `/alternatives/zerogpt/` | ✅ Generated |

### Compare Pages (11 new)

| URL | Tools Compared |
|-----|----------------|
| `/compare/copyleaks-vs-gptzero/` | Copyleaks vs GPTZero |
| `/compare/copyleaks-vs-originality-ai/` | Copyleaks vs Originality.ai |
| `/compare/copyleaks-vs-turnitin/` | Copyleaks vs Turnitin |
| `/compare/copyleaks-vs-winston-ai/` | Copyleaks vs Winston AI |
| `/compare/gptzero-vs-turnitin/` | GPTZero vs Turnitin |
| `/compare/gptzero-vs-winston-ai/` | GPTZero vs Winston AI |
| `/compare/gptzero-vs-zerogpt/` | GPTZero vs ZeroGPT |
| `/compare/originality-ai-vs-turnitin/` | Originality.ai vs Turnitin |
| `/compare/originality-ai-vs-winston-ai/` | Originality.ai vs Winston AI |
| `/compare/originality-ai-vs-zerogpt/` | Originality.ai vs ZeroGPT |
| `/compare/winston-ai-vs-zerogpt/` | Winston AI vs ZeroGPT |

**Pre-existing compare pages retained:**
- `/compare/gptzero-vs-originality-ai/` (existed before)
- `/compare/gptzero-vs-grammarly/` (retained — GPTZero alternatives preserved)
- `/compare/gptzero-vs-jasper/` (retained — GPTZero alternatives preserved)

---

## Page Count Summary

| Page Type | Before | After | Delta |
|-----------|--------|-------|-------|
| Review pages | 128 | **132** | +4 |
| Alternatives pages | 128 | **132** | +4 |
| Compare pages | 458 | **469** | +11 |
| Total site pages | ~961 | **975** | +14 |

---

## Build Verification

```
npm run build
→ 975 page(s) built in 19.21s
→ 0 errors
→ Known warnings: empty collections (threads, extensions, marketing, blog) — pre-existing, not related to this task
```

All 4 new `/reviews/` pages confirmed in build output:
- `/reviews/turnitin/index.html` ✓
- `/reviews/copyleaks/index.html` ✓
- `/reviews/winston-ai/index.html` ✓
- `/reviews/zerogpt/index.html` ✓

---

## Cluster State After D-077

| Tool | Affiliate | Status |
|------|-----------|--------|
| GPTZero | T1 — LIVE (`/go/gptzero`) | Earning today |
| Originality.ai | T4 — no program | No affiliate |
| Turnitin | T4 — no program (institutional B2B only) | No affiliate |
| Copyleaks | T3 — pending (PartnerStack) | Apply to join |
| Winston AI | T3 — pending (direct) | Apply to join |
| ZeroGPT | T4 — no program | No affiliate |

**Compare page count:** 15 total (4 pre-existing + 11 new)  
**Long-form content:** 2 articles still at `/ai-tools/gptzero-review/` and `/comparisons/gptzero-vs-originality/` — migration to `/reviews/` is next step (D-071 plan)

---

## Next Steps (not in scope for D-077)

1. **Apply for Copyleaks affiliate** (PartnerStack) — `affiliateSource: https://copyleaks.partnerstack.com`
2. **Apply for Winston AI affiliate** (direct) — `affiliateSource: https://gowinston.ai/affiliate`
3. **Create `/best/ai-detection-tools/` page** — cluster now has 6 tools, sufficient for a best-of page
4. **Commission G to write Copyleaks review** (~4,000w) for `/reviews/copyleaks/` — first new long-form in the cluster
5. **Commission G to write Turnitin vs GPTZero comparison** (~4,500w) — highest search intent compare pair

---

**D-077 STATUS: COMPLETE**
