import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '@/services';
import { BackButton } from '@/components/common/back-button';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { formatDate } from '@/utils/format';
import { journalPosts } from '@/data/mock-data';

export function JournalDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post } = useQuery({
    queryKey: ['journal-post', slug],
    queryFn: () => contentService.getJournalPostBySlug(slug!),
    enabled: !!slug,
  });

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="font-heading text-2xl mb-4">Article not found</p>
        <Link to="/journal" className="text-sm underline hover:text-accent">Back to Journal</Link>
      </div>
    );
  }

  const morePosts = journalPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <article>
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
          <div className="max-w-3xl mx-auto text-white">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs uppercase tracking-[0.2em] text-accent mb-3"
            >
              {post.category}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-heading text-3xl lg:text-5xl font-light text-shadow-luxury"
            >
              {post.title}
            </motion.h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton className="mb-4" />
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Journal', href: '/journal' },
            { label: post.title },
          ]}
        />
      </div>

      {/* Meta */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4 pb-8 border-b border-border">
        <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <p className="text-sm font-semibold">{post.author}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(post.date)} • <Clock className="h-3 w-3 inline" /> {post.readTime}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-xl lg:text-2xl font-light leading-relaxed mb-8 italic"
        >
          {post.excerpt}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="prose prose-lg max-w-none"
        >
          <p className="text-muted-foreground leading-relaxed text-lg">{post.content}</p>
          <p className="text-muted-foreground leading-relaxed text-lg mt-4">
            At रेvvano, we believe fashion is personal. It is not about following trends — it is about
            expressing who you are, how you feel, and who you want to be. That is why we curate by mood,
            not by category. Because you are not a department store aisle.
          </p>
          <p className="text-muted-foreground leading-relaxed text-lg mt-4">
            Explore our collections and find the mood that speaks to you today.
          </p>
        </motion.div>
      </div>

      {/* More articles */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
        <h2 className="font-heading text-3xl font-light mb-8">Continue Reading</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {morePosts.map((p) => (
            <Link key={p.id} to={`/journal/${p.slug}`} className="group flex gap-4 items-center">
              <div className="w-24 h-24 overflow-hidden shrink-0">
                <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-accent mb-1">{p.category}</p>
                <h3 className="font-heading text-lg group-hover:text-accent transition-colors">{p.title}</h3>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  Read <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="text-center pb-16">
        <Link to="/journal" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest hover:text-accent">
          <ArrowLeft className="h-4 w-4" /> Back to Journal
        </Link>
      </div>
    </article>
  );
}
