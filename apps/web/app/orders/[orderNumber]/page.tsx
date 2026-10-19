import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { fetchOrderByNumber } from '@/lib/api-client';

interface PageProps {
  params: Promise<{ orderNumber: string }>;
  searchParams?: Promise<{ t?: string }>;
}

export default async function OrderConfirmationPage({ params, searchParams }: PageProps) {
  const { orderNumber } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const token = resolvedSearchParams?.t;

  if (!token) {
    redirect(`/track?orderNumber=${encodeURIComponent(orderNumber)}`);
  }

  const order = await fetchOrderByNumber(orderNumber, token);

  if (!order) {
    redirect(`/track?orderNumber=${encodeURIComponent(orderNumber)}`);
  }

  const subtotalRupees = Math.round(order.subtotalCents / 100);
  const shippingRupees = Math.round(order.shippingCents / 100);
  const totalRupees = Math.round(order.totalCents / 100);

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 shell py-12 md:py-20">
        <div className="max-w-3xl mx-auto space-y-10">
          
          {/* ─── Atelier Deed of Authenticity Certificate Banner ─────────── */}
          <div className="bg-[#0a1628] text-white p-8 md:p-12 border-2 border-gold/40 shadow-2xl relative overflow-hidden rounded-[2px]">
            {/* Ambient Background Gold Halo */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/15 border border-gold/40 text-gold rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
                <span>✦ ATELIER DEED OF AUTHENTICITY ✦</span>
              </div>
              <p className="eyebrow text-gold tracking-widest text-xs">House of Siddhi Jewellers · Haldwani Atelier</p>
              <h1 className="font-display text-4xl md:text-5xl text-white mt-2 font-normal">
                Commission #{order.number}
              </h1>
              <p className="mt-4 text-xs md:text-sm leading-relaxed text-white/80 max-w-lg mx-auto">
                Thank you for acquiring with Argyros, {order.firstName}. Your commission has been officially confirmed and allocated to our master silversmithing workshop.
              </p>

              {/* Status Badge */}
              <div className="mt-6 inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-4 py-1.5 text-xs font-semibold tracking-wider rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Status: {order.status}</span>
              </div>
            </div>

            {/* Atelier Craftsmanship Pledge */}
            <div className="mt-8 pt-6 border-t border-gold/20 grid sm:grid-cols-3 gap-4 text-center text-xs text-white/70">
              <div>
                <p className="text-gold font-semibold">100% Solid 925</p>
                <p className="text-[11px] text-white/50 mt-0.5">Assay hallmarked silver</p>
              </div>
              <div>
                <p className="text-gold font-semibold">Karigar Finished</p>
                <p className="text-[11px] text-white/50 mt-0.5">Hand polished in Uttarakhand</p>
              </div>
              <div>
                <p className="text-gold font-semibold">Insured Transit</p>
                <p className="text-[11px] text-white/50 mt-0.5">White-glove courier delivery</p>
              </div>
            </div>
          </div>

          {/* ─── Atelier Creation Timeline Stepper ─────────────────────── */}
          <div className="bg-white p-6 md:p-8 border border-line">
            <h2 className="eyebrow text-gold text-xs border-b border-line pb-3">
              Silversmithing & Fulfillment Stages
            </h2>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-950 space-y-1">
                <span className="font-bold block text-[10px] text-emerald-700">01. ALLOCATED</span>
                <p className="font-semibold">Commission Placed</p>
                <p className="text-[11px] text-emerald-800">Silversmith bench reserved</p>
              </div>

              <div className="p-3 bg-neutral-50 border border-line rounded text-neutral-700 space-y-1">
                <span className="font-bold block text-[10px] text-gold">02. BENCH WORK</span>
                <p className="font-semibold">Casting & Finishing</p>
                <p className="text-[11px] text-neutral-500">Master karigar handcrafting</p>
              </div>

              <div className="p-3 bg-neutral-50 border border-line rounded text-neutral-700 space-y-1">
                <span className="font-bold block text-[10px] text-neutral-400">03. ASSAY</span>
                <p className="font-semibold">Assay & Hallmarking</p>
                <p className="text-[11px] text-neutral-500">Purity verification certificate</p>
              </div>

              <div className="p-3 bg-neutral-50 border border-line rounded text-neutral-700 space-y-1">
                <span className="font-bold block text-[10px] text-neutral-400">04. DISPATCH</span>
                <p className="font-semibold">Insured Transit</p>
                <p className="text-[11px] text-neutral-500">Direct to your doorstep</p>
              </div>
            </div>
          </div>

          {/* ─── Client Registry & Courier Destination Summary ──────────── */}
          <div className="grid gap-8 sm:grid-cols-2 bg-white p-6 md:p-8 border border-line text-sm">
            <div>
              <div className="flex items-center justify-between border-b border-line pb-2">
                <h2 className="font-display text-xl text-ink">Client Details</h2>
                <span className="eyebrow text-gold text-[8px]">Confidential</span>
              </div>
              <p className="mt-3 font-semibold text-ink">{order.firstName} {order.lastName}</p>
              <p className="text-neutral-600 mt-1">{order.email}</p>
              {order.phone && <p className="text-neutral-600 mt-1 font-mono text-xs">{order.phone}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between border-b border-line pb-2">
                <h2 className="font-display text-xl text-ink">Insured Shipping Premises</h2>
                <span className="eyebrow text-gold text-[8px]">White-Glove Courier</span>
              </div>
              <p className="mt-3 font-semibold text-ink">{order.firstName} {order.lastName}</p>
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

          {/* ─── Items Commissioned ────────────────────────────────────── */}
          <section aria-labelledby="purchased-items-heading" className="bg-white p-6 md:p-8 border border-line">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h2 id="purchased-items-heading" className="font-display text-2xl text-ink">
                Pieces Handcrafted Under This Deed
              </h2>
              <span className="eyebrow text-gold text-[9px]">Solid 925 Hallmark</span>
            </div>
            
            <ul className="divide-y divide-line">
              {order.items.map((item) => {
                const unitRupees = Math.round(item.unitPriceCents / 100);
                const lineRupees = Math.round(item.lineTotalCents / 100);
                return (
                  <li key={item.id} className="py-6 flex gap-6 items-center">
                    <div className="relative aspect-[4/5] w-20 shrink-0 bg-[#0a1628] rounded-[2px] overflow-hidden flex items-center justify-center border border-gold/20">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill sizes="80px" className="object-cover" />
                      ) : (
                        <span className="font-display text-sm text-gold">A</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="eyebrow text-gold text-[8px]">{item.metalPurity || '925 Sterling Silver'}</p>
                      <h3 className="font-display text-xl leading-none mt-1">{item.name}</h3>
                      {item.variantTitle && (
                        <p className="text-xs text-neutral-500 mt-1">Specification: {item.variantTitle}</p>
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

          {/* ─── Financial Breakdown ───────────────────────────────────── */}
          <div className="bg-[#f3f0ea] p-6 md:p-8 border border-line space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Subtotal</span>
              <span className="font-semibold">₹{subtotalRupees.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-neutral-600 text-xs">
              <span>Insured Courier Shipping</span>
              <span>
                {shippingRupees === 0 ? (
                  <span className="text-emerald-700 font-semibold">COMPLIMENTARY</span>
                ) : (
                  `₹${shippingRupees.toLocaleString('en-IN')}`
                )}
              </span>
            </div>
            <div className="flex justify-between font-display text-2xl border-t border-line pt-4 text-ink">
              <span>Total Settled</span>
              <span className="text-gold">₹{totalRupees.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* ─── Luxury Actions & Concierge Support ─────────────────────── */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/shop" className="button w-full sm:w-auto inline-flex items-center justify-center">
              Explore More Creations →
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/track?orderNumber=${encodeURIComponent(order.number)}`}
                className="px-4 py-2.5 border border-line bg-white hover:border-gold text-xs font-semibold rounded text-neutral-700 transition-colors"
              >
                Track Live Workshop Status
              </Link>

              <a
                href={`https://wa.me/919412078910?text=Hello%20Argyros%20Atelier,%20inquiring%20about%20my%20Commission%20Deed%20%23${encodeURIComponent(order.number)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold rounded text-emerald-900 transition-colors inline-flex items-center gap-1.5"
              >
                <span>💬 WhatsApp Concierge</span>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
