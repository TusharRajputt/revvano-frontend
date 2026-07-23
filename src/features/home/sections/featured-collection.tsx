import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { collections } from '@/data/mock-data';

export function FeaturedCollection() {
  const collection = collections[0];

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden aspect-[4/5] order-2 lg:order-1"
          >
            <img
              src={collection.image}
              alt={collection.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4">Featured Collection</p>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light mb-4">
              {collection.name}
            </h2>
            <p className="font-heading text-xl italic text-muted-foreground mb-6">
              {collection.tagline}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg">
              {collection.description}
            </p>
            <div className="flex gap-2 mb-8">
              {collection.palette.map((c, i) => (
                <span
                  key={i}
                  className="w-10 h-10 rounded-full border border-border"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <Link
              to={`/collections/${collection.slug}`}
              className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest hover:text-accent transition-colors"
            >
              Discover the Collection
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
