import type { Product } from '@/types';
import { ProductCard } from '@/components/product/product-card';

interface ProductGridProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, onQuickView, columns = 4 }: ProductGridProps) {
  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns];

  return (
    <div className={`grid ${colClass} gap-x-4 gap-y-8 sm:gap-x-6`}>
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} onQuickView={onQuickView} index={i} />
      ))}
    </div>
  );
}
