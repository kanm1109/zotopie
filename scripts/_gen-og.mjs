const sharp = require('./node_modules/sharp');
const path = require('path');

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#F5F3FF;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#EEF2FF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ECFDF5;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#7C3AED" />
      <stop offset="50%" style="stop-color:#6366F1" />
      <stop offset="100%" style="stop-color:#EC4899" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)" />

  <!-- Top accent bar -->
  <rect x="0" y="0" width="1200" height="6" fill="url(#accent)" />

  <!-- Card background -->
  <rect x="60" y="60" width="1080" height="510" rx="24" fill="white" opacity="0.85" />

  <!-- Logo circle -->
  <rect x="120" y="140" width="72" height="72" rx="16" fill="url(#accent)" />
  <text x="156" y="191" font-family="Arial, sans-serif" font-size="36" font-weight="900" fill="white" text-anchor="middle">Z</text>

  <!-- Brand name -->
  <text x="210" y="191" font-family="Arial, sans-serif" font-size="42" font-weight="900" fill="#0F172A" letter-spacing="-1">Zotopie</text>

  <!-- Main headline -->
  <text x="120" y="295" font-family="Arial, sans-serif" font-size="64" font-weight="900" fill="#0F172A" letter-spacing="-2">Find the Best</text>
  <text x="120" y="370">
    <tspan font-family="Arial, sans-serif" font-size="64" font-weight="900" letter-spacing="-2" fill="url(#accent)">Software Tools</tspan>
  </text>

  <!-- Subline -->
  <text x="120" y="435" font-family="Arial, sans-serif" font-size="28" fill="#647488" letter-spacing="0">Expert reviews. No fluff. Updated regularly.</text>

  <!-- Stats chips -->
  <rect x="120" y="470" width="200" height="44" rx="22" fill="#F5F3FF" />
  <text x="220" y="498" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#7C3AED" text-anchor="middle">100+ Reviews</text>

  <rect x="336" y="470" width="212" height="44" rx="22" fill="#F5F3FF" />
  <text x="442" y="498" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#7C3AED" text-anchor="middle">20 Categories</text>

  <rect x="564" y="470" width="238" height="44" rx="22" fill="#F5F3FF" />
  <text x="683" y="498" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#7C3AED" text-anchor="middle">100% Independent</text>

  <!-- Right decorative element -->
  <circle cx="980" cy="315" r="160" fill="#7C3AED" opacity="0.06" />
  <circle cx="980" cy="315" r="100" fill="#6366F1" opacity="0.08" />
  <circle cx="980" cy="315" r="50" fill="#7C3AED" opacity="0.12" />

  <!-- URL -->
  <text x="1080" y="555" font-family="Arial, sans-serif" font-size="20" fill="#9ca3af" text-anchor="end">zotopie.com</text>
</svg>`;

const outPath = path.join(__dirname, 'public/images/og-homepage.webp');

sharp(Buffer.from(svg))
  .webp({ quality: 90 })
  .toFile(outPath)
  .then(info => console.log('Created:', outPath, JSON.stringify(info)))
  .catch(err => console.error('Error:', err));
