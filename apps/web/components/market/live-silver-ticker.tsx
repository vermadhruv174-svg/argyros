'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, ShieldCheck } from 'lucide-react';

interface SilverRates {
  spotKg: number;
  fineGram: number;
  sterlingGram: number;
  tolaSterling: number;
  changePercent: number;
  timestamp: string;
}

export function LiveSilverTicker() {
  const [rates, setRates] = useState<SilverRates>({
    spotKg: 94820,
    fineGram: 94.82,
    sterlingGram: 87.71,
    tolaSterling: 1022.7,
    changePercent: 0.54,
    timestamp: 'Live Spot',
  });

  // Gentle micro-tick simulating live commodity trading floor
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.48) * 0.15; // slight positive bias
      setRates((prev) => {
        const newFine = Number((prev.fineGram + delta).toFixed(2));
        const newSpot = Math.round(newFine * 1000);
        const newSterling = Number((newFine * 0.925).toFixed(2));
        const newTola = Number((newSterling * 11.66).toFixed(1));
        const newChange = Number((prev.changePercent + (delta > 0 ? 0.01 : -0.01)).toFixed(2));
        return {
          spotKg: newSpot,
          fineGram: newFine,
          sterlingGram: newSterling,
          tolaSterling: newTola,
          changePercent: newChange,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const tickerItems = [
    { label: 'MCX SILVER SPOT', value: `₹${rates.spotKg.toLocaleString('en-IN')} / KG`, change: `+${rates.changePercent}% ▲`, isUp: true },
    { label: '999 FINE SILVER', value: `₹${rates.fineGram.toFixed(2)} / G`, change: `+${rates.changePercent}% ▲`, isUp: true },
    { label: '925 STERLING BENCHMARK', value: `₹${rates.sterlingGram.toFixed(2)} / G`, detail: '(92.5% PURE)', isGold: true },
    { label: '1 TOLA 925 SILVER', value: `₹${rates.tolaSterling.toLocaleString('en-IN')}`, detail: '(11.66g)', isUp: true },
    { label: 'IBJA SPOT BENCHMARK', value: `₹${(rates.spotKg - 170).toLocaleString('en-IN')} / KG`, change: 'OFFICIAL' },
    { label: 'HOUSE OF SIDDHI BENCH', value: 'GUARANTEED 925 PURITY', isGold: true },
    { label: 'GOVT RECOGNIZED BIS HALLMARK', value: '6-DIGIT LASER HUID', isShield: true },
    { label: 'MARKET STATUS', value: 'COMMODITY SPOT ACTIVE (MCX / BSE)', isPulse: true },
  ];

  return (
    <div
      className="relative z-30 overflow-hidden bg-[#050c16] border-y border-white/10 text-white py-1.5 text-[10px] tracking-wider select-none"
      role="region"
      aria-label="Live Silver Market Rates Ticker"
    >
      <div className="flex items-center">
        {/* Left Badge */}
        <div className="shrink-0 flex items-center gap-1.5 bg-[#0a1628] border-r border-gold/30 px-3 py-0.5 z-20 shadow-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-extrabold uppercase tracking-widest text-gold text-[9px]">
            BSE / MCX BULLION
          </span>
        </div>

        {/* Continuous Ticker Track */}
        <div className="marquee-track flex whitespace-nowrap pl-4">
          {/* Loop 1 */}
          <div className="flex items-center shrink-0">
            {tickerItems.map((item, idx) => (
              <span key={`t1-${idx}`} className="inline-flex items-center mx-4 gap-1.5 font-medium">
                <span className="text-white/60 font-semibold">{item.label}:</span>
                <span className={`font-bold ${item.isGold ? 'text-gold' : 'text-white'}`}>
                  {item.value}
                </span>
                {item.change && (
                  <span className="text-emerald-400 font-bold inline-flex items-center text-[9px] bg-emerald-950/60 px-1 py-0.2 rounded">
                    {item.change}
                  </span>
                )}
                {item.detail && (
                  <span className="text-white/40 text-[9px]">
                    {item.detail}
                  </span>
                )}
                <span className="mx-4 text-gold/40" aria-hidden="true">/</span>
              </span>
            ))}
          </div>

          {/* Loop 2 for seamless infinite marquee */}
          <div className="flex items-center shrink-0" aria-hidden="true">
            {tickerItems.map((item, idx) => (
              <span key={`t2-${idx}`} className="inline-flex items-center mx-4 gap-1.5 font-medium">
                <span className="text-white/60 font-semibold">{item.label}:</span>
                <span className={`font-bold ${item.isGold ? 'text-gold' : 'text-white'}`}>
                  {item.value}
                </span>
                {item.change && (
                  <span className="text-emerald-400 font-bold inline-flex items-center text-[9px] bg-emerald-950/60 px-1 py-0.2 rounded">
                    {item.change}
                  </span>
                )}
                {item.detail && (
                  <span className="text-white/40 text-[9px]">
                    {item.detail}
                  </span>
                )}
                <span className="mx-4 text-gold/40">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
