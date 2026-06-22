# D-061 — Canonical & Domain Audit Report

**Date:** 2026-06-22
**Status:** Complete — No code changes required

---

## Findings

### 1. Astro Configuration

**File:** `astro.config.mjs`

```js
site: 'https://zotopie.com'
```

Apex domain, no www. This is the base URL used to generate all canonical tags, sitemap URLs, and structured data. ✅

---

### 2. Canonical Tags

All sampled pages declare canonical consistently:

| Page | Canonical |
|------|-----------|
| `/` | `https://zotopie.com/` |
| `/reviews/rytr/` | `https://zotopie.com/reviews/rytr/` |
| `/alternatives/` | `https://zotopie.com/alternatives/` |
| `/compare/activecampaign-vs-beehiiv/` | `https://zotopie.com/compare/activecampaign-vs-beehiiv/` |

**0 www references in any built HTML.** ✅

---

### 3. Sitemap URLs

**`sitemap-index.xml`:**
```xml
<loc>https://zotopie.com/sitemap-0.xml</loc>
```

**`sitemap-0.xml`:**
- `www` references found: **0**
- All `<loc>` entries use `https://zotopie.com/` ✅

---

### 4. Open Graph URLs

| Page | `og:url` |
|------|----------|
| `/` | `https://zotopie.com/` |
| `/reviews/rytr/` | `https://zotopie.com/reviews/rytr/` |
| `/alternatives/` | `https://zotopie.com/alternatives/` |

All consistent with apex domain. ✅

---

### 5. Structured Data (JSON-LD)

Homepage JSON-LD:
```json
{
  "@type": "WebSite",
  "@id": "https://zotopie.com/#website",
  "url": "https://zotopie.com/",
  ...
  "urlTemplate": "https://zotopie.com/search/?q={search_term_string}"
}
```

**0 www references in any JSON-LD.** ✅

---

### 6. Robots.txt

```
User-agent: *
Allow: /
Disallow: /go/
Disallow: /search?*
Sitemap: https://zotopie.com/sitemap-index.xml
```

Sitemap reference uses apex domain. ✅

---

### 7. DNS State

| Domain | Status | Records |
|--------|--------|---------|
| `zotopie.com` | ✅ Resolves | A: `172.67.183.104`, `104.21.18.220` (Cloudflare IPs) |
| `www.zotopie.com` | ❌ NXDOMAIN | No A record, No CNAME — domain does not exist in DNS |

`zotopie.com` is proxied through Cloudflare (standard Cloudflare anycast IPs). `www.zotopie.com` has no DNS record whatsoever.

---

## Signal Consistency Summary

| Signal | Domain used | Consistent? |
|--------|-------------|-------------|
| `astro.config.mjs site:` | `https://zotopie.com` | ✅ |
| `<link rel="canonical">` | `https://zotopie.com` | ✅ |
| `<meta og:url>` | `https://zotopie.com` | ✅ |
| JSON-LD `url` fields | `https://zotopie.com` | ✅ |
| Sitemap `<loc>` | `https://zotopie.com` | ✅ |
| `robots.txt` Sitemap | `https://zotopie.com` | ✅ |
| DNS apex | Resolves → Cloudflare | ✅ |
| DNS www | **NXDOMAIN** | ❌ |

**All in-code and in-sitemap signals are 100% consistent. No www references exist anywhere in the codebase or built output.**

---

## Risk Assessment — Why Google Selected `www.zotopie.com`

Google's canonicalization algorithm combines declared signals (canonical tag) with observed signals (links, crawl history, PageRank). Google's "user canonical" (`https://zotopie.com/`) correctly reflects what the site declares. The "Google-selected canonical" (`https://www.zotopie.com/`) overrides the declared canonical based on observed signals.

Most likely causes, in order of probability:

### 1. External Backlinks Pointing to `www.zotopie.com` (Most Likely)

If any external site links to `https://www.zotopie.com/` or `http://www.zotopie.com/`, Google will weight those link signals and may override the declared canonical. Google treats the declared canonical as a "hint," not a directive — high-authority inbound links to the www variant can outweigh the declared canonical.

**Check:** Use Google Search Console → Links → External Links to audit referring domains. If any link to `www.`, those are contributing to this issue.

### 2. Historical DNS / Crawl Data

If `www.zotopie.com` previously resolved (e.g., during initial Cloudflare setup when "www" was briefly configured), Google may have crawled it and cached canonical preference from that era. Google's recrawl of www now returns NXDOMAIN — but since the page doesn't exist, Google can't see the canonical tag to correct itself. It may take 3–6 months for this historical signal to decay.

### 3. GSC Property Type

If Google Search Console has a **URL-prefix property** registered as `https://www.zotopie.com/` (separate from the apex property), it may be reporting from that data set. Verify whether a www property exists in GSC alongside the apex property.

### 4. Cloudflare Not Explicitly Blocking or Redirecting www

Since `www.zotopie.com` is NXDOMAIN (not set up in DNS at all), Cloudflare does not serve any redirect. Google crawls www, gets NXDOMAIN, and cannot read the canonical tag at www — so it cannot confirm or deny the preferred canonical. This is worse than serving a 301 redirect.

---

## Recommendation

### Is any fix required?

**The code is correct — no code changes needed.** However, one infrastructure change is recommended to resolve the Google conflict faster:

### Recommended Fix: Configure `www.zotopie.com` → 301 redirect to apex

The current situation (www = NXDOMAIN) is worse than having www redirect to apex, because:
- Google cannot read canonical tags on NXDOMAIN pages
- The conflict cannot resolve itself unless Google stops observing www signals
- A 301 redirect makes the preferred domain explicit to Googlebot

**How to implement (Cloudflare DNS + Pages, ~15 min):**

1. **Cloudflare DNS:** Add a CNAME record:
   ```
   Name: www
   Target: zotopie.com
   Proxied: ✅ Yes
   ```

2. **Cloudflare Pages custom domain:** Add `www.zotopie.com` as an additional custom domain, then Cloudflare Pages will serve a 301 redirect from www → apex automatically.

   OR

   **Cloudflare Redirect Rules:** Create a bulk redirect rule:
   ```
   Source: https://www.zotopie.com/*
   Target: https://zotopie.com/$1
   Status: 301
   ```

**Estimated effort:** 15–30 minutes in Cloudflare dashboard. **Zero code changes** to the Astro project.

### If no action is taken:

Google will eventually re-crawl www, get NXDOMAIN consistently, and stop treating it as a valid canonical. However, this may take several months and in the interim the GSC report will continue to show the mismatch.

---

## Answers to Acceptance Criteria

| # | Question | Answer |
|---|----------|--------|
| 1 | What is Zotopie's canonical domain? | **`https://zotopie.com/`** (apex, no www) — declared everywhere in code |
| 2 | Are all SEO signals consistent? | **Yes** — canonical, sitemap, OG, JSON-LD, robots.txt all point to `https://zotopie.com/` |
| 3 | Why is Google selecting www? | **Historical crawl data and/or external backlinks pointing to `www.zotopie.com`**. Since www is NXDOMAIN, Google cannot read a canonical tag there to correct itself. |
| 4 | Is any fix required? | **Not in code.** Recommended infrastructure fix: add www CNAME in Cloudflare DNS + redirect rule → speeds up Google reconciliation. Without it, the mismatch will self-correct slowly. |
| 5 | If a fix is required — effort and affected files? | **~15–30 min in Cloudflare dashboard only.** Zero Astro/code files affected. |
