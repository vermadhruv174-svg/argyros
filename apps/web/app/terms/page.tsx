import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { siteConfig } from '@argyros/config';
import Link from 'next/link';
import { LegalDraftBanner } from '@/components/legal/legal-draft-banner';

export const metadata: Metadata = {
  title: 'Terms of Service | Argyros',
  description: 'Terms governing the purchase of made-to-order 925 sterling silver jewellery and bespoke commissions from Argyros.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 shell py-14 md:py-20">
        <article className="max-w-[70ch] mx-auto space-y-8 text-neutral-800 leading-relaxed font-light text-sm">
          <LegalDraftBanner />
          <div>
            <p className="eyebrow text-gold mb-2">✦ Legal & Governance</p>
            <h1 className="font-display text-4xl md:text-5xl text-ink font-normal leading-tight">
              Terms of Service
            </h1>
            <p className="text-xs text-neutral-500 mt-2">
              Last updated: {siteConfig.legal.lastUpdated}
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">1. Acceptance of Terms</h2>
            <p>
              These Terms of Service govern your use of the website <strong>argyros.in</strong> and the purchase of goods from <strong>{siteConfig.legal.entityName}</strong> (“Argyros”). By placing an order, initiating a bespoke commission, or accessing our platform, you accept these terms in full.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">2. Made-to-Order Nature & Lead Times</h2>
            <p>
              Argyros operates a refined made-to-order model to ensure zero inventory compromise. Every piece is cast, finished, and inspected upon order placement.
            </p>
            <p>
              Standard orders are dispatched within <strong>{siteConfig.fulfilment.dispatchBusinessDays.min} to {siteConfig.fulfilment.dispatchBusinessDays.max} business days</strong>. Delivery transit requires an additional <strong>{siteConfig.fulfilment.transitBusinessDays.min} to {siteConfig.fulfilment.transitBusinessDays.max} business days</strong> depending on your destination pincode in India.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">3. Pricing & Taxes</h2>
            <p>
              All prices shown on the storefront are quoted in Indian Rupees (INR) and are <strong>inclusive of applicable GST</strong>. We reserve the right to correct manifest pricing errors prior to order dispatch. If a pricing error occurs, we will notify you and offer the option to reconfirm at the correct rate or cancel for a full refund.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">4. Bespoke Commissions</h2>
            <p>
              Custom commissions managed through our <Link href="/bespoke" className="text-gold underline">Bespoke Atelier</Link> operate under staged milestones:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>No charge is levied until wax/model approval.</li>
              <li>A non-refundable {siteConfig.bespoke.advancePercentAfterApproval}% production advance is required upon model approval to commence silver casting.</li>
              <li>Because bespoke pieces are fabricated exclusively to individual client specifications, they are <strong>strictly non-returnable and non-refundable</strong> once casting has commenced.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">5. Intellectual Property</h2>
            <p>
              All trademarks, product photography, editorial copy, silhouettes, CAD models, and brand logos on argyros.in are the exclusive property of {siteConfig.legal.entityName}. Reproduction or commercial use without prior written consent is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">6. Governing Law & Jurisdiction</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>{siteConfig.legal.jurisdictionCity}</strong>.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
