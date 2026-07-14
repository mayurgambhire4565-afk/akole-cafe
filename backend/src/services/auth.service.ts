import bcrypt from 'bcrypt';
import crypto from 'crypto';
import prisma from '../database/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, generateOTP, generateReferralCode } from '../utils/jwt';
import { sendWelcomeEmail, sendOTPEmail, sendPasswordResetEmail } from '../utils/email';
import { env } from '../config/env';

const SALT_ROUNDS = 12;

export const registerUser = async (data: { name: string; email: string; password: string; phone?: string }) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error('Email already exists. You already have an account.');

  // Convert empty phone to null to prevent SQLite unique constraint violation, and check if phone is already registered
  const formattedPhone = data.phone && data.phone.trim() !== '' ? data.phone.trim() : null;
  if (formattedPhone) {
    const existingPhone = await prisma.user.findUnique({ where: { phone: formattedPhone } });
    if (existingPhone) throw new Error('Phone number already registered');
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  const referralCode = generateReferralCode(data.name);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: formattedPhone,
      isVerified: false,
      otp,
      otpExpiresAt,
      referralCode,
      cart: { create: {} }, // Create cart automatically
    },
    select: { id: true, name: true, email: true, role: true, referralCode: true },
  });


  sendOTPEmail(data.email, data.name, otp).catch((err) => {
    console.error('[EMAIL WARNING] Failed to send OTP email during registration:', err);
  });

  return { user, message: 'Registration successful! Please verify your email with the OTP sent.' };
};

export const verifyOTP = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');
  if (user.isVerified) throw new Error('Email already verified');
  if (!user.otp || !user.otpExpiresAt) throw new Error('OTP not found. Please request a new one.');
  if (new Date() > user.otpExpiresAt) throw new Error('OTP has expired. Please request a new one.');
  if (user.otp !== otp) throw new Error('Invalid OTP');
  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true, otp: null, otpExpiresAt: null },
  });
  sendWelcomeEmail(email, user.name).catch((err) => {
    console.error('[EMAIL WARNING] Failed to send welcome email:', err);
  });
  return { message: 'Email verified successfully' };
};
export const resendOTP = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');
  if (user.isVerified) throw new Error('Email already verified');
  if (user.otpExpiresAt) {
    const timeSinceLastOTP = Date.now() - (user.otpExpiresAt.getTime() - 10 * 60 * 1000);
    if (timeSinceLastOTP < 60000) {
      throw new Error(`Please wait ${Math.ceil((60000 - timeSinceLastOTP)/1000)}s before requesting a new OTP`);
    }
  }

  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({ where: { id: user.id }, data: { otp, otpExpiresAt } });
  sendOTPEmail(email, user.name, otp).catch((err) => {
    console.error('[EMAIL WARNING] Failed to send OTP email during resend:', err);
  });
  return { message: 'OTP resent successfully' };
};

export const loginUser = async (email: string, password: string, rememberMe = false) => {
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('Account does not exist. Please sign up first.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password.');
  }

  if (!user.isActive) throw new Error('Account has been deactivated');

  // Auto-verify legacy accounts that try to login, since we removed OTP flow
  if (!user.isVerified) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true }
    });
  }

  const tokenPayload = { id: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Hash and store refresh token
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: hashedRefreshToken } });

  const userData = {
    id: user.id, name: user.name, email: user.email, role: user.role,
    avatar: user.avatar, loyaltyPoints: user.loyaltyPoints, isVerified: user.isVerified,
  };

  return { user: userData, accessToken, refreshToken, rememberMe };
};

export const sendLoginOTP = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('Account does not exist. Please sign up first.');
  }

  if (!user.isActive) throw new Error('Account has been deactivated');

  if (user.otpExpiresAt) {
    const timeSinceLastOTP = Date.now() - (user.otpExpiresAt.getTime() - 10 * 60 * 1000);
    if (timeSinceLastOTP < 60000) {
      throw new Error(`Please wait ${Math.ceil((60000 - timeSinceLastOTP)/1000)}s before requesting a new OTP`);
    }
  }

  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: { otp, otpExpiresAt },
  });

  sendOTPEmail(email, user.name, otp).catch((err) => {
    console.error('[EMAIL WARNING] Failed to send OTP email for login:', err);
  });

  // Return the OTP in development environment so user can use it easily without functional email setup.
  return {
    message: 'OTP sent successfully',
    otp: env.NODE_ENV === 'development' ? otp : undefined
  };
};

export const loginWithOTP = async (email: string, otp: string, rememberMe = false) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error('User not found. Please request an OTP first.');
  if (!user.isActive) throw new Error('Account has been deactivated');
  if (!user.otp || !user.otpExpiresAt) throw new Error('No OTP requested. Please request a new one.');
  if (new Date() > user.otpExpiresAt) throw new Error('OTP has expired. Please request a new one.');
  if (user.otp !== otp) throw new Error('Invalid OTP');

  // Clear OTP and verify user if not already verified
  await prisma.user.update({
    where: { id: user.id },
    data: { otp: null, otpExpiresAt: null, isVerified: true },
  });

  const tokenPayload = { id: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Hash and store refresh token
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: hashedRefreshToken } });

  const userData = {
    id: user.id, name: user.name, email: user.email, role: user.role,
    avatar: user.avatar, loyaltyPoints: user.loyaltyPoints, isVerified: true,
  };

  return { user: userData, accessToken, refreshToken, rememberMe };
};

export const refreshTokens = async (token: string) => {
  const payload = verifyRefreshToken(token);
  const user = await prisma.user.findUnique({ where: { id: payload.id } });

  if (!user || !user.refreshToken) throw new Error('Invalid refresh token');

  const isValid = await bcrypt.compare(token, user.refreshToken);
  if (!isValid) throw new Error('Invalid refresh token');

  const tokenPayload = { id: user.id, email: user.email, role: user.role };
  const newAccessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = generateRefreshToken(tokenPayload);

  const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: hashedRefreshToken } });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (userId: string) => {
  await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { message: 'If your email is registered, you will receive an OTP.' };

  if (user.passwordResetExpires) {
    const timeSinceLastOTP = Date.now() - (user.passwordResetExpires.getTime() - 10 * 60 * 1000);
    if (timeSinceLastOTP < 60000) {
      return { message: 'If your email is registered, you will receive an OTP.' };
    }
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken: otp, passwordResetExpires: expiresAt },
  });

  sendOTPEmail(email, user.name, otp).catch((err) => {
    console.error('[EMAIL WARNING] Failed to send OTP email for password reset:', err);
  });

  return {
    message: 'If your email is registered, you will receive an OTP.'
  };
};

export const resetPassword = async (otp: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: otp,
      passwordResetExpires: { gt: new Date() },
    },
  });

  if (!user) throw new Error('Invalid or expired OTP');

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, passwordResetToken: null, passwordResetExpires: null, refreshToken: null },
  });

  return { message: 'Password reset successfully' };
};

export const setPassword = async (userId: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  if (!user.isActive) throw new Error('Account has been deactivated');

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { message: 'Password set successfully' };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, name: true, email: true, phone: true, role: true,
      avatar: true, loyaltyPoints: true, isVerified: true, isActive: true,
      referralCode: true, totalOrders: true, totalSpent: true, createdAt: true,
    },
  });
  if (!user) throw new Error('User not found');
  return user;
};

export const googleLoginUser = async (data: { name: string; email: string }) => {
  let user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user) {
    // Create new user for google registration
    const randomPassword = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, SALT_ROUNDS);
    const referralCode = generateReferralCode(data.name);

    user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        isVerified: true, // Google accounts are pre-verified
        isActive: true,
        referralCode,
        cart: { create: {} }, // Create cart automatically
      },
    });


  }

  if (!user.isActive) throw new Error('Account has been deactivated');

  const tokenPayload = { id: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Hash and store refresh token
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: hashedRefreshToken } });

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    loyaltyPoints: user.loyaltyPoints,
    isVerified: user.isVerified,
    isActive: user.isActive,
    totalOrders: user.totalOrders,
    totalSpent: user.totalSpent,
    createdAt: user.createdAt.toISOString(),
  };

  return { user: userData, accessToken, refreshToken };
};

export const facebookLoginUser = async (data: { name: string; email: string }) => {
  let user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user) {
    // Create new user for facebook registration
    const randomPassword = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, SALT_ROUNDS);
    const referralCode = generateReferralCode(data.name);

    user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        isVerified: true, // Facebook accounts are pre-verified
        isActive: true,
        referralCode,
        cart: { create: {} }, // Create cart automatically
      },
    });


  }

  if (!user.isActive) throw new Error('Account has been deactivated');

  const tokenPayload = { id: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Hash and store refresh token
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: hashedRefreshToken } });

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    loyaltyPoints: user.loyaltyPoints,
    isVerified: user.isVerified,
    isActive: user.isActive,
    totalOrders: user.totalOrders,
    totalSpent: user.totalSpent,
    createdAt: user.createdAt.toISOString(),
  };

  return { user: userData, accessToken, refreshToken };
};
