import { HeroSection } from '@/features/home/sections/hero-section';
import { ShopByMood } from '@/features/home/sections/shop-by-mood';
import { HomeReels } from '@/features/home/sections/home-reels';
import { FeaturedCollection } from '@/features/home/sections/featured-collection';
import { ProductCarouselSection } from '@/features/home/sections/product-carousel-section';
import { Testimonials } from '@/features/home/sections/testimonials';
import { InstagramGallery } from '@/features/home/sections/instagram-gallery';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ShopByMood />
      <HomeReels />
      <ProductCarouselSection
        eyebrow="Just Landed"
        title="New Arrivals"
        subtitle="Fresh pieces for every mood."
        filter="new"
      />
      <FeaturedCollection />
      <ProductCarouselSection
        eyebrow="Most Loved"
        title="Best Sellers"
        subtitle="The pieces everyone is talking about."
        filter="best-sellers"
      />
      <ProductCarouselSection
        eyebrow="Trending Now"
        title="Trending This Week"
        filter="trending"
      />
      <ProductCarouselSection
        eyebrow="Curated by Us"
        title="Editor's Picks"
        subtitle="Our team's personal favorites."
        filter="editors-pick"
      />
      <Testimonials />
      <InstagramGallery />
    </>
  );
}
