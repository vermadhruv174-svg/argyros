import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { fetchOrderByNumber } from '@/lib/api-client';

interface PageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { orderNumber } = await params;
  const order = await fetchOrderByNumber(orderNumber);

  if (!order) {
    notFound();
  }

  const subtotalRupees = Math.round(order.subtotalCents / 100);
  const shippingRupees = Math.round(order.shippingCents / 100);
  const totalRupees = Math.round(order.totalCents / 100);

  return (
    <>
      <Header />
      <main className="flex-1 shell py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header Banner */}
          <div className="bg-[#f3f0ea] p-8 border border-line text-center">
            <p className="eyebrow text-gold">Order Confirmed</p>
            <h1 className="font-display text-4xl md:text-5xl mt-2">{order.number}</h1>
            <p className="mt-4 text-sm leading-6 text-neutral-600 max-w-md mx-auto">
              Thank you for choosing Argyros, {order.firstName}. Your order has been placed successfully.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
              Status: {order.status}
            </div>
          </div>

          {/* Customer & Shipping Summary */}
          <div className="mt-10 grid gap-8 sm:grid-cols-2 border-y border-line py-8 text-sm">
            <div>
              <h2 className="font-display text-xl border-b border-line pb-2 text-ink">
                Customer Details
              </h2>
              <p className="mt-3 font-semibold">{order.firstName} {order.lastName}</p>
              <p className="text-neutral-600 mt-1">{order.email}</p>
              {order.phone && <p className="text-neutral-600 mt-1">{order.phone}</p>}
            </div>

            <div>
              <h2 className="font-display text-xl border-b border-line pb-2 text-ink">
                Shipping Address
              </h2>
              <p className="mt-3 font-semibold">{order.firstName} {order.lastName}</p>
              <p className="text-neutral-600 mt-1">{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && (
                <p className="text-neutral-600 mt-1">{order.shippingAddress.line2}</p>
              )}
              <p className="text-neutral-600 mt-1">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p className="text-neutral-600 mt-1">{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Items Purchased */}
          <section className="mt-10" aria-label="Purchased Items">
            <h2 className="font-display text-2xl border-b border-line pb-3">
              Items Purchased
            </h2>
            <ul className="divide-y divide-line border-b border-line">
              {order.items.map((item) => {
                const unitRupees = Math.round(item.unitPriceCents / 100);
                const lineRupees = Math.round(item.lineTotalCents / 100);
                  <li key={item.id} className="py-6 flex gap-6 items-center">
                    <div className="relative aspect-[4/5] w-20 shrink-0 bg-[#0a1628] rounded-[2px] overflow-hidden flex items-center justify-center border border-gold/20">
                      {item.imageUrl && !item.imageUrl.includes('unsplash.com') ? (
                        <Image src={item.imageUrl} alt={item.name} fill sizes="80px" className="object-cover" />
                      ) : (
                        <span className="font-display text-sm text-gold">A</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="eyebrow text-gold text-[8px]">{item.metalPurity || '925 Sterling Silver'}</p>
                      <h3 className="font-display text-xl leading-none mt-1">{item.name}</h3>
                      {item.variantTitle && (
                        <p className="text-xs text-neutral-500 mt-1">Option: {item.variantTitle}</p>
                      )}
                      <p className="text-xs text-neutral-500 mt-1">
                        ₹{unitRupees.toLocaleString('en-IN')} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right font-semibold text-sm">
                      ₹{lineRupees.toLocaleString('en-IN')}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Financial Breakdown */}
          <div className="mt-8 bg-[#f3f0ea] p-6 border border-line space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">₹{subtotalRupees.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-neutral-600 text-xs">
              <span>Shipping</span>
              <span>
                {shippingRupees === 0 ? (
                  <span className="text-emerald-700 font-semibold">COMPLIMENTARY</span>
                ) : (
                  `₹${shippingRupees.toLocaleString('en-IN')}`
                )}
              </span>
            </div>
            <div className="flex justify-between font-display text-2xl border-t border-line pt-3 text-ink">
              <span>Total Paid</span>
              <span>₹{totalRupees.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/shop" className="button inline-flex">
              Continue Shopping →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
