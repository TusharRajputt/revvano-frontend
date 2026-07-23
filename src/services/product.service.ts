import { api } from './api';
//import { products as mockProducts, collections as mockCollections } from '@/data/mock-data';
import type { Product, Collection } from '@/types';

const mapProduct = (p: any): Product => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  brand: "Revvano",

  price: p.salePrice || p.price,
  compareAtPrice: p.salePrice ? p.price : undefined,

  currency: "INR",

  mood: "bossy",

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
      hex: "#000000",
    })),

  sizes:
    (p.variants || []).map((v: any) => ({
      label: v.size,
      inStock: v.stock > 0,
    })),

  rating: p.averageRating || 0,

  reviewCount: p.reviewCount || 0,

  tags: p.tags || [],

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
};
