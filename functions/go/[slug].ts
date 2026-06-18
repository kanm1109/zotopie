/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
}

// V1 approved affiliate tools — only these are tracked server-side.
// All other /go/{slug} requests fall through to the pre-built static page.
const AFFILIATE: Record<string, string> = {
  "synthesia":    "https://www.synthesia.io/?via=1a4a4b",
  "gptzero":      "https://gptzero.me/?via=nguyen-khanh",
  "fireflies-ai": "https://app.fireflies.ai/?via=nguyen-khanh",
};

// Bot detection — lightweight UA substring check.
const BOT_SIGNATURES = [
  "bot", "crawler", "spider", "slurp",
  "facebookexternalhit", "whatsapp", "telegram", "discord",
  "preview", "prerender", "headlesschrome", "phantomjs",
  "lighthouse", "pagespeed", "google-inspectiontool",
  "twitterbot", "linkedinbot", "applebot",
];

function detectBot(ua: string): boolean {
  const lower = ua.toLowerCase();
  return BOT_SIGNATURES.some((sig) => lower.includes(sig));
}

// 16-hex SHA-256 prefix — enough for deduplication, not reversible.
async function shortHash(text: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

export async function onRequest(
  ctx: EventContext<Env, "slug", Record<string, unknown>>,
): Promise<Response> {
  const slug = (ctx.params as { slug: string }).slug;
  const dest = AFFILIATE[slug];

  // Not an approved affiliate tool — fall through to pre-built static page.
  if (!dest) return ctx.next();

  const req = ctx.request;
  const ua      = req.headers.get("user-agent") ?? "";
  const referer = req.headers.get("referer")    ?? "";
  const ip      = req.headers.get("cf-connecting-ip") ?? "0.0.0.0";
  const country = (req.cf as { country?: string } | undefined)?.country ?? "unknown";
  const bot     = detectBot(ua);

  // Privacy-safe hashes — no raw IP or UA stored.
  const [visitorHash, uaHash] = await Promise.all([
    shortHash(`${ip}\0${ua}`),
    shortHash(ua),
  ]);

  // Extract source page from Referer header.
  let sourcePage = "unknown";
  try {
    sourcePage = new URL(referer).pathname;
  } catch {
    // Referer absent or malformed — keep "unknown".
  }

  // Return redirect immediately — do not wait for D1 write.
  const redirectResp = new Response(null, {
    status: 302,
    headers: {
      Location:      dest,
      "Cache-Control": "no-store",
    },
  });

  // Non-blocking tracking — failure never surfaces to the visitor.
  ctx.waitUntil(
    ctx.env.DB.prepare(
      `INSERT INTO affiliate_clicks
         (tool_slug, source_page, destination_url, visitor_hash, ua_hash, country, is_bot)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(slug, sourcePage, dest, visitorHash, uaHash, country, bot ? 1 : 0)
      .run()
      .catch(() => {}),
  );

  return redirectResp;
}
