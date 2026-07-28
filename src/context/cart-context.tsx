import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { CartItem, Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  coupon: string | null;
  addItem: (product: Product, color: string, size: string, quantity?: number) => void;
  removeItem: (productId: string, color: string, size: string) => void;
  updateQuantity: (productId: string, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'revvano-cart';
const COUPON_KEY = 'revvano-coupon';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [coupon, setCoupon] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
      const storedCoupon = localStorage.getItem(COUPON_KEY);
      if (storedCoupon) setCoupon(storedCoupon);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (coupon) localStorage.setItem(COUPON_KEY, coupon);
    else localStorage.removeItem(COUPON_KEY);
  }, [coupon]);

  const addItem = useCallback(
    (product: Product, color: string, size: string, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.productId === product.id && i.color === color && i.size === size,
        );
        if (existing) {
          return prev.map((i) =>
            i.productId === product.id && i.color === color && i.size === size
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          );
        }
        return [
          ...prev,
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images[0],
            color,
            size,
            quantity,
          },
        ];
      });
      toast({ title: 'Added to cart', description: `${product.name} — ${color}, ${size}` });
    },
    [toast],
  );

  const removeItem = useCallback((productId: string, color: string, size: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.color === color && i.size === size)),
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, color: string, size: string, quantity: number) => {
      if (quantity < 1) return;
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.color === color && i.size === size
            ? { ...i, quantity }
            : i,
        ),
      );
    },
    [],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((p) => !p), []);

  const applyCoupon = useCallback((code: string): boolean => {
    setCoupon(code);
    return true;
  }, []);

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        coupon,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        applyCoupon,
        removeCoupon,
        subtotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
