import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/api/axios';
import type {  Blog  } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';

export default function BlogsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await api.get('/blogs?limit=9');
      return res.data.data.blogs as Blog[];
    },
  });

  return (
    <div className="section">
      <div className="container-custom">
        <div className="mb-10">
          <h1 className="text-4xl font-display font-bold text-espresso-900 dark:text-cream-50 mb-2">
            Coffee <span className="text-gradient">Stories</span>
          </h1>
          <p className="text-espresso-500 dark:text-espresso-400">Brewing tips, coffee culture, and origin stories</p>
        </div>
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-5 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {(data || []).map((blog, i) => (
              <motion.div key={blog.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Link to={`/blogs/${blog.slug}`} className="card-hover block">
                  <img
                    src={blog.coverImage || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=3840&q=100'}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <span className="badge badge-gold mb-3">{blog.category}</span>
                    <h2 className="font-display font-semibold text-espresso-900 dark:text-cream-100 mb-2 line-clamp-2">{blog.title}</h2>
                    <p className="text-espresso-500 dark:text-espresso-400 text-sm line-clamp-2 mb-4">{blog.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-espresso-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Draft'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        {blog.viewCount}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
