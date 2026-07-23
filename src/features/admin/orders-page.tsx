import { useEffect, useState } from 'react';
import { adminService } from '@/services';
import type { Order } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { formatPrice, formatDate } from '@/utils/format';

const STATUS_OPTIONS: Order['status'][] = ['processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

const STATUS_LABELS: Record<Order['status'], string> = {
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const statusVariant: Record<Order['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  processing: 'outline',
  shipped: 'secondary',
  out_for_delivery: 'secondary',
  delivered: 'default',
  cancelled: 'destructive',
};

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    adminService
      .getOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (order: Order, status: Order['status']) => {
    setUpdatingId(order.id);
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    try {
      await adminService.updateOrderStatus(order.id, status);
      toast({ title: `Order ${order.orderNumber} marked as ${STATUS_LABELS[status]}` });
    } catch {
      toast({ title: 'Failed to update order status', variant: 'destructive' });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">{orders.length} total</p>
      </div>

      <div className="rounded-lg border border-border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No orders yet.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell>{order.address?.fullName || '—'}</TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <TableCell>{formatPrice(order.total)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusVariant[order.status]}>
                        {STATUS_LABELS[order.status]}
                      </Badge>
                      <Select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onValueChange={(v) => handleStatusChange(order, v as Order['status'])}
                      >
                        <SelectTrigger className="h-8 w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>
                              {STATUS_LABELS[s]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}