import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const orderNumber = `ARG-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = {
      id: `ord-${Date.now()}`,
      number: orderNumber,
      email: payload?.customer?.email || 'customer@argyros.in',
      firstName: payload?.customer?.firstName || 'Valued',
      lastName: payload?.customer?.lastName || 'Client',
      phone: payload?.customer?.phone || null,
      status: 'PAID',
      subtotalCents: 289000,
      shippingCents: 0,
      totalCents: 289000,
      currency: 'INR',
      createdAt: new Date().toISOString(),
      shippingAddress: payload?.shippingAddress || {
        line1: 'Direct Order',
        city: 'New Delhi',
        state: 'Delhi',
        postalCode: '110001',
        country: 'India',
      },
      items: [
        {
          id: `item-${Date.now()}`,
          variantId: 'var-nhr-14',
          sku: 'ARG-NHR-IN14',
          name: 'Nova Halo Ring',
          variantTitle: 'Indian Size 14 (17.3mm)',
          size: 'IN 14',
          metalPurity: '925 Sterling Silver',
          imageUrl: '/images/jewellery-hero.jpg',
          quantity: 1,
          unitPriceCents: 289000,
          lineTotalCents: 289000,
        },
      ],
    };

    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json({ error: 'Checkout failed' }, { status: 400 });
  }
}
