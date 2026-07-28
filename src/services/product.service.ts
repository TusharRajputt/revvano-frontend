import { api } from './api';
//import { products as mockProducts, collections as mockCollections } from '@/data/mock-data';
import type { Product, Collection } from '@/types';

// Common apparel color names → hex. Falls back to trying the raw name as a
// native CSS color keyword (works for many single-word names like "blue",
// "red", "maroon"), and finally to a neutral gray if nothing matches.
const COLOR_HEX_MAP: Record<string, string> = {
  black: '#1a1a1a',
  white: '#ffffff',
  'off white': '#f5f0e6',
  'off-white': '#f5f0e6',
  ivory: '#fffff0',
  cream: '#f6f0df',
  beige: '#e8dcc8',
  tan: '#d2b48c',
  brown: '#5c4033',
  chocolate: '#3d2817',
  camel: '#c19a6b',
  grey: '#808080',
  gray: '#808080',
  charcoal: '#36454f',
  navy: '#1b2a4a',
  'navy blue': '#1b2a4a',
  blue: '#2563eb',
  'powder blue': '#b0d5e8',
  'sky blue': '#87ceeb',
  teal: '#008080',
  turquoise: '#40e0d0',
  green: '#228b22',
  olive: '#6b6b1f',
  sage: '#9caf88',
  mint: '#98d8c8',
  emerald: '#50c878',
  red: '#c41e3a',
  maroon: '#800000',
  wine: '#722f37',
  burgundy: '#800020',
  rust: '#b7410e',
  orange: '#ed8936',
  peach: '#ffcba4',
  coral: '#ff7f50',
  pink: '#e8a0bf',
  'hot pink': '#ff69b4',
  'baby pink': '#f4c2c2',
  rose: '#c48a94',
  'rose gold': '#b76e79',
  purple: '#6b3fa0',
  lavender: '#b57edc',
  lilac: '#c8a2c8',
  mauve: '#b784a7',
  yellow: '#f0c419',
  mustard: '#d4a017',
  gold: '#d4af37',
  silver: '#c0c0c0',
  metallic: '#a8a9ad',
  denim: '#1560bd',
  khaki: '#c3b091',
  nude: '#e3bc9a',
};

function getColorHex(name: string): string {
  const key = (name || '').trim().toLowerCase();
  if (COLOR_HEX_MAP[key]) return COLOR_HEX_MAP[key];
  const normalized = key.replace(/\s+/g, '');
  if (typeof document !== 'undefined') {
    const probe = document.createElement('span').style;
    probe.color = '';
    probe.color = normalized;
    if (probe.color !== '') return normalized;
  }
  return '#cccccc';
}

const mapProduct = (p: any): Product => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  brand: "Revvano",

  price: p.salePrice || p.price,
  compareAtPrice: p.salePrice ? p.price : undefined,

  currency: "INR",

  mood: p.mood || "bossy",

  category:
    typeof p.category === "object"
      ? p.category?.name
      : p.category,

  description: p.description,

  details: [
    p.material,
    p.fit,
    p.washCare,
    p.occasion,
    p.season,
  ].filter(Boolean),

  images:
    p.images?.map((img: any) => img.url) || [],

  colors:
    [...new Set(
      (p.variants || []).map((v: any) => v.color)
    )].map((c: any) => ({
      name: c,
      hex: getColorHex(c),
    })),

  sizes:
    (p.variants || []).map((v: any) => ({
      label: v.size,
      inStock: v.stock > 0,
    })),

  rating: p.averageRating || 0,

  reviewCount: p.reviewCount || 0,

  tags: p.tags || [],
  sizeGuide: p.sizeGuide && p.sizeGuide.rows?.length ? p.sizeGuide : undefined,

  isNew: p.newArrival,

  isBestSeller: p.bestSeller,

  isTrending: p.featured,

  isEditorsPick: false,

  stock:
    (p.variants || []).reduce(
      (sum: number, v: any) => sum + v.stock,
      0
    ),

  createdAt: p.createdAt,
});

const mapCollection = (c: any): Collection => ({
  id: c.id,

  slug: c.slug,

  name: c.name,

  tagline: "",

  description: c.description,

  mood: "bossy",

  image: c.bannerImage || "",

  palette: [],
});

export const productService = {
  async getProducts(params?: {
  mood?: string;
  category?: string;
  collection?: string;
  filter?: string;
  search?: string;
  sort?: string;
  page?: number;
}): Promise<{ products: Product[]; total: number }> {
  const { data } = await api.get("/products", {
    params,
  });

  return {
    products: (data.products || []).map(mapProduct),
    total: data.count || data.products?.length || 0,
  };
},

  async getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data } = await api.get(`/products/${slug}`);

    return mapProduct(data.product);
  } catch {
    return null;
  }
},

  async getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
  const { products } = await this.getProducts();

  return products
    .filter((p) => p.id !== productId)
    .slice(0, limit);
},

 async getCollections(): Promise<Collection[]> {
  const { data } = await api.get("/collections");

  return (data.collections || []).map(mapCollection);
},

 async getCollectionBySlug(slug: string): Promise<Collection | null> {
  try {
    const { data } = await api.get(`/collections/${slug}`);

    return mapCollection(data.collection);
  } catch {
    return null;
  }
},

async getCategories(): Promise<{ id: string; name: string; slug: string }[]> {
  const { data } = await api.get("/categories");
  return (data.categories || [])
    .filter((c: any) => c.active !== false)
    .map((c: any) => ({ id: c._id || c.id, name: c.name, slug: c.slug }));
},
};
