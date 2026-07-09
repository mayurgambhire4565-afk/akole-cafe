import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, ToggleLeft, ToggleRight, Coffee, ShieldAlert, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/api/axios';
import { useAuthStore } from '@/store/authStore';

const ROLE_OPTIONS = ['CUSTOMER', 'EMPLOYEE', 'ADMIN', 'SUPER_ADMIN'];

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  // Fetch Users
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm, selectedRole],
    queryFn: async () => {
      const res = await api.get('/users', {
        params: {
          search: searchTerm || undefined,
          role: selectedRole || undefined,
        },
      });
      return res.data.data.users || [];
    },
  });

  // Toggle Status Mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const res = await api.put(`/users/${userId}/status`, { isActive });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User status updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update user status');
    },
  });

  // Change Role Mutation (SUPER_ADMIN only)
  const changeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const res = await api.put(`/users/${userId}/role`, { role });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update user role');
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <img src="/gold-logo.png" className="w-12 h-12 animate-spin mb-4 object-contain" alt="Loading" />
        <p className="text-coffee-500 text-sm">Loading user database...</p>
      </div>
    );
  }

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-display font-bold text-coffee-900 dark:text-cream-50">User Directory</h1>
        <p className="text-coffee-500 dark:text-coffee-400">View user stats, restrict accounts, or update permissions.</p>
      </div>

      {/* Filter bar */}
      <div className="bg-white dark:bg-coffee-950 p-4 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-4.5 h-4.5 text-coffee-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-coffee-50 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-forest-500 text-sm text-coffee-900 dark:text-cream-100 placeholder-coffee-400"
          />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="bg-coffee-50 dark:bg-white/5 border-none rounded-xl py-2 px-3 focus:ring-2 focus:ring-forest-500 text-sm text-coffee-600 dark:text-cream-200 min-w-[150px]"
        >
          <option value="">All Roles</option>
          {ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      {/* Table grid */}
      <div className="bg-white dark:bg-coffee-950 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-coffee-50/50 dark:bg-white/5 border-b border-coffee-100 dark:border-forest-500/10 text-coffee-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="px-6 py-4">Name & Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Loyalty Stars</th>
              <th className="px-6 py-4">Orders Count</th>
              <th className="px-6 py-4 text-right">Status Toggle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-coffee-50 dark:divide-forest-500/5">
            {usersData && usersData.length > 0 ? (
              usersData.map((usr: any) => (
                <tr key={usr.id} className="hover:bg-coffee-50/20 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-coffee-900 dark:text-cream-100 leading-tight">{usr.name}</p>
                      <p className="text-xs text-coffee-400 mt-0.5">{usr.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-coffee-600 dark:text-cream-200">
                    {usr.phone || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {isSuperAdmin && usr.id !== currentUser?.id ? (
                      <select
                        value={usr.role}
                        onChange={(e) => changeRoleMutation.mutate({ userId: usr.id, role: e.target.value })}
                        disabled={changeRoleMutation.isPending}
                        className="text-xs font-bold bg-coffee-50 dark:bg-white/5 border border-coffee-150 rounded-lg py-1 px-2 focus:ring-1 focus:ring-forest-500 dark:text-cream-100 text-coffee-800"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-coffee-700 dark:text-cream-200">
                        {usr.role === 'ADMIN' || usr.role === 'SUPER_ADMIN' ? (
                          <ShieldCheck className="w-3.5 h-3.5 text-forest-500" />
                        ) : (
                          <ShieldAlert className="w-3.5 h-3.5 text-coffee-400" />
                        )}
                        {usr.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-gold-650">
                    {usr.loyaltyPoints} Stars
                  </td>
                  <td className="px-6 py-4 text-coffee-500">
                    {usr.totalOrders || 0} orders
                  </td>
                  <td className="px-6 py-4 text-right">
                    {usr.id !== currentUser?.id ? (
                      <button
                        onClick={() => toggleStatusMutation.mutate({ userId: usr.id, isActive: !usr.isActive })}
                        disabled={toggleStatusMutation.isPending}
                        className="text-sm transition-colors text-coffee-600 dark:text-cream-300"
                      >
                        {usr.isActive ? <ToggleRight className="w-7 h-7 text-forest-550" /> : <ToggleLeft className="w-7 h-7 text-coffee-300" />}
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-coffee-400 italic">Self (Protected)</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12 text-coffee-400">
                  No matching user accounts.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
