'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { siteConfig } from '@argyros/config';
import { Mail, Clock, MessageSquare, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      setSuccess(true);
      return;
    }

    if (!name || !email || !message) {
      setError('Please fill in your name, email, and message.');
      return;
    }

    if (!consent) {
      setError('Please accept the Privacy Policy to submit your message.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          orderNumber: orderNumber.trim() || undefined,
          message: message.trim(),
          consentAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Unable to transmit message. Please try again.');
      }
    } catch {
      setError('Connection error. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 shell py-14 md:py-20">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center">
            <p className="eyebrow text-gold mb-3">✦ Atelier Concierge</p>
            <h1 className="font-display text-4xl md:text-5xl text-ink">Contact Us</h1>
            <p className="mt-3 text-xs md:text-sm text-neutral-600 font-light max-w-md mx-auto">
              Our studio is open {siteConfig.contact.hours}. We acknowledge every inquiry within 24 to 48 hours.
            </p>
          </div>

          <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 items-start">
            {/* Contact Details */}
            <div className="p-8 bg-[#0a1628] text-white rounded-[2px] space-y-6">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-gold font-bold block mb-1">Direct Mailbox</span>
                <a href={`mailto:${siteConfig.contact.email}`} className="text-sm font-semibold hover:text-gold transition-colors flex items-center gap-2">
                  <Mail size={16} /> {siteConfig.contact.email}
                </a>
              </div>

              <div>
                <span className="text-[9px] uppercase tracking-widest text-gold font-bold block mb-1">Operating Hours</span>
                <p className="text-xs text-white/80 flex items-center gap-2">
                  <Clock size={16} /> {siteConfig.contact.hours}
                </p>
              </div>

              {siteConfig.claims.whatsapp.number && (
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-gold font-bold block mb-1">WhatsApp Fast-Track</span>
                  <a
                    href={`https://wa.me/${siteConfig.claims.whatsapp.number.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-2 font-bold"
                  >
                    <MessageSquare size={16} /> Chat on WhatsApp
                  </a>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 text-[10px] text-white/60 leading-relaxed font-light">
                For order status updates, you may also use our instant{' '}
                <Link href="/track" className="text-gold underline">Order Tracking tool</Link>.
              </div>
            </div>

            {/* Form */}
            <div className="bg-white border border-line p-8 rounded-[2px] shadow-sm">
              {success ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 size={40} className="text-gold mx-auto" />
                  <h3 className="font-display text-2xl text-ink">Message Transmitted</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed max-w-xs mx-auto">
                    Thank you, {name}. Our client care team will review your message and respond to {email} shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="phone_alt"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div>
                    <label htmlFor="contactName" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      id="contactName"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-line p-3 text-xs focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactEmail" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      id="contactEmail"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-line p-3 text-xs focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactOrder" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Order Number (Optional)
                    </label>
                    <input
                      id="contactOrder"
                      type="text"
                      placeholder="e.g. ARG-2026-ABCD"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      className="w-full border border-line p-3 text-xs focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactMsg" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      id="contactMsg"
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can our atelier assist you?"
                      className="w-full border border-line p-3 text-xs focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="contactConsent"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="contactConsent" className="text-xs text-neutral-600">
                      I agree to be contacted regarding this message and accept the{' '}
                      <Link href="/privacy" className="underline hover:text-gold">Privacy Policy</Link>.
                    </label>
                  </div>

                  {error && (
                    <p className="text-xs text-red-600 font-medium bg-red-50 p-3 border border-red-200 rounded">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="button w-full text-xs font-bold uppercase tracking-widest mt-2"
                  >
                    {loading ? 'Sending...' : 'Send Message →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
