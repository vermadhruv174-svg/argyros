'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { SupportedLanguage, TRANSLATIONS } from './translations';

interface LanguageContextType {
  language: SupportedLanguage;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  t: (key, fallback) => fallback ?? key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language: SupportedLanguage = 'en';

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
      return dict[key] ?? fallback ?? key;
    },
    [],
  );

  return (
    <LanguageContext.Provider value={{ language, t }}>
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
