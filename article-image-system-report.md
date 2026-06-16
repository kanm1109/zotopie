# D-022 — Article Featured Image System Report

## Summary

Fixed a broken featured image pipeline that caused:
- `[ImageNotFound]` build failure on every `npm run build`
- OG image falling back to `favicon.svg` on all article pages
- Schema JSON-LD image falling back to `favicon.svg`
- Duplicate H1 on article pages

Root cause: `src/content.config.ts` used `image()` Zod helper for `featuredImage`, which tells Astro to treat the value as an Astro image asset (expected in `src/`). Our images are in `public/images/` (served as static files), not `src/assets/`, so Vite's resolveId hook threw `ImageNotFound` on build.

---

## Files Changed

| File | Change |
|---|---|
| `src/content.config.ts` | `featuredImage: z.optional(image())` → `z.string().optional()` (also `heroImage`). Schema function `({ image }) => z.object({...})` → plain `z.object({...})` |
| `src/components/BaseHead.astro` | Fixed `imageUrl` computation: string paths now resolved to absolute URL with `SITE_URL`; fallback changed from `favicon.svg` → `og-default.svg` |
| `src/layouts/ArticleLayout.astro` | `featuredImage?: ImageMetadata` → `string`; `<Image>` → `<img>`; removed `astro:assets` import |
| `src/components/ArticleCard.astro` | Same: removed `Image`/`ImageMetadata` imports; `featuredImage?: ImageMetadata` → `string`; `<Image>` → `<img loading="lazy">` |
| `src/layouts/CategoryLayout.astro` | `import type { ImageMetadata }` removed; `featuredImage?: ImageMetadata` → `string` |
| `src/content/reddit/brand24-review.md` | Added `featuredImage` frontmatter; removed duplicate H1 from body |
| `src/content/reddit/gummysearch-review.md` | Added `featuredImage` frontmatter; removed duplicate H1 from body |

---

## Root Cause Detail

Astro 6 content config (`src/content.config.ts`) defined schema as a function receiving `{ image }`:

```ts
// BEFORE (broken)
const articleSchema = ({ image }: any) =>
  z.object({
    featuredImage: z.optional(image()),
    ...
  })
```

When Astro processes this schema at sync time, `image()` transforms the frontmatter string `/images/reddit/brand24-dashboard.webp` into `__ASTRO_IMAGE_/images/...`. The data store's `set()` traverses the data object, finds any string starting with `__ASTRO_IMAGE_`, strips the prefix, and adds it to `assetImports`. This generates `content-assets.mjs` with Vite imports for those paths — but Vite looks in `src/` not `public/`, causing `ImageNotFound`.

```ts
// AFTER (fixed)
const articleSchema = z.object({
  featuredImage: z.string().optional(),
  ...
})
```

With `z.string()`, the value stays as a plain string, nothing is added to asset imports, and `content-assets.mjs` exports an empty Map.

---

## Migration Impact

- All 5 collections (reddit, blog, threads, extensions, marketing) use the fixed schema
- Images in `public/images/` are referenced as absolute URL strings — no Astro image optimization, but this is correct since the images are intentionally in `public/` for direct static serving
- Inline markdown body images (e.g. `![alt](/images/reddit/brand24-pricing.webp)`) are unaffected — they render as plain `<img>` tags via remark/rehype

---

## Backwards Compatibility

- All existing articles without `featuredImage` frontmatter: `featuredImage` is `undefined`, hero section is skipped, OG image falls back to `og-default.svg` — no regression
- `heroImage` field also changed to `z.string().optional()` — the `.transform()` in the schema merges `heroImage` into `featuredImage` as before

---

## Verification

Tested on both article pages via dev server:

### Brand24 Review (`/reddit/brand24-review/`)
- OG image: `https://zotopie.com/images/reddit/brand24-dashboard.webp` ✅
- Schema JSON-LD image: `https://zotopie.com/images/reddit/brand24-dashboard.webp` ✅
- Hero `<img>` src: `/images/reddit/brand24-dashboard.webp` ✅
- H1 count: 1 ✅

### GummySearch Review (`/reddit/gummysearch-review/`)
- OG image: `https://zotopie.com/images/reddit/gummysearch-dashboard.webp` ✅
- Schema JSON-LD image: `https://zotopie.com/images/reddit/gummysearch-dashboard.webp` ✅
- Hero `<img>` src: `/images/reddit/gummysearch-dashboard.webp` ✅
- H1 count: 1 ✅

### Build
- `npm run build` → 851 pages built, 0 errors ✅
- `.astro/content-assets.mjs` → `export default new Map();` (empty) ✅
