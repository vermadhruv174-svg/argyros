const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../apps/web/public/images/products');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const PRODUCTS_TO_GENERATE = [
  {
    slug: 'nova-halo-ring',
    name: 'Nova Halo Ring',
    purity: 'Solid 925 Sterling Silver',
    category: 'Rings',
    views: [
      { key: 'hero', label: 'Primary Atelier Hero', subtitle: 'Front elevation · 1.8mm band', svgSymbol: 'halo-front' },
      { key: 'on-body', label: 'On-Body Scale View', subtitle: 'Worn on index finger · IN 14', svgSymbol: 'worn-hand' },
      { key: 'detail', label: 'Macro Craftsmanship', subtitle: 'Hand-burnished comfort arc', svgSymbol: 'macro-edge' },
      { key: 'profile', label: 'Side Profile View', subtitle: 'Bevelled shank & crown height', svgSymbol: 'side-profile' },
      { key: 'packaging', label: 'Atelier Keepsake Box', subtitle: 'Rigid navy box & microsuede pouch', svgSymbol: 'packaging' },
      { key: 'hallmark', label: 'Bench Inscription Stamp', subtitle: 'Solid 925 purity & karigar mark', svgSymbol: 'hallmark' },
    ],
  },
  {
    slug: 'equinox-statement-ring',
    name: 'Equinox Statement Ring',
    purity: 'Solid 925 Sterling Silver',
    category: 'Rings',
    views: [
      { key: 'hero', label: 'Primary Atelier Hero', subtitle: 'Wide architectural band · Satin face', svgSymbol: 'band-front' },
      { key: 'on-body', label: 'On-Body Scale View', subtitle: '8.8g presence · Middle finger wear', svgSymbol: 'worn-hand' },
      { key: 'detail', label: 'Macro Craftsmanship', subtitle: 'Razor mirror bevel contrast', svgSymbol: 'macro-edge' },
      { key: 'profile', label: 'Side Profile View', subtitle: 'Concave ergonomic comfort taper', svgSymbol: 'side-profile' },
      { key: 'packaging', label: 'Atelier Keepsake Box', subtitle: 'Rigid navy box & authenticity card', svgSymbol: 'packaging' },
      { key: 'hallmark', label: 'Bench Inscription Stamp', subtitle: 'Inner shank 925 mark', svgSymbol: 'hallmark' },
    ],
  },
  {
    slug: 'luna-hoop-earrings',
    name: 'Luna Hoop Earrings',
    purity: 'Solid 925 Sterling Silver',
    category: 'Earrings',
    views: [
      { key: 'hero', label: 'Primary Atelier Hero', subtitle: 'Seamless hollow-core hoops · 30mm', svgSymbol: 'hoop-front' },
      { key: 'on-body', label: 'On-Body Scale View', subtitle: 'Ear lobe drape & face framing', svgSymbol: 'worn-ear' },
      { key: 'detail', label: 'Macro Craftsmanship', subtitle: 'Integrated snap-click closure', svgSymbol: 'macro-clasp' },
      { key: 'profile', label: 'Profile Silhouette', subtitle: 'Toroidal tubular curvature', svgSymbol: 'side-profile' },
      { key: 'packaging', label: 'Atelier Keepsake Box', subtitle: 'Rigid navy box & travel pouch', svgSymbol: 'packaging' },
      { key: 'hallmark', label: 'Bench Inscription Stamp', subtitle: 'Post-stamped 925 authentication', svgSymbol: 'hallmark' },
    ],
  },
  {
    slug: 'siddhi-heirloom-kada',
    name: 'Siddhi Heirloom Kada',
    purity: 'Solid 925 Sterling Silver',
    category: 'Bracelets',
    views: [
      { key: 'hero', label: 'Primary Atelier Hero', subtitle: 'Over 24g solid silver · Fluted crest', svgSymbol: 'kada-front' },
      { key: 'on-body', label: 'On-Body Scale View', subtitle: 'Wrist drape & architectural mass', svgSymbol: 'worn-wrist' },
      { key: 'detail', label: 'Macro Craftsmanship', subtitle: 'Concealed bench spring hinge', svgSymbol: 'macro-clasp' },
      { key: 'profile', label: 'Cross-Section Profile', subtitle: 'Tapered terminal contour', svgSymbol: 'side-profile' },
      { key: 'packaging', label: 'Atelier Keepsake Box', subtitle: 'Large luxury drawer keepsake', svgSymbol: 'packaging' },
      { key: 'hallmark', label: 'Bench Inscription Stamp', subtitle: 'Deep inner-wall 925 punch', svgSymbol: 'hallmark' },
    ],
  },
  {
    slug: 'celestine-choker',
    name: 'Celestine Choker',
    purity: 'Solid 925 Sterling Silver',
    category: 'Necklaces',
    views: [
      { key: 'hero', label: 'Primary Atelier Hero', subtitle: '1.8mm square box link collar', svgSymbol: 'chain-front' },
      { key: 'on-body', label: 'On-Body Scale View', subtitle: 'Flush collarbone drape · 16"', svgSymbol: 'worn-neck' },
      { key: 'detail', label: 'Macro Craftsmanship', subtitle: 'Custom swivel lobster lock', svgSymbol: 'macro-clasp' },
      { key: 'profile', label: 'Link Articulation', subtitle: 'Interlocking geometric box links', svgSymbol: 'side-profile' },
      { key: 'packaging', label: 'Atelier Keepsake Box', subtitle: 'Rigid necklace case & care cloth', svgSymbol: 'packaging' },
      { key: 'hallmark', label: 'Bench Inscription Stamp', subtitle: 'Tag stamped 925 fineness', svgSymbol: 'hallmark' },
    ],
  },
];

function generateSvgMarkup(p, view) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e1d33" />
      <stop offset="50%" stop-color="#0a1628" />
      <stop offset="100%" stop-color="#050b14" />
    </linearGradient>
    <radialGradient id="silverGlow" cx="50%" cy="45%" r="40%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18" />
      <stop offset="50%" stop-color="#c5a028" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="silverSheen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#d1d5db" />
      <stop offset="70%" stop-color="#9ca3af" />
      <stop offset="100%" stop-color="#e5e7eb" />
    </linearGradient>
    <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e6ca65" />
      <stop offset="100%" stop-color="#b8923a" />
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="800" height="1000" fill="url(#bgGrad)" />
  <circle cx="400" cy="450" r="380" fill="url(#silverGlow)" />

  <!-- Subtle Precision Framing Grid -->
  <rect x="36" y="36" width="728" height="928" fill="none" stroke="#b8923a" stroke-opacity="0.22" stroke-width="1" />
  <rect x="44" y="44" width="712" height="912" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1" />
  <circle cx="400" cy="450" r="240" fill="none" stroke="#b8923a" stroke-opacity="0.12" stroke-width="1" stroke-dasharray="3,6" />

  <!-- Header Metadata -->
  <text x="70" y="90" font-family="'Cinzel', 'Times New Roman', serif" font-size="16" letter-spacing="4" fill="#b8923a" font-weight="bold">ARGYROS 925</text>
  <text x="730" y="90" text-anchor="end" font-family="-apple-system, sans-serif" font-size="11" letter-spacing="3" fill="#ffffff" fill-opacity="0.5" text-transform="uppercase">HALDWANI ATELIER</text>
  <line x1="70" y1="108" x2="730" y2="108" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />

  <!-- Central Visual Representation -->
  <g transform="translate(400, 450)">
    <!-- Central Halo / Sculpture Contour -->
    <circle cx="0" cy="0" r="140" fill="none" stroke="url(#silverSheen)" stroke-width="14" />
    <circle cx="0" cy="0" r="126" fill="none" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1" />
    <circle cx="0" cy="0" r="154" fill="none" stroke="#000000" stroke-opacity="0.4" stroke-width="1" />
    <ellipse cx="0" cy="-6" rx="100" ry="24" fill="none" stroke="url(#silverSheen)" stroke-width="4" stroke-opacity="0.5" />

    <!-- Center Monogram Seal -->
    <circle cx="0" cy="0" r="42" fill="#0a1628" stroke="url(#goldAccent)" stroke-width="1.5" />
    <text x="0" y="10" text-anchor="middle" font-family="'Cinzel', 'Times New Roman', serif" font-size="28" fill="#e6ca65" font-weight="300">A</text>
    <text x="0" y="24" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="7" letter-spacing="2" fill="#ffffff" fill-opacity="0.6">925</text>

    <!-- Perspective / Technical Dimension Ticks -->
    <line x1="-165" y1="0" x2="-145" y2="0" stroke="#b8923a" stroke-width="1.5" />
    <line x1="145" y1="0" x2="165" y2="0" stroke="#b8923a" stroke-width="1.5" />
    <line x1="0" y1="-165" x2="0" y2="-145" stroke="#b8923a" stroke-width="1.5" />
    <line x1="0" y1="145" x2="0" y2="165" stroke="#b8923a" stroke-width="1.5" />
  </g>

  <!-- Spec Inscription Badge -->
  <g transform="translate(400, 720)">
    <rect x="-180" y="-18" width="360" height="36" rx="18" fill="#000000" fill-opacity="0.45" stroke="#b8923a" stroke-opacity="0.4" stroke-width="1" />
    <circle cx="-150" cy="0" r="4" fill="#b8923a" />
    <text x="0" y="5" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="11" letter-spacing="2.5" fill="#ffffff" font-weight="600" text-transform="uppercase">${view.label}</text>
  </g>

  <!-- Lower Details Block -->
  <text x="400" y="795" text-anchor="middle" font-family="'Cinzel', 'Times New Roman', serif" font-size="30" fill="#ffffff" font-weight="400" letter-spacing="1">${p.name}</text>
  <text x="400" y="828" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="13" fill="#b8923a" letter-spacing="2" font-weight="500">${p.purity}</text>
  <text x="400" y="855" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="12" fill="#ffffff" fill-opacity="0.6" font-style="italic">${view.subtitle}</text>

  <!-- Base Guarantee Inscription -->
  <line x1="70" y1="900" x2="730" y2="900" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
  <text x="70" y="925" font-family="-apple-system, sans-serif" font-size="10" letter-spacing="2" fill="#ffffff" fill-opacity="0.4" text-transform="uppercase">HOUSE OF SIDDHI JEWELLERS</text>
  <text x="730" y="925" text-anchor="end" font-family="-apple-system, sans-serif" font-size="10" letter-spacing="2" fill="#b8923a" font-weight="bold" text-transform="uppercase">BENCH CRAFTED · MADE TO ORDER</text>
</svg>`;
}

for (const p of PRODUCTS_TO_GENERATE) {
  for (let i = 0; i < p.views.length; i++) {
    const view = p.views[i];
    const fileName = `${p.slug}-${i + 1}-${view.key}.svg`;
    const filePath = path.join(targetDir, fileName);
    const svgContent = generateSvgMarkup(p, view);
    fs.writeFileSync(filePath, svgContent, 'utf-8');
    console.log(`Generated: ${fileName}`);
  }
}

console.log('Successfully generated all unique product media assets.');
