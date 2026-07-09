import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, KeyRound, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import api from '@/api/axios';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface EmailForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'reset' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { register: registerEmail, handleSubmit: handleEmailSubmit, formState: { errors: emailErrors } } = useForm<EmailForm>();
  const { register: registerReset, handleSubmit: handleResetSubmit, watch, formState: { errors: resetErrors } } = useForm({
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

  const onResetSubmit = (data: any) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    resetMutation.mutate(data);
  };

  const watchPassword = watch('password');

  if (step === 'success') {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-3xl font-display font-bold text-cream-50 mb-2">Password Reset!</h2>
        <p className="text-espresso-400 mb-8">Your password has been successfully reset. Redirecting to login...</p>
        <Link to="/login" className="btn btn-primary inline-block">Go to Login</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="w-16 h-16 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center mx-auto mb-6">
        {step === 'email' ? <Mail className="w-8 h-8 text-gold-500" /> : <KeyRound className="w-8 h-8 text-gold-500" />}
      </div>

      <h1 className="text-3xl font-display font-bold text-cream-50 mb-2 text-center">
        {step === 'email' ? 'Forgot Password?' : 'Reset Password'}
      </h1>
      <p className="text-espresso-400 text-center mb-8">
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
            {...registerEmail('email', { required: 'Email is required' })}
          />
          <Button type="submit" isLoading={emailMutation.isPending} className="w-full justify-center">
            Send OTP Code
          </Button>
          <div className="text-center">
            <Link to="/login" className="text-espresso-400 text-sm hover:text-gold-400 transition-colors">
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
            {...registerReset('otp', { 
              required: 'OTP is required',
              pattern: { value: /^[0-9]{6}$/, message: 'OTP must be 6 digits' }
            })}
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
            {...registerReset('password', { 
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
              validate: {
                hasUppercase: (v) => /[A-Z]/.test(v) || 'Must contain an uppercase letter',
                hasNumber: (v) => /[0-9]/.test(v) || 'Must contain a number'
              }
            })}
          />

          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            label="Confirm Password"
            placeholder="Repeat your password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={resetErrors.confirmPassword?.message}
            {...registerReset('confirmPassword', { 
              required: 'Confirm password is required',
              validate: (v) => v === watchPassword || 'Passwords do not match'
            })}
          />



          <Button type="submit" isLoading={resetMutation.isPending} className="w-full justify-center">
            Reset Password
          </Button>

          <div className="text-center">
            <button 
              type="button" 
              onClick={() => setStep('email')} 
              className="text-espresso-400 text-sm hover:text-gold-400 transition-colors"
            >
              ← Back to Email Step
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
