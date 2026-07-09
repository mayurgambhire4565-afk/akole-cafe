import { Tag, Clipboard, Check, Gift, Percent, Truck } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

// Available coupons hardcoded since there is no customer coupon list endpoint
const CLIENT_COUPONS = [
  {
    code: 'WELCOME50',
    description: 'Get 50% discount on your first artisanal coffee order.',
    type: 'PERCENTAGE',
    discount: '50%',
    minOrder: '₹0',
    icon: Percent,
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400',
    borderColor: 'border-emerald-100 dark:border-emerald-900/20'
  },
  {
    code: 'BREW100',
    description: 'Enjoy flat ₹100 discount on orders above ₹800.',
    type: 'FIXED',
    discount: '₹100',
    minOrder: '₹800',
    icon: Gift,
    color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400',
    borderColor: 'border-indigo-100 dark:border-indigo-900/20'
  },
  {
    code: 'FREESHIP',
    description: 'Complimentary shipping on orders above ₹400.',
    type: 'FREE_SHIPPING',
    discount: 'Free Delivery',
    minOrder: '₹400',
    icon: Truck,
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400',
    borderColor: 'border-amber-100 dark:border-amber-900/20'
  }
];

export default function CouponsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-coffee-900 dark:text-cream-50">Active Coupons</h1>
        <p className="text-coffee-500 dark:text-coffee-400">Apply these premium vouchers at checkout to redeem special savings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CLIENT_COUPONS.map((coupon) => {
          const IconComponent = coupon.icon;
          return (
            <div
              key={coupon.code}
              className={`bg-white dark:bg-coffee-950 rounded-3xl border p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group ${coupon.borderColor}`}
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${coupon.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase font-bold tracking-wider text-coffee-400">Discount</p>
                    <p className="text-xl font-extrabold text-coffee-900 dark:text-cream-100">{coupon.discount}</p>
                  </div>
                </div>

                <h3 className="font-bold text-coffee-900 dark:text-cream-100 text-lg mb-1">{coupon.code}</h3>
                <p className="text-coffee-500 dark:text-coffee-400 text-sm leading-relaxed mb-4">
                  {coupon.description}
                </p>
              </div>

              {/* Action and Terms */}
              <div className="pt-4 border-t border-coffee-100 dark:border-forest-500/10 flex items-center justify-between gap-4">
                <span className="text-xs text-coffee-400 font-semibold">Min Order: {coupon.minOrder}</span>
                <button
                  onClick={() => handleCopy(coupon.code)}
                  className="inline-flex items-center justify-center gap-2 bg-coffee-900 hover:bg-forest-650 text-white dark:bg-white/5 dark:hover:bg-white/10 px-4 py-2 rounded-xl font-bold transition-all text-xs"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-3.5 h-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
