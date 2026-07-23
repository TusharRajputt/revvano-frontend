import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/format';
import { FREE_SHIPPING_THRESHOLD } from '@/constants';
import { Link } from 'react-router-dom';

export function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[80]"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-background z-[90] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="font-heading text-xl font-semibold">Shopping Cart</h2>
                <span className="text-sm text-muted-foreground">({itemCount})</span>
              </div>
              <button onClick={closeCart} aria-label="Close cart" className="p-1 hover:text-accent transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free shipping progress */}
            {items.length > 0 && (
              <div className="px-5 py-3 bg-muted/50">
                {remaining > 0 ? (
                  <p className="text-xs text-muted-foreground mb-2">
                    Add <span className="font-semibold text-foreground">{formatPrice(remaining)}</span> for free shipping
                  </p>
                ) : (
                  <p className="text-xs text-accent font-medium mb-2">You have unlocked free shipping!</p>
                )}
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <p className="font-heading text-xl mb-2">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground mb-6">Discover pieces that match your mood.</p>
                  <Button onClick={closeCart} asChild>
                    <Link to="/shop">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.li
                        key={`${item.productId}-${item.color}-${item.size}`}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-4 p-5"
                      >
                        <Link to={`/product/${item.slug}`} onClick={closeCart} className="shrink-0">
                          <img src={item.image} alt={item.name} className="w-20 h-28 object-cover bg-muted" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${item.slug}`} onClick={closeCart} className="font-heading text-base hover:text-accent transition-colors line-clamp-1">
                            {item.name}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.color} / {item.size}</p>
                          <p className="text-sm font-medium mt-1">{formatPrice(item.price)}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center border border-border">
                              <button
                                onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                                className="p-1.5 hover:bg-muted transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-3 text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                                className="p-1.5 hover:bg-muted transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.productId, item.color, item.size)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={closeCart} asChild>
                    <Link to="/cart">View Cart</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/checkout">
                      Checkout <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
