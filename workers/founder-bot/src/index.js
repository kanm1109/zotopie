/**
 * Zotopie Founder Control Bot — Cloudflare Worker v2
 *
 * Endpoints:
 *   POST /webhook        — Telegram update handler (messages + callback queries)
 *   POST /deploy         — GitHub Actions deploy notification (requires X-Bot-Secret)
 *   POST /task-complete  — Task complete notification (requires X-Bot-Secret)
 *   GET  /               — Health check
 *
 * Required Worker Secrets:
 *   BOT_TOKEN        — Telegram bot token from @BotFather
 *   FOUNDER_CHAT_ID  — Founder's Telegram chat ID
 *   BOT_SECRET       — Shared secret for protected endpoints
 *   DEPLOY_HOOK_URL  — Cloudflare Pages deploy hook URL
 *
 * KV Binding: BOT_KV
 *   LAST_DEPLOY      — JSON: { commit, status, branch, message, time }
 *   DEPLOY_HISTORY   — JSON array: last 20 deployments
 *   PENDING_TASKS    — JSON array: { id, name, assignee }
 *   WAITING_APPROVAL — JSON array: { id, name, status, time }
 *   DEPLOY_PENDING   — JSON: { commit, startTime } — cleared after post-deploy verify
 */

const TELEGRAM_API = 'https://api.telegram.org/bot';
const GITHUB_API = 'https://api.github.com';
const REPO = 'kanm1109/zotopie';
const SITE_URL = 'https://zotopie.com';

const HEALTH_URLS = [
  { label: 'Homepage', url: 'https://zotopie.com/' },
  { label: 'Reviews Hub', url: 'https://zotopie.com/reviews/' },
  { label: 'Alternatives Hub', url: 'https://zotopie.com/alternatives/' },
  { label: 'Compare Hub', url: 'https://zotopie.com/compare/' },
  { label: 'Best Hub', url: 'https://zotopie.com/best/' },
];

// ── Keyboards ─────────────────────────────────────────────────────────────────

const MAIN_KEYBOARD = {
  keyboard: [
    [{ text: '📊 Status' }, { text: '🚀 Deployments' }],
    [{ text: '📋 Pending Tasks' }, { text: '✅ Waiting Approval' }],
    [{ text: '🩺 Health' }, { text: '🚀 Deploy' }],
  ],
  resize_keyboard: true,
  persistent: true,
  one_time_keyboard: false,
};

const DEPLOY_CONFIRM_KEYBOARD = {
  inline_keyboard: [
    [
      { text: '✅ Confirm Deploy', callback_data: 'confirm_deploy' },
      { text: '❌ Cancel', callback_data: 'cancel_deploy' },
    ],
  ],
};

// ── Telegram helpers ─────────────────────────────────────────────────────────

async function sendMessage(token, chatId, text, replyMarkup = null) {
  const body = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    reply_markup: replyMarkup ?? MAIN_KEYBOARD,
  };
  const res = await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function editMessage(token, chatId, messageId, text) {
  await fetch(`${TELEGRAM_API}${token}/editMessageText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, text, parse_mode: 'HTML' }),
  });
}

async function answerCallback(token, callbackQueryId, text = '') {
  await fetch(`${TELEGRAM_API}${token}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  });
}

// ── GitHub helpers ───────────────────────────────────────────────────────────

async function fetchLatestCommit() {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${REPO}/commits/main`, {
      headers: {
        'User-Agent': 'ZotopieFounderBot/2.0',
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

// ── Health check helpers ──────────────────────────────────────────────────────

async function runHealthChecks() {
  const results = await Promise.all(
    HEALTH_URLS.map(async ({ label, url }) => {
      try {
        const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
        return { label, url, status: res.status, ok: res.status === 200 };
      } catch (_) {
        return { label, url, status: 0, ok: false };
      }
    })
  );
  return results;
}

function formatHealthLine(r) {
  const icon = r.ok ? '✅' : '❌';
  const dots = '.'.repeat(Math.max(2, 22 - r.label.length));
  return `${r.label} ${dots} ${r.status} ${icon}`;
}

function buildHealthText(results, title = '🩺 <b>ZOTOPIE HEALTH</b>') {
  const allOk = results.every(r => r.ok);
  const lines = results.map(formatHealthLine);
  const overall = allOk ? '🟢 <b>HEALTHY</b>' : '🔴 <b>ATTENTION REQUIRED</b>';
  const failed = results.filter(r => !r.ok);

  const parts = [title, '', `<code>${lines.join('\n')}</code>`, '', 'Overall Status:', overall];

  if (!allOk && failed.length > 0) {
    parts.push('', 'Failed:', ...failed.map(r => `• ${r.label} → ${r.status || 'ERR'}`));
  }

  return parts.join('\n');
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
    '🟢 <b>Sync Status:</b>',
    syncStatus,
  ].join('\n');

  await sendMessage(env.BOT_TOKEN, chatId, text);
}

async function handleDeployments(env, chatId) {
  const history = await kvGet(env, 'DEPLOY_HISTORY', []);

  if (history.length === 0) {
    await sendMessage(env.BOT_TOKEN, chatId,
      '🚀 <b>Deployments</b>\n\n⏳ No deployments recorded yet.\n\n<i>Deployments appear here after each push to main.</i>');
    return;
  }

  const lines = history.slice(0, 5).map((d, i) => {
    const icon = d.status === 'success' ? '✅' : '❌';
    const short = d.commit?.slice(0, 7) ?? '???????';
    const time = fmtDate(d.time);
    return `${i + 1}. ${icon} <code>${short}</code>\n    ${d.message?.slice(0, 60) ?? ''}\n    ${time}`;
  });

  await sendMessage(env.BOT_TOKEN, chatId, `🚀 <b>Recent Deployments</b>\n\n${lines.join('\n\n')}`);
}

async function handlePendingTasks(env, chatId) {
  const tasks = await kvGet(env, 'PENDING_TASKS', []);

  if (tasks.length === 0) {
    await sendMessage(env.BOT_TOKEN, chatId,
      '📋 <b>Pending Tasks</b>\n\n✨ No pending tasks. Sprint is clear.');
    return;
  }

  const lines = tasks.map(t =>
    `• <b>${t.id}</b> — ${t.name}${t.assignee ? ` <i>(${t.assignee})</i>` : ''}`
  );

  await sendMessage(env.BOT_TOKEN, chatId,
    `📋 <b>Pending Tasks</b>\n\n${lines.join('\n')}\n\n<i>${tasks.length} task(s) in queue</i>`);
}

async function handleWaitingApproval(env, chatId) {
  const items = await kvGet(env, 'WAITING_APPROVAL', []);

  if (items.length === 0) {
    await sendMessage(env.BOT_TOKEN, chatId,
      '✅ <b>Waiting Approval</b>\n\n✨ Nothing waiting for your review.');
    return;
  }

  const lines = items.map(t =>
    `• <b>${t.id}</b> — ${t.name}\n  Status: <i>${t.status}</i>\n  Since: ${fmtDate(t.time)}`
  );

  await sendMessage(env.BOT_TOKEN, chatId,
    `✅ <b>Waiting Approval</b>\n\n${lines.join('\n\n')}\n\n<i>${items.length} item(s) need your decision</i>`);
}

async function handleHealth(env, chatId) {
  await sendMessage(env.BOT_TOKEN, chatId, '🔍 Running health checks...');
  const results = await runHealthChecks();
  await sendMessage(env.BOT_TOKEN, chatId, buildHealthText(results));
}

async function handleDeploy(env, chatId) {
  const commit = await fetchLatestCommit();
  const commitLine = commit
    ? `<code>${commit.short}</code> — ${commit.message.slice(0, 70)}`
    : '⚠️ Unable to fetch (GitHub rate limit)';

  const text = [
    '🚀 <b>Production Deploy</b>',
    '',
    'Current Branch: <code>main</code>',
    '',
    'Latest Commit:',
    commitLine,
    '',
    'Deploy production?',
  ].join('\n');

  await sendMessage(env.BOT_TOKEN, chatId, text, DEPLOY_CONFIRM_KEYBOARD);
}

// ── Deploy execution ──────────────────────────────────────────────────────────

async function executeDeploy(env) {
  if (!env.DEPLOY_HOOK_URL) return { ok: false, error: 'DEPLOY_HOOK_URL not configured' };
  try {
    const res = await fetch(env.DEPLOY_HOOK_URL, { method: 'POST' });
    const body = await res.json().catch(() => ({}));
    return { ok: res.ok, id: body?.result?.id ?? null };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ── Inline keyboard callback handler ─────────────────────────────────────────

async function handleCallbackQuery(update, env) {
  const query = update.callback_query;
  const chatId = String(query.message.chat.id);
  const messageId = query.message.message_id;
  const data = query.data;

  // Security: only founder may act on deploy controls
  if (env.FOUNDER_CHAT_ID && chatId !== String(env.FOUNDER_CHAT_ID)) {
    await answerCallback(env.BOT_TOKEN, query.id, '🔒 Access denied');
    return;
  }

  await answerCallback(env.BOT_TOKEN, query.id);

  if (data === 'cancel_deploy') {
    await editMessage(env.BOT_TOKEN, chatId, messageId, '❌ <b>Deploy cancelled.</b>');
    await sendMessage(env.BOT_TOKEN, chatId, 'Deploy cancelled. Use the buttons below to continue.');
    return;
  }

  if (data === 'confirm_deploy') {
    await editMessage(env.BOT_TOKEN, chatId, messageId, '⏳ <b>Deploy confirmed. Triggering deployment...</b>');

    const commit = await fetchLatestCommit();
    const result = await executeDeploy(env);

    if (!result.ok) {
      await sendMessage(env.BOT_TOKEN, chatId,
        `❌ <b>Deployment Failed</b>\n\nCould not trigger deploy hook.\n<i>${result.error ?? 'Unknown error'}</i>`);
      return;
    }

    const shortSha = commit?.short ?? '???????';
    await kvPut(env, 'DEPLOY_PENDING', {
      commit: commit?.sha ?? 'unknown',
      startTime: new Date().toISOString(),
    });

    await sendMessage(env.BOT_TOKEN, chatId, [
      '🚀 <b>Deployment Started</b>',
      '',
      `Commit: <code>${shortSha}</code>`,
      '',
      '⏳ Cloudflare Pages is building (~3–5 min).',
      'You will receive a notification when live.',
    ].join('\n'));
  }
}

// ── Telegram webhook handler ──────────────────────────────────────────────────

async function handleWebhook(request, env) {
  let update;
  try {
    update = await request.json();
  } catch (_) {
    return new Response('Bad Request', { status: 400 });
  }

  // Inline keyboard button presses
  if (update.callback_query) {
    await handleCallbackQuery(update, env);
    return new Response('OK');
  }

  const message = update.message;
  if (!message?.text) return new Response('OK');

  const chatId = String(message.chat.id);
  const text = message.text.trim();

  // Security: only respond to configured founder
  if (env.FOUNDER_CHAT_ID && chatId !== String(env.FOUNDER_CHAT_ID)) {
    await sendMessage(env.BOT_TOKEN, chatId, '🔒 Unauthorized. This bot is private.', {});
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
    case '🩺 Health':
      await handleHealth(env, chatId);
      break;
    case '🚀 Deploy':
      await handleDeploy(env, chatId);
      break;
    case '/start':
    default:
      await sendMessage(env.BOT_TOKEN, chatId,
        '👋 <b>Zotopie Founder Bot</b>\n\nUse the buttons below to monitor and control the project.\n\n<i>Tap any button to get started.</i>');
  }

  return new Response('OK');
}

// ── Deploy notification handler (GitHub Actions) ──────────────────────────────

async function handleDeploy_GHA(request, env) {
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
      `Reason: ${reason ?? 'Check GitHub Actions logs'}`,
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
    ].filter(Boolean).join('\n');
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

  const { taskId, taskName = '', status = 'READY FOR REVIEW', deployed = false, removeFromPending = true } = body;

  if (removeFromPending) {
    const pending = await kvGet(env, 'PENDING_TASKS', []);
    await kvPut(env, 'PENDING_TASKS', pending.filter(t => t.id !== taskId));
  }

  if (!deployed) {
    const waiting = await kvGet(env, 'WAITING_APPROVAL', []);
    if (!waiting.some(t => t.id === taskId)) {
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
  ].filter(Boolean).join('\n');

  await sendMessage(env.BOT_TOKEN, env.FOUNDER_CHAT_ID, msgText);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// ── Seed endpoint ─────────────────────────────────────────────────────────────

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

  await sendMessage(env.BOT_TOKEN, env.FOUNDER_CHAT_ID,
    '🌱 <b>Bot initialized</b>\n\nPending tasks seeded with current sprint.');

  return new Response(JSON.stringify({ ok: true, seeded: initialTasks.length }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// ── Scheduled handler — post-deploy verification ──────────────────────────────

async function scheduled(event, env) {
  const pending = await kvGet(env, 'DEPLOY_PENDING');
  if (!pending) return;

  const ageMs = Date.now() - new Date(pending.startTime).getTime();
  const MIN_WAIT = 3 * 60 * 1000;   // wait at least 3 min before first check
  const MAX_WAIT = 10 * 60 * 1000;  // give up after 10 min

  if (ageMs < MIN_WAIT) return;

  // Timeout — deploy took too long or something went wrong
  if (ageMs > MAX_WAIT) {
    await env.BOT_KV.delete('DEPLOY_PENDING');
    await sendMessage(env.BOT_TOKEN, env.FOUNDER_CHAT_ID, [
      '⚠️ <b>Deploy Verification Timeout</b>',
      '',
      'Deployment may still be in progress.',
      'Tap 🩺 Health to check manually.',
    ].join('\n'));
    return;
  }

  const results = await runHealthChecks();
  const allOk = results.every(r => r.ok);

  // Not ready yet — try next cron tick
  if (!allOk) return;

  await env.BOT_KV.delete('DEPLOY_PENDING');

  const shortSha = pending.commit?.slice(0, 7) ?? '???????';
  const lines = results.map(formatHealthLine);

  await sendMessage(env.BOT_TOKEN, env.FOUNDER_CHAT_ID, [
    '✅ <b>Deployment Success</b>',
    '',
    `Commit: <code>${shortSha}</code>`,
    `Production: <b>LIVE</b> ✅`,
    '',
    '🩺 <b>Post-Deploy Verification:</b>',
    `<code>${lines.join('\n')}</code>`,
    '',
    'Verification: <b>PASSED</b> ✅',
  ].join('\n'));
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
      return handleDeploy_GHA(request, env);

    if (pathname === '/task-complete' && method === 'POST')
      return handleTaskComplete(request, env);

    if (pathname === '/seed' && method === 'POST')
      return handleSeed(request, env);

    return new Response(
      JSON.stringify({ service: 'Zotopie Founder Bot', status: 'ok', version: '2.0.0' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(scheduled(event, env));
  },
};
