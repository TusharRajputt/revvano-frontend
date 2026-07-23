import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { SectionHeading } from '@/components/common/section-heading';

export function HomeReels() {
  const { data: settings } = useSiteSettings();
  const [activeId, setActiveId] = useState<string | null>(null);

  const videos = settings?.videos || [];

  // Nothing to show yet — don't render an empty section
  if (videos.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="In Motion"
          title="Reels & Reveals"
          subtitle="See the collections come to life."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative aspect-[9/16] overflow-hidden bg-black group"
            >
              {activeId === video.id ? (
                <video
                  src={video.url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  onEnded={() => setActiveId(null)}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveId(video.id)}
                  className="w-full h-full relative"
                  aria-label={video.title || 'Play video'}
                >
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-neutral-900" />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="h-5 w-5 text-black ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                  {video.title && (
                    <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-medium truncate">
                      {video.title}
                    </p>
                  )}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
