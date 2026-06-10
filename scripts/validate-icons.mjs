import * as si from 'simple-icons';

const slugToKey = s => 'si' + s.charAt(0).toUpperCase() + s.slice(1);

const mappings = [
  { tool: 'Notion',           slug: 'notion' },
  { tool: 'ClickUp',          slug: 'clickup' },
  { tool: 'Obsidian',         slug: 'obsidian' },
  { tool: 'Trello',           slug: 'trello' },
  { tool: 'Airtable',         slug: 'airtable' },
  { tool: 'Buffer',           slug: 'buffer' },
  { tool: 'Metricool',        slug: 'metricool' },
  { tool: 'Publer',           slug: 'publer' },
  { tool: 'SocialBee',        slug: 'socialbee' },
  { tool: 'Sendible',         slug: 'sendible' },
  { tool: 'Sprout Social',    slug: 'sproutsocial' },
  { tool: 'Hootsuite',        slug: 'hootsuite' },
  { tool: 'Canva',            slug: 'canva' },
  { tool: 'ChatGPT',          slug: 'openai' },
  { tool: 'Claude',           slug: 'anthropic' },
  { tool: 'Jasper',           slug: 'jasper' },
  { tool: 'Copy.ai',          slug: 'copydotai' },
  { tool: 'Writesonic',       slug: 'writesonic' },
  { tool: 'Midjourney',       slug: 'midjourney' },
  { tool: 'Leonardo AI',      slug: 'leonardoai' },
  { tool: 'Semrush',          slug: 'semrush' },
  { tool: 'Ahrefs',           slug: 'ahrefs' },
  { tool: 'SE Ranking',       slug: 'seranking' },
  { tool: 'Mangools',         slug: 'mangools' },
  { tool: 'Ubersuggest',      slug: 'neilpatel' },
  { tool: 'Surfer SEO',       slug: 'surfcshark' },
  { tool: 'Frase',            slug: 'framer' },
  { tool: 'Hunter',           slug: 'hunter' },
  { tool: 'Apollo',           slug: 'apollographql' },
  { tool: 'Snov.io',          slug: 'snowflake' },
  { tool: 'Instantly',        slug: 'instacart' },
  { tool: 'Lemlist',          slug: 'maildotru' },
  { tool: 'Beehiiv',          slug: 'beehiiv' },
  { tool: 'ConvertKit',       slug: 'kit' },
  { tool: 'Substack',         slug: 'substack' },
  { tool: 'Discord',          slug: 'discord' },
  { tool: 'Circle',           slug: 'circle' },
  { tool: 'Zapier',           slug: 'zapier' },
  { tool: 'Make',             slug: 'make' },
  { tool: 'n8n',              slug: 'n8n' },
  { tool: 'Pabbly Connect',   slug: 'pabbly' },
  { tool: 'Google Analytics', slug: 'googleanalytics' },
  { tool: 'Mixpanel',         slug: 'mixpanel' },
  { tool: 'Plausible',        slug: 'plausibleanalytics' },
  { tool: 'Bitly',            slug: 'bitly' },
  { tool: 'Rebrandly',        slug: 'rebrandly' },
  { tool: 'Dub',              slug: 'dub' },
  { tool: 'Cloudflare',       slug: 'cloudflare' },
  { tool: 'DigitalOcean',     slug: 'digitalocean' },
  { tool: 'Shopify',          slug: 'shopify' },
  { tool: 'Gumroad',          slug: 'gumroad' },
];

let ok = 0, miss = 0;
for (const m of mappings) {
  const key = slugToKey(m.slug);
  const icon = si[key];
  if (icon) {
    console.log(`OK   ${m.tool.padEnd(20)} ${m.slug.padEnd(22)} #${icon.hex}`);
    ok++;
  } else {
    console.log(`MISS ${m.tool.padEnd(20)} ${m.slug.padEnd(22)} (key: ${key})`);
    miss++;
  }
}
console.log(`\nFound: ${ok}  Missing: ${miss}`);
