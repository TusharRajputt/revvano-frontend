import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';
import type { Product } from '@/types';
import { productService } from '@/services';
import { ProductCard } from '@/components/product/product-card';
import { ProductCardSkeleton } from '@/components/product/product-skeleton';
import { SectionHeading } from '@/components/common/section-heading';
import { QuickView } from '@/components/product/quick-view';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

interface ProductCarouselSectionProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  filter: 'new' | 'best-sellers' | 'trending' | 'editors-pick';
}

export function ProductCarouselSection({
  eyebrow,
  title,
  subtitle,
  filter,
}: ProductCarouselSectionProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['products', filter],
    queryFn: () => productService.getProducts({ filter }),
  });

  const products = data?.products || [];

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} align="left" className="mb-0" />
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-11 h-11 border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Previous"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-11 h-11 border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Next"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <Swiper
            modules={[FreeMode, Navigation]}
            onSwiper={(s) => (swiperRef.current = s)}
            spaceBetween={16}
            slidesPerView={2}
            freeMode
            breakpoints={{
              768: { slidesPerView: 3, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} onQuickView={setQuickViewProduct} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </section>
  );
}
