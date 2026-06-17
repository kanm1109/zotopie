# D-040 — Repository Structure Audit Report

**Date:** 2026-06-17  
**Status:** Read-only. No files moved, renamed, deleted, or committed.

---

## Deliverable 1 — Repository Tree (Condensed)

```
zotopie/
├── .github/                         (1 file — CI workflow)
├── .vscode/                         (2 files — editor config)
├── content-briefs/                  (6 files — brief outlines + xlsx)
├── dist/                            (1,049 files — build output, gitignored)
├── docs/                            (86 files — flat, no subdirectories)
├── drafts/                          (8 files — ALL already published)
├── node_modules/                    (gitignored)
├── public/
│   ├── brand/
│   ├── images/
│   │   ├── ai-tools/               (3 files — Fireflies images)
│   │   └── reddit/                 (24 files — reddit + ai-tools images mixed)
│   └── logos/
├── scripts/                         (24 files — .mjs, .js, .json)
├── src/
│   ├── components/                  (11 .astro files)
│   ├── content/
│   │   ├── ai-tools/               (3 articles: Synthesia, GPTZero, Fireflies)
│   │   ├── blog/
│   │   ├── extensions/
│   │   ├── marketing/
│   │   ├── reddit/                 (6 articles)
│   │   └── threads/
│   ├── data/
│   │   ├── generated/              (3 files: icon-data, logo-slugs, tools-enriched)
│   │   ├── keywords/               (1 xlsx)
│   │   ├── research/               (2 json)
│   │   └── *.json                  (12 production + report JSONs)
│   ├── layouts/                    (3 .astro files)
│   ├── pages/                      (28 .astro files across subdirs)
│   └── consts.ts, content.config.ts
│
├── [ROOT — 47 .md report files]     ← PRIMARY ISSUE
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── README.md
├── DEPLOYMENT.md
├── ARTICLE_TEMPLATE.md
├── NEXT_STEPS.txt
├── PRE_PRODUCTION_AUDIT.md
└── _gen-og.mjs                      ← script in wrong location
```

---

## Deliverable 2 — Root Folder Audit

### Active Production Files (keep in root)

| File | Reason |
|---|---|
| `astro.config.mjs` | Astro build config — must be in root |
| `package.json` | Node dependency manifest |
| `package-lock.json` | Lockfile |
| `tsconfig.json` | TypeScript config |
| `README.md` | Project documentation |
| `DEPLOYMENT.md` | Deployment guide — reasonable at root |
| `ARTICLE_TEMPLATE.md` | Active editorial template |
| `.editorconfig` | Editor config |
| `.env.example` | Env template |
| `.gitignore` | Git config |
| `.node-version` / `.nvmrc` | Node version pins |

### Historical / Misplaced Files (should move to docs/)

All 47 `.md` report files in root. Grouped by type:

**Article Publish Reports** (7 files):
- `awario-review-report.md`
- `best-reddit-marketing-tools-review-report.md`
- `best-reddit-monitoring-tools-review-report.md`
- `f5bot-review-report.md`
- `gptzero-review-report.md`
- `synthesia-review-report.md`
- `fireflies-review-report.md`

**Taxonomy / Migration Reports** (1 file):
- `d037-taxonomy-migration-report.md`

**Audit Reports** (11 files):
- `article-image-system-report.md`
- `broken-links-report.md`
- `commit-audit-report.md`
- `content-discovery-report.md`
- `domain-dns-audit.md`
- `final-category-consistency-report.md`
- `gummysearch-post-publish-audit.md`
- `layout-audit.md`
- `mobile-audit-report.md`
- `og-image-root-cause-report.md`
- `seo-foundation-audit.md`

**Migration / Fix Reports** (10 files):
- `article-layout-migration-report.md`
- `canonical-layout.md`
- `category-layout-migration-report.md`
- `cleanup-report.md`
- `deployment-report.md`
- `footer-migration-report.md`
- `gummysearch-publish-report.md`
- `internal-link-backfill-report.md`
- `production-verification-report.md`
- `responsive-fixes-report.md`

**Planning Files** (9 files):
- `commit-plan.md`
- `homepage-content-discovery-report.md`
- `homepage-social-preview-report.md`
- `homepage-vs-category-gap-report.md`
- `layout-migration-plan.md`
- `navigation-map.md`
- `pre-push-audit.md`
- `push-report.md`
- `review-report.md`
- `schema-report.md`
- `unified-search-report.md`
- `user-journey-map.md`
- `website-architecture.md`

### Duplicate / Redundant Files

| File | Issue |
|---|---|
| `_gen-og.mjs` | Script sitting in root — belongs in `scripts/` |
| `NEXT_STEPS.txt` | Planning doc — belongs in `docs/plans/` |
| `PRE_PRODUCTION_AUDIT.md` (21KB) | Large audit doc — belongs in `docs/audits/` |
| `gitignore-recommendations.md` | One-time advisory — belongs in `docs/audits/` |

### Unknown Ownership

| File | Status |
|---|---|
| `review-report.md` | Generic name — unclear which article/task it belongs to |
| `push-report.md` | Appears to be a one-off commit push log |

---

## Deliverable 3 — Draft Workflow Audit

### Draft Status

| Draft File | Status | Published Location |
|---|---|---|
| `awario-review.md` | ✅ PUBLISHED | `src/content/reddit/awario-review.md` |
| `best-reddit-marketing-tools.md` | ✅ PUBLISHED | `src/content/reddit/best-reddit-marketing-tools.md` |
| `best-reddit-monitoring-tools.md` | ✅ PUBLISHED | `src/content/reddit/best-reddit-monitoring-tools.md` |
| `f5bot-review.md` | ✅ PUBLISHED | `src/content/reddit/f5bot-review.md` |
| `fireflies-review.md` | ✅ PUBLISHED | `src/content/ai-tools/fireflies-review.md` |
| `gptzero-review.md` | ✅ PUBLISHED | `src/content/ai-tools/gptzero-review.md` |
| `GummySearch_review.md` | ✅ PUBLISHED | `src/content/reddit/gummysearch-review.md` |
| `synthesia-review.md` | ✅ PUBLISHED | `src/content/ai-tools/synthesia-review.md` |

**Result: ALL 8 drafts are published. The `drafts/` folder currently has zero active work.**

**Naming issue:** `GummySearch_review.md` uses underscores — inconsistent with hyphen convention of all other drafts.

### Proposed Draft Workflow

```
[Editor creates]
       ↓
drafts/active/{slug}.md        ← PM approved, in progress
       ↓
[Integrated → src/content/]
       ↓
drafts/archived/{slug}.md      ← Retain for reference (post-publish)
       ↓
[After 90 days or next major audit]
       ↓
[Delete archived drafts]       ← Optional final cleanup
```

**Current state:** All drafts should move to `drafts/archived/`. `drafts/active/` would be empty and ready for the next batch.

---

## Deliverable 4 — Docs Audit

**86 files in a completely flat structure.** No subdirectories. All files use SHOUTING_CAPS naming convention. Date range: June 9–14, 2026.

### Architecture (5 files)
- `PROJECT_SPEC.md`
- `DATA_AUDIT.md`
- `GROWTH_ROADMAP.md`
- `TOOL_EXPANSION_PLAN.md`
- `CONTENT_ROADMAP.md`

### Audit (20 files)
- `UI_UX_AUDIT.md`, `UX_POLISH_AUDIT.md`, `VISUAL_UI_AUDIT.md`
- `ALTERNATIVES_AUDIT.md`, `COMPARE_AUDIT.md`, `TOOLS_LIST_AUDIT.md`
- `SITEMAP_AUDIT.md`, `INDEXATION_AUDIT.md`, `MONETIZATION_AUDIT.md`
- `ENCODING_AUDIT_REPORT.md`, `FAVICON_AUDIT.md`, `TOOL_LOGO_AUDIT.md`
- `RESPONSIVE_BUG_LIST.md`, `PRODUCTION_BUG_LIST.md`, `PRODUCTION_BUGS_REMAINING.md`
- `MERGE_PIPELINE_AUDIT.md`, `DATA_ENRICHMENT_TIER1.md`, `DATA_ENRICHMENT_TIER2.md`
- `MEASUREMENT_AUDIT.md`, `REVENUE_ACTIVATION_AUDIT.md`

### Reports (30 files)
- `POST_DEPLOY_REPORT.md`, `POST_DEPLOY_VERIFICATION.md`
- `RELEASE_REPORT.md`, `FINAL_SWEEP_REPORT.md`, `FINAL_STABILIZATION_REPORT.md`
- `ALTERNATIVES_VERIFICATION.md`, `ALTERNATIVES_RELEASE_REPORT.md`
- `ALTERNATIVES_REDESIGN.md`, `ALTERNATIVE_GRAPH_REPORT.md`, `ALTERNATIVE_GRAPH_EXPANSION.md`
- `COMPARE_RELEASE_REPORT.md`, `COMPARE_VERIFICATION.md`, `COMPARE_REDESIGN.md`
- `HOMEPAGE_REDESIGN_REPORT.md`, `HOMEPAGE_RELEASE_REPORT.md`
- `CATEGORY_PAGE_REDESIGN.md`, `CATEGORY_PAGE_RELEASE.md`
- `TOOL_PAGE_REDESIGN.md`, `TOOL_PAGE_RELEASE.md`
- `SEARCH_REDESIGN.md`, `SEARCH_RELEASE_REPORT.md`, `SEARCH_VERIFICATION_REPORT.md`
- `BRAND_ASSETS_REPORT.md`, `BRAND_CONSISTENCY_REPORT.md`, `BRAND_V2_REPORT.md`
- `UX_POLISH_FIX_REPORT.md`, `UX_POST_FIX_VERIFICATION.md`
- `AUTHORITY_EXPANSION_REPORT.md`, `AUTHORITY_P1_REPORT.md`, `AUTHORITY_INTERNAL_LINKING_REPORT.md`
- `MOBILE_QA_REPORT.md`, `PRODUCTION_SCREENSHOT_EVIDENCE.md`
- `LOGO_COVERAGE_REPORT.md`, `FAVICON_PRODUCTION_VERIFICATION.md`
- `DATA_QUALITY_COMPLETION.md`, `DATA_QUALITY_FINAL_AUDIT.md`, `DATA_QUALITY_TOP30.md`
- `PRICING_COMPLETION_REPORT.md`, `FINAL_DATA_CLEANUP.md`
- `PRODUCTION_ACCEPTANCE_TEST.md`, `REVENUE_UNLOCK_REPORT.md`

### Plans (10 files)
- `GROWTH_DASHBOARD.md`, `NEXT_90_DAYS_ROADMAP.md`
- `CHANNEL_PRIORITIZATION.md`, `TRAFFIC_ACQUISITION_PLAN.md`
- `TRAFFIC_TRACKING_SYSTEM.md`, `AUTHORITY_ROADMAP.md`, `AUTHORITY_FOUNDATION.md`
- `AUTHORITY_P1_RELEASE.md`
- `PRODUCT_HUNT_CHECKLIST.md`, `PRE_DEPLOY_CHECKLIST.md`

### Process (5 files)
- `RELEASE_GUARDRAILS.md`
- `DEPLOYMENT_GUIDE.md`
- `LOGO_USAGE_GUIDE.md`
- `BRAND_LOGO_SYSTEM.md`
- `LAUNCH_READINESS_REPORT.md`

### Playbooks (3 files)
- `REDDIT_PLAYBOOK.md`
- `X_PLAYBOOK.md`
- `POST_LAUNCH_AUDIT.md`

### Misplaced in docs/ (should be at root or dedicated folder)
- None severe — the docs/ naming is consistent internally.

**Issue:** The 47 root-level `.md` files follow the **same content type** as docs/ but use a different naming convention (lowercase-hyphen vs CAPS_UNDERSCORE). They were generated during session workflows and were never organized into docs/.

---

## Deliverable 5 — Data Audit (`src/data/`)

### Production Data (actively imported by pages)

| File | Used By | Size |
|---|---|---|
| `generated/tools-enriched.json` | index, search, reviews, compare, best pages | 430KB |
| `generated/icon-data.json` | search, reviews, compare | 53KB |
| `generated/logo-slugs.json` | logo generation scripts | 1KB |
| `taxonomies.json` | index, search, category pages | 2KB |
| `best-pages.json` | index, best pages | 52KB |
| `alternatives.json` | alternatives pages | 16KB |
| `best-for.json` | best pages | 30KB |
| `category-content.json` | category pages | 80KB |
| `logo-mapping.json` | logo scripts | 4KB |
| `tools.json` | source of truth for tools-enriched pipeline | 308KB |

### Generated / Intermediate Data

| File | Status |
|---|---|
| `generated/icon-data.json` | Output of icon download scripts |
| `generated/logo-slugs.json` | Output of logo pipeline |
| `generated/tools-enriched.json` | Output of enrich-g3x scripts |
| `overviews.json` | 174KB — intermediate enrichment source, likely not needed post-enrich |
| `pros-cons.json` | 132KB — intermediate enrichment source, likely not needed post-enrich |

### Research Data

| File | Status |
|---|---|
| `research/overviews-seo.json` | SEO-specific overviews subset |
| `research/verified-tools.json` | Pre-enrichment verification |
| `keywords/reddit-keywords.xlsx` | Keyword research spreadsheet |
| `reddit-tools.json` | Reddit-specific tool subset |

### Report / Temporary Data (can be archived)

| File | Issue |
|---|---|
| `content-coverage-report.json` | Report artifact — belongs in `docs/` |
| `merge-verification-report.json` | Report artifact — belongs in `docs/` |
| `integration-report-seo.json` | Report artifact — belongs in `docs/` |
| `validation-report-seo.json` | Report artifact — belongs in `docs/` |
| `pros-cons-seo.json` | SEO-specific subset, check if still used |
| `overviews-seo.json` | Appears in both `src/data/` root and `research/` — verify |

### Suspicious Items

| Item | Concern |
|---|---|
| `tools.json` (308KB) + `tools-enriched.json` (430KB) | Both large, relationship unclear — is `tools.json` the pre-enrich source that can be archived? |
| `overviews.json` (174KB) + `pros-cons.json` (132KB) | Very large intermediate files — check if still needed after enrichment |

---

## Deliverable 6 — Cleanup Candidates

### Priority P1 — High Value, Low Risk

| Item | Reason | Risk | Destination |
|---|---|---|---|
| Root `.md` files (47) | Clutter, no functional purpose at root | **Low** — not imported by any build process | `docs/reports/` or `docs/audits/` |
| `drafts/` all 8 files | All published, folder is dead | **Low** — not used by build | `drafts/archived/` |
| `_gen-og.mjs` in root | Script in wrong location | **Low** — standalone script | `scripts/` |

### Priority P2 — Medium Value, Low Risk

| Item | Reason | Risk | Destination |
|---|---|---|---|
| `docs/` → subdirectories | 86 flat files, hard to navigate | **Low** — docs not imported | `docs/architecture/`, `docs/audits/`, `docs/reports/`, `docs/plans/`, `docs/process/`, `docs/playbooks/` |
| `scripts/fix-prices.js` | Likely duplicate of `fix-prices.mjs` | **Low** — verify then delete if identical | Delete after hash check |
| `src/data/content-coverage-report.json` | Report artifact in data folder | **Low** | `docs/` or delete |
| `src/data/merge-verification-report.json` | Report artifact in data folder | **Low** | `docs/` or delete |
| `src/data/integration-report-seo.json` | Report artifact in data folder | **Low** | `docs/` or delete |
| `src/data/validation-report-seo.json` | Report artifact in data folder | **Low** | `docs/` or delete |
| `NEXT_STEPS.txt` | Planning doc at root | **Low** | `docs/plans/` |
| `PRE_PRODUCTION_AUDIT.md` | Large audit at root | **Low** | `docs/audits/` |
| `gitignore-recommendations.md` | Advisory doc at root | **Low** | `docs/audits/` |

### Priority P3 — Nice to Have, Requires Care

| Item | Reason | Risk | Destination |
|---|---|---|---|
| Image taxonomy: GPTZero/Synthesia images in `/images/reddit/` | Misleading path — articles now in ai-tools | **Low** — images served correctly regardless of path | `/images/ai-tools/` (requires updating frontmatter in both articles) |
| `scripts/enrich-g3x-batch*.mjs` (5 files) | One-time enrichment scripts, data already enriched | **Medium** — verify enrichment won't be re-run | `scripts/archived/` or delete |
| `scripts/dead-alternatives-report.json` | Report artifact in scripts/ | **Low** | `docs/` or delete |
| `scripts/patch-p6-content.json` (48KB) | Large one-time patch data | **Medium** — verify no longer needed | Archive or delete |
| `src/data/overviews.json` (174KB) | Large intermediate file — post-enrich utility unclear | **Medium** — verify not used in build | Archive if not needed |
| `src/data/pros-cons.json` (132KB) | Large intermediate file | **Medium** — verify not used in build | Archive if not needed |
| `content-briefs/` | Planning briefs — low volume now but will grow | **Low** | Fold into `docs/plans/content-briefs/` |
| `GummySearch_review.md` naming | Underscore vs hyphen inconsistency | **Low** | Rename to `gummysearch-review.md` |

---

## Deliverable 7 — Proposed Structure V2

```
zotopie/
│
├── [Config — stays at root]
│   ├── astro.config.mjs
│   ├── package.json / package-lock.json
│   ├── tsconfig.json
│   ├── .editorconfig / .env.example / .gitignore
│   ├── .node-version / .nvmrc
│   ├── README.md
│   └── DEPLOYMENT.md
│
├── docs/
│   ├── architecture/          ← PROJECT_SPEC, website-architecture, DATA_AUDIT, GROWTH_ROADMAP, TOOL_EXPANSION_PLAN
│   ├── audits/                ← All *_AUDIT.md, PRE_PRODUCTION_AUDIT, seo-foundation-audit, domain-dns-audit, etc.
│   ├── reports/               ← All *-report.md, POST_DEPLOY*, FINAL_*, article publish reports, d037-taxonomy...
│   ├── plans/
│   │   ├── content-briefs/    ← content-briefs/ folder contents
│   │   └── *.md               ← NEXT_90_DAYS_ROADMAP, CHANNEL_PRIORITIZATION, TRAFFIC_*, AUTHORITY_ROADMAP
│   ├── process/               ← RELEASE_GUARDRAILS, DEPLOYMENT_GUIDE, LOGO_USAGE_GUIDE, BRAND_LOGO_SYSTEM
│   └── playbooks/             ← REDDIT_PLAYBOOK, X_PLAYBOOK, PRODUCT_HUNT_CHECKLIST
│
├── drafts/
│   ├── active/                ← next incoming drafts (currently empty)
│   └── archived/              ← all 8 current published drafts
│
├── scripts/
│   ├── archived/              ← enrich-g3x-batch*.mjs (one-time scripts)
│   ├── _gen-og.mjs            ← moved from root
│   └── *.mjs / *.js           ← active utility scripts
│
├── src/
│   ├── components/
│   ├── content/
│   │   ├── ai-tools/          ← Synthesia, GPTZero, Fireflies (+ future AI reviews)
│   │   ├── reddit/            ← 6 Reddit-specific articles
│   │   ├── blog/
│   │   ├── extensions/
│   │   ├── marketing/
│   │   └── threads/
│   ├── data/
│   │   ├── generated/         ← tools-enriched.json, icon-data.json, logo-slugs.json
│   │   ├── keywords/          ← reddit-keywords.xlsx
│   │   ├── research/          ← overviews-seo.json, verified-tools.json
│   │   └── *.json             ← production data only (no report JSONs)
│   ├── layouts/
│   ├── pages/
│   └── consts.ts / content.config.ts
│
└── public/
    ├── brand/
    ├── images/
    │   ├── reddit/            ← images for reddit articles only
    │   └── ai-tools/          ← images for ALL ai-tools articles (incl. Synthesia, GPTZero)
    └── logos/
```

**Key changes from V1 → V2:**
- Root goes from 47+ .md files → 2 .md files (README, DEPLOYMENT)
- `docs/` gains 5 subdirectories for navigation
- `drafts/` gains active/archived separation
- `scripts/` gains archived subdirectory
- Image paths aligned to match content collection taxonomy

---

## Deliverable 8 — Migration Risk Analysis

| Move | Risk | Impact Areas | Notes |
|---|---|---|---|
| Root `.md` → `docs/reports/` | **LOW** | None — not imported by build | Pure file move, zero build impact |
| `drafts/` → `drafts/archived/` | **LOW** | None — not imported by build | Pure file move |
| `_gen-og.mjs` → `scripts/` | **LOW** | Any CI scripts that call it directly | Check CI workflow before moving |
| `docs/` → subdirectories | **LOW** | None — docs not imported | Pure reorganization |
| `content-briefs/` → `docs/plans/content-briefs/` | **LOW** | None | Pure move |
| `scripts/patch-p6-content.json` → archive | **MEDIUM** | Any script that reads it | Verify `merge-data.mjs` doesn't reference it |
| `scripts/enrich-g3x-*.mjs` → archive | **MEDIUM** | Future enrichment runs | Document that enrichment is complete before archiving |
| `src/data/report JSONs` → archive | **LOW** | Verify none imported in pages | None appear to be imported based on import audit |
| `src/data/overviews.json` → archive | **MEDIUM** | Any enrichment script references | Check enrich-g3x-batch scripts reference paths |
| Image move: `/images/reddit/gptzero-*.webp` → `/images/ai-tools/` | **MEDIUM** | Frontmatter in 2 articles, OG image references | Must update `featuredImage` in both articles + rebuild |
| `fix-prices.js` delete (if duplicate of .mjs) | **LOW** | Verify no CI references to .js extension | Hash check first |

---

## Deliverable 9 — Repository Health Score

| Dimension | Score | Notes |
|---|---|---|
| **Structure** | 3 / 10 | Root has 47 .md files. `docs/` is a flat 86-file directory. No meaningful hierarchy below the top level. |
| **Maintainability** | 5 / 10 | Content collection structure is clean and logical. Article pipeline is well-defined. Data is the source of confusion — mixed production/research/report files with no separation. |
| **Scalability** | 4 / 10 | Each new article adds 1 publish report to root. At current pace (8 articles), root is already at 47 files. At 20 articles it will be ~65. The pattern doesn't scale. |
| **Documentation** | 8 / 10 | Project is extremely well-documented — 86 docs, 47 root reports. The issue is organization, not quantity. |
| **Technical Debt** | 5 / 10 | Image taxonomy mismatch (Synthesia/GPTZero in `/images/reddit/`), possible large orphaned intermediate JSONs (overviews.json, pros-cons.json), potential script duplicates (fix-prices.js vs .mjs). |
| **Overall** | 5 / 10 | A well-intentioned project that has accumulated operational artifacts faster than its organizational system. Content and build architecture are solid. File organization is the primary debt. |

---

## Final Recommendation

### **B. Light Cleanup**

**Reasoning:**

The core architecture is sound:
- Astro + content collections are correctly configured
- URL routing is clean (`/reddit/`, `/ai-tools/`)
- Redirects are properly maintained
- Build is stable at 879 pages, 0 errors

The problems are **organizational**, not structural. The codebase doesn't need a major refactor — it needs a filing system.

**Recommended actions in order of priority:**

1. **Create `docs/` subdirectories** and sort the 86 flat docs (no imports affected)
2. **Move all root `.md` files** into appropriate `docs/` subdirectories (no imports affected)
3. **Move all `drafts/`** into `drafts/archived/` (no imports affected)
4. **Move `_gen-og.mjs`** from root to `scripts/` (check CI)
5. **Remove 4 report JSONs** from `src/data/` after verifying no imports
6. **Investigate then archive** `overviews.json` (174KB) and `pros-cons.json` (132KB) if confirmed non-imported

**Do NOT do right now:**
- Image path migration (requires article edits and rebuild — low urgency)
- Script archiving (requires verification of enrichment completion)
- `tools.json` cleanup (requires understanding the full enrichment pipeline)

**Estimated scope:** 1-2 hours of file organization. Zero build changes required for P1/P2 items.

---

*Audit complete. No files changed.*
