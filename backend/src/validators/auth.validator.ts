import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string()
      .min(3, 'Name must be at least 3 characters')
      .max(50, 'Name must not exceed 50 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
    email: z.string()
      .min(1, 'Email is required')
      .email('Invalid email format'),
    phone: z.string()
      .regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
      .optional()
      .nullable()
      .or(z.literal('')),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[@$!%*?&#]/, 'Password must contain at least one special character (@$!%*?&#)'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string()
      .min(1, 'Email is required')
      .email('Invalid email format'),
    password: z.string()
      .min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
  }),
});

export const verifyOTPSchema = z.object({
  body: z.object({
    email: z.string()
      .min(1, 'Email is required')
      .email('Invalid email format'),
    otp: z.string()
      .length(6, 'OTP must be exactly 6 digits')
      .regex(/^\d+$/, 'OTP must contain only numbers'),
  }),
});

export const emailOnlySchema = z.object({
  body: z.object({
    email: z.string()
      .min(1, 'Email is required')
      .email('Invalid email format'),
  }),
});

export const loginOTPSchema = z.object({
  body: z.object({
    email: z.string()
      .min(1, 'Email is required')
      .email('Invalid email format'),
    otp: z.string()
      .length(6, 'OTP must be exactly 6 digits')
      .regex(/^\d+$/, 'OTP must contain only numbers'),
    rememberMe: z.boolean().optional(),
  }),
});

export const setPasswordSchema = z.object({
  body: z.object({
    password: z.string()
      .min(8, 'Password must be at least 8 characters'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string()
      .min(1, 'Token is required'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters'),
  }),
});
