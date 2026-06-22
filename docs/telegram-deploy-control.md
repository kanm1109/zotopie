# Telegram Deploy Control — Architecture

**Version:** 2.0 (D-064)  
**Status:** Live

---

## Overview

Founder can trigger production deployments directly from Telegram with a 2-step confirmation flow. No GitHub or Cloudflare dashboard access required.

---

## New Buttons (v2)

| Button | Action |
|--------|--------|
| 🩺 Health | Live HTTP checks against 5 production URLs |
| 🚀 Deploy | Trigger production deploy with confirmation |

Full keyboard (6 buttons):
```
[📊 Status]        [🚀 Deployments]
[📋 Pending Tasks] [✅ Waiting Approval]
[🩺 Health]        [🚀 Deploy]
```

---

## Feature 1 — Health Check

Checks 5 production URLs in parallel via `fetch HEAD`:

```
https://zotopie.com/
https://zotopie.com/reviews/
https://zotopie.com/alternatives/
https://zotopie.com/compare/
https://zotopie.com/best/
```

Response format:
```
🩺 ZOTOPIE HEALTH

Homepage ............. 200 ✅
Reviews Hub .......... 200 ✅
Alternatives Hub ..... 200 ✅
Compare Hub .......... 200 ✅
Best Hub ............. 200 ✅

Overall Status:
🟢 HEALTHY
```

---

## Feature 2 — Deploy Flow

```
Founder taps 🚀 Deploy
       │
       ▼
Bot fetches latest commit from GitHub
       │
       ▼
Confirmation screen with inline keyboard:
  [✅ Confirm Deploy]  [❌ Cancel]
       │
  ┌────┴────┐
Cancel    Confirm
  │          │
  ▼          ▼
Cancelled  POST → Cloudflare Pages Deploy Hook
           │
           ▼
       "🚀 Deployment Started · commit"
           │
           ▼  (background cron every 1 min)
       Poll production health checks
           │
           ▼  (all 200)
       "✅ Deployment Success + Post-Deploy Verification"
```

---

## Deploy Mechanism — Option A: Cloudflare Pages Deploy Hook

**Chosen over Option B (GitHub Actions workflow_dispatch) because:**
- Single HTTP POST — no GitHub token required
- Purpose-built for triggering Cloudflare Pages rebuilds
- Zero additional dependencies
- Hook URL is the authentication token

**How it works:**  
POST to deploy hook URL → Cloudflare Pages rebuilds from latest `main` commit → site goes live in ~3–5 min.

---

## Post-Deploy Verification

Uses Cloudflare Worker **Cron Trigger** (`* * * * *` — every 1 minute):

1. Deploy triggered → `DEPLOY_PENDING` stored in KV with `{commit, startTime}`
2. Each cron tick checks if `DEPLOY_PENDING` exists
3. Waits minimum 3 minutes before first check
4. Runs health checks — if all pass, sends success + verification report and clears `DEPLOY_PENDING`
5. Timeout after 10 minutes → sends warning and clears pending state

---

## Security

- Only `FOUNDER_CHAT_ID` can trigger deploy buttons
- `✅ Confirm Deploy` callback validates chat ID server-side
- Deploy hook URL stored as encrypted Worker secret (`DEPLOY_HOOK_URL`)
- All protected API endpoints require `X-Bot-Secret` header

---

## New Secret

| Secret | Where | Purpose |
|--------|-------|---------|
| `DEPLOY_HOOK_URL` | Cloudflare Worker | Cloudflare Pages deploy hook URL |

---

## Worker Version

| Version | Changes |
|---------|---------|
| v1 (D-063) | Status, Deployments, Pending Tasks, Waiting Approval |
| v2 (D-064) | + Health, + Deploy with confirmation + Post-deploy cron verification |
