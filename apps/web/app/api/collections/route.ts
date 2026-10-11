import { NextResponse } from 'next/server';
import { FOUNDATION_COLLECTIONS } from '@/lib/catalogue-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const collectionsWithCount = FOUNDATION_COLLECTIONS.map((c) => ({
    ...c,
    _count: {
      products: c.productCount,
    },
  }));

  return NextResponse.json(collectionsWithCount);
}
