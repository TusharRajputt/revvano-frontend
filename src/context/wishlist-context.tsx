import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useToast } from '@/hooks/use-toast';

interface WishlistContextValue {
  items: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);
const STORAGE_KEY = 'revvano-wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setItems((prev) => {
        if (prev.includes(productId)) {
          toast({ title: 'Removed from wishlist' });
          return prev.filter((id) => id !== productId);
        }
        toast({ title: 'Saved to wishlist' });
        return [...prev, productId];
      });
    },
    [toast],
  );

  const isWishlisted = useCallback(
    (productId: string) => items.includes(productId),
    [items],
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((id) => id !== productId));
  }, []);

  return (
    <WishlistContext.Provider
      value={{ items, toggleWishlist, isWishlisted, removeItem, count: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
