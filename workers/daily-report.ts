/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
}

interface DayStats {
  total: number;
  unique: number;
  human: number;
  bot: number;
}

interface ToolStat {
  tool_slug: string;
  human_clicks: number;
}

interface RangeStats {
  total: number;
  human: number;
  unique: number;
}

// Returns YYYY-MM-DD in Vietnam timezone (UTC+7) with optional day offset.
function vnDate(offsetDays = 0): string {
  const d = new Date(Date.now() + 7 * 3_600_000);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

async function fetchDayStats(db: D1Database, date: string): Promise<DayStats> {
  const r = await db
    .prepare(
      `SELECT
         COUNT(*)                                         AS total,
         COUNT(DISTINCT visitor_hash)                     AS unique_v,
         SUM(CASE WHEN is_bot = 0 THEN 1 ELSE 0 END)     AS human,
         SUM(CASE WHEN is_bot = 1 THEN 1 ELSE 0 END)     AS bot
       FROM affiliate_clicks
       WHERE date(created_at, '+7 hours') = ?`,
    )
    .bind(date)
    .first<{ total: number; unique_v: number; human: number; bot: number }>();
  return {
    total:  r?.total    ?? 0,
    unique: r?.unique_v ?? 0,
    human:  r?.human    ?? 0,
    bot:    r?.bot      ?? 0,
  };
}

async function fetchRangeStats(
  db: D1Database,
  since: string,
  until: string,
): Promise<RangeStats> {
  const r = await db
    .prepare(
      `SELECT
         COUNT(*)                                         AS total,
         SUM(CASE WHEN is_bot = 0 THEN 1 ELSE 0 END)     AS human,
         COUNT(DISTINCT visitor_hash)                     AS unique_v
       FROM affiliate_clicks
       WHERE date(created_at, '+7 hours') BETWEEN ? AND ?`,
    )
    .bind(since, until)
    .first<{ total: number; human: number; unique_v: number }>();
  return {
    total:  r?.total    ?? 0,
    human:  r?.human    ?? 0,
    unique: r?.unique_v ?? 0,
  };
}

async function fetchToolBreakdown(
  db: D1Database,
  since: string,
  until: string,
): Promise<ToolStat[]> {
  const r = await db
    .prepare(
      `SELECT
         tool_slug,
         SUM(CASE WHEN is_bot = 0 THEN 1 ELSE 0 END)     AS human_clicks
       FROM affiliate_clicks
       WHERE date(created_at, '+7 hours') BETWEEN ? AND ?
       GROUP BY tool_slug
       ORDER BY human_clicks DESC`,
    )
    .bind(since, until)
    .all<ToolStat>();
  return r.results;
}

async function fetchTopSource(db: D1Database, date: string): Promise<string> {
  const r = await db
    .prepare(
      `SELECT source_page, COUNT(*) AS clicks
       FROM affiliate_clicks
       WHERE date(created_at, '+7 hours') = ?
         AND is_bot = 0
         AND source_page != 'unknown'
       GROUP BY source_page
       ORDER BY clicks DESC
       LIMIT 1`,
    )
    .bind(date)
    .first<{ source_page: string; clicks: number }>();
  return r ? `${r.source_page} (${r.clicks})` : "—";
}

function toolLines(tools: ToolStat[]): string {
  return tools.length === 0
    ? "  (no data)"
    : tools.map((t) => `  ${t.tool_slug}: ${t.human_clicks}`).join("\n");
}

function buildMessage(
  yesterday: string,
  day:       DayStats,
  topSource: string,
  toolsDay:  ToolStat[],
  stats7:    RangeStats,
  tools7:    ToolStat[],
  stats30:   RangeStats,
  tools30:   ToolStat[],
): string {
  const topTool = toolsDay[0]
    ? `${toolsDay[0].tool_slug} (${toolsDay[0].human_clicks})`
    : "—";

  return [
    "📊 *Zotopie Affiliate Report*",
    "",
    `📅 Date: ${yesterday}`,
    "",
    "*Yesterday*",
    `Total Clicks: ${day.total}`,
    `Unique Visitors: ${day.unique}`,
    `Human Clicks: ${day.human}`,
    `Bot Clicks: ${day.bot}`,
    "",
    `Top Tool: ${topTool}`,
    `Top Article: ${topSource}`,
    "",
    "*Tool Breakdown*",
    toolLines(toolsDay),
    "",
    "*Last 7 Days*",
    `Total: ${stats7.total} | Human: ${stats7.human} | Unique: ${stats7.unique}`,
    toolLines(tools7),
    "",
    "*Last 30 Days*",
    `Total: ${stats30.total} | Human: ${stats30.human} | Unique: ${stats30.unique}`,
    toolLines(tools30),
  ].join("\n");
}

async function sendTelegram(
  token:  string,
  chatId: string,
  text:   string,
): Promise<void> {
  const resp = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    },
  );
  if (!resp.ok) {
    throw new Error(`Telegram API ${resp.status}: ${await resp.text()}`);
  }
}

async function run(env: Env): Promise<void> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    throw new Error("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID secret not configured");
  }

  const yesterday = vnDate(-1);
  const since7    = vnDate(-7);
  const since30   = vnDate(-30);

  const [day, topSource, toolsDay, stats7, tools7, stats30, tools30] = await Promise.all([
    fetchDayStats(env.DB, yesterday),
    fetchTopSource(env.DB, yesterday),
    fetchToolBreakdown(env.DB, yesterday, yesterday),
    fetchRangeStats(env.DB, since7, yesterday),
    fetchToolBreakdown(env.DB, since7, yesterday),
    fetchRangeStats(env.DB, since30, yesterday),
    fetchToolBreakdown(env.DB, since30, yesterday),
  ]);

  const message = buildMessage(
    yesterday, day, topSource, toolsDay,
    stats7, tools7, stats30, tools30,
  );

  await sendTelegram(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID, message);
}

export default {
  async scheduled(
    _event: ScheduledEvent,
    env:    Env,
    ctx:    ExecutionContext,
  ): Promise<void> {
    ctx.waitUntil(
      run(env).catch((err) =>
        console.error(
          "[aff-report]",
          err instanceof Error ? err.message : String(err),
        ),
      ),
    );
  },
};
