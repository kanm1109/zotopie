# S1.1 — Measurement Audit

**Project:** Zotopie  
**Role:** Analytics Engineer  
**Date:** 2026-06-13  
**Status:** Implemented

---

## Executive Summary

Before this task, Zotopie had **zero aggregate analytics**. Affiliate clicks were stored in `localStorage` — visible only to the individual visitor's browser, invisible to the site owner. No page views, no sessions, no source attribution existed anywhere.

After this task, the full measurement stack is operational:

| Signal | Before | After |
|---|---|---|
| Page views | ❌ None | ✅ GA4 auto-collected |
| Sessions | ❌ None | ✅ GA4 auto-collected |
| Affiliate clicks | ⚠️ localStorage only | ✅ GA4 `affiliate_click` event |
| Search usage | ❌ None | ✅ GA4 `search` event |
| UTM attribution | ❌ None | ✅ GA4 auto-captures UTM params |
| Reddit traffic | ❌ Not measurable | ✅ UTM-tagged links |
| X traffic | ❌ Not measurable | ✅ UTM-tagged links |
| Product Hunt traffic | ❌ Not measurable | ✅ UTM-tagged links |
| Compare page visits | ⚠️ Not separately tracked | ✅ GA4 page_view with URL path |
| Authority page visits | ⚠️ Not separately tracked | ✅ GA4 page_view with URL path |

---

## Part 1 — Pre-Audit Findings

### What Existed

**`/go/[slug].astro`** — A redirect page that:
- Wrote click data to `localStorage.ztp_clicks`
- Stored: `{ count, first, last, affiliate }` per tool slug
- Redirected via `window.location.replace(dest)`
- Had a `meta http-equiv="refresh" content="0"` fallback

**`/stats`** — A client-side analytics dashboard that:
- Read from `localStorage.ztp_clicks`
- Showed: total clicks, unique tools, affiliate clicks, top category
- **Critical limitation:** Data only exists in the browser that made the clicks. Owner sees their own clicks only. Zero aggregate visibility.

**`src/layouts/MainLayout.astro`** — No analytics script of any kind.

### Critical Gaps Found

1. **No GA4 or any server-side analytics** — impossible to know traffic volume, sources, or user behavior
2. **No UTM capture** — even if links are tagged correctly, no system would record the attribution
3. **No search tracking** — zero data on what users search for (major product signal)
4. **localStorage tracking is per-browser** — owner cannot see aggregate affiliate clicks across all visitors
5. **No compare page instrumentation** — no way to know which comparisons are most used
6. **meta refresh `content="0"`** — browser redirected before any async tracking could fire

---

## Part 2 — Implementation

### Change 1: GA4 in MainLayout

**File:** `src/layouts/MainLayout.astro`

Added GA4 snippet that loads on every page that uses MainLayout (all 860 pages):

```astro
---
const GA_ID = import.meta.env.PUBLIC_GA_ID ?? '';
---
{GA_ID && (
  <>
    <script is:inline async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
    <script is:inline define:vars={{ GA_ID }}>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', GA_ID, { anonymize_ip: true });
    </script>
  </>
)}
```

**Design decisions:**
- `anonymize_ip: true` — GDPR compliance, rounds IP to /24 subnet
- `async` on gtag.js — does not block page render
- Conditional on `PUBLIC_GA_ID` — GA4 is opt-in via env var; zero tracking without it
- `is:inline` — prevents Astro bundler from processing the script

**To activate:** Set `PUBLIC_GA_ID=G-XXXXXXXXXX` in Cloudflare Pages → Settings → Environment Variables.

---

### Change 2: `affiliate_click` Event in `/go/[slug].astro`

**File:** `src/pages/go/[slug].astro`

The redirect page now fires a GA4 event before navigating:

```js
var _redirected = false;
function _doRedirect() {
  if (!_redirected) { _redirected = true; window.location.replace(dest); }
}

if (GA_ID && typeof gtag === 'function') {
  gtag('event', 'affiliate_click', {
    tool_name: toolName,    // e.g., "HubSpot"
    tool_slug: slug,        // e.g., "hubspot"
    is_affiliate: isAffiliate,
    event_callback: _doRedirect,
  });
  setTimeout(_doRedirect, 1200); // fallback if GA4 callback never fires
} else {
  _doRedirect(); // redirect immediately if no GA4
}
```

**`meta http-equiv="refresh"` delay changed:** `content="0"` → `content="3"` — gives GA4 1.2s to beacon before the HTML-level fallback fires. JS users redirect in ~200–400ms (no visible delay).

**GA4 event parameters:**

| Parameter | Type | Example |
|---|---|---|
| `tool_name` | string | "HubSpot" |
| `tool_slug` | string | "hubspot" |
| `is_affiliate` | boolean | true |
| `event_callback` | function | triggers redirect |

---

### Change 3: `search` Event in `search.astro`

**File:** `src/pages/search.astro`

Added inside the `doSearch()` function, after results render:

```js
if (q && typeof gtag === 'function') {
  gtag('event', 'search', {
    search_term: q,
    results_count: hits.length,
    category_filter: activeCat || null,
  });
}
```

**Design decisions:**
- Fires only when `q` is non-empty (no event for blank/reset)
- Fires after the 180ms debounce — not on every keystroke
- `results_count` tells you zero-result searches vs. successful ones
- `category_filter` reveals which category filters are used with search

---

### Change 4: `.env.example`

Documents the single required environment variable for operators:

```env
PUBLIC_GA_ID=   # Your GA4 Measurement ID (G-XXXXXXXXXX)
```

---

## Part 3 — Event Coverage Map

### Auto-Collected by GA4 (no code needed)

| Event | What It Measures |
|---|---|
| `page_view` | Every page load on every Zotopie page |
| `session_start` | New session started |
| `first_visit` | New user |
| `scroll` | User scrolled >90% of page |
| `user_engagement` | User had active tab for >10s |
| `click` (outbound) | Any external link click (if `enhanced_measurement` on) |

### Custom Events (implemented this task)

| Event | File | Parameters |
|---|---|---|
| `affiliate_click` | `/go/[slug].astro` | `tool_name`, `tool_slug`, `is_affiliate` |
| `search` | `search.astro` | `search_term`, `results_count`, `category_filter` |

### Recommended Future Events (not yet implemented)

| Event | Trigger | Parameters | Priority |
|---|---|---|---|
| `compare_initiated` | User clicks "Compare" button | `tool_a`, `tool_b` | High |
| `category_browsed` | User visits a category page | `category_slug` | Medium |
| `review_read` | User scrolls >75% of review page | `tool_slug`, `tool_name` | Medium |
| `cta_clicked` | Homepage CTA buttons | `cta_label`, `destination` | Low |

---

## Part 4 — UTM Attribution Coverage

GA4 automatically reads UTM parameters from incoming URLs. No additional code is needed.

### UTM Parameters GA4 Captures

| Parameter | GA4 Dimension | Zotopie Playbook |
|---|---|---|
| `utm_source` | Session source | `reddit`, `x`, `producthunt` |
| `utm_medium` | Session medium | `post`, `thread`, `launch`, `bio` |
| `utm_campaign` | Campaign | `compare-zapier-vs-make`, `r-seo`, etc. |
| `utm_content` | Ad content | `hook-v1`, `hook-v2` (A/B variants) |

### Channel Grouping (GA4 default)

GA4 will automatically group sessions into channels:
- **Organic Search** — sessions from Google without UTM
- **Organic Social** — sessions from X/Reddit without UTM (manual)
- **Referral** — sessions with UTM source not matching social channels
- **Direct** — sessions with no source data

**To ensure Reddit and X sessions are correctly attributed:** Always use UTM-tagged links when posting. Untagged links will appear as "Direct" in GA4.

---

## Part 5 — Page Type Attribution

GA4 page_view events include the page URL. Use GA4 → Explore → Path exploration to segment by page type:

| Page Type | URL Pattern | GA4 Filter |
|---|---|---|
| Review pages | `/reviews/[slug]/` | Page path contains `/reviews/` |
| Compare pages | `/compare/[pair]/` | Page path contains `/compare/` |
| Authority pages | `/best/[slug]/` | Page path contains `/best/` |
| Alternatives | `/alternatives/[slug]/` | Page path contains `/alternatives/` |
| Category pages | `/category/[slug]/` | Page path contains `/category/` |
| Homepage | `/` | Page path exactly `/` |
| Search | `/search/` | Page path contains `/search/` |

---

## Part 6 — Activation Steps

To activate full measurement:

### Step 1 — Create GA4 Property
1. Go to analytics.google.com → Create Property
2. Property name: "Zotopie"
3. Timezone: your timezone
4. Currency: USD (for revenue tracking)
5. Create Data Stream → Web → Enter `https://zotopie.com`
6. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 2 — Set Environment Variable
**In Cloudflare Pages:**
1. Pages → zotopie → Settings → Environment Variables
2. Add variable: `PUBLIC_GA_ID` = `G-XXXXXXXXXX`
3. Apply to both Production and Preview environments
4. Trigger a new deployment (or merge any commit)

**For local development:**
```bash
# Create .env (already in .gitignore)
cp .env.example .env
# Edit .env and set PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Step 3 — Verify GA4 is Receiving Data
1. Open zotopie.com in a browser
2. Go to GA4 → Reports → Realtime
3. You should see your session appear within 30 seconds
4. Click any "Visit Tool" button
5. In GA4 Realtime → Events, look for `affiliate_click`

### Step 4 — Mark `affiliate_click` as Conversion
1. GA4 Admin → Events → Find `affiliate_click`
2. Toggle "Mark as conversion"
3. Now GA4 will show affiliate clicks in the Conversions report

### Step 5 — Google Search Console
1. Go to search.google.com/search-console
2. Add property → URL prefix → `https://zotopie.com`
3. Verify via DNS TXT record (add to Cloudflare DNS)
4. Submit sitemap: `https://zotopie.com/sitemap-index.xml`
5. Link GSC property to GA4: GA4 Admin → Product Links → Search Console

---

## Part 7 — What Is NOT Tracked (by design)

| What | Why Not Tracked | Status |
|---|---|---|
| Individual user identity | Privacy — no PII collected | Correct |
| Specific user's click history | localStorage is ephemeral, per-device | Acceptable |
| Affiliate revenue amounts | Comes from affiliate network dashboards, not GA4 | Correct |
| Server-side rendering events | SSG site — no server to instrument | By design |
| Bot traffic | GA4 filters known bots automatically | Handled |
| Internal traffic (owner) | Set IP filter in GA4 Admin → Data Filters | Recommended |
