# NEXT 90 DAYS ROADMAP — E1

**Date:** 2026-06-13
**Project:** Zotopie
**Epic:** E1-MONETIZATION-AND-UI
**Inputs:** MONETIZATION_AUDIT.md + VISUAL_UI_AUDIT.md

---

## The Single Strategic Priority

**Revenue before aesthetics.**

All three phases lead with conversion-driving changes. Visual polish follows money.
The site already has 839 indexed pages, clean UI, and complete data quality. The constraint is not content or design — it's that zero affiliate links are active and the highest-intent pages (compare pages) have no outbound CTAs.

Fixing this in Week 1 costs ~2 hours of work and unlocks revenue from every existing visitor.

---

## HIGH ROI — Do First

| Task | Pages affected | Effort | Revenue impact |
|---|---|---|---|
| M1: Add affiliate URL field + update `/go/[slug]` | 119 tools | XS (1 day) | Direct — every click earns |
| M2: Compare page dual CTAs ("Try A" + "Try B") | 439 compare pages | XS (1 day) | Direct — highest-intent pages |
| M3: Add "Try [Tool]" button to AltCard | All alternatives + review alt sections | XS (1 day) | Direct — evaluation intent |
| M4: Add "Compare vs X" links to AltCard | All alternatives pages | XS (half day) | SEO + conversion |
| M5: Add startingPrice to ToolCard | All tool grids (home, category, search, related) | XS (half day) | Conversion — price clarity |
| M6: Affiliate disclosure + rel="sponsored" | Footer + review pages | XS (2 hours) | Legal compliance |

---

## MEDIUM ROI — Do Second

| Task | Pages affected | Effort | Impact |
|---|---|---|---|
| U1: Newsletter capture section | Homepage + Reviews | S (2 days) | Long-term audience ownership |
| U2: Pricing filter on category pages | 11 category pages | S (2 days) | UX — reduces bounce on pricing mismatch |
| U3: "Editor's Pick" / "Best Overall" badge | Category top-rated | XS (half day) | Trust + conversion on category |
| U4: Feature comparison table on compare pages | 439 compare pages | M (3-4 days) | Engagement + SEO depth |
| U5: "Best of [Category]" editorial pages | 11 new pages | L (5-7 days) | SEO — targets "best X software" queries |
| U6: Add icons to CategoryCard | Homepage + Category index | XS (1 day) | Visual differentiation |

---

## LOW ROI — Do Third (Polish)

| Task | Pages affected | Effort | Impact |
|---|---|---|---|
| V1: Hero gradient/background treatment | Homepage | S | Visual identity |
| V2: Custom display font (H1 only) | Global | XS | Brand differentiation |
| V3: Sponsored tool listings feature | Homepage + Category | M | Revenue (B2B) |
| V4: "Vote" / "Upvote" on compare pages | Compare | M | Social engagement |
| V5: Display ads (Carbon Ads) | Global | XS | Revenue (small) |

---

## PHASE 1 — Revenue Foundation (Week 1-2)

**Theme:** Zero-cost revenue unlock. No new pages, no redesign. Only small code changes with immediate payoff.

**Tasks:**

### M1 — Affiliate URL System
**Files:** `src/data/tools.json`, `src/pages/go/[slug].astro`

Add `affiliateUrl` field to the top 30 affiliate-eligible tools in tools.json:
```json
{
  "slug": "convertkit",
  "affiliateUrl": "https://partners.convertkit.com/yourref"
}
```

Update `/go/[slug].astro` (5-line change):
```javascript
const dest = (tool.affiliate && tool.affiliateUrl) ? tool.affiliateUrl : tool.website;
```

**Target tools for Week 1:** ConvertKit, Beehiiv, Kinsta, WP Engine, Hostinger, Jasper, HubSpot, ActiveCampaign, Fathom, Circle, Skool, Lemon Squeezy, GetResponse, Systeme.io, ClickFunnels, SiteGround, Bluehost, ClickUp, Mailchimp, Cloudflare

**Effort:** 1 day (signing up for programs + data entry)

---

### M2 — Compare Page CTAs
**File:** `src/pages/compare/[pair].astro`

Add two CTA buttons after the comparison summary/winner section:

```astro
<div class="compare-cta-row">
  <a href={`/go/${toolA.slug}`} class="compare-cta-a">
    Try {toolA.name} {aIsFree ? "Free" : "→"}
  </a>
  <a href={`/go/${toolB.slug}`} class="compare-cta-b">
    Try {toolB.name} {bIsFree ? "Free" : "→"}
  </a>
</div>
```

Style: two side-by-side buttons aligned with the comparison columns. ToolA button = blue; ToolB button = outlined.

**Effort:** Half day

---

### M3 — AltCard Affiliate CTA
**File:** `src/components/AltCard.astro`

Add "Try [Tool]" button alongside "Read Review":

```astro
<div class="alt-actions">
  <a href={`/go/${tool.slug}`} class="try-btn" target="_blank" rel="noopener">
    Try {tool.pricing === "Free" || tool.pricing === "Freemium" ? "Free " : ""}→
  </a>
  <span class="alt-btn">Read Review →</span>
</div>
```

**Effort:** Half day

---

### M4 — AltCard Compare Link
**File:** `src/components/AltCard.astro` + `src/pages/alternatives/[slug].astro`

Pass `currentToolSlug` to AltCard. Add compare link:

```astro
<!-- In AltCard, when currentSlug is available -->
<a href={`/compare/${[currentSlug, tool.slug].sort().join("-vs-")}`} class="compare-link">
  Compare →
</a>
```

**Effort:** Half day

---

### M5 — ToolCard startingPrice
**File:** `src/components/ToolCard.astro`

Replace pricing tier text with actual price when available:

```astro
<span class="tool-pricing">
  {tool.startingPrice ? tool.startingPrice : tool.pricing}
</span>
```

**Effort:** 30 minutes

---

### M6 — Affiliate Disclosure
**File:** `src/layouts/MainLayout.astro` (footer), `src/pages/reviews/[slug].astro`

Add to footer:
```
This site contains affiliate links. We may earn a commission when you click through and make a purchase — at no extra cost to you. Learn more.
```

Add `rel="sponsored noopener"` to all `/go/` links.

**Effort:** 2 hours

---

**Phase 1 deliverables:**
- Affiliate revenue active on 20+ tools
- Compare pages monetized (439 pages now have CTAs)
- AltCard has dual "Compare" + "Try" actions
- ToolCard shows actual pricing
- FTC compliant disclosure

**Phase 1 success metric:** First affiliate commission within 30 days.

---

## PHASE 2 — Conversion & Content (Week 3-6)

**Theme:** Drive more decisions. Convert browsers into affiliate clicks. Add high-SEO-value editorial content.

### U1 — Newsletter Capture
**Files:** `src/layouts/MainLayout.astro` or new `NewsletterCapture.astro` component

**Placement:**
1. Homepage — between "Most Compared" and "Browse by Use Case" sections
2. Review pages — between "Verdict" and "Alternatives" sections

**Component:**
```astro
<section class="newsletter-section">
  <h3>Get Weekly Tool Picks</h3>
  <p>We review 2-3 tools per week. Get the best ones in your inbox.</p>
  <form action="[beehiiv-form-url]" method="POST" class="nl-form">
    <input type="email" name="email" placeholder="you@company.com" required />
    <button type="submit">Subscribe Free →</button>
  </form>
  <p class="nl-note">No spam. Unsubscribe anytime.</p>
</section>
```

**Tool:** Beehiiv (free plan, 2,500 subscribers) or ConvertKit.

**Effort:** 2 days (setup + integration + styling)

---

### U2 — Category Pricing Filter
**File:** `src/pages/category/[slug].astro`

Add filter tabs at the top of the tool grid:
```
[All Tools] [Free & Freemium] [Paid]
```

Client-side JS shows/hides cards based on `tool.pricing` value. No server-side changes needed.

**Effort:** 2 days

---

### U3 — Editor's Pick Badge
**File:** `src/pages/category/[slug].astro`

The top-rated tool in each category gets an "Editor's Pick" badge overlaid on its card:
```astro
{topRated[0] && (
  <div class="pick-label">Editor's Pick</div>
)}
```

**Effort:** Half day

---

### U4 — Compare Page Feature Table
**File:** `src/pages/compare/[pair].astro`

Add a feature comparison table using existing tool data:

| Feature | ToolA | ToolB |
|---|---|---|
| Starting Price | $X/mo | $Y/mo |
| Free Plan | ✓ | ✗ |
| Rating | ★ 4.8 | ★ 4.5 |
| Category | Marketing | Marketing |

Pull from `tool.pricing`, `tool.startingPrice`, `tool.rating`. No new data needed.

**Effort:** 3-4 days (table design + responsive layout)

---

### U5 — "Best of [Category]" Editorial Pages
**Files:** New `src/pages/best/[category].astro` or static pages

11 editorial pages targeting queries like:
- `/best/email-marketing` → "Best Email Marketing Tools 2026"
- `/best/project-management` → "Best Project Management Software 2026"
- `/best/community-platform` → "Best Community Platforms 2026"

Each page: editorial intro (200w), top 5 ranked tools with review excerpts, comparison table, affiliate CTAs per tool.

**SEO target:** "best [category] software 2026" — commercial intent, 5K-30K monthly searches per query.

**Effort:** 5-7 days (template + content for 11 pages)

---

**Phase 2 deliverables:**
- Email list started (goal: 500 subscribers in 60 days)
- Category pages have pricing filter
- Compare pages have feature table
- 11 editorial "best of" pages targeting high-volume queries

**Phase 2 success metric:** Email list growing; compare page CTR to /go/ above 5%; "best of" pages indexed in Google.

---

## PHASE 3 — Authority & Scale (Week 7-12)

**Theme:** Build compounding channels. Position Zotopie as the authority source for tool decisions.

### V1 — Visual Identity Upgrade
- Homepage hero: subtle gradient or dot-grid background (CSS only, no images)
- Custom display font for H1 (Google Fonts: Inter, Sora, or DM Sans — already system-adjacent)
- Category cards: emoji + color accent per category
- Consistent "badge" system: Editor's Pick, Free Plan, New, Most Compared

**Effort:** 3-5 days

---

### V2 — Sponsored Tool Listings (B2B Revenue)
**Data:** Add `sponsored: true` + `sponsoredCopy: "..."` to tools.json
**UI:** Sponsored badge on ToolCard; sponsored tools slot into position 1-2 of category grids with clear label

Rate card (example):
- Category featured: $150/mo
- Homepage featured: $300/mo
- Newsletter inclusion: $75/issue

**Effort:** 2 days (implementation); ongoing (sales outreach)

---

### V3 — "Compare All" Tool on Category Pages
Each category page gets a "Compare Tools" interactive widget:
- User selects 2 tools from the category
- Page navigates to the existing `/compare/[pair]` URL

No new data needed — uses existing 439 compare pages.

**Effort:** 2 days (JS UI widget)

---

### V4 — User Preference / "Which tool do you use?" Signal
On compare pages, add:
```
Which tool do you prefer?
[I use ToolA] [I use ToolB] [I tried both]
```
Stores response in localStorage; aggregate counts shown ("47% prefer ToolA").
No backend needed — purely client-side localStorage aggregation per pair.

**Effort:** 2 days

---

**Phase 3 success metric:** 3 sponsored tool slots filled; 1,500+ email subscribers; 5+ "best of" pages ranking page 1 on Google.

---

## Unified 90-Day Calendar

| Week | Focus | Tasks |
|---|---|---|
| 1 | Revenue unlock | M1 (affiliates), M2 (compare CTAs), M3 (AltCard CTA) |
| 2 | Revenue unlock | M4 (compare links), M5 (price in cards), M6 (disclosure) |
| 3-4 | Conversion | U1 (newsletter), U2 (pricing filter), U3 (editor pick) |
| 5-6 | Content | U4 (compare table), U5 (best-of pages, batch 1: 5 pages) |
| 7-8 | Content | U5 (best-of pages, batch 2: 6 pages) |
| 9-10 | Visual | V1 (visual upgrade), V2 (sponsored listings) |
| 11-12 | Scale | V3 (compare widget), V4 (preference signal), sponsored outreach |

---

## Success KPIs at 90 Days

| Metric | Target |
|---|---|
| Affiliate revenue | $200-500/mo |
| Email subscribers | 500+ |
| Compare page click-through to /go/ | >5% |
| "Best of" pages indexed | 11/11 |
| Sponsored tool slots | 2+ |
| Monthly unique visitors | +50% from baseline |

---

## Decision: What to Build First

**The answer is unambiguous: M1 + M2 + M3 in parallel, this week.**

Reasons:
1. They affect pages that already exist (no new builds)
2. Combined effort: under 3 days total
3. Compare pages (439 pages) have the highest commercial intent on the site — zero revenue today
4. Every day without affiliate links is lost commissions from existing traffic

The newsletter, best-of pages, and visual upgrade are all multiplicative on traffic — they require more visitors to show ROI. The affiliate infrastructure multiplies on what you already have.

**Start with the revenue, then build the traffic.**

---

*Generated: 2026-06-13 | Task: E1-MONETIZATION-AND-UI*
