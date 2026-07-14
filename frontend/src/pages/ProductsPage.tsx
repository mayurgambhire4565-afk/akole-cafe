import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import api from '@/api/axios';
import type {  Product, Category  } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Best Rated' },
  { value: 'reviewCount-desc', label: 'Most Reviewed' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'createdAt-desc';
  const [sortBy, sortOrder] = sort.split('-');

  const setParam = (key: string, value: string) => {
    setSearchParams(prev => {
      if (value) prev.set(key, value);
      else prev.delete(key);
      prev.set('page', '1');
      return prev;
    });
  };

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/products/categories');
      return res.data.data.categories as Category[];
    },
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', { page, search, category, sortBy, sortOrder }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page), limit: '12', sortBy, sortOrder,
        ...(search && { search }),
        ...(category && { category }),
      });
      const res = await api.get(`/products?${params}`);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  const products: Product[] = data?.data?.products || [];
  const pagination = data?.pagination;

  return (
    <div className="bg-[#F5F3E9] dark:bg-[#0B150F] min-h-screen pt-20 pb-24 transition-colors duration-300">
      <div className="container-custom max-w-[1400px]">
        
        {/* Hero Section */}
        <div className="w-full h-48 md:h-64 lg:h-80 rounded-[32px] overflow-hidden relative mb-8 flex items-center justify-center shadow-lg">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=3840&q=100" 
            alt="Coffee Pour" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <h1 className="relative z-20 text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white tracking-wide">
            Our <span className="italic font-light text-[#D4AF37]">Menu</span>
          </h1>
        </div>

        {/* Controls Section */}
        <div className="bg-[#FDFBF7] dark:bg-[#112017] rounded-[24px] p-4 flex flex-col md:flex-row gap-4 mb-8 shadow-sm border border-[#3C2415]/5 dark:border-white/10 items-center justify-between transition-colors duration-300">
          
          <div className="relative w-full md:w-1/2 lg:w-2/3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3C2415]/40 dark:text-cream-200/40" />
            <input
              type="text"
              placeholder="Search our menu..."
              defaultValue={search}
              onChange={(e) => setParam('search', e.target.value)}
              className="w-full bg-[#F5F3E9] dark:bg-white/5 text-[#3C2415] dark:text-cream-50 rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
            />
          </div>

          <div className="flex w-full md:w-auto gap-4">
            <div className="relative flex-1 md:w-48">
              <select
                className="w-full bg-[#F5F3E9] dark:bg-white/5 text-[#3C2415] dark:text-cream-50 rounded-full pl-4 pr-10 py-3 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                value={category}
                onChange={(e) => setParam('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories?.map(c => (
                  <option key={c.id} value={c.slug} className="dark:bg-[#112017] dark:text-cream-50">{c.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3C2415]/40 dark:text-cream-200/40 pointer-events-none" />
            </div>

            <div className="relative flex-1 md:w-48">
              <select
                className="w-full bg-[#F5F3E9] dark:bg-white/5 text-[#3C2415] dark:text-cream-50 rounded-full pl-10 pr-10 py-3 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                value={sort}
                onChange={(e) => setParam('sort', e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value} className="dark:bg-[#112017] dark:text-cream-50">{o.label}</option>
                ))}
              </select>
              <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3C2415]/40 dark:text-cream-200/40 pointer-events-none" />
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3C2415]/40 dark:text-cream-200/40 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Horizontal Category Pills */}
        <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-10 pb-2 px-2 -mx-2 items-center justify-start md:justify-center">
          <button
            onClick={() => setParam('category', '')}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 flex-shrink-0 shadow-sm
              ${!category 
                ? 'bg-[#3C2415] text-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#3D2015]' 
                : 'bg-[#FDFBF7] text-[#3C2415]/60 hover:text-[#3C2415] hover:bg-white dark:bg-[#112017] dark:text-cream-200/60 dark:hover:text-cream-50 dark:hover:bg-white/10 dark:border dark:border-white/5'}`}
          >
            All
          </button>
          {categories?.map(c => (
            <button
              key={c.id}
              onClick={() => setParam('category', c.slug)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 flex-shrink-0 shadow-sm
                ${category === c.slug 
                  ? 'bg-[#3C2415] text-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#3D2015]' 
                  : 'bg-[#FDFBF7] text-[#3C2415]/60 hover:text-[#3C2415] hover:bg-white dark:bg-[#112017] dark:text-cream-200/60 dark:hover:text-cream-50 dark:hover:bg-white/10 dark:border dark:border-white/5'}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Active Filters Display */}
        {(category || search) && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-[#1A3324] dark:text-[#FDFBF7]">
              {category ? categories?.find(c => c.slug === category)?.name : 'Search Results'}
              <span className="text-[#3C2415]/50 dark:text-cream-200/50 text-sm font-sans font-normal ml-3">
                {pagination?.total || 0} items
              </span>
            </h2>
            <button
              onClick={() => {
                setSearchParams(prev => {
                  prev.delete('category');
                  prev.delete('search');
                  prev.set('page', '1');
                  return prev;
                });
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-500 dark:text-red-400 hover:text-red-600 transition-colors bg-red-50/50 dark:bg-red-950/20 px-3 py-1.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16">
                {Array.from({ length: pagination.pages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setParam('page', String(i + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 rounded-full font-semibold transition-all flex items-center justify-center
                      ${page === i + 1 
                        ? 'bg-[#1A3324] dark:bg-[#D4AF37] text-white dark:text-[#3C2415] shadow-md' 
                        : 'bg-white dark:bg-[#112017] text-[#3C2415] dark:text-cream-200 hover:bg-[#F5F3E9] dark:hover:bg-white/10 border border-[#3C2415]/10 dark:border-white/5'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#112017] rounded-3xl border border-[#3C2415]/5 dark:border-white/5 shadow-sm transition-colors duration-300">
            <div className="flex justify-center mb-6">
              <div className="p-5 bg-[#F5F3E9] dark:bg-white/5 rounded-full text-[#D4AF37] shadow-inner">
                <Search className="w-12 h-12 stroke-[1.5]" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#1A3324] dark:text-[#FDFBF7] mb-2">No items found</h3>
            <p className="text-[#3C2415]/60 dark:text-cream-200/60 mb-6 max-w-md mx-auto">
              We couldn't find any items matching your current filters. Try adjusting your search or clearing filters.
            </p>
            <button
              onClick={() => {
                setSearchParams(new URLSearchParams());
              }}
              className="btn btn-primary bg-[#1A3324] dark:bg-[#D4AF37] hover:bg-[#2C4A36] dark:hover:bg-[#C5A028] text-white dark:text-[#3C2415] px-8 py-3 rounded-xl"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
