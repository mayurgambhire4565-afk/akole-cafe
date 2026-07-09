import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Edit2, Trash2, Plus, Tag, X, Coffee } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/api/axios';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

type CouponFormData = {
  code: string;
  description?: string;
  type: 'PERCENTAGE' | 'FIXED';
  discount: number;
  minOrderValue?: number;
  maxDiscount?: number;
  maxUses?: number;
  isActive: boolean;
};

export default function AdminCoupons() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CouponFormData>();

  // Fetch Coupons
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      const res = await api.get('/coupons');
      return res.data.data.coupons || [];
    },
  });

  // Save/Update Mutation
  const saveMutation = useMutation({
    mutationFn: async (data: CouponFormData) => {
      const payload = {
        ...data,
        discount: Number(data.discount),
        minOrderValue: data.minOrderValue ? Number(data.minOrderValue) : null,
        maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : null,
        maxUses: data.maxUses ? Number(data.maxUses) : null,
      };

      if (editingCoupon) {
        const res = await api.put(`/coupons/${editingCoupon.id}`, payload);
        return res.data;
      } else {
        const res = await api.post('/coupons', payload);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      toast.success(editingCoupon ? 'Coupon updated' : 'Coupon created');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save coupon');
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/coupons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      toast.success('Coupon deleted');
    },
    onError: () => {
      toast.error('Failed to delete coupon');
    },
  });

  const openAddModal = () => {
    setEditingCoupon(null);
    reset({
      code: '',
      description: '',
      type: 'PERCENTAGE',
      discount: 10,
      minOrderValue: undefined,
      maxDiscount: undefined,
      maxUses: undefined,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: any) => {
    setEditingCoupon(coupon);
    reset({
      code: coupon.code,
      description: coupon.description || '',
      type: coupon.type,
      discount: coupon.discount,
      minOrderValue: coupon.minOrderValue || undefined,
      maxDiscount: coupon.maxDiscount || undefined,
      maxUses: coupon.maxUses || undefined,
      isActive: coupon.isActive,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const onSubmit = (data: CouponFormData) => {
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <img src="/gold-logo.png" className="w-12 h-12 animate-spin mb-4 object-contain" alt="Loading" />
        <p className="text-coffee-500 text-sm">Organizing promo vouchers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-coffee-900 dark:text-cream-50">Discount Coupons</h1>
          <p className="text-coffee-500 dark:text-coffee-400">Offer percentage or flat discount vouchers.</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-forest-500 hover:bg-forest-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon: any) => (
          <div
            key={coupon.id}
            className={`bg-white dark:bg-coffee-950 rounded-2xl border p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group ${
              coupon.isActive ? 'border-forest-500/25' : 'border-coffee-100 dark:border-forest-500/10'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  coupon.isActive 
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' 
                    : 'bg-coffee-50 text-coffee-400 dark:bg-white/5'
                }`}>
                  <Tag className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase font-bold tracking-wider text-coffee-400">Discount</p>
                  <p className="text-xl font-extrabold text-coffee-900 dark:text-cream-100">
                    {coupon.type === 'PERCENTAGE' ? `${coupon.discount}%` : `₹${coupon.discount}`}
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-coffee-900 dark:text-cream-100 text-lg mb-1">{coupon.code}</h3>
              <p className="text-coffee-500 dark:text-coffee-400 text-sm leading-relaxed mb-4">
                {coupon.description || 'No description provided.'}
              </p>
            </div>

            {/* Stats and actions */}
            <div className="pt-4 border-t border-coffee-100 dark:border-forest-500/10 flex items-center justify-between gap-4 mt-auto">
              <div className="text-xs text-coffee-500">
                <p>Used: <strong>{coupon.usedCount} times</strong></p>
                {coupon.maxUses && <p className="mt-0.5">Limit: {coupon.maxUses} max</p>}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(coupon)}
                  className="p-1.5 rounded-lg border border-coffee-100 dark:border-forest-500/10 text-coffee-600 dark:text-cream-300 hover:border-forest-500/30 hover:text-forest-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this coupon permanently?')) {
                      deleteMutation.mutate(coupon.id);
                    }
                  }}
                  className="p-1.5 rounded-lg border border-red-100 dark:border-red-950/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />

          <div className="bg-white dark:bg-coffee-950 rounded-3xl p-6 sm:p-8 max-w-md w-full relative z-10 border border-coffee-100 dark:border-forest-500/10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-4 right-4 text-coffee-400 hover:text-coffee-600">
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display font-bold text-2xl text-coffee-900 dark:text-cream-50 mb-6">
              {editingCoupon ? 'Edit Discount Coupon' : 'Create New Coupon'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Coupon Code (e.g. COFFEE50)"
                placeholder="WELCOME50"
                {...register('code', { required: 'Code is required' })}
                error={errors.code?.message}
              />

              <Input
                label="Voucher Description"
                placeholder="Get 50% off on your first order"
                {...register('description')}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-coffee-600 dark:text-cream-200 mb-1.5 uppercase tracking-wide">Type</label>
                  <select
                    {...register('type', { required: 'Type is required' })}
                    className="w-full bg-[#F5F3E9] dark:bg-white/5 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-forest-500 text-sm text-coffee-900 dark:text-cream-100"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
                <Input
                  label="Discount Value"
                  type="number"
                  {...register('discount', { required: 'Discount is required' })}
                  error={errors.discount?.message}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Input
                    label="Min Order Required"
                    type="number"
                    {...register('minOrderValue')}
                  />
                </div>
                <Input
                  label="Max Uses"
                  type="number"
                  {...register('maxUses')}
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer py-2">
                <input type="checkbox" {...register('isActive')} className="rounded text-forest-500 focus:ring-forest-500 border-coffee-200" />
                <span className="text-sm font-medium text-coffee-700 dark:text-cream-200">Coupon is active</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-coffee-100 dark:border-forest-500/10">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-semibold text-coffee-500 hover:text-coffee-750 transition-colors">
                  Cancel
                </button>
                <Button type="submit" isLoading={saveMutation.isPending} className="bg-forest-500 hover:bg-forest-600 text-white">
                  Save Coupon
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
