import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Truck, MapPin, CheckCircle, XCircle, ChevronRight, Loader2 } from 'lucide-react';
import { orderService } from '@/services';
import { BackButton } from '@/components/common/back-button';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { formatPrice, formatDate } from '@/utils/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { Order } from '@/types';

const statusConfig: Record<Order['status'], { label: string; icon: typeof Package; color: string }> = {
  processing: { label: 'Processing', icon: Package, color: 'text-accent' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-blue-500' },
  out_for_delivery: { label: 'Out for Delivery', icon: MapPin, color: 'text-blue-500' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-500' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-destructive' },
};

// The customer-facing journey a normal (non-cancelled) order moves through.
const TRACKER_STAGES: { status: Order['status']; label: string; icon: typeof Package }[] = [
  { status: 'processing', label: 'Processing', icon: Package },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle },
];

function OrderTracker({ status }: { status: Order['status'] }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive font-medium py-2">
        <XCircle className="h-4 w-4" />
        This order was cancelled
      </div>
    );
  }

  const currentIndex = TRACKER_STAGES.findIndex((s) => s.status === status);

  return (
    <div className="flex items-center py-2">
      {TRACKER_STAGES.map((stage, i) => {
        const isComplete = i <= currentIndex;
        const StageIcon = stage.icon;
        return (
          <div key={stage.status} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={cn(
                  'h-7 w-7 rounded-full flex items-center justify-center border-2 transition-colors',
                  isComplete ? 'bg-accent border-accent text-accent-foreground' : 'border-border text-muted-foreground',
                )}
              >
                <StageIcon className="h-3.5 w-3.5" />
              </div>
              <span className={cn('text-[10px] font-medium text-center leading-tight w-16', isComplete ? 'text-foreground' : 'text-muted-foreground')}>
                {stage.label}
              </span>
            </div>
            {i < TRACKER_STAGES.length - 1 && (
              <div className={cn('h-0.5 flex-1 mx-1 -mt-4', i < currentIndex ? 'bg-accent' : 'bg-border')} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function OrdersPage() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getOrders,
  });
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleCancel = async (order: Order) => {
    setCancellingId(order.id);
    try {
      await orderService.cancelOrder(order.id);
      toast({ title: `Order ${order.orderNumber} cancelled` });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (err) {
      const apiMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast({ title: apiMessage || 'Failed to cancel order', variant: 'destructive' });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BackButton className="mb-4" />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Orders' }]} />

      <h1 className="font-heading text-4xl font-light mb-8">My Orders</h1>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border border-border p-6 h-32 skeleton-shimmer" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="font-heading text-2xl mb-2">No orders yet</p>
          <p className="text-muted-foreground mb-6">When you place an order, it will appear here.</p>
          <Link to="/shop" className="text-sm underline hover:text-accent">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const StatusIcon = statusConfig[order.status].icon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border border-border p-6"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold">{order.orderNumber}</span>
                      <span className={cn('inline-flex items-center gap-1 text-xs font-medium', statusConfig[order.status].color)}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusConfig[order.status].label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{formatDate(order.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.total)}</p>
                    <p className="text-xs text-muted-foreground">{order.items.length} items</p>
                  </div>
                </div>

                <OrderTracker status={order.status} />

                {order.status === 'processing' && (
                  <div className="mb-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" disabled={cancellingId === order.id}>
                          {cancellingId === order.id ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Cancelling...
                            </>
                          ) : (
                            'Cancel Order'
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel order {order.orderNumber}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This order hasn't shipped yet, so it can still be cancelled. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Order</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancel(order)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Yes, Cancel Order
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}

                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {order.items.map((item, j) => (
                    <div key={j} className="shrink-0 flex gap-2 items-center">
                      <img src={item.image} alt={item.name} className="w-14 h-18 object-cover bg-muted" />
                      <div className="text-xs">
                        <p className="font-medium line-clamp-1">{item.name}</p>
                        <p className="text-muted-foreground">{item.color} / {item.size} × {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {order.trackingNumber && (
                  <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      Tracking: <span className="font-mono">{order.trackingNumber}</span>
                    </p>
                    <button className="text-xs flex items-center gap-1 hover:text-accent">
                      View Details <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
