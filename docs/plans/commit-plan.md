# Commit Plan — TASK D-007
**Date:** 2026-06-15  
**Branch:** main  
**Commit message:** "feat: publish Brand24 review and fix mobile responsiveness"

---

> ⚠️ KHÔNG dùng `git add .`  
> ⚠️ KHÔNG dùng `git add -A`  
> ✅ Chỉ add từng file được liệt kê dưới đây

---

## Step 1 — Stage layout and style fixes

```
git add src/layouts/ArticleLayout.astro
```
*Lý do: Removed scoped .prose table style (không reach được slot content trong Astro)*

---

## Step 2 — Stage review page mobile fix

```
git add src/pages/reviews/[slug].astro
```
*Lý do: Thêm @media (max-width: 400px) để pricing table không bị ép 2 cột trên 320px*

---

## Step 3 — Stage global CSS mobile fixes

```
git add src/styles/global.css
```
*Lý do: Thêm pre overflow-x:auto và .prose table display:block + overflow-x:auto*

---

## Step 4 — Stage new SiteHeader component

```
git add src/components/SiteHeader.astro
```
*Lý do: Component mới, được import bởi ArticleLayout.astro — REQUIRED để build không fail*

---

## Step 5 — Stage Brand24 article

```
git add src/content/reddit/brand24-review.md
```
*Lý do: Bài review Brand24 hoàn chỉnh, draft:false, schema hợp lệ*

---

## Step 6 — Stage Brand24 images

```
git add public/images/reddit/brand24-dashboard.webp
git add public/images/reddit/brand24-pricing.webp
git add public/images/reddit/brand24-reddit-monitoring.webp
```
*Lý do: 3 ảnh được referenced trực tiếp trong brand24-review.md — thiếu sẽ hiện broken image*

---

## Step 7 — Verify staging area trước khi commit

```
git diff --staged --name-only
```

Expected output (đúng 8 files):
```
public/images/reddit/brand24-dashboard.webp
public/images/reddit/brand24-pricing.webp
public/images/reddit/brand24-reddit-monitoring.webp
src/components/SiteHeader.astro
src/content/reddit/brand24-review.md
src/layouts/ArticleLayout.astro
src/pages/reviews/[slug].astro
src/styles/global.css
```

---

## Final — Commit command

```
git commit -m "feat: publish Brand24 review and fix mobile responsiveness"
```

---

## Verification sau commit

```
git show --stat HEAD
```

---

## Files KHÔNG được stage

| File | Lý do |
| --- | --- |
| `broken-links-report.md` | AI report — temporary |
| `mobile-audit-report.md` | AI report — temporary |
| `responsive-fixes-report.md` | AI report — temporary |
| `review-report.md` | AI report — temporary |
| `schema-report.md` | AI report — temporary |
| `commit-audit-report.md` | Internal audit doc |
| `gitignore-recommendations.md` | Internal recommendation doc |
| `commit-plan.md` | File này — internal |
| `NEXT_STEPS.txt` | Internal notes |
| `PRE_PRODUCTION_AUDIT.md` | Internal audit |
| `docs/*` | 14 internal strategy docs |
| `content-briefs/*` | Content planning — editorial internal |
| `scripts/*` | One-time utility scripts |
| `src/data/integration-report-seo.json` | Validation report — không phải source |
| `src/data/validation-report-seo.json` | Validation report — không phải source |
| `src/data/reddit-tools.json` | Research data — chưa dùng trong runtime |
| `src/data/pros-cons-seo.json` | Generate input — không dùng ở runtime |
| `src/data/keywords/` | Keyword research — không phải source code |
| `src/data/research/` | Research data — không phải source code |

---

## Sau khi commit: Bước tiếp theo được đề xuất

1. Cập nhật `.gitignore` theo [gitignore-recommendations.md](gitignore-recommendations.md)
2. `git push origin main` để deploy lên Cloudflare Pages
3. Kiểm tra URL production: `https://zotopie.com/reddit/brand24-review`
