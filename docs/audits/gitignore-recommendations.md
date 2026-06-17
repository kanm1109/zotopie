# .gitignore Recommendations — TASK D-007
**Date:** 2026-06-15

Current `.gitignore` covers: dist/, .astro/, node_modules/, logs, .env, .DS_Store, .idea/

---

## Recommended Additions

---

### Pattern
`*-report.md`

**Reason:** Ngăn AI audit reports và generated reports vô tình được commit.

**Risk nếu không thêm:** AI tool reports (broken-links-report.md, mobile-audit-report.md, schema-report.md, v.v.) bị đưa vào git history — làm bẩn commit log và lộ nội dung audit nội bộ.

---

### Pattern
`*-report.json`

**Reason:** Generated JSON reports từ scripts (dead-alternatives-report.json, validation-report-seo.json...).

**Risk nếu không thêm:** Script output lẫn vào source — gây nhầm lẫn với source data thực sự.

---

### Pattern
`*-audit-report.md`

**Reason:** Audit reports cụ thể (PRE_PRODUCTION_AUDIT.md, mobile-audit-report.md...).

**Risk nếu không thêm:** Internal audit documents xuất hiện trên GitHub public repo.

---

### Pattern
`docs/`

**Reason:** Toàn bộ thư mục `docs/` chứa tài liệu nội bộ — chiến lược SEO, roadmap, revenue reports, authority plans.

**Risk nếu không thêm:** Chiến lược SEO và roadmap kinh doanh bị lộ trên public repo — competitors có thể đọc được.

---

### Pattern
`content-briefs/`

**Reason:** Content briefs là tài liệu editorial nội bộ — kế hoạch bài viết tương lai, outline chưa publish.

**Risk nếu không thêm:** Đối thủ cạnh tranh biết trước kế hoạch nội dung sắp xuất bản.

---

### Pattern
`NEXT_STEPS.txt`

**Reason:** File ghi chú kế hoạch cá nhân — không phải source code.

**Risk nếu không thêm:** Thấp, nhưng không có lý do gì để commit file này.

---

### Pattern
`PRE_PRODUCTION_AUDIT.md`

**Reason:** Internal checklist — không phải production file.

**Risk nếu không thêm:** Thấp, nhưng làm bẩn repo với internal documents.

---

### Pattern
`scripts/`

**Reason:** Thư mục `scripts/` hiện chứa one-time data fix scripts đã dùng xong. Nếu cần scripts lâu dài, nên review từng file trước khi commit.

**Risk nếu không thêm:** MEDIUM — scripts có thể chứa hardcoded paths, credentials, hoặc logic đặc thù môi trường local.

> **Lưu ý:** Nếu sau này cần commit một số script hữu ích lâu dài, dùng `git add -f scripts/tên-file.mjs` để force-add từng file cụ thể.

---

### Pattern
`src/data/keywords/`

**Reason:** Keyword research files (.xlsx) — không phải source code, không được import bởi Astro.

**Risk nếu không thêm:** Keyword strategy bị lộ trên public repo.

---

### Pattern
`src/data/research/`

**Reason:** Research data folder — input data dùng để generate tools.json, không dùng ở runtime.

**Risk nếu không thêm:** Thấp nhưng làm tăng kích thước repo không cần thiết.

---

### Pattern
`src/data/*-seo.json`

**Reason:** SEO data files (pros-cons-seo.json, integration-report-seo.json, validation-report-seo.json) — là intermediate output của generate pipeline, không phải source data thực sự dùng ở runtime.

**Risk nếu không thêm:** Confusion về file nào là "source of truth" trong `src/data/`.

---

### Pattern
`*.xlsx`

**Reason:** Binary Excel files không diff được trong git — keyword research, content plans.

**Risk nếu không thêm:** Binary blobs làm tăng repo size, không có lợi ích gì khi version control Excel files.

---

## Suggested .gitignore Block to Add

```gitignore
# Internal reports and AI outputs
*-report.md
*-audit-report.md
*-report.json

# Internal planning and strategy documents
docs/
content-briefs/
NEXT_STEPS.txt
PRE_PRODUCTION_AUDIT.md

# One-time utility scripts
scripts/

# Keyword research and SEO data (not used at runtime)
src/data/keywords/
src/data/research/
src/data/*-seo.json

# Binary files that don't benefit from git tracking
*.xlsx
```

---

## Files That Need Manual Review Before gitignore

| File | Vấn đề | Hành động đề xuất |
| --- | --- | --- |
| `src/data/reddit-tools.json` | Chưa rõ có dùng sau này không | Giữ ngoài gitignore, review trước khi commit |
| `src/data/pros-cons-seo.json` | Có thể là input cho generate script tương lai | Giữ ngoài gitignore, review trước khi commit |
| `docs/` | Nếu muốn backup docs lên GitHub private | Không gitignore nếu repo là private |
