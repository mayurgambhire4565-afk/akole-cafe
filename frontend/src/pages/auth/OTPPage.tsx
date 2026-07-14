import { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Mail, RefreshCw } from 'lucide-react';
import api from '@/api/axios';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

export default function OTPPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as any)?.email || '';
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const values = useRef<string[]>(Array(6).fill(''));

  useEffect(() => {
    if (!email) navigate('/register');
  }, [email, navigate]);

  const verifyMutation = useMutation({
    mutationFn: (otp: string) => api.post('/auth/verify-otp', { email, otp }),
    onSuccess: () => {
      toast.success('Email verified successfully! ☕');
      navigate('/login');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Invalid OTP'),
  });

  const resendMutation = useMutation({
    mutationFn: () => api.post('/auth/resend-otp', { email }),
    onSuccess: () => toast.success('OTP resent to your email'),
    onError: () => toast.error('Failed to resend OTP'),
  });

  const handleChange = (idx: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    values.current[idx] = value.slice(-1);
    
    if (value && idx < 5) inputRefs.current[idx + 1]?.focus();
    
    if (values.current.every(v => v !== '')) {
      verifyMutation.mutate(values.current.join(''));
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values.current[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '');
    pasted.split('').forEach((char, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = char;
        values.current[i] = char;
      }
    });
    if (pasted.length === 6) verifyMutation.mutate(pasted);
  };

  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center mx-auto mb-6">
        <Mail className="w-8 h-8 text-gold-500" />
      </div>
      <h1 className="text-3xl font-display font-bold text-[#3C2415] dark:text-[#F8F4EA] mb-2">Verify Your Email</h1>
      <p className="text-[#3C2415]/70 dark:text-cream-200/60 mb-2">We sent a 6-digit OTP to</p>
      <p className="text-[#D4AF37] font-medium mb-8">{email}</p>

      <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            whileFocus={{ scale: 1.05 }}
            className="w-12 h-12 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-300
              bg-white/90 dark:bg-[#1C110B]/90 text-[#3C2415] dark:text-[#FDFBF7] border-[#3C2415]/20 dark:border-white/10
              focus:border-gold-500 focus:ring-4 focus:ring-gold-500/20 focus:shadow-[0_0_15px_rgba(212,175,55,0.25)] shadow-sm"
          />
        ))}
      </div>

      {verifyMutation.isPending && (
        <p className="text-[#D4AF37] text-sm mb-4 animate-pulse">Verifying...</p>
      )}

      <div className="space-y-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => resendMutation.mutate()}
          isLoading={resendMutation.isPending}
          leftIcon={<RefreshCw className="w-4 h-4" />}
          className="w-full justify-center text-[#3C2415]/60 dark:text-cream-200/60 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] cursor-pointer"
        >
          Resend OTP
        </Button>
        <p className="text-xs text-[#3C2415]/50 dark:text-cream-200/40">OTP expires in 10 minutes</p>
      </div>
    </div>
  );
}
