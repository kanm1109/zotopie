import { readFileSync } from "fs";
const tools = JSON.parse(readFileSync("./src/data/tools.json","utf8"));
const noPros = tools.filter(t => !t.pros || t.pros.length === 0);
console.log("Tools without pros/cons:", noPros.length);
noPros.forEach(t => console.log(t.slug, "| overview words:", t.overview ? t.overview.split(" ").length : 0));
