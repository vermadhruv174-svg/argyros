import { NextRequest, NextResponse } from 'next/server';
import { FOUNDATION_PRODUCTS } from '@/lib/catalogue-data';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = FOUNDATION_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}
