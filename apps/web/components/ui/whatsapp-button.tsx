'use client';

import React from 'react';
import { siteConfig } from '@argyros/config';
import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const number = siteConfig.claims.whatsapp.number;

  // Never render if not configured or empty
  if (!number || number.trim().length === 0) {
    return null;
  }

  const message = encodeURIComponent(
    'Hi Argyros, I would like to inquire about your 925 sterling silver collection.'
  );
  const waUrl = `https://wa.me/${number.replace(/\D/g, '')}?text=${message}`;

  return (
    <aside aria-label="Customer Concierge">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Concierge"
        className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 bg-[#0a1628]/95 hover:bg-[#0a1628] text-white pl-3.5 pr-4 py-2.5 rounded-full border border-gold/40 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-gold focus:outline-none focus:ring-2 focus:ring-gold"
      >
        <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
          <MessageCircle size={16} className="fill-current stroke-none" />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        </span>
        <div className="flex flex-col text-left">
          <span className="text-[9px] uppercase tracking-[.18em] text-gold font-bold">
            Concierge
          </span>
          <span className="text-[11px] font-medium tracking-tight text-white/90">
            WhatsApp
          </span>
        </div>
      </a>
    </aside>
  );
}
