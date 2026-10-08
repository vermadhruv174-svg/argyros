import { PrismaClient, ProductStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Launch-quality catalogue:
// - Zero third-party stock photos (images: [])
// - No unverified compareAt markdowns (compareAtCents: null)
// - Indian ring size scale (IN 10 to IN 18) with calculated diameter
// - weightVerified: false, weightGrams: null (unverified pieces)
// - Pure factual product descriptions (no micro-pavé or invented gem specs)
// - Made to order fulfilment (stock: 999 or 0 with made-to-order notice)

const ringVariants = [10, 11, 12, 13, 14, 15, 16, 17, 18].map((size) => {
  const diameter = (16.5 + 0.4 * (size - 12)).toFixed(1);
  return {
    skuSuffix: `IN${size}`,
    title: `Indian Size ${size} (${diameter}mm)`,
    size: `IN ${size}`,
    scale: 'IN',
  };
});

const products = [
  {
    slug: 'nova-halo-ring',
    name: 'Nova Halo Ring',
    description:
      'A softly sculpted ring in solid 925 sterling silver (92.5% pure silver alloyed for strength). Made to order with an artisanal high-polish finish.',
    category: 'Rings',
    metalPurity: '925 Sterling Silver',
    status: ProductStatus.ACTIVE,
    seoTitle: 'Nova Halo Ring — 925 Sterling Silver | Argyros',
    seoDescription:
      'Hand-finished halo ring in 925 sterling silver. Made to order by master karigars.',
    weightGrams: null,
    weightVerified: false,
    fulfilment: 'MADE_TO_ORDER',
    dimensions: '18mm outer diameter · 1.8mm band width',
    finish: 'High-polish sterling silver',
    audience: 'her',
    tags: ['ring', 'halo', 'sterling', 'made-to-order'],
    images: [],
    variants: ringVariants.map((rv) => ({
      sku: `NHR-${rv.skuSuffix}`,
      title: rv.title,
      size: rv.size,
      scale: rv.scale,
      weightGrams: null,
      weightVerified: false,
      priceCents: 289000,
      compareAtCents: null,
      stock: 0,
    })),
  },
  {
    slug: 'luna-hoop-earrings',
    name: 'Luna Hoop Earrings',
    description:
      'A classic hoop pair hand-finished in solid 925 sterling silver with a high-polish arc. Made to order across three standard hoop diameters.',
    category: 'Earrings',
    metalPurity: '925 Sterling Silver',
    status: ProductStatus.ACTIVE,
    seoTitle: 'Luna Hoop Earrings — 925 Sterling Silver | Argyros',
    seoDescription:
      'Classic 925 sterling silver hoop earrings with high-polish finish. Made to order.',
    weightGrams: null,
    weightVerified: false,
    fulfilment: 'MADE_TO_ORDER',
    dimensions: 'Small: 20mm · Medium: 30mm · Large: 40mm',
    finish: 'High-polish sterling silver',
    audience: 'her',
    tags: ['hoops', 'earrings', 'sterling', 'made-to-order'],
    images: [],
    variants: [
      { sku: 'LHE-S', title: 'Small — 20mm', size: 'S', scale: null, weightGrams: null, weightVerified: false, priceCents: 249000, compareAtCents: null, stock: 0 },
      { sku: 'LHE-M', title: 'Medium — 30mm', size: 'M', scale: null, weightGrams: null, weightVerified: false, priceCents: 269000, compareAtCents: null, stock: 0 },
      { sku: 'LHE-L', title: 'Large — 40mm', size: 'L', scale: null, weightGrams: null, weightVerified: false, priceCents: 289000, compareAtCents: null, stock: 0 },
    ],
  },
  {
    slug: 'solace-pendant',
    name: 'Solace Pendant',
    description:
      'A teardrop pendant cast in solid 925 sterling silver, suspended on a fine trace chain. Made to order in three chain lengths.',
    category: 'Necklaces',
    metalPurity: '925 Sterling Silver',
    status: ProductStatus.ACTIVE,
    seoTitle: 'Solace Pendant Necklace — 925 Sterling Silver | Argyros',
    seoDescription:
      'Sterling silver teardrop pendant on a fine trace chain. Made to order.',
    weightGrams: null,
    weightVerified: false,
    fulfilment: 'MADE_TO_ORDER',
    dimensions: '14mm x 8mm pendant',
    chainLengthsInches: [16, 18, 20],
    finish: 'High-polish sterling silver',
    audience: 'unisex',
    tags: ['pendant', 'necklace', 'sterling', 'made-to-order'],
    images: [],
    variants: [
      { sku: 'SP-16', title: '16" Chain', size: '16"', scale: null, weightGrams: null, weightVerified: false, priceCents: 329000, compareAtCents: null, stock: 0 },
      { sku: 'SP-18', title: '18" Chain', size: '18"', scale: null, weightGrams: null, weightVerified: false, priceCents: 349000, compareAtCents: null, stock: 0 },
      { sku: 'SP-20', title: '20" Chain', size: '20"', scale: null, weightGrams: null, weightVerified: false, priceCents: 369000, compareAtCents: null, stock: 0 },
    ],
  },
  {
    slug: 'atlas-chain-bracelet',
    name: 'Atlas Chain Bracelet',
    description:
      'A structured link chain bracelet hand-assembled in solid 925 sterling silver with a toggle clasp. Made to order for a tailored wrist fit.',
    category: 'Bracelets',
    metalPurity: '925 Sterling Silver',
    status: ProductStatus.ACTIVE,
    seoTitle: 'Atlas Chain Bracelet — 925 Sterling Silver | Argyros',
    seoDescription:
      'Link chain bracelet in 925 sterling silver with toggle clasp. Made to order.',
    weightGrams: null,
    weightVerified: false,
    fulfilment: 'MADE_TO_ORDER',
    dimensions: '6.5" to 7.5" wrist circumference · 6mm link gauge',
    finish: 'High-polish sterling silver',
    audience: 'unisex',
    tags: ['chain', 'bracelet', 'sterling', 'made-to-order'],
    images: [],
    variants: [
      { sku: 'ACB-65', title: '6.5" Length', size: '6.5"', scale: null, weightGrams: null, weightVerified: false, priceCents: 419000, compareAtCents: null, stock: 0 },
      { sku: 'ACB-70', title: '7.0" Length', size: '7.0"', scale: null, weightGrams: null, weightVerified: false, priceCents: 439000, compareAtCents: null, stock: 0 },
      { sku: 'ACB-75', title: '7.5" Length', size: '7.5"', scale: null, weightGrams: null, weightVerified: false, priceCents: 459000, compareAtCents: null, stock: 0 },
    ],
  },
  {
    slug: 'meridian-cuff',
    name: 'Meridian Cuff',
    description:
      'An open sculptural cuff crafted from solid 925 sterling silver, hand-hammered to catch natural light. Made to order in four sizes.',
    category: 'Bracelets',
    metalPurity: '925 Sterling Silver',
    status: ProductStatus.ACTIVE,
    seoTitle: 'Meridian Cuff — Sculptural 925 Sterling Silver | Argyros',
    seoDescription:
      'Hand-hammered open cuff in solid 925 sterling silver. Made to order.',
    weightGrams: null,
    weightVerified: false,
    fulfilment: 'MADE_TO_ORDER',
    dimensions: '12mm band height · Adjustable inner diameter',
    finish: 'Hand-hammered high polish',
    audience: 'unisex',
    tags: ['cuff', 'bracelet', 'sterling', 'made-to-order'],
    images: [],
    variants: [
      { sku: 'MC-XS', title: 'XS (52mm wrist)', size: 'XS', scale: null, weightGrams: null, weightVerified: false, priceCents: 549000, compareAtCents: null, stock: 0 },
      { sku: 'MC-S',  title: 'S (56mm wrist)',  size: 'S',  scale: null, weightGrams: null, weightVerified: false, priceCents: 549000, compareAtCents: null, stock: 0 },
      { sku: 'MC-M',  title: 'M (60mm wrist)',  size: 'M',  scale: null, weightGrams: null, weightVerified: false, priceCents: 549000, compareAtCents: null, stock: 0 },
      { sku: 'MC-L',  title: 'L (64mm wrist)',  size: 'L',  scale: null, weightGrams: null, weightVerified: false, priceCents: 549000, compareAtCents: null, stock: 0 },
    ],
  },
  {
    slug: 'aura-stud-earrings',
    name: 'Aura Stud Earrings',
    description:
      'Round stud earrings cast from solid 925 sterling silver with secure friction scroll backs. Made to order in three face diameters.',
    category: 'Earrings',
    metalPurity: '925 Sterling Silver',
    status: ProductStatus.ACTIVE,
    seoTitle: 'Aura Stud Earrings — 925 Sterling Silver | Argyros',
    seoDescription:
      'Classic round stud earrings in solid 925 sterling silver. Made to order.',
    weightGrams: null,
    weightVerified: false,
    fulfilment: 'MADE_TO_ORDER',
    dimensions: '4mm, 6mm, or 8mm diameter',
    finish: 'High-polish sterling silver',
    audience: 'her',
    tags: ['studs', 'earrings', 'sterling', 'made-to-order'],
    images: [],
    variants: [
      { sku: 'ASE-4MM', title: '4mm Diameter', size: '4mm', scale: null, weightGrams: null, weightVerified: false, priceCents: 189000, compareAtCents: null, stock: 0 },
      { sku: 'ASE-6MM', title: '6mm Diameter', size: '6mm', scale: null, weightGrams: null, weightVerified: false, priceCents: 209000, compareAtCents: null, stock: 0 },
      { sku: 'ASE-8MM', title: '8mm Diameter', size: '8mm', scale: null, weightGrams: null, weightVerified: false, priceCents: 229000, compareAtCents: null, stock: 0 },
    ],
  },
  {
    slug: 'equinox-statement-ring',
    name: 'Equinox Statement Ring',
    description:
      'A wide-band architectural ring in solid 925 sterling silver featuring a brushed matte face and polished bevelled edges. Made to order.',
    category: 'Rings',
    metalPurity: '925 Sterling Silver',
    status: ProductStatus.ACTIVE,
    seoTitle: 'Equinox Statement Ring — 925 Sterling Silver | Argyros',
    seoDescription:
      'Wide-band architectural ring in 925 sterling silver with brushed face. Made to order.',
    weightGrams: null,
    weightVerified: false,
    fulfilment: 'MADE_TO_ORDER',
    dimensions: '10mm band height · 2.2mm thickness',
    finish: 'Brushed matte face with polished bevelled edges',
    audience: 'unisex',
    tags: ['statement', 'ring', 'sterling', 'made-to-order'],
    images: [],
    variants: ringVariants.map((rv) => ({
      sku: `ESR-${rv.skuSuffix}`,
      title: rv.title,
      size: rv.size,
      scale: rv.scale,
      weightGrams: null,
      weightVerified: false,
      priceCents: 629000,
      compareAtCents: null,
      stock: 0,
    })),
  },
  {
    slug: 'celestine-choker',
    name: 'Celestine Choker',
    description:
      'A box-chain choker in solid 925 sterling silver with a lobster clasp and extension link. Made to order in 14-inch and 16-inch lengths.',
    category: 'Necklaces',
    metalPurity: '925 Sterling Silver',
    status: ProductStatus.ACTIVE,
    seoTitle: 'Celestine Choker — 925 Sterling Silver | Argyros',
    seoDescription:
      'Box-chain choker in solid 925 sterling silver. Made to order.',
    weightGrams: null,
    weightVerified: false,
    fulfilment: 'MADE_TO_ORDER',
    dimensions: '1.2mm box chain with 2cm extension link',
    chainLengthsInches: [14, 16],
    finish: 'High-polish sterling silver',
    audience: 'her',
    tags: ['choker', 'necklace', 'sterling', 'made-to-order'],
    images: [],
    variants: [
      { sku: 'CC-14', title: '14" + 2cm extension', size: '14"', scale: null, weightGrams: null, weightVerified: false, priceCents: 489000, compareAtCents: null, stock: 0 },
      { sku: 'CC-16', title: '16" + 2cm extension', size: '16"', scale: null, weightGrams: null, weightVerified: false, priceCents: 509000, compareAtCents: null, stock: 0 },
    ],
  },
];

async function main() {
  console.log('🌱 Seeding launch-quality Argyros catalogue (factual specs, no stock images)...');

  // Purge unwanted collections (diwali-2026, bridal-edit, new-arrivals)
  await prisma.collection.deleteMany({
    where: { slug: { in: ['diwali-2026', 'bridal-edit', 'new-arrivals'] } },
  });

  // Explicitly wipe any old imageUrl from all collections so no stock images linger
  await prisma.collection.updateMany({
    data: { imageUrl: null },
  });

  // Collections as per Section 5.2
  const collections = [
    {
      slug: 'the-first-edition',
      name: 'The First Edition',
      type: 'EVERGREEN',
      isFeatured: true,
      isPublished: true,
      showComingSoon: false,
      displayOrder: 0,
      sortOrder: 0,
      kind: 'editorial',
      description: 'Our debut pieces: the first chapter of Argyros.',
    },
    {
      slug: 'premium-reserve',
      name: 'Premium Reserve',
      type: 'EVERGREEN',
      isFeatured: true,
      isPublished: true,
      showComingSoon: false,
      displayOrder: 1,
      sortOrder: 1,
      kind: 'rule',
      description: 'Our most substantial pieces, crafted for enduring presence.',
    },
    {
      slug: 'daily-luxe',
      name: 'Daily Luxe',
      type: 'EVERGREEN',
      isFeatured: true,
      isPublished: true,
      showComingSoon: false,
      displayOrder: 2,
      sortOrder: 2,
      kind: 'rule',
      description: 'Solid silver essentials designed for daily wear.',
    },
    {
      slug: 'gifts-under-3000',
      name: 'Gifts Under ₹3,000',
      type: 'CURATED',
      isFeatured: false,
      isPublished: true,
      showComingSoon: false,
      displayOrder: 3,
      sortOrder: 3,
      kind: 'rule',
      description: 'Enduring gifts crafted in solid 925 sterling silver.',
    },
    {
      slug: 'pahadi-edit',
      name: 'Pahadi Edit',
      type: 'EVERGREEN',
      isFeatured: false,
      isPublished: false,
      showComingSoon: true, // Coming soon
      displayOrder: 4,
      sortOrder: 4,
      kind: 'editorial',
      description: 'Silver inspired by the mountain heritage of Uttarakhand.',
    },
    {
      slug: 'oxidised',
      name: 'Oxidised Collection',
      type: 'EVERGREEN',
      isFeatured: false,
      isPublished: false,
      showComingSoon: true, // Coming soon
      displayOrder: 5,
      sortOrder: 5,
      kind: 'editorial',
      description: 'Artisanal dark patina with hand-polished raised motifs.',
    },
  ];

  for (const col of collections) {
    await prisma.collection.upsert({
      where: { slug: col.slug },
      create: col as any,
      update: {
        name: col.name,
        description: col.description,
        type: col.type as any,
        isFeatured: col.isFeatured,
        isPublished: col.isPublished,
        showComingSoon: col.showComingSoon,
        displayOrder: col.displayOrder,
        sortOrder: col.sortOrder,
        kind: col.kind,
      },
    });
  }

  console.log(`  ✓ ${collections.length} collections configured`);

  // Clear legacy Celeste Halo Ring if present
  await prisma.product.deleteMany({
    where: { slug: 'celeste-halo-ring' },
  });

  // Upsert products
  for (const p of products) {
    const { images, variants, ...productData } = p;

    // Delete existing variants to avoid stale sizing keys
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) {
      await prisma.productVariant.deleteMany({ where: { productId: existing.id } });
    }

    await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        ...productData,
        images: { create: [] },
        variants: { create: variants },
      },
      update: {
        ...productData,
        images: {
          deleteMany: {},
          create: [],
        },
        variants: {
          create: variants,
        },
      },
    });

    const product = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (!product) continue;

    // Clear old mappings
    await prisma.productCollection.deleteMany({
      where: { productId: product.id },
    });

    // 1. The First Edition gets all 8 pieces
    const firstEd = await prisma.collection.findUnique({ where: { slug: 'the-first-edition' } });
    if (firstEd) {
      await prisma.productCollection.create({
        data: { productId: product.id, collectionId: firstEd.id },
      });
    }

    // 2. Premium Reserve: price >= 4000 (Equinox, Meridian, Celestine, Atlas)
    if (['equinox-statement-ring', 'meridian-cuff', 'celestine-choker', 'atlas-chain-bracelet'].includes(p.slug)) {
      const prem = await prisma.collection.findUnique({ where: { slug: 'premium-reserve' } });
      if (prem) {
        await prisma.productCollection.create({
          data: { productId: product.id, collectionId: prem.id },
        });
      }
    }

    // 3. Daily Luxe: (Aura, Luna, Nova, Solace)
    if (['aura-stud-earrings', 'luna-hoop-earrings', 'nova-halo-ring', 'solace-pendant'].includes(p.slug)) {
      const daily = await prisma.collection.findUnique({ where: { slug: 'daily-luxe' } });
      if (daily) {
        await prisma.productCollection.create({
          data: { productId: product.id, collectionId: daily.id },
        });
      }
    }

    // 4. Gifts under 3000: Aura, Luna, Nova
    if (['aura-stud-earrings', 'luna-hoop-earrings', 'nova-halo-ring'].includes(p.slug)) {
      const gifts = await prisma.collection.findUnique({ where: { slug: 'gifts-under-3000' } });
      if (gifts) {
        await prisma.productCollection.create({
          data: { productId: product.id, collectionId: gifts.id },
        });
      }
    }

    console.log(`  ✓ ${p.name} (${variants.length} variants, made-to-order)`);
  }

  console.log(`\n✅ Seeded ${products.length} products with launch-quality data.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
