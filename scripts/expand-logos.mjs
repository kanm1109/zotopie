import * as si from 'simple-icons';
import fs from 'fs';
import path from 'path';

// Map: tool slug → simple-icons slug
const SLUG_MAP = {
  // SEO
  'ahrefs':           'ahrefs',
  'moz':              'moz',
  'surfer-seo':       'surferseo',
  'rank-math':        'rankmath',
  'yoast-seo':        'yoast',
  'screaming-frog':   null,
  'ubersuggest':      null,
  'clearscope':       null,

  // Social
  'sprout-social':    'sproutsocial',
  'later':            null,
  'metricool':        null,
  'publer':           null,
  'agorapulse':       null,
  'sendible':         null,
  'tailwind':         null,
  'socialbee':        null,
  'planoly':          null,

  // Automation
  'pabbly-connect':   null,
  'ifttt':            'ifttt',
  'tray-io':          null,
  'workato':          null,
  'integrately':      null,
  'celigo':           null,

  // AI / Content
  'chatgpt':          'openai',
  'jasper':           null,
  'copy-ai':          null,
  'canva':            'canva',
  'midjourney':       null,
  'elevenlabs':       null,
  'grammarly':        'grammarly',
  'synthesia':        null,
  'heygen':           null,
  'dall-e':           'openai',
  'stable-diffusion': null,
  'd-id':             null,
  'gemini':           'googlegemini',

  // Community
  'skool':            null,
  'patreon':          'patreon',
  'mighty-networks':  null,
  'bettermode':       null,
  'slack':            'slack',
  'discourse':        'discourse',
  'microsoft-teams':  'microsoftteams',

  // Email
  'ghost':            'ghost',
  'activecampaign':   'activecampaign',
  'hubspot':          'hubspot',
  'mailchimp':        'mailchimp',
  'systeme-io':       null,
  'getresponse':      'getresponse',
  'brevo':            'brevo',
  'beehiiv':          null,
  'clickfunnels':     null,
  'mailerlite':       'mailerlite',

  // Link Tracking
  'voluum':           null,
  'clickmagick':      null,
  'redtrack':         null,
  'rebrandly':        'rebrandly',
  'tinyurl':          null,
  'blink':            null,
  'bemob':            null,
  'pretty-links':     null,

  // Analytics
  'hotjar':           'hotjar',
  'amplitude':        'amplitude',
  'fathom':           null,
  'matomo':           'matomo',
  'crazy-egg':        null,
  'microsoft-clarity':'microsoftclarity',

  // Productivity
  'monday':           'monday',
  'asana':            'asana',
  'todoist':          'todoist',
  'coda':             'coda',

  // Hosting
  'vultr':            'vultr',
  'hostinger':        'hostinger',
  'siteground':       null,
  'bluehost':         null,
  'namecheap':        'namecheap',
  'wp-engine':        null,
  'kinsta':           null,
  'linode':           'linode',
  'hetzner':          'hetzner',
  'godaddy':          'godaddy',

  // Ecommerce
  'woocommerce':      'woocommerce',
  'lemon-squeezy':    'lemonsqueezy',
  'bigcommerce':      'bigcommerce',
  'wix':              'wix',
  'squarespace':      'squarespace',
  'sendowl':          null,
  'payhip':           null,
  'samcart':          null,
  'wordpress':        'wordpress',
  'magento':          'adobecommerce',
  'paddle':           'paddle',
  'thrivecart':       null,
  'kartra':           null,

  // Misc
  'salesforce':       'salesforce',
};

// Look up each icon in simple-icons
function lookupIcon(slug) {
  if (!slug) return null;
  // simple-icons key format: 'si' + capitalized slug
  const key = 'si' + slug.charAt(0).toUpperCase() + slug.slice(1);
  const icon = si[key];
  if (icon) return icon;

  // Try without hyphens/dots
  const key2 = 'si' + slug.replace(/[-_.]/g, '').charAt(0).toUpperCase() +
                       slug.replace(/[-_.]/g, '').slice(1);
  return si[key2] || null;
}

// Load existing data
const toolsPath = path.resolve('src/data/generated/tools-enriched.json');
const iconDataPath = path.resolve('src/data/generated/icon-data.json');

const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
const iconData = JSON.parse(fs.readFileSync(iconDataPath, 'utf8'));

let found = 0;
let notFound = 0;
const report = [];

// Update tools-enriched.json
for (const tool of tools) {
  if (tool.simple_icon && tool.simple_icon !== '') continue; // already has icon

  const siSlug = SLUG_MAP[tool.slug];
  if (!siSlug) {
    notFound++;
    report.push({ slug: tool.slug, name: tool.name, status: 'no_mapping', siSlug: null });
    continue;
  }

  const icon = lookupIcon(siSlug);
  if (!icon) {
    notFound++;
    report.push({ slug: tool.slug, name: tool.name, status: 'not_in_si', siSlug });
    console.warn(`NOT FOUND in simple-icons: ${tool.name} → ${siSlug}`);
    continue;
  }

  // Found!
  tool.simple_icon = siSlug;
  iconData[siSlug] = { hex: icon.hex, path: icon.path };
  found++;
  report.push({ slug: tool.slug, name: tool.name, status: 'found', siSlug, hex: icon.hex });
}

// Write updated files
fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), 'utf8');
fs.writeFileSync(iconDataPath, JSON.stringify(iconData, null, 2), 'utf8');

// Summary
const hasIcon = tools.filter(t => t.simple_icon && t.simple_icon !== '').length;
console.log('\n✅ Logo expansion complete');
console.log(`New icons added: ${found}`);
console.log(`Tools now with icon: ${hasIcon} / ${tools.length}`);
console.log(`Still using fallback: ${tools.length - hasIcon}`);

// Detail report
console.log('\n--- Not found ---');
report.filter(r => r.status !== 'found').forEach(r => {
  console.log(`  ${r.name} (${r.slug}): ${r.status}`);
});
