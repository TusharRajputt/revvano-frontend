import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BRAND } from '@/constants';

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} className="relative h-[90vh] min-h-[600px] overflow-hidden">
      <motion.div style={{ scale }} className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
          alt="रेvvano — Wear Your Mood"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
      </motion.div>

      <motion.div
        style={{ y, opacity }}
        className="relative h-full flex flex-col items-center justify-center text-center text-white px-4"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs sm:text-sm uppercase tracking-[0.3em] mb-6 text-white/80"
        >
          New Season 2026
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-heading text-5xl sm:text-7xl lg:text-8xl font-light text-shadow-luxury max-w-4xl text-balance"
        >
          {BRAND.tagline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-base sm:text-lg text-white/70 mt-6 max-w-xl leading-relaxed"
        >
          Premium western clothing curated by personality, not category. Four collections. Four moods. One you.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 mt-10"
        >
          <Link
            to="/shop"
            className="group bg-white text-black px-8 py-4 text-sm font-semibold uppercase tracking-widest hover:bg-accent hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            Shop Now
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/collections"
            className="border border-white/40 text-white px-8 py-4 text-sm font-semibold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            Explore Collections
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-px h-12 bg-white/40 relative overflow-hidden">
          <motion.div
            animate={{ y: [-48, 48] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-6 bg-white absolute"
          />
        </div>
      </motion.div>
    </section>
  );
}
