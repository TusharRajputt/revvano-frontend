import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { Footer } from './footer';
import { CartDrawer } from './cart-drawer';
import { ScrollToTop } from './scroll-to-top';

export function MainLayout() {
  return (
    <>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <CartDrawer />
    </>
  );
}
