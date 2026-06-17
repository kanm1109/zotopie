# E2 Visual Upgrade — Release Notes

**Version:** E2-VISUAL-UPGRADE  
**Commit:** `818fbf5`  
**Branch:** main  
**Deploy:** Cloudflare Pages (auto)  
**Date:** 2026-06-13  

---

## What Changed

### Global
- System font stack replaces Arial — text renders crisper on Mac, Windows, and Android
- Frosted-glass navigation bar with subtle shadow
- "Zotopie" logo now uses blue→purple gradient text
- Smooth scroll enabled sitewide
- Card border-radius upgraded to 14px across all components

### Tool Cards (appear on every section)
- Free and Freemium tools show green pricing badge
- Paid tools show gray pricing badge
- Rating badge: amber pill with gold star, amber border
- "View Review" → blue pill CTA that fills on hover
- Hover: card lifts 2px + blue gradient bar appears at top
- Description clamped to 2 lines for consistent card height

### Alternative Cards
- Hover shadow upgraded; card lifts 1px on hover
- Border color on hover: softer blue (#93c5fd)

### Homepage
- New "Software Directory" eyebrow badge above headline
- "Best" keyword in h1 uses gradient text (blue→purple)
- Subtle radial gradient behind hero section
- Section h2 titles have left accent bar
- "See all" links upgraded to pill buttons
- Category chips have shadow + glow on hover
- CTA section uses multi-stop gradient background
- Primary button: gradient fill + lift shadow

### Compare Pages (439 pages)
- Winner badge: gold gradient (amber) instead of plain blue
- Winner tool card: amber-tinted background, gold border
- Comparison table: zebra stripes, rounded border, hover highlight
- Winner column: amber tint
- Section headings have left accent bars
- Verdict box: amber gradient, 32px padding, stronger primary CTA

### Category Pages (11 pages)
- Hero section: 3px blue→purple accent bar at top
- Stats displayed in bordered card block
- Section h2 titles have left accent bars
- Filter tabs → macOS-style segmented control
- #1 ranked card: gold gradient background + border
- Rank badges: gold (#1), silver (#2), bronze (#3) pill shapes

---

## No Changes To
- URLs, routes, slugs
- SEO metadata, JSON-LD, sitemaps
- Data files (tools.json, alternatives.json, etc.)
- Page count: still 839
- Revenue / affiliate infrastructure (unchanged from E1-Phase1)
- JavaScript behavior (autocomplete, filter tabs, FAQ accordion)
