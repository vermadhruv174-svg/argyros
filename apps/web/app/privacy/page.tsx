import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { siteConfig } from '@argyros/config';

export const metadata: Metadata = {
  title: 'Privacy Policy | Argyros',
  description: 'How Argyros collects, stores, processes, and protects your personal data in compliance with DPDP Act 2023.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 shell py-14 md:py-20">
        <article className="max-w-[70ch] mx-auto space-y-8 text-neutral-800 leading-relaxed font-light text-sm">
          <div>
            <p className="eyebrow text-gold mb-2">✦ Legal & Governance</p>
            <h1 className="font-display text-4xl md:text-5xl text-ink font-normal leading-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-neutral-500 mt-2">
              Last updated: {siteConfig.legal.lastUpdated}
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">1. Overview & Data Fiduciary</h2>
            <p>
              This Privacy Policy explains how <strong>{siteConfig.legal.entityName}</strong> (“Argyros”, “we”, “our”, or “us”) collects, uses, and safeguards personal data when you visit our website (argyros.in) or commission pieces from our atelier. We process personal information in adherence with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> of India.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">2. Information We Collect</h2>
            <p>We collect personal information necessary to deliver made-to-order jewellery and provide bespoke concierge services:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Contact & Identity Details:</strong> Full name, delivery address, billing address, phone number, and email address.</li>
              <li><strong>Order & Transaction Records:</strong> Purchased items, metal sizes, engraving texts, payment provider confirmation tokens, and invoice details. We do not store raw card numbers or CVVs.</li>
              <li><strong>Bespoke Inquiries:</strong> Inspiration photographs, dimensional notes, and commission briefs shared via our atelier forms.</li>
              <li><strong>Technical Data:</strong> IP address, device telemetry, and functional cookies essential for shopping bag persistence.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">3. Purpose of Data Processing</h2>
            <p>Your data is processed strictly for legitimate uses:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fabricating and fulfilling made-to-order and bespoke jewellery commissions.</li>
              <li>Insured delivery across India via verified courier partners.</li>
              <li>Issuing GST-compliant tax invoices as mandated by Indian law.</li>
              <li>Responding to support requests, size exchanges, and warranty inquiries.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">4. Data Sharing & Third-Party Processors</h2>
            <p>
              We never sell or trade your data. We share only strictly necessary information with trusted operational partners:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Payment Processors:</strong> Razorpay Software Private Limited for encrypted, PCI-DSS compliant payment processing.</li>
              <li><strong>Logistics Partners:</strong> Insured domestic courier networks (e.g. Blue Dart, Delhivery) for safe delivery.</li>
              <li><strong>Regulatory & Legal Authorities:</strong> Where disclosure is required under applicable Indian laws, tax regulations, or judicial orders.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">5. Data Retention & Security</h2>
            <p>
              We retain transactional and order records for statutory accounting periods mandated under Indian tax laws. Bespoke images and references are stored securely with strict role-based access.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">6. Your Rights Under DPDP Act 2023</h2>
            <p>
              You possess the right to request access to the personal data we hold about you, request rectification of inaccurate records, or seek erasure of data subject to statutory retention limits. To exercise these rights, contact our Grievance Officer at <strong>{siteConfig.legal.grievanceOfficer.email}</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">7. Grievance Officer</h2>
            <p>
              In accordance with the Information Technology Act, 2000 and the DPDP Act, 2023, the details of our Grievance Officer are:
            </p>
            <div className="bg-[#f8f6f1] border border-line p-4 rounded text-xs space-y-1">
              <p><strong>Name:</strong> {siteConfig.legal.grievanceOfficer.name}</p>
              <p><strong>Email:</strong> {siteConfig.legal.grievanceOfficer.email}</p>
              <p><strong>Entity:</strong> {siteConfig.legal.entityName}</p>
              <p><strong>Address:</strong> {siteConfig.legal.registeredAddress}</p>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
