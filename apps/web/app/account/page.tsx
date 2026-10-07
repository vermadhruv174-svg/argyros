'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useAuth } from '@/lib/auth-context';

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, logout, accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile');
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!user || !accessToken) return;
    const fetchData = async () => {
      setLoadingData(true);
      try {
        if (activeTab === 'orders') {
          const res = await fetch(`/api/orders`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          if (res.ok) {
            setOrders(await res.json());
          }
        } else if (activeTab === 'wishlist') {
          const res = await fetch(`/api/wishlist`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          if (res.ok) {
            setWishlist(await res.json());
          }
        }
      } catch (e) {
        console.error(e);
      }
      setLoadingData(false);
    };
    fetchData();
  }, [user, accessToken, activeTab]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 shell py-16 md:py-24">
          <div className="py-24 text-center text-sm text-neutral-500 font-medium">
            Loading your account...
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <main className="flex-1 shell py-16 md:py-24">
          <div className="border-b border-line pb-6 mb-10">
            <h1 className="font-display text-4xl md:text-5xl">My Account</h1>
          </div>
          <div className="py-12 text-center space-y-4">
            <p className="font-display text-2xl text-neutral-700">
              Sign in to view your account
            </p>
            <p className="text-sm text-neutral-500">
              Access your orders, wishlist, and profile details.
            </p>
            <div className="flex gap-4 justify-center mt-6">
              <Link href="/login" className="button">
                Sign In →
              </Link>
              <Link
                href="/register"
                className="border border-line px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#f3f0ea] transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Header />
      <main className="flex-1 shell py-16 md:py-24">
        <div className="border-b border-line pb-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl md:text-5xl">My Account</h1>
            <p className="mt-2 text-sm text-neutral-500">Welcome back, {displayName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-ink border border-line px-4 py-2 hover:bg-[#f3f0ea] transition-colors self-start md:self-auto"
          >
            Sign Out
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-line mb-8 overflow-x-auto">
          {(['profile', 'orders', 'wishlist'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-gold text-gold'
                  : 'text-neutral-500 hover:text-ink'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-[#f3f0ea] border border-line p-8 max-w-2xl">
              <h2 className="font-display text-2xl border-b border-line pb-4 mb-6">Profile Details</h2>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Full Name
                  </dt>
                  <dd className="text-ink font-medium">{displayName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Email
                  </dt>
                  <dd className="text-ink">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Account Type
                  </dt>
                  <dd className="text-ink capitalize">{user.role.toLowerCase()}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Member Since
                  </dt>
                  <dd className="text-ink">{memberSince}</dd>
                </div>
              </dl>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              {loadingData ? (
                <p className="text-sm text-neutral-500">Loading orders...</p>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center bg-[#f8f6f1] border border-line max-w-2xl">
                  <p className="font-display text-xl text-neutral-600">No orders yet</p>
                  <p className="mt-2 text-sm text-neutral-500">Your completed orders will appear here.</p>
                  <Link href="/shop" className="button mt-6 inline-flex">Explore Collection →</Link>
                </div>
              ) : (
                <div className="space-y-6 max-w-4xl">
                  {orders.map(order => (
                    <div key={order.id} className="border border-line bg-white p-6">
                      <div className="flex flex-wrap justify-between items-center border-b border-line pb-4 mb-4 gap-4">
                        <div>
                          <p className="font-semibold text-ink text-lg">Order #{order.number}</p>
                          <p className="text-xs text-neutral-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{(order.totalCents / 100).toLocaleString('en-IN')}</p>
                          <p className="text-xs mt-1 px-2 py-0.5 inline-block bg-neutral-100 rounded text-neutral-600 font-medium">
                            {order.status}
                          </p>
                        </div>
                      </div>
                      <Link href={`/orders/${order.number}`} className="text-xs font-bold uppercase tracking-widest text-gold hover:text-ink">
                        View Details →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div>
              {loadingData ? (
                <p className="text-sm text-neutral-500">Loading wishlist...</p>
              ) : wishlist.length === 0 ? (
                <div className="py-12 text-center bg-[#f8f6f1] border border-line max-w-2xl">
                  <p className="font-display text-xl text-neutral-600">Your wishlist is empty</p>
                  <p className="mt-2 text-sm text-neutral-500">Save items you love here.</p>
                  <Link href="/shop" className="button mt-6 inline-flex">Explore Collection →</Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {wishlist.map(item => (
                    <Link href={`/products/${item.slug}`} key={item.id} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#0a1628] rounded-[2px] flex items-center justify-center border border-gold/20">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover transition duration-700 group-hover:scale-[1.06]"
                          />
                        ) : (
                          <span className="font-display text-xl text-gold">A</span>
                        )}
                      </div>
                      <div className="flex items-start justify-between gap-3 pt-4">
                        <div>
                          <p className="eyebrow text-[8px] text-[#8f6b3e]">{item.metalPurity}</p>
                          <h3 className="mt-1 font-display text-lg leading-none">{item.productName}</h3>
                        </div>
                        <p className="pt-3 text-xs font-semibold">₹{Math.round(item.priceCents / 100).toLocaleString('en-IN')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
