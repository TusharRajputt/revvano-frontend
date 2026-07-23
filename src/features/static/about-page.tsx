import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BackButton } from '@/components/common/back-button';
import { PageHeader } from '@/components/common/page-header';
import { MOOD_LIST } from '@/constants';

export function AboutPage() {
  return (
    <>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BackButton className="mb-2" />
      </div>
      <PageHeader
        title="Our Story"
        subtitle="रेvvano was born from a simple idea: what you wear should reflect who you are, not what aisle you found it in."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      {/* Hero image */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden aspect-[16/9]"
        >
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
            alt="रेvvano atelier"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Philosophy */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-3xl lg:text-4xl font-light leading-relaxed"
        >
          "We don't sell clothes. We curate personalities. Every piece in our collection is chosen for the woman who wears it — not the category it belongs to."
        </motion.p>
        <p className="text-sm text-muted-foreground mt-6 uppercase tracking-widest">— Elena Marchetti, Founder & Creative Director</p>
      </section>

      {/* Values */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Personality First', text: 'We organize by mood, not category. Because you are not a section in a department store.' },
            { title: 'Crafted to Last', text: 'Premium materials, ethical production, and pieces designed to outlive trends.' },
            { title: 'Wear Your Mood', text: 'Four collections for four sides of you. Switch moods. Switch collections. Stay yourself.' },
          ].map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <h3 className="font-heading text-2xl font-medium mb-3">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{value.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Moods */}
      <section className="bg-muted/30 py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-4xl font-light text-center mb-12">The Four Moods</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {MOOD_LIST.map((mood, i) => (
              <motion.div
                key={mood.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/collections/${mood.key}`} className="group block relative overflow-hidden aspect-[3/4]">
                  <img src={mood.image} alt={mood.label} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 p-5 text-white">
                    <h3 className="font-heading text-2xl">{mood.label}</h3>
                    <p className="text-xs text-white/70 mt-1">{mood.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 text-center py-20">
        <h2 className="font-heading text-4xl font-light mb-4">Find Your Mood</h2>
        <p className="text-muted-foreground mb-8">Discover the collection that speaks to you.</p>
        <Link
          to="/collections"
          className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-sm font-semibold uppercase tracking-widest hover:bg-accent transition-colors"
        >
          Explore Collections
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>
    </>
  );
}
