# Commit Audit Report — TASK D-007
**Date:** 2026-06-15  
**Branch:** main (up to date with origin/main)

---

## Overview

| Category | Count |
| --- | --- |
| A — COMMIT (production) | 8 files |
| B — REVIEW LATER (internal, no risk) | 27 files |
| C — IGNORE (do not commit) | 12 files |

---

## CATEGORY A — COMMIT

### Modified files (already tracked, must stage)

---

#### COMMIT
`src/layouts/ArticleLayout.astro`
**Reason:** Removed scoped `.prose table` style (Astro scoped CSS không reach được slot content — đã sửa bằng cách chuyển sang global.css).

---

#### COMMIT
`src/pages/reviews/[slug].astro`
**Reason:** Thêm `@media (max-width: 400px)` để pricing table collapse về 1 cột trên 320px — production mobile fix.

---

#### COMMIT
`src/styles/global.css`
**Reason:** Thêm `pre { overflow-x: auto }` và `.prose table { display: block; overflow-x: auto }` — critical mobile fixes, ngăn horizontal scroll trên tất cả mobile breakpoints.

---

### New untracked files (production)

---

#### COMMIT
`src/components/SiteHeader.astro`
**Reason:** Component mới, được import bởi `ArticleLayout.astro`. Thiếu file này sẽ build fail.

---

#### COMMIT
`src/content/reddit/brand24-review.md`
**Reason:** Bài review Brand24 đã hoàn chỉnh — nội dung production, frontmatter đúng schema, draft: false.

---

#### COMMIT
`public/images/reddit/brand24-dashboard.webp`
**Reason:** Ảnh trong bài Brand24 review — referenced trực tiếp trong content file.

---

#### COMMIT
`public/images/reddit/brand24-pricing.webp`
**Reason:** Ảnh trong bài Brand24 review — referenced trực tiếp trong content file.

---

#### COMMIT
`public/images/reddit/brand24-reddit-monitoring.webp`
**Reason:** Ảnh trong bài Brand24 review — referenced trực tiếp trong content file.

---

## CATEGORY B — REVIEW LATER

*Không ảnh hưởng website. Không cần commit ngay. Cân nhắc gitignore hoặc private repo riêng.*

---

#### REVIEW LATER
`docs/ALTERNATIVES_AUDIT.md`, `docs/ALTERNATIVES_REDESIGN.md`, `docs/ALTERNATIVES_RELEASE_REPORT.md`, `docs/ALTERNATIVES_VERIFICATION.md`
**Reason:** Tài liệu nội bộ về alternatives feature. Không dùng ở runtime.

---

#### REVIEW LATER
`docs/AUTHORITY_EXPANSION_REPORT.md`, `docs/AUTHORITY_FOUNDATION.md`, `docs/AUTHORITY_INTERNAL_LINKING_REPORT.md`, `docs/AUTHORITY_P1_RELEASE.md`, `docs/AUTHORITY_P1_REPORT.md`, `docs/AUTHORITY_ROADMAP.md`
**Reason:** Tài liệu chiến lược SEO nội bộ. Không liên quan đến build.

---

#### REVIEW LATER
`docs/POST_LAUNCH_AUDIT.md`, `docs/REVENUE_UNLOCK_REPORT.md`, `docs/VISUAL_UPGRADE_RELEASE.md`, `docs/VISUAL_UPGRADE_REPORT.md`
**Reason:** Báo cáo nội bộ các phase trước. Không ảnh hưởng production.

---

#### REVIEW LATER
`NEXT_STEPS.txt`
**Reason:** File ghi chú kế hoạch cá nhân. Không phải source code.

---

#### REVIEW LATER
`PRE_PRODUCTION_AUDIT.md`
**Reason:** Audit checklist nội bộ trước launch. Không phải source code.

---

#### REVIEW LATER
`content-briefs/brand24-review.md`, `content-briefs/best-reddit-scheduling-tools.md`, `content-briefs/f5bot-alternatives.md`, `content-briefs/gummysearch-review.md`, `content-briefs/redreach-vs-devi-ai.md`
**Reason:** Content brief cho các bài viết tương lai — tài liệu nội bộ editorial.

---

#### REVIEW LATER
`content-briefs/content-plan.xlsx`
**Reason:** File Excel kế hoạch content. Không phải source code. Binary file, không diff được.

---

#### REVIEW LATER
`src/data/reddit-tools.json`
**Reason:** Không được import bởi bất kỳ .astro page nào. Có thể là research data hoặc file chuẩn bị chưa dùng.

---

#### REVIEW LATER
`src/data/pros-cons-seo.json`
**Reason:** Không được import trực tiếp — là input data cho quá trình generate tools.json. Không dùng ở runtime.

---

#### REVIEW LATER
`src/data/keywords/reddit-keywords.xlsx`
**Reason:** File Excel keyword research. Không phải source code, không được import.

---

#### REVIEW LATER
`src/data/research/overviews-seo.json`
**Reason:** Research data. Không được import bởi bất kỳ page nào.

---

## CATEGORY C — IGNORE (Không commit)

*AI-generated reports, temporary scripts, validation outputs. Không có giá trị trong git history.*

---

#### IGNORE
`broken-links-report.md`
**Reason:** AI audit report — temporary, không phải source code.

---

#### IGNORE
`mobile-audit-report.md`
**Reason:** AI audit report từ TASK D-006 — temporary.

---

#### IGNORE
`responsive-fixes-report.md`
**Reason:** AI fixes report từ TASK D-006 — temporary.

---

#### IGNORE
`review-report.md`
**Reason:** AI validation report — temporary.

---

#### IGNORE
`schema-report.md`
**Reason:** AI schema audit report — temporary.

---

#### IGNORE
`scripts/fix-prices.js`, `scripts/fix-prices.mjs`
**Reason:** One-time data fix scripts — đã dùng xong, không cần trong repo production.

---

#### IGNORE
`scripts/verify-t2.mjs`
**Reason:** One-time verification script — temporary utility.

---

#### IGNORE
`scripts/dead-alternatives-report.json`
**Reason:** Generated JSON report từ script — temporary output.

---

#### IGNORE
`scripts/patch-p6-content.json`
**Reason:** Temporary patch data — đã apply xong, không cần giữ.

---

#### IGNORE
`src/data/integration-report-seo.json`
**Reason:** Báo cáo validation đặt nhầm trong `src/data/` — không phải source data, không được import.

---

#### IGNORE
`src/data/validation-report-seo.json`
**Reason:** Báo cáo validation đặt nhầm trong `src/data/` — không phải source data, không được import.

---

## Risk Assessment

| Risk | File | Severity |
| --- | --- | --- |
| Build sẽ fail nếu thiếu | `src/components/SiteHeader.astro` | HIGH |
| Missing images → broken article | `public/images/reddit/*.webp` | HIGH |
| Lộ chiến lược SEO nội bộ nếu commit | `docs/AUTHORITY_ROADMAP.md` | MEDIUM |
| Lộ keyword research | `src/data/keywords/reddit-keywords.xlsx` | MEDIUM |
| AI tool reports xuất hiện trong git history | `*-report.md` | LOW |
