import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { collections } from '@/data/mock-data';
import { BackButton } from '@/components/common/back-button';
import { PageHeader } from '@/components/common/page-header';

export function CollectionsPage() {
  return (
    <>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BackButton className="mb-2" />
      </div>
      <PageHeader
        title="Collections"
        subtitle="Four signature collections. Four ways to wear your mood."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Collections' }]}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-8 lg:space-y-12">
          {collections.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Link
                to={`/collections/${col.slug}`}
                className="group grid lg:grid-cols-2 gap-6 lg:gap-12 items-center"
              >
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="relative overflow-hidden aspect-[16/10]">
                    <img
                      src={col.image}
                      alt={col.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className={i % 2 === 1 ? 'lg:order-1 lg:text-right' : ''}>
                  <p className="text-xs uppercase tracking-[0.2em] text-accent mb-3">
                    Collection {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 className="font-heading text-4xl lg:text-5xl font-light mb-3">{col.name}</h2>
                  <p className="font-heading text-lg italic text-muted-foreground mb-4">{col.tagline}</p>
                  <p className="text-muted-foreground leading-relaxed mb-6 max-w-md lg:ml-auto">
                    {col.description}
                  </p>
                  <div className={`flex gap-2 mb-6 ${i % 2 === 1 ? 'lg:justify-end' : ''}`}>
                    {col.palette.map((c, j) => (
                      <span
                        key={j}
                        className="w-8 h-8 rounded-full border border-border"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest group-hover:text-accent transition-colors">
                    Explore Collection
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
