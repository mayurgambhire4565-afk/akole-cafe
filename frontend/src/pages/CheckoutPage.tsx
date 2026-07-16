import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MapPin, CreditCard, Tag } from 'lucide-react';
import api from '@/api/axios';
import { useCartStore } from '@/store/cartStore';
import type { Address } from '@/types';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [selectedUpiApp, setSelectedUpiApp] = useState('');
  const [upiId, setUpiId] = useState('');
  const [upiPhone, setUpiPhone] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [upiTransactionId, setUpiTransactionId] = useState('');
  const [showCardOtpModal, setShowCardOtpModal] = useState(false);
  const [cardOtp, setCardOtp] = useState('');
  const [cardOtpError, setCardOtpError] = useState('');
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
    mutationFn: (variables: { paymentMethod: string; paymentProvider?: string; transactionId?: string }) => 
      api.post('/orders', { 
        addressId: selectedAddress, 
        couponCode: discount > 0 ? couponCode : undefined,
        paymentMethod: variables.paymentMethod,
        paymentProvider: variables.paymentProvider,
        transactionId: variables.transactionId
      }),
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

  const handleConfirmUpiPayment = () => {
    if (!upiTransactionId.trim()) {
      toast.error('Please enter the 12-digit UPI UTR / Transaction Ref No.');
      return;
    }
    if (!/^\d{12}$/.test(upiTransactionId)) {
      toast.error('Transaction ID (UTR) must be exactly 12 digits');
      return;
    }

    setIsProcessingPayment(true);
    const verifyToastId = toast.loading('Verifying transaction with bank...');

    setTimeout(() => {
      toast.dismiss(verifyToastId);
      toast.success('Payment Verified & Received successfully! 🎉');
      setShowUpiModal(false);
      setIsProcessingPayment(false);

      const providerName = selectedUpiApp === 'gpay' ? 'Google Pay' : selectedUpiApp === 'phonepe' ? 'PhonePe' : selectedUpiApp === 'paytm' ? 'Paytm' : 'UPI';
      orderMutation.mutate({
        paymentMethod: 'upi',
        paymentProvider: providerName,
        transactionId: `TXN-${providerName.toUpperCase().replace(/\s+/g, '')}-${upiTransactionId}`
      });
      setUpiTransactionId('');
    }, 2000);
  };

  const handleCancelUpiPayment = () => {
    setShowUpiModal(false);
    setIsProcessingPayment(false);
    setUpiTransactionId('');
    toast.error('Payment cancelled');
  };

  const handleConfirmCardPayment = () => {
    if (!cardOtp.trim()) {
      setCardOtpError('OTP is required');
      return;
    }
    if (!/^\d{6}$/.test(cardOtp)) {
      setCardOtpError('OTP must be exactly 6 digits');
      return;
    }
    if (cardOtp !== '123456') {
      setCardOtpError('Invalid OTP code. For simulation, please use 123456');
      return;
    }

    setCardOtpError('');
    setIsProcessingPayment(true);
    const verifyToastId = toast.loading('Processing card transaction...');
    setShowCardOtpModal(false);

    setTimeout(() => {
      toast.dismiss(verifyToastId);
      toast.success('Card Payment successful! 💳');
      setIsProcessingPayment(false);
      orderMutation.mutate({
        paymentMethod: 'card',
        paymentProvider: 'CARD',
        transactionId: `TXN-CARD-${Date.now().toString().slice(-6)}`
      });
      setCardOtp('');
    }, 2000);
  };

  const handleCancelCardPayment = () => {
    setShowCardOtpModal(false);
    setIsProcessingPayment(false);
    setCardOtp('');
    setCardOtpError('');
    toast.error('Card authentication cancelled');
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (selectedPayment === 'upi') {
      if (!selectedUpiApp) {
        toast.error('Please select a payment app (Google Pay, PhonePe, Paytm, etc.)');
        return;
      }
      if (selectedUpiApp === 'upi_id' && !upiId.trim()) {
        toast.error('Please enter your UPI ID');
        return;
      }
      if (selectedUpiApp !== 'upi_id' && !upiPhone.trim()) {
        toast.error('Please enter your linked phone number');
        return;
      }

      setIsProcessingPayment(true);
      setShowUpiModal(true);

      const upiUrl = `upi://pay?pa=akolecafe@okaxis&pn=Akole%20Cafe&am=${total.toFixed(2)}&cu=INR&tn=Akole%20Cafe%20Order`;
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = upiUrl;
      }
      return;
    }

    if (selectedPayment === 'card') {
      setCardOtp('');
      setCardOtpError('');
      setShowCardOtpModal(true);
      return;
    }

    // Cash on Delivery
    orderMutation.mutate({
      paymentMethod: 'cod'
    });
  };

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

          {/* Payment Method Card */}
          <div className="bg-white dark:bg-[#0F1E15] p-7 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-coffee-900 dark:text-cream-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gold-500" />
              Payment Method
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'cod', label: 'Cash on Delivery', description: 'Pay cash at your door step' },
                { id: 'upi', label: 'UPI / Payment Apps', description: 'Google Pay, PhonePe, Paytm, etc.' },
                { id: 'card', label: 'Credit / Debit Card', description: 'Visa, Mastercard, RuPay' }
              ].map(method => {
                const isSelected = selectedPayment === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedPayment(method.id)}
                    className={`flex flex-col items-start p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-emerald-600 bg-emerald-50/15 dark:bg-emerald-950/10 ring-1 ring-emerald-600/30' 
                        : 'border-coffee-100 dark:border-forest-500/10 bg-[#FDFBF7] dark:bg-coffee-950 hover:border-emerald-600/30'
                    }`}
                  >
                    <span className="font-bold text-coffee-900 dark:text-cream-100 text-sm mb-1">{method.label}</span>
                    <span className="text-[10px] text-coffee-500 dark:text-coffee-400 font-medium leading-relaxed">{method.description}</span>
                  </button>
                );
              })}
            </div>

            {/* UPI details */}
            {selectedPayment === 'upi' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-coffee-50/50 dark:bg-coffee-950/40 rounded-xl space-y-4 border border-coffee-100 dark:border-white/5"
              >
                <p className="text-xs font-bold text-coffee-900 dark:text-cream-100 uppercase tracking-wider">Select UPI App</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'gpay', name: 'Google Pay', logo: '/gpay-logo.svg' },
                    { id: 'phonepe', name: 'PhonePe', logo: '/phonepe-logo.svg' },
                    { id: 'paytm', name: 'Paytm', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg' },
                    { id: 'upi_id', name: 'Any UPI ID', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg' }
                  ].map(app => {
                    const isSelected = selectedUpiApp === app.id;
                    return (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelectedUpiApp(app.id)}
                        className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border text-center transition-all duration-200 ${
                          isSelected 
                            ? 'border-[#D4AF37] bg-white dark:bg-coffee-950 ring-2 ring-[#D4AF37]/35 scale-[1.02] shadow-md' 
                            : 'border-coffee-100 dark:border-forest-500/10 bg-[#FDFBF7] dark:bg-coffee-950/60 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="h-6 w-full flex items-center justify-center">
                          <img 
                            src={app.logo} 
                            className="max-h-full max-w-[85%] object-contain" 
                            alt={app.name} 
                          />
                        </div>
                        <span className="text-[10px] font-bold text-coffee-600 dark:text-cream-300">
                          {app.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {selectedUpiApp === 'upi_id' ? (
                  <div className="space-y-2 pt-2 text-left">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-coffee-600 dark:text-cream-300">Enter UPI ID</label>
                    <input
                      type="text"
                      placeholder="e.g. username@okaxis"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      className="input w-full text-xs font-semibold uppercase tracking-wider border-coffee-100 dark:border-forest-500/10"
                    />
                  </div>
                ) : selectedUpiApp ? (
                  <div className="space-y-2 pt-2 text-left">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-coffee-600 dark:text-cream-300">Enter Phone Number linked to {selectedUpiApp === 'gpay' ? 'Google Pay' : selectedUpiApp === 'phonepe' ? 'PhonePe' : 'Paytm'}</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 9876543210"
                      value={upiPhone}
                      onChange={e => setUpiPhone(e.target.value)}
                      className="input w-full text-xs font-semibold border-coffee-100 dark:border-forest-500/10"
                    />
                  </div>
                ) : null}
              </motion.div>
            )}

            {/* Card details */}
            {selectedPayment === 'card' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-coffee-50/50 dark:bg-coffee-950/40 rounded-xl space-y-4 border border-coffee-100 dark:border-white/5 text-left"
              >
                <p className="text-xs font-bold text-coffee-900 dark:text-cream-100 uppercase tracking-wider mb-2">Card Information</p>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-coffee-600 dark:text-cream-300">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 1234 5678"
                      className="input w-full text-xs border-coffee-100 dark:border-forest-500/10"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-coffee-600 dark:text-cream-300">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="input w-full text-xs border-coffee-100 dark:border-forest-500/10"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-coffee-600 dark:text-cream-300">CVV</label>
                      <input
                        type="password"
                        placeholder="***"
                        className="input w-full text-xs border-coffee-100 dark:border-forest-500/10"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
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
            isLoading={orderMutation.isPending || isProcessingPayment}
            disabled={!selectedAddress}
            leftIcon={<CreditCard className="w-4 h-4" />}
            onClick={handlePlaceOrder}
          >
            {isProcessingPayment 
              ? 'Verifying Payment...' 
              : selectedPayment === 'upi' 
                ? 'Pay & Place Order' 
                : selectedPayment === 'card' 
                  ? 'Pay & Place Order' 
                  : 'Place Order (COD)'
            }
          </Button>
          {!selectedAddress && (
            <p className="text-red-500 dark:text-red-400 text-[10px] font-bold mt-2 text-center">
              Please select a delivery address to complete your order
            </p>
          )}
        </div>
      </div>

      {/* UPI Payment Modal */}
      {showUpiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-white dark:bg-[#0F1E15] border border-coffee-100 dark:border-white/10 rounded-3xl p-6 shadow-2xl text-center space-y-4"
          >
            <div className="flex justify-between items-center border-b border-coffee-50 dark:border-white/5 pb-2">
              <span className="text-sm font-bold text-coffee-900 dark:text-cream-100 uppercase tracking-wider">Scan & Pay (UPI)</span>
              <button 
                type="button"
                onClick={handleCancelUpiPayment}
                className="text-coffee-400 hover:text-coffee-600 dark:hover:text-cream-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-coffee-400 dark:text-coffee-400 font-semibold uppercase tracking-wider">Pay to Akole Cafe</p>
              <p className="text-2xl font-black text-gold-500">₹{total.toFixed(0)}</p>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center bg-white dark:bg-white/5 p-3 rounded-2xl border border-coffee-100 dark:border-white/10 w-fit mx-auto">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  `upi://pay?pa=akolecafe@okaxis&pn=Akole%20Cafe&am=${total.toFixed(2)}&cu=INR&tn=Akole%20Cafe%20Order`
                )}`}
                alt="UPI Payment QR Code"
                className="w-36 h-36 object-contain rounded-lg"
              />
              <p className="text-[10px] text-coffee-500 dark:text-cream-300/80 font-bold uppercase tracking-wider mt-2">
                Scan with any UPI App
              </p>
            </div>

            {/* Mobile Launch Button */}
            {/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && (
              <button
                type="button"
                onClick={() => {
                  window.location.href = `upi://pay?pa=akolecafe@okaxis&pn=Akole%20Cafe&am=${total.toFixed(2)}&cu=INR&tn=Akole%20Cafe%20Order`;
                }}
                className="w-full bg-[#D4AF37] text-white hover:bg-[#C5A028] py-2 rounded-lg font-bold text-xs uppercase tracking-wider"
              >
                Open Installed UPI App
              </button>
            )}

            {/* Transaction ID Input (Required) */}
            <div className="space-y-1 text-left bg-coffee-50/50 dark:bg-coffee-950/45 p-3 rounded-xl border border-coffee-100 dark:border-white/5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wider text-coffee-600 dark:text-cream-300">
                  Enter 12-digit UPI UTR / Ref No.
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const mockUtr = Math.floor(100000000000 + Math.random() * 900000000000).toString();
                    setUpiTransactionId(mockUtr);
                  }}
                  className="text-[9px] font-bold text-[#D4AF37] hover:underline"
                >
                  Autofill Mock ID
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. 123456789012"
                maxLength={12}
                value={upiTransactionId}
                onChange={e => setUpiTransactionId(e.target.value.replace(/\D/g, ''))}
                className="input w-full text-xs font-semibold tracking-widest text-center border-coffee-100 dark:border-forest-500/10 py-1.5"
              />
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmUpiPayment}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors duration-200 shadow-md cursor-pointer"
              >
                Verify Payment & Place Order
              </button>
              <button
                type="button"
                onClick={handleCancelUpiPayment}
                className="w-full bg-red-500/10 hover:bg-red-500/25 text-red-500 dark:text-red-400 font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Card Payment OTP Modal */}
      {showCardOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-white dark:bg-[#0F1E15] border border-coffee-100 dark:border-white/10 rounded-3xl p-6 shadow-2xl text-center space-y-4"
          >
            <div className="flex justify-between items-center border-b border-coffee-50 dark:border-white/5 pb-2">
              <span className="text-sm font-bold text-coffee-900 dark:text-cream-100 uppercase tracking-wider">Card Verification</span>
              <button 
                type="button"
                onClick={handleCancelCardPayment}
                className="text-coffee-400 hover:text-coffee-600 dark:hover:text-cream-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-coffee-500 dark:text-coffee-400 font-semibold leading-relaxed">
                A 6-digit OTP code has been sent to your registered mobile number ending in ****. Please enter it below to authorize this transaction of:
              </p>
              <p className="text-xl font-black text-gold-500 mt-1">₹{total.toFixed(0)}</p>
            </div>

            {/* OTP Input Container */}
            <div className="space-y-1.5 text-left bg-coffee-50/50 dark:bg-coffee-950/45 p-3.5 rounded-xl border border-coffee-100 dark:border-white/5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wider text-coffee-600 dark:text-cream-300">
                  Enter 6-digit OTP
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setCardOtp('123456');
                    setCardOtpError('');
                  }}
                  className="text-[9px] font-bold text-[#D4AF37] hover:underline"
                >
                  Use Mock OTP (123456)
                </button>
              </div>
              <input
                type="text"
                placeholder="******"
                maxLength={6}
                value={cardOtp}
                onChange={e => {
                  setCardOtp(e.target.value.replace(/\D/g, ''));
                  setCardOtpError('');
                }}
                className="input w-full text-sm font-bold tracking-widest text-center border-coffee-100 dark:border-forest-500/10 py-2"
              />
              {cardOtpError && (
                <p className="text-red-500 text-[10px] font-bold mt-1 text-center">
                  {cardOtpError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmCardPayment}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors duration-200 shadow-md cursor-pointer"
              >
                Verify OTP & Place Order
              </button>
              <button
                type="button"
                onClick={handleCancelCardPayment}
                className="w-full bg-red-500/10 hover:bg-red-500/25 text-red-500 dark:text-red-400 font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
