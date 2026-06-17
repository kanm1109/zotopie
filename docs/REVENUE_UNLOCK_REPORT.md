# E1-Phase1 Revenue Unlock Report

**Commit:** `7f3f64b`  
**Deploy:** Cloudflare Pages auto-deploy triggered on push to `main`  
**Build:** 839 pages, 0 errors

---

## Files Changed

| File | Task | Change |
|---|---|---|
| `src/data/tools.json` | M1 | Added `affiliate: true` + `affiliateUrl` to 20 tools |
| `scripts/m1-affiliate.mjs` | M1 | Script that applied affiliate data (new file) |
| `src/pages/go/[slug].astro` | M1 | Routes to `affiliateUrl` when present; `rel="sponsored noopener"`; inline disclosure |
| `src/components/ToolCard.astro` | M5 | Shows `startingPrice` (e.g. `$10/mo`) instead of tier label |
| `src/components/AltCard.astro` | M3, M4 | Rewritten: new `compareSlug` prop; Compare →, Try →, Review → buttons |
| `src/pages/alternatives/[slug].astro` | M4 | Passes `compareSlug` to AltCard |
| `src/pages/reviews/[slug].astro` | M4, M6 | Passes `compareSlug` to AltCard; all Visit buttons have `rel="sponsored noopener"` |
| `src/pages/compare/[pair].astro` | M2 | `.hero-ctas` above fold + `.vcta-primary` winner CTA in verdict |
| `src/layouts/MainLayout.astro` | M6 | Sitewide affiliate disclosure in footer |

---

## Pages Affected

| Page type | Count | Change |
|---|---|---|
| `/go/[slug]` redirect pages | 119 | Now routes affiliate tools to `affiliateUrl`; all others to `tool.website` |
| `/compare/[pair]` | 439 | Two new CTAs per page: hero above fold + verdict winner CTA |
| `/alternatives/[slug]` | 119 | Each alt card now has Compare + Try + Review buttons |
| `/reviews/[slug]` | 119 | Alt cards have Compare + Try buttons; Visit links are FTC-compliant |
| All pages | 839 | Footer affiliate disclosure visible sitewide |

---

## New CTA Inventory

### M2 — Compare Pages (439 pages × 2 CTAs = 878 new CTAs)
- **`.hero-ctas`**: Two buttons above fold — "Try [Tool A] Free →" / "Visit [Tool A] →" and "Try [Tool B] Free →" / "Visit [Tool B] →"
- **`.vcta-primary`**: One winner CTA in verdict section — highlights the recommended tool
- All link through `/go/[slug]` with `rel="sponsored noopener"` when affiliate

### M3 — AltCard Try Button (~1,000+ new CTAs)
- Blue filled "Try Free →" or "Visit →" button on every alternative card
- Routes through `/go/[slug]` — affiliate tools earn commission

### M4 — AltCard Compare Link (~1,000+ new CTAs)
- Purple "Compare →" pill on each alternative card
- Links to canonical compare pair (alphabetical slug: `[a, b].sort().join("-vs-")`)
- Drives traffic to high-intent compare pages

### M5 — ToolCard Pricing Display
- Tools with `startingPrice` now show actual price (e.g. `$10/mo`, `$29/mo`)
- Freemium tools show `Free / $X/mo` format
- Increases perceived value clarity → higher click-through on paid tools

### M6 — Sitewide Disclosure
- Footer: visible on all 839 pages — FTC + Google compliant
- Per-page: inline disclosure on `/go/[slug]` for affiliate redirects
- Outbound links on review pages: `rel="sponsored noopener"` on affiliate Visit buttons

---

## Revenue Opportunities Unlocked

### Affiliate Tools (20 active)

| Tool | Program | Status |
|---|---|---|
| ConvertKit | ConvertKit Affiliate | URL placeholder — needs your ref ID |
| Beehiiv | Beehiiv Partner | URL placeholder |
| Kinsta | Kinsta Affiliate | URL placeholder |
| WP Engine | WP Engine Affiliate | URL placeholder |
| Hostinger | Hostinger Affiliate | URL placeholder |
| SiteGround | SiteGround Affiliate | URL placeholder |
| Bluehost | Bluehost Affiliate | URL placeholder |
| HubSpot | HubSpot Affiliate | URL placeholder |
| ActiveCampaign | ActiveCampaign Affiliate | URL placeholder |
| Jasper | Jasper Affiliate | URL placeholder |
| Fathom Analytics | Fathom Affiliate | URL placeholder |
| Circle | Circle Affiliate | URL placeholder |
| Skool | Skool Affiliate | URL placeholder |
| Systeme.io | Systeme.io Affiliate | URL placeholder |
| ClickFunnels | ClickFunnels Affiliate | URL placeholder |
| ClickUp | ClickUp Affiliate | URL placeholder |
| Lemon Squeezy | Lemon Squeezy Affiliate | URL placeholder |
| GetResponse | GetResponse Affiliate | URL placeholder |
| Mailchimp | Mailchimp Affiliate | URL placeholder |
| Monday.com | Monday Affiliate | URL placeholder |

### Action Required
All 20 `affiliateUrl` fields in `src/data/tools.json` contain `YOURREF` or `YOURID` placeholders.  
Replace each with your actual affiliate tracking ID to activate commissions.

Example (tools.json):
```json
"affiliateUrl": "https://convertkit.com?lmref=YOURREF"
```
→ Replace `YOURREF` with your actual ConvertKit affiliate ref code.

---

## Success Criteria Check

| Criterion | Status |
|---|---|
| M1 Affiliate URL infrastructure active | ✅ Done |
| M2 Compare CTAs above fold + verdict | ✅ Done |
| M3 AltCard Try button | ✅ Done |
| M4 AltCard Compare link | ✅ Done |
| M5 ToolCard real pricing | ✅ Done |
| M6 Sitewide affiliate disclosure | ✅ Done |
| Build passes (839 pages, 0 errors) | ✅ Done |
| Committed and pushed to main | ✅ Done (`7f3f64b`) |
| FTC/Google compliance (`rel="sponsored"`) | ✅ Done |
