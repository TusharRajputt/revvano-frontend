import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, CreditCard, Lock, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { orderService } from '@/services';
import { COUPONS } from '@/constants';
import { formatPrice } from '@/utils/format';
import { BackButton } from '@/components/common/back-button';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

let razorpayScriptPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load Razorpay checkout. Check your connection and try again.'));
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}

export function CheckoutPage() {
  const { items, subtotal, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const isSubmittingRef = useRef(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    line1: user?.addresses[0]?.line1 || '',
    line2: user?.addresses[0]?.line2 || '',
    city: user?.addresses[0]?.city || '',
    state: user?.addresses[0]?.state || '',
    zip: user?.addresses[0]?.zip || '',
    country: user?.addresses[0]?.country || 'India',
  });

  const activeCoupon = COUPONS.find((c) => c.code === coupon);
  const discount = activeCoupon ? orderService.calculateDiscount(activeCoupon, subtotal) : 0;
  const shipping = orderService.calculateShipping(subtotal);
  const tax = orderService.calculateTax(subtotal - discount);
  const total = subtotal - discount + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 text-center">
        <p className="font-heading text-2xl mb-4">Your cart is empty</p>
        <Button asChild><Link to="/shop">Start Shopping</Link></Button>
      </div>
    );
  }

  const handlePayment = async () => {
    if (isSubmittingRef.current) return; // synchronous guard — closes the double-click race window
    isSubmittingRef.current = true;
    setProcessing(true);

    const orderItems = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      color: item.color,
      size: item.size,
    }));

    const shippingAddress = {
      fullName: shippingInfo.fullName,
      email: shippingInfo.email,
      phone: shippingInfo.phone,
      line1: shippingInfo.line1,
      line2: shippingInfo.line2,
      city: shippingInfo.city,
      state: shippingInfo.state,
      zip: shippingInfo.zip,
      country: shippingInfo.country,
    };

    try {
      await loadRazorpayScript();

      const razorpayOrder = await orderService.createRazorpayOrder(total);

      const rzp = new window.Razorpay({
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.orderId,
        name: 'रेvvano',
        description: 'Order payment',
        prefill: {
          name: shippingInfo.fullName,
          email: shippingInfo.email,
          contact: shippingInfo.phone,
        },
        theme: { color: '#1a1a1a' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const order = await orderService.verifyPaymentAndCreateOrder({
              items: orderItems,
              shippingAddress,
              subtotal,
              shipping,
              tax,
              discount,
              total,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clearCart();
            navigate(`/order-confirmation/${order.id}`);
          } catch (err) {
            const apiMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast({
              title: 'Payment succeeded but order creation failed',
              description: apiMessage || 'Please contact support with your payment ID.',
              variant: 'destructive',
            });
          } finally {
            isSubmittingRef.current = false;
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            isSubmittingRef.current = false;
            setProcessing(false);
          },
        },
      });

      rzp.open();
    } catch (err) {
      const apiMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      const message = apiMessage || (err instanceof Error ? err.message : 'Failed to start payment');
      toast({ title: message, variant: 'destructive' });
      isSubmittingRef.current = false;
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BackButton className="mb-4" />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />

      <h1 className="font-heading text-4xl font-light mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-10">
        {['Shipping', 'Payment', 'Review'].map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all',
                step > i + 1 ? 'bg-accent text-accent-foreground border-accent' :
                step === i + 1 ? 'border-primary bg-primary text-primary-foreground' :
                'border-border text-muted-foreground',
              )}
            >
              {step > i + 1 ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn('text-sm font-medium', step >= i + 1 ? 'text-foreground' : 'text-muted-foreground')}>
              {label}
            </span>
            {i < 2 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-heading text-2xl mb-6">Shipping Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Full Name" value={shippingInfo.fullName} onChange={(v) => setShippingInfo({ ...shippingInfo, fullName: v })} />
                <Input label="Email" type="email" value={shippingInfo.email} onChange={(v) => setShippingInfo({ ...shippingInfo, email: v })} />
                <Input label="Phone" value={shippingInfo.phone} onChange={(v) => setShippingInfo({ ...shippingInfo, phone: v })} />
                <Input label="Address Line 1" value={shippingInfo.line1} onChange={(v) => setShippingInfo({ ...shippingInfo, line1: v })} className="sm:col-span-2" />
                <Input label="Address Line 2 (optional)" value={shippingInfo.line2} onChange={(v) => setShippingInfo({ ...shippingInfo, line2: v })} className="sm:col-span-2" />
                <Input label="City" value={shippingInfo.city} onChange={(v) => setShippingInfo({ ...shippingInfo, city: v })} />
                <Input label="State / Province" value={shippingInfo.state} onChange={(v) => setShippingInfo({ ...shippingInfo, state: v })} />
                <Input label="ZIP / Postal Code" value={shippingInfo.zip} onChange={(v) => setShippingInfo({ ...shippingInfo, zip: v })} />
                <Input label="Country" value={shippingInfo.country} onChange={(v) => setShippingInfo({ ...shippingInfo, country: v })} />
              </div>
              <Button className="mt-6" onClick={() => setStep(2)}>
                Continue to Payment <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-heading text-2xl mb-6">Payment Method</h2>
              <div className="border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5" />
                  <span className="font-semibold">Card, UPI, Netbanking & Wallets</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  You'll securely enter your payment details on the next step via Razorpay's checkout —
                  we never see or store your card, UPI, or bank details.
                </p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-4">
                  <Lock className="h-3 w-3" /> Your payment information is encrypted and secure.
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>Review Order <ArrowRight className="h-4 w-4 ml-2" /></Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-heading text-2xl mb-6">Review Your Order</h2>

              <div className="space-y-6">
                <div className="border border-border p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-widest mb-2">Shipping To</h3>
                  <p className="text-sm text-muted-foreground">
                    {shippingInfo.fullName}<br />
                    {shippingInfo.line1}{shippingInfo.line2 && <>, {shippingInfo.line2}</>}<br />
                    {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}<br />
                    {shippingInfo.country}
                  </p>
                </div>

                <div className="border border-border p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-widest mb-3">Items</h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-3">
                        <img src={item.image} alt={item.name} className="w-14 h-18 object-cover bg-muted" />
                        <div className="flex-1 text-sm">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-muted-foreground">{item.color} / {item.size} × {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={handlePayment} disabled={processing} className="flex-1">
                  {processing ? 'Processing...' : `Pay — ${formatPrice(total)}`}
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-28 h-fit">
          <div className="bg-muted/30 p-6 border border-border">
            <h2 className="font-heading text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-3 text-sm">
                  <img src={item.image} alt={item.name} className="w-12 h-16 object-cover bg-muted shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.color} / {item.size} × {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2.5 text-sm border-t border-border pt-4">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-accent"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatPrice(tax)}</span></div>
              <div className="flex justify-between font-semibold text-base border-t border-border pt-3"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({
  label, value, onChange, type = 'text', placeholder, className,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}
