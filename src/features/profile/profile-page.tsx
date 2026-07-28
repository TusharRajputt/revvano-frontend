import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, Heart, MapPin, Settings, LogOut, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useWishlist } from '@/context/wishlist-context';
import { BackButton } from '@/components/common/back-button';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Tab = 'overview' | 'orders' | 'addresses' | 'wishlist' | 'settings';

export function ProfilePage() {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('overview');

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const tabs: { key: Tab; label: string; icon: typeof User }[] = [
    { key: 'overview', label: 'Overview', icon: User },
    { key: 'orders', label: 'Orders', icon: Package },
    { key: 'addresses', label: 'Addresses', icon: MapPin },
    { key: 'wishlist', label: 'Wishlist', icon: Heart },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BackButton className="mb-4" />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Profile' }]} />

      <div className="grid lg:grid-cols-4 gap-8 mt-4">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="border border-border p-6 mb-4">
            <div className="flex items-center gap-3">
              {user?.avatar && (
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
              )}
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  'flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors',
                  tab === t.key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.key === 'wishlist' && wishlistItems.length > 0 && (
                  <span className="ml-auto text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={() => { logout(); toast({ title: 'Signed out' }); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </nav>
        </aside>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {tab === 'overview' && (
              <div className="space-y-6">
                <h1 className="font-heading text-3xl font-light">Welcome, {user?.name?.split(' ')[0]}</h1>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Orders', value: '2', icon: Package },
                    { label: 'Wishlist', value: String(wishlistItems.length), icon: Heart },
                    { label: 'Addresses', value: String(user?.addresses.length || 0), icon: MapPin },
                  ].map((stat) => (
                    <div key={stat.label} className="border border-border p-5">
                      <stat.icon className="h-5 w-5 text-accent mb-3" />
                      <p className="text-2xl font-semibold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="border border-border p-6">
                  <h2 className="font-heading text-xl mb-3">Recent Activity</h2>
                  <p className="text-sm text-muted-foreground">You have 2 orders. <Link to="/orders" className="underline hover:text-accent">View all</Link></p>
                </div>
              </div>
            )}

            {tab === 'orders' && (
              <div>
                <h1 className="font-heading text-3xl font-light mb-6">My Orders</h1>
                <p className="text-muted-foreground mb-4">View your full order history on the orders page.</p>
                <Button asChild><Link to="/orders">View Orders</Link></Button>
              </div>
            )}

            {tab === 'addresses' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="font-heading text-3xl font-light">Addresses</h1>
                  <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" /> Add New</Button>
                </div>
                <div className="space-y-4">
                  {user?.addresses.map((addr) => (
                    <div key={addr.id} className="border border-border p-5 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{addr.label}</span>
                          {addr.isDefault && <span className="text-xs bg-accent/10 text-accent px-2 py-0.5">Default</span>}
                        </div>
                        <p className="text-sm text-muted-foreground">{addr.fullName}</p>
                        <p className="text-sm text-muted-foreground">{addr.line1}{addr.line2 && <>, {addr.line2}</>}</p>
                        <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zip}</p>
                        <p className="text-sm text-muted-foreground">{addr.country}</p>
                        <p className="text-sm text-muted-foreground mt-1">{addr.phone}</p>
                      </div>
                      <button className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'wishlist' && (
              <div>
                <h1 className="font-heading text-3xl font-light mb-6">My Wishlist</h1>
                {wishlistItems.length === 0 ? (
                  <p className="text-muted-foreground">Your wishlist is empty. <Link to="/shop" className="underline hover:text-accent">Browse products</Link></p>
                ) : (
                  <Button asChild><Link to="/wishlist">View Wishlist ({wishlistItems.length})</Link></Button>
                )}
              </div>
            )}

            {tab === 'settings' && (
              <div>
                <h1 className="font-heading text-3xl font-light mb-6">Account Settings</h1>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5">Full Name</label>
                    <input
                      defaultValue={user?.name}
                      className="w-full bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5">Email</label>
                    <input
                      defaultValue={user?.email}
                      className="w-full bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5">Phone</label>
                    <input
                      defaultValue={user?.phone}
                      className="w-full bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                  <Button onClick={() => { updateUser({ name: user?.name }); toast({ title: 'Profile updated' }); }}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
