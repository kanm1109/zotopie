# Content Cleanup Report — PHASE 1
**Date:** 2026-06-15

---

## Summary

| Collection | Total Files | Keep | Delete |
| --- | --- | --- | --- |
| reddit | 3 | 1 | 2 |
| blog | 0 | 0 | 0 |
| threads | 1 | 0 | 1 |
| extensions | 1 | 0 | 1 |
| marketing | 1 | 0 | 1 |
| **TOTAL** | **6** | **1** | **5** |

---

## File Audit

### ❌ DELETE — `src/content/reddit/best-reddit-tools-2026.md`

| Field | Value |
| --- | --- |
| **Collection** | reddit |
| **Published** | 2026-06-08 |
| **Lines** | 24 |
| **Reason** | Obvious stub. Body contains "This is the first article on Zotopie." + "Content coming soon." repeated under every H2. No real content. |
| **Delete?** | **YES — confirmed stub** |

---

### ❌ DELETE — `src/content/reddit/reddit-marketing-guide-2025.md`

| Field | Value |
| --- | --- |
| **Collection** | reddit |
| **Published** | 2025-01-15 |
| **Lines** | 81 |
| **Reason** | Generic AI-generated demo article. Cross-linked with other demo articles (extensions, marketing). Has broken internal link to `/threads/threads-app-guide-2025/` (URL doesn't exist — actual slug is `threads-app-growth-guide`). Dated 2025 (we're in 2026). Not aligned with Zotopie's specific tool-review focus. |
| **Delete?** | **YES — demo content** |

---

### ❌ DELETE — `src/content/extensions/best-chrome-extensions-marketers.md`

| Field | Value |
| --- | --- |
| **Collection** | extensions |
| **Published** | 2025-01-25 |
| **Lines** | 96 |
| **Reason** | Generic Chrome extension listicle. Not specific to Reddit or software tools. Cross-linked with other demo articles (reddit, marketing). Dated 2025. "Related reading" links form a closed demo content ecosystem — no production pages link to this. |
| **Delete?** | **YES — demo content** |

---

### ❌ DELETE — `src/content/marketing/digital-marketing-fundamentals.md`

| Field | Value |
| --- | --- |
| **Collection** | marketing |
| **Published** | 2025-02-01 |
| **Lines** | 117 |
| **Reason** | Generic "Digital Marketing 101" beginner guide. Could have been pulled from any generic blog. Cross-linked with all other demo articles. No unique angle for Zotopie. Dated 2025. |
| **Delete?** | **YES — demo content** |

---

### ❌ DELETE — `src/content/threads/threads-app-growth-guide.md`

| Field | Value |
| --- | --- |
| **Collection** | threads |
| **Published** | 2025-01-20 |
| **Lines** | 89 |
| **Reason** | Generic Threads app growth guide. Tactical tips that could be on any social media blog. Cross-linked with other demo articles. Dated 2025. Not tool-review content. The `/threads/threads-app-guide-2025/` internal link in reddit-marketing-guide points to a WRONG slug for this file. |
| **Delete?** | **YES — demo content** |

---

### ✅ KEEP — `src/content/reddit/brand24-review.md`

| Field | Value |
| --- | --- |
| **Collection** | reddit |
| **Published** | 2026-06-15 |
| **Lines** | 230+ |
| **Reason** | Real production article. Reviewed actual Brand24 product. Correct pricing (verified from screenshots). Schema-compliant frontmatter. No broken links. 3 product images. This is the content template going forward. |
| **Delete?** | **NO — production content** |

---

## Pattern Analysis — Why These Are Demo Content

All 5 articles to be deleted share the same pattern:

1. **Cross-linked to each other** — they form a closed ecosystem referencing only each other, with no links to/from production tools pages
2. **Dated 2025** — placed when building the site structure in 2025
3. **Generic content** — could be from any generic marketing blog; no unique Zotopie angle
4. **Not tool-focused** — Zotopie's editorial purpose is software tool reviews and Reddit tool coverage
5. **One has broken internal link** — `reddit-marketing-guide-2025.md` links to `/threads/threads-app-guide-2025/` which doesn't exist

---

## Definition of Done Status (after deletion)

| Criterion | Before | After |
| --- | --- | --- |
| /reddit only real content | ❌ 2 demo articles | ✅ brand24-review only |
| /marketing only real content | ❌ 1 demo article | ✅ empty (ready for real content) |
| /threads only real content | ❌ 1 demo article | ✅ empty (ready for real content) |
| /extensions only real content | ❌ 1 demo article | ✅ empty (ready for real content) |
| /blog only real content | ✅ already empty | ✅ empty |
| No demo articles | ❌ | ✅ |
