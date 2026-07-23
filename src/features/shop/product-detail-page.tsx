import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, ShoppingBag, Heart, Minus, Plus, Truck, RotateCcw, Shield,
  Share2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { productService } from '@/services';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { useToast } from '@/hooks/use-toast';
import { BackButton } from '@/components/common/back-button';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { ProductGrid } from '@/components/product/product-grid';
import { QuickView } from '@/components/product/quick-view';
import { formatPrice, calculateDiscount } from '@/utils/format';
import { MOODS } from '@/constants';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem, openCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addRecentlyViewed, recentlyViewed } = useRecentlyViewed();
  const { toast } = useToast();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProductBySlug(slug!),
    enabled: !!slug,
  });

  const { data: relatedData } = useQuery({
    queryKey: ['related-products', product?.id],
    queryFn: () => productService.getRelatedProducts(product!.id),
    enabled: !!product,
  });

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name || '');
      setSelectedSize('');
      setActiveImage(0);
      setQuantity(1);
      addRecentlyViewed(product.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, addRecentlyViewed]);

  const { data: recentData } = useQuery({
    queryKey: ['products-by-ids', recentlyViewed],
    queryFn: async () => {
      const all = await productService.getProducts();
      return all.products.filter((p) => recentlyViewed.includes(p.id) && p.id !== product?.id);
    },
    enabled: recentlyViewed.length > 1,
  });

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-[3/4] bg-muted skeleton-shimmer" />
          <div className="space-y-4">
            <div className="h-4 w-20 bg-muted skeleton-shimmer" />
            <div className="h-8 w-64 bg-muted skeleton-shimmer" />
            <div className="h-6 w-32 bg-muted skeleton-shimmer" />
            <div className="h-20 w-full bg-muted skeleton-shimmer" />
            <div className="h-10 w-full bg-muted skeleton-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 text-center">
        <p className="font-heading text-2xl mb-4">Product not found</p>
        <Link to="/shop" className="text-sm underline hover:text-accent">Back to Shop</Link>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const wishlisted = isWishlisted(product.id);
  const relatedProducts = relatedData || [];
  const recentProducts = recentData || [];

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({ title: 'Please select a size', variant: 'destructive' });
      return;
    }
    addItem(product, selectedColor, selectedSize, quantity);
    openCart();
  };

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BackButton className="mb-4" />
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
            { label: MOODS[product.mood].label, href: `/collections/${product.mood}` },
            { label: product.name },
          ]}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible no-scrollbar">
              {product.images.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'shrink-0 w-20 h-24 lg:w-16 lg:h-20 overflow-hidden border-2 transition-all',
                    activeImage === i ? 'border-accent' : 'border-border hover:border-primary',
                  )}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            {/* Main image */}
            <div className="flex-1 relative overflow-hidden bg-muted aspect-[3/4]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={product.images[activeImage]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1.5 text-xs font-semibold uppercase tracking-widest">
                  -{discount}%
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="lg:py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-2">
              {MOODS[product.mood].label}
            </p>
            <h1 className="font-heading text-3xl lg:text-4xl font-light mb-3">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-muted-foreground',
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <>
                  <span className="text-base text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <span className="text-xs bg-accent text-accent-foreground px-2 py-1 font-semibold">
                    Save {formatPrice(product.compareAtPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

            {/* Colors */}
            <div className="mb-5">
              <p className="text-sm font-semibold mb-2">
                Color: <span className="text-muted-foreground font-normal">{selectedColor}</span>
              </p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    type="button"
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={cn(
                      'w-10 h-10 rounded-full border-2 transition-all',
                      selectedColor === c.name ? 'border-accent scale-110' : 'border-border hover:border-primary',
                    )}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">Size</p>
                <button className="text-xs underline text-muted-foreground hover:text-accent">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    type="button"
                    key={s.label}
                    onClick={() => s.inStock && setSelectedSize(s.label)}
                    disabled={!s.inStock}
                    className={cn(
                      'min-w-[3rem] h-12 border text-sm font-medium transition-all',
                      selectedSize === s.label
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary',
                      !s.inStock && 'opacity-40 line-through cursor-not-allowed',
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">Quantity</p>
              <div className="inline-flex items-center border border-border">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 hover:bg-muted transition-colors"
                  aria-label="Decrease"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 text-sm font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 hover:bg-muted transition-colors"
                  aria-label="Increase"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <Button onClick={handleAddToCart} className="flex-1 h-12 text-sm uppercase tracking-widest">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12"
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart className={cn('h-5 w-5', wishlisted && 'fill-current text-accent')} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12"
                onClick={() => toast({ title: 'Link copied to clipboard' })}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 py-6 border-y border-border">
              {[
                { icon: Truck, label: 'Free shipping over ₹4,999' },
                { icon: RotateCcw, label: '30-day returns' },
                { icon: Shield, label: 'Secure checkout' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2">
                  <item.icon className="h-5 w-5 text-accent" />
                  <span className="text-[11px] text-muted-foreground leading-tight">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Accordion */}
            <Accordion type="single" collapsible className="mt-6">
              <AccordionItem value="details">
                <AccordionTrigger className="text-sm font-semibold uppercase tracking-widest">
                  Product Details
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {product.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">—</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger className="text-sm font-semibold uppercase tracking-widest">
                  Shipping & Returns
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Complimentary standard shipping on all orders over ₹4,999. Express shipping
                    available at checkout. Returns accepted within 30 days of delivery. Items must
                    be unworn with original tags attached.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="font-heading text-3xl font-light text-center mb-10">You May Also Like</h2>
            <ProductGrid products={relatedProducts} onQuickView={setQuickViewProduct} />
          </section>
        )}

        {/* Recently viewed */}
        {recentProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="font-heading text-3xl font-light text-center mb-10">Recently Viewed</h2>
            <ProductGrid products={recentProducts.slice(0, 4)} onQuickView={setQuickViewProduct} />
          </section>
        )}
      </div>

      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}
