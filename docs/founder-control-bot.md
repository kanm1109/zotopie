# Zotopie Founder Control Bot — Architecture

**Version:** 1.0
**Status:** Live

---

## Purpose

Give the founder real-time visibility into project state from Telegram — no dashboards, no logins, no monthly cost.

---

## Phase 1 Architecture

```
GitHub push (main)
       │
       ├──▶ Cloudflare Pages (auto-deploys site)
       │
       └──▶ GitHub Actions: telegram-notify.yml
                   │
                   │  POST /deploy
                   ▼
         Cloudflare Worker (zotopie-founder-bot)
                   │
                   ├── Reads/writes: Cloudflare KV (BOT_KV)
                   │
                   └──▶ Telegram Bot API
                              │
                              ▼
                         Founder (Telegram)
```

```
Founder taps button
       │
       ▼
  Telegram server
       │
  POST /webhook
       │
       ▼
 Cloudflare Worker
       │
       ├── GitHub API  (latest commit)
       ├── Cloudflare KV  (deploy history, tasks)
       │
       └──▶ Telegram message back to Founder
```

---

## Components

### 1. Cloudflare Worker

**File:** `workers/founder-bot/src/index.js`

**URL:** `https://zotopie-founder-bot.<subdomain>.workers.dev`

**Endpoints:**

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/webhook` | Telegram signature | Receives button taps from Telegram |
| POST | `/deploy` | `X-Bot-Secret` | GitHub Actions deploy notification |
| POST | `/task-complete` | `X-Bot-Secret` | D marks task complete |
| POST | `/seed` | `X-Bot-Secret` | One-time KV initialization |
| GET | `/` | None | Health check |

### 2. Cloudflare KV (BOT_KV)

| Key | Type | Content |
|-----|------|---------|
| `LAST_DEPLOY` | Object | Latest deployment record |
| `DEPLOY_HISTORY` | Array | Last 20 deployments |
| `PENDING_TASKS` | Array | Current sprint task list |
| `WAITING_APPROVAL` | Array | Tasks complete, not yet deployed |

### 3. GitHub Actions

**File:** `.github/workflows/telegram-notify.yml`

Triggers on every push to `main`. Waits ~4 min for Cloudflare Pages to build, verifies site is up, then POSTs to Worker.

### 4. Telegram Bot

Persistent reply keyboard with 4 buttons. Bot is private — only responds to `FOUNDER_CHAT_ID`.

---

## Secrets

| Secret | Where set | Purpose |
|--------|-----------|---------|
| `BOT_TOKEN` | `wrangler secret put` | Telegram bot token |
| `FOUNDER_CHAT_ID` | `wrangler secret put` | Founder's chat ID |
| `BOT_SECRET` | `wrangler secret put` + GitHub Actions secret | Shared auth token for protected endpoints |
| `BOT_WORKER_URL` | GitHub Actions secret | Worker base URL |

---

## Bot Buttons (Phase 1)

| Button | Response |
|--------|----------|
| 📊 Status | Latest commit, last deploy, pending count, sync status |
| 🚀 Deployments | Last 5 deployments with status and timestamp |
| 📋 Pending Tasks | Current sprint backlog |
| ✅ Waiting Approval | Tasks complete but not yet approved/deployed |

---

## Phase 2 — Design Only (Not Implemented)

Future capability: Founder controls deployment from Telegram.

```
Founder taps [✅ Approve] or [❌ Reject]
       │
       ▼
  Telegram bot
       │
  POST /approve or /reject  (Worker)
       │
       ├── [Approve] → GitHub API: merge PR / trigger deploy workflow
       ├── [Reject]  → GitHub API: close PR / post comment
       │
       ▼
  Cloudflare Pages deploy (if approved)
       │
       ▼
  Telegram: "🚀 Deployed"
```

**Future buttons:**

| Button | Action |
|--------|--------|
| ✅ Approve | Merge PR + trigger Cloudflare Pages deploy |
| ❌ Reject | Close PR + notify assignee |
| 🚀 Deploy | Force deploy current main branch |

**Requirements for Phase 2:**
- GitHub Personal Access Token with `repo` scope (stored as Worker secret)
- GitHub PRs used instead of direct pushes to main
- Cloudflare Pages deploy hook URL for manual trigger

**Implementation effort:** ~4 hours. Zero additional cost (GitHub API is free for public repos).

---

## Cost

| Component | Cost |
|-----------|------|
| Cloudflare Worker | Free (100k requests/day) |
| Cloudflare KV | Free (100k reads/day, 1k writes/day) |
| Telegram Bot | Free |
| GitHub Actions | Free (2000 min/month on free plan) |
| **Total** | **$0/month** |
