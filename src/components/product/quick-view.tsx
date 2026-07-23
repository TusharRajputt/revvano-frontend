import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { Button } from '@/components/ui/button';
import { formatPrice, calculateDiscount } from '@/utils/format';
import { MOODS } from '@/constants';

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickView({ product, onClose }: QuickViewProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name || '');
      setSelectedSize('');
      setActiveImage(0);
    }
  }, [product]);

  useEffect(() => {
    document.body.style.overflow = product ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  if (!product) return null;

  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem(product, selectedColor, selectedSize);
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-background max-w-4xl w-full max-h-[90vh] overflow-y-auto grid md:grid-cols-2 gap-0"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-background/80 backdrop-blur hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Images */}
            <div className="bg-muted">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="p-6 md:p-8">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                {MOODS[product.mood].label}
              </p>
              <h2 className="font-heading text-2xl font-semibold mb-2">{product.name}</h2>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-3.5 w-3.5',
                        i < Math.floor(product.rating)
                          ? 'fill-accent text-accent'
                          : 'text-muted-foreground',
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{product.rating} ({product.reviewCount} reviews)</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl font-semibold">{formatPrice(product.price)}</span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-sm text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
                    <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 font-semibold">-{discount}%</span>
                  </>
                )}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                {product.description}
              </p>

              {/* Colors */}
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wide mb-2">Color: {selectedColor}</p>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={cn(
                        'w-8 h-8 rounded-full border-2 transition-all',
                        selectedColor === c.name ? 'border-accent scale-110' : 'border-border',
                      )}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wide mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      type="button"
                      key={s.label}
                      onClick={() => s.inStock && setSelectedSize(s.label)}
                      disabled={!s.inStock}
                      className={cn(
                        'min-w-[2.75rem] h-10 border text-sm font-medium transition-all',
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

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className="flex-1"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  {selectedSize ? 'Add to Cart' : 'Select Size'}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleWishlist(product.id)}
                  className={cn(wishlisted && 'text-accent border-accent')}
                >
                  <Heart className={cn('h-4 w-4', wishlisted && 'fill-current')} />
                </Button>
              </div>

              <Link
                to={`/product/${product.slug}`}
                onClick={onClose}
                className="block text-center text-xs uppercase tracking-widest mt-4 hover:text-accent transition-colors"
              >
                View Full Details
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
