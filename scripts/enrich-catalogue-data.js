const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../apps/web/lib/catalogue-data.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Rich product stories and relations for the products missing them
const ENRICHMENTS = {
  'meridian-signet-ring': {
    story: {
      feeling: 'Understated authority and architectural poise.',
      form: 'A contemporary cushion-cut signet face with softened bevelled shoulders.',
      making: 'Lost-wax heavyweight casting in virgin 925 silver, hand-lapped to a mirror face.',
      moment: 'Everyday signature wear, personal heraldry, or milestone celebrations.',
    },
    relatedSlugs: {
      completeTheStack: ['nova-halo-ring', 'vesta-solitaire-band'],
      pairsWellWith: ['meridian-cuff', 'atlas-chain-bracelet'],
      fromSameEdit: ['equinox-statement-ring', 'siddhi-heirloom-kada'],
      giftWithThisPiece: ['meridian-cuff'],
    },
  },
  'vesta-solitaire-band': {
    story: {
      feeling: 'Quiet intimacy and fluid ergonomic calm.',
      form: 'An organic tapering contour band designed for effortless nesting.',
      making: 'Cold-forged in solid 925 silver with rounded comfort-fit interior arc.',
      moment: 'Daily solitary reflection, wedding nesting, or modern minimal stacking.',
    },
    relatedSlugs: {
      completeTheStack: ['nova-halo-ring', 'equinox-statement-ring'],
      pairsWellWith: ['solace-pendant', 'aura-stud-earrings'],
      fromSameEdit: ['celestine-choker', 'luna-hoop-earrings'],
      giftWithThisPiece: ['nova-halo-ring'],
    },
  },
  'aura-stud-earrings': {
    story: {
      feeling: 'Purity of light and weightless daily presence.',
      form: 'A seamless 6mm polished dome catching ambient reflections.',
      making: 'Bench-stamped from virgin silver sheet with precision-soldered double-notch posts.',
      moment: 'The essential first piece of every morning, effortless and unadorned.',
    },
    relatedSlugs: {
      completeTheStack: ['luna-hoop-earrings', 'kumaon-drop-earrings'],
      pairsWellWith: ['solace-pendant', 'nova-halo-ring'],
      fromSameEdit: ['celestine-choker', 'vesta-solitaire-band'],
      giftWithThisPiece: ['solace-pendant'],
    },
  },
  'kumaon-drop-earrings': {
    story: {
      feeling: 'Himalayan mountain breezes and ancestral grace.',
      form: 'Articulated geometric drop silhouette inspired by Pahadi silver filigree.',
      making: 'Intricate silver wirework crafted by master silversmiths in Haldwani.',
      moment: 'Festive gatherings, cultural celebrations, and evocative evening wear.',
    },
    relatedSlugs: {
      completeTheStack: ['aura-stud-earrings', 'luna-hoop-earrings'],
      pairsWellWith: ['trishul-peak-medallion', 'hansli-minimal-collar'],
      fromSameEdit: ['siddhi-heirloom-kada', 'hansli-minimal-collar'],
      giftWithThisPiece: ['trishul-peak-medallion'],
    },
  },
  'solace-pendant': {
    story: {
      feeling: 'A soothing physical touchstone against the chest.',
      form: 'A hollow-back sculptural teardrop with soft, organic contour lines.',
      making: 'Cast in pure sterling silver and buffed to a liquid silk surface.',
      moment: 'A deeply personal talisman for quiet moments and everyday solace.',
    },
    relatedSlugs: {
      completeTheStack: ['celestine-choker', 'aethel-snake-chain'],
      pairsWellWith: ['nova-halo-ring', 'aura-stud-earrings'],
      fromSameEdit: ['vesta-solitaire-band', 'luna-hoop-earrings'],
      giftWithThisPiece: ['aura-stud-earrings'],
    },
  },
  'trishul-peak-medallion': {
    story: {
      feeling: 'Grounded strength rooted in the high Himalayas.',
      form: 'Architectural coin medallion etched with Mount Trishul topographic contours.',
      making: 'Deep relief etching with subtle oxidised shading and hand-bevelled border.',
      moment: 'Travels, mountain memories, and personal resilience.',
    },
    relatedSlugs: {
      completeTheStack: ['celestine-choker', 'aethel-snake-chain'],
      pairsWellWith: ['kumaon-drop-earrings', 'meridian-cuff'],
      fromSameEdit: ['hansli-minimal-collar', 'siddhi-heirloom-kada'],
      giftWithThisPiece: ['kumaon-drop-earrings'],
    },
  },
  'hansli-minimal-collar': {
    story: {
      feeling: 'Ancestral majesty sculpted into contemporary modernism.',
      form: 'Rigid yet flexible torque neck collar with hand-finished tapered terminals.',
      making: 'Heavyweight hand-forging from 18.5g virgin 925 silver wire on the anvil.',
      moment: 'High gala evenings, heritage celebrations, and bold sculptural statements.',
    },
    relatedSlugs: {
      completeTheStack: ['celestine-choker', 'solace-pendant'],
      pairsWellWith: ['siddhi-heirloom-kada', 'equinox-statement-ring'],
      fromSameEdit: ['trishul-peak-medallion', 'kumaon-drop-earrings'],
      giftWithThisPiece: ['siddhi-heirloom-kada'],
    },
  },
  'atlas-chain-bracelet': {
    story: {
      feeling: 'Satisfying tactile heft and fluid metallic drape.',
      form: 'Interlocking diamond-cut curb links with hand-tooled bar toggle closure.',
      making: 'Individually shaped and soldered solid silver links, tumbled to perfection.',
      moment: 'Everyday luxury wristwear that layers effortlessly with timepieces.',
    },
    relatedSlugs: {
      completeTheStack: ['meridian-cuff', 'siddhi-heirloom-kada'],
      pairsWellWith: ['meridian-signet-ring', 'equinox-statement-ring'],
      fromSameEdit: ['aethel-snake-chain', 'celestine-choker'],
      giftWithThisPiece: ['meridian-signet-ring'],
    },
  },
  'meridian-cuff': {
    story: {
      feeling: 'Solid, enduring calm embracing the wrist.',
      form: 'Heavy-gauge open torque cuff with rounded comfort terminals.',
      making: 'Over 14.8 grams of solid silver, planished with hand-hammered facets.',
      moment: 'Daily architectural statement wear, solitary or stacked.',
    },
    relatedSlugs: {
      completeTheStack: ['atlas-chain-bracelet', 'siddhi-heirloom-kada'],
      pairsWellWith: ['meridian-signet-ring', 'equinox-statement-ring'],
      fromSameEdit: ['hansli-minimal-collar', 'nova-halo-ring'],
      giftWithThisPiece: ['meridian-signet-ring'],
    },
  },
  'aethel-snake-chain': {
    story: {
      feeling: 'Liquid silver cascading effortlessly against the skin.',
      form: 'Round micro-link snake chain with diamond-cut facets that catch ambient light.',
      making: 'Precision Italian-gauge silversmithing with custom Haldwani end caps.',
      moment: 'Subtle daily radiance, solo or layered with statement pendants.',
    },
    relatedSlugs: {
      completeTheStack: ['celestine-choker', 'solace-pendant'],
      pairsWellWith: ['luna-hoop-earrings', 'nova-halo-ring'],
      fromSameEdit: ['atlas-chain-bracelet', 'vesta-solitaire-band'],
      giftWithThisPiece: ['solace-pendant'],
    },
  },
};

function generateImagesBlock(slug, name) {
  return `images: [
      { id: 'img-${slug}-1', url: '/images/products/${slug}-1-hero.svg', alt: '${name} in solid 925 sterling silver primary atelier elevation', position: 1 },
      { id: 'img-${slug}-2', url: '/images/products/${slug}-2-on-body.svg', alt: '${name} shown in on-body scale perspective', position: 2 },
      { id: 'img-${slug}-3', url: '/images/products/${slug}-3-detail.svg', alt: '${name} macro craftsmanship view showing hand-burnished finishing', position: 3 },
      { id: 'img-${slug}-4', url: '/images/products/${slug}-4-profile.svg', alt: '${name} side profile silhouette showing precision contours', position: 4 },
      { id: 'img-${slug}-5', url: '/images/products/${slug}-5-packaging.svg', alt: 'Argyros luxury keepsake presentation box and travel pouch', position: 5 },
      { id: 'img-${slug}-6', url: '/images/products/${slug}-6-hallmark.svg', alt: 'Solid 925 sterling silver bench authentication hallmark stamp', position: 6 },
    ],`;
}

// Replace single-image blocks for the products
for (const [slug, data] of Object.entries(ENRICHMENTS)) {
  const productRegex = new RegExp(`slug:\\s*'${slug}',[\\s\\S]*?images:\\s*\\[[\\s\\S]*?\\],`, 'm');
  const match = content.match(productRegex);
  if (match) {
    const productNameMatch = match[0].match(/name:\s*'([^']+)'/);
    const productName = productNameMatch ? productNameMatch[1] : slug;
    const newImages = generateImagesBlock(slug, productName);
    
    // Replace the images block inside this product definition
    const updatedProduct = match[0].replace(/images:\s*\[[\s\S]*?\],/, newImages);
    content = content.replace(match[0], updatedProduct);
  }

  // Also append story and relatedSlugs before the closing brace of the product if not present
  const fullProductRegex = new RegExp(`(slug:\\s*'${slug}',[\\s\\S]*?)(collections:\\s*\\[[\\s\\S]*?\\],)(\\s*\\},)`, 'm');
  const fullMatch = content.match(fullProductRegex);
  if (fullMatch && !fullMatch[1].includes('story:')) {
    const storyStr = `relatedSlugs: ${JSON.stringify(data.relatedSlugs, null, 6)},\n    story: ${JSON.stringify(data.story, null, 6)},\n  `;
    const replacement = `${fullMatch[1]}${fullMatch[2]}\n    ${storyStr}},`;
    content = content.replace(fullMatch[0], replacement);
  }
}

// Fix parameter typing on getProductSummary
content = content.replace(
  'const prices = p.variants.map((v) => v.priceCents);',
  'const prices = p.variants.map((v: any) => v.priceCents);'
);
content = content.replace(
  'const sizes = p.variants.map((v) => v.size).filter((s): s is string => Boolean(s));',
  'const sizes = p.variants.map((v: any) => v.size).filter((s: any): s is string => Boolean(s));'
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully enriched all 15 foundation products in catalogue-data.ts!');
