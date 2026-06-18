# Deployment Report
**Task:** D-020 Step 4  
**Date:** 2026-06-16  
**Commit pushed:** `020320f` — Improve content discovery and unified search

---

## Cloudflare Pages Build

| Field | Result |
|---|---|
| Trigger | Push to `main` → `https://github.com/kanm1109/zotopie.git` |
| Build status | **Success** |
| Production URL | `https://zotopie.com` |
| Pages URL | `https://zotopie.pages.dev` |

## Verification

Build verified by HTTP probe against production URLs:

```
GET https://zotopie.com/
→ HTTP 200 OK
→ Server: cloudflare
→ CF-RAY: a0c5c4f2ba59fd70-SIN
→ Body: Zotopie — Find the Best Software Tools (new design)

GET https://zotopie.com/reddit/
→ HTTP 200 OK
→ Body: Brand24 Review (2026), "Read Article →" CTA present

GET https://zotopie.pages.dev/
→ HTTP 200 OK
```

## IPs Serving Production

```
104.21.18.220   ← Cloudflare CDN
172.67.183.104  ← Cloudflare CDN
```

## Known Issue

`www.zotopie.com` is NOT serving the Zotopie site — see `domain-dns-audit.md` for details and fix plan.

---

## Definition of Done

| Requirement | Status |
|---|---|
| Cloudflare build Success | ✅ |
| Production URL live | ✅ `zotopie.com` |
| New design deployed | ✅ |
| www subdomain | ❌ — separate DNS issue, not a build failure |
