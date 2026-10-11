const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../apps/web/public/images/products');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const ALL_PRODUCTS = [
  {
    slug: 'nova-halo-ring',
    name: 'Nova Halo Ring',
    purity: 'Solid 925 Sterling Silver',
    category: 'Rings',
    symbol: 'halo',
    weight: '4.2g',
    views: [
      { key: 'hero', label: 'Primary Atelier Hero', subtitle: 'Front elevation · 1.8mm halo band' },
      { key: 'on-body', label: 'On-Body Scale View', subtitle: 'Worn on index finger · IN 14' },
      { key: 'detail', label: 'Macro Craftsmanship', subtitle: 'Hand-burnished comfort arc' },
      { key: 'profile', label: 'Side Profile View', subtitle: 'Bevelled shank & crown height' },
      { key: 'packaging', label: 'Atelier Keepsake Box', subtitle: 'Rigid navy box & microsuede pouch' },
      { key: 'hallmark', label: 'Bench Inscription Stamp', subtitle: 'Solid 925 purity & karigar mark' },
    ],
  },
  {
    slug: 'equinox-statement-ring',
    name: 'Equinox Statement Ring',
    purity: 'Solid 925 Sterling Silver',
    category: 'Rings',
    symbol: 'wide-band',
    weight: '8.8g',
    views: [
      { key: 'hero', label: 'Primary Atelier Hero', subtitle: 'Wide architectural band · Satin face' },
      { key: 'on-body', label: 'On-Body Scale View', subtitle: '8.8g presence · Middle finger wear' },
      { key: 'detail', label: 'Macro Craftsmanship', subtitle: 'Razor mirror bevel contrast' },
      { key: 'profile', label: 'Side Profile View', subtitle: 'Concave ergonomic comfort taper' },
      { key: 'packaging', label: 'Atelier Keepsake Box', subtitle: 'Rigid navy box & authenticity card' },
      { key: 'hallmark', label: 'Bench Inscription Stamp', subtitle: 'Inner shank 925 mark' },
    ],
  },
  {
    slug: 'meridian-signet-ring',
    name: 'Meridian Signet Ring',
    purity: 'Solid 925 Sterling Silver',
    category: 'Rings',
    symbol: 'signet',
    weight: '6.5g',
    views: [
      { key: 'hero', label: 'Primary Atelier Hero', subtitle: 'Cushion signet plate · Mirror polish face' },
      { key: 'on-body', label: 'On-Body Scale View', subtitle: 'Pinky or ring finger sculptural fit' },
      { key: 'detail', label: 'Macro Craftsmanship', subtitle: 'Solid head casting & monogram plane' },
      { key: 'profile', label: 'Side Profile View', subtitle: 'Hefty shoulder taper to undergallery' },
      { key: 'packaging', label: 'Atelier Keepsake Box', subtitle: 'Signature velvet interior box' },
      { key: 'hallmark', label: 'Bench Inscription Stamp', subtitle: 'Under-crown deep 925 laser hallmark' },
    ],
  },
  {
    slug: 'vesta-solitaire-band',
    name: 'Vesta Solitaire Band',
    purity: 'Solid 925 Sterling Silver',
    category: 'Rings',
    symbol: 'taper-band',
    weight: '4.8g',
    views: [
      { key: 'hero', label: 'Primary Atelier Hero', subtitle: 'Organic tapering contour · Comfort shank' },
      { key: 'on-body', label: 'On-Body Scale View', subtitle: 'Stacking silhouette with Nova Halo' },
      { key: 'detail', label: 'Macro Craftsmanship', subtitle: 'Fluid cold-hammered finish' },
      { key: 'profile', label: 'Side Profile View', subtitle: 'Asymmetric sculptural crest' },
      { key: 'packaging', label: 'Atelier Keepsake Box', subtitle: 'Protective navy rigid case' },
      { key: 'hallmark', label: 'Bench Inscription Stamp', subtitle: 'Precision inner wall 925 hallmark' },
    ],
  },
  {
    slug: 'luna-hoop-earrings',
    name: 'Luna Hoop Earrings',
    purity: 'Solid 925 Sterling Silver',
    category: 'Earrings',
    symbol: 'hoop',
    weight: '5.8g',
    views: [
      { key: 'hero', label: 'Primary Atelier Hero', subtitle: 'Seamless hollow-core hoops · 30mm' },
      { key: 'on-body', label: 'On-Body Scale View', subtitle: 'Ear lobe drape & face framing' },
      { key: 'detail', label: 'Macro Craftsmanship', subtitle: 'Integrated snap-click closure' },
      { key: 'profile', label: 'Profile Silhouette', subtitle: 'Toroidal tubular curvature' },
      { key: 'packaging', label: 'Atelier Keepsake Box', subtitle: 'Rigid navy box & travel pouch' },
      { key: 'hallmark', label: 'Bench Inscription Stamp', subtitle: 'Post-stamped 925 authentication' },
    ],
  },
  {
    slug: 'aura-stud-earrings',
    name: 'Aura Stud Earrings',
    purity: 'Solid 925 Sterling Silver',
    category: 'Earrings',
    symbol: 'stud',
    weight: '3.6g',
    views: [
      { key: 'hero', label: 'Primary Atelier Hero', subtitle: 'Minimalist dome stud · 6mm mirror surface' },
      { key: 'on-body', label: 'On-Body Scale View', subtitle: 'Lobe elevation with double-notch post' },
      { key: 'detail', label: 'Macro Craftsmanship', subtitle: 'Sterling silver butterfly scroll backs' },
      { key: 'profile', label: 'Side Profile View', subtitle: 'Spherical calotte dome profile' },
      { key: 'packaging', label: 'Atelier Keepsake Box', subtitle: 'Compact velvet studs presentation' },
      { key: 'hallmark', label: 'Bench Inscription Stamp', subtitle: 'Ear post stamped solid 925 hallmark' },
    ],
  },
  {
    slug: 'kumaon-drop-earrings',
    name: 'Kumaon Drop Earrings',
    purity: 'Solid 925 Sterling Silver',
    category: 'Earrings',
    symbol: 'drop',
    weight: '5.8g',
    views: [
      { key: 'hero', label: 'Primary Atelier Hero', subtitle: 'Articulated Pahadi filigree drop · 38mm' },
      { key: 'on-body', label: 'On-Body Scale View', subtitle: 'Kinetic swing & jawline accent' },
      { key: 'detail', label: 'Macro Craftsmanship', subtitle: 'Hand-twisted wirework & hinge links' },
      { key: 'profile', label: 'Side Profile View', subtitle: 'Ultralight articulated drape' },
      { key: 'packaging', label: 'Atelier Keepsake Box', subtitle: 'Rigid gift box & anti-tarnish cloth' },
      { key: 'hallmark', label: 'Bench Inscription Stamp', subtitle: 'Drop clasp stamped 925 hallmark' },
    ],
  },
  {
    slug: 'solace-pendant',
    name: 'Solace Pendant',
    purity: 'Solid 925 Sterling Silver',
    category: 'Necklaces',
    symbol: 'teardrop',
    weight: '5.2g',
    views: [
      { key: 'hero', label: 'Primary Atelier Hero', subtitle: 'Sculptural teardrop talisman · 18" chain' },
      { key: 'on-body', label: 'On-Body Scale View', subtitle: 'Chestbone drape on diamond-cut chain' },
      { key: 'detail', label: 'Macro Craftsmanship', subtitle: 'Organic hollow-back fluid polish' },
      { key: 'profile', label: 'Side Profile View', subtitle: 'Concealed integral bail suspension' },
      { key: 'packaging', label: 'Atelier Keepsake Box', subtitle: 'Long necklace drawer box' },
      { key: 'hallmark', label: 'Bench Inscription Stamp', subtitle: 'Talisman reverse & tag 925 stamp' },
    ],
  },
  {
    slug: 'celestine-choker',
    name: 'Celestine Choker',
    purity: 'Solid 925 Sterling Silver',
    category: 'Necklaces',
    symbol: 'box-chain',
    weight: '8.4g',
    views: [
      { key: 'hero', label: 'Primary Atelier Hero', subtitle: '1.8mm square box link collar' },
      { key: 'on-body', label: 'On-Body Scale View', subtitle: 'Flush collarbone drape · 16"' },
      { key: 'detail', label: 'Macro Craftsmanship', subtitle: 'Custom swivel lobster lock' },
      { key: 'profile', label: 'Link Articulation', subtitle: 'Interlocking geometric box links' },
      { key: 'packaging', label: 'Atelier Keepsake Box', subtitle: 'Rigid necklace case & care cloth' },
      { key: 'hallmark', label: 'Bench Inscription Stamp', subtitle: 'Tag stamped 925 fineness' },
    ],
  },
  {
    slug: 'trishul-peak-medallion',
    name: 'Trishul Peak Medallion',
    purity: 'Solid 925 Sterling Silver',
    category: 'Necklaces',
    symbol: 'mountain',
    weight: '7.1g',
    views: [
      { key: 'hero', label: 'Primary Atelier Hero', subtitle: 'Mount Trishul topographic contour medallion' },
      { key: 'on-body', label: 'On-Body Scale View', subtitle: 'Substantial 25mm medallion presence' },
      { key: 'detail', label: 'Macro Craftsmanship', subtitle: 'Relief contour lines with oxidised depths' },
      { key: 'profile', label: 'Side Profile View', subtitle: 'Solid 2.2mm disc coin gauge' },
      { key: 'packaging', label: 'Atelier Keepsake Box', subtitle: 'Pahadi heritage keepsake case' },
      { key: 'hallmark', label: 'Bench Inscription Stamp', subtitle: 'Medallion rim 925 purity hallmark' },
    ],
  },
  {
    slug: 'hansli-minimal-collar',
    name: 'Hansli Minimal Collar',
    purity: 'Solid 925 Sterling Silver',
    category: 'Necklaces',
    symbol: 'torque',
    weight: '18.5g',
    views: [
      { key: 'hero', label: 'Primary Atelier Hero', subtitle: 'Ancestral Pahadi torque neck ring · 18.5g' },
      { key: 'on-body', label: 'On-Body Scale View', subtitle: 'Sculptural collarbone framing' },
      { key: 'detail', label: 'Macro Craftsmanship', subtitle: 'Hand-forged round-to-flat taper' },
      { key: 'profile', label: 'Side Profile View', subtitle: 'Anatomical spring tension contour' },
      { key: 'packaging', label: 'Atelier Keepsake Box', subtitle: 'Oversized luxury collar presentation' },
      { key: 'hallmark', label: 'Bench Inscription Stamp', subtitle: 'Terminal ball solid 925 stamp' },
    ],
  },
  {
    slug: 'atlas-chain-bracelet',
    name: 'Atlas Chain Bracelet',
    purity: 'Solid 925 Sterling Silver',
    category: 'Bracelets',
    symbol: 'curb-chain',
    weight: '10.4g',
    views: [
      { key: 'hero', label: 'Primary Atelier Hero', subtitle: 'Heavyweight diamond-cut curb links · 10.4g' },
      { key: 'on-body', label: 'On-Body Scale View', subtitle: 'Wrist drape with hand-tooled T-bar toggle' },
      { key: 'detail', label: 'Macro Craftsmanship', subtitle: 'Individually soldered solid links' },
      { key: 'profile', label: 'Side Profile View', subtitle: 'Bevelled link edge articulation' },
      { key: 'packaging', label: 'Atelier Keepsake Box', subtitle: 'Rigid bracelet keepsake & pouch' },
      { key: 'hallmark', label: 'Bench Inscription Stamp', subtitle: 'Toggle bar solid 925 hallmark stamp' },
    ],
  },
  {
    slug: 'meridian-cuff',
    name: 'Meridian Cuff',
    purity: 'Solid 925 Sterling Silver',
    category: 'Bracelets',
    symbol: 'hammered-cuff',
    weight: '14.8g',
    views: [
      { key: 'hero', label: 'Primary Atelier Hero', subtitle: 'Hand-hammered open torque cuff · 14.8g' },
      { key: 'on-body', label: 'On-Body Scale View', subtitle: 'Wrist contour with rounded terminals' },
      { key: 'detail', label: 'Macro Craftsmanship', subtitle: 'Planishing hammer faceted texture' },
      { key: 'profile', label: 'Cross-Section Profile', subtitle: 'Semi-round heavy gauge silver core' },
      { key: 'packaging', label: 'Atelier Keepsake Box', subtitle: 'Atelier velvet-lined drawer box' },
      { key: 'hallmark', label: 'Bench Inscription Stamp', subtitle: 'Inner cuff arc 925 silversmith mark' },
    ],
  },
  {
    slug: 'siddhi-heirloom-kada',
    name: 'Siddhi Heirloom Kada',
    purity: 'Solid 925 Sterling Silver',
    category: 'Bracelets',
    symbol: 'kada',
    weight: '24.2g',
    views: [
      { key: 'hero', label: 'Primary Atelier Hero', subtitle: 'Over 24g solid silver · Fluted crest' },
      { key: 'on-body', label: 'On-Body Scale View', subtitle: 'Wrist drape & architectural mass' },
      { key: 'detail', label: 'Macro Craftsmanship', subtitle: 'Concealed bench spring hinge' },
      { key: 'profile', label: 'Cross-Section Profile', subtitle: 'Tapered terminal contour' },
      { key: 'packaging', label: 'Atelier Keepsake Box', subtitle: 'Large luxury drawer keepsake' },
      { key: 'hallmark', label: 'Bench Inscription Stamp', subtitle: 'Deep inner-wall 925 punch' },
    ],
  },
  {
    slug: 'aethel-snake-chain',
    name: 'Aethel Snake Chain',
    purity: 'Solid 925 Sterling Silver',
    category: 'Necklaces',
    symbol: 'snake-chain',
    weight: '6.9g',
    views: [
      { key: 'hero', label: 'Primary Atelier Hero', subtitle: 'Silky fluid round snake chain · 1.6mm' },
      { key: 'on-body', label: 'On-Body Scale View', subtitle: 'Liquid silver drape on chestbone' },
      { key: 'detail', label: 'Macro Craftsmanship', subtitle: 'Diamond-cut micro facets & lobster lock' },
      { key: 'profile', label: 'Side Profile View', subtitle: 'Flexible tubular articulation' },
      { key: 'packaging', label: 'Atelier Keepsake Box', subtitle: 'Rigid navy case with anti-tarnish pad' },
      { key: 'hallmark', label: 'Bench Inscription Stamp', subtitle: 'End-tag stamped solid 925 hallmark' },
    ],
  },
];

function getCategoryGeometry(symbol, viewKey) {
  switch (symbol) {
    case 'halo':
      return `
        <circle cx="0" cy="0" r="140" fill="none" stroke="url(#silverSheen)" stroke-width="14" />
        <circle cx="0" cy="0" r="126" fill="none" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1" />
        <circle cx="0" cy="0" r="154" fill="none" stroke="#000000" stroke-opacity="0.4" stroke-width="1" />
        <ellipse cx="0" cy="-6" rx="100" ry="24" fill="none" stroke="url(#silverSheen)" stroke-width="4" stroke-opacity="0.5" />
      `;
    case 'wide-band':
      return `
        <rect x="-110" y="-80" width="220" height="160" rx="36" fill="url(#silverSheen)" stroke="#ffffff" stroke-opacity="0.4" stroke-width="2" />
        <rect x="-90" y="-60" width="180" height="120" rx="24" fill="#081220" stroke="url(#goldAccent)" stroke-width="1.5" />
        <line x1="-110" y1="-50" x2="110" y2="-50" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1.5" />
        <line x1="-110" y1="50" x2="110" y2="50" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1.5" />
      `;
    case 'signet':
      return `
        <polygon points="0,-140 120,-80 130,50 0,130 -130,50 -120,-80" fill="url(#silverSheen)" stroke="#ffffff" stroke-opacity="0.5" stroke-width="3" />
        <rect x="-65" y="-65" width="130" height="130" rx="18" fill="#07101e" stroke="url(#goldAccent)" stroke-width="2" />
        <line x1="-50" y1="-50" x2="50" y2="50" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1" />
      `;
    case 'taper-band':
      return `
        <path d="M-130,0 C-130,-110 130,-110 130,0 C130,70 40,110 0,120 C-40,110 -130,70 -130,0 Z" fill="none" stroke="url(#silverSheen)" stroke-width="10" />
        <circle cx="0" cy="120" r="6" fill="#e6ca65" />
      `;
    case 'hoop':
      return `
        <circle cx="0" cy="0" r="145" fill="none" stroke="url(#silverSheen)" stroke-width="18" />
        <circle cx="0" cy="0" r="130" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="1" />
        <rect x="-8" y="-155" width="16" height="24" rx="3" fill="url(#goldAccent)" />
      `;
    case 'stud':
      return `
        <circle cx="0" cy="0" r="110" fill="url(#silverSheen)" stroke="#ffffff" stroke-opacity="0.6" stroke-width="3" />
        <circle cx="-30" cy="-30" r="70" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="2" />
        <circle cx="0" cy="0" r="30" fill="#0a1628" stroke="url(#goldAccent)" stroke-width="1.5" />
      `;
    case 'drop':
      return `
        <circle cx="0" cy="-110" r="30" fill="url(#silverSheen)" />
        <line x1="0" y1="-80" x2="0" y2="-40" stroke="url(#goldAccent)" stroke-width="3" />
        <path d="M0,-40 C70,10 70,80 0,140 C-70,80 -70,10 0,-40 Z" fill="none" stroke="url(#silverSheen)" stroke-width="8" />
        <circle cx="0" cy="50" r="14" fill="#e6ca65" />
      `;
    case 'teardrop':
      return `
        <path d="M0,-140 C80,-30 80,70 0,135 C-80,70 -80,-30 0,-140 Z" fill="url(#silverSheen)" stroke="#ffffff" stroke-opacity="0.4" stroke-width="2" />
        <path d="M0,-100 C50,-20 50,50 0,95 C-50,50 -50,-20 0,-100 Z" fill="#091424" stroke="url(#goldAccent)" stroke-width="1.5" />
      `;
    case 'box-chain':
      return `
        <rect x="-130" y="-130" width="260" height="260" rx="30" fill="none" stroke="url(#silverSheen)" stroke-width="14" />
        <rect x="-115" y="-115" width="230" height="230" rx="20" fill="none" stroke="#ffffff" stroke-opacity="0.3" stroke-width="2" />
        <circle cx="0" cy="-130" r="12" fill="url(#goldAccent)" />
      `;
    case 'mountain':
      return `
        <circle cx="0" cy="0" r="135" fill="url(#silverSheen)" stroke="#ffffff" stroke-opacity="0.5" stroke-width="3" />
        <circle cx="0" cy="0" r="120" fill="#081220" />
        <!-- Himalayan Peaks -->
        <polygon points="0,-75 55,50 -55,50" fill="url(#silverSheen)" opacity="0.9" />
        <polygon points="-50,-30 -10,50 -90,50" fill="url(#silverSheen)" opacity="0.75" />
        <polygon points="50,-30 90,50 10,50" fill="url(#silverSheen)" opacity="0.75" />
        <line x1="-120" y1="50" x2="120" y2="50" stroke="url(#goldAccent)" stroke-width="2" />
      `;
    case 'torque':
      return `
        <path d="M-130,50 C-130,-120 130,-120 130,50" fill="none" stroke="url(#silverSheen)" stroke-width="22" stroke-linecap="round" />
        <circle cx="-130" cy="50" r="16" fill="url(#goldAccent)" />
        <circle cx="130" cy="50" r="16" fill="url(#goldAccent)" />
      `;
    case 'curb-chain':
      return `
        <ellipse cx="-70" cy="-40" rx="50" ry="30" fill="none" stroke="url(#silverSheen)" stroke-width="14" transform="rotate(-25 -70 -40)" />
        <ellipse cx="0" cy="0" rx="50" ry="30" fill="none" stroke="url(#silverSheen)" stroke-width="14" transform="rotate(25 0 0)" />
        <ellipse cx="70" cy="40" rx="50" ry="30" fill="none" stroke="url(#silverSheen)" stroke-width="14" transform="rotate(-25 70 40)" />
      `;
    case 'hammered-cuff':
      return `
        <path d="M-125,70 C-135,-110 135,-110 125,70" fill="none" stroke="url(#silverSheen)" stroke-width="24" stroke-linecap="square" />
        <path d="M-115,70 C-125,-90 125,-90 115,70" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="2" />
        <line x1="-125" y1="70" x2="-100" y2="70" stroke="url(#goldAccent)" stroke-width="4" />
        <line x1="100" y1="70" x2="125" y2="70" stroke="url(#goldAccent)" stroke-width="4" />
      `;
    case 'kada':
      return `
        <circle cx="0" cy="0" r="140" fill="none" stroke="url(#silverSheen)" stroke-width="26" />
        <circle cx="0" cy="0" r="120" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="2" />
        <circle cx="0" cy="0" r="160" fill="none" stroke="#000000" stroke-opacity="0.5" stroke-width="2" />
        <rect x="-8" y="-155" width="16" height="30" rx="4" fill="url(#goldAccent)" />
      `;
    case 'snake-chain':
      return `
        <path d="M-120,-60 Q0,-140 120,-60 Q0,80 -120,-60" fill="none" stroke="url(#silverSheen)" stroke-width="10" />
        <path d="M-120,-60 Q0,-140 120,-60 Q0,80 -120,-60" fill="none" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1" stroke-dasharray="4,4" />
      `;
    default:
      return `<circle cx="0" cy="0" r="130" fill="none" stroke="url(#silverSheen)" stroke-width="12" />`;
  }
}

function generateSvgMarkup(p, view) {
  const geom = getCategoryGeometry(p.symbol, view.key);

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

  <!-- Precision Framing Grid -->
  <rect x="36" y="36" width="728" height="928" fill="none" stroke="#b8923a" stroke-opacity="0.22" stroke-width="1" />
  <rect x="44" y="44" width="712" height="912" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1" />
  <circle cx="400" cy="450" r="240" fill="none" stroke="#b8923a" stroke-opacity="0.12" stroke-width="1" stroke-dasharray="3,6" />

  <!-- Header Metadata -->
  <text x="70" y="90" font-family="'Cinzel', 'Times New Roman', serif" font-size="16" letter-spacing="4" fill="#b8923a" font-weight="bold">ARGYROS 925</text>
  <text x="730" y="90" text-anchor="end" font-family="-apple-system, sans-serif" font-size="11" letter-spacing="3" fill="#ffffff" fill-opacity="0.5" text-transform="uppercase">HALDWANI ATELIER</text>
  <line x1="70" y1="108" x2="730" y2="108" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />

  <!-- Central Visual Representation -->
  <g transform="translate(400, 450)">
    ${geom}

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
  <text x="400" y="795" text-anchor="middle" font-family="'Cinzel', 'Times New Roman', serif" font-size="28" fill="#ffffff" font-weight="400" letter-spacing="1">${p.name}</text>
  <text x="400" y="828" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="13" fill="#b8923a" letter-spacing="2" font-weight="500">${p.purity} · ${p.weight}</text>
  <text x="400" y="855" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="12" fill="#ffffff" fill-opacity="0.6" font-style="italic">${view.subtitle}</text>

  <!-- Base Guarantee Inscription -->
  <line x1="70" y1="900" x2="730" y2="900" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
  <text x="70" y="925" font-family="-apple-system, sans-serif" font-size="10" letter-spacing="2" fill="#ffffff" fill-opacity="0.4" text-transform="uppercase">HOUSE OF SIDDHI JEWELLERS</text>
  <text x="730" y="925" text-anchor="end" font-family="-apple-system, sans-serif" font-size="10" letter-spacing="2" fill="#b8923a" font-weight="bold" text-transform="uppercase">BENCH CRAFTED · MADE TO ORDER</text>
</svg>`;
}

let generatedCount = 0;
for (const p of ALL_PRODUCTS) {
  for (let i = 0; i < p.views.length; i++) {
    const view = p.views[i];
    const fileName = `${p.slug}-${i + 1}-${view.key}.svg`;
    const filePath = path.join(targetDir, fileName);
    const svgContent = generateSvgMarkup(p, view);
    fs.writeFileSync(filePath, svgContent, 'utf-8');
    generatedCount++;
  }
}

console.log(`Generated all ${generatedCount} unique product media assets across ${ALL_PRODUCTS.length} products.`);
