# Zotopie Deployment Guide

## Architecture

```
GitHub (kanm1109/zotopie)
       ↓  push to main
Cloudflare Pages (auto-build)
       ↓
https://zotopie.com
```

## One-Time Setup

### 1. Connect GitHub to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Pages** → **Create a project**
2. Select **Connect to Git** → authorize GitHub → select `kanm1109/zotopie`
3. Configure build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** `24`
4. Click **Save and Deploy**

### 2. Add Custom Domain

1. In Cloudflare Pages project → **Custom domains** → **Set up a custom domain**
2. Enter `zotopie.com`
3. Add these DNS records in Cloudflare DNS:
   ```
   Type: CNAME
   Name: @  (or zotopie.com)
   Target: <your-pages-project>.pages.dev
   Proxy: ON (orange cloud)

   Type: CNAME
   Name: www
   Target: zotopie.com
   Proxy: ON
   ```

### 3. GitHub Actions Secrets (for manual/CI deploy)

Add these secrets in `GitHub → Settings → Secrets and variables → Actions`:

| Secret | Where to find |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard → My Profile → API Tokens → Create Token (use "Edit Cloudflare Workers" template) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → Right sidebar → Account ID |

## Auto-Deployment Flow

### How it works

Every time you push to `main`, Cloudflare Pages automatically:
1. Detects the push via GitHub webhook
2. Pulls the latest code
3. Runs `npm run build`
4. Deploys the `dist/` folder globally

**No manual steps needed after initial setup.**

### Publishing a New Article

```bash
# 1. Create the markdown file
# Example: src/content/reddit/my-new-article.md

# 2. Add to git and commit
git add src/content/reddit/my-new-article.md
git commit -m "publish: My New Article Title"

# 3. Push to GitHub
git push origin main

# 4. Cloudflare Pages auto-builds (usually 1-2 minutes)
# Monitor at: https://dash.cloudflare.com → Pages → zotopie → Deployments
```

### Preview Deployments

Every PR to `main` creates an automatic preview URL:
```
https://<branch-name>.<project>.pages.dev
```

## Environment Variables

No environment variables are required for static builds. If you add server-side features later:

| Variable | Purpose | Where to set |
|---|---|---|
| `PUBLIC_SITE_URL` | Override site URL | Cloudflare Pages Environment Variables |

## Verify Deployment

After each deploy, check:

- [ ] `https://zotopie.com` loads the homepage
- [ ] `https://zotopie.com/sitemap-index.xml` returns XML
- [ ] `https://zotopie.com/robots.txt` returns correct content
- [ ] `https://zotopie.com/rss.xml` returns valid RSS
- [ ] New article URL resolves correctly

## Google Search Console Setup

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property → URL prefix → `https://zotopie.com`
3. Verify via HTML tag (add to `BaseHead.astro`) or DNS TXT record
4. Submit sitemap: `https://zotopie.com/sitemap-index.xml`

## Cloudflare Analytics

Enable in Cloudflare Dashboard → Pages project → Analytics. No code changes needed — Cloudflare injects the beacon automatically.

For Google Analytics 4, add your `G-XXXXXXXX` measurement ID to `BaseHead.astro`:

```html
<!-- Add before </head> in src/components/BaseHead.astro -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXX');
</script>
```

## Content Collections

| URL | Content folder | Schema fields |
|---|---|---|
| `/blog/` | `src/content/blog/` | title, description, publishDate, author, tags, category |
| `/reddit/` | `src/content/reddit/` | Same as blog |
| `/threads/` | `src/content/threads/` | Same as blog |
| `/extensions/` | `src/content/extensions/` | Same as blog |
| `/marketing/` | `src/content/marketing/` | Same as blog |

Use `ARTICLE_TEMPLATE.md` as the starting point for all new articles.

## Troubleshooting

**Build fails with "Cannot find module"**
→ Run `npm ci` locally to verify dependencies install cleanly.

**Images not loading**
→ Place images in `src/assets/` and reference with a relative path from the markdown file.

**Sitemap not updating**
→ The sitemap auto-generates on build. Redeploy after adding new content.

**DNS not propagating**
→ DNS changes can take up to 24-48 hours. Use `dig zotopie.com` to check propagation.
