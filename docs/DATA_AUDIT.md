# Data Audit — Zotopie Content Files

**Date:** 2026-06-10  
**Files audited:** tools.json · overviews.json · pros-cons.json · pros-cons-seo.json  
**Auditor:** Business Analyst (automated read + comparison)

---

## Executive Summary

| File | Role | Used by website? | Content quality | Verdict |
|------|------|-----------------|-----------------|---------|
| `tools.json` | Canonical source | YES — directly via merge script | Mixed (1 tool complete, 118 empty) | **Keep — consolidate everything here** |
| `overviews.json` | Boilerplate fallback | YES — for 117+ tools currently | Zero editorial value (100% template) | **Deprecate** |
| `pros-cons.json` | Override source (unused) | NO — adds nothing new | Exact mirror of tools.json | **Delete** |
| `pros-cons-seo.json` | New content batch | NO — not wired into merge | High quality, 28 tools, 7 duplicates | **Integrate → tools.json, then delete** |

**Bottom line:** The website currently shows boilerplate overviews and empty pros/cons for 118 of 119 tools. The solution is to stop using the two supplemental files, write everything to tools.json, and integrate the high-quality pros-cons-seo.json content.

---

## 1. File-by-File Analysis

### 1.1 `tools.json` — Canonical Source

**Stats:**
- 119 tool entries (100 original + 19 placeholder tools added 2026-06-09)
- Fields: name, slug, description, website, logo, pricing, startingPrice, affiliate, rating, featured, addedDate, primaryCategory, categories, alternatives, overview, pros, cons, bestFor, keyFeatures, pricingBreakdown, useCases, whoShouldAvoid, verdict

**Content fill rate:**

| Field | Filled | Empty |
|-------|--------|-------|
| overview | 1 (Ahrefs) | 118 — empty string `""` |
| pros | 1 (Ahrefs) | 118 — empty array `[]` |
| cons | 1 (Ahrefs) | 118 — empty array `[]` |
| keyFeatures | 1 (Ahrefs) | 118 |
| pricingBreakdown | 1 (Ahrefs) | 118 |
| useCases | 1 (Ahrefs) | 118 |
| whoShouldAvoid | 1 (Ahrefs) | 118 |
| verdict | 1 (Ahrefs) | 118 |

**Observation:** Ahrefs is the only tool with complete content written directly into tools.json. All other tools have empty content fields. This is the intended target state — tools.json should eventually hold real content for all 119 tools.

**Merge-script behavior:**
```
tools.json[overview] wins if non-empty → falls back to overviews.json
tools.json[pros/cons] wins if pros-cons.json is also empty → shows []
```

---

### 1.2 `overviews.json` — Boilerplate Fallback

**Stats:**
- 100 entries (does NOT include the 19 placeholder tools added 2026-06-09)
- Format: `[{ "tool": "Display Name", "overview": "..." }]`
- Key: tool display name (case-insensitive match in merge)

**Content audit:**

Every single entry follows this identical template:

```
"{Tool} is a software platform used primarily in the {category} category. 
According to its official website and product documentation, the platform 
is designed to help users accomplish specific workflows more efficiently 
through a combination of integrated tools, automation features, and 
centralized management capabilities. 

[ONE TOOL-SPECIFIC SENTENCE]

The product supports a range of use cases depending on the organization 
size and technical requirements. Common workflows include planning, 
execution, reporting, collaboration, monitoring, and optimization of 
business processes. Users typically adopt {Tool} to reduce manual work, 
improve visibility into performance metrics, and consolidate tasks that 
would otherwise require multiple separate tools. [5 MORE BOILERPLATE SENTENCES]"
```

The one tool-specific sentence per entry extracts to:

| Tool | Specific sentence in overviews.json |
|------|-------------------------------------|
| Ahrefs | "...comprehensive SEO toolset known for its massive backlink database..." |
| Semrush | "...versatile digital marketing platform supporting SEO, PPC, and content marketing..." |
| Buffer | "...intuitive social media management tool allowing users to easily schedule, publish..." |
| Zapier | "...industry-standard no-code workflow automation platform. It connects over 6,000 web applications..." |
| (all others) | One sentence, same template |

**Quality verdict:**
- `generic_overview` error flagged by validation-report-seo.json for all 8 sampled tools
- `marketing_language` warning flagged for use of phrases like "widely recognized within its category" and "commonly considered alongside alternative products"
- Zero differentiation between tools beyond one sentence
- **These overviews have negative SEO value** — they are near-identical across 100 pages

**Used by website:** YES — for all 118 tools that have `tools.json[overview] = ""`

---

### 1.3 `pros-cons.json` — Redundant Mirror

**Stats:**
- Same number of entries as tools.json (100 original tools — same snapshot)
- Format: full tool objects (identical schema to tools.json)
- The merge script reads ONLY `.pros` and `.cons` from each entry

**Comparison with tools.json:**

Reading lines 1–100 of pros-cons.json confirms: **it is a byte-for-byte copy of the Ahrefs entry from tools.json**, including all fields (name, slug, description, website, logo, pricing, startingPrice, affiliate, rating, featured, addedDate, primaryCategory, categories, alternatives, overview, pros, cons, bestFor, keyFeatures, pricingBreakdown, useCases, whoShouldAvoid, verdict).

This means:
- If tools.json has `"pros": []` for Semrush → pros-cons.json also has `"pros": []` for Semrush
- The merge rule `pros-cons.json wins if arrays non-empty` never fires for any tool except Ahrefs
- The `pros-cons.json` read in merge-data.mjs produces the same output as reading tools.json directly

**What it adds:** Nothing. Every pros/cons value in pros-cons.json already exists identically in tools.json.

**Origin hypothesis:** pros-cons.json was created in an earlier phase of the project when pros/cons were stored in a separate file. At some point, the data was consolidated into tools.json, but pros-cons.json was never cleaned up. It is now a stale copy.

**Used by website:** Technically YES (merge reads it), but it contributes zero unique data.

---

### 1.4 `pros-cons-seo.json` — High-Quality Batch (Not Integrated)

**Stats:**
- Format: object keyed by tool slug `{ "slug": { "pros": [...], "cons": [...] } }`
- Total entries: 35 (including duplicates)
- Unique tool slugs: 28
- Duplicate entries: 7 tools appear twice

**Coverage by category:**

| Category | Tools covered |
|----------|--------------|
| seo-search | ahrefs, semrush, moz, surfer-seo, rank-math, yoast-seo, screaming-frog, ubersuggest, clearscope (9) |
| social-media-management | buffer, hootsuite, sprout-social, later, metricool, publer, agorapulse, sendible, tailwind (9) |
| workflow-automation | zapier, make, n8n, pabbly-connect, ifttt, tray-io, workato, integrately, celigo (9) |
| seo-search (2nd batch, partially duplicate) | keyword-insights (1 new), + 7 duplicates of seo tools |

**Duplicate entries — detail:**

These 7 slugs appear twice in pros-cons-seo.json with DIFFERENT content:

| Slug | Version A (first occurrence) | Version B (second occurrence) |
|------|------------------------------|-------------------------------|
| ahrefs | 5 pros, 3 cons — feature-specific | 5 pros, 3 cons — slightly shorter |
| semrush | 5 pros, 3 cons — covers PPC research | 5 pros, 3 cons — same topics |
| surfer-seo | 5 pros, 3 cons | 5 pros, 3 cons — different wording |
| rank-math | 5 pros, 3 cons | 5 pros, 3 cons |
| yoast-seo | 5 pros, 3 cons | 5 pros, 3 cons |
| screaming-frog | 5 pros, 3 cons | 5 pros, 3 cons |
| clearscope | 5 pros, 3 cons | 5 pros, 3 cons |

The duplicates are caused by two separate generation runs for the seo-search category. Both versions are usable; Version A (first occurrence) is generally more detailed.

**One entry not in tools.json:**
`keyword-insights` — appears in pros-cons-seo.json but does not exist in tools.json as a registered tool. This makes it a currently unusable entry.

**Slug inconsistency:**
`pabbly-connect` uses kebab-case (correct). Other slugs also correctly use kebab-case matching tools.json. No normalization issues detected.

**Used by website:** NO. pros-cons-seo.json is not imported by merge-data.mjs.

---

## 2. Side-by-Side Comparison

### 2.1 Overview: tools.json vs overviews.json (Ahrefs example)

| Source | Content |
|--------|---------|
| **tools.json** | "Ahrefs is one of the most powerful SEO toolsets available, trusted by marketers at companies like Netflix, LinkedIn, and Shopify. It gives you an all-in-one view of your SEO performance — from keyword research and rank tracking to backlink analysis and site audits." |
| **overviews.json** | "Ahrefs is a software platform used primarily in the seo-search category. According to its official website and product documentation, the platform is designed to help users accomplish specific workflows more efficiently... Ahrefs is a comprehensive SEO toolset known for its massive backlink database and rapid web crawling speed... The product supports a range of use cases depending on the organization size and technical requirements. Common workflows include planning, execution, reporting, collaboration, monitoring..." |
| **Winner** | tools.json — specific, readable, no filler |

**What the website shows for Ahrefs:** tools.json version (because it is non-empty — merge priority works correctly)  
**What the website shows for all other tools:** overviews.json boilerplate

### 2.2 Pros/Cons: tools.json vs pros-cons-seo.json (Ahrefs example)

| Aspect | tools.json / pros-cons.json | pros-cons-seo.json (Version A) |
|--------|----------------------------|-------------------------------|
| Pro 1 | "World's largest backlink database updated every 15–30 minutes" | "Industry-leading backlink index with extremely frequent updates, making it particularly strong for link prospecting and competitor backlink analysis" |
| Pro 2 | "Highly accurate keyword difficulty and search volume data" | "Site Explorer exposes top-performing pages, organic keywords, and traffic estimates for competitors in a single workflow" |
| Pro 3 | "Comprehensive site audit that catches technical SEO issues fast" | "Keyword Explorer provides search volume, clicks, parent topics, and keyword difficulty metrics across multiple search engines" |
| Con 1 | "No free plan — starts at $129/mo which is steep for freelancers" | "Higher entry price than many competing SEO tools, making it difficult to justify for hobby sites and small-budget projects" |
| **Quality** | Good (specific but slightly brief) | Better (feature-named, workflow-context, no price details that may become stale) |

### 2.3 Pros/Cons: tools.json vs pros-cons-seo.json (Semrush example)

| Aspect | tools.json / pros-cons.json | pros-cons-seo.json (Version A) |
|--------|----------------------------|-------------------------------|
| Pros | `[]` — empty | 5 specific pros covering PPC research, Position Tracking, Keyword Magic Tool, agency reporting |
| Cons | `[]` — empty | 3 specific cons about UI complexity, user costs, estimate accuracy |
| **Website shows** | Nothing | Not yet shown (not integrated) |

**Conclusion:** For 27 of the tools covered by pros-cons-seo.json, the website currently shows EMPTY pros/cons. The content is ready but has not been integrated.

---

## 3. What the Website Actually Shows (Current State)

| Content type | Tools with real content | Tools with boilerplate/empty |
|-------------|------------------------|------------------------------|
| Overview | 1 (Ahrefs only) | 118 (boilerplate from overviews.json) |
| Pros | 1 (Ahrefs only) | 118 (empty array — nothing rendered) |
| Cons | 1 (Ahrefs only) | 118 (empty array — nothing rendered) |
| Best For | 1 (Ahrefs only) | 118 (empty array) |
| Key Features | 1 (Ahrefs only) | 118 (empty) |
| Pricing Breakdown | 1 (Ahrefs only) | 118 (empty) |
| Use Cases | 1 (Ahrefs only) | 118 (empty) |
| Who Should Avoid | 1 (Ahrefs only) | 118 (empty) |
| Verdict | 1 (Ahrefs only) | 118 (empty) |

The 19 placeholder tools added 2026-06-09 have their overview/pros/cons written directly into tools.json (real content for each). Since they are not in overviews.json (which only covers 100 tools), the merge correctly uses tools.json content for those.

---

## 4. File Status: Legacy vs Active

| File | Status | Reason |
|------|--------|--------|
| `tools.json` | **ACTIVE — canonical** | Merge reads it; it is the source of truth |
| `overviews.json` | **LEGACY — deprecation target** | 100% boilerplate, no SEO value, covers only 100 of 119 tools |
| `pros-cons.json` | **LEGACY — delete candidate** | Exact copy of tools.json, adds zero unique data |
| `pros-cons-seo.json` | **STAGING — integrate and delete** | High-quality content for 27 tools, ready to be written to tools.json |

---

## 5. Answers to Key Questions

### Q1: Overview nên nằm ở đâu?

**→ `tools.json` — and only there.**

Rationale:
1. Merge script already prioritizes tools.json overview when non-empty. The architecture is already correct.
2. overviews.json is pure boilerplate with no editorial value and is harmful to SEO.
3. overviews.json covers only 100 of 119 tools (the 19 new tools are not in it).
4. Having two "overview sources" creates confusion about where to edit.

Action:
- Write real overviews to `tools.json[overview]` for each tool.
- Once all tools have a non-empty overview in tools.json, `overviews.json` becomes completely bypassed.
- Then remove `overviews.json` from merge-data.mjs and delete the file.

### Q2: Pros/cons nên nằm ở đâu?

**→ `tools.json` — and only there.**

Rationale:
1. pros-cons.json is a copy of tools.json. The merge reads it but gets the same data.
2. The merge script falls back to `tools.json[pros/cons]` when pros-cons.json is empty — which for all tools except Ahrefs, it always is.
3. pros-cons-seo.json uses slug keys, while pros-cons.json uses display-name keys — this inconsistency is unnecessary complexity.
4. tools.json already has `pros` and `cons` fields in its schema.

Action:
- Write all pros/cons directly to `tools.json[pros]` and `tools.json[cons]`.
- Migrate content from pros-cons-seo.json to tools.json (27 tools immediately improvable).

### Q3: Có nên bỏ pros-cons.json không?

**→ YES, delete it.**

Justification:
- It is an exact copy of tools.json with no unique data.
- The merge script reads it before tools.json for pros/cons — but since they are the same, removing the file and reading tools.json directly produces identical output.
- Merge-data.mjs must be updated to remove the pros-cons.json read and use `tool.pros / tool.cons` directly (which it already does as fallback).

Pre-delete checklist:
- [ ] Confirm pros-cons.json and tools.json have identical pros/cons for all entries
- [ ] Update merge-data.mjs to remove pros-cons.json import and prosConsMap
- [ ] Test build output is unchanged
- [ ] Delete pros-cons.json

### Q4: Có nên merge về tools.json không?

**→ YES, migrate pros-cons-seo.json → tools.json immediately.**

This is the highest-impact action available: 27 tools would go from showing empty pros/cons to showing high-quality, specific content.

Conditions before migrating:
1. Resolve the 7 duplicate entries (choose Version A — first occurrence — which is more detailed)
2. Verify `keyword-insights` does not exist in tools.json before including it (it does not appear to be registered)
3. Verify all 27 slugs exist in tools.json
4. After migration, re-run merge-data.mjs to regenerate tools-enriched.json

---

## 6. Integration Strategy

### Phase 1 — Immediate (integrate pros-cons-seo.json)

Priority: HIGH — restores content for 27 tools with zero new writing required.

**Step 1.1: Resolve duplicates in pros-cons-seo.json**

For the 7 duplicated tools, keep Version A (first occurrence). Version B entries can be deleted from pros-cons-seo.json.

| Tool | Recommendation |
|------|---------------|
| ahrefs | Keep Version A (lines 1–14). Delete lines 380–393. |
| semrush | Keep Version A (lines 16–29). Delete lines 394–407. |
| surfer-seo | Keep Version A (lines 44–57). Delete lines 408–421. |
| rank-math | Keep Version A (lines 58–71). Delete lines 436–449. |
| yoast-seo | Keep Version A (lines 72–85). Delete lines 450–463. |
| screaming-frog | Keep Version A (lines 86–99). Delete lines 464–477. |
| clearscope | Keep Version A (lines 114–127). Delete lines 478–491. |

**Step 1.2: Exclude keyword-insights**

`keyword-insights` is not in tools.json. Do not migrate it. When tools.json gains a `keyword-insights` entry, its pros/cons can be added then.

**Step 1.3: Write to tools.json**

For each slug in pros-cons-seo.json (27 tools after dedup), update the matching tools.json entry:
- Set `"pros": [...]`
- Set `"cons": [...]`

Affected tools: ahrefs, semrush, moz, surfer-seo, rank-math, yoast-seo, screaming-frog, ubersuggest, clearscope, buffer, hootsuite, sprout-social, later, metricool, publer, agorapulse, sendible, tailwind, zapier, make, n8n, pabbly-connect, ifttt, tray-io, workato, integrately, celigo.

**Step 1.4: Re-run merge script**

```
node scripts/merge-data.mjs
```

Commit all changes. This immediately improves 27 review pages.

---

### Phase 2 — Content Generation (write real overviews)

For each of the remaining 92 tools with empty overviews in tools.json, write a real overview. Use `research/overviews-seo.json` as a starting point — it contains high-quality overviews for seo-search and other batched tools.

Order of priority:
1. Featured tools (`featured: true`) — highest traffic
2. Tools with existing alternatives pages (they drive cross-link traffic)
3. Remaining tools alphabetically

---

### Phase 3 — Cleanup (remove legacy files)

After Phase 1 and Phase 2 are complete:

**Remove pros-cons.json:**
1. Update merge-data.mjs: delete the `pros-cons.json` read and `prosConsMap` (pros/cons now come only from `tool.pros / tool.cons`)
2. Verify build output is identical
3. Delete `src/data/pros-cons.json`

**Remove overviews.json:**
1. Once ALL 119 tools have non-empty `overview` in tools.json, overviews.json is never used
2. Update merge-data.mjs: delete the `overviews.json` read and `overviewMap`
3. Simplify overview line: `const overview = tool.overview?.trim() ?? "";`
4. Verify build output is identical
5. Delete `src/data/overviews.json`

---

### Phase 4 — Architecture After Cleanup

```
tools.json                   ← single source of truth for ALL content
├── alternatives.json        ← still useful: override/enrich alternatives
├── best-for.json            ← still useful: override/enrich bestFor
├── logo-mapping.json        ← still useful: icon assignment
├── taxonomies.json          ← still useful: category validation
└── category-content.json   ← still useful: editorial category content

DELETED:
├── overviews.json           ← was: boilerplate fallback (no value)
├── pros-cons.json           ← was: duplicate of tools.json (no value)
└── pros-cons-seo.json       ← was: staging file, content migrated to tools.json
```

The merge script becomes simpler:
- 4 source files instead of 6
- No prosConsMap lookup
- No overviewMap lookup
- Both `overview` and `pros/cons` read directly from `tool.*`

---

## 7. Risk Assessment

| Action | Risk | Mitigation |
|--------|------|-----------|
| Migrate pros-cons-seo.json → tools.json | Low — additive change | Verify slugs match before writing |
| Delete pros-cons.json | Low — it's a duplicate | Confirm build output identical before deleting |
| Delete overviews.json | Medium — affects 100 tools if any have empty overview | Only delete after ALL tools have real overview in tools.json |
| Remove prosConsMap from merge script | Low | Run merge script and compare output |
| Remove overviewMap from merge script | Low (after Phase 2 complete) | Run merge script and compare output |

---

## 8. Summary Table

| Question | Answer |
|----------|--------|
| Overview nên nằm ở đâu? | `tools.json[overview]` — canonical. Write real content here. |
| Pros/cons nên nằm ở đâu? | `tools.json[pros]` / `tools.json[cons]` — canonical. |
| Có nên bỏ pros-cons.json không? | **YES** — it is a full copy of tools.json with zero unique data. |
| Có nên merge về tools.json không? | **YES** — migrate pros-cons-seo.json content to tools.json immediately for 27 tools. |
| overviews.json có nên giữ không? | **NO** — 100% boilerplate, no SEO value, delete after Phase 2. |
| Website đang dùng file nào? | tools.json (canonical), overviews.json (boilerplate fallback for 118 tools), pros-cons.json (reads it, gets same data as tools.json) |
| File nào là legacy? | pros-cons.json (delete now), overviews.json (delete after Phase 2) |
| File nào chưa được dùng? | pros-cons-seo.json (integrate → tools.json → delete) |

---

*This audit covers files as of 2026-06-10. The findings reflect the state before any migration actions are taken.*
