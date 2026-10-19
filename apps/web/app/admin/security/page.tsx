'use client';

import { useEffect, useState } from 'react';
import {
  enableOwnerMfa,
  listOwnerSessions,
  revokeAllOwnerSessions,
  revokeOwnerSession,
  setupOwnerMfa,
} from '@/lib/admin-api';
import { useAuth } from '@/lib/auth-context';

type OwnerSession = {
  id: string;
  current: boolean;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  userAgent?: string | null;
  ipAddress?: string | null;
};

export default function OwnerSecurityPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<OwnerSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [mfaSecret, setMfaSecret] = useState<string | null>(null);
  const [mfaUri, setMfaUri] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [busy, setBusy] = useState(false);

  const loadSessions = async () => {
    try {
      const result = await listOwnerSessions();
      setSessions(result.sessions ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to load active sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadSessions(); }, []);

  const beginMfa = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const result = await setupOwnerMfa();
      setMfaSecret(result.secret);
      setMfaUri(result.otpauthUri);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to start MFA enrollment.');
    } finally {
      setBusy(false);
    }
  };

  const confirmMfa = async () => {
    if (!mfaSecret || mfaCode.length !== 6) return;
    setBusy(true);
    setMessage(null);
    try {
      await enableOwnerMfa(mfaSecret, mfaCode);
      setMfaSecret(null);
      setMfaUri(null);
      setMfaCode('');
      setMessage('MFA is enabled. Future owner logins will require an authenticator code.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to enable MFA.');
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (sessionId: string) => {
    setBusy(true);
    try {
      await revokeOwnerSession(sessionId);
      await loadSessions();
      setMessage('Session revoked.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to revoke session.');
    } finally {
      setBusy(false);
    }
  };

  const revokeAll = async () => {
    if (!window.confirm('Revoke every active Owner Space session? You will need to sign in again.')) return;
    setBusy(true);
    try {
      await revokeAllOwnerSessions();
      setMessage('All sessions revoked.');
      await loadSessions();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to revoke sessions.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <p className="eyebrow text-gold">Owner Space · Security</p>
        <h1 className="font-display text-4xl mt-1">Security & Devices</h1>
        <p className="mt-2 text-sm text-neutral-600">Owner-only controls for {user?.email}. Keep this page private and never share recovery codes.</p>
      </div>

      {message && <div role="status" className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 text-sm rounded">{message}</div>}

      <section className="bg-white border border-line p-6 md:p-8 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">Authenticator MFA</h2>
            <p className="mt-1 text-sm text-neutral-600">Add TOTP MFA before setting <code>MFA_ENFORCEMENT=true</code> in production.</p>
          </div>
          {!mfaSecret && <button type="button" onClick={beginMfa} disabled={busy} className="button">Begin MFA setup</button>}
        </div>
        {mfaSecret && (
          <div className="border border-gold/40 bg-[#fbf9f6] p-5 space-y-4">
            <p className="text-sm">Add this secret to an authenticator app. The URI can be pasted into a compatible authenticator or encoded as a QR code by your password manager.</p>
            <div><p className="text-xs uppercase tracking-widest text-neutral-500">Secret</p><code className="block mt-1 break-all font-mono text-sm">{mfaSecret}</code></div>
            <div><p className="text-xs uppercase tracking-widest text-neutral-500">Setup URI</p><code className="block mt-1 break-all font-mono text-xs">{mfaUri}</code></div>
            <div className="max-w-xs">
              <label htmlFor="owner-mfa-code" className="block text-xs font-bold uppercase tracking-wider text-neutral-700">Confirm six-digit code</label>
              <input id="owner-mfa-code" inputMode="numeric" maxLength={6} value={mfaCode} onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))} className="mt-2 w-full border border-line px-4 py-3 tracking-[.4em]" />
            </div>
            <button type="button" onClick={confirmMfa} disabled={busy || mfaCode.length !== 6} className="button">{busy ? 'Confirming...' : 'Enable MFA'}</button>
          </div>
        )}
      </section>

      <section className="bg-white border border-line p-6 md:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><h2 className="font-display text-2xl">Active sessions</h2><p className="mt-1 text-sm text-neutral-600">Revoke a device immediately if it is lost or untrusted.</p></div>
          <button type="button" onClick={revokeAll} disabled={busy || loading || sessions.length === 0} className="px-4 py-2 border border-red-200 text-red-800 text-sm rounded">Revoke all sessions</button>
        </div>
        {loading ? <p className="text-sm text-neutral-500">Loading sessions...</p> : sessions.length === 0 ? <p className="text-sm text-neutral-500">No active sessions found.</p> : (
          <ul className="divide-y divide-line">
            {sessions.map((session) => (
              <li key={session.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0"><p className="font-semibold text-sm">{session.current ? 'This device' : 'Active device'}</p><p className="text-xs text-neutral-500 truncate">{session.userAgent || 'Unknown browser'} · {session.ipAddress || 'Unknown network'}</p><p className="text-xs text-neutral-500">Last used {new Date(session.lastUsedAt).toLocaleString()}</p></div>
                <button type="button" onClick={() => revoke(session.id)} disabled={busy} className="px-3 py-2 border border-line text-xs rounded">Revoke</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
