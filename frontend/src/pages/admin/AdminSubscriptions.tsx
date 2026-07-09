import { useQuery } from '@tanstack/react-query';
import { Calendar, RefreshCw, Coffee, Tag } from 'lucide-react';
import api from '@/api/axios';

export default function AdminSubscriptions() {
  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      const res = await api.get('/subscriptions/all');
      return res.data.data.subscriptions || [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <img src="/gold-logo.png" className="w-12 h-12 animate-spin mb-4 object-contain" alt="Loading" />
        <p className="text-coffee-500 text-sm">Loading subscriber lists...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-display font-bold text-coffee-900 dark:text-cream-50">Recurring Deliveries</h1>
        <p className="text-coffee-500 dark:text-coffee-400">View and monitor customer coffee subscriptions.</p>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white dark:bg-coffee-950 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-coffee-50/50 dark:bg-white/5 border-b border-coffee-100 dark:border-forest-500/10 text-coffee-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Coffee Product</th>
              <th className="px-6 py-4">Billing Plan</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Next Delivery</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-coffee-50 dark:divide-forest-500/5">
            {subscriptions && subscriptions.length > 0 ? (
              subscriptions.map((sub: any) => (
                <tr key={sub.id} className="hover:bg-coffee-50/20 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-coffee-900 dark:text-cream-100">{sub.user?.name || 'Subscriber'}</p>
                      <p className="text-xs text-coffee-400 mt-0.5">{sub.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-coffee-700 dark:text-cream-205">
                    {sub.product?.name || 'Premium Beans'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-forest-500/10 text-forest-600 dark:text-forest-450 border border-forest-150 tracking-wide uppercase">
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-coffee-500">
                    {sub.quantity} unit(s)
                  </td>
                  <td className="px-6 py-4 text-coffee-500 flex items-center gap-1.5 py-6">
                    <Calendar className="w-3.5 h-3.5 text-gold-500" />
                    {new Date(sub.nextDelivery).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
                      sub.status === 'ACTIVE' 
                        ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400' 
                        : sub.status === 'PAUSED' 
                        ? 'bg-yellow-50 text-yellow-750 dark:bg-yellow-950/20 dark:text-yellow-450' 
                        : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12 text-coffee-400">
                  No active subscribers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
