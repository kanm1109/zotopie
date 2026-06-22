/**
 * Zotopie Founder Control Bot — Cloudflare Worker v1
 *
 * Endpoints:
 *   POST /webhook        — Telegram update handler
 *   POST /deploy         — GitHub Actions deploy notification (requires X-Bot-Secret)
 *   POST /task-complete  — Task complete notification (requires X-Bot-Secret)
 *   GET  /               — Health check
 *
 * Required Worker Secrets (set via: wrangler secret put <NAME>):
 *   BOT_TOKEN        — Telegram bot token from @BotFather
 *   FOUNDER_CHAT_ID  — Founder's Telegram chat ID
 *   BOT_SECRET       — Shared secret for protected endpoints
 *
 * KV Binding: BOT_KV
 *   LAST_DEPLOY      — JSON: { commit, status, branch, message, time }
 *   DEPLOY_HISTORY   — JSON array: last 20 deployments
 *   PENDING_TASKS    — JSON array: { id, name, assignee }
 *   WAITING_APPROVAL — JSON array: { id, name, status, time }
 */

const TELEGRAM_API = 'https://api.telegram.org/bot';
const GITHUB_API = 'https://api.github.com';
const REPO = 'kanm1109/zotopie';
const SITE_URL = 'https://zotopie.com';

// ── Persistent keyboard shown after every reply ──────────────────────────────

const MAIN_KEYBOARD = {
  keyboard: [
    [{ text: '📊 Status' }, { text: '🚀 Deployments' }],
    [{ text: '📋 Pending Tasks' }, { text: '✅ Waiting Approval' }],
  ],
  resize_keyboard: true,
  persistent: true,
  one_time_keyboard: false,
};

// ── Telegram helpers ─────────────────────────────────────────────────────────

async function sendMessage(token, chatId, text, extraMarkup = null) {
  const body = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    reply_markup: extraMarkup ?? MAIN_KEYBOARD,
  };
  const res = await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

// ── GitHub helpers ───────────────────────────────────────────────────────────

async function fetchLatestCommit() {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${REPO}/commits/main`, {
      headers: {
        'User-Agent': 'ZotopieFounderBot/1.0',
        Accept: 'application/vnd.github.v3+json',
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      sha: data.sha,
      short: data.sha?.slice(0, 7),
      message: data.commit?.message?.split('\n')[0] ?? '',
      date: data.commit?.committer?.date ?? '',
      author: data.commit?.author?.name ?? '',
    };
  } catch (_) {
    return null;
  }
}

// ── KV helpers ───────────────────────────────────────────────────────────────

async function kvGet(env, key, fallback = null) {
  try {
    const raw = await env.BOT_KV.get(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

async function kvPut(env, key, value) {
  await env.BOT_KV.put(key, JSON.stringify(value));
}

// ── Date formatter ────────────────────────────────────────────────────────────

function fmtDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-GB', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (_) {
    return iso;
  }
}

// ── Button handlers ───────────────────────────────────────────────────────────

async function handleStatus(env, chatId) {
  const [commit, lastDeploy, pending, waiting] = await Promise.all([
    fetchLatestCommit(),
    kvGet(env, 'LAST_DEPLOY'),
    kvGet(env, 'PENDING_TASKS', []),
    kvGet(env, 'WAITING_APPROVAL', []),
  ]);

  let syncStatus = '❓ UNKNOWN';
  if (lastDeploy && commit) {
    syncStatus = lastDeploy.commit === commit.sha
      ? '✅ UP TO DATE'
      : '⚠️ OUTDATED — local changes not yet deployed';
  }

  const commitLine = commit
    ? `<code>${commit.short}</code> · ${commit.message}`
    : '⚠️ Unable to fetch';

  const deployLine = lastDeploy
    ? `<code>${lastDeploy.commit?.slice(0, 7)}</code> · ${fmtDate(lastDeploy.time)}`
    : '⏳ No deployment recorded yet';

  const text = [
    '<b>ZOTOPIE STATUS</b>',
    '',
    '📦 <b>Latest Commit (GitHub):</b>',
    commitLine,
    '',
    '🚀 <b>Last Deployed Commit:</b>',
    deployLine,
    '',
    `📋 <b>Pending Tasks:</b> ${pending.length}`,
    `✅ <b>Waiting Approval:</b> ${waiting.length}`,
    '',
    `🟢 <b>Sync Status:</b>`,
    syncStatus,
  ].join('\n');

  await sendMessage(env.BOT_TOKEN, chatId, text);
}

async function handleDeployments(env, chatId) {
  const history = await kvGet(env, 'DEPLOY_HISTORY', []);

  if (history.length === 0) {
    await sendMessage(env.BOT_TOKEN, chatId,
      '🚀 <b>Deployments</b>\n\n⏳ No deployments recorded yet.\n\n<i>Deployments will appear here after the first push to main.</i>');
    return;
  }

  const lines = history.slice(0, 5).map((d, i) => {
    const icon = d.status === 'success' ? '✅' : '❌';
    const short = d.commit?.slice(0, 7) ?? '???????';
    const time = fmtDate(d.time);
    return `${i + 1}. ${icon} <code>${short}</code>\n    ${d.message?.slice(0, 60) ?? ''}\n    ${time}`;
  });

  const text = `🚀 <b>Recent Deployments</b>\n\n${lines.join('\n\n')}`;
  await sendMessage(env.BOT_TOKEN, chatId, text);
}

async function handlePendingTasks(env, chatId) {
  const tasks = await kvGet(env, 'PENDING_TASKS', []);

  if (tasks.length === 0) {
    await sendMessage(env.BOT_TOKEN, chatId,
      '📋 <b>Pending Tasks</b>\n\n✨ No pending tasks. Sprint is clear.');
    return;
  }

  const lines = tasks.map((t) =>
    `• <b>${t.id}</b> — ${t.name}${t.assignee ? ` <i>(${t.assignee})</i>` : ''}`
  );

  const text = `📋 <b>Pending Tasks</b>\n\n${lines.join('\n')}\n\n<i>${tasks.length} task(s) in queue</i>`;
  await sendMessage(env.BOT_TOKEN, chatId, text);
}

async function handleWaitingApproval(env, chatId) {
  const items = await kvGet(env, 'WAITING_APPROVAL', []);

  if (items.length === 0) {
    await sendMessage(env.BOT_TOKEN, chatId,
      '✅ <b>Waiting Approval</b>\n\n✨ Nothing waiting for your review.');
    return;
  }

  const lines = items.map((t) =>
    `• <b>${t.id}</b> — ${t.name}\n  Status: <i>${t.status}</i>\n  Since: ${fmtDate(t.time)}`
  );

  const text = `✅ <b>Waiting Approval</b>\n\n${lines.join('\n\n')}\n\n<i>${items.length} item(s) need your decision</i>`;
  await sendMessage(env.BOT_TOKEN, chatId, text);
}

// ── Telegram webhook handler ──────────────────────────────────────────────────

async function handleWebhook(request, env) {
  let update;
  try {
    update = await request.json();
  } catch (_) {
    return new Response('Bad Request', { status: 400 });
  }

  const message = update.message;
  if (!message?.text) return new Response('OK');

  const chatId = String(message.chat.id);
  const text = message.text.trim();

  // Security: only respond to the configured founder chat
  // (comment out during initial setup to discover your chat_id)
  if (env.FOUNDER_CHAT_ID && chatId !== String(env.FOUNDER_CHAT_ID)) {
    await sendMessage(env.BOT_TOKEN, chatId,
      '🔒 Unauthorized. This bot is private.', {});
    return new Response('OK');
  }

  switch (text) {
    case '📊 Status':
      await handleStatus(env, chatId);
      break;
    case '🚀 Deployments':
      await handleDeployments(env, chatId);
      break;
    case '📋 Pending Tasks':
      await handlePendingTasks(env, chatId);
      break;
    case '✅ Waiting Approval':
      await handleWaitingApproval(env, chatId);
      break;
    case '/start':
    default:
      await sendMessage(env.BOT_TOKEN, chatId,
        '👋 <b>Zotopie Founder Bot</b>\n\nUse the buttons below to monitor the project.\n\n<i>Tap any button to get started.</i>');
  }

  return new Response('OK');
}

// ── Deploy notification handler ───────────────────────────────────────────────

async function handleDeploy(request, env) {
  if (request.headers.get('X-Bot-Secret') !== env.BOT_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch (_) {
    return new Response('Bad Request', { status: 400 });
  }

  const { commit, status, branch, message, time, reason } = body;

  const record = {
    commit,
    status: status ?? 'success',
    branch: branch ?? 'main',
    message: message ?? '',
    time: time ?? new Date().toISOString(),
  };

  // Persist to KV
  await kvPut(env, 'LAST_DEPLOY', record);
  const history = await kvGet(env, 'DEPLOY_HISTORY', []);
  await kvPut(env, 'DEPLOY_HISTORY', [record, ...history].slice(0, 20));

  const short = commit?.slice(0, 7) ?? '???????';
  const fmtTime = fmtDate(record.time);

  let msgText;
  if (status === 'failure') {
    msgText = [
      '❌ <b>Deployment Failed</b>',
      '',
      `Commit: <code>${short}</code>`,
      `Branch: ${branch ?? 'main'}`,
      `Time: ${fmtTime}`,
      '',
      `Reason: ${reason ?? 'Unknown — check GitHub Actions logs'}`,
    ].join('\n');
  } else {
    msgText = [
      '🚀 <b>Deployment Success</b>',
      '',
      `Commit: <code>${short}</code>`,
      `Branch: ${branch ?? 'main'}`,
      `Time: ${fmtTime}`,
      '',
      message ? `<i>${message.slice(0, 120)}</i>` : '',
      '',
      `Status: <b>LIVE</b> ✅`,
      `<a href="${SITE_URL}">${SITE_URL}</a>`,
    ].filter((l) => l !== null).join('\n');
  }

  await sendMessage(env.BOT_TOKEN, env.FOUNDER_CHAT_ID, msgText.trim());
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// ── Task complete notification handler ────────────────────────────────────────

async function handleTaskComplete(request, env) {
  if (request.headers.get('X-Bot-Secret') !== env.BOT_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch (_) {
    return new Response('Bad Request', { status: 400 });
  }

  const {
    taskId,
    taskName = '',
    status = 'READY FOR REVIEW',
    deployed = false,
    removeFromPending = true,
  } = body;

  // Remove from pending tasks if requested
  if (removeFromPending) {
    const pending = await kvGet(env, 'PENDING_TASKS', []);
    await kvPut(
      env,
      'PENDING_TASKS',
      pending.filter((t) => t.id !== taskId)
    );
  }

  // Add to waiting approval if not yet deployed
  if (!deployed) {
    const waiting = await kvGet(env, 'WAITING_APPROVAL', []);
    const alreadyExists = waiting.some((t) => t.id === taskId);
    if (!alreadyExists) {
      await kvPut(env, 'WAITING_APPROVAL', [
        ...waiting,
        { id: taskId, name: taskName, status, time: new Date().toISOString() },
      ]);
    }
  }

  const msgText = [
    '📋 <b>Task Complete</b>',
    '',
    `Task: <b>${taskId}</b>`,
    taskName ? `Name: ${taskName}` : '',
    `Status: <b>${status}</b>`,
    '',
    `Deployment: <b>${deployed ? '✅ DEPLOYED' : '⏳ NOT DEPLOYED — needs push'}</b>`,
  ].filter((l) => l !== null).join('\n');

  await sendMessage(env.BOT_TOKEN, env.FOUNDER_CHAT_ID, msgText);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// ── Seed endpoint (one-time setup) ────────────────────────────────────────────

async function handleSeed(request, env) {
  if (request.headers.get('X-Bot-Secret') !== env.BOT_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  const initialTasks = [
    { id: 'G-021', name: 'Rytr Review Refresh', assignee: 'D' },
    { id: 'G-022', name: 'GPTZero Review Expansion', assignee: 'D' },
    { id: 'G-023', name: 'Fireflies Review Expansion', assignee: 'D' },
    { id: 'G-024', name: 'Comparison Cluster P1', assignee: 'D' },
  ];

  await kvPut(env, 'PENDING_TASKS', initialTasks);
  await kvPut(env, 'WAITING_APPROVAL', []);

  await sendMessage(
    env.BOT_TOKEN,
    env.FOUNDER_CHAT_ID,
    '🌱 <b>Bot initialized</b>\n\nPending tasks seeded with current sprint.\nUse the buttons below to get started.'
  );

  return new Response(JSON.stringify({ ok: true, seeded: initialTasks.length }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// ── Main fetch handler ────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    if (pathname === '/webhook' && method === 'POST')
      return handleWebhook(request, env);

    if (pathname === '/deploy' && method === 'POST')
      return handleDeploy(request, env);

    if (pathname === '/task-complete' && method === 'POST')
      return handleTaskComplete(request, env);

    if (pathname === '/seed' && method === 'POST')
      return handleSeed(request, env);

    // Health check
    return new Response(
      JSON.stringify({ service: 'Zotopie Founder Bot', status: 'ok', version: '1.0.0' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  },
};
