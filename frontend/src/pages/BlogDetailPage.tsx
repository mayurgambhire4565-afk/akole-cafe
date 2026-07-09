import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Calendar, Eye, User } from 'lucide-react';
import api from '@/api/axios';
import type {  Blog  } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const res = await api.get(`/blogs/${slug}`);
      return res.data.data.blog as Blog;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="section container-custom max-w-3xl mx-auto">
        <Skeleton className="h-64 w-full rounded-3xl mb-8" />
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    );
  }

  if (!data) return <div className="section text-center text-espresso-400">Blog not found</div>;

  return (
    <article className="section">
      <div className="container-custom max-w-3xl mx-auto">
        {data.coverImage && (
          <img src={data.coverImage} alt={data.title} className="w-full h-72 object-cover rounded-3xl mb-8" />
        )}
        <div className="mb-6">
          <span className="badge badge-gold mb-3">{data.category}</span>
          <h1 className="text-4xl font-display font-bold text-espresso-900 dark:text-cream-50 mb-4">{data.title}</h1>
          <div className="flex items-center gap-4 text-sm text-espresso-400">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {data.author?.name}
            </div>
            {data.publishedAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(data.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {data.viewCount} views
            </div>
          </div>
        </div>
        <div
          className="prose prose-espresso dark:prose-invert max-w-none text-espresso-700 dark:text-espresso-200 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </div>
    </article>
  );
}
