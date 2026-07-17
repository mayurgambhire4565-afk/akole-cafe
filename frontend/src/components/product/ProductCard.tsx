import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Clock3, Flame, Leaf } from 'lucide-react';
import type { Product } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import { useTranslation } from '@/store/languageStore';
import { cleanSubtitle } from '@/utils/text';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgIdx] = useState(0);
  const { isAuthenticated } = useAuthStore();
  const { setCart, openCart } = useCartStore();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const effectivePrice = product.salePrice ?? product.price;

  const addToCartMutation = useMutation({
    mutationFn: () => api.post('/cart/add', { productId: product.id, quantity: 1 }),
    onSuccess: (res) => {
      setCart(res.data.data.cart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      openCart();
      toast.success(`${product.name} added to cart ☕`);
    },
    onError: () => toast.error('Failed to add to cart'),
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: () => api.post('/wishlist/toggle', { productId: product.id }),
    onSuccess: (res) => {
      setIsWishlisted(res.data.data.wishlisted);
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success(res.data.data.wishlisted ? 'Added to wishlist ❤️' : 'Removed from wishlist');
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      return;
    }
    addToCartMutation.mutate();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    toggleWishlistMutation.mutate();
  };

  let images: string[] = [];
  try {
    if (typeof product.images === 'string') {
      images = JSON.parse(product.images);
    } else if (Array.isArray(product.images)) {
      images = product.images as string[];
    }
  } catch (e) {
    images = [];
  }

  return (
    <motion.div
      className="group glass-card-hover overflow-hidden"
    >
      <Link to={`/products/${product.slug}`} className="block relative">
        {/* Image Area */}
        <div className="relative aspect-[4/3] bg-cream-100 dark:bg-coffee-950/20 overflow-hidden">
          {images.length > 0 ? (
              <img
                src={images[imgIdx]}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=3840&q=100'; }}
              />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-coffee-950">
              <span className="text-6xl">☕</span>
            </div>
          )}
          
          {/* Top Left Badge */}
          {product.isBestseller && (
            <div className="absolute top-3 left-3 bg-[#D4AF37] text-[#3C2415] text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-sm">
              {t('bestseller')}
            </div>
          )}

          {/* Top Right Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105 z-10 text-forest-800 dark:text-cream-200"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-red-500' : 'currentColor'}`} />
          </button>
        </div>

        {/* Info Area */}
        <div className="p-5 flex flex-col justify-between" style={{ minHeight: '160px' }}>
          <div>
            <h3 className="font-display font-semibold text-lg text-[#1A3324] dark:text-cream-50 mb-1.5 leading-tight group-hover:text-[#D4AF37] dark:group-hover:text-[#D4AF37] transition-colors">
              {product.name}
            </h3>
            {product.shortDesc && (
              <p className="text-[#3C2415]/60 dark:text-cream-200/60 text-xs font-light leading-relaxed line-clamp-2 mb-4">
                {cleanSubtitle(product.name, product.shortDesc)}
              </p>
            )}

            <div className="flex flex-wrap gap-2 text-[11px] text-[#3C2415]/70 dark:text-cream-200/70 mb-4">
              <div className="inline-flex items-center gap-1 rounded-full bg-[#F5F3E9]/70 dark:bg-white/10 px-2.5 py-1">
                <Leaf className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>{product.isVeg ? t('veg') : t('nonVeg')}</span>
              </div>
              {product.spiceLevel && (
                <div className="inline-flex items-center gap-1 rounded-full bg-[#1A3324]/8 dark:bg-[#F5F3E9]/10 px-2.5 py-1">
                  <Flame className="w-3.5 h-3.5 text-[#D0443F]" />
                  <span>{product.spiceLevel.replace('-', ' ')}</span>
                </div>
              )}
              {product.prepTime && (
                <div className="inline-flex items-center gap-1 rounded-full bg-[#F5F3E9]/70 dark:bg-white/10 px-2.5 py-1">
                  <Clock3 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{product.prepTime}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-3">
              <span className="font-bold text-base text-[#1A3324] dark:text-cream-100">
                ₹{effectivePrice.toFixed(0)}
              </span>
              {product.reviewCount > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                  <span className="text-xs font-medium text-[#3C2415]/60 dark:text-cream-200/60">{product.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addToCartMutation.isPending}
              className="w-10 h-10 rounded-full bg-[#1A3324] dark:bg-[#D4AF37] hover:bg-[#2C4A36] dark:hover:bg-[#e0c25a] text-white dark:text-[#1A3324] flex items-center justify-center transition-all disabled:opacity-50 shadow-md hover:shadow-lg z-10"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}