import { CURRENCY_SYMBOL } from '@/constants';

export function formatPrice(amount: number, currency = CURRENCY_SYMBOL): string {
  return `${currency}${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPriceShort(amount: number): string {
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
  return `₹${amount}`;
}

/**
 * Normalizes pricing across two shapes seen in this codebase:
 * - Raw backend shape: price = original, salePrice = discounted (if on sale)
 * - Mapped shape (from product.service.ts): price = current/discounted, compareAtPrice = original (if on sale)
 * Returns { current, original } regardless of which shape was passed in.
 */
export function getProductPricing(product: {
  price: number;
  salePrice?: number;
  compareAtPrice?: number;
}): { current: number; original: number } {
  if (product.compareAtPrice && product.compareAtPrice > product.price) {
    return { current: product.price, original: product.compareAtPrice };
  }
  if (product.salePrice && product.salePrice < product.price) {
    return { current: product.salePrice, original: product.price };
  }
  return { current: product.price, original: product.price };
}

export function calculateDiscount(price: number, compareAtPrice?: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
