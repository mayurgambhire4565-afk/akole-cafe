import { useQuery } from '@tanstack/react-query';
import { Calendar, Star, Coffee } from 'lucide-react';
import api from '@/api/axios';

export default function AdminRewards() {
  const { data: rewardsData, isLoading } = useQuery({
    queryKey: ['admin-rewards'],
    queryFn: async () => {
      const res = await api.get('/rewards/all');
      return res.data.data.rewards || [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <img src="/gold-logo.png" className="w-12 h-12 animate-spin mb-4 object-contain" alt="Loading" />
        <p className="text-coffee-500 text-sm">Loading loyalty points log...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-display font-bold text-coffee-900 dark:text-cream-50">Loyalty Rewards</h1>
        <p className="text-coffee-500 dark:text-coffee-400">Monitor customer loyalty point logs and referrals.</p>
      </div>

      {/* Rewards Table */}
      <div className="bg-white dark:bg-coffee-950 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-coffee-50/50 dark:bg-white/5 border-b border-coffee-100 dark:border-forest-500/10 text-coffee-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Stars</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Voucher Type</th>
              <th className="px-6 py-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-coffee-50 dark:divide-forest-500/5">
            {rewardsData && rewardsData.length > 0 ? (
              rewardsData.map((reward: any) => (
                <tr key={reward.id} className="hover:bg-coffee-50/20 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-coffee-900 dark:text-cream-100">{reward.user?.name || 'Customer'}</p>
                      <p className="text-xs text-coffee-400 mt-0.5">{reward.user?.email}</p>
                    </div>
                  </td>
                  <td className={`px-6 py-4 font-bold ${reward.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {reward.points > 0 ? `+${reward.points}` : reward.points} Stars
                  </td>
                  <td className="px-6 py-4 text-coffee-600 dark:text-cream-205">
                    {reward.description}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                      reward.type === 'BONUS' ? 'bg-amber-55 bg-opacity-10 border-amber-200 text-amber-700' :
                      reward.type === 'REFERRAL' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                      reward.type === 'REDEEMED' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                      'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}>
                      {reward.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-coffee-500 text-right flex items-center justify-end gap-1.5 py-6">
                    <Calendar className="w-3.5 h-3.5 text-gold-500" />
                    {new Date(reward.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-12 text-coffee-400">
                  No loyalty points history logged.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
