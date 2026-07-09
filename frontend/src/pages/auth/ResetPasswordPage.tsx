import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import api from '@/api/axios';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type Form = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: ({ password }: Form) => api.post('/auth/reset-password', { token, password }),
    onSuccess: () => {
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Reset failed'),
  });

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-400">Invalid reset link. Please request a new one.</p>
        <Link to="/forgot-password" className="btn btn-primary mt-4">Request Reset</Link>
      </div>
    );
  }

  if (mutation.isSuccess) {
    return (
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h2 className="text-2xl font-display font-bold text-cream-50 mb-2">Password Reset!</h2>
        <p className="text-espresso-400 mb-6">Your password has been reset. Redirecting to login...</p>
        <Link to="/login" className="btn btn-primary">Go to Login</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-cream-50 mb-2">Reset Password</h1>
      <p className="text-espresso-400 mb-8">Create a new secure password for your account</p>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
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
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          label="Confirm Password"
          placeholder="Repeat your password"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button type="submit" isLoading={mutation.isPending} className="w-full justify-center">
          Reset Password
        </Button>
      </form>
    </div>
  );
}
