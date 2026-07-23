export type Mood = 'soft-feminine' | 'free-spirit' | 'bossy' | 'rebellious';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductSize {
  label: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  mood: Mood;
  category: string;
  description: string;
  details: string[];
  images: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  rating: number;
  reviewCount: number;
  tags: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isEditorsPick?: boolean;
  stock: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  active: boolean;
}

export interface ProductVariant {
  color: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  stock: number;
  sku: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  mood: Mood;
  image: string;
  palette: string[];
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  slug: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color: string;
  size: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  items: OrderItem[];
  address: Address;
  trackingNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  createdAt: string;

  role: "admin" | "customer";
  isVerified?: boolean;
  status?: "active" | "blocked";
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
  mood: Mood;
}

export interface JournalPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSubtotal: number;
  description: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}
