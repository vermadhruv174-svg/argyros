import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BANNED_PATTERNS = [
  /jaipur/i,
  /unsplash/i,
  /9876543210/,
  /zero dead stock/i,
  /heavy 2\.5/i,
  /bis\b/i,
  /hallmark/i,
  /huid/i,
];

async function runAudit() {
  console.log('\n🔍 Running Argyros Database Audit against banned strings...\n');
  let failures = 0;

  // 1. Audit Products
  const products = await prisma.product.findMany({
    include: { variants: true, images: true },
  });

  console.log(`Checking ${products.length} products...`);
  for (const p of products) {
    const textFields = [p.name, p.slug, p.description, p.seoTitle, p.seoDescription, p.dimensions, p.finish];
    for (const text of textFields) {
      if (!text) continue;
      for (const pattern of BANNED_PATTERNS) {
        if (pattern.test(text)) {
          console.error(`❌ Product "${p.slug}" matches banned pattern ${pattern}: "${text}"`);
          failures++;
        }
      }
    }

    // Check images
    for (const img of p.images) {
      if (/unsplash/i.test(img.url)) {
        console.error(`❌ Product "${p.slug}" image has Unsplash URL: ${img.url}`);
        failures++;
      }
    }

    // Check unverified compareAt discount
    for (const v of p.variants) {
      if (v.compareAtCents && v.compareAtCents > v.priceCents) {
        console.warn(`⚠️ Warning: Product "${p.slug}" variant "${v.sku}" has markdown compareAt: ₹${v.compareAtCents / 100} -> ₹${v.priceCents / 100}`);
      }
    }
  }

  // 2. Audit Collections
  const collections = await prisma.collection.findMany();
  console.log(`Checking ${collections.length} collections...`);
  for (const c of collections) {
    const textFields = [c.name, c.slug, c.description, c.imageUrl];
    for (const text of textFields) {
      if (!text) continue;
      for (const pattern of BANNED_PATTERNS) {
        if (pattern.test(text)) {
          console.error(`❌ Collection "${c.slug}" matches banned pattern ${pattern}: "${text}"`);
          failures++;
        }
      }
    }
  }

  console.log('\n───────────────────────────────────────────────────');
  if (failures > 0) {
    console.error(`❌ Database audit FAILED with ${failures} violations.`);
    process.exit(1);
  } else {
    console.log('✅ Database audit PASSED with 0 banned string violations.');
  }
}

runAudit()
  .catch((e) => {
    console.error('Fatal audit error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
