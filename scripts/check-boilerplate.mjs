import { readFileSync } from "fs";
const tools = JSON.parse(readFileSync("./src/data/tools.json","utf8"));
const boilerplate = tools.filter(t => t.overview && t.overview.includes("According to its official website"));
console.log("Boilerplate tools:", boilerplate.length);
boilerplate.forEach(t => console.log(t.slug));
