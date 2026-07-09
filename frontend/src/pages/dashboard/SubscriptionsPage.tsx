import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Calendar, Play, Pause, XCircle, ShoppingBag, Coffee, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import api from '@/api/axios';

export default function SubscriptionsPage() {
  const queryClient = useQueryClient();

  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['my-subscriptions'],
    queryFn: async () => {
      const res = await api.get('/subscriptions');
      return res.data.data.subscriptions || [];
    },
  });

  const pauseMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/subscriptions/${id}/pause`, {});
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscriptions'] });
      toast.success('Subscription paused successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to pause subscription');
    },
  });

  const resumeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/subscriptions/${id}/resume`, {});
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscriptions'] });
      toast.success('Subscription resumed successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to resume subscription');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/subscriptions/${id}/cancel`, {});
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscriptions'] });
      toast.success('Subscription cancelled successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to cancel subscription');
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <img src="/gold-logo.png" className="w-12 h-12 animate-spin mb-4 object-contain" alt="Loading" />
        <p className="text-coffee-500 text-sm">Managing your coffee plans...</p>
      </div>
    );
  }

  const activeSubs = subscriptions.filter((s: any) => s.status === 'ACTIVE');
  const pausedSubs = subscriptions.filter((s: any) => s.status === 'PAUSED');
  const inactiveSubs = subscriptions.filter((s: any) => s.status === 'CANCELLED' || s.status === 'EXPIRED');

  const renderSubscriptionCard = (sub: any) => {
    const product = sub.product;
    let images: string[] = [];
    try {
      if (product?.images && typeof product.images === 'string') {
        images = JSON.parse(product.images);
      } else if (Array.isArray(product?.images)) {
        images = product.images;
      }
    } catch {
      images = [];
    }

    return (
      <div
        key={sub.id}
        className="bg-white dark:bg-coffee-950 rounded-2xl border border-coffee-100 dark:border-forest-500/10 p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-forest-500/10 flex items-center justify-center overflow-hidden flex-shrink-0">
            {images?.[0] ? (
              <img src={images[0]} alt={product?.name} className="w-full h-full object-cover" />
            ) : (
              <Coffee className="w-8 h-8 text-forest-500" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-coffee-900 dark:text-cream-100">{product?.name || 'Artisanal Coffee'}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-forest-500/10 text-forest-600 dark:text-forest-400 border border-forest-500/20 uppercase tracking-wide">
                {sub.plan}
              </span>
            </div>
            <p className="text-xs text-coffee-500 mt-1">Quantity: {sub.quantity} units • Price: ₹{sub.price.toFixed(2)}</p>
            <p className="text-xs text-coffee-600 dark:text-cream-200 mt-2 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-gold-500" />
              Next shipment: {new Date(sub.nextDelivery).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-coffee-50 dark:border-forest-500/5 justify-end">
          {sub.status === 'ACTIVE' ? (
            <>
              <button
                onClick={() => pauseMutation.mutate(sub.id)}
                disabled={pauseMutation.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-coffee-100 dark:border-forest-500/10 text-xs font-semibold text-coffee-600 dark:text-cream-300 hover:border-yellow-500/30 hover:text-yellow-600 transition-colors"
              >
                <Pause className="w-3.5 h-3.5" /> Pause
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to cancel this coffee plan?')) {
                    cancelMutation.mutate(sub.id);
                  }
                }}
                disabled={cancelMutation.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-950/20 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" /> Cancel
              </button>
            </>
          ) : sub.status === 'PAUSED' ? (
            <>
              <button
                onClick={() => resumeMutation.mutate(sub.id)}
                disabled={resumeMutation.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest-500 hover:bg-forest-600 text-white text-xs font-semibold transition-colors"
              >
                <Play className="w-3.5 h-3.5" /> Resume
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to cancel this coffee plan?')) {
                    cancelMutation.mutate(sub.id);
                  }
                }}
                disabled={cancelMutation.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-950/20 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" /> Cancel
              </button>
            </>
          ) : (
            <span className="text-xs font-bold text-coffee-450 dark:text-coffee-500 italic uppercase">Cancelled</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-coffee-900 dark:text-cream-50">Coffee Subscriptions</h1>
          <p className="text-coffee-500 dark:text-coffee-400">Freshly roasted beans delivered to your doorstep automatically.</p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center justify-center gap-2 bg-forest-500 hover:bg-forest-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm self-start sm:self-auto shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" /> Subscribe Now
        </Link>
      </div>

      {subscriptions.length > 0 ? (
        <div className="space-y-8">
          {/* Active Subscriptions */}
          {activeSubs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-coffee-900 dark:text-cream-100 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-forest-500 animate-spin-slow" /> Active Deliveries
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {activeSubs.map(renderSubscriptionCard)}
              </div>
            </div>
          )}

          {/* Paused Subscriptions */}
          {pausedSubs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-coffee-700 dark:text-cream-200">Paused Plans</h2>
              <div className="grid grid-cols-1 gap-4">
                {pausedSubs.map(renderSubscriptionCard)}
              </div>
            </div>
          )}

          {/* Past/Cancelled Subscriptions */}
          {inactiveSubs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-coffee-400 dark:text-coffee-500">Subscription History</h2>
              <div className="grid grid-cols-1 gap-4 opacity-75">
                {inactiveSubs.map(renderSubscriptionCard)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-coffee-950 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-sm">
          <div className="w-16 h-16 bg-forest-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-forest-500" />
          </div>
          <h3 className="text-lg font-bold text-coffee-900 dark:text-cream-100 mb-1">No active subscriptions</h3>
          <p className="text-coffee-500 dark:text-coffee-400 text-sm mb-6 max-w-sm mx-auto">
            Get your favorite beans on a regular schedule and save up to 10% on every order.
          </p>
          <Link to="/products" className="bg-forest-500 hover:bg-forest-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors inline-block text-sm">
            Configure A Plan
          </Link>
        </div>
      )}
    </div>
  );
}
