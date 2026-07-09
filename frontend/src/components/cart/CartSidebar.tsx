import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeartLogo from '@/components/ui/HeartLogo';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import toast from 'react-hot-toast';

export default function CartSidebar() {
  const { isOpen, closeCart, cart, setCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await api.get('/cart');
      setCart(res.data.data.cart);
      return res.data.data.cart;
    },
    enabled: isAuthenticated && isOpen,
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      api.put(`/cart/item/${itemId}`, { quantity }),
    onSuccess: (res) => {
      setCart(res.data.data.cart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => api.delete(`/cart/item/${itemId}`),
    onSuccess: (res) => {
      setCart(res.data.data.cart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Item removed');
    },
  });

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.salePrice ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={closeCart}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col"
            style={{ background: '#0d0705', borderLeft: '1px solid rgba(200,164,110,0.15)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gold-500/10">
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-5 h-5 text-gold-500" />
                <h2 className="font-display font-semibold text-cream-50 text-lg">
                  My Cart
                  {items.length > 0 && (
                    <span className="ml-2 text-sm text-gold-500">({items.length})</span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl text-espresso-400 hover:text-gold-400 hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {!isAuthenticated ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <HeartLogo className="w-20 h-20" />
                  <div>
                    <p className="text-cream-200 font-medium mb-1">Please login to view cart</p>
                    <p className="text-espresso-400 text-sm">Sign in to access your shopping cart</p>
                  </div>
                  <Link to="/login" onClick={closeCart} className="btn btn-primary">
                    Login
                  </Link>
                </div>
              ) : isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="skeleton h-20 w-20 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-4 w-3/4" />
                      <div className="skeleton h-3 w-1/2" />
                      <div className="skeleton h-8 w-28 rounded-lg" />
                    </div>
                  </div>
                ))
              ) : items.length === 0 ? (
                <div className="relative flex flex-col items-center justify-center h-full text-center px-6 overflow-hidden">
                  {/* Subtle golden ambient background glow */}
                  <div className="absolute w-[220px] h-[220px] rounded-full bg-[#D4AF37]/5 blur-[60px] pointer-events-none" />

                  {/* Pulsing & Glowing Logo */}
                  <motion.div
                    animate={{
                      scale: [0.95, 1.05, 0.95],
                      filter: [
                        'drop-shadow(0 0 10px rgba(212,175,55,0.1))',
                        'drop-shadow(0 0 20px rgba(212,175,55,0.25))',
                        'drop-shadow(0 0 10px rgba(212,175,55,0.1))'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative z-10 mb-6"
                  >
                    <HeartLogo className="w-24 h-24" />
                  </motion.div>

                  {/* Elegant Text */}
                  <div className="relative z-10 space-y-2 mb-8">
                    <h3 className="font-display text-2xl font-bold text-cream-50 tracking-wide">
                      Your Cart is Empty
                    </h3>
                    <p className="text-espresso-300 text-sm max-w-[280px] mx-auto font-light leading-relaxed">
                      Explore our premium roasts and signature brews to begin your connection.
                    </p>
                  </div>

                  {/* Browse Button */}
                  <Link
                    to="/products"
                    onClick={closeCart}
                    className="btn btn-primary relative z-10 px-8 py-3.5 tracking-wider font-bold text-xs uppercase"
                  >
                    Browse Menu
                  </Link>
                </div>
              ) : (
                items.map((item) => {
                  const price = item.product.salePrice ?? item.product.price;
                  let images: string[] = [];
                  try {
                    if (typeof item.product.images === 'string') {
                      images = JSON.parse(item.product.images);
                    } else if (Array.isArray(item.product.images)) {
                      images = item.product.images as string[];
                    }
                  } catch (e) {
                    images = [];
                  }
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 p-3 rounded-2xl"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,164,110,0.08)' }}
                    >
                      <img
                        src={images?.[0] || 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=3840&q=100'}
                        alt={item.product.name}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${item.product.slug}`}
                          onClick={closeCart}
                          className="text-cream-100 font-medium text-sm hover:text-gold-400 transition-colors line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-gold-500 font-bold mt-1">₹{(price * item.quantity).toFixed(0)}</p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center rounded-xl overflow-hidden border border-espresso-800">
                            <button
                              onClick={() => updateMutation.mutate({ itemId: item.id, quantity: item.quantity - 1 })}
                              className="p-1.5 text-espresso-400 hover:text-gold-400 hover:bg-white/5 transition-all"
                              disabled={updateMutation.isPending}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-cream-100 text-sm font-medium min-w-[28px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                              className="p-1.5 text-espresso-400 hover:text-gold-400 hover:bg-white/5 transition-all"
                              disabled={updateMutation.isPending || item.quantity >= item.product.stock}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeMutation.mutate(item.id)}
                            disabled={removeMutation.isPending}
                            className="p-1.5 text-espresso-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-gold-500/10 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-espresso-400">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-espresso-400">
                    <span>Delivery</span>
                    <span className="text-green-400">{subtotal > 500 ? 'FREE' : '₹49'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-cream-50">
                    <span>Total</span>
                    <span className="text-gold-400">₹{(subtotal + (subtotal > 500 ? 0 : 49)).toFixed(0)}</span>
                  </div>
                  {subtotal <= 500 && (
                    <p className="text-xs text-espresso-400 text-center">
                      Add ₹{(501 - subtotal).toFixed(0)} more for free delivery
                    </p>
                  )}
                </div>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="btn btn-primary w-full justify-center"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="btn btn-outline w-full justify-center btn-sm"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
