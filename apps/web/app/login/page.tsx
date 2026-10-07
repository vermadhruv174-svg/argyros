'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      setError(null);
      await login(email.trim(), password);
      router.push('/account');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(msg);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 shell py-16 md:py-24">
        <div className="mx-auto max-w-md">
          <div className="border-b border-line pb-6 mb-10">
            <h1 className="font-display text-4xl md:text-5xl">Sign In</h1>
            <p className="mt-2 text-sm text-neutral-500">
              Welcome back to Argyros
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-800 p-4 text-xs font-semibold rounded"
                role="alert"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="mt-2 w-full border border-line bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full border border-line bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="button w-full flex items-center justify-center gap-2 mt-2"
            >
              {submitting ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-neutral-500">
            New to Argyros?{' '}
            <Link href="/register" className="text-ink underline underline-offset-2 hover:text-gold">
              Create an account
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
