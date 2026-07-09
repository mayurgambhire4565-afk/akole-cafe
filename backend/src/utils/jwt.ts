import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES as jwt.SignOptions['expiresIn'] });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES as jwt.SignOptions['expiresIn'] });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
};

export const generateOTP = (length = 6): string => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

export const generateReferralCode = (name: string): string => {
  const prefix = name.slice(0, 3).toUpperCase();
  const suffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}${suffix}`;
};

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `CK-${timestamp}-${random}`;
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};
