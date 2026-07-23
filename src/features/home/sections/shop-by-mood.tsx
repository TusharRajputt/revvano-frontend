import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MOOD_LIST } from '@/constants';
import { SectionHeading } from '@/components/common/section-heading';
import { useSiteSettings } from '@/hooks/use-site-settings';

export function ShopByMood() {
  const { data: settings } = useSiteSettings();

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Shop by Mood"
          title="What's Your Vibe Today?"
          subtitle="We don't believe in categories. We believe in personality. Pick a mood, and we'll curate the rest."
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {MOOD_LIST.map((mood, i) => {
            const image = settings?.moodImages?.[mood.key] || mood.image;
            return (
            <motion.div
              key={mood.key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link to={`/collections/${mood.key}`} className="group block relative overflow-hidden aspect-[3/4]">
                <img
                  src={image}
                  alt={mood.label}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                  <h3 className="font-heading text-2xl font-medium mb-1">{mood.label}</h3>
                  <p className="text-xs text-white/70 mb-3 line-clamp-2">{mood.description}</p>
                  <div className="flex items-center gap-1 text-xs uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
                {/* Palette dots */}
                <div className="absolute top-4 right-4 flex gap-1">
                  {mood.palette.slice(0, 3).map((c, j) => (
                    <span
                      key={j}
                      className="w-3 h-3 rounded-full border border-white/30"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </Link>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
