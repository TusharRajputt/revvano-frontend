import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '@/context/cart-context';
import { WishlistProvider } from '@/context/wishlist-context';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/context/theme-context';
import { AppRoutes } from '@/routes/app-routes';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/common/error-boundary';
import { SplashScreen } from '@/components/common/splash-screen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <SplashScreen />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <BrowserRouter>
                  <AppRoutes />
                  <Toaster />
                </BrowserRouter>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
