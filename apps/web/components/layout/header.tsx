'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { siteConfig } from '@argyros/config';
import {
  Menu,
  X,
  Search,
  User as UserIcon,
  ShoppingBag,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Compass,
  ShieldCheck,
  Package,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';
import { SearchModal } from '@/components/search/search-modal';

export function Header() {
  const pathname = usePathname();
  const { totalQuantity, openDrawer } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [headerBottom, setHeaderBottom] = useState(108);

  const announcements = [
    t('announcement.free_shipping', `COMPLIMENTARY SHIPPING ON ORDERS ABOVE ₹${siteConfig.fulfilment.freeShippingAbove.toLocaleString('en-IN')}`),
    t('announcement.purity', '925 STERLING SILVER'),
    t('announcement.heritage', siteConfig.brand.houseLine),
    t('announcement.packaging', 'GIFT-READY PACKAGING ON EVERY ORDER'),
    t('announcement.made_to_order', 'SCULPTURAL STERLING SILVER · MADE TO ORDER'),
  ];

  // Track header bottom position dynamically so drawer is always flush underneath
  useEffect(() => {
    const updateHeaderPos = () => {
      if (headerRef.current) {
        setHeaderBottom(Math.round(headerRef.current.getBoundingClientRect().bottom));
      }
    };
    updateHeaderPos();
    window.addEventListener('resize', updateHeaderPos);
    window.addEventListener('scroll', updateHeaderPos, { passive: true });
    return () => {
      window.removeEventListener('resize', updateHeaderPos);
      window.removeEventListener('scroll', updateHeaderPos);
    };
  }, [mobileMenuOpen]);

  // Close mobile drawer on route change or Escape
  useEffect(() => {
    setMobileMenuOpen(false);
    setShopDropdownOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setShopDropdownOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* 3.1 Announcement Bar */}
      <div
        className="overflow-hidden bg-[#0a1628] py-2 text-[11px] font-bold tracking-[.22em] text-[#E5D7B7] uppercase"
        role="region"
        aria-label="Announcements"
      >
        <div className="marquee-track flex whitespace-nowrap">
          <div className="flex items-center shrink-0">
            {announcements.map((item, idx) => (
              <span key={`a1-${idx}`} className="flex items-center">
                <span>{item}</span>
                <span className="mx-6 text-gold md:mx-10" aria-hidden="true">
                  ✦
                </span>
              </span>
            ))}
          </div>
          <div className="flex items-center shrink-0" aria-hidden="true">
            {announcements.map((item, idx) => (
              <span key={`a2-${idx}`} className="flex items-center">
                <span>{item}</span>
                <span className="mx-6 text-gold md:mx-10">
                  ✦
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3.2 Header (z-50 so toggle and logo remain clickable above the blur overlay) */}
      <header
        ref={headerRef}
        className="sticky top-0 z-50 liquid-glass border-b border-line/60 transition-all duration-300"
      >
        <div className="shell flex h-[76px] items-center justify-between md:grid md:grid-cols-3">
          {/* Mobile hamburger toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 text-ink hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} className="stroke-[1.5]" /> : <Menu size={22} className="stroke-[1.5]" />}
            </button>
          </div>

          {/* Desktop primary nav */}
          <nav className="hidden items-center gap-4 text-[10px] font-bold uppercase tracking-[.16em] md:flex lg:gap-6" aria-label="Main Navigation">
            {/* Shop dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1 hover:text-gold transition-colors ${
                  isActive('/shop') ? 'text-gold font-extrabold' : ''
                }`}
                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    setShopDropdownOpen(true);
                  }
                }}
                aria-haspopup="menu"
                aria-expanded={shopDropdownOpen}
              >
                <span>{t('nav.shop', 'Shop')}</span>
                <ChevronDown size={12} className={`stroke-[1.5] transition-transform ${shopDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {shopDropdownOpen && (
                <div
                  role="menu"
                  aria-orientation="vertical"
                  className="absolute top-full left-0 w-48 bg-[#0a1628] text-white py-3 px-2 shadow-2xl rounded-sm border border-gold/20 flex flex-col space-y-1.5 animate-in fade-in duration-150 z-50"
                >
                  <Link role="menuitem" href="/shop?category=rings" className="px-3 py-2 text-[10px] tracking-wider hover:text-gold hover:bg-white/5 transition-colors">
                    {t('nav.rings', 'Rings')}
                  </Link>
                  <Link role="menuitem" href="/shop?category=earrings" className="px-3 py-2 text-[10px] tracking-wider hover:text-gold hover:bg-white/5 transition-colors">
                    {t('nav.earrings', 'Earrings')}
                  </Link>
                  <Link role="menuitem" href="/shop?category=necklaces" className="px-3 py-2 text-[10px] tracking-wider hover:text-gold hover:bg-white/5 transition-colors">
                    {t('nav.necklaces', 'Necklaces')}
                  </Link>
                  <Link role="menuitem" href="/shop?category=bracelets" className="px-3 py-2 text-[10px] tracking-wider hover:text-gold hover:bg-white/5 transition-colors">
                    {t('nav.bracelets', 'Bracelets & Cuffs')}
                  </Link>
                  <div className="border-t border-white/10 my-1"></div>
                  <Link role="menuitem" href="/shop" className="px-3 py-2 text-[10px] tracking-wider hover:text-gold font-bold transition-colors">
                    {t('nav.all_pieces', 'Shop All Pieces')}
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/collections"
              className={`hover:text-gold transition-colors py-2 relative group ${
                isActive('/collections') ? 'text-gold font-extrabold' : ''
              }`}
            >
              <span>{t('nav.collections', 'Collections')}</span>
              <span className={`absolute bottom-0 left-0 h-[1.5px] bg-gold transition-all duration-300 ${isActive('/collections') ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>

            <Link
              href="/gifts"
              className={`hover:text-gold transition-colors py-2 relative group ${
                isActive('/gifts') ? 'text-gold font-extrabold' : ''
              }`}
            >
              <span>{t('nav.gifts', 'Gifts')}</span>
              <span className={`absolute bottom-0 left-0 h-[1.5px] bg-gold transition-all duration-300 ${isActive('/gifts') ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>

            <Link
              href="/bespoke"
              className={`hover:text-gold transition-colors py-2 relative group text-[#8A6A2F] ${
                isActive('/bespoke') ? 'text-gold font-extrabold' : ''
              }`}
            >
              <span>{t('nav.bespoke', '✦ Bespoke')}</span>
              <span className={`absolute bottom-0 left-0 h-[1.5px] bg-gold transition-all duration-300 ${isActive('/bespoke') ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>

            <Link
              href="/heritage"
              className={`hover:text-gold transition-colors py-2 relative group ${
                isActive('/heritage') ? 'text-gold font-extrabold' : ''
              }`}
            >
              <span>{t('nav.heritage', 'Our Heritage')}</span>
              <span className={`absolute bottom-0 left-0 h-[1.5px] bg-gold transition-all duration-300 ${isActive('/heritage') ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
          </nav>

          {/* Brand Logo */}
          <div className="flex items-center justify-center">
            <Link href="/" className="font-display text-[2.2rem] tracking-[-.04em] whitespace-nowrap text-ink">
              Argyros<span className="text-gold">.</span>
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center justify-end gap-2.5 text-[10px] font-bold uppercase tracking-[.14em] lg:gap-4">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:text-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Open search overlay"
            >
              <Search size={18} className="stroke-[1.5]" />
            </button>
            <Link
              href="/account"
              className="p-2 hover:text-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Account"
            >
              <UserIcon size={18} className="stroke-[1.5]" />
            </Link>
            <button
              type="button"
              onClick={openDrawer}
              className="p-2 hover:text-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center relative cursor-pointer"
              aria-label={`Shopping Bag (${totalQuantity} items)`}
            >
              <ShoppingBag size={18} className="stroke-[1.5]" />
              <span className="ml-1 inline-grid h-5 w-5 place-items-center rounded-full bg-ink text-[9px] text-white shadow-sm font-bold">
                {totalQuantity}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Background Blur Backdrop Overlay with Smooth Transition Effect ──── */}
      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-xl transition-all duration-300 ease-out md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile Navigation Drawer: 3 Structured Rows with Dedicated Scroll ── */}
      <div
        style={{
          top: `${headerBottom}px`,
          height: `calc(100dvh - ${headerBottom}px)`,
        }}
        className={`fixed inset-x-0 z-40 bg-[#0a1628]/96 backdrop-blur-2xl text-white shadow-2xl transition-all duration-300 ease-out md:hidden flex flex-col border-t border-gold/30 ${
          mobileMenuOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        {/* Scrollable Container with Smooth Touch Scrolling */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 space-y-7 pb-28">

          {/* Quick Search Action */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setIsSearchOpen(true);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-[2px] bg-white/[0.07] border border-white/15 text-left text-xs text-white/70 hover:text-gold hover:border-gold/50 transition-all cursor-pointer shadow-inner"
          >
            <Search size={15} className="text-gold shrink-0" />
            <span className="font-light">{t('action.open_search', 'Search pieces, collections, rings...')}</span>
          </button>

          {/* ════════════════════════════════════════════════════════════════════
              ROW 01: THE JEWELLERY CATALOGUE (5 Category Cards + All Pieces)
             ════════════════════════════════════════════════════════════════════ */}
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] uppercase font-bold tracking-[.22em] text-gold flex items-center gap-1.5">
                <span>01</span>
                <span className="text-white/40">·</span>
                <span>Jewellery Catalogue</span>
              </span>
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[10px] uppercase tracking-widest text-white/70 hover:text-gold flex items-center gap-1 font-semibold"
              >
                <span>View All</span>
                <ArrowRight size={10} />
              </Link>
            </div>

            {/* Catalogue Categories: 2-Column Responsive Card Grid */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="col-span-2 p-3.5 rounded-[2px] bg-gradient-to-r from-gold/15 via-gold/10 to-transparent border border-gold/40 hover:border-gold transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="font-display text-base text-white group-hover:text-gold transition-colors font-medium">
                    Shop All Pieces
                  </p>
                  <p className="text-[10px] text-white/60 tracking-wider uppercase font-light">
                    Solid 925 Sterling · Full Living Index
                  </p>
                </div>
                <ArrowRight size={14} className="text-gold group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/shop?category=rings"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-[2px] bg-white/[0.05] border border-white/10 hover:border-gold/50 hover:bg-white/[0.09] transition-all flex flex-col justify-between"
              >
                <span className="font-display text-sm text-white font-medium">{t('nav.rings', 'Rings')}</span>
                <span className="text-[9px] uppercase tracking-widest text-gold/80 mt-1">Solitaire & Halos</span>
              </Link>

              <Link
                href="/shop?category=earrings"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-[2px] bg-white/[0.05] border border-white/10 hover:border-gold/50 hover:bg-white/[0.09] transition-all flex flex-col justify-between"
              >
                <span className="font-display text-sm text-white font-medium">{t('nav.earrings', 'Earrings')}</span>
                <span className="text-[9px] uppercase tracking-widest text-gold/80 mt-1">Hoops, Studs & Drops</span>
              </Link>

              <Link
                href="/shop?category=necklaces"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-[2px] bg-white/[0.05] border border-white/10 hover:border-gold/50 hover:bg-white/[0.09] transition-all flex flex-col justify-between"
              >
                <span className="font-display text-sm text-white font-medium">{t('nav.necklaces', 'Necklaces')}</span>
                <span className="text-[9px] uppercase tracking-widest text-gold/80 mt-1">Chokers & Pendants</span>
              </Link>

              <Link
                href="/shop?category=bracelets"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-[2px] bg-white/[0.05] border border-white/10 hover:border-gold/50 hover:bg-white/[0.09] transition-all flex flex-col justify-between"
              >
                <span className="font-display text-sm text-white font-medium">{t('nav.bracelets', 'Bracelets & Cuffs')}</span>
                <span className="text-[9px] uppercase tracking-widest text-gold/80 mt-1">Sculptural Bangles</span>
              </Link>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════════
              ROW 02: ATELIER & COLLECTION WORLDS
             ════════════════════════════════════════════════════════════════════ */}
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] uppercase font-bold tracking-[.22em] text-gold flex items-center gap-1.5">
                <span>02</span>
                <span className="text-white/40">·</span>
                <span>Atelier & Editions</span>
              </span>
            </div>

            {/* Featured Bespoke Atelier Banner Card */}
            <Link
              href="/bespoke"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-4 rounded-[2px] bg-gradient-to-br from-[#1a2e4a] via-[#0f2038] to-[#0a1628] border border-gold/40 hover:border-gold transition-all relative overflow-hidden group shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-widest">
                  <Sparkles size={14} className="animate-pulse" />
                  <span>✦ Bespoke Haldwani Atelier</span>
                </div>
                <ArrowRight size={14} className="text-gold group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-white/80 font-light mt-1.5 leading-relaxed">
                Commission a one-of-one sculptural piece crafted by Master Karigars at House of Siddhi Jewellers.
              </p>
            </Link>

            {/* Curations Grid */}
            <div className="grid grid-cols-3 gap-2">
              <Link
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-[2px] bg-white/[0.05] border border-white/10 hover:border-gold/50 hover:bg-white/[0.09] transition-all flex flex-col items-center text-center group"
              >
                <Compass size={16} className="text-gold mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="font-display text-xs text-white font-medium">{t('nav.collections', 'Collections')}</span>
                <span className="text-[8px] uppercase tracking-widest text-white/50 mt-0.5">6 Worlds</span>
              </Link>

              <Link
                href="/gifts"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-[2px] bg-white/[0.05] border border-white/10 hover:border-gold/50 hover:bg-white/[0.09] transition-all flex flex-col items-center text-center group"
              >
                <Sparkles size={16} className="text-gold mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="font-display text-xs text-white font-medium">{t('nav.gifts', 'Gift Finder')}</span>
                <span className="text-[8px] uppercase tracking-widest text-white/50 mt-0.5">Curated</span>
              </Link>

              <Link
                href="/heritage"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-[2px] bg-white/[0.05] border border-white/10 hover:border-gold/50 hover:bg-white/[0.09] transition-all flex flex-col items-center text-center group"
              >
                <ShieldCheck size={16} className="text-gold mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="font-display text-xs text-white font-medium">{t('nav.heritage', 'Heritage')}</span>
                <span className="text-[8px] uppercase tracking-widest text-white/50 mt-0.5">Karigars</span>
              </Link>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════════
              ROW 03: CLIENT CARE & CONCIERGE
             ════════════════════════════════════════════════════════════════════ */}
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] uppercase font-bold tracking-[.22em] text-gold flex items-center gap-1.5">
                <span>03</span>
                <span className="text-white/40">·</span>
                <span>Client Care & Concierge</span>
              </span>
            </div>

            <div className="space-y-1.5">
              <Link
                href="/track"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-[2px] bg-white/[0.04] border border-white/10 hover:border-gold/50 hover:bg-white/[0.08] transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <Package size={14} className="text-gold" />
                  <span className="font-medium">Track Order & Courier Dispatch</span>
                </div>
                <ArrowRight size={12} className="text-white/40" />
              </Link>

              <Link
                href="/support"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-[2px] bg-white/[0.04] border border-white/10 hover:border-gold/50 hover:bg-white/[0.08] transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle size={14} className="text-gold" />
                  <span className="font-medium">Support, Ring Sizing & BIS FAQs</span>
                </div>
                <ArrowRight size={12} className="text-white/40" />
              </Link>

              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-[2px] bg-white/[0.04] border border-white/10 hover:border-gold/50 hover:bg-white/[0.08] transition-all text-xs text-gold"
              >
                <div className="flex items-center gap-3">
                  <UserIcon size={14} className="text-gold" />
                  <span className="font-bold tracking-wider uppercase">
                    {user ? `Account (${user.firstName || user.email})` : 'Client Sign In / Register'}
                  </span>
                </div>
                <ArrowRight size={12} className="text-gold" />
              </Link>
            </div>

            {/* Atelier Concierge Live Help Notice */}
            <div className="pt-2">
              <a
                href="https://wa.me/919999999999?text=Hello%20Argyros%2C%20I%20would%20like%20to%20inquire%20about%20a%20piece."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-3 rounded-[2px] border border-gold/30 bg-gold/10 hover:bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest transition-all"
              >
                <MessageCircle size={14} />
                <span>WhatsApp Atelier Concierge (Haldwani)</span>
              </a>
            </div>
          </section>

        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
