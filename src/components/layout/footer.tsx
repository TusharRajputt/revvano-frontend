import { Link } from 'react-router-dom';
import { Instagram, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { BRAND, NAV_ITEMS, MOODS } from '@/constants';
import { useToast } from '@/hooks/use-toast';

export function Footer() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast({ title: 'Welcome to रेvvano', description: 'You are subscribed to our journal.' });
      setEmail('');
    }
  };

  return (
    <footer className="bg-neutral-950 text-white mt-20">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-4xl font-light mb-3">
              Join the रेvvano Circle
            </h2>
            <p className="text-white/60 text-sm mb-8 leading-relaxed">
              Be the first to discover new collections, private sales, and editorial stories.
            </p>
            <form onSubmit={handleSubscribe} className="flex max-w-md mx-auto gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                className="bg-accent text-accent-foreground px-6 py-3 text-sm font-medium uppercase tracking-wide hover:bg-accent/90 transition-colors flex items-center gap-2"
              >
                Subscribe <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="font-heading text-2xl font-semibold tracking-[0.15em] mb-4">
              {BRAND.name}
            </h3>
            <p className="text-white/50 text-sm leading-relaxed mb-6 italic font-heading text-lg">
              {BRAND.tagline}
            </p>
            <div className="flex gap-3">
              <a href={BRAND.social.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-white/20 flex items-center justify-center hover:bg-accent hover:border-accent transition-colors" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={BRAND.social.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-white/20 flex items-center justify-center hover:bg-accent hover:border-accent transition-colors" aria-label="YouTube">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4 text-white/80">Shop</h4>
            <ul className="space-y-2.5">
              {NAV_ITEMS[0].children?.map((c) => (
                <li key={c.href}>
                  <Link to={c.href} className="text-sm text-white/50 hover:text-accent transition-colors">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4 text-white/80">Moods</h4>
            <ul className="space-y-2.5">
              {Object.entries(MOODS).map(([key, mood]) => (
                <li key={key}>
                  <Link to={`/collections/${key}`} className="text-sm text-white/50 hover:text-accent transition-colors">
                    {mood.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4 text-white/80">Account</h4>
            <ul className="space-y-2.5">
              <li><Link to="/login" className="text-sm text-white/50 hover:text-accent transition-colors">Sign In</Link></li>
              <li><Link to="/signup" className="text-sm text-white/50 hover:text-accent transition-colors">Create Account</Link></li>
              <li><Link to="/profile" className="text-sm text-white/50 hover:text-accent transition-colors">My Profile</Link></li>
              <li><Link to="/orders" className="text-sm text-white/50 hover:text-accent transition-colors">My Orders</Link></li>
              <li><Link to="/wishlist" className="text-sm text-white/50 hover:text-accent transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4 text-white/80">Help</h4>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-sm text-white/50 hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-white/50 hover:text-accent transition-colors">Contact</Link></li>
              <li><Link to="/privacy-policy" className="text-sm text-white/50 hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className="text-sm text-white/50 hover:text-accent transition-colors">Refund Policy</Link></li>
              <li><Link to="/cancellation-policy" className="text-sm text-white/50 hover:text-accent transition-colors">Cancellation Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-white/50 hover:text-accent transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-sm text-white/40">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {BRAND.address}</span>
            <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> {BRAND.phone}</span>
            <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> {BRAND.email}</span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-xs text-white/30">
          <p>&copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p>Designed in India. Crafted for the world.</p>
        </div>
      </div>
    </footer>
  );
}
