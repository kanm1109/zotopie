import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const ROOT = process.cwd();

const aTools = JSON.parse(
  await readFile(join(ROOT, "../a.json"), "utf8")
);
const currentTools = JSON.parse(
  await readFile(join(ROOT, "src/data/tools.json"), "utf8")
);

// Category display name → slug
const CAT_MAP = {
  "SEO & Search":               "seo-search",
  "Social Media Management":    "social-media-management",
  "Workflow Automation":        "workflow-automation",
  "Content & AI Creation":      "content-ai-creation",
  "Community Growth":           "community-growth",
  "Marketing & Lead Generation":"marketing-lead-generation",
  "Link Tracking":              "link-tracking",
  "Data Analytics":             "data-analytics",
  "Productivity":               "productivity-knowledge-management",
  "Hosting":                    "infrastructure-hosting",
  "Ecommerce":                  "ecommerce-monetization",
};

// Existing tools keyed by slug to preserve rich data
const existingBySlug = Object.fromEntries(
  currentTools.map((t) => [t.slug, t])
);

// Spread addedDate evenly from 2026-01-15 → 2026-06-01 (5 months)
const BASE_DATE  = new Date("2026-01-15");
const TOTAL_DAYS = 137; // ~5 months

function addedDate(index, total) {
  const offset = Math.round((index / (total - 1)) * TOTAL_DAYS);
  const d = new Date(BASE_DATE);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

const newTools = aTools.map((src, i) => {
  const ex   = existingBySlug[src.slug];
  const slugs = src.categories.map((c) => CAT_MAP[c] || c);

  // featured = high-rating affiliate tool (or keep existing)
  const featured = ex != null ? ex.featured : (src.rating >= 4.8 && src.affiliate === true);

  return {
    name:            src.name,
    slug:            src.slug,
    description:     src.description,
    website:         src.website,
    // Keep existing local logo; fall back to clearbit URL from a.json
    logo:            (ex?.logo && ex.logo !== "") ? ex.logo : (src.logo || ""),
    pricing:         src.pricing,
    startingPrice:   ex?.startingPrice ?? "",
    affiliate:       src.affiliate,
    rating:          src.rating,
    featured,
    addedDate:       ex?.addedDate ?? addedDate(i, aTools.length),
    // Keep richer category list from existing if available
    primaryCategory: ex?.primaryCategory ?? slugs[0] ?? "",
    categories:      ex?.categories ?? slugs,
    alternatives:    src.alternatives ?? [],
    overview:        ex?.overview ?? "",
    pros:            ex?.pros    ?? [],
    cons:            ex?.cons    ?? [],
    bestFor:         ex?.bestFor ?? [],
  };
});

await writeFile(
  join(ROOT, "src/data/tools.json"),
  JSON.stringify(newTools, null, 2) + "\n",
  "utf8"
);

const featuredCount = newTools.filter((t) => t.featured).length;
console.log(`✓ Imported ${newTools.length} tools (${featuredCount} featured)`);
