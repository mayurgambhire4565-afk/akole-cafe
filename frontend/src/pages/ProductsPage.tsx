import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import type { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { MENU_ITEMS, MENU_CATEGORIES } from '@/data/maharashtraMenu';
import { useTranslation } from '@/store/languageStore';

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Best Rated' },
  { value: 'reviewCount-desc', label: 'Most Reviewed' },
];

const DIET_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'veg', label: 'Veg' },
  { value: 'non-veg', label: 'Non-Veg' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, getCategoryTranslation } = useTranslation();

  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search')?.trim() || '';
  const category = searchParams.get('category') || '';
  const diet = searchParams.get('diet') || '';
  const sort = searchParams.get('sort') || 'createdAt-desc';
  const [sortBy, sortOrder] = sort.split('-');

  const setParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      if (value) prev.set(key, value);
      else prev.delete(key);
      prev.set('page', '1');
      return prev;
    });
  };

  const filteredProducts = useMemo(() => {
    return MENU_ITEMS.filter((product) => {
      const matchesSearch = search
        ? product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase())
        : true;

      const matchesCategory = category ? product.category.slug === category : true;
      const matchesDiet = diet
        ? diet === 'veg'
          ? product.isVeg
          : diet === 'non-veg'
            ? product.isVeg === false
            : true
        : true;

      return matchesSearch && matchesCategory && matchesDiet;
    });
  }, [search, category, diet]);

  const sortedProducts = useMemo(() => {
    const productsCopy = [...filteredProducts];
    productsCopy.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        case 'rating':
          return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
        case 'reviewCount':
          return sortOrder === 'asc' ? a.reviewCount - b.reviewCount : b.reviewCount - a.reviewCount;
        case 'createdAt':
        default:
          return sortOrder === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    return productsCopy;
  }, [filteredProducts, sortBy, sortOrder]);

  const vegProducts = useMemo(() => sortedProducts.filter(p => p.isVeg), [sortedProducts]);
  const nonVegProducts = useMemo(() => sortedProducts.filter(p => !p.isVeg), [sortedProducts]);

  const categories = MENU_CATEGORIES;

  return (
    <div className="bg-[#F5F3E9] dark:bg-[#0B150F] min-h-screen pt-20 pb-24 transition-colors duration-300">
      <div className="container-custom max-w-[1400px]">

        <div className="w-full h-48 md:h-64 lg:h-80 rounded-[32px] overflow-hidden relative mb-8 flex items-center justify-center shadow-lg">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=3840&q=100"
            alt="Coffee Pour"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 text-center">
            <p className="mb-3 text-sm tracking-[0.24em] uppercase text-[#D4AF37] font-semibold">
              {t('menuTitle')}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white tracking-wide">
              {t('discoverFlavors')}
            </h1>
          </div>
        </div>

        <div className="bg-[#FDFBF7] dark:bg-[#112017] rounded-[24px] p-4 flex flex-col lg:flex-row gap-4 mb-8 shadow-sm border border-[#3C2415]/5 dark:border-white/10 items-center justify-between transition-colors duration-300">
          <div className="relative w-full lg:w-1/2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3C2415]/40 dark:text-cream-200/40" />
            <input
              type="text"
              placeholder={t('searchPremiumMenu')}
              defaultValue={search}
              onChange={(e) => setParam('search', e.target.value)}
              className="w-full bg-[#F5F3E9] dark:bg-white/5 text-[#3C2415] dark:text-cream-50 rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="relative">
              <select
                className="w-full bg-[#F5F3E9] dark:bg-white/5 text-[#3C2415] dark:text-cream-50 rounded-full pl-4 pr-10 py-3 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                value={category}
                onChange={(e) => setParam('category', e.target.value)}
              >
                <option value="">{t('all')}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug} className="dark:bg-[#112017] dark:text-cream-50">
                    {getCategoryTranslation(c.slug, c.name)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3C2415]/40 dark:text-cream-200/40 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                className="w-full bg-[#F5F3E9] dark:bg-white/5 text-[#3C2415] dark:text-cream-50 rounded-full pl-10 pr-10 py-3 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                value={sort}
                onChange={(e) => setParam('sort', e.target.value)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="dark:bg-[#112017] dark:text-cream-50">
                    {o.label}
                  </option>
                ))}
              </select>
              <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3C2415]/40 dark:text-cream-200/40 pointer-events-none" />
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3C2415]/40 dark:text-cream-200/40 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-6 pb-2 px-2 -mx-2 items-center justify-start md:justify-center">
          {DIET_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setParam('diet', option.value)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 flex-shrink-0 shadow-sm
                ${diet === option.value
                  ? 'bg-[#1A3324] text-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#3D2015]'
                  : 'bg-[#FDFBF7] text-[#3C2415]/60 hover:text-[#3C2415] hover:bg-white dark:bg-[#112017] dark:text-cream-200/60 dark:hover:text-cream-50 dark:hover:bg-white/10 dark:border dark:border-white/5'}`}
            >
              {option.value === '' ? t('all') : option.value === 'veg' ? t('veg') : t('nonVeg')}
            </button>
          ))}
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-10 pb-2 px-2 -mx-2 items-center justify-start md:justify-center">
          <button
            onClick={() => setParam('category', '')}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 flex-shrink-0 shadow-sm
              ${!category
                ? 'bg-[#3C2415] text-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#3D2015]'
                : 'bg-[#FDFBF7] text-[#3C2415]/60 hover:text-[#3C2415] hover:bg-white dark:bg-[#112017] dark:text-cream-200/60 dark:hover:text-cream-50 dark:hover:bg-white/10 dark:border dark:border-white/5'}`}
          >
            {t('all')}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setParam('category', c.slug)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 flex-shrink-0 shadow-sm
                ${category === c.slug
                  ? 'bg-[#3C2415] text-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#3D2015]'
                  : 'bg-[#FDFBF7] text-[#3C2415]/60 hover:text-[#3C2415] hover:bg-white dark:bg-[#112017] dark:text-cream-200/60 dark:hover:text-cream-50 dark:hover:bg-white/10 dark:border dark:border-white/5'}`}
            >
              {getCategoryTranslation(c.slug, c.name)}
            </button>
          ))}
        </div>

        {(category || diet || search) && (
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl font-display font-bold text-[#1A3324] dark:text-[#FDFBF7] mb-2">
                {category
                  ? getCategoryTranslation(category, category)
                  : diet
                    ? diet === 'veg'
                      ? t('vegSpecialities')
                      : t('nonVegSpecialities')
                    : t('searchPlaceholder')}
              </h2>
              <p className="text-sm text-[#3C2415]/60 dark:text-cream-200/60">
                {sortedProducts.length} {t('itemsFound')}
              </p>
            </div>
            <button
              onClick={() => {
                setSearchParams(new URLSearchParams());
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-500 dark:text-red-400 hover:text-red-600 transition-colors bg-red-50/50 dark:bg-red-950/20 px-3 py-1.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" /> {t('clearFilters')}
            </button>
          </div>
        )}

        {sortedProducts.length > 0 ? (
          <div className="flex flex-col gap-12">
            {vegProducts.length > 0 && (
              <div>
                <h2 className="text-3xl font-display font-bold text-[#1A3324] dark:text-emerald-400 mb-8 flex items-center gap-3 border-b border-[#3C2415]/10 dark:border-white/10 pb-3 tracking-wide">
                  <span className="text-2xl">🥦</span> {t('vegSpecialities')}
                </h2>
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {vegProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              </div>
            )}

            {nonVegProducts.length > 0 && (
              <div>
                <h2 className="text-3xl font-display font-bold text-[#8B2218] dark:text-rose-400 mb-8 flex items-center gap-3 border-b border-[#3C2415]/10 dark:border-white/10 pb-3 tracking-wide mt-6">
                  <span className="text-2xl">🍗</span> {t('nonVegSpecialities')}
                </h2>
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {nonVegProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#112017] rounded-3xl border border-[#3C2415]/5 dark:border-white/5 shadow-sm transition-colors duration-300">
            <div className="flex justify-center mb-6">
              <div className="p-5 bg-[#F5F3E9] dark:bg-white/5 rounded-full text-[#D4AF37] shadow-inner">
                <Search className="w-12 h-12 stroke-[1.5]" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#1A3324] dark:text-[#FDFBF7] mb-2">{t('noItemsFound')}</h3>
            <p className="text-[#3C2415]/60 dark:text-cream-200/60 mb-6 max-w-md mx-auto">
              {language === 'en' 
                ? "We couldn't find any items matching your current filters. Try adjusting your search or clearing filters."
                : "आम्हाला तुमच्या शोध आणि फिल्टरशी जुळणारे कोणतेही पदार्थ आढळले नाहीत. कृपया फिल्टर बदला."}
            </p>
            <button
              onClick={() => {
                setSearchParams(new URLSearchParams());
              }}
              className="btn btn-primary bg-[#1A3324] dark:bg-[#D4AF37] hover:bg-[#2C4A36] dark:hover:bg-[#C5A028] text-white dark:text-[#3C2415] px-8 py-3 rounded-xl"
            >
              {t('resetMenu')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
