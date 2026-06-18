import { readFileSync, writeFileSync } from "fs";
const prices = {
  "midjourney":      "$10/mo",
  "hubspot":         "$20/mo",
  "skool":           "$99/mo",
  "lemon-squeezy":   "$29/mo",
  "circle":          "$89/mo",
  "claude":          "$20/mo",
  "activecampaign":  "$15/mo",
  "siteground":      "$2.99/mo",
  "kinsta":          "$35/mo",
  "clickup":         "$7/user/mo"
};
let tools = JSON.parse(readFileSync("./src/data/tools.json","utf8"));
tools = tools.map(t => prices[t.slug] ? {...t, startingPrice: prices[t.slug]} : t);
writeFileSync("./src/data/tools.json", JSON.stringify(tools, null, 2) + "\n");
const fixed = tools.filter(t=>prices[t.slug]);
console.log("Fixed:", fixed.map(t=>t.slug+":"+t.startingPrice).join(", "));
