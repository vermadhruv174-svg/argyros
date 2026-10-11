'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { siteConfig } from '@argyros/config';
import { MessageSquare, Mail, Sparkles, Check, ArrowRight } from 'lucide-react';

export function ConciergeTwoPaths() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const whatsappNum = (siteConfig.claims.whatsapp.number || '919412078910').replace(/\D/g, '');
  const whatsappHref = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(
    'Hello Argyros, I would like to speak to a jewellery advisor about a piece.'
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'home_concierge_two_paths' }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="shell py-16 md:py-24" aria-label="Customer Access and Concierge">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Path A: Join for First Access */}
        <div className="p-8 sm:p-10 rounded-[2px] bg-[#FAF8F5] border border-line flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-gold text-[10px] font-bold uppercase tracking-[.22em] mb-3">
              <Mail size={14} />
              <span>Private Access</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-ink">
              Join for Private Releases.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 font-light mt-2 leading-relaxed">
              Receive private invitations to limited batch drops, silversmithing studio notes, and early holiday reservations. We never send promotional spam.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-line/60">
            {submitted ? (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-3 rounded border border-emerald-200">
                <Check size={16} />
                <span>You have been added to the private release list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-2.5 text-xs bg-white border border-line rounded-[2px] focus:outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="button min-h-[42px] px-5 text-xs uppercase tracking-wider bg-ink text-white"
                >
                  {submitting ? 'Joining...' : 'Join →'}
                </button>
              </form>
            )}
            <p className="text-[10px] text-neutral-500 mt-2">
              Unsubscribe anytime. Your details remain confidential.
            </p>
          </div>
        </div>

        {/* Path B: Speak to a Jewellery Advisor */}
        <div className="p-8 sm:p-10 rounded-[2px] bg-[#0a1628] border border-gold/30 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-gold text-[10px] font-bold uppercase tracking-[.22em] mb-3">
              <MessageSquare size={14} />
              <span>Atelier Concierge</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-white">
              Speak to a Jewellery Advisor.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-light mt-2 leading-relaxed">
              Need assistance measuring your ring size, selecting a gift, or commissioning a bespoke heirloom? Our silversmithing team in Haldwani is directly reachable.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="button bg-gold text-[#0a1628] hover:bg-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 flex items-center gap-2 shadow-lg"
              >
                <MessageSquare size={14} />
                <span>Message on WhatsApp</span>
              </a>
              <Link
                href="/support"
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white border border-white/20 hover:border-gold hover:text-gold transition-colors rounded-[2px]"
              >
                Help & Sizing Guide
              </Link>
            </div>
            <p className="text-[10px] text-neutral-400">
              Concierge Hours: Mon–Sat, 10:00 AM – 7:00 PM IST · Typical response under 30 minutes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
