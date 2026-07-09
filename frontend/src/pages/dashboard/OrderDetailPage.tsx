import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Calendar, Clock, ShoppingBag, Coffee, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/api/axios';

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-detail', id],
    queryFn: async () => {
      const res = await api.get(`/orders/my/${id}`);
      return res.data.data.order;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const res = await api.put(`/orders/my/${id}/cancel`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['order-detail', id] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      toast.success(data.message || 'Order cancelled successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <img src="/gold-logo.png" className="w-12 h-12 animate-spin mb-4 object-contain" alt="Loading" />
        <p className="text-coffee-500 text-sm">Brewing order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-coffee-900 dark:text-cream-105 mb-2">Order Not Found</h3>
        <p className="text-coffee-500 mb-6">We couldn't retrieve the details for this order.</p>
        <Link to="/dashboard/orders" className="bg-forest-500 text-white px-5 py-2 rounded-xl text-sm font-medium">
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStepIdx = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link to="/dashboard/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-coffee-600 dark:text-cream-300 hover:text-forest-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        {order.status === 'PENDING' && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to cancel this order?')) {
                cancelMutation.mutate();
              }
            }}
            disabled={cancelMutation.isPending}
            className="text-xs font-bold text-red-500 hover:text-red-650 px-4 py-2 rounded-xl border border-red-200 dark:border-red-950/20 hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors"
          >
            {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>

      {/* Main Order Details Cards */}
      <div className="bg-white dark:bg-coffee-950 rounded-3xl border border-coffee-100 dark:border-forest-500/10 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-coffee-50/50 dark:bg-white/5 border-b border-coffee-100 dark:border-forest-500/10 flex flex-wrap justify-between items-center gap-6">
          <div>
            <span className="text-xs font-semibold text-gold-600 dark:text-gold-500 uppercase tracking-wider">Coffee Katta Order</span>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-coffee-900 dark:text-cream-100 mt-1">
              Order #{order.orderNumber || order.id.slice(-8).toUpperCase()}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-coffee-500 mt-2">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(order.createdAt).toLocaleString()}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Status: <strong className="uppercase text-forest-600 dark:text-gold-450">{order.status}</strong></span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-coffee-400 uppercase tracking-wider font-semibold">Total Amount</p>
            <p className="text-2xl font-bold text-forest-600 dark:text-gold-400">₹{order.total.toFixed(2)}</p>
          </div>
        </div>

        {/* Tracking Timeline */}
        {!isCancelled && (
          <div className="p-6 sm:p-8 border-b border-coffee-100 dark:border-forest-500/10">
            <h3 className="font-bold text-coffee-900 dark:text-cream-100 mb-6">Delivery Tracking</h3>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-2xl mx-auto">
              {STATUS_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={step} className="flex-1 flex flex-col items-center relative w-full">
                    {/* Line connector */}
                    {idx < STATUS_STEPS.length - 1 && (
                      <div className={`hidden sm:block absolute left-1/2 right-[-50%] top-4 h-0.5 z-0 ${
                        idx < currentStepIdx ? 'bg-forest-500' : 'bg-coffee-100 dark:bg-forest-950/20'
                      }`} />
                    )}

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-all ${
                      isCompleted 
                        ? 'bg-forest-500 text-white shadow-md shadow-forest-500/15'
                        : 'bg-coffee-50 dark:bg-white/5 text-coffee-400'
                    } ${isCurrent ? 'ring-4 ring-forest-500/20' : ''}`}>
                      {idx + 1}
                    </div>
                    <span className={`text-[10px] font-bold mt-2 text-center capitalize tracking-wide ${
                      isCompleted ? 'text-forest-600 dark:text-forest-400' : 'text-coffee-400'
                    }`}>
                      {step.replace(/_/g, ' ').toLowerCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="p-6 sm:p-8 border-b border-coffee-100 dark:border-forest-500/10">
          <h3 className="font-bold text-coffee-900 dark:text-cream-100 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold-500" /> Items Ordered
          </h3>
          <div className="space-y-4">
            {order.items?.map((item: any) => {
              return (
                <div key={item.id} className="flex items-center justify-between gap-4 py-2 border-b border-coffee-50 dark:border-forest-500/5 last:border-none">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-forest-500/10 flex items-center justify-center overflow-hidden">
                      {item.productImage ? (
                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <Coffee className="w-6 h-6 text-forest-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-coffee-900 dark:text-cream-100 text-sm sm:text-base">{item.productName}</p>
                      <p className="text-xs text-coffee-500">₹{item.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-coffee-950 dark:text-cream-50 text-sm sm:text-base">₹{item.total.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Details (Address & Payment info) */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Address */}
          <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-coffee-100 dark:border-forest-500/10">
            <h3 className="font-bold text-coffee-900 dark:text-cream-100 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold-500" /> Delivery Address
            </h3>
            {order.address ? (
              <div className="text-sm space-y-1.5 text-coffee-600 dark:text-cream-200">
                <p className="font-semibold text-coffee-900 dark:text-cream-100">{order.address.name}</p>
                <p>{order.address.phone}</p>
                <p className="leading-relaxed">
                  {order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}
                </p>
              </div>
            ) : (
              <p className="text-sm text-coffee-400">No delivery address linked.</p>
            )}
          </div>

          {/* Payment */}
          <div className="p-6 sm:p-8">
            <h3 className="font-bold text-coffee-900 dark:text-cream-100 mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gold-500" /> Payment & Costs
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-coffee-550 dark:text-coffee-400">
                <span>Subtotal</span>
                <span>₹{order.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-coffee-550 dark:text-coffee-400">
                <span>GST (5%)</span>
                <span>₹{order.tax?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-coffee-550 dark:text-coffee-400">
                <span>Delivery Charge</span>
                <span>{order.deliveryFee === 0 ? 'Complimentary' : `₹${order.deliveryFee?.toFixed(2)}`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount</span>
                  <span>-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="h-px bg-coffee-50 dark:bg-forest-500/10 my-2" />
              <div className="flex justify-between text-base font-bold text-coffee-900 dark:text-cream-100">
                <span>Total Amount Paid</span>
                <span className="text-forest-600 dark:text-gold-400">₹{order.total.toFixed(2)}</span>
              </div>

              {order.payment && (
                <div className="mt-4 pt-4 border-t border-coffee-50 dark:border-forest-500/10 flex items-center justify-between text-xs text-coffee-400">
                  <span>Method: <strong className="uppercase">{order.payment.provider}</strong></span>
                  <span>Status: <strong className="uppercase text-forest-600 dark:text-gold-450">{order.payment.status}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
