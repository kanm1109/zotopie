/**
 * Logo System V2
 * Source: unpkg.com/simple-icons@13 (verified slugs)
 * Usage:  node scripts/download-logos-v2.mjs
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const ROOT       = process.cwd();
const LOGOS_DIR  = join(ROOT, "public", "logos");
const TOOLS_PATH = join(ROOT, "src/data/tools.json");
const BASE_URL   = "https://unpkg.com/simple-icons@13/icons/";
const TIMEOUT_MS = 12_000;

// Tool slug → SimpleIcons slug (verified 200 trên unpkg@13)
const SI_MAP = {
  // SEO & Search
  "semrush":          "semrush",
  "yoast-seo":        "yoast",

  // Social Media Management
  "buffer":           "buffer",
  "hootsuite":        "hootsuite",

  // Workflow Automation
  "zapier":           "zapier",
  "make":             "make",
  "n8n":              "n8n",
  "ifttt":            "ifttt",

  // Content & AI Creation
  "chatgpt":          "openai",
  "claude":           "anthropic",
  "canva":            "canva",
  "elevenlabs":       "elevenlabs",
  "grammarly":        "grammarly",

  // Community Growth
  "discord":          "discord",
  "patreon":          "patreon",
  "slack":            "slack",
  "ghost":            "ghost",
  "discourse":        "discourse",
  "circle":           "circle",

  // Marketing & Lead Generation
  "hubspot":          "hubspot",
  "mailchimp":        "mailchimp",
  "brevo":            "brevo",

  // Link Tracking
  "bitly":            "bitly",

  // Data Analytics
  "google-analytics": "googleanalytics",
  "plausible":        "plausibleanalytics",
  "hotjar":           "hotjar",
  "mixpanel":         "mixpanel",
  "matomo":           "matomo",

  // Productivity & Knowledge Management
  "notion":           "notion",
  "clickup":          "clickup",
  "asana":            "asana",
  "trello":           "trello",
  "obsidian":         "obsidian",
  "airtable":         "airtable",
  "todoist":          "todoist",
  "coda":             "coda",

  // Infrastructure & Hosting
  "cloudflare":       "cloudflare",
  "digitalocean":     "digitalocean",
  "vultr":            "vultr",
  "hostinger":        "hostinger",
  "namecheap":        "namecheap",
  "wp-engine":        "wpengine",
  "kinsta":           "kinsta",

  // Ecommerce & Monetization
  "shopify":          "shopify",
  "woocommerce":      "woocommerce",
  "gumroad":          "gumroad",
  "wix":              "wix",
  "squarespace":      "squarespace",
  "bigcommerce":      "bigcommerce",
  "lemon-squeezy":    "lemonsqueezy",
};

async function fetchSVG(siSlug) {
  const url = `${BASE_URL}${siSlug}.svg`;
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  if (!text.includes("<svg")) throw new Error("Invalid SVG");
  return text;
}

// ── Main ─────────────────────────────────────────────────────────────────────
await mkdir(LOGOS_DIR, { recursive: true });

const tools = JSON.parse(await readFile(TOOLS_PATH, "utf8"));
let downloaded = 0, skipped = 0, failed = 0;

console.log(`\nLogo System V2 (Simple Icons @13)\n${"─".repeat(48)}`);

for (const tool of tools) {
  const siSlug = SI_MAP[tool.slug];

  // Không có mapping → xóa clearbit URL, dùng fallback avatar
  if (!siSlug) {
    if (tool.logo && !tool.logo.startsWith("/logos/")) tool.logo = "";
    skipped++;
    continue;
  }

  try {
    const svg = await fetchSVG(siSlug);
    const outPath = join(LOGOS_DIR, `${tool.slug}.svg`);
    await writeFile(outPath, svg, "utf8");
    tool.logo = `/logos/${tool.slug}.svg`;
    downloaded++;
    console.log(`  ✓  ${tool.name.padEnd(24)} ← ${siSlug}`);
  } catch (err) {
    if (tool.logo && !tool.logo.startsWith("/logos/")) tool.logo = "";
    failed++;
    console.log(`  ✗  ${tool.name.padEnd(24)} (${err.message})`);
  }
}

await writeFile(TOOLS_PATH, JSON.stringify(tools, null, 2) + "\n", "utf8");

const withLogo = tools.filter((t) => t.logo).length;
console.log(`
${"─".repeat(48)}
  Downloaded  : ${downloaded} SVGs
  Skipped     : ${skipped} (not in Simple Icons → fallback)
  Failed      : ${failed}
  With logo   : ${withLogo}/${tools.length} tools
  tools.json  : updated
`);
