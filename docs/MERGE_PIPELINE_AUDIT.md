# MERGE PIPELINE AUDIT

**Date:** 2026-06-10  
**Scope:** `scripts/merge-data.mjs` | `src/data/overviews.json` | `src/data/pros-cons.json`  
**Status:** CRITICAL FINDING — boilerplate in pros-cons.json is overriding P2-migrated content

---

## 1. Executive Summary

| Question | Answer |
|---|---|
| overviews.json còn được dùng không? | YES — provides fallback text for 91/119 tools |
| pros-cons.json còn được dùng không? | YES — but **actively harmful**: overrides P2 real content with boilerplate |
| Xóa 2 file có làm build lỗi không? | YES — Promise.all throws ENOENT immediately |
| merge-data.mjs cần sửa gì? | Remove pros-cons.json read; update pros/cons fallback |
| Còn dependency nào tới file cũ không? | None after merge-data.mjs is patched |

### Critical Finding: P2 Migration Is Currently Inactive

Task P2 moved real pros/cons content into `tools.json` for 24 tools.  
However, `merge-data.mjs` prioritises `pros-cons.json` over `tools.json` for pros/cons.  
`pros-cons.json` has **97/100 entries with boilerplate** ("Comprehensive feature set for its primary use case").  
Result: the website is **not** showing P2 content. It is still showing boilerplate.

---

## 2. Pipeline Architecture

```
merge-data.mjs reads 6 files in Promise.all:
  1. src/data/tools.json          ← canonical source (P2 content lives here)
  2. src/data/overviews.json      ← 100 boilerplate overviews
  3. src/data/pros-cons.json      ← 97 boilerplate pros/cons + 3 real
  4. src/data/tools-excluded.json
  5. src/data/taxonomy.json
  6. src/data/tool-categories.json

Outputs:
  - src/data/tools-enriched.json
  - src/data/icon-data.json
```

**No error handling.** If any file is missing, `Promise.all` throws `ENOENT` and the build crashes.

---

## 3. Merge Priority Rules (current code)

### Overview (line 88)
```js
const overview = (tool.overview?.trim()) ? tool.overview : (overviewMap.get(key) ?? "");
```
- tools.json wins when its overview is non-empty
- Falls back to overviews.json entry otherwise

### Pros / Cons (lines 89–91)
```js
const pc = prosConsMap.get(key);
const pros = pc?.pros.length ? pc.pros : (tool.pros ?? []);
const cons = pc?.cons.length ? pc.cons : (tool.cons ?? []);
```
- **pros-cons.json wins when its pros array is non-empty**
- Falls back to tools.json only when pros-cons.json entry is missing OR has empty pros

---

## 4. overviews.json Analysis

| Metric | Value |
|---|---|
| Total entries | 100 |
| Tools covered | 100/119 (19 placeholder tools added later are absent) |
| Overview quality | Boilerplate — template-generated, not editorial |
| Example | "Ahrefs is a software platform used primarily in the seo-search category. According to…" |

### Current effect in merge
- 28 tools have real overview in tools.json → tools.json wins (correct)
- 91 tools have empty overview in tools.json → overviewMap provides boilerplate
- 19 placeholder tools not in overviews.json → get empty string

### Missing tools (not in overviews.json)
`substack`, `wordpress`, `gemini`, `salesforce`, `mailerlite`, `socialbee`, `planoly`, `heygen`, `magento`, `linode`, `hetzner`, `godaddy`, `microsoft-teams`, `dall-e`, `kartra`, `paddle`, `thrivecart`, `stable-diffusion`, `d-id`

### If deleted
- 91 tools lose their boilerplate overview → get empty string (more honest than boilerplate)
- 28 tools with real overview: unaffected
- Build crashes unless merge-data.mjs is patched first

---

## 5. pros-cons.json Analysis

| Metric | Value |
|---|---|
| Total entries | 100 |
| Entries with non-empty pros | 100 / 100 |
| Entries with boilerplate pros | **97 / 100** |
| Entries with real content | 3 (ahrefs, buffer, zapier) |
| Boilerplate pros[0] | "Comprehensive feature set for its primary use case" |

### Content comparison: tools.json vs pros-cons.json (sample)

| Tool | tools.json pros[0] (real) | pros-cons.json pros[0] (boilerplate) |
|---|---|---|
| semrush | "Combines SEO, PPC, local SEO, and competitive research datasets" | "Comprehensive feature set for its primary use case" |
| hootsuite | "Streams dashboard allows real-time monitoring of mentions, keywords…" | "Comprehensive feature set for its primary use case" |
| make | "Visual scenario builder provides detailed flow mapping…" | "Comprehensive feature set for its primary use case" |
| n8n | "Can be self-hosted, providing full control over data…" | "Comprehensive feature set for its primary use case" |

**All 24 P2-migrated tools: 0 / 24 have matching content. pros-cons.json boilerplate wins every merge.**

### Exceptions (real content in pros-cons.json)
| Tool | pros-cons.json pros[0] | Status |
|---|---|---|
| ahrefs | "World's largest backlink database updated every 15–30 minutes" | Real — same as tools.json |
| buffer | "Free plan supports up to 3 social channels and 10 scheduled posts" | Real — same as tools.json |
| zapier | "Connects 6,000+ apps — the largest integration library available" | Real — same as tools.json |

These 3 tools' content already exists in tools.json. No data loss if pros-cons.json is removed.

### Current effect in merge
- 24 P2-migrated tools: **real content in tools.json is ignored**, boilerplate from pros-cons.json is served instead
- 73 remaining tools: tools.json has empty pros → pros-cons.json boilerplate fills it
- 3 tools (ahrefs/buffer/zapier): tools.json has same content → no practical difference

### If deleted (without patching merge-data.mjs first)
Build crashes with `ENOENT`.

### If deleted (after patching merge-data.mjs)
- 24 P2 tools: start showing real content ✓
- 73 remaining tools: show empty pros/cons (accurate — they have no editorial content yet)
- 3 tools: unchanged (their content is already in tools.json)

---

## 6. Build Crash Risk

```js
// merge-data.mjs — lines 31-39
const [tools, overviews, prosCons, excluded, taxonomy, categories] = await Promise.all([
  readJSON("src/data/tools.json"),
  readJSON("src/data/overviews.json"),
  readJSON("src/data/pros-cons.json"),
  readJSON("src/data/tools-excluded.json"),
  readJSON("src/data/taxonomy.json"),
  readJSON("src/data/tool-categories.json"),
]);
```

`readJSON` internally calls `fs.readFile` and `JSON.parse`. If any file is missing, the entire `Promise.all` rejects. There is no `.catch()` or try/catch wrapper. Cloudflare Pages build fails at the data pipeline step.

**Verdict:** Do NOT delete files before patching merge-data.mjs.

---

## 7. Required Changes to merge-data.mjs

### Change A — Remove pros-cons.json (CRITICAL, do first)

**Priority:** CRITICAL — this unblocks P2 content from reaching the website.

Remove the pros-cons.json read from Promise.all:

```js
// BEFORE
const [tools, overviews, prosCons, excluded, taxonomy, categories] = await Promise.all([
  readJSON("src/data/tools.json"),
  readJSON("src/data/overviews.json"),
  readJSON("src/data/pros-cons.json"),   // ← REMOVE
  readJSON("src/data/tools-excluded.json"),
  readJSON("src/data/taxonomy.json"),
  readJSON("src/data/tool-categories.json"),
]);

// AFTER
const [tools, overviews, excluded, taxonomy, categories] = await Promise.all([
  readJSON("src/data/tools.json"),
  readJSON("src/data/overviews.json"),
  readJSON("src/data/tools-excluded.json"),
  readJSON("src/data/taxonomy.json"),
  readJSON("src/data/tool-categories.json"),
]);
```

Remove prosConsMap and update pros/cons resolution:

```js
// BEFORE (lines 47, 89-91)
const prosConsMap = new Map(prosCons.map((e) => [toolKey(e), { pros: e.pros ?? [], cons: e.cons ?? [] }]));
// ...
const pc = prosConsMap.get(key);
const pros = pc?.pros.length ? pc.pros : (tool.pros ?? []);
const cons = pc?.cons.length ? pc.cons : (tool.cons ?? []);

// AFTER
const pros = tool.pros ?? [];
const cons = tool.cons ?? [];
```

### Change B — Remove overviews.json (recommended, separate commit)

**Priority:** Recommended — removes boilerplate from 91 tools. Acceptable to defer.

If removed, also remove from Promise.all and simplify overview to:

```js
// AFTER
const overview = tool.overview?.trim() ?? "";
```

---

## 8. Dependency Map

### Before patch
```
tools-enriched.json depends on:
  tools.json          ← canonical
  overviews.json      ← fallback overview (boilerplate)
  pros-cons.json      ← overriding pros/cons (HARMFUL — boilerplate wins)
  tools-excluded.json
  taxonomy.json
  tool-categories.json
```

### After Change A (remove pros-cons.json)
```
tools-enriched.json depends on:
  tools.json          ← canonical (pros/cons now read directly from here)
  overviews.json      ← fallback overview (boilerplate still present)
  tools-excluded.json
  taxonomy.json
  tool-categories.json
```

### After Change A + B (remove both)
```
tools-enriched.json depends on:
  tools.json          ← single source of truth for all content fields
  tools-excluded.json
  taxonomy.json
  tool-categories.json
```

---

## 9. Action Plan

### Step 1 — Patch merge-data.mjs (CRITICAL, do immediately)
- Remove pros-cons.json from Promise.all destructuring
- Delete prosConsMap line
- Simplify pros/cons to `tool.pros ?? []` and `tool.cons ?? []`
- Run `node scripts/merge-data.mjs` to regenerate tools-enriched.json
- Verify 24 P2 tools now show real content in tools-enriched.json

### Step 2 — Delete pros-cons.json (after Step 1)
- `del src/data/pros-cons.json`
- Confirm build passes without it

### Step 3 — Patch overviews.json fallback (optional, separate PR)
- Remove overviews.json from Promise.all
- Simplify overview to `tool.overview?.trim() ?? ""`
- Accept that 91 tools will have empty overview (honest state)
- Delete `src/data/overviews.json`

### Step 4 — Content roadmap
- 91 tools still need real overviews written → tools.json directly
- 95 tools still need real pros/cons written → tools.json directly
- No more secondary data files needed — tools.json is the only source

---

## 10. Files Safe to Delete (after merge-data.mjs patch)

| File | Safe to delete | Notes |
|---|---|---|
| `src/data/pros-cons.json` | YES — after Step 1 | 97/100 boilerplate; 3 real entries already in tools.json |
| `src/data/overviews.json` | YES — after Step 3 | 100% boilerplate; adds no editorial value |
| `src/data/pros-cons-seo.json` | YES | Fully migrated by P2; ahrefs skipped intentionally |
| `src/data/research/overviews-seo.json` | YES | Fully migrated by P2; keyword-insights not in tools.json |
| `src/data/integration-report-seo.json` | Optional | P2 audit trail; can keep for reference or delete |
| `src/data/validation-report-seo.json` | Optional | Pre-P2 validation artifact |
