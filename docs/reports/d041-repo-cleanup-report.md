# D-041 — Repository Cleanup Execution Report

**Date:** 2026-06-17  
**Branch:** `cleanup/repo-structure-v2`  
**Status:** LOCAL ONLY — Awaiting PM review before push/merge.

---

## Before / After Tree

### Root — BEFORE (49 files)
```
zotopie/
├── _gen-og.mjs              ← script in wrong location
├── ARTICLE_TEMPLATE.md
├── astro.config.mjs
├── DEPLOYMENT.md
├── package.json / tsconfig.json / ...
├── README.md
├── NEXT_STEPS.txt           ← planning doc at root
├── PRE_PRODUCTION_AUDIT.md  ← 21KB audit doc at root
├── [47 .md report files]    ← ALL misplaced
└── content-briefs/          ← planning folder at root
```

### Root — AFTER (12 files)
```
zotopie/
├── .editorconfig
├── .env.example
├── .gitignore
├── .node-version / .nvmrc
├── ARTICLE_TEMPLATE.md      ← kept (active editorial template)
├── astro.config.mjs
├── DEPLOYMENT.md            ← kept (production deployment guide)
├── package.json / package-lock.json
├── README.md                ← kept
└── tsconfig.json
```

### docs/ — AFTER
```
docs/
├── architecture/            (4 files)
│   ├── canonical-layout.md
│   ├── navigation-map.md
│   ├── user-journey-map.md
│   └── website-architecture.md
├── audits/                  (6 files)
│   ├── domain-dns-audit.md
│   ├── gitignore-recommendations.md
│   ├── layout-audit.md
│   ├── mobile-audit-report.md
│   ├── PRE_PRODUCTION_AUDIT.md
│   └── seo-foundation-audit.md
├── plans/                   (2 files + content-briefs/)
│   ├── commit-plan.md
│   ├── layout-migration-plan.md
│   ├── NEXT_STEPS.txt
│   └── content-briefs/      (6 files — from content-briefs/ root folder)
│       ├── best-reddit-scheduling-tools.md
│       ├── brand24-review.md
│       ├── content-plan.xlsx
│       ├── f5bot-alternatives.md
│       ├── gummysearch-review.md
│       └── redreach-vs-devi-ai.md
├── reports/                 (33 files + data/)
│   ├── data/                (4 JSON files — from src/data/)
│   │   ├── content-coverage-report.json
│   │   ├── integration-report-seo.json
│   │   ├── merge-verification-report.json
│   │   └── validation-report-seo.json
│   ├── article-image-system-report.md
│   ├── awario-review-report.md
│   ├── d037-taxonomy-migration-report.md
│   ├── D040-repo-audit.md
│   ├── fireflies-review-report.md
│   ├── gptzero-review-report.md
│   └── [...29 more report files]
├── process/                 (empty — ready for RELEASE_GUARDRAILS etc.)
├── playbooks/               (empty — ready for REDDIT_PLAYBOOK etc.)
└── [86 pre-existing CAPS files — unchanged, flat]
```

### drafts/ — AFTER
```
drafts/
├── active/                  (empty — ready for next article batch)
└── archived/                (8 published drafts)
    ├── awario-review.md
    ├── best-reddit-marketing-tools.md
    ├── best-reddit-monitoring-tools.md
    ├── f5bot-review.md
    ├── fireflies-review.md
    ├── gptzero-review.md
    ├── GummySearch_review.md
    └── synthesia-review.md
```

---

## Files Moved

| Step | Action | Count | Source → Destination |
|---|---|---|---|
| 1 | Create docs/ subdirs | 7 dirs | — |
| 1 | Create drafts/ subdirs | 2 dirs | — |
| 2 | Root reports | 33 files | `/` → `docs/reports/` |
| 2 | Root audits | 6 files | `/` → `docs/audits/` |
| 2 | Root architecture | 4 files | `/` → `docs/architecture/` |
| 2 | Root plans | 3 files | `/` → `docs/plans/` |
| 3 | Drafts archived | 8 files | `drafts/*.md` → `drafts/archived/` |
| 4 | Content briefs | 6 files | `content-briefs/` → `docs/plans/content-briefs/` |
| 4 | content-briefs/ root folder | removed | (empty after move) |
| 5 | Script | 1 file | `/_gen-og.mjs` → `scripts/_gen-og.mjs` |
| 6 | Report JSONs | 4 files | `src/data/` → `docs/reports/data/` |
| **TOTAL** | | **65 files** | |

---

## Build Result

```
879 page(s) built — 0 errors — 19.13s
```

**Same page count as pre-cleanup.** No regressions.

Pre-existing warnings (not introduced by this PR):
- `The collection "threads" does not exist or is empty`
- `The collection "extensions" does not exist or is empty`
- `The collection "marketing" does not exist or is empty`

These are pre-existing empty collections — not related to D-041 changes.

---

## Broken References Found

| Check | Result |
|---|---|
| `_gen-og.mjs` CI references | None found — safe to move |
| 4 report JSON files imported in `src/` | None found — safe to move |
| Root .md files imported by build | None — Astro does not import docs |
| `content-briefs/` imported by build | None |
| `drafts/` imported by build | None |

**Zero broken references.**

---

## Risk Notes

| Item | Risk | Status |
|---|---|---|
| Root .md files moved | LOW — not part of build pipeline | ✅ Confirmed by build pass |
| 4 JSON files moved from src/data/ | LOW — grep confirmed zero imports | ✅ Confirmed by build pass |
| `_gen-og.mjs` moved to scripts/ | LOW — no CI references | ✅ Confirmed by grep |
| `drafts/` archived | ZERO — not imported by Astro | ✅ |
| `content-briefs/` moved | ZERO — not imported by Astro | ✅ |
| Existing 86 docs/ flat files | Untouched — out of D-041 scope | N/A |

**Note on docs/ pre-existing files:** The 86 CAPS files already in `docs/` were NOT moved into subdirectories — this is intentional. D-041 scope was root file cleanup. Reorganizing the pre-existing docs/ flat structure is a separate optional task (P2 follow-up).

---

## Final Repository Health Score

| Dimension | D-040 Score | D-041 Score | Change |
|---|---|---|---|
| **Structure** | 3/10 | 8/10 | +5 — Root: 49 → 12 files. Docs has hierarchy. Drafts has active/archived. |
| **Maintainability** | 5/10 | 7/10 | +2 — Content briefs centralized. Report JSONs out of src/data/. |
| **Scalability** | 4/10 | 8/10 | +4 — New article reports land in docs/reports/, not root. Pattern established. |
| **Documentation** | 8/10 | 8/10 | 0 — Unchanged; docs are organized but pre-existing 86 flat files remain. |
| **Technical Debt** | 5/10 | 6/10 | +1 — Minor remaining items (image taxonomy, pre-existing docs flat structure). |
| **Overall** | 5/10 | **7.4/10** | **+2.4** |

---

## Remaining Items (Not in D-041 Scope)

| Item | Priority | Notes |
|---|---|---|
| Sort pre-existing 86 docs/ flat files into subdirs | P2 | Optional follow-up |
| Fix image taxonomy (Synthesia/GPTZero in `/images/reddit/`) | P3 | Needs article frontmatter update + rebuild |
| Archive/delete `scripts/enrich-g3x-batch*.mjs` | P3 | Verify enrichment complete first |
| Delete `src/data/overviews.json` (174KB) + `pros-cons.json` (132KB) | P3 | Verify no script references |
| Verify `scripts/fix-prices.js` == `fix-prices.mjs` then delete | P2 | Hash check needed |
| Rename `GummySearch_review.md` → `gummysearch-review.md` | P3 | Cosmetic |

---

## STOP — Awaiting PM Review

**Do NOT push, do NOT merge to main until approved.**

Branch: `cleanup/repo-structure-v2`  
Files to commit when approved: all 65 file moves + new directory structure.
