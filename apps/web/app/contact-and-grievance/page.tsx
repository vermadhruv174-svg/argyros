import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { siteConfig } from '@argyros/config';
import { Mail, Clock, MapPin, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Grievance Redressal & Contact | Argyros',
  description: 'Grievance officer designation, regulatory dispute escalation timelines, registered office address, and contact details for Argyros.',
};

export default function ContactAndGrievancePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 shell py-14 md:py-20">
        <article className="max-w-[70ch] mx-auto space-y-8 text-neutral-800 leading-relaxed font-light text-sm">
          <div>
            <p className="eyebrow text-gold mb-2">✦ Statutory Governance</p>
            <h1 className="font-display text-4xl md:text-5xl text-ink font-normal leading-tight">
              Contact & Grievance Redressal
            </h1>
            <p className="text-xs text-neutral-500 mt-2">
              Last updated: {siteConfig.legal.lastUpdated}
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">1. Corporate & Entity Information</h2>
            <div className="bg-[#f8f6f1] border border-line p-5 rounded space-y-2 text-xs">
              <p><strong>Legal Entity Name:</strong> {siteConfig.legal.entityName}</p>
              <p><strong>Brand:</strong> {siteConfig.brand.name} · {siteConfig.brand.houseLine}</p>
              <p><strong>GSTIN:</strong> {siteConfig.legal.gstin}</p>
              <p><strong>Registered Address:</strong> {siteConfig.legal.registeredAddress}</p>
              <p><strong>Customer Support Mailbox:</strong> {siteConfig.contact.email}</p>
              <p><strong>Support Operating Hours:</strong> {siteConfig.contact.hours}</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">2. Grievance Officer Designation</h2>
            <p>
              In accordance with the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong> and the <strong>Information Technology Act, 2000</strong>, the contact details of the designated Grievance Officer are set forth below:
            </p>
            <div className="bg-white border border-gold/40 p-5 rounded space-y-2 text-xs shadow-sm">
              <p><strong>Officer Name:</strong> {siteConfig.legal.grievanceOfficer.name}</p>
              <p><strong>Designation:</strong> Nodal Grievance Redressal Officer</p>
              <p><strong>Direct Email:</strong> <a href={`mailto:${siteConfig.legal.grievanceOfficer.email}`} className="text-gold font-bold underline">{siteConfig.legal.grievanceOfficer.email}</a></p>
              <p><strong>Phone:</strong> {siteConfig.legal.grievanceOfficer.phone}</p>
              <p><strong>Office Location:</strong> {siteConfig.legal.registeredAddress}</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-ink font-semibold">3. Dispute Escalation & Redressal Mechanism</h2>
            <p>
              We pride ourselves on transparent, heirloom-quality relationships. For any service grievances, order escalations, or data access requests:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Level 1 — Customer Concierge:</strong> Contact <strong>{siteConfig.contact.email}</strong>. Our team resolves standard queries within 24 to 48 hours.
              </li>
              <li>
                <strong>Level 2 — Grievance Redressal:</strong> If your issue is not resolved satisfactorily at Level 1, you may escalate in writing directly to the Grievance Officer at <strong>{siteConfig.legal.grievanceOfficer.email}</strong> quoting your order or ticket number.
              </li>
              <li>
                <strong>Statutory Commitment:</strong> In compliance with applicable regulations, the Grievance Officer shall acknowledge receipt of your complaint within <strong>48 hours</strong> and resolve the grievance within <strong>one month</strong> from the date of receipt.
              </li>
            </ul>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
