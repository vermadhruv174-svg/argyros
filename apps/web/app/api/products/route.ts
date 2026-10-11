import { NextRequest, NextResponse } from 'next/server';
import { FOUNDATION_PRODUCTS, getProductSummary } from '@/lib/catalogue-data';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase().trim() || '';
  const category = searchParams.get('category')?.toLowerCase().trim() || '';

  let products = FOUNDATION_PRODUCTS;

  if (category) {
    products = products.filter(
      (p) => p.category.toLowerCase() === category || (category === 'bracelets' && p.category.toLowerCase().includes('bracelet'))
    );
  }

  if (q) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  const summaries = products.map(getProductSummary);

  return NextResponse.json({
    data: summaries,
    meta: {
      total: summaries.length,
      limit: 24,
      nextCursor: null,
    },
  });
}
