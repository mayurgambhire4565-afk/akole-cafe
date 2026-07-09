import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MapPin, CreditCard, Tag } from 'lucide-react';
import api from '@/api/axios';
import { useCartStore } from '@/store/cartStore';
import type { Address } from '@/types';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();

  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await api.get('/addresses');
      const addrs = res.data.data.addresses as Address[];
      const defaultAddr = addrs.find(a => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr.id);
      return addrs;
    },
  });

  const validateCoupon = useMutation({
    mutationFn: () => api.post('/coupons/validate', { code: couponCode, orderTotal: subtotal }),
    onSuccess: (res) => { setDiscount(res.data.data.discountAmount); toast.success('Coupon applied!'); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Invalid coupon'),
  });

  const orderMutation = useMutation({
    mutationFn: () => api.post('/orders', { addressId: selectedAddress, couponCode: discount > 0 ? couponCode : undefined }),
    onSuccess: (res) => {
      clearCart();
      navigate('/order-success/' + res.data.data.order.id);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Order failed'),
  });

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.product.salePrice ?? item.product.price) * item.quantity, 0);
  const deliveryFee = subtotal > 500 ? 0 : 49;
  const tax = (subtotal - discount) * 0.05;
  const total = subtotal - discount + deliveryFee + tax;

  return (
    <div className="section container-custom min-h-[85vh]">
      <div className="mb-8">
        <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-wider uppercase mb-2">
          Secure checkout
        </span>
        <h1 className="text-4xl font-display font-bold text-coffee-900 dark:text-cream-50">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address Card */}
          <div className="bg-white dark:bg-[#0F1E15] p-7 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-coffee-900 dark:text-cream-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold-500" />
                Delivery Address
              </h2>
              {addresses && addresses.length > 0 && (
                <a 
                  href="/dashboard/addresses" 
                  className="text-xs font-bold text-[#D4AF37] hover:text-[#c5a028] transition-colors"
                >
                  Manage Addresses
                </a>
              )}
            </div>

            {!addresses?.length ? (
              <div className="text-center py-6 border-2 border-dashed border-coffee-100 dark:border-forest-500/10 rounded-xl">
                <p className="text-coffee-500 text-sm mb-4">No saved delivery addresses found.</p>
                <a 
                  href="/dashboard/addresses" 
                  className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Add New Address
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {addresses.map(addr => {
                  const isSelected = selectedAddress === addr.id;
                  return (
                    <label 
                      key={addr.id} 
                      onClick={() => setSelectedAddress(addr.id)}
                      className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-emerald-600 bg-emerald-50/15 dark:bg-emerald-950/10 ring-1 ring-emerald-600/30 shadow-sm' 
                          : 'border-coffee-100 dark:border-forest-500/10 bg-white dark:bg-coffee-950 hover:border-emerald-600/30'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="address" 
                        value={addr.id} 
                        checked={isSelected} 
                        onChange={() => setSelectedAddress(addr.id)} 
                        className="accent-emerald-600 w-4 h-4 mt-1 flex-shrink-0 cursor-pointer" 
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-coffee-900 dark:text-cream-100 text-sm">{addr.name}</p>
                          <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold bg-coffee-50 dark:bg-white/5 text-coffee-600 dark:text-cream-300 rounded uppercase">
                            {addr.label || 'Home'}
                          </span>
                        </div>
                        <p className="text-xs text-coffee-500 dark:text-coffee-400 font-medium mb-1">{addr.phone}</p>
                        <p className="text-xs text-coffee-600 dark:text-cream-200 leading-relaxed">
                          {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Coupon Card */}
          <div className="bg-white dark:bg-[#0F1E15] p-7 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-sm">
            <h2 className="text-lg font-bold text-coffee-900 dark:text-cream-100 flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-gold-500" />
              Apply Coupon
            </h2>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={couponCode} 
                onChange={e => setCouponCode(e.target.value.toUpperCase())} 
                placeholder="ENTER COUPON CODE" 
                className="input flex-1 uppercase font-semibold text-xs tracking-wider border-coffee-100 dark:border-forest-500/10" 
              />
              <Button 
                onClick={() => validateCoupon.mutate()} 
                isLoading={validateCoupon.isPending} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Apply
              </Button>
            </div>
            {discount > 0 && (
              <p className="text-emerald-600 dark:text-emerald-500 text-xs font-bold mt-2">
                ✓ Coupon applied — ₹{discount.toFixed(0)} off
              </p>
            )}
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white dark:bg-[#0F1E15] p-7 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-md h-fit sticky top-24">
          <h2 className="text-lg font-bold text-coffee-900 dark:text-cream-100 mb-5 border-b border-coffee-50 dark:border-white/5 pb-3">
            Order Summary
          </h2>
          
          {/* Items List */}
          <div className="max-h-[220px] overflow-y-auto scrollbar-none space-y-3 mb-5">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-start gap-4">
                <div className="truncate">
                  <p className="text-xs font-bold text-coffee-900 dark:text-cream-100 truncate">{item.product.name}</p>
                  <p className="text-[10px] text-coffee-400 font-semibold">Qty: {item.quantity}</p>
                </div>
                <span className="text-xs font-bold text-coffee-800 dark:text-cream-200">
                  ₹{((item.product.salePrice ?? item.product.price) * item.quantity).toFixed(0)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t border-coffee-50 dark:border-white/5 pt-4 space-y-2.5 text-xs">
            <div className="flex justify-between text-coffee-500 dark:text-coffee-400 font-medium">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-500 font-bold">
                <span>Discount</span>
                <span>-₹{discount.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between text-coffee-500 dark:text-coffee-400 font-medium">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? <span className="text-emerald-600 dark:text-emerald-500 font-bold">FREE</span> : `₹${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-coffee-500 dark:text-coffee-400 font-medium">
              <span>GST (5%)</span>
              <span>₹{tax.toFixed(0)}</span>
            </div>
            
            <div className="flex justify-between font-bold text-sm border-t border-coffee-100 dark:border-white/10 pt-3 text-coffee-900 dark:text-cream-50">
              <span>Total Amount</span>
              <span className="text-gold-500 text-base">₹{total.toFixed(0)}</span>
            </div>
          </div>

          <Button
            className="w-full justify-center mt-6 bg-[#3D2015] dark:bg-[#D4AF37] hover:bg-[#2C150D] dark:hover:bg-[#C5A028] text-white dark:text-[#3D2015] py-3.5 rounded-xl font-bold transition-all duration-300 hover:scale-[1.01] shadow-md uppercase tracking-wider text-xs cursor-pointer"
            isLoading={orderMutation.isPending}
            disabled={!selectedAddress}
            leftIcon={<CreditCard className="w-4 h-4" />}
            onClick={() => orderMutation.mutate()}
          >
            Place Order (COD)
          </Button>
          {!selectedAddress && (
            <p className="text-red-500 dark:text-red-400 text-[10px] font-bold mt-2 text-center">
              Please select a delivery address to complete your order
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
