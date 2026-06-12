/**
 * validate-release.mjs
 * Pre-release sanity checks for Zotopie.
 * Exits 1 if any ERROR-level check fails — safe to use as CI gate.
 *
 * Usage:
 *   node scripts/validate-release.mjs          # pre-build (source checks only)
 *   node scripts/validate-release.mjs --post   # post-build (includes dist/ checks)
 *
 * npm script:
 *   npm run validate-release                   # pre-build
 *   npm run validate-release -- --post         # post-build (run after npm run build)
 */

import { readFile, access } from "fs/promises";
import { join } from "path";

const ROOT      = process.cwd();
const DATA      = join(ROOT, "src", "data");
const GENERATED = join(DATA, "generated");
const DIST      = join(ROOT, "dist");
const POST_MODE = process.argv.includes("--post");

let errors   = 0;
let warnings = 0;

// ── Helpers ───────────────────────────────────────────────────────────────────
async function fileExists(path) {
  try { await access(path); return true; } catch { return false; }
}

function pass(label)               { console.log(`  ✓  ${label}`); }
function fail(label, hint = "")    { console.log(`  ✗  ${label}${hint ? "  →  " + hint : ""}`); errors++; }
function warn(label, hint = "")    { console.log(`  ⚠  ${label}${hint ? "  →  " + hint : ""}`); warnings++; }
function info(label)               { console.log(`  ℹ  ${label}`); }
function section(title)            { console.log(`\n── ${title} ${"─".repeat(44 - title.length)}`); }

// ── Header ────────────────────────────────────────────────────────────────────
console.log("\n" + "═".repeat(50));
console.log("  Zotopie — Release Validation");
console.log(`  Mode: ${POST_MODE ? "post-build (dist/ included)" : "pre-build (source only)"}`);
console.log("═".repeat(50));

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 1: Source data files
// ─────────────────────────────────────────────────────────────────────────────
section("Source data files");

const sourceFiles = [
  ["src/data/tools.json",                  join(DATA, "tools.json")],
  ["src/data/overviews.json",              join(DATA, "overviews.json")],
  ["src/data/best-for.json",               join(DATA, "best-for.json")],
  ["src/data/alternatives.json",           join(DATA, "alternatives.json")],
  ["src/data/logo-mapping.json",           join(DATA, "logo-mapping.json")],
  ["src/data/taxonomies.json",             join(DATA, "taxonomies.json")],
  ["src/data/category-content.json",       join(DATA, "category-content.json")],
];

for (const [label, path] of sourceFiles) {
  if (await fileExists(path)) { pass(label); }
  else { fail(label, "file missing — check repository"); }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 2: Generated files exist
// ─────────────────────────────────────────────────────────────────────────────
section("Generated files");

const enrichedPath = join(GENERATED, "tools-enriched.json");
const iconDataPath = join(GENERATED, "icon-data.json");

const enrichedExists = await fileExists(enrichedPath);
const iconExists     = await fileExists(iconDataPath);

if (enrichedExists) { pass("src/data/generated/tools-enriched.json"); }
else { fail("src/data/generated/tools-enriched.json", "run: node scripts/merge-data.mjs"); }

if (iconExists) { pass("src/data/generated/icon-data.json"); }
else { fail("src/data/generated/icon-data.json", "run: node scripts/merge-data.mjs"); }

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 3: Stale generated file detection (tool count sync)
// ─────────────────────────────────────────────────────────────────────────────
section("Data integrity — stale detection");

const toolsPath = join(DATA, "tools.json");

if (enrichedExists && await fileExists(toolsPath)) {
  const tools    = JSON.parse(await readFile(toolsPath,    "utf8"));
  const enriched = JSON.parse(await readFile(enrichedPath, "utf8"));

  const tCount = tools.length;
  const eCount = enriched.length;

  if (tCount === eCount) {
    pass(`Tool count in sync: tools.json=${tCount}  enriched=${eCount}`);
  } else {
    fail(
      `Tool count MISMATCH: tools.json=${tCount}  enriched=${eCount}`,
      "run: node scripts/merge-data.mjs  then re-commit src/data/generated/"
    );
  }

  // Check that every slug in tools.json is present in enriched
  const enrichedSlugs = new Set(enriched.map((t) => t.slug));
  const missingSlugs  = tools.filter((t) => !enrichedSlugs.has(t.slug)).map((t) => t.slug);

  if (missingSlugs.length === 0) {
    pass(`All ${tCount} slugs present in tools-enriched.json`);
  } else {
    fail(
      `${missingSlugs.length} slug(s) missing from tools-enriched.json`,
      `Missing: ${missingSlugs.slice(0, 8).join(", ")}${missingSlugs.length > 8 ? " …" : ""}`
    );
  }
} else {
  info("Skipping count check — tools.json or tools-enriched.json missing");
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 4: robots.txt sitemap references are valid
// ─────────────────────────────────────────────────────────────────────────────
section("robots.txt sitemap references");

const robotsPath = join(ROOT, "public", "robots.txt");

if (await fileExists(robotsPath)) {
  const robotsContent = await readFile(robotsPath, "utf8");
  const sitemapLines  = robotsContent.split("\n").filter((l) => l.startsWith("Sitemap:"));

  if (sitemapLines.length === 0) {
    warn("No Sitemap: declarations found in public/robots.txt");
  }

  for (const line of sitemapLines) {
    const url      = line.replace("Sitemap:", "").trim();
    const filename = url.split("/").pop(); // e.g. "sitemap-index.xml"

    // These files are Astro-generated and will exist in dist/ after build
    // OR in public/ if they are static. Check both.
    const inPublic   = await fileExists(join(ROOT, "public", filename));
    const inDist     = await fileExists(join(DIST, filename));
    const redirected = await checkRedirectFor(filename);

    if (inPublic || inDist || redirected) {
      pass(`Sitemap reference resolves: ${filename}${redirected ? " (via redirect)" : ""}`);
    } else {
      warn(
        `Sitemap reference unverified pre-build: ${filename}`,
        "Expected in dist/ after build — run --post mode to verify"
      );
    }
  }
} else {
  fail("public/robots.txt missing");
}

async function checkRedirectFor(filename) {
  const redirectsPath = join(ROOT, "public", "_redirects");
  if (!await fileExists(redirectsPath)) return false;
  const content = await readFile(redirectsPath, "utf8");
  return content.includes(`/${filename}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 5: Post-build dist/ validation (only with --post flag)
// ─────────────────────────────────────────────────────────────────────────────
if (POST_MODE) {
  section("dist/ build output (post-build)");

  const distExists = await fileExists(DIST);
  if (!distExists) {
    fail("dist/ directory missing", "run: npm run build");
  } else {
    const distFiles = [
      "sitemap-index.xml",
      "sitemap-0.xml",
      "robots.txt",
      "_headers",
      "_redirects",
      "index.html",
      "404.html",
    ];

    for (const f of distFiles) {
      const path = join(DIST, f);
      if (await fileExists(path)) { pass(`dist/${f}`); }
      else { fail(`dist/${f}`, "expected build output — check astro.config.mjs"); }
    }

    // Sitemap URL count sanity
    const sitemapPath = join(DIST, "sitemap-0.xml");
    if (await fileExists(sitemapPath)) {
      const content  = await readFile(sitemapPath, "utf8");
      const urlCount = (content.match(/<url>/g) ?? []).length;

      if (urlCount >= 100) {
        pass(`sitemap-0.xml: ${urlCount} URL entries (≥100 expected)`);
      } else if (urlCount > 0) {
        warn(`sitemap-0.xml: only ${urlCount} URLs (expected ≥100)`, "possible build issue");
      } else {
        fail("sitemap-0.xml: 0 URL entries", "sitemap generation failed");
      }

      // Check no HTML contamination
      const hasHtml = /<html|<body|<head|data-astro-cid/i.test(content);
      if (hasHtml) { fail("sitemap-0.xml: HTML contamination detected"); }
      else { pass("sitemap-0.xml: no HTML contamination"); }
    }

    // sitemap-index.xml references sitemap-0.xml
    const indexPath = join(DIST, "sitemap-index.xml");
    if (await fileExists(indexPath)) {
      const indexContent = await readFile(indexPath, "utf8");
      if (indexContent.includes("sitemap-0.xml")) {
        pass("sitemap-index.xml references sitemap-0.xml");
      } else {
        fail("sitemap-index.xml does not reference sitemap-0.xml");
      }
    }
  }
} else {
  info("Skipping dist/ checks (pre-build mode). Run with --post after npm run build.");
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n" + "═".repeat(50));
if (errors === 0 && warnings === 0) {
  console.log("  ✅  All checks passed — safe to release");
} else if (errors === 0) {
  console.log(`  ⚠   ${warnings} warning(s) — review before release`);
} else {
  console.log(`  ❌  ${errors} error(s), ${warnings} warning(s) — DO NOT release`);
}
console.log("═".repeat(50) + "\n");

process.exit(errors > 0 ? 1 : 0);
