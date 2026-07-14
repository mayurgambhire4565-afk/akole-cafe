import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import * as authService from '../services/auth.service';
import { env } from '../config/env';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import prisma from '../database/prisma';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const REFRESH_TOKEN_COOKIE = 'refreshToken';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.IS_PROD,
  sameSite: 'strict' as const,
  path: '/',
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    sendError(res, 'Name, email, and password are required', 400);
    return;
  }
  const result = await authService.registerUser({ name, email, password, phone });
  sendSuccess(res, result, 'Registration successful. Please verify your email.', 201);
});

export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) { sendError(res, 'Email and OTP are required', 400); return; }
  const result = await authService.verifyOTP(email, otp);
  sendSuccess(res, result, 'Email verified successfully');
});

export const resendOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) { sendError(res, 'Email is required', 400); return; }
  const result = await authService.resendOTP(email);
  sendSuccess(res, result, 'OTP resent');
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body;
  if (!email || !password) { sendError(res, 'Email and password are required', 400); return; }

  const result = await authService.loginUser(email, password, rememberMe);
  
  // Set refresh token in httpOnly cookie
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
  res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, { ...COOKIE_OPTIONS, maxAge });

  sendSuccess(res, { user: result.user, accessToken: result.accessToken }, 'Login successful');
});

export const sendLoginOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) { sendError(res, 'Email is required', 400); return; }
  const result = await authService.sendLoginOTP(email);
  sendSuccess(res, result, 'OTP sent successfully');
});

export const loginWithOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp, rememberMe } = req.body;
  if (!email || !otp) { sendError(res, 'Email and OTP are required', 400); return; }

  const result = await authService.loginWithOTP(email, otp, rememberMe);

  // Set refresh token in httpOnly cookie
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
  res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, { ...COOKIE_OPTIONS, maxAge });

  sendSuccess(res, { user: result.user, accessToken: result.accessToken }, 'Login successful');
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_TOKEN_COOKIE] || req.body.refreshToken;
  if (!token) { sendError(res, 'Refresh token required', 401); return; }

  const result = await authService.refreshTokens(token);
  res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });
  sendSuccess(res, { accessToken: result.accessToken }, 'Token refreshed');
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user) {
    await authService.logoutUser(req.user.id);
  }
  res.clearCookie(REFRESH_TOKEN_COOKIE, COOKIE_OPTIONS);
  sendSuccess(res, null, 'Logged out successfully');
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) { sendError(res, 'Email is required', 400); return; }
  const result = await authService.forgotPassword(email);
  sendSuccess(res, result, result.message);
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!token || !password) { sendError(res, 'Token and password are required', 400); return; }
  const result = await authService.resetPassword(token, password);
  sendSuccess(res, null, result.message);
});

export const setPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { password } = req.body;
  if (!password) { sendError(res, 'Password is required', 400); return; }
  const result = await authService.setPassword(req.user!.id, password);
  sendSuccess(res, result, result.message);
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await authService.getMe(req.user!.id);
  sendSuccess(res, { user }, 'User fetched');
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { credential, name: fallbackName, email: fallbackEmail } = req.body;

  let email: string;
  let name: string;

  if (credential) {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email || !payload.name) {
        sendError(res, 'Invalid Google token payload', 400);
        return;
      }
      email = payload.email;
      name = payload.name;
    } catch (err: any) {
      console.error('Google token verification failed:', err);
      sendError(res, `Google verification failed: ${err.message}`, 400);
      return;
    }
  } else {
    email = fallbackEmail;
    name = fallbackName;
  }

  if (!name || !email) {
    sendError(res, 'Name and email are required for Google Login', 400);
    return;
  }

  const result = await authService.googleLoginUser({ name, email });
  
  // Set refresh token in httpOnly cookie
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, { ...COOKIE_OPTIONS, maxAge });

  sendSuccess(res, { user: result.user, accessToken: result.accessToken }, 'Google Login successful');
});

export const facebookLogin = asyncHandler(async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    sendError(res, 'Name and email are required for Facebook Login', 400);
    return;
  }

  const result = await authService.facebookLoginUser({ name, email });
  
  // Set refresh token in httpOnly cookie
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, { ...COOKIE_OPTIONS, maxAge });

  sendSuccess(res, { user: result.user, accessToken: result.accessToken }, 'Facebook Login successful');
});
