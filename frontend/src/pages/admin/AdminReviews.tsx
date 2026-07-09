import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Check, Trash2, Calendar, ShoppingBag, Coffee, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/api/axios';

export default function AdminReviews() {
  const queryClient = useQueryClient();

  // Fetch Reviews
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const res = await api.get('/reviews');
      return res.data.data.reviews || [];
    },
  });

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: async ({ reviewId, isApproved }: { reviewId: string; isApproved: boolean }) => {
      const res = await api.put(`/reviews/${reviewId}`, { isApproved });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast.success('Review status updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update review');
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <img src="/gold-logo.png" className="w-12 h-12 animate-spin mb-4 object-contain" alt="Loading" />
        <p className="text-coffee-500 text-sm">Loading review logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-display font-bold text-coffee-900 dark:text-cream-50">Review Moderation</h1>
        <p className="text-coffee-500 dark:text-coffee-400">Approve or reject customer reviews for café products.</p>
      </div>

      {/* Reviews Table */}
      <div className="bg-white dark:bg-coffee-950 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-coffee-50/50 dark:bg-white/5 border-b border-coffee-100 dark:border-forest-500/10 text-coffee-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Comment</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-coffee-50 dark:divide-forest-500/5">
            {reviews && reviews.length > 0 ? (
              reviews.map((rev: any) => (
                <tr key={rev.id} className="hover:bg-coffee-50/20 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-coffee-900 dark:text-cream-100">{rev.user?.name || 'Customer'}</p>
                      <p className="text-xs text-coffee-400 mt-0.5">{rev.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-coffee-700 dark:text-cream-205 font-medium">
                    {rev.product?.name || 'Artisanal Coffee'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'text-gold-550 fill-gold-555' : 'text-coffee-200'
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-coffee-600 dark:text-cream-200 line-clamp-2 leading-relaxed">
                      {rev.comment}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-coffee-500 flex items-center gap-1.5 py-6">
                    <Calendar className="w-3.5 h-3.5 text-gold-500" />
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!rev.isApproved ? (
                        <button
                          onClick={() => approveMutation.mutate({ reviewId: rev.id, isApproved: true })}
                          disabled={approveMutation.isPending}
                          className="inline-flex items-center gap-1 bg-forest-500 hover:bg-forest-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => approveMutation.mutate({ reviewId: rev.id, isApproved: false })}
                          disabled={approveMutation.isPending}
                          className="inline-flex items-center gap-1 border border-coffee-100 dark:border-forest-500/10 text-coffee-600 dark:text-cream-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950/15 hover:text-red-500 transition-all"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" /> Unapprove
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12 text-coffee-400">
                  No review records to moderate.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
