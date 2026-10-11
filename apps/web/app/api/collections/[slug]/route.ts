import { NextRequest, NextResponse } from 'next/server';
import { FOUNDATION_COLLECTIONS, FOUNDATION_PRODUCTS } from '@/lib/catalogue-data';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const collection = FOUNDATION_COLLECTIONS.find((c) => c.slug === slug);

  if (!collection) {
    return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
  }

  // Determine items in collection
  let matchingProducts = FOUNDATION_PRODUCTS;
  if (slug !== 'the-first-edition') {
    matchingProducts = FOUNDATION_PRODUCTS.filter((p) =>
      p.collections.some((col) => col.slug === slug)
    );
  }

  return NextResponse.json({
    ...collection,
    products: matchingProducts.map((p) => ({
      product: p,
    })),
  });
}
