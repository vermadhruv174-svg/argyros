import Link from 'next/link';
import { siteConfig } from '@argyros/config';
import { Instagram, Facebook, Youtube } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-[#0a1628] text-white">
      {/* 4 columns layout */}
      <div className="shell grid gap-10 py-16 md:grid-cols-4 lg:grid-cols-5">
        {/* Brand Column */}
        <div className="lg:col-span-1">
          <p className="font-display text-4xl tracking-[-.04em] text-white">
            Argyros<span className="text-gold">.</span>
          </p>
          <p className="mt-4 text-xs leading-6 text-white/70">
            Sculptural sterling silver, made to order. A House of Siddhi Jewellers creation.
          </p>
          {/* Social Links (only if set) */}
          <div className="mt-6 flex items-center gap-3">
            {siteConfig.social.instagram && (
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-white/70 hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} className="stroke-[1.5]" />
              </a>
            )}
            {siteConfig.social.facebook && (
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-white/70 hover:text-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} className="stroke-[1.5]" />
              </a>
            )}
            {siteConfig.social.youtube && (
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-white/70 hover:text-gold transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={18} className="stroke-[1.5]" />
              </a>
            )}
          </div>
        </div>

        {/* Column 1: Shop */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[.18em] text-gold mb-4">Shop</h4>
          <ul className="space-y-2.5 text-xs text-white/80">
            <li><Link href="/shop?category=rings" className="hover:text-gold transition-colors">Rings</Link></li>
            <li><Link href="/shop?category=earrings" className="hover:text-gold transition-colors">Earrings</Link></li>
            <li><Link href="/shop?category=necklaces" className="hover:text-gold transition-colors">Necklaces</Link></li>
            <li><Link href="/shop?category=bracelets" className="hover:text-gold transition-colors">Bracelets & Cuffs</Link></li>
            <li><Link href="/gifts" className="hover:text-gold transition-colors">Gift Finder</Link></li>
          </ul>
        </div>

        {/* Column 2: Atelier */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[.18em] text-gold mb-4">Atelier</h4>
          <ul className="space-y-2.5 text-xs text-white/80">
            <li><Link href="/bespoke" className="hover:text-gold transition-colors text-gold">Bespoke Atelier</Link></li>
            <li><Link href="/heritage" className="hover:text-gold transition-colors">Our Heritage</Link></li>
            <li><Link href="/support#care" className="hover:text-gold transition-colors">Care Guide</Link></li>
            <li><Link href="/size-guide" className="hover:text-gold transition-colors">Size Guide</Link></li>
          </ul>
        </div>

        {/* Column 3: Help */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[.18em] text-gold mb-4">Help</h4>
          <ul className="space-y-2.5 text-xs text-white/80">
            <li><Link href="/support" className="hover:text-gold transition-colors">FAQ</Link></li>
            <li><Link href="/track" className="hover:text-gold transition-colors">Track Your Order</Link></li>
            <li><Link href="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-gold transition-colors">Shipping</Link></li>
            <li><Link href="/returns" className="hover:text-gold transition-colors">Returns & Refunds</Link></li>
          </ul>
        </div>

        {/* Column 4: Legal */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[.18em] text-gold mb-4">Legal</h4>
          <ul className="space-y-2.5 text-xs text-white/80">
            <li><Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-gold transition-colors">Shipping Policy</Link></li>
            <li><Link href="/returns" className="hover:text-gold transition-colors">Returns & Refunds</Link></li>
            <li><Link href="/contact-and-grievance" className="hover:text-gold transition-colors">Grievance & Contact</Link></li>
          </ul>
        </div>
      </div>

      {/* Base strip */}
      <div className="border-t border-white/10 bg-[#07101e] py-6 text-[10px] text-white/60">
        <div className="shell flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
          <div>
            © {currentYear} {siteConfig.legal.entityName} · GSTIN {siteConfig.legal.gstin} · {siteConfig.legal.registeredAddress}
          </div>
          <div className="text-gold tracking-widest uppercase font-bold text-[9px]">
            Delivering across India
          </div>
        </div>
      </div>
    </footer>
  );
}
