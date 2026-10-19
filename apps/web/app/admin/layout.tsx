'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileCloseButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeMobileNav = useCallback(() => {
    setMobileNavOpen(false);
    window.requestAnimationFrame(() => mobileMenuButtonRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!mobileNavOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    mobileCloseButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMobileNav();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = mobileNavRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements?.length || !mobileNavRef.current) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;
      const focusIsOutsideMenu = !mobileNavRef.current.contains(activeElement);

      if (event.shiftKey && (activeElement === firstElement || focusIsOutsideMenu)) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && (activeElement === lastElement || focusIsOutsideMenu)) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeMobileNav, mobileNavOpen]);

  if (!mounted || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-paper text-ink">
        <p className="font-display text-xl">Loading...</p>
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
    return (
      <div className="flex h-screen items-center justify-center bg-paper text-ink">
        <div className="text-center">
          <h1 className="font-display text-3xl mb-4">Access Denied</h1>
          <p className="font-sans mb-6">You do not have permission to access the admin area.</p>
          <Link href="/login" className="button bg-ink text-white px-6 py-2">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Products', href: '/admin/products' },
    { label: 'Orders', href: '/admin/orders' },
    { label: 'Bespoke Atelier', href: '/admin/bespoke' },
    { label: 'Inventory', href: '/admin/inventory' },
    { label: 'Security', href: '/admin/security' },
  ];

  const renderNavItems = (onNavigate?: () => void) =>
    navItems.map((item) => {
      const isActive = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={`block rounded-md px-4 py-2 transition-colors ${
            isActive ? 'bg-gold/10 text-gold font-bold' : 'text-ink hover:bg-line/50'
          }`}
        >
          {item.label}
        </Link>
      );
    });

  return (
    <div className="flex h-screen min-h-0 w-full min-w-0 max-w-full bg-paper font-sans text-ink">
      {/* Sidebar */}
      <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-line bg-[#f0ede6] md:flex" aria-label="Admin navigation">
        <div className="p-6">
          <Link href="/" className="font-display text-2xl tracking-[-.04em]">
            Argyros<span className="text-gold">.</span>
          </Link>
          <p className="text-xs uppercase tracking-widest mt-1 text-gray-500 font-bold">Admin</p>
        </div>
        
        <nav className="flex-1 space-y-2 px-4 py-6" aria-label="Admin navigation links">
          {renderNavItems()}
        </nav>
        
        <div className="p-6 border-t border-line text-sm">
          <p>Logged in as <strong>{user.firstName}</strong></p>
          <p className="text-gray-500 text-xs uppercase mt-1">{user.role}</p>
        </div>
      </aside>

      <header className="flex shrink-0 items-center justify-between border-b border-line bg-[#f0ede6] px-4 py-4 md:hidden">
        <Link href="/" className="font-display text-2xl tracking-[-.04em]">
          Argyros<span className="text-gold">.</span>
        </Link>
        <button
          ref={mobileMenuButtonRef}
          type="button"
          aria-label="Open admin menu"
          aria-controls="admin-mobile-navigation"
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen(true)}
          className="border border-line px-3 py-2 text-xs font-bold uppercase tracking-wider text-ink"
        >
          Menu
        </button>
      </header>

      {mobileNavOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-ink/40 md:hidden" aria-hidden="true" onClick={closeMobileNav} />
          <aside
            ref={mobileNavRef}
            id="admin-mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-mobile-navigation-title"
            className="fixed inset-y-0 left-0 z-50 flex w-[min(18rem,calc(100vw-2rem))] max-w-full flex-col bg-[#f0ede6] shadow-2xl md:hidden"
          >
            <div className="flex items-center justify-between border-b border-line p-5">
              <div>
                <h2 id="admin-mobile-navigation-title" className="sr-only">
                  Mobile admin navigation
                </h2>
                <p className="font-display text-2xl tracking-[-.04em]">
                  Argyros<span className="text-gold">.</span>
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-500">Admin</p>
              </div>
              <button
                ref={mobileCloseButtonRef}
                type="button"
                aria-label="Close admin menu"
                onClick={closeMobileNav}
                className="border border-line px-3 py-2 text-xs font-bold uppercase tracking-wider text-ink"
              >
                Close
              </button>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6" aria-label="Mobile admin navigation links">
              {renderNavItems(closeMobileNav)}
            </nav>

            <div className="border-t border-line p-5 text-sm">
              <p>
                Logged in as <strong>{user.firstName}</strong>
              </p>
              <p className="mt-1 text-xs uppercase text-gray-500">{user.role}</p>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="min-w-0 flex-1 overflow-x-auto overflow-y-auto bg-paper">
        {children}
      </main>
    </div>
  );
}
