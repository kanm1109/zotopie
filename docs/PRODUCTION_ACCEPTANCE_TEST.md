# PRODUCTION ACCEPTANCE TEST — Zotopie

**Task:** PAT-1-PRODUCTION-ACCEPTANCE-TEST  
**Role:** Senior QA Engineer  
**Date:** 2026-06-14  
**Deployment:** commit `e951f9f` → Cloudflare Pages  
**Method:** Static analysis of `dist/` (exact Cloudflare deploy artifact) + compiled CSS

> **METHODOLOGY NOTE:** The live site (zotopie.com) returns HTTP 403 Forbidden to automated fetch tools due to Cloudflare Bot Fight Mode. All verification below is performed against `dist/` — the exact output that Cloudflare Pages serves verbatim as a static site with zero server-side transformation. CSS is verified from compiled `dist/_astro/*.css`. **Visual rendering, JS execution, and real analytics events cannot be verified without a real browser session.** Items requiring browser verification are explicitly marked `[BROWSER-ONLY]`.

---

## PHASE 1 — DESKTOP PRODUCTION REVIEW

### Pages Tested

| Page | URL | File | Size |
|---|---|---|---|
| Homepage | / | dist/index.html | 54,132 bytes |
| Category | /category/seo-search/ | dist/category/seo-search/index.html | 47,414 bytes |
| Review | /reviews/chatgpt/ | dist/reviews/chatgpt/index.html | 42,215 bytes |
| Alternatives | /alternatives/chatgpt/ | dist/alternatives/chatgpt/index.html | 38,238 bytes |
| Compare | /compare/ahrefs-vs-semrush/ | dist/compare/ahrefs-vs-semrush/index.html | ~32,000 bytes |
| Best | /best/seo-tools/ | dist/best/seo-tools/index.html | 43,062 bytes |

### Page-Level Checks (All 6 Pages)

| Check | Homepage | Category | Review | Alternatives | Compare | Best |
|---|---|---|---|---|---|---|
| `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| NO `<link rel="icon" href="/favicon.ico">` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `<link rel="apple-touch-icon">` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `viewport-fit=cover` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `og:image` present | ✅ og-default.svg | ✅ | ✅ | ✅ | ✅ | ✅ |
| Nav hamburger HTML | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Mobile menu HTML | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Footer HTML | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| JSON-LD schema | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GA4 (conditional) | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| No mojibake encoding | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

> ⚠️ GA4 = conditional on `PUBLIC_GA_ID` env var — see Phase 4.

### Content Verification

**Homepage sections visible:**
- Hero: "Expert Software Directory — Find The Best Tools For Your Success" ✅
- Stats bar: 119+ Expert Reviews, 11 Categories, 7021+ Comparisons, 100% Independent ✅
- Popular Tools: 6 tools with ratings ✅
- Browse by Category: All 11 categories with descriptions and tool counts ✅
- Expert Best-Of Guides: 6 guides ✅
- Newly Added section ✅
- Footer with affiliate disclosure ✅

**Review page (ChatGPT) sections:**
- Title + rating + pricing + breadcrumb ✅
- Overview text ✅
- Pros & Cons ✅
- Best For ✅
- Verdict ✅
- Alternatives section (6 alternatives) ✅
- Expert Guides mentioning ChatGPT ✅
- FAQ ✅
- Related Tools ✅
- Affiliate disclosure ✅

**Best SEO Tools page sections:**
- Editorial intro ✅
- Quick comparison table ✅
- Ranked list (#1–#5) with "Why #N" rationale ✅
- Pros/Cons per tool ✅
- Best For per tool ✅
- CTA buttons ✅

**Compare page (Ahrefs vs Semrush):**
- Winner badge ✅
- Quick comparison table ✅
- Pros/Cons for each ✅
- Best For sections ✅
- FAQ ✅
- "Choose if..." decision guide ✅

**Visual consistency [BROWSER-ONLY]:** Cannot verify without actual browser rendering.

---

## PHASE 2 — MOBILE PRODUCTION REVIEW

> Visual layout at 320/375/390/414px requires real browser. Below verifies the CSS rules that control mobile behavior.

### CSS Rules Verified (from compiled dist/_astro/MainLayout.D7eqgLXD.css)

| Rule | CSS Verified | Effect |
|---|---|---|
| `@media(max-width:600px){.nav-links{display:none}}` | ✅ | Desktop nav hidden on mobile |
| `@media(max-width:600px){.nav-hamburger{display:flex}}` | ✅ | Hamburger appears at ≤600px |
| `.nav-hamburger{width:44px;height:44px}` | ✅ | 44px tap target (WCAG) |
| `.hamburger-bar:nth-child(1)` X animation | ✅ | Animates to × on open |
| `.mobile-menu{display:none}` | ✅ | Drawer hidden by default |
| `.mobile-menu.is-open{display:block}` | ✅ | Drawer opens on toggle |
| `@media(max-width:375px){.page-wrapper{padding:0 16px 64px}}` | ✅ | Extra padding at 375px |

### CSS Rules Verified (from compiled page-specific CSS)

| Rule | File | Effect |
|---|---|---|
| `overflow-x:auto;-webkit-overflow-scrolling:touch` | `_slug_.N6pfF0Ne.css` (best) | Comparison table scrolls on mobile |
| `padding-bottom:env(safe-area-inset-bottom)` | `_slug_.r0vD5kXj.css` (review) | iPhone home indicator safe area |
| `@media(max-width:640px)` breakpoint | alternatives CSS | Consistent with all other pages |

### Mobile Width Math (375px — worst real phone)

```
Screen: 375px
Padding: 24px each side = 327px usable
Nav content: Logo ~110px + search icon 44px + hamburger 44px + gaps ~24px = ~222px
Overflow: ZERO (clearance +105px) ✅
```

### Horizontal Scroll Check [BROWSER-ONLY]

Cannot automate. CSS confirms no fixed-width elements exceeding viewport. Manual test required.

### Hamburger JS Behavior [BROWSER-ONLY]

JS is present in HTML (`click → .is-open`, outside-click close, Escape dismiss). Execution requires browser.

---

## PHASE 3 — BRAND VERIFICATION

### Favicon.svg (dist/favicon.svg)

| Property | Expected | Actual | Status |
|---|---|---|---|
| ViewBox | 512×512 | `0 0 512 512` | ✅ |
| Gradient start | #7C3AED | #7C3AED | ✅ |
| Gradient mid | #6366F1 | #6366F1 | ✅ |
| Gradient end | #0EA5E9 | #0EA5E9 | ✅ |
| Z stroke width | 72px | 72px | ✅ |
| Network nodes | None (too small) | None | ✅ |
| Background rx | 115 (squircle) | rx="115" | ✅ |

### Apple Touch Icon (dist/apple-touch-icon.svg)

| Property | Status |
|---|---|
| ViewBox 512×512 | ✅ |
| Square bg (no rx — iOS applies mask) | ✅ |
| Z stroke present | ✅ |
| Network nodes (white, visible at 120px) | ✅ |
| Halo effect (double circle per node) | ✅ |

### OG Image (dist/og-default.svg)

| Property | Status |
|---|---|
| ViewBox 1200×630 | ✅ |
| Size: 7,122 bytes | ✅ (substantial branded content) |

### Navbar Logo (dist/index.html inline SVG)

```html
<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M4 4 H14 L4 14 H14" stroke="#fff" stroke-width="2.8" .../>
  <circle cx="14" cy="4" r="1.8" fill="#fff" opacity="0.9"/>  ← Brand V2 nodes ✅
  <circle cx="9" cy="9" r="1.2" fill="#fff" opacity="0.6"/>
  <circle cx="4" cy="14" r="1.8" fill="#fff" opacity="0.9"/>
</svg>
```
Network nodes added in Brand V2: ✅

### Footer Logo

Same inline SVG structure with network nodes: ✅

### Brand Directory (dist/brand/)

| File | Status |
|---|---|
| logo-primary.svg | ✅ |
| logo-dark.svg | ✅ |
| logo-light.svg | ✅ |
| logo-compact.svg | ✅ |
| icon-square.svg | ✅ |
| icon-circle.svg | ✅ |

### Old Brand Remnants

| Check | Status |
|---|---|
| `<link rel="icon" href="/favicon.ico">` in HTML | ✅ Removed |
| Old 64×64 favicon.svg (2-stop gradient) | ✅ Overwritten |
| favicon.ico file still in dist/ | ⚠️ Present (655 bytes, pre-V2) but NOT linked in HTML |

> **Note:** `/favicon.ico` still exists on server for legacy browser auto-discovery. It is NOT referenced in any `<link>` tag. Modern browsers (Chrome, Firefox, Safari) will use the SVG. If Chrome still shows old favicon, client-side favicon cache must be cleared manually.

---

## PHASE 4 — ANALYTICS VERIFICATION

### GA4 Status

**CRITICAL ISSUE — GA4 NOT ACTIVE IN PRODUCTION** ❌

Root cause:
1. `src/layouts/MainLayout.astro`: `const GA_ID = import.meta.env.PUBLIC_GA_ID ?? ''`
2. GA4 script only renders when `GA_ID` is truthy: `{GA_ID && (<>...</>)}`
3. No `.env` file exists in the project root
4. `.env.example` shows `PUBLIC_GA_ID=` (empty)
5. No Cloudflare Pages environment variable has been configured

**Evidence:**
```
.env.example content:
PUBLIC_GA_ID=   ← empty, not configured

dist/index.html:
No googletagmanager.com script found
No G-XXXXXXXXXX measurement ID found
```

**Result:** Zero analytics data is being collected. No pageviews, no search events, no affiliate click events flowing to GA4. This is the most critical operational gap.

### Affiliate Click Tracking

Despite GA4 being absent, the `/go/` redirect pages have local click tracking:

```javascript
// dist/go/chatgpt/index.html (JS excerpt)
const key = "ztp_clicks";
const raw = localStorage.getItem(key);
// stores: { slug, count, first, last, isAffiliate }
window.location.replace(dest);  // redirect to tool
```

Status: Local storage only. No server-side or GA4 data. ⚠️

### Search Tracking [BROWSER-ONLY]

Search JS tracking cannot be verified from static files. Requires GA4 to be configured first.

---

## PHASE 5 — SEO VERIFICATION

### Schema Types Per Page Type

| Page | Schema Types |
|---|---|
| Homepage | WebSite, Organization, SearchAction, ImageObject, EntryPoint |
| Review (ChatGPT) | SoftwareApplication, AggregateRating, Review, Rating, Offer, FAQPage, Question, Answer, BreadcrumbList, WebPage, Organization |
| Compare (Ahrefs vs Semrush) | SoftwareApplication, AggregateRating, ItemList, FAQPage, Question, Answer, BreadcrumbList, WebPage |
| Category (SEO) | CollectionPage, ItemList, SoftwareApplication, AggregateRating, FAQPage, BreadcrumbList, Organization |
| Best (SEO Tools) | ItemList, SoftwareApplication, AggregateRating, FAQPage, Question, Answer, BreadcrumbList, WebPage |

**Schema richness: EXCELLENT** — Review pages have SoftwareApplication + AggregateRating + Review + Offer, which qualifies for Google rich results.

### Sitemap

```
dist/sitemap-0.xml: 739 URLs
dist/sitemap-index.xml: index pointing to sitemap-0.xml
```

Sample URLs (first 10):
```
https://zotopie.com/
https://zotopie.com/about/
https://zotopie.com/alternatives/activecampaign/
https://zotopie.com/alternatives/agorapulse/
https://zotopie.com/alternatives/ahrefs/
https://zotopie.com/alternatives/airtable/
...
```

| Check | Status |
|---|---|
| URL count | 739 ✅ |
| Homepage included | ✅ |
| All review URLs | ✅ |
| All compare URLs | ✅ |
| All alternatives URLs | ✅ |
| /go/ URLs excluded | ✅ (robots.txt blocks) |

### robots.txt

```
User-agent: *
Allow: /

Disallow: /go/
Disallow: /search?*

Sitemap: https://zotopie.com/sitemap-index.xml
```

| Check | Status |
|---|---|
| All pages crawlable | ✅ |
| /go/ affiliate redirects blocked (correct) | ✅ |
| /search?* blocked (avoids duplicate content) | ✅ |
| Sitemap referenced | ✅ |

### Canonical URLs

All pages have `<link rel="canonical" href="https://zotopie.com/.../">` ✅

---

## PHASE 6 — AFFILIATE INFRASTRUCTURE

### /go/ Route Coverage

```
dist/go/ directory: 119 subdirectories
```

Every tool has a corresponding `/go/[slug]/` redirect page. ✅

### Redirect Mechanism (per /go/chatgpt/index.html)

```html
<meta http-equiv="refresh" content="0; url=https://chatgpt.com">
<script>window.location.replace("https://chatgpt.com")</script>
<a href="https://chatgpt.com">Click here if not redirected</a>
```

Three-layer redirect: `meta refresh` + `JS window.location.replace` + `<a>` fallback. ✅

### Affiliate Disclosure

Present in footer of all pages using MainLayout:
```
"Some links on this site are affiliate links. We may earn a commission when you 
click through and make a purchase — at no extra cost to you. Editorial ratings 
are independent of affiliate relationships."
```
✅

### /go/ Indexing Prevention

`robots.txt: Disallow: /go/` ✅  
Google will not index affiliate redirect URLs. ✅

### CTA Buttons

Review pages have:
- "Visit [Tool] ↗" above the fold ✅
- Sticky CTA bar (`.sticky-cta`) for mobile ✅
- Inline CTAs in alternatives/compare sections ✅

### Broken Affiliate Routes

All 119 /go/ pages verified to exist. No 404s. ✅

---

## Production Acceptance Score

| Category | Score | Notes |
|---|---|---|
| Technical infrastructure | 93/100 | All pages, redirects, headers correct |
| Mobile UX | 88/100 | CSS verified; JS/visual needs browser test |
| Brand consistency | 90/100 | Brand V2 deployed; old .ico still on server |
| SEO | 94/100 | Rich schema, sitemap, robots all correct |
| Content completeness | 63/100 | 53/119 tools missing pricing data |
| Analytics | **0/100** | GA4 not configured — zero data collected |
| Affiliate infrastructure | 89/100 | 119 redirects; tracking is local-only |
| Logo coverage | 44/100 | 67/119 tools show letter fallbacks |

### **Overall Production Acceptance Score: 70 / 100**

### Build Completion: **78%**

Site structure complete. Data incomplete (pricing 55%, logos 44%).

### Growth Readiness: **35%**

Cannot measure growth without GA4. No funnel data, no search data, no conversion tracking.

### Launch Readiness: **70%**

Acceptable for soft launch. NOT acceptable for paid acquisition or SEO performance tracking.

---

## Verdict

> **REQUIRES FURTHER FIXES**

**Blocker #1 (P0):** GA4 not configured → zero analytics data. Must set `PUBLIC_GA_ID` in Cloudflare Pages environment variables immediately.

**Blocker #2 (P1):** 53 tools have empty or broken `startingPrice` → shows as "/mo" or blank on production pages. Damages credibility.

**Blocker #3 (P1):** 67/119 tools (56%) show letter fallbacks instead of logos → site looks unfinished.

---

*PAT-1-PRODUCTION-ACCEPTANCE-TEST — 2026-06-14 — commit e951f9f*
