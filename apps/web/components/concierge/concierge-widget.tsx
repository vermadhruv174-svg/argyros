'use client';

import React, { useState, useEffect } from 'react';
import { siteConfig } from '@argyros/config';
import {
  MessageSquare,
  X,
  Phone,
  Mail,
  Sparkles,
  Clock,
  ShieldCheck,
  Send,
  HelpCircle,
  CheckCircle2,
  Gem,
  Compass
} from 'lucide-react';

export function ConciergeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'directory' | 'services'>('chat');

  // Quick message state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [queryTopic, setQueryTopic] = useState('Ring Sizing Advisory');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const phone = siteConfig.contact.phone || '+91 94120 78910';
  const whatsappNum = (siteConfig.claims.whatsapp.number || '919412078910').replace(/\D/g, '');
  const careEmail = siteConfig.contact.email || 'care@argyros.in';
  const bespokeEmail = (siteConfig.contact as any).bespokeEmail || 'bespoke@argyros.in';
  const conciergeEmail = (siteConfig.contact as any).conciergeEmail || 'concierge@argyros.in';

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleStartWhatsApp = (customTopic?: string) => {
    const topic = customTopic || queryTopic;
    const text = encodeURIComponent(
      `Hi Argyros Concierge, I would like assistance regarding: ${topic}.`
    );
    window.open(`https://wa.me/${whatsappNum}?text=${text}`, '_blank');
  };

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: `[Topic: ${queryTopic}] ${message.trim()}`,
          consentAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setSentSuccess(true);
        setTimeout(() => {
          setSentSuccess(false);
          setMessage('');
        }, 5000);
      }
    } catch {
      // fallback
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Open Argyros Concierge & Support"
          className="group flex items-center gap-2.5 bg-[#0a1628]/95 hover:bg-[#0a1628] text-white pl-3.5 pr-4 py-2.5 rounded-full border border-gold/40 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-gold focus:outline-none focus:ring-2 focus:ring-gold cursor-pointer"
        >
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
            <MessageSquare size={15} />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </span>
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-[.18em] text-gold font-bold">
              ✦ Concierge
            </span>
            <span className="text-[11px] font-medium tracking-tight text-white/90">
              Support & Chat
            </span>
          </div>
        </button>
      </div>

      {/* Slide-over / Popout Concierge Window */}
      {isOpen && (
        <div
          className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-50 w-full sm:w-[420px] max-h-[92vh] sm:max-h-[640px] bg-paper border border-line rounded-[2px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="concierge-heading"
        >
          {/* Header */}
          <div className="bg-[#0a1628] text-white p-5 border-b border-gold/30 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-[.2em] text-gold font-bold mb-1">
                <Sparkles size={12} />
                <span>House of Siddhi Jewellers</span>
              </div>
              <h2 id="concierge-heading" className="font-display text-2xl text-white">
                Client Concierge
              </h2>
              <p className="text-[11px] text-white/70 font-light mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                <span>Online · 10:00 AM – 7:00 PM IST</span>
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white/60 hover:text-white transition-colors"
              aria-label="Close Concierge"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 border-b border-line bg-[#FAF8F5] text-center text-xs">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-3 font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === 'chat' ? 'text-ink font-extrabold' : 'text-neutral-500 hover:text-ink'
              }`}
            >
              Quick Chat
              {activeTab === 'chat' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gold" />}
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={`py-3 font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === 'directory' ? 'text-ink font-extrabold' : 'text-neutral-500 hover:text-ink'
              }`}
            >
              Directory
              {activeTab === 'directory' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gold" />}
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`py-3 font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === 'services' ? 'text-ink font-extrabold' : 'text-neutral-500 hover:text-ink'
              }`}
            >
              Services
              {activeTab === 'services' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gold" />}
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            {/* TAB 1: QUICK CHAT / WHATSAPP */}
            {activeTab === 'chat' && (
              <div className="space-y-4">
                {/* Fast-Track WhatsApp Banner */}
                <div className="p-4 rounded-[2px] bg-emerald-950/20 border border-emerald-600/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" /> WhatsApp Direct Link
                    </span>
                    <span className="text-[10px] text-neutral-500">Instant</span>
                  </div>
                  <p className="text-neutral-700 leading-relaxed font-light">
                    Connect directly with our Haldwani jewellery advisors for real-time video inspection, size help, or stock availability.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleStartWhatsApp()}
                    className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold uppercase tracking-wider text-[11px] flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <MessageSquare size={15} />
                    <span>Chat on WhatsApp ({phone})</span>
                  </button>
                </div>

                {/* Common Topics Selector */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    Select an inquiry topic:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Ring Sizing Help',
                      'Bespoke Commission',
                      'Silver Hallmarking',
                      'Order Status / Tracking',
                    ].map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => {
                          setQueryTopic(topic);
                          handleStartWhatsApp(topic);
                        }}
                        className="p-2.5 text-left border border-line rounded bg-white hover:border-gold hover:text-gold transition-colors text-[11px] font-medium"
                      >
                        ✦ {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instant In-App Message Box */}
                <form onSubmit={handleQuickSubmit} className="pt-2 border-t border-line space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                    Or transmit an inquiry right here:
                  </p>

                  {sentSuccess ? (
                    <div className="p-4 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <p className="text-[11px]">
                        Message transmitted to our concierge team. We will email you back within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="p-2 border border-line rounded bg-white text-xs focus:border-gold focus:outline-none"
                        />
                        <input
                          type="email"
                          required
                          placeholder="Your Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="p-2 border border-line rounded bg-white text-xs focus:border-gold focus:outline-none"
                        />
                      </div>
                      <textarea
                        required
                        rows={3}
                        placeholder="Type your question or custom request here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-2 border border-line rounded bg-white text-xs focus:border-gold focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={sending}
                        className="button w-full py-2.5 text-xs flex items-center justify-center gap-2 shadow"
                      >
                        <Send size={14} />
                        <span>{sending ? 'Transmitting...' : 'Send to Concierge'}</span>
                      </button>
                    </>
                  )}
                </form>
              </div>
            )}

            {/* TAB 2: DEDICATED DIRECTORY */}
            {activeTab === 'directory' && (
              <div className="space-y-3.5">
                {/* Customer Care */}
                <div className="p-3.5 rounded bg-[#FAF8F5] border border-line space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-gold font-bold block">
                    Customer Care & Orders
                  </span>
                  <a href={`mailto:${careEmail}`} className="text-sm font-bold text-ink hover:text-gold flex items-center gap-2">
                    <Mail size={14} /> {careEmail}
                  </a>
                  <p className="text-[11px] text-neutral-500 font-light">
                    For order updates, shipping, sizing exchanges, and returns.
                  </p>
                </div>

                {/* Bespoke Edition */}
                <div className="p-3.5 rounded bg-[#FAF8F5] border border-line space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-gold font-bold block">
                    Bespoke Atelier Edition
                  </span>
                  <a href={`mailto:${bespokeEmail}`} className="text-sm font-bold text-ink hover:text-gold flex items-center gap-2">
                    <Mail size={14} /> {bespokeEmail}
                  </a>
                  <p className="text-[11px] text-neutral-500 font-light">
                    For custom one-off commissions, wax carving, and heirloom remodels.
                  </p>
                </div>

                {/* Private Concierge */}
                <div className="p-3.5 rounded bg-[#FAF8F5] border border-line space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-gold font-bold block">
                    Private Concierge & Gifting
                  </span>
                  <a href={`mailto:${conciergeEmail}`} className="text-sm font-bold text-ink hover:text-gold flex items-center gap-2">
                    <Mail size={14} /> {conciergeEmail}
                  </a>
                  <p className="text-[11px] text-neutral-500 font-light">
                    Dedicated corporate gifting, wedding trousseau edits, and private curations.
                  </p>
                </div>

                {/* Direct Phone / Studio */}
                <div className="p-3.5 rounded bg-[#0a1628] text-white border border-gold/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-widest text-gold font-bold">
                      Direct Atelier Line
                    </span>
                    <span className="text-[9px] text-white/50">Haldwani, Uttarakhand</span>
                  </div>
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-sm font-bold text-white hover:text-gold flex items-center gap-2">
                    <Phone size={14} /> {phone}
                  </a>
                  <p className="text-[10px] text-white/70 font-light leading-relaxed">
                    House of Siddhi Jewellers · Main Market, Bareilly - Nainital Rd, Haldwani. Serving families since 1974.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: CONCIERGE SERVICES */}
            {activeTab === 'services' && (
              <div className="space-y-3">
                <div className="p-3 rounded border border-line bg-white space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-ink">
                    <Gem size={14} className="text-gold" />
                    <span>Complimentary Ring Sizer by Post</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 font-light">
                    Unsure of your Indian ring size? Message us with your delivery address and we will dispatch a physical measurement gauge complimentary.
                  </p>
                </div>

                <div className="p-3 rounded border border-line bg-white space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-ink">
                    <Compass size={14} className="text-gold" />
                    <span>Virtual 1-on-1 Consultation</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 font-light">
                    Schedule a 15-minute video call to view pieces under natural daylight, inspect chain drape, or review kada wrist dimensions.
                  </p>
                </div>

                <div className="p-3 rounded border border-line bg-white space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-ink">
                    <Sparkles size={14} className="text-gold" />
                    <span>Ancestral Heirloom Remodel</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 font-light">
                    Bring older family silver ornaments to be tested for fine purity, melted, and reimagined into contemporary sculptural editions.
                  </p>
                </div>

                <div className="p-3 rounded border border-line bg-white space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-ink">
                    <ShieldCheck size={14} className="text-gold" />
                    <span>Lifetime Bench Polishing</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 font-light">
                    Every Argyros piece comes with lifetime complimentary bench buffing and ultrasonic cleaning at our Haldwani workshop.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="bg-[#FAF8F5] border-t border-line px-5 py-3 text-[10px] text-neutral-500 flex items-center justify-between">
            <span>Operating Hours: 10 AM – 7 PM IST</span>
            <span className="text-gold font-bold">House of Siddhi 925</span>
          </div>
        </div>
      )}
    </>
  );
}
