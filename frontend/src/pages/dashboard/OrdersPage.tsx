import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Calendar, ShoppingBag, Coffee } from 'lucide-react';
import api from '@/api/axios';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await api.get('/orders/my');
      return res.data.data.orders || [];
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/25';
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25';
      default:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25';
    }
  };

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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-coffee-900/20 p-6 rounded-3xl border border-coffee-100 dark:border-gold-500/10 space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-48" />
                </div>
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
              <div className="pt-4 border-t border-coffee-100 dark:border-gold-500/10 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
                <Skeleton className="h-10 w-32 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="mb-6">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/20 mb-2">
          ✦ TRANSACTIONS
        </span>
        <h1 className="text-3xl font-display font-bold text-coffee-950 dark:text-cream-50">My Orders</h1>
        <p className="text-coffee-500 dark:text-coffee-400 text-sm">Track and review your past purchases.</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <motion.div
              key={order.id}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-coffee-900/40 dark:backdrop-blur-md rounded-3xl border border-coffee-100 dark:border-gold-500/10 shadow-sm overflow-hidden hover:border-gold-500/20 hover:shadow-coffee/5 transition-all duration-300"
            >
              {/* Top Banner */}
              <div className="bg-coffee-50/40 dark:bg-coffee-950/20 px-6 py-5 border-b border-coffee-100 dark:border-gold-500/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <p className="text-[10px] text-coffee-400 dark:text-coffee-500 uppercase tracking-wider font-extrabold mb-0.5">Order ID</p>
                    <p className="text-sm font-bold text-coffee-950 dark:text-cream-100 font-display">#{order.orderNumber || order.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-coffee-400 dark:text-coffee-500 uppercase tracking-wider font-extrabold mb-0.5">Placed On</p>
                    <p className="text-sm font-semibold text-coffee-700 dark:text-cream-200 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gold-500" />
                      {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-coffee-400 dark:text-coffee-500 uppercase tracking-wider font-extrabold mb-0.5">Total</p>
                    <p className="text-sm font-extrabold text-forest-600 dark:text-gold-400 font-display font-bold">₹{order.total.toFixed(2)}</p>
                  </div>
                </div>

                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    order.status === 'DELIVERED' ? 'bg-green-500' :
                    order.status === 'PENDING' ? 'bg-amber-500' :
                    'bg-blue-500'
                  }`}></span>
                  {order.status}
                </span>
              </div>

              {/* Items Summary & Link */}
              <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-forest-500/10 dark:bg-forest-500/20 flex items-center justify-center text-forest-600 dark:text-forest-400 border border-forest-500/20">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-coffee-950 dark:text-cream-100">
                      {order.items?.length === 1 ? '1 Item' : `${order.items?.length || 0} Items`}
                    </p>
                    <p className="text-xs text-coffee-500 dark:text-coffee-400 mt-1 max-w-md truncate">
                      {order.items?.map((item: any) => `${item.productName} (x${item.quantity})`).join(', ')}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/dashboard/orders/${order.id}`}
                  className="inline-flex items-center justify-center gap-2 bg-coffee-950 hover:bg-forest-600 text-white font-semibold px-5 py-3 rounded-xl transition-all duration-300 text-sm shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <span>View Details</span> <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          variants={itemVariants}
          className="text-center py-16 px-6 bg-white dark:bg-coffee-900/40 dark:backdrop-blur-md rounded-3xl border border-dashed border-coffee-200 dark:border-gold-500/20 shadow-sm max-w-xl mx-auto"
        >
          <div className="w-20 h-20 bg-coffee-50 dark:bg-coffee-950 rounded-full flex items-center justify-center mx-auto mb-6 border border-coffee-100 dark:border-gold-500/10 relative">
            <ShoppingBag className="w-10 h-10 text-coffee-400 dark:text-coffee-600 animate-bounce-subtle" />
            <div className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-gold-500 border-2 border-white dark:border-coffee-900"></div>
          </div>
          
          <h3 className="text-2xl font-display font-bold text-coffee-950 dark:text-cream-50 mb-3">No orders found</h3>
          <p className="text-coffee-500 dark:text-coffee-400 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
            You haven't ordered any premium coffee yet. Start exploring our rich selection of hand-roasted beans and specialty items!
          </p>
          
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-forest-500 to-forest-600 hover:from-forest-600 hover:to-forest-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Coffee className="w-5 h-5" />
            <span>Browse Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
