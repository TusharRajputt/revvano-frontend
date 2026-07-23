import type { Mood, NavItem } from '@/types';

export const BRAND = {
  name: 'रेvvano',
  tagline: 'Wear Your Mood.',
  description:
    'Premium western clothing curated by personality, not category. Four signature collections for four moods.',
  email: 'support.revvano@gmail.com',
  phone: '+91 98765 43210',
  address: 'Jammu, Jammu and Kashmir, India',
  social: {
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
    pinterest: 'https://pinterest.com',
    youtube: 'https://youtube.com',
  },
} as const;

export const MOODS: Record<
  Mood,
  { label: string; description: string; image: string; palette: string[] }
> = {
  'soft-feminine': {
    label: 'Soft Feminine',
    description: 'Pastel elegance, romantic minimalism, quiet luxury.',
    image:
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=900&auto=format&fit=crop',
    palette: ['#F5E6E8', '#E8D5D0', '#D4A5A5', '#C9B1D8', '#EADBC8'],
  },
  'free-spirit': {
    label: 'Free Spirit',
    description: 'Boho ease, relaxed silhouettes, vacation-ready layers.',
    image:
      'https://images.unsplash.com/photo-1507522598021-6c8e8f9f5e7e?q=80&w=900&auto=format&fit=crop',
    palette: ['#D4B896', '#C9A876', '#8B7355', '#A39174', '#D8CFC4'],
  },
  bossy: {
    label: 'Bossy',
    description: 'Power dressing, sharp tailoring, luxury formalwear.',
    image:
      'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=900&auto=format&fit=crop',
    palette: ['#1A1A1A', '#2A2A2A', '#3D3D3D', '#C8A46B', '#D8CFC4'],
  },
  rebellious: {
    label: 'Rebellious',
    description: 'Streetwear edge, bold statements, dark leather.',
    image:
      'https://images.unsplash.com/photo-1520975916090-3105956c382f?q=80=w=900&auto=format&fit=crop',
    palette: ['#0A0A0A', '#1A1A1A', '#2A2A2A', '#4A4A4A', '#C8A46B'],
  },
};

export const MOOD_LIST = Object.entries(MOODS).map(([key, value]) => ({
  key: key as Mood,
  ...value,
}));

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Shop',
    href: '/shop',
    children: [
      { label: 'New Arrivals', href: '/shop?filter=new' },
      { label: 'Best Sellers', href: '/shop?filter=best-sellers' },
      { label: 'Trending Now', href: '/shop?filter=trending' },
      { label: 'Sale', href: '/shop?filter=sale' },
    ],
  },
  {
    label: 'Collections',
    href: '/collections',
    children: [
      { label: 'Soft Feminine', href: '/collections/soft-feminine' },
      { label: 'Free Spirit', href: '/collections/free-spirit' },
      { label: 'Bossy', href: '/collections/bossy' },
      { label: 'Rebellious', href: '/collections/rebellious' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Journal', href: '/journal' },
  { label: 'Contact', href: '/contact' },
];

export const CURRENCY = 'INR';
export const CURRENCY_SYMBOL = '₹';

export const SHIPPING_FEE = 199;
export const FREE_SHIPPING_THRESHOLD = 4999;
export const TAX_RATE = 0.05;

export const COUPONS = [
  {
    code: 'WELCOME10',
    type: 'percentage' as const,
    value: 10,
    minSubtotal: 0,
    description: '10% off your first order',
  },
  {
    code: 'MOOD20',
    type: 'percentage' as const,
    value: 20,
    minSubtotal: 200,
    description: '20% off orders over ₹12,000',
  },
  {
    code: 'FREESHIP',
    type: 'fixed' as const,
    value: 199,
    minSubtotal: 100,
    description: 'Free shipping on orders over ₹3,000',
  },
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const PRODUCT_CATEGORIES = [
  'Dresses',
  'Tops',
  'Bottoms',
  'Outerwear',
  'Knitwear',
  'Accessories',
  'Shoes',
  'Bags',
];
