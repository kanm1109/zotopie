# Review Report — Brand24 Article (TASK D-002)
Date: 2026-06-15

---

## Preview URL

**Local dev server: không khả dụng**
Node.js không được cài đặt trên máy này (`npm run dev` thất bại — `node.exe` không tìm thấy).

File hiện tại ở `drafts/brand24-review.md` — **chưa** được move vào `src/content/`, đúng theo yêu cầu task.

**Để preview bài viết, User có 2 lựa chọn:**
1. Tự chạy `npm run dev` trên máy (nếu Node.js đã cài) → mở `http://localhost:4321`
2. Chờ User duyệt xong rồi move + push để xem trên Cloudflare

---

## Images Inserted

| # | File | Alt Text | Path |
|---|------|----------|------|
| 1 | `brand24-dashboard.webp` | Brand24 dashboard for social listening and brand monitoring | `/images/reddit/brand24-dashboard.webp` |
| 2 | `brand24-reddit-monitoring.webp` | Brand24 Reddit monitoring dashboard | `/images/reddit/brand24-reddit-monitoring.webp` |
| 3 | `brand24-pricing.webp` | Brand24 pricing plans and subscription tiers | `/images/reddit/brand24-pricing.webp` |

**File validation:** Tất cả 3 file tồn tại tại `public/images/reddit/` ✅

---

## Image Locations (trong bài viết)

| # | Ảnh | Vị trí | Dòng |
|---|-----|--------|------|
| 1 | `brand24-dashboard.webp` | Ngay sau `# Brand24 Review (2026)...`, trước intro text | Line 10 |
| 2 | `brand24-reddit-monitoring.webp` | Ngay dưới `## How Well Does Brand24 Track Reddit?` | Line 91 |
| 3 | `brand24-pricing.webp` | Ngay trên bảng pricing `\| Plan \| Estimated Price \|` | Line 126 |

---

## Markdown Validation

- [x] Tất cả 3 ảnh dùng markdown syntax `![alt](/path)` — không dùng HTML
- [x] Không resize, rename, move file
- [x] Frontmatter (`---`) đúng chuẩn
- [x] Headings đúng cấp độ (H1 → H2 → H3)
- [x] Links nội bộ đúng format `[text](/slug/)`
- [x] Tables markdown đúng cú pháp
- [x] Không broken markdown

---

## Known Issues

| Issue | Mức độ | Ghi chú |
|-------|--------|---------|
| Node.js chưa cài | Blocker (local only) | Dev server không chạy được trên máy hiện tại. Không ảnh hưởng production build trên Cloudflare. |
| File còn trong `drafts/` | Intentional | Đúng theo task — chờ User duyệt |

---

## Trạng thái

- [x] Dashboard image inserted
- [x] Reddit monitoring image inserted  
- [x] Pricing image inserted
- [x] Markdown validation passed
- [ ] Local preview (blocked — Node.js not installed)
- [ ] User review (pending)
- [ ] Move to `src/content/` (pending User approval)
