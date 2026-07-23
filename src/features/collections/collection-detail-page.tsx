import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { productService } from '@/services';
import { MOODS } from '@/constants';
import { BackButton } from '@/components/common/back-button';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductGridSkeleton } from '@/components/product/product-skeleton';
import { QuickView } from '@/components/product/quick-view';
import type { Product } from '@/types';

export function CollectionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const { data: collection } = useQuery({
    queryKey: ['collection', slug],
    queryFn: () => productService.getCollectionBySlug(slug!),
    enabled: !!slug,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', { collection: slug }],
    queryFn: () => productService.getProducts({ collection: slug }),
    enabled: !!slug,
  });

  if (!collection) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 text-center">
        <p className="font-heading text-2xl mb-4">Collection not found</p>
        <Link to="/collections" className="text-sm underline hover:text-accent">Back to Collections</Link>
      </div>
    );
  }

  const moodInfo = MOODS[collection.mood];
  const products = data?.products || [];

  return (
    <>
      {/* Hero banner */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img src={collection.image} alt={collection.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex gap-2 mb-4">
              {moodInfo.palette.map((c, i) => (
                <span key={i} className="w-6 h-6 rounded-full border border-white/30" style={{ backgroundColor: c }} />
              ))}
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-3">The Collection</p>
            <h1 className="font-heading text-5xl lg:text-7xl font-light text-shadow-luxury">{collection.name}</h1>
            <p className="font-heading text-xl italic text-white/80 mt-3">{collection.tagline}</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <BackButton className="mb-4" />
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Collections', href: '/collections' },
              { label: collection.name },
            ]}
          />
        </div>

        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-muted-foreground leading-relaxed text-lg">{collection.description}</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 mt-6 text-sm font-semibold uppercase tracking-widest hover:text-accent transition-colors"
          >
            Shop All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <ProductGrid products={products} onQuickView={setQuickViewProduct} />
        )}
      </div>

      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}
