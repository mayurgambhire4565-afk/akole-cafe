import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import api from '@/api/axios';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import PolicyModal from '@/components/ui/PolicyModal';
import { termsContent, privacyContent } from '@/constants/policies';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().optional(),
  otp: z.string().optional(),
  rememberMe: z.boolean().optional(),
  loginMode: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.loginMode === 'password') {
    if (!data.password || data.password.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password must be at least 8 characters',
        path: ['password'],
      });
    }
  } else if (data.loginMode === 'otp') {
    if (!data.otp || !/^\d{6}$/.test(data.otp)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'OTP must be exactly 6 digits',
        path: ['otp'],
      });
    }
  }
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [modalType, setModalType] = useState<'terms' | 'privacy' | null>(null);
  
  const [otpSent, setOtpSent] = useState(false);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<any>(null);

  // States for password creation step
  const [step, setStep] = useState<'login' | 'create-password'>('login');
  const [tempAuth, setTempAuth] = useState<{ user: any; accessToken: string } | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [savePasswordLoading, setSavePasswordLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register, handleSubmit, watch, setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: (location.state as any)?.email || '',
      password: '',
      otp: '',
      loginMode: 'password',
    }
  });

  const emailValue = watch('email');



  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCountdown = () => {
    setCountdown(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    if (!emailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      toast.error('Please enter a valid email address first');
      return;
    }
    setSendOtpLoading(true);
    try {
      const res = await api.post('/auth/login-otp/send', { email: emailValue });
      toast.success(res.data.message || 'OTP sent successfully!');
      setOtpSent(true);
      startCountdown();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setSendOtpLoading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: (data: LoginForm) => api.post('/auth/login', data),
    onSuccess: (res) => {
      const { user, accessToken } = res.data.data;
      login(user, accessToken);
      toast.success(`Welcome back, ${user.name}! ☕`);
      navigate('/');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Login failed');
    },
  });

  const otpMutation = useMutation({
    mutationFn: (data: { email: string; otp: string; rememberMe?: boolean }) => 
      api.post('/auth/login-otp/verify', data),
    onSuccess: (res) => {
      const { user, accessToken } = res.data.data;
      setTempAuth({ user, accessToken });
      setStep('create-password');
      toast.success('Email OTP verified successfully! ☕');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'OTP verification failed');
    },
  });

  const handleGoogleLoginSimulated = async () => {
    try {
      const res = await api.post('/auth/google', { 
        name: 'Google Test User', 
        email: 'googletest@example.com' 
      });
      const { user, accessToken } = res.data.data;
      login(user, accessToken);
      toast.success(`Simulated Google Login as ${user.name}! ☕`);
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Google authentication failed');
    }
  };

  const onSubmit = (data: LoginForm) => {
    if (loginMode === 'password') {
      mutation.mutate(data);
    } else {
      otpMutation.mutate({
        email: data.email,
        otp: data.otp!,
        rememberMe: !!data.rememberMe,
      });
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!tempAuth) return;

    setSavePasswordLoading(true);
    try {
      await api.post(
        '/auth/set-password',
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${tempAuth.accessToken}`,
          },
        }
      );
      toast.success('Password created successfully! ☕');
      login(tempAuth.user, tempAuth.accessToken);
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save password');
    } finally {
      setSavePasswordLoading(false);
    }
  };

  const handleSkipPassword = () => {
    if (!tempAuth) return;
    toast.success(`Welcome back, ${tempAuth.user.name}! ☕`);
    login(tempAuth.user, tempAuth.accessToken);
    navigate('/');
  };

  if (step === 'create-password') {
    return (
      <div>
        <div className="mb-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <h1 className="text-3xl font-display font-bold text-[#1A3324] dark:text-[#F8F4EA] mb-2">
            Create Password
          </h1>
          <p className="text-[#3C2415]/70 dark:text-cream-200/60 text-sm font-light">
            Secure your account with a password for faster sign in next time.
          </p>
        </div>

        <form onSubmit={handleSavePassword} className="space-y-5">
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              label="New Password"
              placeholder="Minimum 6 characters"
              leftIcon={<Lock className="w-4 h-4" />}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3.5 top-[39px] text-gray-400 hover:text-[#D4AF37] transition-colors p-0.5 rounded cursor-pointer"
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div>
            <Input
              id="confirmPassword"
              type={showNewPassword ? 'text' : 'password'}
              label="Confirm Password"
              placeholder="Repeat your password"
              leftIcon={<Lock className="w-4 h-4" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={savePasswordLoading}
              className="w-full btn btn-primary py-3.5 font-bold hover:scale-[1.01] transition-transform text-xs uppercase tracking-wider cursor-pointer"
            >
              {savePasswordLoading ? 'Saving...' : 'Save & Continue'}
            </button>
            
            <button
              type="button"
              onClick={handleSkipPassword}
              className="w-full btn btn-outline py-3.5 font-bold hover:scale-[1.01] transition-transform text-xs uppercase tracking-wider cursor-pointer border-[#3C2415]/20 dark:border-white/10 text-[#3C2415]/70 dark:text-cream-200/70 hover:bg-black/5 dark:hover:bg-white/5"
            >
              Skip & Continue
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-wider uppercase mb-2">
          Welcome Back
        </span>
        <h1 className="text-4xl font-display font-bold text-[#1A3324] dark:text-[#F8F4EA] mb-3">
          Sign In
        </h1>
        <p className="text-[#3C2415]/70 dark:text-cream-200/60 text-base font-light">
          Enter your details below to access your Akole Cafe account.
        </p>
      </div>

      {/* Login Mode Toggle Tabs */}
      <div className="flex border-b border-[#3C2415]/10 dark:border-white/10 mb-6">
        <button
          type="button"
          onClick={() => { setLoginMode('password'); setValue('loginMode', 'password'); }}
          className={`flex-1 pb-3 text-xs font-semibold tracking-wider uppercase border-b-2 transition-colors ${
            loginMode === 'password'
              ? 'border-[#D4AF37] text-[#1A3324] dark:text-[#F8F4EA]'
              : 'border-transparent text-[#3C2415]/50 dark:text-cream-200/50 hover:text-[#3C2415] dark:hover:text-cream-200'
          }`}
        >
          Password Login
        </button>
        <button
          type="button"
          onClick={() => { setLoginMode('otp'); setValue('loginMode', 'otp'); }}
          className={`flex-1 pb-3 text-xs font-semibold tracking-wider uppercase border-b-2 transition-colors ${
            loginMode === 'otp'
              ? 'border-[#D4AF37] text-[#1A3324] dark:text-[#F8F4EA]'
              : 'border-transparent text-[#3C2415]/50 dark:text-cream-200/50 hover:text-[#3C2415] dark:hover:text-cream-200'
          }`}
        >
          OTP Login
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input type="hidden" {...register('loginMode')} />
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="your@email.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
          {loginMode === 'otp' && (
            <button
              type="button"
              disabled={sendOtpLoading || countdown > 0}
              onClick={handleSendOTP}
              className="btn btn-outline py-2.5 px-4 text-xs font-bold uppercase tracking-wider h-[46px] border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer min-w-[110px] flex items-center justify-center shrink-0"
            >
              {sendOtpLoading ? 'Sending...' : countdown > 0 ? `${countdown}s` : otpSent ? 'Resend OTP' : 'Send OTP'}
            </button>
          )}
        </div>

        {loginMode === 'password' ? (
          <div>
            <div className="mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-[#3C2415] dark:text-cream-200">
                Password
              </label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-[13px] text-gray-400 hover:text-[#D4AF37] transition-colors p-0.5 rounded cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex justify-end mt-2">
              <Link
                to="/forgot-password"
                className="text-xs text-[#D4AF37] hover:text-[#c4a02c] font-medium transition-colors no-underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <Input
              id="otp"
              type="text"
              label="OTP Code"
              placeholder="Enter 6-digit OTP"
              leftIcon={<ShieldCheck className="w-4 h-4" />}
              error={errors.otp?.message}
              maxLength={6}
              {...register('otp')}
            />
            {otpSent && (
              <p className="text-xs text-[#3C2415]/60 dark:text-cream-200/60 mt-2 flex items-center justify-between">
                <span>Didn't receive the OTP?</span>
                {countdown > 0 ? (
                  <span className="font-semibold text-[#D4AF37]">Resend in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={sendOtpLoading}
                    className="font-bold text-[#D4AF37] hover:text-[#c5a028] transition-colors cursor-pointer border-none bg-transparent p-0"
                  >
                    Resend OTP
                  </button>
                )}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            className="h-4 w-4 rounded border-[#3C2415]/20 text-[#D4AF37] focus:ring-[#D4AF37] dark:bg-espresso-900 dark:border-white/10"
            {...register('rememberMe')}
          />
          <label htmlFor="rememberMe" className="ml-2 block text-xs text-[#3C2415]/75 dark:text-cream-200/70 select-none">
            Keep me signed in on this device
          </label>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending || otpMutation.isPending}
          className="w-full btn btn-primary py-3.5 font-bold hover:scale-[1.01] transition-transform text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
        >
          {(mutation.isPending || otpMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
          {mutation.isPending || otpMutation.isPending ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      {/* Or Separator */}
      <div className="relative my-6 flex items-center">
        <div className="flex-grow border-t border-[#3C2415]/10 dark:border-white/10"></div>
        <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-[#3C2415]/50 dark:text-cream-200/50">
          Or continue with
        </span>
        <div className="flex-grow border-t border-[#3C2415]/10 dark:border-white/10"></div>
      </div>

      {/* Google Login Button */}
      <div className="w-full flex justify-center mt-4">
        <button
          type="button"
          onClick={handleGoogleLoginSimulated}
          className="w-full bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 text-gray-700 dark:text-cream-200 border border-[#3C2415]/15 dark:border-white/10 backdrop-blur-md rounded-xl py-2.5 px-4 font-sans font-medium text-sm flex items-center justify-center gap-3 transition-colors duration-200 shadow-sm cursor-pointer select-none"
        >
          <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-[#3C2415]/10 dark:border-white/10 text-center">
        <p className="text-[#3C2415]/60 dark:text-cream-200/60 text-sm font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#D4AF37] hover:text-[#c4a02c] font-bold transition-colors no-underline">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Policy Modals */}
      <PolicyModal 
        isOpen={modalType === 'terms'} 
        onClose={() => setModalType(null)} 
        title="Terms of Service"
      >
        {termsContent}
      </PolicyModal>

      <PolicyModal 
        isOpen={modalType === 'privacy'} 
        onClose={() => setModalType(null)} 
        title="Privacy Policy"
      >
        {privacyContent}
      </PolicyModal>
    </div>
  );
}
