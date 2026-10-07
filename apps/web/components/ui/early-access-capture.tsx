'use client';

import React, { useState } from 'react';

interface EarlyAccessCaptureProps {
  source?: string;
  className?: string;
}

export function EarlyAccessCapture({ source = 'home', className = '' }: EarlyAccessCaptureProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });

      if (res.ok) {
        setSuccess(true);
        setEmail('');
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.message || 'Unable to join at this time. Please try again.');
      }
    } catch {
      setErrorMsg('Unable to reach server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`rounded-[2px] p-8 md:p-12 bg-gradient-to-br from-[#0a1628] to-[#07101e] text-white border border-gold/30 shadow-2xl relative overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_100%_0%,rgba(197,160,80,0.15),transparent_70%)] pointer-events-none" />

      <div className="max-w-xl relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[.22em] text-gold mb-2">
          Exclusive Access
        </p>
        <h3 className="font-display text-3xl md:text-4xl text-white tracking-tight">
          Be first to know.
        </h3>
        <p className="mt-3 text-xs md:text-sm text-white/75 leading-relaxed">
          Join the list for the first edition, early access and bespoke openings. No spam, unsubscribe anytime.
        </p>

        {success ? (
          <div className="mt-6 p-4 bg-white/10 border border-gold/40 text-gold rounded text-xs font-semibold">
            ✦ Welcome to Argyros. You are on the private first-edition list.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3.5 bg-white/5 border border-white/20 rounded text-xs text-white placeholder-white/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              />
              <button
                type="submit"
                disabled={loading}
                className="button min-h-[46px] px-8 bg-gold hover:bg-[#d4b05a] text-[#0a1628] font-bold text-xs uppercase tracking-widest whitespace-nowrap"
              >
                {loading ? 'Joining...' : 'Join the List →'}
              </button>
            </div>
            {errorMsg && (
              <p className="text-xs text-red-400 font-medium">{errorMsg}</p>
            )}
            <p className="text-[10px] text-white/50">
              By subscribing you agree to our{' '}
              <a href="/privacy" className="underline hover:text-gold">
                Privacy Policy
              </a>
              .
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
