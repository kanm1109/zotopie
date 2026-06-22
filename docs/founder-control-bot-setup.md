# Founder Control Bot — Setup Guide

**Version:** 1.0  
**Time required:** ~30 minutes  
**Cost:** $0

---

## Prerequisites

- Node.js 18+ installed
- `wrangler` CLI installed globally (`npm i -g wrangler`)
- Telegram account (for the founder)
- Cloudflare account (already used for Pages)
- GitHub account with access to `kanm1109/zotopie`

---

## Step 1 — Create the Telegram Bot

1. Open Telegram, search for **@BotFather**
2. Send `/newbot`
3. When asked for a name: `Zotopie Founder Bot`
4. When asked for a username: `ZotopieFounderBot` (or any unique name ending in `bot`)
5. BotFather replies with your **BOT_TOKEN** — looks like: `7123456789:AAFxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
6. **Save this token** — you will need it in Step 4

---

## Step 2 — Get Your Telegram Chat ID

1. Send any message to your new bot (e.g., `/start`)
2. In your browser, open:
   ```
   https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
   ```
   Replace `<BOT_TOKEN>` with your token from Step 1.
3. Look for `"chat":{"id":` in the JSON response
4. Your **FOUNDER_CHAT_ID** is the number after `"id":` (e.g., `123456789`)

---

## Step 3 — Create the Cloudflare KV Namespace

In your terminal, from the `workers/founder-bot/` directory:

```bash
cd workers/founder-bot
npm install
wrangler login   # if not already logged in
wrangler kv:namespace create "BOT_KV"
wrangler kv:namespace create "BOT_KV" --preview
```

The first command outputs something like:
```
{ binding = "BOT_KV", id = "abc123def456..." }
```

The second command outputs:
```
{ binding = "BOT_KV", id = "xyz789..." }
```

Open `wrangler.toml` and replace the placeholder values:
```toml
[[kv_namespaces]]
binding = "BOT_KV"
id = "abc123def456..."        # from first command
preview_id = "xyz789..."      # from second command
```

---

## Step 4 — Set Worker Secrets

Still from `workers/founder-bot/`:

```bash
# Telegram bot token (from Step 1)
wrangler secret put BOT_TOKEN
# Paste your token when prompted

# Your Telegram chat ID (from Step 2)
wrangler secret put FOUNDER_CHAT_ID
# Paste your numeric chat ID when prompted

# A random shared secret for protecting /deploy and /task-complete endpoints
# Generate one: openssl rand -hex 32
wrangler secret put BOT_SECRET
# Paste a strong random string (keep a copy — you'll need it for GitHub Secrets)
```

---

## Step 5 — Deploy the Worker

```bash
wrangler deploy
```

Output will include your Worker URL:
```
Published zotopie-founder-bot (x.xx sec)
  https://zotopie-founder-bot.<YOUR_SUBDOMAIN>.workers.dev
```

**Save this URL** — you'll need it for Step 6 and Step 7.

Test the health check:
```bash
curl https://zotopie-founder-bot.<YOUR_SUBDOMAIN>.workers.dev/
# Expected: {"service":"Zotopie Founder Bot","status":"ok","version":"1.0.0"}
```

---

## Step 6 — Register the Telegram Webhook

Run this curl command (replace both placeholders):
```bash
curl -X POST \
  "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://zotopie-founder-bot.<YOUR_SUBDOMAIN>.workers.dev/webhook"}'
```

Expected response:
```json
{"ok":true,"result":true,"description":"Webhook was set"}
```

Verify the webhook is registered:
```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
```

---

## Step 7 — Add GitHub Actions Secrets

Go to: `https://github.com/kanm1109/zotopie/settings/secrets/actions`

Add these two secrets:

| Secret name | Value |
|-------------|-------|
| `BOT_WORKER_URL` | `https://zotopie-founder-bot.<YOUR_SUBDOMAIN>.workers.dev` |
| `BOT_SECRET` | The same random string you set in Step 4 |

---

## Step 8 — Initialize KV Data (Seed)

Run this command to seed the bot with the current sprint's tasks:

```bash
curl -X POST \
  "https://zotopie-founder-bot.<YOUR_SUBDOMAIN>.workers.dev/seed" \
  -H "Content-Type: application/json" \
  -H "X-Bot-Secret: <YOUR_BOT_SECRET>"
```

Expected: `{"ok":true,"seeded":4}`

The bot will also send you a Telegram message confirming initialization.

---

## Step 9 — Test All Buttons

Open your Telegram bot and test each button:

| Button | Expected response |
|--------|------------------|
| `/start` | Welcome message + keyboard appears |
| `📊 Status` | Latest commit, last deploy, task counts, sync status |
| `🚀 Deployments` | Deploy history (empty until first push to main) |
| `📋 Pending Tasks` | 4 seeded tasks: G-021 through G-024 |
| `✅ Waiting Approval` | "Nothing waiting" |

**Take a screenshot of each response for task verification.**

---

## Step 10 — Verify GitHub Actions Integration

Push any commit to `main`. After ~4 minutes you should receive a Telegram notification:

```
🚀 Deployment Success

Commit: abc1234
Branch: main
Time: 22 Jun 2026, 14:30

<commit message>

Status: LIVE ✅
https://zotopie.com
```

Then tap `🚀 Deployments` — the commit should appear in the history.

---

## Manual Notifications (Optional)

### Mark a task complete

```bash
curl -X POST \
  "https://zotopie-founder-bot.<YOUR_SUBDOMAIN>.workers.dev/task-complete" \
  -H "Content-Type: application/json" \
  -H "X-Bot-Secret: <YOUR_BOT_SECRET>" \
  -d '{
    "taskId": "G-021",
    "taskName": "Rytr Review Refresh",
    "status": "READY FOR REVIEW",
    "deployed": false
  }'
```

This will:
- Remove G-021 from Pending Tasks
- Add G-021 to Waiting Approval
- Send you a Telegram notification

### Notify a manual deployment

```bash
curl -X POST \
  "https://zotopie-founder-bot.<YOUR_SUBDOMAIN>.workers.dev/deploy" \
  -H "Content-Type: application/json" \
  -H "X-Bot-Secret: <YOUR_BOT_SECRET>" \
  -d '{
    "commit": "abc1234567890",
    "status": "success",
    "branch": "main",
    "message": "Manual deploy note",
    "time": "2026-06-22T07:00:00Z"
  }'
```

---

## Secrets Summary

| Secret | Where stored | Purpose |
|--------|-------------|---------|
| `BOT_TOKEN` | Cloudflare Worker (wrangler secret) | Telegram bot authentication |
| `FOUNDER_CHAT_ID` | Cloudflare Worker (wrangler secret) | Restricts bot to founder only |
| `BOT_SECRET` | Cloudflare Worker + GitHub Actions | Protects `/deploy` and `/task-complete` |
| `BOT_WORKER_URL` | GitHub Actions only | Worker URL for deploy notifications |

**Never commit any of these values to git.**

---

## Troubleshooting

**Bot not responding to button taps:**
1. Check webhook is registered: `curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
2. Check Worker logs: `wrangler tail` from `workers/founder-bot/`
3. Verify `FOUNDER_CHAT_ID` matches your actual chat ID

**`/deploy` returns 401:**
- `BOT_SECRET` in GitHub Actions secrets doesn't match the one set via `wrangler secret put`

**Buttons don't appear in Telegram:**
- Send `/start` to the bot — the keyboard reappears after any reply
- On mobile: tap the grid icon next to the message input

**KV data not updating:**
- KV has eventual consistency — wait 1-2 seconds and retry

---

## Updating the Worker

After editing `workers/founder-bot/src/index.js`:

```bash
cd workers/founder-bot
wrangler deploy
```

No restart needed — Cloudflare Workers are stateless and deploy instantly.

---

## Updating the Task List

The KV data can be updated via the `/seed` endpoint (resets to hardcoded list) or by editing `handleSeed()` in `index.js` and redeploying.

For runtime updates without a deploy, use the Cloudflare dashboard:
1. Go to **Workers & Pages** → **zotopie-founder-bot** → **KV**
2. Select `BOT_KV` namespace
3. Edit `PENDING_TASKS` JSON directly
