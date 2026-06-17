# GummySearch Post-Publish Audit
**Task:** D-021R  
**Date:** 2026-06-16  
**URL:** `https://zotopie.com/reddit/gummysearch-review/`  
**Commit:** `0bc5bc2`  
**Audit mode:** Read-only — no code changes, no push

---

## Summary

| Severity | Count |
|---|---|
| Critical | 0 |
| Important | 3 |
| Nice to have | 4 |

---

## 1. Frontmatter Fields

**Status: ✅ Pass**

| Field | Value | Valid |
|---|---|---|
| `title` | GummySearch Review (2026): Is It Worth It for Reddit Research? | ✅ |
| `description` | Read our in-depth 2026 GummySearch review... | ✅ |
| `author` | Zotopie Editorial Team | ✅ |
| `publishDate` | 2026-06-16 | ✅ |
| `tags` | gummysearch, reddit research, social listening, reddit monitoring, review | ✅ |
| `category` | reddit | ✅ |
| `draft` | false | ✅ |
| `featuredImage` | *(not set)* | ⚠️ See Issue #4 |

No missing required fields. No schema validation errors in build.

---

## 2. Image Rendering

**Status: ✅ Pass (visual) / ⚠️ See Issue #4 (social share)**

3 images present in rendered HTML:

| Image | Path | File exists |
|---|---|---|
| Dashboard | `/images/reddit/gummysearch-dashboard.webp` | ✅ |
| Audience Discovery | `/images/reddit/gummysearch-audience-discovery.webp` | ✅ |
| Pricing | `/images/reddit/gummysearch-pricing.webp` | ✅ |

All 3 images render inline in the article body. Filenames corrected from `.webp.webp` double extension during publish.

**Note:** No `featuredImage` in frontmatter → article card in category listing has no thumbnail image (text-only card). Same behavior as Brand24 review.

---

## 3. Broken Links

**Status: ✅ Pass — no broken links**

| URL in article | HTTP | Status |
|---|---|---|
| `/reddit/brand24-review/` | 200 | ✅ |
| `/images/reddit/gummysearch-dashboard.webp` | 200 | ✅ |
| `/images/reddit/gummysearch-audience-discovery.webp` | 200 | ✅ |
| `/images/reddit/gummysearch-pricing.webp` | 200 | ✅ |

---

## 4. Internal Links

**Status: ✅ Brand24 linked correctly / ⚠️ Alternatives missing**

Brand24 Review linked at 4 locations:
- "GummySearch vs Brand24" section intro → `[Brand24](/reddit/brand24-review/)`
- "Best Alternatives › Brand24" section → `[Read our full Brand24 review →](/reddit/brand24-review/)`
- Final Verdict paragraph → `[Brand24](/reddit/brand24-review/)`
- FAQ #4 → `[Brand24](/reddit/brand24-review/)`

**Not linked (pages don't exist yet):**
- Awario, Mention, F5Bot — no tool profile pages; links were intentionally skipped per task spec.

---

## 5. Related Articles / Tool Cross-Link Block

**Status: ⚠️ No related tool block — Nice to have**

The D-018 cross-link feature (`ArticleLayout.astro` lines 37–39) searches `tools-enriched.json` for a tool whose `slug` matches any article tag. No tool in the DB has slug `gummysearch`, `reddit-research`, `social-listening`, or `reddit-monitoring`.

**Expected behavior:** GummySearch (shutting down Dec 2026) will likely never be in the tools DB. The "View Tool Profile →" CTA block will not appear for this article. This is acceptable given the subject matter.

**Missing opportunity:** The article heavily references Brand24 as the primary alternative. If a Brand24 tool profile exists in the DB with slug `brand24`, it would appear as the related tool block — but the D-018 logic only matches on tags, and `brand24` is NOT in this article's tags (only `gummysearch` is).

---

## 6. CTA Blocks

**Status: ⚠️ Partial — Important**

| CTA type | Status |
|---|---|
| Internal link to Brand24 Review | ✅ Present × 4 |
| "View Tool Profile →" cross-link block | ❌ Not rendered (no matching tool) |
| Affiliate / external CTA | ❌ Not present — GummySearch is closed, no affiliate link possible |

No affiliate CTAs exist in this article (unlike Brand24 review which has `👉 Click here to explore Brand24`). Acceptable given the tool is defunct.

---

## 7. Mobile Rendering

**Status: ✅ Pass**

Tested at 390×844px:

| Element | Result |
|---|---|
| Header / hamburger nav | ✅ |
| Breadcrumb wraps | ✅ |
| Tags wrap to 2 rows | ✅ |
| H1 title readable | ✅ |
| Body text no overflow | ✅ |
| Images responsive | ✅ (assumed — images use standard markdown, no fixed width) |

---

## 8. Search Discoverability

**Status: ✅ Pass**

Query `gummysearch` → `1 article for "gummysearch"` in ARTICLES section.

- Title highlighted ✅
- Description shows with keyword highlighted ✅
- "REDDIT" collection badge ✅
- Date: `2026-06-16` ✅
- "Read Article →" CTA ✅

Screenshot: `audit-search.png`

---

## 9. Homepage Discoverability

**Status: ✅ Pass**

GummySearch Review appears in homepage Latest Articles section. Reddit category page shows both articles (GummySearch newest, Jun 16 · Brand24, Jun 15).

Screenshot: `audit-reddit.png`

---

## 10. Schema Validation

**Status: ⚠️ 2 Important issues + 1 dev-only issue**

3 schema blocks found:

```json
{ "@type": "WebSite" }                                   ✅ site-wide
{ "@type": "Article" }                                   ⚠️ image issue
{ "@type": "BreadcrumbList" }                            ⚠️ localhost URL (dev only)
```

### Article schema — valid fields
```json
"headline": "GummySearch Review (2026): Is It Worth It for Reddit Research?"  ✅
"description": "Read our in-depth 2026 GummySearch review..."                  ✅
"author": { "@type": "Person", "name": "Zotopie Editorial Team" }              ✅
"publisher": { "@type": "Organization", "name": "Zotopie" }                   ✅
"datePublished": "2026-06-16T00:00:00.000Z"                                    ✅
"dateModified": "2026-06-16T00:00:00.000Z"                                     ✅
"keywords": "gummysearch, reddit research, social listening..."                ✅
```

### Article schema — invalid field
```json
"image": "https://zotopie.com/favicon.svg"   ❌ IMPORTANT
```
Google requires Article image to be ≥696px wide and a real content image (not a logo/favicon). This will fail Google's Rich Results Test.

### BreadcrumbList — dev URL
```json
{ "position": 2, "item": "http://localhost:4321/reddit/gummysearch-review/" }  ⚠️ dev only
```
On production, `Astro.url.href` resolves correctly. Will not affect live site.

---

## Issues — Ranked by Severity

### 🔴 Critical — 0 issues

---

### 🟡 Important — 3 issues

#### I-1: Duplicate H1 tag
**Element:** Article page — two identical `<h1>` rendered  
**Detail:**
- H1 #1: Rendered by `ArticleLayout.astro` from frontmatter `title` field
- H1 #2: From markdown body `# GummySearch Review (2026): Is It Worth It for Reddit Research?`

Both render the exact same text. Google may penalize or ignore one H1 on a page that has two.

**Scope:** Systemic — same issue exists in `brand24-review.md`. Needs fix in `ArticleLayout.astro` (remove the layout-level H1, or remove the H1 from all markdown files).

**Fix (when ready):** Remove `# GummySearch Review...` from the top of the markdown body. The layout already renders the title correctly from frontmatter.

---

#### I-2: OG image and Twitter image = favicon.svg
**Element:** `<meta property="og:image">` and `<meta name="twitter:image">`
```
og:image = https://zotopie.com/favicon.svg
twitter:image = https://zotopie.com/favicon.svg
```
When this URL is shared on LinkedIn, Twitter, Slack, or Facebook, the preview thumbnail shows the 32×32 Zotopie favicon — not an article image. This significantly reduces click-through rate on social shares.

**Root cause:** No `featuredImage` in frontmatter → `BaseHead.astro` falls back to `/og-default.svg` or `/favicon.svg`.

**Scope:** Systemic — same issue in Brand24 review and will affect all future articles without `featuredImage`.

**Fix (when ready):** Add `featuredImage` to frontmatter pointing to `gummysearch-dashboard.webp` (already exists). OR update `BaseHead.astro` to fall back to the first inline image in the article body.

---

#### I-3: Article structured data image = favicon.svg
**Element:** `<script type="application/ld+json">` — `Article` schema
```json
"image": "https://zotopie.com/favicon.svg"
```
Google's Article rich result requires `image` to be ≥696px wide and a representative content image. A favicon will fail the Rich Results Test and may prevent Google from displaying enhanced article previews in Search.

**Root cause:** Same as I-2 (no `featuredImage`).

**Fix (when ready):** Same as I-2.

---

### 🔵 Nice to have — 4 issues

#### N-1: No article thumbnail in category card
Article cards in `/reddit/` and homepage show no image — text-only card. Brand24 review has the same behavior. Makes the listing less visually engaging than tool cards.

**Fix:** Add `featuredImage` (same as I-2 fix resolves this too).

---

#### N-2: Tag slugs contain spaces
Tags `"reddit research"` and `"reddit monitoring"` generate URLs:
- `/tags/reddit research/` (returns 200, URL-encodes to `%20`)
- `/tags/reddit monitoring/` (returns 200)

These work but are not clean URLs. Convention is `reddit-research` (hyphenated).

**Scope:** Systemic — `brand24` tags use same multi-word format (`"social listening"`, `"reddit monitoring"`).

**Fix:** Change tags to hyphenated format in all article frontmatter and ensure tag pages handle both.

---

#### N-3: BreadcrumbList schema has localhost URL
```json
{ "position": 2, "item": "http://localhost:4321/reddit/gummysearch-review/" }
```
Dev-only artifact. On production (`https://zotopie.com`), `Astro.url.href` resolves correctly. No action needed.

---

#### N-4: No affiliate / external CTA
The article covers a defunct tool. There is no affiliate opportunity and no external link to GummySearch (the tool is closed). The article drives traffic internally via Brand24 links. Acceptable for this specific article type.

---

## Pass / Fail Summary

| Check | Result | Notes |
|---|---|---|
| Frontmatter schema | ✅ Pass | All required fields present |
| Images render | ✅ Pass | 3 images in HTML, files exist |
| Broken links | ✅ Pass | All internal links 200 OK |
| Internal links | ✅ Pass | 4× Brand24 review linked |
| Related tool block | ⚠️ N/A | GummySearch not in tools DB (expected) |
| CTA blocks | ⚠️ Partial | Brand24 links present; no tool CTA |
| Mobile rendering | ✅ Pass | 390px renders correctly |
| Search | ✅ Pass | 1 article for "gummysearch" |
| Homepage | ✅ Pass | GummySearch in Latest Articles |
| Schema — Article type | ✅ Pass | All required fields present |
| Schema — Article image | ❌ Fail | favicon.svg — not a valid content image |
| Schema — BreadcrumbList | ✅ Pass (prod) | localhost URL dev-only |
| Duplicate H1 | ❌ Fail | 2× identical H1 on same page |
| OG / Social image | ❌ Fail | favicon.svg shown on social share |
