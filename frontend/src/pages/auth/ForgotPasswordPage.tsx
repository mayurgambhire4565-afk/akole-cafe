import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, KeyRound, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import api from '@/api/axios';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const emailSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

const resetSchema = z.object({
  otp: z.string().regex(/^[0-9]{6}$/, 'OTP must be exactly 6 digits'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[@$!%*?&#]/, 'Must contain at least one special character (@$!%*?&#)'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type EmailForm = z.infer<typeof emailSchema>;
type ResetForm = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'reset' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { register: registerEmail, handleSubmit: handleEmailSubmit, formState: { errors: emailErrors } } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });
  const { register: registerReset, handleSubmit: handleResetSubmit, watch, formState: { errors: resetErrors } } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      otp: '',
      password: '',
      confirmPassword: '',
    }
  });

  const emailMutation = useMutation({
    mutationFn: (data: EmailForm) => api.post('/auth/forgot-password', data),
    onSuccess: () => {
      toast.success('OTP sent successfully');
      setStep('reset');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    },
  });

  const resetMutation = useMutation({
    mutationFn: (data: any) => api.post('/auth/reset-password', { token: data.otp, password: data.password }),
    onSuccess: () => {
      toast.success('Password reset successfully!');
      setStep('success');
      setTimeout(() => navigate('/login'), 3000);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Reset failed. Please check your OTP.');
    },
  });

  const onEmailSubmit = (data: EmailForm) => {
    setEmail(data.email);
    emailMutation.mutate(data);
  };

  const onResetSubmit = (data: ResetForm) => {
    resetMutation.mutate(data);
  };

  if (step === 'success') {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-3xl font-display font-bold text-[#3C2415] dark:text-[#F8F4EA] mb-2">Password Reset!</h2>
        <p className="text-[#3C2415]/70 dark:text-cream-200/60 mb-8">Your password has been successfully reset. Redirecting to login...</p>
        <Link to="/login" className="btn btn-primary inline-block">Go to Login</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="w-16 h-16 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center mx-auto mb-6">
        {step === 'email' ? <Mail className="w-8 h-8 text-gold-500" /> : <KeyRound className="w-8 h-8 text-gold-500" />}
      </div>

      <h1 className="text-3xl font-display font-bold text-[#3C2415] dark:text-[#F8F4EA] mb-2 text-center">
        {step === 'email' ? 'Forgot Password?' : 'Reset Password'}
      </h1>
      <p className="text-[#3C2415]/70 dark:text-cream-200/60 text-center mb-8">
        {step === 'email' 
          ? "Enter your email and we'll send you an OTP code" 
          : `We have sent a 6-digit OTP to ${email}`}
      </p>

      {step === 'email' ? (
        <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-5">
          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="your@email.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={emailErrors.email?.message}
            {...registerEmail('email')}
          />
          <Button type="submit" isLoading={emailMutation.isPending} className="w-full justify-center">
            Send OTP Code
          </Button>
          <div className="text-center">
            <Link to="/login" className="text-[#3C2415]/70 dark:text-cream-200/70 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] text-sm transition-colors no-underline">
              ← Back to Login
            </Link>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-5">
          <Input
            id="otp"
            type="text"
            label="OTP Verification Code"
            placeholder="Enter 6-digit OTP"
            leftIcon={<KeyRound className="w-4 h-4" />}
            error={resetErrors.otp?.message}
            {...registerReset('otp')}
          />

          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            label="New Password"
            placeholder="Min. 8 chars with uppercase & number"
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            error={resetErrors.password?.message}
            {...registerReset('password')}
          />

          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            label="Confirm Password"
            placeholder="Repeat your password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={resetErrors.confirmPassword?.message}
            {...registerReset('confirmPassword')}
          />

          <Button type="submit" isLoading={resetMutation.isPending} className="w-full justify-center">
            Reset Password
          </Button>

          <div className="text-center">
            <button 
              type="button" 
              onClick={() => setStep('email')} 
              className="text-[#3C2415]/70 dark:text-cream-200/70 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] text-sm transition-colors cursor-pointer border-none bg-transparent p-0"
            >
              ← Back to Email Step
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
