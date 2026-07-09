import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import api from '@/api/axios';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import PolicyModal from '@/components/ui/PolicyModal';
import { termsContent, privacyContent } from '@/constants/policies';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [modalType, setModalType] = useState<'terms' | 'privacy' | null>(null);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const { name, email } = userInfo.data;
        
        const res = await api.post('/auth/google', { name, email });
        const { user, accessToken } = res.data.data;
        login(user, accessToken);
        toast.success(`Registered with Google as ${user.name}! ☕`);
        navigate('/');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Google authentication failed');
      }
    },
    onError: () => {
      toast.error('Google Sign Up Failed');
    }
  });

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: RegisterForm) => api.post('/auth/register', {
      name: data.name, email: data.email, password: data.password, phone: data.phone,
    }),
    onSuccess: (_, vars) => {
      toast.success('Account created! OTP has been sent to your email. ☕');
      navigate('/verify-otp', { state: { email: vars.email } });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Registration failed');
    },
  });

  return (
    <div>
      <div className="mb-6">
        <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-wider uppercase mb-2">
          Start Your Journey
        </span>
        <h1 className="text-4xl font-display font-bold text-[#1A3324] dark:text-[#F8F4EA] mb-3">
          Create Account
        </h1>
        <p className="text-[#3C2415]/70 dark:text-cream-200/60 text-base font-light">
          Join Akole Cafe and earn 50 welcome points ✦
        </p>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <Input
          id="name"
          label="Full Name"
          placeholder="Arjun Sharma"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.name?.message}
          {...register('name')}
          className="border-[#3C2415]/10 dark:border-white/10"
        />
        <Input
          id="email"
          type="email"
          label="Email Address"
          placeholder="your@email.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
          className="border-[#3C2415]/10 dark:border-white/10"
        />
        <Input
          id="phone"
          type="tel"
          label="Phone (optional)"
          placeholder="+91 843237067"
          leftIcon={<Phone className="w-4 h-4" />}
          error={errors.phone?.message}
          {...register('phone')}
          className="border-[#3C2415]/10 dark:border-white/10"
        />
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Min. 8 chars with uppercase & number"
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register('password')}
          className="border-[#3C2415]/10 dark:border-white/10"
        />
        <Input
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          label="Confirm Password"
          placeholder="Repeat your password"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
          className="border-[#3C2415]/10 dark:border-white/10"
        />

        <p className="text-xs text-[#3C2415]/65 dark:text-cream-200/50 font-medium">
          By registering, you agree to our{' '}
          <button 
            type="button" 
            onClick={() => setModalType('terms')} 
            className="text-[#1A3324] dark:text-[#D4AF37] font-bold hover:text-[#D4AF37] dark:hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 inline font-sans underline"
          >
            Terms of Service
          </button>{' '}
          and{' '}
          <button 
            type="button" 
            onClick={() => setModalType('privacy')} 
            className="text-[#1A3324] dark:text-[#D4AF37] font-bold hover:text-[#D4AF37] dark:hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 inline font-sans underline"
          >
            Privacy Policy
          </button>
        </p>

        <button 
          type="submit" 
          disabled={mutation.isPending} 
          className="w-full bg-[#3D2015] dark:bg-[#D4AF37] text-white dark:text-[#3D2015] hover:bg-[#2C150D] dark:hover:bg-[#C5A028] py-3.5 rounded-xl font-bold transition-all duration-300 hover:scale-[1.01] shadow-md hover:shadow-lg flex items-center justify-center font-sans tracking-wider text-xs uppercase"
        >
          {mutation.isPending ? 'Creating...' : 'Create Account'}
        </button>
      </form>

      {/* Or Separator */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#3C2415]/10 dark:border-white/10"></div>
        </div>
        <span className="relative bg-[#FAFAFA] dark:bg-[#18181b] px-4 text-xs font-semibold uppercase tracking-wider text-[#3C2415]/50 dark:text-cream-200/50">
          Or continue with
        </span>
      </div>

      {/* Google Sign Up Button */}
      <div className="w-full flex justify-center mt-4">
        <button
          type="button"
          onClick={() => googleLogin()}
          className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg py-2.5 px-4 font-sans font-medium text-sm flex items-center justify-center gap-3 transition-colors duration-200 shadow-sm cursor-pointer"
        >
          <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign up with Google
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-[#3C2415]/10 dark:border-white/10 text-center">
        <p className="text-[#3C2415]/60 dark:text-cream-200/60 text-sm font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-[#D4AF37] hover:text-[#c4a02c] font-bold transition-colors">
            Sign in
          </Link>
        </p>
      </div>

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
