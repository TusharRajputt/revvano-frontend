import { api } from './api';
import { testimonials, journalPosts } from '@/data/mock-data';
import type { Testimonial, JournalPost } from '@/types';

const simulateLatency = <T>(data: T, ms = 300): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

const isArray = (v: unknown): v is unknown[] => Array.isArray(v);

export const contentService = {
  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const { data } = await api.get<Testimonial[]>('/testimonials');
      if (isArray(data)) return data;
      throw new Error('Invalid response');
    } catch {
      return simulateLatency(testimonials);
    }
  },

  async getJournalPosts(): Promise<JournalPost[]> {
    try {
      const { data } = await api.get<JournalPost[]>('/journal');
      if (isArray(data)) return data;
      throw new Error('Invalid response');
    } catch {
      return simulateLatency(journalPosts);
    }
  },

  async getJournalPostBySlug(slug: string): Promise<JournalPost | null> {
    try {
      const { data } = await api.get<JournalPost>(`/journal/${slug}`);
      if (data && typeof data === 'object' && !isArray(data)) return data;
      throw new Error('Invalid response');
    } catch {
      const post = journalPosts.find((p) => p.slug === slug);
      return simulateLatency(post || null);
    }
  },
};
