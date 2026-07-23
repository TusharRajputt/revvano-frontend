import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Package } from 'lucide-react';
import { orderService } from '@/services';
import type { Order } from '@/types';
import { formatPrice } from '@/utils/format';
import { Button } from '@/components/ui/button';

export function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    orderService
      .getOrderById(id)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-24 text-center text-muted-foreground">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="font-heading text-2xl mb-4">We couldn't find that order</p>
        <Button asChild><Link to="/orders">View My Orders</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
          <CheckCircle2 className="h-9 w-9 text-accent" />
        </div>
        <h1 className="font-heading text-4xl font-light mb-2">Thank you for your order!</h1>
        <p className="text-muted-foreground">
          A confirmation email is on its way. Your order number is{' '}
          <span className="font-semibold text-foreground">{order.orderNumber}</span>.
        </p>
      </motion.div>

      <div className="border border-border p-6 mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
          <Package className="h-4 w-4" /> Order Summary
        </h2>
        <div className="space-y-3 mb-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-3">
              <img src={item.image} alt={item.name} className="w-14 h-18 object-cover bg-muted" />
              <div className="flex-1 text-sm">
                <p className="font-medium">{item.name}</p>
                <p className="text-muted-foreground">{item.color} / {item.size} × {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2 text-sm border-t border-border pt-4">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          {order.discount > 0 && (
            <div className="flex justify-between text-accent"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>
          )}
          <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatPrice(order.tax)}</span></div>
          <div className="flex justify-between font-semibold text-base border-t border-border pt-3"><span>Total</span><span>{formatPrice(order.total)}</span></div>
        </div>
      </div>

      <div className="border border-border p-6 mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-widest mb-2">Shipping To</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {order.address.fullName}<br />
          {order.address.line1}{order.address.line2 && <>, {order.address.line2}</>}<br />
          {order.address.city}, {order.address.state} {order.address.zip}<br />
          {order.address.country}
        </p>
      </div>

      <div className="flex gap-3">
        <Button asChild variant="outline" className="flex-1"><Link to="/shop">Continue Shopping</Link></Button>
        <Button asChild className="flex-1"><Link to="/orders">View My Orders</Link></Button>
      </div>
    </div>
  );
}
