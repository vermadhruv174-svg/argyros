import { PrismaClient, ProductStatus } from '@prisma/client';

const prisma = new PrismaClient();

// In launch-quality mode: NO stock/Unsplash images. Empty images list so branded placeholder renders.
// Real photography can be added through data only.
const products = [
  {
    slug: 'nova-halo-ring',
    name: 'Nova Halo Ring',
    description:
      'A softly sculpted halo ring in 925 sterling silver (92.5% pure), set with micro-pavé cubic zirconia. The Nova captures candlelight and moonlight in equal measure — designed to be worn every day, from first morning light to last.',
    category: 'Rings',
    metalPurity: '925 Sterling Silver',
    status: ProductStatus.ACTIVE,
    seoTitle: 'Nova Halo Ring — 925 Sterling Silver | Argyros',
    seoDescription:
      'A delicate halo ring in 925 sterling silver with micro-pavé cubic zirconia. Made to order. Free shipping on orders above ₹2,999.',
    weightGrams: 3.0,
    dimensions: '18mm outer diameter · 1.8mm band width',
    ringSizes: [5, 6, 7, 8, 9],
    finish: 'High-polish rhodium-free sterling',
    audience: 'her',
    tags: ['lightweight', 'halo', 'ring', 'everyday'],
    images: [],
    variants: [
      { sku: 'NHR-SZ5', title: 'Size 5', size: '5', weightGrams: 2.8, priceCents: 289000, compareAtCents: 349000, stock: 4 },
      { sku: 'NHR-SZ6', title: 'Size 6', size: '6', weightGrams: 2.9, priceCents: 289000, compareAtCents: 349000, stock: 8 },
      { sku: 'NHR-SZ7', title: 'Size 7', size: '7', weightGrams: 3.0, priceCents: 289000, compareAtCents: 349000, stock: 6 },
      { sku: 'NHR-SZ8', title: 'Size 8', size: '8', weightGrams: 3.1, priceCents: 289000, compareAtCents: 349000, stock: 3 },
      { sku: 'NHR-SZ9', title: 'Size 9', size: '9', weightGrams: 3.2, priceCents: 289000, compareAtCents: 349000, stock: 2 },
    ],
  },
  {
    slug: 'luna-hoop-earrings',
    name: 'Luna Hoop Earrings',
    description:
      'Effortless and weightless, the Luna hoops are hand-finished in 925 sterling silver with a high-polish arc. Lightweight enough for all-day wear, substantial enough to define an evening. Available in small, medium and large.',
    category: 'Earrings',
    metalPurity: '925 Sterling Silver',
    status: ProductStatus.ACTIVE,
    seoTitle: 'Luna Hoop Earrings — 925 Sterling Silver | Argyros',
    seoDescription:
      'Lightweight 925 sterling silver hoop earrings with a high-polish finish. Three sizes — perfect for all-day wear.',
    weightGrams: 2.4,
    dimensions: 'Small: 20mm · Medium: 30mm · Large: 40mm',
    finish: 'High-polish rhodium-free sterling',
    audience: 'her',
    tags: ['lightweight', 'hoops', 'earrings', 'everyday'],
    images: [],
    variants: [
      { sku: 'LHE-S', title: 'Small — 20mm', size: 'S', weightGrams: 1.8, priceCents: 249000, stock: 12 },
      { sku: 'LHE-M', title: 'Medium — 30mm', size: 'M', weightGrams: 2.4, priceCents: 269000, stock: 10 },
      { sku: 'LHE-L', title: 'Large — 40mm', size: 'L', weightGrams: 3.1, priceCents: 289000, stock: 7 },
    ],
  },
  {
    slug: 'solace-pendant',
    name: 'Solace Pendant',
    description:
      'A minimalist teardrop pendant cast in solid 925 sterling silver, suspended on a fine trace chain. The Solace sits close to the heart — a quiet reminder of what matters. Choose from three chain lengths to suit your neckline.',
    category: 'Necklaces',
    metalPurity: '925 Sterling Silver',
    status: ProductStatus.ACTIVE,
    seoTitle: 'Solace Pendant Necklace — 925 Sterling Silver | Argyros',
    seoDescription:
      'Minimalist sterling silver teardrop pendant on a fine trace chain. Available in 16", 18" and 20" lengths.',
    weightGrams: 3.4,
    dimensions: '14mm x 8mm pendant',
    chainLengthsInches: [16, 18, 20],
    finish: 'High-polish rhodium-free sterling',
    audience: 'unisex',
    tags: ['lightweight', 'pendant', 'necklace', 'everyday'],
    images: [],
    variants: [
      { sku: 'SP-16', title: '16" Chain', size: '16"', weightGrams: 3.2, priceCents: 329000, stock: 9 },
      { sku: 'SP-18', title: '18" Chain', size: '18"', weightGrams: 3.4, priceCents: 349000, stock: 11 },
      { sku: 'SP-20', title: '20" Chain', size: '20"', weightGrams: 3.6, priceCents: 369000, stock: 6 },
    ],
  },
  {
    slug: 'atlas-chain-bracelet',
    name: 'Atlas Chain Bracelet',
    description:
      'A bold link chain bracelet in 925 sterling silver with a signature toggle clasp. The Atlas is architectural in design yet effortless to wear — the kind of piece that anchors every wrist stack or stands alone with authority.',
    category: 'Bracelets',
    metalPurity: '925 Sterling Silver',
    status: ProductStatus.ACTIVE,
    seoTitle: 'Atlas Chain Bracelet — 925 Sterling Silver | Argyros',
    seoDescription:
      'Bold link chain bracelet in 925 sterling silver with toggle clasp. Three sizes for a perfect fit.',
    weightGrams: 8.8,
    dimensions: '6.5" to 7.5" wrist circumference · 6mm link gauge',
    finish: 'High-polish rhodium-free sterling',
    audience: 'unisex',
    tags: ['chain', 'bracelet', 'substantial'],
    images: [],
    variants: [
      { sku: 'ACB-65', title: '6.5"', size: '6.5"', weightGrams: 8.2, priceCents: 419000, stock: 5 },
      { sku: 'ACB-70', title: '7.0"', size: '7.0"', weightGrams: 8.8, priceCents: 439000, stock: 8 },
      { sku: 'ACB-75', title: '7.5"', size: '7.5"', weightGrams: 9.4, priceCents: 459000, stock: 4 },
    ],
  },
  {
    slug: 'meridian-cuff',
    name: 'Meridian Cuff',
    description:
      'A sculptural open cuff formed from a single strip of 925 sterling silver, hand-hammered to catch the light. The Meridian is a statement of restrained confidence — wide enough to command attention, refined enough for every occasion.',
    category: 'Bracelets',
    metalPurity: '925 Sterling Silver',
    status: ProductStatus.ACTIVE,
    seoTitle: 'Meridian Cuff — Sculptural 925 Sterling Silver | Argyros',
    seoDescription:
      'Hand-hammered open cuff in 925 sterling silver. A sculptural statement piece available in four sizes.',
    weightGrams: 12.0,
    dimensions: '12mm band height · Adjustable 55mm-65mm inner diameter',
    finish: 'Hand-hammered high polish',
    audience: 'unisex',
    tags: ['cuff', 'statement', 'substantial'],
    images: [],
    variants: [
      { sku: 'MC-XS', title: 'XS', size: 'XS', weightGrams: 11.2, priceCents: 549000, stock: 3 },
      { sku: 'MC-S',  title: 'S',  size: 'S',  weightGrams: 12.0, priceCents: 549000, stock: 6 },
      { sku: 'MC-M',  title: 'M',  size: 'M',  weightGrams: 12.8, priceCents: 549000, stock: 5 },
      { sku: 'MC-L',  title: 'L',  size: 'L',  weightGrams: 13.6, priceCents: 549000, stock: 2 },
    ],
  },
  {
    slug: 'aura-stud-earrings',
    name: 'Aura Stud Earrings',
    description:
      'Perfectly round, perfectly simple. The Aura studs are cast from solid 925 sterling silver with butterfly backs — the everyday earring that disappears into your routine and elevates it at the same time. Available in three diameters.',
    category: 'Earrings',
    metalPurity: '925 Sterling Silver',
    status: ProductStatus.ACTIVE,
    seoTitle: 'Aura Stud Earrings — 925 Sterling Silver | Argyros',
    seoDescription:
      'Classic round stud earrings in solid 925 sterling silver. Butterfly backs, three sizes — the essential everyday earring.',
    weightGrams: 0.9,
    dimensions: '4mm, 6mm, or 8mm diameter',
    finish: 'High-polish rhodium-free sterling',
    audience: 'her',
    tags: ['lightweight', 'studs', 'earrings', 'everyday'],
    images: [],
    variants: [
      { sku: 'ASE-4MM', title: '4mm', size: '4mm', weightGrams: 0.6, priceCents: 189000, stock: 15 },
      { sku: 'ASE-6MM', title: '6mm', size: '6mm', weightGrams: 0.9, priceCents: 209000, stock: 12 },
      { sku: 'ASE-8MM', title: '8mm', size: '8mm', weightGrams: 1.3, priceCents: 229000, stock: 8 },
    ],
  },
  {
    slug: 'equinox-statement-ring',
    name: 'Equinox Statement Ring',
    description:
      'A wide-band architectural ring hand-finished in 925 sterling silver with a brushed matte face and polished edges. The Equinox is Argyros at its most sculptural — for those who understand that restraint and presence are not opposites.',
    category: 'Rings',
    metalPurity: '925 Sterling Silver',
    status: ProductStatus.ACTIVE,
    seoTitle: 'Equinox Statement Ring — 925 Sterling Silver | Argyros',
    seoDescription:
      'Wide-band architectural ring in 925 sterling silver with brushed matte face. A bold statement piece in five sizes.',
    weightGrams: 6.2,
    dimensions: '10mm band height · 2.2mm thickness',
    ringSizes: [5, 6, 7, 8, 9],
    finish: 'Brushed matte face with polished bevelled edges',
    audience: 'unisex',
    tags: ['statement', 'ring', 'substantial'],
    images: [],
    variants: [
      { sku: 'ESR-SZ5', title: 'Size 5', size: '5', weightGrams: 5.8, priceCents: 629000, stock: 3 },
      { sku: 'ESR-SZ6', title: 'Size 6', size: '6', weightGrams: 6.0, priceCents: 629000, stock: 5 },
      { sku: 'ESR-SZ7', title: 'Size 7', size: '7', weightGrams: 6.2, priceCents: 629000, stock: 4 },
      { sku: 'ESR-SZ8', title: 'Size 8', size: '8', weightGrams: 6.4, priceCents: 629000, stock: 3 },
      { sku: 'ESR-SZ9', title: 'Size 9', size: '9', weightGrams: 6.6, priceCents: 629000, stock: 2 },
    ],
  },
  {
    slug: 'celestine-choker',
    name: 'Celestine Choker',
    description:
      'A delicate box-chain choker in 925 sterling silver with a lobster clasp and 2cm extension. The 14-inch sits close at the base of the neck; the 16-inch rests at the collarbone — an architectural accent that works alone or layered with the Solace Pendant for a considered neck story.',
    category: 'Necklaces',
    metalPurity: '925 Sterling Silver',
    status: ProductStatus.ACTIVE,
    seoTitle: 'Celestine Choker — 925 Sterling Silver | Argyros',
    seoDescription:
      'Delicate box-chain choker in 925 sterling silver. 14" at the base of the neck, 16" at the collarbone.',
    weightGrams: 4.4,
    dimensions: '1.2mm box chain with 2cm extension link',
    chainLengthsInches: [14, 16],
    finish: 'High-polish rhodium-free sterling',
    audience: 'her',
    tags: ['choker', 'necklace', 'substantial'],
    images: [],
    variants: [
      { sku: 'CC-14', title: '14" + 2cm ext.', size: '14"', weightGrams: 4.2, priceCents: 489000, stock: 7 },
      { sku: 'CC-16', title: '16" + 2cm ext.', size: '16"', weightGrams: 4.6, priceCents: 509000, stock: 9 },
    ],
  },
];

async function main() {
  console.log('🌱 Seeding launch-quality Argyros catalogue (no stock images, verified claims)...');

  // Collections as per Section 5.2
  const collections = [
    {
      slug: 'the-first-edition',
      name: 'The First Edition',
      type: 'EVERGREEN',
      isFeatured: true,
      isPublished: true,
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
      displayOrder: 1,
      sortOrder: 1,
      kind: 'rule',
      description: 'Our most substantial pieces, for those who like silver with presence.',
    },
    {
      slug: 'daily-luxe',
      name: 'Daily Luxe',
      type: 'EVERGREEN',
      isFeatured: true,
      isPublished: true,
      displayOrder: 2,
      sortOrder: 2,
      kind: 'rule',
      description: 'Lightweight pieces for every morning. Quiet luxury, worn daily.',
    },
    {
      slug: 'gifts-under-3000',
      name: 'Gifts Under ₹3,000',
      type: 'CURATED',
      isFeatured: false,
      isPublished: true,
      displayOrder: 3,
      sortOrder: 3,
      kind: 'rule',
      description: 'Beautiful gifts that do not compromise. Curated for thoughtful budgets.',
    },
    {
      slug: 'pahadi-edit',
      name: 'Pahadi Edit',
      type: 'EVERGREEN',
      isFeatured: false,
      isPublished: false, // Coming soon
      displayOrder: 4,
      sortOrder: 4,
      kind: 'editorial',
      description: 'Silver inspired by the hills of Uttarakhand.',
    },
    {
      slug: 'oxidised',
      name: 'Oxidised Collection',
      type: 'EVERGREEN',
      isFeatured: false,
      isPublished: false, // Coming soon
      displayOrder: 5,
      sortOrder: 5,
      kind: 'editorial',
      description: 'Antiqued silver with depth and character.',
    },
    {
      slug: 'bridal-edit',
      name: 'Bridal Edit',
      type: 'EVERGREEN',
      isFeatured: false,
      isPublished: false, // Unpublished per Section 5.2
      displayOrder: 6,
      sortOrder: 6,
      kind: 'editorial',
      description: 'For the bride and everyone she loves. Sterling silver for your most precious moments.',
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
        displayOrder: col.displayOrder,
        sortOrder: col.sortOrder,
        kind: col.kind,
      },
    });
  }

  // Remove diwali-2026 if present
  await prisma.collection.deleteMany({
    where: { slug: 'diwali-2026' },
  });

  console.log(`  ✓ ${collections.length} collections updated`);

  // Clear old Celeste Halo Ring if exists
  await prisma.product.deleteMany({
    where: { slug: 'celeste-halo-ring' },
  });

  // Upsert products
  for (const p of products) {
    const { images, variants, ...productData } = p;

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
          upsert: variants.map((v: any) => ({
            where: { sku: v.sku },
            create: v,
            update: {
              title: v.title,
              size: v.size,
              weightGrams: v.weightGrams,
              priceCents: v.priceCents,
              compareAtCents: v.compareAtCents ?? null,
              stock: v.stock,
            },
          })),
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

    // 3. Daily Luxe: lightweight (Aura, Luna, Nova, Solace) - NO statement pieces!
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

    console.log(`  ✓ ${p.name} (${variants.length} variants, weight: ${p.weightGrams}g)`);
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
