import { readFileSync } from "fs";
const tools = JSON.parse(readFileSync("./src/data/tools.json","utf8"));

// Full 439 pairs including tools.json alternatives
const toolMap = new Map(tools.map(t => [t.slug, t]));
const pairs = new Set();
const alts = JSON.parse(readFileSync("./src/data/alternatives.json","utf8"));
const altMap = new Map(alts.map(a => [a.tool.toLowerCase().replace(/[^a-z0-9]+/g,"-"), a.alternatives]));

// From alternatives.json (100 tools)
alts.forEach(entry => {
  const slug = entry.tool.toLowerCase().replace(/[^a-z0-9]+/g,"-");
  entry.alternatives.forEach(alt => {
    const pair = [slug, alt].sort().join("---");
    pairs.add(pair);
  });
});

// From tools.json (19 tools with inline alternatives)
tools.forEach(t => {
  if (t.alternatives && t.alternatives.length > 0 && !altMap.has(t.slug)) {
    t.alternatives.forEach(alt => {
      const pair = [t.slug, alt].sort().join("---");
      pairs.add(pair);
    });
  }
});

let bothEnriched = 0, oneEnriched = 0, noneEnriched = 0;
pairs.forEach(pair => {
  const [a, b] = pair.split("---");
  const toolA = toolMap.get(a);
  const toolB = toolMap.get(b);
  const aHas = toolA && toolA.pros && toolA.pros.length > 0;
  const bHas = toolB && toolB.pros && toolB.pros.length > 0;
  if (aHas && bHas) bothEnriched++;
  else if (aHas || bHas) oneEnriched++;
  else noneEnriched++;
});

const total = pairs.size;
console.log("Full 439-pair metrics:");
console.log("Total pairs:", total);
console.log("Both enriched:", bothEnriched, `(${Math.round(bothEnriched/total*100)}%)`);
console.log("One enriched:", oneEnriched, `(${Math.round(oneEnriched/total*100)}%)`);
console.log("Neither enriched:", noneEnriched, `(${Math.round(noneEnriched/total*100)}%)`);
