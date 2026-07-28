import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, IndianRupee, AlertTriangle, Plus } from 'lucide-react';
import { adminService } from '@/services';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/format';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  revenue: number;
  lowStock: number;
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: 'Total Revenue', value: formatPrice(stats.revenue), icon: IndianRupee },
        { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag },
        { label: 'Total Products', value: stats.totalProducts, icon: Package },
        { label: 'Total Users', value: stats.totalUsers, icon: Users },
      ]
    : [];

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of your store</p>
        </div>
        <Button asChild>
          <Link to="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-lg border border-border bg-background animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
              <div key={card.label} className="rounded-lg border border-border bg-background p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <card.icon className="h-4 w-4 text-accent" />
                </div>
                <p className="font-heading text-2xl font-semibold mt-2">{card.value}</p>
              </div>
            ))}
          </div>

          {stats && stats.lowStock > 0 && (
            <div className="mt-6 flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 px-5 py-4">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p className="text-sm">
                {stats.lowStock} product{stats.lowStock > 1 ? 's are' : ' is'} low on stock (5 or fewer
                units).{' '}
                <Link to="/admin/products" className="underline font-medium">
                  Review products
                </Link>
              </p>
            </div>
          )}

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <Link
              to="/admin/products"
              className="rounded-lg border border-border bg-background p-6 hover:border-accent transition-colors"
            >
              <Package className="h-5 w-5 text-accent mb-3" />
              <p className="font-medium">Manage Products</p>
              <p className="text-sm text-muted-foreground mt-1">Add, edit, or remove dresses and other items.</p>
            </Link>
            <Link
              to="/admin/orders"
              className="rounded-lg border border-border bg-background p-6 hover:border-accent transition-colors"
            >
              <ShoppingBag className="h-5 w-5 text-accent mb-3" />
              <p className="font-medium">Manage Orders</p>
              <p className="text-sm text-muted-foreground mt-1">Track and update order status.</p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}