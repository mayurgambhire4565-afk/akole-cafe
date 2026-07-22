import React, { useEffect, useState, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import PageLoader from '@/components/ui/PageLoader';
import CustomCursor from '@/components/ui/CustomCursor';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Public Pages
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const AboutPage = React.lazy(() => import('@/pages/AboutPage'));
const ProductsPage = React.lazy(() => import('@/pages/ProductsPage'));
const ProductDetailPage = React.lazy(() => import('@/pages/ProductDetailPage'));
const BlogsPage = React.lazy(() => import('@/pages/BlogsPage'));
const BlogDetailPage = React.lazy(() => import('@/pages/BlogDetailPage'));
const CartPage = React.lazy(() => import('@/pages/CartPage'));
const ReserveTablePage = React.lazy(() => import('@/pages/ReserveTablePage'));
const EventsPage = React.lazy(() => import('@/pages/EventsPage'));
const FranchisePage = React.lazy(() => import('@/pages/FranchisePage'));
const ContactPage = React.lazy(() => import('@/pages/ContactPage'));
const GalleryPage = React.lazy(() => import('@/pages/GalleryPage'));
const TermsPage = React.lazy(() => import('@/pages/TermsPage'));
const PrivacyPage = React.lazy(() => import('@/pages/PrivacyPage'));

// Auth Pages
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const OTPPage = React.lazy(() => import('@/pages/auth/OTPPage'));
const ResetPasswordPage = React.lazy(() => import('@/pages/auth/ResetPasswordPage'));

// User Dashboard Pages
const DashboardHome = React.lazy(() => import('@/pages/dashboard/DashboardHome'));
const ProfilePage = React.lazy(() => import('@/pages/dashboard/ProfilePage'));
const OrdersPage = React.lazy(() => import('@/pages/dashboard/OrdersPage'));
const OrderDetailPage = React.lazy(() => import('@/pages/dashboard/OrderDetailPage'));
const WishlistPage = React.lazy(() => import('@/pages/dashboard/WishlistPage'));
const AddressesPage = React.lazy(() => import('@/pages/dashboard/AddressesPage'));
const SubscriptionsPage = React.lazy(() => import('@/pages/dashboard/SubscriptionsPage'));
const RewardsPage = React.lazy(() => import('@/pages/dashboard/RewardsPage'));
const CouponsPage = React.lazy(() => import('@/pages/dashboard/CouponsPage'));
const NotificationsPage = React.lazy(() => import('@/pages/dashboard/NotificationsPage'));

// Checkout
const CheckoutPage = React.lazy(() => import('@/pages/CheckoutPage'));
const OrderSuccessPage = React.lazy(() => import('@/pages/OrderSuccessPage'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminProducts = React.lazy(() => import('@/pages/admin/AdminProducts'));
const AdminCategories = React.lazy(() => import('@/pages/admin/AdminCategories'));
const AdminOrders = React.lazy(() => import('@/pages/admin/AdminOrders'));
const AdminUsers = React.lazy(() => import('@/pages/admin/AdminUsers'));
const AdminBlogs = React.lazy(() => import('@/pages/admin/AdminBlogs'));
const AdminCoupons = React.lazy(() => import('@/pages/admin/AdminCoupons'));
const AdminReviews = React.lazy(() => import('@/pages/admin/AdminReviews'));
const AdminSubscriptions = React.lazy(() => import('@/pages/admin/AdminSubscriptions'));
const AdminRewards = React.lazy(() => import('@/pages/admin/AdminRewards'));

// Guard components
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  const { isDark } = useThemeStore();
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  useEffect(() => {
    // Show premium golden loading animation briefly on reload / refresh for exactly 1 second
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top smoothly on every page transition / navigation
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  return (
    <>
      <CustomCursor />
      <AnimatePresence>
        {isInitializing && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`fixed inset-0 z-[9999] ${isInitializing ? 'pointer-events-auto' : 'pointer-events-none'}`}
          >
            <PageLoader />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<MainLayout />}>
            <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/:slug" element={<BlogDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/reserve" element={<ReserveTablePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/franchise" element={<FranchisePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/terms-of-service" element={<TermsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPage />} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
          </Route>

          {/* Auth Layout Routes */}
          <Route element={<GuestRoute><AuthLayout /></GuestRoute>}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-otp" element={<OTPPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* User Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="addresses" element={<AddressesPage />} />
            <Route path="subscriptions" element={<SubscriptionsPage />} />
            <Route path="rewards" element={<RewardsPage />} />
            <Route path="coupons" element={<CouponsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="subscriptions" element={<AdminSubscriptions />} />
            <Route path="rewards" element={<AdminRewards />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
