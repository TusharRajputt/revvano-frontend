import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  Users,
  Settings,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import { BRAND } from '@/constants';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/settings', label: 'Site Settings', icon: Settings },
];

export function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-background shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="font-heading text-xl font-semibold tracking-widest">{BRAND.name}</span>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-4 sm:px-8 border-b border-border bg-background">
          <div className="md:hidden font-heading text-lg font-semibold tracking-widest">
            {BRAND.name} Admin
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-tight">{user?.name}</p>
              <p className="text-xs text-muted-foreground leading-tight">{user?.email}</p>
            </div>
            {user?.avatar && (
              <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
            )}
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="md:hidden flex overflow-x-auto border-b border-border bg-background px-2 py-2 gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors',
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted',
                )
              }
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}