import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/main-layout';
import { HomePage } from '@/features/home/home-page';
import { NotFoundPage } from '@/features/static/not-found-page';
import { ProtectedRoute } from '@/routes/protected-route';

const AdminLayout = lazy(() => import('@/features/admin/admin-layout').then((m) => ({ default: m.AdminLayout })));
const AdminDashboardPage = lazy(() => import('@/features/admin/dashboard-page').then((m) => ({ default: m.AdminDashboardPage })));
const AdminProductsPage = lazy(() => import('@/features/admin/products-page').then((m) => ({ default: m.AdminProductsPage })));
const AdminCategoriesPage = lazy(() => import('@/features/admin/categories-page').then((m) => ({ default: m.AdminCategoriesPage })));
const AdminProductFormPage = lazy(() => import('@/features/admin/product-form-page').then((m) => ({ default: m.AdminProductFormPage })));
const AdminOrdersPage = lazy(() => import('@/features/admin/orders-page').then((m) => ({ default: m.AdminOrdersPage })));
const AdminUsersPage = lazy(() => import('@/features/admin/users-page').then((m) => ({ default: m.AdminUsersPage })));
const AdminSettingsPage = lazy(() => import('@/features/admin/settings-page').then((m) => ({ default: m.AdminSettingsPage })));

const ShopPage = lazy(() => import('@/features/shop/shop-page').then((m) => ({ default: m.ShopPage })));
const CollectionsPage = lazy(() => import('@/features/collections/collections-page').then((m) => ({ default: m.CollectionsPage })));
const CollectionDetailPage = lazy(() => import('@/features/collections/collection-detail-page').then((m) => ({ default: m.CollectionDetailPage })));
const ProductDetailPage = lazy(() => import('@/features/shop/product-detail-page').then((m) => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import('@/features/cart/cart-page').then((m) => ({ default: m.CartPage })));
const WishlistPage = lazy(() => import('@/features/wishlist/wishlist-page').then((m) => ({ default: m.WishlistPage })));
const CheckoutPage = lazy(() => import('@/features/checkout/checkout-page').then((m) => ({ default: m.CheckoutPage })));
const LoginPage = lazy(() => import('@/features/auth/login-page').then((m) => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('@/features/auth/signup-page').then((m) => ({ default: m.SignupPage })));
const ForgotPasswordPage = lazy(() => import('@/features/auth/forgot-password-page').then((m) => ({ default: m.ForgotPasswordPage })));
const OtpPage = lazy(() => import('@/features/auth/otp-page').then((m) => ({ default: m.OtpPage })));
const ResetPasswordPage = lazy(() => import('@/features/auth/reset-password-page').then((m) => ({ default: m.ResetPasswordPage })));
const ProfilePage = lazy(() => import('@/features/profile/profile-page').then((m) => ({ default: m.ProfilePage })));
const OrdersPage = lazy(() => import('@/features/orders/orders-page').then((m) => ({ default: m.OrdersPage })));
const OrderConfirmationPage = lazy(() => import('@/features/orders/order-confirmation-page').then((m) => ({ default: m.OrderConfirmationPage })));
const AboutPage = lazy(() => import('@/features/static/about-page').then((m) => ({ default: m.AboutPage })));
const JournalPage = lazy(() => import('@/features/journal/journal-page').then((m) => ({ default: m.JournalPage })));
const JournalDetailPage = lazy(() => import('@/features/journal/journal-detail-page').then((m) => ({ default: m.JournalDetailPage })));
const ContactPage = lazy(() => import('@/features/static/contact-page').then((m) => ({ default: m.ContactPage })));
const PrivacyPolicyPage = lazy(() => import('@/features/static/policy-pages').then((m) => ({ default: m.PrivacyPolicyPage })));
const RefundPolicyPage = lazy(() => import('@/features/static/policy-pages').then((m) => ({ default: m.RefundPolicyPage })));
const CancellationPolicyPage = lazy(() => import('@/features/static/policy-pages').then((m) => ({ default: m.CancellationPolicyPage })));
const TermsPage = lazy(() => import('@/features/static/policy-pages').then((m) => ({ default: m.TermsPage })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<Suspense fallback={<PageLoader />}><ShopPage /></Suspense>} />
        <Route path="collections" element={<Suspense fallback={<PageLoader />}><CollectionsPage /></Suspense>} />
        <Route path="collections/:slug" element={<Suspense fallback={<PageLoader />}><CollectionDetailPage /></Suspense>} />
        <Route path="product/:slug" element={<Suspense fallback={<PageLoader />}><ProductDetailPage /></Suspense>} />
        <Route path="cart" element={<Suspense fallback={<PageLoader />}><CartPage /></Suspense>} />
        <Route path="wishlist" element={<Suspense fallback={<PageLoader />}><WishlistPage /></Suspense>} />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}><CheckoutPage /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>} />
        <Route path="signup" element={<Suspense fallback={<PageLoader />}><SignupPage /></Suspense>} />
        <Route path="forgot-password" element={<Suspense fallback={<PageLoader />}><ForgotPasswordPage /></Suspense>} />
        <Route path="otp" element={<Suspense fallback={<PageLoader />}><OtpPage /></Suspense>} />
        <Route path="reset-password" element={<Suspense fallback={<PageLoader />}><ResetPasswordPage /></Suspense>} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}><OrdersPage /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="order-confirmation/:id"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}><OrderConfirmationPage /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="about" element={<Suspense fallback={<PageLoader />}><AboutPage /></Suspense>} />
        <Route path="journal" element={<Suspense fallback={<PageLoader />}><JournalPage /></Suspense>} />
        <Route path="journal/:slug" element={<Suspense fallback={<PageLoader />}><JournalDetailPage /></Suspense>} />
        <Route path="contact" element={<Suspense fallback={<PageLoader />}><ContactPage /></Suspense>} />
        <Route path="privacy-policy" element={<Suspense fallback={<PageLoader />}><PrivacyPolicyPage /></Suspense>} />
        <Route path="refund-policy" element={<Suspense fallback={<PageLoader />}><RefundPolicyPage /></Suspense>} />
        <Route path="cancellation-policy" element={<Suspense fallback={<PageLoader />}><CancellationPolicyPage /></Suspense>} />
        <Route path="terms" element={<Suspense fallback={<PageLoader />}><TermsPage /></Suspense>} />
      </Route>

      <Route
        path="admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <Suspense fallback={<PageLoader />}>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route index element={<Suspense fallback={<PageLoader />}><AdminDashboardPage /></Suspense>} />
        <Route path="products" element={<Suspense fallback={<PageLoader />}><AdminProductsPage /></Suspense>} />
        <Route path="categories" element={<Suspense fallback={<PageLoader />}><AdminCategoriesPage /></Suspense>} />
        <Route path="products/new" element={<Suspense fallback={<PageLoader />}><AdminProductFormPage /></Suspense>} />
        <Route path="products/:id/edit" element={<Suspense fallback={<PageLoader />}><AdminProductFormPage /></Suspense>} />
        <Route path="orders" element={<Suspense fallback={<PageLoader />}><AdminOrdersPage /></Suspense>} />
        <Route path="users" element={<Suspense fallback={<PageLoader />}><AdminUsersPage /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<PageLoader />}><AdminSettingsPage /></Suspense>} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
