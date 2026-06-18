-- AFF-001: Affiliate click tracking schema
-- Apply locally:  wrangler d1 execute DB --local --file=db/migrations/0001_affiliate_clicks.sql
-- Apply in prod:  wrangler d1 execute DB --remote --file=db/migrations/0001_affiliate_clicks.sql

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  tool_slug       TEXT    NOT NULL,
  source_page     TEXT    NOT NULL DEFAULT 'unknown',
  destination_url TEXT    NOT NULL,
  visitor_hash    TEXT    NOT NULL,
  ua_hash         TEXT    NOT NULL,
  country         TEXT    NOT NULL DEFAULT 'unknown',
  is_bot          INTEGER NOT NULL DEFAULT 0  -- 0 = human, 1 = bot
);

-- Lookup: clicks per tool
CREATE INDEX IF NOT EXISTS idx_aff_slug
  ON affiliate_clicks(tool_slug);

-- Lookup: clicks over time
CREATE INDEX IF NOT EXISTS idx_aff_date
  ON affiliate_clicks(created_at);

-- Deduplication: recent clicks by same visitor + tool
CREATE INDEX IF NOT EXISTS idx_aff_visitor
  ON affiliate_clicks(visitor_hash, tool_slug, created_at);
