import { api } from './api';
import { collections as collectionStore } from '@/data/mock-data';
import type { Product, Order, User, Category, ProductVariant } from '@/types';

const simulateLatency = <T>(data: T, ms = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

const isArray = (v: unknown): v is unknown[] => Array.isArray(v);
const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

// Raw shape returned by the real backend (Product model, category/collection populated)
interface RawBackendProduct {
  _id: string;
  slug: string;
  name: string;
  description: string;
  category?: { _id: string; name: string } | string;
  collection?: { _id: string; name: string } | string;
  price: number;
  salePrice?: number;
  images?: { url: string }[];
  variants?: ProductVariant[];
  material?: string;
  fit?: string;
  washCare?: string;
  occasion?: string;
  season?: string;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  averageRating?: number;
  reviewCount?: number;
  tags?: string[];
  createdAt?: string;
}

// Maps the real backend product (variant/ObjectId based) into the flat admin-friendly
// shape used by the products list & form. This is the admin-side counterpart of the
// mapProduct() used in product.service.ts for the public storefront.
const mapAdminProduct = (p: RawBackendProduct): Product => ({
  id: p._id,
  slug: p.slug,
  name: p.name,
  brand: 'रेvvano',
  price: p.salePrice || p.price,
  compareAtPrice: p.salePrice ? p.price : undefined,
  currency: 'INR',
  mood: 'bossy',
  category: typeof p.category === 'object' ? p.category?.name || '' : p.category || '',
  description: p.description,
  details: [p.material, p.fit, p.washCare, p.occasion, p.season].filter(Boolean) as string[],
  images: (p.images || []).map((img) => img.url),
  colors: [...new Set((p.variants || []).map((v) => v.color))].map((c) => ({ name: c, hex: '#000000' })),
  sizes: (p.variants || []).map((v) => ({ label: v.size, inStock: v.stock > 0 })),
  rating: p.averageRating || 0,
  reviewCount: p.reviewCount || 0,
  tags: p.tags || [],
  isNew: p.newArrival,
  isBestSeller: p.bestSeller,
  isTrending: p.featured,
  isEditorsPick: false,
  stock: (p.variants || []).reduce((sum, v) => sum + (v.stock || 0), 0),
  createdAt: p.createdAt || new Date().toISOString(),
});

interface RawBackendOrder {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: Order['status'];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  items: { product?: string; name: string; image: string; price: number; quantity: number; color: string; size: string }[];
  shippingAddress: { fullName: string; line1: string; line2?: string; city: string; state: string; zip: string; country: string; phone: string };
  trackingNumber?: string;
}

const mapAdminOrder = (o: RawBackendOrder): Order => ({
  id: o._id,
  orderNumber: o.orderNumber,
  date: o.createdAt,
  status: o.status,
  subtotal: o.subtotal,
  shipping: o.shipping,
  tax: o.tax,
  discount: o.discount,
  total: o.total,
  items: (o.items || []).map((i) => ({
    productId: i.product || '',
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    image: i.image,
    color: i.color,
    size: i.size,
  })),
  address: {
    id: 'shipping',
    label: 'Shipping Address',
    fullName: o.shippingAddress?.fullName || '',
    line1: o.shippingAddress?.line1 || '',
    line2: o.shippingAddress?.line2,
    city: o.shippingAddress?.city || '',
    state: o.shippingAddress?.state || '',
    zip: o.shippingAddress?.zip || '',
    country: o.shippingAddress?.country || '',
    phone: o.shippingAddress?.phone || '',
  },
  trackingNumber: o.trackingNumber,
});

const mapCategory = (c: { _id: string; name: string; slug: string; description?: string; image?: string; active?: boolean }): Category => ({
  id: c._id,
  name: c.name,
  slug: c.slug,
  description: c.description,
  image: c.image,
  active: c.active ?? true,
});

// The shape the admin product form works with — mirrors the real backend schema
// (category/collection as ObjectId strings, variants array, raw File objects for images).
export interface ProductFormPayload {
  name: string;
  description: string;
  category: string; // Category ObjectId
  collection: string; // Collection ObjectId
  price: number;
  salePrice?: number;
  material?: string;
  fit?: string;
  washCare?: string;
  occasion?: string;
  season?: string;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  comingSoon?: boolean;
  tags?: string[];
  variants: ProductVariant[];
  imageFiles?: File[]; // new files to upload (leave empty on edit to keep existing images)
}

const buildProductFormData = (input: ProductFormPayload): FormData => {
  const fd = new FormData();
  fd.append('name', input.name);
  fd.append('description', input.description);
  fd.append('category', input.category);
  fd.append('collection', input.collection);
  fd.append('price', String(input.price));
  if (input.salePrice !== undefined) fd.append('salePrice', String(input.salePrice));
  if (input.material) fd.append('material', input.material);
  if (input.fit) fd.append('fit', input.fit);
  if (input.washCare) fd.append('washCare', input.washCare);
  if (input.occasion) fd.append('occasion', input.occasion);
  if (input.season) fd.append('season', input.season);
  fd.append('featured', String(!!input.featured));
  fd.append('bestSeller', String(!!input.bestSeller));
  fd.append('newArrival', String(!!input.newArrival));
  fd.append('comingSoon', String(!!input.comingSoon));
  fd.append('tags', JSON.stringify(input.tags || []));
  fd.append('variants', JSON.stringify(input.variants || []));
  (input.imageFiles || []).forEach((file) => fd.append('images', file));
  return fd;
};

// Raw shape returned by the real backend User model
interface RawBackendUser {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'superadmin';
  status?: 'active' | 'blocked';
  isVerified?: boolean;
  createdAt: string;
}

const mapAdminUser = (u: RawBackendUser): User => ({
  id: u._id,
  name: `${u.firstName}${u.lastName ? ` ${u.lastName}` : ''}`.trim(),
  email: u.email,
  phone: u.phone,
  avatar: u.avatar,
  addresses: [],
  createdAt: u.createdAt,
  role: u.role === 'admin' || u.role === 'superadmin' ? 'admin' : 'customer',
  isVerified: u.isVerified,
  status: u.status || 'active',
});

// Demo user directory. Used only as a fallback if the /admin/users endpoint
// is unreachable (e.g. offline/dev without a backend running).
let mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'Isabella Rossi',
    email: 'isabella@example.com',
    phone: '+1 (310) 555-0192',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    addresses: [],
    createdAt: '2025-01-15T00:00:00Z',
    role: 'customer',
    status: 'active',
  },
  {
    id: 'user-002',
    name: 'Admin',
    email: 'admin@revvano.com',
    phone: '+1 (888) 555-0142',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    addresses: [],
    createdAt: '2025-01-01T00:00:00Z',
    role: 'admin',
    status: 'active',
  },
  {
    id: 'user-003',
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    addresses: [],
    createdAt: '2025-03-22T00:00:00Z',
    role: 'customer',
    status: 'active',
  },
  {
    id: 'user-004',
    name: 'Meera Kapoor',
    email: 'meera.kapoor@example.com',
    addresses: [],
    createdAt: '2025-05-09T00:00:00Z',
    role: 'customer',
    status: 'active',
  },
  {
    id: 'user-005',
    name: 'Sana Sheikh',
    email: 'sana.sheikh@example.com',
    addresses: [],
    createdAt: '2025-06-30T00:00:00Z',
    role: 'customer',
    status: 'blocked',
  },
];

export const adminService = {
  // ---------- Dashboard ----------
  async getStats(): Promise<{
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    revenue: number;
    lowStock: number;
  }> {
    // /admin/dashboard only returns { message, admin } today — no stats fields —
    // so we always compute stats from the real product data + mock order/user data.
    const [products, orders, users] = await Promise.all([
      adminService.getProducts(),
      adminService.getOrders(),
      adminService.getUsers(),
    ]);
    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      revenue: orders.reduce((sum, o) => sum + o.total, 0),
      lowStock: products.filter((p) => p.stock <= 5).length,
    };
  },

  // ---------- Products (real backend) ----------
  async getProducts(): Promise<Product[]> {
    const { data } = await api.get('/products');
    return (data.products || []).map(mapAdminProduct);
  },

  async getProduct(id: string): Promise<Product | null> {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data.product ? mapAdminProduct(data.product) : null;
    } catch {
      return null;
    }
  },

  async createProduct(input: ProductFormPayload): Promise<Product> {
    const formData = buildProductFormData(input);
    // Don't set Content-Type manually — the browser needs to add its own
    // multipart boundary. The api instance defaults to application/json,
    // so we explicitly clear it here to let axios/the browser set it correctly.
    const { data } = await api.post('/products', formData, {
      headers: { 'Content-Type': undefined },
    });
    return mapAdminProduct(data.product);
  },

  async updateProduct(id: string, input: ProductFormPayload): Promise<Product | null> {
    const formData = buildProductFormData(input);
    const { data } = await api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return data.product ? mapAdminProduct(data.product) : null;
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },

  // ---------- Categories (real backend) ----------
  async getCategories(): Promise<Category[]> {
    const { data } = await api.get('/categories');
    return (data.categories || []).map(mapCategory);
  },

  async createCategory(input: { name: string; description?: string; image?: string }): Promise<Category> {
    const { data } = await api.post('/categories', input);
    return mapCategory(data.category);
  },

  async updateCategory(id: string, updates: Partial<{ name: string; description: string; image: string; active: boolean }>): Promise<Category> {
    const { data } = await api.put(`/categories/${id}`, updates);
    return mapCategory(data.category);
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  },

  // ---------- Collections (real backend, read-only dropdown source) ----------
  async getCollectionOptions(): Promise<{ id: string; name: string }[]> {
    const { data } = await api.get('/collections');
    return (data.collections || []).map((c: { _id: string; name: string }) => ({ id: c._id, name: c.name }));
  },

  getMoodOptions() {
    return collectionStore.map((c) => ({ value: c.mood, label: c.name }));
  },

  // ---------- Orders (real backend) ----------
  async getOrders(): Promise<Order[]> {
    const { data } = await api.get('/orders');
    return (data.orders || []).map(mapAdminOrder);
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<{ success: boolean }> {
    await api.put(`/orders/${id}/status`, { status });
    return { success: true };
  },

  // ---------- Users ----------
  async getUsers(): Promise<User[]> {
    try {
      const { data } = await api.get('/admin/users');
      if (isArray(data?.users)) return data.users.map(mapAdminUser);
      throw new Error('Invalid response');
    } catch {
      return simulateLatency([...mockUsers]);
    }
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      // Translate frontend role/name shape back to backend fields
      const payload: Record<string, unknown> = {};
      if (updates.role) payload.role = updates.role === 'admin' ? 'admin' : 'user';
      if (updates.status) payload.status = updates.status;
      if (updates.phone !== undefined) payload.phone = updates.phone;
      if (updates.name) {
        const [firstName, ...rest] = updates.name.split(' ');
        payload.firstName = firstName;
        payload.lastName = rest.join(' ');
      }

      const { data } = await api.patch(`/admin/users/${id}`, payload);
      if (isObject(data?.user)) return mapAdminUser(data.user as RawBackendUser);
      throw new Error('Invalid response');
    } catch {
      const idx = mockUsers.findIndex((u) => u.id === id);
      if (idx === -1) return simulateLatency(null);
      mockUsers[idx] = { ...mockUsers[idx], ...updates };
      return simulateLatency(mockUsers[idx]);
    }
  },

  async deleteUser(id: string): Promise<{ success: boolean }> {
    try {
      const { data } = await api.delete(`/admin/users/${id}`);
      if (isObject(data)) return { success: !!data.success };
      throw new Error('Invalid response');
    } catch {
      mockUsers = mockUsers.filter((u) => u.id !== id);
      return simulateLatency({ success: true });
    }
  },
};