import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const BASE = process.cwd();
const LOGOS_DIR = join(BASE, "public", "logos");
const TIMEOUT_MS = 15_000;

const logoMapping = JSON.parse(
  await readFile("src/data/logo-mapping.json", "utf8")
);
const tools = JSON.parse(await readFile("src/data/tools.json", "utf8"));

await mkdir(LOGOS_DIR, { recursive: true });

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

const succeeded = new Set();

console.log(`\nDownloading ${logoMapping.length} logos...\n`);

for (const entry of logoMapping) {
  const slug = toSlug(entry.tool_name);
  const outPath = join(LOGOS_DIR, `${slug}.svg`);

  try {
    const res = await fetch(entry.logo_url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("svg") && !contentType.includes("xml")) {
      throw new Error(`Not SVG (${contentType})`);
    }
    const svg = await res.text();
    await writeFile(outPath, svg, "utf8");
    succeeded.add(entry.tool_name);
    console.log(`  ✓  ${entry.tool_name}  →  ${slug}.svg`);
  } catch (err) {
    console.log(`  ✗  ${entry.tool_name}  (${err.message})`);
  }
}

// Match logo-mapping entries to tools.json by name (case-insensitive)
let changed = 0;
for (const tool of tools) {
  const match = logoMapping.find(
    (e) => e.tool_name.toLowerCase() === tool.name.toLowerCase()
  );
  if (match && succeeded.has(match.tool_name)) {
    tool.logo = `/logos/${tool.slug}.svg`;
    changed++;
  }
}

if (changed > 0) {
  await writeFile(
    "src/data/tools.json",
    JSON.stringify(tools, null, 2) + "\n",
    "utf8"
  );
  console.log(`\n✓  tools.json updated (${changed} logo(s) set)`);
} else {
  console.log("\n—  tools.json unchanged (no matches or all downloads failed)");
}

console.log(
  `\nDone: ${succeeded.size}/${logoMapping.length} downloaded successfully.\n`
);
