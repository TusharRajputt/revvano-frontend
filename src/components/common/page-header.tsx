import { motion } from 'framer-motion';
import { Breadcrumbs } from '@/components/common/breadcrumbs';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  background?: string;
}

export function PageHeader({ title, subtitle, breadcrumbs, background }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden pt-8 pb-12">
      {background && (
        <div className="absolute inset-0 -z-10">
          <img src={background} alt="" className="w-full h-full object-cover opacity-10" />
        </div>
      )}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {breadcrumbs && (
          <div className="mb-4">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-muted-foreground mt-3 max-w-xl leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}
