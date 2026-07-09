import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Edit2, Trash2, Plus, Coffee, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/api/axios';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

type CategoryFormData = {
  name: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
};

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormData>();

  // Fetch Categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await api.get('/products/categories');
      return res.data.data.categories || [];
    },
  });

  // Save/Update Mutation
  const saveMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const payload = {
        ...data,
        sortOrder: Number(data.sortOrder),
        slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      };

      if (editingCategory) {
        const res = await api.put(`/products/categories/${editingCategory.id}`, payload);
        return res.data;
      } else {
        const res = await api.post('/products/categories', payload);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success(editingCategory ? 'Category updated' : 'Category created');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save category');
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category deleted');
    },
    onError: () => {
      toast.error('Failed to delete category (contains products)');
    },
  });

  const openAddModal = () => {
    setEditingCategory(null);
    reset({
      name: '',
      description: '',
      image: '',
      sortOrder: 0,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    reset({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || '',
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const onSubmit = (data: CategoryFormData) => {
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <img src="/gold-logo.png" className="w-12 h-12 animate-spin mb-4 object-contain" alt="Loading" />
        <p className="text-coffee-500 text-sm">Organizing coffee menus...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-coffee-900 dark:text-cream-50">Menu Categories</h1>
          <p className="text-coffee-500 dark:text-coffee-400">Classify your offerings under hot/cold coffee, desserts, and snacks.</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-forest-500 hover:bg-forest-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Grid of categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat: any) => (
          <div
            key={cat.id}
            className="bg-white dark:bg-coffee-950 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              {cat.image && (
                <div className="aspect-video w-full overflow-hidden bg-coffee-50">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-coffee-900 dark:text-cream-100 text-lg">{cat.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-forest-500/10 text-forest-600 dark:text-forest-450 border border-forest-150 tracking-wide uppercase">
                    Order: {cat.sortOrder}
                  </span>
                </div>
                <p className="text-coffee-500 dark:text-coffee-400 text-sm line-clamp-3">
                  {cat.description || 'No description provided.'}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-coffee-100 dark:border-forest-500/10 flex items-center justify-between gap-4 mt-auto">
              <span className={`text-xs font-semibold ${cat.isActive ? 'text-green-600' : 'text-coffee-400'}`}>
                {cat.isActive ? 'Active Category' : 'Inactive'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 rounded-lg border border-coffee-100 dark:border-forest-500/10 text-coffee-600 dark:text-cream-300 hover:border-forest-500/30 hover:text-forest-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this category permanently? This might fail if products are linked.')) {
                      deleteMutation.mutate(cat.id);
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

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />

          <div className="bg-white dark:bg-coffee-950 rounded-3xl p-6 sm:p-8 max-w-md w-full relative z-10 border border-coffee-100 dark:border-forest-500/10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-4 right-4 text-coffee-400 hover:text-coffee-600">
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display font-bold text-2xl text-coffee-900 dark:text-cream-50 mb-6">
              {editingCategory ? 'Edit Menu Category' : 'Add New Category'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Category Name"
                placeholder="Hot Coffee"
                {...register('name', { required: 'Name is required' })}
                error={errors.name?.message}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-coffee-600 dark:text-cream-200 uppercase tracking-wide">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full bg-[#F5F3E9] dark:bg-white/5 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-forest-500 text-sm text-coffee-900 dark:text-cream-100"
                  placeholder="Artisanal freshly brewed single-origin brews."
                />
              </div>

              <Input
                label="Image URL"
                placeholder="https://images.unsplash.com/...?w=3840&q=100"
                {...register('image')}
              />

              <Input
                label="Sort Order"
                type="number"
                defaultValue={0}
                {...register('sortOrder')}
              />

              <label className="flex items-center gap-2.5 cursor-pointer py-2">
                <input type="checkbox" {...register('isActive')} className="rounded text-forest-500 focus:ring-forest-500 border-coffee-200" />
                <span className="text-sm font-medium text-coffee-700 dark:text-cream-200">Category is active</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-coffee-100 dark:border-forest-500/10">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-semibold text-coffee-500 hover:text-coffee-750 transition-colors">
                  Cancel
                </button>
                <Button type="submit" isLoading={saveMutation.isPending} className="bg-forest-500 hover:bg-forest-600 text-white">
                  Save Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
