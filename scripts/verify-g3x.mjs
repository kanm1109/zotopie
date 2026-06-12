import { readFileSync } from "fs";
const tools = JSON.parse(readFileSync("./src/data/tools.json","utf8"));

const noPros = tools.filter(t => !t.pros || t.pros.length === 0);
const hasAll = tools.filter(t => t.pros && t.pros.length > 0 && t.overview && t.overview.length > 100);
const noOverview = tools.filter(t => !t.overview || t.overview.length < 50);
const boilerplate = tools.filter(t => t.overview && t.overview.includes("According to its official website"));

console.log("Total tools:", tools.length);
console.log("No pros/cons:", noPros.length);
if (noPros.length > 0) noPros.forEach(t => console.log(" -", t.slug));
console.log("Has overview+pros:", hasAll.length);
console.log("No/short overview:", noOverview.length);
console.log("Boilerplate:", boilerplate.length);

// Count compare pairs where both tools have pros
const alts = JSON.parse(readFileSync("./src/data/alternatives.json","utf8"));
const toolMap = new Map(tools.map(t => [t.slug, t]));
const pairs = new Set();
alts.forEach(entry => {
  const slug = entry.tool.toLowerCase().replace(/[^a-z0-9]+/g,"-");
  entry.alternatives.forEach(alt => {
    const pair = [slug, alt].sort().join("---");
    pairs.add(pair);
  });
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
console.log("\nCompare pair metrics (from alternatives.json only):");
console.log("Total pairs:", total);
console.log("Both enriched:", bothEnriched, `(${Math.round(bothEnriched/total*100)}%)`);
console.log("One enriched:", oneEnriched, `(${Math.round(oneEnriched/total*100)}%)`);
console.log("Neither enriched:", noneEnriched, `(${Math.round(noneEnriched/total*100)}%)`);
