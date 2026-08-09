import { PrismaClient, ProductStatus } from '@prisma/client';

const prisma = new PrismaClient();

const UNSPLASH = 'https://images.unsplash.com';

const products = [
  {
    slug: 'celeste-halo-ring',
    name: 'Celeste Halo Ring',
    description:
      'A softly sculpted halo ring in certified 925 sterling silver, set with micro-pavé cubic zirconia. The Celeste captures candlelight and moonlight in equal measure — designed to be worn every day, from first morning light to last.',
    category: 'Rings',
    metalPurity: '925 Sterling Silver',
    status: ProductStatus.ACTIVE,
    seoTitle: 'Celeste Halo Ring — 925 Sterling Silver | Argyros',
    seoDescription:
      'A delicate halo ring in certified 925 sterling silver with micro-pavé cubic zirconia. Free shipping on orders above ₹2,999.',
    images: [
      {
        url: `${UNSPLASH}/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85`,
        alt: 'Celeste Halo Ring in 925 sterling silver',
        position: 0,
      },
      {
        url: `${UNSPLASH}/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85`,
        alt: 'Celeste Halo Ring — side view',
        position: 1,
      },
    ],
    variants: [
      { sku: 'CHR-SZ5', title: 'Size 5', size: '5', weightGrams: 2.8, priceCents: 289000, compareAtCents: 349000, stock: 4 },
      { sku: 'CHR-SZ6', title: 'Size 6', size: '6', weightGrams: 2.9, priceCents: 289000, compareAtCents: 349000, stock: 8 },
      { sku: 'CHR-SZ7', title: 'Size 7', size: '7', weightGrams: 3.0, priceCents: 289000, compareAtCents: 349000, stock: 6 },
      { sku: 'CHR-SZ8', title: 'Size 8', size: '8', weightGrams: 3.1, priceCents: 289000, compareAtCents: 349000, stock: 3 },
      { sku: 'CHR-SZ9', title: 'Size 9', size: '9', weightGrams: 3.2, priceCents: 289000, compareAtCents: 349000, stock: 2 },
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
    images: [
      {
        url: `${UNSPLASH}/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85`,
        alt: 'Luna Hoop Earrings in 925 sterling silver',
        position: 0,
      },
    ],
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
    images: [
      {
        url: `${UNSPLASH}/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85`,
        alt: 'Solace Pendant in 925 sterling silver',
        position: 0,
      },
    ],
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
    images: [
      {
        url: `${UNSPLASH}/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=900&q=85`,
        alt: 'Atlas Chain Bracelet in 925 sterling silver',
        position: 0,
      },
    ],
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
    images: [
      {
        url: `${UNSPLASH}/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=85`,
        alt: 'Meridian Cuff in 925 sterling silver',
        position: 0,
      },
    ],
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
    images: [
      {
        url: `${UNSPLASH}/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=85`,
        alt: 'Aura Stud Earrings in 925 sterling silver',
        position: 0,
      },
    ],
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
    images: [
      {
        url: `${UNSPLASH}/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=85`,
        alt: 'Equinox Statement Ring in 925 sterling silver',
        position: 0,
      },
    ],
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
      'A delicate box-chain choker in 925 sterling silver with a lobster clasp and 2cm extension. The Celestine sits precisely at the collarbone — an architectural accent that works alone or layered with the Solace Pendant for a considered neck story.',
    category: 'Necklaces',
    metalPurity: '925 Sterling Silver',
    status: ProductStatus.ACTIVE,
    seoTitle: 'Celestine Choker — 925 Sterling Silver | Argyros',
    seoDescription:
      'Delicate box-chain choker in 925 sterling silver. Sits at the collarbone — available in 14" and 16" with extension.',
    images: [
      {
        url: `${UNSPLASH}/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=85`,
        alt: 'Celestine Choker in 925 sterling silver',
        position: 0,
      },
    ],
    variants: [
      { sku: 'CC-14', title: '14" + 2cm ext.', size: '14"', weightGrams: 4.2, priceCents: 489000, stock: 7 },
      { sku: 'CC-16', title: '16" + 2cm ext.', size: '16"', weightGrams: 4.6, priceCents: 509000, stock: 9 },
    ],
  },
];

async function main() {
  console.log('🌱 Seeding Argyros catalogue...');

  // Upsert collections
  const collections = [
    { slug: 'rings', name: 'Rings', description: 'Sculptural rings in 925 sterling silver' },
    { slug: 'earrings', name: 'Earrings', description: 'Hoops, studs and drops in 925 sterling silver' },
    { slug: 'necklaces', name: 'Necklaces', description: 'Pendants and chains in 925 sterling silver' },
    { slug: 'bracelets', name: 'Bracelets', description: 'Cuffs, bangles and chains in 925 sterling silver' },
  ];

  for (const col of collections) {
    await prisma.collection.upsert({
      where: { slug: col.slug },
      create: col,
      update: { name: col.name, description: col.description },
    });
  }

  console.log(`  ✓ ${collections.length} collections`);

  // Upsert products
  for (const p of products) {
    const { images, variants, ...productData } = p;

    await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        ...productData,
        images: { create: images },
        variants: { create: variants },
      },
      update: {
        ...productData,
        images: {
          deleteMany: {},
          create: images,
        },
        variants: {
          upsert: variants.map((v) => ({
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

    // Link to collection by category
    const categorySlug = p.category.toLowerCase();
    const collection = await prisma.collection.findUnique({
      where: { slug: categorySlug },
    });
    const product = await prisma.product.findUnique({ where: { slug: p.slug } });

    if (collection && product) {
      await prisma.productCollection.upsert({
        where: { productId_collectionId: { productId: product.id, collectionId: collection.id } },
        create: { productId: product.id, collectionId: collection.id },
        update: {},
      });
    }

    console.log(`  ✓ ${p.name} (${variants.length} variants)`);
  }

  console.log(`\n✅ Seeded ${products.length} products successfully.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
