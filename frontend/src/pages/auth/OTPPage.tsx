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
      <h1 className="text-3xl font-display font-bold text-cream-50 mb-2">Verify Your Email</h1>
      <p className="text-espresso-400 mb-2">We sent a 6-digit OTP to</p>
      <p className="text-gold-400 font-medium mb-8">{email}</p>

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
            className="w-12 h-14 text-center text-xl font-bold rounded-xl border outline-none transition-all
              bg-espresso-900 text-cream-50 border-espresso-700
              focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
          />
        ))}
      </div>

      {verifyMutation.isPending && (
        <p className="text-gold-400 text-sm mb-4 animate-pulse">Verifying...</p>
      )}

      <div className="space-y-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => resendMutation.mutate()}
          isLoading={resendMutation.isPending}
          leftIcon={<RefreshCw className="w-4 h-4" />}
          className="w-full justify-center text-espresso-400 hover:text-gold-400"
        >
          Resend OTP
        </Button>
        <p className="text-xs text-espresso-500">OTP expires in 10 minutes</p>
      </div>
    </div>
  );
}
