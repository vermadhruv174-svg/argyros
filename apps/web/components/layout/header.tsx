'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronDown
} from 'lucide-react';
import { SearchModal } from '@/components/search/search-modal';
import { LanguageSelector } from './language-selector';

export function Header() {
  const pathname = usePathname();
  const { totalQuantity, openDrawer } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const announcements = [
    t('announcement.free_shipping', `COMPLIMENTARY SHIPPING ON ORDERS ABOVE ₹${siteConfig.fulfilment.freeShippingAbove.toLocaleString('en-IN')}`),
    t('announcement.purity', '925 STERLING SILVER'),
    t('announcement.heritage', siteConfig.brand.houseLine),
    t('announcement.packaging', 'GIFT-READY PACKAGING ON EVERY ORDER'),
    t('announcement.made_to_order', 'SCULPTURAL STERLING SILVER · MADE TO ORDER'),
  ];

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

      {/* 3.2 Header */}
      <header className="sticky top-0 z-40 liquid-glass border-b border-line/60 transition-all duration-300">
        <div className="shell flex h-[76px] items-center justify-between md:grid md:grid-cols-3">
          {/* Mobile hamburger */}
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
                    {t('nav.all_pieces', 'All Pieces →')}
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
            {/* Multilingual Selector */}
            <LanguageSelector />

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

        {/* Mobile full-screen glass drawer */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 top-[110px] z-50 bg-[#0a1628]/95 backdrop-blur-2xl text-white p-8 overflow-y-auto animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <nav className="flex flex-col space-y-4 text-xs font-bold uppercase tracking-[.2em]">
              {/* Language Switcher inside Mobile Drawer */}
              <div className="pb-3 border-b border-white/10">
                <LanguageSelector variant="expanded" />
              </div>

              <div className="text-[10px] text-gold font-normal tracking-widest uppercase border-b border-white/10 pb-2">
                Catalogue / आभूषण
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="py-2.5 min-h-[44px] flex items-center gap-2 text-gold hover:underline text-left uppercase tracking-[.2em] font-bold"
              >
                <Search size={14} /> {t('action.open_search', 'Search Catalogue')}
              </button>
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="py-2.5 min-h-[44px] flex items-center hover:text-gold">
                {t('nav.all_pieces', 'Shop All Pieces')}
              </Link>
              <Link href="/shop?category=rings" onClick={() => setMobileMenuOpen(false)} className="py-2 min-h-[44px] flex items-center text-white/80 hover:text-gold pl-3">
                — {t('nav.rings', 'Rings')}
              </Link>
              <Link href="/shop?category=earrings" onClick={() => setMobileMenuOpen(false)} className="py-2 min-h-[44px] flex items-center text-white/80 hover:text-gold pl-3">
                — {t('nav.earrings', 'Earrings')}
              </Link>
              <Link href="/shop?category=necklaces" onClick={() => setMobileMenuOpen(false)} className="py-2 min-h-[44px] flex items-center text-white/80 hover:text-gold pl-3">
                — {t('nav.necklaces', 'Necklaces')}
              </Link>
              <Link href="/shop?category=bracelets" onClick={() => setMobileMenuOpen(false)} className="py-2 min-h-[44px] flex items-center text-white/80 hover:text-gold pl-3">
                — {t('nav.bracelets', 'Bracelets & Cuffs')}
              </Link>

              <div className="text-[10px] text-gold font-normal tracking-widest uppercase border-b border-white/10 pb-2 pt-4">
                Explore & Atelier / कलेक्शन्स
              </div>
              <Link href="/collections" onClick={() => setMobileMenuOpen(false)} className="py-2.5 min-h-[44px] flex items-center hover:text-gold">
                {t('nav.collections', 'Collections & Edits')}
              </Link>
              <Link href="/gifts" onClick={() => setMobileMenuOpen(false)} className="py-2.5 min-h-[44px] flex items-center hover:text-gold">
                {t('nav.gifts', 'Gift Finder')}
              </Link>
              <Link href="/bespoke" onClick={() => setMobileMenuOpen(false)} className="py-2.5 min-h-[44px] flex items-center text-gold">
                {t('nav.bespoke', '✦ Bespoke Atelier')}
              </Link>
              <Link href="/heritage" onClick={() => setMobileMenuOpen(false)} className="py-2.5 min-h-[44px] flex items-center hover:text-gold">
                {t('nav.heritage', 'Our Heritage')}
              </Link>

              <div className="text-[10px] text-gold font-normal tracking-widest uppercase border-b border-white/10 pb-2 pt-4">
                Client Care / सेवा
              </div>
              <Link href="/support" onClick={() => setMobileMenuOpen(false)} className="py-2 min-h-[44px] flex items-center hover:text-gold">
                Support & FAQ
              </Link>
              <Link href="/track" onClick={() => setMobileMenuOpen(false)} className="py-2 min-h-[44px] flex items-center hover:text-gold">
                Track Order
              </Link>
              <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="py-2 min-h-[44px] flex items-center text-gold">
                {user ? `Account (${user.firstName || user.email})` : 'Sign In / Register'}
              </Link>
            </nav>
          </div>
        )}
      </header>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
