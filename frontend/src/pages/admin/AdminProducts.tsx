import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Edit2, Trash2, Plus, Search, Filter, Coffee, ToggleLeft, ToggleRight, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/api/axios';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

type ProductFormData = {
  name: string;
  description: string;
  shortDesc?: string;
  price: number;
  salePrice?: number;
  stock: number;
  categoryId: string;
  roastLevel?: string;
  origin?: string;
  flavor?: string;
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  images: string;
};

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>();

  // Fetch Products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data.data.products || [];
    },
  });

  // Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories-list'],
    queryFn: async () => {
      const res = await api.get('/products/categories');
      return res.data.data.categories || [];
    },
  });

  // Save/Update Mutation
  const saveMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      // Parse images string back to array/json
      let imageArray = ['/classic-espresso.png'];
      if (data.images) {
        imageArray = data.images.split(',').map(img => img.trim());
      }

      const payload = {
        ...data,
        price: Number(data.price),
        salePrice: data.salePrice ? Number(data.salePrice) : null,
        stock: Number(data.stock),
        images: imageArray,
      };

      if (editingProduct) {
        const res = await api.put(`/products/${editingProduct.id}`, payload);
        return res.data;
      } else {
        const res = await api.post('/products', payload);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success(editingProduct ? 'Product updated' : 'Product created');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save product');
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted');
    },
    onError: () => {
      toast.error('Failed to delete product');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await api.put(`/products/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Status updated');
    },
  });

  const openAddModal = () => {
    setEditingProduct(null);
    reset({
      name: '',
      description: '',
      shortDesc: '',
      price: 150,
      salePrice: undefined,
      stock: 100,
      categoryId: categories[0]?.id || '',
      roastLevel: 'Medium',
      origin: 'Chikmagalur',
      flavor: 'Vanilla',
      isActive: true,
      isFeatured: false,
      isBestseller: false,
      images: '/classic-espresso.png',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    let imgStr = '';
    try {
      if (typeof product.images === 'string') {
        const parsed = JSON.parse(product.images);
        imgStr = Array.isArray(parsed) ? parsed.join(', ') : product.images;
      } else if (Array.isArray(product.images)) {
        imgStr = product.images.join(', ');
      }
    } catch {
      imgStr = product.images || '';
    }

    reset({
      name: product.name,
      description: product.description,
      shortDesc: product.shortDesc || '',
      price: product.price,
      salePrice: product.salePrice || undefined,
      stock: product.stock,
      categoryId: product.categoryId,
      roastLevel: product.roastLevel || '',
      origin: product.origin || '',
      flavor: product.flavor || '',
      isActive: product.isActive,
      isFeatured: product.isFeatured || false,
      isBestseller: product.isBestseller || false,
      images: imgStr,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const onSubmit = (data: ProductFormData) => {
    saveMutation.mutate(data);
  };

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  if (productsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <img src="/gold-logo.png" className="w-12 h-12 animate-spin mb-4 object-contain" alt="Loading" />
        <p className="text-coffee-500 text-sm">Organizing coffee shelf...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-coffee-900 dark:text-cream-50">Menu Items</h1>
          <p className="text-coffee-500 dark:text-coffee-400">Add, edit, or adjust pricing of cafe items.</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-forest-500 hover:bg-forest-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-white dark:bg-coffee-950 p-4 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-4.5 h-4.5 text-coffee-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-coffee-50 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-forest-500 text-sm text-coffee-900 dark:text-cream-100 placeholder-coffee-400"
          />
        </div>

        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="w-4 h-4 text-coffee-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 bg-coffee-50 dark:bg-white/5 border-none rounded-xl py-2 px-3 focus:ring-2 focus:ring-forest-500 text-sm text-coffee-600 dark:text-cream-200"
          >
            <option value="">All Categories</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-white dark:bg-coffee-950 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-coffee-50/50 dark:bg-white/5 border-b border-coffee-100 dark:border-forest-500/10 text-coffee-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-coffee-50 dark:divide-forest-500/5">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product: any) => {
                let images: string[] = [];
                try {
                  if (typeof product.images === 'string') {
                    images = JSON.parse(product.images);
                  } else if (Array.isArray(product.images)) {
                    images = product.images;
                  }
                } catch {
                  images = [];
                }

                return (
                  <tr key={product.id} className="hover:bg-coffee-50/20 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-coffee-50 dark:bg-white/5 overflow-hidden flex-shrink-0">
                          <img src={images?.[0] || 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=3840&q=100'} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-coffee-900 dark:text-cream-100 leading-tight">{product.name}</p>
                          <p className="text-[10px] text-coffee-400 font-mono mt-0.5">{product.roastLevel || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-coffee-600 dark:text-cream-200">
                      {product.category?.name}
                    </td>
                    <td className="px-6 py-4 font-semibold text-coffee-900 dark:text-cream-100">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4 text-coffee-500">
                      {product.stock} left
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatusMutation.mutate({ id: product.id, isActive: !product.isActive })}
                        className={`text-sm transition-colors ${product.isActive ? 'text-forest-600' : 'text-coffee-400'}`}
                      >
                        {product.isActive ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 rounded-lg border border-coffee-100 dark:border-forest-500/10 text-coffee-600 dark:text-cream-300 hover:border-forest-500/30 hover:text-forest-600 transition-colors"
                        >
                          <Edit2 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this product permanently?')) {
                              deleteMutation.mutate(product.id);
                            }
                          }}
                          className="p-1.5 rounded-lg border border-red-100 dark:border-red-950/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12 text-coffee-400">
                  No matching coffee offerings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />

          <div className="bg-white dark:bg-coffee-950 rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative z-10 border border-coffee-100 dark:border-forest-500/10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-4 right-4 text-coffee-400 hover:text-coffee-600">
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display font-bold text-2xl text-coffee-900 dark:text-cream-50 mb-6">
              {editingProduct ? 'Edit Menu Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Product Name"
                  {...register('name', { required: 'Name is required' })}
                  error={errors.name?.message}
                />
                <div>
                  <label className="block text-xs font-bold text-coffee-600 dark:text-cream-200 mb-1.5 uppercase tracking-wide">Category</label>
                  <select
                    {...register('categoryId', { required: 'Category is required' })}
                    className="w-full bg-[#F5F3E9] dark:bg-white/5 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-forest-500 text-sm text-coffee-900 dark:text-cream-100"
                  >
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Short Description"
                {...register('shortDesc')}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-coffee-600 dark:text-cream-200 uppercase tracking-wide">Full Description</label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={3}
                  className="w-full bg-[#F5F3E9] dark:bg-white/5 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-forest-500 text-sm text-coffee-900 dark:text-cream-100"
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Regular Price (₹)"
                  type="number"
                  {...register('price', { required: 'Price is required' })}
                  error={errors.price?.message}
                />
                <Input
                  label="Sale Price (₹, optional)"
                  type="number"
                  {...register('salePrice')}
                />
                <Input
                  label="Stock Quantity"
                  type="number"
                  {...register('stock', { required: 'Stock required' })}
                  error={errors.stock?.message}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Roast Level (e.g. Medium)"
                  {...register('roastLevel')}
                />
                <Input
                  label="Origin (e.g. Chikmagalur)"
                  {...register('origin')}
                />
                <Input
                  label="Flavor Profile"
                  {...register('flavor')}
                />
              </div>

              <Input
                label="Images (Comma separated URLs)"
                {...register('images')}
              />

              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" {...register('isFeatured')} className="rounded text-forest-500 focus:ring-forest-500 border-coffee-200" />
                  <span className="text-sm font-medium text-coffee-700 dark:text-cream-200">Featured Item</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" {...register('isBestseller')} className="rounded text-forest-500 focus:ring-forest-500 border-coffee-200" />
                  <span className="text-sm font-medium text-coffee-700 dark:text-cream-200">Bestseller</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" {...register('isActive')} className="rounded text-forest-500 focus:ring-forest-500 border-coffee-200" />
                  <span className="text-sm font-medium text-coffee-700 dark:text-cream-200">Is Active</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-coffee-100 dark:border-forest-500/10">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-semibold text-coffee-500 hover:text-coffee-750 transition-colors">
                  Cancel
                </button>
                <Button type="submit" isLoading={saveMutation.isPending} className="bg-forest-500 hover:bg-forest-600 text-white">
                  Save Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
