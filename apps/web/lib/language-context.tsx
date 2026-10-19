'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SupportedLanguage, LANGUAGE_OPTIONS, TRANSLATIONS, LanguageOption } from './translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  options: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (_key, fallback) => fallback || '',
  options: LANGUAGE_OPTIONS,
});

const STORAGE_KEY = 'argyros_preferred_lang';
const COOKIE_NAME = 'argyros_lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  // Load preferred language from localStorage/cookie on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
      if (stored && (stored === 'en' || stored === 'hi')) {
        setLanguageState(stored);
        return;
      }

      // Check cookie fallback
      const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
      if (match && (match[1] === 'en' || match[1] === 'hi')) {
        setLanguageState(match[1] as SupportedLanguage);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      // Set cookie for 1 year
      document.cookie = `${COOKIE_NAME}=${lang}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
    } catch {
      // Ignore storage errors
    }
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
      if (dict[key]) {
        return dict[key];
      }
      const fallbackDict = TRANSLATIONS.en;
      if (fallbackDict[key]) {
        return fallbackDict[key];
      }
      return fallback || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, options: LANGUAGE_OPTIONS }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
