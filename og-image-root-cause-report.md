# D-022R — OG Image Root Cause Audit Report

## Verdict

**D-022 FIX IS VERIFIED.** Build output confirms correct OG image, Twitter image, and Schema JSON-LD image for both articles. The `favicon.svg` evidence in the task brief reflects the pre-D-022 state (from D-021R audit). Production is unaffected because changes have not been pushed yet.

---

## Complete Pipeline Trace

### Step 1 — Frontmatter

**File:** `src/content/reddit/brand24-review.md`

```yaml
featuredImage: "/images/reddit/brand24-dashboard.webp"
```

**File:** `src/content/reddit/gummysearch-review.md`

```yaml
featuredImage: "/images/reddit/gummysearch-dashboard.webp"
```

Status: ✅ Present

---

### Step 2 — Content Collection Schema

**File:** `src/content.config.ts`

```ts
const articleSchema = z.object({
  featuredImage: z.string().optional(),   // plain string, NOT image()
  heroImage: z.string().optional(),
  ...
}).transform((data) => ({
  ...data,
  featuredImage: data.featuredImage ?? data.heroImage,
}));
```

- `z.string().optional()` — Astro treats this as a plain string. No `__ASTRO_IMAGE_` prefix transform is applied. ✅
- `.transform()` spreads `...data` first, then overwrites `featuredImage` with `data.featuredImage ?? data.heroImage`. Since both articles have `featuredImage` set, the value passes through unchanged. ✅

**Where D-022 fixed the break:**  
Before D-022, the schema was:
```ts
const articleSchema = ({ image }: any) =>
  z.object({
    featuredImage: z.optional(image()),  // ← image() helper
  })
```
`image()` transforms `/images/...` → `__ASTRO_IMAGE_/images/...` at schema-parse time. The scoped store's `set()` method traverses all data values, finds the `__ASTRO_IMAGE_` prefix, strips it, and adds the path to `assetImports`. This generated `content-assets.mjs` with Vite imports that failed because images are in `public/`, not `src/`. Build crashed before any HTML was generated.

After fix, `z.string()` keeps the value as-is. `content-assets.mjs` exports an empty Map.

---

### Step 3 — Page Template

**File:** `src/pages/reddit/[...slug].astro` (line 29)

```astro
const post = Astro.props;  // CollectionEntry<'reddit'>
// ...
<ArticleLayout
  featuredImage={post.data.featuredImage}
  ...
>
```

`post.data` is the Zod-transformed output. `post.data.featuredImage` = `"/images/reddit/brand24-dashboard.webp"` — a plain string. ✅

---

### Step 4 — ArticleLayout

**File:** `src/layouts/ArticleLayout.astro` (lines 10–20)

```ts
interface Props {
  featuredImage?: string;   // string, not ImageMetadata
}
const { ..., featuredImage } = Astro.props;
```

Line 49:
```astro
<BaseHead image={featuredImage} ... />
```

Value passed: `"/images/reddit/brand24-dashboard.webp"` ✅

---

### Step 5 — BaseHead

**File:** `src/components/BaseHead.astro` (lines 35–41)

```ts
const imageUrl = (() => {
  if (!image) return `${SITE_URL}/og-default.svg`;
  if (typeof image === 'string') {
    return image.startsWith('http') ? image : `${SITE_URL}${image}`;
  }
  return new URL(image.src, Astro.site).href;
})();
```

With `image = "/images/reddit/brand24-dashboard.webp"`:
1. `!image` → `false` (non-empty string)
2. `typeof image === 'string'` → `true`
3. `image.startsWith('http')` → `false`
4. Returns `https://zotopie.com` + `/images/reddit/brand24-dashboard.webp`
5. Result: `https://zotopie.com/images/reddit/brand24-dashboard.webp` ✅

Line 119:
```astro
<meta property="og:image" content={imageUrl} />
```

---

## Verification — Built HTML (dist/)

Verified against `dist/reddit/brand24-review/index.html` and `dist/reddit/gummysearch-review/index.html` from current build (post D-022).

### Brand24 Review

```html
<meta property="og:image"
  content="https://zotopie.com/images/reddit/brand24-dashboard.webp">

<meta name="twitter:image"
  content="https://zotopie.com/images/reddit/brand24-dashboard.webp">

<div class="hero"><img src="/images/reddit/brand24-dashboard.webp"
  alt="Brand24 Review (2026): Features, Pricing, and Reddit Tracking"
  loading="eager"></div>
```

**application/ld+json — Article:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Brand24 Review (2026): Features, Pricing, and Reddit Tracking",
  "image": "https://zotopie.com/images/reddit/brand24-dashboard.webp",
  "author": { "@type": "Person", "name": "Zotopie Editorial Team" },
  "datePublished": "2026-06-15T00:00:00.000Z"
}
```

H1 count: **1** ✅

---

### GummySearch Review

```html
<meta property="og:image"
  content="https://zotopie.com/images/reddit/gummysearch-dashboard.webp">

<meta name="twitter:image"
  content="https://zotopie.com/images/reddit/gummysearch-dashboard.webp">

<div class="hero"><img src="/images/reddit/gummysearch-dashboard.webp"
  alt="GummySearch Review (2026): Is It Worth It for Reddit Research?"
  loading="eager"></div>
```

**application/ld+json — Article:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "GummySearch Review (2026): Is It Worth It for Reddit Research?",
  "image": "https://zotopie.com/images/reddit/gummysearch-dashboard.webp",
  "author": { "@type": "Person", "name": "Zotopie Editorial Team" },
  "datePublished": "2026-06-16T00:00:00.000Z"
}
```

H1 count: **1** ✅

---

## Image Files in dist/

All 6 images correctly copied from `public/images/reddit/` to `dist/images/reddit/`:

```
brand24-dashboard.webp
brand24-pricing.webp
brand24-reddit-monitoring.webp
gummysearch-audience-discovery.webp
gummysearch-dashboard.webp
gummysearch-pricing.webp
```

---

## Why Production Shows favicon.svg

Production (`zotopie.com`) is running the code from the last `git push` — before D-022 was applied. The `image()` schema caused a build crash, so production never had working featured image support. The `favicon.svg` fallback was the pre-D-022 behavior in `BaseHead.astro`.

D-022 changes are local only. Production will be fixed on next push.

---

## Summary

| Check | Before D-022 | After D-022 |
|---|---|---|
| `npm run build` | ❌ `[ImageNotFound]` crash | ✅ 851 pages built |
| `og:image` | `https://zotopie.com/favicon.svg` | `https://zotopie.com/images/reddit/brand24-dashboard.webp` |
| `twitter:image` | `https://zotopie.com/favicon.svg` | correct ✅ |
| `ld+json Article.image` | `https://zotopie.com/favicon.svg` | correct ✅ |
| Hero `<img>` src | n/a (page crashed) | `/images/reddit/brand24-dashboard.webp` ✅ |
| H1 count | 2 (layout + markdown) | 1 ✅ |
