# Layout Migration Plan — TASK D-008
**Date:** 2026-06-15  
**Goal:** All pages use SiteHeader + canonical footer + Plus Jakarta Sans

---

## Migration Overview

| Priority | Task | Effort | Impact |
| --- | --- | --- | --- |
| 1 | Extract MainLayout footer → `SiteFooter.astro` | Low | Unblocks all other migrations |
| 2 | Add impact.com meta tag to `BaseHead.astro` | Trivial | Verification appears on all pages |
| 3 | Migrate `CategoryLayout.astro` | Low | Fixes 10 routes at once |
| 4 | Migrate `ArticleLayout.astro` footer | Low | Fixes 5 article route types |
| 5 | Migrate `tags/[tag].astro` | Medium | Add proper layout |
| 6 | Migrate `about.astro` | Low | Replace BlogPost with ArticleLayout |
| 7 | Clean up or remove `tools.astro` | Low | Placeholder page |
| 8 | Delete old components | Low | Remove `Header.astro`, `Footer.astro`, `BlogPost.astro` |

---

## Step 1 — Create `SiteFooter.astro`

**Action:** Extract the footer HTML + CSS from `MainLayout.astro` into `src/components/SiteFooter.astro`.

**File to create:** `src/components/SiteFooter.astro`

**Content to extract from MainLayout** (the `<footer>` block with `.footer-wrap`, `.footer-grid`, `.footer-bottom` and all associated CSS).

**After extraction:**
- Update `MainLayout.astro` to: `import SiteFooter from '../components/SiteFooter.astro'` and replace inline footer with `<SiteFooter />`
- All subsequent migrations use `SiteFooter`

---

## Step 2 — Add impact.com Tag to `BaseHead.astro`

**File:** `src/components/BaseHead.astro`

**Add after the viewport meta tag:**
```html
<meta name='impact-site-verification' value='5c335fea-1969-4d9a-b64f-1be8b20a77da' />
```

**Affected pages:** All pages using `BaseHead.astro` (ArticleLayout, CategoryLayout, BlogPost, tags/[tag].astro)

---

## Step 3 — Migrate `CategoryLayout.astro`

**File:** `src/layouts/CategoryLayout.astro`

**Changes:**
1. Replace import: `import Header from '../components/Header.astro'` → `import SiteHeader from '../components/SiteHeader.astro'`
2. Replace import: `import Footer from '../components/Footer.astro'` → `import SiteFooter from '../components/SiteFooter.astro'`
3. Add Google Fonts link in `<head>`:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
   ```
4. Replace `<Header />` → `<SiteHeader />`
5. Replace `<Footer />` → `<SiteFooter />`
6. Add body font override in `<style>`:
   ```css
   body {
     font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
   }
   ```

**Routes fixed (10):**
- `/reddit`, `/reddit/page/[page]`
- `/blog`, `/blog/page/[page]`
- `/threads`, `/threads/page/[page]`
- `/extensions`, `/extensions/page/[page]`
- `/marketing`, `/marketing/page/[page]`

---

## Step 4 — Migrate `ArticleLayout.astro` Footer

**File:** `src/layouts/ArticleLayout.astro`

**Changes:**
1. Replace import: `import Footer from '../components/Footer.astro'` → `import SiteFooter from '../components/SiteFooter.astro'`
2. Replace `<Footer />` → `<SiteFooter />`

**Routes fixed (5 article types):**
- `/reddit/[...slug]`, `/blog/[...slug]`, `/threads/[...slug]`, `/extensions/[...slug]`, `/marketing/[...slug]`

---

## Step 5 — Migrate `tags/[tag].astro`

**File:** `src/pages/tags/[tag].astro`

**Option A (recommended):** Wrap content in a proper layout — use `CategoryLayout` (after Step 3) or `MainLayout`.

**Option B (minimal):** Replace `Header` → `SiteHeader`, `Footer` → `SiteFooter`, add font link.

**Changes for Option B:**
1. Replace `import Header from '../../components/Header.astro'` → `import SiteHeader from '../../components/SiteHeader.astro'`
2. Replace `import Footer from '../../components/Footer.astro'` → `import SiteFooter from '../../components/SiteFooter.astro'`
3. Add Google Fonts link in `<head>`
4. Replace `<Header />` → `<SiteHeader />`
5. Replace `<Footer />` → `<SiteFooter />`

---

## Step 6 — Migrate `about.astro`

**File:** `src/pages/about.astro`

**Current:** Uses `BlogPost.astro` layout (Gen 1 design, Atkinson font).

**Action:** Replace layout import:
```
import Layout from '../layouts/BlogPost.astro'
```
→
```
import Layout from '../layouts/ArticleLayout.astro'
```

Verify that `about.astro`'s frontmatter matches `ArticleLayout`'s Props interface:
- `title` ✅ (required)
- `description` ✅ (required)
- `publishDate` — add if missing
- `category` ✅ (required)

---

## Step 7 — Handle `tools.astro`

**File:** `src/pages/tools.astro`

**Current:** Bare `<html><body>` placeholder showing a list of tool names.

**Action:** Either:
- Delete if not needed (no internal links point to `/tools`)
- Or add MainLayout + proper content if the page serves a purpose

---

## Step 8 — Delete Gen 1 Components

**After all migrations are complete and verified:**

Files to delete:
- `src/components/Header.astro` — replaced by `SiteHeader.astro`
- `src/components/Footer.astro` — replaced by `SiteFooter.astro`
- `src/layouts/BlogPost.astro` — replaced by `ArticleLayout.astro`
- `src/components/HeaderLink.astro` — used only by `Header.astro`

**Verify before deleting:** Run `grep -r "Header.astro\|Footer.astro\|BlogPost.astro\|HeaderLink" src/` to confirm no remaining imports.

---

## Post-Migration State

| Component | Status |
| --- | --- |
| `SiteHeader.astro` | ✅ Used by all layouts |
| `SiteFooter.astro` | ✅ Used by all layouts |
| `MainLayout.astro` | ✅ Main pages |
| `ArticleLayout.astro` | ✅ All article pages |
| `CategoryLayout.astro` | ✅ All listing pages |
| `Header.astro` | 🗑️ Deleted |
| `Footer.astro` | 🗑️ Deleted |
| `BlogPost.astro` | 🗑️ Deleted |
| `HeaderLink.astro` | 🗑️ Deleted |

---

## Files That Must Change

| File | Type | Change |
| --- | --- | --- |
| `src/components/BaseHead.astro` | Component | Add impact.com meta tag |
| `src/layouts/CategoryLayout.astro` | Layout | Header + Footer + Font |
| `src/layouts/ArticleLayout.astro` | Layout | Footer only |
| `src/pages/tags/[tag].astro` | Page | Header + Footer + Font |
| `src/pages/about.astro` | Page | Change layout import |
| `src/layouts/MainLayout.astro` | Layout | Extract footer (Step 1 refactor) |
| `src/pages/tools.astro` | Page | Delete or rebuild |

## Files to Create

| File | Purpose |
| --- | --- |
| `src/components/SiteFooter.astro` | Extracted canonical footer from MainLayout |

## Files to Delete (after migration)

| File | Reason |
| --- | --- |
| `src/components/Header.astro` | Gen 1, replaced by SiteHeader |
| `src/components/Footer.astro` | Gen 1, replaced by SiteFooter |
| `src/layouts/BlogPost.astro` | Gen 1, replaced by ArticleLayout |
| `src/components/HeaderLink.astro` | Only used by old Header |
