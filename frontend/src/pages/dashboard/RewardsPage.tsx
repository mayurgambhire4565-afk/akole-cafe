import { useQuery } from '@tanstack/react-query';
import { Award, Share2, Clipboard, Check, Calendar, Star, Coffee } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/api/axios';

export default function RewardsPage() {
  const [copied, setCopied] = useState(false);

  const { data: rewardsData, isLoading } = useQuery({
    queryKey: ['my-rewards'],
    queryFn: async () => {
      const res = await api.get('/rewards');
      return res.data.data;
    },
  });

  const handleCopyCode = () => {
    if (rewardsData?.referralCode) {
      navigator.clipboard.writeText(rewardsData.referralCode);
      setCopied(true);
      toast.success('Referral code copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <img src="/gold-logo.png" className="w-12 h-12 animate-spin mb-4 object-contain" alt="Loading" />
        <p className="text-coffee-500 text-sm">Counting your stars...</p>
      </div>
    );
  }

  const points = rewardsData?.points || 0;
  const history = rewardsData?.history || [];
  const referralCode = rewardsData?.referralCode || 'BREW50';
  const cashbackValue = points / 10; // 100 points = Rs 10

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-coffee-900 dark:text-cream-50">Loyalty Club</h1>
        <p className="text-coffee-500 dark:text-coffee-400">Earn stars on every sip and redeem them for premium rewards.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Points Display */}
        <div className="bg-forest-500 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg md:col-span-2">
          <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px]">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-forest-100">Your Current Balance</span>
              <p className="text-5xl font-bold font-display mt-2 flex items-baseline gap-2 text-gold-450">
                {points} <span className="text-sm font-sans font-medium text-forest-100">Stars</span>
              </p>
            </div>
            <div className="pt-6 border-t border-white/10 mt-4 flex items-center justify-between text-xs text-forest-100">
              <span>Estimated Value: <strong>₹{cashbackValue.toFixed(2)}</strong></span>
              <span>10 Stars = ₹1.00</span>
            </div>
          </div>
          <Award className="absolute -right-6 -bottom-6 w-36 h-36 text-white/5 rotate-12" />
        </div>

        {/* Share Referral */}
        <div className="bg-white dark:bg-coffee-950 rounded-3xl p-6 border border-coffee-100 dark:border-forest-500/10 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-coffee-400">Refer a Friend</span>
            <p className="text-sm font-semibold text-coffee-900 dark:text-cream-100 mt-2">
              Share the love, get rewarded!
            </p>
            <p className="text-xs text-coffee-500 mt-1">
              Give ₹50 off to your friend. Get 50 stars when they order.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-coffee-100 dark:border-forest-500/10">
            <div className="flex items-center gap-2 bg-coffee-50 dark:bg-white/5 p-2 rounded-xl border border-coffee-100 dark:border-forest-500/5">
              <span className="font-mono font-bold text-coffee-900 dark:text-cream-100 text-sm flex-1 text-center">
                {referralCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-lg bg-white dark:bg-coffee-900 text-coffee-600 dark:text-cream-300 hover:text-forest-650 transition-colors shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Clipboard className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards History */}
      <div className="bg-white dark:bg-coffee-950 rounded-3xl border border-coffee-100 dark:border-forest-500/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-coffee-100 dark:border-forest-500/10 flex items-center gap-2">
          <Star className="w-5 h-5 text-gold-550 fill-gold-550" />
          <h2 className="text-lg font-bold text-coffee-900 dark:text-cream-50 font-display">Stars Ledger</h2>
        </div>

        <div className="p-6">
          {history && history.length > 0 ? (
            <div className="space-y-4">
              {history.map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-coffee-50 dark:border-forest-500/5 hover:border-forest-500/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      log.points > 0 
                        ? 'bg-green-150/15 text-green-600 dark:bg-green-950/20' 
                        : 'bg-red-150/15 text-red-500 dark:bg-red-950/20'
                    }`}>
                      {log.points > 0 ? `+${log.points}` : log.points}
                    </div>
                    <div>
                      <p className="font-semibold text-coffee-900 dark:text-cream-100 text-sm">{log.description}</p>
                      <p className="text-[10px] text-coffee-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(log.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${
                    log.type === 'BONUS' ? 'bg-amber-100 border-amber-200 text-amber-700' :
                    log.type === 'REFERRAL' ? 'bg-indigo-100 border-indigo-200 text-indigo-700' :
                    log.type === 'REDEEMED' ? 'bg-rose-100 border-rose-200 text-rose-700' :
                    'bg-emerald-100 border-emerald-200 text-emerald-700'
                  }`}>
                    {log.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="w-10 h-10 text-coffee-200 mx-auto mb-3" />
              <p className="text-coffee-600 dark:text-cream-205 font-medium">No ledger entries yet</p>
              <p className="text-coffee-400 text-xs mt-1">Start purchasing to collect loyalty rewards.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
