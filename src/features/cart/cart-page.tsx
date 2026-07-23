import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { orderService } from '@/services';
import { COUPONS } from '@/constants';
import { formatPrice } from '@/utils/format';
import { BackButton } from '@/components/common/back-button';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function CartPage() {
  const {
    items, removeItem, updateQuantity, subtotal, coupon, applyCoupon, removeCoupon, clearCart,
  } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [couponInput, setCouponInput] = useState('');
  const [showCoupons, setShowCoupons] = useState(false);

  const activeCoupon = COUPONS.find((c) => c.code === coupon);
  const discount = activeCoupon ? orderService.calculateDiscount(activeCoupon, subtotal) : 0;
  const shipping = orderService.calculateShipping(subtotal);
  const tax = orderService.calculateTax(subtotal - discount);
  const total = subtotal - discount + shipping + tax;

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const result = orderService.validateCoupon(couponInput, subtotal);
    if (result.valid && result.coupon) {
      applyCoupon(result.coupon.code);
      toast({ title: 'Coupon applied', description: result.coupon.description });
      setCouponInput('');
    } else {
      toast({ title: 'Invalid coupon', description: 'This coupon is not valid or minimum not met.', variant: 'destructive' });
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <BackButton className="mb-4" />
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />
        <div className="flex flex-col items-center justify-center text-center py-20">
          <ShoppingBag className="h-20 w-20 text-muted-foreground/20 mb-6" />
          <h1 className="font-heading text-3xl mb-3">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8 max-w-sm">
            Looks like you haven't added anything yet. Let's find something that matches your mood.
          </p>
          <Button asChild>
            <Link to="/shop">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />

      <h1 className="font-heading text-4xl font-light mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="divide-y divide-border border-y border-border">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.productId}-${item.color}-${item.size}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-4 py-6"
                >
                  <Link to={`/product/${item.slug}`} className="shrink-0">
                    <img src={item.image} alt={item.name} className="w-24 h-32 object-cover bg-muted" />
                  </Link>
                  <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <Link to={`/product/${item.slug}`} className="font-heading text-lg hover:text-accent transition-colors">
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">{item.color} / {item.size}</p>
                      <p className="text-sm font-semibold mt-2">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="inline-flex items-center border border-border">
                          <button
                            onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                            className="p-2 hover:bg-muted transition-colors"
                            aria-label="Decrease"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-4 text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                            className="p-2 hover:bg-muted transition-colors"
                            aria-label="Increase"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.color, item.size)}
                          className="text-muted-foreground hover:text-destructive transition-colors text-sm flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center mt-6">
            <Button variant="ghost" asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
            <button
              onClick={clearCart}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-28 h-fit">
          <div className="bg-muted/30 p-6 border border-border">
            <h2 className="font-heading text-xl font-semibold mb-4">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-6">
              {coupon ? (
                <div className="flex items-center justify-between bg-accent/10 border border-accent/30 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">{coupon}</span>
                  </div>
                  <button onClick={removeCoupon} aria-label="Remove coupon">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon code"
                      className="flex-1 bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
                    />
                    <Button variant="outline" onClick={handleApplyCoupon}>Apply</Button>
                  </div>
                  <button
                    onClick={() => setShowCoupons((p) => !p)}
                    className="text-xs text-muted-foreground hover:text-accent mt-2 flex items-center gap-1"
                  >
                    Available coupons <ArrowRight className={cn('h-3 w-3 transition-transform', showCoupons && 'rotate-90')} />
                  </button>
                  {showCoupons && (
                    <div className="mt-2 space-y-1.5">
                      {COUPONS.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => { setCouponInput(c.code); }}
                          className="block w-full text-left text-xs text-muted-foreground hover:text-accent"
                        >
                          <span className="font-semibold">{c.code}</span> — {c.description}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="space-y-2.5 text-sm border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base border-t border-border pt-3">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button className="w-full mt-6 h-12" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
