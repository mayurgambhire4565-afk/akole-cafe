import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingBag, Eye, RefreshCw, Calendar, Check, Coffee, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/api/axios';

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Fetch Orders
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['admin-orders', selectedStatus],
    queryFn: async () => {
      const res = await api.get('/orders', {
        params: { status: selectedStatus || undefined },
      });
      return res.data.data.orders || [];
    },
  });

  // Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const res = await api.put(`/orders/${orderId}/status`, { status, message: `Order status updated to ${status}` });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update status');
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <img src="/gold-logo.png" className="w-12 h-12 animate-spin mb-4 object-contain" alt="Loading" />
        <p className="text-coffee-500 text-sm">Organizing customer orders...</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border-green-200';
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-405 border-yellow-250';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-200';
      default:
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-display font-bold text-coffee-900 dark:text-cream-50">Customer Orders</h1>
        <p className="text-coffee-500 dark:text-coffee-400">Track shipments, updates, and payments.</p>
      </div>

      {/* Tabs / Filter bar */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedStatus('')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            selectedStatus === ''
              ? 'bg-[#1A3324] text-white border-transparent'
              : 'bg-white dark:bg-coffee-950 text-coffee-600 dark:text-cream-250 border-coffee-100 dark:border-forest-500/10'
          }`}
        >
          All Orders
        </button>
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border uppercase ${
              selectedStatus === status
                ? 'bg-[#1A3324] text-white border-transparent'
                : 'bg-white dark:bg-coffee-950 text-coffee-600 dark:text-cream-250 border-coffee-100 dark:border-forest-500/10'
            }`}
          >
            {status.toLowerCase().replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-coffee-950 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-coffee-50/50 dark:bg-white/5 border-b border-coffee-100 dark:border-forest-500/10 text-coffee-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="px-6 py-4">Order Code</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Update Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-coffee-50 dark:divide-forest-500/5">
            {ordersData && ordersData.length > 0 ? (
              ordersData.map((order: any) => (
                <tr key={order.id} className="hover:bg-coffee-50/20 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-coffee-900 dark:text-cream-100">
                    #{order.orderNumber || order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-coffee-700 dark:text-cream-205">
                    {order.user?.name || 'Guest User'}
                  </td>
                  <td className="px-6 py-4 text-coffee-500 flex items-center gap-1.5 py-5">
                    <Calendar className="w-3.5 h-3.5 text-gold-500" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-semibold text-coffee-950 dark:text-cream-50">
                    ₹{order.total}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatusMutation.mutate({ orderId: order.id, status: e.target.value })}
                      className={`text-xs font-bold border rounded-lg py-1.5 px-2.5 focus:ring-1 focus:ring-forest-500 capitalize ${getStatusBadge(order.status)}`}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt.toLowerCase().replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 rounded-lg border border-coffee-100 dark:border-forest-500/10 text-coffee-600 dark:text-cream-300 hover:border-forest-500/30 hover:text-forest-600 transition-colors"
                    >
                      <Eye className="w-4.5 h-4.5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12 text-coffee-400">
                  No orders matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />

          <div className="bg-white dark:bg-coffee-950 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative z-10 border border-coffee-100 dark:border-forest-500/10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-coffee-400 hover:text-coffee-600">
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display font-bold text-2xl text-coffee-900 dark:text-cream-50 mb-6">
              Order Invoice
            </h2>

            <div className="space-y-4 text-sm text-coffee-600 dark:text-cream-200">
              <div>
                <p className="text-xs text-coffee-400">Recipient Name</p>
                <p className="font-bold text-coffee-900 dark:text-cream-100">{selectedOrder.address?.name || selectedOrder.user?.name}</p>
              </div>
              <div>
                <p className="text-xs text-coffee-400">Address & Contacts</p>
                <p>{selectedOrder.address?.phone}</p>
                <p>{selectedOrder.address?.street}, {selectedOrder.address?.city}, {selectedOrder.address?.state}</p>
              </div>
              <div className="border-t border-coffee-50 dark:border-forest-500/5 pt-4">
                <p className="font-bold text-coffee-900 dark:text-cream-100 mb-2">Items Ordered</p>
                {selectedOrder.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between py-1 border-b border-coffee-50/50 dark:border-forest-500/5 last:border-none">
                    <span>{item.productName} (x{item.quantity})</span>
                    <span className="font-semibold">₹{item.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
