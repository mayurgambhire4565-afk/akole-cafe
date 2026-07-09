import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee, LayoutDashboard, Package, Heart, MapPin, RefreshCw,
  Star, Tag, Bell, User, ChevronLeft, ChevronRight, LogOut, Menu
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/api/axios';
import toast from 'react-hot-toast';
import Logo from '@/components/ui/Logo';

const SIDEBAR_LINKS = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: User, label: 'Profile', to: '/dashboard/profile' },
  { icon: Package, label: 'My Orders', to: '/dashboard/orders' },
  { icon: Heart, label: 'Wishlist', to: '/dashboard/wishlist' },
  { icon: MapPin, label: 'Addresses', to: '/dashboard/addresses' },
  { icon: RefreshCw, label: 'Subscriptions', to: '/dashboard/subscriptions' },
  { icon: Star, label: 'Rewards', to: '/dashboard/rewards' },
  { icon: Tag, label: 'Coupons', to: '/dashboard/coupons' },
  { icon: Bell, label: 'Notifications', to: '/dashboard/notifications' },
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
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
      {/* Header */}
      <div className={`flex items-center gap-3 p-4 border-b border-gold-500/10 ${collapsed ? 'justify-center' : 'pl-5'}`}>
        <Link to="/" className="flex items-center gap-2 group">
          <Logo 
            size={collapsed ? 36 : 32} 
            showText={!collapsed} 
            textSize="text-base" 
            textColor="text-[#3D2015] dark:text-cream-50 group-hover:text-forest-500 transition-colors" 
          />
        </Link>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b border-gold-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-forest-500/10 border border-forest-500/20 flex items-center justify-center flex-shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-forest-600 dark:text-forest-400 font-semibold">{user?.name?.[0]?.toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-coffee-900 dark:text-cream-100 text-sm font-medium truncate">{user?.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {SIDEBAR_LINKS.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-forest-500/10 text-forest-600 dark:text-forest-400 border border-forest-500/20'
                  : 'text-coffee-600 dark:text-coffee-300 hover:text-forest-600 dark:hover:text-cream-100 hover:bg-forest-500/5 dark:hover:bg-white/5'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gold-500/10">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F5F3E9] dark:bg-[#09090b] transition-colors duration-300">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-white dark:bg-coffee-950 border-r border-coffee-100 dark:border-forest-500/10"
      >
        <SidebarContent />
        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-forest-500 flex items-center justify-center text-white shadow-card z-50"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
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
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}`}>
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 border-b bg-white dark:bg-[#1A3324] border-coffee-100 dark:border-forest-500/10 transition-colors">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg text-coffee-600 dark:text-cream-300 hover:text-[#2E7D32] dark:hover:text-gold-400">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-semibold text-coffee-900 dark:text-cream-50">My Account</span>
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
