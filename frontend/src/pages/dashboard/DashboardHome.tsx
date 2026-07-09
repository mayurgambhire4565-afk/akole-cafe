import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package, Heart, Star, ArrowRight, ShoppingBag, Coffee } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/api/axios';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';

export default function DashboardHome() {
  const { user } = useAuthStore();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [ordersRes, wishlistRes] = await Promise.all([
        api.get('/orders/my'),
        api.get('/wishlist'),
      ]);
      return {
        ordersCount: ordersRes.data.data.orders?.length || 0,
        wishlistCount: wishlistRes.data.data.wishlist?.length || 0,
        recentOrders: ordersRes.data.data.orders?.slice(0, 3) || [],
      };
    },
  });

  const statCards = [
    { label: 'Total Orders', value: stats?.ordersCount || 0, icon: Package, color: 'text-forest-600 dark:text-forest-400', bg: 'bg-forest-50 dark:bg-forest-950/30' },
    { label: 'Wishlist Items', value: stats?.wishlistCount || 0, icon: Heart, color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 14 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Welcome Banner */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden bg-coffee-gradient rounded-3xl p-8 md:p-10 border border-gold-500/20 shadow-coffee"
      >
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-forest-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold-500/10 text-gold-400 border border-gold-500/25">
              ✦ MEMBER AREA
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-cream-50 leading-tight">
              Welcome back,<br className="sm:hidden" /> <span className="text-gold-400">{user?.name?.split(' ')[0]}</span>!
            </h1>
            <p className="text-coffee-200 text-sm md:text-base max-w-md leading-relaxed">
              Manage your orders, update your profile, and browse our gourmet menu all in one place.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link 
              to="/products" 
              className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-coffee-950 px-6 py-3.5 rounded-2xl font-bold hover:shadow-lg hover:shadow-gold-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <Coffee className="absolute -right-10 -bottom-10 w-64 h-64 text-cream-50/5 rotate-12 pointer-events-none" />
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {statCards.map((stat, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-coffee-900/60 dark:backdrop-blur-md p-6 rounded-2xl border border-coffee-100 dark:border-gold-500/10 shadow-sm hover:shadow-coffee/5 hover:border-gold-500/20 transition-all flex items-center gap-5 group"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${stat.bg} ${stat.color} bg-opacity-10 dark:bg-opacity-20`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-coffee-500 dark:text-coffee-300 text-xs font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-display font-extrabold text-coffee-950 dark:text-cream-50 tracking-tight">{stat.value}</p>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Orders */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-coffee-900/40 dark:backdrop-blur-md rounded-3xl border border-coffee-100 dark:border-gold-500/10 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-coffee-100 dark:border-gold-500/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-forest-500 animate-pulse-slow"></div>
            <h2 className="text-xl font-display font-bold text-coffee-950 dark:text-cream-50">Recent Orders</h2>
          </div>
          <Link to="/dashboard/orders" className="group text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-gold-400 text-sm font-semibold flex items-center gap-1 transition-colors">
            <span>View All</span> 
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="p-6">
          {statsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
            </div>
          ) : stats?.recentOrders?.length ? (
            <div className="space-y-4">
              {stats.recentOrders.map((order: any) => (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-coffee-100 dark:border-gold-500/5 hover:border-gold-500/20 hover:bg-coffee-50/30 dark:hover:bg-coffee-950/20 transition-all duration-300 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-coffee-50 dark:bg-coffee-950 flex items-center justify-center text-coffee-500 dark:text-coffee-400 border border-coffee-100 dark:border-gold-500/10">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-coffee-950 dark:text-cream-100 font-display">Order #{order.id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-coffee-500 dark:text-coffee-400 font-medium">Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="sm:text-right">
                      <p className="text-lg font-extrabold text-coffee-950 dark:text-cream-50">₹{order.total.toFixed(2)}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/25' :
                      order.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25' :
                      'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        order.status === 'DELIVERED' ? 'bg-green-500' :
                        order.status === 'PENDING' ? 'bg-amber-500' :
                        'bg-blue-500'
                      }`}></span>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 border border-dashed border-coffee-200 dark:border-gold-500/10 rounded-2xl">
              <div className="w-20 h-20 bg-coffee-50 dark:bg-coffee-950 rounded-full flex items-center justify-center mx-auto mb-5 border border-coffee-100 dark:border-gold-500/10">
                <Package className="w-10 h-10 text-coffee-300 dark:text-coffee-600" />
              </div>
              <h3 className="text-lg font-display font-bold text-coffee-950 dark:text-cream-50 mb-2">No orders placed yet</h3>
              <p className="text-coffee-500 dark:text-coffee-400 text-sm max-w-sm mx-auto mb-6">
                Explore our premium house blends, gourmet light bites, and specialty desserts to place your first order.
              </p>
              <Link 
                to="/products" 
                className="inline-flex items-center gap-2 bg-forest-500 hover:bg-forest-600 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Start Shopping</span>
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
