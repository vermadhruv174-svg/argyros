'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'argyros_recently_viewed';
const MAX_ITEMS = 8;

export function useRecentlyViewed(currentSlug?: string): string[] {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let items: string[] = raw ? JSON.parse(raw) : [];

      if (!Array.isArray(items)) {
        items = [];
      }

      if (currentSlug) {
        // Move currentSlug to the front and deduplicate
        items = [currentSlug, ...items.filter((s) => s !== currentSlug)].slice(0, MAX_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      }

      // Filter out the currentSlug from the returned list so we don't recommend the page the user is currently on
      const others = items.filter((s) => s !== currentSlug);
      setRecentlyViewed(others);
    } catch {
      // Ignore localStorage errors (e.g. private browsing)
    }
  }, [currentSlug]);

  return recentlyViewed;
}
