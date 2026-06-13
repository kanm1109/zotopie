import * as si from 'simple-icons';
import fs from 'fs';

const tools = JSON.parse(fs.readFileSync('src/data/generated/tools-enriched.json', 'utf8'));
const iconData = JSON.parse(fs.readFileSync('src/data/generated/icon-data.json', 'utf8'));

const extra = {
  'elevenlabs': 'elevenlabs',
  'kinsta':     'kinsta',
  'wp-engine':  'wpengine',
};

function getIcon(siSlug) {
  const key = 'si' + siSlug.charAt(0).toUpperCase() + siSlug.slice(1);
  return si[key] || null;
}

let added = 0;
for (const tool of tools) {
  const siSlug = extra[tool.slug];
  if (!siSlug) continue;
  if (tool.simple_icon) continue;
  const icon = getIcon(siSlug);
  if (!icon) { console.log('NOT FOUND:', tool.name, siSlug); continue; }
  tool.simple_icon = siSlug;
  iconData[siSlug] = { hex: icon.hex, path: icon.path };
  console.log('Added:', tool.name, '->', siSlug, 'hex=' + icon.hex);
  added++;
}

fs.writeFileSync('src/data/generated/tools-enriched.json', JSON.stringify(tools, null, 2), 'utf8');
fs.writeFileSync('src/data/generated/icon-data.json', JSON.stringify(iconData, null, 2), 'utf8');
console.log(`\nAdded ${added} icons. Total with icon: ${tools.filter(t => t.simple_icon).length}/${tools.length}`);
