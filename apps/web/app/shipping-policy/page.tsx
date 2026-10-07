import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { siteConfig } from '@argyros/config';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shipping Policy | Argyros',
  description: 'Pan-India insured shipping timelines, courier partners, complimentary delivery thresholds, and transit guidelines for Argyros sterling silver.',
};

export default function ShippingPolicyPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 shell py-14 md:py-20">
        <article className="max-w-[70ch] mx-auto space-y-8 text-neutral-800 leading-relaxed font-light text-sm">
          <div>
            <p className="eyebrow text-gold mb-2">✦ Fulfilment & Logistics</p>
            <h1 className="font-display text-4xl md:text-5xl text-ink font-normal leading-tight">
              Shipping Policy
            </h1>
            <p className="text-xs text-neutral-500 mt-2">
              Last updated: {siteConfig.legal.lastUpdated}
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">1. Delivery Coverage</h2>
            <p className="p-4 bg-[#f8f6f1] border border-line rounded font-normal text-ink">
              ✦ <strong>Delivering across India.</strong> International shipping is not available yet.
            </p>
            <p>
              We ship to all serviceable postal codes across India using verified, insured express courier partners.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">2. Shipping Charges</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Orders above ₹{siteConfig.fulfilment.freeShippingAbove.toLocaleString('en-IN')}:</strong> Complimentary insured shipping across India.</li>
              <li><strong>Orders below ₹{siteConfig.fulfilment.freeShippingAbove.toLocaleString('en-IN')}:</strong> Flat nominal fee of ₹{siteConfig.fulfilment.flatShippingBelow} applied at checkout.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">3. Production & Transit Timelines</h2>
            <p>
              Because every piece is crafted to order in our atelier:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Dispatch Timeline:</strong> {siteConfig.fulfilment.dispatchBusinessDays.min} to {siteConfig.fulfilment.dispatchBusinessDays.max} business days from order confirmation.</li>
              <li><strong>Transit Timeline:</strong> {siteConfig.fulfilment.transitBusinessDays.min} to {siteConfig.fulfilment.transitBusinessDays.max} business days following dispatch, depending on metro vs non-metro destinations.</li>
              <li>You will receive an automated dispatch notification with your tracking link as soon as your package is handed over to the courier. You may also track production stages anytime on our <Link href="/track" className="text-gold underline">Tracking Portal</Link>.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">4. Insured Transit & Parcel Inspection</h2>
            <p>
              Every shipment is fully insured until signed delivery.
            </p>
            <p>
              <strong>Damaged or Tampered Parcels:</strong> If the outer security packaging appears tampered with or severely damaged upon arrival, please photograph the package immediately and do not accept delivery. Any transit damage or missing item claims must be reported to <strong>{siteConfig.contact.email}</strong> within <strong>48 hours</strong> of delivery with photographic evidence. An unboxing video recorded continuously from the sealed outer polybag is strongly recommended for rapid claim settlement.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
