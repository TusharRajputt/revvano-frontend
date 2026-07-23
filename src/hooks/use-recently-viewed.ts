import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'revvano-recently-viewed';
const MAX_ITEMS = 8;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecentlyViewed(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const addRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      const next = [productId, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { recentlyViewed, addRecentlyViewed };
}
