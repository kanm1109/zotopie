# Zotopie — Project Specification

**Version:** 1.0  
**Date:** 2026-06-10  
**Status:** Active  
**Audience:** Content-generation tasks, AI assistants, future contributors

---

## Project Overview

Zotopie is a static software review site that helps individuals and small businesses evaluate, compare, and find alternatives to SaaS and productivity tools. The site is built with Astro (SSG), deployed to Cloudflare Pages, and hosted at `https://zotopie.com`.

The primary content unit is the **tool review page** — each tool gets a dedicated URL at `/reviews/{slug}`, containing an overview, pros/cons, best-for use cases, pricing breakdown, alternatives, key features, use cases, who should avoid it, and a verdict. Secondary pages include category landing pages (`/category/{slug}`), alternatives pages (`/alternatives/{slug}`), and comparison pages (`/compare/{slug-vs-slug}`).

Content is stored in JSON files under `src/data/`. A merge script combines those files into a single generated file (`tools-enriched.json`) consumed by all Astro pages at build time.

---

## Data Architecture

### Canonical Source: `tools.json`

Every tool record begins in `tools.json`. This is the single source of truth for tool identity, metadata, and primary content. All other data files are supplements or overrides that enrich the canonical record.

### Primary Source Files (manually maintained)

| File | Purpose | Key Field | Format |
|------|---------|-----------|--------|
| `src/data/tools.json` | Canonical tool registry — identity, metadata, full content | `slug` | Array of tool objects |
| `src/data/overviews.json` | Supplemental overview text (boilerplate fallback) | `tool` (display name) | `[{ tool, overview }]` |
| `src/data/pros-cons.json` | Supplemental pros/cons (mirrors or overrides tools.json) | `tool` (display name) | Array of full tool objects |
| `src/data/alternatives.json` | Alternative tool references per tool | `tool` (display name) | `[{ tool, alternatives: ["slug"] }]` |
| `src/data/best-for.json` | Best-for use case strings per tool | `tool` (display name) | `[{ tool, bestFor: ["string"] }]` |
| `src/data/logo-mapping.json` | Maps tool display names to simple-icons slugs | `tool_name` | `[{ tool_name, simple_icon }]` |
| `src/data/taxonomies.json` | Valid category taxonomy | `slug` | `[{ name, slug, description }]` |
| `src/data/category-content.json` | Long-form editorial content for category pages | `category` (slug) | `[{ category, intro, how_to_choose, faqs }]` |

### Generated Files (do not edit manually)

| File | Purpose | Generator |
|------|---------|-----------|
| `src/data/generated/tools-enriched.json` | Merged tool records consumed by all Astro pages | `scripts/merge-data.mjs` |
| `src/data/generated/icon-data.json` | Icon path/hex data derived from simple-icons npm package | `scripts/merge-data.mjs` |

### Content Batch Files (new content pipeline — not yet integrated into merge)

| File | Purpose | Format |
|------|---------|--------|
| `src/data/pros-cons-seo.json` | SEO-quality batch pros/cons for a category | Object keyed by slug: `{ "slug": { pros, cons } }` |
| `src/data/research/overviews-seo.json` | SEO-quality batch overviews for a category | Object keyed by slug: `{ "slug": { overview } }` |
| `src/data/research/verified-tools.json` | Manual verification records | `[{ slug, verified, issues, correctedDescription, correctedPricing }]` |
| `src/data/validation-report-seo.json` | Validation report output from content review tasks | `{ summary, errors[], warnings[] }` |

> **Assumption:** `pros-cons.json` currently mirrors the content of `tools.json` for all tools with populated pros/cons. It appears to be a legacy override file that predates the practice of storing pros/cons directly in `tools.json`. It is still consumed by the merge script and takes priority over `tools.json` when its arrays are non-empty.

---

## Source of Truth

```
tools.json
```

`tools.json` is the canonical source for:

- Tool identity (name, slug, website)
- Metadata (pricing, rating, featured, addedDate, affiliate, categories)
- Primary content (overview, pros, cons, bestFor, keyFeatures, pricingBreakdown, useCases, whoShouldAvoid, verdict)
- Alternative references (slug list)

No tool may exist in any other data file unless it first exists in `tools.json`. All supplemental files are keyed by tool name or slug and are validated against `tools.json`.

---

## File Relationships

```
tools.json                   ← canonical source (119 tools)
├── overviews.json           ← fallback overview (tools.json wins if non-empty)
├── pros-cons.json           ← override pros/cons (wins when arrays non-empty)
├── alternatives.json        ← override alternatives (wins when present)
├── best-for.json            ← override bestFor (wins when present)
├── logo-mapping.json        ← simple_icon slug (validated against npm package)
└── taxonomies.json          ← category slug validation reference

scripts/merge-data.mjs
└── reads all 6 source files above
    ├── writes: src/data/generated/tools-enriched.json
    └── writes: src/data/generated/icon-data.json

Astro pages (src/pages/)
└── import tools-enriched.json at build time
    └── category pages also import category-content.json

Content batch pipeline (not yet wired into merge):
pros-cons-seo.json           ← validated batch → migrate into pros-cons.json / tools.json
research/overviews-seo.json  ← validated batch → migrate into overviews.json / tools.json
validation-report-seo.json   ← output of validation tasks (read-only artifact)
research/verified-tools.json ← manual verification output (read-only artifact)
```

---

## Schema Summary

### `tools.json` — Tool Object

```
name             string    required    Display name (e.g. "Ahrefs")
slug             string    required    URL-safe identifier (e.g. "ahrefs")
description      string    required    One-line description (≤160 chars)
website          string    required    Full URL including https://
logo             string    optional    Path to local logo SVG (e.g. "/logos/semrush.svg") or ""
pricing          string    required    One of: "Free" | "Freemium" | "Paid" | "Free Trial"
startingPrice    string    optional    Human-readable price (e.g. "$129/mo") or ""
affiliate        boolean   required    true if affiliate link is used
rating           number    required    0.0–5.0
featured         boolean   required    true to appear in homepage featured section
addedDate        string    required    ISO date (YYYY-MM-DD)
primaryCategory  string    required    One valid taxonomy slug
categories       string[]  required    Array of valid taxonomy slugs (primaryCategory must be included)
alternatives     string[]  optional    Array of tool slugs (must resolve to valid tools)
overview         string    optional    Multi-paragraph overview text (empty string if not yet written)
pros             string[]  optional    List of specific benefit strings
cons             string[]  optional    List of specific limitation strings
bestFor          string[]  optional    List of audience/use-case strings
keyFeatures      object[]  optional    [{ title: string, description: string }]
pricingBreakdown object    optional    { plans: [{ name, price, description }], hasFree: bool, note: string }
useCases         string[]  optional    Specific use case strings
whoShouldAvoid   string[]  optional    Audience segments who should not use this tool
verdict          object    optional    { summary: string, score: number }
```

### `overviews.json` — Entry Object

```
tool      string    Tool display name (must match tools.json name, case-insensitive)
overview  string    Overview text (used only when tools.json overview is empty)
```

### `pros-cons.json` — Entry Object

Same full schema as `tools.json`. Only `.pros` and `.cons` fields are consumed by the merge script.

### `alternatives.json` — Entry Object

```
tool          string    Tool display name
alternatives  string[]  Array of tool slugs (each must resolve to a valid slug in tools.json)
```

### `best-for.json` — Entry Object

```
tool     string    Tool display name
bestFor  string[]  Array of best-for strings
```

### `logo-mapping.json` — Entry Object

```
tool_name    string    Tool display name
simple_icon  string    Slug from the simple-icons npm package (e.g. "notion", "googleanalytics")
```

### `taxonomies.json` — Entry Object

```
name         string    Human-readable category name (e.g. "SEO & Search")
slug         string    URL-safe category slug (e.g. "seo-search")
description  string    One-line category description
```

### `category-content.json` — Entry Object

```
category       string    Category slug (must match taxonomies.json slug)
intro          string    Multi-paragraph editorial introduction (long-form)
how_to_choose  string[]  Evaluation criteria list (8 items)
faqs           object[]  [{ question: string, answer: string }] (5 items)
```

### `pros-cons-seo.json` — Batch Object (not yet integrated)

```
{
  "tool-slug": {
    pros: string[]
    cons: string[]
  }
}
```

Keys are tool slugs (lowercase, kebab-case). Not keyed by display name.

### `research/overviews-seo.json` — Batch Object (not yet integrated)

```
{
  "tool-slug": {
    overview: string
  }
}
```

Note: uses slugs that may contain underscores or mixed conventions (e.g., `surferseo`, `rank_math`). Slug normalization is required before integration.

### `research/verified-tools.json` — Entry Object

```
slug                  string    Tool slug
verified              boolean   Whether tool data has been manually verified
issues                string[]  List of identified data issues
correctedDescription  string    Corrected description (if changed) or ""
correctedPricing      string    Corrected pricing (if changed) or ""
```

### `src/data/generated/tools-enriched.json` — Enriched Tool Object

All fields from `tools.json` plus:

```
simple_icon  string    Resolved simple-icons slug (from logo-mapping.json) or ""
```

All content fields (overview, pros, cons, bestFor, alternatives) are the merge-resolved values.

### `src/data/generated/icon-data.json` — Icon Registry

```
{
  "simple-icon-slug": {
    hex:  string    Color hex without # (e.g. "FF4F00")
    path: string    SVG path d attribute value
  }
}
```

---

## Naming Conventions

### Tool Slugs

- Format: `kebab-case`, all lowercase
- Words separated by hyphens
- No special characters other than hyphens
- Examples: `ahrefs`, `surfer-seo`, `google-analytics`, `rank-math`
- Used in: URL paths (`/reviews/{slug}`), alternative references, data file keys

### Category Slugs

- Format: `kebab-case`, all lowercase
- Compound concepts joined with hyphens
- Must exactly match one of the 11 valid slugs in `taxonomies.json`
- Examples: `seo-search`, `content-ai-creation`, `productivity-knowledge-management`

### Data File Naming

- All data files: `lowercase-hyphenated.json`
- Batch/content pipeline files: append `-seo` suffix (e.g., `pros-cons-seo.json`, `overviews-seo.json`)
- Validation output files: `validation-report-{batch-name}.json`
- Research/draft files: placed in `src/data/research/` subdirectory
- Generated files: placed in `src/data/generated/` subdirectory

### Logo/Icon Slugs (simple-icons)

- Stored in `logo-mapping.json` as lowercase (matching the simple-icons package naming)
- Accessed in JavaScript via `"si" + slug.charAt(0).toUpperCase() + slug.slice(1)` (e.g., `siNotion`)
- Some tools have non-obvious mappings: `Claude → anthropic`, `ConvertKit → kit`, `Plausible → plausibleanalytics`, `Google Analytics → googleanalytics`

---

## Content Pipeline

The content pipeline has two tracks: the **active merge pipeline** (runs at build time) and the **batch content pipeline** (generates new content that later graduates into the active pipeline).

### Active Merge Pipeline

```
Stage 1 — Source data
  Inputs: tools.json, overviews.json, pros-cons.json, alternatives.json,
          best-for.json, logo-mapping.json
  Output: (in memory)

Stage 2 — Merge (scripts/merge-data.mjs)
  Command: node scripts/merge-data.mjs
  Merge rules (priority order):
    overview:     tools.json[overview] if non-empty; else overviews.json[overview]
    pros/cons:    pros-cons.json if arrays non-empty; else tools.json[pros/cons]
    bestFor:      best-for.json if present; else tools.json[bestFor]
    alternatives: alternatives.json if present; else tools.json[alternatives]
    simple_icon:  logo-mapping.json → validated against simple-icons npm package
  Output: src/data/generated/tools-enriched.json
          src/data/generated/icon-data.json

Stage 3 — Astro build
  Command: npx astro build (or Cloudflare Pages auto-build)
  Reads:   tools-enriched.json, category-content.json, taxonomies.json
  Output:  dist/ (static HTML/CSS/JS)

Stage 4 — Deploy
  Trigger: git push to main → Cloudflare Pages auto-deploys
  Target:  https://zotopie.com
```

### Batch Content Pipeline (content generation tasks)

Used when generating content for a batch of tools in a category.

```
Stage B1 — Research
  Input:  tools.json (tool list for category)
  Output: research/verified-tools.json (verification status)

Stage B2 — Content Generation
  Input:  tools.json, research/verified-tools.json
  Output: pros-cons-seo.json (or overviews-seo.json for overviews)
  Format: object keyed by tool slug

Stage B3 — Validation
  Input:  pros-cons-seo.json (or overviews-seo.json), tools.json
  Output: validation-report-seo.json
  Checks: cross-file integrity, boilerplate detection, marketing language, slug consistency

Stage B4 — Integration (manual step)
  Input:  Validated batch file + validation-report-seo.json
  Action: Migrate content into tools.json or supplemental source files
  Then:   Re-run merge script (Stage 2 above)
```

---

## Validation Rules

### Structural Integrity

1. Every tool slug in `alternatives` arrays must resolve to a valid slug in `tools.json`.
2. Every tool entry in supplemental files (`overviews.json`, `pros-cons.json`, `alternatives.json`, `best-for.json`) must match a tool that exists in `tools.json` (case-insensitive name match).
3. Every `primaryCategory` and every item in `categories` arrays must exactly match one of the 11 valid slugs in `taxonomies.json`.
4. Every `category` key in `category-content.json` must exactly match one of the 11 valid slugs in `taxonomies.json`.
5. Every `simple_icon` in `logo-mapping.json` must resolve to a valid key in the `simple-icons` npm package.

### Data Quality

6. `overview` text must not consist primarily of boilerplate/template language. It must contain tool-specific facts, use cases, and differentiation.
7. `overview` text must not include marketing language such as "widely recognized", "commonly considered alongside alternatives", or vendor-style promotional claims.
8. `pros` entries must be specific and measurable, not generic (e.g., "Easy to use" is too vague; "Drag-and-drop editor requires no code" is acceptable).
9. `cons` entries must be factual limitations, not veiled praise.
10. `description` must be ≤ 160 characters.
11. `rating` must be between 0.0 and 5.0.
12. `pricing` must be one of: `"Free"`, `"Freemium"`, `"Paid"`, `"Free Trial"`.
13. `addedDate` must be a valid ISO 8601 date string (`YYYY-MM-DD`).

### Slug Consistency

14. Tool names used as keys in supplemental files (e.g., `tool: "Surfer SEO"`) must match `tools.json` names. Slug form in the `alternatives` arrays must match `tools.json` slugs exactly (e.g., `"surfer-seo"` not `"SurferSEO"`).
15. Batch files keyed by slug (e.g., `pros-cons-seo.json`) must use the exact slug form from `tools.json`.

### No Duplicates

16. No tool may appear more than once in `tools.json` (checked by `slug`).
17. No tool may appear more than once in any supplemental file.

---

## Future Task Guidelines

All future AI-generated content tasks must comply with these rules.

### 1. Always declare inputs and outputs

Every task specification must explicitly list:

```
INPUT FILES:   (list every file that will be read)
OUTPUT FILES:  (list every file that will be created or modified)
```

Implicit reads or writes are not permitted.

### 2. File modification rules

- **`tools.json`** — the canonical source. May be modified to add new tools or update content. When modifying, preserve exact JSON structure and all existing fields.
- **`overviews.json`, `pros-cons.json`, `alternatives.json`, `best-for.json`** — supplemental files. May be modified to add or update records. Preserve existing records.
- **`generated/tools-enriched.json`, `generated/icon-data.json`** — generated. Do not modify manually unless the merge script cannot be run (Node.js unavailable). If manual edits are required, document them explicitly.
- **Batch files** (`pros-cons-seo.json`, `research/overviews-seo.json`) — output artifacts of content tasks. Do not modify after a validation report has been generated unless the report explicitly authorizes changes.
- **Validation reports** (`validation-report-seo.json`) — read-only artifacts. Never modify.
- **`taxonomies.json`** — reference table. Do not modify without updating all dependent files.

### 3. JSON structure preservation

- Maintain the existing field order in each file.
- Do not add fields that are not in the established schema without explicit authorization.
- Do not remove fields, even if they appear empty. Empty strings `""` and empty arrays `[]` are valid states.
- All array items must be valid JSON strings or objects. No trailing commas.

### 4. Slug handling

- Always use the slug from `tools.json` as the canonical identifier.
- When a task generates content keyed by tool name, verify the name matches `tools.json` exactly.
- When a task generates content keyed by slug, verify the slug matches `tools.json` exactly.
- Do not invent or approximate slugs. If a slug is uncertain, look it up in `tools.json`.

### 5. Alternative reference integrity

- Any task that writes to `alternatives` arrays must verify that every slug in those arrays resolves to a valid tool in `tools.json`.
- Do not reference tools that do not exist in `tools.json`. If a desired alternative is missing, it must first be added as a placeholder tool.

### 6. No assumptions about external content

- Do not fabricate pricing, ratings, or descriptions.
- Do not infer that a tool is "free" or "paid" based on its name alone.
- Do not guess whether a tool is affiliated without explicit data in `tools.json`.

### 7. Batch file format

When generating batch content for a category, use this format for consistency with the established pipeline:

**Pros/cons batch:**
```json
{
  "tool-slug": {
    "pros": ["specific benefit 1", "specific benefit 2"],
    "cons": ["specific limitation 1", "specific limitation 2"]
  }
}
```

**Overviews batch:**
```json
{
  "tool-slug": {
    "overview": "Multi-paragraph overview text..."
  }
}
```

Keys must be tool slugs (kebab-case, matching `tools.json`).

### 8. Validation before integration

Before any batch content file is integrated into the active pipeline:

1. A validation task must be run against the batch file.
2. The validation task must output a `validation-report-{batch}.json`.
3. All `errors` in the validation report must be resolved.
4. `warnings` must be reviewed and either resolved or explicitly acknowledged.
5. Only after a clean (or acknowledged) validation report may content be migrated to source files.

---

## Category Structure

Zotopie uses exactly **11 categories**. These slugs are fixed and must not be changed without updating all dependent files.

| Slug | Display Name |
|------|-------------|
| `community-growth` | Community Growth |
| `social-media-management` | Social Media Management |
| `content-ai-creation` | Content & AI Creation |
| `seo-search` | SEO & Search |
| `marketing-lead-generation` | Marketing & Lead Generation |
| `link-tracking` | Link Tracking |
| `workflow-automation` | Workflow Automation |
| `data-analytics` | Data Analytics |
| `productivity-knowledge-management` | Productivity & Knowledge Management |
| `infrastructure-hosting` | Infrastructure & Hosting |
| `ecommerce-monetization` | Ecommerce & Monetization |

Each category requires a corresponding entry in `category-content.json` with `intro`, `how_to_choose`, and `faqs` fields populated.

---

## Publishing Workflow

### Adding a New Tool

1. Add a complete entry to `tools.json` with all required fields.
2. If the tool belongs in a category not yet populated in `logo-mapping.json`, add a `logo-mapping.json` entry (verify the simple-icons slug first).
3. Add an entry to `alternatives.json` and `best-for.json` if content is available.
4. Run `node scripts/merge-data.mjs` to regenerate `tools-enriched.json` and `icon-data.json`.
5. Commit all changed files (including generated files — they are committed to the repo so Cloudflare Pages can use them even when Node.js is unavailable in CI).
6. Push to `main` → Cloudflare Pages auto-deploys.

### Updating Existing Tool Content

1. Edit the relevant field(s) in `tools.json` (for primary content) or the appropriate supplemental file.
2. Re-run merge script.
3. Commit and push.

### Generating a Content Batch for a Category

1. Create task spec listing: target category, tool slugs, input files, output file.
2. Generate batch content → write to `pros-cons-seo.json` or `research/overviews-seo.json`.
3. Run validation task → write to `validation-report-{batch}.json`.
4. Review report. Fix errors.
5. Integrate validated content into `tools.json` or supplemental files.
6. Re-run merge script. Commit and push.

### Rollback

Cloudflare Pages retains all previous deployments. To roll back:
- Use the Cloudflare Pages dashboard to promote a previous deployment.
- Or revert the Git commit and push — a new build starts automatically.

---

## File Dependencies Quick Reference

```
To change a tool's URL:
  → Edit tools.json[slug]
  → Check alternatives.json for all references to old slug
  → Check tools.json[alternatives] for all references to old slug
  → Re-run merge script

To add a new category:
  → Add entry to taxonomies.json
  → Add entry to category-content.json
  → Update tools.json entries to reference new category slug
  → Re-run merge script

To remove a tool:
  → Remove from tools.json
  → Remove from overviews.json, pros-cons.json, alternatives.json, best-for.json, logo-mapping.json
  → Search and remove all references to its slug in other tools' alternatives arrays
  → Re-run merge script

To update an icon:
  → Edit logo-mapping.json simple_icon value
  → Verify slug exists in simple-icons npm package
  → Re-run merge script (icon-data.json is regenerated)
```

---

*This document was generated from analysis of all source data files as of 2026-06-10. It should be updated whenever the data architecture, schema, or pipeline changes.*
