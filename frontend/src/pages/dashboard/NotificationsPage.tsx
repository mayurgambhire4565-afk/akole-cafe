import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, BellOff, Trash2, Check, Clock, Coffee, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/api/axios';

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['my-notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return res.data.data;
    },
  });

  const readAllMutation = useMutation({
    mutationFn: async () => {
      await api.put('/notifications/read-all', {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
      toast.success('All notifications marked as read');
    },
  });

  const readSingleMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/notifications/${id}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
      toast.success('Notification deleted');
    },
    onError: () => {
      toast.error('Failed to delete notification');
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <img src="/gold-logo.png" className="w-12 h-12 animate-spin mb-4 object-contain" alt="Loading" />
        <p className="text-coffee-500 text-sm">Gathering your announcements...</p>
      </div>
    );
  }

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-coffee-900 dark:text-cream-50">Notifications</h1>
          <p className="text-coffee-500 dark:text-coffee-400">Stay updated on your premium orders and exclusive rewards.</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => readAllMutation.mutate()}
            disabled={readAllMutation.isPending}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-600 dark:text-forest-450 hover:underline self-start sm:self-auto"
          >
            <Check className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notif: any) => (
            <div
              key={notif.id}
              onClick={() => !notif.isRead && readSingleMutation.mutate(notif.id)}
              className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer relative overflow-hidden bg-white dark:bg-coffee-950 ${
                notif.isRead
                  ? 'border-coffee-50 dark:border-forest-500/5 hover:border-forest-500/10'
                  : 'border-forest-500/30 dark:border-forest-500/20 shadow-sm'
              }`}
            >
              {/* Unread indicator bar */}
              {!notif.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-forest-500" />
              )}

              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  notif.isRead 
                    ? 'bg-coffee-50 text-coffee-400 dark:bg-white/5' 
                    : 'bg-forest-500/10 text-forest-500'
                }`}>
                  {notif.type === 'ALERT' ? <ShieldAlert className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                </div>

                <div>
                  <h3 className={`text-sm sm:text-base font-bold ${
                    notif.isRead ? 'text-coffee-700 dark:text-cream-200' : 'text-coffee-900 dark:text-cream-100'
                  }`}>
                    {notif.title}
                  </h3>
                  <p className="text-coffee-500 dark:text-coffee-400 text-sm mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-coffee-400 mt-2 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(notif.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMutation.mutate(notif.id);
                }}
                className="p-1.5 rounded-lg text-coffee-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/15 transition-all flex-shrink-0"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-coffee-950 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-sm">
          <div className="w-16 h-16 bg-forest-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BellOff className="w-8 h-8 text-forest-500" />
          </div>
          <h3 className="text-lg font-bold text-coffee-900 dark:text-cream-100 mb-1">Clean slate</h3>
          <p className="text-coffee-500 dark:text-coffee-400 text-sm max-w-sm mx-auto">
            You don't have any notifications at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
