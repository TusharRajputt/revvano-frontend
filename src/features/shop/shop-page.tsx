import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '@/services';
import { BackButton } from '@/components/common/back-button';
import { PageHeader } from '@/components/common/page-header';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductGridSkeleton } from '@/components/product/product-skeleton';
import { QuickView } from '@/components/product/quick-view';
import { MOOD_LIST, PRODUCT_CATEGORIES } from '@/constants';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const filter = searchParams.get('filter') || '';
  const mood = searchParams.get('mood') || '';
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['products', { filter, mood, category, search, sort }],
    queryFn: () =>
      productService.getProducts({ filter, mood, category, search, sort }),
  });

  const products = data?.products || [];

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({});

  const hasFilters = filter || mood || category || search;

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BackButton className="mb-2" />
      </div>
      <PageHeader
        title="Shop All"
        subtitle="Curated pieces for every personality."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Shop' }]}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {search && (
          <p className="text-sm text-muted-foreground mb-4">
            Showing results for "{search}"
          </p>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasFilters && <span className="w-2 h-2 rounded-full bg-accent" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">{products.length} items</span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-transparent border border-border pl-3 pr-8 py-2 text-sm cursor-pointer hover:border-primary transition-colors focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active filters */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filter && (
              <FilterChip label={filter.replace('-', ' ')} onRemove={() => updateFilter('filter', '')} />
            )}
            {mood && (
              <FilterChip label={MOOD_LIST.find((m) => m.key === mood)?.label || mood} onRemove={() => updateFilter('mood', '')} />
            )}
            {category && (
              <FilterChip label={category} onRemove={() => updateFilter('category', '')} />
            )}
            {search && (
              <FilterChip label={`"${search}"`} onRemove={() => updateFilter('search', '')} />
            )}
            <button onClick={clearFilters} className="text-xs underline hover:text-accent">
              Clear all
            </button>
          </div>
        )}

        {/* Products */}
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-heading text-2xl mb-2">No products found</p>
            <p className="text-muted-foreground mb-6">Try adjusting your filters.</p>
            <button onClick={clearFilters} className="text-sm underline hover:text-accent">
              Clear filters
            </button>
          </div>
        ) : (
          <ProductGrid products={products} onQuickView={setQuickViewProduct} />
        )}
      </div>

      {/* Filter drawer */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[80]"
              onClick={() => setFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-background z-[90] flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="font-heading text-xl font-semibold">Filters</h2>
                <button onClick={() => setFilterOpen(false)} aria-label="Close filters">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Mood */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-3">Mood</h3>
                  <div className="space-y-2">
                    {MOOD_LIST.map((m) => (
                      <button
                        key={m.key}
                        onClick={() => updateFilter('mood', mood === m.key ? '' : m.key)}
                        className={cn(
                          'block w-full text-left py-2 text-sm transition-colors',
                          mood === m.key ? 'text-accent font-semibold' : 'hover:text-accent',
                        )}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Category */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-3">Category</h3>
                  <div className="space-y-2">
                    {PRODUCT_CATEGORIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => updateFilter('category', category === c ? '' : c)}
                        className={cn(
                          'block w-full text-left py-2 text-sm transition-colors',
                          category === c ? 'text-accent font-semibold' : 'hover:text-accent',
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Quick filters */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-3">Quick Filters</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'New Arrivals', value: 'new' },
                      { label: 'Best Sellers', value: 'best-sellers' },
                      { label: 'Trending', value: 'trending' },
                      { label: 'On Sale', value: 'sale' },
                    ].map((f) => (
                      <button
                        key={f.value}
                        onClick={() => updateFilter('filter', filter === f.value ? '' : f.value)}
                        className={cn(
                          'block w-full text-left py-2 text-sm transition-colors',
                          filter === f.value ? 'text-accent font-semibold' : 'hover:text-accent',
                        )}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-5 border-t border-border">
                <button
                  onClick={() => setFilterOpen(false)}
                  className="w-full bg-primary text-primary-foreground py-3 text-sm font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors"
                >
                  Show {products.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-muted px-3 py-1.5 text-xs capitalize">
      {label}
      <button onClick={onRemove} aria-label="Remove filter">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
