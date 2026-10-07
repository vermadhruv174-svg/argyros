'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
  ];

  return (
    <div className="flex h-screen bg-paper text-ink font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#f0ede6] border-r border-line flex flex-col">
        <div className="p-6">
          <Link href="/" className="font-display text-2xl tracking-[-.04em]">
            Argyros<span className="text-gold">.</span>
          </Link>
          <p className="text-xs uppercase tracking-widest mt-1 text-gray-500 font-bold">Admin</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-md transition-colors ${
                  isActive ? 'bg-gold/10 text-gold font-bold' : 'hover:bg-line/50 text-ink'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-line text-sm">
          <p>Logged in as <strong>{user.firstName}</strong></p>
          <p className="text-gray-500 text-xs uppercase mt-1">{user.role}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-paper">
        {children}
      </main>
    </div>
  );
}
