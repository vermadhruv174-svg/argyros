import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { siteConfig } from '@argyros/config';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Returns & Refunds Policy | Argyros',
  description: '7-day return guidelines, size exchange procedures, non-returnable items, and refund processing for Argyros sterling silver jewellery.',
};

export default function ReturnsPolicyPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 shell py-14 md:py-20">
        <article className="max-w-[70ch] mx-auto space-y-8 text-neutral-800 leading-relaxed font-light text-sm">
          <div>
            <p className="eyebrow text-gold mb-2">✦ Client Care & Assurance</p>
            <h1 className="font-display text-4xl md:text-5xl text-ink font-normal leading-tight">
              Returns & Refunds
            </h1>
            <p className="text-xs text-neutral-500 mt-2">
              Last updated: {siteConfig.legal.lastUpdated}
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">1. Return Window & Eligibility</h2>
            <p>
              We want you to love your Argyros pieces. Standard catalogue orders are eligible for return within <strong>{siteConfig.fulfilment.returnWindowDays} days</strong> of verified delivery.
            </p>
            <p>
              To qualify for a refund:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The piece must be completely unworn, undamaged, and free of scratches, perfume, or cosmetic residues.</li>
              <li>The item must be returned in its complete original presentation box, including the microfiber pouch, polishing cloth, care booklet, and outer sleeve.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">2. Non-Returnable & Final Sale Items</h2>
            <p>The following items are strictly non-returnable and non-refundable:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Bespoke Commissions:</strong> Pieces created through the <Link href="/bespoke" className="text-gold underline">Bespoke Atelier</Link> to custom specifications.</li>
              <li><strong>Personalized Engravings:</strong> Pieces customized with initials, dates, or bespoke lettering.</li>
              <li>Items marked explicitly as Final Sale during limited archive drops.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">3. Complimentary Size Exchange</h2>
            <p>
              If your ring or cuff size is not ideal, we offer <strong>one complimentary size exchange</strong> within <strong>{siteConfig.fulfilment.sizeExchange.windowDays} days</strong> of delivery for unworn items. We will coordinate reverse pickup and ship the adjusted size once the returned piece passes inspection.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">4. How to Initiate a Return</h2>
            <p>
              To begin a return or exchange:
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Email our concierge at <strong>{siteConfig.contact.email}</strong> with your order reference number and reason for return.</li>
              <li>Our team will provide return authorization details and schedule an insured courier pickup.</li>
              <li>Once received at our studio, the piece undergoes microscopic inspection for wear and purity verification.</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">5. Refund Processing Timeline</h2>
            <p>
              Upon successful quality inspection, refunds are credited back to the original method of payment (bank account, UPI, credit card) within <strong>5 to 7 business days</strong>. Banks may take an additional 2–3 business days to reflect the credit on your statement.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
