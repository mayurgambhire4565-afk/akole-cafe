import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight,
  Package, Coffee, MapPin, Award, Minus, Plus, ArrowRight
} from 'lucide-react';
import api from '@/api/axios';
import type {  Product, Review  } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import ProductCard from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews'>('desc');
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });

  const { isAuthenticated } = useAuthStore();
  const { setCart, openCart } = useCartStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await api.get(`/products/${slug}`);
      return res.data.data as { product: Product; related: Product[] };
    },
    enabled: !!slug,
  });

  const product = data?.product;
  const related = data?.related || [];
  
  let images: string[] = [];
  if (product) {
    try {
      if (typeof product.images === 'string') {
        images = JSON.parse(product.images);
      } else if (Array.isArray(product.images)) {
        images = product.images as string[];
      }
    } catch (e) {
      images = [];
    }
  }

  const addToCartMutation = useMutation({
    mutationFn: () => api.post('/cart/add', { productId: product!.id, quantity: qty }),
    onSuccess: (res) => {
      setCart(res.data.data.cart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      openCart();
      toast.success(`${product?.name} added to cart ☕`);
    },
    onError: () => toast.error('Failed to add to cart'),
  });

  const reviewMutation = useMutation({
    mutationFn: () => api.post('/reviews', { ...reviewForm, productId: product!.id }),
    onSuccess: () => {
      toast.success('Review submitted for approval!');
      setReviewForm({ rating: 5, title: '', comment: '' });
      queryClient.invalidateQueries({ queryKey: ['product', slug] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to submit review'),
  });

  if (isLoading) {
    return (
      <div className="section container-custom">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="w-20 h-20 rounded-xl" />)}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section container-custom text-center">
        <p className="text-espresso-500 dark:text-espresso-400">Product not found</p>
        <Button onClick={() => navigate('/products')} className="mt-4">Browse Products</Button>
      </div>
    );
  }

  const effectivePrice = product.salePrice ?? product.price;

  return (
    <div>
      <div className="section container-custom">
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-cream-100 dark:bg-espresso-900">
              <motion.img
                key={activeImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={images[activeImg] || 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=3840&q=100'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg(p => (p === 0 ? images.length - 1 : p - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center shadow"
                  >
                    <ChevronLeft className="w-5 h-5 text-espresso-700" />
                  </button>
                  <button
                    onClick={() => setActiveImg(p => (p === images.length - 1 ? 0 : p + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center shadow"
                  >
                    <ChevronRight className="w-5 h-5 text-espresso-700" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-none">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activeImg === i ? 'border-gold-500' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-gold-600 dark:text-gold-400 text-sm font-semibold uppercase tracking-widest mb-2">
              {product.category?.name}
            </p>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-espresso-900 dark:text-cream-50 mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-gold-500 fill-gold-500' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-espresso-500">({product.reviewCount} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-espresso-900 dark:text-cream-50">
                ₹{(effectivePrice * qty).toFixed(0)}
              </span>
              {product.salePrice && (
                <span className="text-lg text-espresso-400 line-through">₹{(product.price * qty).toFixed(0)}</span>
              )}
            </div>

            <p className="text-espresso-600 dark:text-espresso-300 leading-relaxed mb-6">
              {product.shortDesc || product.description}
            </p>

            {/* Attributes */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {product.roastLevel && (
                <div className="card p-3 flex items-center gap-2.5">
                  <Coffee className="w-4 h-4 text-gold-500" />
                  <div>
                    <p className="text-xs text-espresso-400">Roast</p>
                    <p className="text-sm font-medium text-espresso-800 dark:text-cream-200">{product.roastLevel}</p>
                  </div>
                </div>
              )}
              {product.origin && (
                <div className="card p-3 flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-gold-500" />
                  <div>
                    <p className="text-xs text-espresso-400">Origin</p>
                    <p className="text-sm font-medium text-espresso-800 dark:text-cream-200">{product.origin}</p>
                  </div>
                </div>
              )}
              {product.weight && (
                <div className="card p-3 flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-gold-500" />
                  <div>
                    <p className="text-xs text-espresso-400">Weight</p>
                    <p className="text-sm font-medium text-espresso-800 dark:text-cream-200">{product.weight}g</p>
                  </div>
                </div>
              )}
              {product.flavor && (
                <div className="card p-3 flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-gold-500" />
                  <div>
                    <p className="text-xs text-espresso-400">Flavor</p>
                    <p className="text-sm font-medium text-espresso-800 dark:text-cream-200">{product.flavor}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Stock */}
            {product.stock <= 10 && product.stock > 0 && (
              <p className="text-amber-500 text-sm mb-4">⚠ Only {product.stock} in stock!</p>
            )}
            {product.stock === 0 && (
              <p className="text-red-400 text-sm mb-4">❌ Out of stock</p>
            )}

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div className="flex gap-3 mb-4">
                <div className="flex items-center rounded-xl border border-espresso-200 dark:border-espresso-700">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="p-3 text-espresso-500 hover:text-gold-500 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-espresso-800 dark:text-cream-100 font-medium w-12 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    className="p-3 text-espresso-500 hover:text-gold-500 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Button
                  variant="primary"
                  className="flex-1 justify-center"
                  isLoading={addToCartMutation.isPending}
                  leftIcon={<ShoppingCart className="w-4 h-4" />}
                  onClick={() => {
                    if (!isAuthenticated) { toast.error('Please login'); return; }
                    addToCartMutation.mutate();
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            )}

            <Button variant="outline" className="w-full justify-center" leftIcon={<Heart className="w-4 h-4" />}>
              Add to Wishlist
            </Button>
          </div>
        </div>

        {/* Tabs: Description & Reviews */}
        <div className="mb-16">
          <div className="flex border-b border-espresso-200 dark:border-espresso-800 mb-8">
            {(['desc', 'reviews'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${
                  activeTab === tab
                    ? 'border-gold-500 text-gold-600 dark:text-gold-400'
                    : 'border-transparent text-espresso-500 hover:text-espresso-700 dark:hover:text-cream-300'
                }`}
              >
                {tab === 'desc' ? 'Description' : `Reviews (${product.reviewCount})`}
              </button>
            ))}
          </div>

          {activeTab === 'desc' ? (
            <div className="prose prose-espresso dark:prose-invert max-w-none text-espresso-600 dark:text-espresso-300 leading-relaxed">
              <p>{product.description}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Review Form */}
              {isAuthenticated && (
                <div className="card p-6">
                  <h3 className="font-semibold text-espresso-900 dark:text-cream-100 mb-4">Write a Review</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="label">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(r => (
                          <button
                            key={r}
                            onClick={() => setReviewForm(f => ({ ...f, rating: r }))}
                          >
                            <Star className={`w-6 h-6 transition-colors ${r <= reviewForm.rating ? 'text-gold-500 fill-gold-500' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Review title"
                      value={reviewForm.title}
                      onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
                      className="input"
                    />
                    <textarea
                      rows={4}
                      placeholder="Share your experience..."
                      value={reviewForm.comment}
                      onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                      className="input resize-none"
                    />
                    <Button
                      onClick={() => reviewMutation.mutate()}
                      isLoading={reviewMutation.isPending}
                    >
                      Submit Review
                    </Button>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              {(product.reviews as Review[] || []).length === 0 ? (
                <p className="text-center text-espresso-400 py-8">No reviews yet. Be the first!</p>
              ) : (
                (product.reviews as Review[] || []).map(review => (
                  <div key={review.id} className="card p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-gold-500 font-semibold">{review.user?.name?.[0]}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-espresso-900 dark:text-cream-100">{review.user?.name}</p>
                          <span className="text-xs text-espresso-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-gold-500 fill-gold-500' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        {review.title && <p className="font-medium text-sm text-espresso-800 dark:text-cream-200 mb-1">{review.title}</p>}
                        <p className="text-sm text-espresso-600 dark:text-espresso-300">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-display font-bold text-espresso-900 dark:text-cream-50 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
