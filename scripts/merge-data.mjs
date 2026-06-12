/**
 * merge-data.mjs
 * Merges all data sources into src/data/generated/tools-enriched.json
 * Also generates src/data/generated/icon-data.json (slug → {hex, path})
 *
 * Sources (all keyed by tool name):
 *   src/data/tools.json          — base + overview + pros/cons (canonical)
 *   src/data/overviews.json      — { tool, overview } legacy boilerplate fallback
 *   src/data/best-for.json       — { tool, bestFor[] }
 *   src/data/alternatives.json   — { tool, alternatives[] }
 *   src/data/logo-mapping.json   — { tool_name, simple_icon }
 *
 * Logo system:
 *   simple_icon slug validated against simple-icons npm package at build time.
 *   SVG path + hex stored in icon-data.json for client-side rendering.
 *   No external URLs. Offline-safe.
 *
 * Usage: node scripts/merge-data.mjs
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import * as SimpleIcons from "simple-icons";

const ROOT    = process.cwd();
const DATA    = join(ROOT, "src", "data");
const OUT_DIR = join(DATA, "generated");

// ── Load ─────────────────────────────────────────────────────────────────────
const [tools, overviews, bestFor, alternatives, logoMapping] =
  await Promise.all([
    readFile(join(DATA, "tools.json"),        "utf8").then(JSON.parse),
    readFile(join(DATA, "overviews.json"),    "utf8").then(JSON.parse),
    readFile(join(DATA, "best-for.json"),     "utf8").then(JSON.parse),
    readFile(join(DATA, "alternatives.json"), "utf8").then(JSON.parse),
    readFile(join(DATA, "logo-mapping.json"), "utf8").then(JSON.parse),
  ]);

// ── Lookup maps (case-insensitive name → data) ────────────────────────────────
// Guard against undefined keys — some source files use "name" instead of "tool"
const norm = (s) => (s ?? "").toLowerCase().trim();
const toolKey = (e) => norm(e.tool ?? e.name ?? e.tool_name ?? "");

const overviewMap   = new Map(overviews.map((e) => [toolKey(e), e.overview]));
const bestForMap    = new Map(bestFor.map  ((e) => [toolKey(e), e.bestFor ?? []]));
const alternatesMap = new Map(alternatives.map((e) => [toolKey(e), e.alternatives ?? []]));
const iconSlugMap   = new Map(logoMapping.map ((e) => [norm(e.tool_name ?? e.tool ?? ""), e.simple_icon ?? ""]));

// ── Resolve simple-icon slug → validate + extract path & hex ─────────────────
const slugToKey = (s) => "si" + s.charAt(0).toUpperCase() + s.slice(1);

function extractPathD(svgStr) {
  const m = svgStr.match(/<path[^>]+d="([^"]+)"/);
  return m ? m[1] : "";
}

function resolveIcon(slug) {
  if (!slug) return null;
  const icon = SimpleIcons[slugToKey(slug)];
  if (!icon) return null;
  return { hex: icon.hex, path: extractPathD(icon.svg) };
}

// ── Report accumulators ───────────────────────────────────────────────────────
const report = {
  total:               tools.length,
  missingOverview:     [],
  missingProsCons:     [],
  missingBestFor:      [],
  missingAlternatives: [],
  missingIcon:         [],
};

// ── Merge ─────────────────────────────────────────────────────────────────────
await mkdir(OUT_DIR, { recursive: true });

// Collect icon-data entries as we merge
const iconDataMap = {};

const enriched = tools.map((tool) => {
  const key = norm(tool.name);

  const overview = (tool.overview?.trim()) ? tool.overview : (overviewMap.get(key) ?? "");
  const pros     = tool.pros  ?? [];
  const cons     = tool.cons  ?? [];
  const bestForV = bestForMap.get(key)    ?? tool.bestFor     ?? [];
  const altsV    = alternatesMap.get(key) ?? tool.alternatives ?? [];

  // icon
  const slug     = iconSlugMap.get(key) ?? "";
  const iconData = resolveIcon(slug);
  if (iconData && slug) iconDataMap[slug] = iconData;

  // report
  if (!overview)                     report.missingOverview.push(tool.slug);
  if (!pros.length && !cons.length)  report.missingProsCons.push(tool.slug);
  if (!bestForV.length)              report.missingBestFor.push(tool.slug);
  if (!altsV.length)                 report.missingAlternatives.push(tool.slug);
  if (!slug || !iconData)            report.missingIcon.push(tool.slug);

  return {
    name:            tool.name,
    slug:            tool.slug,
    description:     tool.description,
    website:         tool.website,
    pricing:         tool.pricing,
    startingPrice:   tool.startingPrice   ?? "",
    rating:          tool.rating,
    featured:        tool.featured        ?? false,
    addedDate:       tool.addedDate       ?? "",
    affiliate:       tool.affiliate       ?? false,
    primaryCategory: tool.primaryCategory ?? "",
    categories:      tool.categories      ?? [],

    simple_icon:     slug,

    overview,
    pros,
    cons,
    bestFor:         bestForV,
    alternatives:    altsV,

    keyFeatures:      tool.keyFeatures      ?? [],
    pricingBreakdown: tool.pricingBreakdown  ?? null,
    useCases:         tool.useCases          ?? [],
    whoShouldAvoid:   tool.whoShouldAvoid    ?? [],
    verdict:          tool.verdict           ?? null,
  };
});

// ── Write outputs ─────────────────────────────────────────────────────────────
const enrichedPath  = join(OUT_DIR, "tools-enriched.json");
const iconDataPath  = join(OUT_DIR, "icon-data.json");

await Promise.all([
  writeFile(enrichedPath, JSON.stringify(enriched, null, 2) + "\n", "utf8"),
  writeFile(iconDataPath,  JSON.stringify(iconDataMap, null, 2) + "\n", "utf8"),
]);

// ── Print report ──────────────────────────────────────────────────────────────
const sep  = "─".repeat(58);
const sep2 = "═".repeat(58);
const ok   = (n) => n === 0 ? "✓  0" : `✗  ${n}`;

console.log(`\n${sep2}`);
console.log(`  Zotopie — Data Merge Report`);
console.log(sep2);
console.log(`  Total tools         : ${report.total}`);
console.log(`  Missing overview    : ${ok(report.missingOverview.length)}`);
console.log(`  Missing pros/cons   : ${ok(report.missingProsCons.length)}`);
console.log(`  Missing bestFor     : ${ok(report.missingBestFor.length)}`);
console.log(`  Missing alternatives: ${ok(report.missingAlternatives.length)}`);
console.log(`  Missing icon        : ${ok(report.missingIcon.length)}  (${100 - report.missingIcon.length} with icon)`);
console.log(sep);

const section = (title, list, mapFn = (x) => x) => {
  if (!list.length) return;
  console.log(`\n  ⚠  ${title} (${list.length}):`);
  list.forEach((item) => console.log(`     - ${mapFn(item)}`));
};

section("Missing overview",     report.missingOverview);
section("Missing pros/cons",    report.missingProsCons);
section("Missing bestFor",      report.missingBestFor);
section("Missing alternatives", report.missingAlternatives);

console.log(`\n  Output: src/data/generated/tools-enriched.json`);
console.log(`  Output: src/data/generated/icon-data.json`);
console.log(`  Icons : ${Object.keys(iconDataMap).length} slugs`);
console.log(`  Tools : ${enriched.length}`);
console.log(`${sep2}\n`);
