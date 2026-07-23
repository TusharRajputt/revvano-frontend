import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, User, Menu, X, Sun, Moon, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BRAND, NAV_ITEMS } from '@/constants';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/context/theme-context';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { Button } from '@/components/ui/button';

export function Header() {
  const { data: settings } = useSiteSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-primary text-primary-foreground text-center text-xs tracking-widest uppercase py-2.5 px-4">
        {settings?.announcementText || 'Complimentary shipping on orders over ₹4,999 — Wear Your Mood.'}
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-500',
          scrolled
            ? 'glass border-b border-border shadow-sm'
            : 'bg-background/0',
        )}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 -ml-2"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="font-heading text-2xl lg:text-3xl font-semibold tracking-[0.15em] absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
            >
              {BRAND.name}
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <div key={item.href} className="group relative">
                  <Link
                    to={item.href}
                    className="text-sm font-medium tracking-wide uppercase hover:text-accent transition-colors py-2"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <div className="glass border border-border rounded-lg shadow-xl p-6 min-w-[220px]">
                        <ul className="space-y-3">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                to={child.href}
                                className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all inline-block"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                className="p-2 hover:text-accent transition-colors"
                onClick={() => setSearchOpen((p) => !p)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                className="p-2 hover:text-accent transition-colors hidden sm:block"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
              <Link
                to="/wishlist"
                className="p-2 hover:text-accent transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="p-2 hover:text-accent transition-colors hidden sm:block"
                  aria-label="Admin panel"
                  title="Admin panel"
                >
                  <LayoutDashboard className="h-5 w-5" />
                </Link>
              )}
              <Link
                to={isAuthenticated ? '/profile' : '/login'}
                className="p-2 hover:text-accent transition-colors hidden sm:block"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>
              <button
                className="p-2 hover:text-accent transition-colors relative"
                onClick={openCart}
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-border glass"
            >
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <form onSubmit={handleSearch} className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products, collections, moods..."
                    className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                  />
                  <Button type="submit" variant="ghost" size="sm">Search</Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[60] lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-background z-[70] lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-heading text-xl font-semibold tracking-widest">{BRAND.name}</span>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-1">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className="block py-3 text-base font-medium uppercase tracking-wide hover:text-accent transition-colors"
                      >
                        {item.label}
                      </Link>
                      {item.children && (
                        <ul className="pl-4 pb-2 space-y-1">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                to={child.href}
                                className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-border space-y-2">
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="flex items-center gap-2 py-2 text-sm font-medium text-accent">
                      <LayoutDashboard className="h-4 w-4" /> Admin Panel
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 py-2 text-sm">
                    <User className="h-4 w-4" /> My Account
                  </Link>
                  <Link to="/wishlist" className="flex items-center gap-2 py-2 text-sm">
                    <Heart className="h-4 w-4" /> Wishlist
                  </Link>
                  <button onClick={toggleTheme} className="flex items-center gap-2 py-2 text-sm">
                    {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
