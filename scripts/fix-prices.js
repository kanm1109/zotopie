const fs = require("fs");
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
let tools = JSON.parse(fs.readFileSync("./src/data/tools.json","utf8"));
tools = tools.map(t => prices[t.slug] ? {...t, startingPrice: prices[t.slug]} : t);
fs.writeFileSync("./src/data/tools.json", JSON.stringify(tools, null, 2) + "\n");
console.log("Fixed startingPrice for", Object.keys(prices).length, "tools");
