# PRODUCTION BUGS REMAINING — Zotopie PAT-1

**Date:** 2026-06-14  
**Source:** PAT-1-PRODUCTION-ACCEPTANCE-TEST  
**Commit verified:** e951f9f

All issues below are verified from `dist/` (production artifact). Severity ratings are independent of what was previously reported or fixed.

---

## P0 — CRITICAL (Blocks Growth)

### BUG-PAT-001 — GA4 Not Active

**Severity:** P0  
**Evidence:** No `googletagmanager.com` script in any built HTML page  
**Root cause:** `PUBLIC_GA_ID` environment variable not set in Cloudflare Pages  
**Impact:** Zero analytics data. No pageview tracking, no search tracking, no affiliate click attribution, no conversion funnel. Cannot measure any growth effort.

**Fix required:**
1. Obtain GA4 Measurement ID (format: `G-XXXXXXXXXX`) from Google Analytics console
2. Log in to Cloudflare Pages → zotopie project → Settings → Environment Variables
3. Add: `PUBLIC_GA_ID` = `G-XXXXXXXXXX`
4. Trigger a new deployment (push any commit OR redeploy from Cloudflare dashboard)

**Effort:** 5 minutes  
**Deploy required:** Yes (env var change requires rebuild in Cloudflare Pages)

---

## P1 — HIGH (Damages Credibility)

### BUG-PAT-002 — 53 Tools Missing `startingPrice`

**Severity:** P1  
**Evidence:** 53 entries in `src/data/tools.json` have `startingPrice` = empty string or `"/mo"` only  
**Impact:** Review pages display "Starting Price /mo" or "Starting Price" blank. Compare pages show "From /mo". Looks like broken data to users.

**Affected tools (sample — highest traffic priority):**

| Tool | Current | Should be |
|---|---|---|
| ChatGPT | `/mo` | `Free / $20/mo` |
| Notion | `/mo` | `Free / $8/user/mo` |
| Canva | `/mo` | `Free / $15/mo` |
| Grammarly | `/mo` | `Free / $12/mo` |
| ElevenLabs | `/mo` | `Free / $5/mo` |
| Beehiiv | `/mo` | `Free / $42/mo` |
| ConvertKit | `/mo` | `Free / $25/mo` |
| Plausible | `/mo` | `$9/mo` |
| Shopify | `/mo` | `$29/mo` |
| Semrush | `` (empty) | `$108.33/mo` |
| Hootsuite | `` (empty) | `$49/mo` |
| Moz | `` (empty) | `$49/mo` |
| Surfer SEO | `` (empty) | `$79/mo` |

**Full list:** 53 tools total (see tools.json — all entries where `startingPrice === ""` or `startingPrice.startsWith("/")`)

**Fix required:** Update `src/data/tools.json` with correct pricing for all 53 tools, rebuild, deploy.

**Effort:** 1–2 hours (data entry)  
**Deploy required:** Yes

---

### BUG-PAT-003 — 67 Tools Showing Letter Fallback Instead of Logo

**Severity:** P1  
**Evidence:** 119 total tools. 52 have logo files in `public/logos/`. 67 have neither a logo file nor a `simple_icon` value.  
**Impact:** 56% of all tool cards, review pages, and category listings show 2-letter initials (e.g., "RA" for Rank Math, "EL" for ElevenLabs, "SK" for Skool, "BE" for Beehiiv). Site looks incomplete to visitors.

**Highest priority missing logos (popular tools):**
- Rank Math, ElevenLabs, Skool, Beehiiv, Jasper, Copy.ai, Midjourney
- Grammarly (has `public/logos/grammarly.svg` ✅), ChatGPT ✅, Notion ✅
- Semrush, Moz, Hootsuite, Sprout Social, Later, Agorapulse

**Fix required:** For each missing tool, either:
- Option A: Add `public/logos/[slug].svg` with the tool's logo SVG
- Option B: Set `simple_icon: "slug-from-simpleicons"` in tools.json and ensure icon-data.json is populated

**Effort:** 2–4 hours (finding/sourcing 67 logos)  
**Deploy required:** Yes

---

## P2 — MEDIUM (Suboptimal UX)

### BUG-PAT-004 — favicon.ico Still Served (Not Linked, But Present)

**Severity:** P2  
**Evidence:** `dist/favicon.ico` = 655-byte PNG-format file from 2026-06-04 (pre-Brand-V2)  
**Impact:** Modern browsers (Chrome 47+, Firefox, Safari) are no longer directed to this file via HTML `<link>`. However, legacy browsers and some crawlers still auto-discover `/favicon.ico`. If a user has this file cached from before the Brand V2 deployment (2026-06-14), they may still see the old icon.  
**Cache-Control:** Now set to `max-age=3600` (will expire within 1h of deployment)

**Options:**
- Option A: Leave as-is — will auto-expire from caches within 1h
- Option B: Delete `public/favicon.ico` entirely (remove file from git, rebuild)
- Option C: Replace `public/favicon.ico` with a proper ICO containing the Brand V2 Z mark

**Recommended:** Option B (delete file) — modern browsers don't need .ico

**Effort:** 5 minutes  
**Deploy required:** Yes

---

### BUG-PAT-005 — BaseHead Pages Use Atkinson Font (Inconsistent Brand)

**Severity:** P2  
**Evidence:** `dist/tags/productivity/index.html` loads Atkinson Hyperlegible font (for blog/article pages using `BaseHead.astro`)  
**Impact:** Blog posts, tag pages, and article layouts use a different typography system than the main site (Plus Jakarta Sans). Visual inconsistency when navigating between page types.

**Fix:** Update `BaseHead.astro` to use Plus Jakarta Sans instead of Atkinson, OR decide that blog pages intentionally use different typography.

**Effort:** 30 minutes  
**Deploy required:** Yes

---

### BUG-PAT-006 — Semrush Compare Shows "Contact" Instead of Price

**Severity:** P2 (specific case of BUG-PAT-002)  
**Evidence:** `dist/compare/ahrefs-vs-semrush/index.html` shows "Starting Price: Contact" for Semrush  
**Impact:** Users comparing Ahrefs ($129/mo) vs Semrush ("Contact") cannot make an informed decision. Semrush actually starts at ~$108/mo.

---

## P3 — LOW (Polish)

### BUG-PAT-007 — No Tablet Breakpoints (769–1024px)

**Severity:** P3  
**Evidence:** CSS has desktop (769px+) and mobile (≤600px/640px) breakpoints but no explicit tablet range  
**Impact:** Layout adapts reasonably at tablet without breakpoints but may not be optimal

---

### BUG-PAT-008 — Two Near-Black Hex Values

**Severity:** P3  
**Evidence:** `#111827` and `#0F172A` both used across page templates (imperceptible difference)  
**Impact:** None for users. Minor design system inconsistency.

---

### BUG-PAT-009 — GA4 ID Missing from Organization Schema

**Severity:** P3  
**Evidence:** Homepage schema `Organization.logo` uses `/favicon.svg` (correct) but once GA4 is configured, `sameAs` array is empty  
**Impact:** Minor — social profiles not linked in schema

---

## Summary Table

| Bug | Severity | Status | Fix ETA |
|---|---|---|---|
| BUG-PAT-001: GA4 not active | **P0** | ❌ Open | 5 min (env var) |
| BUG-PAT-002: 53 tools missing price | **P1** | ❌ Open | 1–2 hours |
| BUG-PAT-003: 67 tools missing logo | **P1** | ❌ Open | 2–4 hours |
| BUG-PAT-004: old favicon.ico on server | P2 | ⚠️ Mitigated (not linked) | 5 min (optional) |
| BUG-PAT-005: Atkinson font on blog pages | P2 | ❌ Open | 30 min |
| BUG-PAT-006: Semrush "Contact" price | P2 | ❌ Open (part of P1) | included in P1 |
| BUG-PAT-007: No tablet breakpoints | P3 | ❌ Open | 4–6 hours |
| BUG-PAT-008: Dual near-black hex | P3 | ❌ Open | 30 min |
| BUG-PAT-009: Empty sameAs schema | P3 | ❌ Open | 15 min |

---

## Previously Reported Issues — Verified RESOLVED

| Issue | Previously | Now | Verified |
|---|---|---|---|
| Mobile nav overflow (320–520px) | ❌ 171px overflow | ✅ Hamburger menu | CSS ✅ |
| favicon.ico link in HTML | ❌ Linked | ✅ Removed | HTML ✅ |
| BaseHead missing apple-touch-icon | ❌ Missing | ✅ Present | HTML ✅ |
| BaseHead missing viewport-fit=cover | ❌ Missing | ✅ Present | HTML ✅ |
| Best page table clipping | ❌ Clipped | ✅ overflow-x:auto | CSS ✅ |
| Review sticky CTA safe-area | ❌ Missing | ✅ env(safe-area-inset-bottom) | CSS ✅ |
| Alternatives breakpoint 600→640px | ❌ 600px | ✅ 640px | CSS ✅ |
| Nav tap targets <44px | ❌ 30px | ✅ 44px | CSS ✅ |
| Brand V2 network nodes invisible | ❌ Gradient color | ✅ White | SVG ✅ |
| Encoding/mojibake | ❌ â€" chars | ✅ Clean | HTML ✅ |
| OG image | ✅ (was never broken) | ✅ | HTML ✅ |

---

## Priority Fix Order

1. **BUG-PAT-001** — Set GA4 env var in Cloudflare Pages (5 min, immediate)
2. **BUG-PAT-002** — Fill pricing for top 20 most-visited tools (1h)
3. **BUG-PAT-003** — Add logos for top 20 most-visible tools (2h)
4. **BUG-PAT-004** — Delete `public/favicon.ico` (5 min, optional)
5. **BUG-PAT-005** — Atkinson font (30 min, low impact)

---

*PAT-1-PRODUCTION-BUGS-REMAINING — 2026-06-14 — commit e951f9f*
