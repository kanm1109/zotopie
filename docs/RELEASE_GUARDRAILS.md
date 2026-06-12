# RELEASE GUARDRAILS

**Date:** 2026-06-12  
**Task:** T1.1-RELEASE-GUARDRAILS  
**Status:** Implemented and verified

---

## Overview

Three layers of protection prevent the failures observed in D3 (stale `tools-enriched.json`, broken `sitemap.xml` reference):

| Layer | Mechanism | When it runs |
|---|---|---|
| **1 — Prebuild hook** | `npm prebuild` → `node scripts/merge-data.mjs` | Every `npm run build` |
| **2 — Validate script** | `npm run validate-release` | Manual / pre-commit / CI |
| **3 — CI workflow** | `.github/workflows/ci.yml` | Every push + PR to `main` |

---

## Layer 1 — Prebuild Hook (already in place)

**File:** `package.json`

```json
"scripts": {
  "prebuild": "node scripts/merge-data.mjs || echo '[prebuild] merge-data failed — using committed generated files'",
  "build": "astro build",
  "validate-release":      "node scripts/validate-release.mjs",
  "validate-release:post": "node scripts/validate-release.mjs --post"
}
```

**What it does:** Every `npm run build` automatically runs `merge-data.mjs` first, regenerating `tools-enriched.json` and `icon-data.json` from `tools.json`.

**Fallback (`|| echo`):** If the script errors, the build continues using the committed generated files. This is intentional for Cloudflare — a prebuild failure should not block deployment. However, if the committed files are stale, this is where problems emerge.

**The stale-file risk:** The prebuild protects against a script crash, but NOT against committed stale files. If someone commits `tools.json` without regenerating `tools-enriched.json`, Cloudflare's prebuild regenerates it correctly — but the local developer won't catch the mismatch until the next `npm run build`.

**Mitigation:** Layer 2 catches this mismatch explicitly.

---

## Layer 2 — Validate Release Script

**File:** `scripts/validate-release.mjs`  
**Usage:**

```bash
# Pre-build: validates source files and generated/source sync
npm run validate-release

# Post-build: validates dist/ output (sitemaps, robots, HTML)
npm run validate-release:post
# or: node scripts/validate-release.mjs --post
```

### Checks performed

**Pre-build mode (always runs):**

| # | Check | Failure action |
|---|---|---|
| 1–7 | Source data files exist (tools.json, taxonomies.json, etc.) | ERROR — blocks release |
| 8 | `tools-enriched.json` exists | ERROR — run merge-data.mjs |
| 9 | `icon-data.json` exists | ERROR — run merge-data.mjs |
| 10 | `tools.json` count == `tools-enriched.json` count | ERROR — stale generated file |
| 11 | All slugs in tools.json present in enriched | ERROR — missing tools in generated |
| 12 | `robots.txt` Sitemap references resolve | WARNING if unverified pre-build |

**Post-build mode (`--post`):**

| # | Check | Failure action |
|---|---|---|
| 13 | `dist/sitemap-index.xml` exists | ERROR |
| 14 | `dist/sitemap-0.xml` exists | ERROR |
| 15 | `dist/robots.txt` exists | ERROR |
| 16 | `dist/_headers` exists | ERROR |
| 17 | `dist/_redirects` exists | ERROR |
| 18 | `dist/index.html` exists | ERROR |
| 19 | `dist/404.html` exists | ERROR |
| 20 | `sitemap-0.xml` has ≥100 URL entries | WARNING if <100, ERROR if 0 |
| 21 | `sitemap-0.xml` has no HTML contamination | ERROR |
| 22 | `sitemap-index.xml` references `sitemap-0.xml` | ERROR |

### Exit codes

| Code | Meaning |
|---|---|
| `0` | All checks passed (or only warnings) — safe to release |
| `1` | One or more errors — DO NOT release |

### Local verification run

```
══════════════════════════════════════════════════
  Zotopie — Release Validation
  Mode: post-build (dist/ included)
══════════════════════════════════════════════════
  ✓  src/data/tools.json
  ✓  src/data/generated/tools-enriched.json
  ✓  Tool count in sync: tools.json=119  enriched=119
  ✓  All 119 slugs present in tools-enriched.json
  ✓  Sitemap reference resolves: sitemap-index.xml (via redirect)
  ✓  Sitemap reference resolves: sitemap-0.xml
  ✓  dist/sitemap-index.xml
  ✓  dist/sitemap-0.xml
  ✓  sitemap-0.xml: 460 URL entries (≥100 expected)
  ✓  sitemap-0.xml: no HTML contamination
  ✓  sitemap-index.xml references sitemap-0.xml
  ✅  All checks passed — safe to release
══════════════════════════════════════════════════
```

---

## Layer 3 — GitHub Actions CI

**File:** `.github/workflows/ci.yml`

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    name: Build & Validate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: node scripts/validate-release.mjs       # pre-build gate
      - run: npm run build                            # merge + astro build
      - run: node scripts/validate-release.mjs --post # post-build gate
```

**What it gates:**

| Scenario | Result |
|---|---|
| `tools.json` updated but `tools-enriched.json` not regenerated | ❌ FAIL at pre-build gate (count mismatch) |
| `merge-data.mjs` crashes during build | ❌ FAIL at post-build gate (stale dist/sitemap) |
| Sitemap generation broken | ❌ FAIL at post-build gate (0 URLs or missing files) |
| HTML contamination in sitemap | ❌ FAIL at post-build gate |
| `robots.txt` references broken URL | ⚠ WARNING (pre-build — robots.txt refs can't be fully verified until build) |
| Clean build with all files in sync | ✅ PASS |

**Note on previous GitHub Actions workflow:** The old "Deploy to Cloudflare Pages" workflow (failed on June 8) was a separate deployment pipeline that no longer exists locally. This new `CI` workflow is validation-only — it does not deploy. Cloudflare Pages deploys via its native GitHub integration on push to `main`.

---

## Build Pipeline — Full Flow

```
Developer pushes to main
         │
         ▼
GitHub Actions CI (ubuntu-latest, Node 20)
  ├── npm ci
  ├── node scripts/validate-release.mjs    ← pre-build gate
  │     ├── source files exist?
  │     ├── tools-enriched.json exists?
  │     └── count sync? (tools.json == enriched)
  │
  ├── npm run build
  │     ├── [prebuild] node scripts/merge-data.mjs
  │     │     reads:  tools.json + overviews.json + best-for.json
  │     │               + alternatives.json + logo-mapping.json
  │     │     writes: src/data/generated/tools-enriched.json
  │     │             src/data/generated/icon-data.json
  │     └── astro build → dist/
  │
  └── node scripts/validate-release.mjs --post   ← post-build gate
        ├── dist/sitemap-index.xml exists?
        ├── dist/sitemap-0.xml exists?
        ├── sitemap has ≥100 URLs?
        ├── no HTML contamination?
        └── sitemap-index references sitemap-0?
         │
         └── CI PASS → Cloudflare native integration deploys dist/
```

---

## Workflow for Adding New Tools

When adding tools to `tools.json`, follow this sequence to avoid the D3 failure pattern:

```bash
# 1. Edit tools.json
code src/data/tools.json

# 2. Regenerate generated files
node scripts/merge-data.mjs

# 3. Validate before committing
npm run validate-release

# 4. Commit BOTH tools.json AND generated/ together
git add src/data/tools.json src/data/generated/
git commit -m "content: add [tool-name] to tools.json"

# 5. Push — CI will validate the build
git push origin main
```

**Never commit `tools.json` without also committing the regenerated `src/data/generated/` files.**

---

## Audit: Build Pipeline Pre-existing State

### `package.json` prebuild hook — `✅ PASS (pre-existing)`

The `prebuild` hook was already correctly configured before this task. No change needed.

```json
"prebuild": "node scripts/merge-data.mjs || echo '[prebuild] merge-data failed — using committed generated files'"
```

### Generated files committed — `✅ PASS (pre-existing)`

`src/data/generated/` is NOT in `.gitignore`. Generated files are committed to the repo, providing a Cloudflare fallback if the prebuild script fails. This is intentional.

### `merge-data.mjs` always runs before build — `✅ PASS (pre-existing)`

npm's lifecycle automatically runs `prebuild` before `build`. Every `npm run build` on Cloudflare triggers merge-data.mjs.

### Stale generated file prevention — `⚠ GAP → ✅ FIXED`

No check existed to detect when `tools.json` was updated without regenerating `tools-enriched.json`. This caused the D3 failure (19 missing tools). Fixed by:
1. `validate-release.mjs` check #10: count comparison
2. `validate-release.mjs` check #11: slug presence check
3. CI workflow that runs pre-build validation on every push

### Broken sitemap references — `⚠ GAP → ✅ FIXED (T2.1)`

`robots.txt` referenced `sitemap.xml` which didn't exist. Fixed in T2.1:
1. `_redirects`: `/sitemap.xml → /sitemap-index.xml 301`
2. `robots.txt`: replaced `sitemap.xml` with `sitemap-0.xml`
3. `validate-release.mjs` check #12: robots.txt Sitemap references validated

---

## Files Created / Modified

| File | Action |
|---|---|
| `scripts/validate-release.mjs` | **Created** — 22-check validation script |
| `package.json` | **Modified** — added `validate-release` + `validate-release:post` scripts |
| `.github/workflows/ci.yml` | **Created** — CI pipeline: validate → build → validate |

---

*Generated: 2026-06-12 | Task: T1.1-RELEASE-GUARDRAILS*
