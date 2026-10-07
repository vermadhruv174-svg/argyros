'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { siteConfig } from '@argyros/config';
import { ChevronDown, Mail, Clock, MessageSquare } from 'lucide-react';

export default function SupportPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 shell py-14 md:py-20 space-y-16">
        {/* Hero */}
        <section className="text-center max-w-2xl mx-auto">
          <p className="eyebrow text-gold mb-3">✦ Client Care</p>
          <h1 className="font-display text-4xl md:text-5xl text-ink">We are here to help.</h1>
          <p className="mt-4 text-xs md:text-sm text-neutral-600 leading-relaxed font-light">
            Answers to common questions regarding our made-to-order craft, delivery across India, care, and sizing.
          </p>
        </section>

        {/* 9.1 FAQ Accordion */}
        <section className="max-w-3xl mx-auto border-t border-line pt-10">
          <h2 className="font-display text-3xl text-ink mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="group border border-line rounded p-4 bg-white cursor-pointer">
              <summary className="font-semibold text-xs uppercase tracking-wider list-none flex justify-between items-center text-ink">
                <span>How long does delivery take?</span>
                <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-gold" />
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-neutral-600 border-t border-line/40 pt-3">
                Pieces are made to order. We dispatch within {siteConfig.fulfilment.dispatchBusinessDays.min}–{siteConfig.fulfilment.dispatchBusinessDays.max} business days, and delivery takes {siteConfig.fulfilment.transitBusinessDays.min}–{siteConfig.fulfilment.transitBusinessDays.max} business days after that. You get a tracking link on dispatch.
              </p>
            </details>

            <details className="group border border-line rounded p-4 bg-white cursor-pointer">
              <summary className="font-semibold text-xs uppercase tracking-wider list-none flex justify-between items-center text-ink">
                <span>Do you ship outside India?</span>
                <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-gold" />
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-neutral-600 border-t border-line/40 pt-3">
                Not yet. Argyros currently delivers within India only. International shipping is not available yet.
              </p>
            </details>

            <details className="group border border-line rounded p-4 bg-white cursor-pointer">
              <summary className="font-semibold text-xs uppercase tracking-wider list-none flex justify-between items-center text-ink">
                <span>What is your return policy?</span>
                <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-gold" />
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-neutral-600 border-t border-line/40 pt-3">
                {siteConfig.fulfilment.returnWindowDays} days from delivery for unworn pieces in original packaging. Engraved and bespoke pieces cannot be returned. See{' '}
                <Link href="/returns" className="text-gold underline font-bold">Returns & Refunds</Link>.
              </p>
            </details>

            <details className="group border border-line rounded p-4 bg-white cursor-pointer">
              <summary className="font-semibold text-xs uppercase tracking-wider list-none flex justify-between items-center text-ink">
                <span>What if my size is wrong?</span>
                <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-gold" />
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-neutral-600 border-t border-line/40 pt-3">
                Rings and cuffs: one complimentary size exchange within {siteConfig.fulfilment.sizeExchange.windowDays} days of delivery, unworn.
              </p>
            </details>

            <details className="group border border-line rounded p-4 bg-white cursor-pointer">
              <summary className="font-semibold text-xs uppercase tracking-wider list-none flex justify-between items-center text-ink">
                <span>Is it real silver?</span>
                <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-gold" />
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-neutral-600 border-t border-line/40 pt-3">
                Yes. Every piece is 925 sterling silver: 92.5% pure silver alloyed with other metals for strength.
              </p>
            </details>

            <details id="care" className="group border border-line rounded p-4 bg-white cursor-pointer">
              <summary className="font-semibold text-xs uppercase tracking-wider list-none flex justify-between items-center text-ink">
                <span>Will it tarnish?</span>
                <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-gold" />
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-neutral-600 border-t border-line/40 pt-3">
                Silver naturally darkens over time with air, moisture and perfume. It polishes back easily. Store each piece in its pouch, put jewellery on after perfume and lotion, and wipe with a soft polishing cloth. Avoid swimming pools and hot water.
              </p>
            </details>

            <details className="group border border-line rounded p-4 bg-white cursor-pointer">
              <summary className="font-semibold text-xs uppercase tracking-wider list-none flex justify-between items-center text-ink">
                <span>Do you offer custom pieces?</span>
                <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-gold" />
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-neutral-600 border-t border-line/40 pt-3">
                Yes. See the{' '}
                <Link href="/bespoke" className="text-gold underline font-bold">Bespoke Atelier</Link>.
              </p>
            </details>

            <details className="group border border-line rounded p-4 bg-white cursor-pointer">
              <summary className="font-semibold text-xs uppercase tracking-wider list-none flex justify-between items-center text-ink">
                <span>Is gift packaging included?</span>
                <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-gold" />
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-neutral-600 border-t border-line/40 pt-3">
                Yes, on every order. Gift-ready packaging with a care card and polishing cloth.
              </p>
            </details>

            <details className="group border border-line rounded p-4 bg-white cursor-pointer">
              <summary className="font-semibold text-xs uppercase tracking-wider list-none flex justify-between items-center text-ink">
                <span>Which payment methods do you accept?</span>
                <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-gold" />
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-neutral-600 border-t border-line/40 pt-3">
                We accept UPI, Debit Cards, Credit Cards, and Net Banking securely via Razorpay.
              </p>
            </details>

            <details className="group border border-line rounded p-4 bg-white cursor-pointer">
              <summary className="font-semibold text-xs uppercase tracking-wider list-none flex justify-between items-center text-ink">
                <span>How do I contact you?</span>
                <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-gold" />
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-neutral-600 border-t border-line/40 pt-3">
                Email us at {siteConfig.contact.email} ({siteConfig.contact.hours}).
                {siteConfig.claims.whatsapp.number && (
                  <span> WhatsApp: {siteConfig.claims.whatsapp.number}.</span>
                )}
              </p>
            </details>
          </div>
        </section>

        {/* Contact Strip */}
        <section className="bg-gradient-to-br from-[#0a1628] to-[#07101e] text-white p-8 md:p-12 rounded-[2px] border border-gold/30 text-center max-w-3xl mx-auto space-y-4">
          <p className="eyebrow text-gold">Direct Concierge</p>
          <h2 className="font-display text-3xl text-white">Need personal assistance?</h2>
          <p className="text-xs text-white/70 max-w-md mx-auto">
            Our atelier support is open {siteConfig.contact.hours}.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="button bg-gold text-[#0a1628] hover:bg-[#d4b05a] inline-flex items-center gap-2"
            >
              <Mail size={16} /> Email {siteConfig.contact.email}
            </a>
            {siteConfig.claims.whatsapp.number && (
              <a
                href={`https://wa.me/${siteConfig.claims.whatsapp.number.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="button bg-[#1B5E20] hover:bg-[#2E7D32] inline-flex items-center gap-2"
              >
                <MessageSquare size={16} /> WhatsApp Us
              </a>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
