import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Edit2, Trash2, Plus, FileText, X, Coffee, Calendar, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/api/axios';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

type BlogFormData = {
  title: string;
  excerpt?: string;
  content: string;
  category: string;
  coverImage?: string;
  isPublished: boolean;
};

export default function AdminBlogs() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BlogFormData>();

  // Fetch Blogs
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: async () => {
      const res = await api.get('/blogs/admin/all');
      return res.data.data.blogs || [];
    },
  });

  // Save/Update Mutation
  const saveMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      if (editingBlog) {
        const res = await api.put(`/blogs/${editingBlog.id}`, data);
        return res.data;
      } else {
        const res = await api.post('/blogs', data);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success(editingBlog ? 'Blog updated' : 'Blog created');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save blog post');
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/blogs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success('Blog deleted');
    },
    onError: () => {
      toast.error('Failed to delete blog');
    },
  });

  const openAddModal = () => {
    setEditingBlog(null);
    reset({
      title: '',
      excerpt: '',
      content: '',
      category: 'Coffee Crafting',
      coverImage: '',
      isPublished: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (blog: any) => {
    setEditingBlog(blog);
    reset({
      title: blog.title,
      excerpt: blog.excerpt || '',
      content: blog.content,
      category: blog.category,
      coverImage: blog.coverImage || '',
      isPublished: blog.isPublished,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
  };

  const onSubmit = (data: BlogFormData) => {
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <img src="/gold-logo.png" className="w-12 h-12 animate-spin mb-4 object-contain" alt="Loading" />
        <p className="text-coffee-500 text-sm">Opening archives...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-coffee-900 dark:text-cream-50">Cafe Blog</h1>
          <p className="text-coffee-500 dark:text-coffee-400">Manage and edit articles and tutorials.</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-forest-500 hover:bg-forest-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog: any) => (
          <div
            key={blog.id}
            className="bg-white dark:bg-coffee-950 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
          >
            <div>
              <div className="aspect-video w-full overflow-hidden bg-coffee-50 relative">
                <img
                  src={blog.coverImage || 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=3840&q=100'}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border ${
                  blog.isPublished
                    ? 'bg-green-500 text-white border-transparent'
                    : 'bg-yellow-500 text-white border-transparent'
                }`}>
                  {blog.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between text-xs text-coffee-400 mb-2 font-medium">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {blog.viewCount} views</span>
                </div>
                <h3 className="font-bold text-coffee-900 dark:text-cream-100 text-lg line-clamp-2 mb-2 group-hover:text-forest-600 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-coffee-500 dark:text-coffee-400 text-sm line-clamp-3 leading-relaxed">
                  {blog.excerpt || 'No summary text.'}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center justify-between gap-4 mt-auto border-t border-coffee-100 dark:border-forest-500/10 pt-4">
              <span className="text-xs text-gold-600 font-semibold">{blog.category}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(blog)}
                  className="p-1.5 rounded-lg border border-coffee-100 dark:border-forest-500/10 text-coffee-600 dark:text-cream-300 hover:border-forest-500/30 hover:text-forest-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this article permanently?')) {
                      deleteMutation.mutate(blog.id);
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

      {/* Blog Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />

          <div className="bg-white dark:bg-coffee-950 rounded-3xl p-6 sm:p-8 max-w-3xl w-full relative z-10 border border-coffee-100 dark:border-forest-500/10 shadow-2xl max-h-[95vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-4 right-4 text-coffee-400 hover:text-coffee-600">
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display font-bold text-2xl text-coffee-900 dark:text-cream-50 mb-6">
              {editingBlog ? 'Edit Blog Article' : 'Write New Article'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Article Title"
                  placeholder="The Art of Coffee Roast Levels"
                  {...register('title', { required: 'Title is required' })}
                  error={errors.title?.message}
                />
                <Input
                  label="Category"
                  placeholder="Coffee Crafting"
                  {...register('category', { required: 'Category is required' })}
                  error={errors.category?.message}
                />
              </div>

              <Input
                label="Excerpt / Brief Summary"
                placeholder="A quick summary for card displays..."
                {...register('excerpt')}
              />

              <Input
                label="Cover Image URL"
                placeholder="https://images.unsplash.com/...?w=3840&q=100"
                {...register('coverImage')}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-coffee-600 dark:text-cream-200 uppercase tracking-wide">Article Content</label>
                <textarea
                  {...register('content', { required: 'Content is required' })}
                  rows={8}
                  className="w-full bg-[#F5F3E9] dark:bg-white/5 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-forest-500 text-sm text-coffee-900 dark:text-cream-100 font-mono"
                  placeholder="Write post content using standard markdown or text..."
                />
                {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer py-2">
                <input type="checkbox" {...register('isPublished')} className="rounded text-forest-500 focus:ring-forest-500 border-coffee-200" />
                <span className="text-sm font-medium text-coffee-700 dark:text-cream-200">Publish immediately</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-coffee-100 dark:border-forest-500/10">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-semibold text-coffee-500 hover:text-coffee-755 transition-colors">
                  Cancel
                </button>
                <Button type="submit" isLoading={saveMutation.isPending} className="bg-forest-500 hover:bg-forest-600 text-white">
                  Save Article
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
