import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import type {  Product  } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgIdx] = useState(0);
  const { isAuthenticated } = useAuthStore();
  const { setCart, openCart } = useCartStore();
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group bg-[#FDFBF7] rounded-[24px] shadow-sm hover:shadow-lg border border-[#3C2415]/5 transition-all overflow-hidden"
    >
      <Link to={`/products/${product.slug}`} className="block relative">
        {/* Image Area */}
        <div className="relative aspect-[4/3] bg-cream-100 overflow-hidden">
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
              Bestseller
            </div>
          )}

          {/* Top Right Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105 z-10"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-green-800'}`} />
          </button>
        </div>

        {/* Info Area */}
        <div className="p-5 flex flex-col justify-between" style={{ minHeight: '160px' }}>
          <div>
            <h3 className="font-display font-semibold text-lg text-[#1A3324] mb-1.5 leading-tight group-hover:text-[#D4AF37] transition-colors">
              {product.name}
            </h3>
            {product.shortDesc && (
              <p className="text-[#3C2415]/60 text-xs font-light leading-relaxed line-clamp-2 mb-4">
                {product.shortDesc}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-3">
              <span className="font-bold text-base text-[#1A3324]">
                ₹{effectivePrice.toFixed(0)}
              </span>
              {product.reviewCount > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                  <span className="text-xs font-medium text-[#3C2415]/60">{product.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addToCartMutation.isPending}
              className="w-10 h-10 rounded-full bg-[#1A3324] hover:bg-[#2C4A36] text-white flex items-center justify-center transition-all disabled:opacity-50 shadow-md hover:shadow-lg z-10"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
