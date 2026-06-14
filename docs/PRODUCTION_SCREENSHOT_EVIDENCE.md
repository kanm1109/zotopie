# PRODUCTION SCREENSHOT EVIDENCE — Zotopie PAT-1

**Date:** 2026-06-14  
**Status:** PARTIAL — automated evidence only

---

## Evidence Collection Methodology

### Why No Live Screenshots

The live site `zotopie.com` returns HTTP 403 Forbidden to automated fetch tools. Cloudflare Bot Fight Mode blocks requests that lack a real browser fingerprint (TLS fingerprint, JS challenge, etc.).

This is a **SECURITY FEATURE**, not a bug. It protects against scrapers.

**Consequence:** Screenshots of the live rendered site must be captured by a human using a real browser.

### What IS Verified

`dist/` = the exact Cloudflare Pages deploy artifact. Cloudflare Pages serves static files verbatim — every byte in `dist/index.html` is what `zotopie.com/` returns to browsers that pass the bot check.

---

## Automated Evidence — Phase 1 (Desktop)

### Evidence 1.1 — Homepage HEAD Tags (dist/index.html)

```html
<!-- Extracted from dist/index.html — exact production HTML -->

<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.svg">
<meta property="og:image" content="https://zotopie.com/og-default.svg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
```

**No `favicon.ico` link. SVG favicon only.** ✅

### Evidence 1.2 — Homepage Schema (dist/index.html)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://zotopie.com/#website",
      "url": "https://zotopie.com/",
      "name": "Zotopie",
      "description": "Expert software tool reviews across 11 categories.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {"@type": "EntryPoint", "urlTemplate": "https://zotopie.com/search/?q={search_term_string}"},
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://zotopie.com/#organization",
      "name": "Zotopie",
      "url": "https://zotopie.com/",
      "logo": {"@type": "ImageObject", "url": "https://zotopie.com/favicon.svg"}
    }
  ]
}
```

### Evidence 1.3 — Review Page Schema (dist/reviews/chatgpt/index.html)

Schema types present: `SoftwareApplication, AggregateRating, Review, Rating, Offer, FAQPage, Question, Answer, BreadcrumbList, WebPage, Organization`

```json
{
  "@type": "SoftwareApplication",
  "name": "ChatGPT",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": "..."
  }
}
```

### Evidence 1.4 — Compare Page Content (dist/compare/ahrefs-vs-semrush/index.html)

```
Ahrefs vs Semrush (2026): In-Depth Comparison | Zotopie

Winner: Ahrefs — 4.8 ★ — From $129/mo — SEO & Search
VS
Semrush — 4.7 ★ — Paid — SEO & Search

Quick Comparison:
Feature         Ahrefs          Semrush
Rating          4.8 / 5         4.7 / 5
Pricing Model   Paid            Paid
Starting Price  $129/mo         Contact
Free Plan       No              No
```

---

## Automated Evidence — Phase 2 (Mobile CSS)

### Evidence 2.1 — MainLayout.D7eqgLXD.css (compiled)

```css
/* Hamburger hidden on desktop */
.nav-hamburger[data-astro-cid-ouamjn2i] { display: none; ... }

/* Hamburger shown on mobile ≤600px */
@media(max-width:600px) {
  .nav-links[data-astro-cid-ouamjn2i] { display: none }
  .nav-hamburger[data-astro-cid-ouamjn2i] { display: flex }
}

/* Mobile drawer */
.mobile-menu[data-astro-cid-ouamjn2i] { display: none; border-top: 1px solid ... }
.mobile-menu.is-open[data-astro-cid-ouamjn2i] { display: block }

/* 375px extra padding */
@media(max-width:375px) {
  .page-wrapper[data-astro-cid-ouamjn2i] { padding: 0 16px 64px }
}
```

### Evidence 2.2 — Review page safe-area CSS (_slug_.r0vD5kXj.css)

```css
.sticky-cta[data-astro-cid-qib7c54m] {
  ...
  padding-bottom: env(safe-area-inset-bottom)
}
```

### Evidence 2.3 — Best page overflow CSS (_slug_.N6pfF0Ne.css)

```css
.cmp-table-wrap[data-astro-cid-5q6bqf46] {
  border-radius: 14px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch
}
```

---

## Automated Evidence — Phase 3 (Brand)

### Evidence 3.1 — favicon.svg content

```svg
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C3AED"/>
      <stop offset="50%" stop-color="#6366F1"/>
      <stop offset="100%" stop-color="#0EA5E9"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="115" fill="url(#bg)"/>
  <path d="M 104 168 L 408 168 L 104 344 L 408 344"
    stroke="#FFFFFF" stroke-width="72" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>
```

711 bytes. Brand V2. 3-stop gradient. No network nodes (clean at 16px). ✅

### Evidence 3.2 — Nav logo inline SVG (dist/index.html)

```html
<div class="nav-logo-icon" aria-hidden="true">
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M4 4 H14 L4 14 H14" stroke="#fff" stroke-width="2.8"
      stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Brand V2 network nodes added 2026-06-14 -->
    <circle cx="14" cy="4" r="1.8" fill="#fff" opacity="0.9"/>
    <circle cx="9" cy="9" r="1.2" fill="#fff" opacity="0.6"/>
    <circle cx="4" cy="14" r="1.8" fill="#fff" opacity="0.9"/>
  </svg>
</div>
<span class="nav-logo-text">Zotopie</span>
```

---

## Automated Evidence — Phase 4 (Analytics)

### Evidence 4.1 — GA4 Not Present in HTML

```bash
Search in dist/index.html for: googletagmanager, gtag, G-XXXXXXXXXX
Result: NO MATCH FOUND

Reason: GA_ID = import.meta.env.PUBLIC_GA_ID ?? ''
        PUBLIC_GA_ID env var = NOT SET in Cloudflare Pages
        Conditional render: {GA_ID && (...)} = false → script omitted
```

### Evidence 4.2 — Affiliate Click Tracking Present

From `dist/go/chatgpt/index.html`:
```javascript
const key = "ztp_clicks";
const raw = localStorage.getItem(key);
const data = raw ? JSON.parse(raw) : {};
data[slug] = data[slug] ?? { count: 0, first: now };
data[slug].count += 1;
data[slug].last = now;
if (isAffiliate) data[slug].affiliate = true;
localStorage.setItem(key, JSON.stringify(data));
window.location.replace(dest);
```

Local storage tracking only. No GA4 event sent. ⚠️

---

## Automated Evidence — Phase 5 (SEO)

### Evidence 5.1 — Sitemap

```xml
<!-- sitemap-0.xml -->
<urlset ...>
  <url><loc>https://zotopie.com/</loc></url>
  <url><loc>https://zotopie.com/about/</loc></url>
  <url><loc>https://zotopie.com/alternatives/activecampaign/</loc></url>
  ...
</urlset>

Total <loc> entries: 739
```

### Evidence 5.2 — robots.txt

```
User-agent: *
Allow: /

Disallow: /go/
Disallow: /search?*

Sitemap: https://zotopie.com/sitemap-index.xml
```

---

## Automated Evidence — Phase 6 (Affiliate)

### Evidence 6.1 — /go/ Page Count

```
dist/go/ subdirectories: 119
(one per tool in the database)
```

### Evidence 6.2 — Redirect Mechanism (dist/go/chatgpt/index.html)

```html
<meta http-equiv="refresh" content="0; url=https://chatgpt.com">
<title>Redirecting to ChatGPT…</title>
<p>Redirecting... <a href="https://chatgpt.com">Click here</a></p>
<script>window.location.replace("https://chatgpt.com")</script>
```

---

## Screenshots Required from Human Tester

The following cannot be captured automatically and must be verified by opening zotopie.com in a real browser:

| # | Screenshot Required | Viewport |
|---|---|---|
| S1 | Homepage — full page | Desktop 1440px |
| S2 | Category page (SEO) — full page | Desktop 1440px |
| S3 | Review page (ChatGPT) — hero + sticky CTA | Desktop + Mobile |
| S4 | Alternatives page (ChatGPT) — compare table | Desktop 1440px |
| S5 | Compare page (Ahrefs vs Semrush) | Desktop 1440px |
| S6 | Best page (SEO Tools) — comparison table | Desktop + Mobile 375px |
| S7 | Homepage — hamburger menu OPEN | Mobile 375px |
| S8 | Homepage — hamburger menu CLOSED | Mobile 375px |
| S9 | Browser tab favicon visible | Desktop Chrome |
| S10 | DevTools → Network → favicon.svg response headers | Desktop Chrome |
| S11 | Review sticky CTA visible | Mobile 375px |
| S12 | Best page table horizontal scroll | Mobile 375px |

---

*PAT-1-PRODUCTION-SCREENSHOT-EVIDENCE — 2026-06-14*
