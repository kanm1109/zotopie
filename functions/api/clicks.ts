/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
  STATS_KEY: string;
}

// Internal reporting endpoint — JSON only, no UI.
// Usage: GET /api/clicks?key=<STATS_KEY>
//
// Returns:
//   totals       — clicks per tool (all time)
//   last_30_days — human clicks per tool per day
//   top_sources  — which pages drive the most clicks per tool

export async function onRequestGet(
  ctx: EventContext<Env, never, Record<string, unknown>>,
): Promise<Response> {
  const url = new URL(ctx.request.url);

  if (url.searchParams.get("key") !== ctx.env.STATS_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  const [totals, daily, sources] = await Promise.all([
    ctx.env.DB.prepare(`
      SELECT
        tool_slug,
        COUNT(*)                                              AS total_clicks,
        SUM(CASE WHEN is_bot = 0 THEN 1 ELSE 0 END)          AS human_clicks,
        COUNT(DISTINCT visitor_hash)                          AS unique_visitors,
        SUM(CASE WHEN is_bot = 1 THEN 1 ELSE 0 END)          AS bot_clicks
      FROM affiliate_clicks
      GROUP BY tool_slug
      ORDER BY human_clicks DESC
    `).all(),

    ctx.env.DB.prepare(`
      SELECT
        date(created_at)                                      AS day,
        tool_slug,
        SUM(CASE WHEN is_bot = 0 THEN 1 ELSE 0 END)          AS clicks
      FROM affiliate_clicks
      WHERE created_at >= datetime('now', '-30 days')
      GROUP BY day, tool_slug
      ORDER BY day DESC, clicks DESC
    `).all(),

    ctx.env.DB.prepare(`
      SELECT
        tool_slug,
        source_page,
        COUNT(*)                                              AS clicks
      FROM affiliate_clicks
      WHERE is_bot = 0
      GROUP BY tool_slug, source_page
      ORDER BY clicks DESC
      LIMIT 30
    `).all(),
  ]);

  return Response.json({
    generated:    new Date().toISOString(),
    totals:       totals.results,
    last_30_days: daily.results,
    top_sources:  sources.results,
  });
}
