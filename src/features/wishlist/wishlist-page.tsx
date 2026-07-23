import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '@/context/wishlist-context';
import { useCart } from '@/context/cart-context';
import { productService } from '@/services';
import { BackButton } from '@/components/common/back-button';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { ProductGridSkeleton } from '@/components/product/product-skeleton';
import { QuickView } from '@/components/product/quick-view';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types';
import { useState } from 'react';

export function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem, openCart } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['wishlist-products', items],
    queryFn: async () => {
      const all = await productService.getProducts();
      return all.products.filter((p) => items.includes(p.id));
    },
    enabled: items.length > 0,
  });

  const products = data || [];

  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BackButton className="mb-4" />
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]} />
        <div className="flex flex-col items-center justify-center text-center py-20">
          <Heart className="h-20 w-20 text-muted-foreground/20 mb-6" />
          <h1 className="font-heading text-3xl mb-3">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-8 max-w-sm">
            Save the pieces you love and they'll appear here.
          </p>
          <Button asChild>
            <Link to="/shop">Discover Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BackButton className="mb-4" />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]} />

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-4xl font-light">My Wishlist</h1>
        <span className="text-sm text-muted-foreground">{items.length} items</span>
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="relative overflow-hidden bg-muted aspect-[3/4]">
                <Link to={`/product/${product.slug}`}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                <button
                  onClick={() => removeItem(product.id)}
                  className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-background/90 backdrop-blur hover:text-destructive transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="pt-3">
                <Link to={`/product/${product.slug}`}>
                  <h3 className="font-heading text-base font-medium hover:text-accent transition-colors">{product.name}</h3>
                </Link>
                <p className="text-sm font-semibold mt-1">{`$${product.price}`}</p>
                <Button
                  className="w-full mt-3 h-10 text-xs uppercase tracking-widest"
                  onClick={() => {
                    addItem(product, product.colors[0].name, product.sizes[0].label);
                    openCart();
                  }}
                >
                  <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                  Move to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
