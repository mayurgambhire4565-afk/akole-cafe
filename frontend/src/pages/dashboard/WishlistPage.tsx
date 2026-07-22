import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, Coffee, Star, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import api from '@/api/axios';
import { useCartStore } from '@/store/cartStore';
import { Skeleton } from '@/components/ui/Skeleton';
import { cleanSubtitle } from '@/utils/text';

export default function WishlistPage() {
  const queryClient = useQueryClient();
  const { setCart } = useCartStore();

  const { data: wishlistItems, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await api.get('/wishlist');
      return res.data.data.wishlist || [];
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.post('/wishlist/toggle', { productId });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success(data.message || 'Removed from wishlist');
    },
    onError: () => {
      toast.error('Failed to remove item');
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.post('/cart/add', { productId, quantity: 1 });
      return res.data.data.cart;
    },
    onSuccess: (updatedCart) => {
      setCart(updatedCart);
      toast.success('Added to cart');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 14 } }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-coffee-900/20 p-4 rounded-3xl border border-coffee-100 dark:border-gold-500/10 space-y-4">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="pt-4 border-t border-coffee-100 dark:border-gold-500/10 flex justify-between items-center">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-10 w-28 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-8"
    >
      <div className="mb-6">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/20 mb-2">
          ✦ FAVOURITES
        </span>
        <h1 className="text-3xl font-display font-bold text-coffee-950 dark:text-cream-50">My Wishlist</h1>
        <p className="text-coffee-500 dark:text-coffee-400 text-sm">Your curated collection of artisanal brews and premium treats.</p>
      </div>

      <AnimatePresence mode="popLayout">
        {wishlistItems && wishlistItems.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {wishlistItems.map((item: any) => {
              const product = item.product;
              if (!product) return null;

              const price = product.salePrice ?? product.price;
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
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="glass-card-hover flex flex-col justify-between group relative"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => removeMutation.mutate(product.id)}
                    disabled={removeMutation.isPending}
                    className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-coffee-950/80 backdrop-blur-sm flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500 dark:hover:bg-red-600 shadow-sm transition-all duration-200 transform active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link to={`/products/${product.slug}`} className="block overflow-hidden relative aspect-square bg-coffee-50 dark:bg-coffee-950">
                    <img
                      src={images?.[0] || 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=3840&q=100'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/15 uppercase tracking-wider">
                          {product.category?.name || 'Coffee'}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-coffee-600 dark:text-cream-200 bg-coffee-50/50 dark:bg-coffee-950/40 px-2 py-0.5 rounded-lg border border-coffee-100 dark:border-gold-500/5">
                          <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                          <span>{product.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <Link to={`/products/${product.slug}`}>
                        <h3 className="font-display font-bold text-lg text-coffee-950 dark:text-cream-100 group-hover:text-forest-600 dark:group-hover:text-gold-400 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-coffee-500 dark:text-coffee-400 text-xs mt-1.5 leading-relaxed line-clamp-2">
                        {cleanSubtitle(product.name, product.shortDesc || product.description)}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4 pt-4 border-t border-coffee-100 dark:border-gold-500/10">
                      <div>
                        {product.salePrice ? (
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-bold text-coffee-950 dark:text-cream-50 text-lg">₹{product.salePrice.toFixed(2)}</span>
                            <span className="text-xs text-coffee-400 line-through">₹{product.price.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-coffee-950 dark:text-cream-50 text-lg">₹{product.price.toFixed(2)}</span>
                        )}
                      </div>

                      <button
                        onClick={() => addToCartMutation.mutate(product.id)}
                        disabled={addToCartMutation.isPending}
                        className="bg-gradient-to-r from-forest-500 to-forest-600 hover:from-forest-600 hover:to-forest-700 text-white rounded-xl px-4 py-2.5 flex items-center gap-1.5 text-xs font-bold shadow-sm hover:shadow transition-all duration-300 transform active:scale-98"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            variants={itemVariants}
            className="text-center py-16 px-6 bg-white dark:bg-coffee-900/40 dark:backdrop-blur-md rounded-3xl border border-dashed border-coffee-200 dark:border-gold-500/20 shadow-sm max-w-xl mx-auto"
          >
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-100 dark:border-rose-900/30 relative">
              <Heart className="w-10 h-10 text-rose-500 animate-bounce-subtle fill-rose-500/20" />
              <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-gold-500 border-2 border-white dark:border-coffee-900"></div>
            </div>
            
            <h3 className="text-2xl font-display font-bold text-coffee-950 dark:text-cream-50 mb-3">Your wishlist is empty</h3>
            <p className="text-coffee-500 dark:text-coffee-400 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
              Curate your dream menu! Save your favorite house blends, gourmet sandwich melts, and desserts to order them later.
            </p>
            
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-forest-500 to-forest-600 hover:from-forest-600 hover:to-forest-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <img src="/gold-logo.png" alt="Akole Cafe Logo Icon" className="w-6 h-6 rounded-full object-cover border border-[#D4AF37] shadow-sm flex-shrink-0" />
              <span>Explore Our Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
