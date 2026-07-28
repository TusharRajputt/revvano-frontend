import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-heading text-8xl lg:text-9xl font-light text-accent mb-4">404</h1>
        <h2 className="font-heading text-3xl font-light mb-3">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          The page you are looking for may have been moved, deleted, or never existed. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/"><Home className="h-4 w-4 mr-2" /> Back to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/shop"><ArrowLeft className="h-4 w-4 mr-2" /> Continue Shopping</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
