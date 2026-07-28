import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '@/services';
import { BackButton } from '@/components/common/back-button';
import { PageHeader } from '@/components/common/page-header';
import { formatDate } from '@/utils/format';

export function JournalPage() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['journal-posts'],
    queryFn: contentService.getJournalPosts,
  });

  const [featured, ...rest] = posts;

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BackButton className="mb-2" />
      </div>
      <PageHeader
        title="Journal"
        subtitle="Stories on style, craft, and the art of wearing your mood."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Journal' }]}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {isLoading ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="aspect-[16/10] skeleton-shimmer" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 skeleton-shimmer" />
              <div className="h-4 w-1/2 skeleton-shimmer" />
            </div>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Link to={`/journal/${featured.slug}`} className="group grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
                  <div className="relative overflow-hidden aspect-[16/10]">
                    <img src={featured.image} alt={featured.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-accent mb-3">{featured.category}</p>
                    <h2 className="font-heading text-3xl lg:text-4xl font-light mb-4 group-hover:text-accent transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{featured.author}</span>
                      <span>•</span>
                      <span>{formatDate(featured.date)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {featured.readTime}</span>
                    </div>
                    <span className="inline-flex items-center gap-2 mt-6 text-sm font-semibold uppercase tracking-widest group-hover:text-accent">
                      Read Article <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/journal/${post.slug}`} className="group block">
                    <div className="relative overflow-hidden aspect-[16/10] mb-4">
                      <img src={post.image} alt={post.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] text-accent mb-2">{post.category}</p>
                    <h3 className="font-heading text-xl font-medium mb-2 group-hover:text-accent transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatDate(post.date)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
