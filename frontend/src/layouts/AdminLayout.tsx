import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee, LayoutDashboard, Package, Users, FileText, Tag, Star,
  RefreshCw, ShoppingBag, BarChart3, Settings, MessageSquare, LogOut, Menu, Crown, X
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/api/axios';
import toast from 'react-hot-toast';

const ADMIN_LINKS = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
  { icon: Package, label: 'Products', to: '/admin/products' },
  { icon: ShoppingBag, label: 'Categories', to: '/admin/categories' },
  { icon: BarChart3, label: 'Orders', to: '/admin/orders' },
  { icon: Users, label: 'Users', to: '/admin/users' },
  { icon: FileText, label: 'Blogs', to: '/admin/blogs' },
  { icon: Tag, label: 'Coupons', to: '/admin/coupons' },
  { icon: MessageSquare, label: 'Reviews', to: '/admin/reviews' },
  { icon: RefreshCw, label: 'Subscriptions', to: '/admin/subscriptions' },
  { icon: Star, label: 'Rewards', to: '/admin/rewards' },
  { icon: Settings, label: 'Settings', to: '/admin/settings' },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-5 border-b border-coffee-100 dark:border-forest-500/10">
        <div className="w-9 h-9 rounded-xl bg-forest-500 flex items-center justify-center">
          <Crown className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-display font-bold text-coffee-900 dark:text-cream-50 text-base leading-none">Admin Panel</p>
          <p className="text-forest-600 dark:text-forest-400 text-xs mt-0.5">Akole Café</p>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-coffee-100 dark:border-forest-500/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-forest-500/10 border border-forest-500/20 flex items-center justify-center">
            <span className="text-forest-600 dark:text-forest-400 text-sm font-semibold">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="text-coffee-900 dark:text-cream-100 text-sm font-medium truncate">{user?.name}</p>
            <p className="text-coffee-500 dark:text-coffee-400 text-xs capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {ADMIN_LINKS.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-forest-500/10 text-forest-600 dark:text-forest-400 border border-forest-500/20'
                  : 'text-coffee-600 dark:text-coffee-300 hover:text-forest-600 dark:hover:text-cream-100 hover:bg-forest-500/5 dark:hover:bg-white/5'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-gold-500/10 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-espresso-300 hover:text-cream-100 hover:bg-white/5 transition-all"
        >
          <Coffee className="w-4 h-4" />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-cream-50 dark:bg-espresso-950">
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 z-40 bg-white dark:bg-coffee-950 border-r border-coffee-100 dark:border-forest-500/10"
      >
        <SidebarContent />
      </aside>

      {/* Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -256 }} animate={{ x: 0 }} exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden bg-white dark:bg-coffee-950 border-r border-coffee-100 dark:border-forest-500/10"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-espresso-400 hover:text-gold-400"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 border-b"
          style={{ background: 'rgba(13,7,5,0.95)', borderColor: 'rgba(200,164,110,0.1)' }}>
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg text-cream-300 hover:text-gold-400">
            <Menu className="w-5 h-5" />
          </button>
          <Crown className="w-4 h-4 text-gold-500" />
          <span className="font-display font-semibold text-cream-50">Admin Panel</span>
        </div>

        <main className="p-4 md:p-8 min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
