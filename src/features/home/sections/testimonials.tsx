import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '@/services';
import { SectionHeading } from '@/components/common/section-heading';

import 'swiper/css';
import 'swiper/css/pagination';

export function Testimonials() {
  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: contentService.getTestimonials,
  });

  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Loved by Thousands"
          title="Worn by Women Who Lead"
          subtitle="Join a community of women who dress for themselves."
        />

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="!pb-12"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-background p-8 border border-border h-full flex flex-col"
              >
                <Quote className="h-8 w-8 text-accent/30 mb-4" />
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < t.rating ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
                <p className="text-foreground/80 leading-relaxed flex-1 font-heading text-lg italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
