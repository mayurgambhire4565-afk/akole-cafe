import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ChevronLeft, CreditCard, MapPin, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/api/axios';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

const STEPS = [
  { id: 1, name: 'Cart' },
  { id: 2, name: 'Details' },
  { id: 3, name: 'Payment' },
];

export default function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { cart, setCart } = useCartStore();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State for Details
  const [address, setAddress] = useState({ name: '', phone: '', street: '', city: '', state: '', pincode: '' });
  
  // Form State for Payment
  const [paymentMethod, setPaymentMethod] = useState('card');

  useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await api.get('/cart');
      setCart(res.data.data.cart);
      return res.data.data.cart;
    },
    enabled: isAuthenticated,
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      api.put('/cart/item/' + itemId, { quantity }),
    onSuccess: (res) => { setCart(res.data.data.cart); queryClient.invalidateQueries({ queryKey: ['cart'] }); },
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => api.delete('/cart/item/' + itemId),
    onSuccess: (res) => { setCart(res.data.data.cart); queryClient.invalidateQueries({ queryKey: ['cart'] }); toast.success('Removed'); },
  });

  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      // Simulate order placement
      await new Promise(r => setTimeout(r, 1500));
      return { id: 'ORD-' + Math.floor(Math.random() * 1000000) };
    },
    onSuccess: (data) => {
      toast.success('Order placed successfully!');
      setCart(null);
      navigate(`/order-success/${data.id}`);
    }
  });

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.product.salePrice ?? item.product.price) * item.quantity, 0);
  const deliveryFee = subtotal > 500 ? 0 : 49;
  const tax = subtotal * 0.05; // 5% GST
  const total = subtotal + deliveryFee + tax;

  if (!isAuthenticated) return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F5F3E9]">
      <div className="text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShoppingBag className="w-10 h-10 text-[#D4AF37]" />
        </div>
        <h2 className="text-3xl font-display font-bold text-[#1A3324] mb-4">Please login to view cart</h2>
        <Link to="/login" className="bg-[#1A3324] hover:bg-[#112419] text-white px-8 py-3 rounded-full font-medium inline-block transition-colors">
          Login to Continue
        </Link>
      </div>
    </div>
  );

  if (items.length === 0 && currentStep === 1) return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F5F3E9]">
      <div className="text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShoppingBag className="w-10 h-10 text-[#3C2415]/20" />
        </div>
        <h2 className="text-3xl font-display font-bold text-[#1A3324] mb-4">Your cart is empty</h2>
        <p className="text-[#3C2415]/60 mb-8">Looks like you haven't added any premium coffee yet.</p>
        <Link to="/products" className="bg-[#1A3324] hover:bg-[#112419] text-white px-8 py-3 rounded-full font-medium inline-flex items-center gap-2.5 transition-colors shadow-sm">
          <img src="/gold-logo.png" alt="Akole Cafe Logo Icon" className="w-5 h-5 rounded-full object-cover border border-[#D4AF37] shadow-sm flex-shrink-0" />
          <span>Browse Menu</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F3E9] pt-24 pb-20">
      <div className="container-custom max-w-6xl">
        
        {/* Header & Step Indicator */}
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold text-[#1A3324] mb-10 text-center">Checkout</h1>
          
          <div className="flex items-center justify-center max-w-2xl mx-auto">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    currentStep >= step.id 
                      ? 'bg-[#1A3324] text-[#D4AF37] shadow-lg' 
                      : 'bg-white text-[#3C2415]/40'
                  }`}>
                    {currentStep > step.id ? <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" /> : step.id}
                  </div>
                  <span className={`text-xs font-semibold mt-2 ${currentStep >= step.id ? 'text-[#1A3324]' : 'text-[#3C2415]/40'}`}>
                    {step.name}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`w-24 h-0.5 mx-4 ${currentStep > step.id ? 'bg-[#1A3324]' : 'bg-white'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: CART */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#3C2415]/5">
                    <h2 className="font-display font-bold text-2xl text-[#1A3324] mb-6">Your Items</h2>
                    <div className="space-y-6">
                      {items.map((item, idx) => {
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
                          <div key={item.id} className={`flex gap-6 ${idx !== items.length - 1 ? 'border-b border-[#3C2415]/5 pb-6' : ''}`}>
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-[#F5F3E9] flex-shrink-0">
                              <img src={images?.[0] || 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=3840&q=100'} alt={item.product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-display font-bold text-lg text-[#1A3324]">{item.product.name}</h3>
                                  <p className="text-[#3C2415]/60 text-sm mt-1">Premium Roast</p>
                                </div>
                                <p className="font-bold text-[#1A3324] text-lg">₹{(price * item.quantity).toFixed(0)}</p>
                              </div>
                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center bg-[#F5F3E9] rounded-full p-1">
                                  <button onClick={() => updateMutation.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })} className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-[#1A3324] hover:bg-[#1A3324] hover:text-[#D4AF37] transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                                  <span className="w-10 text-center font-semibold text-[#3C2415] text-sm">{item.quantity}</span>
                                  <button onClick={() => updateMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })} className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-[#1A3324] hover:bg-[#1A3324] hover:text-[#D4AF37] transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                                </div>
                                <button onClick={() => removeMutation.mutate(item.id)} className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
                                  <Trash2 className="w-4 h-4" /> Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: DETAILS */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#3C2415]/5">
                    <div className="flex items-center gap-3 mb-8">
                      <MapPin className="w-6 h-6 text-[#D4AF37]" />
                      <h2 className="font-display font-bold text-2xl text-[#1A3324]">Delivery Details</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#3C2415]">Full Name</label>
                        <input type="text" value={address.name} onChange={e=>setAddress({...address, name: e.target.value})} className="w-full bg-[#F5F3E9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] text-[#1A3324]" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#3C2415]">Phone Number</label>
                        <input type="tel" value={address.phone} onChange={e=>setAddress({...address, phone: e.target.value})} className="w-full bg-[#F5F3E9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] text-[#1A3324]" placeholder="+91 843237067" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-semibold text-[#3C2415]">Street Address</label>
                        <input type="text" value={address.street} onChange={e=>setAddress({...address, street: e.target.value})} className="w-full bg-[#F5F3E9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] text-[#1A3324]" placeholder="123 Coffee Street, Cafe Area" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#3C2415]">City</label>
                        <input type="text" value={address.city} onChange={e=>setAddress({...address, city: e.target.value})} className="w-full bg-[#F5F3E9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] text-[#1A3324]" placeholder="Mumbai" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#3C2415]">PIN Code</label>
                        <input type="text" value={address.pincode} onChange={e=>setAddress({...address, pincode: e.target.value})} className="w-full bg-[#F5F3E9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] text-[#1A3324]" placeholder="400001" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PAYMENT */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#3C2415]/5">
                    <div className="flex items-center gap-3 mb-8">
                      <CreditCard className="w-6 h-6 text-[#D4AF37]" />
                      <h2 className="font-display font-bold text-2xl text-[#1A3324]">Payment Method</h2>
                    </div>

                    <div className="space-y-4">
                      <label className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#1A3324] bg-[#F5F3E9]/50' : 'border-[#F5F3E9] hover:border-[#1A3324]/20'}`}>
                        <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 text-[#D4AF37] focus:ring-[#D4AF37]" />
                        <div className="ml-4 flex-1">
                          <span className="block font-bold text-[#1A3324]">Credit / Debit Card</span>
                          <span className="block text-sm text-[#3C2415]/60 mt-0.5">Pay securely with Stripe/Razorpay</span>
                        </div>
                      </label>
                      <label className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-[#1A3324] bg-[#F5F3E9]/50' : 'border-[#F5F3E9] hover:border-[#1A3324]/20'}`}>
                        <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-5 h-5 text-[#D4AF37] focus:ring-[#D4AF37]" />
                        <div className="ml-4 flex-1">
                          <span className="block font-bold text-[#1A3324]">UPI</span>
                          <span className="block text-sm text-[#3C2415]/60 mt-0.5">GPay, PhonePe, Paytm</span>
                        </div>
                      </label>
                      <label className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#1A3324] bg-[#F5F3E9]/50' : 'border-[#F5F3E9] hover:border-[#1A3324]/20'}`}>
                        <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-5 h-5 text-[#D4AF37] focus:ring-[#D4AF37]" />
                        <div className="ml-4 flex-1">
                          <span className="block font-bold text-[#1A3324]">Cash on Delivery</span>
                          <span className="block text-sm text-[#3C2415]/60 mt-0.5">Pay when you receive your order</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between">
              {currentStep > 1 ? (
                <button onClick={() => setCurrentStep(s => s - 1)} className="flex items-center gap-2 font-semibold text-[#1A3324] hover:text-[#D4AF37] transition-colors">
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
              ) : <div></div>}
            </div>

          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#3C2415]/5 sticky top-28">
              <h2 className="font-display font-bold text-2xl text-[#1A3324] mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-[#3C2415]">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[#3C2415]">
                  <span>Tax (5%)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[#3C2415]">
                  <span>Delivery</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-[#1A3324]' : ''}`}>
                    {deliveryFee === 0 ? 'Complimentary' : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="h-px bg-[#3C2415]/10 my-4" />
                <div className="flex justify-between items-center text-xl">
                  <span className="font-bold text-[#1A3324]">Total</span>
                  <span className="font-bold text-[#D4AF37]">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {currentStep < 3 ? (
                <button 
                  onClick={() => setCurrentStep(s => s + 1)} 
                  className="w-full bg-[#1A3324] hover:bg-[#112419] text-white py-4 rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={() => placeOrderMutation.mutate()} 
                  disabled={placeOrderMutation.isPending}
                  className="w-full bg-[#D4AF37] hover:bg-[#c4a02c] text-[#1A3324] py-4 rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                >
                  {placeOrderMutation.isPending ? 'Processing...' : 'Place Order'} <CheckCircle2 className="w-5 h-5" />
                </button>
              )}

              <p className="text-center text-xs text-[#3C2415]/40 mt-6 flex items-center justify-center gap-1">
                <CreditCard className="w-3.5 h-3.5" /> Secure Checkout
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
