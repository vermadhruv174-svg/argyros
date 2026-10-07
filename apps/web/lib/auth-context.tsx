'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

const API_BASE_URL =
  typeof window !== 'undefined'
    ? '/api'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';


export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  createdAt: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * In-memory access token store. Never persisted to localStorage.
 * Refresh token lives in httpOnly cookie set by the API.
 */
let _accessToken: string | null = null;

function setAccessToken(token: string | null) {
  _accessToken = token;
}

export function getAccessToken(): string | null {
  return _accessToken;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Prevent double-init in strict mode
  const initialized = useRef(false);

  const storeToken = useCallback((token: string | null) => {
    setAccessToken(token);
    setAccessTokenState(token);
  }, []);

  /** Attempt to restore session using the refresh cookie */
  const tryRestoreSession = useCallback(async () => {
    try {
      // First try existing access token (memory), then try cookie-based refresh
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!refreshRes.ok) {
        storeToken(null);
        setUser(null);
        return;
      }

      const { accessToken: newToken } = (await refreshRes.json()) as { accessToken: string };
      storeToken(newToken);

      // Fetch profile
      const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${newToken}` },
        credentials: 'include',
      });

      if (meRes.ok) {
        const profile = (await meRes.json()) as AuthUser;
        setUser(profile);
      }
    } catch {
      storeToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [storeToken]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    void tryRestoreSession();
  }, [tryRestoreSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(err.message ?? 'Login failed.');
      }

      const { accessToken: token } = (await res.json()) as { accessToken: string };
      storeToken(token);

      const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
      if (meRes.ok) {
        const profile = (await meRes.json()) as AuthUser;
        setUser(profile);
      }
    },
    [storeToken],
  );

  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
        credentials: 'include',
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(err.message ?? 'Registration failed.');
      }

      const { accessToken: token } = (await res.json()) as { accessToken: string };
      storeToken(token);

      const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
      if (meRes.ok) {
        const profile = (await meRes.json()) as AuthUser;
        setUser(profile);
      }
    },
    [storeToken],
  );

  const logout = useCallback(async () => {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {});
    storeToken(null);
    setUser(null);
  }, [storeToken]);

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
