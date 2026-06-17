# Domain & DNS Audit
**Task:** D-021  
**Date:** 2026-06-16  
**Priority:** P0 Critical

---

## Current DNS State

### Nameservers (zotopie.com)

```
dorthy.ns.cloudflare.com
amit.ns.cloudflare.com
```

Zone authority: **Cloudflare** ✅ — domain is correctly delegated to Cloudflare.

---

### Apex domain (`zotopie.com`)

| Type | Value | TTL | Status |
|---|---|---|---|
| A | `104.21.18.220` | 300 | ✅ Cloudflare Pages IP |
| A | `172.67.183.104` | 300 | ✅ Cloudflare Pages IP |

**Result:** `zotopie.com` → HTTP 200, new Zotopie design serving correctly.

---

### www subdomain (`www.zotopie.com`)

| Type | Value | TTL | Status |
|---|---|---|---|
| A | `76.223.54.146` | 3600 | ❌ Afternic/GoDaddy server |
| A | `13.248.169.48` | 3600 | ❌ Afternic/GoDaddy server |

**Result:** `www.zotopie.com` → Afternic parking page; browser receives:

```html
<script>window.onload=function(){window.location.href="/lander"}</script>
```

→ Redirects to `www.zotopie.com/lander` (Afternic domain parking page).

---

## Root Cause

The `www` subdomain has DNS records in Cloudflare **pointing to Afternic/GoDaddy servers** (`76.223.54.146`, `13.248.169.48`). These records are NOT proxied (DNS-only mode), so traffic bypasses Cloudflare and goes directly to Afternic's hosting.

**How this happened:** When the domain's nameservers were migrated to Cloudflare, Cloudflare imported existing DNS records from GoDaddy. At that time, GoDaddy had a `www` A record pointing to their Afternic domain parking service. The record was carried over and never updated to point at the Cloudflare Pages deployment.

**Why the apex works but www doesn't:**  
The apex (`zotopie.com`) A records were updated to Cloudflare Pages IPs during Cloudflare Pages custom domain setup. The `www` record was not included in that setup and kept the old GoDaddy values.

---

## Expected DNS (after fix)

| Record | Type | Value | Proxy |
|---|---|---|---|
| `zotopie.com` | A | `104.21.18.220` | Proxied ✅ |
| `zotopie.com` | A | `172.67.183.104` | Proxied ✅ |
| `www.zotopie.com` | CNAME | `zotopie.com` | Proxied ✅ |

Plus a **Cloudflare Redirect Rule** to permanently redirect `www` to apex (see Fix Plan).

---

## Fix Plan

All steps are in **Cloudflare Dashboard** (`dash.cloudflare.com` → `zotopie.com`).

### Step 1 — Delete the broken www record

`DNS → Records`

Find the `www` A records (`76.223.54.146` and `13.248.169.48`) → **Delete both**.

### Step 2 — Add CNAME for www

Still in `DNS → Records` → **Add record**:

| Field | Value |
|---|---|
| Type | CNAME |
| Name | www |
| Target | zotopie.com |
| Proxy status | Proxied (orange cloud) |

### Step 3 — Add Redirect Rule (www → apex)

`Rules → Redirect Rules → Create Rule`

| Field | Value |
|---|---|
| Rule name | Redirect www to apex |
| When | Hostname equals `www.zotopie.com` |
| Then | Static redirect → `https://zotopie.com` + Preserve path |
| Type | 301 Permanent |

This prevents duplicate content (both `zotopie.com` and `www.zotopie.com` serving the same pages), which would hurt SEO. All canonical tags in the site already use `https://zotopie.com/...` (no www).

### Expected result after fix

```
www.zotopie.com/any/path  →  301  →  zotopie.com/any/path
```

---

## Why NOT add www to Cloudflare Pages custom domains?

Adding `www.zotopie.com` as a second custom domain on the Pages project would serve the same content on both URLs. Since all `<link rel="canonical">` tags in the site use the apex `https://zotopie.com/...`, Google would see a canonical mismatch for every page accessed via www and may not consolidate signals. A 301 redirect is cleaner.

---

## Priority

| Item | Severity | Effort |
|---|---|---|
| Delete broken www A records | P0 | 30 seconds |
| Add www CNAME (proxied) | P0 | 30 seconds |
| Add 301 redirect rule | P0 | 2 minutes |

Total fix time: ~3 minutes in Cloudflare Dashboard. No code changes needed.

---

## Summary

| Domain | Status | Serving |
|---|---|---|
| `zotopie.com` | ✅ Working | New Zotopie design (Cloudflare Pages) |
| `www.zotopie.com` | ❌ Broken | Afternic parking page (DNS misconfiguration) |
| `zotopie.pages.dev` | ✅ Working | New Zotopie design |
