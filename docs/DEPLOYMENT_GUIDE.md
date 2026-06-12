# DEPLOYMENT GUIDE — Zotopie

**Date:** 2026-06-12  
**Role:** Release Engineer  
**Source:** D1-PRE-DEPLOY-VALIDATION (see `docs/PRE_DEPLOY_CHECKLIST.md`)  
**Target:** Cloudflare Pages → `https://zotopie.com`

---

## Quick Reference

| Item | Value |
|---|---|
| Git repository | `https://github.com/kanm1109/zotopie.git` |
| Production branch | `main` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js version | `22` |
| Site URL | `https://zotopie.com` |
| Required env vars | `NODE_VERSION = 22` (1 var only) |

---

## PART 1 — Cloudflare Pages Setup

### Step 1.1 — Connect GitHub Repository

1. Go to [https://dash.cloudflare.com](https://dash.cloudflare.com) → log in
2. In the left sidebar: **Workers & Pages** → **Pages**
3. Click **Create a project** → **Connect to Git**
4. Authorize Cloudflare to access your GitHub account if prompted
5. Search for and select: **`kanm1109/zotopie`**
6. Click **Begin setup**

---

### Step 1.2 — Build Settings

On the "Set up builds and deployments" screen, enter these exact values:

| Field | Value |
|---|---|
| **Project name** | `zotopie` |
| **Production branch** | `main` |
| **Framework preset** | `Astro` *(select from dropdown)* |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | *(leave blank — project is at repo root)* |

> **Why `npm run build` and not `astro build`?**  
> `npm run build` triggers the `prebuild` hook first (`node scripts/merge-data.mjs`), which regenerates `tools-enriched.json` and `icon-data.json` from source data. Skipping this would deploy stale generated files.

---

### Step 1.3 — Environment Variables

On the same setup screen, click **Environment variables (advanced)** and add:

| Variable name | Value | Environment |
|---|---|---|
| `NODE_VERSION` | `22` | Production + Preview |

> **Why NODE_VERSION = 22?**  
> `astro@6.4.4` requires Node.js `>=22.12.0` (confirmed from astro's own `engines` field). Cloudflare Pages defaults to an older Node.js version. Without this variable, builds will fail immediately. Node.js 22 is the minimum compatible LTS version.

**No other environment variables are required.** The project has no API keys, secrets, or `.env` dependencies.

To add the variable:
1. Click **Add variable**
2. Name: `NODE_VERSION`
3. Value: `22`
4. Click the scope dropdown → select **Production and preview**
5. Click **Save and deploy**

---

### Step 1.4 — First Deploy

1. Click **Save and deploy**
2. Cloudflare will clone the repo, run `npm run build`, and deploy `dist/` to their edge network
3. Watch the build log — a successful build ends with:
   ```
   ✓ Completed in X.XXs.
   ```
4. After deploy: your site will be live at `https://zotopie.pages.dev` (temporary URL)

**Expected build time:** 60–120 seconds

**If build fails:** See Part 6 (Rollback & Troubleshooting).

---

## PART 2 — Custom Domain Setup

### Step 2.1 — Add Custom Domain in Cloudflare Pages

1. In your Pages project → **Custom domains** tab
2. Click **Set up a custom domain**
3. Enter: `zotopie.com`
4. Click **Continue**
5. Repeat for: `www.zotopie.com` (optional — handled by `_redirects` but add for completeness)

---

### Step 2.2 — DNS Requirements

**If your domain registrar is Cloudflare (recommended):**

Cloudflare will automatically add the required CNAME records. No manual DNS changes needed.

**If your domain is registered elsewhere (Namecheap, GoDaddy, etc.):**

Add these DNS records at your registrar:

| Type | Name | Value | Proxy |
|---|---|---|---|
| `CNAME` | `zotopie.com` | `zotopie.pages.dev` | Yes (orange cloud) |
| `CNAME` | `www` | `zotopie.pages.dev` | Yes (orange cloud) |

> **Note:** Some registrars do not support CNAME on the root domain (`@`). In that case, use an `A` record pointing to Cloudflare's IP, or transfer the domain to Cloudflare for full compatibility.

**Propagation time:** 5 minutes (Cloudflare DNS) to 24 hours (other registrars).

---

### Step 2.3 — SSL/TLS (Automatic)

Cloudflare Pages automatically provisions a free SSL certificate for all custom domains.  
No configuration required. HTTPS is enabled by default.

The `public/_redirects` file already handles HTTP → HTTPS redirects:

```
https://www.zotopie.com/*  https://zotopie.com/:splat  301
http://zotopie.com/*       https://zotopie.com/:splat  301
http://www.zotopie.com/*   https://zotopie.com/:splat  301
```

---

## PART 3 — Verify Deployment

After the domain is live, check each URL manually:

| URL | Expected result |
|---|---|
| `https://zotopie.com/` | Homepage loads |
| `https://zotopie.com/reviews/ahrefs/` | Ahrefs review page loads |
| `https://zotopie.com/category/seo-search/` | SEO category page loads |
| `https://zotopie.com/sitemap-index.xml` | XML sitemap loads |
| `https://zotopie.com/robots.txt` | robots.txt loads |
| `https://zotopie.com/go/ahrefs/` | Redirects to Ahrefs website (affiliate link) |
| `https://www.zotopie.com/` | Redirects to `https://zotopie.com/` (301) |
| `https://zotopie.com/nonexistent-page/` | Shows custom 404 page |

**Verify security headers are active:**

Open browser DevTools → Network tab → click any page → Response Headers.  
Confirm these headers are present:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

---

## PART 4 — Google Search Console Submission

### Step 4.1 — Verify Domain Ownership

A Google Search Console verification file already exists in the project:

**File:** `public/google701d569ec51e922b.html`  
**Live URL after deploy:** `https://zotopie.com/google701d569ec51e922b.html`

If the property is already created in Search Console, verify using this file:

1. Go to [https://search.google.com/search-console](https://search.google.com/search-console)
2. Add property → **URL prefix** → enter `https://zotopie.com`
3. Under "HTML file" verification method, confirm the file name matches
4. Click **Verify**

> If you need to create a new property, choose **Domain** property instead for broader coverage. This requires adding a DNS TXT record.

---

### Step 4.2 — Submit Sitemaps

1. In Search Console → left sidebar → **Sitemaps**
2. Add sitemap URL: `sitemap-index.xml` → click **Submit**
3. Add sitemap URL: `sitemap.xml` → click **Submit**

The build generates these files at:
- `https://zotopie.com/sitemap-index.xml`
- `https://zotopie.com/sitemap-0.xml`

**Expected sitemap coverage:** 119 review pages + 11 category pages + static pages ≈ 250+ URLs.  
Pages under `/go/` are excluded (disallowed in `robots.txt`).

---

### Step 4.3 — Request Indexing for Key Pages

After sitemap submission, manually request indexing for the most important pages:

1. In Search Console → top search bar → enter URL → press Enter
2. Click **Request indexing**

Priority pages to submit manually:

```
https://zotopie.com/
https://zotopie.com/reviews/
https://zotopie.com/category/seo-search/
https://zotopie.com/category/social-media-management/
https://zotopie.com/category/workflow-automation/
https://zotopie.com/reviews/ahrefs/
https://zotopie.com/reviews/semrush/
https://zotopie.com/reviews/zapier/
```

> **Timeline:** Manual index requests take 1–7 days. Full sitemap crawl takes 2–4 weeks.

---

## PART 5 — Analytics Setup

### Current state

The project has **built-in click tracking** via localStorage:
- `/go/[slug].astro` records each affiliate redirect click in browser localStorage
- `/stats` page at `https://zotopie.com/stats` displays click counts per tool
- This is client-side only — data does not persist across devices or browsers

**No external analytics tool is currently installed.**

---

### Recommended: Cloudflare Web Analytics (Free, Privacy-Safe)

Cloudflare Web Analytics is free, requires no cookies, and does not require GDPR consent banners.

**Setup:**

1. Cloudflare dashboard → **Analytics & Logs** → **Web Analytics**
2. Click **Add a site**
3. Enter `zotopie.com`
4. Copy the JS snippet (looks like this):
   ```html
   <script defer src='https://static.cloudflareinsights.com/beacon.min.js'
     data-cf-beacon='{"token": "YOUR_TOKEN_HERE"}'></script>
   ```
5. In VS Code, open `src/layouts/MainLayout.astro`
6. Paste the snippet just before the closing `</head>` tag
7. Commit and push to `main` — Cloudflare Pages will auto-deploy

**What it tracks:** Page views, top pages, referrers, countries, devices. No personal data collected.

---

### Alternative: Plausible Analytics

If you prefer self-hosted or more detailed analytics:

1. Sign up at [https://plausible.io](https://plausible.io)
2. Add site: `zotopie.com`
3. Add script to `src/layouts/MainLayout.astro` before `</head>`:
   ```html
   <script defer data-domain="zotopie.com"
     src="https://plausible.io/js/script.js"></script>
   ```
4. Commit → push → done

---

## PART 6 — Git Branch Strategy

### Production deploys

Cloudflare Pages auto-deploys on every push to `main`.

```
push to main → Cloudflare builds → deploys to https://zotopie.com
```

### Preview deploys

Every pull request or push to any other branch creates a **Preview deployment** at a unique URL like `https://abc123.zotopie.pages.dev`. These do not affect production.

### Recommended branch strategy

```
main          ← production (auto-deploys to zotopie.com)
content/p2    ← content generation batches (PR → merge when ready)
feature/xyz   ← new features (PR → review → merge)
fix/bug-name  ← hotfixes (PR → merge → verify on production)
```

**For content updates** (adding overviews, pros, cons to `tools.json`):
1. Create branch: `git checkout -b content/p2-content-ai`
2. Edit `src/data/tools.json`
3. Run `node scripts/merge-data.mjs` locally to regenerate `src/data/generated/`
4. Commit both `tools.json` and `src/data/generated/tools-enriched.json`
5. Push → open PR → merge to `main`

**For code changes** (templates, scripts, styles):
1. Create branch: `git checkout -b feature/my-feature`
2. Make changes
3. Push → open PR → test on preview URL → merge to `main`

---

## PART 7 — Rollback Procedure

### Method A — Revert to previous deployment (fastest, no git needed)

1. Cloudflare Pages dashboard → your project → **Deployments** tab
2. Find the last known-good deployment in the list
3. Click the **three dots (···)** menu next to it
4. Click **Rollback to this deployment**
5. Confirm — the previous build goes live in ~30 seconds

> This does NOT change git history. It just re-promotes an older build to production.

---

### Method B — Git revert (for permanent rollback)

If a bad commit was merged and you want to remove it from history:

```bash
# Find the commit to revert
git log --oneline -10

# Revert the bad commit (creates a new undo commit)
git revert <commit-hash>

# Push — Cloudflare auto-deploys the revert
git push origin main
```

> Use `git revert`, not `git reset --hard`. Revert creates a new commit; reset rewrites history and can cause issues with Cloudflare's deploy cache.

---

### Method C — Rollback generated data only

If `tools-enriched.json` was regenerated with bad data:

```bash
# Restore tools-enriched.json to the previous committed version
git checkout HEAD~1 -- src/data/generated/tools-enriched.json
git checkout HEAD~1 -- src/data/generated/icon-data.json
git commit -m "revert: restore generated data to previous version"
git push origin main
```

---

## PART 8 — Post-Deploy Monitoring Checklist

Run these checks after every production deploy:

| Check | How |
|---|---|
| Homepage loads | Open `https://zotopie.com/` in incognito |
| A review page loads | Open `https://zotopie.com/reviews/ahrefs/` |
| A category page loads | Open `https://zotopie.com/category/seo-search/` |
| Sitemap accessible | Open `https://zotopie.com/sitemap-index.xml` |
| robots.txt correct | Open `https://zotopie.com/robots.txt` |
| Affiliate redirect works | Visit `https://zotopie.com/go/ahrefs/` — should redirect to ahrefs.com |
| No console errors | DevTools → Console tab — check for red errors |
| Security headers present | DevTools → Network → any page → Response Headers |
| Build log clean | Cloudflare Pages → Deployments → latest → View build log |

---

## PART 9 — Ongoing Deploy Workflow

For each content or code update after initial launch:

```
1. Make changes locally (tools.json, templates, etc.)
2. Run: node scripts/merge-data.mjs      ← regenerate generated files
3. Run: npm run build                    ← verify build passes locally
4. git add src/data/tools.json src/data/generated/
5. git commit -m "content: add P2 content-ai-creation"
6. git push origin main
7. Cloudflare auto-deploys in ~60 seconds
8. Verify on https://zotopie.com/
```

**Local build requirements:**
- Node.js ≥18.0.0 (local: v24.11.1 via nvm ✓)
- `npm install` must have been run at least once
- No `.env` file needed

---

## Appendix — Key File Locations

| File | Purpose |
|---|---|
| `package.json` | Build scripts, dependencies |
| `astro.config.mjs` | Site URL, integrations, fonts |
| `src/data/tools.json` | Source of truth — all 119 tools |
| `src/data/generated/tools-enriched.json` | Merged output — what pages actually render |
| `scripts/merge-data.mjs` | Merge pipeline — run before each commit |
| `public/_headers` | Cloudflare security headers + cache policies |
| `public/_redirects` | www→apex, HTTP→HTTPS redirects |
| `public/robots.txt` | Crawler rules |
| `public/google701d569ec51e922b.html` | Google Search Console verification |
| `docs/PRE_DEPLOY_CHECKLIST.md` | Validation results before this deploy |
| `docs/CONTENT_ROADMAP.md` | Content generation backlog (P2/P3) |

---

*Generated: 2026-06-12 | Task: D2-DEPLOY-EXECUTION*
